import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface StatCardProps {
  label?: string
  title?: string
  value: ReactNode
  subtitle?: ReactNode
  valueColor?: string
  pulseNumeral?: boolean
  onClick?: () => void
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral' | string
  trendValue?: string | number
  footer?: ReactNode
  delay?: number
}

export default function StatCard({
  label,
  title,
  value,
  subtitle,
  valueColor,
  pulseNumeral = true,
  onClick,
  icon,
  trend,
  trendValue,
  footer,
  delay = 0,
}: StatCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const displayLabel = label || title

  return (
    <div
      onClick={onClick}
      className={`h-full bg-[var(--bg-card)] border border-[var(--border-color)] p-5 flex flex-col justify-between rounded-lg shadow-card relative overflow-hidden group transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[var(--border-hover)] hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0' : 'hover:border-[var(--border-hover)] hover:-translate-y-0.5 hover:shadow-hover'
      }`}
    >
      {/* Signature Element — "Current" Accent Line on Top */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[var(--accent)] to-[var(--gold)]"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.8, ease: 'easeOut', delay: delay * 0.1 }
        }
      />

      <div className="flex-1 flex flex-col justify-between">
        {/* Top Header Row */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <span className="text-[11px] uppercase font-bold text-[var(--ink-soft)] tracking-wider font-sans">
            {displayLabel}
          </span>
          {icon && (
            <div className="w-8 h-8 rounded-md bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent)] shrink-0 transition-colors group-hover:border-[var(--border-hover)]">
              {icon}
            </div>
          )}
        </div>

        {/* Value and Trend row */}
        <div className="flex items-baseline justify-between gap-1.5 flex-nowrap w-full">
          <span className={`text-2xl sm:text-3xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold font-mono tracking-tight truncate ${valueColor || 'text-[var(--ink)]'}`}>
            {value}
          </span>
          {trend && trendValue && (
            <span
              className={`text-xs font-bold font-sans flex items-center gap-0.5 shrink-0 ${
                trend === 'up'
                  ? 'text-[var(--success)]'
                  : trend === 'down'
                  ? 'text-[var(--danger)]'
                  : 'text-[var(--ink-soft)]'
              }`}
            >
              <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}</span>
              <span>{trendValue}</span>
            </span>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[11px] font-sans text-[var(--ink-soft)] mt-1.5 leading-normal">
            {subtitle}
          </p>
        )}

        {/* Footer */}
        {footer && (
          <div className="mt-4 pt-3 border-t border-[var(--border-color)] text-[11px] font-sans text-[var(--ink-muted)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
