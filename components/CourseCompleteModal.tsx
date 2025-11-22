import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Home, BookOpen } from 'lucide-react';
import { Course } from '../types';

interface CourseCompleteModalProps {
  course: Course;
  totalXpGained: number;
  totalLessons: number;
  onBackToDashboard: () => void;
  onExploreCourses: () => void;
}

const CourseCompleteModal: React.FC<CourseCompleteModalProps> = ({
  course,
  totalXpGained,
  totalLessons,
  onBackToDashboard,
  onExploreCourses,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* CONFETTI ANIMADO */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 80 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              initial={{ 
                y: '-10px', 
                opacity: 1,
                left: `${Math.random() * 100}%` 
              }}
              animate={{ 
                y: '100vh', 
                opacity: 0,
                rotate: 360
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                ease: 'easeIn',
                delay: Math.random() * 0.3
              }}
              style={{
                backgroundColor: ['#8a4add', '#f27983', '#fbbf24', '#34d399'][Math.floor(Math.random() * 4)],
              }}
            />
          ))}
        </div>
      )}

      {/* MODAL PRINCIPAL */}
      <motion.div 
        className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] border border-yellow-500/30 rounded-3xl max-w-lg w-full p-10 shadow-2xl shadow-yellow-500/20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* TROFÉU COM ANIMAÇÃO */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-yellow-500/50"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.6, delay: 0.3, repeat: 2 }}
          >
            <Trophy size={48} className="text-white" />
          </motion.div>

          <motion.h2 
            className="text-5xl font-black text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            🎉 Parabéns!
          </motion.h2>
          <motion.p 
            className="text-xl text-yellow-300 font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Você conquistou o curso!
          </motion.p>
          <motion.p 
            className="text-gray-400 text-lg font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {course.title}
          </motion.p>
        </motion.div>

        {/* STATS GRID */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="bg-gradient-to-br from-[#8a4add]/20 to-[#8a4add]/10 border border-[#8a4add]/40 rounded-xl p-4 text-center">
            <BookOpen size={24} className="text-[#c4b5fd] mx-auto mb-2" />
            <p className="text-2xl font-black text-white">{totalLessons}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">Aulas</p>
          </div>

          <div className="bg-gradient-to-br from-[#f27983]/20 to-[#f27983]/10 border border-[#f27983]/40 rounded-xl p-4 text-center">
            <span className="text-3xl">100%</span>
            <p className="text-2xl font-black text-white">✓</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">Completo</p>
          </div>
        </motion.div>

        {/* XP GANHO TOTAL */}
        <motion.div 
          className="bg-gradient-to-r from-yellow-600/30 to-yellow-500/20 border border-yellow-500/50 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4">
            <motion.div 
              className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <span className="text-3xl">⚡</span>
            </motion.div>
            <div>
              <p className="text-yellow-300 text-sm font-semibold">XP Total Ganho</p>
              <motion.p 
                className="text-4xl font-black text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
              >
                +{totalXpGained}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* BADGE DESBLOQUEADA */}
        <motion.div 
          className="bg-white/5 rounded-lg p-4 mb-8 border border-white/10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <p className="text-gray-300 text-sm">
            <span className="text-3xl mr-2">🏆</span>
            <span className="font-semibold">Badge Conquistador Desbloqueada!</span>
          </p>
        </motion.div>

        {/* BOTÕES DE AÇÃO */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <button
            onClick={onBackToDashboard}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold hover:shadow-lg hover:shadow-[#8a4add]/50 transition-all flex items-center justify-center gap-2 group"
          >
            <Home size={20} />
            Voltar para Painel
          </button>
          <button
            onClick={onExploreCourses}
            className="w-full py-3 px-6 rounded-xl bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen size={20} />
            Explorar Mais Cursos
          </button>
        </motion.div>

        {/* MENSAGEM DE MOTIVAÇÃO */}
        <motion.p 
          className="text-center text-gray-500 text-xs mt-6 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ✨ Você está caminhando para a excelência! Parabéns!
        </motion.p>
      </motion.div>
    </div>
  );
};

export default CourseCompleteModal;
