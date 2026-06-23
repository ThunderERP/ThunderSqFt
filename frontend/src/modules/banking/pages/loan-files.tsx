import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Download, Search } from 'lucide-react'
import PageHeader from '../../shared/components/PageHeader'
import StatusBadge from '../../shared/components/StatusBadge'
import Modal from '../../shared/components/Modal'
import { PageTransition } from '../../shared/components/MotionComponents'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useAuth } from '../../auth/context/AuthContext'
import { useLoanFiles } from '../../../hooks/useLoanFiles'
import { LoanFile, formatCurrency, employeesDb } from '../../../services/db'

export const STAGES_LIST = [
  'PD Pending', 'Doc Pending', 'Login Pending', 'Credit Query',
  'Sanctioned', 'Approved', 'Registered', 'Disbursed'
] as const

const PROJECT_LIST = ['Prestige Skyline', 'Godrej Woods', 'Sobha City', 'DLF Magnolias']
const BANK_LIST = ['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Bank of Baroda']

export default function LoanFiles() {
  const { currentUser } = useAuth()
  const { loanFiles, loading, error, addLoanFile, refetch } = useLoanFiles()

  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('All')
  const [branchFilter, setBranchFilter] = useState('All')
  const [coordinatorFilter, setCoordinatorFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)

  // Form states
  const [customerName, setCustomerName] = useState('')
  const [mobile, setMobile] = useState('')
  const [projectName, setProjectName] = useState('Prestige Skyline')
  const [loanAmount, setLoanAmount] = useState('')
  const [bankName, setBankName] = useState('HDFC Bank')
  const [bankerName, setBankerName] = useState('')
  const [salesExecutive, setSalesExecutive] = useState('Rahul Sharma')
  const [loanCoordinator, setLoanCoordinator] = useState('Sneha Kapoor')
  const [stage, setStage] = useState<typeof STAGES_LIST[number]>('PD Pending')

  // Scoped coordinators and sales executives from db
  const coordinatorsList = employeesDb.filter(e => e.role === 'banking' || e.role === 'admin' || e.role === 'manager').map(e => e.name)
  const salesExecutivesList = employeesDb.filter(e => e.role === 'sales' || e.role === 'leader').map(e => e.name)

  const handleExport = () => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.setTextColor(30, 41, 59)
    doc.text('Banking Loan Files Report', 14, 22)
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generated on: ${new Date().toLocaleDateString()} | Total Files: ${loanFiles.length}`, 14, 29)

    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Customer', 'Project', 'Amount', 'Bank', 'Stage', 'Branch', 'Coordinator']],
      body: filteredFiles.map((f) => {
        const coord = employeesDb.find(e => e.name === f.loanCoordinatorId)
        const branchName = coord?.branchId || 'Mumbai'
        return [
          `LN-${f.id}`,
          f.customerName,
          f.project,
          `Rs. ${f.loanAmount.toLocaleString('en-IN')}`,
          f.bank,
          f.stage,
          branchName,
          f.loanCoordinatorId
        ]
      }),
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
    })

    doc.save(`loan_files_report_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const rawAmt = parseFloat(loanAmount.replace(/[^\d.]/g, ''))
    const cleanAmt = isNaN(rawAmt) ? 0 : rawAmt

    try {
      await addLoanFile({
        customerName,
        mobile,
        project: projectName,
        loanAmount: cleanAmt,
        bank: bankName,
        bankerName,
        salesExecutiveId: salesExecutive,
        loanCoordinatorId: loanCoordinator,
        stage: stage as any
      })
      setModalOpen(false)
      refetch()

      // Reset Form
      setCustomerName('')
      setMobile('')
      setLoanAmount('')
      setBankerName('')
      setStage('PD Pending')
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="h-10 bg-gray-800 rounded w-1/3 animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] animate-pulse"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center text-[var(--danger)] font-semibold rounded-lg">
        {error}
      </div>
    )
  }

  // Role based scoping
  const scopedFiles = loanFiles.filter((lf: LoanFile) => {
    if (!currentUser) return true
    if (currentUser.role === 'CEO' || currentUser.role === 'Admin') return true
    
    // Branch Manager sees files belonging to their branch
    if (currentUser.role === 'BranchManager') {
      const coordinatorProfile = employeesDb.find(e => e.name === lf.loanCoordinatorId)
      return coordinatorProfile?.branchId.toLowerCase() === currentUser.branch?.toLowerCase()
    }
    
    // Team Leader sees Team-A (Rahul Sharma, Sneha Kapoor, Priya Sen)
    if (currentUser.role === 'TeamLeader') {
      const teamExecutives = ['Rahul Sharma', 'Sneha Kapoor', 'Priya Sen']
      return teamExecutives.includes(lf.salesExecutiveId) || teamExecutives.includes(lf.loanCoordinatorId)
    }
    
    // Sales Executive sees own sales executive files
    if (currentUser.role === 'SalesExecutive') {
      return lf.salesExecutiveId === currentUser.name
    }
    
    // Banking Executive sees own loan coordinator files
    if (currentUser.role === 'BankingExecutive') {
      return lf.loanCoordinatorId === currentUser.name
    }
    
    return false
  })

  const filteredFiles = scopedFiles.filter((f) => {
    const coord = employeesDb.find(e => e.name === f.loanCoordinatorId)
    const branchName = coord?.branchId || 'Mumbai'

    const matchSearch =
      f.customerName.toLowerCase().includes(search.toLowerCase()) ||
      f.bank.toLowerCase().includes(search.toLowerCase()) ||
      f.project.toLowerCase().includes(search.toLowerCase())

    const matchStage = stageFilter === 'All' || f.stage === stageFilter
    const matchBranch = branchFilter === 'All' || branchName.toLowerCase() === branchFilter.toLowerCase()
    const matchCoordinator = coordinatorFilter === 'All' || f.loanCoordinatorId === coordinatorFilter

    return matchSearch && matchStage && matchBranch && matchCoordinator
  })

  // List coordinators for filter
  const coordinatorsFilterList = ['All', ...Array.from(new Set(scopedFiles.map(f => f.loanCoordinatorId)))]
  const branchesFilterList = ['All', ...Array.from(new Set(employeesDb.map(e => e.branchId)))]

  // Helper to determine if a stage is a problem stage (e.g. Doc Pending, Credit Query)
  const isProblemStage = (stageName: string) => {
    return ['PD Pending', 'Doc Pending', 'Credit Query'].includes(stageName)
  }

  return (
    <PageTransition>
      <div className="space-y-6 p-6 max-w-[1600px] mx-auto text-[var(--ink)]">
        <PageHeader
          title="Banking Loan Operations"
          subtitle="Track banking login files, credit verifications, sanctions and disbursements"
          actions={
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] bg-transparent text-[var(--ink)] hover:bg-[var(--bg-surface)] rounded-xl font-semibold text-sm transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <Download size={16} />
                Export
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-xl font-semibold text-sm transition-all hover:opacity-90 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <Plus size={18} />
                Create Loan File
              </button>
            </div>
          }
        />

        <div className="space-y-6">
          {/* Filters Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-card">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-wider">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" size={14} />
                <input
                  type="text"
                  placeholder="Search customer, bank..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-wider">Loan Stage</label>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--ink-soft)] font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <option value="All">All Stages</option>
                {STAGES_LIST.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-wider">Branch</label>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--ink-soft)] font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {branchesFilterList.map(b => (
                  <option key={b} value={b}>{b === 'All' ? 'All Branches' : b}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-wider">Coordinator</label>
              <select
                value={coordinatorFilter}
                onChange={(e) => setCoordinatorFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--ink-soft)] font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {coordinatorsFilterList.map(c => (
                  <option key={c} value={c}>{c === 'All' ? 'All Coordinators' : c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Loan Files List */}
          {filteredFiles.length > 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface)]/30 text-left text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-wider">
                      <th className="px-6 py-4">File ID</th>
                      <th className="px-6 py-4">Customer Name</th>
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4 text-right">Loan Amount</th>
                      <th className="px-6 py-4">Bank Name</th>
                      <th className="px-6 py-4">Stage</th>
                      <th className="px-6 py-4">Branch</th>
                      <th className="px-6 py-4">Coordinator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {filteredFiles.map((file) => {
                      const coord = employeesDb.find(e => e.name === file.loanCoordinatorId)
                      const branchName = coord?.branchId || 'Mumbai'
                      const isProblem = isProblemStage(file.stage)

                      return (
                        <tr 
                          key={file.id} 
                          className={`hover:bg-[var(--bg-hover)]/40 transition-colors ${
                            isProblem ? 'bg-[var(--danger-soft)]/10 hover:bg-[var(--danger-soft)]/20' : ''
                          }`}
                        >
                          <td className="px-6 py-4 text-xs font-bold text-[var(--ink-soft)] font-mono">LN-{file.id}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-[var(--ink)]">
                            <Link to={`/banking/loans/${file.id}`} className="text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                              {file.customerName}
                            </Link>
                            <div className="text-[10px] text-[var(--ink-muted)] font-mono font-medium">{file.mobile}</div>
                          </td>
                          <td className="px-6 py-4 text-xs text-[var(--ink-soft)]">{file.project}</td>
                          <td className="px-6 py-4 text-xs font-bold text-[var(--gold)] text-right font-mono">
                            {formatCurrency(file.loanAmount)}
                          </td>
                          <td className="px-6 py-4 text-xs text-[var(--ink-soft)] font-semibold">
                            {file.bank}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={file.stage} domain="loan" />
                          </td>
                          <td className="px-6 py-4 text-xs text-[var(--ink-soft)]">{branchName}</td>
                          <td className="px-6 py-4 text-xs text-[var(--ink-soft)] font-semibold">{file.loanCoordinatorId}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div className="px-6 py-3 border-t border-[var(--border-color)] text-[10px] text-[var(--ink-muted)] font-bold uppercase tracking-wider bg-[var(--bg-surface)]/10">
                  Showing <span className="font-mono text-[var(--ink-soft)]">{filteredFiles.length}</span> of <span className="font-mono text-[var(--ink-soft)]">{loanFiles.length}</span> results
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center text-[var(--ink-soft)] text-sm rounded-xl">
              No loan files found matching the criteria.
            </div>
          )}
        </div>
      </div>

      {/* Create Loan File Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Loan File">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-[var(--ink)]">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] block mb-1">Customer Name *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Rajesh Kumar"
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] placeholder-[var(--ink-muted)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] block mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] placeholder-[var(--ink-muted)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] block mb-1">Project Name</label>
              <select
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {PROJECT_LIST.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] block mb-1">Loan Amount (₹) *</label>
              <input
                type="text"
                required
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="e.g. 5000000"
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] placeholder-[var(--ink-muted)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] block mb-1">Bank Name</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {BANK_LIST.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] block mb-1">Banker Name</label>
            <input
              type="text"
              required
              value={bankerName}
              onChange={(e) => setBankerName(e.target.value)}
              placeholder="e.g. Vikram Singh"
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] placeholder-[var(--ink-muted)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] block mb-1">Sales Executive</label>
              <select
                value={salesExecutive}
                onChange={(e) => setSalesExecutive(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {salesExecutivesList.map((se) => (
                  <option key={se} value={se}>{se}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] block mb-1">Loan Coordinator</label>
              <select
                value={loanCoordinator}
                onChange={(e) => setLoanCoordinator(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {coordinatorsList.map((lc) => (
                  <option key={lc} value={lc}>{lc}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] block mb-1">Loan Process Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as any)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {STAGES_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-sm font-semibold text-[var(--ink-soft)] hover:bg-[var(--bg-surface)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all bg-[var(--accent)] shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Create Loan File
            </button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  )
}
