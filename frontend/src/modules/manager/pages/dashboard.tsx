import { PageTransition } from '../../shared/components/MotionComponents'
import PageHeader from '../../shared/components/PageHeader'
import StatCard from '../../shared/components/StatCard'
import DataTable from '../../shared/components/DataTable'
import StatusBadge from '../../shared/components/StatusBadge'
import ActivityTimeline from '../../shared/components/ActivityTimeline'
import { Target, Users, CheckSquare, BarChart3 } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function ManagerDashboard() {
  const pipelineData = {
    labels: ['New Leads', 'Contacted', 'Site Visit', 'Negotiation', 'Booking'],
    datasets: [
      {
        label: 'Active Pipeline',
        data: [45, 30, 18, 8, 5],
        backgroundColor: '#3D7FFF', // var(--accent)
        borderRadius: 4,
      }
    ]
  }

  const mockLeaderboard = [
    { rank: 1, name: 'Vikram Singh', leads: 45, visits: 18, conversions: 5, rate: '11.1%' },
    { rank: 2, name: 'Anjali Sharma', leads: 38, visits: 15, conversions: 4, rate: '10.5%' },
    { rank: 3, name: 'Rohan Gupta', leads: 42, visits: 12, conversions: 3, rate: '7.1%' },
    { rank: 4, name: 'Priya Desai', leads: 28, visits: 8, conversions: 2, rate: '7.1%' },
    { rank: 5, name: 'Amit Verma', leads: 30, visits: 5, conversions: 1, rate: '3.3%' },
  ]

  const recentActivity = [
    { time: '10 mins ago', text: 'Vikram Singh booked Lodha Bellissimo A-402 (₹1.5 Cr)', type: 'booking' },
    { time: '1 hour ago', text: 'Anjali Sharma marked SV-104 as No Show', type: 'negative' },
    { time: '2 hours ago', text: 'Rohan Gupta completed Site Visit for Priya Kapoor (Outcome: Positive)', type: 'positive' },
    { time: '3 hours ago', text: 'Discount Approval requested by Vikram Singh for B-703', type: 'alert' },
    { time: '5 hours ago', text: 'Amit Verma added 5 new leads from Facebook campaign', type: 'info' },
  ]

  const activityEvents = recentActivity.map(act => ({
    title: act.type === 'booking' ? 'Booking Confirmed' : 
           act.type === 'negative' ? 'Lead Status Alert' : 
           act.type === 'positive' ? 'Site Visit Logged' : 
           act.type === 'alert' ? 'Approval Requested' : 'Campaign Activity',
    desc: act.text,
    time: act.time,
    color: act.type === 'booking' ? 'var(--success)' : 
           act.type === 'negative' ? 'var(--danger)' : 
           act.type === 'positive' ? 'var(--accent)' : 
           act.type === 'alert' ? 'var(--gold)' : 'var(--ink-soft)',
    icon: act.type === 'booking' ? 'Briefcase' : 
          act.type === 'negative' ? 'XCircle' : 
          act.type === 'positive' ? 'CheckCircle' : 
          act.type === 'alert' ? 'AlertTriangle' : 'Activity'
  }))

  const columns = [
    { 
      key: 'rank', 
      label: 'Rank',
      render: (item: any) => <StatusBadge status={`#${item.rank}`} />
    },
    { 
      key: 'name', 
      label: 'Executive Name', 
      render: (item: any) => <span className="font-bold text-[var(--ink)] font-sans">{item.name}</span> 
    },
    { key: 'leads', label: 'Leads Handled' },
    { key: 'visits', label: 'Site Visits' },
    { 
      key: 'conversions', 
      label: 'Conversions', 
      render: (item: any) => <span className="font-mono font-bold text-[var(--ink)]">{item.conversions}</span> 
    },
    { 
      key: 'rate', 
      label: 'Conversion Rate',
      render: (item: any) => {
        const numericRate = parseFloat(item.rate)
        return (
          <div className="flex items-center gap-1.5 font-mono">
            <span>{item.rate}</span>
            <StatusBadge status={numericRate >= 10 ? 'On-Target' : 'Watch'} />
          </div>
        )
      }
    },
  ]

  return (
    <PageTransition>
      <div className="space-y-6 text-left">
        <PageHeader 
          title={<span className="font-display">Manager Dashboard</span>} 
          subtitle="Monitor team performance and pipeline health."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Team Target" value="85%" subtitle="Of monthly goal achieved" icon={<Target size={16} />} trend="up" trendValue="5%" />
          <StatCard label="Active Pipeline" value="183" subtitle="Total leads in progress" icon={<Users size={16} />} trend="neutral" trendValue="0%" />
          <StatCard label="Approvals Pending" value="4" subtitle="Discount requests" icon={<CheckSquare size={16} />} trend="down" trendValue="1" />
          <StatCard label="Avg Conversion" value="8.2%" subtitle="Team average" icon={<BarChart3 size={16} />} trend="up" trendValue="0.5%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 lg:col-span-2">
            <h3 className="text-base font-bold text-[var(--ink)] mb-6 font-display">Pipeline Health</h3>
            <div className="h-64" role="img" aria-label="Active pipeline chart.">
              <Bar 
                data={pipelineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      borderWidth: 1,
                      titleColor: 'var(--ink)',
                      bodyColor: 'var(--ink-soft)',
                      titleFont: { family: 'var(--font-sans)', size: 12 },
                      bodyFont: { family: 'var(--font-mono)', size: 11 }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'var(--border-color)' },
                      ticks: { color: 'var(--ink-soft)', font: { family: 'var(--font-mono)', size: 10 } }
                    },
                    x: {
                      grid: { display: false },
                      ticks: { color: 'var(--ink-soft)', font: { family: 'var(--font-sans)', size: 10 } }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div>
            <ActivityTimeline events={activityEvents} />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-[var(--ink)] font-display">Team Leaderboard</h3>
          <DataTable columns={columns} data={mockLeaderboard} />
        </div>
      </div>
    </PageTransition>
  )
}
