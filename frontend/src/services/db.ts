// Global in-memory database for Thunder ERP mock services

export const delay = (ms: number = 150) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for currency formatting
export function formatCurrency(value: number) {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)} L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

export interface Lead {
  id: number;
  name: string;
  mobile: string;
  email: string;
  city: string;
  source: string;
  propertyType: string;
  budget: string;
  locationPreference: string;
  assignedExecutiveId: string;
  status: string;
  loadScore: number;
  LastFollowUpAt: string | null;
  nextFollowUpAt: string | null;
  callNotes: { id: string; note: string; timestamp: string; author: string }[];
  createdAt: string;
}

export interface SiteVisit {
  id: number;
  leadId: number;
  customerName: string;
  project: string;
  executiveId: string;
  visitDate: string;
  timeSlot: string;
  feedback: string;
  status: 'Scheduled' | 'Completed' | 'No Show';
}

export interface Booking {
  id: number;
  customerName: string;
  leadId: number;
  project: string;
  unitNo: string;
  bookingAmount: number;
  bookingDate: string;
  agreementStatus: 'Signed' | 'Pending' | 'Registered';
}

export interface LoanFile {
  id: number;
  customerName: string;
  mobile: string;
  project: string;
  loanAmount: number;
  bank: string;
  bankerName: string;
  salesExecutiveId: string;
  loanCoordinatorId: string;
  stage: 'PD Pending' | 'Doc Pending' | 'Login Pending' | 'Credit Query' | 'Sanctioned' | 'Approved' | 'Registered' | 'Disbursed';
  documents: Record<string, boolean>; // e.g. { pan: true, aadhaar: false, incomeTax: true, bankStatement: false, salarySlip: true, itr: false, propertyDocs: false }
  disbursedAt: string | null;
}

export interface Task {
  id: number;
  title: string;
  assignedTo: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  notes: string;
  resolutionRemark?: string;
}

export interface Employee {
  id: string;
  name: string;
  initials: string;
  role: 'ceo' | 'manager' | 'leader' | 'sales' | 'banking' | 'admin';
  department: string;
  branchId: string;
  joiningDate: string;
  performanceRating: number; // 1-5
  incentiveEarned: number;
}

export interface AttendanceRecord {
  id: number;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Late' | 'Absent';
}

