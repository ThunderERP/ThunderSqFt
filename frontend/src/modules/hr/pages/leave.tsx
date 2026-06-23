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
      <div className="space-y-6 p-6 max-w-[1600px] mx-auto text-[var(--ink)]">
        <PageHeader
          title="Leave Management Dashboard"
          subtitle="Approve or decline leave requests from sales and banking staff"
        />

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Pending Approval"
            value={pendingCount.toString()}
            subtitle="Awaiting coordinator action"
            valueColor="text-[var(--warning)]"
          />

          <StatCard
            label="Approved Requests"
            value={approvedCount.toString()}
            subtitle="Granted leave days"
            valueColor="text-[var(--success)]"
          />

          <StatCard
            label="Rejected Requests"
            value={rejectedCount.toString()}
            subtitle="Declined leave forms"
            valueColor="text-[var(--danger)]"
          />
        </div>

        <div className="space-y-6">
          {/* Custom Tabs */}
          <div className="flex items-center gap-6 border-b border-[var(--border-color)] pb-2 overflow-x-auto shrink-0">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`text-sm font-bold pb-2 transition-all relative whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded ${
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
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface)]/30 text-left text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-wider">
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Leave Type</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Reason</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {filteredLeaves.map((row) => (
                      <tr key={row.id} className="hover:bg-[var(--bg-hover)]/40 transition-colors">
                        <td className="px-6 py-4 font-semibold text-[var(--ink)]">{row.employeeName}</td>
                        <td className="px-6 py-4 text-[var(--ink-soft)] font-semibold">{row.leaveType}</td>
                        <td className="px-6 py-4 text-xs text-[var(--ink-soft)] font-mono">
                          <span>{row.from}</span> to <span>{row.to}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-[var(--ink-soft)] max-w-xs truncate font-sans" title={row.reason}>{row.reason}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.status === 'Pending' ? (
                            can('approve:leave-requests') ? (
                              <div className="flex justify-center gap-4">
                                <button
                                  onClick={() => handleAction(row.id, 'Approved')}
                                  className="text-xs font-bold text-[var(--success)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--success)] rounded px-1"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleAction(row.id, 'Rejected')}
                                  className="text-xs font-bold text-[var(--danger)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)] rounded px-1"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-[var(--ink-muted)] italic font-semibold font-mono">Pending Review</span>
                            )
                          ) : (
                            <span className="text-xs text-[var(--ink-muted)] italic font-semibold font-mono">Resolved</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center text-[var(--ink-soft)] text-sm rounded-xl">
              No leave requests found.
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
