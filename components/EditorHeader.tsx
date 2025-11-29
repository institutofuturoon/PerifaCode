
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface EditorHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  backTo?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ 
  title,
  subtitle,
  backTo = '/dashboard',
  onBack,
  actions 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(backTo);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#09090B]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Botão Voltar */}
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group flex-shrink-0"
            aria-label="Voltar"
          >
            <svg 
              className="h-5 w-5 group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            <span className="text-sm font-medium hidden sm:inline">Voltar</span>
          </button>
          
          {/* Título e Subtítulo */}
          <div className="flex-1 text-center">
            <h1 className="text-lg sm:text-xl font-bold text-white truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Actions ou Spacer */}
          {actions ? (
            <div className="flex-shrink-0">
              {actions}
            </div>
          ) : (
            <div className="w-16 sm:w-20 flex-shrink-0"></div>
          )}
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;
