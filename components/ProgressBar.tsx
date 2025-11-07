import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-300">Progresso</span>
        <span className="text-sm font-medium text-purple-300">{progress}%</span>
      </div>
      <div className="w-full bg-black/30 rounded-full h-3.5 border border-white/10">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, boxShadow: `0 0 10px rgba(217, 70, 239, ${progress / 150})` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;