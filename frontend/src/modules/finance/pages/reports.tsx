import { useState } from 'react'
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
import { Download } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { toast } from 'sonner'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import ScrollRevealComponent from '../components/ScrollReveal'
import { StaggerContainer, StaggerItem, PageTransition, ScrollRevealMotion } from '../components/MotionComponents'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const tabs = ['P&L Statement', 'Quarterly Analysis', 'Expense Breakdown', 'Cash Flow']

const plData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      data: [42000, 48000, 45000, 52000, 56000, 61000, 58000, 63000, 55000, 67000, 64000, 72000],
      backgroundColor: 'rgba(79, 125, 243, 0.85)',
      borderRadius: 4,
      barPercentage: 0.5,
    },
    {
      label: 'Expenses',
      data: [35000, 38000, 36000, 42000, 44000, 48000, 46000, 50000, 43000, 52000, 49000, 55000],
      backgroundColor: 'rgba(239, 68, 68, 0.75)',
      borderRadius: 4,
      barPercentage: 0.5,
    },
  ],
}

const quarterlyData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Revenue',
      data: [135000, 169000, 176000, 203000],
      backgroundColor: 'rgba(79, 125, 243, 0.85)',
      borderRadius: 6,
      barPercentage: 0.4,
    },
    {
      label: 'Expenses',
      data: [109000, 134000, 139000, 156000],
      backgroundColor: 'rgba(239, 68, 68, 0.75)',
      borderRadius: 6,
      barPercentage: 0.4,
    },
    {
      label: 'Profit',
      data: [26000, 35000, 37000, 47000],
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderRadius: 6,
      barPercentage: 0.4,
    },
  ],
}

const expenseBreakdownData = {
  labels: ['Salaries', 'Operations', 'Marketing', 'Technology', 'Rent', 'Utilities', 'Insurance', 'Misc'],
  datasets: [
    {
      label: 'Amount',
      data: [75000, 30000, 22500, 15000, 12000, 5400, 6300, 3800],
      backgroundColor: [
        'rgba(79, 125, 243, 0.85)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(6, 182, 212, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(148, 163, 184, 0.8)',
      ],
      borderRadius: 6,
      barPercentage: 0.6,
    },
  ],
}

const cashFlowData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Inflow',
      data: [52000, 58000, 55000, 64000, 68000, 73000],
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderRadius: 6,
      barPercentage: 0.5,
    },
    {
      label: 'Outflow',
      data: [42000, 45000, 43000, 50000, 48000, 55000],
      backgroundColor: 'rgba(239, 68, 68, 0.75)',
      borderRadius: 6,
      barPercentage: 0.5,
    },
  ],
}

const allChartData: Record<string, any> = {
  'P&L Statement': plData,
  'Quarterly Analysis': quarterlyData,
  'Expense Breakdown': expenseBreakdownData,
  'Cash Flow': cashFlowData,
}

const chartTitles: Record<string, { title: string; subtitle: string }> = {
  'P&L Statement': { title: 'Profit & Loss Statement', subtitle: 'Monthly revenue, expenses, and profit trends' },
  'Quarterly Analysis': { title: 'Quarterly Performance', subtitle: 'Revenue, expenses, and profit by quarter' },
  'Expense Breakdown': { title: 'Expense Breakdown', subtitle: 'Detailed breakdown by category' },
  'Cash Flow': { title: 'Cash Flow Analysis', subtitle: 'Monthly inflow and outflow comparison' },
}

const monthlySummary = [
  { month: 'January', revenue: 42000, expenses: 35000, profit: 7000 },
  { month: 'February', revenue: 48000, expenses: 38000, profit: 10000 },
  { month: 'March', revenue: 45000, expenses: 36000, profit: 9000 },
  { month: 'April', revenue: 52000, expenses: 42000, profit: 10000 },
  { month: 'May', revenue: 56000, expenses: 44000, profit: 12000 },
  { month: 'June', revenue: 61000, expenses: 48000, profit: 13000 },
]

export default function Reports() {
  const [activeTab, setActiveTab] = useState('P&L Statement')

  const handleExportReports = () => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.text('Financial Report', 14, 22)
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

    // KPIs
    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text('Key Performance Indicators', 14, 45)
    
    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value', 'Growth']],
      body: [
        ['YTD Revenue', 'Rs. 328,000', '+15.3%'],
        ['YTD Profit', 'Rs. 113,000', '+22.8%'],
        ['Profit Margin', '34.5%', '+2.1%'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 125, 243] },
    })

    // Monthly Summary
    doc.setFontSize(14)
    doc.text('Monthly Financial Summary', 14, (doc as any).lastAutoTable.finalY + 15)
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Month', 'Revenue (Rs.)', 'Expenses (Rs.)', 'Profit (Rs.)', 'Margin']],
      body: monthlySummary.map(row => [
        row.month,
        row.revenue.toLocaleString(),
        row.expenses.toLocaleString(),
        row.profit.toLocaleString(),
        `${((row.profit / row.revenue) * 100).toFixed(1)}%`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59] },
    })

    doc.save(`financial_report_${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success('Report Downloaded', {
      description: 'Your financial report has been exported as PDF.'
    })
  }

  return (
    <PageTransition>
      <PageHeader
        title="Financial Reports"
        subtitle="Comprehensive financial analysis and insights"
        actions={
          <button
            onClick={handleExportReports}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-medium text-sm shadow-lg transition-all"
            style={{ background: '#2563EB', boxShadow: '0 8px 24px rgba(37,99,235,0.25)' }}
          >
            <Download size={18} />
            Export Reports
          </button>
        }
      />

      {/* KPI Cards */}
      <StaggerContainer className="bento-grid mb-8" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StaggerItem><StatCard label="YTD Revenue" value="₹328,000" subtitle="↗ +15.3% vs last year" /></StaggerItem>
        <StaggerItem><StatCard label="YTD Profit" value="₹113,000" subtitle="↗ +22.8% vs last year" valueColor="text-emerald-600" /></StaggerItem>
        <StaggerItem><StatCard label="Profit Margin" value="34.5%" subtitle="↗ +2.1% vs last year" /></StaggerItem>
      </StaggerContainer>

      {/* Tabs */}
      <ScrollRevealMotion delay={0.05}>
      <div className="neu-card mb-8">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative ${
                activeTab === tab
                  ? 'text-primary-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">{chartTitles[activeTab].title}</h2>
          <p className="text-sm text-gray-400 mb-6">{chartTitles[activeTab].subtitle}</p>
          <div className="h-[380px]">
            <Bar
              data={allChartData[activeTab]}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
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
                  tooltip: {
                    backgroundColor: '#1E293B',
                    titleFont: { family: 'Inter', size: 13 },
                    bodyFont: { family: 'Inter', size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                      label: function (context: any) {
                        return `${context.dataset.label}: ₹${(context.parsed.y / 1000).toFixed(0)}k`
                      },
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
                      callback: function (value: any) {
                        return `₹${(value / 1000).toFixed(0)}k`
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

      {/* Monthly Summary Table */}
      <ScrollRevealMotion delay={0.1}>
      <div className="neu-card overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Summary</h2>
          <p className="text-sm text-gray-400">Revenue, expenses, and profit by month</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expenses</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Margin</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.map((row) => (
                <tr key={row.month} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.month}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">₹{row.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">₹{row.expenses.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-emerald-600">₹{row.profit.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{((row.profit / row.revenue) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </ScrollRevealMotion>
    </PageTransition>
  )
}
