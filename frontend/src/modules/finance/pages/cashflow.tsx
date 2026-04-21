import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'
import autoTable from 'jspdf-autotable'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Download, ChevronDown, FileText } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { StaggerContainer, StaggerItem, PageTransition, ScrollRevealMotion } from '../components/MotionComponents'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const cashflowChartData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
  datasets: [
    {
      label: 'Inflow',
      data: [42000, 45000, 48000, 52000, 56000, 54000, 58000, 65000],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2.5,
    },
    {
      label: 'Outflow',
      data: [35000, 38000, 36000, 42000, 39000, 41000, 38000, 44000],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2.5,
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
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
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

    // Header
    doc.setFontSize(20)
    doc.setTextColor(30, 41, 59)
    doc.text('Cashflow Report', 14, 22)

    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28)

    // Summary
    doc.setFontSize(12)
    doc.setTextColor(30, 41, 59)
    doc.text('Summary Metrics', 14, 40)

    const summaryData = [
      ['Opening Balance', '₹125,000'],
      ['Total Inflow', '+₹52,650'],
      ['Total Outflow', '-₹38,900'],
      ['Closing Balance', '₹138,750'],
    ]

    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] },
    })

    // Transactions
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
      headStyles: { fillColor: [30, 41, 59] },
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

  return (
    <PageTransition>
      <PageHeader
        title="Cashflow Management"
        subtitle="Monitor and manage your cash position"
        actions={
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all shadow-sm"
            >
              <Download size={18} />
              Export Report
              <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FileText size={16} className="text-red-500" />
                  Export as PDF
                </button>
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Download size={16} className="text-emerald-500" />
                  Export as Excel
                </button>
              </div>
            )}
          </div>
        }
      />

      {/* KPI Cards */}
      <StaggerContainer className="bento-grid mb-8">
        <StaggerItem><StatCard label="Opening Balance" value="₹125,000" subtitle="Beginning of period" /></StaggerItem>
        <StaggerItem><StatCard label="Total Inflow" value="+₹52,650" subtitle="Cash received" valueColor="text-emerald-600" /></StaggerItem>
        <StaggerItem><StatCard label="Total Outflow" value="-₹38,900" subtitle="Cash paid" valueColor="text-red-500" /></StaggerItem>
        <StaggerItem><StatCard label="Closing Balance" value="₹138,750" subtitle="↗ +11.0%" valueColor="text-primary-500" /></StaggerItem>
      </StaggerContainer>

      {/* Chart */}
      <ScrollRevealMotion delay={0.05}>
        <div className="neu-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Cash Inflow vs Outflow</h2>
              <p className="text-sm text-gray-400">Monthly cashflow trend over time</p>
            </div>
            <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 bg-white">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <div className="h-[350px]">
            <Line
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
                      font: { family: 'Inter', size: 12 },
                      color: '#64748B',
                      padding: 16,
                    },
                  },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Inter', size: 12 }, color: '#94A3B8' },
                  },
                  y: {
                    grid: { color: '#F1F5F9' },
                    ticks: {
                      font: { family: 'Inter', size: 12 },
                      color: '#94A3B8',
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
        <div className="neu-card p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm text-gray-700 min-w-[140px] focus:ring-2 focus:ring-primary-500 transition-all outline-none cursor-pointer"
            >
              <option>All Types</option>
              <option value="Inflow">Inflow</option>
              <option value="Outflow">Outflow</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm text-gray-700 min-w-[160px] focus:ring-2 focus:ring-primary-500 transition-all outline-none cursor-pointer"
            >
              <option>All Categories</option>
              <option>Operating</option>
              <option>Investing</option>
              <option>Financing</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <p className="text-sm text-gray-400">Latest cash flow activities</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/30">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">{t.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">{t.description}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.type === 'Inflow'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-red-50 text-red-500 border border-red-200'
                          }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-semibold ${t.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{t.balance.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <FileText size={40} className="opacity-20" />
                        <p className="text-sm font-medium">No transactions found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollRevealMotion>
    </PageTransition>
  )
}
