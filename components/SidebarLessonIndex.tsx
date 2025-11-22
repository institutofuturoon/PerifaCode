import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, CheckCircle2, Circle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Module, Lesson } from '../types';

interface SidebarLessonIndexProps {
  modules: Module[];
  currentLessonId: string;
  completedLessonIds: string[];
  courseId: string;
  courseName: string;
}

const SidebarLessonIndex: React.FC<SidebarLessonIndexProps> = ({
  modules,
  currentLessonId,
  completedLessonIds,
  courseId,
  courseName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const allLessons = useMemo(() => modules.flatMap(m => m.lessons), [modules]);
  const totalLessons = allLessons.length;
  const completedCount = completedLessonIds.filter(id => allLessons.some(l => l.id === id)).length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const handleLessonClick = (lessonId: string) => {
    navigate(`/course/${courseId}/lesson/${lessonId}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 bottom-4 z-50 md:hidden p-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-full shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <X key="close" size={24} className="text-white" />
          ) : (
            <Menu key="menu" size={24} className="text-white" />
          )}
        </AnimatePresence>
      </motion.button>

      {/* SIDEBAR OVERLAY (Mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : -400,
          opacity: isOpen ? 1 : 0.9,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className={`fixed md:sticky top-0 left-0 h-screen w-80 bg-gradient-to-b from-[#09090B] to-black border-r border-white/10 overflow-y-auto z-40 md:z-auto ${
          isOpen ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* HEADER */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Índice de Aulas</h3>
            <h2 className="text-lg font-bold text-white line-clamp-2">{courseName}</h2>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <p className="text-xs text-gray-400 font-semibold">
              {completedCount}/{totalLessons} aulas concluídas ({progressPercent}%)
            </p>
          </div>

          {/* MÓDULOS */}
          <div className="space-y-4">
            {modules.map((module, moduleIdx) => {
              const moduleCompletedCount = module.lessons.filter(l =>
                completedLessonIds.includes(l.id)
              ).length;
              const moduleProgressPercent = Math.round(
                (moduleCompletedCount / module.lessons.length) * 100
              );

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: moduleIdx * 0.05 }}
                  className="space-y-3"
                >
                  {/* MÓDULO HEADER */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-[#c4b5fd] flex items-center gap-2">
                      <span className="bg-gradient-to-r from-[#8a4add] to-[#f27983] px-2 py-1 rounded text-xs text-white">
                        M{moduleIdx + 1}
                      </span>
                      {module.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983]"
                          animate={{ width: `${moduleProgressPercent}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span>{moduleCompletedCount}/{module.lessons.length}</span>
                    </div>
                  </div>

                  {/* AULAS */}
                  <div className="space-y-2 pl-2">
                    {module.lessons.map((lesson, lessonIdx) => {
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      const isCurrent = lesson.id === currentLessonId;

                      return (
                        <motion.button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson.id)}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm flex items-start gap-2 ${
                            isCurrent
                              ? 'bg-gradient-to-r from-[#8a4add]/40 to-[#f27983]/30 border border-[#8a4add]/50 text-white font-semibold'
                              : isCompleted
                              ? 'text-green-400 hover:bg-white/5'
                              : 'text-gray-400 hover:bg-white/5 hover:text-gray-300'
                          }`}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {isCompleted ? (
                              <CheckCircle2 size={16} className="text-green-400" />
                            ) : (
                              <Circle size={16} className={isCurrent ? 'text-[#f27983]' : ''} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {lessonIdx + 1}. {lesson.title}
                            </p>
                            <p className="text-xs opacity-70">{lesson.duration}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SidebarLessonIndex;
