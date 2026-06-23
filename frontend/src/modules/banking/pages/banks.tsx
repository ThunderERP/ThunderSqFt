import { useState } from 'react'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import PageHeader from '../../shared/components/PageHeader'
import StatusBadge from '../../shared/components/StatusBadge'
import { Plus, Building, Phone, Mail, Clock, IndianRupee, Search, X, ChevronDown } from 'lucide-react'

const mockBanks = [
  { id: 1, name: 'HDFC Bank', color: 'bg-blue-600', contact: 'Rahul Verma', phone: '+91 98765 43210', email: 'rahul.v@hdfcbank.com', disbursed: '₹45.2 Cr', time: '10 Days' },
  { id: 2, name: 'State Bank of India', color: 'bg-sky-500', contact: 'Anita Desai', phone: '+91 98765 43211', email: 'anita.d@sbi.co.in', disbursed: '₹32.8 Cr', time: '14 Days' },
  { id: 3, name: 'ICICI Bank', color: 'bg-orange-500', contact: 'Vikram Singh', phone: '+91 98765 43212', email: 'vikram.s@icicibank.com', disbursed: '₹28.5 Cr', time: '8 Days' },
  { id: 4, name: 'Axis Bank', color: 'bg-rose-600', contact: 'Neha Gupta', phone: '+91 98765 43213', email: 'neha.g@axisbank.com', disbursed: '₹18.0 Cr', time: '12 Days' },
  { id: 5, name: 'Punjab National Bank', color: 'bg-amber-500', contact: 'Suresh Kumar', phone: '+91 98765 43214', email: 'suresh.k@pnb.co.in', disbursed: '₹12.4 Cr', time: '18 Days' },
  { id: 6, name: 'Kotak Mahindra Bank', color: 'bg-red-600', contact: 'Deepak Chawla', phone: '+91 98765 43215', email: 'deepak.c@kotak.com', disbursed: '₹22.1 Cr', time: '9 Days' },
  { id: 7, name: 'IDFC First Bank', color: 'bg-red-800', contact: 'Harsh Vardhan', phone: '+91 98765 43216', email: 'harsh.v@idfcfirst.com', disbursed: '₹15.7 Cr', time: '7 Days' },
  { id: 8, name: 'IndusInd Bank', color: 'bg-amber-800', contact: 'Manish Malhotra', phone: '+91 98765 43217', email: 'manish.m@indusind.com', disbursed: '₹14.2 Cr', time: '11 Days' },
]

export default function BankingPartners() {
  const [search, setSearch] = useState('')
  const [timeFilter, setTimeFilter] = useState('All Durations')

  const filteredBanks = mockBanks.filter(bank => {
    const matchesSearch = bank.name.toLowerCase().includes(search.toLowerCase()) || 
      bank.contact.toLowerCase().includes(search.toLowerCase()) || 
      bank.email.toLowerCase().includes(search.toLowerCase());
    
    const days = parseInt(bank.time) || 0;
    let matchesTime = true;
    if (timeFilter === 'Fast (< 10 Days)') {
      matchesTime = days < 10;
    } else if (timeFilter === 'Medium (10-14 Days)') {
      matchesTime = days >= 10 && days <= 14;
    } else if (timeFilter === 'Slow (> 14 Days)') {
      matchesTime = days > 14;
    }

    return matchesSearch && matchesTime;
  });

  return (
    <PageTransition>
      <div className="space-y-6 p-6 max-w-[1600px] mx-auto text-[var(--ink)]">
        <PageHeader 
          title="Banking Partners" 
          subtitle="Manage relationships and offers with partnered financial institutions."
          actions={
            <button className="bg-[var(--accent)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm flex items-center gap-2 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
              <Plus size={16} /> Add Partner
            </button>
          }
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, contact or email..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all bg-[var(--bg-surface)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" 
            />
          </div>
          <div className="relative w-48">
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)} 
              className="w-full appearance-none border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--ink-soft)] bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <option>All Durations</option>
              <option>Fast (&lt; 10 Days)</option>
              <option>Medium (10-14 Days)</option>
              <option>Slow (&gt; 14 Days)</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] pointer-events-none" />
          </div>
          {(timeFilter !== 'All Durations' || search) && (
            <button 
              onClick={() => { setTimeFilter('All Durations'); setSearch(''); }}
              className="text-xs font-medium text-[var(--accent)] hover:underline transition-all flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <X size={12} /> Clear
            </button>
          )}
          <span className="text-xs font-medium text-[var(--ink-muted)] ml-auto font-mono">{filteredBanks.length} partners</span>
        </div>

        {/* Partners Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBanks.map((bank, idx) => (
            <StaggerItem key={bank.id}>
              <div 
                className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-lg shadow-card hover:shadow-hover hover:border-[var(--border-hover)] flex flex-col h-full transition-all group"
                style={{ '--i': idx } as React.CSSProperties}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm ${bank.color}`}>
                    {bank.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[var(--ink)] font-display">{bank.name}</h3>
                    <div className="mt-1">
                      <StatusBadge status="Active" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-surface)] flex items-center justify-center">
                      <Building size={14} className="text-[var(--ink-soft)]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--ink-muted)] font-bold uppercase tracking-wider">Contact Person</p>
                      <p className="font-semibold text-[var(--ink)]">{bank.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-surface)] flex items-center justify-center">
                      <Phone size={14} className="text-[var(--ink-soft)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--ink)] font-mono">{bank.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-surface)] flex items-center justify-center">
                      <Mail size={14} className="text-[var(--ink-soft)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--ink)] truncate max-w-[180px]">{bank.email}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-[var(--border-color)] mb-6 bg-[var(--bg-surface)]/30 -mx-6 px-6">
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-[var(--ink-muted)] font-bold uppercase tracking-wider mb-1">
                      <IndianRupee size={12} /> Total Disbursed
                    </div>
                    <p className="font-bold text-[var(--gold)] font-mono">{bank.disbursed}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-[var(--ink-muted)] font-bold uppercase tracking-wider mb-1">
                      <Clock size={12} /> Avg. Processing
                    </div>
                    <p className="font-bold text-[var(--ink)] font-mono">{bank.time}</p>
                  </div>
                </div>

                <button className="w-full bg-transparent border border-[var(--border-color)] text-[var(--accent)] hover:bg-[var(--accent-soft)] hover:border-[var(--accent)] font-semibold py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                  View Offers
                </button>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filteredBanks.length === 0 && (
          <div className="py-16 text-center">
            <div className="inline-block mb-4 text-[var(--ink-muted)]">
              <Building size={40} />
            </div>
            <p className="text-[var(--ink-soft)] font-medium">No banking partners found</p>
            <p className="text-sm text-[var(--ink-muted)] mt-1">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
