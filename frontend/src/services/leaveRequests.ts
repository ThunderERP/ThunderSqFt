import { leaveRequestsDb, LeaveRequest, delay } from './db'

export async function getLeaveRequests(): Promise<LeaveRequest[]> {
  await delay(150);
  return [...leaveRequestsDb];
}

export async function createLeaveRequest(input: Omit<LeaveRequest, 'id' | 'status'>): Promise<LeaveRequest> {
  await delay(150);
  const newLeave: LeaveRequest = {
    ...input,
    id: leaveRequestsDb.length > 0 ? Math.max(...leaveRequestsDb.map(l => l.id)) + 1 : 1,
    status: 'Pending'
  };
  leaveRequestsDb.unshift(newLeave);
  return newLeave;
}

export async function updateLeaveStatus(id: number, status: LeaveRequest['status']): Promise<LeaveRequest | undefined> {
  await delay(150);
  const leaveIndex = leaveRequestsDb.findIndex(l => l.id === id);
  if (leaveIndex === -1) return undefined;

  const leave = leaveRequestsDb[leaveIndex];
  leave.status = status;
  leaveRequestsDb[leaveIndex] = { ...leave };
  return leaveRequestsDb[leaveIndex];
}
