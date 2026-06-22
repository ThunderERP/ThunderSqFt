import React from 'react'

export interface LedgerRow {
  label: string
  value: string | number
  sublabel?: string
}

interface LedgerCardProps {
  title: string
  rows: LedgerRow[]
}

export default function LedgerCard({ title, rows }: LedgerCardProps) {
  return (
    <div className="neu-card p-6 flex flex-col">
      <h3 className="text-sm font-bold uppercase text-[#6B6862] tracking-wider mb-4">{title}</h3>
      <div className="hairline-divide flex flex-col">
        {rows.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between py-3">
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-[#1C1B19] truncate">{row.label}</span>
              {row.sublabel && (
                <span className="text-xs text-[#6B6862] truncate mt-0.5">{row.sublabel}</span>
              )}
            </div>
            <span className="pulse-numeral text-sm font-bold text-[#1C1B19] ml-4 shrink-0">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
