
import React, { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Achievement, Course, Lesson, MentorSession, User, Track, FinancialStatement, AnnualReport, Project } from '../types';
import ProgressBar from '../components/ProgressBar';
import { MOCK_ACHIEVEMENTS, MOCK_ANALYTICS_DATA_V2 } from '../constants';
import { useAppContext } from '../App';
import CourseCard from '../components/CourseCard';
import OnsiteCourseCard from '../components/OnsiteCourseCard';
import DashboardSidebar from '../components/DashboardSidebar';
import ForumView from './ForumView';
import MarketingGeneratorView from './MarketingGeneratorView';
import Blog from './Blog';
import DashboardTrilhasSection from '../components/DashboardTrilhasSection';
import useTrilhas from '../hooks/useTrilhas';
import useProgresso from '../hooks/useProgresso';
import LeaderboardView from '../components/LeaderboardView';
import LevelUpCelebration from '../components/LevelUpCelebration';
import BadgeUnlockCelebration from '../components/BadgeUnlockCelebration';
import WeeklyChallengeSection from '../components/WeeklyChallengeSection';
import StreakMilestoneModal from '../components/StreakMilestoneModal';
import { Badge } from '../TIPOS_CURSO_ROCKETSEAT';

// --- Shell Components (Local to Dashboard) ---

