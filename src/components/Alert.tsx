import React from 'react';

type AlertType = 'info' | 'success' | 'warning' | 'danger';

interface AlertProps {
  type?: AlertType;
  children: React.ReactNode;
}

const alertConfig = {
  info: {
    icon: '💡',
    borderColor: 'border-info',
    iconBgColor: 'bg-info/20',
    iconTextColor: 'text-info',
    bgColor: 'bg-info/5',
  },
  success: {
    icon: '✅',
    borderColor: 'border-success',
    iconBgColor: 'bg-success/20',
    iconTextColor: 'text-success',
    bgColor: 'bg-success/5',
  },
  warning: {
    icon: '⚠️',
    borderColor: 'border-warning',
    iconBgColor: 'bg-warning/20',
    iconTextColor: 'text-warning',
    bgColor: 'bg-warning/5',
  },
  danger: {
    icon: '🔥',
    borderColor: 'border-error',
    iconBgColor: 'bg-error/20',
    iconTextColor: 'text-error',
    bgColor: 'bg-error/5',
  },
};

const Alert: React.FC<AlertProps> = ({ type = 'info', children }) => {
  const config = alertConfig[type];

  return (
    <div className={`my-6 ${config.bgColor} border-l-4 ${config.borderColor} rounded-r-lg p-6 flex items-start gap-4`}>
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
