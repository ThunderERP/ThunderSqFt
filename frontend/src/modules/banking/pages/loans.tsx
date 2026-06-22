import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import { Plus, ChevronDown, Search, X, ArrowUpDown, ArrowUp, ArrowDown, Landmark, FileText, CheckCircle2, Clock, IndianRupee } from 'lucide-react'
import EmptyState from '../../shared/components/EmptyState'

const mockLoans = [
  { id: '1', customer: 'Arjun Mehta', phone: '9811001101', project: 'Andheri Skyline', bank: 'HDFC Bank', amount: '₹85L', status: 'Sanction Approved', docCount: 5, docTotal: 7, docPercent: 71, pending: '—', coordinator: 'Meera Nair', type: 'Home Loan', appliedOn: '2023-10-25' },
  { id: '2', customer: 'Kavita Rajan', phone: '9811002202', project: 'Goregaon Greens', bank: 'SBI', amount: '₹55L', status: 'Doc Pending', docCount: 3, docTotal: 7, docPercent: 43, pending: 'ITR', coordinator: 'Meera Nair', type: 'Home Loan', appliedOn: '2023-10-28' },
  { id: '3', customer: 'Suresh Pillai', phone: '9811003303', project: 'Powai Grandeur', bank: 'ICICI Bank', amount: '₹120L', status: 'Credit Query', docCount: 5, docTotal: 7, docPercent: 71, pending: '—', coordinator: 'Sanjay Gupta', type: 'Home Loan', appliedOn: '2023-10-30' },
  { id: '4', customer: 'Neeha Kapoor', phone: '9811004404', project: 'Worli Zenith', bank: 'HDFC Bank', amount: '₹75L', status: 'Login Pending', docCount: 1, docTotal: 7, docPercent: 14, pending: '—', coordinator: 'Sanjay Gupta', type: 'Home Loan', appliedOn: '2023-11-01' },
  { id: '5', customer: 'Raghav Mishra', phone: '9811005505', project: 'Worli Zenith', bank: 'ICICI Bank', amount: '₹150L', status: 'Disbursed', docCount: 7, docTotal: 7, docPercent: 100, pending: '—', coordinator: 'Meera Nair', type: 'Home Loan', appliedOn: '2023-10-15' },
  { id: '6', customer: 'Preet Kaur', phone: '9811006606', project: 'Andheri Skyline', bank: 'Axis Bank', amount: '₹65L', status: 'Processing', docCount: 4, docTotal: 7, docPercent: 57, pending: '—', coordinator: 'Meera Nair', type: 'Personal Loan', appliedOn: '2023-11-02' },
  { id: '7', customer: 'Mohan Das', phone: '9811007707', project: 'Banjara Hills Oasis', bank: 'SBI', amount: '₹45L', status: 'Document Collection', docCount: 2, docTotal: 7, docPercent: 29, pending: '—', coordinator: 'Sanjay Gupta', type: 'Home Loan', appliedOn: '2023-11-03' },
  { id: '10', customer: 'Kavya Singh', phone: '9811028901', project: 'Powai Lake View', bank: 'HDFC Bank', amount: '₹110L', status: 'Processing', docCount: 4, docTotal: 7, docPercent: 57, pending: '—', coordinator: 'Meera Nair', type: 'Home Loan', appliedOn: '2023-11-01' },
  { id: '11', customer: 'Ajay Devgn', phone: '9811029001', project: 'Baner Elysium', bank: 'SBI', amount: '₹250L', status: 'Sanction Approved', docCount: 6, docTotal: 7, docPercent: 86, pending: '—', coordinator: 'Sanjay Gupta', type: 'Home Loan', appliedOn: '2023-11-02' },
  { id: '12', customer: 'Deepak Chahar', phone: '9811030101', project: 'Whitefield Residency', bank: 'ICICI Bank', amount: '₹100L', status: 'Document Collection', docCount: 3, docTotal: 7, docPercent: 43, pending: '—', coordinator: 'Meera Nair', type: 'Auto Loan', appliedOn: '2023-11-03' },
  { id: '13', customer: 'Sidharth Malhotra', phone: '9811032401', project: 'Bandra Elegance', bank: 'Axis Bank', amount: '₹150L', status: 'Processing', docCount: 4, docTotal: 7, docPercent: 57, pending: '—', coordinator: 'Meera Nair', type: 'Home Loan', appliedOn: '2023-11-05' },
  { id: '14', customer: 'Kiara Advani', phone: '9811033501', project: 'Juhu Tara', bank: 'Kotak Bank', amount: '₹85L', status: 'Login Pending', docCount: 2, docTotal: 7, docPercent: 29, pending: '—', coordinator: 'Sanjay Gupta', type: 'Personal Loan', appliedOn: '2023-11-06' },
  { id: '15', customer: 'Tiger Shroff', phone: '9811034601', project: 'Andheri Skyline', bank: 'ICICI Bank', amount: '₹40L', status: 'Document Collection', docCount: 1, docTotal: 7, docPercent: 14, pending: '—', coordinator: 'Meera Nair', type: 'Auto Loan', appliedOn: '2023-11-07' },
  { id: '16', customer: 'Hrithik Roshan', phone: '9811035701', project: 'Noida Heights', bank: 'HDFC Bank', amount: '₹180L', status: 'PD Pending', docCount: 3, docTotal: 7, docPercent: 42, pending: '—', coordinator: 'Sanjay Gupta', type: 'Home Loan', appliedOn: '2023-11-08' },
  { id: '17', customer: 'Katrina Kaif', phone: '9811036801', project: 'Powai Lake View', bank: 'SBI', amount: '₹120L', status: 'Sanction Pending', docCount: 5, docTotal: 7, docPercent: 71, pending: '—', coordinator: 'Meera Nair', type: 'Home Loan', appliedOn: '2023-11-09' },
  { id: '18', customer: 'Akshay Kumar', phone: '9811037901', project: 'Baner Elysium', bank: 'ICICI Bank', amount: '₹90L', status: 'Reg Pending', docCount: 6, docTotal: 7, docPercent: 86, pending: '—', coordinator: 'Sanjay Gupta', type: 'Personal Loan', appliedOn: '2023-11-10' },
  { id: '19', customer: 'Salman Khan', phone: '9811038001', project: 'Whitefield Residency', bank: 'Axis Bank', amount: '₹200L', status: 'Disb Pending', docCount: 6, docTotal: 7, docPercent: 86, pending: '—', coordinator: 'Meera Nair', type: 'Home Loan', appliedOn: '2023-11-11' },
  { id: '20', customer: 'Shahrukh Khan', phone: '9811039101', project: 'Banjara Hills Oasis', bank: 'Kotak Bank', amount: '₹150L', status: 'Disbursed', docCount: 7, docTotal: 7, docPercent: 100, pending: '—', coordinator: 'Sanjay Gupta', type: 'Home Loan', appliedOn: '2023-11-12' },
  { id: '21', customer: 'Aamir Khan', phone: '9811040201', project: 'Andheri Skyline', bank: 'HDFC Bank', amount: '₹75L', status: 'Login Pending', docCount: 2, docTotal: 7, docPercent: 29, pending: '—', coordinator: 'Meera Nair', type: 'Auto Loan', appliedOn: '2023-11-13' },
  { id: '22', customer: 'Kareena Kapoor', phone: '9811041301', project: 'Worli Zenith', bank: 'SBI', amount: '₹110L', status: 'Credit Query', docCount: 4, docTotal: 7, docPercent: 57, pending: '—', coordinator: 'Sanjay Gupta', type: 'Personal Loan', appliedOn: '2023-11-14' },
  { id: '23', customer: 'Anushka Sharma', phone: '9811042401', project: 'Noida Heights', bank: 'ICICI Bank', amount: '₹85L', status: 'Sanction Approved', docCount: 6, docTotal: 7, docPercent: 86, pending: '—', coordinator: 'Meera Nair', type: 'Home Loan', appliedOn: '2023-11-15' },
]