export interface LeaveRequest {
  id: number;
  employeeId: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Branch {
  id: string;
  name: string;
  leads: number;
  visits: number;
  bookings: number;
  bookingValue: number;
  conversionRate: number;
}

export interface AutomationRule {
  id: number;
  key: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  schedule: string;
  channel: string;
  via: string;
  endpoint: string;
  lastRunAt?: string;
  lastStatus?: string;
}

// ─── SEED DATA ───

export const employeesDb: Employee[] = [
  { id: 'emp-1', name: 'Gautam Singhania', initials: 'GS', role: 'ceo', department: 'Executive', branchId: 'Mumbai', joiningDate: '2020-01-01', performanceRating: 5, incentiveEarned: 0 },
  { id: 'emp-2', name: 'Rohan Kapoor', initials: 'RK', role: 'manager', department: 'Management', branchId: 'Mumbai', joiningDate: '2021-06-15', performanceRating: 4.5, incentiveEarned: 150000 },
  { id: 'emp-3', name: 'Priya Mehta', initials: 'PM', role: 'leader', department: 'Sales CRM', branchId: 'Mumbai', joiningDate: '2022-03-10', performanceRating: 4, incentiveEarned: 85000 },
  { id: 'emp-4', name: 'Rahul Sharma', initials: 'RS', role: 'sales', department: 'Sales CRM', branchId: 'Mumbai', joiningDate: '2023-01-15', performanceRating: 4.8, incentiveEarned: 120000 },
  { id: 'emp-5', name: 'Amit Verma', initials: 'AV', role: 'sales', department: 'Sales CRM', branchId: 'Delhi', joiningDate: '2023-05-10', performanceRating: 3.8, incentiveEarned: 45000 },
  { id: 'emp-6', name: 'Sneha Kapoor', initials: 'SK', role: 'banking', department: 'Banking CRM', branchId: 'Mumbai', joiningDate: '2022-11-20', performanceRating: 4.2, incentiveEarned: 95000 },
  { id: 'emp-7', name: 'Anita Desai', initials: 'AD', role: 'admin', department: 'Operations', branchId: 'Mumbai', joiningDate: '2020-05-01', performanceRating: 4, incentiveEarned: 0 },
  { id: 'emp-8', name: 'Rohan Gupta', initials: 'RG', role: 'sales', department: 'Sales CRM', branchId: 'Delhi', joiningDate: '2023-08-01', performanceRating: 4.2, incentiveEarned: 60000 },
  { id: 'emp-9', name: 'Nisha Patel', initials: 'NP', role: 'sales', department: 'Sales CRM', branchId: 'Gurugram', joiningDate: '2023-02-15', performanceRating: 4.6, incentiveEarned: 110000 },
  { id: 'emp-10', name: 'Kavya Joshi', initials: 'KJ', role: 'sales', department: 'Sales CRM', branchId: 'Dubai', joiningDate: '2022-09-01', performanceRating: 4.9, incentiveEarned: 180000 },
];

export const leadsDb: Lead[] = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    mobile: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    city: 'Mumbai',
    source: 'Portal',
    propertyType: 'Apartment',
    budget: '₹65 L',
    locationPreference: 'Andheri West',
    assignedExecutiveId: 'Rahul Sharma',
    status: 'Contacted',
    loadScore: 82,
    LastFollowUpAt: '2026-06-18',
    nextFollowUpAt: '2026-06-18', // Overdue
    callNotes: [
      { id: 'n-1', note: 'Interested in 2BHK. Asked about possession timelines.', timestamp: '2026-06-18T10:00:00Z', author: 'Rahul Sharma' }
    ],
    createdAt: '2026-06-12'
  },
  {
    id: 2,
    name: 'Sunita Verma',
    mobile: '+91 87654 32109',
    email: 'sunita.v@gmail.com',
    city: 'Pune',
    source: 'Facebook',
    propertyType: 'Villa',
    budget: '₹1.8 Cr',
    locationPreference: 'Koregaon Park',
    assignedExecutiveId: 'Priya Mehta',
    status: 'Site Visit Fixed',
    loadScore: 95,
    LastFollowUpAt: '2026-06-17',
    nextFollowUpAt: '2026-06-20', // Due
    callNotes: [
      { id: 'n-2', note: 'Site visit fixed for Tower B show flat.', timestamp: '2026-06-17T11:30:00Z', author: 'Priya Mehta' }
    ],
    createdAt: '2026-06-10'
  },
  {
    id: 3,
    name: 'Arun Nair',
    mobile: '+91 76543 21098',
    email: 'arun.nair@hotmail.com',
    city: 'Bangalore',
    source: 'Google',
    propertyType: 'Apartment',
    budget: '₹1.2 Cr',
    locationPreference: 'Whitefield',
    assignedExecutiveId: 'Amit Verma',
    status: 'Negotiation',
    loadScore: 78,
    LastFollowUpAt: '2026-06-16',
    nextFollowUpAt: '2026-06-25',
    callNotes: [
      { id: 'n-3', note: 'Discussing discount on booking amount.', timestamp: '2026-06-16T15:00:00Z', author: 'Amit Verma' }
    ],
    createdAt: '2026-06-08'
  },
  {
    id: 4,
    name: 'Meera Shah',
    mobile: '+91 65432 10987',
    email: 'meerashah@yahoo.com',
    city: 'Ahmedabad',
    source: 'Reference',
    propertyType: 'Apartment',
    budget: '₹55 L',
    locationPreference: 'Satellite',
    assignedExecutiveId: 'Rahul Sharma',
    status: 'Follow-up',
    loadScore: 68,
    LastFollowUpAt: '2026-06-18',
    nextFollowUpAt: '2026-06-19', // Due today
    callNotes: [
      { id: 'n-4', note: 'Wants a call back on Friday evening.', timestamp: '2026-06-18T16:00:00Z', author: 'Rahul Sharma' }
    ],
    createdAt: '2026-06-15'
  },
  {
    id: 5,
    name: 'Karan Bose',
    mobile: '+91 54321 09876',
    email: 'karan.bose@work.com',
    city: 'Noida',
    source: 'Walk-in',
    propertyType: 'Apartment',
    budget: '₹90 L',
    locationPreference: 'Sector 62',
    assignedExecutiveId: 'Rahul Sharma',
    status: 'Contacted',
    loadScore: 72,
    LastFollowUpAt: '2026-06-18',
    nextFollowUpAt: '2026-06-21',
    callNotes: [
      { id: 'n-5', note: 'Shared project leaflets and price lists.', timestamp: '2026-06-18T12:00:00Z', author: 'Rahul Sharma' }
    ],
    createdAt: '2026-06-18'
  },
  {
    id: 6,
    name: 'Divya Pillai',
    mobile: '+91 43210 98765',
    email: 'divya.p@techcorp.com',
    city: 'Hyderabad',
    source: 'Google',
    propertyType: 'Apartment',
    budget: '₹70 L',
    locationPreference: 'Gachibowli',
    assignedExecutiveId: 'Rahul Sharma',
    status: 'Booking',
    loadScore: 90,
    LastFollowUpAt: '2026-06-15',
    nextFollowUpAt: null,
    callNotes: [
      { id: 'n-6', note: 'Token money received. Registration pending.', timestamp: '2026-06-15T14:00:00Z', author: 'Rahul Sharma' }
    ],
    createdAt: '2026-06-05'
  },
  {
    id: 7,
    name: 'Nikhil Jain',
    mobile: '+91 32109 87654',
    email: 'nikhil.j@gmail.com',
    city: 'Mumbai',
    source: 'Portal',
    propertyType: 'Penthouse',
    budget: '₹1.5 Cr',
    locationPreference: 'Bandra West',
    assignedExecutiveId: 'Priya Mehta',
    status: 'Site Visit Done',
    loadScore: 88,
    LastFollowUpAt: '2026-06-16',
    nextFollowUpAt: '2026-06-24',
    callNotes: [
      { id: 'n-7', note: 'Loved the terrace view. Reviewing bank loan limits.', timestamp: '2026-06-16T11:00:00Z', author: 'Priya Mehta' }
    ],
    createdAt: '2026-06-05'
  },
  {
    id: 8,
    name: 'Pooja Tiwari',
    mobile: '+91 21098 76543',
    email: 'pooja.tiwari@outlook.com',
    city: 'Delhi',
    source: 'Facebook',
    propertyType: 'Apartment',
    budget: '₹45 L',
    locationPreference: 'Dwarka',
    assignedExecutiveId: 'Amit Verma',
    status: 'Lost',
    loadScore: 40,
    LastFollowUpAt: '2026-06-12',
    nextFollowUpAt: null,
    callNotes: [
      { id: 'n-8', note: 'Lost to competitor due to cheaper payment schemes.', timestamp: '2026-06-12T16:00:00Z', author: 'Amit Verma' }
    ],
    createdAt: '2026-06-01'
  },
  {
    id: 9,
    name: 'Sameer Khan',
    mobile: '+91 10987 65432',
    email: 'sameer.k@business.in',
    city: 'Gurugram',
    source: 'Reference',
    propertyType: 'Apartment',
    budget: '₹60 L',
    locationPreference: 'Golf Course Road',
    assignedExecutiveId: 'Nisha Patel',
    status: 'Follow-up',
    loadScore: 65,
    LastFollowUpAt: '2026-06-13',
    nextFollowUpAt: '2026-06-15', // Overdue
    callNotes: [
      { id: 'n-9', note: 'Needs another week to arrange funds.', timestamp: '2026-06-13T10:00:00Z', author: 'Nisha Patel' }
    ],
    createdAt: '2026-06-05'
  },
  {
    id: 10,
    name: 'Anita Reddy',
    mobile: '+91 98761 23456',
    email: 'anita.reddy@corp.com',
    city: 'Dubai',
    source: 'Google',
    propertyType: 'Penthouse',
    budget: '₹1.8 Cr',
    locationPreference: 'Dubai Marina',
    assignedExecutiveId: 'Kavya Joshi',
    status: 'Interested',
    loadScore: 89,
    LastFollowUpAt: '2026-06-18',
    nextFollowUpAt: '2026-06-28',
    callNotes: [
      { id: 'n-10', note: 'Interested in luxury waterfront properties.', timestamp: '2026-06-18T14:30:00Z', author: 'Kavya Joshi' }
    ],
    createdAt: '2026-06-16'
  }
];

