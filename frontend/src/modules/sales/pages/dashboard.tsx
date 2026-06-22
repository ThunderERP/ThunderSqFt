import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import PageHeader from '../../finance/components/PageHeader'
import StatCard from '../../finance/components/StatCard'
import { Users, CalendarCheck, Home, PhoneCall, TrendingUp } from 'lucide-react'
import { LEAD_STAGES, LEAD_SOURCES, SOURCE_COLORS } from '../utils/leadStages'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function SalesDashboard() {
  const funnelData = [1248, 980, 720, 540, 380, 290, 148, 87]
  const maxLeads = funnelData[0]

  const doughnutData = {
    labels: [...LEAD_SOURCES],
    datasets: [{
      data: [420, 310, 205, 150, 115, 48],
      backgroundColor: [
        SOURCE_COLORS['Facebook'].text,
        SOURCE_COLORS['Google'].text,
        SOURCE_COLORS['WhatsApp'].text,
        SOURCE_COLORS['Reference'].text,
        SOURCE_COLORS['Walk-in'].text,
        SOURCE_COLORS['Portal'].text,
      ],
      borderWidth: 0,
    }]
  }

  const doughnutOptions = {
    cutout: '75%',
    plugins: {
      legend: { position: 'right' as const, labels: { usePointStyle: true, boxWidth: 8 } }
    }
  }

  const topExecs = [
    { id: 1, name: 'Vikram Singh', branch: 'Mumbai', bookings: 12, value: '₹4.2 Cr', grade: 'A+' },
    { id: 2, name: 'Anjali Sharma', branch: 'Pune', bookings: 9, value: '₹3.1 Cr', grade: 'A' },
    { id: 3, name: 'Rohan Gupta', branch: 'Delhi', bookings: 7, value: '₹2.8 Cr', grade: 'B+' },
  ]

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader 
          title="Sales Command Center" 
          subtitle="Real-time overview of lead funnel and team performance."
          actions={
            <button className="bg-[#2563EB] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
              + New Campaign
            </button>
          }
        />

        {/* Funnel Hero Section */}
        <div className="platform-card p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-[#2563EB]" />
            Active Sales Pipeline
          </h2>
          <div className="flex flex-col gap-3">
            {LEAD_STAGES.map((stage, i) => {
              const count = funnelData[i]
              const pct = Math.round((count / maxLeads) * 100)
              return (
                <div key={stage} className="flex items-center gap-4 text-sm">
                  <div className="w-32 font-medium text-gray-700 text-right shrink-0">{stage}</div>
                  <div className="flex-1 h-10 bg-gray-100 rounded-lg relative overflow-hidden flex items-center">
                    <div 
                      className="absolute top-0 left-0 bottom-0 bg-[#2563EB]/20 transition-all duration-1000"
                      style={{ width: `${pct}%` }}
                    />
                    <div 
                      className="absolute top-0 left-0 bottom-0 bg-[#2563EB] transition-all duration-1000"
                      style={{ width: `${pct}%`, opacity: 1 - (i * 0.1) }}
                    />
                    <span className="absolute left-4 font-bold text-white drop-shadow-md z-10">{count}</span>
                  </div>
                  <div className="w-16 font-bold text-gray-500 text-right">{pct}%</div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 flex items-center justify-center gap-8 py-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-sm"><span className="text-red-500 mr-2">🔴</span>Lost: <span className="font-bold">156 leads</span></div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="text-sm"><span className="text-purple-500 mr-2">🟣</span>Future Prospect: <span className="font-bold">64 leads</span></div>
          </div>
        </div>

        {/* KPIs */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StaggerItem>
            <StatCard
              title="Total Leads"
              value="1,248"
              subtitle="+145 new this month"
              icon={<Users size={20} />}
              trend="up"
              trendValue="12%"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              title="Site Visits"
              value="290"
              subtitle="148 completed"
              icon={<CalendarCheck size={20} />}
              trend="up"
              trendValue="8%"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              title="Bookings"
              value="87"
              subtitle="₹24.5 Cr total value"
              icon={<Home size={20} />}
              trend="up"
              trendValue="15%"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              title="Follow-ups Due"
              value="142"
              subtitle={<span className="text-red-500 font-medium">38 overdue today</span>}
              icon={<PhoneCall size={20} />}
              trend="neutral"
              trendValue="0%"
            />
          </StaggerItem>
        </StaggerContainer>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="platform-card p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Lead Source Distribution</h3>
            <div className="flex-1 flex items-center justify-center max-h-[250px]">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>

          <div className="platform-card p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Top Performers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-100 uppercase">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-xl">Executive</th>
                    <th className="px-4 py-3">Bookings</th>
                    <th className="px-4 py-3">Value</th>
                    <th className="px-4 py-3 rounded-tr-xl">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topExecs.map(exec => (
                    <tr key={exec.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{exec.name}</div>
                        <div className="text-xs text-gray-500">{exec.branch}</div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-700">{exec.bookings}</td>
                      <td className="px-4 py-4 text-gray-600">{exec.value}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                          exec.grade === 'A+' ? 'bg-green-100 text-green-700' :
                          exec.grade === 'A' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {exec.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
