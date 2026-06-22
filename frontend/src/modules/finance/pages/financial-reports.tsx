import { Doughnut, Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Printer, Download, TrendingUp, PieChart, Activity, ChevronRight, FileText } from 'lucide-react'
import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { PageTransition, ScrollRevealMotion } from '../components/MotionComponents'
import { toast } from 'sonner'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

const quarterlyPerformanceData = {
  labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
  datasets: [
    {
      label: 'Revenue',
      data: [120000, 150000, 140000, 180000],
      backgroundColor: '#4F7DF3',
      borderRadius: 8,
    },
    {
      label: 'Profit',
      data: [35000, 45000, 42000, 58000],
      backgroundColor: '#10B981',
      borderRadius: 8,
    },
  ],
}

const financialRatios = [
  { label: 'Current Ratio', value: '2.4', status: 'Healthy', description: 'Ability to pay short-term obligations' },
  { label: 'Return on Equity', value: '18.5%', status: 'Excellent', description: 'Profitability from shareholders equity' },
  { label: 'Net Profit Margin', value: '27.5%', status: 'Improved', description: 'Efficiency of converting sales to profit' },
  { label: 'Debt to Equity', value: '0.35', status: 'Conservative', description: 'Financial leverage and risk' },
]

const plData = [
  { category: 'Revenue', value: 328000, previous: 285000, change: '+15.1%' },
  { category: 'Cost of Goods Sold', value: 92000, previous: 85000, change: '+8.2%' },
  { category: 'Gross Profit', value: 236000, previous: 200000, change: '+18.0%' },
  { category: 'Operating Expenses', value: 145632, previous: 132000, change: '+10.3%' },
  { category: 'Operating Profit (EBITDA)', value: 90368, previous: 68000, change: '+32.8%' },
  { category: 'Taxes', value: 18073, previous: 13600, change: '+32.8%' },
  { category: 'Net Income', value: 72295, previous: 54400, change: '+32.9%' },
]