export const siteVisitsDb: SiteVisit[] = [
  { id: 1, leadId: 1, customerName: 'Rajesh Kumar', project: 'Prestige Heights', executiveId: 'Rahul Sharma', visitDate: '2026-06-17', timeSlot: '11:00 AM - 12:30 PM', feedback: 'Liked the unit, wants higher floor.', status: 'Completed' },
  { id: 2, leadId: 2, customerName: 'Sunita Verma', project: 'Prestige Heights', executiveId: 'Priya Mehta', visitDate: '2026-06-20', timeSlot: '03:00 PM - 04:30 PM', feedback: 'Show flat visit scheduled.', status: 'Scheduled' },
  { id: 3, leadId: 4, customerName: 'Meera Shah', project: 'Prestige Heights', executiveId: 'Rahul Sharma', visitDate: '2026-06-18', timeSlot: '10:00 AM - 11:30 AM', feedback: 'Customer did not show up.', status: 'No Show' },
  { id: 4, leadId: 7, customerName: 'Nikhil Jain', project: 'Skyline Premium', executiveId: 'Priya Mehta', visitDate: '2026-06-16', timeSlot: '04:00 PM - 05:30 PM', feedback: 'Impressed by amenities and location.', status: 'Completed' }
];

export const bookingsDb: Booking[] = [
  { id: 1, customerName: 'Divya Pillai', leadId: 6, project: 'Skyline Premium', unitNo: '1204', bookingAmount: 150000, bookingDate: '2026-06-15', agreementStatus: 'Pending' },
  { id: 2, customerName: 'Rajesh Kumar', leadId: 1, project: 'Prestige Heights', unitNo: '804', bookingAmount: 200000, bookingDate: '2026-06-19', agreementStatus: 'Signed' }
];

