
import React, { useMemo, useState, useRef, useEffect } from 'react';
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

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color?: string }> = ({ title, value, icon, color = "text-white" }) => (
  <div className="bg-[#121212] p-5 rounded-2xl border border-white/10 hover:border-[#8a4add]/30 transition-all group">
    <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-[#c4b5fd] group-hover:bg-[#8a4add]/10 transition-colors">{icon}</div>
    </div>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
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
                {/* Gamification Badges (Visible on Desktop) */}
                <div className="hidden md:flex items-center gap-3 mr-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold" title="Ofensiva">
                        <span>🔥</span> {user.streak}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8a4add]/10 border border-[#8a4add]/20 text-[#c4b5fd] text-xs font-bold" title="XP Total">
                        <span>⚡</span> {user.xp}
                    </div>
                </div>

                <div className="relative">
                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 hover:bg-white/5 py-1.5 px-2 rounded-full transition-colors">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-white">{user.name}</p>
                            <p className="text-[10px] text-gray-500 capitalize">{user.role === 'student' ? 'Aluno' : user.role === 'instructor' ? 'Instrutor' : 'Admin'}</p>
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

const StudentsPanel: React.FC = () => {
    const { users, handleDeleteUser, user } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const students = useMemo(() => users.filter(u => u.role === 'student'), [users]);
    
    const filteredStudents = useMemo(() => students.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [students, searchTerm]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Base de Alunos</h2>
                    <p className="text-xs text-gray-400 mt-1">Total: {students.length} alunos cadastrados</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/user-editor/new')}
                    className="bg-[#8a4add] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-[#8a4add]/20"
                >
                    <span>+</span> Matricular Aluno
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <input 
                    type="search" 
                    placeholder="Buscar aluno por nome ou email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#8a4add] focus:outline-none text-sm text-white transition-colors"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            {/* Table */}
            <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <TableHeader cols={['Aluno', 'Email', 'Status', 'XP', 'Ações']} />
                        <tbody className="divide-y divide-white/5">
                            {filteredStudents.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-500 text-sm">Nenhum aluno encontrado.</td></tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img src={student.avatarUrl} className="h-8 w-8 rounded-full border border-white/10" alt={student.name} />
                                                <div className="text-sm font-medium text-white">{student.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{student.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 inline-flex text-[10px] font-bold uppercase tracking-wider rounded border ${student.accountStatus === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                {student.accountStatus === 'active' ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#c4b5fd] font-bold">{student.xp.toLocaleString('pt-BR')} XP</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                                            <button onClick={() => navigate(`/admin/user-editor/${student.id}`)} className="text-blue-400 hover:text-blue-300 transition-colors">Editar</button>
                                            {user?.role === 'admin' && (
                                                <button onClick={() => handleDeleteUser(student.id)} className="text-red-500 hover:text-red-400 transition-colors">Desativar</button>
                                            )}
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
};

const ExploreCoursesPanel: React.FC = () => {
    const { courses, user, showToast } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTrack, setActiveTrack] = useState('Todos');
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTrack]);

    const tracks = useMemo(() => ['Todos', ...Array.from(new Set(courses.map(c => c.track)))].sort(), [courses]);

    const filteredCourses = useMemo(() => courses.filter(course => 
        (course.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (activeTrack === 'Todos' || course.track === activeTrack)
    ), [courses, searchTerm, activeTrack]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    const currentCourses = filteredCourses.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll suave para o topo da lista
        document.getElementById('workspace-catalog')?.scrollIntoView({ behavior: 'smooth' });
    };

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
        <div className="space-y-6" id="workspace-catalog">
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

            {/* Header info */}
            <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-bold text-white">Catálogo de Cursos</h2>
                <p className="text--[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {filteredCourses.length} resultados
                </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentCourses.map(course => {
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
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10 pb-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        &larr;
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1;
                        // Logic to show limited pages (simplified for dashboard)
                        if (totalPages > 7 && (page < currentPage - 1 || page > currentPage + 1) && page !== 1 && page !== totalPages) {
                            if (page === currentPage - 2 || page === currentPage + 2) return <span key={page} className="text-gray-600">...</span>;
                            return null;
                        }

                        return (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all border ${
                                    currentPage === page 
                                    ? 'bg-[#8a4add] text-white border-[#8a4add] shadow-lg shadow-[#8a4add]/20' 
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        &rarr;
                    </button>
                </div>
            )}

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
                                <p className="text-sm text-gray-500">{courses.filter(c => c.track === track.name).length} cursos</p>
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

// --- Student Overview Component (NEW) ---
const StudentOverview: React.FC<{ user: User }> = ({ user }) => {
    const { courses, courseProgress, events, mentorSessions, showToast, users } = useAppContext();
    const navigate = useNavigate();

    // 1. Get Current Course (Last active or most progress)
    const currentActive = useMemo(() => {
        if (courseProgress.inProgressCourses.length === 0) return null;
        return courseProgress.inProgressCourses.sort((a, b) => b.progress - a.progress)[0];
    }, [courseProgress]);

    // 2. Get Next Upcoming Mentorship
    const nextMentorship = useMemo(() => {
        const mySessions = mentorSessions.filter(s => s.studentId === user.id && s.isBooked);
        // Filter for future sessions
        const now = new Date();
        const futureSessions = mySessions.filter(s => new Date(`${s.date}T${s.time}`) > now);
        // Sort by date
        return futureSessions.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())[0];
    }, [mentorSessions, user.id]);

    // 3. Get Next Upcoming Event
    const nextEvent = useMemo(() => {
        return events.find(e => !e.date.includes('2023')) || events[0];
    }, [events]);

    // Determine what to show in the "Agenda" card
    const agendaItem = useMemo(() => {
        if (nextMentorship) {
            const mentor = users.find(u => u.id === nextMentorship.mentorId);
            return {
                type: 'mentorship',
                title: `Mentoria com ${mentor?.name || 'Mentor'}`,
                date: nextMentorship.date,
                time: nextMentorship.time,
                description: 'Prepare suas dúvidas e boa aula!',
                image: mentor?.avatarUrl || '',
                link: nextMentorship.googleMeetUrl,
                isMentorship: true
            };
        } else if (nextEvent) {
            return {
                type: 'event',
                title: nextEvent.title,
                date: nextEvent.date,
                time: nextEvent.time,
                description: nextEvent.description,
                image: nextEvent.imageUrl,
                link: `/event/${nextEvent.id}`,
                isMentorship: false
            };
        }
        return null;
    }, [nextMentorship, nextEvent, users]);

    const handleContinue = () => {
        if (currentActive) {
            // Find first incomplete lesson
            const course = currentActive.course;
            const allLessons = course.modules.flatMap(m => m.lessons);
            const firstUnfinished = allLessons.find(l => !user.completedLessonIds.includes(l.id));
            
            if (firstUnfinished) {
                navigate(`/course/${course.id}/lesson/${firstUnfinished.id}`);
            } else {
                // Course finished? Go to detail
                navigate(`/course/${course.id}`);
            }
        } else {
            // No active course, go to catalog
            navigate('/courses'); // Or explore tab
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            
            {/* 1. Hero / Continue Learning */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-r from-[#121212] to-[#1a1a1d] rounded-2xl border border-white/10 p-8 relative overflow-hidden shadow-2xl">
                    {/* Abstract Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#8a4add]/10 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/5">
                                {currentActive ? 'Em Andamento' : 'Comece Agora'}
                            </span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                            {currentActive ? currentActive.course.title : 'Sua jornada começa aqui'}
                        </h2>
                        <p className="text-gray-400 mb-8 text-sm md:text-base max-w-lg">
                            {currentActive 
                                ? `Você completou ${currentActive.progress}% deste curso. Continue de onde parou para manter o ritmo!` 
                                : 'Escolha uma trilha e dê o primeiro passo para transformar seu futuro.'}
                        </p>

                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleContinue}
                                className="bg-[#8a4add] hover:bg-[#7c3aed] text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-[#8a4add]/20 transition-all transform hover:scale-105 flex items-center gap-2"
                            >
                                {currentActive ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                        Continuar Aula
                                    </>
                                ) : (
                                    <>Explorar Cursos</>
                                )}
                            </button>
                            {currentActive && (
                                <div className="flex-1 max-w-[200px]">
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>Progresso</span>
                                        <span className="text-white font-bold">{currentActive.progress}%</span>
                                    </div>
                                    <div className="w-full bg-black/40 rounded-full h-2 border border-white/5">
                                        <div className="bg-gradient-to-r from-[#8a4add] to-[#f27983] h-2 rounded-full transition-all duration-500" style={{width: `${currentActive.progress}%`}}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Next Event / Agenda */}
                <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">
                            {agendaItem?.isMentorship ? 'Próxima Mentoria' : 'Próximo Evento'}
                        </h3>
                        <button onClick={() => navigate('/connect')} className="text-xs text-[#c4b5fd] hover:text-white font-semibold">Ver Agenda</button>
                    </div>
                    
                    {agendaItem ? (
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="aspect-video rounded-lg overflow-hidden relative mb-4 group cursor-pointer" onClick={() => agendaItem.link && !agendaItem.isMentorship ? navigate(agendaItem.link) : null}>
                                <img src={agendaItem.image || 'https://via.placeholder.com/300x150'} alt={agendaItem.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white border border-white/10">
                                    {agendaItem.date} • {agendaItem.time}
                                </div>
                            </div>
                            <h4 className="text-white font-bold text-sm line-clamp-1 mb-1">{agendaItem.title}</h4>
                            <p className="text-gray-500 text-xs mb-4 line-clamp-2">{agendaItem.description}</p>
                            
                            {agendaItem.isMentorship ? (
                                <a 
                                    href={agendaItem.link || '#'} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-colors text-center block"
                                >
                                    Acessar Sala (Meet)
                                </a>
                            ) : (
                                <button onClick={() => navigate(agendaItem.link!)} className="w-full py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-bold transition-colors">
                                    Ver Detalhes
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-center text-gray-500 text-xs">
                            Nenhum compromisso agendado.
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Nível" value="Iniciado" icon="🌱" color="text-green-400" />
                <StatCard title="XP Total" value={user.xp} icon="⚡" color="text-yellow-400" />
                <StatCard title="Ofensiva" value={`${user.streak} dias`} icon="🔥" color="text-orange-500" />
                <StatCard title="Concluídos" value={courseProgress.completedCourses.length} icon="🏆" color="text-[#c4b5fd]" />
            </div>

            {/* 4. Quick Access Grid */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Acesso Rápido</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => navigate('/community')} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-[#8a4add]/30 transition-all text-left group">
                        <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">💬</span>
                        <span className="text-sm font-bold text-white block">Comunidade</span>
                        <span className="text-xs text-gray-500">Tire dúvidas no fórum</span>
                    </button>
                    <button onClick={() => showToast("Certificados disponíveis na página do curso!")} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-[#8a4add]/30 transition-all text-left group">
                        <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📜</span>
                        <span className="text-sm font-bold text-white block">Certificados</span>
                        <span className="text-xs text-gray-500">Suas conquistas</span>
                    </button>
                    <button onClick={() => navigate('/profile')} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-[#8a4add]/30 transition-all text-left group">
                        <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">👤</span>
                        <span className="text-sm font-bold text-white block">Meu Perfil</span>
                        <span className="text-xs text-gray-500">Editar dados</span>
                    </button>
                    <button onClick={() => navigate('/connect')} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-[#8a4add]/30 transition-all text-left group">
                        <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🤝</span>
                        <span className="text-sm font-bold text-white block">Mentorias</span>
                        <span className="text-xs text-gray-500">Fale com experts</span>
                    </button>
                </div>
            </div>

        </div>
    );
};

// --- Teacher Overview Component (NEW) ---
const TeacherOverview: React.FC<{ user: User }> = ({ user }) => {
    const { courses, mentorSessions, communityPosts, navigate, users } = useAppContext();

    const myCourses = useMemo(() => courses.filter(c => c.instructorId === user.id), [courses, user.id]);
    const mySessions = useMemo(() => mentorSessions.filter(s => s.mentorId === user.id && !s.isBooked), [mentorSessions, user.id]); // Upcoming free slots
    const bookedSessions = useMemo(() => mentorSessions.filter(s => s.mentorId === user.id && s.isBooked), [mentorSessions, user.id]);
    
    // Calc stats
    const totalStudents = useMemo(() => {
        // Mock: In real app, fetch enrollments. Here we sum distinct students from mock analytics or fallback
        return 120; // Mock value for UI demo
    }, []);

    const pendingQuestions = useMemo(() => {
        return communityPosts.filter(p => p.type === 'question' && !p.isSolved).slice(0, 3);
    }, [communityPosts]);

    const atRiskStudents = useMemo(() => MOCK_ANALYTICS_DATA_V2.studentEngagement.atRiskStudents.slice(0, 4), []);

    return (
        <div className="space-y-8 animate-fade-in">
            
            {/* 1. Hero: Next Appointment */}
            <div className="bg-gradient-to-r from-[#121212] to-[#1a1a1d] rounded-2xl border border-white/10 p-8 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#8a4add]/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-2">Olá, Professor {user.name.split(' ')[0]}!</h2>
                        <p className="text-gray-400">Próximo compromisso na agenda:</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 w-full md:w-auto">
                        <div className="bg-[#8a4add] p-3 rounded-lg text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-xs text-[#c4b5fd] font-bold uppercase">Mentoria Individual</p>
                            <p className="text-white font-bold">Hoje, 15:00</p>
                            <p className="text-xs text-gray-400">com João Silva</p>
                        </div>
                        <button className="ml-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors">
                            Entrar na Sala
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Meus Alunos" value={totalStudents} icon="👨‍🎓" color="text-white" />
                <StatCard title="Pendências" value="5" icon="📝" color="text-yellow-400" />
                <StatCard title="Dúvidas" value={pendingQuestions.length} icon="💬" color="text-orange-400" />
                <StatCard title="Nota Média" value="4.8" icon="⭐" color="text-[#c4b5fd]" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* 3. Centro de Atenção (Left - 2 cols) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* At Risk Students */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="bg-red-500/10 text-red-400 p-1 rounded">🚨</span> Alunos em Risco
                            </h3>
                            <button className="text-xs text-[#c4b5fd] hover:underline">Ver todos</button>
                        </div>
                        <div className="space-y-3">
                            {atRiskStudents.map(student => (
                                <div key={student.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <img src={student.avatarUrl} className="h-10 w-10 rounded-full border border-white/10" alt={student.name} />
                                        <div>
                                            <p className="text-sm font-bold text-white">{student.name}</p>
                                            <p className="text-xs text-red-400">Ausente há {student.lastLoginDaysAgo} dias</p>
                                        </div>
                                    </div>
                                    <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors">
                                        Contatar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Forum Questions */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-orange-500/10 text-orange-400 p-1 rounded">💬</span> Dúvidas Recentes
                        </h3>
                        {pendingQuestions.length > 0 ? (
                            <div className="space-y-3">
                                {pendingQuestions.map(post => (
                                    <div key={post.id} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 transition-colors cursor-pointer" onClick={() => navigate(`/community/post/${post.id}`)}>
                                        <p className="text-sm font-medium text-white line-clamp-1">{post.title}</p>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{post.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">Nenhuma dúvida pendente. Bom trabalho!</p>
                        )}
                    </div>

                </div>

                {/* 4. Sidebar (Right - 1 col) */}
                <div className="space-y-6">
                    
                    {/* My Courses Shortcuts */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Meus Cursos</h3>
                        <div className="space-y-3">
                            {myCourses.length > 0 ? myCourses.map(course => (
                                <div key={course.id} className="group relative overflow-hidden rounded-xl aspect-video bg-gray-800 cursor-pointer" onClick={() => navigate(`/admin/instructor-dashboard/${course.id}`)}>
                                    <img src={course.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt={course.title} />
                                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                        <p className="text-white font-bold text-sm leading-tight">{course.title}</p>
                                        <p className="text-[10px] text-gray-300 mt-1">Gerenciar Turma &rarr;</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-500">Você não tem cursos atribuídos.</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Ações Rápidas</h3>
                        <div className="space-y-2">
                            <button onClick={() => navigate('/myAgenda')} className="w-full text-left p-2 text-sm text-white hover:bg-white/5 rounded transition-colors flex items-center gap-2">
                                📅 Gerenciar Agenda
                            </button>
                            <button onClick={() => navigate('/admin/course-editor/new')} className="w-full text-left p-2 text-sm text-white hover:bg-white/5 rounded transition-colors flex items-center gap-2">
                                ➕ Criar Novo Conteúdo
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}


// --- Main Dashboard Component ---

const Dashboard: React.FC = () => {
    const { 
        user, users, courses, articles, team, events,
        handleDeleteArticle, handleToggleArticleStatus,
        handleDeleteUser, handleDeleteCourse, handleDeleteEvent,
        handleSaveCourse, loadData
    } = useAppContext();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- CRITICAL: Load all resources needed for the Dashboard on mount ---
    useEffect(() => {
        if (user) {
            loadData([
                'users', 'courses', 'articles', 'projects', 'communityPosts', 
                'events', 'mentorSessions', 'tracks', 'marketingPosts'
            ]);
        }
    }, [user, loadData]);

    // Update active tab if user changes (e.g. login/logout)
    useEffect(() => {
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
    
    const handleDuplicateCourse = (originalCourse: Course) => {
        if (!window.confirm(`Deseja criar uma cópia de "${originalCourse.title}"?`)) return;

        const timestamp = Date.now();
        
        const newModules = originalCourse.modules.map(m => ({
            ...m,
            id: `mod_${timestamp}_${Math.random().toString(36).substr(2, 5)}`,
            lessons: m.lessons.map(l => ({
                ...l,
                id: `les_${timestamp}_${Math.random().toString(36).substr(2, 5)}`
            }))
        }));

        const newCourse: Course = {
            ...originalCourse,
            id: `course_${timestamp}`,
            title: `${originalCourse.title} (Cópia)`,
            slug: `${originalCourse.slug || originalCourse.id}-copy-${timestamp}`,
            modules: newModules,
            enrollmentStatus: 'closed', // Start as closed/draft
            seo: {
                ...originalCourse.seo,
                metaTitle: `${originalCourse.seo?.metaTitle || originalCourse.title} (Cópia)`
            }
        };

        handleSaveCourse(newCourse);
    };

    // Renderers
    const renderAdminOverview = () => (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total de Alunos" value={MOCK_ANALYTICS_DATA_V2.totalStudents.toLocaleString('pt-BR')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <StatCard title="Novos Alunos (30d)" value={`+${MOCK_ANALYTICS_DATA_V2.newStudentsLast30d}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>} />
                <StatCard title="Taxa de Conclusão" value={`${MOCK_ANALYTICS_DATA_V2.avgCompletionRate}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Engajamento" value={`${MOCK_ANALYTICS_DATA_V2.weeklyEngagement}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity / Quick Actions */}
                <div className="lg:col-span-2 bg-[#121212] border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Atividades Recentes</h3>
                        <button onClick={() => navigate('/analytics')} className="text-xs text-[#c4b5fd] hover:text-white font-bold uppercase">Ver Relatório Completo</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">🎉</div>
                            <div>
                                <p className="text-sm font-bold text-white">Novo Curso Publicado</p>
                                <p className="text-xs text-gray-400">Curso "React Avançado" está disponível.</p>
                            </div>
                            <span className="ml-auto text-xs text-gray-500">2h atrás</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">👤</div>
                            <div>
                                <p className="text-sm font-bold text-white">5 Novos Alunos</p>
                                <p className="text-xs text-gray-400">Matrículas confirmadas na trilha Backend.</p>
                            </div>
                            <span className="ml-auto text-xs text-gray-500">5h atrás</span>
                        </div>
                    </div>
                </div>

                {/* At Risk Students Mini-Widget */}
                <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">⚠️ Atenção Necessária</h3>
                    <p className="text-xs text-gray-400 mb-4">Alunos sem acesso há mais de 10 dias.</p>
                    <ul className="space-y-3">
                        {MOCK_ANALYTICS_DATA_V2.studentEngagement.atRiskStudents.slice(0, 3).map(student => (
                            <li key={student.id} className="flex items-center gap-3">
                                <img src={student.avatarUrl} alt={student.name} className="h-8 w-8 rounded-full opacity-60" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{student.name}</p>
                                    <p className="text-xs text-red-400">{student.lastLoginDaysAgo} dias off</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => navigate('/analytics')} className="w-full mt-6 py-2 text-xs font-bold text-center text-gray-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        Ver Lista Completa
                    </button>
                </div>
            </div>
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
                                            <button onClick={() => navigate(`/admin/instructor-dashboard/${course.id}`)} className="text-gray-400 hover:text-white transition-colors" title="Ver Painel da Turma">Painel</button>
                                            <button onClick={() => handleDuplicateCourse(course)} className="text-purple-400 hover:text-purple-300 transition-colors" title="Duplicar Curso">Duplicar</button>
                                            <button onClick={() => handleEditCourse(course.id)} className="text-blue-400 hover:text-blue-300 transition-colors">Editar</button>
                                            <button onClick={() => handleDeleteCourse(course.id)} className="text-red-500 hover:text-red-400 transition-colors">Excluir</button>
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
        const myCourses = courses.filter(c => c.modules.some(m => m.lessons.some(l => l.id && myCourseIds.includes(l.id)))) || [];
        
        // Fallback: if user has completed lessons but we can't match courses efficiently or array is empty, show active enrollments logic if available.
        // For MVP: simple logic
        
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

    const renderOverview = () => {
        if (user.role === 'student') return <StudentOverview user={user} />;
        if (user.role === 'instructor') return <TeacherOverview user={user} />;
        return renderAdminOverview();
    };

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
                        {/* CONDITIONAL OVERVIEW */}
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
                        {activeTab === 'students' && <StudentsPanel />}
                        
                        {/* Fallback for other tabs */}
                        {!['overview', 'courses', 'myCourses', 'explore', 'forum', 'marketing', 'blog', 'blog-feed', 'myAgenda', 'tracks', 'students'].includes(activeTab) && (
                            <div className="text-center py-20 text-gray-500">Funcionalidade em desenvolvimento: {tabTitles[activeTab]}</div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
