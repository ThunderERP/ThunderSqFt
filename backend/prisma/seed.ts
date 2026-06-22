// prisma/seed.ts
import { PrismaClient, Role, PaymentMethod, Department } from '@prisma/client';
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

  // ── Employees ─────────────────────────────────────────────────────────────
  const employeeDefs = [
    { name: 'Gautam Singhania', email: 'gautam@thundererp.com',   phone: '9876543210', department: Department.EXECUTIVE, basicSalary: 300000, allowances: 20000, deductions: 5000 },
    { name: 'Rohan Kapoor',     email: 'rohan@thundererp.com',    phone: '9876543211', department: Department.MANAGEMENT, basicSalary: 150000, allowances: 15000, deductions: 3000 },
    { name: 'Priya Mehta',      email: 'priya@thundererp.com',    phone: '9876543212', department: Department.SALES_CRM, basicSalary: 90000, allowances: 10000, deductions: 2000 },
    { name: 'Rahul Sharma',     email: 'rahul@thundererp.com',    phone: '9876543213', department: Department.SALES_CRM, basicSalary: 60000, allowances: 8000, deductions: 1500 },
    { name: 'Amit Verma',       email: 'amit@thundererp.com',     phone: '9876543214', department: Department.SALES_CRM, basicSalary: 55000, allowances: 7500, deductions: 1200 },
    { name: 'Sneha Kapoor',     email: 'sneha@thundererp.com',    phone: '9876543215', department: Department.BANKING_CRM, basicSalary: 65000, allowances: 9000, deductions: 1800 },
    { name: 'Anita Desai',      email: 'anita@thundererp.com',    phone: '9876543216', department: Department.OPERATIONS, basicSalary: 70000, allowances: 9500, deductions: 1900 },
    { name: 'Rohan Gupta',      email: 'rohan.g@thundererp.com',  phone: '9876543217', department: Department.SALES_CRM, basicSalary: 50000, allowances: 6000, deductions: 1000 },
    { name: 'Nisha Patel',      email: 'nisha@thundererp.com',    phone: '9876543218', department: Department.SALES_CRM, basicSalary: 55000, allowances: 7000, deductions: 1200 },
    { name: 'Kavya Joshi',      email: 'kavya@thundererp.com',    phone: '9876543219', department: Department.SALES_CRM, basicSalary: 60000, allowances: 8000, deductions: 1500 }
  ];

  const employees: any[] = [];
  for (const emp of employeeDefs) {
    let employee = await prisma.employee.findUnique({ where: { email: emp.email } });
    if (!employee) {
      const count = await prisma.employee.count();
      const employeeId = `EMP${String(count + 1).padStart(3, '0')}`;
      employee = await prisma.employee.create({
        data: {
          ...emp,
          employeeId,
          createdBy: adminId,
        }
      });
    }
    employees.push(employee);

    // Create Default Preferences
    await prisma.preference.upsert({
      where: { employeeId: employee.id },
      update: {},
      create: {
        employeeId: employee.id,
        emailAlerts: true,
        smsAlerts: false,
        whatsappAlerts: true,
        pushNotifications: true,
        dailySummary: true,
        leadAssignment: true,
        taskReminders: true,
      }
    });
  }
  console.log(`✅ ${employees.length} employees + preferences ready`);

  const findEmpIdByName = (name: string) => {
    const emp = employees.find(e => e.name === name);
    return emp ? emp.id : null;
  };

  // ── CRM Leads ─────────────────────────────────────────────────────────────
  const leadDefs = [
    { name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh.kumar@email.com', city: 'Mumbai', source: 'Portal', budget: '₹65 L', locationPreference: 'Andheri West', status: 'Contacted', assignedToName: 'Rahul Sharma', notes: 'Interested in 2BHK. Asked about possession timelines.' },
    { name: 'Sunita Verma', phone: '+91 87654 32109', email: 'sunita.v@gmail.com', city: 'Pune', source: 'Facebook', budget: '₹1.8 Cr', locationPreference: 'Koregaon Park', status: 'Site Visit Fixed', assignedToName: 'Priya Mehta', notes: 'Site visit fixed for Tower B show flat.' },
    { name: 'Arun Nair', phone: '+91 76543 21098', email: 'arun.nair@hotmail.com', city: 'Bangalore', source: 'Google', budget: '₹1.2 Cr', locationPreference: 'Whitefield', status: 'Negotiation', assignedToName: 'Amit Verma', notes: 'Discussing discount on booking amount.' },
    { name: 'Meera Shah', phone: '+91 65432 10987', email: 'meerashah@yahoo.com', city: 'Ahmedabad', source: 'Reference', budget: '₹55 L', locationPreference: 'Satellite', status: 'Follow-up', assignedToName: 'Rahul Sharma', notes: 'Wants a call back on Friday evening.' },
    { name: 'Karan Bose', phone: '+91 54321 09876', email: 'karan.bose@work.com', city: 'Noida', source: 'Walk-in', budget: '₹90 L', locationPreference: 'Sector 62', status: 'Contacted', assignedToName: 'Rahul Sharma', notes: 'Shared project leaflets and price lists.' },
    { name: 'Divya Pillai', phone: '+91 43210 98765', email: 'divya.p@techcorp.com', city: 'Hyderabad', source: 'Google', budget: '₹70 L', locationPreference: 'Gachibowli', status: 'Booking', assignedToName: 'Rahul Sharma', notes: 'Token money received. Registration pending.' },
    { name: 'Nikhil Jain', phone: '+91 32109 87654', email: 'nikhil.j@gmail.com', city: 'Mumbai', source: 'Portal', budget: '₹1.5 Cr', locationPreference: 'Bandra West', status: 'Site Visit Done', assignedToName: 'Priya Mehta', notes: 'Loved the terrace view. Reviewing bank loan limits.' },
    { name: 'Pooja Tiwari', phone: '+91 21098 76543', email: 'pooja.tiwari@outlook.com', city: 'Delhi', source: 'Facebook', budget: '₹45 L', locationPreference: 'Dwarka', status: 'Lost', assignedToName: 'Amit Verma', notes: 'Lost to competitor due to cheaper payment schemes.' },
    { name: 'Sameer Khan', phone: '+91 10987 65432', email: 'sameer.k@business.in', city: 'Gurugram', source: 'Reference', budget: '₹60 L', locationPreference: 'Golf Course Road', status: 'Follow-up', assignedToName: 'Nisha Patel', notes: 'Needs another week to arrange funds.' },
    { name: 'Anita Reddy', phone: '+91 98761 23456', email: 'anita.reddy@corp.com', city: 'Dubai', source: 'Google', budget: '₹1.8 Cr', locationPreference: 'Dubai Marina', status: 'Interested', assignedToName: 'Kavya Joshi', notes: 'Interested in luxury waterfront properties.' }
  ];

  const leads: any[] = [];
  for (const l of leadDefs) {
    let lead = await prisma.lead.findFirst({ where: { phone: l.phone } });
    if (!lead) {
      const assignedToId = findEmpIdByName(l.assignedToName);
      lead = await prisma.lead.create({
        data: {
          name: l.name,
          phone: l.phone,
          email: l.email,
          source: l.source,
          status: l.status,
          notes: l.notes,
          assignedTo: assignedToId,
          createdBy: adminId
        }
      });
    }
    leads.push(lead);
  }
  console.log(`✅ ${leads.length} CRM leads ready`);

  // Helper to ensure customer exists for bookings
  const ensureCustomer = async (name: string, phone: string, email: string) => {
    let customer = await prisma.customer.findUnique({ where: { phone } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name,
          phone,
          email,
          createdBy: adminId
        }
      });
    }
    return customer;
  };

  // ── Bookings ──────────────────────────────────────────────────────────────
  const bookingDefs = [
    { customerName: 'Divya Pillai', phone: '+91 43210 98765', email: 'divya.p@techcorp.com', leadPhone: '+91 43210 98765', project: 'Skyline Premium', unitNo: '1204', bookingAmount: 150000, agreementStatus: 'Pending', date: new Date('2026-06-15') },
    { customerName: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh.kumar@email.com', leadPhone: '+91 98765 43210', project: 'Prestige Heights', unitNo: '804', bookingAmount: 200000, agreementStatus: 'Signed', date: new Date('2026-06-19') }
  ];

  for (const b of bookingDefs) {
    const customer = await ensureCustomer(b.customerName, b.phone, b.email);
    const lead = leads.find(l => l.phone === b.leadPhone);
    const exists = await prisma.booking.findFirst({
      where: { customerId: customer.id, project: b.project, unitNo: b.unitNo }
    });
    if (!exists) {
      await prisma.booking.create({
        data: {
          customerId: customer.id,
          leadId: lead ? lead.id : null,
          project: b.project,
          unitNo: b.unitNo,
          bookingAmount: b.bookingAmount,
          agreementStatus: b.agreementStatus,
          bookingDate: b.date
        }
      });
    }
  }
  console.log('✅ 2 bookings ready');

  // ── Site Visits ───────────────────────────────────────────────────────────
  const siteVisitDefs = [
    { leadPhone: '+91 98765 43210', project: 'Prestige Heights', visitDate: new Date('2026-06-17T11:00:00Z'), timeSlot: '11:00 AM - 12:30 PM', feedback: 'Liked the unit, wants higher floor.', status: 'Completed' },
    { leadPhone: '+91 87654 32109', project: 'Prestige Heights', visitDate: new Date('2026-06-20T15:00:00Z'), timeSlot: '03:00 PM - 04:30 PM', feedback: 'Show flat visit scheduled.', status: 'Scheduled' },
    { leadPhone: '+91 65432 10987', project: 'Prestige Heights', visitDate: new Date('2026-06-18T10:00:00Z'), timeSlot: '10:00 AM - 11:30 AM', feedback: 'Customer did not show up.', status: 'No Show' },
    { leadPhone: '+91 32109 87654', project: 'Skyline Premium', visitDate: new Date('2026-06-16T16:00:00Z'), timeSlot: '04:00 PM - 05:30 PM', feedback: 'Impressed by amenities and location.', status: 'Completed' }
  ];

  for (const sv of siteVisitDefs) {
    const lead = leads.find(l => l.phone === sv.leadPhone);
    if (lead) {
      const exists = await prisma.siteVisit.findFirst({
        where: { leadId: lead.id, project: sv.project, visitDate: sv.visitDate }
      });
      if (!exists) {
        await prisma.siteVisit.create({
          data: {
            leadId: lead.id,
            project: sv.project,
            visitDate: sv.visitDate,
            timeSlot: sv.timeSlot,
            feedback: sv.feedback,
            status: sv.status
          }
        });
      }
    }
  }
  console.log('✅ 4 site visits ready');

  // ── Tasks ─────────────────────────────────────────────────────────────────
  const taskDefs = [
    { title: 'Follow up with Rajesh Kumar', assignedToName: 'Rahul Sharma', dueDate: new Date('2026-06-18'), priority: 'High', status: 'Pending', notes: 'Call regarding Higher Floor units availability and price lists.' },
    { title: 'Check Sunita Verma loan status', assignedToName: 'Sneha Kapoor', dueDate: new Date('2026-06-21'), priority: 'Medium', status: 'In Progress', notes: 'Verify if HDFC Bank has sent the loan agreement draft.' },
    { title: 'Collect Site Visit Feedback - Skyline', assignedToName: 'Priya Mehta', dueDate: new Date('2026-06-16'), priority: 'Low', status: 'Completed', notes: 'Collect feedback from Nikhil Jain regarding Skyline visit.', resolutionRemark: 'Liked the property amenities and pricing.' }
  ];

  for (const t of taskDefs) {
    const empId = findEmpIdByName(t.assignedToName);
    if (empId) {
      const exists = await prisma.task.findFirst({
        where: { title: t.title, assignedToId: empId }
      });
      if (!exists) {
        await prisma.task.create({
          data: {
            title: t.title,
            assignedToId: empId,
            dueDate: t.dueDate,
            priority: t.priority,
            status: t.status,
            notes: t.notes,
            resolutionRemark: t.resolutionRemark
          }
        });
      }
    }
  }
  console.log('✅ 3 tasks ready');

  // ── Loans ─────────────────────────────────────────────────────────────────
  const loanDefs = [
    {
      customerName: 'Rajesh Kumar',
      mobile: '+91 98765 43210',
      project: 'Prestige Heights',
      loanAmount: 5000000,
      bank: 'HDFC Bank',
      bankerName: 'Vikram Singh',
      salesExecutiveId: 'Rahul Sharma',
      loanCoordinatorName: 'Sneha Kapoor',
      stage: 'PD Pending',
      documents: { pan: true, aadhaar: true, incomeTax: false, bankStatement: true, salarySlip: true, ITR: false, propertyDocs: false },
      disbursedAt: null
    },
    {
      customerName: 'Sunita Verma',
      mobile: '+91 87654 32109',
      project: 'Prestige Heights',
      loanAmount: 12000000,
      bank: 'SBI Bank',
      bankerName: 'Sanjay Dutt',
      salesExecutiveId: 'Priya Mehta',
      loanCoordinatorName: 'Sneha Kapoor',
      stage: 'Sanctioned',
      documents: { pan: true, aadhaar: true, incomeTax: true, bankStatement: true, salarySlip: true, ITR: true, propertyDocs: true },
      disbursedAt: null
    },
    {
      customerName: 'Arun Nair',
      mobile: '+91 76543 21098',
      project: 'Skyline Premium',
      loanAmount: 8500000,
      bank: 'ICICI Bank',
      bankerName: 'Ramesh Sen',
      salesExecutiveId: 'Amit Verma',
      loanCoordinatorName: 'Sneha Kapoor',
      stage: 'Disbursed',
      documents: { pan: true, aadhaar: true, incomeTax: true, bankStatement: true, salarySlip: true, ITR: true, propertyDocs: true },
      disbursedAt: new Date('2026-06-18')
    }
  ];

  for (const l of loanDefs) {
    const exists = await prisma.loan.findFirst({
      where: { customerName: l.customerName, bank: l.bank, project: l.project }
    });
    if (!exists) {
      const coordinatorId = findEmpIdByName(l.loanCoordinatorName);
      await prisma.loan.create({
        data: {
          customerName: l.customerName,
          mobile: l.mobile,
          project: l.project,
          loanAmount: l.loanAmount,
          bank: l.bank,
          bankerName: l.bankerName,
          salesExecutiveId: l.salesExecutiveId,
          loanCoordinatorId: coordinatorId,
          stage: l.stage,
          documents: l.documents,
          disbursedAt: l.disbursedAt
        }
      });
    }
  }
  console.log('✅ 3 loan files ready');

  // ── Contacts ──────────────────────────────────────────────────────────────
  const contactDefs = [
    { name: 'Rajesh Kumar', email: 'rajesh@gmail.com', waNumber: '+919876543210', dateOfBirth: new Date(), anniversary: new Date(), waOptIn: true },
    { name: 'Sunita Verma', email: 'sunita@gmail.com', waNumber: '+918765432109', dateOfBirth: new Date(), anniversary: null, waOptIn: true },
    { name: 'Arun Nair', email: 'arun@gmail.com', waNumber: '+917654321098', dateOfBirth: null, anniversary: new Date(), waOptIn: true },
    { name: 'Meera Shah', email: 'meera@gmail.com', waNumber: '+916543210987', dateOfBirth: new Date(), anniversary: new Date(), waOptIn: false } // Opted out
  ];

  for (const c of contactDefs) {
    const exists = await prisma.contact.findFirst({ where: { waNumber: c.waNumber } });
    if (!exists) {
      await prisma.contact.create({ data: c });
    }
  }
  console.log('✅ seeded contacts');

  // ── Automation Rules ──────────────────────────────────────────────────────
  const ruleDefs = [
    { key: 'daily_reminder', name: 'Daily Reminders', description: 'Sends each agent their follow-up list every morning at 9 AM via WhatsApp.', isActive: true, schedule: 'Daily 9:00 AM', messageTemplate: 'Good morning {{agent_name}}!...' },
    { key: 'followup_alert', name: 'Auto Follow-Up Alerts', description: 'Instant WhatsApp notification when a new follow-up is assigned to an agent.', isActive: true, schedule: 'Real-time', messageTemplate: '🔔 New follow-up assigned!...' },
    { key: 'daily_report', name: 'Daily Report', description: 'End-of-day summary of leads, visits, bookings and revenue to manager/CEO.', isActive: true, schedule: 'Daily 7:00 PM', messageTemplate: '📊 Thunder ERP Daily Report...' },
    { key: 'monthly_report', name: 'Monthly Performance Report', description: 'Comprehensive monthly analytics with PDF link, sent to all branch managers on 1st.', isActive: true, schedule: '1st of Month', messageTemplate: 'Monthly Performance Report...' },
    { key: 'missed_followup', name: 'Missed Follow-Up Alert', description: 'Alerts agent when a follow-up is overdue. Escalates to manager after 2 hours.', isActive: true, schedule: 'Every 30 min', messageTemplate: 'Overdue follow-up alert...' },
    { key: 'birthday', name: 'Birthday Reminders', description: 'Personalised birthday wishes to clients and employees automatically every morning.', isActive: true, schedule: 'Daily 9:00 AM', messageTemplate: 'Happy Birthday {{name}}!...' },
    { key: 'anniversary', name: 'Anniversary Reminders', description: 'Warm anniversary wishes to clients — builds long-term relationship and retention.', isActive: true, schedule: 'Daily 9:00 AM', messageTemplate: 'Happy Anniversary {{name}}!...' }
  ];

  for (const r of ruleDefs) {
    await prisma.automationRule.upsert({
      where: { key: r.key },
      update: { name: r.name, description: r.description, schedule: r.schedule, messageTemplate: r.messageTemplate },
      create: r
    });
  }
  console.log('✅ seeded 7 automation rules');

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
