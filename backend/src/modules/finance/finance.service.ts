// src/modules/finance/finance.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // ── Dashboard KPIs (real-time) ─────────────────────────────────────────────

  async getDashboardSummary() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todayRevenue,
      monthRevenue,
      pendingOrders,
      unpaidInvoices,
      lowStockCount,
      openLeads,
      openComplaints,
      pendingPurchases,
    ] = await this.prisma.$transaction([
      // Today's revenue from PAID payments
      this.prisma.payment.aggregate({
        where: { date: { gte: startOfDay } },
        _sum: { amount: true },
      }),
      // This month's revenue
      this.prisma.payment.aggregate({
        where: { date: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      // Pending orders count
      this.prisma.order.count({ where: { status: 'PENDING', isActive: true } }),
      // Unpaid invoices total
      this.prisma.invoice.aggregate({
        where: { status: { in: ['PENDING', 'PARTIAL'] }, isActive: true },
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
      // Low stock products
      this.prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) as count FROM inventory i
        JOIN products p ON p.id = i.product_id
        WHERE p.is_active = true AND i.available_qty <= i.reorder_level
      `,
      // Open leads
      this.prisma.lead.count({ where: { status: { in: ['NEW', 'CONTACTED', 'QUALIFIED'] }, isActive: true } }),
      // Open complaints
      this.prisma.complaint.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      // Pending purchases awaiting approval
      this.prisma.purchase.count({ where: { status: 'PENDING', isActive: true } }),
    ]);

    return {
      revenue: {
        today: todayRevenue._sum.amount ?? 0,
        thisMonth: monthRevenue._sum.amount ?? 0,
      },
      orders: { pending: pendingOrders },
      invoices: {
        unpaidCount: unpaidInvoices._count.id,
        unpaidTotal: unpaidInvoices._sum.totalAmount ?? 0,
      },
      inventory: { lowStockCount: Number(BigInt((lowStockCount[0] as { count: bigint }).count)) },
      crm: { openLeads, openComplaints },
      procurement: { pendingApproval: pendingPurchases },
    };
  }

  // ── Accounts Receivable (customer payments due) ────────────────────────────

  async getAccountsReceivable(fromDate?: string, toDate?: string) {
    const where = {
      status: { in: ['PENDING' as const, 'PARTIAL' as const] },
      isActive: true,
      ...(fromDate && { invoiceDate: { gte: new Date(fromDate) } }),
      ...(toDate && { invoiceDate: { lte: new Date(toDate) } }),
    };

    const invoices = await this.prisma.invoice.findMany({
      where,
      include: {
        order: {
          include: {
            customer: { select: { id: true, name: true, phone: true } },
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    const totalOutstanding = invoices.reduce((sum, inv) => {
      const pending = new Decimal(inv.totalAmount).sub(new Decimal(inv.paidAmount));
      return sum.add(pending);
    }, new Decimal(0));

    return {
      invoices: invoices.map((inv) => ({
        ...inv,
        outstandingAmount: new Decimal(inv.totalAmount).sub(new Decimal(inv.paidAmount)),
        overdue: inv.dueDate ? new Date() > inv.dueDate : false,
      })),
      summary: {
        totalInvoices: invoices.length,
        totalOutstanding,
      },
    };
  }

  // ── Accounts Payable (supplier purchases due) ──────────────────────────────

  async getAccountsPayable(fromDate?: string, toDate?: string) {
    const where = {
      status: { in: ['PENDING' as const, 'APPROVED' as const] },
      isActive: true,
      ...(fromDate && { purchaseDate: { gte: new Date(fromDate) } }),
      ...(toDate && { purchaseDate: { lte: new Date(toDate) } }),
    };

    const purchases = await this.prisma.purchase.findMany({
      where,
      include: {
        supplier: { select: { id: true, name: true, email: true } },
        _count: { select: { items: true } },
      },
      orderBy: { expectedDeliveryDate: 'asc' },
    });

    const totalPayable = purchases.reduce(
      (sum, p) => sum.add(new Decimal(p.totalAmount)),
      new Decimal(0),
    );

    return {
      purchases,
      summary: { totalPurchases: purchases.length, totalPayable },
    };
  }

  // ── Cash Flow Statement ────────────────────────────────────────────────────

  async getCashFlow(fromDate: string, toDate: string) {
    if (!fromDate || !toDate) {
      throw new BadRequestException('fromDate and toDate are required');
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const [inflows, outflows, transactionLedger] = await this.prisma.$transaction([
      // Inflows: payments received from customers
      this.prisma.payment.aggregate({
        where: { date: { gte: from, lte: to } },
        _sum: { amount: true },
        _count: { id: true },
      }),
      // Outflows: purchase orders total in period
      this.prisma.purchase.aggregate({
        where: {
          purchaseDate: { gte: from, lte: to },
          status: { in: ['RECEIVED', 'COMPLETED'] },
        },
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
      // Full transaction ledger
      this.prisma.transaction.findMany({
        where: { entryDate: { gte: from, lte: to } },
        include: {
          payment: {
            select: { amount: true, paymentMethod: true, date: true },
          },
        },
        orderBy: { entryDate: 'asc' },
      }),
    ]);

    const totalInflow = new Decimal(inflows._sum.amount ?? 0);
    const totalOutflow = new Decimal(outflows._sum.totalAmount ?? 0);
    const netCashFlow = totalInflow.sub(totalOutflow);

    return {
      period: { from: fromDate, to: toDate },
      inflows: {
        total: totalInflow,
        paymentCount: inflows._count.id,
        label: 'Customer payments received',
      },
      outflows: {
        total: totalOutflow,
        purchaseCount: outflows._count.id,
        label: 'Supplier purchases (received/completed)',
      },
      netCashFlow,
      position: netCashFlow.gte(0) ? 'POSITIVE' : 'NEGATIVE',
      ledger: transactionLedger,
    };
  }

  // ── Sales Revenue Report ───────────────────────────────────────────────────

  async getSalesReport(fromDate: string, toDate: string, groupBy: 'day' | 'month' = 'day') {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Use separate queries per groupBy to avoid unsafe SQL interpolation
    const salesByPeriod =
      groupBy === 'month'
        ? await this.prisma.$queryRaw<
            { period: Date; total_revenue: string; order_count: bigint }[]
          >`
            SELECT
              DATE_TRUNC('month', o.order_date) AS period,
              SUM(o.total_amount) AS total_revenue,
              COUNT(o.id) AS order_count
            FROM orders o
            WHERE o.order_date BETWEEN ${from} AND ${to}
              AND o.status NOT IN ('CANCELLED', 'RETURNED')
              AND o.is_active = true
            GROUP BY DATE_TRUNC('month', o.order_date)
            ORDER BY period ASC
          `
        : await this.prisma.$queryRaw<
            { period: Date; total_revenue: string; order_count: bigint }[]
          >`
            SELECT
              DATE_TRUNC('day', o.order_date) AS period,
              SUM(o.total_amount) AS total_revenue,
              COUNT(o.id) AS order_count
            FROM orders o
            WHERE o.order_date BETWEEN ${from} AND ${to}
              AND o.status NOT IN ('CANCELLED', 'RETURNED')
              AND o.is_active = true
            GROUP BY DATE_TRUNC('day', o.order_date)
            ORDER BY period ASC
          `;

    const topProducts = await this.prisma.$queryRaw<
      { product_id: number; product_name: string; total_qty: bigint; total_revenue: string }[]
    >`
      SELECT
        p.id AS product_id,
        p.name AS product_name,
        SUM(oi.quantity) AS total_qty,
        SUM(oi.line_total) AS total_revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.order_date BETWEEN ${from} AND ${to}
        AND o.status NOT IN ('CANCELLED', 'RETURNED')
        AND o.is_active = true
      GROUP BY p.id, p.name
      ORDER BY total_revenue DESC
      LIMIT 10
    `;

    const summary = await this.prisma.order.aggregate({
      where: {
        orderDate: { gte: from, lte: to },
        status: { notIn: ['CANCELLED', 'RETURNED'] },
        isActive: true,
      },
      _sum: { totalAmount: true },
      _count: { id: true },
      _avg: { totalAmount: true },
    });

    return {
      period: { from: fromDate, to: toDate, groupBy },
      summary: {
        totalRevenue: summary._sum.totalAmount ?? 0,
        totalOrders: summary._count.id,
        averageOrderValue: summary._avg.totalAmount ?? 0,
      },
      byPeriod: salesByPeriod.map((r) => ({
        period: r.period,
        revenue: r.total_revenue,
        orderCount: Number(r.order_count),
      })),
      topProducts: topProducts.map((r) => ({
        productId: r.product_id,
        name: r.product_name,
        totalQty: Number(r.total_qty),
        revenue: r.total_revenue,
      })),
    };
  }

  // ── Inventory Valuation ────────────────────────────────────────────────────

  async getInventoryValuation() {
    const items = await this.prisma.$queryRaw<
      {
        product_id: number;
        product_name: string;
        category: string;
        unit: string;
        price: string;
        available_qty: number;
        reserved_qty: number;
        total_value: string;
      }[]
    >`
      SELECT
        p.id AS product_id,
        p.name AS product_name,
        p.category,
        p.unit,
        p.price,
        i.available_qty,
        i.reserved_qty,
        (p.price * (i.available_qty + i.reserved_qty)) AS total_value
      FROM products p
      JOIN inventory i ON i.product_id = p.id
      WHERE p.is_active = true
      ORDER BY total_value DESC
    `;

    const totalValuation = items.reduce(
      (sum, item) => sum.add(new Decimal(item.total_value)),
      new Decimal(0),
    );

    return {
      items,
      summary: {
        totalProducts: items.length,
        totalValuation,
        averageValuePerProduct:
          items.length > 0 ? totalValuation.div(items.length) : new Decimal(0),
      },
    };
  }

  // ── Audit Transaction Logs (Use Case: Finance Manager) ────────────────────

  async getTransactionLedger(fromDate?: string, toDate?: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const where = {
      ...(fromDate && { entryDate: { gte: new Date(fromDate) } }),
      ...(toDate && { entryDate: { lte: new Date(toDate) } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { entryDate: 'desc' },
        include: {
          payment: {
            include: {
              invoice: {
                include: {
                  order: {
                    include: {
                      customer: { select: { id: true, name: true } },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    };
  }
}
