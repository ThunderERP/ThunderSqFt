import { attendanceDb, AttendanceRecord, delay } from './db'

export async function getAttendance(): Promise<AttendanceRecord[]> {
  await delay(150);
  return [...attendanceDb];
}
