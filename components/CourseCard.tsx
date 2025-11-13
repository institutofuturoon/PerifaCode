import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onCourseSelect: (course: Course) => void;
}

const CategoryIcon: React.FC<{ category?: string }> = ({ category }) => {
    let icon;
    switch (category) {
        case 'IDIOMA':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l-1-10h7l-1 10m-6 0h7" /></svg>;
            break;
        case 'NEGÓCIOS':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
            break;
        case 'MELHOR IDADE':
        case 'INCLUSÃO':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>;
            break;
        case 'BACKEND':
             icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>;
            break;
        case 'GAMES':
             icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
            break;
        default:
            return null;
    }
    return (
      <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full bg-[#4c1d95] text-white flex items-center gap-2 shadow-lg">
        {icon}
        {category}
      </span>
    );
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onCourseSelect }) => {

  const formatInfo = {
    online: { icon: '🌐', text: 'Online' },
    presencial: { icon: '📍', text: 'Presencial' },
    hibrido: { icon: '📹', text: 'Híbrido' }
  };

  return (
    <div 
      className="bg-[#1f2328] rounded-lg overflow-hidden border border-gray-700/80 group flex flex-col text-left hover:border-[#8a4add]/50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-[#8a4add]/10 h-full"
    >
      <div onClick={() => onCourseSelect(course)} className="relative overflow-hidden aspect-video cursor-pointer">
        <img className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" src={course.imageUrl || `https://placehold.co/400x225/1f2328/c4b5fd?text=${encodeURIComponent(course.title)}`} alt={course.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <CategoryIcon category={course.category} />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {course.tags?.map(tag => (
            <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-700/60 text-gray-300">
              {tag}
            </span>
          ))}
        </div>
        <h3 onClick={() => onCourseSelect(course)} className="text-xl font-bold text-white mb-2 group-hover:text-[#c4b5fd] transition-colors duration-300 cursor-pointer">{course.title}</h3>
        <p className="text-sm text-gray-400 flex-grow">{course.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-400 border-t border-gray-700/80 pt-4 mt-4">
          {course.lessonsCount && (
            <div className="flex items-center gap-1.5" title={`${course.lessonsCount} aulas`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{course.lessonsCount} aulas</span>
            </div>
          )}
           {course.duration && course.duration !== 'N/A' && (
            <div className="flex items-center gap-1.5" title={`Duração de ${course.duration}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{course.duration}</span>
            </div>
          )}
           {course.format && (
            <div className="flex items-center gap-1.5" title={`Formato: ${formatInfo[course.format].text}`}>
                <span>{formatInfo[course.format].icon}</span>
                <span>{formatInfo[course.format].text}</span>
            </div>
           )}
        </div>
         <div className="mt-6">
            <button
              onClick={() => onCourseSelect(course)}
              className="w-full text-center bg-transparent border border-[#8a4add]/50 text-[#c4b5fd] font-semibold py-2 rounded-lg hover:bg-[#8a4add]/20 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Ver detalhes do curso
            </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;