import React from 'react';
import { motion } from 'framer-motion';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onCourseSelect: (course: Course) => void;
  progress?: number;
  isEnrolled?: boolean;
  index?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onCourseSelect, progress = 0, isEnrolled = false, index = 0 }) => {
  const statusConfig = {
    open: { text: 'Abertas', classes: 'bg-green-600' },
    closed: { text: 'Fechadas', classes: 'bg-red-600' },
    soon: { text: 'Em Breve', classes: 'bg-blue-600' }
  };
  const status = course.enrollmentStatus ? statusConfig[course.enrollmentStatus] : null;

  // Display first 3 technologies/tags
  const technologies = (course.tags || []).slice(0, 3);

  return (
    <motion.button
      onClick={() => onCourseSelect(course)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group bg-white/5 hover:bg-white/10 rounded-lg overflow-hidden border border-white/10 hover:border-[#8a4add]/50 flex flex-col text-left transition-all h-full w-full"
    >
      {/* Image Section */}
      <div className="overflow-hidden aspect-video relative w-full bg-gray-900">
        <img
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={course.imageUrl}
          alt={course.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          {isEnrolled ? (
            <div className="px-2 py-1 rounded text-xs font-bold text-white bg-green-600 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              Inscrito
            </div>
          ) : (
            status && (
              <div className={`px-2 py-1 rounded text-xs font-bold text-white ${status.classes}`}>
                {status.text}
              </div>
            )
          )}
        </div>

        {/* Duration + Level Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <div className="bg-black/70 px-2 py-1 rounded text-xs font-semibold text-[#c4b5fd] flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course.duration}
          </div>
          <div className="bg-black/70 px-2 py-1 rounded text-xs font-semibold text-[#f27983]">
            {course.skillLevel}
          </div>
        </div>

        {/* Progress Bar */}
        {isEnrolled && (
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-800">
            <motion.div
              className={progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-[#8a4add] to-[#f27983]'}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Track */}
        <span className="text-xs font-semibold text-[#c4b5fd] mb-2">{course.track}</span>

        {/* Title */}
        <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 flex-grow">
          {course.title}
        </h3>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {technologies.map((tech, idx) => (
              <span key={idx} className="text-xs px-2 py-1 rounded bg-white/10 text-[#c4b5fd] font-medium">
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-gray-400 line-clamp-1 mb-3 flex-grow">
          {course.description}
        </p>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          {isEnrolled ? (
            <>
              <span className="text-xs font-semibold text-gray-400">
                {progress === 100 ? '✅ Concluído' : `${progress}%`}
              </span>
              <span className="text-xs font-semibold text-[#c4b5fd]">Continuar →</span>
            </>
          ) : (
            <span className="text-xs font-semibold text-[#f27983]">Explorar →</span>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default CourseCard;
