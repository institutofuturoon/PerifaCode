import React from 'react';

interface ModuleMilestoneModalProps {
  moduleTitle: string;
  moduleNumber: number;
  totalModules: number;
  progressPercentage: number;
  onContinue: () => void;
}

const ModuleMilestoneModal: React.FC<ModuleMilestoneModalProps> = ({
  moduleTitle,
  moduleNumber,
  totalModules,
  progressPercentage,
  onContinue,
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#121212] border border-[#8a4add]/30 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-[#8a4add]/20 animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#8a4add] to-[#f27983] rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Módulo Completo! 🎯</h2>
          <p className="text-gray-400 text-sm mb-1">Você finalizou</p>
          <p className="text-[#c4b5fd] font-bold">{moduleTitle}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Progresso do Curso</span>
            <span className="text-white font-bold text-lg">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983] transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-center pt-2">
            <p className="text-gray-300 text-sm">
              <span className="font-bold text-white">{moduleNumber}</span> de{' '}
              <span className="font-bold text-white">{totalModules}</span> módulos concluídos
            </p>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[#8a4add]/30"
        >
          Continuar Aprendendo
        </button>
      </div>
    </div>
  );
};

export default ModuleMilestoneModal;
