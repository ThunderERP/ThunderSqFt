import { useState } from 'react'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import { Clock, AlertTriangle, CheckCircle, Phone, Calendar, User } from 'lucide-react'
import StatCard from '../../shared/components/StatCard'
import StatusBadge from '../../shared/components/StatusBadge'

const mockFollowUps = [
  { id: '1', name: 'Arjun Mehta', time: '10:00', description: 'Interested in Andheri project, wants to visit', status: 'pending', assignedTo: 'Rohit Verma' },
  { id: '2', name: 'Sunita Agarwal', time: '14:00', description: 'Schedule site visit for Goregaon project', status: 'pending', assignedTo: 'Rohit Verma' },
  { id: '15', name: 'Vikas Kumar', time: '14:30', description: 'Discuss pricing options for Baner Elysium', status: 'pending', assignedTo: 'Rohit Verma' },
  { id: '16', name: 'Sneha Reddy', time: '10:00', description: 'Sent revised brochure for Whitefield Residency', status: 'completed', assignedTo: 'Anita Joshi' },
  { id: '17', name: 'Farhan Akhtar', time: '16:00', description: 'Checking on price negotiation for Noida Heights', status: 'pending', assignedTo: 'Rohit Verma' },
  { id: '18', name: 'Kareena Kapoor', time: '11:30', description: 'Site Visit Worli Zenith - Customer did not show up', status: 'missed', assignedTo: 'Sanjay Gupta' },
  { id: '19', name: 'Saif Ali Khan', time: '13:00', description: 'Email - Sent brochure and pricing for Powai Grandeur', status: 'completed', assignedTo: 'Anita Joshi' },
  { id: '3', name: 'Kiran Nambiar', time: '11:30', description: 'First follow-up call scheduled', status: 'pending', assignedTo: 'Rohit Verma' },
  { id: '4', name: 'Ravi Teja', time: '09:00', description: 'Missed call yesterday, call back regarding 2BHK', status: 'missed', assignedTo: 'Anita Joshi' },
  { id: '5', name: 'Megha Shah', time: '15:15', description: 'Discuss loan eligibility', status: 'pending', assignedTo: 'Deepak Rao' },
  { id: '6', name: 'Kartik Aryan', time: '12:45', description: 'Client requested floor plans', status: 'completed', assignedTo: 'Rohit Verma' },
  { id: '7', name: 'Alia Bhatt', time: '16:30', description: 'Needs details on possession timeline', status: 'pending', assignedTo: 'Anita Joshi' },
  { id: '8', name: 'Ranbir Kapoor', time: '08:30', description: 'VIP client follow-up', status: 'missed', assignedTo: 'Deepak Rao' },
  { id: '9', name: 'Varun Dhawan', time: '17:00', description: 'Final price negotiation', status: 'pending', assignedTo: 'Rohit Verma' },
  { id: '10', name: 'Kriti Sanon', time: '10:45', description: 'Confirm booking amount receipt', status: 'completed', assignedTo: 'Anita Joshi' },
  { id: '11', name: 'Shraddha Kapoor', time: '13:20', description: 'Follow up on site visit feedback', status: 'pending', assignedTo: 'Deepak Rao' },
  { id: '12', name: 'Vicky Kaushal', time: '14:50', description: 'Explain amenities', status: 'completed', assignedTo: 'Rohit Verma' },
  { id: '13', name: 'Sara Ali Khan', time: '11:00', description: 'Sent brochure, need feedback', status: 'pending', assignedTo: 'Anita Joshi' },
  { id: '14', name: 'Janhvi Kapoor', time: '16:00', description: 'Discuss corner flat availability', status: 'pending', assignedTo: 'Deepak Rao' },
  { id: '20', name: 'Hrithik Roshan', time: '10:30', description: 'Send Noida Heights brochure', status: 'pending', assignedTo: 'Sanjay Gupta' },
  { id: '21', name: 'Tiger Shroff', time: '12:00', description: 'Follow up on Powai Lake View', status: 'completed', assignedTo: 'Rohit Verma' },
  { id: '22', name: 'Katrina Kaif', time: '14:15', description: 'Call regarding Baner Elysium', status: 'missed', assignedTo: 'Anita Joshi' },
  { id: '23', name: 'Akshay Kumar', time: '16:45', description: 'Confirm Whitefield Residency visit', status: 'pending', assignedTo: 'Deepak Rao' },
  { id: '24', name: 'Salman Khan', time: '09:30', description: 'Send Banjara Hills Oasis pricing', status: 'completed', assignedTo: 'Sanjay Gupta' },
  { id: '25', name: 'Shahrukh Khan', time: '11:15', description: 'Discuss Andheri Skyline floor plans', status: 'pending', assignedTo: 'Rohit Verma' },
  { id: '26', name: 'Aamir Khan', time: '13:45', description: 'Follow up on Worli Zenith alternatives', status: 'missed', assignedTo: 'Anita Joshi' },
  { id: '27', name: 'Kareena Kapoor', time: '15:30', description: 'Confirm Noida Heights visit', status: 'pending', assignedTo: 'Deepak Rao' },
  { id: '28', name: 'Anushka Sharma', time: '17:15', description: 'Call regarding Powai Lake View cancellation', status: 'completed', assignedTo: 'Sanjay Gupta' },
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

export default function FollowUps() {
  const [activeTab, setActiveTab] = useState('Today')

  const pendingCount = mockFollowUps.filter(f => f.status === 'pending').length
  const missedCount = mockFollowUps.filter(f => f.status === 'missed').length
  const completedCount = mockFollowUps.filter(f => f.status === 'completed').length
  const totalCount = mockFollowUps.length

  const filteredFollowUps = mockFollowUps.filter(item => {
    if (activeTab === 'Missed') return item.status === 'missed'
    if (activeTab === 'Today') return item.status === 'pending'
    if (activeTab === 'Completed') return item.status === 'completed'
    return true
  })

  return (
    <PageTransition>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title font-display">Follow-ups</h1>
            <p className="page-subtitle">Manage and track all follow-up calls</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--ink-soft)] font-mono self-start sm:self-auto bg-[var(--bg-surface)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg">
            <Calendar size={14} className="text-[var(--ink-muted)]" />
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
          </div>
        </div>

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StaggerItem>
            <StatCard
              label="Due Today"
              value={pendingCount}
              icon={<Clock size={16} />}
              valueColor="text-[var(--warning)]"
              subtitle="Pending follow-ups"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Missed"
              value={missedCount}
              icon={<AlertTriangle size={16} />}
              valueColor="text-[var(--danger)]"
              subtitle="Overdue follow-ups"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Completed"
              value={completedCount}
              icon={<CheckCircle size={16} />}
              valueColor="text-[var(--success)]"
              subtitle="Closed follow-ups today"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Total Tasks"
              value={totalCount}
              icon={<Phone size={16} />}
              subtitle="All registered follow-ups"
            />
          </StaggerItem>
        </StaggerContainer>

        {/* Tabs Control */}
        <div className="flex bg-[var(--bg-surface)] border border-[var(--border-color)] p-1 rounded-lg self-start gap-1 max-w-max">
          {[
            { label: 'Today', count: pendingCount },
            { label: 'Missed', count: missedCount },
            { label: 'Completed', count: completedCount },
            { label: 'All', count: totalCount },
          ].map(tab => (
            <button 
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                activeTab === tab.label 
                  ? 'bg-[var(--bg-card)] text-[var(--ink)] shadow-sm' 
                  : 'text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--bg-hover)]/30'
              }`}
            >
              {tab.label === 'All' ? 'All' : tab.label}
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink-soft)]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* List Section */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-surface)]/20">
            <h2 className="text-sm font-bold text-[var(--ink)] font-display uppercase tracking-wider">
              {activeTab === 'Today' ? "Today's Queue" : activeTab === 'Missed' ? "Missed Queue" : activeTab === 'Completed' ? "Completed Queue" : "All Records"}
            </h2>
            <span className="text-xs font-bold text-[var(--ink-muted)] font-mono">{filteredFollowUps.length} items</span>
          </div>
          
          <div className="divide-y divide-[var(--border-color)]">
            {filteredFollowUps.map((item, idx) => (
              <div 
                key={item.id + '-' + idx} 
                className="p-5 flex items-center gap-4 hover:bg-[var(--bg-hover)]/30 transition-all group cursor-pointer"
              >
                {/* Avatar */}
                <span className={`avatar-circle font-bold text-[10px] w-9 h-9 ${getAvatarColor(item.name)}`}>
                  {getInitials(item.name)}
                </span>
                
                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[var(--ink)]">{item.name}</h4>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-xs text-[var(--ink-soft)] font-medium leading-relaxed truncate">{item.description}</p>
                </div>

                {/* Time & Assignee */}
                <div className="flex flex-col items-end gap-1.5 shrink-0 text-right">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)] font-mono">
                    <Clock size={12} className="text-[var(--ink-muted)]" />
                    {item.time}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[var(--ink-muted)] font-bold">
                    <User size={10} />
                    {item.assignedTo}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFollowUps.length === 0 && (
            <div className="py-16 text-center">
              <div className="float-bounce inline-block mb-4">
                <CheckCircle size={40} className="text-[var(--success)]" />
              </div>
              <p className="text-[var(--ink-soft)] font-bold">All caught up!</p>
              <p className="text-xs text-[var(--ink-muted)] mt-1">No follow-ups in this category</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
