import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../App';
import MarkdownRenderer from '../components/MarkdownRenderer';
import LessonCompleteModal from '../components/LessonCompleteModal';
import ChatBot from '../components/ChatBot';

const LessonView: React.FC = () => {
  const { courses, user, completeLesson, showToast } = useAppContext();
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();

  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const currentCourse = useMemo(() => courses.find(c => c.id === courseId), [courses, courseId]);
  const currentLesson = useMemo(() => 
    currentCourse?.modules.flatMap(m => m.lessons).find(l => l.id === lessonId), 
    [currentCourse, lessonId]
  );

  const allLessons = useMemo(() => currentCourse?.modules.flatMap(m => m.lessons) || [], [currentCourse]);
  const completedLessons = useMemo(() => 
    user?.completedLessonIds.filter(id => allLessons.some(l => l.id === id)) || [], 
    [user, allLessons]
  );

  const progress = allLessons.length > 0 ? Math.round((completedLessons.length / allLessons.length) * 100) : 0;
  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;
  const isCompleted = user?.completedLessonIds?.includes(lessonId || '') || false;

  const handleCompleteLesson = () => {
    completeLesson(currentLesson!.id);
    setShowCompleteModal(true);
  };

  const handleContinueFromModal = () => {
    setShowCompleteModal(false);
    if (nextLesson) {
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
    } else {
      showToast('🎉 Parabéns! Curso concluído!');
      navigate('/dashboard');
    }
  };

  if (!currentCourse || !currentLesson) {
    return <div className="text-center py-20 text-white">Aula não encontrada.</div>;
  }

  return (
    <motion.div 
      className="min-h-screen bg-[#09090B] flex flex-col"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      {/* ============ HEADER MINIMALISTA ============ */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* VOLTAR */}
            <button 
              onClick={() => navigate('/dashboard')} 
              className="text-[#c4b5fd] font-semibold hover:text-white flex items-center gap-2 group whitespace-nowrap"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span className="hidden sm:inline">Voltar</span>
            </button>

            {/* PROGRESSO CENTRAL */}
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-white whitespace-nowrap">{progress}%</span>
            </div>

            {/* AULA ATUAL */}
            <span className="text-xs text-gray-400 whitespace-nowrap">
              Aula {currentLessonIndex + 1}/{allLessons.length}
            </span>
          </div>
        </div>
      </div>

      {/* ============ CONTEÚDO PRINCIPAL ============ */}
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* BREADCRUMB + TÍTULO */}
          <motion.div 
            className="mb-12"
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.1 }}
          >
            <span className="text-[#c4b5fd] text-sm font-semibold">{currentCourse.title}</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              {currentLesson.title}
            </h1>
            {currentLesson.description && (
              <p className="text-gray-400 text-lg">{currentLesson.description}</p>
            )}
          </motion.div>

          {/* OBJETIVO (Se existir) */}
          {currentLesson.objective && (
            <motion.div 
              className="bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/10 border border-[#8a4add]/40 rounded-lg p-6 mb-10"
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-white font-bold mb-3 flex items-center gap-2">
                🎯 Objetivo da Aula
              </h2>
              <div className="text-gray-300 text-sm leading-relaxed">
                <MarkdownRenderer content={currentLesson.objective} />
              </div>
            </motion.div>
          )}

          {/* CONTEÚDO PRINCIPAL */}
          <motion.div 
            className="prose prose-invert max-w-none mb-12 text-gray-300 leading-relaxed"
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }}
          >
            <MarkdownRenderer content={currentLesson.mainContent} />
          </motion.div>

          {/* CTA BUTTON */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.25 }}
          >
            <button
              onClick={handleCompleteLesson}
              disabled={isCompleted}
              className="px-8 py-4 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#8a4add]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCompleted ? '✅ Concluído' : '✅ Marcar como Concluído'}
              {!isCompleted && nextLesson && ' e Continuar'}
            </button>
          </motion.div>

          {/* PRÓXIMA AULA */}
          {nextLesson && (
            <motion.div 
              className="border-t border-white/10 pt-12"
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-400 text-sm font-semibold mb-4">Próxima aula:</p>
              <button
                onClick={() => navigate(`/course/${courseId}/lesson/${nextLesson.id}`)}
                className="group w-full text-left p-5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all hover:border-[#8a4add]/40"
              >
                <h3 className="text-lg font-bold text-white group-hover:text-[#c4b5fd] transition-colors">
                  {nextLesson.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {nextLesson.duration} • {nextLesson.type === 'video' ? '🎥 Vídeo' : '📄 Texto'}
                </p>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* MODALS E CHATBOT */}
      {showCompleteModal && (
        <LessonCompleteModal
          lessonTitle={currentLesson.title}
          xpGained={currentLesson.xp}
          onContinue={handleContinueFromModal}
          onClose={() => setShowCompleteModal(false)}
        />
      )}
      <ChatBot />
    </motion.div>
  );
};

export default LessonView;
