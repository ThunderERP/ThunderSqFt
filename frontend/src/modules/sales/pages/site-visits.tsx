import { useState } from 'react'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import { Calendar, CheckCircle, XCircle, Plus, ChevronDown, X, ArrowUpDown, ArrowUp, ArrowDown, MapPin, User } from 'lucide-react'

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
const avatarColors = ['bg-blue-100 text-blue-700','bg-emerald-100 text-emerald-700','bg-purple-100 text-purple-700','bg-orange-100 text-orange-700','bg-pink-100 text-pink-700']
function getAvatarColor(name: string) { let h=0; for(let i=0;i<name.length;i++) h=name.charCodeAt(i)+((h<<5)-h); return avatarColors[Math.abs(h)%avatarColors.length]; }

function getStatusBadge(status: string) {
  switch (status) {
    case 'scheduled': return { className: 'bg-blue-50 text-blue-600', icon: <Calendar size={12} />, label: 'Scheduled' }
    case 'completed': return { className: 'bg-green-50 text-green-600', icon: <CheckCircle size={12} />, label: 'Completed' }
    case 'cancelled': return { className: 'bg-red-50 text-red-600', icon: <XCircle size={12} />, label: 'Cancelled' }
    default: return { className: 'bg-gray-50 text-gray-600', icon: null, label: status }
  }
}

export default function SiteVisits() {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [dateFilter, setDateFilter] = useState('');
  
  type SortField = 'customer' | 'project' | 'executive' | 'date' | 'status' | 'feedback' | 'outcome' | null;
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

  let filteredVisits = mockVisits.filter(visit => {
    const matchesStatus = statusFilter === 'All Statuses' || visit.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDate = !dateFilter || visit.date === dateFilter;
    return matchesStatus && matchesDate;
  });

  if (sortField) {
    filteredVisits.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  const scheduledCount = mockVisits.filter(v => v.status === 'scheduled').length
  const completedCount = mockVisits.filter(v => v.status === 'completed').length
  const cancelledCount = mockVisits.filter(v => v.status === 'cancelled').length

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Visits</h1>
            <p className="text-sm text-gray-500 mt-1">Track property site visits</p>
          </div>
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all active:scale-[0.97]"
          >
            <Plus size={16} /> Schedule Visit
          </button>
        </div>

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Calendar size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Scheduled</p>
                <h3 className="text-2xl counter-value text-blue-600 mt-0.5">{scheduledCount}</h3>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                <CheckCircle size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <h3 className="text-2xl counter-value text-green-600 mt-0.5">{completedCount}</h3>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <XCircle size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cancelled</p>
                <h3 className="text-2xl counter-value text-red-600 mt-0.5">{cancelledCount}</h3>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
            >
              <option>All Statuses</option>
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-4 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          {(statusFilter !== 'All Statuses' || dateFilter) && (
            <button 
              onClick={() => { setStatusFilter('All Statuses'); setDateFilter(''); }}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <X size={12} /> Clear
            </button>
          )}
          <span className="text-xs font-medium text-gray-400 ml-auto">{filteredVisits.length} visits</span>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('customer')}>
                    <div className="flex items-center gap-2">Customer {getSortIcon('customer')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('project')}>
                    <div className="flex items-center gap-2">Project {getSortIcon('project')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('executive')}>
                    <div className="flex items-center gap-2">Executive {getSortIcon('executive')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-2">Visit Date {getSortIcon('date')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-2">Status {getSortIcon('status')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('feedback')}>
                    <div className="flex items-center gap-2">Feedback {getSortIcon('feedback')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('outcome')}>
                    <div className="flex items-center gap-2">Outcome {getSortIcon('outcome')}</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredVisits.map((visit, idx) => {
                  const badge = getStatusBadge(visit.status)
                  return (
                    <tr key={visit.id} className="anim-row hover:bg-gray-50/50 transition-all group" style={{ '--i': idx } as React.CSSProperties}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className={`avatar-circle ${getAvatarColor(visit.customer)}`}>
                            {getInitials(visit.customer)}
                          </span>
                          <span className="font-semibold text-gray-900">{visit.customer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <MapPin size={13} className="text-gray-400" />
                          {visit.project}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <User size={13} className="text-gray-400" />
                          {visit.executive}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{visit.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${badge.className}`}>
                          {badge.icon} {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{visit.feedback}</td>
                      <td className="px-6 py-4 text-gray-500 max-w-[180px] truncate">{visit.outcome}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filteredVisits.length === 0 && (
            <div className="py-16 text-center">
              <div className="float-bounce inline-block mb-4">
                <Calendar size={40} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No site visits found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Panel */}
      {isSlideOverOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsSlideOverOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 flex flex-col" style={{ animation: 'rowSlideIn 0.3s ease-out' }}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Schedule Site Visit</h2>
              <button 
                onClick={() => setIsSlideOverOpen(false)}
                className="p-1.5 border border-blue-100 hover:bg-blue-50 rounded-full transition-colors text-blue-500"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Lead ID *</label>
                  <input type="text" placeholder="Lead ID" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Customer Name *</label>
                  <input type="text" placeholder="Customer name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Project Name *</label>
                  <input type="text" placeholder="Project name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Executive *</label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all">
                      <option>Select executive</option>
                      <option>Rohit Verma</option>
                      <option>Anita Joshi</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Visit Date *</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-700 bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Status</label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all">
                      <option>Scheduled</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Remarks</label>
                  <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 min-h-[100px] resize-y transition-all" />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex gap-3 mt-auto bg-gray-50/50">
              <button 
                onClick={() => setIsSlideOverOpen(false)} 
                className="flex-[2] py-2.5 text-sm font-medium bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-all active:scale-[0.98]"
              >
                Schedule Visit
              </button>
              <button 
                onClick={() => setIsSlideOverOpen(false)} 
                className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </PageTransition>
  )
}
