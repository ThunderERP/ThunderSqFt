import { useState } from 'react'
import { Eye, IndianRupee, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '../../shared/components/PageHeader'
import StatCard from '../../shared/components/StatCard'
import DataTable from '../../shared/components/DataTable'
import StatusBadge from '../../shared/components/StatusBadge'
import Modal from '../../shared/components/Modal'
import { StaggerContainer, StaggerItem, PageTransition, ScrollRevealMotion } from '../../shared/components/MotionComponents'

const initialPayablesData = [
  { billId: 'BILL-2024-197', supplier: 'Property Management', category: 'Rent', dueDate: '2024-03-28', amount: 12000, status: 'Overdue' },
  { billId: 'BILL-2024-199', supplier: 'Cloud Services Ltd', category: 'Software', dueDate: '2024-04-05', amount: 2400, status: 'Paid' },
  { billId: 'BILL-2024-200', supplier: 'Tech Hardware Inc', category: 'Equipment', dueDate: '2024-04-12', amount: 8900, status: 'Overdue' },
  { billId: 'BILL-2024-196', supplier: 'Utilities Company', category: 'Utilities', dueDate: '2024-04-15', amount: 1850, status: 'Paid' },
  { billId: 'BILL-2024-198', supplier: 'Office Solutions', category: 'Supplies', dueDate: '2024-04-18', amount: 3200, status: 'Pending' },
  { billId: 'BILL-2024-195', supplier: 'Insurance Provider', category: 'Insurance', dueDate: '2024-04-20', amount: 5300, status: 'Pending' },
]

export default function Payables() {
  const [data, setData] = useState(initialPayablesData)
  const [selectedBill, setSelectedBill] = useState<any>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [payModalOpen, setPayModalOpen] = useState(false)

  const handleMarkAsPaid = () => {
    if (selectedBill) {
      setData((prev) =>
        prev.map((item) =>
          item.billId === selectedBill.billId ? { ...item, status: 'Paid' } : item
        )
      )
      setPayModalOpen(false)
      setSelectedBill(null)
      toast.success('Bill marked as paid successfully.')
    }
  }

  const columns = [
    { key: 'billId', label: 'Bill ID', render: (item: any) => <span className="font-mono font-medium text-[var(--accent)]">{item.billId}</span> },
    { key: 'supplier', label: 'Supplier Name', render: (item: any) => <span className="text-[var(--ink)]">{item.supplier}</span> },
    {
      key: 'category',
      label: 'Category',
      render: (item: any) => <StatusBadge status={item.category} />,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (item: any) => (
        <div className="flex items-center gap-2 text-[var(--ink-soft)]">
          <Calendar size={14} className="text-[var(--accent)]" />
          <span className="font-mono">{item.dueDate}</span>
        </div>
      ),
    },
    { key: 'amount', label: 'Amount', render: (item: any) => <span className="font-mono font-bold text-[var(--gold)]">₹{item.amount.toLocaleString('en-IN')}</span> },
    { key: 'status', label: 'Status', render: (item: any) => <StatusBadge status={item.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedBill(item)
              setViewModalOpen(true)
            }}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <Eye size={16} />
          </button>
          {item.status !== 'Paid' && (
            <button
              onClick={() => {
                setSelectedBill(item)
                setPayModalOpen(true)
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)] text-white rounded-lg text-xs font-medium hover:bg-blue-600 shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <IndianRupee size={14} />
              Pay
            </button>
          )}
        </div>
      ),
    },
  ]

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0)
  const paidAmount = data.filter((item) => item.status === 'Paid').reduce((sum, item) => sum + item.amount, 0)
  const pendingAmount = data.filter((item) => item.status === 'Pending').reduce((sum, item) => sum + item.amount, 0)
  const overdueAmount = data.filter((item) => item.status === 'Overdue').reduce((sum, item) => sum + item.amount, 0)

  return (
    <PageTransition>
      <PageHeader title="Accounts Payable" subtitle="Manage supplier bills and payments" />

      {/* KPI Cards */}
      <StaggerContainer className="bento-grid mb-8">
        <StaggerItem><StatCard label="Total Payables" value={`₹${totalAmount.toLocaleString()}`} /></StaggerItem>
        <StaggerItem><StatCard label="Paid" value={`₹${paidAmount.toLocaleString()}`} valueColor="text-emerald-600" /></StaggerItem>
        <StaggerItem><StatCard label="Pending" value={`₹${pendingAmount.toLocaleString()}`} valueColor="text-amber-500" /></StaggerItem>
        <StaggerItem><StatCard label="Overdue" value={`₹${overdueAmount.toLocaleString()}`} valueColor="text-red-500" /></StaggerItem>
      </StaggerContainer>

      {/* Data Table */}
      <ScrollRevealMotion delay={0.1}>
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Search by bill ID or supplier name..."
          searchKey="supplier"
          filterOptions={[
            { label: 'status', options: ['All Status', 'Paid', 'Pending', 'Overdue'] },
            { label: 'dueDate', options: ['Due Date', 'This Week', 'This Month', 'Overdue'] },
          ]}
        />
      </ScrollRevealMotion>

      {/* View Modal */}
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Bill Details">
        {selectedBill && (
          <div className="space-y-4">
            <div className="flex justify-between border-b border-[var(--border-color)] pb-4">
              <span className="text-[var(--ink-soft)]">Bill ID</span>
              <span className="font-mono font-medium text-[var(--accent)]">{selectedBill.billId}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--border-color)] pb-4">
              <span className="text-[var(--ink-soft)]">Supplier</span>
              <span className="font-medium text-[var(--ink)]">{selectedBill.supplier}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--border-color)] pb-4">
              <span className="text-[var(--ink-soft)]">Amount</span>
              <span className="font-mono font-bold text-lg text-[var(--gold)]">₹{selectedBill.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--border-color)] pb-4">
              <span className="text-[var(--ink-soft)]">Due Date</span>
              <span className="font-mono text-[var(--ink)]">{selectedBill.dueDate}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--border-color)] pb-4">
              <span className="text-[var(--ink-soft)]">Category</span>
              <StatusBadge status={selectedBill.category} />
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-[var(--ink-soft)]">Status</span>
              <StatusBadge status={selectedBill.status} />
            </div>
          </div>
        )}
      </Modal>

      {/* Pay Modal */}
      <Modal isOpen={payModalOpen} onClose={() => setPayModalOpen(false)} title="Record Payment">
        {selectedBill && (
          <div className="space-y-6">
            <p className="text-[var(--ink-soft)]">
              Are you sure you want to mark bill <span className="font-mono font-semibold text-[var(--accent)]">{selectedBill.billId}</span> as paid?
              This will record a payment of <span className="font-mono font-semibold text-[var(--success)]">₹{selectedBill.amount.toLocaleString('en-IN')}</span>.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPayModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-[var(--ink)] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsPaid}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--success)] rounded-lg hover:bg-emerald-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        )}
      </Modal>
    </PageTransition>
  )
}
