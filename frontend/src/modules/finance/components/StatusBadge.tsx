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
  overdue: 'bg-red-50 text-red-600 border-red-200',
  rejected: 'bg-red-50 text-red-600 border-red-200',
  cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
  draft: 'bg-gray-50 text-gray-500 border-gray-200',
  inactive: 'bg-gray-50 text-gray-500 border-gray-200',
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase()
  const style = statusStyles[normalizedStatus] || 'bg-blue-50 text-blue-600 border-blue-200'
  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${style} ${sizeClass}`}>
      {status}
    </span>
  )
}
