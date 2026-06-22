export const LEAD_STAGES = [
  'New Lead', 'Contacted', 'Follow-up', 'Interested',
  'Site Visit Fixed', 'Site Visit Done', 'Negotiation', 'Booking'
] as const

export const LEAD_TERMINAL_STATES = ['Lost', 'Future Prospect'] as const

export const LEAD_SOURCES = ['Facebook', 'Google', 'WhatsApp', 'Reference', 'Walk-in', 'Portal'] as const

export const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  'Facebook':  { bg: '#EFF6FF', text: '#1877F2' },
  'Google':    { bg: '#FEF2F2', text: '#EA4335' },
  'WhatsApp':  { bg: '#ECFDF5', text: '#25D366' },
  'Reference': { bg: '#FFFBEB', text: '#D97706' },
  'Walk-in':   { bg: '#F5F3FF', text: '#7C3AED' },
  'Portal':    { bg: '#EEF2FF', text: '#4F46E5' },
}

export function getStageColor(stage: string) {
  if (stage === 'Lost') return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' }
  if (stage === 'Future Prospect') return { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' }
  if (stage === 'Booking') return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' }
  if (['Negotiation', 'Site Visit Done', 'Site Visit Fixed'].includes(stage)) return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' }
  return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' }
}
