import { useState, useCallback, useEffect, useRef } from 'react'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import PageHeader from '../../shared/components/PageHeader'
import StatCard from '../../shared/components/StatCard'
import StatusBadge from '../../shared/components/StatusBadge'
import DataTable from '../../shared/components/DataTable'
import { Plus, Edit, Trash2, X, ListTodo, Clock, CheckCircle2, AlertOctagon, Zap, ChevronDown, AlertTriangle, Check } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types & seed data                                                 */
/* ------------------------------------------------------------------ */
interface Task {
  id: string
  title: string
  assignee: string
  dueDate: string
  priority: string
  status: string
  progress: number
  remarks?: string
}

const initialTasks: Task[] = [
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

const TEAM_MEMBERS = ['Rohit Verma', 'Anita Joshi', 'Sanjay Gupta', 'Meera Nair', 'Deepak Rao']

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}
const avatarColors = [
  'bg-blue-600/30 text-blue-400 border-blue-500/20',
  'bg-emerald-600/30 text-emerald-400 border-emerald-500/20',
  'bg-purple-600/30 text-purple-400 border-purple-500/20',
  'bg-orange-600/30 text-orange-400 border-orange-500/20',
  'bg-pink-600/30 text-pink-400 border-pink-500/20'
]
function getAvatarColor(name: string) { 
  let h = 0; 
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h); 
  return avatarColors[Math.abs(h) % avatarColors.length]; 
}

const blankForm = (): Omit<Task, 'id'> => ({
  title: '',
  assignee: '',
  dueDate: '',
  priority: 'medium',
  status: 'pending',
  progress: 0,
  remarks: '',
})

