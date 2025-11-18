
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

const CourseCard: React.FC<CourseCardProps> = ({ course, onCourseSelect }) => {
  const statusConfig = {
    open: { text: 'Abertas', classes: 'bg-green-500/80' },
    closed: { text: 'Fechadas', classes: 'bg-red-500/80' },
    soon: { text: 'Em Breve', classes: 'bg-sky-500/80' }
  };
  const status = course.enrollmentStatus ? statusConfig[course.enrollmentStatus] : null;

  return (
    <button
      onClick={() => onCourseSelect(course)}
      className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 group flex flex-col text-left hover:border-[#8a4add]/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#8a4add]/10 h-full"
    >
      <div className="overflow-hidden aspect-video relative">
        <img className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" src={course.imageUrl} alt={course.title} />
        {status && (
            <div className={`absolute top-1.5 left-1.5 backdrop-blur-sm px-1 py-0.5 rounded text-[8px] font-semibold text-white ${status.classes}`}>
              {status.text}
            </div>
        )}
        <div className="absolute top-1.5 right-1.5 bg-black/50 backdrop-blur-sm px-1 py-0.5 rounded text-[8px] font-semibold text-white">
          {course.skillLevel}
        </div>
      </div>
      <div className="p-2.5 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-[8px] font-semibold text-gray-400">
          <div className="flex items-center gap-1">
            <CategoryIcon category={course.category} />
            <span className="uppercase tracking-wider">{course.track}</span>
          </div>
          <span>{course.duration}</span>
        </div>
        <h3 className="mt-1 text-xs font-bold text-white group-hover:text-[#c4b5fd] transition-colors line-clamp-2 flex-grow">{course.title}</h3>
        <p className="mt-0.5 text-[9px] text-gray-400 line-clamp-2">{course.description}</p>
      </div>
    </button>
  );
};

export default CourseCard;
