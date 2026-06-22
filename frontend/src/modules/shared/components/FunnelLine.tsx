import { motion } from 'framer-motion'
import { 
  UserPlus, PhoneCall, Heart, MapPin, 
  Handshake, ShieldCheck, ArrowRight, TrendingUp 
} from 'lucide-react'

export interface FunnelStage {
  key: string
  label: string
  count: number
  isMostActive?: boolean
}

export interface FunnelLineProps {
  stages: FunnelStage[]
  onStageClick?: (key: string) => void
  scale?: 'compact' | 'full'
  activeStage?: string
}

// Stage configuration for custom themed visuals
const stageConfig: Record<string, {
  gradient: string
  border: string
  glowColor: string
  icon: any
  iconColor: string
  badgeColor: string
}> = {
  'New': {
    gradient: 'from-blue-600/10 via-blue-500/5 to-transparent',
    border: 'border-blue-500/30 hover:border-blue-400',
    glowColor: 'rgba(59,130,246,0.3)',
    icon: UserPlus,
    iconColor: 'text-blue-400',
    badgeColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
  },
  'Contacted': {
    gradient: 'from-teal-600/10 via-teal-500/5 to-transparent',
    border: 'border-teal-500/30 hover:border-teal-400',
    glowColor: 'rgba(20,184,166,0.3)',
    icon: PhoneCall,
    iconColor: 'text-teal-400',
    badgeColor: 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
  },
  'Interested': {
    gradient: 'from-purple-600/10 via-purple-500/5 to-transparent',
    border: 'border-purple-500/30 hover:border-purple-400',
    glowColor: 'rgba(168,85,247,0.3)',
    icon: Heart,
    iconColor: 'text-purple-400',
    badgeColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
  },
  'Site Visit': {
    gradient: 'from-amber-600/10 via-amber-500/5 to-transparent',
    border: 'border-amber-500/30 hover:border-amber-400',
    glowColor: 'rgba(245,158,11,0.3)',
    icon: MapPin,
    iconColor: 'text-amber-400',
    badgeColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
  },
  'Negotiation': {
    gradient: 'from-pink-600/10 via-pink-500/5 to-transparent',
    border: 'border-pink-500/30 hover:border-pink-400',
    glowColor: 'rgba(236,72,153,0.3)',
    icon: Handshake,
    iconColor: 'text-pink-400',
    badgeColor: 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
  },
  'Booking': {
    gradient: 'from-emerald-600/10 via-emerald-500/5 to-transparent',
    border: 'border-emerald-500/30 hover:border-emerald-400',
    glowColor: 'rgba(16,185,129,0.3)',
    icon: ShieldCheck,
    iconColor: 'text-emerald-400',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
  }
}

export default function FunnelLine({ stages, onStageClick, scale = 'full', activeStage }: FunnelLineProps) {
  const totalLeads = stages.reduce((acc, s) => acc + s.count, 0)
  const isCompact = scale === 'compact'

  return (
    <div className="w-full select-none my-2">
      {/* Horizontal Flow Funnel Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-stretch relative">
        {stages.map((stage, idx) => {
          const config = stageConfig[stage.key] || stageConfig['New']
          const Icon = config.icon
          const isActive = activeStage === stage.key
          
          // Conversion rate relative to total entry funnel
          const ratePercent = totalLeads > 0 ? Math.round((stage.count / totalLeads) * 100) : 0

          return (
            <div key={stage.key} className="flex items-center relative group">
              
              {/* Funnel Stage Card */}
              <motion.div
                onClick={() => onStageClick?.(stage.key)}
                className={`flex-1 flex flex-col justify-between p-5 rounded-2xl cursor-pointer bg-bg-card/40 border backdrop-blur-md transition-all duration-300 ${
                  isActive 
                    ? `border-accent shadow-[0_0_20px_rgba(76,142,255,0.25)] scale-[1.02]` 
                    : `${config.border} hover:scale-[1.01] hover:bg-bg-card/75`
                }`}
                style={{
                  boxShadow: isActive ? `0 0 25px ${config.glowColor}` : undefined
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.05,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                {/* Header Row: Label & Animated Icon */}
                <div className="flex justify-between items-start gap-2 mb-4">
                  <span className="text-[10px] uppercase font-bold text-ink-muted tracking-widest leading-none">
                    {stage.label}
                  </span>
                  <motion.div 
                    className={`${config.iconColor} p-1 rounded-lg bg-bg-surface`}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <Icon size={16} />
                  </motion.div>
                </div>

                {/* Counter Value */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-ink tracking-tight">
                    {stage.count}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${config.badgeColor}`}>
                    {ratePercent}%
                  </span>
                </div>

                {/* Subtitle/Conversion Info */}
                <div className="mt-2.5 pt-2 border-t border-border-color flex items-center justify-between text-[9px] font-bold text-ink-muted uppercase tracking-wider">
                  <span>Conversion</span>
                  <span className="text-ink-soft">{ratePercent}% of total</span>
                </div>

                {/* Glow Background Sheet */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none`} />
              </motion.div>

              {/* Connecting Flow Arrow (hidden on final card and on small screens) */}
              {idx < stages.length - 1 && (
                <div className="hidden lg:flex items-center justify-center w-6 shrink-0 -mx-1 z-10">
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeInOut",
                      delay: idx * 0.2
                    }}
                  >
                    <ArrowRight size={14} className="text-ink-muted/50 group-hover:text-accent transition-colors" />
                  </motion.div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
