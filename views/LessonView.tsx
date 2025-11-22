import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, CheckCircle2, Home } from 'lucide-react';
import { useAppContext } from '../App';
import MarkdownRenderer from '../components/MarkdownRenderer';
import LessonCompleteModal from '../components/LessonCompleteModal';
import CourseCompleteModal from '../components/CourseCompleteModal';
import ChatBot from '../components/ChatBot';

const LessonView: React.FC = () => {
  const { courses, user, completeLesson, showToast } = useAppContext();
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

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
  const previousLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;
  const isLastLesson = currentLessonIndex === allLessons.length - 1;
  const isCompleted = user?.completedLessonIds?.includes(lessonId || '') || false;
  
  // Calcular XP total ganho no curso
  const totalCourseXp = useMemo(() => {
    return completedLessons.length * 50; // 50 XP base por aula
  }, [completedLessons.length]);

  const handleCompleteLesson = () => {
    completeLesson(currentLesson!.id);
    if (isLastLesson) {
      setShowCourseModal(true);
    } else {
      setShowLessonModal(true);
    }
  };

  const handleContinueFromLessonModal = () => {
    setShowLessonModal(false);
    if (nextLesson) {
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
    }
  };

  const handleBackToDashboard = () => {
    setShowCourseModal(false);
    navigate('/dashboard');
  };

  const handleExploreCourses = () => {
    setShowCourseModal(false);
    navigate('/dashboard');
    showToast('🎓 Veja mais cursos disponíveis!');
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
      {/* ============ HEADER MELHORADO ============ */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* VOLTAR HOME */}
            <motion.button 
              onClick={() => navigate('/dashboard')}
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#c4b5fd] hover:text-white group"
              title="Voltar ao Painel"
            >
              <Home size={20} />
            </motion.button>

            {/* PROGRESSO CENTRAL */}
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className="text-sm font-bold text-white whitespace-nowrap">{progress}%</span>
            </div>

            {/* AULA ATUAL */}
            <span className="text-xs text-gray-400 whitespace-nowrap font-semibold">
              {currentLessonIndex + 1}/{allLessons.length}
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
            <span className="text-[#c4b5fd] text-sm font-semibold uppercase tracking-wide">{currentCourse.title}</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4 leading-tight">
              {currentLesson.title}
            </h1>
            {currentLesson.description && (
              <p className="text-gray-400 text-lg leading-relaxed">{currentLesson.description}</p>
            )}
          </motion.div>

          {/* OBJETIVO (Se existir) */}
          {currentLesson.objective && (
            <motion.div 
              className="bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/10 border border-[#8a4add]/40 rounded-xl p-6 mb-10"
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.15 }}
              whileHover={{ borderColor: '#8a4add' }}
            >
              <h2 className="text-white font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">🎯</span> Objetivo da Aula
              </h2>
              <div className="text-gray-300 text-sm leading-relaxed">
                <MarkdownRenderer content={currentLesson.objective} />
              </div>
            </motion.div>
          )}

          {/* CONTEÚDO PRINCIPAL */}
          <motion.div 
            className="prose prose-invert max-w-none mb-16 text-gray-300 leading-relaxed"
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }}
          >
            <MarkdownRenderer content={currentLesson.mainContent} />
          </motion.div>

          {/* CTA BUTTON MELHORADO */}
          <motion.div 
            className="flex flex-col gap-4 mb-16"
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.25 }}
          >
            <motion.button
              onClick={handleCompleteLesson}
              disabled={isCompleted}
              whileHover={!isCompleted ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isCompleted ? { scale: 0.98 } : {}}
              className={`w-full px-8 py-4 font-bold rounded-lg transition-all flex items-center justify-center gap-3 group ${
                isCompleted
                  ? 'bg-gradient-to-r from-green-600/30 to-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white hover:shadow-lg hover:shadow-[#8a4add]/50'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 size={20} />
                  <span>Aula Concluída!</span>
                </>
              ) : (
                <>
                  <Play size={20} className="group-hover:scale-110 transition-transform" />
                  <span>Marcar como Concluído {nextLesson && '→'}</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* NAVEGAÇÃO AULAS - ANTERIOR E PRÓXIMA */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-12"
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.3 }}
          >
            {/* AULA ANTERIOR */}
            {previousLesson ? (
              <motion.button
                onClick={() => navigate(`/course/${courseId}/lesson/${previousLesson.id}`)}
                whileHover={{ x: -4, borderColor: '#8a4add' }}
                whileTap={{ scale: 0.98 }}
                className="group text-left p-5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
              >
                <div className="flex items-start gap-3">
                  <ChevronLeft size={20} className="mt-1 text-[#c4b5fd] group-hover:text-white transition-colors group-hover:-translate-x-1 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Aula Anterior</p>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#c4b5fd] transition-colors truncate">
                      {previousLesson.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {previousLesson.duration} • {previousLesson.type === 'video' ? '🎥' : '📄'}
                    </p>
                  </div>
                </div>
              </motion.button>
            ) : (
              <div className="p-5 bg-white/5 rounded-lg border border-white/10 opacity-40">
                <p className="text-xs text-gray-500 mb-2">Primeira aula</p>
                <p className="text-sm text-gray-400">Sem aula anterior</p>
              </div>
            )}

            {/* PRÓXIMA AULA */}
            {nextLesson ? (
              <motion.button
                onClick={() => navigate(`/course/${courseId}/lesson/${nextLesson.id}`)}
                whileHover={{ x: 4, borderColor: '#f27983' }}
                whileTap={{ scale: 0.98 }}
                className="group text-right sm:text-left p-5 bg-gradient-to-r from-[#8a4add]/10 to-[#f27983]/10 hover:from-[#8a4add]/20 hover:to-[#f27983]/20 rounded-lg border border-[#8a4add]/40 transition-all"
              >
                <div className="flex items-start gap-3 flex-row-reverse sm:flex-row">
                  <ChevronRight size={20} className="mt-1 text-[#f27983] group-hover:text-white transition-colors group-hover:translate-x-1 transition-transform" />
                  <div className="flex-1 min-w-0 sm:text-left text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Próxima Aula</p>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#f27983] transition-colors truncate">
                      {nextLesson.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {nextLesson.duration} • {nextLesson.type === 'video' ? '🎥' : '📄'}
                    </p>
                  </div>
                </div>
              </motion.button>
            ) : (
              <div className="p-5 bg-gradient-to-r from-green-600/20 to-green-500/10 rounded-lg border border-green-500/30">
                <p className="text-xs text-green-400 mb-2 font-semibold">🎉 Última aula</p>
                <p className="text-sm text-green-300">Parabéns! Você chegou ao final.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* MODALS */}
      {showLessonModal && (
        <LessonCompleteModal
          lessonTitle={currentLesson.title}
          xpGained={currentLesson.xp}
          onContinue={handleContinueFromLessonModal}
          onClose={() => setShowLessonModal(false)}
        />
      )}
      {showCourseModal && (
        <CourseCompleteModal
          course={currentCourse}
          totalXpGained={totalCourseXp + 50} // +50 da última aula
          totalLessons={allLessons.length}
          onBackToDashboard={handleBackToDashboard}
          onExploreCourses={handleExploreCourses}
        />
      )}
      <ChatBot />
    </motion.div>
  );
};

export default LessonView;
