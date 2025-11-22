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
        <div className="bg-[#1f2328]/80 border border-[#8a4add]/30 rounded-2xl p-8 backdrop-blur-sm">
          {/* Breadcrumb */}
          <div className="text-xs text-gray-400 mb-6 flex items-center gap-2">
            <span className="hover:text-[#c4b5fd] cursor-pointer transition-colors">{course.title}</span>
            <span>›</span>
            <span className="hover:text-[#c4b5fd] cursor-pointer transition-colors">{currentModule.title}</span>
            <span>›</span>
            <span className="text-[#c4b5fd] font-semibold">{currentLesson.title}</span>
          </div>

          {/* Title & Emoji */}
          <h1 className="text-4xl font-bold text-white mb-4">🎯 {currentLesson.title}</h1>

          {/* Objective */}
          {currentLesson.objective && (
            <div className="bg-[#8a4add]/10 border border-[#8a4add]/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300">
                <span className="text-[#c4b5fd] font-semibold">O que você aprenderá:</span>
                <br />
                {currentLesson.objective}
              </p>
            </div>
          )}

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {/* Duration */}
            <div className="bg-[#0f1419] border border-gray-700/50 rounded-lg p-3 hover:border-[#8a4add]/30 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-lg">⏱️</span>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Duração</p>
                  <p className="text-sm font-bold text-white">{currentLesson.duration}</p>
                </div>
              </div>
            </div>

            {/* XP */}
            <div className="bg-[#0f1419] border border-gray-700/50 rounded-lg p-3 hover:border-[#8a4add]/30 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Pontos XP</p>
                  <p className="text-sm font-bold text-white">+{currentLesson.xp}</p>
                </div>
              </div>
            </div>

            {/* Lesson Progress */}
            <div className="bg-[#0f1419] border border-gray-700/50 rounded-lg p-3 hover:border-[#8a4add]/30 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Aula</p>
                  <p className="text-sm font-bold text-white">{lessonIndex + 1}/{totalLessonsInModule}</p>
                </div>
              </div>
            </div>

            {/* Module Progress */}
            <div className="bg-[#0f1419] border border-gray-700/50 rounded-lg p-3 hover:border-[#8a4add]/30 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Módulo</p>
                  <p className="text-sm font-bold text-white">{moduleProgress}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Module Timeline */}
          <div className="mb-8">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">📍 Estrutura do módulo</p>
            <div className="space-y-2">
              {currentModule.lessons.map((lesson, idx) => {
                const isCompleted = completedLessonIds.includes(lesson.id);
                const isCurrent = lesson.id === currentLesson.id;

                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      isCurrent
                        ? 'bg-[#8a4add]/20 border border-[#8a4add]/50'
                        : isCompleted
                        ? 'bg-green-500/10 border border-green-500/30'
                        : 'bg-[#0f1419] border border-gray-700/50 hover:border-gray-600/50'
                    }`}
                  >
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : isCurrent ? (
                        <div className="w-6 h-6 rounded-full bg-[#8a4add] flex items-center justify-center animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 font-bold">
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-grow">
                      <p className={`text-sm font-medium ${isCurrent ? 'text-white' : isCompleted ? 'text-gray-400' : 'text-gray-300'}`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-gray-500">{lesson.duration}</p>
                    </div>

                    {/* Status Label */}
                    {isCurrent && <span className="text-xs bg-[#8a4add] px-2 py-1 rounded text-white font-semibold">You are here</span>}
                    {isCompleted && <span className="text-xs text-green-400 font-semibold">✓ Concluída</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Progresso do Curso</p>
              <p className="text-sm font-bold text-[#c4b5fd]">{courseProgress}%</p>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#8a4add] to-[#c4b5fd] h-full transition-all duration-500"
                style={{ width: `${courseProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {completedInCourse} de {totalLessonsInCourse} aulas concluídas
            </p>
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
