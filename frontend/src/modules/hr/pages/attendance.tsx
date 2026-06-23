import { useState, useEffect } from 'react'
import PageHeader from '../../shared/components/PageHeader'
import { PageTransition } from '../../shared/components/MotionComponents'
import StatCard from '../../shared/components/StatCard'
import { useHR } from '../../../hooks/useHR'

interface AttendanceGridRecord {
  employeeName: string
  role: string
  days: Record<number, 'Present' | 'Absent' | 'Half-day' | 'Off'>
}

export default function Attendance() {
  const { employees, loading, error } = useHR()
  const [attendance, setAttendance] = useState<AttendanceGridRecord[]>([])
  const [selectedDay, setSelectedDay] = useState(19) // Today is June 19

  useEffect(() => {
    if (employees.length > 0 && attendance.length === 0) {
      const generated = employees.map((emp) => {
        const record: AttendanceGridRecord = {
          employeeName: emp.name,
          role: emp.role === 'sales' ? 'Sales Executive' : emp.role === 'banking' ? 'Loan Coordinator' : emp.role.toUpperCase(),
          days: {}
        }

        for (let day = 1; day <= 30; day++) {
          const date = new Date(2026, 5, day) // June is 5 (0-indexed)
          if (date.getDay() === 0) {
            record.days[day] = 'Off'
            continue
          }

          // Seeded check-in status
          const rand = Math.random()
          if (rand > 0.93) {
            record.days[day] = 'Absent'
          } else if (rand > 0.86) {
            record.days[day] = 'Half-day'
          } else {
            record.days[day] = 'Present'
          }
        }

        return record
      })
      setAttendance(generated)
    }
  }, [employees, attendance.length])

  if (loading && attendance.length === 0) {
    return (
      <div className="w-full space-y-6">
        <div className="h-10 bg-[var(--bg-surface)] rounded w-1/3 animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] animate-pulse"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center text-[var(--danger)] font-semibold rounded-lg">
        {error}
      </div>
    )
  }

  // Calculate stats for selectedDay
  const presentCount = attendance.filter(r => r.days[selectedDay] === 'Present').length
  const absentCount = attendance.filter(r => r.days[selectedDay] === 'Absent').length
  const halfDayCount = attendance.filter(r => r.days[selectedDay] === 'Half-day').length

  const handleStatusChange = (employeeName: string, day: number, newStatus: 'Present' | 'Absent' | 'Half-day' | 'Off') => {
    setAttendance(prev =>
      prev.map(r =>
        r.employeeName === employeeName
          ? { ...r, days: { ...r.days, [day]: newStatus } }
          : r
      )
    )
  }

  const getStatusStyles = (status: 'Present' | 'Absent' | 'Half-day' | 'Off') => {
    if (status === 'Off') {
      return { backgroundColor: 'var(--bg-surface)', color: 'var(--ink-muted)', borderColor: 'var(--border-color)' }
    }
    if (status === 'Present') {
      return { backgroundColor: 'var(--success-soft)', color: 'var(--success)', borderColor: 'rgba(46, 207, 139, 0.2)' }
    }
    if (status === 'Half-day') {
      return { backgroundColor: 'var(--warning-soft)', color: 'var(--warning)', borderColor: 'rgba(242, 184, 75, 0.2)' }
    }
    // Absent
    return { backgroundColor: 'var(--danger-soft)', color: 'var(--danger)', borderColor: 'rgba(255, 107, 107, 0.2)' }
  }

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6 text-[var(--ink)]">
        <PageHeader
          title="Employee Daily Attendance"
          subtitle="Manage check-ins, leaves, and daily working hours grid"
        />

        {/* Stats row for Selected Day */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label={`Present Today (Day ${selectedDay})`}
            value={presentCount.toString()}
            subtitle="Checked-in employees"
            valueColor="text-[var(--success)]"
          />

          <StatCard
            label="Absent Today"
            value={absentCount.toString()}
            subtitle="Awaiting notifications or leaves"
            valueColor="text-[var(--danger)]"
          />

          <StatCard
            label="Half-day Today"
            value={halfDayCount.toString()}
            subtitle="Partial shifts recorded"
            valueColor="text-[var(--warning)]"
          />
        </div>

        {/* Attendance Board Grid */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-lg shadow-card overflow-x-auto">
          <div className="min-w-[1000px] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[var(--ink)] text-sm font-display uppercase tracking-wider">
                June 2026 Monthly Grid
              </h3>
              <div className="flex gap-4 text-xs font-bold text-[var(--ink-soft)] font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[var(--success-soft)] border border-[var(--success)]/20"></span> Present
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[var(--warning-soft)] border border-[var(--warning)]/20"></span> Half-day
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[var(--danger-soft)] border border-[var(--danger)]/20"></span> Absent
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]"></span> Off
                </span>
              </div>
            </div>

            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-left text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-wider">
                  <th className="py-3 pr-4 text-left w-48 font-display">Employee</th>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                    <th
                      key={d}
                      onClick={() => setSelectedDay(d)}
                      className={`py-2 w-8 cursor-pointer hover:bg-[var(--accent-soft)] rounded transition-all text-center font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                        selectedDay === d ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-extrabold border border-[var(--accent)]/30' : 'text-[var(--ink-soft)]'
                      }`}
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {attendance.map((record) => (
                  <tr key={record.employeeName} className="hover:bg-[var(--bg-hover)]/40 transition-colors text-xs text-left">
                    <td className="py-4 pr-4">
                      <p className="font-semibold text-[var(--ink)] leading-tight">{record.employeeName}</p>
                      <p className="text-[10px] text-[var(--ink-soft)] mt-0.5 font-mono">{record.role}</p>
                    </td>
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
                      const status = record.days[d]
                      const cellStyles = getStatusStyles(status)
                      return (
                        <td key={d} className="py-4 w-8 text-center">
                          <select
                            value={status}
                            onChange={(e) => handleStatusChange(record.employeeName, d, e.target.value as any)}
                            className="w-6 h-6 rounded-md font-bold text-[9px] appearance-none text-center cursor-pointer transition-colors border focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/20"
                            style={cellStyles}
                            title={`${record.employeeName} - Day ${d}: ${status}`}
                          >
                            <option value="Present">P</option>
                            <option value="Absent">A</option>
                            <option value="Half-day">H</option>
                            <option value="Off">O</option>
                          </select>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
