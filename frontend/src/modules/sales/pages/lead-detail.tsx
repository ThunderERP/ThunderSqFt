import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageTransition } from '../../shared/components/MotionComponents'
import { LEAD_STAGES } from '../utils/leadStages'
import { ArrowLeft, Phone, Mail, MapPin, User, Building, IndianRupee, MessageSquare, Bell, Calendar, CheckCircle2, Shield } from 'lucide-react'
import StatusBadge from '../../shared/components/StatusBadge'

export default function SalesLeadDetail() {
  const { id, leadId } = useParams()
  const currentId = leadId || id || 'L-1001'
  const [toast, setToast] = useState(false)
  const [currentStage, setCurrentStage] = useState<string>('Site Visit Fixed')
  const [documents, setDocuments] = useState({
    panCard: 'Received',
    aadhaarCard: 'Received',
    incomeProof: 'Pending',
    bookingSheet: 'Pending'
  })

  // Mock data
  const lead = {
    id: currentId,
    name: 'Rajesh Kumar',
    mobile: '+91 9876543210',
    email: 'rajesh@example.com',
    city: 'Mumbai',
    propertyType: '3 BHK',
    locationPref: 'Andheri West',
    budget: '₹1.5 Cr',
  }

  const handleWhatsApp = () => {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  const handleToggleDoc = (key: keyof typeof documents) => {
    setDocuments(prev => ({
      ...prev,
      [key]: prev[key] === 'Received' ? 'Pending' : 'Received'
    }))
  }

  const handleAdvanceStage = () => {
    const idx = LEAD_STAGES.indexOf(currentStage as any)
    if (idx < LEAD_STAGES.length - 1) {
      setCurrentStage(LEAD_STAGES[idx + 1])
    }
  }

  const currentIdx = LEAD_STAGES.indexOf(currentStage as any)

  return (
    <PageTransition>
      <div className="space-y-6 relative text-left">
        {toast && (
          <div className="fixed bottom-6 right-6 bg-[var(--success)] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50 font-sans font-semibold">
            <CheckCircle2 size={18} />
            <span>WhatsApp reminder sent successfully!</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Link to="/sales/leads" className="p-2 hover:bg-[var(--bg-hover)] border border-[var(--border-color)] rounded-full transition-colors text-[var(--ink-soft)]">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="page-title font-display">{lead.name}</h1>
            <p className="page-subtitle font-mono text-[var(--ink-soft)]">Lead ID: {lead.id}</p>
          </div>
        </div>

        {/* Pipeline Stepper */}
        <div className="card p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] font-display">Lead Journey Stepper</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--ink-muted)]">Current Stage:</span>
              <StatusBadge status={currentStage} />
            </div>
          </div>

          <div className="relative flex justify-between items-center w-full px-2 min-w-[700px] pb-4">
            {LEAD_STAGES.map((step, idx) => {
              const isCompleted = idx < currentIdx
              const isCurrent = currentStage === step

              let circleBg = 'transparent'
              let circleBorder = 'border-[var(--border-color)]'
              let circleTextColor = 'text-[var(--ink-soft)]'
              let labelColor = 'text-[var(--ink-soft)] font-medium'
              let lineColor = 'bg-[var(--border-color)]'

              if (isCompleted) {
                circleBg = 'bg-[var(--success)]'
                circleBorder = 'border-[var(--success)]'
                circleTextColor = 'text-white'
                labelColor = 'text-[var(--ink)] font-bold'
                lineColor = 'bg-[var(--success)]'
              } else if (isCurrent) {
                circleBg = 'bg-[var(--accent)]'
                circleBorder = 'border-[var(--accent)] ring-4 ring-[var(--accent-soft)]'
                circleTextColor = 'text-white'
                labelColor = 'text-[var(--accent)] font-extrabold'
              }

              return (
                <div key={step} className="flex-1 flex flex-col items-center relative">
                  {/* Connector Line */}
                  {idx < LEAD_STAGES.length - 1 && (
                    <div 
                      className={`absolute left-[50%] top-[14px] right-[-50%] h-[3px] z-0 transition-colors duration-300 ${
                        idx < currentIdx ? 'bg-[var(--success)]' : 'bg-[var(--border-color)]'
                      }`}
                    />
                  )}

                  {/* Circle */}
                  <div className="relative z-10 flex items-center justify-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${circleBg} ${circleBorder} ${circleTextColor}`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                  </div>

                  {/* Label */}
                  <span className={`text-[10px] text-center mt-2 max-w-[80px] break-words leading-tight select-none ${labelColor}`}>
                    {step}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-[var(--border-color)] flex items-center gap-3">
            <button 
              onClick={handleAdvanceStage}
              className="btn-primary flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              Advance Stage
            </button>
            <button 
              onClick={() => setCurrentStage('Lost')}
              className="btn-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              Mark Lost
            </button>
            <button 
              onClick={() => setCurrentStage('Future Prospect')}
              className="btn-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              Future Prospect
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="card p-6">
              <h3 className="text-base font-bold text-[var(--ink)] mb-4 font-display">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--ink-soft)]"><User size={16}/></div>
                  <div>
                    <p className="text-[10px] text-[var(--ink-muted)] uppercase font-bold tracking-wider">Name</p>
                    <p className="text-sm font-semibold text-[var(--ink)]">{lead.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--ink-soft)]"><Phone size={16}/></div>
                  <div>
                    <p className="text-[10px] text-[var(--ink-muted)] uppercase font-bold tracking-wider">Mobile</p>
                    <p className="text-sm font-semibold text-[var(--ink)] font-mono">{lead.mobile}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--ink-soft)]"><Mail size={16}/></div>
                  <div>
                    <p className="text-[10px] text-[var(--ink-muted)] uppercase font-bold tracking-wider">Email</p>
                    <p className="text-sm font-semibold text-[var(--ink)]">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--ink-soft)]"><MapPin size={16}/></div>
                  <div>
                    <p className="text-[10px] text-[var(--ink-muted)] uppercase font-bold tracking-wider">City & Locality</p>
                    <p className="text-sm font-semibold text-[var(--ink)]">{lead.city} ({lead.locationPref})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--ink-soft)]"><Building size={16}/></div>
                  <div>
                    <p className="text-[10px] text-[var(--ink-muted)] uppercase font-bold tracking-wider">Property Type</p>
                    <p className="text-sm font-semibold text-[var(--ink)]">{lead.propertyType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--ink-soft)]"><IndianRupee size={16}/></div>
                  <div>
                    <p className="text-[10px] text-[var(--ink-muted)] uppercase font-bold tracking-wider">Budget</p>
                    <p className="text-sm font-semibold text-[var(--gold)] font-mono">{lead.budget}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Checklist Card (redesigned) */}
            <div className="card p-6">
              <h3 className="text-base font-bold text-[var(--ink)] mb-4 font-display flex items-center gap-2">
                <Shield size={18} className="text-[var(--accent)]" /> Document Checklist
              </h3>
              <div className="divide-y divide-[var(--border-color)]">
                {[
                  { key: 'panCard', label: 'PAN Card Copy' },
                  { key: 'aadhaarCard', label: 'Aadhaar Card Copy' },
                  { key: 'incomeProof', label: 'Income Proof / Form 16' },
                  { key: 'bookingSheet', label: 'Unit Booking Sheet' }
                ].map((doc) => {
                  const status = documents[doc.key as keyof typeof documents]
                  const isReceived = status === 'Received'
                  return (
                    <div 
                      key={doc.key} 
                      onClick={() => handleToggleDoc(doc.key as any)}
                      className="flex justify-between items-center py-3.5 cursor-pointer hover:bg-[var(--bg-hover)]/30 px-2 -mx-2 rounded-lg transition-colors group"
                    >
                      <span className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">{doc.label}</span>
                      <StatusBadge status={status} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Site Visit Info */}
            <div className="card p-6 border-l-4 border-[var(--gold)] relative overflow-hidden">
              <h3 className="text-base font-bold text-[var(--ink)] mb-4 flex items-center gap-2 font-display">
                <Calendar size={18} className="text-[var(--gold)]" /> Site Visit Details
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4 font-mono text-xs">
                <div>
                  <p className="text-[9px] text-[var(--ink-muted)] uppercase font-bold tracking-wider font-sans mb-0.5">Visit Date</p>
                  <p className="font-semibold text-[var(--ink)] font-sans">Tomorrow, 11:00 AM</p>
                </div>
                <div>
                  <p className="text-[9px] text-[var(--ink-muted)] uppercase font-bold tracking-wider font-sans mb-0.5">Project Name</p>
                  <p className="font-semibold text-[var(--ink)] font-sans">Lodha Bellissimo</p>
                </div>
                <div>
                  <p className="text-[9px] text-[var(--ink-muted)] uppercase font-bold tracking-wider font-sans mb-0.5">Executive</p>
                  <p className="font-semibold text-[var(--ink)] font-sans">Vikram Singh</p>
                </div>
                <div>
                  <p className="text-[9px] text-[var(--ink-muted)] uppercase font-bold tracking-wider font-sans mb-0.5">Outcome</p>
                  <div className="mt-0.5"><StatusBadge status="Scheduled" /></div>
                </div>
              </div>
              <div className="border-t border-[var(--border-color)] pt-3 mt-3">
                <p className="text-[10px] text-[var(--ink-soft)] mb-1 font-bold uppercase tracking-wider font-sans">Customer Feedback</p>
                <p className="text-xs text-[var(--ink-soft)] italic font-medium leading-relaxed font-sans">"Will bring family along to see the sample flat."</p>
              </div>
            </div>

            {/* Follow-up Timeline System */}
            <div className="card p-6 flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[var(--ink)] font-display">Follow-up History</h3>
                <div className="relative">
                  <Bell size={18} className="text-[var(--danger)] animate-pulse" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[var(--danger)] rounded-full"></span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-[10px] text-[var(--ink-muted)] uppercase font-bold tracking-wider">Next Follow-up Date</p>
                <p className="text-sm font-bold text-[var(--danger)] font-mono">Today, 04:00 PM (Overdue)</p>
              </div>

              <button 
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-green-600 transition-colors shadow-sm flex items-center justify-center gap-2 mb-6"
              >
                <MessageSquare size={16} /> Send WhatsApp Reminder
              </button>

              {/* History Timeline */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-5 pr-2 relative border-l border-[var(--border-color)] pl-4 ml-2">
                <div className="relative group">
                  <div className="absolute w-2.5 h-2.5 bg-[var(--accent)] rounded-full -left-[21.5px] top-1 border-2 border-[var(--bg-card)]" />
                  <p className="text-[10px] text-[var(--ink-soft)] mb-0.5 font-bold font-mono">Today, 10:30 AM</p>
                  <p className="text-xs text-[var(--ink)] font-semibold leading-relaxed">Customer asked for the brochure. Emailed and sent on WhatsApp.</p>
                </div>
                <div className="relative group">
                  <div className="absolute w-2.5 h-2.5 bg-[var(--ink-muted)] rounded-full -left-[21.5px] top-1 border-2 border-[var(--bg-card)]" />
                  <p className="text-[10px] text-[var(--ink-soft)] mb-0.5 font-bold font-mono">Yesterday, 02:15 PM</p>
                  <p className="text-xs text-[var(--ink)] font-semibold leading-relaxed">Initial call done. Budget is strict but location is flexible. Fixed site visit.</p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
                <div className="flex gap-2">
                  <input type="text" placeholder="Add call notes..." className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] outline-none" />
                  <button className="bg-[var(--accent)] hover:bg-[var(--accent)]/95 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]">Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
