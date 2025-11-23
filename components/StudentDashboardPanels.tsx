import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Course, Lesson, User } from '../types';
import { useAppContext } from '../contexts/AppContextAdapter';
import CourseCard from './CourseCard';

// Continue Learning - SIMPLE
export const ContinueLearningSection: React.FC<{
  latestInProgress: any;
  nextLesson: Lesson | null;
  user: User;
}> = ({ latestInProgress, nextLesson, user }) => {
  const navigate = useNavigate();

  if (!latestInProgress || !nextLesson) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#8a4add]/10 to-[#f27983]/10 rounded-lg border border-white/10 p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#c4b5fd] uppercase">Continuar Estudando</p>
          <h3 className="text-lg font-bold text-white mt-1">{latestInProgress.course.title}</h3>
          <p className="text-sm text-gray-400 mt-1">Próxima: <span className="text-[#c4b5fd]">{nextLesson.title}</span></p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-[#f27983]">{latestInProgress.progress}%</p>
          <p className="text-xs text-gray-500 mt-1">Pronto</p>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983]"
          initial={{ width: 0 }}
          animate={{ width: `${latestInProgress.progress}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      <button
        onClick={() => navigate(`/course/${latestInProgress.course.id}/lesson/${nextLesson.id}`)}
        className="w-full bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
      >
        Continuar Aula
      </button>
    </motion.div>
  );
};

// Explore Courses - SIMPLE
export const ExploreCoursesSection: React.FC<{
  setActiveTab: (tab: string) => void;
}> = ({ setActiveTab }) => {
  const { courses, user } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTrack, setActiveTrack] = useState('Todos');

  const tracks = useMemo(() => ['Todos', ...Array.from(new Set(courses.map(c => c.track)))].sort(), [courses]);
  const filteredCourses = useMemo(() => courses.filter(course => 
    (course.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeTrack === 'Todos' || course.track === activeTrack)
  ), [courses, searchTerm, activeTrack]);

  const handleCourseClick = (course: Course) => {
    const firstLesson = course.modules?.[0]?.lessons?.[0];
    if (firstLesson) navigate(`/course/${course.id}/lesson/${firstLesson.id}`);
  };

  const getCourseProgress = (course: Course) => {
    if (!user) return { progress: 0, isEnrolled: false };
    const courseLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
    if (courseLessonIds.length === 0) return { progress: 0, isEnrolled: false };
    const completedInCourse = user.completedLessonIds.filter(id => courseLessonIds.includes(id));
    return { progress: Math.round((completedInCourse.length / courseLessonIds.length) * 100), isEnrolled: completedInCourse.length > 0 };
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Buscar curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#8a4add] focus:outline-none text-sm text-white"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {tracks.map(track => (
            <button
              key={track}
              onClick={() => setActiveTrack(track)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTrack === track
                  ? 'bg-[#8a4add] text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {track}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCourses.map((course, idx) => {
          const { progress, isEnrolled } = getCourseProgress(course);
          return (
            <CourseCard
              key={course.id}
              course={course}
              onCourseSelect={handleCourseClick}
              progress={progress}
              isEnrolled={isEnrolled}
              index={idx}
            />
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 text-gray-500">Nenhum curso encontrado</div>
      )}
    </div>
  );
};

// My Courses Grid - SIMPLE
export const MyCoursesSection: React.FC<{
  allMyCourses: any[];
  handleCourseNavigation: (course: Course) => void;
  setActiveTab: (tab: string) => void;
}> = ({ allMyCourses, handleCourseNavigation, setActiveTab }) => {
  if (allMyCourses.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Meus Cursos ({allMyCourses.length})</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allMyCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onCourseSelect={handleCourseNavigation}
            progress={course.progress}
            isEnrolled={true}
          />
        ))}

        {/* Discover More */}
        <button
          onClick={() => setActiveTab('explore')}
          className="border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center p-6 hover:bg-white/5 transition-all h-full min-h-[240px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs font-semibold text-gray-400">Descobrir Novos</span>
        </button>
      </div>
    </div>
  );
};

// Empty State - SIMPLE
export const EmptyCoursesState: React.FC<{
  setActiveTab: (tab: string) => void;
}> = ({ setActiveTab }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-[#8a4add]/10 to-[#f27983]/10 rounded-lg border border-white/10 p-8 text-center space-y-4"
  >
    <h3 className="text-xl font-bold text-white">Comece seu Aprendizado</h3>
    <p className="text-sm text-gray-400 max-w-md mx-auto">
      Explore nossos cursos e inicie sua jornada tech
    </p>
    <button
      onClick={() => setActiveTab('explore')}
      className="mx-auto bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
    >
      Explorar Cursos
    </button>
  </motion.div>
);
