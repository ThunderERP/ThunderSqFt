import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'
import autoTable from 'jspdf-autotable'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Download, ChevronDown, FileText } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import PageHeader from '../../shared/components/PageHeader'
import StatCard from '../../shared/components/StatCard'
import DataTable from '../../shared/components/DataTable'
import StatusBadge from '../../shared/components/StatusBadge'
import { StaggerContainer, StaggerItem, PageTransition, ScrollRevealMotion } from '../../shared/components/MotionComponents'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const cashflowChartData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
  datasets: [
    {
      label: 'Inflow',
      data: [42000, 45000, 48000, 52000, 56000, 54000, 58000, 65000],
      backgroundColor: '#2ECF8B', // var(--success)
      borderRadius: 4,
    },
    {
      label: 'Outflow',
      data: [35000, 38000, 36000, 42000, 39000, 41000, 38000, 44000],
      backgroundColor: '#FF6B6B', // var(--danger)
      borderRadius: 4,
    },
  ],
}

const transactionsData = [
  { date: '2024-04-12', description: 'Client Payment - Acme Corp', type: 'Inflow', amount: 12500, balance: 138750 },
  { date: '2024-04-11', description: 'Salary Disbursement', type: 'Outflow', amount: -31000, balance: 126250 },
  { date: '2024-04-10', description: 'Vendor Payment - Cloud Services', type: 'Outflow', amount: -2400, balance: 157250 },
  { date: '2024-04-09', description: 'Invoice Payment - Tech Solutions', type: 'Inflow', amount: 8900, balance: 159650 },
  { date: '2024-04-08', description: 'Office Rent Payment', type: 'Outflow', amount: -3500, balance: 150750 },
  { date: '2024-04-07', description: 'Client Payment - Global Dynamics', type: 'Inflow', amount: 15200, balance: 154250 },
]

