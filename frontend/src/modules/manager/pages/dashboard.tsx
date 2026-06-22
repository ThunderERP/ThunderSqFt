import { PageTransition } from '../../shared/components/MotionComponents'
import PageHeader from '../../finance/components/PageHeader'
import StatCard from '../../finance/components/StatCard'
import DataTable from '../../finance/components/DataTable'
import { Target, Users, CheckSquare, BarChart3, Activity } from 'lucide-react'
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
        backgroundColor: '#2563EB',
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

  const columns = [
    { 
      key: 'rank', 
      label: 'Rank',
      render: (val: number) => (
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${val === 1 ? 'bg-yellow-100 text-yellow-700' : val === 2 ? 'bg-gray-200 text-gray-700' : val === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'}`}>
          #{val}
        </span>
      )
    },
    { key: 'name', label: 'Executive Name', render: (val: string) => <span className="font-semibold text-gray-900">{val}</span> },
    { key: 'leads', label: 'Leads Handled' },
    { key: 'visits', label: 'Site Visits' },
    { key: 'conversions', label: 'Conversions', render: (val: number) => <span className="font-bold text-gray-900">{val}</span> },
    { 
      key: 'rate', 
      label: 'Conversion Rate',
      render: (val: string) => <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-semibold">{val}</span>
    },
  ]

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader 
          title="Manager Dashboard" 
          subtitle="Monitor team performance and pipeline health."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Team Target" value="85%" subtitle="Of monthly goal achieved" icon={<Target size={20} />} trend="up" trendValue="5%" />
          <StatCard title="Active Pipeline" value="183" subtitle="Total leads in progress" icon={<Users size={20} />} trend="neutral" trendValue="0%" />
          <StatCard title="Approvals Pending" value="4" subtitle="Discount requests" icon={<CheckSquare size={20} />} trend="down" trendValue="1" />
          <StatCard title="Avg Conversion" value="8.2%" subtitle="Team average" icon={<BarChart3 size={20} />} trend="up" trendValue="0.5%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="platform-card p-6 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Pipeline Health</h3>
            <div className="h-64">
              <Bar 
                data={pipelineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: '#f3f4f6' }
                    },
                    x: {
                      grid: { display: false }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="platform-card p-6 flex flex-col h-[340px]">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-[#2563EB]" /> Live Activity Feed
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {recentActivity.map((activity, i) => (
                <div key={i} className="border-l-2 border-gray-100 pl-4 relative">
                  <div className={`absolute w-2 h-2 rounded-full -left-[5px] top-1.5 
                    ${activity.type === 'booking' ? 'bg-emerald-500' : 
                      activity.type === 'negative' ? 'bg-red-500' : 
                      activity.type === 'positive' ? 'bg-blue-500' : 
                      activity.type === 'alert' ? 'bg-amber-500' : 'bg-gray-400'}`} 
                  />
                  <p className="text-xs text-gray-400 mb-0.5">{activity.time}</p>
                  <p className="text-sm text-gray-700 leading-snug">{activity.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="platform-card overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Team Leaderboard</h3>
          </div>
          <DataTable columns={columns} data={mockLeaderboard} />
        </div>
      </div>
    </PageTransition>
  )
}
