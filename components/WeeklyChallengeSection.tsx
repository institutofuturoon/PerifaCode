/**
 * Weekly Challenge Section - Componente para Dashboard
 * Exibe desafio semanal com progresso e reward
 */

import React, { useState, useEffect } from 'react';
import { challengeService } from '../services/challengeService';
import { useAppContext } from '../contexts/AppContextAdapter';

interface WeeklyChallengeProps {
  userId: string;
  onChallengeComplete?: () => void;
}

const WeeklyChallengeSection: React.FC<WeeklyChallengeProps> = ({
  userId,
  onChallengeComplete,
}) => {
  const { showToast } = useAppContext();
  const [challenge, setChallenge] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenge();
  }, [userId]);

  const loadChallenge = async () => {
    try {
      setLoading(true);
      const { challenge: ch, percentage, isCompleted } =
        await challengeService.getChallengeProgress(userId);

      if (ch) {
        setChallenge({ ...ch, isCompleted });
        setProgress(percentage);
      }
    } catch (error) {
      console.error('Erro ao carregar desafio:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    if (!challenge) return '📋';
    switch (challenge.type) {
      case 'lessons':
        return '🎓';
      case 'projects':
        return '🚀';
      case 'forum':
        return '💬';
      case 'streak':
        return '🔥';
      default:
        return '⭐';
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
        <div className="animate-pulse">
          <div className="h-4 bg-yellow-200 rounded w-32 mb-4"></div>
          <div className="h-3 bg-yellow-100 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">Carregando desafio da semana...</p>
      </div>
    );
  }

  return (
    <div
      className={`
        p-6 rounded-lg border-2 transition-all
        ${
          challenge.isCompleted
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
            : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{getIcon()}</span>
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {challenge.title}
            </h3>
            <p className="text-sm text-gray-600">{challenge.description}</p>
          </div>
        </div>
        {challenge.isCompleted && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-200 rounded-full">
            <span className="text-lg">✅</span>
            <span className="text-sm font-bold text-green-900">Completo!</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progresso
          </span>
          <span className="text-sm font-bold text-gray-900">
            {challenge.currentCount}/{challenge.targetCount}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              challenge.isCompleted
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Reward Info */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          <span className="font-semibold">Recompensa:</span>{' '}
          <span className="text-lg font-bold text-purple-600">
            +{challenge.xpReward} XP
          </span>
        </div>
        {challenge.isCompleted && (
          <span className="text-xs px-3 py-1 bg-green-300 text-green-900 rounded-full font-semibold">
            Resgatado! 🎉
          </span>
        )}
      </div>

      {/* Motivational Message */}
      {!challenge.isCompleted && (
        <p className="text-xs text-gray-600 mt-4 text-center">
          {progress < 50
            ? '💪 Você consegue! Comece agora!'
            : progress < 100
              ? '🔥 Tá quase! Termine os últimos passos!'
              : '⏰ Complete o desafio para ganhar a recompensa!'}
        </p>
      )}
    </div>
  );
};

export default WeeklyChallengeSection;
