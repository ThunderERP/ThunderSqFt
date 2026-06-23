import { useState } from 'react'
import { PageTransition, StaggerList, StaggerItem, CountUp, HoverCard, AnimatePresence, motion } from '../../shared/components/MotionComponents'
import { 
  Users, Calendar, Phone, CheckCircle, Landmark, 
  ListTodo, TrendingUp, MessageSquare, Plus, Clock, 
  CheckCircle2, AlertOctagon, PhoneCall, Trash2, ShieldAlert
} from 'lucide-react'
import { toast } from 'sonner'
import { useRole } from '../../../context/RoleContext'

interface Task {
  id: string
  title: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  dueDate: string
  status: 'pending' | 'completed'
}

interface FollowUp {
  id: string
  name: string
  time: string
  description: string
  status: 'pending' | 'completed' | 'missed'
}

interface Activity {
  id: string
  time: string
  text: string
  type: 'booking' | 'negative' | 'positive' | 'alert' | 'info' | 'whatsapp'
}

export default function UnifiedDashboard() {
  const { activeRole } = useRole()
  const todayStr = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })

  // Mock Tasks State
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Send updated price list to Noida leads', priority: 'high', dueDate: 'Today', status: 'pending' },
    { id: '2', title: 'Review pending loan files for Worli Zenith', priority: 'critical', dueDate: 'Today', status: 'pending' },
    { id: '3', title: 'Schedule Zoom with Whitefield builder', priority: 'medium', dueDate: 'Tomorrow', status: 'pending' },
    { id: '4', title: 'Update CRM site-visit logs', priority: 'low', dueDate: 'Today', status: 'pending' },
  ])

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('medium')

  // Mock FollowUps State
  const [followUps, setFollowUps] = useState<FollowUp[]>([
    { id: '1', name: 'Arjun Mehta', time: '10:30 AM', description: 'Interested in Andheri 3BHK, request pricing', status: 'pending' },
    { id: '2', name: 'Sunita Agarwal', time: '12:00 PM', description: 'Callback regarding Goregaon project site visit', status: 'pending' },
    { id: '3', name: 'Vikas Kumar', time: '2:30 PM', description: 'Discuss home loan options & interest rates', status: 'pending' },
    { id: '4', name: 'Kiran Nambiar', time: '4:15 PM', description: 'First follow-up call, introduce Powai Heights', status: 'pending' },
  ])

  // Mock Activity Feed State
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', time: '10 mins ago', text: 'Vikram Singh booked Unit A-402 (₹1.5 Cr) at Noida project', type: 'booking' },
    { id: '2', time: '45 mins ago', text: 'WhatsApp automation sent 18 daily follow-up notifications', type: 'whatsapp' },
    { id: '3', time: '1 hour ago', text: 'Lead Arjun Mehta assigned to Executive Rohit Verma', type: 'info' },
    { id: '4', time: '2 hours ago', text: 'Site visit confirmed for Sunita Agarwal (Worli Zenith)', type: 'positive' },
    { id: '5', time: '3 hours ago', text: 'Manager flagged 3 overdue loan applications', type: 'alert' },
  ])

  // Handlers
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      dueDate: 'Today',
      status: 'pending'
    }

    setTasks([newTask, ...tasks])
    setNewTaskTitle('')
    
    // Add to activity log
    const newActivity: Activity = {
      id: Date.now().toString(),
      time: 'Just now',
      text: `Added new pending task: "${newTask.title}"`,
      type: 'info'
    }
    setActivities([newActivity, ...activities])

    toast.success('Task added successfully')
  }

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'pending' ? 'completed' : 'pending'
        if (nextStatus === 'completed') {
          toast.success(`Completed task: "${t.title}"`)
          // Add to activity
          setActivities([
            { id: Date.now().toString(), time: 'Just now', text: `Completed task: "${t.title}"`, type: 'positive' },
            ...activities
          ])
        }
        return { ...t, status: nextStatus }
      }
      return t
    }))
  }

  const handleCompleteFollowUp = (id: string, name: string) => {
    setFollowUps(followUps.map(f => {
      if (f.id === id) {
        return { ...f, status: 'completed' }
      }
      return f
    }))
    
    setActivities([
      { id: Date.now().toString(), time: 'Just now', text: `Completed follow-up call with ${name}`, type: 'positive' },
      ...activities
    ])

    toast.success(`Follow-up with ${name} marked complete`)
  }

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
    toast.info('Task removed')
  }

  // Styles utility
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return 'badge-danger'
      case 'high': return 'badge-warning'
      case 'medium': return 'badge-accent'
      case 'low':
      default: return 'badge-gold'
    }
  }

  return (
    <PageTransition>
      <div className="space-y-6 pb-12">
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-bg-card border border-border-color p-6 rounded-2xl shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2">
              Welcome back, User! <span className="animate-bounce">👋</span>
            </h1>
            <p className="text-sm text-ink-soft mt-1">
              Here is your operations summary for today as <span className="text-accent font-semibold uppercase">{activeRole}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border-color rounded-xl text-xs font-semibold text-ink-soft">
            <Calendar size={14} className="text-accent" />
            <span>{todayStr}</span>
          </div>
        </div>

        {/* 8 KPI Cards Grid - Arranged in 2 rows of 4 cards on desktop */}
        <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StaggerItem>
            <HoverCard className="stat-card">
              <div className="flex justify-between items-start mb-2">
                <span className="stat-card-label">Total Leads</span>
                <div className="p-1.5 rounded-lg bg-accent-soft text-accent">
                  <Users size={18} />
                </div>
              </div>
              <div className="stat-card-value">
                <CountUp value={342} />
              </div>
              <div className="text-[11px] font-bold text-success flex items-center gap-1 mt-1">
                <span>+12% vs last month</span>
              </div>
            </HoverCard>
          </StaggerItem>

          <StaggerItem>
            <HoverCard className="stat-card">
              <div className="flex justify-between items-start mb-2">
                <span className="stat-card-label">Site Visits</span>
                <div className="p-1.5 rounded-lg bg-gold-soft text-gold">
                  <Calendar size={18} />
                </div>
              </div>
              <div className="stat-card-value">
                <CountUp value={58} />
              </div>
              <div className="text-[11px] font-bold text-success flex items-center gap-1 mt-1">
                <span>+8 scheduled today</span>
              </div>
            </HoverCard>
          </StaggerItem>

          <StaggerItem>
            <HoverCard className="stat-card">
              <div className="flex justify-between items-start mb-2">
                <span className="stat-card-label">Follow-Ups</span>
                <div className="p-1.5 rounded-lg bg-danger-soft text-danger">
                  <Phone size={18} />
                </div>
              </div>
              <div className="stat-card-value text-danger">
                <CountUp value={18} />
              </div>
              <div className="text-[11px] font-bold text-danger flex items-center gap-1 mt-1">
                <span>6 marked as urgent</span>
              </div>
            </HoverCard>
          </StaggerItem>

          <StaggerItem>
            <HoverCard className="stat-card">
              <div className="flex justify-between items-start mb-2">
                <span className="stat-card-label">Bookings</span>
                <div className="p-1.5 rounded-lg bg-success-soft text-success">
                  <CheckCircle size={18} />
                </div>
              </div>
              <div className="stat-card-value">
                <CountUp value={12} />
              </div>
              <div className="text-[11px] font-bold text-success flex items-center gap-1 mt-1">
                <span>₹2.4 Cr contract value</span>
              </div>
            </HoverCard>
          </StaggerItem>

          <StaggerItem>
            <HoverCard className="stat-card">
              <div className="flex justify-between items-start mb-2">
                <span className="stat-card-label">Pending Loans</span>
                <div className="p-1.5 rounded-lg bg-purple-soft text-purple">
                  <Landmark size={18} />
                </div>
              </div>
              <div className="stat-card-value">
                <CountUp value={9} />
              </div>
              <div className="text-[11px] font-bold text-ink-soft flex items-center gap-1 mt-1">
                <span>3 under verification</span>
              </div>
            </HoverCard>
          </StaggerItem>

          <StaggerItem>
            <HoverCard className="stat-card">
              <div className="flex justify-between items-start mb-2">
                <span className="stat-card-label">Task Completion</span>
                <div className="p-1.5 rounded-lg bg-accent-soft text-accent">
                  <ListTodo size={18} />
                </div>
              </div>
              <div className="stat-card-value">
                <CountUp value={74} suffix="%" />
              </div>
              <div className="text-[11px] font-bold text-success flex items-center gap-1 mt-1">
                <span>+4% vs last week</span>
              </div>
            </HoverCard>
          </StaggerItem>

          <StaggerItem>
            <HoverCard className="stat-card">
              <div className="flex justify-between items-start mb-2">
                <span className="stat-card-label">Monthly Revenue</span>
                <div className="p-1.5 rounded-lg bg-gold-soft text-gold">
                  <TrendingUp size={18} />
                </div>
              </div>
              <div className="stat-card-value">
                <CountUp value={240} prefix="₹" suffix=" L" />
              </div>
              <div className="text-[11px] font-bold text-success flex items-center gap-1 mt-1">
                <span>92% of monthly target</span>
              </div>
            </HoverCard>
          </StaggerItem>

          <StaggerItem>
            <HoverCard className="stat-card">
              <div className="flex justify-between items-start mb-2">
                <span className="stat-card-label">WhatsApp Sent</span>
                <div className="p-1.5 rounded-lg bg-whatsapp/10 text-whatsapp">
                  <MessageSquare size={18} />
                </div>
              </div>
              <div className="stat-card-value">
                <CountUp value={1245} />
              </div>
              <div className="text-[11px] font-bold text-whatsapp flex items-center gap-1 mt-1">
                <span>Zapier Integration Live</span>
              </div>
            </HoverCard>
          </StaggerItem>
        </StaggerList>

        {/* Widgets Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Today's Follow-ups */}
          <div className="bg-bg-card border border-border-color rounded-2xl p-6 shadow-card flex flex-col h-[520px]">
            <div className="flex justify-between items-center pb-4 border-b border-border-color mb-4 shrink-0">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <PhoneCall size={18} className="text-accent" />
                Today's Follow-ups
              </h3>
              <span className="badge badge-accent">
                {followUps.filter(f => f.status === 'pending').length} Pending
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              <AnimatePresence>
                {followUps.map(followup => (
                  <motion.div 
                    key={followup.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-3.5 border rounded-xl transition-all flex justify-between items-start group ${
                      followup.status === 'completed' 
                        ? 'bg-success-soft/20 border-success/20 opacity-60' 
                        : 'bg-bg-surface border-border-color hover:border-border-hover'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-ink">{followup.name}</span>
                        <span className="text-[10px] font-semibold text-ink-muted flex items-center gap-1">
                          <Clock size={10} /> {followup.time}
                        </span>
                      </div>
                      <p className="text-xs text-ink-soft leading-snug">{followup.description}</p>
                    </div>

                    {followup.status === 'pending' ? (
                      <button
                        onClick={() => handleCompleteFollowUp(followup.id, followup.name)}
                        className="p-1.5 bg-accent-soft hover:bg-accent text-accent hover:text-white rounded-lg transition-all shrink-0 hover:scale-105"
                        title="Mark Completed"
                      >
                        <CheckCircle size={14} />
                      </button>
                    ) : (
                      <span className="text-success text-xs font-semibold flex items-center gap-1 shrink-0">
                        <CheckCircle2 size={12} /> Done
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {followUps.length === 0 && (
                <div className="h-full flex flex-col justify-center items-center text-center p-6 text-ink-muted">
                  <Phone size={36} className="mb-2 opacity-30" />
                  <p className="text-sm font-semibold">No follow-ups scheduled today</p>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Pending Tasks & Add Task Form */}
          <div className="bg-bg-card border border-border-color rounded-2xl p-6 shadow-card flex flex-col h-[520px]">
            <div className="flex justify-between items-center pb-4 border-b border-border-color mb-4 shrink-0">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <ListTodo size={18} className="text-accent" />
                Pending Tasks
              </h3>
              <span className="badge badge-accent">
                {tasks.filter(t => t.status === 'pending').length} Active
              </span>
            </div>

            {/* Task list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin mb-4">
              <AnimatePresence>
                {tasks.map(task => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className={`p-3 border border-border-color rounded-xl flex items-center justify-between transition-all group ${
                      task.status === 'completed' ? 'opacity-40 bg-bg-surface/50' : 'bg-bg-surface hover:border-border-hover'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => handleToggleTask(task.id)}
                        className="w-4.5 h-4.5 rounded border-border-color bg-bg-surface text-accent focus:ring-accent/20 cursor-pointer"
                      />
                      <div className="min-w-0 pr-2">
                        <p className={`text-xs font-semibold text-ink truncate ${
                          task.status === 'completed' ? 'line-through text-ink-muted' : ''
                        }`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`badge text-[9px] uppercase font-extrabold ${getPriorityBadge(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-[9px] font-bold text-ink-muted">Due: {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveTask(task.id)}
                      className="p-1 text-ink-soft hover:text-danger rounded hover:bg-danger-soft transition-all shrink-0"
                      title="Delete Task"
                    >
                      <Trash2 size={13} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {tasks.length === 0 && (
                <div className="h-full flex flex-col justify-center items-center text-center p-6 text-ink-muted">
                  <ListTodo size={36} className="mb-2 opacity-30" />
                  <p className="text-sm font-semibold">No pending tasks. Add one below!</p>
                </div>
              )}
            </div>

            {/* Add Task Inline Form */}
            <form onSubmit={handleAddTask} className="border-t border-border-color pt-4 mt-auto shrink-0 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Create a new pending task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="input-field py-2 text-xs flex-1"
                />
                <button
                  type="submit"
                  className="btn-primary py-2 px-3.5 flex items-center justify-center shrink-0"
                  title="Add Task"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted font-bold">Select Priority:</span>
                <div className="flex gap-1.5">
                  {(['low', 'medium', 'high', 'critical'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTaskPriority(p)}
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase transition-all ${
                        newTaskPriority === p
                          ? p === 'critical' ? 'bg-danger text-white' : 
                            p === 'high' ? 'bg-warning text-white' :
                            p === 'medium' ? 'bg-accent text-white' : 'bg-gold text-white'
                          : 'bg-bg-surface text-ink-soft border border-border-color hover:bg-bg-hover'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Column 3: Recent Activity */}
          <div className="bg-bg-card border border-border-color rounded-2xl p-6 shadow-card flex flex-col h-[520px]">
            <div className="pb-4 border-b border-border-color mb-4 shrink-0">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <Clock size={18} className="text-accent" />
                Recent Activity
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin">
              <div className="relative border-l-2 border-border-color ml-2.5 pl-6 space-y-5 py-1">
                <AnimatePresence>
                  {activities.map((activity, i) => (
                    <motion.div 
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative text-xs leading-normal"
                    >
                      {/* Timeline Node Dot */}
                      <span className={`absolute w-3.5 h-3.5 rounded-full -left-[32px] top-0.5 border-2 border-bg-card flex items-center justify-center
                        ${activity.type === 'booking' ? 'bg-success' : 
                          activity.type === 'negative' ? 'bg-danger' : 
                          activity.type === 'positive' ? 'bg-accent' : 
                          activity.type === 'whatsapp' ? 'bg-whatsapp' :
                          activity.type === 'alert' ? 'bg-warning' : 'bg-ink-muted'}`} 
                      />
                      
                      <span className="text-[10px] font-bold text-ink-muted block">{activity.time}</span>
                      <p className="text-ink font-medium mt-0.5">{activity.text}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  )
}
