/**
 * LevelUpCelebration - Modal de Celebração ao subir de nível
 * Confete, animações, emojis, som (opcional)
 */

import React, { useEffect, useState } from 'react';
import { LEVELS } from '../utils/xpSystem';

interface LevelUpCelebrationProps {
  isOpen: boolean;
  newLevel: string;
  xpCurrent: number;
  xpNextLevel: number;
  onClose: () => void;
}

const Confetti = () => {
  const confetti = Array.from({ length: 50 }, (_, i) => {
    const delay = Math.random() * 0.3;
    const duration = 2 + Math.random() * 1;
    const left = Math.random() * 100;
    const rotation = Math.random() * 720;

    return (
      <div
        key={i}
        className="fixed pointer-events-none"
        style={{
          left: `${left}%`,
          top: '-10px',
          animation: `confetti-fall ${duration}s linear ${delay}s forwards`,
          width: '10px',
          height: '10px',
          backgroundColor: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'][Math.floor(Math.random() * 5)],
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          transform: `rotate(${rotation}deg)`,
        } as React.CSSProperties}
      />
    );
  });

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes bounce-in-scale {
          0% {
            transform: scale(0) translateY(-50px);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(236, 72, 153, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(236, 72, 153, 0.5);
          }
        }
        @keyframes float-up {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-30px);
            opacity: 0;
          }
        }
      `}</style>
      {confetti}
    </>
  );
};

const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  isOpen,
  newLevel,
  xpCurrent,
  xpNextLevel,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Find level info
  const levelInfo = LEVELS.find((l) => l.id === newLevel);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Confetti */}
      <Confetti />

      {/* Modal Content */}
      <div
        className={`relative z-10 transition-all duration-500 ${
          visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: visible ? 'bounce-in-scale 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none' }}
      >
        {/* Main Card */}
        <div
          className="relative bg-gradient-to-br from-purple-900/90 via-gray-900 to-pink-900/90 border-2 border-purple-500/50 rounded-3xl p-8 md:p-12 max-w-md shadow-2xl"
          style={{ animation: 'glow-pulse 2s ease-in-out infinite' }}
        >
          {/* Decorative Orbs */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -z-1" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl -z-1" />

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4">
              VOCÊ SUBIU DE NÍVEL! 🎉
            </h1>

            {/* Level Emoji & Name */}
            <div className="mb-6">
              <div
                className="text-8xl inline-block mb-3 transition-transform duration-1000"
                style={{
                  animation: 'bounce-in-scale 0.8s ease-out',
                }}
              >
                {levelInfo?.emoji}
              </div>
              <h2 className="text-3xl font-bold text-white">
                {levelInfo?.nome}
              </h2>
            </div>

            {/* XP Progress */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-300">Progresso para próximo nível</span>
                <span className="text-sm font-bold text-yellow-400">{xpCurrent.toLocaleString()} XP</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                  style={{
                    width: `${Math.min((xpCurrent / xpNextLevel) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Achievement Message */}
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Parabéns! Você alcançou o nível <span className="font-bold text-white">{levelInfo?.nome}</span>!
              <br />
              Continue aprendendo e desbloqueando novos achievements! 🚀
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/50 active:scale-95"
              >
                Continuar 🚀
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20 hover:border-white/40"
                title="Compartilhar"
              >
                📢
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelUpCelebration;
