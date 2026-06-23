import { useState } from 'react'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import { Plus, X, Search, ShieldCheck, CreditCard, Clock, CheckCircle, MapPin, Calendar, User, Home } from 'lucide-react'
import DataTable from '../../shared/components/DataTable'
import StatusBadge from '../../shared/components/StatusBadge'
import StatCard from '../../shared/components/StatCard'
import DetailSlideOver from '../../shared/components/DetailSlideOver'

const mockBookings = [
  { id: '1', customer: 'Raghav Mishra', project: 'Worli Zenith', unit: 'B-1204', amount: '₹50L', date: '2026-06-19', stage: 'booking', payment: 'partial', executive: 'Anita Joshi', branch: 'Mumbai Central' },
  { id: '2', customer: 'Preet Kaur', project: 'Whitefield Residency', unit: 'A-303', amount: '₹130L', date: '2026-06-19', stage: 'agreement', payment: 'completed', executive: 'Rohit Verma', branch: 'Bangalore South' },
  { id: '3', customer: 'Anand Sharma', project: 'Powai Grandeur', unit: 'C-801', amount: '₹180L', date: '2026-06-20', stage: 'registration', payment: 'completed', executive: 'Rohit Verma', branch: 'Mumbai Central' },
  { id: '4', customer: 'Meena Joshi', project: 'Baner Heights', unit: 'D-502', amount: '₹75L', date: '2026-06-20', stage: 'completed', payment: 'completed', executive: 'Anita Joshi', branch: 'Pune HQ' },
  { id: '5', customer: 'Ravi Teja', project: 'Banjara Hills Oasis', unit: 'A-102', amount: '₹95L', date: '2026-06-18', stage: 'booking', payment: 'pending', executive: 'Deepak Rao', branch: 'Hyderabad East' },
  { id: '6', customer: 'Megha Shah', project: 'Andheri Skyline', unit: 'B-605', amount: '₹110L', date: '2026-06-17', stage: 'registration', payment: 'partial', executive: 'Rohit Verma', branch: 'Mumbai Central' },
  { id: '7', customer: 'Kartik Aryan', project: 'Worli Zenith', unit: 'C-201', amount: '₹85L', date: '2026-06-16', stage: 'agreement', payment: 'completed', executive: 'Anita Joshi', branch: 'Mumbai Central' },
  { id: '8', customer: 'Alia Bhatt', project: 'Powai Lake View', unit: 'A-904', amount: '₹120L', date: '2026-06-15', stage: 'completed', payment: 'completed', executive: 'Rohit Verma', branch: 'Mumbai Central' },
  { id: '9', customer: 'Ranbir Kapoor', project: 'Baner Elysium', unit: 'B-1102', amount: '₹90L', date: '2026-06-21', stage: 'booking', payment: 'partial', executive: 'Deepak Rao', branch: 'Pune HQ' },
  { id: '10', customer: 'Varun Dhawan', project: 'Noida Heights', unit: 'C-405', amount: '₹65L', date: '2026-06-14', stage: 'registration', payment: 'completed', executive: 'Anita Joshi', branch: 'Delhi NCR' },
  { id: '11', customer: 'Kriti Sanon', project: 'Whitefield Residency', unit: 'A-701', amount: '₹150L', date: '2026-06-13', stage: 'completed', payment: 'completed', executive: 'Rohit Verma', branch: 'Bangalore South' },
  { id: '12', customer: 'Sidharth Malhotra', project: 'Bandra Elegance', unit: 'A-1002', amount: '₹220L', date: '2026-06-22', stage: 'agreement', payment: 'partial', executive: 'Deepak Rao', branch: 'Mumbai Central' },
  { id: '13', customer: 'Kiara Advani', project: 'Juhu Tara', unit: 'B-403', amount: '₹190L', date: '2026-06-23', stage: 'booking', payment: 'pending', executive: 'Anita Joshi', branch: 'Mumbai Central' },
  { id: '14', customer: 'Vicky Kaushal', project: 'Andheri Skyline', unit: 'C-508', amount: '₹105L', date: '2026-06-24', stage: 'agreement', payment: 'completed', executive: 'Rohit Verma', branch: 'Mumbai Central' },
  { id: '15', customer: 'Sara Ali Khan', project: 'Powai Lake View', unit: 'D-202', amount: '₹98L', date: '2026-06-25', stage: 'registration', payment: 'completed', executive: 'Sanjay Gupta', branch: 'Mumbai Central' },
  { id: '16', customer: 'Janhvi Kapoor', project: 'Whitefield Residency', unit: 'B-809', amount: '₹115L', date: '2026-06-26', stage: 'completed', payment: 'completed', executive: 'Rohit Verma', branch: 'Bangalore South' },
  { id: '17', customer: 'Ishaan Khatter', project: 'Baner Elysium', unit: 'A-601', amount: '₹80L', date: '2026-06-27', stage: 'booking', payment: 'partial', executive: 'Deepak Rao', branch: 'Pune HQ' },
  { id: '18', customer: 'Ananya Panday', project: 'Noida Heights', unit: 'C-1201', amount: '₹70L', date: '2026-06-28', stage: 'agreement', payment: 'pending', executive: 'Anita Joshi', branch: 'Delhi NCR' },
]

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const avatarColors = [
  'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  'bg-pink-500/20 text-pink-400 border border-pink-500/30',
]

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

