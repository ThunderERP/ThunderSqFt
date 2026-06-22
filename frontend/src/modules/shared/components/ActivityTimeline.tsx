import { PageTransition } from './MotionComponents'
import * as LucideIcons from 'lucide-react'

export interface TimelineEvent {
  icon?: string
  color?: string
  title: string
  time: string
  desc?: string
}

interface ActivityTimelineProps {
  events: TimelineEvent[]
}

export default function ActivityTimeline({ events }: ActivityTimelineProps) {
  return (
    <div className="neu-card p-6 bg-white animate-fade-in">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-6">Activity History</h3>
      {events.length === 0 ? (
        <p className="text-xs text-[var(--ink-soft)] italic font-semibold">No recent activity recorded.</p>
      ) : (
        <div className="relative border-l border-[var(--border-color)] pl-6 ml-3 space-y-6">
          {events.map((event, idx) => {
            // Dynamically resolve icon from lucide-react or fallback to Activity
            const IconComponent = (LucideIcons as any)[event.icon || 'Activity'] || LucideIcons.Activity
            const circleColor = event.color || 'var(--blueprint-accent)'
            
            return (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <div 
                  className="absolute -left-[37px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center bg-white border border-[var(--border-color)] transition-all group-hover:scale-110"
                  style={{ color: circleColor }}
                >
                  <IconComponent size={12} className="stroke-[2.5]" />
                </div>
                
                {/* Event Content */}
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-[var(--ink)]">{event.title}</h4>
                    <span className="text-[10px] font-bold text-[var(--ink-soft)] uppercase pulse-numeral tracking-wider">{event.time}</span>
                  </div>
                  {event.desc && (
                    <p className="text-xs text-[var(--ink-soft)] leading-relaxed">{event.desc}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
