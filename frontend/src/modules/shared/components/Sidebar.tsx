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
    // In collapsed mode, render as a simplified icon trigger (tooltip style, or just click to open parent)
    const isAnyChildActive = children.some(c => location.pathname === c.path)
    return (
      <div className="relative group mb-2">
        <button
          className={`w-12 h-12 mx-auto flex items-center justify-center rounded-xl transition-all duration-200 border-l-4 ${
            isLocked
              ? 'opacity-40 cursor-not-allowed text-ink-muted border-transparent'
              : isAnyChildActive 
                ? 'border-accent text-accent bg-accent-soft' 
                : 'border-transparent text-ink-soft hover:text-ink hover:bg-bg-hover'
          }`}
          title={label}
        >
          <Icon size={20} />
        </button>
        {/* Simple popover for children when collapsed */}
        {!isLocked && (
          <div className="absolute left-16 top-0 hidden group-hover:block z-50 bg-bg-card border border-border-color rounded-lg shadow-xl py-2 w-48">
            <p className="px-4 py-1.5 text-xs font-bold text-ink border-b border-border-color mb-1 uppercase tracking-wider">{label}</p>
            {children.map(child => (
              <NavLink
                key={child.path}
                to={child.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-2 text-xs font-medium transition-all ${
                    isActive ? 'text-accent bg-accent-soft font-semibold' : 'text-ink-soft hover:text-ink hover:bg-bg-hover'
                  }`
                }
              >
                {child.label}
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
        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all duration-200 group border-l-4 rounded-lg ${
          isLocked
            ? 'opacity-40 cursor-not-allowed text-ink-soft border-transparent'
            : isActive 
              ? 'border-accent text-accent bg-accent-soft' 
              : 'border-transparent text-ink-soft hover:text-ink hover:bg-bg-hover'
        }`}
      >
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
                      className={`block px-3 py-2 text-[13px] font-medium transition-all rounded-md ${
                        isChildActive
                          ? 'text-accent font-semibold bg-accent-soft border-l-2 border-accent -ml-[1px]'
                          : 'text-ink-soft hover:text-ink hover:bg-bg-hover border-l-2 border-transparent -ml-[1px]'
                      }`}
                    >
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

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const { activeRole, setActiveRole, isModuleVisible } = useRole()
  const { currentUser } = useAuth()
  const location = useLocation()
  
  // Collapse state for desktop
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isCollapsed))
  }, [isCollapsed])

  // Handle active groupings
  const isSalesActive = location.pathname.startsWith('/sales')
  const isBankingActive = location.pathname.startsWith('/banking')
  const isHrActive = location.pathname.startsWith('/hr')

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all group border-l-4 rounded-lg ${
      isActive
        ? 'active border-accent text-accent bg-accent-soft'
        : 'border-transparent text-ink-soft hover:text-ink hover:bg-bg-hover'
    }`

  const iconClass = "group-hover:text-ink group-[.active]:text-accent text-ink-soft"

  const sidebarVariants = {
    expanded: { width: 260 },
    collapsed: { width: 64 }
  }

  return (
    <>
      {/* Mobile Drawer Overlay */}
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
        {/* Top Header Section */}
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

          {/* Collapse/Expand Toggle Button (only on desktop) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg border border-border-color hover:bg-bg-hover text-ink-soft hover:text-ink shrink-0 ml-2"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile close button */}
          <button 
            onClick={onClose} 
            className="lg:hidden p-1.5 hover:bg-bg-hover text-ink-soft hover:text-ink"
            aria-label="Close navigation"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Role Preview Selection (only when expanded) */}
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

        {/* Navigation List */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-1 scrollbar-thin">
          
          <NavLink to="/" end onClick={onClose} className={navLinkClass} aria-label="Go to Dashboard">
            {({ isActive }) => (
              <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
                <LayoutDashboard size={18} className={isActive ? 'text-accent' : iconClass} />
                {!isCollapsed && <span>Dashboard</span>}
              </div>
            )}
          </NavLink>

          {isModuleVisible('ceo') && (
            <>
              <NavLink to="/ceo" end onClick={onClose} className={navLinkClass} aria-label="Go to CEO Dashboard">
                {({ isActive }) => (
                  <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
                    <LayoutDashboard size={18} className={isActive ? 'text-accent' : iconClass} />
                    {!isCollapsed && <span>CEO Dashboard</span>}
                  </div>
                )}
              </NavLink>

              <NavLink to="/ceo/branches" onClick={onClose} className={navLinkClass} aria-label="Go to Branch Comparison">
                {({ isActive }) => (
                  <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
                    <Landmark size={18} className={isActive ? 'text-accent' : iconClass} />
                    {!isCollapsed && <span>Branch Comparison</span>}
                  </div>
                )}
              </NavLink>
            </>
          )}

          {isModuleVisible('salesCrm') && (
            <>
              <NavLink to="/sales/leads" onClick={onClose} className={navLinkClass} aria-label="Go to Leads">
                {({ isActive }) => (
                  <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
                    <Users size={18} className={isActive ? 'text-accent' : iconClass} />
                    {!isCollapsed && <span>Leads</span>}
                  </div>
                )}
              </NavLink>

              <NavLink to="/sales/follow-ups" onClick={onClose} className={navLinkClass} aria-label="Go to Follow-ups">
                {({ isActive }) => (
                  <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
                    <CheckSquare size={18} className={isActive ? 'text-accent' : iconClass} />
                    {!isCollapsed && <span>Follow-ups</span>}
                  </div>
                )}
              </NavLink>

              <NavLink to="/sales/visits" onClick={onClose} className={navLinkClass} aria-label="Go to Site Visits">
                {({ isActive }) => (
                  <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
                    <CheckSquare size={18} className={isActive ? 'text-accent' : iconClass} />
                    {!isCollapsed && <span>Site Visits</span>}
                  </div>
                )}
              </NavLink>

              <NavLink to="/sales/bookings" onClick={onClose} className={navLinkClass} aria-label="Go to Bookings">
                {({ isActive }) => (
                  <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
                    <ShieldAlert size={18} className={isActive ? 'text-accent' : iconClass} />
                    {!isCollapsed && <span>Bookings</span>}
                  </div>
                )}
              </NavLink>
            </>
          )}

          {isModuleVisible('bankingCrm') && (
            <NavLink to="/banking/loans" onClick={onClose} className={navLinkClass} aria-label="Go to Loans">
              {({ isActive }) => (
                <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
                  <Landmark size={18} className={isActive ? 'text-accent' : iconClass} />
                  {!isCollapsed && <span>Loans</span>}
                </div>
              )}
            </NavLink>
          )}

          {isModuleVisible('tasks') && (
            <NavLink to="/tasks" onClick={onClose} className={navLinkClass} aria-label="Go to Tasks">
              {({ isActive }) => (
                <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
                  <CheckSquare size={18} className={isActive ? 'text-accent' : iconClass} />
                  {!isCollapsed && <span>Tasks</span>}
                </div>
              )}
            </NavLink>
          )}

          {isModuleVisible('hr') && (
            <NavLink to="/hr/directory" onClick={onClose} className={navLinkClass} aria-label="Go to Employees">
              {({ isActive }) => (
                <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
                  <Users size={18} className={isActive ? 'text-accent' : iconClass} />
                  {!isCollapsed && <span>Employees</span>}
                </div>
              )}
            </NavLink>
          )}

          {isModuleVisible('automation') && (
            <NavLink to="/automation" onClick={onClose} className={navLinkClass} aria-label="Go to Automation">
              {({ isActive }) => (
                <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
                  <Zap size={18} className={isActive ? 'text-accent' : iconClass} />
                  {!isCollapsed && <span>Automation</span>}
                </div>
              )}
            </NavLink>
          )}

          <NavLink to="/settings" onClick={onClose} className={navLinkClass} aria-label="Go to Settings">
            {({ isActive }) => (
              <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
                <Settings2 size={18} className={isActive ? 'text-accent' : iconClass} />
                {!isCollapsed && <span>Settings</span>}
              </div>
            )}
          </NavLink>
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
