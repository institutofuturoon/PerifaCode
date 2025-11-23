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
      transition={{ duration: 0.5, delay: 0.2 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8a4add]/20 to-[#f27983]/10 border border-gradient-to-r from-[#8a4add]/50 to-[#f27983]/30 shadow-2xl shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40 transition-all duration-300 p-8">
        
        {/* Decorativo background blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/10 via-transparent to-[#f27983]/10 pointer-events-none" />
        
        {/* HEADER COM STATUS */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#c4b5fd]">
                🎯 Próxima Aula para Você
              </span>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur">
              <span className="text-xs font-semibold text-gray-300">
                {completedCount}/{totalLessons} aulas
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 space-y-4">
          
          {/* Módulo */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#8a4add] to-[#f27983] text-xs font-bold text-white">
              {module.title}
            </div>
          </div>

          {/* Título da aula */}
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 group-hover:text-[#f27983] transition-colors">
              {lesson.title}
            </h3>
          </div>

          {/* Info row */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Clock size={16} className="text-[#8a4add]" />
              <span>{lesson.duration} de aprendizado</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-gray-300">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>{progress}% do curso concluído</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="pt-2">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-full"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">{progress}% completo</p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <motion.button
              onClick={onContinue}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold text-base flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-[#8a4add]/50 transition-all duration-300 group/btn"
            >
              <Play size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              <span>Continuar Agora</span>
            </motion.button>
          </div>
        </div>

        {/* Decorative accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#8a4add]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-[#f27983]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default NextLessonCard;
