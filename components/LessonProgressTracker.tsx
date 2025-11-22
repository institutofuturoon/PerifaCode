import React from 'react';

interface ProgressStep {
  id: string;
  label: string;
  icon: string;
  status: 'completed' | 'in-progress' | 'pending';
  description?: string;
}

interface LessonProgressTrackerProps {
  steps: ProgressStep[];
  currentStep?: string;
}

/**
 * LessonProgressTracker: Mostra o progresso visual da aula
 * Ajuda o usuário a saber exatamente onde está e o que falta fazer
 * 
 * Exemplo de uso:
 * ```
 * ✅ 📖 Ler Conteúdo (FEITO)
 * ⏳ 🎯 Fazer Exercício (ATUAL)
 * ⭕ 📝 Responder Quiz (NÃO INICIADO)
 * ⭕ 💭 Reflexão (NÃO INICIADO)
 * ```
 */
const LessonProgressTracker: React.FC<LessonProgressTrackerProps> = ({ 
  steps, 
  currentStep 
}) => {
  return (
    <div className="bg-white/5 rounded-lg border border-white/10 p-4 mb-6">
      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-lg">🎯</span>
        Sua Jornada Esta Aula
      </h4>
      
      <div className="space-y-2">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in-progress';
          const isPending = step.status === 'pending';
          
          return (
            <div 
              key={step.id}
              className={`
                flex items-start gap-3 p-3 rounded-lg transition-all
                ${isCompleted ? 'bg-green-500/10 border border-green-500/30' : ''}
                ${isInProgress ? 'bg-[#8a4add]/10 border border-[#8a4add]/30' : ''}
                ${isPending ? 'bg-gray-800/30 border border-gray-700/30' : ''}
              `}
            >
              {/* Status Icon */}
              <div className="flex-shrink-0 text-xl pt-0.5">
                {isCompleted && '✅'}
                {isInProgress && '⏳'}
                {isPending && '⭕'}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base">{step.icon}</span>
                  <p className={`
                    text-sm font-semibold
                    ${isCompleted ? 'text-green-300' : ''}
                    ${isInProgress ? 'text-[#c4b5fd]' : ''}
                    ${isPending ? 'text-gray-400' : ''}
                  `}>
                    {step.label}
                  </p>
                </div>
                
                {/* Status Badge */}
                <div className="mt-1 flex items-center gap-2">
                  <span className={`
                    text-xs font-semibold px-2 py-1 rounded-full
                    ${isCompleted ? 'bg-green-500/20 text-green-300' : ''}
                    ${isInProgress ? 'bg-[#8a4add]/20 text-[#c4b5fd]' : ''}
                    ${isPending ? 'bg-gray-700/20 text-gray-400' : ''}
                  `}>
                    {isCompleted && 'Feito'}
                    {isInProgress && 'Em Progresso'}
                    {isPending && 'Não Iniciado'}
                  </span>
                  
                  {/* Step Number */}
                  <span className="text-xs text-gray-500 ml-auto">
                    Passo {index + 1}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-gray-700/30">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400">Progresso Geral</p>
          <p className="text-xs font-bold text-white">
            {Math.round((steps.filter(s => s.status === 'completed').length / steps.length) * 100)}%
          </p>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983] transition-all duration-300"
            style={{
              width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonProgressTracker;