const pipelineStages = [
  'Login Pending', 'PD Pending', 'Credit Query', 'Sanction Pending',
  'Sanction Approved', 'Doc Pending', 'Reg Pending', 'Disb Pending', 'Disbursed'
]

function getInitials(name: string) { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() }
const avatarColors = ['bg-blue-100 text-blue-700','bg-emerald-100 text-emerald-700','bg-purple-100 text-purple-700','bg-orange-100 text-orange-700','bg-pink-100 text-pink-700']
function getAvatarColor(name: string) { let h=0; for(let i=0;i<name.length;i++) h=name.charCodeAt(i)+((h<<5)-h); return avatarColors[Math.abs(h)%avatarColors.length]; }

function getTypeBadge(type: string) {
  switch(type) {
    case 'Home Loan': return 'bg-blue-50 text-blue-600'
    case 'Personal Loan': return 'bg-purple-50 text-purple-600'
    case 'Auto Loan': return 'bg-orange-50 text-orange-600'
    default: return 'bg-gray-50 text-gray-600'
  }
}

export default function BankingLoans() {
  const location = useLocation()
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'list' | 'pipeline'>('list')
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [bankFilter, setBankFilter] = useState('All Banks');
  const [statusFilter, setStatusFilter] = useState<string>(() => {
    const stateFilter = location.state?.stageFilter
    if (stateFilter) return stateFilter

    const queryParams = new URLSearchParams(location.search)
    const queryFilter = queryParams.get('stage')
    if (queryFilter) return queryFilter

    return 'All Stages'
  })
  
  type SortField = 'id' | 'customer' | 'type' | 'bank' | 'amount' | 'status' | 'appliedOn' | null;
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

  const isStuck = (appliedOnStr: string, stage: string) => {
    if (stage === 'Disbursed') return false
    const appliedDate = new Date(appliedOnStr)
    const today = new Date('2026-06-22')
    const diffTime = Math.abs(today.getTime() - appliedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 7
  }

  let filteredLoans = mockLoans.filter(loan => {
    const matchesSearch = loan.customer.toLowerCase().includes(search.toLowerCase()) || loan.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All Types' || loan.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesBank = bankFilter === 'All Banks' || loan.bank.toLowerCase() === bankFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All Stages'
      || (statusFilter === 'Stuck' ? isStuck(loan.appliedOn, loan.status) : loan.status.toLowerCase() === statusFilter.toLowerCase());
    return matchesSearch && matchesType && matchesBank && matchesStatus;
  });

  if (sortField) {
    filteredLoans.sort((a, b) => {
      const aVal = String(a[sortField] || '');
      const bVal = String(b[sortField] || '');
      if (sortField === 'amount') {
        const numA = parseInt(aVal.replace(/[^0-9]/g, '')) || 0;
        const numB = parseInt(bVal.replace(/[^0-9]/g, '')) || 0;
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }
      const comparison = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Sanction Approved': return 'bg-emerald-100 text-emerald-700'
      case 'Disbursed': return 'bg-emerald-100 text-emerald-700'
      case 'Credit Query': return 'bg-yellow-100 text-yellow-700'
      case 'Doc Pending': return 'bg-red-100 text-red-700'
      case 'Login Pending': return 'bg-orange-100 text-orange-700'
      case 'PD Pending': return 'bg-blue-100 text-blue-700'
      case 'Sanction Pending': return 'bg-purple-100 text-purple-700'
      case 'Reg Pending': return 'bg-pink-100 text-pink-700'
      case 'Disb Pending': return 'bg-cyan-100 text-cyan-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const totalLoans = mockLoans.length
  const disbursedLoans = mockLoans.filter(l => l.status === 'Disbursed').length
  const pendingLoans = mockLoans.filter(l => l.status.includes('Pending')).length
  const totalAmount = mockLoans.reduce((sum, l) => sum + (parseInt(l.amount.replace(/[^0-9]/g, '')) || 0), 0)

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loan Files</h1>
            <p className="text-sm text-gray-500 mt-1">Banking & loan file management</p>
          </div>
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all active:scale-[0.97]"
          >
            <Plus size={16} /> New Loan File
          </button>
        </div>

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <FileText size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Files</p>
                <h3 className="text-2xl counter-value text-gray-900 mt-0.5">{totalLoans}</h3>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Disbursed</p>
                <h3 className="text-2xl counter-value text-emerald-600 mt-0.5">{disbursedLoans}</h3>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <h3 className="text-2xl counter-value text-yellow-600 mt-0.5">{pendingLoans}</h3>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                <IndianRupee size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <h3 className="text-2xl counter-value text-gray-900 mt-0.5">₹{totalAmount}L</h3>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button onClick={() => setActiveTab('list')} className={`px-4 py-2.5 border-b-2 font-medium text-sm transition-all ${activeTab === 'list' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>List View</button>
          <button onClick={() => setActiveTab('pipeline')} className={`px-4 py-2.5 border-b-2 font-medium text-sm transition-all ${activeTab === 'pipeline' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Pipeline View</button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search loans..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
          </div>
          <div className="relative w-48">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all">
              <option>All Types</option>
              <option>Home Loan</option>
              <option>Personal Loan</option>
              <option>Auto Loan</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative w-48">
            <select value={bankFilter} onChange={(e) => setBankFilter(e.target.value)} className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all">
              <option>All Banks</option>
              <option>HDFC Bank</option>
              <option>SBI</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Kotak Bank</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative w-48">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all">
              <option>All Stages</option>
              {pipelineStages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {(typeFilter !== 'All Types' || bankFilter !== 'All Banks' || statusFilter !== 'All Stages' || search) && (
            <button 
              onClick={() => { setTypeFilter('All Types'); setBankFilter('All Banks'); setStatusFilter('All Stages'); setSearch(''); }}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <X size={12} /> Clear
            </button>
          )}
          <span className="text-xs font-medium text-gray-400 ml-auto">{filteredLoans.length} loans</span>
        </div>

        {activeTab === 'list' ? (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('customer')}><div className="flex items-center gap-2">Customer {getSortIcon('customer')}</div></th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('type')}><div className="flex items-center gap-2">Type {getSortIcon('type')}</div></th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('bank')}><div className="flex items-center gap-2">Bank {getSortIcon('bank')}</div></th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('amount')}><div className="flex items-center gap-2">Amount {getSortIcon('amount')}</div></th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('status')}><div className="flex items-center gap-2">Status {getSortIcon('status')}</div></th>
                    <th className="px-6 py-4 font-medium">Docs</th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('appliedOn')}><div className="flex items-center gap-2">Applied {getSortIcon('appliedOn')}</div></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLoans.map((loan, idx) => (
                    <tr key={loan.id} className="anim-row hover:bg-gray-50/50 transition-all group" style={{ '--i': idx } as React.CSSProperties}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className={`avatar-circle ${getAvatarColor(loan.customer)}`}>
                            {getInitials(loan.customer)}
                          </span>
                          <div>
                            <div className="font-semibold text-gray-900">{loan.customer}</div>
                            <div className="text-xs text-gray-400">{loan.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getTypeBadge(loan.type)}`}>
                          {loan.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                          <Landmark size={13} className="text-gray-400" />
                          {loan.bank}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">{loan.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusStyle(loan.status)}`}>{loan.status}</span>
                          {isStuck(loan.appliedOn, loan.status) && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded badge-pop" title="Stuck for more than 7 days">
                              <Clock size={10} className="animate-pulse" /> Stuck
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className={`progress-animated h-1.5 rounded-full ${loan.docPercent >= 100 ? 'bg-emerald-500' : loan.docPercent >= 60 ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: `${loan.docPercent}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-500 w-12 text-right">{loan.docCount}/{loan.docTotal}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{loan.appliedOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredLoans.length === 0 && (
              <EmptyState 
                icon={FileText} 
                title="No loan files found" 
                description="Try adjusting your filters" 
              />
            )}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-380px)] min-h-[500px]">
            {pipelineStages.map((stage, stageIdx) => {
              const stageLoans = filteredLoans.filter(l => l.status === stage);
              return (
                <div key={stage} className="min-w-[280px] w-[280px] flex flex-col bg-gray-50/50 rounded-xl border border-gray-100 shrink-0 h-full anim-card" style={{ '--i': stageIdx } as React.CSSProperties}>
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-xl">
                    <h3 className="font-semibold text-gray-800 text-sm">{stage}</h3>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{stageLoans.length}</span>
                  </div>
                  <div className="p-3 flex-1 overflow-y-auto space-y-3">
                    {stageLoans.map((loan, cardIdx) => (
                      <div key={loan.id} className="card-lift bg-white p-4 rounded-lg border border-gray-100 shadow-sm anim-card" style={{ '--i': cardIdx } as React.CSSProperties}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`avatar-circle ${getAvatarColor(loan.customer)}`} style={{ width: 28, height: 28, fontSize: 10 }}>
                            {getInitials(loan.customer)}
                          </span>
                          <h4 className="font-semibold text-gray-900 text-sm">{loan.customer}</h4>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">{loan.project}</div>
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Landmark size={11} className="text-gray-400" />
                            {loan.bank}
                          </span>
                          <span className="font-bold text-gray-900">{loan.amount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1 overflow-hidden">
                            <div className={`progress-animated h-1 rounded-full ${loan.docPercent >= 100 ? 'bg-emerald-500' : 'bg-[#2563EB]'}`} style={{ width: `${loan.docPercent}%` }}></div>
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium">{loan.docPercent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isSlideOverOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsSlideOverOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 flex flex-col" style={{ animation: 'rowSlideIn 0.3s ease-out' }}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">New Loan File</h2>
              <button onClick={() => setIsSlideOverOpen(false)} className="p-1.5 border border-blue-100 hover:bg-blue-50 rounded-full transition-colors text-blue-500">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Customer Name *</label>
                  <input type="text" placeholder="Full name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Mobile *</label>
                  <input type="tel" placeholder="Mobile number" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Project Name *</label>
                  <input type="text" placeholder="Project" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Loan Amount (₹) *</label>
                    <input type="number" placeholder="Amount" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Bank Name *</label>
                    <input type="text" placeholder="Bank" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Banker Name</label>
                  <input type="text" placeholder="Contact person" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Sales Executive</label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all">
                      <option>Select executive</option>
                      <option>Rohit Verma</option>
                      <option>Anita Joshi</option>
                      <option>Sanjay Gupta</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Banking Coordinator</label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all">
                      <option>Select coordinator</option>
                      <option>Meera Nair</option>
                      <option>Sanjay Gupta</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Remarks</label>
                  <textarea placeholder="Notes..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 min-h-[100px] resize-y transition-all" />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex gap-3 mt-auto bg-gray-50/50">
              <button onClick={() => setIsSlideOverOpen(false)} className="flex-[2] py-2.5 text-sm font-medium bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-all active:scale-[0.98]">
                Create Loan File
              </button>
              <button onClick={() => setIsSlideOverOpen(false)} className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </PageTransition>
  )
}
