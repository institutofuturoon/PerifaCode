import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, ChevronRight, Home } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* CONFETTI ANIMADO */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
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
                duration: 2 + Math.random() * 1.5,
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
        className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] border border-green-500/40 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-green-500/20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* HEADER - CHECKMARK ANIMADO */}
        <motion.div 
          className="text-center mb-6"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-green-500/50"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <CheckCircle2 size={40} className="text-white" />
          </motion.div>

          <motion.h2 
            className="text-3xl font-black text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Parabéns! 🎉
          </motion.h2>
          <motion.p 
            className="text-gray-400 text-sm mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Você concluiu a aula
          </motion.p>
          <motion.p 
            className="text-white font-bold text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {lessonTitle}
          </motion.p>
        </motion.div>

        {/* XP GANHO - DESTAQUE */}
        <motion.div 
          className="bg-gradient-to-r from-[#8a4add]/30 to-[#f27983]/30 rounded-xl p-6 mb-6 border border-[#8a4add]/40"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-center gap-4">
            <motion.div 
              className="w-14 h-14 bg-gradient-to-br from-[#8a4add] to-[#f27983] rounded-full flex items-center justify-center shadow-lg shadow-[#8a4add]/40"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              <Zap size={24} className="text-white" />
            </motion.div>
            <div>
              <motion.p 
                className="text-white text-3xl font-black"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: 'spring' }}
              >
                +{xpGained} XP
              </motion.p>
              <p className="text-gray-300 text-xs font-semibold">Experiência Ganha</p>
            </div>
          </div>
        </motion.div>

        {/* BOTÕES DE AÇÃO */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={onContinue}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold hover:shadow-lg hover:shadow-[#8a4add]/30 transition-all flex items-center justify-center gap-2 group"
          >
            Próxima Aula
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-6 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 transition-colors"
          >
            Continuar Estudando
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LessonCompleteModal;
