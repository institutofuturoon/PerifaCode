import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ProgressCircleProps {
  title: string;
  completed: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  title,
  completed,
  total,
  size = 'md',
  showLabel = true,
}) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizes = {
    sm: { circle: 100, text: 'text-sm', label: 'text-xs' },
    md: { circle: 120, text: 'text-base', label: 'text-sm' },
    lg: { circle: 140, text: 'text-lg', label: 'text-base' },
  };

  const config = sizes[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`w-${config.circle} h-${config.circle} relative`}>
        <svg
          width={config.circle}
          height={config.circle}
          className="transform -rotate-90"
          style={{ margin: '0 auto', display: 'block' }}
        >
          {/* BG CIRCLE */}
          <circle
            cx={config.circle / 2}
            cy={config.circle / 2}
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="3"
          />
          {/* PROGRESS CIRCLE */}
          <motion.circle
            cx={config.circle / 2}
            cy={config.circle / 2}
            r="45"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8a4add" />
              <stop offset="100%" stopColor="#f27983" />
            </linearGradient>
          </defs>
        </svg>

        {/* CENTER TEXT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`font-bold text-white ${config.text}`}
          >
            {Math.round(percentage)}%
          </motion.div>
          <div className={`text-gray-400 ${config.label}`}>
            {completed}/{total}
          </div>
        </div>
      </div>

      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <p className="font-semibold text-white text-sm line-clamp-1">{title}</p>
          <p className="text-xs text-gray-400 mt-1">
            {completed === total ? '✅ Completo!' : 'Em Progresso'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressCircle;
