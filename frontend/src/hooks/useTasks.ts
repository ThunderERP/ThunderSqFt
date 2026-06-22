import { useState, useEffect, useCallback } from 'react'
import { Task } from '../services/db'
import { getTasks, createTask, updateTaskStatus } from '../services/tasks'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTasks()
      setTasks(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = async (input: Omit<Task, 'id' | 'status'>) => {
    const newTask = await createTask(input);
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }

  const changeTaskStatus = async (id: number, status: Task['status'], resolutionRemark?: string) => {
    const updated = await updateTaskStatus(id, status, resolutionRemark);
    if (updated) {
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    }
    return updated;
  }

  return { tasks, loading, error, refetch: fetchTasks, addTask, changeTaskStatus }
}
