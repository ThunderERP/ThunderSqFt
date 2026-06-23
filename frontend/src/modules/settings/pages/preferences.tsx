import { useState } from 'react'
import { PageTransition } from '../../shared/components/MotionComponents'
import PageHeader from '../../shared/components/PageHeader'
import StatusBadge from '../../shared/components/StatusBadge'
import { User, Sun, Moon, Shield, Bell, Smartphone, Layout, Key, LogOut } from 'lucide-react'
import { useAuth } from '../../auth/context/AuthContext'
import { useRole } from '../../../context/RoleContext'
import { useTheme } from '../../../context/ThemeContext'

export default function Preferences() {
  const { currentUser } = useAuth()
  const { activeRole, setActiveRole } = useRole()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    missedFollowUps: true,
    newLeads: true,
    bookingConfirmations: true,
    loanStatusUpdates: false,
  })

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'CEO': return 'CEO / Director';
      case 'BranchManager': return 'Branch Manager';
      case 'TeamLeader': return 'Team Leader';
      case 'SalesExecutive': return 'Sales Executive';
      case 'BankingExecutive': return 'Banking Executive';
      case 'Admin': return 'Admin';
      default: return role;
    }
  }

  const email = `${currentUser.name.toLowerCase().replace(/\s+/g, '.')}@propflow.com`
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <PageTransition>
      <div className="p-6 max-w-4xl space-y-6 text-[var(--ink)]">
        {/* Header */}
        <PageHeader 
          title="Settings"
          subtitle="Manage your account and preferences"
        />

        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-card p-6">
            <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2 font-display uppercase tracking-wider">
              <User size={18} className="text-[var(--ink-muted)]" /> Profile
            </h3>
            <p className="text-sm text-[var(--ink-soft)] mt-1 mb-6">Your account information</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] border border-[var(--accent)]/15 font-bold text-2xl font-mono">
                {initials}
              </div>
              <div>
                <h4 className="text-lg font-bold text-[var(--ink)] leading-tight font-display">{currentUser.name}</h4>
                <p className="text-sm text-[var(--accent)] font-mono mt-1">{email}</p>
                <div className="mt-2.5">
                  <StatusBadge status={getRoleLabel(currentUser.role)} />
                </div>
              </div>
            </div>

            <hr className="border-[var(--border-color)] my-6" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--ink-soft)]">Role</p>
                <p className="text-sm font-semibold text-[var(--ink)]">{getRoleLabel(currentUser.role)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--ink-soft)]">Email</p>
                <p className="text-sm font-semibold text-[var(--ink)] font-mono">{email}</p>
              </div>
            </div>
          </div>

          {/* Appearance Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-card p-6">
            <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2 font-display uppercase tracking-wider">
              <Sun size={18} className="text-[var(--ink-muted)]" /> Appearance
            </h3>
            <p className="text-sm text-[var(--ink-soft)] mt-1 mb-6">Customize how PropFlow CRM looks</p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">Theme</p>
                <p className="text-sm text-[var(--ink-soft)]">Currently using {theme} mode</p>
              </div>
              <div className="flex items-center bg-[var(--bg-surface)] p-1 rounded-lg border border-[var(--border-color)]">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${theme === 'light' ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'}`}
                >
                  <Sun size={16} /> Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${theme === 'dark' ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'}`}
                >
                  <Moon size={16} /> Dark
                </button>
              </div>
            </div>
          </div>

          {/* Permissions Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-card p-6">
            <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2 font-display uppercase tracking-wider">
              <Shield size={18} className="text-[var(--ink-muted)]" /> Permissions
            </h3>
            <p className="text-sm text-[var(--ink-soft)] mt-1 mb-6">What you can access based on your role</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="min-w-[110px] text-center">
                  <StatusBadge status="Full Access" />
                </div>
                <span className="text-sm text-[var(--ink-soft)]">All modules, all branches, CEO dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="min-w-[110px] text-center">
                  <StatusBadge status="Reports" />
                </div>
                <span className="text-sm text-[var(--ink-soft)]">Branch comparison, analytics, trends</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="min-w-[110px] text-center">
                  <StatusBadge status="HR" />
                </div>
                <span className="text-sm text-[var(--ink-soft)]">Employee management and leaderboard</span>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-card p-6">
            <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2 font-display uppercase tracking-wider">
              <Bell size={18} className="text-[var(--ink-muted)]" /> Notifications
            </h3>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--ink-soft)]">Missed follow-up alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications.missedFollowUps} onChange={() => handleToggle('missedFollowUps')} />
                  <div className="w-11 h-6 bg-[var(--bg-surface)] border border-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--ink-soft)]">New lead assignments</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications.newLeads} onChange={() => handleToggle('newLeads')} />
                  <div className="w-11 h-6 bg-[var(--bg-surface)] border border-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--ink-soft)]">Booking confirmations</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications.bookingConfirmations} onChange={() => handleToggle('bookingConfirmations')} />
                  <div className="w-11 h-6 bg-[var(--bg-surface)] border border-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--ink-soft)]">Loan status updates</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications.loanStatusUpdates} onChange={() => handleToggle('loanStatusUpdates')} />
                  <div className="w-11 h-6 bg-[var(--bg-surface)] border border-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  )
}
