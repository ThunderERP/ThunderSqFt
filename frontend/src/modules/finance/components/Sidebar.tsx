import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, TrendingUp, PieChart,
  FileText, Receipt, Wallet, BarChart3, ChevronDown, ChevronRight
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/salary', label: 'Salary', icon: Users },
  { to: '/cashflow', label: 'Cashflow', icon: TrendingUp },
  { to: '/financial-reports', label: 'Financial Reports', icon: PieChart },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  {
    label: 'Accounts',
    icon: Wallet,
    children: [
      { to: '/accounts', label: 'Accounts Overview' },
      { to: '/receivables', label: 'Account Receivables' },
      { to: '/payables', label: 'Account Payables' },
    ]
  },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
]

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const location = useLocation()

  useEffect(() => {
    navItems.forEach(item => {
      if (item.children && item.children.some(child => location.pathname.startsWith(child.to))) {
        setExpanded(prev => ({ ...prev, [item.label]: true }))
      }
    })
  }, [location.pathname])

  const toggleExpand = (label: string) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed md:relative top-0 left-0 bottom-0 z-50 w-[260px] min-w-[260px] h-screen flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: '#FFFFFF', borderRight: `1px solid var(--border-color)` }}
      >
      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="px-6 py-6"
        style={{ borderBottom: `1px solid var(--border-color)` }}
      >
        <h1 className="text-2xl font-bold" style={{ color: '#2563EB' }}>Finance ERP</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Management System</p>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item, i) => {
            const isGroupActive = item.children?.some(child => location.pathname.startsWith(child.to))
            
            return (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.3, ease: 'easeOut' }}
              >
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleExpand(item.label)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        isGroupActive ? 'text-blue-700 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} className={`transition-colors ${isGroupActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}`} />
                        <span>{item.label}</span>
                      </div>
                      {expanded[item.label] ? <ChevronDown size={16} className={isGroupActive ? 'text-blue-500' : 'text-gray-400'} /> : <ChevronRight size={16} className={isGroupActive ? 'text-blue-500' : 'text-gray-400'} />}
                    </button>
                    
                    <AnimatePresence>
                      {expanded[item.label] && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-11 pr-2 overflow-hidden"
                        >
                          {item.children.map(child => (
                             <li key={child.to} className="mt-1">
                               <NavLink
                                  to={child.to}
                                  className={({ isActive }) =>
                                    `block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                      isActive
                                        ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`
                                  }
                                >
                                  {child.label}
                                </NavLink>
                             </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavLink
                    to={item.to!}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? 'text-blue-600 bg-blue-50 font-semibold shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          size={20}
                          className={`transition-colors ${
                            isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                          }`}
                        />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                )}
              </motion.li>
            )
          })}
        </ul>
      </nav>

      {/* Footer info */}
      <div className="px-6 py-4" style={{ borderTop: `1px solid var(--border-color)` }}>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© 2024 ThunderERP</p>
      </div>
    </aside>
    </>
  )
}
