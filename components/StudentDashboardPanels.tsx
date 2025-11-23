import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Course, Lesson, User } from '../types';
import { useAppContext } from '../contexts/AppContextAdapter';
import CourseCard from './CourseCard';

// ✨ HERO DASHBOARD HEADER - Stunning first impression
const DashboardHeroSection: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-gradient-to-r from-[#8a4add]/10 to-[#f27983]/10 rounded-xl border border-[#8a4add]/30 p-6 sm:p-8 overflow-hidden relative group"
  >
    <div className="absolute -right-40 -top-40 w-96 h-96 bg-gradient-to-br from-[#f27983]/5 to-transparent rounded-full blur-3xl" />
    
    <div className="relative z-10">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-bold text-[#c4b5fd] uppercase tracking-widest mb-2">🚀 Bem-vindo(a)</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Sua Jornada Tech Começa Aqui
          </h2>
        </div>
      </div>
      <p className="text-sm sm:text-base text-gray-300 max-w-lg leading-relaxed">
        Escolha um curso, aprenda em seu ritmo e desbloqueie oportunidades na tecnologia. A comunidade FuturoOn está com você a cada passo.
      </p>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="px-3 py-1.5 bg-white/10 rounded-full text-xs font-semibold text-[#c4b5fd] border border-[#8a4add]/30">
          ⚡ Aprendizado Rápido
        </div>
        <div className="px-3 py-1.5 bg-white/10 rounded-full text-xs font-semibold text-[#c4b5fd] border border-[#8a4add]/30">
          💡 Prático
        </div>
        <div className="px-3 py-1.5 bg-white/10 rounded-full text-xs font-semibold text-[#c4b5fd] border border-[#8a4add]/30">
          🎯 Orientado
        </div>
      </div>
    </div>
  </motion.div>
);

// Continue Learning - Enhanced with LearningJourneyGuide style
export const ContinueLearningSection: React.FC<{
  latestInProgress: any;
  nextLesson: Lesson | null;
  user: User;
}> = ({ latestInProgress, nextLesson, user }) => {
  const navigate = useNavigate();

  if (!latestInProgress || !nextLesson) return null;

  const motivationalMessages: Record<number, string> = {
    0: '🚀 Hora de começar!',
    25: '💪 Ótimo começo!',
    50: '⚡ Metade do caminho!',
    75: '🔥 Quase lá!',
    100: '✨ Parabéns!',
  };

  const getMotivation = (progress: number) => {
    if (progress === 100) return motivationalMessages[100];
    if (progress >= 75) return motivationalMessages[75];
    if (progress >= 50) return motivationalMessages[50];
    if (progress >= 25) return motivationalMessages[25];
    return motivationalMessages[0];
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-[#8a4add]/20 to-[#f27983]/20 rounded-xl border border-[#8a4add]/40 p-6 sm:p-8 overflow-hidden relative group hover:from-[#8a4add]/25 hover:to-[#f27983]/25 transition-all duration-300"
    >
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-[#f27983]/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 space-y-5">
        {/* Status Line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
            <p className="text-xs font-bold text-[#c4b5fd] uppercase tracking-wider">Em Progresso</p>
          </div>
          <p className="text-xs font-bold text-[#f27983]">{getMotivation(latestInProgress.progress)}</p>
        </div>

        {/* Course Info */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">{latestInProgress.course.track}</p>
            <h3 className="text-lg sm:text-2xl font-bold text-white group-hover:text-[#f27983] transition-colors leading-tight">
              {latestInProgress.course.title}
            </h3>
            <p className="text-sm text-gray-300 mt-2.5 font-medium">
              Próxima aula: <span className="text-[#c4b5fd]">{nextLesson.title}</span>
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-3xl sm:text-4xl font-black text-[#f27983]">{latestInProgress.progress}%</p>
            <p className="text-xs text-gray-400 font-semibold mt-1">Concluído</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-[#8a4add] via-[#f27983] to-[#f27983]"
              initial={{ width: 0 }}
              animate={{ width: `${latestInProgress.progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 font-medium">
            <span>{latestInProgress.progress === 0 ? 'Comece agora' : `${latestInProgress.progress}% feito`}</span>
            <span>{100 - latestInProgress.progress} aulas restantes</span>
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={() => navigate(`/course/${latestInProgress.course.id}/lesson/${nextLesson.id}`)}
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(242, 121, 131, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3.5 rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 group/btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover/btn:translate-x-0.5 transition-transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>{latestInProgress.progress === 0 ? 'Começar Agora' : 'Continuar Aprendendo'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Explore Courses with enhanced UI
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
      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gradient-to-r from-white/8 to-white/4 p-4 rounded-xl border border-white/10 backdrop-blur-sm"
      >
        <div className="relative w-full md:w-96">
          <input
            type="search"
            placeholder="Buscar curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#8a4add] focus:outline-none text-sm text-white placeholder-gray-500 transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex gap-2 overflow-x-auto max-w-full pb-1 scrollbar-hide">
          {tracks.map(track => (
            <motion.button
              key={track}
              onClick={() => setActiveTrack(track)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeTrack === track
                  ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white shadow-lg shadow-[#8a4add]/50'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
              }`}
            >
              {track}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Courses Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course, idx) => {
          const { progress, isEnrolled } = getCourseProgress(course);
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <CourseCard
                course={course}
                onCourseSelect={handleCourseClick}
                progress={progress}
                isEnrolled={isEnrolled}
                index={idx}
              />
            </motion.div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <p className="text-gray-400 font-medium">Nenhum curso encontrado.</p>
          <p className="text-sm text-gray-500 mt-1">Tente outra busca ou mude de trilha.</p>
        </motion.div>
      )}
    </div>
  );
};

// My Courses Grid - Enhanced
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
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          📚 Meus Cursos <span className="text-sm text-gray-400 font-normal">({allMyCourses.length})</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {allMyCourses.map((course, idx) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <CourseCard
              course={course}
              onCourseSelect={handleCourseNavigation}
              progress={course.progress}
              isEnrolled={true}
              index={idx}
            />
          </motion.div>
        ))}

        {/* "Discover More" Card */}
        <motion.button
          onClick={() => setActiveTab('explore')}
          whileHover={{ scale: 1.02, borderColor: '#8a4add' }}
          whileTap={{ scale: 0.98 }}
          className="group border-2 border-dashed border-white/30 rounded-xl flex flex-col items-center justify-center p-6 hover:bg-white/8 transition-all h-full min-h-[320px]"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8a4add]/20 to-[#f27983]/20 border border-[#8a4add]/30 flex items-center justify-center mb-4 group-hover:border-[#8a4add]/60 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#c4b5fd] group-hover:text-[#f27983] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.div>
          <span className="text-sm font-bold text-gray-400 group-hover:text-white text-center transition-colors">
            Descobrir<br />Novos Cursos
          </span>
          <span className="text-xs text-gray-500 mt-2">Expanda suas possibilidades</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Empty State - ENHANCED with visual appeal
export const EmptyCoursesState: React.FC<{
  setActiveTab: (tab: string) => void;
}> = ({ setActiveTab }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="bg-gradient-to-br from-[#8a4add]/15 via-[#09090B] to-[#f27983]/15 rounded-xl border border-[#8a4add]/40 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-6 min-h-[400px] relative overflow-hidden group"
  >
    <div className="absolute -right-40 -top-40 w-96 h-96 bg-gradient-to-br from-[#8a4add]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10 space-y-6">
      {/* Large Icon */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="flex justify-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8a4add]/30 to-[#f27983]/30 border-2 border-[#8a4add]/50 flex items-center justify-center">
          <span className="text-5xl">🚀</span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="space-y-3 max-w-lg">
        <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
          Comece sua Jornada Tech!
        </h3>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Explore nossos cursos cuidadosamente desenvolvidos para iniciantes. Aprenda em seu ritmo, com exemplos práticos e desafios que preparam você para o mercado.
        </p>
      </div>

      {/* Stats Preview */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm mx-auto py-4">
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-2xl font-bold text-[#c4b5fd]">10+</p>
          <p className="text-xs text-gray-400 mt-1">Cursos</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-2xl font-bold text-[#f27983]">100h+</p>
          <p className="text-xs text-gray-400 mt-1">Aprendizado</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-2xl font-bold text-green-400">100%</p>
          <p className="text-xs text-gray-400 mt-1">Grátis</p>
        </div>
      </div>

      {/* CTA Buttons */}
      <motion.button
        onClick={() => setActiveTab('explore')}
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(242, 121, 131, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3.5 rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Explorar Cursos Agora
      </motion.button>

      {/* Secondary CTA */}
      <button className="text-sm text-[#c4b5fd] hover:text-[#f27983] font-semibold transition-colors">
        Ver últimos cursos adicionados →
      </button>
    </div>
  </motion.div>
);
