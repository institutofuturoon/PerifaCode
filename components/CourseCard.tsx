import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onCourseSelect: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onCourseSelect }) => {
  const trackColors = {
    'Frontend': 'bg-blue-500/10 text-blue-300 border border-blue-500/20',
    'Backend': 'bg-green-500/10 text-green-300 border border-green-500/20',
    'IA': 'bg-pink-500/10 text-pink-300 border border-pink-500/20',
    'UX/UI': 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20',
  };

  return (
    <button 
      onClick={() => onCourseSelect(course)}
      className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 group flex flex-col text-left hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20"
    >
      <div className="overflow-hidden">
        <img className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500" src={course.imageUrl} alt={course.title} />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${trackColors[course.track]}`}>
              {course.track}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {course.duration}
            </span>
        </div>
        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{course.title}</h3>
        <p className="mt-2 text-sm text-gray-400 flex-grow">{course.description}</p>
        <div className="mt-6 text-purple-400 font-semibold group-hover:text-purple-300 transition-colors duration-300">
          Ver detalhes <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
        </div>
      </div>
    </button>
  );
};

export default CourseCard;