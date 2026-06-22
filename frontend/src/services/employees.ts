import { employeesDb, Employee, delay } from './db'

export async function getEmployees(): Promise<Employee[]> {
  await delay(150);
  return [...employeesDb];
}
