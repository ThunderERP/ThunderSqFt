import { Eye, Download, Mail, Plus, X, User, IndianRupee, Calendar } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import { StaggerContainer, StaggerItem, PageTransition, ScrollRevealMotion } from '../components/MotionComponents'

const initialInvoicesData = [
  { invoiceId: 'INV-2024-156', client: 'Acme Corporation', amount: 12500, date: '2024-03-28', dueDate: '2024-04-28', status: 'Paid', email: 'billing@acme.corp' },
  { invoiceId: 'INV-2024-155', client: 'Tech Solutions Inc', amount: 8900, date: '2024-03-25', dueDate: '2024-04-25', status: 'Pending', email: 'finance@techsolutions.com' },
  { invoiceId: 'INV-2024-154', client: 'Global Dynamics', amount: 15200, date: '2024-03-20', dueDate: '2024-04-20', status: 'Paid', email: 'accounts@globaldynamics.org' },
  { invoiceId: 'INV-2024-153', client: 'Innovation Labs', amount: 6750, date: '2024-03-18', dueDate: '2024-04-18', status: 'Overdue', email: 'invoices@innovationlabs.io' },
  { invoiceId: 'INV-2024-152', client: 'Sunrise Media', amount: 9300, date: '2024-03-15', dueDate: '2024-04-15', status: 'Pending', email: 'payments@sunrisemedia.net' },
  { invoiceId: 'INV-2024-151', client: 'Metro Systems', amount: 11400, date: '2024-03-10', dueDate: '2024-04-10', status: 'Paid', email: 'accounts@metrosystems.com' },
]

export default function Invoices() {
  const [invoices, setInvoices] = useState(initialInvoicesData)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const [formData, setFormData] = useState({
    client: '',
    email: '',
    amount: '',
    dueDate: ''
  })

  const handleDownload = (invoice: any) => {
    const doc = new jsPDF()
    doc.setFontSize(22)
    doc.setTextColor(30, 41, 59)
    doc.text('INVOICE', 14, 22)
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(`Invoice #: ${invoice.invoiceId}`, 14, 30)
    doc.text(`Date: ${invoice.date}`, 14, 35)
    doc.text(`Due Date: ${invoice.dueDate}`, 14, 40)
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(12)
    doc.text('Bill To:', 14, 55)
    doc.setFontSize(14)
    doc.text(invoice.client, 14, 62)
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(invoice.email, 14, 68)
    autoTable(doc, {
      startY: 80,
      head: [['Description', 'Quantity', 'Rate', 'Amount']],
      body: [['Professional Services', '1', `Rs. ${invoice.amount.toLocaleString()}`, `Rs. ${invoice.amount.toLocaleString()}`]],
      headStyles: { fillColor: [79, 70, 229] },
      theme: 'striped'
    })
    const finalY = (doc as any).lastAutoTable.finalY
    doc.setFontSize(14)
    doc.setTextColor(30, 41, 59)
    doc.text(`Total Amount: Rs. ${invoice.amount.toLocaleString()}`, 140, finalY + 20)
    doc.save(`${invoice.invoiceId}_ThunderERP.pdf`)
    toast.success(`Invoice ${invoice.invoiceId} downloaded.`)
  }

  const handleSendMail = (invoice: any) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: 'Sending email...',
      success: `Sent to ${invoice.client}`,
      error: 'Failed to send'
    })
  }

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault()
    const newInvoice = {
      invoiceId: `INV-2024-${Math.floor(Math.random() * 900) + 200}`,
      client: formData.client,
      email: formData.email,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      status: 'Pending'
    }
    setInvoices([newInvoice, ...invoices])
    setCreateModalOpen(false)
    setFormData({ client: '', email: '', amount: '', dueDate: '' })
    toast.success(`Invoice ${newInvoice.invoiceId} created successfully!`)
  }

  const columns = [
    { key: 'invoiceId', label: 'Invoice ID', render: (item: any) => <span className="font-medium text-gray-900">{item.invoiceId}</span> },
    { key: 'client', label: 'Client' },
    { key: 'amount', label: 'Amount', render: (item: any) => <span className="font-semibold">₹{item.amount.toLocaleString()}</span> },
    { key: 'date', label: 'Date' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'status', label: 'Status', render: (item: any) => <StatusBadge status={item.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: any) => (
        <button
          onClick={() => { setSelectedInvoice(item); setViewModalOpen(true); }}
          className="p-2 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-500 transition-colors"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ]

  return (
    <PageTransition>
      <PageHeader
        title="Invoices"
        subtitle="Manage and track client billing"
        actions={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-medium text-sm shadow-lg transition-all"
            style={{ background: '#2563EB', boxShadow: '0 8px 24px rgba(37,99,235,0.25)' }}
          >
            <Plus size={18} />
            Create Invoice
          </button>
        }
      />

      <StaggerContainer className="bento-grid mb-8" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StaggerItem><StatCard label="Total Outstanding" value={`₹${invoices.reduce((acc, curr) => acc + (curr.status !== 'Paid' ? curr.amount : 0), 0).toLocaleString()}`} /></StaggerItem>
        <StaggerItem><StatCard label="Total Paid" value={`₹${invoices.reduce((acc, curr) => acc + (curr.status === 'Paid' ? curr.amount : 0), 0).toLocaleString()}`} valueColor="text-emerald-600" /></StaggerItem>
        <StaggerItem><StatCard label="Invoices Count" value={invoices.length.toString()} /></StaggerItem>
      </StaggerContainer>

      <ScrollRevealMotion delay={0.1}>
        <DataTable
          columns={columns}
          data={invoices}
          searchPlaceholder="Search by client or ID..."
          searchKey="client"
          filterOptions={[{ label: 'status', options: ['All Status', 'Paid', 'Pending', 'Overdue'] }]}
        />
      </ScrollRevealMotion>
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Invoice">
        <form onSubmit={handleCreateInvoice} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Client Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                required
                type="text"
                placeholder="e.g. Acme Corporation"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Client Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                required
                type="email"
                placeholder="billing@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount (₹)</label>
              <div className="relative">
                <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Due Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 mt-4"
          >
            Generate Invoice
          </button>
        </form>
      </Modal>

      {/* View Detail Modal */}
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title={`Invoice ${selectedInvoice?.invoiceId}`}>
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <span className="text-xs font-semibold text-gray-400 uppercase">Client</span>
                <p className="text-sm font-bold text-gray-900 mt-1">{selectedInvoice.client}</p>
                <p className="text-xs text-gray-500">{selectedInvoice.email}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <span className="text-xs font-semibold text-gray-400 uppercase">Amount</span>
                <p className="text-sm font-bold text-gray-900 mt-1">₹{selectedInvoice.amount.toLocaleString()}</p>
                <StatusBadge status={selectedInvoice.status} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                <span className="text-gray-500">Issue Date</span>
                <span className="font-medium">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                <span className="text-gray-500">Due Date</span>
                <span className="font-medium">{selectedInvoice.dueDate}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleDownload(selectedInvoice)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200"
              >
                <Download size={16} /> Download
              </button>
              <button
                onClick={() => handleSendMail(selectedInvoice)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl font-medium text-sm hover:bg-primary-600"
              >
                <Mail size={16} /> Send Email
              </button>
            </div>
          </div>
        )}
      </Modal>
    </PageTransition>
  )
}
