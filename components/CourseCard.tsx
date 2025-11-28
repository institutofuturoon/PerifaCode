
import React from 'react';
import { Course } from '../types';
import StatusBadge from './StatusBadge';

interface CourseCardProps {
  course: Course;
  onCourseSelect: (course: Course) => void;
  progress?: number;
  isEnrolled?: boolean;
}

const CategoryIcon: React.FC<{ category?: string }> = ({ category }) => {
    let icon;
    switch (category) {
        case 'IDIOMA':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 00-9-9m9 9a9 9 0 009-9" />
            </svg>;
            break;
        default:
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>;
            break;
    }
    return <>{icon}</>;
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onCourseSelect, progress = 0, isEnrolled = false }) => {
  // Verificar se o curso é novo (criado nos últimos 30 dias)
  const isNewCourse = course.id ? false : false; // TODO: Implementar lógica de data
  
  const statusConfig = {
    open: { text: 'Abertas', variant: 'success' as const },
    closed: { text: 'Fechadas', variant: 'error' as const },
    soon: { text: 'Em Breve', variant: 'warning' as const }
  };
  const status = course.enrollmentStatus ? statusConfig[course.enrollmentStatus] : null;

  return (
    <button
      onClick={() => onCourseSelect(course)}
      className="bg-[#121214] hover:bg-[#202024] rounded-xl overflow-hidden border border-white/5 group flex flex-col text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#8a4add]/10 h-full w-full"
    >
      <div className="overflow-hidden aspect-video relative w-full">
        <img className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" src={course.imageUrl} alt={course.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent opacity-60"></div>
        
        {/* Badge NOVO - Laranja */}
        {isNewCourse && !isEnrolled && (
          <div className="absolute top-2 left-2">
            <StatusBadge variant="new">🆕 NOVO</StatusBadge>
          </div>
        )}
        
        {/* Status de inscrição */}
        {status && !isEnrolled && !isNewCourse && (
          <div className="absolute top-2 left-2">
            <StatusBadge variant={status.variant}>{status.text}</StatusBadge>
          </div>
        )}
        
        {/* Barra de progresso */}
        {isEnrolled && (
             <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                <div 
                    className={`h-full ${progress === 100 ? 'bg-success' : 'bg-brand-cyan'}`} 
                    style={{ width: `${progress}%` }}
                ></div>
             </div>
        )}

        {/* Nível do curso */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white border border-white/10">
          {course.skillLevel}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow w-full">
        <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-[#8a4add]">
            <CategoryIcon category={course.category} />
            <span>{course.track}</span>
          </div>
          <span>{course.duration}</span>
        </div>
        
        <h3 className="text-base font-bold text-white group-hover:text-[#c4b5fd] transition-colors line-clamp-2 mb-2 flex-grow leading-tight">
            {course.title}
        </h3>
        
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
            {course.description}
        </p>

        <div className="mt-auto pt-3 border-t border-white/5 w-full">
            {isEnrolled ? (
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                        {progress === 100 ? (
                          <>
                            <span className="text-success">✓</span>
                            <span>Concluído</span>
                          </>
                        ) : (
                          `${progress}% concluído`
                        )}
                    </span>
                    <span className="text-xs font-bold text-[#c4b5fd] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        {progress === 100 ? 'Revisar' : 'Continuar'} &rarr;
                    </span>
                </div>
            ) : (
                <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">Saiba mais</span>
                     <span className="text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-full group-hover:bg-[#8a4add] transition-colors">
                        Acessar
                     </span>
                </div>
            )}
        </div>
      </div>
    </button>
  );
};

export default CourseCard;
