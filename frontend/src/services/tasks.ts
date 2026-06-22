import { tasksDb, Task, delay } from './db'

export async function getTasks(): Promise<Task[]> {
  await delay(150);
  return [...tasksDb];
}

export async function createTask(input: Omit<Task, 'id' | 'status'>): Promise<Task> {
  await delay(150);
  const newTask: Task = {
    ...input,
    id: tasksDb.length > 0 ? Math.max(...tasksDb.map(t => t.id)) + 1 : 1,
    status: 'Pending'
  };
  tasksDb.unshift(newTask);
  return newTask;
}

export async function updateTaskStatus(id: number, status: Task['status'], resolutionRemark?: string): Promise<Task | undefined> {
  await delay(100);
  const taskIndex = tasksDb.findIndex(t => t.id === id);
  if (taskIndex === -1) return undefined;

  const task = tasksDb[taskIndex];
  task.status = status;
  if (resolutionRemark !== undefined) {
    task.resolutionRemark = resolutionRemark;
  }
  tasksDb[taskIndex] = { ...task };
  return tasksDb[taskIndex];
}
