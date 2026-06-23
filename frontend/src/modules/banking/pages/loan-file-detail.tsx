import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageTransition } from '../../shared/components/MotionComponents'
import StatusBadge from '../../shared/components/StatusBadge'
import LoanStageStepper from '../components/LoanStageStepper'
import DocumentChecklistCard from '../components/DocumentChecklistCard'
import { DocumentChecklist } from '../types/loanFile'
import ActivityTimeline from '../../shared/components/ActivityTimeline'
import { toast } from 'sonner'
import { getPulseColor } from '../../shared/utils/statusColor'
import { useAuth } from '../../auth/context/AuthContext'
import { useLoanFileDetail } from '../../../hooks/useLoanFiles'
import { employeesDb, formatCurrency } from '../../../services/db'

export default function LoanFileDetail() {
  const navigate = useNavigate()
  const { loanId } = useParams<{ loanId: string }>()
  const { currentUser, can } = useAuth()
  
  const fileId = parseInt(loanId || '1', 10)
  const { loanFile, loading, error, updateStage, updateDocs, refetch } = useLoanFileDetail(fileId)

  const handleDocumentToggle = async (key: keyof DocumentChecklist) => {
    if (!loanFile) return

    // Map toggled key back to DB document checklist key
    const mapping: Record<keyof DocumentChecklist, string> = {
      panCard: 'pan',
      aadhaarCard: 'aadhaar',
      incomeProof: 'incomeTax',
      bankStatement: 'bankStatement',
      salarySlip: 'salarySlip',
      itr: 'ITR',
      propertyDocuments: 'propertyDocs'
    }
    const dbKey = mapping[key]
    const nextDocs = {
      ...loanFile.documents,
      [dbKey]: !loanFile.documents[dbKey]
    }

    try {
      await updateDocs(nextDocs)
      toast.success(`Document status updated for ${key}`)
      refetch()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update document status')
    }
  }

  const handleStageChange = async (newStage: any) => {
    try {
      await updateStage(newStage)
      toast.success(`Loan moved to ${newStage}`)
      refetch()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update loan stage')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-gray-800 rounded w-1/4"></div>
        <div className="h-10 bg-gray-800 rounded w-full"></div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <div className="h-96 bg-gray-800 rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-44 bg-gray-800 rounded-2xl"></div>
            <div className="h-44 bg-gray-800 rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !loanFile) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center text-[var(--danger)] font-semibold rounded-lg">
        {error || 'Loan File not found'}
        <div className="mt-4">
          <button onClick={() => navigate('/banking/loans')} className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90">
            Back to Loan Files
          </button>
        </div>
      </div>
    )
  }

  // Map Record<string, boolean> to DocumentChecklist
  const mappedDocs: DocumentChecklist = {
    panCard: loanFile.documents.pan ? 'Received' : 'Pending',
    aadhaarCard: loanFile.documents.aadhaar ? 'Received' : 'Pending',
    incomeProof: loanFile.documents.incomeTax ? 'Received' : 'Pending',
    bankStatement: loanFile.documents.bankStatement ? 'Received' : 'Pending',
    salarySlip: loanFile.documents.salarySlip ? 'Received' : 'Pending',
    itr: (loanFile.documents.ITR || loanFile.documents.itr) ? 'Received' : 'Pending',
    propertyDocuments: loanFile.documents.propertyDocs ? 'Received' : 'Pending'
  }

  // Helper for stage health
  const getStageHealth = (stageName: string): 'good' | 'waiting' | 'stuck' => {
    if (stageName === 'Disbursed') return 'good'
    if (stageName === 'Credit Query') return 'stuck'
    return 'waiting'
  }

  // Simulated stageHistory based on stage status
  const simulatedHistory = [
    { stage: 'PD Pending', date: '2026-06-10' },
    ...(loanFile.stage !== 'PD Pending' ? [{ stage: loanFile.stage, date: '2026-06-18' }] : [])
  ]

  // Map history to timeline events
  const timelineEvents = simulatedHistory.map((h) => ({
    icon: 'FileText',
    color: getPulseColor(getStageHealth(h.stage)).color,
    title: `Stage: ${h.stage}`,
    time: h.date,
    desc: `Loan file stage updated to ${h.stage}.`
  })).reverse() // Show newest first

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6 text-[var(--ink)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/banking/loans')} className="p-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-surface)] transition-colors text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" aria-label="Back to Loans">
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[var(--ink)] font-display">{loanFile.customerName}</h1>
                <StatusBadge status={loanFile.stage} domain="loan" />
              </div>
              <p className="text-sm text-[var(--ink-soft)] font-semibold mt-1">
                File ID: #<span className="font-mono text-[var(--accent)]">{loanFile.id}</span> · Coordinator: {loanFile.loanCoordinatorId}
              </p>
            </div>
          </div>

          {/* Change Stage Direct Action */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">Update Stage:</label>
            <select
              value={loanFile.stage}
              onChange={(e) => handleStageChange(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold focus:outline-none focus:border-[var(--accent)] transition-all outline-none cursor-pointer text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {['PD Pending', 'Doc Pending', 'Login Pending', 'Credit Query', 'Sanctioned', 'Approved', 'Registered', 'Disbursed'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stage Stepper */}
        <LoanStageStepper stage={loanFile.stage as any} />

        {/* Details Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Summary and Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-lg shadow-card text-[var(--ink)]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-4 font-display">Loan File Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Customer Mobile', value: <span className="font-mono">{loanFile.mobile}</span> },
                  { label: 'Project Name', value: loanFile.project },
                  { label: 'Target Bank', value: loanFile.bank },
                  { label: 'Loan Amount Requested', value: <span className="font-mono text-[var(--gold)] font-bold">{formatCurrency(loanFile.loanAmount)}</span> },
                  { label: 'Bank Officer Name', value: loanFile.bankerName },
                  { 
                    label: 'Loan Coordinator', 
                    value: can('manage:loan-files:all') ? (
                      <select
                        value={loanFile.loanCoordinatorId}
                        onChange={(e) => {
                          toast.success(`Loan coordinator reassigned to ${e.target.value}`)
                        }}
                        className="bg-transparent border-none text-sm font-bold focus:outline-none cursor-pointer text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      >
                        {employeesDb.filter(emp => emp.role === 'banking').map(emp => (
                          <option key={emp.name} value={emp.name}>{emp.name}</option>
                        ))}
                      </select>
                    ) : loanFile.loanCoordinatorId 
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]/30">
                    <p className="text-[10px] text-[var(--ink-soft)] font-bold uppercase tracking-wider">{item.label}</p>
                    <div className="text-sm font-bold mt-1 text-[var(--ink)]">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <ActivityTimeline events={timelineEvents} />
          </div>

          {/* Right: Document Checklist */}
          <div className="space-y-6">
            <DocumentChecklistCard
              documents={mappedDocs}
              onToggle={handleDocumentToggle}
            />
            
            {loanFile.stage !== 'Disbursed' && (
              <div 
                className="p-4 rounded-xl flex flex-col bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning)]/20"
              >
                <p className="text-xs font-bold uppercase tracking-wider">Verification Pending</p>
                <p className="text-[11px] leading-relaxed mt-1 text-[var(--ink-soft)]">
                  Make sure all checklist documents are received and marked off to proceed to next loan stages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
