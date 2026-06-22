import { Clock, CheckCircle, XCircle } from 'lucide-react'

interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

const statusStyles: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  approved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  pending: 'bg-amber-50 text-amber-600 border-amber-200',
  scheduled: 'bg-amber-50 text-amber-600 border-amber-200',
  overdue: 'bg-red-50 text-red-600 border-red-200',
  rejected: 'bg-red-50 text-red-600 border-red-200',
  'no show': 'bg-red-50 text-red-600 border-red-200',
  cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
  draft: 'bg-gray-50 text-gray-500 border-gray-200',
  inactive: 'bg-gray-50 text-gray-500 border-gray-200',
  high: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  medium: 'bg-amber-50 text-amber-600 border-amber-200',
  low: 'bg-red-50 text-red-600 border-red-200',
  'follow-up': 'bg-amber-50 text-amber-600 border-amber-200',
  'site visit': 'bg-purple-50 text-purple-600 border-purple-200',
  negotiation: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  booked: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  lost: 'bg-red-50 text-red-600 border-red-200',
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase()

  // Standardize Scheduled / Completed / No Show with custom weights and icons
  if (['scheduled', 'completed', 'no show'].includes(normalizedStatus)) {
    let styleObj = {}
    let Icon = Clock

    if (normalizedStatus === 'scheduled') {
      styleObj = {
        background: '#FFFBEB',       // amber-50
        color: '#D97706',            // amber-600
        border: '1px solid #FDE68A', // amber-200
        fontWeight: 600,
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
      }
      Icon = Clock
    } else if (normalizedStatus === 'completed') {
      styleObj = {
        background: '#ECFDF5',       // emerald-50
        color: '#059669',            // emerald-600
        border: '1px solid #A7F3D0', // emerald-200
        fontWeight: 600,
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
      }
      Icon = CheckCircle
    } else if (normalizedStatus === 'no show') {
      styleObj = {
        background: '#FEF2F2',       // red-50
        color: '#DC2626',            // red-600
        border: '1px solid #FECACA', // red-200
        fontWeight: 600,
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
      }
      Icon = XCircle
    }

    return (
      <span
        style={styleObj}
        className="inline-flex items-center gap-1 leading-none border select-none shrink-0"
      >
        <Icon size={12} className="shrink-0" />
        {status}
      </span>
    )
  }

  const style = statusStyles[normalizedStatus] || 'bg-blue-50 text-blue-600 border-blue-200'
  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${style} ${sizeClass}`}>
      {status}
    </span>
  )
}
