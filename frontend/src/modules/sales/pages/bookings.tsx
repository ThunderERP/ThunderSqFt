import { useState } from 'react'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import { ChevronDown, Plus, X, ArrowUpDown, ArrowUp, ArrowDown, Search, ShieldCheck, CreditCard, Clock, CheckCircle } from 'lucide-react'

const mockBookings = [
  { id: '1', customer: 'Raghav Mishra', project: 'Worli Zenith', unit: 'B-1204', amount: '₹50L', date: '2026-06-19', stage: 'booking', payment: 'partial', executive: 'Anita Joshi', branch: 'Mumbai Central' },
  { id: '2', customer: 'Preet Kaur', project: 'Whitefield Residency', unit: 'A-303', amount: '₹130L', date: '2026-06-19', stage: 'agreement', payment: 'completed', executive: 'Rohit Verma', branch: 'Bangalore South' },
  { id: '3', customer: 'Anand Sharma', project: 'Powai Grandeur', unit: 'C-801', amount: '₹180L', date: '2026-06-20', stage: 'registration', payment: 'completed', executive: 'Rohit Verma', branch: 'Mumbai Central' },
  { id: '4', customer: 'Meena Joshi', project: 'Baner Heights', unit: 'D-502', amount: '₹75L', date: '2026-06-20', stage: 'completed', payment: 'completed', executive: 'Anita Joshi', branch: 'Pune HQ' },
  { id: '5', customer: 'Ravi Teja', project: 'Banjara Hills Oasis', unit: 'A-102', amount: '₹95L', date: '2026-06-18', stage: 'booking', payment: 'pending', executive: 'Deepak Rao', branch: 'Hyderabad East' },
  { id: '6', customer: 'Megha Shah', project: 'Andheri Skyline', unit: 'B-605', amount: '₹110L', date: '2026-06-17', stage: 'registration', payment: 'partial', executive: 'Rohit Verma', branch: 'Mumbai Central' },
  { id: '7', customer: 'Kartik Aryan', project: 'Worli Zenith', unit: 'C-201', amount: '₹85L', date: '2026-06-16', stage: 'agreement', payment: 'completed', executive: 'Anita Joshi', branch: 'Mumbai Central' },
  { id: '8', customer: 'Alia Bhatt', project: 'Powai Lake View', unit: 'A-904', amount: '₹120L', date: '2026-06-15', stage: 'completed', payment: 'completed', executive: 'Rohit Verma', branch: 'Mumbai Central' },
  { id: '9', customer: 'Ranbir Kapoor', project: 'Baner Elysium', unit: 'B-1102', amount: '₹90L', date: '2026-06-21', stage: 'booking', payment: 'partial', executive: 'Deepak Rao', branch: 'Pune HQ' },
  { id: '10', customer: 'Varun Dhawan', project: 'Noida Heights', unit: 'C-405', amount: '₹65L', date: '2026-06-14', stage: 'registration', payment: 'completed', executive: 'Anita Joshi', branch: 'Delhi NCR' },
  { id: '11', customer: 'Kriti Sanon', project: 'Whitefield Residency', unit: 'A-701', amount: '₹150L', date: '2026-06-13', stage: 'completed', payment: 'completed', executive: 'Rohit Verma', branch: 'Bangalore South' },
  { id: '12', customer: 'Sidharth Malhotra', project: 'Bandra Elegance', unit: 'A-1002', amount: '₹220L', date: '2026-06-22', stage: 'agreement', payment: 'partial', executive: 'Deepak Rao', branch: 'Mumbai Central' },
  { id: '13', customer: 'Kiara Advani', project: 'Juhu Tara', unit: 'B-403', amount: '₹190L', date: '2026-06-23', stage: 'booking', payment: 'pending', executive: 'Anita Joshi', branch: 'Mumbai Central' },
  { id: '14', customer: 'Vicky Kaushal', project: 'Andheri Skyline', unit: 'C-508', amount: '₹105L', date: '2026-06-24', stage: 'agreement', payment: 'completed', executive: 'Rohit Verma', branch: 'Mumbai Central' },
  { id: '15', customer: 'Sara Ali Khan', project: 'Powai Lake View', unit: 'D-202', amount: '₹98L', date: '2026-06-25', stage: 'registration', payment: 'completed', executive: 'Sanjay Gupta', branch: 'Mumbai Central' },
  { id: '16', customer: 'Janhvi Kapoor', project: 'Whitefield Residency', unit: 'B-809', amount: '₹115L', date: '2026-06-26', stage: 'completed', payment: 'completed', executive: 'Rohit Verma', branch: 'Bangalore South' },
  { id: '17', customer: 'Ishaan Khatter', project: 'Baner Elysium', unit: 'A-601', amount: '₹80L', date: '2026-06-27', stage: 'booking', payment: 'partial', executive: 'Deepak Rao', branch: 'Pune HQ' },
  { id: '18', customer: 'Ananya Panday', project: 'Noida Heights', unit: 'C-1201', amount: '₹70L', date: '2026-06-28', stage: 'agreement', payment: 'pending', executive: 'Anita Joshi', branch: 'Delhi NCR' },
]

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const avatarColors = ['bg-blue-100 text-blue-700','bg-emerald-100 text-emerald-700','bg-purple-100 text-purple-700','bg-orange-100 text-orange-700','bg-pink-100 text-pink-700']
function getAvatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return avatarColors[Math.abs(h) % avatarColors.length];
}