export const loanFilesDb: LoanFile[] = [
  {
    id: 1,
    customerName: 'Rajesh Kumar',
    mobile: '+91 98765 43210',
    project: 'Prestige Heights',
    loanAmount: 5000000,
    bank: 'HDFC Bank',
    bankerName: 'Vikram Singh',
    salesExecutiveId: 'Rahul Sharma',
    loanCoordinatorId: 'Sneha Kapoor',
    stage: 'PD Pending',
    documents: { pan: true, aadhaar: true, incomeTax: false, bankStatement: true, salarySlip: true, ITR: false, propertyDocs: false },
    disbursedAt: null
  },
  {
    id: 2,
    customerName: 'Sunita Verma',
    mobile: '+91 87654 32109',
    project: 'Prestige Heights',
    loanAmount: 12000000,
    bank: 'SBI Bank',
    bankerName: 'Sanjay Dutt',
    salesExecutiveId: 'Priya Mehta',
    loanCoordinatorId: 'Sneha Kapoor',
    stage: 'Sanctioned',
    documents: { pan: true, aadhaar: true, incomeTax: true, bankStatement: true, salarySlip: true, ITR: true, propertyDocs: true },
    disbursedAt: null
  },
  {
    id: 3,
    customerName: 'Arun Nair',
    mobile: '+91 76543 21098',
    project: 'Skyline Premium',
    loanAmount: 8500000,
    bank: 'ICICI Bank',
    bankerName: 'Ramesh Sen',
    salesExecutiveId: 'Amit Verma',
    loanCoordinatorId: 'Sneha Kapoor',
    stage: 'Disbursed',
    documents: { pan: true, aadhaar: true, incomeTax: true, bankStatement: true, salarySlip: true, ITR: true, propertyDocs: true },
    disbursedAt: '2026-06-18'
  }
];