/* ------------------------------------------------------------------ */
/*  Toast component (inline)                                          */
/* ------------------------------------------------------------------ */
interface ToastData {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

function Toast({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const color = toast.type === 'success'
    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
    : toast.type === 'error'
      ? 'border-red-500/40 bg-red-500/10 text-red-400'
      : 'border-blue-500/40 bg-blue-500/10 text-blue-400'

  const Icon = toast.type === 'success' ? Check : toast.type === 'error' ? AlertTriangle : Check

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${color} shadow-lg backdrop-blur-sm animate-slide-in-right`}>
      <Icon size={16} />
      <span className="text-sm font-medium">{toast.message}</span>
      <button onClick={onDismiss} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Delete-confirmation modal                                         */
/* ------------------------------------------------------------------ */
function DeleteConfirmModal({ taskTitle, onConfirm, onCancel }: { taskTitle: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={onCancel} />
      <div className="fixed z-[70] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl p-6 space-y-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--ink)] font-display">Delete Task</h3>
            <p className="text-sm text-[var(--ink-soft)] mt-1">
              Are you sure you want to delete <strong className="text-[var(--ink)]">"{taskTitle}"</strong>? This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-[var(--ink-soft)] bg-transparent border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [form, setForm] = useState<Omit<Task, 'id'>>(blankForm())
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({})
  const nextId = useRef(initialTasks.length + 1)
  const titleInputRef = useRef<HTMLInputElement>(null)

  /* ---- toast helper ---- */
  const addToast = useCallback((message: string, type: ToastData['type'] = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }, [])
  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  /* ---- slide-over open/close helpers ---- */
  const openAddPanel = useCallback(() => {
    setEditingTask(null)
    setForm(blankForm())
    setFormErrors({})
    setIsSlideOverOpen(true)
    setTimeout(() => titleInputRef.current?.focus(), 150)
  }, [])

  const openEditPanel = useCallback((task: Task) => {
    setEditingTask(task)
    setForm({
      title: task.title,
      assignee: task.assignee,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      progress: task.progress,
      remarks: task.remarks || '',
    })
    setFormErrors({})
    setIsSlideOverOpen(true)
    setTimeout(() => titleInputRef.current?.focus(), 150)
  }, [])

  const closePanel = useCallback(() => {
    setIsSlideOverOpen(false)
    setEditingTask(null)
    setForm(blankForm())
    setFormErrors({})
  }, [])

  /* ---- form field updater ---- */
  const updateField = useCallback(<K extends keyof Omit<Task, 'id'>>(key: K, value: Omit<Task, 'id'>[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setFormErrors(prev => ({ ...prev, [key]: false }))
  }, [])

  /* ---- validate ---- */
  const validate = (): boolean => {
    const errors: Record<string, boolean> = {}
    if (!form.title.trim()) errors.title = true
    if (!form.assignee || form.assignee === '') errors.assignee = true
    if (!form.dueDate) errors.dueDate = true
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  /* ---- save (add or edit) ---- */
  const handleSave = useCallback(() => {
    if (!validate()) return

    if (editingTask) {
      // Edit existing
      setTasks(prev =>
        prev.map(t =>
          t.id === editingTask.id
            ? { ...t, ...form }
            : t
        )
      )
      addToast(`Task "${form.title}" updated successfully`)
    } else {
      // Add new
      const newTask: Task = {
        id: String(nextId.current++),
        ...form,
      }
      setTasks(prev => [newTask, ...prev])
      addToast(`Task "${form.title}" added successfully`)
    }

    closePanel()
  }, [editingTask, form, addToast, closePanel])

  /* ---- delete ---- */
  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return
    setTasks(prev => prev.filter(t => t.id !== deleteTarget.id))
    addToast(`Task "${deleteTarget.title}" deleted`, 'error')
    setDeleteTarget(null)
  }, [deleteTarget, addToast])

  /* ---- helpers ---- */
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-[var(--success)]'
    if (progress >= 60) return 'bg-[var(--accent)]'
    if (progress >= 30) return 'bg-[var(--warning)]'
    return 'bg-[var(--ink-muted)]'
  }

  // Live computed stats
  const totalTasks = tasks.length
  const pendingTasks = tasks.filter(t => t.status === 'pending').length
  const inProgressTasks = tasks.filter(t => t.status === 'in progress').length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const overdueTasks = tasks.filter(t => t.status === 'overdue').length

  /* ---- table columns ---- */
  const columns = [
    {
      key: 'title',
      label: 'Task',
      render: (item: any) => <span className="font-semibold text-[var(--ink)]">{item.title}</span>
    },
    {
      key: 'assignee',
      label: 'Assigned To',
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-bold font-mono ${getAvatarColor(item.assignee)}`}>
            {getInitials(item.assignee)}
          </span>
          <span className="text-[var(--ink-soft)]">{item.assignee}</span>
        </div>
      )
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (item: any) => (
        <StatusBadge status={item.dueDate} domain={item.status === 'overdue' ? 'priority' : 'neutral'} />
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (item: any) => (
        <StatusBadge status={item.priority} domain="priority" />
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: any) => (
        <StatusBadge status={item.status} />
      )
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (item: any) => (
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="flex-1 bg-[var(--bg-body)] rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-1.5 rounded-full ${getProgressColor(item.progress)}`}
              style={{ width: `${item.progress}%` }}
            ></div>
          </div>
          <span className="text-xs font-mono text-[var(--ink-soft)] w-8 text-right">{item.progress}%</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (item: any) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); openEditPanel(item) }}
            className="p-1.5 rounded-md text-[var(--ink-soft)] hover:text-[var(--accent)] hover:bg-[var(--bg-surface)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            title="Edit Task"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(item) }}
            className="p-1.5 rounded-md text-[var(--ink-soft)] hover:text-[var(--danger)] hover:bg-[var(--bg-surface)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)]"
            title="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ]

  const filterOptions = [
    { label: 'status', options: ['All Statuses', 'Pending', 'In Progress', 'Overdue', 'Completed'] },
    { label: 'priority', options: ['All Priorities', 'Low', 'Medium', 'High', 'Critical'] }
  ]

  /* ---- input class helper ---- */
  const inputCls = (hasError: boolean) =>
    `w-full bg-[var(--bg-surface)] border ${hasError ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[var(--border-color)]'} text-[var(--ink)] placeholder-[var(--ink-muted)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all`

  const selectCls = (hasError: boolean) =>
    `w-full bg-[var(--bg-surface)] border ${hasError ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[var(--border-color)]'} text-[var(--ink)] rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer transition-all`

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6 text-[var(--ink)]">
        {/* Header */}
        <PageHeader 
          title="Tasks"
          subtitle="Track and manage daily tasks"
          actions={
            <button 
              onClick={openAddPanel}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <Plus size={16} /> Add Task
            </button>
          }
        />

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          <StaggerItem>
            <StatCard label="Total Tasks" value={String(totalTasks)} subtitle="Overall count" valueColor="text-[var(--ink)]" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Pending" value={String(pendingTasks)} subtitle="Awaiting start" valueColor="text-[var(--warning)]" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="In Progress" value={String(inProgressTasks)} subtitle="Active work" valueColor="text-[var(--accent)]" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Completed" value={String(completedTasks)} subtitle="Finished tasks" valueColor="text-[var(--success)]" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Overdue" value={String(overdueTasks)} subtitle="Missed due dates" valueColor="text-[var(--danger)]" />
          </StaggerItem>
        </StaggerContainer>

        {/* Table */}
        <DataTable 
          columns={columns}
          data={tasks}
          searchPlaceholder="Search tasks..."
          searchKey="title"
          filterOptions={filterOptions}
        />
      </div>

      {/* Slide-over Panel */}
      {isSlideOverOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={closePanel}
          />
          <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-[var(--bg-card)] border-l border-[var(--border-color)] shadow-2xl z-50 flex flex-col transition-all animate-slide-in-right">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
              <h2 className="text-xl font-bold text-[var(--ink)] font-display">
                {editingTask ? 'Edit Task' : 'Add Task'}
              </h2>
              <button 
                onClick={closePanel}
                className="p-1.5 border border-[var(--border-color)] hover:bg-[var(--bg-surface)] rounded-full transition-colors text-[var(--ink-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                {/* Task Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Task Name *</label>
                  <input 
                    ref={titleInputRef}
                    type="text" 
                    placeholder="Task description"
                    value={form.title}
                    onChange={e => updateField('title', e.target.value)}
                    className={inputCls(!!formErrors.title)}
                  />
                  {formErrors.title && <p className="text-red-400 text-xs mt-1">Task name is required</p>}
                </div>

                {/* Assigned To */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Assigned To *</label>
                  <div className="relative">
                    <select
                      value={form.assignee}
                      onChange={e => updateField('assignee', e.target.value)}
                      className={selectCls(!!formErrors.assignee)}
                    >
                      <option value="">Select user</option>
                      {TEAM_MEMBERS.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] pointer-events-none" />
                  </div>
                  {formErrors.assignee && <p className="text-red-400 text-xs mt-1">Assignee is required</p>}
                </div>
                
                {/* Due Date + Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Due Date *</label>
                    <input 
                      type="date"
                      value={form.dueDate}
                      onChange={e => updateField('dueDate', e.target.value)}
                      className={inputCls(!!formErrors.dueDate)}
                    />
                    {formErrors.dueDate && <p className="text-red-400 text-xs mt-1">Due date is required</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Priority</label>
                    <div className="relative">
                      <select
                        value={form.priority}
                        onChange={e => updateField('priority', e.target.value)}
                        className={selectCls(false)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Status + Progress */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Status</label>
                    <div className="relative">
                      <select
                        value={form.status}
                        onChange={e => updateField('status', e.target.value)}
                        className={selectCls(false)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Completion %</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={form.progress}
                      onChange={e => updateField('progress', Math.min(100, Math.max(0, Number(e.target.value))))}
                      className={inputCls(false)}
                    />
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Remarks</label>
                  <textarea
                    value={form.remarks}
                    onChange={e => updateField('remarks', e.target.value)}
                    placeholder="Optional notes..."
                    className={`${inputCls(false)} min-h-[120px] resize-y`}
                  />
                </div>
              </div>
            </div>
            
            {/* Footer buttons */}
            <div className="p-4 border-t border-[var(--border-color)] flex gap-3 mt-auto bg-[var(--bg-surface)]/50">
              <button 
                onClick={handleSave} 
                className="flex-[2] py-2.5 text-sm font-semibold bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {editingTask ? 'Save Changes' : 'Add Task'}
              </button>
              <button 
                onClick={closePanel} 
                className="flex-1 py-2.5 text-sm font-semibold text-[var(--ink-soft)] bg-transparent border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          taskTitle={deleteTarget.title}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-[80] space-y-3">
          {toasts.map(toast => (
            <Toast key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
          ))}
        </div>
      )}
    </PageTransition>
  )
}
