import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../shared/components/PageHeader'
import StatCard from '../../shared/components/StatCard'
import DataTable from '../../shared/components/DataTable'
import StatusBadge from '../../shared/components/StatusBadge'
import { StaggerContainer, StaggerItem, PageTransition, ScrollRevealMotion } from '../../shared/components/MotionComponents'
import { useLoanFiles } from '../../../hooks/useLoanFiles'
import { computePendingCounts } from '../utils/pendingTracker'
import { employeesDb } from '../../../services/db'

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

  // Map and sort pending files by priority (High/Medium/Low)
  const pendingFiles = (loanFiles || [])
    .filter(f => f.stage !== 'Disbursed')
    .map(f => {
      const isStuck = f.id === 1; // matching computePendingCounts stuck logic
      const isMedium = f.stage === 'Doc Pending' || f.stage === 'Credit Query';
      const priority = isStuck ? 'High' : isMedium ? 'Medium' : 'Low';
      const priorityValue = isStuck ? 3 : isMedium ? 2 : 1;
      
      const employee = employeesDb.find(e => e.name === f.loanCoordinatorId);
      const branchName = employee?.branchId || 'Mumbai';

      return {
        ...f,
        branch: branchName,
        priority,
        priorityValue
      };
    })
    .sort((a, b) => b.priorityValue - a.priorityValue);

  const columns = [
    { key: 'id', label: 'File ID', render: (item: any) => <span className="font-mono font-medium text-[var(--accent)]">#{item.id}</span> },
    { key: 'customerName', label: 'Customer', render: (item: any) => <span className="font-medium text-[var(--ink)]">{item.customerName}</span> },
    { key: 'projectName', label: 'Project', render: (item: any) => <span className="text-[var(--ink-soft)]">{item.projectName}</span> },
    { key: 'loanAmount', label: 'Amount', render: (item: any) => <span className="font-mono font-bold text-[var(--gold)]">₹{item.loanAmount.toLocaleString('en-IN')}</span> },
    { key: 'stage', label: 'Stage', render: (item: any) => <StatusBadge status={item.stage} /> },
    { key: 'loanCoordinatorId', label: 'Coordinator', render: (item: any) => <span className="text-[var(--ink-soft)]">{item.loanCoordinatorId}</span> },
    { key: 'branch', label: 'Branch', render: (item: any) => <span className="text-[var(--ink-soft)]">{item.branch}</span> },
    { key: 'priority', label: 'Priority', render: (item: any) => <StatusBadge status={item.priority} domain="priority" /> }
  ]

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
            valueColor="text-[var(--danger)] animate-none"
            onClick={() => navigate('/banking/loans', { state: { stageFilter: 'Stuck' } })}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="PD Pending"
            value={overallCounts.pdPending.toString()}
            subtitle="Personal Discussion checks"
            valueColor="text-[var(--warning)]"
            onClick={() => navigate('/banking/loans', { state: { stageFilter: 'PD Pending' } })}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Documents Pending"
            value={overallCounts.docPending.toString()}
            subtitle="Customer files incomplete"
            valueColor="text-[var(--warning)]"
            onClick={() => navigate('/banking/loans', { state: { stageFilter: 'Doc Pending' } })}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Login Pending"
            value={overallCounts.loginPending.toString()}
            subtitle="Files ready for banking login"
            valueColor="text-[var(--accent)]"
            onClick={() => navigate('/banking/loans', { state: { stageFilter: 'Login Pending' } })}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Sanctions Pending"
            value={overallCounts.sanctionPending.toString()}
            subtitle="Awaiting bank approval"
            valueColor="text-[var(--success)]"
            onClick={() => navigate('/banking/loans', { state: { stageFilter: 'Sanction Approved' } })}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Registrations Pending"
            value={overallCounts.registrationPending.toString()}
            subtitle="Agreement registration checks"
            valueColor="text-[var(--accent)]"
            onClick={() => navigate('/banking/loans', { state: { stageFilter: 'Reg Pending' } })}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Disbursements Pending"
            value={overallCounts.disbursementPending.toString()}
            subtitle="Awaiting banking payouts"
            valueColor="text-[var(--success)]"
            onClick={() => navigate('/banking/loans', { state: { stageFilter: 'Disb Pending' } })}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Ops Efficiency"
            value={loanFiles.length > 0 ? `${Math.round(((loanFiles.length - overallCounts.stuckCases) / loanFiles.length) * 100)}%` : '100%'}
            subtitle="Healthy vs Stuck Loan Files ratio"
            valueColor="text-[var(--gold)]"
          />
        </StaggerItem>
      </StaggerContainer>

      {/* Stuck / Pending Cases Priority Table */}
      <ScrollRevealMotion delay={0.1}>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[var(--ink)] font-display">Stuck & Pending Cases Ledger</h3>
          <DataTable
            columns={columns}
            data={pendingFiles}
            searchPlaceholder="Search pending cases by customer or coordinator..."
            searchKey="customerName"
            filterOptions={[
              { label: 'priority', options: ['All Priorities', 'High', 'Medium', 'Low'] },
              { label: 'branch', options: ['All Branches', 'Mumbai', 'Delhi', 'Bangalore'] }
            ]}
          />
        </div>
      </ScrollRevealMotion>
    </PageTransition>
  )
}
