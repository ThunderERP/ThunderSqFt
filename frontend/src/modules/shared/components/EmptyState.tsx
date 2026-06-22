import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="neu-card p-12 text-center flex flex-col items-center justify-center bg-white border border-[var(--border-color)]">
      <div className="mb-4 text-[var(--accent)] float-bounce">
        <Icon size={48} className="stroke-[1.5]" />
      </div>
      <h3 className="text-base font-bold text-[var(--ink)] mb-2">{title}</h3>
      <p className="text-xs text-[var(--ink-soft)] max-w-sm mb-6 leading-relaxed">{description}</p>
      {action && (
        <div className="badge-pop">
          {action}
        </div>
      )}
    </div>
  )
}
