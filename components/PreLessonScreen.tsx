import React, { useState, useEffect } from 'react';
import { Course, Module, Lesson } from '../types';
import { motion } from 'framer-motion';

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
  return (
    <motion.div 
      className="min-h-screen bg-[#09090B] text-white flex items-center justify-center p-4"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors text-sm font-semibold flex items-center gap-1"
          >
            ← Voltar
          </button>
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Aula {lessonIndex + 1} de {totalLessonsInCourse}
          </span>
        </div>

        {/* Main Card - Rocketseat Style */}
        <motion.div 
          className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg p-8"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Breadcrumb */}
          <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
            <span>{course.title}</span>
            <span className="mx-1">/</span>
            <span>{currentModule.title}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
            {currentLesson.title}
          </h1>

          {/* Objective */}
          {currentLesson.objective && (
            <motion.div 
              className="bg-[#8a4add]/10 border border-[#8a4add]/30 rounded-lg p-5 mb-8"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <p className="text-gray-300 text-sm leading-relaxed">
                {currentLesson.objective}
              </p>
            </motion.div>
          )}

          {/* Info Grid - Clean Design */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Duration Card */}
            <motion.div 
              className="bg-[#0f1419] border border-gray-700/50 rounded-lg p-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Duração</p>
              <p className="text-lg font-bold text-white">{currentLesson.duration}</p>
            </motion.div>

            {/* XP Card */}
            <motion.div 
              className="bg-[#0f1419] border border-gray-700/50 rounded-lg p-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Pontos</p>
              <p className="text-lg font-bold text-[#f27983]">+{currentLesson.xp}</p>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex gap-3"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold rounded-lg transition-all text-sm border border-gray-600/50"
            >
              Voltar
            </motion.button>
            <motion.button
              onClick={onStart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-lg transition-all text-sm shadow-lg shadow-[#8a4add]/30 hover:shadow-xl hover:shadow-[#8a4add]/50 flex items-center justify-center gap-2"
            >
              <span>Iniciar Aula</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PreLessonScreen;
