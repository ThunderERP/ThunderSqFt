import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import PageHeader from '../../shared/components/PageHeader'
import StatCard from '../../shared/components/StatCard'
import { Users, CalendarCheck, Home, PhoneCall, TrendingUp } from 'lucide-react'
import { LEAD_STAGES, LEAD_SOURCES } from '../utils/leadStages'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import DataTable from '../../shared/components/DataTable'
import StatusBadge from '../../shared/components/StatusBadge'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function SalesDashboard() {
  const funnelData = [1248, 980, 720, 540, 380, 290, 148, 87]
  const maxLeads = funnelData[0]

  const doughnutData = {
    labels: [...LEAD_SOURCES],
    datasets: [{
      data: [420, 310, 205, 150, 115, 48],
      backgroundColor: [
        'var(--accent)',
        'var(--success)',
        'var(--gold)',
        'var(--violet)',
        'var(--danger)',
        'var(--ink-muted)',
      ],
      borderWidth: 0,
    }]
  }

  const doughnutOptions = {
    cutout: '75%',
    plugins: {
      legend: { 
        position: 'right' as const, 
        labels: { 
          usePointStyle: true, 
          boxWidth: 8,
          color: 'var(--ink-soft)',
          font: { family: 'var(--font-sans)', size: 11, weight: 'bold' as any }
        } 
      }
    }
  }

  const topExecs = [
    { id: 1, name: 'Vikram Singh', branch: 'Mumbai', bookings: 12, value: '₹4.2 Cr', grade: 'A+' },
    { id: 2, name: 'Anjali Sharma', branch: 'Pune', bookings: 9, value: '₹3.1 Cr', grade: 'A' },
    { id: 3, name: 'Rohan Gupta', branch: 'Delhi', bookings: 7, value: '₹2.8 Cr', grade: 'B+' },
  ]

  const execColumns = [
    {
      key: 'name',
      label: 'Executive',
      render: (item: any) => (
        <div>
          <p className="font-bold text-[var(--ink)] font-sans">{item.name}</p>
          <p className="text-[10px] text-[var(--ink-soft)] font-sans mt-0.5">{item.branch}</p>
        </div>
      )
    },
    {
      key: 'bookings',
      label: 'Bookings',
    },
    {
      key: 'value',
      label: 'Value',
      render: (item: any) => <span className="font-mono text-[var(--gold)] font-bold">{item.value}</span>
    },
    {
      key: 'grade',
      label: 'Grade',
      render: (item: any) => <StatusBadge status={item.grade} />
    }
  ]

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader 
          title={<span className="font-display">Sales Command Center</span>} 
          subtitle="Real-time overview of lead funnel and team performance."
          actions={
            <button className="btn-primary flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]">
              + New Campaign
            </button>
          }
        />

        {/* Funnel Hero Section */}
        <div className="card p-6 shadow-card text-left">
          <h2 className="text-base font-bold text-[var(--ink)] mb-6 flex items-center gap-2 font-display">
            <TrendingUp size={18} className="text-[var(--accent)]" />
            Active Sales Pipeline
          </h2>
          <div className="flex flex-col gap-3">
            {LEAD_STAGES.map((stage, i) => {
              const count = funnelData[i]
              const pct = Math.round((count / maxLeads) * 100)
              return (
                <div key={stage} className="flex items-center gap-4 text-xs">
                  <div className="w-28 font-bold text-[var(--ink-soft)] text-right shrink-0">{stage}</div>
                  <div className="flex-1 h-8 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg relative overflow-hidden flex items-center">
                    <div 
                      className="absolute top-0 left-0 bottom-0 bg-[var(--accent-soft)] transition-all duration-1000"
                      style={{ width: `${pct}%` }}
                    />
                    <div 
                      className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/40 transition-all duration-1000"
                      style={{ width: `${pct}%`, opacity: 1 - (i * 0.08) }}
                    />
                    <span className="absolute left-4 font-mono font-bold text-white z-10">{count}</span>
                  </div>
                  <div className="w-12 font-mono font-bold text-[var(--ink-soft)] text-right">{pct}%</div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 py-3 bg-[var(--bg-surface)]/30 rounded-xl border border-[var(--border-color)] text-xs">
            <div className="text-[var(--ink-soft)]"><span className="text-[var(--danger)] mr-1.5">●</span>Lost: <span className="font-mono font-bold text-[var(--danger)]">156 leads</span></div>
            <div className="w-px h-4 bg-[var(--border-color)]" />
            <div className="text-[var(--ink-soft)]"><span className="text-[var(--violet)] mr-1.5">●</span>Future Prospect: <span className="font-mono font-bold text-[var(--violet)]">64 leads</span></div>
          </div>
        </div>

        {/* KPIs */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StaggerItem>
            <StatCard
              label="Total Leads"
              value="1,248"
              subtitle="+145 new this month"
              icon={<Users size={16} />}
              trend="up"
              trendValue="12%"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Site Visits"
              value="290"
              subtitle="148 completed"
              icon={<CalendarCheck size={16} />}
              trend="up"
              trendValue="8%"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Bookings"
              value="87"
              subtitle="₹24.5 Cr total value"
              icon={<Home size={16} />}
              trend="up"
              trendValue="15%"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Follow-ups Due"
              value="142"
              subtitle={<span className="text-[var(--danger)] font-bold">38 overdue today</span>}
              icon={<PhoneCall size={16} />}
              trend="neutral"
              trendValue="0%"
            />
          </StaggerItem>
        </StaggerContainer>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6 flex flex-col justify-between text-left">
            <h3 className="text-base font-bold text-[var(--ink)] mb-6 font-display">Lead Source Distribution</h3>
            <div className="flex-1 flex items-center justify-center max-h-[250px] py-4">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>

          <div className="space-y-3 text-left">
            <h3 className="text-base font-bold text-[var(--ink)] font-display">Top Performers</h3>
            <DataTable
              columns={execColumns}
              data={topExecs}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