export const tasksDb: Task[] = [
  { id: 1, title: 'Follow up with Rajesh Kumar', assignedTo: 'Rahul Sharma', dueDate: '2026-06-18', priority: 'High', status: 'Pending', notes: 'Call regarding Higher Floor units availability and price lists.' },
  { id: 2, title: 'Check Sunita Verma loan status', assignedTo: 'Sneha Kapoor', dueDate: '2026-06-21', priority: 'Medium', status: 'In Progress', notes: 'Verify if HDFC Bank has sent the loan agreement draft.' },
  { id: 3, title: 'Collect Site Visit Feedback - Skyline', assignedTo: 'Priya Mehta', dueDate: '2026-06-16', priority: 'Low', status: 'Completed', notes: 'Collect feedback from Nikhil Jain regarding Skyline visit.', resolutionRemark: 'Liked the property amenities and pricing.' }
];

export const attendanceDb: AttendanceRecord[] = [
  { id: 1, employeeId: 'emp-4', date: '2026-06-21', checkIn: '08:55 AM', checkOut: '--', status: 'Present' },
  { id: 2, employeeId: 'emp-3', date: '2026-06-21', checkIn: '09:40 AM', checkOut: '--', status: 'Late' },
  { id: 3, employeeId: 'emp-5', date: '2026-06-21', checkIn: '--', checkOut: '--', status: 'Absent' },
  { id: 4, employeeId: 'emp-6', date: '2026-06-21', checkIn: '09:05 AM', checkOut: '--', status: 'Present' }
];

export const leaveRequestsDb: LeaveRequest[] = [
  { id: 1, employeeId: 'emp-4', leaveType: 'Sick Leave', fromDate: '2026-06-23', toDate: '2026-06-24', days: 2, status: 'Pending' },
  { id: 2, employeeId: 'emp-5', leaveType: 'Casual Leave', fromDate: '2026-06-10', toDate: '2026-06-12', days: 3, status: 'Approved' },
  { id: 3, employeeId: 'emp-6', leaveType: 'Privilege Leave', fromDate: '2026-06-01', toDate: '2026-06-05', days: 5, status: 'Rejected' }
];

export const branchesDb: Branch[] = [
  { id: 'Mumbai', name: 'Mumbai', leads: 450, visits: 120, bookings: 35, bookingValue: 48000000, conversionRate: 7.7 },
  { id: 'Pune', name: 'Pune', leads: 280, visits: 78, bookings: 18, bookingValue: 24000000, conversionRate: 6.4 },
  { id: 'Delhi', name: 'Delhi', leads: 320, visits: 90, bookings: 22, bookingValue: 29000000, conversionRate: 6.8 },
  { id: 'Noida', name: 'Noida', leads: 190, visits: 45, bookings: 10, bookingValue: 12000000, conversionRate: 5.2 },
  { id: 'Gurugram', name: 'Gurugram', leads: 240, visits: 60, bookings: 14, bookingValue: 18000000, conversionRate: 5.8 },
  { id: 'Bangalore', name: 'Bangalore', leads: 380, visits: 105, bookings: 28, bookingValue: 39000000, conversionRate: 7.3 },
  { id: 'Hyderabad', name: 'Hyderabad', leads: 290, visits: 82, bookings: 20, bookingValue: 26000000, conversionRate: 6.9 },
  { id: 'Ahmedabad', name: 'Ahmedabad', leads: 150, visits: 38, bookings: 8, bookingValue: 9000000, conversionRate: 5.3 },
  { id: 'Lucknow', name: 'Lucknow', leads: 110, visits: 28, bookings: 5, bookingValue: 5000000, conversionRate: 4.5 },
  { id: 'Dubai', name: 'Dubai', leads: 95, visits: 24, bookings: 12, bookingValue: 95000000, conversionRate: 12.6 },
];

