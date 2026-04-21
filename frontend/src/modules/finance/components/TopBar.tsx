import { useState, useRef, useEffect } from 'react'
import { Search, Bell, ChevronDown, User, Settings, LogOut, FileText, DollarSign, PieChart, X, Menu } from 'lucide-react'

const mockNotifications = [
  { id: 1, text: 'New invoice generated for Acme Corp', time: '10 mins ago', unread: true },
  { id: 2, text: 'Salary processed for March 2024', time: '2 hours ago', unread: true },
  { id: 3, text: 'Payment received from Tech Solutions', time: '1 day ago', unread: false },
]

const searchResults = [
  { id: 1, type: 'Invoice', label: 'INV-2024-001 Acme Corp', icon: FileText },
  { id: 2, type: 'Transaction', label: 'Payment from Tech Solutions', icon: DollarSign },
  { id: 3, type: 'Report', label: 'Q1 Financial Summary', icon: PieChart },
]

export default function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  const [notifications, setNotifications] = useState(mockNotifications)

  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredResults = searchResults.filter(r => 
    r.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="h-[60px] md:h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-30 sticky top-0">
      <div className="flex items-center gap-3 w-8/12 md:w-auto">
        <button 
           className="md:hidden p-2 -ml-2 text-gray-600 rounded-xl hover:bg-gray-50"
           onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 md:flex-none" ref={searchRef}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full md:w-[400px] h-10 pl-11 pr-10 bg-gray-50/80 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium placeholder:text-gray-400 text-gray-700"
          />
        {searchQuery && (
          <button 
            onClick={() => { setSearchQuery(''); setIsSearchFocused(true); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={14} />
          </button>
        )}

        {/* Search Dropdown */}
        {isSearchFocused && searchQuery.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-[400px] bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-fade-in">
            {filteredResults.length > 0 ? (
              filteredResults.map(result => (
                <div key={result.id} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                    <result.icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{result.label}</p>
                    <p className="text-xs text-gray-500">{result.type}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className={`relative p-2 rounded-full transition-colors ${isNotifOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Notif Dropdown */}
          {isNotifOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                <button 
                  onClick={() => setNotifications(notifications.map(n => ({...n, unread: false})))}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                  disabled={unreadCount === 0}
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex gap-3 ${notif.unread ? 'bg-blue-50/30' : ''}`}>
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${notif.unread ? 'bg-blue-600' : 'bg-transparent'}`} />
                    <div>
                      <p className={`text-sm ${notif.unread ? 'font-medium text-gray-800' : 'text-gray-600'}`}>{notif.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-[1px] h-8 bg-gray-200"></div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className={`flex items-center gap-2 md:gap-3 cursor-pointer group rounded-xl p-1.5 -mr-1.5 transition-colors ${isProfileOpen ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
          >
            <div className="w-[34px] h-[34px] md:w-[38px] md:h-[38px] rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm shadow-sm tracking-wide">
              G
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-semibold text-gray-800 leading-tight">Guest User</span>
              <span className="text-[13px] text-gray-500 mt-0.5">Guest Login</span>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180 text-blue-600' : 'group-hover:text-blue-600'}`} />
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-50 mb-1">
                <p className="text-sm font-semibold text-gray-800">Guest User</p>
                <p className="text-xs text-gray-500 truncate">guest@thundererp.com</p>
              </div>
              
              <div className="px-2">
                <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <User size={16} /> My Profile
                </button>
                <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings size={16} /> Settings
                </button>
                <div className="h-[1px] bg-gray-100 my-1"></div>
                <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <LogOut size={16} /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
