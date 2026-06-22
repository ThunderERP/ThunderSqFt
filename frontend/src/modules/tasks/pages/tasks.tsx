import { useState } from 'react'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import { Plus, ChevronDown, Edit, Trash2, X, ArrowUpDown, ArrowUp, ArrowDown, ListTodo, Clock, CheckCircle2, AlertOctagon, Zap } from 'lucide-react'
import EmptyState from '../../shared/components/EmptyState'

const mockTasks = [
  { id: '1', title: 'Send updated price list to all leads', assignee: 'Rohit Verma', dueDate: '2026-06-20', priority: 'medium', status: 'pending', progress: 0 },
  { id: '2', title: 'Update CRM with latest site visit notes', assignee: 'Anita Joshi', dueDate: '2026-06-20', priority: 'high', status: 'in progress', progress: 60 },
  { id: '3', title: 'Prepare weekly sales report', assignee: 'Sanjay Gupta', dueDate: '2026-06-19', priority: 'critical', status: 'overdue', progress: 40 },
  { id: '4', title: 'Follow up on pending agreements', assignee: 'Rohit Verma', dueDate: '2026-06-21', priority: 'high', status: 'pending', progress: 0 },
  { id: '5', title: 'Schedule meeting with builder', assignee: 'Meera Nair', dueDate: '2026-06-22', priority: 'low', status: 'pending', progress: 0 },
  { id: '6', title: 'Review pending loan applications', assignee: 'Meera Nair', dueDate: '2026-06-21', priority: 'high', status: 'in progress', progress: 75 },
  { id: '7', title: 'Update lead status for contacted clients', assignee: 'Rohit Verma', dueDate: '2026-06-20', priority: 'medium', status: 'pending', progress: 0 },
  { id: '8', title: 'Verify document submissions for loan cases', assignee: 'Sanjay Gupta', dueDate: '2026-06-19', priority: 'high', status: 'pending', progress: 0 },
  { id: '9', title: 'Create WhatsApp broadcast list', assignee: 'Rohit Verma', dueDate: '2026-06-22', priority: 'low', status: 'completed', progress: 100 },
  { id: '10', title: 'Coordinate with legal team on agreements', assignee: 'Anita Joshi', dueDate: '2026-06-23', priority: 'medium', status: 'pending', progress: 0 },
  { id: '11', title: 'Plan open house event for Noida project', assignee: 'Deepak Rao', dueDate: '2026-06-25', priority: 'high', status: 'in progress', progress: 45 },
  { id: '12', title: 'Collect testimonials from happy clients', assignee: 'Anita Joshi', dueDate: '2026-06-27', priority: 'low', status: 'pending', progress: 0 },
  { id: '13', title: 'Fix broken links on property website', assignee: 'Sanjay Gupta', dueDate: '2026-06-22', priority: 'medium', status: 'completed', progress: 100 },
  { id: '14', title: 'Backup client database', assignee: 'Meera Nair', dueDate: '2026-06-24', priority: 'critical', status: 'pending', progress: 0 },
  { id: '15', title: 'Train new sales executive', assignee: 'Rohit Verma', dueDate: '2026-06-26', priority: 'medium', status: 'in progress', progress: 25 },
  { id: '16', title: 'Prepare incentive payout sheet', assignee: 'Deepak Rao', dueDate: '2026-06-28', priority: 'high', status: 'in progress', progress: 80 },
  { id: '17', title: 'Follow up on pending invoices', assignee: 'Sanjay Gupta', dueDate: '2026-06-23', priority: 'medium', status: 'pending', progress: 0 },
  { id: '18', title: 'Audit missing lead contact info', assignee: 'Anita Joshi', dueDate: '2026-06-26', priority: 'low', status: 'pending', progress: 0 },
  { id: '19', title: 'Prepare monthly sales report', assignee: 'Sanjay Gupta', dueDate: '2026-06-30', priority: 'high', status: 'pending', progress: 0 },
  { id: '20', title: 'Update project brochures', assignee: 'Deepak Rao', dueDate: '2026-06-28', priority: 'medium', status: 'in progress', progress: 30 },
  { id: '21', title: 'Call inactive leads', assignee: 'Rohit Verma', dueDate: '2026-06-24', priority: 'low', status: 'completed', progress: 100 },
  { id: '22', title: 'Finalize commission structure', assignee: 'Anita Joshi', dueDate: '2026-06-21', priority: 'critical', status: 'overdue', progress: 80 },
  { id: '23', title: 'Schedule site visits for next week', assignee: 'Sanjay Gupta', dueDate: '2026-06-25', priority: 'medium', status: 'pending', progress: 0 },
  { id: '24', title: 'Follow up on pending loan approvals', assignee: 'Meera Nair', dueDate: '2026-06-23', priority: 'high', status: 'in progress', progress: 60 },
  { id: '25', title: 'Organize team building activity', assignee: 'Deepak Rao', dueDate: '2026-07-05', priority: 'low', status: 'pending', progress: 0 },
  { id: '26', title: 'Review marketing budget', assignee: 'Rohit Verma', dueDate: '2026-06-27', priority: 'critical', status: 'pending', progress: 0 },
  { id: '27', title: 'Send newsletters to prospects', assignee: 'Anita Joshi', dueDate: '2026-06-26', priority: 'medium', status: 'completed', progress: 100 },
]

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}
const avatarColors = ['bg-blue-100 text-blue-700','bg-emerald-100 text-emerald-700','bg-purple-100 text-purple-700','bg-orange-100 text-orange-700','bg-pink-100 text-pink-700']
function getAvatarColor(name: string) { let h=0; for(let i=0;i<name.length;i++) h=name.charCodeAt(i)+((h<<5)-h); return avatarColors[Math.abs(h)%avatarColors.length]; }

