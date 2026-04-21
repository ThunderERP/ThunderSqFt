import { ReactNode } from 'react'
import { useScrollReveal } from '../../../hooks/useScrollReveal'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

/**
 * Wrapper that fades-and-slides children in when they enter the viewport.
 */
export default function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal(0.1)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
