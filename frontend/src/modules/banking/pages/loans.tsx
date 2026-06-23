import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import PageHeader from '../../shared/components/PageHeader'
import StatCard from '../../shared/components/StatCard'
import StatusBadge from '../../shared/components/StatusBadge'
import EmptyState from '../../shared/components/EmptyState'
import { Plus, ChevronDown, Search, X, ArrowUpDown, ArrowUp, ArrowDown, Landmark, FileText, CheckCircle2, Clock, IndianRupee, Phone, User, Calendar, CreditCard } from 'lucide-react'
import DetailSlideOver from '../../shared/components/DetailSlideOver'

const initialLoans = [
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
const avatarColors = ['bg-blue-600/30 text-blue-400 border-blue-500/20','bg-emerald-600/30 text-emerald-400 border-emerald-500/20','bg-purple-600/30 text-purple-400 border-purple-500/20','bg-orange-600/30 text-orange-400 border-orange-500/20','bg-pink-600/30 text-pink-400 border-pink-500/20']
function getAvatarColor(name: string) { let h=0; for(let i=0;i<name.length;i++) h=name.charCodeAt(i)+((h<<5)-h); return avatarColors[Math.abs(h)%avatarColors.length]; }

export default function BankingLoans() {
  const location = useLocation()
  const [loans, setLoans] = useState(initialLoans)
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<typeof initialLoans[0] | null>(null)
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
    if (sortField !== field) return <ArrowUpDown size={14} className="text-[var(--ink-muted)]" />;
    return sortDirection === 'asc' ? <ArrowUp size={14} className="text-[var(--accent)]" /> : <ArrowDown size={14} className="text-[var(--accent)]" />;
  };

  const isStuck = (appliedOnStr: string, stage: string) => {
    if (stage === 'Disbursed') return false
    const appliedDate = new Date(appliedOnStr)
    const today = new Date('2026-06-22')
    const diffTime = Math.abs(today.getTime() - appliedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 7
  }

  let filteredLoans = loans.filter(loan => {
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

  const totalLoans = loans.length
  const disbursedLoans = loans.filter(l => l.status === 'Disbursed').length
  const pendingLoans = loans.filter(l => l.status.includes('Pending')).length
  const totalAmount = loans.reduce((sum, l) => sum + (parseInt(l.amount.replace(/[^0-9]/g, '')) || 0), 0)

  const handleSaveLoan = (values: Record<string, any>) => {
    if (!selectedLoan) return
    setLoans(prev =>
      prev.map(l =>
        l.id === selectedLoan.id ? { ...l, ...values } : l
      )
    )
    setSelectedLoan(prev => prev ? { ...prev, ...values } : null)
  }

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6 text-[var(--ink)]">
        <PageHeader 
          title="Loan Files" 
          subtitle="Banking & loan file management"
          actions={
            <button 
              onClick={() => setIsSlideOverOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <Plus size={16} /> New Loan File
            </button>
          }
        />

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StaggerItem>
            <StatCard 
              label="Total Files"
              value={String(totalLoans)}
              subtitle="Files logged"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard 
              label="Disbursed"
              value={String(disbursedLoans)}
              subtitle="Completed loans"
              valueColor="text-[var(--success)]"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard 
              label="Pending"
              value={String(pendingLoans)}
              subtitle="Files in pipeline"
              valueColor="text-[var(--warning)]"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard 
              label="Total Value"
              value={`₹${totalAmount}L`}
              subtitle="Overall file value"
              valueColor="text-[var(--gold)]"
            />
          </StaggerItem>
        </StaggerContainer>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-color)]">
          <button 
            onClick={() => setActiveTab('list')} 
            className={`px-4 py-2.5 border-b-2 font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${activeTab === 'list' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]'}`}
          >
            List View
          </button>
          <button 
            onClick={() => setActiveTab('pipeline')} 
            className={`px-4 py-2.5 border-b-2 font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${activeTab === 'pipeline' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]'}`}
          >
            Pipeline View
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" size={16} />
            <input 
              type="text" 
              placeholder="Search loans..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 border border-[var(--border-color)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" 
            />
          </div>
          <div className="relative w-48">
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)} 
              className="w-full appearance-none border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--ink-soft)] bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <option>All Types</option>
              <option>Home Loan</option>
              <option>Personal Loan</option>
              <option>Auto Loan</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] pointer-events-none" />
          </div>
          <div className="relative w-48">
            <select 
              value={bankFilter} 
              onChange={(e) => setBankFilter(e.target.value)} 
              className="w-full appearance-none border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--ink-soft)] bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <option>All Banks</option>
              <option>HDFC Bank</option>
              <option>SBI</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Kotak Bank</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] pointer-events-none" />
          </div>
          <div className="relative w-48">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="w-full appearance-none border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--ink-soft)] bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <option>All Stages</option>
              {pipelineStages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] pointer-events-none" />
          </div>
          {(typeFilter !== 'All Types' || bankFilter !== 'All Banks' || statusFilter !== 'All Stages' || search) && (
            <button 
              onClick={() => { setTypeFilter('All Types'); setBankFilter('All Banks'); setStatusFilter('All Stages'); setSearch(''); }}
              className="text-xs font-semibold text-[var(--accent)] hover:underline transition-all flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <X size={12} /> Clear
            </button>
          )}
          <span className="text-xs font-medium text-[var(--ink-muted)] ml-auto font-mono">{filteredLoans.length} loans</span>
        </div>

        {activeTab === 'list' ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--bg-surface)]/30 border-b border-[var(--border-color)]">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-wider cursor-pointer hover:bg-[var(--bg-surface)]/50 transition-colors select-none" onClick={() => handleSort('customer')}><div className="flex items-center gap-2">Customer {getSortIcon('customer')}</div></th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-wider cursor-pointer hover:bg-[var(--bg-surface)]/50 transition-colors select-none" onClick={() => handleSort('type')}><div className="flex items-center gap-2">Type {getSortIcon('type')}</div></th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-wider cursor-pointer hover:bg-[var(--bg-surface)]/50 transition-colors select-none" onClick={() => handleSort('bank')}><div className="flex items-center gap-2">Bank {getSortIcon('bank')}</div></th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-wider cursor-pointer hover:bg-[var(--bg-surface)]/50 transition-colors select-none text-right" onClick={() => handleSort('amount')}><div className="flex items-center justify-end gap-2">Amount {getSortIcon('amount')}</div></th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-wider cursor-pointer hover:bg-[var(--bg-surface)]/50 transition-colors select-none" onClick={() => handleSort('status')}><div className="flex items-center gap-2">Status {getSortIcon('status')}</div></th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-wider">Docs</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-wider cursor-pointer hover:bg-[var(--bg-surface)]/50 transition-colors select-none text-right" onClick={() => handleSort('appliedOn')}><div className="flex items-center justify-end gap-2">Applied {getSortIcon('appliedOn')}</div></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {filteredLoans.map((loan, idx) => (
                    <tr key={loan.id} className="hover:bg-[var(--bg-hover)]/40 transition-colors group cursor-pointer" style={{ '--i': idx } as React.CSSProperties} onClick={() => setSelectedLoan(loan)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold font-mono ${getAvatarColor(loan.customer)}`}>
                            {getInitials(loan.customer)}
                          </span>
                          <div>
                            <div className="font-semibold text-[var(--ink)]">{loan.customer}</div>
                            <div className="text-xs text-[var(--ink-muted)] font-mono">ID: #{loan.id} · {loan.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={loan.type} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[var(--ink-soft)] font-medium">
                          <Landmark size={13} className="text-[var(--ink-muted)]" />
                          {loan.bank}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-[var(--gold)] whitespace-nowrap text-right">{loan.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={loan.status} domain="loan" />
                          {isStuck(loan.appliedOn, loan.status) && (
                            <StatusBadge status="STUCK" domain="priority" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[var(--bg-surface)] rounded-full h-1.5 overflow-hidden">
                            <div className={`h-1.5 rounded-full ${loan.docPercent >= 100 ? 'bg-[var(--success)]' : loan.docPercent >= 60 ? 'bg-[var(--accent)]' : 'bg-[var(--warning)]'}`} style={{ width: `${loan.docPercent}%` }}></div>
                          </div>
                          <span className="text-xs text-[var(--ink-soft)] w-12 text-right font-mono">{loan.docCount}/{loan.docTotal}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--ink-soft)] whitespace-nowrap text-right font-mono">{loan.appliedOn}</td>
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
                <div key={stage} className="min-w-[280px] w-[280px] flex flex-col bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] shrink-0 h-full transition-all" style={{ '--i': stageIdx } as React.CSSProperties}>
                  <div className="p-3 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-surface)]/50 rounded-t-lg">
                    <h3 className="font-bold text-[var(--ink)] text-xs font-display uppercase tracking-wider">{stage}</h3>
                    <span className="bg-[var(--bg-body)] border border-[var(--border-color)] text-[var(--ink-soft)] px-2 py-0.5 rounded-full text-xs font-mono font-bold">{stageLoans.length}</span>
                  </div>
                  <div className="p-3 flex-1 overflow-y-auto space-y-3">
                    {stageLoans.map((loan, cardIdx) => (
                      <div key={loan.id} className="bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--border-color)] hover:border-[var(--border-hover)] hover:shadow-hover transition-all cursor-pointer" style={{ '--i': cardIdx } as React.CSSProperties} onClick={() => setSelectedLoan(loan)}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${getAvatarColor(loan.customer)}`}>
                            {getInitials(loan.customer)}
                          </span>
                          <h4 className="font-semibold text-[var(--ink)] text-sm">{loan.customer}</h4>
                        </div>
                        <div className="text-xs text-[var(--ink-soft)] mb-2">{loan.project}</div>
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span className="flex items-center gap-1 text-[var(--ink-soft)]">
                            <Landmark size={11} className="text-[var(--ink-muted)]" />
                            {loan.bank}
                          </span>
                          <span className="font-bold text-[var(--gold)] font-mono">{loan.amount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[var(--bg-body)] rounded-full h-1 overflow-hidden">
                            <div className={`h-1 rounded-full ${loan.docPercent >= 100 ? 'bg-[var(--success)]' : 'bg-[var(--accent)]'}`} style={{ width: `${loan.docPercent}%` }}></div>
                          </div>
                          <span className="text-[10px] text-[var(--ink-muted)] font-mono">{loan.docPercent}%</span>
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

      {/* Loan Detail Slide-Over */}
      <DetailSlideOver
        isOpen={!!selectedLoan}
        onClose={() => setSelectedLoan(null)}
        title={selectedLoan?.customer || ''}
        subtitle={`ID: #${selectedLoan?.id || ''} · ${selectedLoan?.phone || ''}`}
        avatar={
          selectedLoan ? (
            <span className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold font-mono ${getAvatarColor(selectedLoan.customer)}`}>
              {getInitials(selectedLoan.customer)}
            </span>
          ) : undefined
        }
        statusBadge={
          selectedLoan ? (
            <div className="flex items-center gap-2">
              <StatusBadge status={selectedLoan.status} domain="loan" />
              {isStuck(selectedLoan.appliedOn, selectedLoan.status) && (
                <StatusBadge status="STUCK" domain="priority" />
              )}
            </div>
          ) : undefined
        }
        onSave={handleSaveLoan}
        editValues={selectedLoan ? {
          customer: selectedLoan.customer,
          phone: selectedLoan.phone,
          type: selectedLoan.type,
          bank: selectedLoan.bank,
          amount: selectedLoan.amount,
          project: selectedLoan.project,
          status: selectedLoan.status,
          coordinator: selectedLoan.coordinator,
          appliedOn: selectedLoan.appliedOn,
        } : undefined}
        fields={selectedLoan ? [
          { label: 'Customer Name', value: selectedLoan.customer, editable: { key: 'customer', type: 'text', placeholder: 'Customer name' } },
          { label: 'Phone', value: (
            <span className="flex items-center gap-1.5 font-mono text-xs">
              <Phone size={12} className="text-[var(--ink-muted)]" />
              {selectedLoan.phone}
            </span>
          ), editable: { key: 'phone', type: 'text', placeholder: 'Phone number' } },
          { label: 'Loan Type', value: (
            <span className="flex items-center gap-1.5">
              <CreditCard size={12} className="text-[var(--ink-muted)]" />
              {selectedLoan.type}
            </span>
          ), editable: { key: 'type', type: 'select', options: ['Home Loan', 'Personal Loan', 'Auto Loan'] } },
          { label: 'Bank', value: (
            <span className="flex items-center gap-1.5">
              <Landmark size={12} className="text-[var(--ink-muted)]" />
              {selectedLoan.bank}
            </span>
          ), editable: { key: 'bank', type: 'select', options: ['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak Bank'] } },
          { label: 'Loan Amount', value: (
            <span className="font-mono font-bold text-[var(--gold)]">
              {selectedLoan.amount}
            </span>
          ), editable: { key: 'amount', type: 'text', placeholder: 'e.g. ₹85L' } },
          { label: 'Project', value: selectedLoan.project, editable: { key: 'project', type: 'text', placeholder: 'Project name' } },
          { label: 'Current Status', value: <StatusBadge status={selectedLoan.status} domain="loan" />, editable: { key: 'status', type: 'select', options: pipelineStages } },
          { label: 'Coordinator', value: (
            <span className="flex items-center gap-1.5">
              <User size={12} className="text-[var(--ink-muted)]" />
              {selectedLoan.coordinator}
            </span>
          ), editable: { key: 'coordinator', type: 'select', options: ['Meera Nair', 'Sanjay Gupta'] } },
          { label: 'Documents', value: (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[var(--bg-body)] rounded-full h-1.5 overflow-hidden">
                <div className={`h-1.5 rounded-full ${selectedLoan.docPercent >= 100 ? 'bg-[var(--success)]' : selectedLoan.docPercent >= 60 ? 'bg-[var(--accent)]' : 'bg-[var(--warning)]'}`} style={{ width: `${selectedLoan.docPercent}%` }}></div>
              </div>
              <span className="text-xs font-mono text-[var(--ink-soft)]">{selectedLoan.docCount}/{selectedLoan.docTotal}</span>
            </div>
          ), fullWidth: true },
          { label: 'Applied On', value: (
            <span className="flex items-center gap-1.5 font-mono">
              <Calendar size={12} className="text-[var(--ink-muted)]" />
              {selectedLoan.appliedOn}
            </span>
          ), editable: { key: 'appliedOn', type: 'date' } },
          { label: 'Pending Item', value: selectedLoan.pending === '—' ? 'None' : selectedLoan.pending },
        ] : []}
      />

      {isSlideOverOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsSlideOverOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-[var(--bg-card)] border-l border-[var(--border-color)] shadow-2xl z-50 flex flex-col transition-all">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
              <h2 className="text-xl font-bold text-[var(--ink)] font-display">New Loan File</h2>
              <button onClick={() => setIsSlideOverOpen(false)} className="p-1.5 border border-[var(--border-color)] hover:bg-[var(--bg-surface)] rounded-full transition-colors text-[var(--ink-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Customer Name *</label>
                  <input type="text" placeholder="Full name" className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-sm text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Mobile *</label>
                  <input type="tel" placeholder="Mobile number" className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-sm text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Project Name *</label>
                  <input type="text" placeholder="Project" className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-sm text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Loan Amount *</label>
                    <input type="text" placeholder="e.g. 50L" className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-sm text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Bank Name *</label>
                    <input type="text" placeholder="Bank" className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-sm text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Banker Name</label>
                  <input type="text" placeholder="Contact person" className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-sm text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Sales Executive</label>
                  <div className="relative">
                    <select className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg pl-3 pr-10 py-2.5 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                      <option>Select executive</option>
                      <option>Rohit Verma</option>
                      <option>Anita Joshi</option>
                      <option>Sanjay Gupta</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Banking Coordinator</label>
                  <div className="relative">
                    <select className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg pl-3 pr-10 py-2.5 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                      <option>Select coordinator</option>
                      <option>Meera Nair</option>
                      <option>Sanjay Gupta</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Remarks</label>
                  <textarea placeholder="Notes..." className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-sm text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all min-h-[100px] resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-[var(--border-color)] flex gap-3 mt-auto bg-[var(--bg-surface)]/50">
              <button onClick={() => setIsSlideOverOpen(false)} className="flex-[2] py-2.5 text-sm font-semibold bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                Create Loan File
              </button>
              <button onClick={() => setIsSlideOverOpen(false)} className="flex-1 py-2.5 text-sm font-semibold text-[var(--ink-soft)] bg-transparent border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </PageTransition>
  )
}
