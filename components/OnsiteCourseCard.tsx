import React from 'react';
import { Course } from '../types';
import { useAppContext } from '../App';

interface OnsiteCourseCardProps {
  course: Course;
}

const OnsiteCourseCard: React.FC<OnsiteCourseCardProps> = ({ course }) => {
    const { openInscriptionModal, navigateToCourse } = useAppContext();

    const formatInfo = {
        online: { icon: '🌐', text: 'Online' },
        presencial: { icon: '📍', text: 'Presencial' },
        hibrido: { icon: '📹', text: 'Híbrido' }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 transition-all duration-300 hover:border-[#8a4add]/30 hover:shadow-2xl hover:shadow-[#8a4add]/10">
            <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                    <span className="font-bold text-lg text-white group-hover:text-[#c4b5fd] transition-colors duration-300 cursor-pointer" onClick={() => navigateToCourse(course)}>{course.title}</span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
                        {course.skillLevel}
                    </span>
                </div>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-400">
                    {course.format && (
                        <div className="flex items-center gap-1.5" title={`Formato: ${formatInfo[course.format].text}`}>
                            <span>{formatInfo[course.format].icon}</span>
                            <span>{formatInfo[course.format].text}</span>
                        </div>
                    )}
                     <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>Complexo da Coruja, SG</span>
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2 w-full md:w-auto">
                 <button
                    onClick={() => openInscriptionModal(course)}
                    className="w-full md:w-auto bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300"
                >
                    Inscrever-se
                </button>
                 <button 
                    onClick={() => navigateToCourse(course)}
                    className="w-full md:w-auto text-xs text-gray-400 hover:text-white hover:underline"
                >
                    Ver mais detalhes
                </button>
            </div>
        </div>
    );
};

export default OnsiteCourseCard;