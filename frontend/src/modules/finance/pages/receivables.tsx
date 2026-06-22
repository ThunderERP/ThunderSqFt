import { useState } from 'react'
import { Eye, IndianRupee, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import { StaggerContainer, StaggerItem, PageTransition, ScrollRevealMotion } from '../components/MotionComponents'

const initialReceivablesData = [
  { invoiceId: 'INV-2024-156', customer: 'Acme Corporation', dueDate: '2024-04-15', amount: 12500, status: 'Pending' },
  { invoiceId: 'INV-2024-155', customer: 'Tech Solutions Inc', dueDate: '2024-04-10', amount: 8900, status: 'Overdue' },
  { invoiceId: 'INV-2024-154', customer: 'Global Dynamics', dueDate: '2024-04-05', amount: 15200, status: 'Paid' },
  { invoiceId: 'INV-2024-153', customer: 'Innovation Labs', dueDate: '2024-04-20', amount: 6750, status: 'Pending' },
  { invoiceId: 'INV-2024-152', customer: 'Sunrise Media', dueDate: '2024-03-28', amount: 9300, status: 'Overdue' },
  { invoiceId: 'INV-2024-151', customer: 'Metro Systems', dueDate: '2024-04-08', amount: 11400, status: 'Paid' },
]

export default function Receivables() {
  const [data, setData] = useState(initialReceivablesData)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [payModalOpen, setPayModalOpen] = useState(false)

  const handleMarkAsPaid = () => {
    if (selectedInvoice) {
      setData((prev) =>
        prev.map((item) =>
          item.invoiceId === selectedInvoice.invoiceId ? { ...item, status: 'Paid' } : item
        )
      )
      setPayModalOpen(false)
      setSelectedInvoice(null)
      toast.success('Invoice marked as paid successfully.')
    }
  }

  const columns = [
    { key: 'invoiceId', label: 'Invoice ID', render: (item: any) => <span className="font-medium text-gray-900">{item.invoiceId}</span> },
    { key: 'customer', label: 'Customer Name' },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (item: any) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={14} className="text-gray-400" />
          {item.dueDate}
        </div>
      ),
    },
    { key: 'amount', label: 'Amount', render: (item: any) => <span className="font-semibold">₹{item.amount.toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (item: any) => <StatusBadge status={item.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedInvoice(item)
              setViewModalOpen(true)
            }}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary-500 transition-colors"
          >
            <Eye size={16} />
          </button>
          {item.status !== 'Paid' && (
            <button
              onClick={() => {
                setSelectedInvoice(item)
                setPayModalOpen(true)
              }}
              className="p-2 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-500 transition-colors"
            >
              <IndianRupee size={16} />
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
      <PageHeader title="Accounts Receivable" subtitle="Manage customer payments and invoices" />

      {/* KPI Cards */}
      <StaggerContainer className="bento-grid mb-8">
        <StaggerItem><StatCard label="Total Receivables" value={`₹${totalAmount.toLocaleString()}`} /></StaggerItem>
        <StaggerItem><StatCard label="Paid" value={`₹${paidAmount.toLocaleString()}`} valueColor="text-emerald-600" /></StaggerItem>
        <StaggerItem><StatCard label="Pending" value={`₹${pendingAmount.toLocaleString()}`} valueColor="text-amber-500" /></StaggerItem>
        <StaggerItem><StatCard label="Overdue" value={`₹${overdueAmount.toLocaleString()}`} valueColor="text-red-500" /></StaggerItem>
      </StaggerContainer>

      {/* Data Table */}
      <ScrollRevealMotion delay={0.1}>
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Search by invoice ID or customer name..."
          searchKey="customer"
          filterOptions={[{ label: 'status', options: ['All Status', 'Paid', 'Pending', 'Overdue'] }]}
        />
      </ScrollRevealMotion>

      {/* View Modal */}
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Invoice Details">
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-500">Invoice ID</span>
              <span className="font-medium">{selectedInvoice.invoiceId}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-500">Customer</span>
              <span className="font-medium">{selectedInvoice.customer}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-500">Amount</span>
              <span className="font-semibold text-lg">₹{selectedInvoice.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-500">Due Date</span>
              <span>{selectedInvoice.dueDate}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-gray-500">Status</span>
              <StatusBadge status={selectedInvoice.status} />
            </div>
          </div>
        )}
      </Modal>

      {/* Pay Modal */}
      <Modal isOpen={payModalOpen} onClose={() => setPayModalOpen(false)} title="Record Payment">
        {selectedInvoice && (
          <div className="space-y-6">
            <p className="text-gray-600">
              Are you sure you want to mark invoice <span className="font-semibold text-gray-900">{selectedInvoice.invoiceId}</span> as paid?
              This will record a payment of <span className="font-semibold text-emerald-600">₹{selectedInvoice.amount.toLocaleString()}</span>.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPayModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsPaid}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
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
