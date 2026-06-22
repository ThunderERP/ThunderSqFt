import { useLocation } from 'react-router-dom'
import { Moon, Menu, Sun } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'

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
  
  const currentPath = location.pathname
  const pageInfo = getPageInfo(currentPath)

  return (
    <header className="h-[72px] flex items-center justify-between px-4 md:px-8 z-30 sticky top-0 bg-bg-card border-b border-border-color">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-2 -ml-2 text-ink-soft rounded-xl hover:bg-bg-hover"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg md:text-xl font-bold text-ink tracking-tight">{pageInfo.title}</h2>
          {pageInfo.subtitle && <p className="text-xs md:text-sm text-ink-soft mt-0.5 font-medium">{pageInfo.subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 text-ink-soft hover:text-ink bg-bg-hover hover:bg-bg-hover/80 rounded-full transition-colors"
          title="Toggle dark mode"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  )
}
