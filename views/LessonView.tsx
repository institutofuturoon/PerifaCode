import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, CheckCircle2, Home, Keyboard, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../contexts/AppContextAdapter';
import MarkdownRenderer from '../components/MarkdownRenderer';
import LessonCompleteModal from '../components/LessonCompleteModal';
import CourseCompleteModal from '../components/CourseCompleteModal';
import ChatBot from '../components/ChatBot';
import Breadcrumb from '../components/Breadcrumb';
import KeyboardHintsModal from '../components/KeyboardHintsModal';
import LessonMicroView from '../components/LessonMicroView';
import InteractiveExercise from '../components/InteractiveExercise';
import { syncLessonHistory } from '../utils/firebaseHistorySync';

const LessonView: React.FC = () => {
  const { courses, user, completeLesson, showToast } = useAppContext();
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showExerciseTab, setShowExerciseTab] = useState(false);

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

  // 💾 SALVAR HISTÓRICO - Última aula visitada + Sincronizar com Firebase
  useEffect(() => {
    if (courseId && lessonId && user?.id) {
      // 🔸 Sincronizar com localStorage + Firebase
      syncLessonHistory(
        user.id,
        courseId,
        lessonId,
        currentCourse?.title || 'Curso'
      ).catch(err => console.warn('Sync falhou (usando localStorage):', err));
    }
  }, [courseId, lessonId, currentCourse?.title, user?.id]);

  // 🎮 ATALHOS DE TECLADO
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // ESC = Voltar para dashboard
      if (e.key === 'Escape') {
        e.preventDefault();
        showToast('← Voltando para o painel...');
        navigate('/dashboard');
      }

      // ArrowRight = Próxima aula
      if (e.key === 'ArrowRight' && nextLesson && !showLessonModal && !showCourseModal) {
        e.preventDefault();
        showToast('▶️ Próxima aula →');
        navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
      }

      // ArrowLeft = Aula anterior
      if (e.key === 'ArrowLeft' && previousLesson && !showLessonModal && !showCourseModal) {
        e.preventDefault();
        showToast('◀️ Aula anterior ←');
        navigate(`/course/${courseId}/lesson/${previousLesson.id}`);
      }

      // Enter = Completar aula
      if (e.key === 'Enter' && !isCompleted && !showLessonModal && !showCourseModal) {
        e.preventDefault();
        handleCompleteLesson();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextLesson, previousLesson, courseId, lessonId, isCompleted, showLessonModal, showCourseModal]);

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
      {/* ============ HEADER CLEAN ============ */}
      <div className="border-b border-gray-700/50 bg-[#09090B] sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
            {/* VOLTAR HOME */}
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white flex-shrink-0"
              title="Voltar (ESC)"
            >
              <Home size={16} />
            </button>

            {/* PROGRESSO CENTRAL */}
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1 h-1 bg-gray-800/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">
                {progress}%
              </span>
            </div>

            {/* AULA ATUAL */}
            <span className="text-xs text-gray-500 whitespace-nowrap font-semibold ml-2">
              {currentLessonIndex + 1}/{allLessons.length}
            </span>
          </div>
        </div>
      </div>

      {/* ============ CONTEÚDO PRINCIPAL ============ */}
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          
          {/* TÍTULO */}
          <motion.div 
            className="mb-10"
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
              {currentLesson.title}
            </h1>
            {currentLesson.description && (
              <p className="text-gray-400 text-sm leading-relaxed">{currentLesson.description}</p>
            )}
          </motion.div>

          {/* OBJETIVO (Se existir) */}
          {currentLesson.objective && (
            <motion.div 
              className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg p-6 mb-10"
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
                Objetivo da Aula
              </h2>
              <div className="text-gray-300 text-sm leading-relaxed">
                <MarkdownRenderer content={currentLesson.objective} />
              </div>
            </motion.div>
          )}

          {/* TABS: Aprender vs Exercitar */}
          {(currentLesson.microSteps || currentLesson.exercise) && (
            <motion.div 
              className="flex gap-2 mb-8 border-b border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18 }}
            >
              <motion.button
                onClick={() => setShowExerciseTab(false)}
                className={`px-6 py-3 font-semibold transition-all border-b-2 ${
                  !showExerciseTab
                    ? 'text-white border-[#8a4add]'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
                whileHover={{ y: -2 }}
              >
                📚 Aprender
              </motion.button>
              {currentLesson.exercise && (
                <motion.button
                  onClick={() => setShowExerciseTab(true)}
                  className={`px-6 py-3 font-semibold transition-all border-b-2 ${
                    showExerciseTab
                      ? 'text-white border-[#f27983]'
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                  whileHover={{ y: -2 }}
                >
                  🎯 Exercitar
                </motion.button>
              )}
            </motion.div>
          )}

          {/* CONTEÚDO: APRENDER */}
          {!showExerciseTab && (
            <>
              {/* MICRO-STEPS (Se disponível) */}
              {currentLesson.microSteps && currentLesson.microSteps.length > 0 && (
                <LessonMicroView
                  microSteps={currentLesson.microSteps}
                  onComplete={() => setShowExerciseTab(true)}
                />
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
            </>
          )}

          {/* CONTEÚDO: EXERCITAR */}
          {showExerciseTab && currentLesson.exercise && (
            <InteractiveExercise
              exercise={currentLesson.exercise}
              onComplete={(score) => {
                showToast(`🎉 Exercício concluído com ${score}% de acerto!`);
                setShowExerciseTab(false);
              }}
            />
          )}

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

          {/* NAVEGAÇÃO AULAS */}
          <motion.div 
            className="border-t border-white/10 pt-12"
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.3 }}
          >
            {/* PRÓXIMA AULA - DESTAQUE PRINCIPAL */}
            {nextLesson ? (
              <motion.button
                onClick={() => navigate(`/course/${courseId}/lesson/${nextLesson.id}`)}
                whileHover={{ y: -4, borderColor: '#f27983' }}
                whileTap={{ scale: 0.98 }}
                className="w-full group rounded-2xl border border-[#8a4add]/40 bg-gradient-to-br from-[#8a4add]/15 to-[#f27983]/15 hover:from-[#8a4add]/25 hover:to-[#f27983]/25 p-7 sm:p-8 transition-all overflow-hidden relative"
              >
                {/* Decoração de fundo */}
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-[#f27983]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Conteúdo */}
                <div className="relative z-10">
                  {/* Label */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">🎯</span>
                    <p className="text-xs sm:text-sm font-bold text-[#c4b5fd] uppercase tracking-wider">Próxima Aula</p>
                  </div>

                  {/* Título */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#f27983] transition-colors text-left">
                    {nextLesson.title}
                  </h3>

                  {/* Detalhes compactos */}
                  <div className="flex flex-wrap gap-3 items-center text-sm mb-5">
                    <span className="text-gray-400 flex items-center gap-1">
                      {nextLesson.type === 'video' ? '🎥' : '📄'} {nextLesson.duration}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400 text-xs">Clique para continuar</span>
                  </div>

                  {/* Barra de ação */}
                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    <span className="text-xs font-semibold text-[#c4b5fd]">Continuar</span>
                    <ChevronRight size={16} className="text-[#f27983] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.button>
            ) : (
              <motion.div
                className="w-full rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-600/10 to-green-500/5 p-7 sm:p-8"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎉</span>
                  <div className="text-left">
                    <p className="font-bold text-green-400 mb-1">Última aula concluída!</p>
                    <p className="text-sm text-green-300">Parabéns! Você completou todo o conteúdo deste curso.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AULA ANTERIOR - COMPACTA */}
            {previousLesson && (
              <motion.button
                onClick={() => navigate(`/course/${courseId}/lesson/${previousLesson.id}`)}
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 group text-left p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all flex items-center gap-3"
              >
                <ChevronLeft size={18} className="text-[#c4b5fd] group-hover:text-white transition-colors flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Aula anterior</p>
                  <p className="text-sm font-semibold text-white truncate">
                    {previousLesson.title}
                  </p>
                </div>
              </motion.button>
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

      {/* 🎯 RESOURCE 4: SCROLL-TO-TOP BUTTON */}
      
      <ChatBot />
    </motion.div>
  );
};

export default LessonView;
