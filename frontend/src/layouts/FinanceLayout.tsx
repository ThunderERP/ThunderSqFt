import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import ScrollProgress from '../modules/shared/components/ScrollProgress'
import { RoleSwitcher } from '../modules/auth/components/RoleSwitcher'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FinanceLayout() {
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
    <>
      <ScrollProgress />
      <Outlet />
      <RoleSwitcher />
    </>
  )
}
