import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Course } from '../types';

interface LearningJourneyGuideProps {
  course: Course;
  userProgress: number;
  completed: number;
  total: number;
}

/**
 * INSTRUCTIONAL DESIGN: Learning Journey Guide
 * Inspired by Mimo's micro-learning and Rocketseat's linear progression
 * Shows:
 * - Course structure overview (modules → lessons)
 * - Clear progress visualization
 * - Motivation indicators
 * - Next action CTA
 */
const LearningJourneyGuide: React.FC<LearningJourneyGuideProps> = ({
  course,
  userProgress,
  completed,
  total,
}) => {
  const journeyStats = useMemo(() => {
    const totalMinutes = course.modules.reduce((sum, m) =>
      sum + m.lessons.reduce((lSum, l) => lSum + parseInt(l.duration || '0'), 0),
      0
    );
    const estimatedDaysToComplete = Math.ceil(totalMinutes / 30); // Assume 30 min/day

    return {
      totalModules: course.modules.length,
      totalLessons: total,
      completedLessons: completed,
      totalMinutes,
      estimatedDaysToComplete,
      progressPercentage: userProgress,
    };
  }, [course.modules, completed, total, userProgress]);

  const motivationalMessage = useMemo(() => {
    const progress = journeyStats.progressPercentage;
    if (progress === 0) return '🚀 Hora de começar sua jornada!';
    if (progress < 25) return '💪 Ótimo começo! Continue assim!';
    if (progress < 50) return '⚡ Você está no caminho certo!';
    if (progress < 75) return '🔥 Quase no meio do caminho!';
    if (progress < 100) return '🎯 Última reta! Você consegue!';
    return '✨ Parabéns! Você concluiu o curso!';
  }, [journeyStats.progressPercentage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/8 to-white/4 rounded-xl border border-white/10 p-6 space-y-6"
    >
      {/* Header: Course Title + Motivational Message */}
      <div>
        <h3 className="text-lg font-bold text-white mb-1">{course.title}</h3>
        <p className="text-sm text-[#f27983] font-semibold">{motivationalMessage}</p>
      </div>

      {/* Main Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-medium">Progresso Geral</span>
          <span className="text-[#c4b5fd] font-bold">{journeyStats.progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${journeyStats.progressPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Stats Grid: 4 Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Lessons Completed */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-xs text-gray-400 mb-1 font-medium">Aulas Concluídas</p>
          <p className="text-lg font-bold text-white">
            {journeyStats.completedLessons}/{journeyStats.totalLessons}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {journeyStats.totalLessons - journeyStats.completedLessons} restantes
          </p>
        </div>

        {/* Time Investment */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-xs text-gray-400 mb-1 font-medium">Tempo Total</p>
          <p className="text-lg font-bold text-white">
            ~{journeyStats.totalMinutes} min
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {journeyStats.estimatedDaysToComplete} dias aprox.
          </p>
        </div>

        {/* Modules */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-xs text-gray-400 mb-1 font-medium">Módulos</p>
          <p className="text-lg font-bold text-white">{journeyStats.totalModules}</p>
          <p className="text-xs text-gray-500 mt-1">Estrutura clara</p>
        </div>

        {/* Skill Level */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-xs text-gray-400 mb-1 font-medium">Nível</p>
          <p className="text-lg font-bold text-[#c4b5fd]">{course.skillLevel}</p>
          <p className="text-xs text-gray-500 mt-1">Para você</p>
        </div>
      </div>

      {/* Module List Preview */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estrutura do Curso</p>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {course.modules.map((module, idx) => {
            const moduleLessons = module.lessons.length;
            return (
              <div
                key={module.id}
                className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-start gap-3 hover:bg-white/8 transition-colors"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#8a4add]/20 border border-[#8a4add]/50 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#c4b5fd]">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{module.title}</p>
                  <p className="text-xs text-gray-400">{moduleLessons} aulas</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational Footer */}
      <div className="bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/20 rounded-lg p-3 border border-[#8a4add]/30 text-center">
        <p className="text-xs text-gray-300 font-medium">
          💡 Estudar 30 min/dia • Fazer uma aula por vez • Revisar se necessário
        </p>
      </div>
    </motion.div>
  );
};

export default LearningJourneyGuide;
