import { ReactNode } from 'react'

interface PageHeaderProps {
  title: ReactNode
  subtitle?: string
  actions?: ReactNode
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-[var(--ink)]">{title}</h1>
        {subtitle && <p className="text-[var(--ink-soft)] mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