export default function Bookings() {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('All Stages')
  const [paymentFilter, setPaymentFilter] = useState('All Payments')

  type SortField = 'customer' | 'project' | 'unit' | 'amount' | 'date' | 'stage' | 'payment' | 'executive' | 'branch' | null;
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else setSortField(null);
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-gray-300" />;
    return sortDirection === 'asc' ? <ArrowUp size={14} className="text-[#2563EB]" /> : <ArrowDown size={14} className="text-[#2563EB]" />;
  };

  const getStageStyle = (stage: string) => {
    switch (stage) {
      case 'booking': return 'bg-yellow-100 text-yellow-700'
      case 'agreement': return 'bg-blue-100 text-blue-700'
      case 'registration': return 'bg-purple-100 text-purple-700'
      case 'completed': return 'bg-emerald-100 text-emerald-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPaymentStyle = (payment: string) => {
    switch (payment) {
      case 'pending': return 'bg-red-100 text-red-700'
      case 'partial': return 'bg-yellow-100 text-yellow-700'
      case 'completed': return 'bg-emerald-100 text-emerald-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  let filteredBookings = mockBookings.filter(b => {
    const matchesSearch = b.customer.toLowerCase().includes(search.toLowerCase()) || b.project.toLowerCase().includes(search.toLowerCase()) || b.unit.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === 'All Stages' || b.stage.toLowerCase() === stageFilter.toLowerCase();
    const matchesPayment = paymentFilter === 'All Payments' || b.payment.toLowerCase() === paymentFilter.toLowerCase();
    return matchesSearch && matchesStage && matchesPayment;
  });

  if (sortField) {
    filteredBookings.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (sortField === 'amount') {
        const numA = parseInt(aVal.replace(/[^0-9]/g, '')) || 0;
        const numB = parseInt(bVal.replace(/[^0-9]/g, '')) || 0;
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  // Live Computed Stats
  const totalBookings = mockBookings.length
  const bookingStage = mockBookings.filter(b => b.stage === 'booking').length
  const agreementStage = mockBookings.filter(b => b.stage === 'agreement').length
  const registrationStage = mockBookings.filter(b => b.stage === 'registration').length
  const completedStage = mockBookings.filter(b => b.stage === 'completed').length

  const totalValueLakhs = mockBookings.reduce((sum, b) => sum + (parseInt(b.amount.replace(/[^0-9]/g, '')) || 0), 0)
  const totalValueCr = (totalValueLakhs / 100).toFixed(2)

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track property bookings pipeline</p>
          </div>
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all active:scale-[0.97]"
          >
            <Plus size={16} /> New Booking
          </button>
        </div>

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Booking</p>
                <h3 className="text-2xl counter-value text-yellow-600 mt-0.5">{bookingStage}</h3>
              </div>
            </div>
          </StaggerItem>
          
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <CreditCard size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Agreement</p>
                <h3 className="text-2xl counter-value text-blue-600 mt-0.5">{agreementStage}</h3>
              </div>
            </div>
          </StaggerItem>
          
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Registration</p>
                <h3 className="text-2xl counter-value text-purple-600 mt-0.5">{registrationStage}</h3>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <CheckCircle size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed</p>
                <h3 className="text-2xl counter-value text-green-600 mt-0.5">{completedStage}</h3>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <span className="font-bold text-lg">₹</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Value</p>
                <h3 className="text-2xl counter-value text-[#2563EB] mt-0.5">₹{totalValueCr} Cr</h3>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by customer, project, unit..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-white" 
            />
          </div>
          <div className="relative w-44">
            <select 
              value={stageFilter} 
              onChange={(e) => setStageFilter(e.target.value)} 
              className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all"
            >
              <option>All Stages</option>
              <option>Booking</option>
              <option>Agreement</option>
              <option>Registration</option>
              <option>Completed</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative w-44">
            <select 
              value={paymentFilter} 
              onChange={(e) => setPaymentFilter(e.target.value)} 
              className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all"
            >
              <option>All Payments</option>
              <option>Pending</option>
              <option>Partial</option>
              <option>Completed</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {(stageFilter !== 'All Stages' || paymentFilter !== 'All Payments' || search) && (
            <button 
              onClick={() => { setStageFilter('All Stages'); setPaymentFilter('All Payments'); setSearch(''); }}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <X size={12} /> Clear
            </button>
          )}
          <span className="text-xs font-medium text-gray-400 ml-auto">{filteredBookings.length} bookings</span>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('customer')}>
                    <div className="flex items-center gap-2">Customer {getSortIcon('customer')}</div>
                  </th>
                  <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('project')}>
                    <div className="flex items-center gap-2">Project {getSortIcon('project')}</div>
                  </th>
                  <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('unit')}>
                    <div className="flex items-center gap-2">Unit {getSortIcon('unit')}</div>
                  </th>
                  <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('amount')}>
                    <div className="flex items-center gap-2">Amount {getSortIcon('amount')}</div>
                  </th>
                  <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-2">Booking Date {getSortIcon('date')}</div>
                  </th>
                  <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('stage')}>
                    <div className="flex items-center gap-2">Stage {getSortIcon('stage')}</div>
                  </th>
                  <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('payment')}>
                    <div className="flex items-center gap-2">Payment {getSortIcon('payment')}</div>
                  </th>
                  <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('executive')}>
                    <div className="flex items-center gap-2">Executive {getSortIcon('executive')}</div>
                  </th>
                  <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('branch')}>
                    <div className="flex items-center gap-2">Branch {getSortIcon('branch')}</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.map((booking, idx) => (
                  <tr key={booking.id} className="anim-row hover:bg-gray-50/50 transition-all group" style={{ '--i': idx } as React.CSSProperties}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className={`avatar-circle ${getAvatarColor(booking.customer)}`}>
                          {getInitials(booking.customer)}
                        </span>
                        <span className="font-semibold text-gray-900">{booking.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{booking.project}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700 whitespace-nowrap">{booking.unit}</td>
                    <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{booking.amount}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{booking.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${getStageStyle(booking.stage)}`}>
                        {booking.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${getPaymentStyle(booking.payment)}`}>
                        {booking.payment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{booking.executive}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{booking.branch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredBookings.length === 0 && (
            <div className="py-16 text-center">
              <div className="float-bounce inline-block mb-4">
                <ShieldCheck size={40} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No bookings found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Panel */}
      {isSlideOverOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsSlideOverOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 flex flex-col" style={{ animation: 'rowSlideIn 0.3s ease-out' }}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">New Booking</h2>
              <button 
                onClick={() => setIsSlideOverOpen(false)}
                className="p-1.5 border border-blue-100 hover:bg-blue-50 rounded-full transition-colors text-blue-500"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Customer Name *</label>
                  <input 
                    type="text" 
                    placeholder="Full name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Project Name *</label>
                  <input 
                    type="text" 
                    placeholder="Project"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Unit Number *</label>
                  <input 
                    type="text" 
                    placeholder="A-101"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Booking Amount (₹) *</label>
                    <input 
                      type="number" 
                      placeholder="Amount"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Booking Date *</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-700 bg-white transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Status</label>
                    <div className="relative">
                      <select className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all">
                        <option>booking</option>
                        <option>agreement</option>
                        <option>registration</option>
                        <option>completed</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Payment Status</label>
                    <div className="relative">
                      <select className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all">
                        <option>Pending</option>
                        <option>partial</option>
                        <option>completed</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Sales Executive *</label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all">
                      <option>Select executive</option>
                      <option>Rohit Verma</option>
                      <option>Anita Joshi</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Branch</label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all">
                      <option>Select branch</option>
                      <option>Mumbai Central</option>
                      <option>Bangalore South</option>
                      <option>Pune HQ</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex gap-3 mt-auto bg-gray-50/50">
              <button 
                onClick={() => setIsSlideOverOpen(false)} 
                className="flex-[2] py-2.5 text-sm font-medium bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-all active:scale-[0.98]"
              >
                Create Booking
              </button>
              <button 
                onClick={() => setIsSlideOverOpen(false)} 
                className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </PageTransition>
  )
}
