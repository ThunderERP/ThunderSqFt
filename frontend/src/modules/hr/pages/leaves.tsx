import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import PageHeader from '../../shared/components/PageHeader'
import DataTable from '../../shared/components/DataTable'
import StatCard from '../../shared/components/StatCard'
import StatusBadge from '../../shared/components/StatusBadge'
import { CalendarRange, CheckCircle, Clock, XCircle, Plus } from 'lucide-react'

const mockLeaves = [
  { id: 'LR-101', name: 'Vikram Singh', type: 'Sick Leave', start: '2026-03-25', end: '2026-03-26', days: 2, status: 'Pending' },
  { id: 'LR-102', name: 'Anjali Sharma', type: 'Paid Leave', start: '2026-04-01', end: '2026-04-05', days: 5, status: 'Approved' },
  { id: 'LR-103', name: 'Rohan Gupta', type: 'Casual Leave', start: '2026-03-28', end: '2026-03-28', days: 1, status: 'Pending' },
  { id: 'LR-104', name: 'Amit Desai', type: 'Sick Leave', start: '2026-03-15', end: '2026-03-16', days: 2, status: 'Approved' },
  { id: 'LR-105', name: 'Priya Desai', type: 'Paid Leave', start: '2026-03-20', end: '2026-03-30', days: 10, status: 'Rejected' },
  { id: 'LR-106', name: 'Karan Malhotra', type: 'Casual Leave', start: '2026-06-12', end: '2026-06-13', days: 2, status: 'Pending' },
  { id: 'LR-107', name: 'Smriti Mandhana', type: 'Paid Leave', start: '2026-06-10', end: '2026-06-15', days: 5, status: 'Approved' },
  { id: 'LR-108', name: 'Jasprit Bumrah', type: 'Sick Leave', start: '2026-06-18', end: '2026-06-19', days: 1, status: 'Pending' },
  { id: 'LR-109', name: 'Virat Kohli', type: 'Paid Leave', start: '2026-07-01', end: '2026-07-10', days: 9, status: 'Approved' },
  { id: 'LR-110', name: 'MS Dhoni', type: 'Casual Leave', start: '2026-06-25', end: '2026-06-26', days: 2, status: 'Pending' },
  { id: 'LR-111', name: 'Sachin Tendulkar', type: 'Paid Leave', start: '2026-06-20', end: '2026-06-25', days: 5, status: 'Approved' },
  { id: 'LR-112', name: 'Rahul Dravid', type: 'Sick Leave', start: '2026-06-14', end: '2026-06-14', days: 1, status: 'Approved' },
  { id: 'LR-113', name: 'Sourav Ganguly', type: 'Casual Leave', start: '2026-06-22', end: '2026-06-22', days: 1, status: 'Rejected' },
  { id: 'LR-114', name: 'Yuvraj Singh', type: 'Paid Leave', start: '2026-06-15', end: '2026-06-20', days: 5, status: 'Rejected' },
]

export default function LeaveManagement() {
  const columns = [
    { key: 'name', label: 'Employee Name', render: (item: any) => <span className="font-semibold text-[var(--ink)]">{item.name}</span> },
    { key: 'type', label: 'Leave Type' },
    { key: 'start', label: 'Start Date', render: (item: any) => <span className="font-mono text-xs">{item.start}</span> },
    { key: 'end', label: 'End Date', render: (item: any) => <span className="font-mono text-xs">{item.end}</span> },
    { key: 'days', label: 'Duration', render: (item: any) => <span className="font-mono">{item.days} {item.days === 1 ? 'Day' : 'Days'}</span> },
    { 
      key: 'status', 
      label: 'Status',
      render: (item: any) => <StatusBadge status={item.status} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: any) => item.status === 'Pending' ? (
        <div className="flex items-center gap-2">
          <button className="text-emerald-400 hover:text-white hover:bg-emerald-600 font-semibold text-xs px-2.5 py-1 bg-emerald-600/10 rounded border border-emerald-500/20 transition-all active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--success)]">Approve</button>
          <button className="text-red-400 hover:text-white hover:bg-red-600 font-semibold text-xs px-2.5 py-1 bg-red-600/10 rounded border border-red-500/20 transition-all active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)]">Reject</button>
        </div>
      ) : <span className="text-[var(--ink-muted)] text-xs font-medium font-mono">Resolved</span>
    }
  ]

  const totalRequests = mockLeaves.length
  const pendingCount = mockLeaves.filter(l => l.status === 'Pending').length
  const approvedCount = mockLeaves.filter(l => l.status === 'Approved').length
  const rejectedCount = mockLeaves.filter(l => l.status === 'Rejected').length

  const filterOptions = [
    { label: 'status', options: ['All Statuses', 'Pending', 'Approved', 'Rejected'] },
    { label: 'type', options: ['All Types', 'Sick Leave', 'Paid Leave', 'Casual Leave'] }
  ]

  return (
    <PageTransition>
      <div className="space-y-6 p-6 max-w-[1600px] mx-auto text-[var(--ink)]">
        <PageHeader 
          title="Leave Management" 
          subtitle="Manage employee time off and leave requests."
          actions={
            <button className="bg-[var(--accent)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm flex items-center gap-2 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
              <Plus size={16} /> Request Leave
            </button>
          }
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StaggerItem>
            <StatCard label="Total Requests" value={String(totalRequests)} subtitle="All requests" valueColor="text-[var(--accent)]" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Pending" value={String(pendingCount)} subtitle="Action required" valueColor="text-[var(--warning)]" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Approved" value={String(approvedCount)} subtitle="Granted time off" valueColor="text-[var(--success)]" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Rejected" value={String(rejectedCount)} subtitle="Declined requests" valueColor="text-[var(--danger)]" />
          </StaggerItem>
        </StaggerContainer>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--ink)] font-display">Recent Leave Requests</h3>
          </div>
          <DataTable 
            columns={columns} 
            data={mockLeaves} 
            searchKey="name" 
            searchPlaceholder="Search by employee name..." 
            filterOptions={filterOptions}
          />
        </div>
      </div>
    </PageTransition>
  )
}
