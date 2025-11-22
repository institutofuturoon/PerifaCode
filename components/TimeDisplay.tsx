import React, { useState, useEffect } from 'react';

interface TimeDisplayProps {
  startTime: number; // timestamp em ms
  estimatedDuration: string; // ex: "15 min"
  isCompleted?: boolean;
}

/**
 * TimeDisplay: Mostra tempo gasto vs estimado
 * Gamifica a experiência com "bônus XP" por conclusão rápida
 * 
 * Exemplo:
 * ⏱️  Você: 12 minutos
 * 🎯 Estimado: 15 minutos
 * ✨ Bônus: Concluiu 3 min mais rápido! +10 XP
 */
const TimeDisplay: React.FC<TimeDisplayProps> = ({
  startTime,
  estimatedDuration,
  isCompleted = false
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const ms = now - startTime;
      const seconds = Math.floor(ms / 1000);
      setElapsed(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Parse estimated duration (ex: "15 min" -> 15)
  const estimatedMinutes = parseInt(estimatedDuration.split(' ')[0]) || 15;
  const estimatedSeconds = estimatedMinutes * 60;
  
  // Calculate elapsed time
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Calculate if user is faster than estimated
  const isFaster = elapsed < estimatedSeconds;
  const timeDifference = Math.abs(estimatedSeconds - elapsed);
  const bonusXP = isFaster ? Math.ceil((timeDifference / 60) * 10) : 0;

  return (
    <div className="bg-white/5 rounded-lg border border-white/10 p-4 mb-6">
      <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
        <span className="text-lg">⏱️</span>
        Tempo de Aula
      </h4>

      <div className="space-y-2">
        {/* Current Time */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Seu tempo:</span>
          <span className="text-sm font-bold text-white font-mono">
            {formattedTime}
          </span>
        </div>

        {/* Estimated Time */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Estimado:</span>
          <span className="text-sm font-bold text-gray-300 font-mono">
            {estimatedDuration}
          </span>
        </div>

        {/* Separator */}
        <div className="my-2 h-px bg-gray-700/30" />

        {/* Bonus XP (if faster) */}
        {isFaster && (
          <div className="pt-1">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center">
              <p className="text-xs text-green-300 font-semibold flex items-center justify-center gap-1">
                <span>✨</span>
                Bônus: {bonusXP} XP por rapidez!
              </p>
              <p className="text-xs text-green-400/70 mt-1">
                Você foi {Math.ceil(timeDifference / 60)} min mais rápido 🚀
              </p>
            </div>
          </div>
        )}

        {/* Standard completion message */}
        {isCompleted && !isFaster && (
          <div className="pt-1">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 text-center">
              <p className="text-xs text-blue-300 font-semibold">
                Ótimo tempo de aprendizado! 👏
              </p>
            </div>
          </div>
        )}

        {/* Slower than estimated */}
        {isCompleted && elapsed > estimatedSeconds + 60 && (
          <div className="pt-1">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 text-center">
              <p className="text-xs text-amber-300 font-semibold">
                Parabéns por dedicar tempo! 💪
              </p>
              <p className="text-xs text-amber-400/70 mt-1">
                Aprendizado profundo leva tempo
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-3 border-t border-gray-700/30">
        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              isFaster 
                ? 'bg-green-500' 
                : 'bg-gradient-to-r from-[#8a4add] to-[#f27983]'
            }`}
            style={{
              width: `${Math.min((elapsed / estimatedSeconds) * 100, 100)}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeDisplay;
