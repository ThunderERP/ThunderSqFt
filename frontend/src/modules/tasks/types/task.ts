export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue'

export interface Task {
  id: number
  title: string
  assignedTo: string
  dueDate: string
  priority: TaskPriority
  remarks: string
  status: TaskStatus
}

export function getTaskHealth(status: TaskStatus): 'good' | 'waiting' | 'stuck' {
  if (status === 'Completed') return 'good'
  if (status === 'Overdue') return 'stuck'
  return 'waiting'
}