const DashboardHeader: React.FC<{ user: User, toggleSidebar: () => void, title: string }> = ({ user, toggleSidebar, title }) => {
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { handleLogout } = useAppContext();

    return (
        <header className="h-16 bg-[#09090B] border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="hidden sm:inline">FuturoOn Workspace</span>
                    <span className="hidden sm:inline">/</span>
                    <span className="text-white font-medium">{title}</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 hover:bg-white/5 py-1.5 px-2 rounded-full transition-colors">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-white">{user.name}</p>
                            <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
                        </div>
                        <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full border border-white/10" />
                    </button>
                    
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#18181B] border border-white/10 rounded-lg shadow-xl py-1 z-50">
                            <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors">Meu Perfil</button>
                            <button onClick={() => navigate('/')} className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors">Voltar ao Site</button>
                            <div className="border-t border-white/10 my-1"></div>
                            <button onClick={() => { handleLogout(); navigate('/'); }} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors">Sair</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};


const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
    <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</span>
        <div className="text-gray-400">{icon}</div>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

// --- Internal Components ---

const ExploreCoursesPanel: React.FC = () => {
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
        // Always try to go to the content if logged in (which we are if we are in Dashboard)
        const firstLesson = course.modules?.[0]?.lessons?.[0];
        if (firstLesson) {
            navigate(`/course/${course.id}/lesson/${firstLesson.id}`);
        } else {
            // If no lessons, warn user but keep them in the workspace
            showToast("⚠️ Este curso ainda não tem aulas disponíveis. Fique atento!");
        }
    };

    const getCourseProgress = (course: Course) => {
        if (!user) return { progress: 0, isEnrolled: false };
        const courseLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
        if (courseLessonIds.length === 0) return { progress: 0, isEnrolled: false };
        const completedInCourse = user.completedLessonIds.filter(id => courseLessonIds.includes(id));
        // Simple logic: if user has completed at least 1 lesson OR implies enrollment via some other future flag
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


// ... (Other Admin Panel Components: MyAgendaPanel, TeamOrderingPanel, etc. remain unchanged) ...
const MyAgendaPanel: React.FC<{
  user: User;
  mentorSessions: MentorSession[];
  users: User[];
  handleAddSessionSlot: (mentorId: string, date: string, time: string) => void;
  handleRemoveSessionSlot: (mentorId: string, date: string, time: string) => void;
}> = ({ user, mentorSessions, users, handleAddSessionSlot, handleRemoveSessionSlot }) => {
  const timeSlots = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
  const next7Days = useMemo(() => Array.from({ length: 7 }).map((_, i) => { const date = new Date(); date.setDate(date.getDate() + i); return date; }), []);
  const sessionsByDateTime = useMemo(() => { const map = new Map<string, MentorSession>(); mentorSessions.filter(s => s.mentorId === user.id).forEach(s => { map.set(`${s.date}-${s.time}`, s); }); return map; }, [mentorSessions, user.id]);

  return (
      <div className="bg-white/[0.02] rounded-xl border border-white/5 p-6">
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Gerenciar Disponibilidade</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {next7Days.map(day => {
                  const dateKey = day.toISOString().split('T')[0];
                  return (
                      <div key={dateKey} className="bg-black/20 rounded-lg border border-white/5 overflow-hidden">
                          <div className="p-2 bg-white/5 text-center border-b border-white/5">
                              <p className="font-bold text-white text-xs">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                              <p className="text-[10px] text-gray-500">{day.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</p>
                          </div>
                          <div className="p-2 space-y-1.5">
                              {timeSlots.map(time => {
                                  const session = sessionsByDateTime.get(`${dateKey}-${time}`);
                                  const student = session?.studentId ? users.find(u => u.id === session.studentId) : null;
                                  if (session?.isBooked && student) {
                                      return (<div key={time} className="w-full text-[10px] p-1 rounded bg-red-500/10 text-red-400 text-center border border-red-500/20"><p className="font-bold">Ocupado</p><p className="truncate opacity-70">{student.name.split(' ')[0]}</p></div>);
                                  }
                                  if (session && !session.isBooked) {
                                      return (<button key={time} onClick={() => handleRemoveSessionSlot(user.id, dateKey, time)} className="w-full text-[10px] font-semibold p-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors">Livre</button>);
                                  }
                                  return (<button key={time} onClick={() => handleAddSessionSlot(user.id, dateKey, time)} className="w-full text-[10px] font-medium p-1 rounded bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300 transition-colors">{time}</button>);
                              })}
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>
  );
};

const TeamOrderingPanel: React.FC<{
  team: User[];
  handleSaveTeamOrder: (orderedTeam: User[]) => Promise<void>;
  setIsTeamOrdering: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ team, handleSaveTeamOrder, setIsTeamOrdering }) => {
  const sortedTeamForOrdering = useMemo(() => 
      [...team].sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity))
  , [team]);

  const [orderedMembers, setOrderedMembers] = useState<User[]>(sortedTeamForOrdering);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
      dragItem.current = position;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
      dragOverItem.current = position;
  };

  const handleDrop = () => {
      if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) return;

      const newOrderedMembers = [...orderedMembers];
      const dragItemContent = newOrderedMembers[dragItem.current];
      newOrderedMembers.splice(dragItem.current, 1);
      newOrderedMembers.splice(dragOverItem.current, 0, dragItemContent);

      dragItem.current = null;
      dragOverItem.current = null;
      setOrderedMembers(newOrderedMembers);
  };

  const handleSave = async () => {
      await handleSaveTeamOrder(orderedMembers);
      setIsTeamOrdering(false);
  };

  return (
      <div className="bg-white/[0.02] rounded-xl border border-white/5 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-bold text-white uppercase tracking-wider">Ordenar Membros</h3>
               <div className="flex gap-2">
                  <button type="button" onClick={() => setIsTeamOrdering(false)} className="text-xs text-gray-400 hover:text-white px-3 py-1.5">Cancelar</button>
                  <button type="button" onClick={handleSave} className="bg-[#8a4add] text-white text-xs font-bold py-1.5 px-4 rounded hover:bg-[#7c3aed]">Salvar Ordem</button>
              </div>
          </div>
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {orderedMembers.map((member, index) => (
                  <div
                      key={member.id}
                      className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5 cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors"
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnter={(e) => handleDragEnter(e, index)}
                      onDragEnd={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                  >
                      <span className="text-gray-600 font-mono text-xs w-6 text-center">{index + 1}</span>
                      <img src={member.avatarUrl} alt={member.name} className="h-8 w-8 rounded-full object-cover border border-white/10" />
                      <div>
                          <p className="font-semibold text-white text-sm">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.title}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
};

const TracksManagementPanel: React.FC = () => {
    const { tracks, courses, handleCreateTrack, handleUpdateTrack, handleDeleteTrack, showToast } = useAppContext();
    const [newTrackName, setNewTrackName] = useState('');
    const [editingTrack, setEditingTrack] = useState<Track | null>(null);
    const [editingName, setEditingName] = useState('');

    const handleCreate = () => {
        if (!newTrackName.trim()) {
            showToast("❌ O nome da trilha não pode ser vazio.");
            return;
        }
        handleCreateTrack(newTrackName.trim());
        setNewTrackName('');
    };
    
    const startEditing = (track: Track) => {
        setEditingTrack(track);
        setEditingName(track.name);
    };

    const cancelEditing = () => {
        setEditingTrack(null);
        setEditingName('');
    };

    const handleUpdate = () => {
        if (!editingTrack || !editingName.trim()) return;
        if (editingTrack.name === editingName.trim()) {
            cancelEditing();
            return;
        }
        handleUpdateTrack(editingTrack.id, editingTrack.name, editingName.trim());
        cancelEditing();
    };

    const getCoursesCountInTrack = (trackName: string) => {
        return courses.filter(c => c.track === trackName).length;
    };
    
    return (
        <div className="bg-white/[0.02] rounded-xl border border-white/5 p-6">
             <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Gestão de Trilhas</h3>
            
             <div className="flex gap-3 mb-8">
                <input
                    type="text"
                    value={newTrackName}
                    onChange={(e) => setNewTrackName(e.target.value)}
                    placeholder="Nome da nova trilha..."
                    className="flex-grow p-2.5 bg-black/20 rounded-md border border-white/10 focus:ring-1 focus:ring-[#8a4add] focus:outline-none text-sm text-white"
                />
                <button onClick={handleCreate} className="font-semibold py-2 px-6 rounded-md bg-[#8a4add] text-white hover:bg-[#7c3aed] text-sm">
                    Adicionar
                </button>
            </div>

             <div className="grid gap-3">
                {tracks.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">Nenhuma trilha cadastrada.</p>
                ) : (
                    tracks.map(track => (
                        <div key={track.id} className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors">
                            {editingTrack?.id === track.id ? (
                                <div className="flex gap-2 w-full mr-4">
                                    <input 
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        className="flex-grow p-1.5 bg-black/30 rounded border border-[#8a4add] focus:outline-none text-sm text-white"
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <div>
                                    <p className="font-medium text-white text-sm">{track.name}</p>
                                    <p className="text-[10px] text-gray-500">{getCoursesCountInTrack(track.name)} cursos associados</p>
                                </div>
                            )}
                            
                            <div className="flex gap-3 items-center">
                                {editingTrack?.id === track.id ? (
                                    <>
                                        <button onClick={handleUpdate} className="text-xs text-green-400 hover:text-green-300 font-medium">Salvar</button>
                                        <button onClick={cancelEditing} className="text-xs text-gray-400 hover:text-gray-300">Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEditing(track)} className="text-xs text-gray-400 hover:text-white">Editar</button>
                                        <button onClick={() => handleDeleteTrack(track.id)} className="text-xs text-red-400 hover:text-red-300">Excluir</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
             </div>
        </div>
    );
};

const ModerationPanel: React.FC = () => {
    const { projects, users, handleApproveProject, handleRejectProject } = useAppContext();
    const navigate = useNavigate();

    const pendingProjects = useMemo(() => projects.filter(p => p.status === 'pending'), [projects]);

    return (
        <div className="bg-white/[0.02] rounded-xl border border-white/5 p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Moderação de Projetos</h3>
                <span className="px-2.5 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-bold border border-yellow-500/20">
                    {pendingProjects.length} Pendentes
                </span>
             </div>

             <div className="space-y-4">
                {pendingProjects.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
                         <p className="text-gray-500 text-sm">Tudo limpo! Nenhum projeto aguardando aprovação.</p>
                    </div>
                ) : (
                    pendingProjects.map(project => {
                        const author = users.find(u => u.id === project.authorId);
                        return (
                            <div key={project.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4 hover:border-white/10 transition-colors">
                                <div className="w-full md:w-32 flex-shrink-0">
                                    <img src={project.imageUrl} alt={project.title} className="w-full h-20 object-cover rounded-lg border border-white/10" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-base font-bold text-white truncate">{project.title}</h4>
                                        <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2 font-mono">{project.createdAt}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 mb-2">
                                        <img src={author?.avatarUrl} className="w-5 h-5 rounded-full border border-white/10" alt="" />
                                        <span className="text-xs text-gray-300">{author?.name}</span>
                                    </div>
                                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">{project.description}</p>
                                    <div className="flex gap-4 text-xs">
                                        <a href={project.repoUrl} target="_blank" rel="noopener" className="text-[#c4b5fd] hover:underline">Repositório</a>
                                        <a href={project.liveUrl} target="_blank" rel="noopener" className="text-[#c4b5fd] hover:underline">Demo Live</a>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col gap-2 justify-end md:justify-center md:border-l border-white/5 md:pl-4">
                                    <button onClick={() => handleApproveProject(project.id)} className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 px-4 py-1.5 rounded text-xs font-bold transition-colors">
                                        Aprovar
                                    </button>
                                    <button onClick={() => navigate(`/project/edit/${project.id}`)} className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-4 py-1.5 rounded text-xs font-bold transition-colors">
                                        Editar
                                    </button>
                                    <button onClick={() => handleRejectProject(project.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-1.5 rounded text-xs font-bold transition-colors">
                                        Rejeitar
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
             </div>
        </div>
    );
};

// TAB TITLE MAPPING
const tabTitles: Record<string, string> = {
    'trilhas': 'Trilhas & Gamificação',
    'leaderboard': 'Ranking & Leaderboard',
    overview: 'Visão Geral',
    myAgenda: 'Minha Agenda',
    myCourses: 'Meus Cursos',
    explore: 'Catálogo de Cursos',
    courses: 'Gestão de Cursos',
    tracks: 'Trilhas de Aprendizado',
    blog: 'Gerenciar Blog',
    'blog-feed': 'Notícias e Artigos',
    events: 'Eventos',
    moderation: 'Moderação',
    students: 'Base de Alunos',
    teamMembers: 'Equipe',
    transparency: 'Transparência',
    forum: 'Fórum de Dúvidas',
    marketing: 'Marketing Studio'
};

const AdminDashboard: React.FC = () => {
    const { 
      user, users, courses, articles, team, events, mentorSessions, financialStatements, annualReports,
      handleDeleteArticle, handleToggleArticleStatus,
      handleDeleteUser, handleSaveTeamOrder,
      handleAddSessionSlot, handleRemoveSessionSlot, handleDeleteCourse, handleDeleteEvent, handleDeleteFinancialStatement, handleDeleteAnnualReport
    } = useAppContext();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState(user?.role === 'instructor' ? 'overview' : 'overview');
    const [isTeamOrdering, setIsTeamOrdering] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!user) return null;

    const { newStudentsLast30d, coursePerformance, studentEngagement } = MOCK_ANALYTICS_DATA_V2;
    const coursesForUser = useMemo(() => user.role === 'admin' ? courses : courses.filter(c => c.instructorId === user.id), [user, courses]);
    const articlesForUser = useMemo(() => user.role === 'admin' ? articles : articles.filter(a => a.author === user.name), [user, articles]);
    const students = useMemo(() => users.filter(u => u.role === 'student' && u.accountStatus !== 'inactive'), [users]);
    
    const handleCreateCourse = () => navigate('/admin/course-editor');
    const handleEditCourse = (courseId: string) => navigate(`/admin/course-editor/${courseId}`);
    const handleCreateArticle = () => navigate('/admin/article-editor');
    const handleEditArticle = (articleId: string) => navigate(`/admin/article-editor/${articleId}`);
    const handleCreateUser = (role: 'student' | 'instructor') => navigate(role === 'student' ? '/admin/user-editor/new' : '/admin/teammember-editor/new');
    const handleEditUser = (userId: string, role: User['role']) => navigate(role === 'student' ? `/admin/user-editor/${userId}` : `/admin/teammember-editor/${userId}`);
    const handleCreateEvent = () => navigate('/event/new');
    const handleEditEvent = (eventId: string) => navigate(`/event/edit/${eventId}`);
    const handleCreateTransparency = () => navigate('/admin/transparency-editor');

    // Helper for table headers
    const TableHeader = ({ cols }: { cols: string[] }) => (
        <thead className="bg-white/5 text-xs uppercase font-medium text-gray-400">
            <tr>
                {cols.map((col, i) => (
                    <th key={i} className="px-6 py-3 text-left tracking-wider font-semibold border-b border-white/5">{col}</th>
                ))}
            </tr>
        </thead>
    );

    const CoursesTable = () => (
      <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
                <TableHeader cols={['Curso', 'Trilha', 'Aulas', 'Ações']} />
                <tbody className="divide-y divide-white/5">
                {coursesForUser.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-8 text-gray-500 text-sm">Nenhum curso encontrado.</td></tr>
                ) : (
                    coursesForUser.map((course) => (
                    <tr key={course.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-gray-800 overflow-hidden flex-shrink-0">
                                    <img src={course.imageUrl} className="w-full h-full object-cover opacity-70" alt="" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white truncate max-w-[200px]">{course.title}</div>
                                    <div className="text-[10px] text-gray-500">{course.skillLevel}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-0.5 inline-flex text-[10px] font-bold uppercase tracking-wider rounded border bg-[#8a4add]/10 text-[#c4b5fd] border-[#8a4add]/20`}>{course.track}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{course.modules.reduce((acc, module) => acc + module.lessons.length, 0)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-4">
                            <button onClick={() => navigate(`/admin/instructor-dashboard/${course.id}`)} className="text-gray-400 hover:text-white transition-colors">Dashboard</button>
                            <button onClick={() => handleEditCourse(course.id)} className="text-blue-400 hover:text-blue-300 transition-colors">Editar</button>
                            <button onClick={() => handleDeleteCourse(course.id)} className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">Excluir</button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
          </div>
        </div>
    );

    const BlogTable = () => (
      <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
         <div className="overflow-x-auto">
          <table className="min-w-full">
            <TableHeader cols={['Artigo', 'Status', 'Data', 'Ações']} />
            <tbody className="divide-y divide-white/5">
              {articlesForUser.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-500 text-sm">Nenhum artigo.</td></tr>
              ) : (
                articlesForUser.map((article) => (
                  <tr key={article.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white truncate max-w-[250px]">{article.title}</div>
                        <div className="text-[10px] text-gray-500">por {article.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${article.status === 'published' ? 'text-green-400' : 'text-yellow-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${article.status === 'published' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                            {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">{article.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                      <button onClick={() => handleToggleArticleStatus(article.id)} className="text-gray-400 hover:text-white">{article.status === 'published' ? 'Despublicar' : 'Publicar'}</button>
                      <button onClick={() => handleEditArticle(article.id)} className="text-blue-400 hover:text-blue-300">Editar</button>
                      <button onClick={() => handleDeleteArticle(article.id)} className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
         </div>
      </div>
    );

  const TeamMembersTable = () => (
      <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
         <div className="overflow-x-auto">
          <table className="min-w-full">
          <TableHeader cols={['Membro', 'Papel', 'Ações']} />
          <tbody className="divide-y divide-white/5">
              {team.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-8 text-gray-500 text-sm">Sem membros.</td></tr>
              ) : (
                  team.map((member) => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                              <img className="h-8 w-8 rounded-full border border-white/10" src={member.avatarUrl} alt={member.name} />
                              <div className="ml-3">
                                  <div className="text-sm font-medium text-white">{member.name}</div>
                                  <div className="text-[10px] text-gray-500">{member.title}</div>
                              </div>
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-300 capitalize">{member.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                        <button onClick={() => handleEditUser(member.id, member.role)} className="text-blue-400 hover:text-blue-300">Editar</button>
                        {user?.id !== member.id && (<button onClick={() => handleDeleteUser(member.id)} className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">Desativar</button>)}
                      </td>
                  </tr>
                  ))
              )}
          </tbody>
          </table>
         </div>
      </div>
  );

  const EventsTable = () => (
    <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full">
            <TableHeader cols={['Evento', 'Quando', 'Tipo', 'Ações']} />
            <tbody className="divide-y divide-white/5">
                {events.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-8 text-gray-500 text-sm">Sem eventos.</td></tr>
                ) : (
                    events.map((event) => (
                        <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-white truncate max-w-[200px]">{event.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">{event.date} • {event.time}</td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-white/5 text-gray-400 border border-white/10">{event.eventType}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                                <button onClick={() => handleEditEvent(event.id)} className="text-blue-400 hover:text-blue-300">Editar</button>
                                <button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">Excluir</button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
    </div>
  );

const StudentsTable = () => (
  <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
        <TableHeader cols={['Aluno', 'Email', 'XP', 'Ações']} />
        <tbody className="divide-y divide-white/5">
            {students.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500 text-sm">Nenhum aluno.</td></tr>
            ) : (
                students.map((student) => (
                <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <img className="h-8 w-8 rounded-full border border-white/10" src={student.avatarUrl} alt={student.name} />
                            <div className="ml-3"><div className="text-sm font-medium text-white">{student.name}</div></div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-xs text-gray-400">{student.email}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-[#c4b5fd]">{student.xp} XP</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                        <button onClick={() => handleEditUser(student.id, student.role)} className="text-blue-400 hover:text-blue-300">Editar</button>
                        {user?.id !== student.id && (<button onClick={() => handleDeleteUser(student.id)} className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">Desativar</button>)}
                    </td>
                </tr>
                ))
            )}
        </tbody>
        </table>
      </div>
    </div>
);

    const TransparencyTable = () => (
        <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-white/[0.02] rounded-xl border border-white/5 p-6">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Relatórios Financeiros</h3>
                <div className="space-y-2">
                     {financialStatements.length === 0 ? <p className="text-xs text-gray-500 py-4 text-center">Vazio.</p> : 
                        financialStatements.sort((a,b) => b.year - a.year).map(fs => (
                            <div key={fs.id} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                                <div>
                                    <span className="font-bold text-white text-sm">{fs.year}</span>
                                    <span className="text-xs text-gray-500 ml-2">Receita: <span className="text-green-400">{fs.totalRevenue}</span></span>
                                </div>
                                <div className="flex gap-2 text-xs">
                                    <button onClick={() => navigate(`/admin/transparency-editor/financial/${fs.id}`)} className="text-gray-400 hover:text-white">Editar</button>
                                    <button onClick={() => handleDeleteFinancialStatement(fs.id)} className="text-red-500 hover:text-red-400">Excluir</button>
                                </div>
                            </div>
                        ))}
                </div>
             </div>

             <div className="bg-white/[0.02] rounded-xl border border-white/5 p-6">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Relatórios Anuais</h3>
                <div className="space-y-2">
                     {annualReports.length === 0 ? <p className="text-xs text-gray-500 py-4 text-center">Vazio.</p> : 
                        annualReports.sort((a,b) => b.year - a.year).map(ar => (
                            <div key={ar.id} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                                <div>
                                     <span className="font-bold text-white text-sm">{ar.year}</span>
                                     <span className="text-[10px] text-gray-500 block">Coord: {ar.coordinationLetter.authorName}</span>
                                </div>
                                <div className="flex gap-2 text-xs">
                                    <button onClick={() => navigate(`/admin/transparency-editor/report/${ar.id}`)} className="text-gray-400 hover:text-white">Editar</button>
                                    <button onClick={() => handleDeleteAnnualReport(ar.id)} className="text-red-500 hover:text-red-400">Excluir</button>
                                </div>
                            </div>
                        ))}
                </div>
             </div>
        </div>
    );

    const Overview = () => (
        <div className="space-y-6 animate-fade-in">
             {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Alunos" value={students.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>} />
                <StatCard title="Novos (30d)" value={`+${newStudentsLast30d}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>} />
                <StatCard title="Conclusão" value={`${MOCK_ANALYTICS_DATA_V2.avgCompletionRate}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>} />
                <StatCard title="Conteúdos" value={articles.length + courses.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.392C3.057 15.71 4.245 16 5.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10.392c1.057.514 2.245.804 3.5.804c1.255 0 2.443-.29 3.5-.804V4.804C16.943 4.29 15.755 4 14.5 4z" /></svg>} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Course Performance */}
                <div className="lg:col-span-2 bg-white/[0.02] rounded-xl border border-white/5 p-6">
                    <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Desempenho Recente</h2>
                    <div className="space-y-4">
                        {coursePerformance.slice(0, 3).map(perf => {
                            const course = courses.find(c => c.id === perf.courseId);
                            if (!course) return null;
                            return (
                                <div key={perf.courseId} className="bg-black/20 p-3 rounded-lg border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-bold text-white text-sm">{course.title}</p>
                                        <span className="text-[10px] font-mono text-gray-400">{perf.completionRate}% concluído</span>
                                    </div>
                                    <ProgressBar progress={perf.completionRate} className="h-1.5"/>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Quick Lists */}
                <div className="space-y-4">
                     <div className="bg-white/[0.02] rounded-xl border border-white/5 p-6">
                        <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Alunos Destaque</h2>
                         <ul className="space-y-3">
                            {studentEngagement.topStudents.slice(0, 3).map(student => (
                                <li key={student.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img src={student.avatarUrl} alt={student.name} className="h-6 w-6 rounded-full" />
                                        <span className="text-xs font-medium text-gray-300">{student.name.split(' ')[0]}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-[#c4b5fd]">{student.xp} XP</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
      switch (activeTab) {
          case 'overview': return <Overview />;
          case 'courses': return <CoursesTable />;
          case 'blog': return <BlogTable />;
          case 'blog-feed': return <Blog embedded={true} />;
          case 'teamMembers': return <TeamMembersTable />;
          case 'students': return <StudentsTable />;
          case 'events': return <EventsTable />;
          case 'tracks': return <TracksManagementPanel />;
          case 'transparency': return <TransparencyTable />;
          case 'moderation': return <ModerationPanel />;
          case 'forum': return <ForumView embedded={true} />;
          case 'marketing': return <MarketingGeneratorView />;
          case 'myAgenda': return <MyAgendaPanel 
            user={user}
            mentorSessions={mentorSessions}
            users={users}
            handleAddSessionSlot={handleAddSessionSlot}
            handleRemoveSessionSlot={handleRemoveSessionSlot}
          />;
          default: return <Overview />;
      }
    };

    const getCreateButtonAction = () => {
      switch (activeTab) {
          case 'courses': return { text: 'Criar Curso', action: handleCreateCourse };
          case 'blog': return { text: 'Escrever Post', action: handleCreateArticle };
          case 'teamMembers': return { text: 'Adicionar Membro', action: () => handleCreateUser('instructor') };
          case 'students': return { text: 'Matricular Aluno', action: () => handleCreateUser('student') };
          case 'events': return { text: 'Agendar Evento', action: handleCreateEvent };
          case 'transparency': return { text: 'Novo Relatório', action: handleCreateTransparency };
          default: return null;
      }
    }
    
    const createButton = getCreateButtonAction();
    const showCreateButton = !!createButton && (user.role === 'admin' || (user.role === 'instructor' && (activeTab === 'courses' || activeTab === 'blog' || activeTab === 'events'))) && !isTeamOrdering && activeTab !== 'tracks' && activeTab !== 'moderation';

    return (
        <div className="flex min-h-screen bg-[#09090B]">
            <DashboardSidebar 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                userRole={user.role} 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
                <DashboardHeader 
                    user={user} 
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                    title={tabTitles[activeTab] || 'Dashboard'}
                />

                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        {/* Page Header Action */}
                        <div className="flex justify-between items-center mb-8">
                             <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">{tabTitles[activeTab]}</h2>
                                <p className="text-sm text-gray-500 mt-1">Gerencie os recursos da plataforma.</p>
                             </div>

                             <div className="flex gap-3">
                                 {activeTab === 'teamMembers' && user.role === 'admin' && (
                                    <button
                                        onClick={() => setIsTeamOrdering(prev => !prev)}
                                        className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
                                    >
                                        {isTeamOrdering ? 'Ver Tabela' : 'Reordenar'}
                                    </button>
                                )}
                                 {showCreateButton && createButton && (
                                    <button
                                        onClick={createButton.action}
                                        className="bg-[#8a4add] text-white text-sm font-bold py-2 px-5 rounded-lg hover:bg-[#7c3aed] transition-all shadow-lg shadow-[#8a4add]/20 flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                                        {createButton.text}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="animate-fade-in">
                            {isTeamOrdering && activeTab === 'teamMembers' ? <TeamOrderingPanel 
                                team={team}
                                handleSaveTeamOrder={handleSaveTeamOrder}
                                setIsTeamOrdering={setIsTeamOrdering}
                            /> : renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StudentDashboard: React.FC = () => {
    const { 
      user, courses, users,
      courseProgress, 
      showToast
    } = useAppContext();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('myCourses');
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [previousLevel, setPreviousLevel] = useState<string>('');
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);
    const [previousBadgesCount, setPreviousBadgesCount] = useState(0);

    if (!user) return null;
    
    const handleCourseNavigation = (course: Course) => {
        const firstLesson = course.modules?.[0]?.lessons?.[0];
        if (firstLesson) {
            navigate(`/course/${course.id}/lesson/${firstLesson.id}`);
        } else {
            // If no lessons, warn user but keep them in the workspace
            showToast("⚠️ Este curso ainda não tem aulas disponíveis.");
        }
    };

    const { inProgressCourses, completedCourses } = courseProgress;
    const latestInProgress = inProgressCourses.length > 0 ? inProgressCourses[0] : null;
    const nextLesson: Lesson | null = useMemo(() => {
      if (!latestInProgress) return null;
      const allLessons = latestInProgress.course.modules.flatMap(m => m.lessons);
      return allLessons.find(l => !user.completedLessonIds.includes(l.id)) || null;
    }, [latestInProgress, user.completedLessonIds]);
  
    // Combine in-progress and completed courses into a single list for "My Courses"
    const allMyCourses = useMemo(() => {
        return [
            ...inProgressCourses.map(c => ({...c.course, progress: c.progress, isEnrolled: true})), 
            ...completedCourses.map(c => ({...c, progress: 100, isEnrolled: true}))
        ];
    }, [inProgressCourses, completedCourses]);

    const OverviewContent = () => (
        <div className="space-y-8">
             {/* Welcome & Hero Section */}
             <div className="bg-gradient-to-r from-[#8a4add]/20 to-transparent p-8 rounded-2xl border border-[#8a4add]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#8a4add]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <h2 className="text-3xl font-black text-white mb-2 relative z-10">Olá, {user.name.split(' ')[0]}! 👋</h2>
                <p className="text-gray-300 text-lg relative z-10 max-w-xl">
                    Pronto para continuar sua jornada? O aprendizado é a única coisa que a mente nunca se cansa, nunca tem medo e nunca se arrepende.
                </p>
             </div>

            {/* Continue Learning Hero */}
             {latestInProgress && nextLesson ? (
              <div>
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Continue Estudando
                 </h3>
                 <div className="bg-[#121214] rounded-2xl border border-white/10 p-0 overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-black/50 group hover:border-[#8a4add]/30 transition-all">
                    <div className="w-full md:w-80 h-48 md:h-auto relative flex-shrink-0">
                        <img src={latestInProgress.course.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                             <span className="bg-[#8a4add] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shadow-lg">Em Andamento</span>
                        </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{latestInProgress.course.track}</p>
                                <h4 className="text-2xl font-bold text-white group-hover:text-[#c4b5fd] transition-colors">{latestInProgress.course.title}</h4>
                            </div>
                        </div>
                        
                        <div className="mt-4 mb-6">
                            <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                                <span>Próxima aula: <span className="text-white">{nextLesson.title}</span></span>
                                <span>{latestInProgress.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-1.5">
                                <div className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] h-full rounded-full" style={{ width: `${latestInProgress.progress}%` }}></div>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate(`/course/${latestInProgress.course.id}/lesson/${nextLesson.id}`)}
                            className="w-full md:w-fit bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Continuar Aula
                        </button>
                    </div>
                 </div>
              </div>
            ) : (
                 <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-2xl border border-indigo-500/30 p-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white">Comece algo novo hoje!</h3>
                        <p className="text-gray-300 mt-2 max-w-lg">Você ainda não iniciou nenhum curso. Explore nosso catálogo e dê o primeiro passo na sua carreira tech.</p>
                    </div>
                    <button onClick={() => setActiveTab('explore')} className="bg-white text-indigo-900 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg whitespace-nowrap">
                        Explorar Cursos
                    </button>
                </div>
            )}

            {/* My Courses Grid */}
            <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Meus Cursos</h3>
                 </div>
                 
                 {allMyCourses.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allMyCourses.map((course) => (
                            <CourseCard 
                                key={course.id} 
                                course={course} 
                                onCourseSelect={handleCourseNavigation} 
                                progress={course.progress}
                                isEnrolled={true}
                            />
                        ))}
                        
                        {/* "Find More" Card */}
                        <button 
                            onClick={() => setActiveTab('explore')}
                            className="border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 hover:bg-white/5 hover:border-white/20 transition-all group h-full min-h-[300px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </div>
                            <span className="text-gray-400 font-bold group-hover:text-white">Descobrir Novos Cursos</span>
                        </button>
                    </div>
                 ) : (
                    <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 border-dashed">
                        <p className="text-gray-400">Você ainda não está matriculado em nenhum curso.</p>
                    </div>
                 )}
            </div>
        </div>
    );
    
    const renderStudentContent = () => {
        switch(activeTab) {
            case 'myCourses': return <OverviewContent />;
            case 'trilhas': return <StudentTrilhasContent />;
            case 'leaderboard': return <LeaderboardContent />;
            case 'explore': return <ExploreCoursesPanel />;
            case 'forum': return <ForumView embedded={true} />;
            case 'blog-feed': return <Blog embedded={true} />;
            default: return <OverviewContent />;
        }
    }

    const StudentTrilhasContent = () => {
        const userId = user?.id || '';
        const { trilhas, projetos, loading } = useTrilhas();
        const { xp, nivel, streak, badges, enrollTrilha } = useProgresso(userId);

        // Detectar mudança de nível
        useMemo(() => {
            const currentNivel = user?.nivel || nivel;
            if (previousLevel && previousLevel !== currentNivel) {
                setShowLevelUpModal(true);
                setPreviousLevel(currentNivel);
            } else if (!previousLevel) {
                setPreviousLevel(currentNivel);
            }
        }, [user?.nivel, nivel, previousLevel]);

        // Detectar badge desbloqueada
        useMemo(() => {
            const currentBadgesCount = user?.achievements?.length || badges.length;
            if (previousBadgesCount > 0 && currentBadgesCount > previousBadgesCount) {
                // Nova badge foi desbloqueada
                // Encontrar qual é a nova (a última adicionada)
                const allBadges: Partial<Badge>[] = [
                    { id: 'first_lesson', titulo: 'Primeiro Passo', descricao: 'Completar a primeira aula', ícone: '👣' },
                    { id: 'level_up', titulo: 'Ascensão', descricao: 'Subir de nível', ícone: '⬆️' },
                    { id: 'course_completed', titulo: 'Conquistador', descricao: 'Completar um curso inteiro', ícone: '🏆' },
                    { id: 'week_streak', titulo: 'Consistência', descricao: '7 dias de streak', ícone: '🔥' },
                    { id: 'month_streak', titulo: 'Campeão', descricao: '30 dias de streak', ícone: '⭐' },
                ];
                const newBadgeId = (user?.achievements || badges)?.[currentBadgesCount - 1];
                const newBadgeInfo = allBadges.find(b => b.id === newBadgeId);
                if (newBadgeInfo) {
                    setUnlockedBadge(newBadgeInfo as Badge);
                    setShowBadgeModal(true);
                    showToast(`🏆 Badge Desbloqueada: ${newBadgeInfo.titulo}!`);
                }
            }
            setPreviousBadgesCount(currentBadgesCount);
        }, [user?.achievements, badges, previousBadgesCount, showToast]);

        if (loading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 border-r-2 border-pink-500 mx-auto mb-4" />
                        <p className="text-gray-400">Carregando trilhas...</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {/* Desafio Semanal */}
                <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/20 rounded-2xl p-6">
                    <h3 className="text-2xl font-black text-white mb-4">⚡ Desafio da Semana</h3>
                    <WeeklyChallengeSection userId={user?.id || ''} />
                </div>

                {/* Trilhas */}
                <DashboardTrilhasSection
                    userTrilhas={trilhas}
                    userProjetos={projetos}
                    userXP={user?.xp || xp || 0}
                    userStreak={user?.streak || streak || 0}
                    userBadges={user?.achievements || badges || []}
                    enrolledTrilhaIds={user?.enrolledCourseIds || []}
                    onEnroll={enrollTrilha}
                />
            </div>
        );
    }

    const LeaderboardContent = () => {
        const userId = user?.id || '';
        const allUsers = users || [];

        // Transformar usuários para formato do leaderboard
        const rankingUsers = allUsers
            .filter(u => u.role === 'student')
            .map((u, index) => ({
                userId: u.id,
                posicao: index + 1,
                nome: u.name,
                avatar: u.avatar || 'https://via.placeholder.com/50',
                xp: u.xp || 0,
                nivel: u.nivel || 'ovo',
                badge: u.achievements?.[0],
            }))
            .sort((a, b) => b.xp - a.xp)
            .map((u, index) => ({ ...u, posicao: index + 1 }));

        return (
            <div className="space-y-8">
                <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-2xl p-8">
                    <h2 className="text-3xl font-black text-white mb-2">🏆 Ranking Global</h2>
                    <p className="text-gray-400">Veja como você está em relação aos outros alunos</p>
                </div>

                <LeaderboardView
                    users={rankingUsers}
                    currentUserId={userId}
                    period="semana"
                    title="Top 10 Estudantes"
                    showCategoryFilter={false}
                />

                {/* Toast Notifications */}
                <div className="fixed bottom-6 right-6 space-y-3 pointer-events-none">
                    {/* Example: Toast messages will appear here */}
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#09090B]">
            <DashboardSidebar 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                userRole={user.role} 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
                 <DashboardHeader 
                    user={user} 
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                    title={tabTitles[activeTab] || 'Meu Aprendizado'}
                />
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto animate-fade-in">
                        {renderStudentContent()}
                    </div>
                </div>
            </div>

            {/* Level Up Celebration Modal */}
            <LevelUpCelebration
                isOpen={showLevelUpModal}
                newLevel={user?.nivel || 'ovo'}
                xpCurrent={user?.xp || 0}
                xpNextLevel={7000} // Next level XP threshold
                onClose={() => setShowLevelUpModal(false)}
            />

            {/* Badge Unlock Celebration Modal */}
            <BadgeUnlockCelebration
                isOpen={showBadgeModal}
                badge={unlockedBadge}
                onClose={() => setShowBadgeModal(false)}
            />
        </div>
    );
};

const Dashboard: React.FC = () => {
  const { user } = useAppContext();
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Carregando perfil...</div>;
  }
  return user.role === 'student' ? <StudentDashboard /> : <AdminDashboard />;
};

export default Dashboard;
