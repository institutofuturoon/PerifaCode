
import React from 'react';

interface BadgeProps {
  text: string;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
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
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      dot: 'bg-green-500'
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      dot: 'bg-yellow-500'
    },
    danger: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      dot: 'bg-red-500'
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