export default function Bookings() {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('All Stages')
  const [paymentFilter, setPaymentFilter] = useState('All Payments')

  let filteredBookings = mockBookings.filter(b => {
    const matchesSearch = b.customer.toLowerCase().includes(search.toLowerCase()) || b.project.toLowerCase().includes(search.toLowerCase()) || b.unit.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === 'All Stages' || b.stage.toLowerCase() === stageFilter.toLowerCase();
    const matchesPayment = paymentFilter === 'All Payments' || b.payment.toLowerCase() === paymentFilter.toLowerCase();
    return matchesSearch && matchesStage && matchesPayment;
  });

  const bookingStage = mockBookings.filter(b => b.stage === 'booking').length
  const agreementStage = mockBookings.filter(b => b.stage === 'agreement').length
  const registrationStage = mockBookings.filter(b => b.stage === 'registration').length
  const completedStage = mockBookings.filter(b => b.stage === 'completed').length

  const totalValueLakhs = mockBookings.reduce((sum, b) => sum + (parseInt(b.amount.replace(/[^0-9]/g, '')) || 0), 0)
  const totalValueCr = (totalValueLakhs / 100).toFixed(2)

  const bookingColumns = [
    {
      key: 'customer',
      label: 'Customer',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <span className={`avatar-circle text-[10px] font-bold ${getAvatarColor(item.customer)}`}>
            {getInitials(item.customer)}
          </span>
          <span className="font-bold text-[var(--ink)]">{item.customer}</span>
        </div>
      )
    },
    { 
      key: 'project', 
      label: 'Project',
      render: (item: any) => <span className="text-[var(--ink-soft)]">{item.project}</span>
    },
    { 
      key: 'unit', 
      label: 'Unit',
      render: (item: any) => <span className="text-[var(--ink-soft)] font-mono">{item.unit}</span>
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (item: any) => <span className="font-mono text-[var(--gold)] font-bold">{item.amount}</span>
    },
    {
      key: 'date',
      label: 'Booking Date',
      render: (item: any) => <span className="font-mono text-[var(--ink-soft)]">{item.date}</span>
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (item: any) => <StatusBadge status={item.stage} />
    },
    {
      key: 'payment',
      label: 'Payment',
      render: (item: any) => <StatusBadge status={item.payment} />
    },
    { 
      key: 'executive', 
      label: 'Executive',
      render: (item: any) => <span className="text-[var(--ink-soft)]">{item.executive}</span>
    },
    { 
      key: 'branch', 
      label: 'Branch',
      render: (item: any) => <span className="text-[var(--ink-soft)]">{item.branch}</span>
    }
  ]

  return (
    <PageTransition>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title font-display">Bookings</h1>
            <p className="page-subtitle">Manage and track property bookings pipeline</p>
          </div>
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="btn-primary flex items-center gap-2 self-start sm:self-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <Plus size={16} /> New Booking
          </button>
        </div>

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StaggerItem>
            <StatCard
              label="Booking"
              value={bookingStage}
              icon={<Clock size={16} />}
              valueColor="text-[var(--warning)]"
              subtitle="Initial token stage"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Agreement"
              value={agreementStage}
              icon={<CreditCard size={16} />}
              valueColor="text-[var(--accent)]"
              subtitle="Drafting agreements"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Registration"
              value={registrationStage}
              icon={<ShieldCheck size={16} />}
              valueColor="text-[var(--violet)]"
              subtitle="Property registration"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Completed"
              value={completedStage}
              icon={<CheckCircle size={16} />}
              valueColor="text-[var(--success)]"
              subtitle="Bookings finalized"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Total Value"
              value={`₹${totalValueCr} Cr`}
              icon={<span className="font-bold text-sm">₹</span>}
              valueColor="text-[var(--gold)]"
              subtitle="Cumulated deal values"
            />
          </StaggerItem>
        </StaggerContainer>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 p-4 card">
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" size={14} />
            <input 
              type="text" 
              placeholder="Search by customer, project, unit..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all placeholder-[var(--ink-muted)]" 
            />
          </div>

          <select 
            value={stageFilter} 
            onChange={(e) => setStageFilter(e.target.value)} 
            className="px-3 py-2 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all cursor-pointer font-semibold"
          >
            <option value="All Stages">All Stages</option>
            <option value="Booking">Booking</option>
            <option value="Agreement">Agreement</option>
            <option value="Registration">Registration</option>
            <option value="Completed">Completed</option>
          </select>

          <select 
            value={paymentFilter} 
            onChange={(e) => setPaymentFilter(e.target.value)} 
            className="px-3 py-2 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all cursor-pointer font-semibold"
          >
            <option value="All Payments">All Payments</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
            <option value="Completed">Completed</option>
          </select>

          {(stageFilter !== 'All Stages' || paymentFilter !== 'All Payments' || search) && (
            <button 
              onClick={() => { setStageFilter('All Stages'); setPaymentFilter('All Payments'); setSearch(''); }}
              className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <X size={12} /> Clear Filters
            </button>
          )}
          <span className="text-xs font-bold text-[var(--ink-muted)] ml-auto font-mono">{filteredBookings.length} bookings</span>
        </div>

        {/* Table */}
        <DataTable
          columns={bookingColumns}
          data={filteredBookings}
          searchPlaceholder="Filter bookings..."
          onRowClick={(booking: any) => setSelectedBooking(booking)}
        />

        {/* Booking Detail Slide-Over */}
        <DetailSlideOver
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={selectedBooking?.customer || ''}
          subtitle={`Booking #${selectedBooking?.id || ''}`}
          avatar={
            selectedBooking ? (
              <span className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold font-mono ${getAvatarColor(selectedBooking.customer)}`}>
                {getInitials(selectedBooking.customer)}
              </span>
            ) : undefined
          }
          statusBadge={
            selectedBooking ? (
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedBooking.stage} />
                <StatusBadge status={selectedBooking.payment} />
              </div>
            ) : undefined
          }
          fields={selectedBooking ? [
            { label: 'Customer Name', value: selectedBooking.customer },
            { label: 'Booking ID', value: (
              <span className="font-mono text-xs">#BK-{selectedBooking.id}</span>
            )},
            { label: 'Project', value: (
              <span className="flex items-center gap-1.5">
                <Home size={12} className="text-[var(--ink-muted)]" />
                {selectedBooking.project}
              </span>
            )},
            { label: 'Unit', value: (
              <span className="font-mono font-semibold">{selectedBooking.unit}</span>
            )},
            { label: 'Amount', value: (
              <span className="font-mono font-bold text-[var(--gold)]">
                {selectedBooking.amount}
              </span>
            )},
            { label: 'Booking Date', value: (
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar size={12} className="text-[var(--ink-muted)]" />
                {selectedBooking.date}
              </span>
            )},
            { label: 'Current Stage', value: <StatusBadge status={selectedBooking.stage} /> },
            { label: 'Payment Status', value: <StatusBadge status={selectedBooking.payment} /> },
            { label: 'Sales Executive', value: (
              <span className="flex items-center gap-1.5">
                <User size={12} className="text-[var(--ink-muted)]" />
                {selectedBooking.executive}
              </span>
            )},
            { label: 'Branch', value: (
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="text-[var(--ink-muted)]" />
                {selectedBooking.branch}
              </span>
            )},
          ] : []}
        />
      </div>

      {/* Slide-over Panel */}
      {isSlideOverOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end" onClick={() => setIsSlideOverOpen(false)}>
          <div className="w-full max-w-[450px] bg-[var(--bg-card)] border-l border-[var(--border-color)] h-full shadow-2xl flex flex-col text-left" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-bold text-[var(--ink)] font-display">New Booking</h2>
              <button 
                onClick={() => setIsSlideOverOpen(false)}
                className="p-1.5 rounded-full border border-[var(--border-color)] text-[var(--ink-soft)] hover:bg-[var(--bg-hover)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Customer Name *</label>
                <input type="text" placeholder="Full name" className="input-field" />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Project Name *</label>
                <input type="text" placeholder="Project" className="input-field" />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Unit Number *</label>
                <input type="text" placeholder="A-101" className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Booking Amount (₹) *</label>
                  <input type="number" placeholder="Amount" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Booking Date *</label>
                  <input type="date" className="input-field bg-[var(--bg-surface)] text-[var(--ink)] cursor-pointer" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Status</label>
                  <select className="input-field bg-[var(--bg-surface)] text-[var(--ink)] cursor-pointer">
                    <option value="booking">booking</option>
                    <option value="agreement">agreement</option>
                    <option value="registration">registration</option>
                    <option value="completed">completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Payment Status</label>
                  <select className="input-field bg-[var(--bg-surface)] text-[var(--ink)] cursor-pointer">
                    <option value="pending">Pending</option>
                    <option value="partial">partial</option>
                    <option value="completed">completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Sales Executive *</label>
                <select className="input-field bg-[var(--bg-surface)] text-[var(--ink)] cursor-pointer">
                  <option>Select executive</option>
                  <option>Rohit Verma</option>
                  <option>Anita Joshi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Branch</label>
                <select className="input-field bg-[var(--bg-surface)] text-[var(--ink)] cursor-pointer">
                  <option>Select branch</option>
                  <option>Mumbai Central</option>
                  <option>Bangalore South</option>
                  <option>Pune HQ</option>
                </select>
              </div>
            </div>
            
            <div className="p-4 border-t border-[var(--border-color)] flex gap-3 mt-auto bg-[var(--bg-surface)]/20">
              <button 
                onClick={() => setIsSlideOverOpen(false)} 
                className="btn-primary flex-1"
              >
                Create Booking
              </button>
              <button 
                onClick={() => setIsSlideOverOpen(false)} 
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  )
}
