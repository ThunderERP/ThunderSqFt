import { useState } from 'react'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import { Clock, AlertTriangle, CheckCircle, Phone, Calendar, User } from 'lucide-react'

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

function getStatusStyle(status: string) {
  switch (status) {
    case 'missed': return 'bg-red-100 text-red-700'
    case 'completed': return 'bg-green-100 text-green-700'
    case 'pending':
    default: return 'bg-yellow-100 text-yellow-700'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'missed': return <AlertTriangle size={14} />
    case 'completed': return <CheckCircle size={14} />
    default: return <Clock size={14} />
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
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Follow-ups</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track all follow-up calls</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} className="text-gray-400" />
            <span className="font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
          </div>
        </div>

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Due Today</p>
                <h3 className="text-2xl counter-value text-gray-900 mt-0.5">{pendingCount}</h3>
              </div>
            </div>
          </StaggerItem>
          
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Missed</p>
                <h3 className="text-2xl counter-value text-red-600 mt-0.5">{missedCount}</h3>
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
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Phone size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total</p>
                <h3 className="text-2xl counter-value text-gray-900 mt-0.5">{totalCount}</h3>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Tabs */}
        <div className="flex items-center gap-2">
          {[
            { label: 'Today', count: pendingCount, color: 'bg-gray-100 text-gray-700' },
            { label: 'Missed', count: missedCount, color: 'bg-red-500 text-white' },
            { label: 'Completed', count: completedCount, color: 'bg-green-100 text-green-700' },
            { label: 'All', count: totalCount, color: 'bg-gray-100 text-gray-500' },
          ].map(tab => (
            <button 
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.label 
                  ? 'bg-white border border-gray-200 text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label === 'All' ? 'All Follow-ups' : tab.label}
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                activeTab === tab.label ? tab.color : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* List Section */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              {activeTab === 'Today' ? "Today's Follow-ups" : activeTab === 'Missed' ? "Missed Follow-ups" : activeTab === 'Completed' ? "Completed Follow-ups" : "All Follow-ups"}
            </h2>
            <span className="text-xs font-medium text-gray-400">{filteredFollowUps.length} items</span>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredFollowUps.map((item, idx) => (
              <div 
                key={item.id + '-' + idx} 
                className="anim-row p-5 flex items-center gap-4 hover:bg-gray-50/50 transition-all group cursor-pointer"
                style={{ '--i': idx } as React.CSSProperties}
              >
                {/* Avatar */}
                <span className={`avatar-circle ${getAvatarColor(item.name)}`}>
                  {getInitials(item.name)}
                </span>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-1">{item.description}</p>
                </div>

                {/* Time & Assignee */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Clock size={13} className="text-gray-400" />
                    {item.time}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <User size={11} />
                    {item.assignedTo}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFollowUps.length === 0 && (
            <div className="py-16 text-center">
              <div className="float-bounce inline-block mb-4">
                <CheckCircle size={40} className="text-green-300" />
              </div>
              <p className="text-gray-500 font-medium">All caught up!</p>
              <p className="text-sm text-gray-400 mt-1">No follow-ups in this category</p>
            </div>
          )}
        </div>

      </div>
    </PageTransition>
  )
}
