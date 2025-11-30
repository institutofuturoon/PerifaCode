import React from 'react';

export type BadgeVariant = 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info' 
  | 'new' 
  | 'premium' 
  | 'live'
  | 'completed'
  | 'pending'
  | 'default';

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  pulse?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  variant, 
  children, 
  className = '',
  icon,
  pulse = false
}) => {
  const variants: Record<BadgeVariant, string> = {
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    error: 'bg-error/10 text-error border-error/20',
    warning: 'bg-warning/10 text-warning border-warning/30',
    info: 'bg-info/10 text-info border-info/20',
    new: 'bg-brand-orange text-white border-brand-orange',
    premium: 'bg-gradient-to-r from-brand-gold to-brand-orange text-white border-transparent',
    live: 'bg-brand-orange/10 text-brand-orange border-brand-orange/30',
    completed: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
    default: 'bg-white/5 text-gray-400 border-white/10',
  };

  const pulseClass = pulse ? 'animate-pulse' : '';

  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 
        text-xs font-bold uppercase tracking-wider 
        rounded-md border
        ${variants[variant]} 
        ${pulseClass}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default StatusBadge;
