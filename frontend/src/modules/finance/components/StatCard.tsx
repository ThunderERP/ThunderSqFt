import { ReactNode, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

interface StatCardProps {
  label: string
  value: string
  subtitle?: string
  icon?: ReactNode
  valueColor?: string
  delay?: number
}

export default function StatCard({ label, value, subtitle, icon, valueColor }: StatCardProps) {
  return (
    <motion.div
      className="neu-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
        {icon && (
          <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <p className={`text-3xl font-bold ${valueColor || ''}`} style={!valueColor ? { color: 'var(--text-primary)' } : {}}>
        {value}
      </p>
      {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
    </motion.div>
  )
}
