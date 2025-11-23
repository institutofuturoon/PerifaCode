import React from 'react';
import { motion } from 'framer-motion';
import { Course, Lesson } from '../types';

interface CourseStructurePreviewProps {
  course: Course;
  nextLesson?: Lesson | null;
  userCompletedLessonIds: string[];
  onStartCourse: () => void;
  compact?: boolean;
}

/**
 * INSTRUCTIONAL DESIGN: Course Structure Preview
 * Shows linear learning path with:
 * - Module hierarchy
 * - Lesson sequence
 * - Completion indicators
 * - Next action
 */
const CourseStructurePreview: React.FC<CourseStructurePreviewProps> = ({
  course,
  nextLesson,
  userCompletedLessonIds,
  onStartCourse,
  compact = false,
}) => {
  const getAllLessons = () => {
    return course.modules.flatMap(m => 
      m.lessons.map(l => ({ ...l, moduleTitle: m.title, moduleId: m.id }))
    );
  };

  const allLessons = getAllLessons();
  const nextLessonIndex = allLessons.findIndex(l => l.id === nextLesson?.id);

  if (compact) {
    return (
      <div className="space-y-3">
        {course.modules.map((module, modIdx) => (
          <div key={module.id} className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#8a4add]/20 border border-[#8a4add]/50 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[#c4b5fd]">{modIdx + 1}</span>
              </div>
              <h4 className="text-sm font-semibold text-white">{module.title}</h4>
              <span className="text-xs text-gray-400 ml-auto">{module.lessons.length} aulas</span>
            </div>
            
            <div className="ml-8 space-y-1">
              {module.lessons.map((lesson, lesIdx) => {
                const isCompleted = userCompletedLessonIds.includes(lesson.id);
                const isNext = lesson.id === nextLesson?.id;

                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-2 p-1.5 rounded-lg text-xs transition-colors ${
                      isCompleted
                        ? 'bg-green-500/10 text-green-300'
                        : isNext
                        ? 'bg-[#8a4add]/20 border border-[#8a4add]/50 text-[#c4b5fd]'
                        : 'text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="flex-shrink-0">✅</span>
                    ) : isNext ? (
                      <span className="flex-shrink-0">▶️</span>
                    ) : (
                      <span className="flex-shrink-0">○</span>
                    )}
                    <span className="font-medium">{lesson.title}</span>
                    <span className="text-xs opacity-70 ml-auto">{lesson.duration}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/8 to-white/4 rounded-xl border border-white/10 p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Estrutura do Curso</h3>
        <p className="text-sm text-gray-400">Seu caminho de aprendizado linear e eficiente</p>
      </div>

      <div className="space-y-4">
        {course.modules.map((module, modIdx) => {
          const moduleCompletedCount = module.lessons.filter(l =>
            userCompletedLessonIds.includes(l.id)
          ).length;
          const moduleProgress = Math.round(
            (moduleCompletedCount / module.lessons.length) * 100
          );

          return (
            <div key={module.id} className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8a4add]/20 border border-[#8a4add]/50 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#c4b5fd]">{modIdx + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white">{module.title}</h4>
                  <p className="text-xs text-gray-400">
                    {moduleCompletedCount}/{module.lessons.length} aulas • {moduleProgress}%
                  </p>
                </div>
              </div>

              {/* Module Progress Bar */}
              <div className="ml-11 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983]"
                  initial={{ width: 0 }}
                  animate={{ width: `${moduleProgress}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>

              {/* Lessons in Module */}
              <div className="ml-11 space-y-1.5">
                {module.lessons.map((lesson, lesIdx) => {
                  const isCompleted = userCompletedLessonIds.includes(lesson.id);
                  const isNext = lesson.id === nextLesson?.id;

                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: lesIdx * 0.05 }}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg text-xs transition-all ${
                        isCompleted
                          ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                          : isNext
                          ? 'bg-[#8a4add]/20 border border-[#8a4add]/50 text-[#c4b5fd] shadow-lg shadow-[#8a4add]/20'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/8'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="flex-shrink-0 text-green-400">✅</span>
                      ) : isNext ? (
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="flex-shrink-0 text-[#f27983]"
                        >
                          ▶️
                        </motion.span>
                      ) : (
                        <span className="flex-shrink-0">○</span>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{lesson.title}</p>
                      </div>
                      
                      <span className="flex-shrink-0 text-xs opacity-70">{lesson.duration}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA: Start/Continue */}
      <motion.button
        onClick={onStartCourse}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#8a4add]/50 transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        {userCompletedLessonIds.length === 0 ? 'Começar Agora' : 'Continuar Aprendendo'}
      </motion.button>
    </motion.div>
  );
};

export default CourseStructurePreview;
