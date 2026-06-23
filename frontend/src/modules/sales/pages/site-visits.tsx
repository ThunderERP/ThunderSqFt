import { useState } from 'react'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import { Calendar, CheckCircle, XCircle, Plus, ChevronDown, X, MapPin, User } from 'lucide-react'
import DataTable from '../../shared/components/DataTable'
import StatusBadge from '../../shared/components/StatusBadge'
import StatCard from '../../shared/components/StatCard'

const mockVisits = [
  { id: '1', customer: 'Arjun Mehta', project: 'Andheri Skyline', executive: 'Rohit Verma', date: '2026-06-19', status: 'completed', feedback: 'Very interested in 3BHK', outcome: 'Booking likely' },
  { id: '2', customer: 'Sunita Agarwal', project: 'Goregaon Greens', executive: 'Rohit Verma', date: '2026-06-20', status: 'scheduled', feedback: '—', outcome: '—' },
  { id: '3', customer: 'Neeha Kapoor', project: 'Powai Grandeur', executive: 'Anita Joshi', date: '2026-06-21', status: 'scheduled', feedback: '—', outcome: '—' },
  { id: '4', customer: 'Raghav Mishra', project: 'Worli Zenith', executive: 'Anita Joshi', date: '2026-06-18', status: 'completed', feedback: 'Wants lower floor', outcome: 'Negotiation' },
  { id: '10', customer: 'Kavita Rajan', project: 'Powai Lake View', executive: 'Rohit Verma', date: '2026-06-19', status: 'completed', feedback: 'Liked the view, checking loan', outcome: 'Loan discussion' },
  { id: '11', customer: 'Suresh Pillai', project: 'Baner Elysium', executive: 'Anita Joshi', date: '2026-06-21', status: 'scheduled', feedback: '—', outcome: '—' },
  { id: '12', customer: 'Preet Kaur', project: 'Whitefield Residency', executive: 'Deepak Rao', date: '2026-06-22', status: 'scheduled', feedback: '—', outcome: '—' },
  { id: '13', customer: 'Mohan Das', project: 'Banjara Hills Oasis', executive: 'Deepak Rao', date: '2026-06-18', status: 'completed', feedback: 'Too far from office', outcome: 'Looking at other projects' },
  { id: '14', customer: 'Varun Dhawan', project: 'Noida Heights', executive: 'Anita Joshi', date: '2026-06-20', status: 'cancelled', feedback: 'Traffic issues', outcome: 'Will visit on weekend' },
  { id: '15', customer: 'Kriti Sanon', project: 'Whitefield Residency', executive: 'Rohit Verma', date: '2026-06-24', status: 'scheduled', feedback: '—', outcome: '—' },
  { id: '16', customer: 'Shraddha Kapoor', project: 'Banjara Hills Oasis', executive: 'Deepak Rao', date: '2026-06-16', status: 'completed', feedback: 'Needs Vastu compliance', outcome: 'Checking availability' },
  { id: '17', customer: 'Hrithik Roshan', project: 'Noida Heights', executive: 'Sanjay Gupta', date: '2026-06-29', status: 'scheduled', feedback: '—', outcome: '—' },
  { id: '18', customer: 'Tiger Shroff', project: 'Powai Lake View', executive: 'Rohit Verma', date: '2026-06-28', status: 'scheduled', feedback: '—', outcome: '—' },
  { id: '19', customer: 'Katrina Kaif', project: 'Baner Elysium', executive: 'Anita Joshi', date: '2026-06-21', status: 'cancelled', feedback: 'Not interested', outcome: 'Lost' },
  { id: '20', customer: 'Akshay Kumar', project: 'Whitefield Residency', executive: 'Deepak Rao', date: '2026-06-22', status: 'completed', feedback: 'Excellent location', outcome: 'Negotiation' },
  { id: '21', customer: 'Salman Khan', project: 'Banjara Hills Oasis', executive: 'Sanjay Gupta', date: '2026-06-23', status: 'scheduled', feedback: '—', outcome: '—' },
  { id: '22', customer: 'Shahrukh Khan', project: 'Andheri Skyline', executive: 'Rohit Verma', date: '2026-06-20', status: 'completed', feedback: 'Checking floor plans', outcome: 'Follow up' },
  { id: '23', customer: 'Aamir Khan', project: 'Worli Zenith', executive: 'Anita Joshi', date: '2026-06-15', status: 'completed', feedback: 'Too noisy', outcome: 'Show alternative' },
  { id: '24', customer: 'Kareena Kapoor', project: 'Noida Heights', executive: 'Deepak Rao', date: '2026-06-24', status: 'scheduled', feedback: '—', outcome: '—' },
  { id: '25', customer: 'Anushka Sharma', project: 'Powai Lake View', executive: 'Sanjay Gupta', date: '2026-06-26', status: 'cancelled', feedback: 'Postponed plan', outcome: 'Future prospect' },
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

export default function SiteVisits() {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [dateFilter, setDateFilter] = useState('');

  let filteredVisits = mockVisits.filter(visit => {
    const matchesStatus = statusFilter === 'All Statuses' || visit.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDate = !dateFilter || visit.date === dateFilter;
    return matchesStatus && matchesDate;
  });

  const scheduledCount = mockVisits.filter(v => v.status === 'scheduled').length
  const completedCount = mockVisits.filter(v => v.status === 'completed').length
  const cancelledCount = mockVisits.filter(v => v.status === 'cancelled').length

  const visitColumns = [
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
      render: (item: any) => (
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-[var(--ink-muted)]" />
          <span className="text-[var(--ink-soft)]">{item.project}</span>
        </div>
      )
    },
    {
      key: 'executive',
      label: 'Executive',
      render: (item: any) => (
        <div className="flex items-center gap-1.5">
          <User size={13} className="text-[var(--ink-muted)]" />
          <span className="text-[var(--ink-soft)]">{item.executive}</span>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Visit Date',
      render: (item: any) => <span className="font-mono text-[var(--ink-soft)]">{item.date}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: any) => <StatusBadge status={item.status} />
    },
    {
      key: 'feedback',
      label: 'Feedback',
      render: (item: any) => <span className="text-[var(--ink-soft)] max-w-[200px] truncate block">{item.feedback}</span>
    },
    {
      key: 'outcome',
      label: 'Outcome',
      render: (item: any) => <span className="text-[var(--ink-soft)] max-w-[180px] truncate block">{item.outcome}</span>
    }
  ]

  return (
    <PageTransition>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title font-display">Site Visits</h1>
            <p className="page-subtitle">Track property site visits</p>
          </div>
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="btn-primary flex items-center gap-2 self-start sm:self-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <Plus size={16} /> Schedule Visit
          </button>
        </div>

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StaggerItem>
            <StatCard
              label="Scheduled"
              value={scheduledCount}
              icon={<Calendar size={16} />}
              valueColor="text-[var(--accent)]"
              subtitle="Visits pending execution"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Completed"
              value={completedCount}
              icon={<CheckCircle size={16} />}
              valueColor="text-[var(--success)]"
              subtitle="Visits successfully conducted"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Cancelled"
              value={cancelledCount}
              icon={<XCircle size={16} />}
              valueColor="text-[var(--danger)]"
              subtitle="Visits cancelled or postponed"
            />
          </StaggerItem>
        </StaggerContainer>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 p-4 card">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all cursor-pointer font-semibold"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all cursor-pointer"
          />

          {(statusFilter !== 'All Statuses' || dateFilter) && (
            <button 
              onClick={() => { setStatusFilter('All Statuses'); setDateFilter(''); }}
              className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <X size={12} /> Clear Filters
            </button>
          )}
          <span className="text-xs font-bold text-[var(--ink-muted)] ml-auto font-mono">{filteredVisits.length} visits</span>
        </div>

        {/* Table */}
        <DataTable
          columns={visitColumns}
          data={filteredVisits}
          searchPlaceholder="Filter site visits..."
        />
      </div>

      {/* Slide-over Panel */}
      {isSlideOverOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end" onClick={() => setIsSlideOverOpen(false)}>
          <div className="w-full max-w-[450px] bg-[var(--bg-card)] border-l border-[var(--border-color)] h-full shadow-2xl flex flex-col text-left" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-bold text-[var(--ink)] font-display">Schedule Site Visit</h2>
              <button 
                onClick={() => setIsSlideOverOpen(false)}
                className="p-1.5 rounded-full border border-[var(--border-color)] text-[var(--ink-soft)] hover:bg-[var(--bg-hover)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Lead ID *</label>
                <input type="text" placeholder="Lead ID" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Customer Name *</label>
                <input type="text" placeholder="Customer name" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Project Name *</label>
                <input type="text" placeholder="Project name" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Executive *</label>
                <select className="input-field bg-[var(--bg-surface)] text-[var(--ink)] cursor-pointer">
                  <option>Select executive</option>
                  <option>Rohit Verma</option>
                  <option>Anita Joshi</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Visit Date *</label>
                <input type="date" className="input-field bg-[var(--bg-surface)] text-[var(--ink)] cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Status</label>
                <select className="input-field bg-[var(--bg-surface)] text-[var(--ink)] cursor-pointer">
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Remarks</label>
                <textarea className="input-field min-h-[100px] resize-y" placeholder="Notes..." />
              </div>
            </div>
            
            <div className="p-4 border-t border-[var(--border-color)] flex gap-3 mt-auto bg-[var(--bg-surface)]/20">
              <button 
                onClick={() => setIsSlideOverOpen(false)} 
                className="btn-primary flex-1"
              >
                Schedule Visit
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