export default function Cashflow() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredTransactions = transactionsData.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'All Types' || t.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleExportPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setTextColor(30, 41, 59)
    doc.text('Cashflow Report', 14, 22)

    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28)

    doc.setFontSize(12)
    doc.setTextColor(30, 41, 59)
    doc.text('Summary Metrics', 14, 40)

    const summaryData = [
      ['Opening Balance', '₹1,25,000'],
      ['Total Inflow', '+₹52,650'],
      ['Total Outflow', '-₹38,900'],
      ['Closing Balance', '₹1,38,750'],
    ]

    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [61, 127, 255] },
    })

    doc.text('Cash Flow Transactions', 14, (doc as any).lastAutoTable.finalY + 15)

    const tableRows = filteredTransactions.map(t => [
      t.date,
      t.description,
      t.type,
      `${t.amount > 0 ? '+' : ''}₹${Math.abs(t.amount).toLocaleString()}`,
      `₹${t.balance.toLocaleString()}`
    ])

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Date', 'Description', 'Type', 'Amount', 'Balance']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [21, 21, 30] },
      styles: { fontSize: 9 },
    })

    doc.save('ThunderERP_Cashflow_Report.pdf')
    setIsDropdownOpen(false)
  }

  const handleExportExcel = () => {
    const tableData = filteredTransactions.map(t => ({
      Date: t.date,
      Description: t.description,
      Type: t.type,
      Amount: t.amount,
      Balance: t.balance
    }))

    const worksheet = XLSX.utils.json_to_sheet(tableData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cashflow Transactions')

    XLSX.writeFile(workbook, 'ThunderERP_Cashflow_Report.xlsx')
    setIsDropdownOpen(false)
  }

  const columns = [
    { 
      key: 'date', 
      label: 'Date',
      render: (item: any) => <span className="font-mono">{item.date}</span>
    },
    { 
      key: 'description', 
      label: 'Description',
      render: (item: any) => <span className="font-bold text-[var(--ink)]">{item.description}</span>
    },
    { 
      key: 'type', 
      label: 'Type',
      render: (item: any) => <StatusBadge status={item.type} />
    },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (item: any) => {
        const isPositive = item.amount > 0
        const formatted = `₹${Math.abs(item.amount).toLocaleString('en-IN')}`
        return (
          <span className={`font-mono font-bold ${isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
            {isPositive ? '+' : '-'}{formatted}
          </span>
        )
      }
    },
    { 
      key: 'balance', 
      label: 'Balance',
      render: (item: any) => <span className="font-mono text-[var(--ink)]">₹{item.balance.toLocaleString('en-IN')}</span>
    },
  ]

  return (
    <PageTransition>
      <div className="space-y-6 text-left">
        <PageHeader
          title={<span className="font-display">Cashflow Management</span>}
          subtitle="Monitor and manage your cash position"
          actions={
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="btn-secondary flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                <Download size={16} />
                Export Report
                <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] rounded-xl shadow-xl border border-[var(--border-color)] py-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <FileText size={16} className="text-[var(--danger)]" />
                    Export as PDF
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <Download size={16} className="text-[var(--success)]" />
                    Export as Excel
                  </button>
                </div>
              )}
            </div>
          }
        />

        {/* KPI Cards */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StaggerItem><StatCard label="Opening Balance" value="₹1,25,000" subtitle="Beginning of period" /></StaggerItem>
          <StaggerItem><StatCard label="Total Inflow" value="+₹52,650" subtitle="Cash received" valueColor="text-[var(--success)]" /></StaggerItem>
          <StaggerItem><StatCard label="Total Outflow" value="-₹38,900" subtitle="Cash paid" valueColor="text-[var(--danger)]" /></StaggerItem>
          <StaggerItem><StatCard label="Closing Balance" value="₹1,38,750" subtitle="↗ +11.0% vs last month" valueColor="text-[var(--accent)]" /></StaggerItem>
        </StaggerContainer>

        {/* Chart */}
        <ScrollRevealMotion delay={0.05}>
          <div className="card p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-[var(--ink)] font-display">Cash Inflow vs Outflow</h2>
                <p className="text-xs text-[var(--ink-soft)] mt-0.5">Monthly cashflow trend over time</p>
              </div>
              <select className="px-3 py-1.5 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all cursor-pointer font-semibold">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 12 months</option>
              </select>
            </div>
            <div className="h-[350px]" role="img" aria-label="Inflow vs Outflow Bar Chart.">
              <Bar
                data={cashflowChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  plugins: {
                    tooltip: {
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      borderWidth: 1,
                      titleColor: 'var(--ink)',
                      bodyColor: 'var(--ink-soft)',
                      titleFont: { family: 'var(--font-sans)', size: 12 },
                      bodyFont: { family: 'var(--font-mono)', size: 11 },
                      callbacks: {
                        label: (context: any) => {
                          let label = context.dataset.label || '';
                          if (label) {
                            label += ': ';
                          }
                          if (context.parsed.y !== null) {
                            label += `₹${context.parsed.y.toLocaleString()}`;
                          }
                          return label;
                        }
                      }
                    },
                    legend: {
                      display: true,
                      position: 'top' as const,
                      align: 'end' as const,
                      labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 8,
                        font: { family: 'var(--font-sans)', size: 11, weight: 'bold' as any },
                        color: 'var(--ink-soft)',
                        padding: 16,
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { font: { family: 'var(--font-sans)', size: 10 }, color: 'var(--ink-soft)' },
                    },
                    y: {
                      grid: { color: 'var(--border-color)' },
                      ticks: {
                        font: { family: 'var(--font-mono)', size: 10 },
                        color: 'var(--ink-soft)',
                        callback: (value: any) => `₹${(value / 1000).toFixed(0)}k`
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </ScrollRevealMotion>

        {/* Search and Filters Section */}
        <ScrollRevealMotion delay={0.1}>
          <div className="card p-4 mb-6 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all placeholder-[var(--ink-muted)]"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-all cursor-pointer font-semibold"
              >
                <option value="All Types">All Types</option>
                <option value="Inflow">Inflow</option>
                <option value="Outflow">Outflow</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-[var(--ink)] font-display">Recent Transactions</h3>
            <DataTable
              columns={columns}
              data={filteredTransactions}
            />
          </div>
        </ScrollRevealMotion>
      </div>
    </PageTransition>
  )
}
