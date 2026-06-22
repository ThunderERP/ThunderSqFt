import { motion } from 'framer-motion'

export interface PulseStage {
  key: string
  label: string
  count: number
  isMostActive?: boolean   // true for whichever stage had the most movement "today"
}

export interface PulseBarProps {
  stages: PulseStage[]        // ordered: e.g. New Leads -> Site Visits -> Negotiation -> Bookings
  onStageClick?: (key: string) => void
  variant?: 'light' | 'dark'   // 'dark' used only on the CEO Dashboard hero
}

export default function PulseBar({ stages, onStageClick, variant = 'light' }: PulseBarProps) {
  const total = stages.reduce((acc, s) => acc + s.count, 0)

  // Calculate percentages. If total is 0, distribute evenly.
  const percentages = stages.map(stage => {
    if (total === 0) return 100 / stages.length
    return (stage.count / total) * 100
  })

  // Theme styling based on variant
  const isDark = variant === 'dark'
  const containerBg = isDark ? 'var(--pulse-ink-card)' : 'var(--bg-card)'
  const containerBorder = isDark ? 'var(--pulse-ink-border)' : 'var(--border-color)'
  const dividerBg = isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--border-color)'
  
  // Custom transition curve [0.22, 1, 0.36, 1]
  const transitionCurve = [0.22, 1, 0.36, 1] as const

  return (
    <div 
      className={`w-full overflow-hidden rounded-2xl border p-1 md:p-1.5 shadow-sm transition-all duration-300 ${
        isDark ? 'shadow-black/20' : 'shadow-slate-100/50'
      }`}
      style={{ 
        backgroundColor: containerBg, 
        borderColor: containerBorder 
      }}
    >
      <div className="flex h-16 w-full items-stretch rounded-xl overflow-hidden relative">
        {stages.map((stage, idx) => {
          const widthPercent = `${percentages[idx]}%`
          const isMostActive = !!stage.isMostActive
          
          // Determine background and text colors
          let segmentBg = 'transparent'
          if (isMostActive) {
            segmentBg = isDark ? 'rgba(5, 150, 105, 0.25)' : 'var(--pulse-green-bg)'
          } else {
            segmentBg = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(248, 250, 252, 0.4)'
          }

          return (
            <motion.div
              key={stage.key}
              onClick={() => onStageClick?.(stage.key)}
              className={`relative flex flex-col justify-center px-4 py-2 cursor-pointer transition-colors hover:bg-slate-500/5 ${
                isMostActive ? 'pulse-live' : ''
              }`}
              style={{
                backgroundColor: segmentBg,
                width: widthPercent,
                borderRight: idx < stages.length - 1 ? `1px solid ${dividerBg}` : 'none',
              }}
              initial={{ width: '0%', opacity: 0 }}
              animate={{ 
                width: widthPercent, 
                opacity: 1 
              }}
              transition={{
                delay: idx * 0.08, // Staggered ~80ms delay
                duration: 0.8, // ~800ms duration
                ease: transitionCurve
              }}
            >
              {/* Pulse Indicator Glow for active segment */}
              {isMostActive && (
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1" 
                  style={{ backgroundColor: 'var(--pulse-green)' }}
                />
              )}

              <div className="flex flex-col min-w-0">
                <span 
                  className={`text-[10px] font-bold uppercase tracking-wider truncate mb-0.5 ${
                    isMostActive 
                      ? 'text-emerald-500' 
                      : isDark 
                      ? 'text-slate-400' 
                      : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </span>
                <span 
                  className={`text-lg font-bold leading-none pulse-numeral ${
                    isMostActive
                      ? 'text-emerald-600'
                      : isDark
                      ? 'text-white font-extrabold'
                      : 'text-slate-900 font-extrabold'
                  }`}
                >
                  {stage.count}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
