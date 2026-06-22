import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: ReactNode
  subtitle?: string
  valueColor?: string
  pulseNumeral?: boolean
  onClick?: () => void
}

export default function StatCard({ label, value, subtitle, valueColor, pulseNumeral = true, onClick }: StatCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-paper border border-ink p-5 flex flex-col justify-between rounded-none shadow-none relative overflow-hidden group transition-all ${
        onClick ? 'cursor-pointer hover:border-blueprint-accent hover:scale-[1.01] active:scale-[0.99]' : 'hover:border-blueprint-accent'
      }`}
    >
      <div className="absolute inset-0 bg-blueprint-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <span className="text-[11px] uppercase font-bold text-ink-soft tracking-widest mb-3 pb-2 border-b border-ink/20">
        {label}
      </span>
      
      <div className="flex flex-col gap-1 mt-1">
        <span className={`text-3xl tracking-tight mono-text ${valueColor || 'text-ink font-bold'}`}>
          {value}
        </span>
        {subtitle && (
          <span className="text-[10px] uppercase font-bold text-ink-soft tracking-wider mt-1">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
