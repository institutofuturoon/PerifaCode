import React, { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Course, User, MentorSession, Track } from '../types';
import { useAppContext } from '../App';
import DashboardSidebar from '../components/DashboardSidebar';
import ForumView from './ForumView';
import Blog from './Blog';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { ContinueLearningSection, ExploreCoursesSection, MyCoursesSection, EmptyCoursesState } from '../components/StudentDashboardPanels';
import NotificationBell from '../components/NotificationBell';

// ============================================================================
// DASHBOARD HEADER - Simple sticky header with user menu
// ============================================================================
const DashboardHeader: React.FC<{ user: User; toggleSidebar: () => void; title: string }> = ({ user, toggleSidebar, title }) => {
  const navigate = useNavigate();
  const { handleLogout } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-[#09090B] border-b border-white/5 sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
        </button>
        <div className="text-sm text-gray-500 hidden sm:block">{title}</div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 hover:bg-white/5 p-1.5 rounded-full">
            <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full border border-white/10" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#18181B] border border-white/10 rounded-lg shadow-xl z-50">
              <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/5">Meu Perfil</button>
              <button onClick={() => navigate('/')} className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/5">Voltar ao Site</button>
              <div className="border-t border-white/10 my-1"></div>
              <button onClick={() => { handleLogout(); navigate('/'); }} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5">Sair</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// ADMIN DASHBOARD - Gerencia cursos, alunos, etc
// ============================================================================
const AdminDashboard: React.FC = () => {
  const { user, users, courses, articles, team, events, handleDeleteArticle, handleToggleArticleStatus, handleDeleteUser, handleSaveTeamOrder, handleDeleteCourse, handleDeleteEvent } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isTeamOrdering, setIsTeamOrdering] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) return null;

  const coursesForUser = useMemo(() => user.role === 'admin' ? courses : courses.filter(c => c.instructorId === user.id), [user, courses]);
  const tabTitles: Record<string, string> = {
    overview: 'Visão Geral',
    courses: 'Cursos',
    students: 'Alunos',
    team: 'Equipe',
  };

  return (
    <div className="flex min-h-screen bg-[#09090B]">
      <DashboardSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        userRole={user.role} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <DashboardHeader user={user} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} title={tabTitles[activeTab] || 'Admin'} />
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'courses' && (
              <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/5">
                    <tr><th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Curso</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Trilha</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Ações</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {coursesForUser.map(c => (
                      <tr key={c.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 text-sm text-white">{c.title}</td>
                        <td className="px-6 py-4 text-xs text-gray-400">{c.track}</td>
                        <td className="px-6 py-4 text-xs space-x-2">
                          <button onClick={() => navigate(`/admin/course-editor/${c.id}`)} className="text-blue-400 hover:text-blue-300">Editar</button>
                          <button onClick={() => handleDeleteCourse(c.id)} className="text-red-500 hover:text-red-400">Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'overview' && <div className="text-gray-400">Bem-vindo ao painel de administração.</div>}
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

// ============================================================================
// STUDENT DASHBOARD - Meus cursos, explorar, fórum, blog
// ============================================================================
const StudentDashboard: React.FC = () => {
  const { user, courses, courseProgress, showToast } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('myCourses');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) return null;

  const { inProgressCourses, completedCourses } = courseProgress;
  const latestInProgress = inProgressCourses.length > 0 ? inProgressCourses[0] : null;
  const nextLesson = useMemo(() => {
    if (!latestInProgress) return null;
    const allLessons = latestInProgress.course.modules.flatMap(m => m.lessons);
    return allLessons.find(l => !user.completedLessonIds.includes(l.id)) || null;
  }, [latestInProgress, user.completedLessonIds]);

  const allMyCourses = useMemo(() => {
    return [
      ...inProgressCourses.map(c => ({...c.course, progress: c.progress, isEnrolled: true})), 
      ...completedCourses.map(c => ({...c, progress: 100, isEnrolled: true}))
    ];
  }, [inProgressCourses, completedCourses]);

  const handleCourseNavigation = (course: Course) => {
    const firstLesson = course.modules?.[0]?.lessons?.[0];
    if (firstLesson) {
      navigate(`/course/${course.id}/lesson/${firstLesson.id}`);
    } else {
      showToast("⚠️ Este curso ainda não tem aulas disponíveis.");
    }
  };

  const tabTitles: Record<string, string> = {
    myCourses: 'Meus Cursos',
    explore: 'Explorar',
    forum: 'Fórum',
    'blog-feed': 'Blog',
  };

  return (
    <div className="flex min-h-screen bg-[#09090B]">
      <DashboardSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        userRole={user.role} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <DashboardHeader user={user} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} title={tabTitles[activeTab] || 'Meu Aprendizado'} />
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {activeTab === 'myCourses' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-black text-white">Olá, {user.name.split(' ')[0]}! 👋</h1>
                  <p className="text-sm text-gray-400 mt-1">Continue sua jornada de aprendizado</p>
                </div>
                {latestInProgress && nextLesson ? (
                  <ContinueLearningSection latestInProgress={latestInProgress} nextLesson={nextLesson} user={user} />
                ) : (
                  <EmptyCoursesState setActiveTab={setActiveTab} />
                )}
                <MyCoursesSection allMyCourses={allMyCourses} handleCourseNavigation={handleCourseNavigation} setActiveTab={setActiveTab} />
              </div>
            )}
            {activeTab === 'explore' && <ExploreCoursesSection setActiveTab={setActiveTab} />}
            {activeTab === 'forum' && <ForumView embedded={true} />}
            {activeTab === 'blog-feed' && <Blog embedded={true} />}
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

// ============================================================================
// MAIN DASHBOARD EXPORT - Routing
// ============================================================================
const Dashboard: React.FC = () => {
  const { user } = useAppContext();
  if (!user) return <div className="min-h-screen flex items-center justify-center text-gray-400">Carregando...</div>;
  return user.role === 'student' ? <StudentDashboard /> : <AdminDashboard />;
};

export default Dashboard;
