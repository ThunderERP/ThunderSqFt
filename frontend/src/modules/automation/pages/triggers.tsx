import { useState } from 'react'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import PageHeader from '../../shared/components/PageHeader'
import StatCard from '../../shared/components/StatCard'
import StatusBadge from '../../shared/components/StatusBadge'
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
    if (channel === 'whatsapp') return <MessageSquare size={16} className="text-[var(--success)]" />
    if (channel === 'email') return <Mail size={16} className="text-[var(--accent)]" />
    if (channel === 'sms') return <MessageSquare size={16} className="text-[var(--violet)]" />
    return <Bell size={16} className="text-[var(--gold)]" />
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
      <div className="space-y-6 p-6 max-w-[1600px] mx-auto text-[var(--ink)]">
        <PageHeader 
          title="Automation Center" 
          subtitle="Manage automated triggers, notifications, and workflows."
          actions={
            <button className="bg-[var(--accent)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm flex items-center gap-2 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
              <Plus size={16} /> New Rule
            </button>
          }
        />

        {/* Stats Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StaggerItem>
            <StatCard label="Active Rules" value={String(activeCount)} subtitle="Actively running workflows" valueColor="text-[var(--success)]" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Paused Rules" value={String(pausedCount)} subtitle="Currently paused" valueColor="text-[var(--ink-soft)]" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Total Rules" value={String(rules.length)} subtitle="Defined workflows" valueColor="text-[var(--accent)]" />
          </StaggerItem>
        </StaggerContainer>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" size={16} />
            <input 
              type="text" 
              placeholder="Search rules..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 border border-[var(--border-color)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" 
            />
          </div>
          <div className="relative w-44">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="w-full appearance-none border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--ink-soft)] bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Paused</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] pointer-events-none" />
          </div>
          <div className="relative w-44">
            <select 
              value={channelFilter} 
              onChange={(e) => setChannelFilter(e.target.value)} 
              className="w-full appearance-none border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--ink-soft)] bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <option>All Channels</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="app">App Notification</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] pointer-events-none" />
          </div>
          {(statusFilter !== 'All Statuses' || channelFilter !== 'All Channels' || search) && (
            <button 
              onClick={() => { setStatusFilter('All Statuses'); setChannelFilter('All Channels'); setSearch(''); }}
              className="text-xs font-semibold text-[var(--accent)] hover:underline transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <X size={12} /> Clear
            </button>
          )}
          <span className="text-xs font-medium text-[var(--ink-muted)] font-mono ml-auto">{filteredRules.length} rules</span>
        </div>

        {/* Active Workflows List */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-surface)]/20">
            <h3 className="text-lg font-bold text-[var(--ink)] font-display uppercase tracking-wider">Active Workflows</h3>
          </div>
          <StaggerContainer className="divide-y divide-[var(--border-color)]">
            {filteredRules.map((rule, idx) => (
              <StaggerItem key={rule.id}>
                <div 
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--bg-hover)]/40 transition-colors"
                  style={{ '--i': idx } as React.CSSProperties}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-[var(--ink)] text-lg font-display">{rule.name}</h4>
                      <StatusBadge status={rule.active ? 'Active' : 'Paused'} />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm mt-3">
                      <div className="flex items-center gap-2 text-[var(--ink-soft)] bg-[var(--bg-surface)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]/60 font-mono text-xs">
                        <span className="font-bold text-[9px] text-[var(--ink-muted)] uppercase tracking-wider">WHEN</span> {rule.trigger}
                      </div>
                      <span className="hidden md:block text-[var(--ink-muted)]">→</span>
                      <div className="flex items-center gap-2 text-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 rounded-lg border border-[var(--accent)]/10 text-xs">
                        <span className="font-bold text-[9px] uppercase tracking-wider">THEN</span> {getChannelIcon(rule.channel)} {rule.action}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleRule(rule.id)}
                    className="mt-4 md:mt-0 active:scale-95 transition-all outline-none rounded focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    {rule.active ? 
                      <ToggleRight size={40} className="text-[var(--accent)]" /> : 
                      <ToggleLeft size={40} className="text-[var(--ink-muted)]" />
                    }
                  </button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filteredRules.length === 0 && (
            <div className="py-16 text-center text-[var(--ink-muted)] bg-[var(--bg-card)]">
              <div className="inline-block mb-4">
                <Zap size={40} />
              </div>
              <p className="text-[var(--ink-soft)] font-medium">No automation rules found</p>
              <p className="text-sm text-[var(--ink-muted)] mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