export default function FinancialReports() {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('Year to Date')
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2024-06-30')

  const getKPIValues = () => {
    if (dateRange === 'Last Quarter') {
      return {
        revenue: '₹142,000',
        expenses: '₹68,000',
        netProfit: '₹74,000',
        margin: '52.1% profit margin',
        assets: '₹712,000',
        revenueTrend: [43000, 48000, 51000],
        revenueLabels: ['Oct', 'Nov', 'Dec'],
        expenseData: [40, 25, 15, 12, 8]
      }
    }
    if (dateRange === 'Last Month') {
      return {
        revenue: '₹48,000',
        expenses: '₹22,500',
        netProfit: '₹25,500',
        margin: '53.1% profit margin',
        assets: '₹705,000',
        revenueTrend: [12000, 15000, 11000, 10000],
        revenueLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        expenseData: [45, 20, 15, 12, 8]
      }
    }
    if (dateRange === 'Custom Range') {
      const start = new Date(startDate)
      const end = new Date(endDate)
      let days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      if (isNaN(days) || days < 0) days = 30 // fallback
      
      const rev = 1500 * days
      const exp = 700 * days
      const net = rev - exp
      const marginVal = rev > 0 ? ((net / rev) * 100).toFixed(1) : '0.0'
      const assetVal = 700000 + (days * 100)

      // Generate dates/weeks for trend line based on days selected
      const steps = Math.min(Math.max(Math.round(days / 7), 3), 10)
      const customTrend = Array.from({ length: steps }, (_, i) => Math.round((rev / steps) * (0.8 + Math.sin(i) * 0.2)))
      const customLabels = Array.from({ length: steps }, (_, i) => `Point ${i + 1}`)

      return {
        revenue: `₹${rev.toLocaleString()}`,
        expenses: `₹${exp.toLocaleString()}`,
        netProfit: `₹${net.toLocaleString()}`,
        margin: `${marginVal}% profit margin`,
        assets: `₹${assetVal.toLocaleString()}`,
        revenueTrend: customTrend,
        revenueLabels: customLabels,
        expenseData: [48, 22, 14, 11, 5]
      }
    }
    // Default Year to Date
    return {
      revenue: '₹328,000',
      expenses: '₹150,000',
      netProfit: '₹90,368',
      margin: '27.5% profit margin',
      assets: '₹735,000',
      revenueTrend: [48000, 52000, 55000, 61000, 58000, 72000],
      revenueLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      expenseData: [50, 20, 15, 10, 5]
    }
  }

  const kpis = getKPIValues()

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text('Financial Report Summary', 14, 22)
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Generated on: ${new Date().toLocaleDateString()} | Date Range: ${dateRange}`, 14, 30)

    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text('Financial Overview KPIs', 14, 45)

    const cleanRevenue = kpis.revenue.replace(/₹/g, 'Rs. ')
    const cleanExpenses = kpis.expenses.replace(/₹/g, 'Rs. ')
    const cleanProfit = kpis.netProfit.replace(/₹/g, 'Rs. ')
    const cleanAssets = kpis.assets.replace(/₹/g, 'Rs. ')

    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value', 'Trend/Status']],
      body: [
        ['Total Revenue', cleanRevenue, '+15.3%'],
        ['Total Expenses', cleanExpenses, '+8.2%'],
        ['Net Profit', cleanProfit, kpis.margin],
        ['Total Assets', cleanAssets, 'Healthy'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
    })

    doc.setFontSize(14)
    doc.text('Key Financial Ratios', 14, (doc as any).lastAutoTable.finalY + 15)

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Ratio', 'Value', 'Status', 'Description']],
      body: financialRatios.map(r => [r.label, r.value, r.status, r.description]),
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
    })

    doc.save(`financial_report_${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success('Report Downloaded', {
      description: 'Your financial report has been exported as PDF.'
    })
  }

  return (
    <PageTransition>
      <div className="pb-10">
        <PageHeader
          title="Financial Reports"
          subtitle="Comprehensive financial analysis and insights"
          actions={
            <>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all">
                <Printer size={18} />
                Print
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-medium text-sm shadow-lg transition-all"
                style={{ background: '#2563EB', boxShadow: '0 8px 24px rgba(37,99,235,0.25)' }}
              >
                <Download size={18} />
                Export PDF
              </button>
            </>
          }
        />

        <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-2xl w-fit max-w-full overflow-x-auto whitespace-nowrap mb-8 border border-gray-200/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('p&l')}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'p&l' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Profit & Loss
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'balance' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setActiveTab('ratios')}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'ratios' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Key Ratios
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="neu-card p-6 flex flex-wrap items-center gap-6">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 bg-gray-50/50 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                >
                  <option value="Year to Date">Year to Date</option>
                  <option value="Last Quarter">Last Quarter</option>
                  <option value="Last Month">Last Month</option>
                  <option value="Custom Range">Custom Range</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 bg-gray-50/50 focus:ring-2 focus:ring-primary-500 transition-all outline-none">
                  <option>All Reports</option>
                  <option>Revenue</option>
                  <option>Expenses</option>
                  <option>Profit & Loss</option>
                </select>
              </div>
              {dateRange === 'Custom Range' && (
                <>
                  <div className="flex-1 min-w-[200px] animate-in fade-in slide-in-from-left-4 duration-300">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 bg-gray-50/50 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px] animate-in fade-in slide-in-from-left-4 duration-300">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 bg-gray-50/50 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Revenue" value={kpis.revenue} subtitle="↗ +15.3% vs last period" valueColor="text-gray-900" delay={0} />
              <StatCard label="Total Expenses" value={kpis.expenses} subtitle="↗ +8.2% vs last period" valueColor="text-gray-900" delay={1} />
              <StatCard label="Net Profit" value={kpis.netProfit} subtitle={kpis.margin} valueColor="text-emerald-600" delay={2} />
              <StatCard label="Total Assets" value={kpis.assets} subtitle="Current financial position" valueColor="text-gray-900" delay={3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Expense Distribution</h2>
                <p className="text-xs text-gray-400 mb-8">Breakdown of expenses by category</p>
                <div className="flex items-center justify-center h-[300px]">
                  <Doughnut
                    data={{
                      labels: ['Salaries', 'Operations', 'Marketing', 'Technology', 'Others'],
                      datasets: [{
                        data: kpis.expenseData,
                        backgroundColor: ['#4F7DF3', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
                        borderWidth: 0,
                      }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '70%',
                      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 6 } } }
                    }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Revenue Trends</h2>
                <p className="text-xs text-gray-400 mb-8">Monthly revenue vs target</p>
                <div className="h-[300px]">
                  <Line
                    data={{
                      labels: kpis.revenueLabels,
                      datasets: [
                        {
                          label: 'Revenue',
                          data: kpis.revenueTrend,
                          borderColor: '#4F7DF3',
                          backgroundColor: 'rgba(79, 125, 243, 0.05)',
                          fill: true,
                          tension: 0.4,
                          pointBackgroundColor: '#4F7DF3',
                          pointBorderColor: '#fff',
                          pointBorderWidth: 2,
                          pointRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { grid: { color: '#F1F5F9' }, ticks: { font: { size: 10 } } },
                        x: { grid: { display: false }, ticks: { font: { size: 10 } } }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'p&l' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Profit & Loss Summary</h2>
                    <p className="text-sm text-gray-500">Fiscal period: Jan 1, 2024 - Jun 30, 2024</p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold ring-1 ring-emerald-100">
                    ACCURATE
                  </div>
                </div>

                <div className="space-y-4">
                  {plData.map((row, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${row.category.includes('Profit') || row.category.includes('Income')
                          ? 'bg-primary-50/50 border border-primary-100'
                          : 'hover:bg-gray-50 border border-transparent'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${row.category.includes('Revenue') ? 'bg-blue-100 text-blue-600' :
                            row.category.includes('Expenses') ? 'bg-red-100 text-red-600' :
                              'bg-gray-100 text-gray-600'
                          }`}>
                          {idx === 0 ? <TrendingUp size={20} /> : <FileText size={20} />}
                        </div>
                        <span className={`text-sm font-semibold ${row.category.includes('Profit') ? 'text-gray-900' : 'text-gray-700'}`}>
                          {row.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">₹{row.value.toLocaleString()}</div>
                        <div className="text-[10px] font-medium text-gray-400">Prev: ₹{row.previous.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quaterly Bar Chart */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Quarterly Performance</h3>
                <p className="text-xs text-gray-400 mb-8">Revenue and Profit growth trend</p>

                <div className="flex-1 min-h-[300px]">
                  <Bar
                    data={quarterlyPerformanceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 6, font: { size: 10 } } }
                      },
                      scales: {
                        y: { grid: { display: false }, ticks: { font: { size: 10 } } },
                        x: { grid: { display: false }, ticks: { font: { size: 10 } } }
                      }
                    }}
                  />
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Projected Q1 Growth</span>
                    <span className="text-xs font-bold text-emerald-600">+12.4%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[75%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'balance' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Balance Overview</h2>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500">Total Assets</h4>
                        <div className="text-3xl font-black text-gray-900 mt-1">₹735,420</div>
                      </div>
                      <div className="text-sm font-bold text-emerald-600 mb-1">↗ 12.5%</div>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full flex overflow-hidden">
                      <div className="h-full bg-primary-500 w-[60%] border-r-2 border-white" />
                      <div className="h-full bg-primary-300 w-[25%] border-r-2 border-white" />
                      <div className="h-full bg-primary-100 w-[15%]" />
                    </div>
                    <div className="flex gap-4 mt-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                        <span className="text-[10px] font-bold text-gray-400">Current</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary-300" />
                        <span className="text-[10px] font-bold text-gray-400">Fixed</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary-100" />
                        <span className="text-[10px] font-bold text-gray-400">Intangible</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-50">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500">Total Liabilities</h4>
                        <div className="text-3xl font-black text-gray-900 mt-1">₹212,300</div>
                      </div>
                      <div className="text-sm font-bold text-red-500 mb-1">↘ 4.2%</div>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full flex overflow-hidden">
                      <div className="h-full bg-red-400 w-[40%] border-r-2 border-white" />
                      <div className="h-full bg-red-200 w-[60%]" />
                    </div>
                    <div className="flex gap-4 mt-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-[10px] font-bold text-gray-400">Short-term</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-200" />
                        <span className="text-[10px] font-bold text-gray-400">Long-term</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform duration-700 opacity-20">
                  <PieChart size={180} />
                </div>
                <h2 className="text-xl font-bold mb-8">Shareholder Equity</h2>
                <div className="text-5xl font-black mb-2">₹523,120</div>
                <p className="text-primary-200 text-sm max-w-[240px] leading-relaxed">
                  Your net worth has increased by <span className="text-white font-bold">₹42,300</span> in the last 6 months.
                </p>

                <div className="mt-12 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                    <span className="text-sm font-medium">Retained Earnings</span>
                    <span className="font-bold">₹184,200</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                    <span className="text-sm font-medium">Common Stock</span>
                    <span className="font-bold">₹338,920</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ratios' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {financialRatios.map((ratio, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 text-primary-500">
                    <Activity size={24} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">{ratio.label}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-black text-gray-900">{ratio.value}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ratio.status === 'Excellent' || ratio.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary-50 text-primary-600'
                      }`}>
                      {ratio.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed italic line-clamp-2">
                    "{ratio.description}"
                  </p>
                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between group cursor-pointer">
                    <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Analysis</span>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-8">Profitability Insights</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-6">
                    <Doughnut
                      data={{
                        labels: ['Net Profit', 'Other'],
                        datasets: [{ data: [27.5, 72.5], backgroundColor: ['#10B981', '#F1F5F9'], borderWidth: 0 }]
                      }}
                      options={{ cutout: '80%', plugins: { legend: { display: false } } }}
                    />
                  </div>
                  <h4 className="font-bold text-gray-900">Net Margin</h4>
                  <p className="text-sm text-gray-400 mt-2">Above industry average (21%)</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-6">
                    <Doughnut
                      data={{
                        labels: ['ROE', 'Other'],
                        datasets: [{ data: [18.5, 81.5], backgroundColor: ['#4F7DF3', '#F1F5F9'], borderWidth: 0 }]
                      }}
                      options={{ cutout: '80%', plugins: { legend: { display: false } } }}
                    />
                  </div>
                  <h4 className="font-bold text-gray-900">Return on Equity</h4>
                  <p className="text-sm text-gray-400 mt-2">Highly efficient capital usage</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-6">
                    <Doughnut
                      data={{
                        labels: ['Efficiency', 'Other'],
                        datasets: [{ data: [84, 16], backgroundColor: ['#F59E0B', '#F1F5F9'], borderWidth: 0 }]
                      }}
                      options={{ cutout: '80%', plugins: { legend: { display: false } } }}
                    />
                  </div>
                  <h4 className="font-bold text-gray-900">Asset Turnover</h4>
                  <p className="text-sm text-gray-400 mt-2">Strong operational efficiency</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
