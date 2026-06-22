import { useState, useEffect } from 'react'
import PageHeader from '../../shared/components/PageHeader'
import { PageTransition } from '../../shared/components/MotionComponents'
import { getPulseColor } from '../../shared/utils/statusColor'
import StatCard from '../../shared/components/StatCard'
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
        <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-gray-100 shadow-card animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 rounded-2xl bg-white border border-gray-100 shadow-card animate-pulse"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="neu-card p-12 text-center text-red-600 font-semibold">
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

  return (
    <PageTransition>
      <PageHeader
        title="Performance & Incentives"
        subtitle="Track sales executive conversion scores, performance grades, and compute payouts"
      />

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total Incentive Payout"
          value={can('view:commission-data') ? `₹${totalIncentivePaid.toLocaleString('en-IN')}` : '—'}
          subtitle={can('view:commission-data') ? "Aggregate booking commissions" : "Restricted access"}
          valueColor="text-[var(--status-good)]"
          pulseNumeral={false}
        />

        <StatCard
          label="Total Combined Payout"
          value={can('view:commission-data') ? `₹${totalPayout.toLocaleString('en-IN')}` : '—'}
          subtitle={can('view:commission-data') ? "Combined base salary + incentives" : "Restricted access"}
          valueColor="text-[var(--ink)]"
          pulseNumeral={false}
        />

        {/* Configuration Card styled in line with StatCard but interactive */}
        {can('view:commission-data') && (
          <div className="neu-card p-6 flex flex-col justify-between bg-white">
            <span className="text-xs uppercase font-semibold text-[var(--ink-soft)] tracking-wider mb-2">Incentive Commission Rate</span>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-[var(--ink-soft)]">₹</span>
                <input
                  type="number"
                  value={incentiveRate}
                  onChange={(e) => setIncentiveRate(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-24 bg-[var(--canvas)] text-[var(--ink)] font-bold text-sm px-2 py-1 rounded border border-[var(--hairline)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] pulse-numeral"
                />
                <span className="text-xs text-[var(--ink-soft)] ml-1">/ Booking</span>
              </div>
              <span className="text-xs text-[var(--ink-soft)] mt-1">Configurable commission per conversion</span>
            </div>
          </div>
        )}
      </div>

      {/* Performance Grid Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[var(--ink)]">Performance & Earnings Calculator</h3>

        <div className="neu-card overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--hairline)] text-left text-xs font-semibold text-[var(--ink-soft)] uppercase tracking-wider">
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
              <tbody className="hairline-divide">
                {data.map((emp) => {
                  const gradeDetail = getGradeDetail(emp.conversionRate)
                  const colors = getPulseColor(gradeDetail.health)
                  const incEarned = emp.bookings * incentiveRate
                  const finalPayout = calculateTotal(emp.baseSalary, emp.bookings)

                  return (
                    <tr key={emp.name} className="hover:bg-[var(--canvas)]/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[var(--ink)]">{emp.name}</td>
                      <td className="px-6 py-4 text-[var(--ink-soft)] font-medium text-xs">{emp.role}</td>
                      <td className="px-6 py-4 text-center font-bold text-[var(--ink)]"><span className="pulse-numeral">{emp.conversionRate}%</span></td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className="px-2.5 py-0.5 rounded-lg text-xs font-bold inline-block animate-none"
                          style={{ backgroundColor: colors.bg, color: colors.color }}
                        >
                          {gradeDetail.grade} ({gradeDetail.label})
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-[var(--ink-soft)] font-medium">
                        ₹<span className="pulse-numeral">{emp.baseSalary.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-[var(--ink)] font-bold">
                        <span className="pulse-numeral">{emp.bookings}</span>
                      </td>
                      {can('view:commission-data') && (
                        <>
                          <td className="px-6 py-4 text-right text-[var(--status-good)] font-bold">
                            ₹<span className="pulse-numeral">{incEarned.toLocaleString('en-IN')}</span>
                          </td>
                          <td className="px-6 py-4 text-right text-[var(--ink)] font-extrabold">
                            ₹<span className="pulse-numeral">{finalPayout.toLocaleString('en-IN')}</span>
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
    </PageTransition>
  )
}
