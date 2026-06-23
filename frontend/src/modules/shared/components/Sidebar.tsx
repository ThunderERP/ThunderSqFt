import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, ChevronRight, LayoutDashboard, Users, Landmark, 
  CheckSquare, ShieldAlert, Settings2, Lock, Menu, Zap
} from 'lucide-react'
import { useRole, Role } from '../../../context/RoleContext'
import { useAuth } from '../../auth/context/AuthContext'

interface SidebarChild {
  path: string;
  label: string;
}

interface SidebarGroupProps {
  label: string;
  icon: any;
  isActive: boolean;
  isLocked?: boolean;
  isCollapsed: boolean;
  children: SidebarChild[];
  onClose?: () => void;
}

function SidebarGroup({ label, icon: Icon, isActive, isLocked = false, isCollapsed, children, onClose }: SidebarGroupProps) {
  const [isOpen, setIsOpen] = useState(isActive)
  const location = useLocation()

  useEffect(() => {
    if (isActive) {
      setIsOpen(true)
    }
  }, [isActive])

  if (isCollapsed) {
    const isAnyChildActive = children.some(c => location.pathname === c.path)
    return (
      <div className="relative group mb-2">
        <button
          className={`w-12 h-12 mx-auto flex items-center justify-center rounded-xl transition-all duration-200 relative ${
            isLocked
              ? 'opacity-40 cursor-not-allowed text-ink-muted'
              : isAnyChildActive 
                ? 'text-accent bg-accent-soft' 
                : 'text-ink-soft hover:text-ink hover:bg-bg-hover'
          }`}
          title={label}
        >
          {isAnyChildActive && (
            <div 
              className="absolute left-0 top-0 bottom-0 w-[2px]" 
              style={{ background: 'var(--active-gradient-x)' }} 
            />
          )}
          <Icon size={20} />
        </button>
        {!isLocked && (
          <div className="absolute left-16 top-0 hidden group-hover:block z-50 bg-bg-card border border-border-color rounded-lg shadow-xl py-2 w-48">
            <p className="px-4 py-1.5 text-xs font-bold text-ink border-b border-border-color mb-1 uppercase tracking-wider">{label}</p>
            {children.map(child => (
              <NavLink
                key={child.path}
                to={child.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-2 text-xs font-medium transition-all relative ${
                    isActive ? 'text-accent bg-accent-soft font-semibold' : 'text-ink-soft hover:text-ink hover:bg-bg-hover'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-[2px]" 
                        style={{ background: 'var(--active-gradient-x)' }} 
                      />
                    )}
                    {child.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mb-2">
      <button
        onClick={() => !isLocked && setIsOpen(!isOpen)}
        disabled={isLocked}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all duration-200 group rounded-lg relative ${
          isLocked
            ? 'opacity-40 cursor-not-allowed text-ink-soft'
            : isActive 
              ? 'text-accent bg-accent-soft' 
              : 'text-ink-soft hover:text-ink hover:bg-bg-hover'
        }`}
      >
        {isActive && (
          <div 
            className="absolute left-0 top-0 bottom-0 w-[2px]" 
            style={{ background: 'var(--active-gradient-x)' }} 
          />
        )}
        <div className="flex items-center gap-3">
          <Icon size={18} className={isActive ? 'text-accent' : 'text-ink-soft group-hover:text-ink'} />
          <span>{label}</span>
          {isLocked && <Lock size={12} className="ml-1.5" />}
        </div>
        {!isLocked && (
          <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown size={14} className={isActive ? 'text-accent' : 'text-ink-soft'} />
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && !isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="pl-8 pr-2 mt-1 space-y-1 border-l border-border-color ml-6">
              {children.map(child => {
                const isChildActive = location.pathname === child.path
                return (
                  <li key={child.path}>
                    <NavLink
                      to={child.path}
                      onClick={onClose}
                      className={`block px-3 py-2 text-[13px] font-medium transition-all rounded-md relative ${
                        isChildActive
                          ? 'text-accent font-semibold bg-accent-soft'
                          : 'text-ink-soft hover:text-ink hover:bg-bg-hover'
                      }`}
                    >
                      {isChildActive && (
                        <div 
                          className="absolute left-0 top-1.5 bottom-1.5 w-[2px]" 
                          style={{ background: 'var(--active-gradient-x)' }} 
                        />
                      )}
                      {child.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ChevronDown({ size, className }: { size: number; className?: string }) {
  return <ChevronRight size={size} className={`transform rotate-90 ${className || ''}`} />
}

interface SidebarNavLinkProps {
  to: string
  end?: boolean
  onClick?: () => void
  icon: any
  label: string
  isCollapsed: boolean
  iconClass: string
  navLinkClass: (props: { isActive: boolean }) => string
}

function SidebarNavLink({ to, end, onClick, icon: Icon, label, isCollapsed, iconClass, navLinkClass }: SidebarNavLinkProps) {
  return (
    <NavLink to={to} end={end} onClick={onClick} className={navLinkClass} aria-label={`Go to ${label}`}>
      {({ isActive }) => (
        <div className="flex items-center gap-3 w-full justify-center lg:justify-start relative">
          {isActive && (
            <div 
              className="absolute left-[-8px] top-[-12px] bottom-[-12px] w-[2px]" 
              style={{ background: 'var(--active-gradient-y)' }} 
            />
          )}
          <Icon size={18} className={isActive ? 'text-accent' : iconClass} />
          {!isCollapsed && <span>{label}</span>}
        </div>
      )}
    </NavLink>
  )
}

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const { activeRole, setActiveRole, isModuleVisible } = useRole()
  const { currentUser } = useAuth()
  const location = useLocation()
  
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isCollapsed))
  }, [isCollapsed])

  const isSalesActive = location.pathname.startsWith('/sales')
  const isBankingActive = location.pathname.startsWith('/banking')
  const isHrActive = location.pathname.startsWith('/hr')

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all group rounded-lg relative ${
      isActive
        ? 'active text-accent bg-accent-soft'
        : 'text-ink-soft hover:text-ink hover:bg-bg-hover'
    }`

  const iconClass = "group-hover:text-ink group-[.active]:text-accent text-ink-soft"

  const sidebarVariants = {
    expanded: { width: 260 },
    collapsed: { width: 64 }
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          role="presentation"
        />
      )}

      <motion.aside
        id="sidebar-aside"
        role={isOpen ? "dialog" : "navigation"}
        aria-modal={isOpen ? "true" : undefined}
        aria-label="Navigation"
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed lg:relative top-0 left-0 bottom-0 z-50 h-screen flex flex-col bg-bg-surface border-r border-border-color transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-[72px] px-4 border-b border-border-color flex items-center justify-between overflow-hidden">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3 shrink-0"
              >
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-black text-lg">
                  ⚡
                </div>
                <h1 className="text-base font-extrabold text-ink leading-none tracking-tight">Thunder ERP</h1>
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-black text-lg mx-auto">
              ⚡
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg border border-border-color hover:bg-bg-hover text-ink-soft hover:text-ink shrink-0 ml-2"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <button 
            onClick={onClose} 
            className="lg:hidden p-1.5 hover:bg-bg-hover text-ink-soft hover:text-ink"
            aria-label="Close navigation"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {!isCollapsed && (
          <div className="px-4 py-4 border-b border-border-color shrink-0">
            <label className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1.5">
              Preview Role
            </label>
            <div className="relative">
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as Role)}
                className="w-full bg-bg-card border border-border-color text-xs font-semibold rounded-lg px-2.5 py-2 text-ink focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 cursor-pointer appearance-none"
                aria-label="Preview Role Selector"
              >
                <option value="ceo">CEO</option>
                <option value="manager">Branch Manager</option>
                <option value="leader">Team Leader</option>
                <option value="sales">Sales Executive</option>
                <option value="banking">Banking Executive</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none" />
            </div>
          </div>
        )}

        <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-1 scrollbar-thin">
          <SidebarNavLink to="/" end onClick={onClose} icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} iconClass={iconClass} navLinkClass={navLinkClass} />
          
          {isModuleVisible('ceo') && (
            <>
              <SidebarNavLink to="/ceo" end onClick={onClose} icon={LayoutDashboard} label="CEO Dashboard" isCollapsed={isCollapsed} iconClass={iconClass} navLinkClass={navLinkClass} />
              <SidebarNavLink to="/ceo/branches" onClick={onClose} icon={Landmark} label="Branch Comparison" isCollapsed={isCollapsed} iconClass={iconClass} navLinkClass={navLinkClass} />
            </>
          )}

          {isModuleVisible('salesCrm') && (
            <>
              <SidebarNavLink to="/sales/leads" onClick={onClose} icon={Users} label="Leads" isCollapsed={isCollapsed} iconClass={iconClass} navLinkClass={navLinkClass} />
              <SidebarNavLink to="/sales/follow-ups" onClick={onClose} icon={CheckSquare} label="Follow-ups" isCollapsed={isCollapsed} iconClass={iconClass} navLinkClass={navLinkClass} />
              <SidebarNavLink to="/sales/visits" onClick={onClose} icon={CheckSquare} label="Site Visits" isCollapsed={isCollapsed} iconClass={iconClass} navLinkClass={navLinkClass} />
              <SidebarNavLink to="/sales/bookings" onClick={onClose} icon={ShieldAlert} label="Bookings" isCollapsed={isCollapsed} iconClass={iconClass} navLinkClass={navLinkClass} />
            </>
          )}

          {isModuleVisible('bankingCrm') && (
            <SidebarNavLink to="/banking/loans" onClick={onClose} icon={Landmark} label="Loans" isCollapsed={isCollapsed} iconClass={iconClass} navLinkClass={navLinkClass} />
          )}

          {isModuleVisible('tasks') && (
            <SidebarNavLink to="/tasks" onClick={onClose} icon={CheckSquare} label="Tasks" isCollapsed={isCollapsed} iconClass={iconClass} navLinkClass={navLinkClass} />
          )}

          {isModuleVisible('hr') && (
            <SidebarNavLink to="/hr/directory" onClick={onClose} icon={Users} label="Employees" isCollapsed={isCollapsed} iconClass={iconClass} navLinkClass={navLinkClass} />
          )}

          {isModuleVisible('automation') && (
            <SidebarNavLink to="/automation" onClick={onClose} icon={Zap} label="Automation" isCollapsed={isCollapsed} iconClass={iconClass} navLinkClass={navLinkClass} />
          )}

          <SidebarNavLink to="/settings" onClick={onClose} icon={Settings2} label="Settings" isCollapsed={isCollapsed} iconClass={iconClass} navLinkClass={navLinkClass} />
        </nav>

        {/* Footer User Profile Badge */}
        <div className="p-3 border-t border-border-color bg-bg-surface overflow-hidden shrink-0">
          <div className="flex items-center gap-3 group cursor-pointer hover:bg-bg-hover p-1.5 rounded-lg transition-all justify-center lg:justify-start">
            <div className="w-9 h-9 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-sm shrink-0">
              {currentUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate leading-tight">{currentUser.name}</p>
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
                  {activeRole}
                </span>
              </div>
            )}
            {!isCollapsed && (
              <Settings2 size={14} className="text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
            )}
          </div>
        </div>
      </motion.aside>
    </>
  )
}
