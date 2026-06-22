import { useState } from 'react'
import PageHeader from '../../shared/components/PageHeader'
import StatusBadge from '../../shared/components/StatusBadge'
import { PageTransition } from '../../shared/components/MotionComponents'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import StatCard from '../../shared/components/StatCard'
import { useAuth } from '../../auth/context/AuthContext'
import { scopeRecords } from '../../auth/utils/scopeData'
import { useHR } from '../../../hooks/useHR'

export default function Leave() {
  const { currentUser, can } = useAuth()
  const { employees, leaveRequests, loading, error, changeLeaveStatus, refetch } = useHR()
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All')

  const handleAction = async (id: number, decision: 'Approved' | 'Rejected') => {
    try {
      await changeLeaveStatus(id, decision)
      toast.success(`Leave request ${decision === 'Approved' ? 'approved' : 'rejected'} successfully!`)
      refetch()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update leave status')
    }
  }

  if (loading) {
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

  // Map database leaveRequests to fit scopeRecords (which expects employeeName, from, to)
  const mappedLeaves = leaveRequests.map(l => {
    const employee = employees.find(e => e.id === l.employeeId)
    return {
      ...l,
      employeeName: employee?.name || 'Unknown',
      from: l.fromDate,
      to: l.toDate,
      reason: 'General leave application'
    }
  })

  const scopedLeaves = scopeRecords(mappedLeaves, currentUser)
  const filteredLeaves = scopedLeaves.filter((item) => {
    if (filter === 'All') return true
    return item.status === filter
  })

  // Calcs
  const pendingCount = scopedLeaves.filter(l => l.status === 'Pending').length
  const approvedCount = scopedLeaves.filter(l => l.status === 'Approved').length
  const rejectedCount = scopedLeaves.filter(l => l.status === 'Rejected').length

  return (
    <PageTransition>
      <PageHeader
        title="Leave Management Dashboard"
        subtitle="Approve or decline leave requests from sales and banking staff"
      />

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Pending Approval"
          value={pendingCount.toString()}
          subtitle="Awaiting coordinator action"
          valueColor="text-[var(--status-wait)]"
        />

        <StatCard
          label="Approved Requests"
          value={approvedCount.toString()}
          subtitle="Granted leave days"
          valueColor="text-[var(--status-good)]"
        />

        <StatCard
          label="Rejected Requests"
          value={rejectedCount.toString()}
          subtitle="Declined leave forms"
          valueColor="text-[var(--status-stuck)]"
        />
      </div>

      <div className="space-y-6">
        {/* Custom Tabs */}
        <div className="flex items-center gap-6 border-b border-[var(--hairline)] pb-2 mb-6 overflow-x-auto shrink-0">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`text-sm font-bold pb-2 transition-all relative whitespace-nowrap ${
                filter === opt ? 'text-[var(--accent)] font-extrabold' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              {opt} Requests
              {filter === opt && (
                <motion.div
                  layoutId="activeLeaveFilterTabLine"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Leaves Table */}
        {filteredLeaves.length > 0 ? (
          <div className="neu-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--hairline)] text-left text-xs font-semibold text-[var(--ink-soft)] uppercase tracking-wider">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Leave Type</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="hairline-divide">
                  {filteredLeaves.map((row) => (
                    <tr key={row.id} className="hover:bg-[var(--canvas)]/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[var(--ink)]">{row.employeeName}</td>
                      <td className="px-6 py-4 text-[var(--ink)] font-semibold">{row.leaveType}</td>
                      <td className="px-6 py-4 text-xs font-bold text-[var(--ink-soft)]">
                        <span className="pulse-numeral">{row.from}</span> to <span className="pulse-numeral">{row.to}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[var(--ink-soft)] max-w-xs truncate" title={row.reason}>{row.reason}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.status === 'Pending' ? (
                          can('approve:leave-requests') ? (
                            <div className="flex justify-center gap-4">
                              <button
                                onClick={() => handleAction(row.id, 'Approved')}
                                className="text-xs font-bold text-[var(--status-good)] hover:underline"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(row.id, 'Rejected')}
                                className="text-xs font-bold text-[var(--status-stuck)] hover:underline"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-[var(--ink-soft)] italic font-medium">Pending Review</span>
                          )
                        ) : (
                          <span className="text-xs text-[var(--ink-soft)] italic font-medium">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="neu-card p-12 text-center text-[var(--ink-soft)] text-sm">
            No leave requests found.
          </div>
        )}
      </div>
    </PageTransition>
  )
}
