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
    open: { text: '🟢 Abertas', classes: 'bg-green-500/80' },
    closed: { text: '🔴 Fechadas', classes: 'bg-red-500/80' },
    soon: { text: '⏰ Em Breve', classes: 'bg-sky-500/80' }
  };
  const status = course.enrollmentStatus ? statusConfig[course.enrollmentStatus] : null;

  return (
    <motion.button
      onClick={() => onCourseSelect(course)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="group bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/6 rounded-xl overflow-hidden border border-white/10 hover:border-[#8a4add]/50 flex flex-col text-left transition-all duration-300 h-full w-full"
    >
      {/* Image Section */}
      <div className="overflow-hidden aspect-video relative w-full bg-gray-900">
        <img
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={course.imageUrl}
          alt={course.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {isEnrolled ? (
            <div className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#8a4add] to-[#c4b5fd] border border-[#c4b5fd]/40 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              Inscrito
            </div>
          ) : (
            status && (
              <div className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white border border-white/20 ${status.classes}`}>
                {status.text}
              </div>
            )
          )}
        </div>

        {/* Duration Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-[#c4b5fd] border border-[#8a4add]/30 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {course.duration}
        </div>

        {/* Progress Bar */}
        {isEnrolled && (
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-800">
            <div
              className={`h-full transition-all duration-500 ${
                progress === 100
                  ? 'bg-green-500'
                  : 'bg-gradient-to-r from-[#8a4add] to-[#f27983]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow w-full">
        {/* Track & Duration */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-3">
          <span className="bg-white/10 px-2 py-1 rounded-lg text-[#c4b5fd]">
            {course.track}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white group-hover:text-[#c4b5fd] transition-colors line-clamp-2 mb-2 flex-grow leading-tight">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
          {course.description}
        </p>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 w-full">
          {isEnrolled ? (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden mb-1">
                  <div
                    className={`h-full transition-all ${
                      progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-[#8a4add] to-[#f27983]'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-300">
                  {progress === 100 ? '✅ Concluído' : `${progress}%`}
                </span>
              </div>
              <span className="text-xs font-bold text-[#c4b5fd] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 ml-3">
                {progress === 100 ? 'Revisar' : 'Continuar'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Explore este curso</span>
              <span className="text-xs font-bold text-white bg-gradient-to-r from-[#8a4add] to-[#f27983] px-3 py-1 rounded-lg group-hover:shadow-lg group-hover:shadow-[#8a4add]/20 transition-all">
                Explorar
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default CourseCard;
