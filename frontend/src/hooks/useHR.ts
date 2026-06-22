import { useState, useEffect, useCallback } from 'react'
import { AttendanceRecord, LeaveRequest, Employee } from '../services/db'
import { getEmployees } from '../services/employees'
import { getAttendance } from '../services/attendance'
import { getLeaveRequests, createLeaveRequest, updateLeaveStatus } from '../services/leaveRequests'

export function useHR() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHRData = useCallback(async () => {
    try {
      setLoading(true)
      const [empData, attData, leaveData] = await Promise.all([
        getEmployees(),
        getAttendance(),
        getLeaveRequests()
      ])
      setEmployees(empData)
      setAttendance(attData)
      setLeaveRequests(leaveData)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch HR data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHRData()
  }, [fetchHRData])

  const applyLeave = async (input: Omit<LeaveRequest, 'id' | 'status'>) => {
    const newLeave = await createLeaveRequest(input);
    setLeaveRequests(prev => [newLeave, ...prev]);
    return newLeave;
  }

  const changeLeaveStatus = async (id: number, status: LeaveRequest['status']) => {
    const updated = await updateLeaveStatus(id, status);
    if (updated) {
      setLeaveRequests(prev => prev.map(l => l.id === id ? updated : l));
    }
    return updated;
  }

  return { employees, attendance, leaveRequests, loading, error, refetch: fetchHRData, applyLeave, changeLeaveStatus }
}
