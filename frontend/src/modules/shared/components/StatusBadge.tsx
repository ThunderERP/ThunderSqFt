export type StatusVariant = 'outline' | 'fill' | 'solid+icon' | 'stamp';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  domain?: 'lead' | 'loan' | 'task' | 'priority' | 'agreement' | 'visit' | 'leave' | 'attendance' | string;
  variant?: StatusVariant;
}

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const getStatusType = (status: string, domain?: string): StatusType => {
  const norm = status.toLowerCase().trim();
  
  if (domain === 'priority') {
    if (norm === 'high' || norm === 'urgent') return 'danger';
    if (norm === 'medium') return 'warning';
    return 'neutral'; // low
  }

  // Success states
  if ([
    'completed', 'approved', 'disbursed', 'signed', 'registered', 'present', 
    'active', 'paid', 'won', 'on-target', 'on target', 'success', 'yes', 'verified',
    'received'
  ].includes(norm)) {
    return 'success';
  }

  // Danger states
  if ([
    'lost', 'no show', 'no-show', 'absent', 'credit query', 'high', 'urgent', 
    'rejected', 'danger', 'overdue', 'behind', 'at-risk', 'at risk', 'failed'
  ].includes(norm)) {
    return 'danger';
  }

  // Warning states
  if ([
    'pending', 'watch', 'late', 'scheduled', 'pd pending', 'doc pending', 
    'login pending', 'follow-up', 'follow up', 'interested', 'future prospect', 
    'medium', 'warning', 'hold', 'on hold'
  ].includes(norm)) {
    return 'warning';
  }

  // Info states
  if ([
    'draft', 'new', 'negotiation', 'site visit fixed', 'site visit done', 
    'sanctioned', 'new lead', 'contacted', 'in progress', 'in-progress', 'info', 
    'fixed', 'done'
  ].includes(norm)) {
    return 'info';
  }

  return 'neutral';
}

export default function StatusBadge({ status, size = 'sm', domain }: StatusBadgeProps) {
  const type = getStatusType(status, domain);
  
  const styles = {
    success: { bg: 'bg-[var(--success-soft)]', border: 'border-[var(--success)]/20', text: 'text-[var(--success)]' },
    warning: { bg: 'bg-[var(--warning-soft)]', border: 'border-[var(--warning)]/20', text: 'text-[var(--warning)]' },
    danger: { bg: 'bg-[var(--danger-soft)]', border: 'border-[var(--danger)]/20', text: 'text-[var(--danger)]' },
    info: { bg: 'bg-[var(--accent-soft)]', border: 'border-[var(--accent)]/20', text: 'text-[var(--accent)]' },
    neutral: { bg: 'bg-white/5', border: 'border-white/10', text: 'text-[var(--ink-soft)]' },
  }[type];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[9px] rounded',
    md: 'px-2.5 py-0.5 text-[10px] rounded-md',
    lg: 'px-3 py-1 text-xs rounded-md'
  };
  
  return (
    <span 
      className={`inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider border ${sizeClasses[size]} ${styles.bg} ${styles.text} ${styles.border}`}
    >
      {status}
    </span>
  );
}
