import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../modules/finance/components/Sidebar'
import TopBar from '../modules/finance/components/TopBar'
import ScrollProgress from '../modules/finance/components/ScrollProgress'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FinanceLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // Expose gsap to window for easy debugging if needed
    ; (window as any).gsap = gsap
      ; (window as any).ScrollTrigger = ScrollTrigger

    // Set GSAP global scroller default to our main content area
    ScrollTrigger.defaults({
      scroller: "#main-content"
    })

    // Refresh ScrollTrigger when content changes (optional but helpful)
    ScrollTrigger.refresh()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/30 text-gray-900 relative">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
        <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <ScrollProgress />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
