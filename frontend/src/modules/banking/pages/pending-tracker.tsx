import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../shared/components/PageHeader'
import StatCard from '../../shared/components/StatCard'
import { StaggerContainer, StaggerItem, PageTransition } from '../../shared/components/MotionComponents'
import { useLoanFiles } from '../../../hooks/useLoanFiles'
import { computePendingCounts, computePendingCountsByEmployee, computePendingCountsByBranch } from '../utils/pendingTracker'
import { AlertCircle, Landmark, Clock, FileWarning, ShieldAlert, Award, Sparkles } from 'lucide-react'

export default function PendingTracker() {
  const navigate = useNavigate()
  const { loanFiles, loading } = useLoanFiles()

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-gray-100 shadow-card animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  // Single source of truth calculation
  const overallCounts = computePendingCounts(loanFiles)
  const employeeBreakdown = computePendingCountsByEmployee(loanFiles)
  const branchBreakdown = computePendingCountsByBranch(loanFiles)

  return (
    <PageTransition>
      <PageHeader
        title="Pending Tracker"
        subtitle="Organization-wide stuck cases and pending stage breakdown"
      />

      {/* Hero Stats Bento Grid */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StaggerItem>
          <StatCard
            label="Stuck Cases (>7 days)"
            value={overallCounts.stuckCases.toString()}
            subtitle="Requires immediate attention"
            valueColor="text-[var(--status-stuck)] animate-none"
            onClick={() => navigate('/banking/loans', { state: { stageFilter: 'Stuck' } })}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="PD Pending"
            value={overallCounts.pdPending.toString()}
            subtitle="Personal Discussion checks"
            onClick={() => navigate('/banking/loans', { state: { stageFilter: 'PD Pending' } })}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Documents Pending"
            value={overallCounts.docPending.toString()}
            subtitle="Customer files incomplete"
            onClick={() => navigate('/banking/loans', { state: { stageFilter: 'Doc Pending' } })}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Login Pending"
            value={overallCounts.loginPending.toString()}
            subtitle="Files ready for banking login"
            onClick={() => navigate('/banking/loans', { state: { stageFilter: 'Login Pending' } })}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Sanctions Pending"
            value={overallCounts.sanctionPending.toString()}
            subtitle="Awaiting bank approval"
            onClick={() => navigate('/banking/loans', { state: { stageFilter: 'Sanction Approved' } })}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Registrations Pending"
            value={overallCounts.registrationPending.toString()}
            subtitle="Agreement registration checks"
            onClick={() => navigate('/banking/loans', { state: { stageFilter: 'Reg Pending' } })}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Disbursements Pending"
            value={overallCounts.disbursementPending.toString()}
            subtitle="Awaiting banking payouts"
            onClick={() => navigate('/banking/loans', { state: { stageFilter: 'Disb Pending' } })}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Ops Efficiency"
            value={loanFiles.length > 0 ? `${Math.round(((loanFiles.length - overallCounts.stuckCases) / loanFiles.length) * 100)}%` : '100%'}
            subtitle="Healthy vs Stuck Loan Files ratio"
          />
        </StaggerItem>
      </StaggerContainer>

      {/* Breakdowns Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Breakdown by Branch (Department proxy) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--ink)]">Pending Breakdown by Branch</h3>
          </div>
          <div className="neu-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--hairline)] text-left text-[var(--ink-soft)] uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">Branch</th>
                    <th className="px-4 py-4 text-center">Stuck</th>
                    <th className="px-4 py-4 text-center">PD</th>
                    <th className="px-4 py-4 text-center">Doc</th>
                    <th className="px-4 py-4 text-center">Login</th>
                    <th className="px-4 py-4 text-center">Sanction</th>
                    <th className="px-4 py-4 text-center">Reg</th>
                    <th className="px-4 py-4 text-center">Disb</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(branchBreakdown).map(([branchName, counts]) => (
                    <tr key={branchName} className="border-b border-[var(--hairline)] hover:bg-[var(--canvas)] transition-colors">
                      <td className="px-6 py-4 font-bold text-[var(--ink)]">{branchName}</td>
                      <td className="px-4 py-4 text-center font-extrabold text-[var(--status-stuck)]" style={{ backgroundColor: 'var(--status-stuck-bg)' }}><span className="pulse-numeral">{counts.stuckCases}</span></td>
                      <td className="px-4 py-4 text-center text-[var(--ink-soft)]"><span className="pulse-numeral">{counts.pdPending}</span></td>
                      <td className="px-4 py-4 text-center text-[var(--ink-soft)]"><span className="pulse-numeral">{counts.docPending}</span></td>
                      <td className="px-4 py-4 text-center text-[var(--ink-soft)]"><span className="pulse-numeral">{counts.loginPending}</span></td>
                      <td className="px-4 py-4 text-center text-[var(--ink-soft)]"><span className="pulse-numeral">{counts.sanctionPending}</span></td>
                      <td className="px-4 py-4 text-center text-[var(--ink-soft)]"><span className="pulse-numeral">{counts.registrationPending}</span></td>
                      <td className="px-4 py-4 text-center font-bold text-[var(--status-good)]" style={{ backgroundColor: 'var(--status-good-bg)' }}><span className="pulse-numeral">{counts.disbursementPending}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Breakdown by Coordinator (Employee) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--ink)]">Pending Breakdown by Coordinator</h3>
          </div>
          <div className="neu-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--hairline)] text-left text-[var(--ink-soft)] uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-4 py-4 text-center">Stuck</th>
                    <th className="px-4 py-4 text-center">PD</th>
                    <th className="px-4 py-4 text-center">Doc</th>
                    <th className="px-4 py-4 text-center">Login</th>
                    <th className="px-4 py-4 text-center">Sanction</th>
                    <th className="px-4 py-4 text-center">Reg</th>
                    <th className="px-4 py-4 text-center">Disb</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(employeeBreakdown).map(([employeeName, counts]) => (
                    <tr key={employeeName} className="border-b border-[var(--hairline)] hover:bg-[var(--canvas)] transition-colors">
                      <td className="px-6 py-4 font-bold text-[var(--ink)]">{employeeName}</td>
                      <td className="px-4 py-4 text-center font-extrabold text-[var(--status-stuck)]" style={{ backgroundColor: 'var(--status-stuck-bg)' }}><span className="pulse-numeral">{counts.stuckCases}</span></td>
                      <td className="px-4 py-4 text-center text-[var(--ink-soft)]"><span className="pulse-numeral">{counts.pdPending}</span></td>
                      <td className="px-4 py-4 text-center text-[var(--ink-soft)]"><span className="pulse-numeral">{counts.docPending}</span></td>
                      <td className="px-4 py-4 text-center text-[var(--ink-soft)]"><span className="pulse-numeral">{counts.loginPending}</span></td>
                      <td className="px-4 py-4 text-center text-[var(--ink-soft)]"><span className="pulse-numeral">{counts.sanctionPending}</span></td>
                      <td className="px-4 py-4 text-center text-[var(--ink-soft)]"><span className="pulse-numeral">{counts.registrationPending}</span></td>
                      <td className="px-4 py-4 text-center font-bold text-[var(--status-good)]" style={{ backgroundColor: 'var(--status-good-bg)' }}><span className="pulse-numeral">{counts.disbursementPending}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  )
}
