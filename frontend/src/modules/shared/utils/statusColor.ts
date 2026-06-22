export type PulseHealth = 'good' | 'waiting' | 'stuck'

export interface PulseColor {
  color: string
  bg: string
}

export function getPulseColor(health: PulseHealth): PulseColor {
  if (health === 'good') return { color: 'var(--status-good)', bg: 'var(--status-good-bg)' }
  if (health === 'waiting') return { color: 'var(--status-wait)', bg: 'var(--status-wait-bg)' }
  return { color: 'var(--status-stuck)', bg: 'var(--status-stuck-bg)' }
}

export type TrendStatus = 'High' | 'Steady' | 'Lagging'
export function getTrendHealth(trend: TrendStatus): PulseHealth {
  if (trend === 'High') return 'good'
  if (trend === 'Steady') return 'waiting'
  return 'stuck'
}
