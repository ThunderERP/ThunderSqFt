import { useLocation } from 'react-router-dom'
import { Moon, Menu, Sun, Search, Bell, Landmark } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'
import { useAuth } from '../../auth/context/AuthContext'

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard' },
  '/ceo': { title: 'CEO Dashboard', subtitle: 'Executive overview — all branches combined' },
  '/ceo/branches': { title: 'Branch Comparison', subtitle: 'Performance metrics across all locations' },
  '/sales/dashboard': { title: 'Sales Dashboard', subtitle: 'Sales performance and leads overview' },
  '/sales/leads': { title: 'Leads Directory', subtitle: 'Manage all prospective clients' },
  '/sales/follow-ups': { title: 'Follow-ups', subtitle: 'Pending actions and calls' },
  '/sales/visits': { title: 'Site Visits', subtitle: 'Scheduled property viewings' },
  '/sales/bookings': { title: 'Bookings', subtitle: 'Finalized unit bookings' },
  '/banking/loans': { title: 'Loan Pipeline', subtitle: 'Track loan processing stages' },
  '/tasks': { title: 'Task Management', subtitle: 'Your day-to-day operations' },
  '/hr/directory': { title: 'Employees', subtitle: 'Company directory and roles' },
  '/settings': { title: 'Settings', subtitle: 'Manage your preferences' }
}

function getPageInfo(pathname: string): { title: string; subtitle?: string } {
  if (pageTitles[pathname]) return pageTitles[pathname]
  
  if (pathname.includes('/banking/loan-files/')) {
    return { title: 'Loan File Detail', subtitle: 'Detailed customer loan file view' }
  }
  if (pathname === '/banking/loan-files') {
    return { title: 'Loan Files', subtitle: 'Manage customer loan documents' }
  }
  if (pathname === '/banking/pending-tracker') {
    return { title: 'Pending Tracker', subtitle: 'Track loans pending coordinator action' }
  }
  if (pathname === '/hr/leave' || pathname === '/hr/leaves') {
    return { title: 'Leave Requests', subtitle: 'Manage leave requests' }
  }
  if (pathname === '/hr/attendance') {
    return { title: 'Attendance', subtitle: 'View staff attendance' }
  }
  if (pathname === '/hr/performance') {
    return { title: 'Performance', subtitle: 'Staff performance tracking' }
  }
  if (pathname === '/automation') {
    return { title: 'Automation Center', subtitle: 'Workflow and automation settings' }
  }
  if (pathname === '/automation/triggers') {
    return { title: 'Automation Triggers', subtitle: 'Configure automated actions' }
  }
  if (pathname.startsWith('/finance')) {
    const sub = pathname.replace('/finance', '').replace(/^\//, '')
    if (!sub) return { title: 'Finance Dashboard', subtitle: 'Overview of company accounts, invoices, and cashflow' }
    const formatted = sub
      .split(/[-/]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    return { title: `${formatted} Suite`, subtitle: `Finance - ${formatted} tracking` }
  }

  const parts = pathname.split('/').filter(Boolean)
  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1]
    const title = lastPart
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    return { title, subtitle: 'PropFlow ERP Module' }
  }

  return { title: 'Overview', subtitle: 'Prop Flow Management System' }
}

export default function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { currentUser } = useAuth()
  
  const currentPath = location.pathname
  const pageInfo = getPageInfo(currentPath)
  const userInitials = currentUser?.name
    ? currentUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : 'U'

  return (
    <header className="h-[72px] flex items-center justify-between px-4 md:px-8 z-30 sticky top-0 bg-[var(--bg-card)] border-b border-[var(--border-color)]">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-2 -ml-2 text-[var(--ink-soft)] rounded-xl hover:bg-[var(--bg-hover)]"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 className="text-base md:text-lg font-bold text-[var(--ink)] tracking-tight font-display">
            {pageInfo.title}
          </h2>
          {pageInfo.subtitle && (
            <p className="text-[11px] md:text-xs text-[var(--ink-soft)] mt-0.5 font-medium">
              {pageInfo.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Mock Search Box */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--ink-muted)]">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search ERP..."
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-md text-xs pl-9 pr-3 py-2 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 text-[var(--ink)] placeholder-[var(--ink-muted)] transition-all"
            aria-label="Search"
          />
        </div>

        {/* Branch / Scope Selector Chip */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--ink-soft)] font-medium">
          <Landmark size={12} className="text-[var(--accent)]" />
          <span>Delhi Branch</span>
        </div>

        {/* Notification Bell */}
        <button
          className="relative p-2 text-[var(--ink-soft)] hover:text-[var(--ink)] bg-[var(--bg-hover)] rounded-full transition-colors"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--danger)] rounded-full" />
        </button>

        {/* Theme Toggler */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-[var(--ink-soft)] hover:text-[var(--ink)] bg-[var(--bg-hover)] rounded-full transition-colors"
          title="Toggle dark mode"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold text-xs shrink-0 transition-shadow hover:shadow-glow">
          {userInitials}
        </div>
      </div>
    </header>
  )
}
