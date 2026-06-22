import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import PageHeader from '../../finance/components/PageHeader'
import DataTable from '../../finance/components/DataTable'
import StatCard from '../../finance/components/StatCard'
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
    { key: 'name', label: 'Employee Name', render: (val: string) => <span className="font-semibold text-gray-900">{val}</span> },
    { key: 'type', label: 'Leave Type' },
    { key: 'start', label: 'Start Date' },
    { key: 'end', label: 'End Date' },
    { key: 'days', label: 'Duration', render: (val: number) => <span>{val} {val === 1 ? 'Day' : 'Days'}</span> },
    { 
      key: 'status', 
      label: 'Status',
      render: (val: string) => {
        let colors = 'bg-gray-100 text-gray-800 border-gray-200'
        if (val === 'Approved') colors = 'bg-emerald-100 text-emerald-800 border-emerald-200'
        if (val === 'Rejected') colors = 'bg-red-100 text-red-800 border-red-200'
        if (val === 'Pending') colors = 'bg-amber-100 text-amber-800 border-amber-200'
        return <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${colors}`}>{val}</span>
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => row.status === 'Pending' ? (
        <div className="flex items-center gap-2">
          <button className="text-emerald-600 hover:text-white hover:bg-emerald-600 font-semibold text-xs px-2.5 py-1.5 bg-emerald-50 rounded border border-emerald-200 transition-all active:scale-[0.96]">Approve</button>
          <button className="text-red-600 hover:text-white hover:bg-red-600 font-semibold text-xs px-2.5 py-1.5 bg-red-50 rounded border border-red-200 transition-all active:scale-[0.96]">Reject</button>
        </div>
      ) : <span className="text-gray-400 text-xs font-medium">Resolved</span>
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
      <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
        <PageHeader 
          title="Leave Management" 
          subtitle="Manage employee time off and leave requests."
          actions={
            <button className="bg-[#2563EB] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 active:scale-[0.97]">
              <Plus size={16} /> Request Leave
            </button>
          }
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StaggerItem>
            <StatCard title="Total Requests" value={String(totalRequests)} subtitle="All requests" icon={<CalendarRange size={20} />} trend="neutral" trendValue="0%" />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="Pending" value={String(pendingCount)} subtitle="Action required" icon={<Clock size={20} />} trend={pendingCount > 0 ? "up" : "neutral"} trendValue={String(pendingCount)} />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="Approved" value={String(approvedCount)} subtitle="Granted time off" icon={<CheckCircle size={20} />} trend="up" trendValue={`${Math.round((approvedCount/totalRequests)*100)}%`} />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="Rejected" value={String(rejectedCount)} subtitle="Declined requests" icon={<XCircle size={20} />} trend="down" trendValue={`${Math.round((rejectedCount/totalRequests)*100)}%`} />
          </StaggerItem>
        </StaggerContainer>

        <div className="platform-card overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-white">
            <h3 className="text-lg font-bold text-gray-800">Recent Leave Requests</h3>
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
