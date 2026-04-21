// prisma/seed.ts
import { PrismaClient, Role, PaymentMethod } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ThunderERP database...');

  // ── Users (one per role from SRS 2.2) ─────────────────────────────────────
  const password = await bcrypt.hash('Thunder@123', 12);

  const userDefs = [
    { name: 'Dev Admin',       email: 'admin@thundererp.com',      role: Role.DEVELOPER_ADMIN  },
    { name: 'Business Owner',  email: 'owner@thundererp.com',      role: Role.BUSINESS_OWNER   },
    { name: 'Sales Manager',   email: 'salesmgr@thundererp.com',   role: Role.SALES_MANAGER    },
    { name: 'Sales Staff',     email: 'salesstaff@thundererp.com', role: Role.SALES_STAFF      },
    { name: 'Inventory Mgr',   email: 'inventory@thundererp.com',  role: Role.INVENTORY_MANAGER},
    { name: 'Finance Manager', email: 'finance@thundererp.com',    role: Role.FINANCE_MANAGER  },
    { name: 'Accountant',      email: 'accountant@thundererp.com', role: Role.ACCOUNTANT       },
    { name: 'CRM Support',     email: 'crm@thundererp.com',        role: Role.CRM_SUPPORT      },
    { name: 'Refund Handler',  email: 'refund@thundererp.com',     role: Role.REFUND_HANDLER   },
  ];

  const users = await Promise.all(
    userDefs.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: { ...u, passwordHash: password },
      }),
    ),
  );
  const adminId = users[0].id;
  console.log(`✅ ${users.length} users ready`);

  // ── Suppliers ─────────────────────────────────────────────────────────────
  const supplierDefs = [
    { name: 'TechParts India Pvt Ltd',      email: 'supply@techparts.in',   phone: '9876500001', address: '14 Industrial Area, Pune' },
    { name: 'Global Electronics Wholesale', email: 'orders@globalelec.com', phone: '9876500002', address: '88 Electronics Hub, Bengaluru' },
  ];

  for (const s of supplierDefs) {
    const exists = await prisma.supplier.findFirst({ where: { name: s.name } });
    if (!exists) await prisma.supplier.create({ data: { ...s, createdBy: adminId } });
  }
  console.log('✅ 2 suppliers ready');

  // ── Products + Inventory ──────────────────────────────────────────────────
  const productDefs = [
    { name: 'Widget Pro X1',       category: 'Electronics', unit: 'pcs',  price: 499.99, gstPercentage: 18, discountPercentage: 5,  qty: 150 },
    { name: 'Heavy Duty Bolt M10', category: 'Hardware',    unit: 'kg',   price: 120.00, gstPercentage: 12, discountPercentage: 0,  qty: 500 },
    { name: 'LED Panel 12W',       category: 'Electronics', unit: 'pcs',  price: 349.50, gstPercentage: 18, discountPercentage: 10, qty: 80  },
    { name: 'Safety Gloves L',     category: 'Safety',      unit: 'pair', price: 85.00,  gstPercentage: 5,  discountPercentage: 0,  qty: 200 },
    { name: 'Copper Wire 2.5mm',   category: 'Electrical',  unit: 'mtr',  price: 45.00,  gstPercentage: 18, discountPercentage: 0,  qty: 1000},
    { name: 'PVC Conduit 20mm',    category: 'Electrical',  unit: 'mtr',  price: 28.50,  gstPercentage: 12, discountPercentage: 0,  qty: 600 },
    { name: 'Circuit Breaker 32A', category: 'Electronics', unit: 'pcs',  price: 875.00, gstPercentage: 18, discountPercentage: 5,  qty: 60  },
    { name: 'Steel Rod 12mm',      category: 'Hardware',    unit: 'kg',   price: 65.00,  gstPercentage: 18, discountPercentage: 0,  qty: 8   },
  ];

  for (const pd of productDefs) {
    const { qty, ...productData } = pd;
    let product = await prisma.product.findFirst({
      where: { name: pd.name, isActive: true },
    });
    if (!product) {
      product = await prisma.product.create({ data: { ...productData, createdBy: adminId } });
    }
    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: {},
      create: { productId: product.id, availableQty: qty, reservedQty: 0, reorderLevel: 20 },
    });
  }
  console.log(`✅ ${productDefs.length} products + inventory ready`);
  console.log('   ⚠️  Steel Rod 12mm is seeded below reorder level to demo low-stock alert');

  // ── Customers ─────────────────────────────────────────────────────────────
  const customerDefs = [
    { name: 'Arjun Constructions Ltd', phone: '9900000001', email: 'purchase@arjuncon.com',      address: 'Survey No. 45, Hinjewadi, Pune',    preferredPaymentMethod: PaymentMethod.BANK  },
    { name: 'Ravi Electricals',        phone: '9900000002', email: 'ravi@ravielectricals.in',    address: 'Shop 12, Nehru Market, Nagpur',      preferredPaymentMethod: PaymentMethod.UPI   },
    { name: 'Priya Hardware Mart',     phone: '9900000003', email: 'priya@phmart.com',            address: '3rd Floor, Trade Centre, Mumbai',    preferredPaymentMethod: PaymentMethod.CASH  },
  ];

  await Promise.all(
    customerDefs.map((c) =>
      prisma.customer.upsert({
        where: { phone: c.phone },
        update: {},
        create: { ...c, createdBy: adminId },
      }),
    ),
  );
  console.log(`✅ ${customerDefs.length} customers ready`);

  // ── Sample Lead ────────────────────────────────────────────────────────────
  const existingLead = await prisma.lead.findFirst({ where: { phone: '9811223344' } });
  if (!existingLead) {
    await prisma.lead.create({
      data: {
        name: 'Vikram Engineering',
        phone: '9811223344',
        email: 'vikram@veng.com',
        source: 'REFERRAL',
        status: 'NEW',
        notes: 'Interested in bulk electrical components',
        createdBy: adminId,
      },
    });
  }
  console.log('✅ Sample lead ready');
  
  // ── Employees ─────────────────────────────────────────────────────────────
  const employeeDefs = [
    { employeeId: 'EMP001', name: 'Alok Mishra',    department: 'ENGINEERING', basicSalary: 85000, allowances: 5000, deductions: 2000 },
    { employeeId: 'EMP002', name: 'Sneha Kapur',    department: 'MARKETING',   basicSalary: 65000, allowances: 3000, deductions: 1000 },
    { employeeId: 'EMP003', name: 'Rajesh Khanna',  department: 'SALES',       basicSalary: 45000, allowances: 15000, deductions: 1500 },
    { employeeId: 'EMP004', name: 'Neha Sharma',    department: 'HR',          basicSalary: 60000, allowances: 2000, deductions: 1200 },
    { employeeId: 'EMP005', name: 'Suresh Raina',   department: 'FINANCE',     basicSalary: 95000, allowances: 8000, deductions: 3500 },
    { employeeId: 'EMP006', name: 'Pooja Hegde',    department: 'MANAGEMENT',  basicSalary: 120000, allowances: 10000, deductions: 5000 },
  ];

  for (const emp of employeeDefs) {
    const { department, ...rest } = emp;
    await prisma.employee.upsert({
      where: { employeeId: emp.employeeId },
      update: {},
      create: { 
        ...rest, 
        department: department as any,
        createdBy: adminId 
      },
    });
  }
  console.log(`✅ ${employeeDefs.length} employees ready`);

  console.log('\n🎉 Seed complete! All accounts use password: Thunder@123\n');
  console.log('   admin@thundererp.com      → DEVELOPER_ADMIN');
  console.log('   owner@thundererp.com      → BUSINESS_OWNER');
  console.log('   salesmgr@thundererp.com   → SALES_MANAGER');
  console.log('   salesstaff@thundererp.com → SALES_STAFF');
  console.log('   inventory@thundererp.com  → INVENTORY_MANAGER');
  console.log('   finance@thundererp.com    → FINANCE_MANAGER');
  console.log('   accountant@thundererp.com → ACCOUNTANT');
  console.log('   crm@thundererp.com        → CRM_SUPPORT');
  console.log('   refund@thundererp.com     → REFUND_HANDLER');
  console.log('\n   Swagger UI → http://localhost:3000/api/docs');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
