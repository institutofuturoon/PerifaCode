import React from 'react';

type AlertType = 'info' | 'success' | 'warning' | 'danger';

interface AlertProps {
  type?: AlertType;
  children: React.ReactNode;
}

const alertConfig = {
  info: {
    icon: '💡',
    borderColor: 'border-sky-500',
    iconBgColor: 'bg-sky-500/20',
    iconTextColor: 'text-sky-400',
  },
  success: {
    icon: '✅',
    borderColor: 'border-green-500',
    iconBgColor: 'bg-green-500/20',
    iconTextColor: 'text-green-400',
  },
  warning: {
    icon: '⚠️',
    borderColor: 'border-yellow-500',
    iconBgColor: 'bg-yellow-500/20',
    iconTextColor: 'text-yellow-400',
  },
  danger: {
    icon: '🔥',
    borderColor: 'border-red-500',
    iconBgColor: 'bg-red-500/20',
    iconTextColor: 'text-red-400',
  },
};

const Alert: React.FC<AlertProps> = ({ type = 'info', children }) => {
  const config = alertConfig[type];

  return (
    <div className={`my-6 bg-white/5 border-l-4 ${config.borderColor} rounded-r-lg p-6 flex items-start gap-4`}>
      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${config.iconBgColor}`}>
        <span className={`text-lg ${config.iconTextColor}`}>{config.icon}</span>
      </div>
      <div className="prose prose-invert max-w-none text-gray-300 text-base leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default Alert;
