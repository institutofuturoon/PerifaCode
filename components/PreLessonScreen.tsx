import React, { useState, useEffect } from 'react';
import { Course, Module, Lesson } from '../types';

interface PreLessonScreenProps {
  course: Course;
  currentModule: Module;
  currentLesson: Lesson;
  lessonIndex: number;
  totalLessonsInModule: number;
  totalLessonsInCourse: number;
  completedLessonIds: string[];
  onStart: () => void;
  onBack: () => void;
}

const PreLessonScreen: React.FC<PreLessonScreenProps> = ({
  course,
  currentModule,
  currentLesson,
  lessonIndex,
  totalLessonsInModule,
  totalLessonsInCourse,
  completedLessonIds,
  onStart,
  onBack,
}) => {
  const [hasSeenPreLesson, setHasSeenPreLesson] = useState(false);

  // Store that user viewed pre-lesson (localStorage only, zero cost)
  useEffect(() => {
    const key = `pre_lesson_${currentLesson.id}`;
    const alreadySeen = localStorage.getItem(key);
    if (!alreadySeen) {
      localStorage.setItem(key, 'true');
      setHasSeenPreLesson(true);
    }
  }, [currentLesson.id]);

  // Calculate progress in this module
  const moduleLessonIds = currentModule.lessons.map(l => l.id);
  const completedInModule = moduleLessonIds.filter(id => completedLessonIds.includes(id)).length;
  const moduleProgress = Math.round((completedInModule / totalLessonsInModule) * 100);

  // Calculate overall progress
  const courseLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
  const completedInCourse = courseLessonIds.filter(id => completedLessonIds.includes(id)).length;
  const courseProgress = Math.round((completedInCourse / totalLessonsInCourse) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#09090B] via-[#1a1a2e] to-[#09090B] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header with close button */}
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Aula {lessonIndex + 1} de {totalLessonsInCourse}</span>
        </div>

        {/* Main Card */}
        <div className="bg-[#1f2328]/80 border border-[#8a4add]/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">🎯 {currentLesson.title}</h1>
          <p className="text-xs text-gray-400 mb-6 font-semibold">Aula {lessonIndex + 1} de {totalLessonsInCourse}</p>

          {/* Objective */}
          {currentLesson.objective && (
            <div className="bg-[#8a4add]/10 border border-[#8a4add]/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300 leading-relaxed">
                <span className="text-[#c4b5fd] font-semibold">O que você aprenderá:</span>
                <br className="mt-2" />
                {currentLesson.objective}
              </p>
            </div>
          )}

          {/* Quick Info Cards - APENAS 2 ESSENCIAIS */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {/* Duration */}
            <div className="bg-[#0f1419] border border-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <p className="text-xs text-gray-400 font-semibold">Duração</p>
                  <p className="text-base font-bold text-white">{currentLesson.duration}</p>
                </div>
              </div>
            </div>

            {/* XP */}
            <div className="bg-[#0f1419] border border-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-xs text-gray-400 font-semibold">Pontos XP</p>
                  <p className="text-base font-bold text-white">+{currentLesson.xp}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <button
              onClick={onStart}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#8a4add] to-[#c4b5fd] hover:from-[#9a5aed] hover:to-[#d4c5fd] text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-[#8a4add]/30"
            >
              Iniciar Aula
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* First-time tip */}
          {hasSeenPreLesson && (
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <p className="text-xs text-gray-500 text-center">
                💡 <strong>Dica:</strong> Você pode pular esta tela marcando "Não mostrar novamente" nas próximas aulas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreLessonScreen;
