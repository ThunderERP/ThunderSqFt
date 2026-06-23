import { useState, useEffect } from 'react'
import PageHeader from '../../shared/components/PageHeader'
import { PageTransition } from '../../shared/components/MotionComponents'
import StatCard from '../../shared/components/StatCard'
import StatusBadge from '../../shared/components/StatusBadge'
import { useAuth } from '../../auth/context/AuthContext'
import { useHR } from '../../../hooks/useHR'

interface EmployeeIncentive {
  name: string
  role: string
  baseSalary: number
  bookings: number
  conversionRate: number
}

function getGradeDetail(conversionRate: number) {
  if (conversionRate >= 12) return { grade: 'A+', label: 'Top Performer', health: 'good' as const }
  if (conversionRate >= 10) return { grade: 'A', label: 'Excellent', health: 'good' as const }
  if (conversionRate >= 7) return { grade: 'B', label: 'Good', health: 'waiting' as const }
  if (conversionRate >= 5) return { grade: 'C', label: 'Average', health: 'waiting' as const }
  return { grade: 'D', label: 'Needs Improvement', health: 'stuck' as const }
}

export default function Performance() {
  const { currentUser, can } = useAuth()
  const { employees, loading, error } = useHR()
  const [incentiveRate, setIncentiveRate] = useState<number>(15000) // ₹15,000 per booking
  const [data, setData] = useState<EmployeeIncentive[]>([])

  useEffect(() => {
    if (employees.length > 0 && data.length === 0) {
      const mapped = employees.map(emp => {
        // Determine bookings based on name
        let bookings = 1
        if (emp.name === 'Rahul Sharma') bookings = 5
        else if (emp.name === 'Priya Mehta') bookings = 4
        else if (emp.name === 'Amit Verma') bookings = 3
        else if (emp.name === 'Sneha Kapoor') bookings = 2
        
        // Base salary mapping
        let baseSalary = 50000
        if (emp.role === 'ceo') baseSalary = 150000
        else if (emp.role === 'manager') baseSalary = 80000
        else if (emp.role === 'leader') baseSalary = 65000
        else if (emp.role === 'sales') baseSalary = 55000
        else if (emp.role === 'banking') baseSalary = 50000
        else if (emp.role === 'admin') baseSalary = 45000
        
        // Conversion rate mapping (using performanceRating * 2.5)
        const conversionRate = parseFloat((emp.performanceRating * 2.5).toFixed(1))
        
        return {
          name: emp.name,
          role: emp.role === 'sales' ? 'Sales Executive' : emp.role === 'banking' ? 'Loan Coordinator' : emp.role.toUpperCase(),
          baseSalary,
          bookings,
          conversionRate
        }
      })
      setData(mapped)
    }
  }, [employees, data.length])

  if (loading && data.length === 0) {
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

  const calculateTotal = (base: number, bookingsCount: number) => {
    return base + bookingsCount * incentiveRate
  }

  // Aggregate stats
  const totalPayout = data.reduce((acc, emp) => acc + calculateTotal(emp.baseSalary, emp.bookings), 0)
  const totalIncentivePaid = data.reduce((acc, emp) => acc + (emp.bookings * incentiveRate), 0)

  const getGradeType = (health: 'good' | 'waiting' | 'stuck') => {
    if (health === 'good') return 'success'
    if (health === 'waiting') return 'warning'
    return 'danger'
  }

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6 text-[var(--ink)]">
        <PageHeader
          title="Performance & Incentives"
          subtitle="Track sales executive conversion scores, performance grades, and compute payouts"
        />

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Incentive Payout"
            value={can('view:commission-data') ? `₹${totalIncentivePaid.toLocaleString('en-IN')}` : '—'}
            subtitle={can('view:commission-data') ? "Aggregate booking commissions" : "Restricted access"}
            valueColor="text-[var(--success)]"
          />

          <StatCard
            label="Total Combined Payout"
            value={can('view:commission-data') ? `₹${totalPayout.toLocaleString('en-IN')}` : '—'}
            subtitle={can('view:commission-data') ? "Combined base salary + incentives" : "Restricted access"}
            valueColor="text-[var(--ink)]"
          />

          {/* Configuration Card styled in line with StatCard but interactive */}
          {can('view:commission-data') ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 flex flex-col justify-between rounded-lg shadow-card text-[var(--ink)]">
              <span className="text-[10px] uppercase font-bold text-[var(--ink-soft)] tracking-wider mb-2">Incentive Commission Rate</span>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-[var(--ink-soft)] font-mono">₹</span>
                  <input
                    type="number"
                    value={incentiveRate}
                    onChange={(e) => setIncentiveRate(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-28 bg-[var(--bg-surface)] text-[var(--ink)] font-bold text-sm px-2 py-1 rounded border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  />
                  <span className="text-xs text-[var(--ink-soft)] ml-1 font-mono">/ Booking</span>
                </div>
                <span className="text-xs text-[var(--ink-muted)] mt-1 font-mono">Configurable commission per conversion</span>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 flex flex-col justify-center rounded-lg shadow-card text-center text-[var(--ink-muted)]">
              <span className="text-xs italic">Incentive configuration restricted</span>
            </div>
          )}
        </div>

        {/* Performance Grid Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[var(--ink)] font-display">Performance & Earnings Calculator</h3>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface)]/30 text-left text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-wider">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4 text-center">Conversion Rate</th>
                    <th className="px-6 py-4 text-center">Grade</th>
                    <th className="px-6 py-4 text-right">Base Salary</th>
                    <th className="px-6 py-4 text-center">Bookings Done</th>
                    {can('view:commission-data') && (
                      <>
                        <th className="px-6 py-4 text-right">Incentive Earned</th>
                        <th className="px-6 py-4 text-right">Total Payout</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {data.map((emp) => {
                    const gradeDetail = getGradeDetail(emp.conversionRate)
                    const incEarned = emp.bookings * incentiveRate
                    const finalPayout = calculateTotal(emp.baseSalary, emp.bookings)

                    return (
                      <tr key={emp.name} className="hover:bg-[var(--bg-hover)]/40 transition-colors">
                        <td className="px-6 py-4 font-semibold text-[var(--ink)]">{emp.name}</td>
                        <td className="px-6 py-4 text-[var(--ink-soft)] font-semibold text-xs">{emp.role}</td>
                        <td className="px-6 py-4 text-center font-bold text-[var(--ink)] font-mono">{emp.conversionRate}%</td>
                        <td className="px-6 py-4 text-center">
                          <StatusBadge status={`${gradeDetail.grade} (${gradeDetail.label})`} domain={getGradeType(gradeDetail.health)} />
                        </td>
                        <td className="px-6 py-4 text-right text-[var(--ink-soft)] font-semibold font-mono">
                          ₹{emp.baseSalary.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-center text-[var(--ink)] font-bold font-mono">
                          {emp.bookings}
                        </td>
                        {can('view:commission-data') && (
                          <>
                            <td className="px-6 py-4 text-right text-[var(--success)] font-bold font-mono">
                              ₹{incEarned.toLocaleString('en-IN')}
                            </td>
                            <td className="px-6 py-4 text-right text-[var(--ink)] font-bold font-mono">
                              ₹{finalPayout.toLocaleString('en-IN')}
                            </td>
                          </>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
