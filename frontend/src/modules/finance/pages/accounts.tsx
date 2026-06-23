import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Plus, Wallet, CreditCard, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, Clock, Building, Tag, IndianRupee } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import PageHeader from '../../shared/components/PageHeader'
import StatCard from '../../shared/components/StatCard'
import StatusBadge from '../../shared/components/StatusBadge'
import Modal from '../../shared/components/Modal'
import { StaggerContainer, StaggerItem, PageTransition, ScrollRevealMotion } from '../../shared/components/MotionComponents'

ChartJS.register(ArcElement, Tooltip, Legend)

const initialAccountsData = [
  { name: 'Operating Account', id: 'ACC-001', type: 'Checking', bank: 'First National Bank', balance: 125000, status: 'active' },
  { name: 'Savings Account', id: 'ACC-002', type: 'Savings', bank: 'First National Bank', balance: 85000, status: 'active' },
  { name: 'Payroll Account', id: 'ACC-003', type: 'Checking', bank: 'Business Bank', balance: 45000, status: 'active' },
  { name: 'Investment Account', id: 'ACC-004', type: 'Investment', bank: 'Capital Partners', balance: 200000, status: 'active' },
]

const liveTransactions = [
  {
    id: 1,
    name: 'Payment received from Acme Corporation',
    time: 'Just now',
    amount: '+₹12,500',
    type: 'incoming',
    status: 'Completed',
  },
  {
    id: 2,
    name: 'Office rent payment',
    time: '2 mins ago',
    amount: '-₹3,500',
    type: 'outgoing',
    status: 'Completed',
  },
  {
    id: 3,
    name: 'Payment received from Tech Solutions Inc',
    time: '5 mins ago',
    amount: '+₹8,900',
    type: 'incoming',
    status: 'Completed',
  },
  {
    id: 4,
    name: 'Software subscription renewal',
    time: '12 mins ago',
    amount: '-₹1,200',
    type: 'outgoing',
    status: 'Completed',
  },
  {
    id: 5,
    name: 'Marketing campaign expense',
    time: '25 mins ago',
    amount: '-₹5,000',
    type: 'outgoing',
    status: 'Pending',
  },
]

