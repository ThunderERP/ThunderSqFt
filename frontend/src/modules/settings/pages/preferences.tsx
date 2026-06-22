import { useState } from 'react'
import { PageTransition } from '../../shared/components/MotionComponents'
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
      <div className="p-6 max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <User size={18} className="text-gray-400" /> Profile
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">Your account information</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-2xl">
                {initials}
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 leading-tight">{currentUser.name}</h4>
                <p className="text-sm text-blue-600">{email}</p>
                <span className="inline-block mt-2 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-semibold">
                  {getRoleLabel(currentUser.role)}
                </span>
              </div>
            </div>

            <hr className="border-gray-100 my-6" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-sm font-semibold text-gray-900">{getRoleLabel(currentUser.role)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-sm font-semibold text-gray-900">{email}</p>
              </div>
            </div>
          </div>

          {/* Appearance Card */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sun size={18} className="text-gray-400" /> Appearance
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">Customize how PropFlow CRM looks</p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Theme</p>
                <p className="text-sm text-gray-500">Currently using {theme} mode</p>
              </div>
              <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-200">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${theme === 'light' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Sun size={16} /> Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Moon size={16} /> Dark
                </button>
              </div>
            </div>
          </div>

          {/* Permissions Card */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Shield size={18} className="text-gray-400" /> Permissions
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">What you can access based on your role</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-700 min-w-[80px] text-center">
                  Full Access
                </span>
                <span className="text-sm text-gray-600">All modules, all branches, CEO dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 min-w-[80px] text-center">
                  Reports
                </span>
                <span className="text-sm text-gray-600">Branch comparison, analytics, trends</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 text-purple-700 min-w-[80px] text-center">
                  HR
                </span>
                <span className="text-sm text-gray-600">Employee management and leaderboard</span>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Bell size={18} className="text-gray-400" /> Notifications
            </h3>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Missed follow-up alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications.missedFollowUps} onChange={() => handleToggle('missedFollowUps')} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">New lead assignments</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications.newLeads} onChange={() => handleToggle('newLeads')} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Booking confirmations</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications.bookingConfirmations} onChange={() => handleToggle('bookingConfirmations')} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Loan status updates</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications.loanStatusUpdates} onChange={() => handleToggle('loanStatusUpdates')} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  )
}
