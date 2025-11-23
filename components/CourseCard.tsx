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
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={course.imageUrl}
          alt={course.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          {isEnrolled ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 border border-green-400/50 flex items-center gap-1.5 shadow-lg shadow-green-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              Inscrito
            </motion.div>
          ) : (
            status && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white border border-white/30 ${status.classes} shadow-lg`}
              >
                {status.text}
              </motion.div>
            )
          )}
        </div>

        {/* Duration Badge */}
        <div className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-[#c4b5fd] border border-[#8a4add]/50 flex items-center gap-1.5 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {course.duration}
        </div>

        {/* Progress Bar */}
        {isEnrolled && (
          <div className="absolute bottom-0 left-0 w-full h-2.5 bg-gray-800/60 backdrop-blur-sm">
            <motion.div
              className={`h-full transition-all duration-700 ${
                progress === 100
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50'
                  : 'bg-gradient-to-r from-[#8a4add] via-[#f27983] to-[#f27983] shadow-lg shadow-[#8a4add]/30'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow w-full">
        {/* Track Badge */}
        <div className="mb-3">
          <span className="inline-block bg-gradient-to-r from-[#8a4add]/30 to-[#f27983]/20 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#c4b5fd] border border-[#8a4add]/40">
            {course.track}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-white group-hover:text-[#f27983] transition-colors line-clamp-2 mb-2 flex-grow leading-snug">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
          {course.description}
        </p>

        {/* Skill Level */}
        <div className="mb-3 text-xs text-gray-500 font-medium">
          Nível: <span className="text-[#c4b5fd]">{course.skillLevel}</span>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 w-full">
          {isEnrolled ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mb-1.5">
                  <motion.div
                    className={`h-full transition-all ${
                      progress === 100 ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-gradient-to-r from-[#8a4add] to-[#f27983] shadow-lg shadow-[#8a4add]/20'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-300">
                  {progress === 100 ? '✅ Concluído' : `${progress}% pronto`}
                </span>
              </div>
              <motion.span
                whileHover={{ x: 2 }}
                className="text-xs font-bold text-[#c4b5fd] group-hover:text-[#f27983] transition-colors flex items-center gap-1 ml-2 flex-shrink-0"
              >
                {progress === 100 ? 'Revisar' : 'Continuar'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </motion.span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors font-medium">Comece agora</span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs font-bold text-white bg-gradient-to-r from-[#8a4add] to-[#f27983] px-3 py-1.5 rounded-lg group-hover:shadow-lg group-hover:shadow-[#8a4add]/30 transition-all cursor-pointer"
              >
                Explorar
              </motion.span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default CourseCard;
