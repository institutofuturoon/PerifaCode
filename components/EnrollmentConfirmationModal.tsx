import React from 'react';
import { Course } from '../types';

interface EnrollmentConfirmationModalProps {
  course: Course;
  onStart: () => void;
  onClose: () => void;
}

const EnrollmentConfirmationModal: React.FC<EnrollmentConfirmationModalProps> = ({ course, onStart, onClose }) => {
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#121212] border border-[#8a4add]/30 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-[#8a4add]/20 animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#8a4add] to-[#f27983] rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Você está inscrito!</h2>
          <p className="text-gray-400 text-sm">Pronto para começar sua jornada em</p>
          <p className="text-[#c4b5fd] font-bold mt-1">{course.title}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8a4add]/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c4b5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">Total de aulas</p>
              <p className="text-white font-bold">{totalLessons} aulas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8a4add]/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c4b5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">Duração estimada</p>
              <p className="text-white font-bold">{course.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8a4add]/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c4b5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">Nível</p>
              <p className="text-white font-bold capitalize">{course.skillLevel}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 transition-colors"
          >
            Depois
          </button>
          <button
            onClick={onStart}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[#8a4add]/30 flex items-center justify-center gap-2"
          >
            Começar Agora
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentConfirmationModal;
