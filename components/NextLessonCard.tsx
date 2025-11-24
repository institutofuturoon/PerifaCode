import React from 'react';
import { motion } from 'framer-motion';
import { Lesson, Module } from '../types';
import { Play, Clock, CheckCircle2 } from 'lucide-react';

interface NextLessonCardProps {
  lesson: Lesson;
  module: Module;
  progress: number;
  completedCount: number;
  totalLessons: number;
  onContinue: () => void;
}

const NextLessonCard: React.FC<NextLessonCardProps> = ({
  lesson,
  module,
  progress,
  completedCount,
  totalLessons,
  onContinue,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="rounded-lg bg-[#1a1a2e] border border-gray-700/50 p-6 md:p-8">
        
        {/* HEADER */}
        <div className="mb-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase text-[#c4b5fd]">🎯 Próxima Aula</span>
              <span className="text-xs text-gray-400">{completedCount}/{totalLessons}</span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-4">
          
          {/* Módulo */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#8a4add] to-[#f27983] text-xs font-bold text-white">
              {module.title}
            </span>
          </div>

          {/* Título da aula */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              {lesson.title}
            </h3>
          </div>

          {/* Info row */}
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#8a4add]" />
              <span>{lesson.duration}</span>
            </div>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">{progress}% completo</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983]"
            />
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={onContinue}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 px-6 py-4 rounded-lg bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#8a4add]/40 transition-all shadow-lg shadow-[#8a4add]/30"
          >
            <Play size={18} />
            <span>Continuar Agora</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default NextLessonCard;
