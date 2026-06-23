import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ComposedChart, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts'
import { Users, ArrowUpRight, Briefcase, IndianRupee, BarChart2, FileText, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { PageTransition, CountUp, StaggerList, StaggerItem } from '../../shared/components/MotionComponents'
import StatCard from '../../shared/components/StatCard'
import DataTable from '../../shared/components/DataTable'
import ActivityTimeline from '../../shared/components/ActivityTimeline'
import StatusBadge from '../../shared/components/StatusBadge'

// Mock Data
const kpiData = [
  { title: "TOTAL LEADS", value: 12, icon: Users, color: "text-accent", bg: "var(--accent-soft)" },
  { title: "SITE VISITS", value: 4, icon: ArrowUpRight, color: "text-purple", bg: "var(--purple-soft)" },
  { title: "BOOKINGS", value: 4, icon: Briefcase, color: "text-success", bg: "var(--success-soft)" },
  { title: "REVENUE", value: 2000000, icon: IndianRupee, color: "text-success", bg: "var(--success-soft)", prefix: "₹", suffix: "" },
  { title: "CONVERSION", value: 33.3, icon: BarChart2, color: "text-gold", bg: "var(--gold-soft)", suffix: "%" },
  { title: "LOAN FILES", value: 5, icon: FileText, color: "text-accent", bg: "var(--accent-soft)" },
]

const revenueVsTargetData = [
  { month: 'Jan', actual: 12000000, target: 10000000 },
  { month: 'Feb', actual: 15000000, target: 14000000 },
  { month: 'Mar', actual: 21000000, target: 18000000 },
  { month: 'Apr', actual: 28000000, target: 25000000 },
  { month: 'May', actual: 35000000, target: 32000000 },
  { month: 'Jun', actual: 48000000, target: 40000000 },
]

const leadSourceData = [
  { name: 'Whatsapp', value: 5, color: 'var(--whatsapp)' },
  { name: 'Reference', value: 10, color: 'var(--purple)' },
  { name: 'Walk In', value: 5, color: 'var(--accent)' },
  { name: 'Portal', value: 10, color: 'var(--gold)' },
  { name: 'Other', value: 40, color: 'var(--ink-muted)' },
  { name: 'Facebook', value: 15, color: 'var(--zapier)' },
  { name: 'Google', value: 15, color: 'var(--success)' },
]

const leadStatusData = [
  { status: 'New', count: 420 },
  { status: 'Contacted', count: 380 },
  { status: 'Site Visited', count: 250 },
  { status: 'Negotiation', count: 180 },
  { status: 'Lost', count: 120 },
]

const loanDisbursementsData = [
  { month: 'Jan', amount: 1.2 },
  { month: 'Feb', amount: 1.5 },
  { month: 'Mar', amount: 2.1 },
  { month: 'Apr', amount: 2.8 },
  { month: 'May', amount: 3.5 },
  { month: 'Jun', amount: 4.8 },
]

const branchPerformanceData = [
  { branch: 'Delhi', branchSub: 'Delhi Branch', leads: 22, bookings: 16, revenue: 40000000, loanFiles: 3, conversion: 72.7 },
  { branch: 'Pune', branchSub: 'Pune Branch', leads: 71, bookings: 13, revenue: 33000000, loanFiles: 14, conversion: 18.3 },
  { branch: 'Bangalore', branchSub: 'Bangalore Branch', leads: 81, bookings: 13, revenue: 33000000, loanFiles: 10, conversion: 16.0 },
  { branch: 'Hyderabad', branchSub: 'Hyderabad Branch', leads: 73, bookings: 12, revenue: 30000000, loanFiles: 17, conversion: 16.4 },
  { branch: 'Mumbai', branchSub: 'Mumbai Branch', leads: 84, bookings: 9, revenue: 23000000, loanFiles: 10, conversion: 10.7 },
]

const loanPipelineData = [
  { label: 'PD Pending', value: 0, color: 'var(--ink-muted)', border: 'rgba(255,255,255,0.08)' },
  { label: 'Doc Pending', value: 1, color: 'var(--danger)', border: 'var(--danger-soft)' },
  { label: 'Login Pending', value: 1, color: 'var(--warning)', border: 'var(--warning-soft)' },
  { label: 'Credit Query', value: 1, color: 'var(--gold)', border: 'var(--gold-soft)' },
  { label: 'Sanction Pending', value: 0, color: 'var(--gold)', border: 'var(--gold-soft)' },
  { label: 'Sanction Approved', value: 1, color: 'var(--success)', border: 'var(--success-soft)' },
  { label: 'Reg Pending', value: 0, color: 'var(--accent)', border: 'var(--accent-soft)' },
  { label: 'Disb Pending', value: 0, color: 'var(--purple)', border: 'var(--purple-soft)' },
  { label: 'Disbursed', value: 1, color: 'var(--success)', border: 'var(--success-soft)' },
]

const activityEvents = [
  { icon: 'Users', color: 'var(--accent)', title: 'New Lead Assigned', time: '10m ago', desc: 'Lead "Rajesh Kumar" assigned to Delhi Branch Agent' },
  { icon: 'Briefcase', color: 'var(--success)', title: 'Booking Confirmed', time: '45m ago', desc: 'Booking of ₹45,00,000 completed by Pune Branch' },
  { icon: 'FileText', color: 'var(--purple)', title: 'Loan File Updated', time: '2h ago', desc: 'Loan file #LF-4820 moved to credit review stage' },
  { icon: 'IndianRupee', color: 'var(--gold)', title: 'Invoice Paid', time: '3h ago', desc: 'Invoice #INV-2024-089 (₹1,20,000) marked as Paid' },
  { icon: 'Activity', color: 'var(--warning)', title: 'System Alert', time: '5h ago', desc: 'Automation trigger "Lead Follow-up SLA" executed successfully' }
]

export default function CEODashboard() {
  const [dateRange, setDateRange] = useState('This Year')
  const [branch, setBranch] = useState('All Branches')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 800)
  }

  // Custom label for Pie Chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill={leadSourceData[index].color} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontWeight={600} className="font-sans">
        {`${name} ${value}%`}
      </text>
    );
  };

  const branchColumns = [
    {
      key: 'branch',
      label: 'Branch',
      render: (item: any) => (
        <div>
          <p className="font-bold text-[var(--ink)] font-sans">{item.branch}</p>
          <p className="text-[10px] text-[var(--ink-soft)] font-sans mt-0.5">{item.branchSub}</p>
        </div>
      ),
    },
    {
      key: 'leads',
      label: 'Leads',
    },
    {
      key: 'bookings',
      label: 'Bookings',
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (item: any) => `₹${item.revenue.toLocaleString('en-IN')}`,
    },
    {
      key: 'loanFiles',
      label: 'Loan Files',
    },
    {
      key: 'conversion',
      label: 'Conversion',
      render: (item: any) => {
        const value = item.conversion;
        const label = value > 20 ? 'On-Target' : value > 15 ? 'Watch' : 'At-Risk';
        return (
          <div className="flex items-center gap-2 font-mono">
            <span>{value}%</span>
            <StatusBadge status={label} />
          </div>
        );
      },
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title font-display">CEO Dashboard</h1>
            <p className="page-subtitle">Executive overview — all branches combined</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="card p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Date Range</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 rounded-lg bg-bg-surface border border-border-color text-xs font-semibold focus:outline-none focus:border-accent transition-all outline-none cursor-pointer text-ink"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 90 Days">Last 90 Days</option>
                <option value="This Year">This Year</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Branch</span>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="px-3 py-2 rounded-lg bg-bg-surface border border-border-color text-xs font-semibold focus:outline-none focus:border-accent transition-all outline-none cursor-pointer text-ink"
              >
                <option value="All Branches">All Branches</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            {(dateRange !== 'This Year' || branch !== 'All Branches') && (
              <span className="self-end px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-accent bg-accent-soft border border-accent/20 badge-pop">
                Showing filtered data
              </span>
            )}
          </div>

          <button
            onClick={handleRefresh}
            className="self-end flex items-center gap-2 btn-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            aria-label="Refresh Dashboard Metrics"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* KPI Strip */}
        <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiData.map((kpi, idx) => (
            <StaggerItem key={idx}>
              <StatCard
                label={kpi.title}
                value={
                  <CountUp 
                    value={kpi.value} 
                    prefix={kpi.prefix || ''} 
                    suffix={kpi.suffix || ''} 
                  />
                }
                icon={<kpi.icon size={16} />}
                trend={idx % 2 === 0 ? 'up' : 'down'}
                trendValue={idx % 2 === 0 ? '12%' : '4%'}
                subtitle="vs last month"
                delay={idx}
              />
            </StaggerItem>
          ))}
        </StaggerList>

        {/* Charts Grid Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Revenue vs Target */}
          <div className="card p-6">
            <h3 className="text-base font-bold text-ink mb-6 font-display">Revenue vs Target</h3>
            <div className="h-72" role="img" aria-label="Revenue vs Target chart.">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueVsTargetData} margin={{ top: 20, right: 0, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-soft)', fontSize: 11 }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--ink-soft)', fontSize: 11 }} 
                    tickFormatter={(val) => `₹${(val / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--ink)', borderRadius: '8px' }}
                    cursor={{ fill: 'var(--bg-hover)' }}
                    formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, '']}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} iconType="square" />
                  <Bar dataKey="actual" name="Actual Revenue" fill="var(--accent)" maxBarSize={40} radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="target" name="Target Revenue" stroke="var(--gold)" strokeWidth={2} strokeDasharray="5 5" dot={true} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Lead Source Distribution */}
          <div className="card p-6">
            <h3 className="text-base font-bold text-ink mb-6 font-display">Lead Source Distribution</h3>
            <div className="h-72" role="img" aria-label="Pie chart illustrating distribution of lead sources.">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    stroke="var(--bg-card)"
                    strokeWidth={2}
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--ink)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Grid Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 3: Lead Status Breakdown */}
          <div className="card p-6">
            <h3 className="text-base font-bold text-ink mb-6 font-display">Lead Status Breakdown</h3>
            <div className="h-64" role="img" aria-label="Lead status counts.">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={leadStatusData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-soft)', fontSize: 11 }} />
                  <YAxis type="category" dataKey="status" axisLine={false} tickLine={false} tick={{ fill: 'var(--ink)', fontSize: 11, fontWeight: 500 }} dx={-5} />
                  <Tooltip cursor={{ fill: 'var(--bg-hover)' }} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--ink)', borderRadius: '8px' }} />
                  <Bar dataKey="count" name="Count" fill="var(--accent)" radius={[0, 4, 4, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Monthly Loan Disbursements */}
          <div className="card p-6">
            <h3 className="text-base font-bold text-ink mb-6 font-display">Monthly Loan Disbursements</h3>
            <div className="h-64" role="img" aria-label="Monthly loan disbursements.">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={loanDisbursementsData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorAmount2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--success)" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-soft)', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-soft)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--ink)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="amount" stroke="var(--success)" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Branch Performance Section */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-ink font-display">Branch Performance</h3>
              <DataTable
                columns={branchColumns}
                data={branchPerformanceData}
                searchPlaceholder="Search branches..."
                searchKey="branch"
              />
            </div>

            {/* Loan Pipeline Summary */}
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-border-color">
                <h3 className="text-base font-bold text-ink font-display">Loan Pipeline Summary</h3>
              </div>
              <div className="p-6 overflow-x-auto">
                <div className="flex items-center gap-3 min-w-max pb-2">
                  {loanPipelineData.map((item, idx) => (
                    <div key={idx} className="flex-1 min-w-[120px] rounded-lg border p-3 text-center" style={{ borderColor: item.border, background: 'var(--bg-card)' }}>
                      <h3 className="text-2xl font-bold font-mono" style={{ color: item.color }}>
                        <CountUp value={item.value} />
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: item.color }}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <ActivityTimeline events={activityEvents} />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
