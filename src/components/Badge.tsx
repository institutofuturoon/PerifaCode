
import React from 'react';

interface BadgeProps {
  text: string;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'info' | 'new' | 'live' | 'premium';
}

const Badge: React.FC<BadgeProps> = ({ text, className = '', variant = 'default' }) => {
  const styles = {
    default: {
      bg: 'bg-[#8a4add]/10',
      border: 'border-[#8a4add]/20',
      text: 'text-[#c4b5fd]',
      dot: 'bg-[#8a4add]'
    },
    success: {
      bg: 'bg-success/10',
      border: 'border-success/20',
      text: 'text-success',
      dot: 'bg-success'
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      text: 'text-warning',
      dot: 'bg-warning'
    },
    danger: {
      bg: 'bg-error/10',
      border: 'border-error/20',
      text: 'text-error',
      dot: 'bg-error'
    },
    info: {
      bg: 'bg-info/10',
      border: 'border-info/20',
      text: 'text-info',
      dot: 'bg-info'
    },
    new: {
      bg: 'bg-brand-orange',
      border: 'border-brand-orange',
      text: 'text-white',
      dot: 'bg-white'
    },
    live: {
      bg: 'bg-brand-orange/10',
      border: 'border-brand-orange/30',
      text: 'text-brand-orange',
      dot: 'bg-brand-orange'
    },
    premium: {
      bg: 'bg-gradient-to-r from-brand-gold to-brand-orange',
      border: 'border-transparent',
      text: 'text-white',
      dot: 'bg-white'
    },
    outline: {
        bg: 'bg-transparent',
        border: 'border-white/20',
        text: 'text-gray-300',
        dot: 'bg-gray-400'
    }
  };

  const currentStyle = styles[variant];

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${currentStyle.bg} border ${currentStyle.border} mb-6 animate-fade-in backdrop-blur-md ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${currentStyle.dot} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${currentStyle.dot}`}></span>
        </span>
        <span className={`text-xs font-bold ${currentStyle.text} uppercase tracking-wide`}>{text}</span>
    </div>
  );
};

export default Badge;
