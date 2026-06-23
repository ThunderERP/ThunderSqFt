import { Trash2, Plus, ReceiptIndianRupee, Tag, User, Calendar, CreditCard } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import PageHeader from '../../shared/components/PageHeader'
import StatCard from '../../shared/components/StatCard'
import DataTable from '../../shared/components/DataTable'
import StatusBadge from '../../shared/components/StatusBadge'
import Modal from '../../shared/components/Modal'
import { StaggerContainer, StaggerItem, PageTransition, ScrollRevealMotion } from '../../shared/components/MotionComponents'

const initialExpensesData = [
  { id: 'EXP-001', description: 'Office Rent', category: 'Operations', vendor: 'Property Management Co', amount: 3500, date: '2024-03-01', status: 'Approved' },
  { id: 'EXP-002', description: 'Software Licenses', category: 'Technology', vendor: 'SaaS Provider', amount: 1200, date: '2024-03-05', status: 'Approved' },
  { id: 'EXP-003', description: 'Marketing Campaign', category: 'Marketing', vendor: 'Ad Agency', amount: 5000, date: '2024-03-10', status: 'Pending' },
  { id: 'EXP-004', description: 'Office Supplies', category: 'Operations', vendor: 'Office Depot', amount: 450, date: '2024-03-12', status: 'Approved' },
  { id: 'EXP-005', description: 'Travel Expenses', category: 'Operations', vendor: 'Various', amount: 2800, date: '2024-03-15', status: 'Pending' },
  { id: 'EXP-006', description: 'Training Program', category: 'HR', vendor: 'Training Co', amount: 5050, date: '2024-03-18', status: 'Approved' },
]

export default function Expenses() {
  const [expenses, setExpenses] = useState(initialExpensesData)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    category: 'Operations',
    vendor: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  })

  const handleDeleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id)
    if (!expense) return

    toast.error(`Deleted "${expense.description}"`, {
      description: 'The expense record has been permanently removed.',
      action: {
        label: 'Undo',
        onClick: () => setExpenses([...expenses]) // Simplified undo logic
      }
    })
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const newExpense = {
      id: `EXP-${Math.floor(Math.random() * 900) + 100}`,
      ...formData,
      amount: parseFloat(formData.amount),
      status: 'Pending'
    }
    setExpenses([newExpense, ...expenses])
    setCreateModalOpen(false)
    setFormData({
      description: '',
      category: 'Operations',
      vendor: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    })
    toast.success(`Expense ${newExpense.id} added successfully!`)
  }

  const columns = [
    { key: 'id', label: 'ID', render: (item: any) => <span className="font-mono font-medium text-[var(--accent)]">{item.id}</span> },
    { key: 'description', label: 'Description', render: (item: any) => <span className="font-medium text-[var(--ink)]">{item.description}</span> },
    { key: 'category', label: 'Category', render: (item: any) => <StatusBadge status={item.category} /> },
    { key: 'vendor', label: 'Vendor', render: (item: any) => <span className="text-[var(--ink-soft)]">{item.vendor}</span> },
    { key: 'amount', label: 'Amount', render: (item: any) => <span className="font-mono font-bold text-[var(--gold)]">₹{item.amount.toLocaleString('en-IN')}</span> },
    { key: 'date', label: 'Date', render: (item: any) => <span className="font-mono text-[var(--ink-soft)]">{item.date}</span> },
    { key: 'status', label: 'Status', render: (item: any) => <StatusBadge status={item.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: any) => (
        <button
          onClick={() => handleDeleteExpense(item.id)}
          className="p-2 rounded-lg hover:bg-[var(--danger-soft)] text-[var(--ink-muted)] hover:text-[var(--danger)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          title="Delete Expense"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ]

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0)
  const approvedExpenses = expenses.filter(e => e.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0)
  const pendingExpenses = expenses.filter(e => e.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <PageTransition>
      <PageHeader
        title="Expenses"
        subtitle="Track and manage business expenditures"
        actions={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-medium text-sm shadow-lg transition-all bg-[var(--accent)] hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            style={{ boxShadow: '0 8px 24px rgba(61,127,255,0.25)' }}
          >
            <Plus size={18} />
            Add Expense
          </button>
        }
      />

      {/* KPI Cards */}
      <StaggerContainer className="bento-grid mb-8" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StaggerItem><StatCard label="Total Expenses" value={`₹${totalExpenses.toLocaleString()}`} /></StaggerItem>
        <StaggerItem><StatCard label="Approved" value={`₹${approvedExpenses.toLocaleString()}`} valueColor="text-[var(--success)]" /></StaggerItem>
        <StaggerItem><StatCard label="Pending" value={`₹${pendingExpenses.toLocaleString()}`} valueColor="text-[var(--warning)]" /></StaggerItem>
      </StaggerContainer>

      {/* Data Table */}
      <ScrollRevealMotion delay={0.1}>
        <DataTable
          columns={columns}
          data={expenses}
          searchPlaceholder="Search expenses by description or vendor..."
          searchKey="description"
          filterOptions={[
            { label: 'category', options: ['All Categories', 'Operations', 'Technology', 'Marketing', 'HR'] },
          ]}
        />
      </ScrollRevealMotion>

      {/* Add Expense Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Add Expense Record">
        <form onSubmit={handleAddExpense} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ink-soft)] uppercase tracking-wider">Description</label>
            <div className="relative">
              <ReceiptIndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
              <input
                required
                type="text"
                placeholder="e.g. Monthly Office Rent"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:ring-2 focus:ring-[var(--accent)] outline-none rounded-2xl text-sm transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--ink-soft)] uppercase tracking-wider">Category</label>
              <div className="relative">
                <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:ring-2 focus:ring-[var(--accent)] outline-none rounded-2xl text-sm transition-all appearance-none"
                >
                  <option>Operations</option>
                  <option>Technology</option>
                  <option>Marketing</option>
                  <option>HR</option>
                  <option>Travel</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--ink-soft)] uppercase tracking-wider">Vendor</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
                <input
                  required
                  type="text"
                  placeholder="Vendor Name"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:ring-2 focus:ring-[var(--accent)] outline-none rounded-2xl text-sm transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--ink-soft)] uppercase tracking-wider">Amount (₹)</label>
              <div className="relative">
                <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
                <input
                  required
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:ring-2 focus:ring-[var(--accent)] outline-none rounded-2xl text-sm transition-all font-mono"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--ink-soft)] uppercase tracking-wider">Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:ring-2 focus:ring-[var(--accent)] outline-none rounded-2xl text-sm transition-all font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[var(--accent)] text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg mt-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            style={{ boxShadow: '0 8px 24px rgba(61,127,255,0.25)' }}
          >
            Save Expense
          </button>
        </form>
      </Modal>
    </PageTransition>
  )
}
