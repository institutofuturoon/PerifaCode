
import React, { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Achievement, Course, Lesson, MentorSession, User, Track, FinancialStatement, AnnualReport, Project } from '../types';
import ProgressBar from '../components/ProgressBar';
import { MOCK_ACHIEVEMENTS, MOCK_ANALYTICS_DATA_V2 } from '../constants';
import { useAppContext } from '../App';
import CourseCard from '../components/CourseCard';
import DashboardSidebar from '../components/DashboardSidebar';
import ForumView from './ForumView';
import MarketingGeneratorView from './MarketingGeneratorView';
import Blog from './Blog';

// --- Helper Components (Defined Outside) ---

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
    <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</span>
        <div className="text-gray-400">{icon}</div>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const TableHeader: React.FC<{ cols: string[] }> = ({ cols }) => (
    <thead className="bg-white/5 text-xs uppercase font-medium text-gray-400">
        <tr>
            {cols.map((col, i) => (
                <th key={i} className="px-6 py-3 text-left tracking-wider font-semibold border-b border-white/5">{col}</th>
            ))}
        </tr>
    </thead>
);

const DashboardHeader: React.FC<{ user: User | null, toggleSidebar: () => void, title: string }> = ({ user, toggleSidebar, title }) => {
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { handleLogout } = useAppContext();

    if (!user) return null;

    return (
        <header className="h-16 bg-[#09090B] border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-30 bg-opacity-90 backdrop-blur-md">
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

// --- Tab Components ---

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
        const firstLesson = course.modules?.[0]?.lessons?.[0];
        if (firstLesson) {
            navigate(`/course/${course.id}/lesson/${firstLesson.id}`);
        } else {
            showToast("⚠️ Este curso ainda não tem aulas disponíveis.");
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
                <div className="relative w-full md:flex-1">
                    <input 
                        type="search" 
                        placeholder="Buscar curso..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:ring-1 focus:ring-[#8a4add] focus:outline-none text-sm text-white"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                
                <div className="w-full md:w-auto relative">
                    <select 
                        value={activeTrack}
                        onChange={(e) => setActiveTrack(e.target.value)}
                        className="w-full md:w-48 appearance-none bg-black/30 text-gray-300 py-2 pl-4 pr-10 rounded-lg border border-white/10 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors focus:outline-none focus:border-[#8a4add] focus:text-white"
                    >
                        {tracks.map(track => (
                            <option key={track} value={track}>{track === 'Todos' ? 'Trilha: Todas' : track}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map(course => {
                    const { progress, isEnrolled } = getCourseProgress(course);
                    return (
                        <CourseCard 
                            key={course.id} 
                            course={course} 
                            onCourseSelect={handleCourseClick}
                            progress={progress}
                            isEnrolled={isEnrolled}
                        />
                    );
                })}
            </div>
            {filteredCourses.length === 0 && <div className="text-center py-20 text-gray-500">Nenhum curso encontrado.</div>}
        </div>
    );
};

const MyAgendaPanel: React.FC<{ user: User }> = ({ user }) => {
    const { mentorSessions, users, handleAddSessionSlot, handleRemoveSessionSlot } = useAppContext();
    
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
    
    const startEditing = (track: Track) => { setEditingTrack(track); setEditingName(track.name); };
    const cancelEditing = () => { setEditingTrack(null); setEditingName(''); };
    const handleUpdate = () => {
        if (!editingTrack || !editingName.trim()) return;
        if (editingTrack.name !== editingName.trim()) handleUpdateTrack(editingTrack.id, editingTrack.name, editingName.trim());
        cancelEditing();
    };

    return (
        <div className="bg-white/[0.02] rounded-xl border border-white/5 p-6">
             <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Gestão de Trilhas</h3>
             <div className="flex gap-3 mb-8">
                <input type="text" value={newTrackName} onChange={(e) => setNewTrackName(e.target.value)} placeholder="Nome da nova trilha..." className="flex-grow p-2.5 bg-black/20 rounded-md border border-white/10 focus:ring-1 focus:ring-[#8a4add] focus:outline-none text-sm text-white" />
                <button onClick={handleCreate} className="font-semibold py-2 px-6 rounded-md bg-[#8a4add] text-white hover:bg-[#7c3aed] text-sm">Adicionar</button>
            </div>
             <div className="grid gap-3">
                {tracks.map(track => (
                    <div key={track.id} className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors">
                        {editingTrack?.id === track.id ? (
                            <div className="flex gap-2 w-full mr-4">
                                <input type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)} className="flex-grow p-1.5 bg-black/30 rounded border border-[#8a4add] focus:outline-none text-sm text-white" autoFocus />
                            </div>
                        ) : (
                            <div>
                                <p className="font-medium text-white text-sm">{track.name}</p>
                                <p className="text-[10px] text-gray-500">{courses.filter(c => c.track === track.name).length} cursos</p>
                            </div>
                        )}
                        <div className="flex gap-3 items-center">
                            {editingTrack?.id === track.id ? (
                                <><button onClick={handleUpdate} className="text-xs text-green-400 hover:text-green-300 font-medium">Salvar</button><button onClick={cancelEditing} className="text-xs text-gray-400 hover:text-gray-300">Cancelar</button></>
                            ) : (
                                <><button onClick={() => startEditing(track)} className="text-xs text-gray-400 hover:text-white">Editar</button><button onClick={() => handleDeleteTrack(track.id)} className="text-xs text-red-400 hover:text-red-300">Excluir</button></>
                            )}
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};

// --- Main Dashboard Component ---

const Dashboard: React.FC = () => {
    const { 
        user, users, courses, articles, team, events,
        handleDeleteArticle, handleToggleArticleStatus,
        handleDeleteUser, handleDeleteCourse, handleDeleteEvent
    } = useAppContext();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Update active tab if user changes (e.g. login/logout)
    React.useEffect(() => {
        if (user) {
            setActiveTab(prev => prev === 'overview' ? 'overview' : prev);
        }
    }, [user]);

    // -- SAFE HOOKS EXECUTION (No early returns here) --

    // Filter data strictly using safe logic (handle null user)
    const coursesForUser = useMemo(() => {
        if (!user) return [];
        return user.role === 'admin' ? courses : courses.filter(c => c.instructorId === user.id);
    }, [user, courses]);

    const articlesForUser = useMemo(() => {
        if (!user) return [];
        return user.role === 'admin' ? articles : articles.filter(a => a.author === user.name);
    }, [user, articles]);

    // Tab Titles Map
    const tabTitles: Record<string, string> = {
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

    // Handlers
    const handleCreateCourse = () => navigate('/admin/course-editor/new');
    const handleEditCourse = (id: string) => navigate(`/admin/course-editor/${id}`);
    
    // Renderers
    const renderOverview = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Meus Cursos" value={coursesForUser.length} icon="📚" />
            <StatCard title="Alunos Ativos" value={MOCK_ANALYTICS_DATA_V2.totalStudents} icon="👥" />
            <StatCard title="Engajamento" value={`${MOCK_ANALYTICS_DATA_V2.weeklyEngagement}%`} icon="🔥" />
            <StatCard title="Artigos" value={articlesForUser.length} icon="✍️" />
        </div>
    );

    const renderCoursesManagement = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Gerenciar Cursos</h2>
                <button onClick={handleCreateCourse} className="bg-[#8a4add] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                    <span>+</span> Novo Curso
                </button>
            </div>
            
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
                                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-0.5 inline-flex text-[10px] font-bold uppercase tracking-wider rounded border bg-[#8a4add]/10 text-[#c4b5fd] border-[#8a4add]/20">{course.track}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-4">
                                            <button onClick={() => navigate(`/admin/instructor-dashboard/${course.id}`)} className="text-gray-400 hover:text-white transition-colors">Painel</button>
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
        </div>
    );

    const renderStudentCourses = () => {
        if (!user) return null;
        const myCourseIds = user.completedLessonIds; 
        const myCourses = courses.filter(c => c.modules.some(m => m.lessons.some(l => myCourseIds.includes(l.id))));
        
        return (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Meus Cursos em Andamento</h2>
                {myCourses.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 border-dashed">
                        <p className="text-gray-400 mb-4">Você ainda não iniciou nenhum curso.</p>
                        <button onClick={() => setActiveTab('explore')} className="text-[#c4b5fd] hover:underline font-bold">Explorar Catálogo</button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myCourses.map(course => (
                            <CourseCard key={course.id} course={course} onCourseSelect={(c) => navigate(`/course/${c.id}/lesson/${c.modules[0].lessons[0].id}`)} progress={35} isEnrolled={true} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // --- FINAL GUARD CLAUSE ---
    // Only return null here, AFTER all hooks have run.
    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#09090B] flex">
            <DashboardSidebar 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                userRole={user.role} 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />

            <div className="flex-1 flex flex-col min-w-0 md:pl-64 transition-all duration-300">
                <DashboardHeader user={user} toggleSidebar={() => setIsSidebarOpen(true)} title={tabTitles[activeTab]} />
                
                <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'courses' && renderCoursesManagement()}
                        {activeTab === 'myCourses' && renderStudentCourses()}
                        {activeTab === 'explore' && <ExploreCoursesPanel />}
                        {activeTab === 'forum' && <ForumView embedded />}
                        {activeTab === 'marketing' && <MarketingGeneratorView />}
                        {activeTab === 'blog' && <div className="text-gray-400">Gestão de Blog (Use a tabela antiga se necessário ou crie componente separado)</div>}
                        {activeTab === 'blog-feed' && <Blog embedded />}
                        {activeTab === 'myAgenda' && <MyAgendaPanel user={user} />}
                        {activeTab === 'tracks' && <TracksManagementPanel />}
                        
                        {/* Fallback for other tabs */}
                        {!['overview', 'courses', 'myCourses', 'explore', 'forum', 'marketing', 'blog', 'blog-feed', 'myAgenda', 'tracks'].includes(activeTab) && (
                            <div className="text-center py-20 text-gray-500">Funcionalidade em desenvolvimento: {tabTitles[activeTab]}</div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
