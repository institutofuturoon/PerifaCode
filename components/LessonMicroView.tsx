import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { MicroStep } from '../types';

interface LessonMicroViewProps {
  microSteps?: MicroStep[];
  onComplete?: () => void;
}

const LessonMicroView: React.FC<LessonMicroViewProps> = ({ microSteps = [], onComplete }) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Se não tem micro-steps, gera automaticamente a partir do conteúdo
  const steps = useMemo(() => {
    if (microSteps.length > 0) return microSteps;
    
    // Fallback: cria steps genéricos
    return [
      {
        id: 'intro',
        title: 'Introdução',
        content: 'Comece aprendendo os conceitos fundamentais desta lição.',
        estimatedMinutes: 2
      },
      {
        id: 'core',
        title: 'Conceitos Principais',
        content: 'Estude os tópicos essenciais e exemplos práticos.',
        estimatedMinutes: 3
      },
      {
        id: 'practice',
        title: 'Prática',
        content: 'Exercite seus conhecimentos com as atividades propostas.',
        estimatedMinutes: 2
      }
    ];
  }, [microSteps]);

  const toggleStep = (stepId: string) => {
    const newSet = new Set(expandedSteps);
    if (newSet.has(stepId)) {
      newSet.delete(stepId);
    } else {
      newSet.add(stepId);
    }
    setExpandedSteps(newSet);
  };

  const toggleComplete = (stepId: string) => {
    const newSet = new Set(completedSteps);
    if (newSet.has(stepId)) {
      newSet.delete(stepId);
    } else {
      newSet.add(stepId);
    }
    setCompletedSteps(newSet);
  };

  const totalMinutes = steps.reduce((sum, step) => sum + step.estimatedMinutes, 0);
  const completedCount = completedSteps.size;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-12"
    >
      {/* HEADER COM PROGRESSO */}
      <div className="bg-gradient-to-r from-[#8a4add]/10 to-[#f27983]/10 border border-[#8a4add]/30 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Clock size={20} className="text-[#f27983]" />
              Aula em Micro-Steps
            </h2>
            <p className="text-gray-400 text-sm">
              ⏱️ {totalMinutes} min total • {completedCount}/{steps.length} passos concluídos
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8a4add] to-[#f27983]">
              {progressPercent}%
            </div>
            <p className="text-gray-500 text-xs mt-1">Progresso</p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* STEPS */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isExpanded = expandedSteps.has(step.id);
          const isCompleted = completedSteps.has(step.id);

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg border transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-green-500/5 border-green-500/30'
                  : 'bg-white/5 border-white/10 hover:border-[#8a4add]/50'
              }`}
            >
              {/* HEADER DO STEP */}
              <div
                onClick={() => toggleStep(step.id)}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* NÚMERO OU CHECK */}
                  {isCompleted ? (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                      <CheckCircle2 size={18} className="text-green-400" />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8a4add]/20 border border-[#8a4add]/40 flex items-center justify-center text-sm font-bold text-[#c4b5fd]">
                      {index + 1}
                    </div>
                  )}

                  {/* TÍTULO E TEMPO */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-white truncate ${isCompleted ? 'line-through opacity-60' : ''}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      ⏱️ {step.estimatedMinutes} min
                    </p>
                  </div>
                </div>

                {/* TOGGLE BUTTON */}
                <motion.button
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 ml-4 p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStep(step.id);
                  }}
                >
                  <ChevronDown size={18} />
                </motion.button>
              </div>

              {/* CONTEÚDO EXPANDIDO */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 border-t border-white/5 pt-4">
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {step.content}
                  </p>

                  {/* BOTÃO COMPLETAR */}
                  <motion.button
                    onClick={() => toggleComplete(step.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      isCompleted
                        ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                        : 'bg-[#8a4add]/20 text-[#c4b5fd] border border-[#8a4add]/40 hover:bg-[#8a4add]/30'
                    }`}
                  >
                    {isCompleted ? '✅ Concluído' : '✓ Marcar como Concluído'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA SE TUDO CONCLUÍDO */}
      {completedCount === steps.length && steps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <motion.button
            onClick={onComplete}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#8a4add]/50 transition-all"
          >
            🎉 Todos os passos concluídos! Finalizar Aula →
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LessonMicroView;