export default function Accounts() {
  const [accounts, setAccounts] = useState(initialAccountsData)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'Checking',
    bank: '',
    balance: ''
  })

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault()
    const newAccount = {
      id: `ACC-00${accounts.length + 1}`,
      name: formData.name,
      type: formData.type,
      bank: formData.bank,
      balance: parseFloat(formData.balance),
      status: 'active'
    }
    setAccounts([...accounts, newAccount])
    setCreateModalOpen(false)
    setFormData({ name: '', type: 'Checking', bank: '', balance: '' })
    toast.success(`Account ${newAccount.name} added successfully!`)
  }

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0)
  const activeAccountsCount = accounts.filter(a => a.status === 'active').length

  const distributionData = {
    labels: accounts.map(a => a.name),
    datasets: [
      {
        data: accounts.map(a => a.balance),
        backgroundColor: [
          '#4F7DF3',
          '#8B5CF6',
          '#10B981',
          '#F59E0B',
          '#EC4899',
          '#06B6D4',
          '#84CC16',
          '#F43F5E'
        ],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  }

  return (
    <PageTransition>
      <PageHeader
        title="Accounts"
        subtitle="Manage your financial accounts"
        actions={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-medium text-sm shadow-lg transition-all bg-[var(--accent)] hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            style={{ boxShadow: '0 8px 24px rgba(61,127,255,0.25)' }}
          >
            <Plus size={18} />
            Add Account
          </button>
        }
      />

      {/* KPI Cards */}
      <StaggerContainer className="bento-grid mb-8">
        <StaggerItem><StatCard label="Total Balance" value={`₹${totalBalance.toLocaleString()}`} subtitle="Across all accounts" icon={<Wallet size={20} className="text-[var(--accent)]" />} /></StaggerItem>
        <StaggerItem><StatCard label="Active Accounts" value={activeAccountsCount.toString()} subtitle="Currently active" icon={<CreditCard size={20} className="text-[var(--accent)]" />} /></StaggerItem>
        <StaggerItem><StatCard label="Monthly Inflow" value="+₹328,000" subtitle="This month" valueColor="text-[var(--success)]" icon={<TrendingUp size={20} className="text-[var(--success)]" />} /></StaggerItem>
        <StaggerItem><StatCard label="Monthly Outflow" value="-₹215,000" subtitle="This month" valueColor="text-[var(--danger)]" icon={<TrendingDown size={20} className="text-[var(--danger)]" />} /></StaggerItem>
      </StaggerContainer>

      {/* Accounts Table & Pie Chart */}
      {/* Accounts Table & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ScrollRevealMotion delay={0.05} className="lg:col-span-2">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-card overflow-hidden">
            <div className="p-6 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-semibold text-[var(--ink)] font-display">All Accounts</h2>
              <p className="text-sm text-[var(--ink-soft)]">Overview of your financial accounts</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--ink-soft)] uppercase tracking-wider">Account</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--ink-soft)] uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--ink-soft)] uppercase tracking-wider">Bank</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--ink-soft)] uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--ink-soft)] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-[var(--ink)]">{account.name}</p>
                          <p className="text-xs font-mono text-[var(--ink-muted)]">{account.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--ink-soft)]">{account.type}</td>
                      <td className="px-6 py-4 text-sm text-[var(--ink-soft)]">{account.bank}</td>
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-[var(--gold)]">₹{account.balance.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={account.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollRevealMotion>

        {/* Pie Chart */}
        <ScrollRevealMotion delay={0.1}>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-card p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--ink)] font-display">Account Distribution</h2>
              <p className="text-sm text-[var(--ink-soft)] mb-6">Balance allocation across accounts</p>
            </div>
            <div className="flex items-center justify-center flex-1">
              <div className="w-full max-w-[260px]">
                <Pie
                  data={distributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                        labels: {
                          usePointStyle: true,
                          pointStyle: 'circle',
                          boxWidth: 8,
                          font: { family: 'Inter', size: 11 },
                          color: '#A5A6BE',
                          padding: 12,
                        },
                      },
                      tooltip: {
                        backgroundColor: '#1E1E2C',
                        titleFont: { family: 'Inter', size: 13 },
                        bodyFont: { family: 'Inter', size: 12 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                          label: function (context: any) {
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                            const percentage = ((context.parsed / total) * 100).toFixed(0)
                            return `${context.label}: ₹${(context.parsed / 1000).toFixed(0)}k (${percentage}%)`
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </ScrollRevealMotion>
      </div>

      {/* Live Transactions Section */}
      <ScrollRevealMotion delay={0.1}>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-card p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-[var(--ink)] font-display">Recent Transactions</h2>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </div>
              <p className="text-sm text-[var(--ink-soft)]">Real-time activity across all accounts</p>
            </div>
            <button className="text-xs font-semibold text-[var(--accent)] hover:text-blue-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {liveTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="group flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)] transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'incoming'
                    ? 'bg-[var(--success-soft)] text-[var(--success)]'
                    : 'bg-[var(--danger-soft)] text-[var(--danger)]'
                    }`}>
                    {transaction.type === 'incoming' ? (
                      <ArrowUpCircle size={20} />
                    ) : (
                      <ArrowDownCircle size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                      {transaction.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
                      <Clock size={12} />
                      {transaction.time}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-mono font-bold ${transaction.type === 'incoming' ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                    }`}>
                    {transaction.amount}
                  </p>
                  <div className="flex items-center justify-end">
                    <StatusBadge status={transaction.status} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollRevealMotion>

      {/* Add Account Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Add New Account">
        <form onSubmit={handleAddAccount} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ink-soft)] uppercase tracking-wider">Account Name</label>
            <div className="relative">
              <Wallet size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
              <input
                required
                type="text"
                placeholder="e.g. Operating Account"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:ring-2 focus:ring-[var(--accent)] outline-none rounded-2xl text-sm transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--ink-soft)] uppercase tracking-wider">Type</label>
              <div className="relative">
                <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:ring-2 focus:ring-[var(--accent)] outline-none rounded-2xl text-sm transition-all appearance-none"
                >
                  <option>Checking</option>
                  <option>Savings</option>
                  <option>Investment</option>
                  <option>Credit</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--ink-soft)] uppercase tracking-wider">Bank Name</label>
              <div className="relative">
                <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Chase Bank"
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:ring-2 focus:ring-[var(--accent)] outline-none rounded-2xl text-sm transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ink-soft)] uppercase tracking-wider">Opening Balance (₹)</label>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
              <input
                required
                type="number"
                placeholder="0.00"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:ring-2 focus:ring-[var(--accent)] outline-none rounded-2xl text-sm transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[var(--accent)] text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg mt-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            style={{ boxShadow: '0 8px 24px rgba(61,127,255,0.25)' }}
          >
            Create Account
          </button>
        </form>
      </Modal>
    </PageTransition>
  )
}
