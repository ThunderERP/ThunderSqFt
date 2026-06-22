import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Info } from 'lucide-react';

export type StatusVariant = 'outline' | 'fill' | 'solid+icon' | 'stamp';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  domain?: 'lead' | 'loan' | 'task' | 'priority' | 'agreement' | 'visit' | 'leave' | 'attendance';
  variant?: StatusVariant;
}

type BadgeColorTheme = {
  main: string;
  light: string;
  dark: string;
  icon: React.ElementType;
};

const statusThemeMap: Record<string, BadgeColorTheme> = {
  // Success
  completed: { main: '#10B981', light: 'rgba(16, 185, 129, 0.1)', dark: '#065F46', icon: CheckCircle2 },
  approved: { main: '#10B981', light: 'rgba(16, 185, 129, 0.1)', dark: '#065F46', icon: CheckCircle2 },
  disbursed: { main: '#10B981', light: 'rgba(16, 185, 129, 0.1)', dark: '#065F46', icon: CheckCircle2 },
  signed: { main: '#10B981', light: 'rgba(16, 185, 129, 0.1)', dark: '#065F46', icon: CheckCircle2 },
  registered: { main: '#10B981', light: 'rgba(16, 185, 129, 0.1)', dark: '#065F46', icon: CheckCircle2 },
  present: { main: '#10B981', light: 'rgba(16, 185, 129, 0.1)', dark: '#065F46', icon: CheckCircle2 },
  active: { main: '#10B981', light: 'rgba(16, 185, 129, 0.1)', dark: '#065F46', icon: CheckCircle2 },

  // Warning
  pending: { main: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)', dark: '#92400E', icon: Clock },
  late: { main: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)', dark: '#92400E', icon: Clock },
  scheduled: { main: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)', dark: '#92400E', icon: Clock },
  'pd pending': { main: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)', dark: '#92400E', icon: Clock },
  'doc pending': { main: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)', dark: '#92400E', icon: Clock },
  'login pending': { main: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)', dark: '#92400E', icon: Clock },
  'follow-up': { main: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)', dark: '#92400E', icon: Clock },
  interested: { main: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)', dark: '#92400E', icon: Clock },
  'future prospect': { main: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)', dark: '#92400E', icon: Clock },

  // Error
  lost: { main: '#EF4444', light: 'rgba(239, 68, 68, 0.1)', dark: '#991B1B', icon: AlertCircle },
  'no show': { main: '#EF4444', light: 'rgba(239, 68, 68, 0.1)', dark: '#991B1B', icon: AlertCircle },
  absent: { main: '#EF4444', light: 'rgba(239, 68, 68, 0.1)', dark: '#991B1B', icon: AlertCircle },
  'credit query': { main: '#EF4444', light: 'rgba(239, 68, 68, 0.1)', dark: '#991B1B', icon: AlertCircle },
  high: { main: '#EF4444', light: 'rgba(239, 68, 68, 0.1)', dark: '#991B1B', icon: AlertCircle },
  urgent: { main: '#EF4444', light: 'rgba(239, 68, 68, 0.1)', dark: '#991B1B', icon: AlertCircle },
  rejected: { main: '#EF4444', light: 'rgba(239, 68, 68, 0.1)', dark: '#991B1B', icon: AlertCircle },

  // Info
  negotiation: { main: 'var(--blueprint-accent)', light: 'rgba(0, 85, 255, 0.1)', dark: 'var(--ink)', icon: Info },
  'site visit fixed': { main: 'var(--blueprint-accent)', light: 'rgba(0, 85, 255, 0.1)', dark: 'var(--ink)', icon: Info },
  'site visit done': { main: 'var(--blueprint-accent)', light: 'rgba(0, 85, 255, 0.1)', dark: 'var(--ink)', icon: Info },
  sanctioned: { main: 'var(--blueprint-accent)', light: 'rgba(0, 85, 255, 0.1)', dark: 'var(--ink)', icon: Info },
  medium: { main: 'var(--blueprint-accent)', light: 'rgba(0, 85, 255, 0.1)', dark: 'var(--ink)', icon: Info },
  'new lead': { main: 'var(--blueprint-accent)', light: 'rgba(0, 85, 255, 0.1)', dark: 'var(--ink)', icon: Info },
  new: { main: 'var(--blueprint-accent)', light: 'rgba(0, 85, 255, 0.1)', dark: 'var(--ink)', icon: Info },
  contacted: { main: 'var(--blueprint-accent)', light: 'rgba(0, 85, 255, 0.1)', dark: 'var(--ink)', icon: Info },
  'in progress': { main: 'var(--blueprint-accent)', light: 'rgba(0, 85, 255, 0.1)', dark: 'var(--ink)', icon: Info },
  low: { main: 'var(--blueprint-accent)', light: 'rgba(0, 85, 255, 0.1)', dark: 'var(--ink)', icon: Info },
};

export default function StatusBadge({ status, size = 'sm', domain, variant = 'outline' }: StatusBadgeProps) {
  const norm = status.toLowerCase();
  
  let key = norm;
  if (domain === 'priority') {
    if (norm === 'high' || norm === 'urgent') key = 'high';
    else if (norm === 'medium') key = 'medium';
    else key = 'low';
  }

  const theme = statusThemeMap[key] || { main: 'var(--ink-soft)', light: 'rgba(0, 0, 0, 0.05)', dark: 'var(--ink)', icon: Info };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-[11px]',
    lg: 'px-3 py-1.5 text-xs'
  };
  
  const baseClass = `inline-flex items-center font-bold uppercase tracking-wider ${sizeClasses[size]}`;

  if (variant === 'stamp') {
    // Terminal state indicator mimicking a rubber stamp
    const rotate = (status.length % 2 === 0) ? '-rotate-2' : 'rotate-2';
    return (
      <span 
        className={`inline-block border-2 ${rotate} opacity-90 px-3 py-1 text-xs font-black uppercase tracking-widest`}
        style={{ color: theme.main, borderColor: theme.main, backgroundColor: 'transparent' }}
      >
        {status}
      </span>
    );
  }

  if (variant === 'solid+icon') {
    const Icon = theme.icon;
    return (
      <span 
        className={`${baseClass} gap-1 rounded-none`}
        style={{ backgroundColor: theme.main, color: 'white' }}
      >
        <Icon size={12} strokeWidth={3} />
        {status}
      </span>
    );
  }

  if (variant === 'fill') {
    return (
      <span 
        className={`${baseClass} rounded-none border`}
        style={{ backgroundColor: theme.light, color: theme.dark, borderColor: theme.light }}
      >
        {status}
      </span>
    );
  }

  // default: outline
  return (
    <span 
      className={`${baseClass} rounded-none border`}
      style={{ backgroundColor: 'transparent', color: theme.main, borderColor: theme.main }}
    >
      {status}
    </span>
  );
}
