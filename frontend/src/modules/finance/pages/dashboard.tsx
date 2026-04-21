import { useEffect, useRef } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { TrendingUp, TrendingDown, IndianRupee, FileText, ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { StaggerContainer, StaggerItem, PageTransition, ScrollRevealMotion } from '../components/MotionComponents'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const cashflowData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
    label: 'Cashflow',
    data: [13000, 15500, 14800, 19200, 20500, 25800],
    borderColor: '#2563EB',
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    fill: true, tension: 0.4,
    pointBackgroundColor: '#2563EB', pointBorderColor: '#fff',
    pointBorderWidth: 2, pointRadius: 5, pointHoverRadius: 7,
  }],
}

const incomeExpenseData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    { label: 'Income', data: [45000, 52000, 49000, 61000, 55000, 73000], backgroundColor: 'rgba(34, 197, 94, 0.8)', borderRadius: 6, barPercentage: 0.6 },
    { label: 'Expenses', data: [38000, 42000, 35000, 48000, 44000, 58000], backgroundColor: 'rgba(239, 68, 68, 0.8)', borderRadius: 6, barPercentage: 0.6 },
  ],
}

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1E293B', titleFont: { family: 'Inter', size: 13 },
      bodyFont: { family: 'Inter', size: 12 }, padding: 12, cornerRadius: 8,
      callbacks: { label: (ctx: any) => `₹${(ctx.parsed.y / 1000).toFixed(0)}k` },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 12 }, color: '#64748B' } },
    y: { grid: { color: 'var(--chart-grid)' }, ticks: { font: { family: 'Inter', size: 12 }, color: '#64748B', callback: (v: any) => `₹${(v / 1000).toFixed(0)}k` } },
  },
}

const liveTransactions = [
  { id: 1, name: 'Payment received from Acme Corporation', time: 'Just now', amount: '+₹12,500', type: 'incoming', status: 'Completed' },
  { id: 2, name: 'Office rent payment', time: '2 mins ago', amount: '-₹3,500', type: 'outgoing', status: 'Completed' },
  { id: 3, name: 'Payment from Tech Solutions Inc', time: '5 mins ago', amount: '+₹8,900', type: 'incoming', status: 'Completed' },
  { id: 4, name: 'Software subscription renewal', time: '12 mins ago', amount: '-₹1,200', type: 'outgoing', status: 'Completed' },
  { id: 5, name: 'Marketing campaign expense', time: '25 mins ago', amount: '-₹5,000', type: 'outgoing', status: 'Pending' },
]

export default function Dashboard() {
  return (
    <PageTransition>
      <PageHeader title="Finance Dashboard" subtitle="Overview of your financial performance" />

      {/* KPI Cards */}
      <StaggerContainer className="bento-grid mb-8">
        <StaggerItem><StatCard label="Total Revenue" value="₹328,000" subtitle="Current period total income" icon={<TrendingUp size={20} style={{ color: '#2563EB' }} />} /></StaggerItem>
        <StaggerItem><StatCard label="Total Expenses" value="₹215,000" subtitle="Current period total expenses" icon={<TrendingDown size={20} style={{ color: '#EF4444' }} />} /></StaggerItem>
        <StaggerItem><StatCard label="Pending Receivables" value="₹45,650" subtitle="Outstanding invoices to collect" icon={<IndianRupee size={20} style={{ color: '#22C55E' }} />} /></StaggerItem>
        <StaggerItem><StatCard label="Pending Payables" value="₹28,300" subtitle="Outstanding bills to pay" icon={<FileText size={20} style={{ color: '#F59E0B' }} />} /></StaggerItem>
      </StaggerContainer>

      {/* Charts */}
      <div className="bento-grid mb-8" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <ScrollRevealMotion>
          <div className="neu-card p-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Cashflow Trend</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Monthly cashflow over the last 6 months</p>
            <div className="h-[300px]"><Line data={cashflowData} options={chartOptions} /></div>
          </div>
        </ScrollRevealMotion>

        <ScrollRevealMotion delay={0.15}>
          <div className="neu-card p-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Income vs Expense</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Monthly comparison for the last 6 months</p>
            <div className="h-[300px]">
              <Bar data={incomeExpenseData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    display: true, position: 'top' as const, align: 'end' as const,
                    labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, font: { family: 'Inter', size: 12 }, color: '#64748B', padding: 16 },
                  },
                },
              }} />
            </div>
          </div>
        </ScrollRevealMotion>
      </div>

      {/* Live Transactions */}
      <ScrollRevealMotion delay={0.25}>
        <div className="neu-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Live Transactions</h2>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Real-time financial activity monitor</p>
            </div>
            <button className="text-xs font-semibold hover:opacity-80 transition-colors" style={{ color: '#2563EB' }}>View All</button>
          </div>

          <div className="space-y-3">
            {liveTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                className="tx-row group flex items-center justify-between p-4 rounded-xl neu-inset"
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'incoming' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                    {tx.type === 'incoming' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{tx.name}</p>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Clock size={12} />{tx.time}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'incoming' ? 'text-emerald-600' : 'text-red-600'}`}>{tx.amount}</p>
                  <StatusBadge status={tx.status} size="sm" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollRevealMotion>
    </PageTransition>
  )
}
