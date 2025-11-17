import React from 'react';
import { Course } from '../types';
import { useAppContext } from '../App';

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
        case 'BACKEND':
             icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>;
            break;
        case 'GAME DEV':
             icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.328 9.878a3 3 0 01-4.656 0L8.343 8.543a3 3 0 010-4.243L9.88 2.857a3 3 0 014.242 0l1.458 1.458a3 3 0 010 4.242l-1.252 1.253z" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 14.25L12 15.75l1.5-1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12l-1.5 1.5 1.5 1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12l1.5 1.5-1.5 1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>;
            break;
        case 'LETRAMENTO DIGITAL':
             icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
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
  const { instructors } = useAppContext();
  const instructor = instructors.find(i => i.id === course.instructorId);

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
        <h3 onClick={() => onCourseSelect(course)} className="text-xl font-bold text-white mb-2 group-hover:text-[#c4b5fd] transition-colors duration-300 cursor-pointer">{course.title}</h3>
        <p className="text-sm text-gray-400 flex-grow">{course.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-400 border-t border-gray-700/80 pt-4 mt-4">
          {instructor && (
            <div className="flex items-center gap-2" title={`Instrutor: ${instructor.name}`}>
                <img src={instructor.avatarUrl} alt={instructor.name} className="h-6 w-6 rounded-full"/>
                <span className="text-xs font-medium">{instructor.name.split(' ')[0]}</span>
            </div>
          )}
           {course.format && (
            <div className="flex items-center gap-1.5" title={`Formato: ${formatInfo[course.format].text}`}>
                <span>{formatInfo[course.format].icon}</span>
                <span className="text-xs">{formatInfo[course.format].text}</span>
            </div>
           )}
        </div>
         <div className="mt-6">
            <button
              onClick={() => onCourseSelect(course)}
              className="w-full text-center bg-transparent border border-[#8a4add]/50 text-[#c4b5fd] font-semibold py-2 rounded-lg hover:bg-[#8a4add]/20 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" /></svg>
              Ver detalhes do curso
            </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;