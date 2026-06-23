import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { Building2 } from 'lucide-react'
import StatusBadge from '../../shared/components/StatusBadge'

const branchData = [
  { name: 'Mumbai', leads: 63, bookings: 6, revenueStr: '₹1.5Cr', revenue: 150, loanFiles: 4, conversion: 9.5 },
  { name: 'Pune', leads: 67, bookings: 15, revenueStr: '₹3.8Cr', revenue: 380, loanFiles: 6, conversion: 22.4 },
  { name: 'Delhi', leads: 42, bookings: 13, revenueStr: '₹3.3Cr', revenue: 330, loanFiles: 14, conversion: 31.0 },
  { name: 'Bangalore', leads: 77, bookings: 9, revenueStr: '₹2.3Cr', revenue: 230, loanFiles: 6, conversion: 11.7 },
  { name: 'Hyderabad', leads: 51, bookings: 6, revenueStr: '₹1.5Cr', revenue: 150, loanFiles: 8, conversion: 11.8 },
]

const rankedByConversion = [...branchData].sort((a, b) => b.conversion - a.conversion)
const maxConversion = rankedByConversion[0].conversion

const formatYAxisRevenue = (tickItem: number) => {
  if (tickItem === 0) return '0L'
  return `${tickItem}L`
}

export default function BranchComparison() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-2">
        <h1 className="page-title font-display">Branch Performance Comparison</h1>
        <p className="page-subtitle">Side-by-side performance across all branches</p>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {branchData.map((branch, idx) => {
          const statusText = branch.conversion >= 20 ? 'On-Target' : branch.conversion >= 10 ? 'Watch' : 'At-Risk'

          return (
            <div key={idx} className="card p-5 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--accent)]">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)] leading-tight font-display">{branch.name}</h3>
                  <p className="text-xs text-[var(--ink-soft)] mt-0.5 font-sans">{branch.name} Branch</p>
                </div>
              </div>
              
              <div className="space-y-3 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[var(--ink-soft)] font-sans">Leads</span>
                  <span className="font-bold text-[var(--ink)]">{branch.leads}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[var(--ink-soft)] font-sans">Bookings</span>
                  <span className="font-bold text-[var(--ink)]">{branch.bookings}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[var(--ink-soft)] font-sans">Revenue</span>
                  <span className="font-bold text-[var(--gold)]">{branch.revenueStr}</span>
                </div>
                <div className="flex justify-between items-center pt-1 text-xs">
                  <span className="text-[var(--ink-soft)] font-sans">Conversion</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[var(--ink)]">{branch.conversion}%</span>
                    <StatusBadge status={statusText} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart 1: Leads vs Bookings by Branch */}
        <div className="card p-6 lg:col-span-3">
          <h3 className="text-base font-bold text-[var(--ink)] mb-6 font-display">Leads vs Bookings by Branch</h3>
          <div className="h-72" role="img" aria-label="Leads vs Bookings by Branch.">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-soft)', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-soft)', fontSize: 11 }} domain={[0, 80]} ticks={[0, 20, 40, 60, 80]} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--ink)', borderRadius: '8px' }}
                  cursor={{ fill: 'var(--bg-hover)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} iconType="square" />
                <Bar dataKey="leads" name="Leads" fill="var(--accent)" maxBarSize={20} radius={[2, 2, 0, 0]} />
                <Bar dataKey="bookings" name="Bookings" fill="var(--success)" maxBarSize={20} radius={[2, 2, 0, 0]} />
                <Bar dataKey="loanFiles" name="Loan Files" fill="var(--violet)" maxBarSize={20} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Revenue by Branch */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-base font-bold text-[var(--ink)] mb-6 font-display">Revenue by Branch</h3>
          <div className="h-72" role="img" aria-label="Revenue by Branch.">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-soft)', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-soft)', fontSize: 11 }} domain={[0, 380]} ticks={[0, 95, 190, 285, 380]} tickFormatter={formatYAxisRevenue} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--ink)', borderRadius: '8px' }}
                  cursor={{ fill: 'var(--bg-hover)' }}
                  formatter={(value: number, name: string, props: any) => [props.payload.revenueStr, 'Revenue']}
                />
                <Bar dataKey="revenue" name="Revenue" fill="var(--gold)" maxBarSize={40} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Conversion Rate Ranking */}
      <div className="card p-6">
        <h3 className="text-base font-bold text-[var(--ink)] mb-6 font-display">Conversion Rate Ranking</h3>
        <div className="space-y-6">
          {rankedByConversion.map((branch, idx) => {
            const statusText = branch.conversion >= 20 ? 'On-Target' : branch.conversion >= 10 ? 'Watch' : 'At-Risk'
            const progressPercent = (branch.conversion / maxConversion) * 100

            return (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24 text-sm font-semibold text-[var(--ink)] flex items-center gap-2 font-sans">
                  <span className="text-[var(--ink-muted)]">#{idx + 1}</span> {branch.name}
                </div>
                
                <div className="flex-1 h-2 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="w-28 text-right flex items-center justify-end gap-1.5">
                  <span className="font-mono font-bold text-xs text-[var(--ink)]">{branch.conversion}%</span>
                  <StatusBadge status={statusText} />
                </div>

                <div className="w-20 text-right text-sm font-mono font-bold text-[var(--gold)]">
                  {branch.revenueStr}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
