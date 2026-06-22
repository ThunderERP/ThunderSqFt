import { ReactNode, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

interface StatCardProps {
  label?: string
  title?: string
  value: string | number
  subtitle?: ReactNode
  icon?: ReactNode
  valueColor?: string
  delay?: number
  footer?: ReactNode
  trend?: string
  trendValue?: string | number
}

export default function StatCard({ label, title, value, subtitle, icon, valueColor, footer, trend, trendValue }: StatCardProps) {
  const displayLabel = title || label
  return (
    <motion.div
      className="crm-flat-card p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{displayLabel}</p>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-3">
        <p className={`text-3xl font-bold ${valueColor || ''}`} style={!valueColor ? { color: 'var(--text-primary)' } : {}}>
          {value}
        </p>
        {trend && trendValue && (
          <span className={`text-sm font-medium mb-1 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
          </span>
        )}
      </div>
      {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      {footer && <div className="mt-3 pt-3 border-t border-gray-50">{footer}</div>}
    </motion.div>
  )
}
