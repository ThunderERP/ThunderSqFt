import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'
import { Building2 } from 'lucide-react'

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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Branch Performance Comparison</h1>
        <p className="text-sm text-slate-500 mt-0.5">Side-by-side performance across all branches</p>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {branchData.map((branch, idx) => {
          let conversionColor = 'text-amber-500 bg-amber-50'
          if (branch.conversion >= 20) conversionColor = 'text-emerald-500 bg-emerald-50'
          else if (branch.conversion < 10) conversionColor = 'text-rose-500 bg-rose-50'

          return (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-500">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{branch.name}</h3>
                  <p className="text-xs text-slate-500">{branch.name}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Leads</span>
                  <span className="text-sm font-bold text-slate-900">{branch.leads}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Bookings</span>
                  <span className="text-sm font-bold text-slate-900">{branch.bookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Revenue</span>
                  <span className="text-sm font-bold text-blue-600">{branch.revenueStr}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs text-slate-500">Conversion</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${conversionColor}`}>
                    {branch.conversion}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart 1: Leads vs Bookings by Branch */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-3">
          <h3 className="text-base font-bold text-slate-900 mb-6">Leads vs Bookings by Branch</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 80]} ticks={[0, 20, 40, 60, 80]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} iconType="square" />
                <Bar dataKey="leads" name="Leads" fill="#2563eb" maxBarSize={20} />
                <Bar dataKey="bookings" name="Bookings" fill="#10b981" maxBarSize={20} />
                <Bar dataKey="loanFiles" name="Loan Files" fill="#eab308" maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Revenue by Branch */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="text-base font-bold text-slate-900 mb-6">Revenue by Branch</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 380]} ticks={[0, 95, 190, 285, 380]} tickFormatter={formatYAxisRevenue} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                  formatter={(value: number, name: string, props: any) => [props.payload.revenueStr, 'Revenue']}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#6366f1" maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Conversion Rate Ranking */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-6">Conversion Rate Ranking</h3>
        <div className="space-y-6">
          {rankedByConversion.map((branch, idx) => {
            let conversionColor = 'text-amber-500 bg-amber-50'
            if (branch.conversion >= 20) conversionColor = 'text-emerald-500 bg-emerald-50'
            else if (branch.conversion < 10) conversionColor = 'text-rose-500 bg-rose-50'

            const progressPercent = (branch.conversion / maxConversion) * 100

            return (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24 text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="text-slate-400">#{idx + 1}</span> {branch.name}
                </div>
                
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="w-16 text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${conversionColor}`}>
                    {branch.conversion}%
                  </span>
                </div>

                <div className="w-20 text-right text-sm font-medium text-slate-600">
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
