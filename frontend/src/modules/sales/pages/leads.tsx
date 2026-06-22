import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import { Search, Plus, List, Grid, X, ArrowUpDown, ArrowUp, ArrowDown, Users, TrendingUp, UserPlus, Filter } from 'lucide-react'
import EmptyState from '../../shared/components/EmptyState'
import FunnelLine from '../../shared/components/FunnelLine'

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
  { id: '6', name: 'Preet Kaur', mobile: '9811006606', city: 'Bangalore', source: 'walk_in', budget: '₹65L', status: 'Booking', assignedTo: 'Rohit Verma', nextFollowUp: null },
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

function getSourceStyle(source: string) {
  switch (source) {
    case 'facebook': return 'bg-blue-100 text-blue-600'
    case 'google': return 'bg-red-100 text-red-600'
    case 'whatsapp': return 'bg-green-100 text-green-600'
    case 'reference': return 'bg-purple-100 text-purple-600'
    case 'walk_in': case 'walk in': return 'bg-orange-100 text-orange-600'
    case 'portal': return 'bg-slate-100 text-slate-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'New': return 'bg-white border border-gray-200 text-gray-700'
    case 'Contacted': return 'bg-blue-100 text-blue-700'
    case 'Follow Up': return 'bg-yellow-100 text-yellow-700'
    case 'Interested': return 'bg-emerald-100 text-emerald-700'
    case 'Site Visit Fixed': return 'bg-purple-100 text-purple-700'
    case 'Site Visit Done': return 'bg-purple-100 text-purple-700'
    case 'Future Prospect': return 'bg-purple-100 text-purple-700'
    case 'Negotiation': return 'bg-orange-100 text-orange-700'
    case 'Booking': return 'bg-green-100 text-green-700'
    case 'Lost': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const avatarColors = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
]

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

export default function SalesLeads() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses')
  const [sourceFilter, setSourceFilter] = useState<string>('All Sources')
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

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
  
  type SortField = 'name' | 'mobile' | 'city' | 'source' | 'budget' | 'status' | 'assignedTo' | 'nextFollowUp' | null;
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else setSortField(null);
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-gray-300" />;
    return sortDirection === 'asc' ? <ArrowUp size={14} className="text-[#2563EB]" /> : <ArrowDown size={14} className="text-[#2563EB]" />;
  };

  let filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) || lead.mobile.includes(search)
    const matchesStatus = statusFilter === 'All Statuses' || lead.status === statusFilter
    const matchesSource = sourceFilter === 'All Sources' || lead.source === sourceFilter
    return matchesSearch && matchesStatus && matchesSource
  })

  if (sortField) {
    filteredLeads.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (sortField === 'budget') {
        const numA = parseInt(aVal.replace(/[^0-9]/g, '')) || 0;
        const numB = parseInt(bVal.replace(/[^0-9]/g, '')) || 0;
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  // Compute live stats
  const totalLeads = mockLeads.length
  const newLeads = mockLeads.filter(l => l.status === 'New').length
  const hotLeads = mockLeads.filter(l => ['Interested', 'Negotiation', 'Site Visit Done'].includes(l.status)).length

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and convert your leads pipeline</p>
          </div>
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="bg-[#2563EB] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-[0.97]"
          >
            <Plus size={16} /> Add Lead
          </button>
        </div>

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StaggerItem>
            <div className="bg-bg-card border border-border-color rounded-2xl p-5 flex items-center gap-4 shadow-card">
              <div className="w-11 h-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                <Users size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-ink-soft uppercase tracking-wider">Total Leads</p>
                <h3 className="text-2xl font-extrabold text-ink mt-0.5">{totalLeads}</h3>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-bg-card border border-border-color rounded-2xl p-5 flex items-center gap-4 shadow-card">
              <div className="w-11 h-11 rounded-xl bg-success-soft text-success flex items-center justify-center shrink-0">
                <UserPlus size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-ink-soft uppercase tracking-wider">New This Week</p>
                <h3 className="text-2xl font-extrabold text-success mt-0.5">{newLeads}</h3>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-bg-card border border-border-color rounded-2xl p-5 flex items-center gap-4 shadow-card">
              <div className="w-11 h-11 rounded-xl bg-gold-soft text-gold flex items-center justify-center shrink-0">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-ink-soft uppercase tracking-wider">Hot Leads</p>
                <h3 className="text-2xl font-extrabold text-gold mt-0.5">{hotLeads}</h3>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Lead Funnel */}
        <div className="bg-bg-card border border-border-color rounded-2xl p-6 shadow-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-ink-soft uppercase tracking-widest">
              Lead Conversion Funnel
            </h3>
            <span className="text-[10px] text-ink-muted font-bold uppercase tracking-wider">
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-64 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-1.5 text-gray-400">
              <Filter size={14} />
            </div>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700 min-w-[140px] appearance-none cursor-pointer transition-all"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")', backgroundPosition: 'right .75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em', paddingRight: '2.5rem' }}
            >
              {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select 
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700 min-w-[140px] appearance-none cursor-pointer transition-all"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")', backgroundPosition: 'right .75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em', paddingRight: '2.5rem' }}
            >
              {allSources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {(statusFilter !== 'All Statuses' || sourceFilter !== 'All Sources' || search) && (
              <button 
                onClick={() => { setStatusFilter('All Statuses'); setSourceFilter('All Sources'); setSearch(''); }}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-400">{filteredLeads.length} results</span>
            <div className="flex bg-white border border-gray-100 rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 transition-all ${viewMode === 'list' ? 'bg-[#2563EB] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <List size={16} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 transition-all ${viewMode === 'grid' ? 'bg-[#2563EB] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {viewMode === 'list' ? (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs text-gray-500 bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-2">Lead Name {getSortIcon('name')}</div>
                    </th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('mobile')}>
                      <div className="flex items-center gap-2">Mobile {getSortIcon('mobile')}</div>
                    </th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('city')}>
                      <div className="flex items-center gap-2">City {getSortIcon('city')}</div>
                    </th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('source')}>
                      <div className="flex items-center gap-2">Source {getSortIcon('source')}</div>
                    </th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('budget')}>
                      <div className="flex items-center gap-2">Budget {getSortIcon('budget')}</div>
                    </th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('status')}>
                      <div className="flex items-center gap-2">Status {getSortIcon('status')}</div>
                    </th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('assignedTo')}>
                      <div className="flex items-center gap-2">Assigned To {getSortIcon('assignedTo')}</div>
                    </th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('nextFollowUp')}>
                      <div className="flex items-center gap-2">Next Follow-up {getSortIcon('nextFollowUp')}</div>
                    </th>
                    <th className="px-6 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLeads.map((lead, idx) => (
                    <tr key={lead.id + '-' + idx} className="anim-row hover:bg-gray-50/50 transition-colors group" style={{ '--i': idx } as React.CSSProperties}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`avatar-circle ${getAvatarColor(lead.name)}`}>
                            {getInitials(lead.name)}
                          </span>
                          <span className="font-medium text-gray-900">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{lead.mobile}</td>
                      <td className="px-6 py-4 text-gray-500">{lead.city}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium badge-pop ${getSourceStyle(lead.source)}`}>
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">{lead.budget}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getStatusStyle(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{lead.assignedTo}</td>
                      <td className="px-6 py-4 text-gray-500">{lead.nextFollowUp || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-colors">View →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredLeads.length === 0 && (
              <EmptyState 
                icon={Search} 
                title="No leads match your filters" 
                description="Try adjusting your search or filters" 
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLeads.map((lead, idx) => (
              <div key={lead.id + '-' + idx} className="anim-card card-lift bg-white rounded-xl border border-gray-100 p-5 flex flex-col" style={{ '--i': idx } as React.CSSProperties}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`avatar-circle ${getAvatarColor(lead.name)}`}>
                      {getInitials(lead.name)}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900">{lead.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{lead.city}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
                
                <div className="space-y-2.5 mb-4 flex-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Mobile</span>
                    <span className="font-medium text-gray-900">{lead.mobile}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-medium text-gray-900">{lead.budget}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Source</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${getSourceStyle(lead.source)}`}>
                      {lead.source}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                  <div>
                    <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1">Assigned To</p>
                    <p className="font-medium text-gray-900">{lead.assignedTo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1">Follow-up</p>
                    <p className="font-medium text-gray-900">{lead.nextFollowUp || '—'}</p>
                  </div>
                </div>
              </div>
            ))}
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
          <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-[1px]" onClick={() => setIsSlideOverOpen(false)}>
            <div className="w-full max-w-[400px] bg-white h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()} style={{ animation: 'rowSlideIn 0.3s ease-out' }}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Add New Lead</h2>
                <button 
                  onClick={() => setIsSlideOverOpen(false)}
                  className="p-1.5 rounded-full border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Lead Name *</label>
                    <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Mobile *</label>
                    <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" placeholder="Mobile number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Email</label>
                    <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" placeholder="Email address" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">City</label>
                      <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" placeholder="City" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">Budget (₹)</label>
                      <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" placeholder="Budget" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">Source</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-700 bg-white transition-all">
                        <option>other</option>
                        {allSources.slice(1).map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">Status</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-700 bg-white transition-all">
                        <option>New</option>
                        {allStatuses.slice(2).map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Preferred Location</label>
                    <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" placeholder="Location" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Property Type</label>
                    <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" placeholder="2BHK, 3BHK..." />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Assigned To</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-700 bg-white transition-all">
                      <option>Select executive</option>
                      <option>Rohit Verma</option>
                      <option>Anita Joshi</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Notes</label>
                    <textarea 
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 min-h-[100px] resize-y transition-all" 
                      placeholder="Notes..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Next Follow-up Date</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-700 bg-white transition-all" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 flex gap-3 mt-auto bg-gray-50/50">
                <button 
                  onClick={() => setIsSlideOverOpen(false)} 
                  className="flex-[2] py-2.5 text-sm font-medium bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-all active:scale-[0.98]"
                >
                  Add Lead
                </button>
                <button 
                  onClick={() => setIsSlideOverOpen(false)} 
                  className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
