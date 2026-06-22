import { useState } from 'react'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import PageHeader from '../../finance/components/PageHeader'
import { Zap, MessageSquare, Mail, Bell, Plus, ToggleLeft, ToggleRight, Search, X, ChevronDown } from 'lucide-react'

const mockRules = [
  { id: 'R-01', name: 'Site Visit Reminder', trigger: "Lead Status = 'Site Visit Fixed'", action: 'Send WhatsApp Reminder 24hrs before', channel: 'whatsapp', active: true },
  { id: 'R-02', name: 'Loan Approval Celebration', trigger: "Loan Status = 'Approved'", action: 'Send Congratulatory Email', channel: 'email', active: true },
  { id: 'R-03', name: 'Agreement Registered Next Steps', trigger: "Agreement Status = 'Registered'", action: 'Send Next Steps via WhatsApp', channel: 'whatsapp', active: true },
  { id: 'R-04', name: 'New Lead Auto-Reply', trigger: "New Lead Created", action: 'Send Welcome SMS & Email', channel: 'sms', active: false },
  { id: 'R-05', name: 'Overdue Follow-up Alert', trigger: "Follow-up Overdue > 2hrs", action: 'Send App Notification to Executive', channel: 'app', active: true },
  { id: 'R-06', name: 'Booking Receipt PDF Generator', trigger: "Stage = 'booking' & Payment = 'completed'", action: 'Generate & Email PDF Receipt', channel: 'email', active: true },
  { id: 'R-07', name: 'Weekly Target Recap Notification', trigger: "Day = 'Friday' & Time = '17:00'", action: 'Send team progress to Slack/App', channel: 'app', active: false },
]

export default function AutomationTriggers() {
  const [rules, setRules] = useState(mockRules)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [channelFilter, setChannelFilter] = useState('All Channels')

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r))
  }

  const getChannelIcon = (channel: string) => {
    if (channel === 'whatsapp') return <MessageSquare size={16} className="text-green-500" />
    if (channel === 'email') return <Mail size={16} className="text-blue-500" />
    if (channel === 'sms') return <MessageSquare size={16} className="text-purple-500" />
    return <Bell size={16} className="text-amber-500" />
  }

  const filteredRules = rules.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
      r.trigger.toLowerCase().includes(search.toLowerCase()) || 
      r.action.toLowerCase().includes(search.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'Active') matchesStatus = r.active;
    else if (statusFilter === 'Paused') matchesStatus = !r.active;

    const matchesChannel = channelFilter === 'All Channels' || r.channel.toLowerCase() === channelFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesChannel;
  });

  const activeCount = rules.filter(r => r.active).length
  const pausedCount = rules.filter(r => !r.active).length

  return (
    <PageTransition>
      <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
        <PageHeader 
          title="Automation Center" 
          subtitle="Manage automated triggers, notifications, and workflows."
          actions={
            <button className="bg-[#2563EB] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 active:scale-[0.97]">
              <Plus size={16} /> New Rule
            </button>
          }
        />

        {/* Stats Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
                <Zap size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{activeCount} Active</h3>
              <p className="text-sm text-gray-500 mt-1">Rules actively running</p>
            </div>
          </StaggerItem>
          
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-500">
                <ToggleLeft size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{pausedCount} Paused</h3>
              <p className="text-sm text-gray-500 mt-1">Rules currently paused</p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-[#2563EB]">
                <Bell size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{rules.length} Total</h3>
              <p className="text-sm text-gray-500 mt-1">Defined workflows</p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search rules..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-white" 
            />
          </div>
          <div className="relative w-44">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Paused</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative w-44">
            <select 
              value={channelFilter} 
              onChange={(e) => setChannelFilter(e.target.value)} 
              className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all"
            >
              <option>All Channels</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="app">App Notification</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {(statusFilter !== 'All Statuses' || channelFilter !== 'All Channels' || search) && (
            <button 
              onClick={() => { setStatusFilter('All Statuses'); setChannelFilter('All Channels'); setSearch(''); }}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <X size={12} /> Clear
            </button>
          )}
          <span className="text-xs font-medium text-gray-400 ml-auto">{filteredRules.length} rules</span>
        </div>

        {/* Active Workflows List */}
        <div className="platform-card overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Active Workflows</h3>
          </div>
          <StaggerContainer className="divide-y divide-gray-100">
            {filteredRules.map((rule, idx) => (
              <StaggerItem key={rule.id}>
                <div 
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors anim-row"
                  style={{ '--i': idx } as React.CSSProperties}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">{rule.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${rule.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                        {rule.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm mt-3">
                      <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                        <span className="font-semibold text-xs text-gray-400 uppercase tracking-wider">WHEN</span> {rule.trigger}
                      </div>
                      <span className="hidden md:block text-gray-300">→</span>
                      <div className="flex items-center gap-2 text-gray-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                        <span className="font-semibold text-xs text-blue-500 uppercase tracking-wider">THEN</span> {getChannelIcon(rule.channel)} {rule.action}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleRule(rule.id)}
                    className="mt-4 md:mt-0 active:scale-95 transition-all outline-none"
                  >
                    {rule.active ? 
                      <ToggleRight size={40} className="text-[#2563EB]" /> : 
                      <ToggleLeft size={40} className="text-gray-300" />
                    }
                  </button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filteredRules.length === 0 && (
            <div className="py-16 text-center">
              <div className="float-bounce inline-block mb-4">
                <Zap size={40} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No automation rules found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