export const automationRulesDb: AutomationRule[] = [
  {
    id: 1, key: 'daily_reminder',
    name: 'Daily Reminders',
    description: 'Sends each agent their follow-up list every morning at 9 AM via WhatsApp.',
    icon: '⏰', color: 'var(--success)',
    isActive: true,
    schedule: 'Daily 9:00 AM', channel: 'WhatsApp', via: 'Zapier Schedule',
    endpoint: '/api/automation/daily-reminders',
    lastRunAt: new Date().toISOString(), lastStatus: 'success'
  },
  {
    id: 2, key: 'followup_alert',
    name: 'Auto Follow-Up Alerts',
    description: 'Instant WhatsApp notification when a new follow-up is assigned to an agent.',
    icon: '🔔', color: 'var(--accent)',
    isActive: true,
    schedule: 'Real-time', channel: 'WhatsApp', via: 'Zapier Webhook',
    endpoint: '/webhooks/follow-up-created',
    lastRunAt: new Date().toISOString(), lastStatus: 'success'
  },
  {
    id: 3, key: 'daily_report',
    name: 'Daily Report',
    description: 'End-of-day summary of leads, visits, bookings and revenue to manager/CEO.',
    icon: '📊', color: 'var(--gold)',
    isActive: true,
    schedule: 'Daily 7:00 PM', channel: 'WhatsApp', via: 'Zapier Schedule',
    endpoint: '/api/reports/daily-summary',
    lastRunAt: new Date().toISOString(), lastStatus: 'success'
  },
  {
    id: 4, key: 'monthly_report',
    name: 'Monthly Performance Report',
    description: 'Comprehensive monthly analytics with PDF link, sent to all branch managers on 1st.',
    icon: '📅', color: 'var(--purple)',
    isActive: true,
    schedule: '1st of Month', channel: 'WhatsApp', via: 'Zapier Schedule',
    endpoint: '/api/reports/monthly',
    lastRunAt: new Date().toISOString(), lastStatus: 'success'
  },
  {
    id: 5, key: 'missed_followup',
    name: 'Missed Follow-Up Alert',
    description: 'Alerts agent when a follow-up is overdue. Escalates to manager after 2 hours.',
    icon: '⚠️', color: 'var(--danger)',
    isActive: false,
    schedule: 'Every 30 min', channel: 'WhatsApp', via: 'Zapier Schedule',
    endpoint: '/api/followups/overdue',
    lastRunAt: new Date().toISOString(), lastStatus: 'skipped'
  },
  {
    id: 6, key: 'birthday',
    name: 'Birthday Reminders',
    description: 'Personalised birthday wishes to clients and employees automatically every morning.',
    icon: '🎂', color: 'var(--success)',
    isActive: true,
    schedule: 'Daily 9:00 AM', channel: 'WhatsApp', via: 'Zapier Schedule',
    endpoint: '/api/contacts/birthdays-today',
    lastRunAt: new Date().toISOString(), lastStatus: 'success'
  },
  {
    id: 7, key: 'anniversary',
    name: 'Anniversary Reminders',
    description: 'Warm anniversary wishes to clients — builds long-term relationship and retention.',
    icon: '💍', color: 'var(--gold)',
    isActive: true,
    schedule: 'Daily 9:00 AM', channel: 'WhatsApp', via: 'Zapier Schedule',
    endpoint: '/api/contacts/anniversaries-today',
    lastRunAt: new Date().toISOString(), lastStatus: 'success'
  }
];
