/**
 * BadgeUnlockCelebration - Modal de Celebração ao desbloquear badge
 * Similar ao LevelUpCelebration mas focado em badges
 */

import React, { useEffect, useState } from 'react';
import { Badge } from '../TIPOS_CURSO_ROCKETSEAT';

interface BadgeUnlockCelebrationProps {
  isOpen: boolean;
  badge: Badge | null;
  onClose: () => void;
}

const BadgeUnlockCelebration: React.FC<BadgeUnlockCelebrationProps> = ({
  isOpen,
  badge,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen && badge) {
      setVisible(true);
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, badge, onClose]);

  if (!isOpen || !badge) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className={`relative z-10 transition-all duration-500 ${
          visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: visible ? 'badge-bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none' }}
      >
        {/* Main Card */}
        <div
          className="relative bg-gradient-to-br from-yellow-900/90 via-gray-900 to-yellow-700/90 border-2 border-yellow-500/50 rounded-3xl p-8 md:p-12 max-w-md shadow-2xl"
          style={{
            animation: 'badge-glow 2s ease-in-out infinite',
          }}
        >
          <style>{`
            @keyframes badge-bounce-in {
              0% {
                transform: scale(0) rotateZ(-20deg);
                opacity: 0;
              }
              50% {
                transform: scale(1.1) rotateZ(5deg);
              }
              100% {
                transform: scale(1) rotateZ(0deg);
                opacity: 1;
              }
            }
            @keyframes badge-glow {
              0%, 100% {
                box-shadow: 0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(234, 179, 8, 0.3);
              }
              50% {
                box-shadow: 0 0 40px rgba(245, 158, 11, 0.8), 0 0 80px rgba(234, 179, 8, 0.5);
              }
            }
            @keyframes float-spin {
              0%, 100% {
                transform: rotateZ(0deg) translateY(0);
              }
              25% {
                transform: rotateZ(5deg) translateY(-10px);
              }
              50% {
                transform: rotateZ(-5deg) translateY(0);
              }
              75% {
                transform: rotateZ(5deg) translateY(-5px);
              }
            }
          `}</style>

          {/* Decorative Orbs */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl -z-1" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl -z-1" />

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-300 mb-4">
              BADGE DESBLOQUEADA! 🎁
            </h1>

            {/* Badge Emoji & Name */}
            <div className="mb-6">
              <div
                className="text-7xl inline-block mb-3 transition-transform duration-1000"
                style={{
                  animation: 'float-spin 3s ease-in-out infinite',
                }}
              >
                {badge.ícone || '🏆'}
              </div>
              <h2 className="text-3xl font-bold text-white">
                {badge.titulo}
              </h2>
              <p className="text-gray-300 text-sm mt-2">
                {badge.descricao}
              </p>
            </div>

            {/* Achievement Message */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-6">
              <p className="text-yellow-300 font-bold text-lg">
                ⭐ Parabéns!
              </p>
              <p className="text-gray-300 text-sm mt-2">
                Você desbloqueou uma nova badge!
                <br />
                Continue aprendendo para desbloquear mais! 🚀
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 active:scale-95"
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

export default BadgeUnlockCelebration;
