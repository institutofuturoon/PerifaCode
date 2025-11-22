/**
 * Streak Milestone Modal - Celebra milestones de streak
 * 7 dias, 30 dias, 100 dias, etc
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface StreakMilestoneModalProps {
  streak: number;
  xpReward: number;
  onClose: () => void;
  isOpen: boolean;
}

const StreakMilestoneModal: React.FC<StreakMilestoneModalProps> = ({
  streak,
  xpReward,
  onClose,
  isOpen,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Auto-close after 4 seconds
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getMilestoneInfo = (
    days: number
  ): {
    emoji: string;
    title: string;
    color: string;
  } => {
    if (days >= 100)
      return {
        emoji: '👑',
        title: 'Lenda do Streak',
        color: 'from-yellow-400 to-red-500',
      };
    if (days >= 30)
      return {
        emoji: '🏆',
        title: 'Campeão do Mês',
        color: 'from-yellow-300 to-yellow-600',
      };
    if (days >= 7)
      return {
        emoji: '🥇',
        title: 'Semana Completa',
        color: 'from-blue-400 to-blue-600',
      };
    return {
      emoji: '⭐',
      title: 'Bom Começo',
      color: 'from-green-400 to-green-600',
    };
  };

  const milestone = getMilestoneInfo(streak);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[200] pointer-events-none">
      <div
        className={`
          animate-bounce-in
          p-8 rounded-2xl shadow-2xl
          bg-gradient-to-br ${milestone.color}
          text-white text-center max-w-md
          pointer-events-auto
        `}
      >
        {/* Emoji com animação */}
        <div className="text-8xl mb-4 animate-spin-slow">
          {milestone.emoji}
        </div>

        {/* Título */}
        <h2 className="text-3xl font-bold mb-2">Parabéns! 🎉</h2>

        {/* Milestone Info */}
        <p className="text-xl font-semibold mb-4">{milestone.title}</p>

        {/* Streak Count */}
        <div className="mb-6">
          <p className="text-5xl font-bold text-white drop-shadow-lg">
            {streak}
          </p>
          <p className="text-lg opacity-90">dias de streak</p>
        </div>

        {/* XP Reward */}
        <div className="bg-white/20 rounded-lg p-4 mb-6 backdrop-blur-sm">
          <p className="text-sm opacity-90">Bônus ganho:</p>
          <p className="text-3xl font-bold">+{xpReward} XP</p>
        </div>

        {/* Motivational Message */}
        <p className="text-sm opacity-90">
          Continue assim! Seu compromisso é incrível! 🚀
        </p>
      </div>

      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm z-[-1]"
        onClick={onClose}
      />

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          70% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default StreakMilestoneModal;
