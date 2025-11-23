import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Course, Lesson, User } from '../types';
import { useAppContext } from '../App';
import CourseCard from './CourseCard';
import { getLessonHistoryFromFirebase, syncLocalToFirebase } from '../utils/firebaseHistorySync';

// Continue Learning - Mostra próxima aula
export const ContinueLearningSection: React.FC<{
  latestInProgress: any;
  nextLesson: Lesson | null;
  user: User;
}> = ({ latestInProgress, nextLesson, user }) => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  if (!latestInProgress || !nextLesson) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-[#8a4add]/15 to-[#f27983]/15 rounded-2xl border border-[#8a4add]/40 p-6 sm:p-8 overflow-hidden relative group hover:border-[#8a4add]/60 transition-all"
    >
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-[#f27983]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <p className="text-xs font-bold text-[#c4b5fd] uppercase tracking-wider">Continuar estudando</p>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-1">{latestInProgress.course.track}</p>
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#f27983] transition-colors">
              {latestInProgress.course.title}
            </h3>
            <p className="text-sm text-gray-300 mt-2">
              Próxima: <span className="font-semibold">{nextLesson.title}</span>
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl sm:text-3xl font-bold text-[#f27983]">{latestInProgress.progress}%</p>
            <p className="text-xs text-gray-400">Concluído</p>
          </div>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#8a4add] to-[#f27983] h-full rounded-full transition-all duration-500" 
            style={{ width: `${latestInProgress.progress}%` }}
          ></div>
        </div>

        <motion.button 
          onClick={() => navigate(`/course/${latestInProgress.course.id}/lesson/${nextLesson.id}`)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#8a4add]/50 transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          Continuar Aula
        </motion.button>
      </div>
    </motion.div>
  );
};

// Explore Courses com filtro
export const ExploreCoursesSection: React.FC<{
  setActiveTab: (tab: string) => void;
}> = ({ setActiveTab }) => {
  const { courses, user, showToast } = useAppContext();
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
    if (firstLesson) {
      navigate(`/course/${course.id}/lesson/${firstLesson.id}`);
    } else {
      showToast("⚠️ Este curso ainda não tem aulas disponíveis. Fique atento!");
    }
  };

  const getCourseProgress = (course: Course) => {
    if (!user) return { progress: 0, isEnrolled: false };
    const courseLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
    if (courseLessonIds.length === 0) return { progress: 0, isEnrolled: false };
    const completedInCourse = user.completedLessonIds.filter(id => courseLessonIds.includes(id));
    const isEnrolled = completedInCourse.length > 0; 
    const progress = Math.round((completedInCourse.length / courseLessonIds.length) * 100);
    return { progress, isEnrolled };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="relative w-full md:w-96">
          <input 
            type="search" 
            placeholder="Buscar curso..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:ring-1 focus:ring-[#8a4add] focus:outline-none text-sm text-white"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div className="flex gap-2 overflow-x-auto max-w-full no-scrollbar">
          {tracks.map(track => (
            <button 
              key={track}
              onClick={() => setActiveTrack(track)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeTrack === track ? 'bg-[#8a4add] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              {track}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <div className="text-center py-20 text-gray-500">Nenhum curso encontrado.</div>
      )}
    </div>
  );
};

// My Courses Grid
export const MyCoursesSection: React.FC<{
  allMyCourses: any[];
  handleCourseNavigation: (course: Course) => void;
  setActiveTab: (tab: string) => void;
}> = ({ allMyCourses, handleCourseNavigation, setActiveTab }) => {
  if (allMyCourses.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-bold text-white">📚 Meus Cursos ({allMyCourses.length})</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allMyCourses.map((course) => (
          <CourseCard 
            key={course.id} 
            course={course} 
            onCourseSelect={handleCourseNavigation} 
            progress={course.progress}
            isEnrolled={true}
          />
        ))}
        
        {/* "Discover More" Card */}
        <button 
          onClick={() => setActiveTab('explore')}
          className="border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center p-6 hover:bg-white/5 hover:border-white/40 transition-all group h-full min-h-[280px]"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <span className="text-sm font-bold text-gray-400 group-hover:text-white text-center">Descobrir<br />Novos Cursos</span>
        </button>
      </div>
    </motion.div>
  );
};

// Empty State quando não há cursos
export const EmptyCoursesState: React.FC<{
  setActiveTab: (tab: string) => void;
}> = ({ setActiveTab }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-2xl border border-indigo-500/20 p-6 sm:p-8 text-center flex flex-col items-center justify-center gap-4"
  >
    <h3 className="text-xl font-bold text-white">Comece algo novo!</h3>
    <p className="text-gray-300 text-sm max-w-md">Explore nosso catálogo e dê o primeiro passo na sua carreira tech.</p>
    <button 
      onClick={() => setActiveTab('explore')} 
      className="bg-white text-indigo-900 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors text-sm"
    >
      Explorar Cursos
    </button>
  </motion.div>
);
