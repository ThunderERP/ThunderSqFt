import React, { useEffect, useRef, ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion'

// Page-level fade+slide transition respecting prefers-reduced-motion
export function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduce = useReducedMotion()
  return (
    <motion.div
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Staggered list container
export function StaggerList({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const shouldReduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: shouldReduce ? 0 : 0.06 } }
      }}
    >
      {children}
    </motion.div>
  )
}

// Alias for backwards compatibility
export const StaggerContainer = StaggerList;

// Individual stagger item respecting reduced motion
export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const shouldReduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={{
        hidden: shouldReduce ? { opacity: 0 } : { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
      }}
    >
      {children}
    </motion.div>
  )
}

// Animated counter number (using Framer Motion's useSpring)
export function CountUp({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const shouldReduce = useReducedMotion()
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { stiffness: 70, damping: 20 })

  useEffect(() => {
    if (shouldReduce) {
      if (ref.current) {
        ref.current.textContent = `${prefix}${value.toLocaleString('en-IN')}${suffix}`
      }
    } else {
      motionValue.set(value)
    }
  }, [value, motionValue, shouldReduce, prefix, suffix])

  useEffect(() => {
    if (shouldReduce) return
    return springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.floor(latest).toLocaleString('en-IN')}${suffix}`
      }
    })
  }, [springValue, shouldReduce, prefix, suffix])

  return <span ref={ref}>{prefix}{value.toLocaleString('en-IN')}{suffix}</span>
}

// Scroll-triggered reveal
export function ScrollRevealMotion({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const shouldReduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

// Hover card
export function HoverCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const shouldReduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      whileHover={shouldReduce ? {} : { y: -4, scale: 1.01 }}
      whileTap={shouldReduce ? {} : { scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  )
}

export { motion, AnimatePresence }
export { useReducedMotion }
