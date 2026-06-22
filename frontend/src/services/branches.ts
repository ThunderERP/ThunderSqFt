import { branchesDb, Branch, delay } from './db'

export async function getBranches(): Promise<Branch[]> {
  await delay(150);
  return [...branchesDb];
}
