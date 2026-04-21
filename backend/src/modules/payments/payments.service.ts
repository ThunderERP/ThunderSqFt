// src/modules/payments/payments.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { InvoiceStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      // Lock and fetch invoice
      const rows = await tx.$queryRaw<
        { id: number; total_amount: string; paid_amount: string; status: string }[]
      >`
        SELECT id, total_amount, paid_amount, status
        FROM invoices WHERE id = ${dto.invoiceId}
        FOR UPDATE
      `;

      if (!rows.length) throw new NotFoundException(`Invoice #${dto.invoiceId} not found`);

      const invoice = rows[0];

      // SRS 4.3: Cannot pay a PAID or FAILED invoice
      if (invoice.status === InvoiceStatus.PAID) {
        throw new UnprocessableEntityException('Invoice is already fully paid');
      }
      if (invoice.status === InvoiceStatus.FAILED) {
        throw new UnprocessableEntityException('Invoice is in FAILED state');
      }

      const totalAmount = new Decimal(invoice.total_amount);
      const alreadyPaid = new Decimal(invoice.paid_amount);
      const pending = totalAmount.sub(alreadyPaid);
      const paymentAmt = new Decimal(dto.amount);

      // SRS 4.3: Payment cannot exceed pending amount
      if (paymentAmt.gt(pending)) {
        throw new BadRequestException(
          `Payment amount (${paymentAmt}) exceeds pending balance (${pending})`,
        );
      }

      // Record payment
      const payment = await tx.payment.create({
        data: {
          invoiceId: dto.invoiceId,
          amount: paymentAmt,
          paymentMethod: dto.paymentMethod,
          referenceId: dto.referenceId,
          notes: dto.notes,
          createdBy: userId,
        },
      });

      // Update invoice paid_amount and status
      const newPaid = alreadyPaid.add(paymentAmt);
      let newStatus: InvoiceStatus;
      if (newPaid.gte(totalAmount)) {
        newStatus = InvoiceStatus.PAID;
      } else {
        newStatus = InvoiceStatus.PARTIAL;
      }

      await tx.invoice.update({
        where: { id: dto.invoiceId },
        data: { paidAmount: newPaid, status: newStatus },
      });

      // Write ledger entry (CREDIT to Accounts Receivable)
      await tx.transaction.create({
        data: {
          paymentId: payment.id,
          type: 'CREDIT',
          amount: paymentAmt,
          accountCode: 'ACCOUNTS_RECEIVABLE',
          status: 'POSTED',
          createdBy: userId,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          userId,
          action: 'PAYMENT_RECORDED',
          entityType: 'Invoice',
          entityId: dto.invoiceId,
          newValue: {
            paymentId: payment.id,
            amount: dto.amount,
            method: dto.paymentMethod,
            newStatus,
          },
        },
      });

      return {
        payment,
        invoiceStatus: newStatus,
        totalPaid: newPaid,
        remainingBalance: totalAmount.sub(newPaid),
      };
    });
  }

  async findAll(dto: PaginationDto, invoiceId?: number) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const where = { ...(invoiceId && { invoiceId }) };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          invoice: {
            select: { id: true, totalAmount: true, status: true, orderId: true },
          },
          transaction: true,
        },
      }),
      this.prisma.payment.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOne(id: number) {
    const p = await this.prisma.payment.findUnique({
      where: { id },
      include: { invoice: true, transaction: true },
    });
    if (!p) throw new NotFoundException(`Payment #${id} not found`);
    return p;
  }
}
