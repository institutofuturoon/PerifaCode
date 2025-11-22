import React, { useEffect, useState } from 'react';

interface LessonCompleteModalProps {
  lessonTitle: string;
  xpGained: number;
  onContinue: () => void;
  onClose: () => void;
}

const LessonCompleteModal: React.FC<LessonCompleteModalProps> = ({ 
  lessonTitle, 
  xpGained, 
  onContinue, 
  onClose 
}) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#8a4add', '#f27983', '#fbbf24', '#34d399'][Math.floor(Math.random() * 4)],
                animation: `confetti-fall ${2 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="bg-[#121212] border border-green-500/30 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-green-500/20 animate-fade-in relative z-10">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Parabéns! 🎉</h2>
          <p className="text-gray-400 text-sm mb-1">Você concluiu a aula</p>
          <p className="text-white font-bold">{lessonTitle}</p>
        </div>

        <div className="bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/20 rounded-xl p-6 mb-6 border border-[#8a4add]/30">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-[#8a4add] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white text-3xl font-black">+{xpGained} XP</p>
              <p className="text-gray-300 text-xs">Experiência ganha</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[#8a4add]/30 flex items-center justify-center gap-2"
          >
            Próxima Aula
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-6 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 transition-colors"
          >
            Continuar Estudando
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LessonCompleteModal;
