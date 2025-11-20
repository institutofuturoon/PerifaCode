
import React from 'react';

interface BadgeProps {
  text: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ text, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8a4add]/10 border border-[#8a4add]/20 mb-6 animate-fade-in backdrop-blur-md ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8a4add] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8a4add]"></span>
        </span>
        <span className="text-xs font-bold text-[#c4b5fd] uppercase tracking-wide">{text}</span>
    </div>
  );
};

export default Badge;