export default function Tasks() {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  
  type SortField = 'title' | 'assignee' | 'dueDate' | 'priority' | 'status' | 'progress' | null;
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

  const priorityWeight = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };

  let filteredTasks = mockTasks.filter(task => {
    const matchesStatus = statusFilter === 'All Statuses' || task.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'All Priorities' || task.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchesStatus && matchesPriority;
  });

  if (sortField) {
    filteredTasks.sort((a, b) => {
      if (sortField === 'progress') {
        return sortDirection === 'asc' ? a.progress - b.progress : b.progress - a.progress;
      }
      if (sortField === 'priority') {
        const aVal = priorityWeight[a.priority as keyof typeof priorityWeight] || 0;
        const bVal = priorityWeight[b.priority as keyof typeof priorityWeight] || 0;
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aVal = String(a[sortField] || '');
      const bVal = String(b[sortField] || '');
      const comparison = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-blue-100 text-blue-700'
      case 'low': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'in progress': return 'bg-blue-100 text-blue-700'
      case 'overdue': return 'bg-red-100 text-red-700'
      case 'completed': return 'bg-emerald-100 text-emerald-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-emerald-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 30) return 'bg-yellow-500'
    return 'bg-gray-300'
  }

  // Live computed stats
  const totalTasks = mockTasks.length
  const pendingTasks = mockTasks.filter(t => t.status === 'pending').length
  const inProgressTasks = mockTasks.filter(t => t.status === 'in progress').length
  const completedTasks = mockTasks.filter(t => t.status === 'completed').length
  const overdueTasks = mockTasks.filter(t => t.status === 'overdue').length

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage daily tasks</p>
          </div>
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all active:scale-[0.97]"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <ListTodo size={18} />
                </div>
                <span className="text-sm font-medium text-gray-500">Total</span>
              </div>
              <div className="text-2xl counter-value text-gray-900">{totalTasks}</div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-yellow-50 text-yellow-500 flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <span className="text-sm font-medium text-gray-500">Pending</span>
              </div>
              <div className="text-2xl counter-value text-yellow-600">{pendingTasks}</div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Zap size={18} />
                </div>
                <span className="text-sm font-medium text-gray-500">In Progress</span>
              </div>
              <div className="text-2xl counter-value text-[#2563EB]">{inProgressTasks}</div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <span className="text-sm font-medium text-gray-500">Completed</span>
              </div>
              <div className="text-2xl counter-value text-emerald-500">{completedTasks}</div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <AlertOctagon size={18} />
                </div>
                <span className="text-sm font-medium text-gray-500">Overdue</span>
              </div>
              <div className="text-2xl counter-value text-red-500">{overdueTasks}</div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-48">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all"
            >
              <option>All Statuses</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Overdue</option>
              <option>Completed</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative w-full md:w-48">
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all"
            >
              <option>All Priorities</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-xs font-medium text-gray-400 ml-auto">{filteredTasks.length} tasks</span>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-2">Task {getSortIcon('title')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('assignee')}>
                    <div className="flex items-center gap-2">Assigned To {getSortIcon('assignee')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('dueDate')}>
                    <div className="flex items-center gap-2">Due Date {getSortIcon('dueDate')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('priority')}>
                    <div className="flex items-center gap-2">Priority {getSortIcon('priority')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-2">Status {getSortIcon('status')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('progress')}>
                    <div className="flex items-center gap-2">Progress {getSortIcon('progress')}</div>
                  </th>
                  <th className="px-6 py-4 whitespace-nowrap w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTasks.map((task, idx) => (
                  <tr key={task.id} className="anim-row hover:bg-gray-50/50 transition-all group" style={{ '--i': idx } as React.CSSProperties}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{task.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`avatar-circle ${getAvatarColor(task.assignee)}`} style={{ width: 28, height: 28, fontSize: 11 }}>
                          {getInitials(task.assignee)}
                        </span>
                        <span className="text-gray-600">{task.assignee}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{task.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusStyle(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`progress-animated h-1.5 rounded-full ${getProgressColor(task.progress)}`}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-500 w-8 text-right">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-md text-gray-400 hover:text-[#2563EB] hover:bg-blue-50 transition-all">
                          <Edit size={14} />
                        </button>
                        <button className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTasks.length === 0 && (
            <EmptyState 
              icon={ListTodo} 
              title="No tasks match your filters" 
              description="Try adjusting your criteria" 
            />
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
              <h2 className="text-xl font-bold text-gray-900">Add Task</h2>
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
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Task Name *</label>
                  <input 
                    type="text" 
                    placeholder="Task description"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Assigned To *</label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all">
                      <option>Select user</option>
                      <option>Rohit Verma</option>
                      <option>Anita Joshi</option>
                      <option>Meera Nair</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Due Date *</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-700 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Priority</label>
                    <div className="relative">
                      <select className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all">
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                        <option>Low</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Status</label>
                    <div className="relative">
                      <select className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all">
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Overdue</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Completion %</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Remarks</label>
                  <textarea 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 min-h-[120px] resize-y transition-all" 
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex gap-3 mt-auto bg-gray-50/50">
              <button 
                onClick={() => setIsSlideOverOpen(false)} 
                className="flex-[2] py-2.5 text-sm font-medium bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-all active:scale-[0.98]"
              >
                Add Task
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
