import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageTransition } from '../../shared/components/MotionComponents'
import { LEAD_STAGES, getStageColor } from '../utils/leadStages'
import { ArrowLeft, Phone, Mail, MapPin, User, Building, IndianRupee, MessageSquare, Bell, Calendar, CheckCircle2 } from 'lucide-react'

export default function SalesLeadDetail() {
  const { id } = useParams()
  const [toast, setToast] = useState(false)

  // Mock data
  const lead = {
    id: id || 'L-1001',
    name: 'Rajesh Kumar',
    mobile: '+91 9876543210',
    email: 'rajesh@example.com',
    city: 'Mumbai',
    propertyType: '3 BHK',
    locationPref: 'Andheri West',
    budget: '₹1.5 Cr',
    currentStage: 'Site Visit Fixed' as any
  }

  const handleWhatsApp = () => {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <PageTransition>
      <div className="space-y-6 relative">
        {toast && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50">
            <CheckCircle2 size={18} />
            <span>WhatsApp reminder sent ✅</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Link to="/sales/leads" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-sm text-gray-500">Lead ID: {lead.id}</p>
          </div>
        </div>

        {/* Pipeline Stepper */}
        <div className="platform-card p-6 overflow-x-auto">
          <div className="flex items-center min-w-max">
            {LEAD_STAGES.map((stage, i) => {
              const isCurrent = stage === lead.currentStage
              const isPast = LEAD_STAGES.indexOf(stage) < LEAD_STAGES.indexOf(lead.currentStage)
              const colors = getStageColor(stage)
              
              return (
                <div key={stage} className="flex items-center">
                  <div className={`relative flex flex-col items-center gap-2 ${isCurrent ? 'scale-110' : ''} transition-transform`}>
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 z-10 transition-colors
                        ${isCurrent ? 'ring-4 ring-blue-50' : ''}
                      `}
                      style={{ 
                        backgroundColor: isPast || isCurrent ? colors.bg : '#f3f4f6',
                        borderColor: isPast || isCurrent ? colors.border : '#e5e7eb',
                        color: isPast || isCurrent ? colors.text : '#9ca3af'
                      }}
                    >
                      {isPast ? '✓' : i + 1}
                    </div>
                    <span className={`text-[11px] font-medium absolute -bottom-6 whitespace-nowrap ${isCurrent ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                      {stage}
                    </span>
                  </div>
                  {i < LEAD_STAGES.length - 1 && (
                    <div className={`w-16 h-1 mx-2 rounded-full ${isPast ? 'bg-blue-200' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-12 flex items-center gap-3">
            <button className="bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Advance Stage</button>
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Mark Lost</button>
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Future Prospect</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="platform-card p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"><User size={16} className="text-gray-500"/></div>
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"><Phone size={16} className="text-gray-500"/></div>
                  <div>
                    <p className="text-xs text-gray-500">Mobile</p>
                    <p className="text-sm font-medium text-gray-900">{lead.mobile}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"><Mail size={16} className="text-gray-500"/></div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"><MapPin size={16} className="text-gray-500"/></div>
                  <div>
                    <p className="text-xs text-gray-500">City & Locality</p>
                    <p className="text-sm font-medium text-gray-900">{lead.city} ({lead.locationPref})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"><Building size={16} className="text-gray-500"/></div>
                  <div>
                    <p className="text-xs text-gray-500">Property Type</p>
                    <p className="text-sm font-medium text-gray-900">{lead.propertyType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"><IndianRupee size={16} className="text-gray-500"/></div>
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="text-sm font-medium text-gray-900">{lead.budget}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Site Visit Info */}
            <div className="platform-card p-6 border-l-4 border-[#D97706]">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-[#D97706]" /> Site Visit Details
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Visit Date</p>
                  <p className="text-sm font-medium text-gray-900">Tomorrow, 11:00 AM</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Project Name</p>
                  <p className="text-sm font-medium text-gray-900">Lodha Bellissimo</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Executive</p>
                  <p className="text-sm font-medium text-gray-900">Vikram Singh</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Outcome</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-md border border-yellow-200">Scheduled</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Customer Feedback</p>
                <p className="text-sm text-gray-700 italic">"Will bring family along to see the sample flat."</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Lead Score */}
            <div className="platform-card p-6 bg-gradient-to-br from-blue-50 to-white">
              <h3 className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Lead Score</h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-[#2563EB]">85</span>
                <span className="text-sm text-gray-500 mb-1">/ 100</span>
              </div>
              <p className="text-xs text-green-600 font-medium mt-2">High probability of conversion</p>
            </div>

            {/* Follow-up System */}
            <div className="platform-card p-6 flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Follow-up</h3>
                <div className="relative">
                  <Bell size={18} className="text-red-500" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs text-gray-500">Next Follow-up Date</p>
                <p className="text-sm font-bold text-red-600">Today, 04:00 PM (Overdue)</p>
              </div>

              <button 
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors shadow-sm flex items-center justify-center gap-2 mb-6"
              >
                <MessageSquare size={16} /> Send WhatsApp Reminder
              </button>

              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                <div className="border-l-2 border-gray-200 pl-4 relative">
                  <div className="absolute w-2 h-2 bg-gray-300 rounded-full -left-[5px] top-1.5" />
                  <p className="text-xs text-gray-500 mb-1">Today, 10:30 AM</p>
                  <p className="text-sm text-gray-700">Customer asked for the brochure. Emailed and sent on WhatsApp.</p>
                </div>
                <div className="border-l-2 border-gray-200 pl-4 relative">
                  <div className="absolute w-2 h-2 bg-gray-300 rounded-full -left-[5px] top-1.5" />
                  <p className="text-xs text-gray-500 mb-1">Yesterday, 02:15 PM</p>
                  <p className="text-sm text-gray-700">Initial call done. Budget is strict but location is flexible. Fixed site visit.</p>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex gap-2">
                  <input type="text" placeholder="Add call notes..." className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                  <button className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
