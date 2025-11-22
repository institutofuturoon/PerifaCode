import React from 'react';
import { Course } from '../types';

interface CourseCompleteModalProps {
  course: Course;
  onDownloadCertificate: () => void;
  onShareLinkedIn: () => void;
  onClose: () => void;
}

const CourseCompleteModal: React.FC<CourseCompleteModalProps> = ({
  course,
  onDownloadCertificate,
  onShareLinkedIn,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#121212] border border-[#8a4add]/30 rounded-2xl max-w-lg w-full p-8 shadow-2xl shadow-[#8a4add]/20 animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Curso Concluído! 🏆</h2>
          <p className="text-gray-400 text-sm mb-1">Você finalizou 100% do curso</p>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983] mt-2">
            {course.title}
          </p>
        </div>

        <div className="bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/20 rounded-xl p-6 mb-6 border border-[#8a4add]/30 text-center">
          <p className="text-white text-sm mb-2">Você está pronto para conquistar novas oportunidades!</p>
          <p className="text-gray-400 text-xs">Compartilhe sua conquista e baixe seu certificado</p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={onDownloadCertificate}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[#8a4add]/30 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Baixar Certificado
          </button>
          
          <button
            onClick={onShareLinkedIn}
            className="w-full py-3 px-6 rounded-xl bg-[#0077b5] text-white font-bold hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Compartilhar no LinkedIn
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 px-6 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default CourseCompleteModal;
