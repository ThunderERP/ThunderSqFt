import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import { Search, Plus, List, Grid, X, Users, TrendingUp, UserPlus, Filter, Trello } from 'lucide-react'
import EmptyState from '../../shared/components/EmptyState'
import FunnelLine from '../../shared/components/FunnelLine'
import DataTable from '../../shared/components/DataTable'
import StatusBadge from '../../shared/components/StatusBadge'
import StatCard from '../../shared/components/StatCard'

const allStatuses = [
  'All Statuses', 'New', 'Contacted', 'Follow Up', 'Interested', 
  'Site Visit Fixed', 'Site Visit Done', 'Negotiation', 'Booking', 'Lost', 'Future Prospect'
]

const allSources = [
  'All Sources', 'facebook', 'google', 'whatsapp', 'reference', 'walk in', 'portal', 'other'
]

const mockLeads = [
  { id: '11', name: 'Varun Dhawan', mobile: '9811030201', city: 'Noida', source: 'Website', budget: '₹90L - ₹1.2Cr', status: 'New', assignedTo: 'Sanjay Gupta', nextFollowUp: '2026-06-22' },
  { id: '12', name: 'Kriti Sanon', mobile: '9811031301', city: 'Bengaluru', source: 'Referral', budget: '₹1.5Cr - ₹2.5Cr', status: 'Interested', assignedTo: 'Rohit Verma', nextFollowUp: '2026-06-25' },
  { id: '13', name: 'Sara Khan', mobile: '9811032401', city: 'Mumbai', source: 'Facebook Ads', budget: '₹55L - ₹65L', status: 'Follow Up', assignedTo: 'Rohit Verma', nextFollowUp: '2026-06-25' },
  { id: '14', name: 'Deepak Chahar', mobile: '9811033501', city: 'Pune', source: 'Direct Walk-in', budget: '₹1.5Cr - ₹2.5Cr', status: 'Interested', assignedTo: 'Anita Joshi', nextFollowUp: '2026-06-26' },
  { id: '15', name: 'Kavya Singh', mobile: '9811034601', city: 'Bengaluru', source: 'Website', budget: '₹80L - ₹90L', status: 'New', assignedTo: 'Sanjay Gupta', nextFollowUp: '2026-06-27' },
  { id: '16', name: 'Ajay Devgn', mobile: '9811035701', city: 'Mumbai', source: 'Referral', budget: '₹3Cr+', status: 'Contacted', assignedTo: 'Rohit Verma', nextFollowUp: '2026-06-28' },
  { id: '1', name: 'Arjun Mehta', mobile: '9811001101', city: 'Mumbai', source: 'facebook', budget: '₹85L', status: 'New', assignedTo: 'Rohit Verma', nextFollowUp: '2026-06-20' },
  { id: '2', name: 'Kavita Rajan', mobile: '9811002202', city: 'Pune', source: 'google', budget: '₹55L', status: 'Contacted', assignedTo: 'Anita Joshi', nextFollowUp: '2026-06-21' },
  { id: '3', name: 'Suresh Pillai', mobile: '9811003303', city: 'Mumbai', source: 'whatsapp', budget: '₹120L', status: 'Interested', assignedTo: 'Rohit Verma', nextFollowUp: null },
  { id: '4', name: 'Neeha Kapoor', mobile: '9811004404', city: 'Delhi', source: 'reference', budget: '₹75L', status: 'Site Visit Fixed', assignedTo: 'Rohit Verma', nextFollowUp: '2026-06-21' },
  { id: '5', name: 'Raghav Mishra', mobile: '9811005505', city: 'Mumbai', source: 'portal', budget: '₹150L', status: 'Negotiation', assignedTo: 'Anita Joshi', nextFollowUp: null },
  { id: '6', name: 'Preet Kaur', mobile: '9811006606', city: 'Bangalore', source: 'walk in', budget: '₹65L', status: 'Booking', assignedTo: 'Rohit Verma', nextFollowUp: null },
  { id: '7', name: 'Mohan Das', mobile: '9811007707', city: 'Hyderabad', source: 'google', budget: '₹45L', status: 'Lost', assignedTo: 'Anita Joshi', nextFollowUp: null },
  { id: '8', name: 'Sunita Agarwal', mobile: '9811008808', city: 'Mumbai', source: 'facebook', budget: '₹90L', status: 'Follow Up', assignedTo: 'Rohit Verma', nextFollowUp: '2026-06-20' },
  { id: '9', name: 'Tarun Bhatia', mobile: '9811009909', city: 'Pune', source: 'reference', budget: '₹110L', status: 'Site Visit Done', assignedTo: 'Anita Joshi', nextFollowUp: null },
  { id: '10', name: 'Lalita Singh', mobile: '9811010010', city: 'Delhi', source: 'portal', budget: '₹60L', status: 'Future Prospect', assignedTo: 'Rohit Verma', nextFollowUp: '2026-06-27' },
  { id: '11b', name: 'Ravi Teja', mobile: '9811011111', city: 'Hyderabad', source: 'whatsapp', budget: '₹70L', status: 'Contacted', assignedTo: 'Deepak Rao', nextFollowUp: '2026-06-22' },
  { id: '12b', name: 'Megha Shah', mobile: '9811012212', city: 'Mumbai', source: 'facebook', budget: '₹130L', status: 'Site Visit Fixed', assignedTo: 'Rohit Verma', nextFollowUp: '2026-06-23' },
  { id: '13b', name: 'Kartik Aryan', mobile: '9811013313', city: 'Pune', source: 'google', budget: '₹85L', status: 'Negotiation', assignedTo: 'Anita Joshi', nextFollowUp: '2026-06-24' },
  { id: '14b', name: 'Alia Bhatt', mobile: '9811014414', city: 'Bangalore', source: 'reference', budget: '₹95L', status: 'Interested', assignedTo: 'Deepak Rao', nextFollowUp: '2026-06-25' },
  { id: '15b', name: 'Ranbir Kapoor', mobile: '9811015515', city: 'Mumbai', source: 'portal', budget: '₹140L', status: 'New', assignedTo: 'Rohit Verma', nextFollowUp: '2026-06-26' },
  { id: '17', name: 'Hrithik Roshan', mobile: '9811036801', city: 'Delhi', source: 'whatsapp', budget: '₹1.8Cr', status: 'Site Visit Fixed', assignedTo: 'Sanjay Gupta', nextFollowUp: '2026-06-25' },
  { id: '18', name: 'Tiger Shroff', mobile: '9811037901', city: 'Pune', source: 'google', budget: '₹65L', status: 'Lost', assignedTo: 'Anita Joshi', nextFollowUp: null },
  { id: '19', name: 'Katrina Kaif', mobile: '9811038001', city: 'Bangalore', source: 'facebook', budget: '₹2Cr+', status: 'New', assignedTo: 'Rohit Verma', nextFollowUp: '2026-06-23' },
  { id: '20', name: 'Akshay Kumar', mobile: '9811039101', city: 'Hyderabad', source: 'walk in', budget: '₹95L', status: 'Future Prospect', assignedTo: 'Sanjay Gupta', nextFollowUp: '2026-12-01' },
  { id: '21', name: 'Salman Khan', mobile: '9811040201', city: 'Mumbai', source: 'portal', budget: '₹3Cr+', status: 'Site Visit Done', assignedTo: 'Rohit Verma', nextFollowUp: '2026-06-26' },
  { id: '22', name: 'Shahrukh Khan', mobile: '9811041301', city: 'Delhi', source: 'reference', budget: '₹5Cr+', status: 'Negotiation', assignedTo: 'Anita Joshi', nextFollowUp: '2026-06-24' },
  { id: '23', name: 'Aamir Khan', mobile: '9811042401', city: 'Pune', source: 'other', budget: '₹1.2Cr', status: 'Booking', assignedTo: 'Sanjay Gupta', nextFollowUp: null },
  { id: '24', name: 'Kareena Kapoor', mobile: '9811043501', city: 'Mumbai', source: 'whatsapp', budget: '₹85L', status: 'Follow Up', assignedTo: 'Rohit Verma', nextFollowUp: '2026-06-29' },
  { id: '25', name: 'Anushka Sharma', mobile: '9811044601', city: 'Bangalore', source: 'google', budget: '₹1.5Cr', status: 'Interested', assignedTo: 'Anita Joshi', nextFollowUp: '2026-06-27' },
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

interface LeadCardProps {
  lead: typeof mockLeads[0]
}

function LeadCard({ lead }: LeadCardProps) {
  const initials = getInitials(lead.name)
  const avatarColor = getAvatarColor(lead.name)
  const priority = lead.id.charCodeAt(0) % 3 === 0 ? 'High' : lead.id.charCodeAt(0) % 3 === 1 ? 'Medium' : 'Low'
  const project = lead.city === 'Mumbai' ? 'Thunder Residency' : lead.city === 'Delhi' ? 'Vasant Kunj Plaza' : 'Emerald Meadows'

  return (
    <Link 
      to={`/sales/leads/${lead.id}`}
      className="card p-4 flex flex-col gap-3 cursor-pointer hover:border-[var(--border-hover)] hover:-translate-y-1 transition-all shadow-card hover:shadow-hover bg-[var(--bg-card)] text-left"
    >
      <div className="flex justify-between items-start gap-2">
        <h4 className="text-xs font-bold text-[var(--ink)] leading-tight hover:text-[var(--accent)] transition-colors line-clamp-1">
          {lead.name}
        </h4>
        <StatusBadge status={priority} domain="priority" />
      </div>

      <div className="space-y-0.5">
        <p className="text-[9px] text-[var(--ink-muted)] uppercase font-bold tracking-wider">Project</p>
        <p className="text-xs text-[var(--ink-soft)] font-semibold">{project}</p>
      </div>

      <div className="flex justify-between items-end mt-2 pt-2 border-t border-[var(--border-color)]">
        <div className="space-y-0.5">
          <p className="text-[9px] text-[var(--ink-muted)] uppercase font-bold tracking-wider">Budget</p>
          <p className="text-xs font-mono font-bold text-[var(--gold)]">{lead.budget}</p>
        </div>

        <div className="flex items-center gap-1.5" title={`Assigned to ${lead.assignedTo}`}>
          <span className={`avatar-circle w-6 h-6 text-[9px] font-bold ${avatarColor}`}>
            {initials}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function SalesLeads() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses')
  const [sourceFilter, setSourceFilter] = useState<string>('All Sources')
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'kanban'>('kanban')

  // Funnel Stages Data
  const funnelStages = [
    { key: 'New', label: 'New', count: mockLeads.filter(l => l.status === 'New').length },
    { key: 'Contacted', label: 'Contacted', count: mockLeads.filter(l => ['Contacted', 'Follow Up'].includes(l.status)).length },
    { key: 'Interested', label: 'Interested', count: mockLeads.filter(l => l.status === 'Interested').length },
    { key: 'Site Visit', label: 'Site Visit', count: mockLeads.filter(l => ['Site Visit Fixed', 'Site Visit Done'].includes(l.status)).length },
    { key: 'Negotiation', label: 'Negotiation', count: mockLeads.filter(l => l.status === 'Negotiation').length },
    { key: 'Booking', label: 'Booking', count: mockLeads.filter(l => l.status === 'Booking').length },
  ]
  const maxCount = Math.max(...funnelStages.map(s => s.count))
  const funnelStagesWithActive = funnelStages.map(stage => ({
    ...stage,
    isMostActive: stage.count === maxCount && maxCount > 0
  }))

  const handleFunnelStageClick = (key: string) => {
    if (key === 'Site Visit') {
      setStatusFilter('Site Visit Fixed')
    } else {
      setStatusFilter(key)
    }
  }

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) || lead.mobile.includes(search)
    const matchesStatus = statusFilter === 'All Statuses' || lead.status === statusFilter
    const matchesSource = sourceFilter === 'All Sources' || lead.source === sourceFilter
    return matchesSearch && matchesStatus && matchesSource
  })

  // Compute live stats
  const totalLeads = mockLeads.length
  const newLeads = mockLeads.filter(l => l.status === 'New').length
  const hotLeads = mockLeads.filter(l => ['Interested', 'Negotiation', 'Site Visit Done'].includes(l.status)).length

  // Kanban stage config
  const kanbanStages = [
    { key: 'New', label: 'New', statuses: ['New'] },
    { key: 'Contacted', label: 'Contacted', statuses: ['Contacted', 'Follow Up'] },
    { key: 'Interested', label: 'Interested', statuses: ['Interested'] },
    { key: 'Site Visit', label: 'Site Visit', statuses: ['Site Visit Fixed', 'Site Visit Done'] },
    { key: 'Negotiation', label: 'Negotiation', statuses: ['Negotiation'] },
    { key: 'Booking', label: 'Booking', statuses: ['Booking'] },
  ]

  const leadColumns = [
    {
      key: 'name',
      label: 'Lead Name',
      render: (item: any) => (
        <Link to={`/sales/leads/${item.id}`} className="flex items-center gap-3 group/link">
          <span className={`avatar-circle text-[10px] font-bold ${getAvatarColor(item.name)}`}>
            {getInitials(item.name)}
          </span>
          <span className="font-bold text-[var(--ink)] group-hover/link:text-[var(--accent)] transition-colors">{item.name}</span>
        </Link>
      )
    },
    { key: 'mobile', label: 'Mobile' },
    { key: 'city', label: 'City' },
    {
      key: 'source',
      label: 'Source',
      render: (item: any) => (
        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink-soft)]">
          {item.source}
        </span>
      )
    },
    {
      key: 'budget',
      label: 'Budget',
      render: (item: any) => <span className="font-mono text-[var(--gold)] font-bold">{item.budget}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: any) => <StatusBadge status={item.status} />
    },
    { key: 'assignedTo', label: 'Assigned To' },
    {
      key: 'nextFollowUp',
      label: 'Next Follow-up',
      render: (item: any) => item.nextFollowUp || '—'
    }
  ]

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title font-display">Leads Pipeline</h1>
            <p className="page-subtitle">Manage and convert your leads pipeline</p>
          </div>
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="btn-primary flex items-center gap-2 self-start sm:self-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <Plus size={16} /> Add Lead
          </button>
        </div>

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StaggerItem>
            <StatCard
              label="Total Leads"
              value={totalLeads}
              icon={<Users size={16} />}
              subtitle="All registered leads"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="New This Week"
              value={newLeads}
              icon={<UserPlus size={16} />}
              valueColor="text-[var(--success)]"
              subtitle="Awaiting first contact"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Hot Leads"
              value={hotLeads}
              icon={<TrendingUp size={16} />}
              valueColor="text-[var(--gold)]"
              subtitle="High intent in negotiations"
            />
          </StaggerItem>
        </StaggerContainer>

        {/* Lead Funnel */}
        <div className="card p-6 shadow-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-widest font-sans">
              Lead Conversion Funnel
            </h3>
            <span className="text-[10px] text-[var(--ink-muted)] font-bold uppercase tracking-wider font-sans">
              Click stages to filter list
            </span>
          </div>
          <FunnelLine 
            stages={funnelStagesWithActive} 
            onStageClick={handleFunnelStageClick} 
            activeStage={
              statusFilter === 'New' ? 'New' :
              ['Contacted', 'Follow Up'].includes(statusFilter) ? 'Contacted' :
              statusFilter === 'Interested' ? 'Interested' :
              ['Site Visit Fixed', 'Site Visit Done'].includes(statusFilter) ? 'Site Visit' :
              statusFilter === 'Negotiation' ? 'Negotiation' :
              statusFilter === 'Booking' ? 'Booking' : undefined
            }
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 card">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all placeholder-[var(--ink-muted)]"
              />
            </div>
            
            <div className="flex items-center gap-1 text-[var(--ink-muted)]">
              <Filter size={14} />
            </div>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all cursor-pointer font-semibold"
            >
              {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select 
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all cursor-pointer font-semibold"
            >
              {allSources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {(statusFilter !== 'All Statuses' || sourceFilter !== 'All Sources' || search) && (
              <button 
                onClick={() => { setStatusFilter('All Statuses'); setSourceFilter('All Sources'); setSearch(''); }}
                className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                <X size={12} /> Clear Filters
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-[var(--border-color)]">
            <span className="text-xs font-bold text-[var(--ink-muted)] font-mono">{filteredLeads.length} results</span>
            <div className="flex rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--bg-surface)]">
              <button 
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-2 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${viewMode === 'kanban' ? 'bg-[var(--accent)] text-white' : 'text-[var(--ink-soft)] hover:bg-[var(--bg-hover)]'}`}
                title="Kanban Board"
              >
                <Trello size={14} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${viewMode === 'list' ? 'bg-[var(--accent)] text-white' : 'text-[var(--ink-soft)] hover:bg-[var(--bg-hover)]'}`}
                title="List Table"
              >
                <List size={14} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${viewMode === 'grid' ? 'bg-[var(--accent)] text-white' : 'text-[var(--ink-soft)] hover:bg-[var(--bg-hover)]'}`}
                title="Grid Cards"
              >
                <Grid size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {viewMode === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
            {kanbanStages.map((stage) => {
              const stageLeads = filteredLeads.filter(l => stage.statuses.includes(l.status))
              return (
                <div key={stage.key} className="bg-[var(--bg-surface)]/20 border border-[var(--border-color)] rounded-xl p-3 flex flex-col gap-3 min-w-[240px]">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-bold text-[var(--ink)] font-display uppercase tracking-wider">{stage.label}</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-full text-[var(--ink-soft)]">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-1">
                    {stageLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                    {stageLeads.length === 0 && (
                      <p className="text-[11px] text-[var(--ink-muted)] italic text-center py-8 font-sans">No leads</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : viewMode === 'list' ? (
          <DataTable
            columns={leadColumns}
            data={filteredLeads}
            searchPlaceholder="Filter list..."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLeads.map((lead, idx) => {
              const initials = getInitials(lead.name)
              const avatarColor = getAvatarColor(lead.name)
              const priority = lead.id.charCodeAt(0) % 3 === 0 ? 'High' : lead.id.charCodeAt(0) % 3 === 1 ? 'Medium' : 'Low'
              const project = lead.city === 'Mumbai' ? 'Thunder Residency' : lead.city === 'Delhi' ? 'Vasant Kunj Plaza' : 'Emerald Meadows'

              return (
                <div key={lead.id + '-' + idx} className="card p-5 flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                      <span className={`avatar-circle w-9 h-9 text-xs font-bold ${avatarColor}`}>
                        {initials}
                      </span>
                      <div className="text-left">
                        <Link to={`/sales/leads/${lead.id}`} className="font-bold text-[var(--ink)] hover:text-[var(--accent)] transition-colors">{lead.name}</Link>
                        <p className="text-[10px] text-[var(--ink-soft)] mt-0.5">{lead.city}</p>
                      </div>
                    </div>
                    <StatusBadge status={lead.status} />
                  </div>
                  
                  <div className="space-y-2 text-xs font-mono border-t border-b border-[var(--border-color)] py-3 my-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--ink-muted)] font-sans">Project</span>
                      <span className="font-semibold text-[var(--ink)] font-sans">{project}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--ink-muted)] font-sans">Mobile</span>
                      <span className="font-semibold text-[var(--ink)]">{lead.mobile}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--ink-muted)] font-sans">Budget</span>
                      <span className="font-semibold text-[var(--gold)]">{lead.budget}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--ink-muted)] font-sans">Priority</span>
                      <StatusBadge status={priority} domain="priority" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <p className="text-[9px] text-[var(--ink-muted)] uppercase font-bold tracking-wider mb-0.5">Assigned To</p>
                      <p className="font-semibold text-[var(--ink)] font-sans">{lead.assignedTo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-[var(--ink-muted)] uppercase font-bold tracking-wider mb-0.5">Follow-up</p>
                      <p className="font-semibold text-[var(--ink)]">{lead.nextFollowUp || '—'}</p>
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredLeads.length === 0 && (
              <div className="col-span-full">
                <EmptyState 
                  icon={Search} 
                  title="No leads match your filters" 
                  description="Try adjusting your search or filters" 
                />
              </div>
            )}
          </div>
        )}

        {/* Slide-over Panel */}
        {isSlideOverOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => setIsSlideOverOpen(false)}>
            <div className="w-full max-w-[400px] bg-[var(--bg-card)] border-l border-[var(--border-color)] h-full shadow-2xl flex flex-col text-left" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-color)]">
                <h2 className="text-lg font-bold text-[var(--ink)] font-display">Add New Lead</h2>
                <button 
                  onClick={() => setIsSlideOverOpen(false)}
                  className="p-1.5 rounded-full border border-[var(--border-color)] text-[var(--ink-soft)] hover:bg-[var(--bg-hover)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Lead Name *</label>
                  <input type="text" className="input-field" placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Mobile *</label>
                  <input type="text" className="input-field" placeholder="Mobile number" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Email</label>
                  <input type="email" className="input-field" placeholder="Email address" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">City</label>
                    <input type="text" className="input-field" placeholder="City" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Budget (₹)</label>
                    <input type="text" className="input-field" placeholder="Budget" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Source</label>
                    <select className="input-field bg-[var(--bg-surface)] text-[var(--ink)] cursor-pointer">
                      <option>other</option>
                      {allSources.slice(1).map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Status</label>
                    <select className="input-field bg-[var(--bg-surface)] text-[var(--ink)] cursor-pointer">
                      <option>New</option>
                      {allStatuses.slice(2).map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Preferred Location</label>
                  <input type="text" className="input-field" placeholder="Location" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Property Type</label>
                  <input type="text" className="input-field" placeholder="2BHK, 3BHK..." />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Assigned To</label>
                  <select className="input-field bg-[var(--bg-surface)] text-[var(--ink)] cursor-pointer">
                    <option>Select executive</option>
                    <option>Rohit Verma</option>
                    <option>Anita Joshi</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Notes</label>
                  <textarea 
                    className="input-field min-h-[100px] resize-y" 
                    placeholder="Notes..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Next Follow-up Date</label>
                  <input 
                    type="date" 
                    className="input-field bg-[var(--bg-surface)] text-[var(--ink)] cursor-pointer" 
                  />
                </div>
              </div>
              
              <div className="p-4 border-t border-[var(--border-color)] flex gap-3 mt-auto bg-[var(--bg-surface)]/20">
                <button 
                  onClick={() => setIsSlideOverOpen(false)} 
                  className="btn-primary flex-1"
                >
                  Add Lead
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
      </div>
    </PageTransition>
  )
}
