
import React, { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Achievement, Course, Lesson, MentorSession, User, Track, FinancialStatement, AnnualReport, Project } from '../types';
import ProgressBar from '../components/ProgressBar';
import { MOCK_ACHIEVEMENTS, MOCK_ANALYTICS_DATA_V2 } from '../constants';
import { useAppContext } from '../App';
import CourseCard from '../components/CourseCard';
import OnsiteCourseCard from '../components/OnsiteCourseCard';
import PageLayout from '../components/PageLayout';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-black/20 backdrop-blur-xl p-4 rounded-lg border border-white/10">
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-gradient-to-br from-[#6d28d9] to-[#8a4add] flex items-center justify-center shadow-lg shadow-[#8a4add]/20">
        <span className="transform scale-75">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{title}</p>
        <p className="text-xl font-black text-white leading-none mt-0.5">{value}</p>
      </div>
    </div>
  </div>
);

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
      <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 p-4">
          <h3 className="text-base font-bold text-white mb-3">Gerenciar meus horários</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {next7Days.map(day => {
                  const dateKey = day.toISOString().split('T')[0];
                  return (
                      <div key={dateKey}>
                          <div className="p-1.5 rounded-t-md bg-white/10 text-center"><p className="font-bold text-white text-xs">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</p><p className="text-[9px] text-gray-300">{day.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</p></div>
                          <div className="p-1 space-y-1 bg-white/5 rounded-b-md">
                              {timeSlots.map(time => {
                                  const session = sessionsByDateTime.get(`${dateKey}-${time}`);
                                  const student = session?.studentId ? users.find(u => u.id === session.studentId) : null;
                                  if (session?.isBooked && student) {
                                      return (<div key={time} className="w-full text-[9px] p-1 rounded bg-red-500/20 text-red-300 text-center"><p className="font-bold">Ocupado</p><p className="truncate">{student.name.split(' ')[0]}</p>{session.googleMeetUrl && <a href={session.googleMeetUrl} target="_blank" rel="noopener noreferrer" className="text-[#c4b5fd] hover:underline block mt-0.5">Link</a>}</div>);
                                  }
                                  if (session && !session.isBooked) {
                                      return (<button key={time} onClick={() => handleRemoveSessionSlot(user.id, dateKey, time)} className="w-full text-[9px] font-semibold p-1 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors">Livre</button>);
                                  }
                                  return (<button key={time} onClick={() => handleAddSessionSlot(user.id, dateKey, time)} className="w-full text-[9px] font-semibold p-1 rounded bg-gray-700/30 text-gray-500 hover:bg-gray-600/50 transition-colors">{time}</button>);
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
      <div className="bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 p-4">
          <h3 className="text-base font-bold text-white mb-2">Ordenar Membros</h3>
          <p className="text-xs text-gray-400 mb-4">Arraste e solte para reordenar.</p>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {orderedMembers.map((member, index) => (
                  <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 bg-white/5 rounded-md border border-white/10 cursor-grab active:cursor-grabbing"
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnter={(e) => handleDragEnter(e, index)}
                      onDragEnd={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                  >
                      <span className="text-gray-500 font-mono text-sm w-5 text-center">{index + 1}</span>
                      <img src={member.avatarUrl} alt={member.name} className="h-6 w-6 rounded-full object-cover" />
                      <div>
                          <p className="font-semibold text-white text-xs">{member.name}</p>
                      </div>
                  </div>
              ))}
          </div>
          <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setIsTeamOrdering(false)} className="bg-white/10 text-white font-semibold py-1.5 px-4 rounded-md hover:bg-white/20 text-xs">Cancelar</button>
              <button type="button" onClick={handleSave} className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-1.5 px-4 rounded-md hover:opacity-90 text-xs">Salvar</button>
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
        <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 p-4 space-y-4">
            <div>
                <h3 className="text-sm font-bold text-white mb-2">Adicionar Trilha</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTrackName}
                        onChange={(e) => setNewTrackName(e.target.value)}
                        placeholder="Nome..."
                        className="flex-grow p-1.5 bg-white/5 rounded-md border border-white/10 focus:ring-1 focus:ring-[#8a4add] focus:outline-none text-xs text-white"
                    />
                    <button onClick={handleCreate} className="font-semibold py-1.5 px-3 rounded-md bg-[#8a4add] text-white hover:bg-[#6d28d9] text-xs">
                        Adicionar
                    </button>
                </div>
            </div>

            <div>
                 <h3 className="text-sm font-bold text-white mb-2">Trilhas Existentes</h3>
                 <div className="space-y-1.5">
                    {tracks.length === 0 ? (
                        <p className="text-gray-400 text-xs">Nenhuma trilha cadastrada.</p>
                    ) : (
                        tracks.map(track => (
                            <div key={track.id} className="bg-white/5 p-2 rounded-md flex justify-between items-center">
                                {editingTrack?.id === track.id ? (
                                    <input 
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        className="p-1 bg-white/10 rounded border border-[#8a4add] focus:outline-none text-xs text-white w-full mr-2"
                                        autoFocus
                                    />
                                ) : (
                                    <div className="flex-1">
                                        <p className="font-semibold text-white text-xs">{track.name}</p>
                                        <p className="text-[9px] text-gray-400">{getCoursesCountInTrack(track.name)} curso(s)</p>
                                    </div>
                                )}
                                <div className="flex gap-2 flex-shrink-0">
                                    {editingTrack?.id === track.id ? (
                                        <>
                                            <button onClick={handleUpdate} className="text-[10px] text-green-400 hover:text-green-300">Salvar</button>
                                            <button onClick={cancelEditing} className="text-[10px] text-gray-400 hover:text-gray-300">Cancelar</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => startEditing(track)} className="text-[10px] text-[#c4b5fd] hover:text-white">Editar</button>
                                            <button onClick={() => handleDeleteTrack(track.id)} className="text-[10px] text-red-400 hover:text-red-300">Excluir</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                 </div>
            </div>
        </div>
    );
};

const ModerationPanel: React.FC = () => {
    const { projects, users, handleApproveProject, handleRejectProject } = useAppContext();
    const navigate = useNavigate();

    const pendingProjects = useMemo(() => projects.filter(p => p.status === 'pending'), [projects]);

    return (
        <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 p-4">
             <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-base font-bold text-white">Moderação de Projetos</h3>
                </div>
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-[10px] font-semibold border border-yellow-500/30">
                    {pendingProjects.length} Pendentes
                </span>
             </div>

             <div className="space-y-3">
                {pendingProjects.length === 0 ? (
                    <div className="text-center py-6 bg-white/5 rounded-lg border border-white/10">
                         <p className="text-gray-400 text-xs">Nenhum projeto aguardando.</p>
                    </div>
                ) : (
                    pendingProjects.map(project => {
                        const author = users.find(u => u.id === project.authorId);
                        return (
                            <div key={project.id} className="bg-white/5 p-3 rounded-lg border border-white/10 flex flex-col md:flex-row gap-3">
                                <div className="w-full md:w-24 flex-shrink-0">
                                    <img src={project.imageUrl} alt={project.title} className="w-full h-16 object-cover rounded-md border border-white/10" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-bold text-white truncate">{project.title}</h4>
                                        <span className="text-[9px] text-gray-500 whitespace-nowrap ml-2">{project.createdAt}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5 mb-1.5">
                                        <img src={author?.avatarUrl} className="w-3 h-3 rounded-full" alt="" />
                                        <span className="text-[10px] text-[#c4b5fd]">{author?.name}</span>
                                    </div>
                                    <p className="text-gray-400 text-[10px] mb-1 line-clamp-1">{project.description}</p>
                                    <div className="flex gap-2 text-[10px]">
                                        <a href={project.repoUrl} target="_blank" rel="noopener" className="text-blue-400 hover:underline">Repo</a>
                                        <span className="text-gray-600">|</span>
                                        <a href={project.liveUrl} target="_blank" rel="noopener" className="text-blue-400 hover:underline">Live</a>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col gap-2 justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-3">
                                    <button onClick={() => handleApproveProject(project.id)} className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-md text-[10px] font-semibold transition-colors w-full md:w-auto">
                                        Aprovar
                                    </button>
                                    <button onClick={() => navigate(`/project/edit/${project.id}`)} className="bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-md text-[10px] font-semibold transition-colors w-full md:w-auto">
                                        Editar
                                    </button>
                                    <button onClick={() => handleRejectProject(project.id)} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-2 py-1 rounded-md text-[10px] font-semibold transition-colors w-full md:w-auto">
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

const AdminDashboard: React.FC = () => {
    const { 
      user, users, courses, articles, team, events, mentorSessions, financialStatements, annualReports,
      handleDeleteArticle, handleToggleArticleStatus,
      handleDeleteUser, handleSaveTeamOrder,
      handleAddSessionSlot, handleRemoveSessionSlot, handleDeleteCourse, handleDeleteEvent, handleDeleteFinancialStatement, handleDeleteAnnualReport
    } = useAppContext();
    const navigate = useNavigate();

    // Hooks specific to Admin Dashboard
    const [activeTab, setActiveTab] = useState(user?.role === 'instructor' ? 'myAgenda' : 'courses');
    const [isTeamOrdering, setIsTeamOrdering] = useState(false);

    if (!user) return null;

    // Data and Memoized values
    const { newStudentsLast30d, coursePerformance, studentEngagement } = MOCK_ANALYTICS_DATA_V2;

    const coursesForUser = useMemo(() => user.role === 'admin' ? courses : courses.filter(c => c.instructorId === user.id), [user, courses]);
    const articlesForUser = useMemo(() => user.role === 'admin' ? articles : articles.filter(a => a.author === user.name), [user, articles]);
    const students = useMemo(() => users.filter(u => u.role === 'student' && u.accountStatus !== 'inactive'), [users]);
    
    // Handlers
    const handleCreateCourse = () => navigate('/admin/course-editor');
    const handleEditCourse = (courseId: string) => navigate(`/admin/course-editor/${courseId}`);
    const handleCreateArticle = () => navigate('/admin/article-editor');
    const handleEditArticle = (articleId: string) => navigate(`/admin/article-editor/${articleId}`);
    const handleCreateUser = (role: 'student' | 'instructor') => navigate(role === 'student' ? '/admin/user-editor/new' : '/admin/teammember-editor/new');
    const handleEditUser = (userId: string, role: User['role']) => navigate(role === 'student' ? `/admin/user-editor/${userId}` : `/admin/teammember-editor/${userId}`);
    const handleCreateEvent = () => navigate('/event/new');
    const handleEditEvent = (eventId: string) => navigate(`/event/edit/${eventId}`);
    const handleCreateTransparency = () => navigate('/admin/transparency-editor');


    const CoursesTable = () => (
      <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 overflow-hidden">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider">Curso</th>
                <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider">Trilha</th>
                <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider">Aulas</th>
                <th scope="col" className="relative px-3 py-2"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {coursesForUser.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-6 text-gray-400 text-xs">{user.role === 'instructor' ? 'Você ainda não criou nenhum curso.' : 'Nenhum curso cadastrado.'}</td></tr>
              ) : (
                coursesForUser.map((course) => (
                  <tr key={course.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-3 py-2 whitespace-nowrap"><div className="text-xs font-medium text-white truncate max-w-[150px]">{course.title}</div><div className="text-[9px] text-gray-500">{course.skillLevel}</div></td>
                    <td className="px-3 py-2 whitespace-nowrap"><span className={`px-1.5 py-0.5 inline-flex text-[9px] font-semibold rounded-full bg-[#8a4add]/20 text-[#c4b5fd]`}>{course.track}</span></td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300">{course.modules.reduce((acc, module) => acc + module.lessons.length, 0)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-[10px] font-medium space-x-2">
                      <button onClick={() => navigate(`/admin/instructor-dashboard/${course.id}`)} className="text-green-400 hover:text-green-300">Progresso</button>
                      <button onClick={() => handleEditCourse(course.id)} className="text-[#c4b5fd] hover:text-white">Editar</button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="text-red-400 hover:text-red-300">Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    );

    const BlogTable = () => (
      <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 overflow-hidden">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider">Artigo</th>
                <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider">Data</th>
                <th scope="col" className="relative px-3 py-2"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {articlesForUser.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-6 text-gray-400 text-xs">Nenhum artigo publicado.</td></tr>
              ) : (
                articlesForUser.map((article) => (
                  <tr key={article.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-3 py-2 whitespace-nowrap"><div className="text-xs font-medium text-white truncate max-w-[150px]">{article.title}</div><div className="text-[9px] text-gray-500">{article.author}</div></td>
                    <td className="px-3 py-2 whitespace-nowrap"><span className={`px-1.5 py-0.5 inline-flex text-[9px] font-semibold rounded-full ${article.status === 'published' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>{article.status === 'published' ? 'Publicado' : 'Rascunho'}</span></td>
                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-300">{article.date}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-[10px] font-medium space-x-2">
                      <button onClick={() => handleToggleArticleStatus(article.id)} className={article.status === 'published' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}>{article.status === 'published' ? 'Desativar' : 'Publicar'}</button>
                      <button onClick={() => handleEditArticle(article.id)} className="text-[#c4b5fd] hover:text-white">Editar</button>
                      <button onClick={() => handleDeleteArticle(article.id)} className="text-red-400 hover:text-red-300">Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    );

  const TeamMembersTable = () => (
      <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 overflow-hidden">
          <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
              <tr>
              <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider">Membro</th>
              <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider">Papel</th>
              <th scope="col" className="relative px-3 py-2"><span className="sr-only">Ações</span></th>
              </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
              {team.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-6 text-gray-400 text-xs">Nenhum membro na equipe.</td></tr>
              ) : (
                  team.map((member) => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                              <div className="flex-shrink-0 h-6 w-6"><img className="h-6 w-6 rounded-full" src={member.avatarUrl} alt={member.name} /></div>
                              <div className="ml-2"><div className="text-xs font-medium text-white">{member.name}</div><div className="text-[9px] text-gray-500">{member.title}</div></div>
                          </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-300 capitalize">{member.role}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-[10px] font-medium space-x-2">
                      <button onClick={() => handleEditUser(member.id, member.role)} className="text-[#c4b5fd] hover:text-white">Editar</button>
                      {user?.id !== member.id && (<button onClick={() => handleDeleteUser(member.id)} className="text-red-400 hover:text-red-300">Desativar</button>)}
                      </td>
                  </tr>
                  ))
              )}
          </tbody>
          </table>
      </div>
  );

  const EventsTable = () => (
    <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 overflow-hidden">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider">Evento</th>
              <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider">Data/Hora</th>
              <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
              <th scope="col" className="relative px-3 py-2"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {events.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-6 text-gray-400 text-xs">Nenhum evento agendado.</td></tr>
            ) : (
                events.map((event) => {
                    return (
                        <tr key={event.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-3 py-2 whitespace-nowrap">
                                <div className="text-xs font-medium text-white truncate max-w-[150px]">{event.title}</div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-300">{event.date} {event.time}</td>
                            <td className="px-3 py-2 whitespace-nowrap"><span className="px-1.5 py-0.5 inline-flex text-[9px] font-semibold rounded-full bg-[#8a4add]/20 text-[#c4b5fd]">{event.eventType}</span></td>
                            <td className="px-3 py-2 whitespace-nowrap text-right text-[10px] font-medium space-x-2">
                                <button onClick={() => handleEditEvent(event.id)} className="text-[#c4b5fd] hover:text-white">Editar</button>
                                <button onClick={() => handleDeleteEvent(event.id)} className="text-red-400 hover:text-red-300">Excluir</button>
                            </td>
                        </tr>
                    );
                })
            )}
          </tbody>
        </table>
    </div>
  );

const StudentsTable = () => (
  <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 overflow-hidden">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-white/5">
          <tr>
            <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider">Aluno</th>
            <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider">Email</th>
             <th scope="col" className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider">XP</th>
            <th scope="col" className="relative px-3 py-2"><span className="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {students.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-6 text-gray-400 text-xs">Nenhum aluno cadastrado.</td></tr>
          ) : (
              students.map((student) => (
              <tr key={student.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                          <div className="flex-shrink-0 h-6 w-6"><img className="h-6 w-6 rounded-full" src={student.avatarUrl} alt={student.name} /></div>
                          <div className="ml-2"><div className="text-xs font-medium text-white">{student.name}</div></div>
                      </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap"><div className="text-[10px] text-gray-300">{student.email}</div></td>
                  <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-300">{student.xp}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-right text-[10px] font-medium space-x-2">
                    <button onClick={() => handleEditUser(student.id, student.role)} className="text-[#c4b5fd] hover:text-white">Editar</button>
                    {user?.id !== student.id && (<button onClick={() => handleDeleteUser(student.id)} className="text-red-400 hover:text-red-300">Desativar</button>)}
                  </td>
              </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
);

    const TransparencyTable = () => (
        <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 overflow-hidden">
            <div className="p-3 bg-white/5">
                <h3 className="text-xs font-bold text-white mb-2">Relatórios Financeiros</h3>
                <table className="min-w-full divide-y divide-white/10 mb-4">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-3 py-1.5 text-left text-[10px] font-medium text-gray-400 uppercase">Ano</th>
                            <th className="px-3 py-1.5 text-left text-[10px] font-medium text-gray-400 uppercase">Receita</th>
                            <th className="px-3 py-1.5 text-left text-[10px] font-medium text-gray-400 uppercase">Despesas</th>
                            <th className="relative px-3 py-1.5"><span className="sr-only">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {financialStatements.length === 0 ? <tr><td colSpan={4} className="text-center py-3 text-gray-400 text-[10px]">Nenhum relatório financeiro.</td></tr> : 
                        financialStatements.sort((a,b) => b.year - a.year).map(fs => (
                            <tr key={fs.id} className="hover:bg-white/5">
                                <td className="px-3 py-1.5 text-[10px] text-white font-bold">{fs.year}</td>
                                <td className="px-3 py-1.5 text-[10px] text-green-400">{fs.totalRevenue}</td>
                                <td className="px-3 py-1.5 text-[10px] text-red-400">{fs.totalExpenses}</td>
                                <td className="px-3 py-1.5 text-right text-[10px] font-medium space-x-2">
                                    <button onClick={() => navigate(`/admin/transparency-editor/financial/${fs.id}`)} className="text-[#c4b5fd] hover:text-white">Editar</button>
                                    <button onClick={() => handleDeleteFinancialStatement(fs.id)} className="text-red-400 hover:text-red-300">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h3 className="text-xs font-bold text-white mb-2">Relatórios Anuais</h3>
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-3 py-1.5 text-left text-[10px] font-medium text-gray-400 uppercase">Ano</th>
                            <th className="px-3 py-1.5 text-left text-[10px] font-medium text-gray-400 uppercase">Coordenação</th>
                            <th className="relative px-3 py-1.5"><span className="sr-only">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                         {annualReports.length === 0 ? <tr><td colSpan={3} className="text-center py-3 text-gray-400 text-[10px]">Nenhum relatório anual.</td></tr> : 
                        annualReports.sort((a,b) => b.year - a.year).map(ar => (
                            <tr key={ar.id} className="hover:bg-white/5">
                                <td className="px-3 py-1.5 text-[10px] text-white font-bold">{ar.year}</td>
                                <td className="px-3 py-1.5 text-[10px] text-gray-300">{ar.coordinationLetter.authorName}</td>
                                <td className="px-3 py-1.5 text-right text-[10px] font-medium space-x-2">
                                    <button onClick={() => navigate(`/admin/transparency-editor/report/${ar.id}`)} className="text-[#c4b5fd] hover:text-white">Editar</button>
                                    <button onClick={() => handleDeleteAnnualReport(ar.id)} className="text-red-400 hover:text-red-300">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderActiveTab = () => {
      switch (activeTab) {
          case 'courses': return <CoursesTable />;
          case 'blog': return <BlogTable />;
          case 'teamMembers': return <TeamMembersTable />;
          case 'students': return <StudentsTable />;
          case 'events': return <EventsTable />;
          case 'tracks': return <TracksManagementPanel />;
          case 'transparency': return <TransparencyTable />;
          case 'moderation': return <ModerationPanel />;
          case 'myAgenda': return <MyAgendaPanel 
            user={user}
            mentorSessions={mentorSessions}
            users={users}
            handleAddSessionSlot={handleAddSessionSlot}
            handleRemoveSessionSlot={handleRemoveSessionSlot}
          />;
          default: return <CoursesTable />;
      }
    };

    const getCreateButtonAction = () => {
      switch (activeTab) {
          case 'courses': return { text: 'Novo Curso', action: handleCreateCourse };
          case 'blog': return { text: 'Novo Post', action: handleCreateArticle };
          case 'teamMembers': return { text: 'Novo Membro', action: () => handleCreateUser('instructor') };
          case 'students': return { text: 'Novo Aluno', action: () => handleCreateUser('student') };
          case 'events': return { text: 'Novo Evento', action: handleCreateEvent };
          case 'transparency': return { text: 'Novo Relatório', action: handleCreateTransparency };
          default: return null;
      }
    }
    
    const createButton = getCreateButtonAction();
    const showCreateButton = !!createButton && (user.role === 'admin' || (user.role === 'instructor' && (activeTab === 'courses' || activeTab === 'blog' || activeTab === 'events'))) && !isTeamOrdering && activeTab !== 'tracks' && activeTab !== 'moderation';

    return (
    <PageLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
            <div>
            <h1 className="text-2xl font-black text-white">Painel <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#c4b5fd]">{user.name.split(' ')[0]}</span></h1>
            <p className="mt-0.5 text-xs text-gray-400">
                Visão geral e gestão da plataforma.
            </p>
            </div>
        </div>
        
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <StatCard title="Alunos" value={students.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
            <StatCard title="Novos (30d)" value={`+${newStudentsLast30d}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>} />
            <StatCard title="Conclusão" value={`${MOCK_ANALYTICS_DATA_V2.avgCompletionRate}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard title="Blog Posts" value={articles.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mb-6">
            {/* Course Performance */}
            <div className="lg:col-span-2 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 p-4">
                <h2 className="text-base font-bold text-white mb-3">Desempenho dos Cursos</h2>
                <div className="space-y-2">
                    {coursePerformance.slice(0, 3).map(perf => {
                        const course = courses.find(c => c.id === perf.courseId);
                        if (!course) return null;
                        return (
                            <div key={perf.courseId} className="bg-white/5 p-2 rounded-md">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-bold text-white text-xs truncate">{course.title}</p>
                                        <div className="flex items-center gap-3 text-[9px] text-gray-400">
                                            <span>👥 {perf.enrolled}</span>
                                            <span>🏆 {perf.completionRate}%</span>
                                        </div>
                                    </div>
                                    <button onClick={() => navigate(`/admin/instructor-dashboard/${course.id}`)} className="text-[9px] font-semibold text-white bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors">
                                        Detalhes
                                    </button>
                                </div>
                                <ProgressBar progress={perf.completionRate} className="mt-1.5"/>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Student Engagement */}
            <div className="space-y-4">
                <div className="bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 p-4">
                    <h2 className="text-base font-bold text-white mb-3">🏆 Top Alunos</h2>
                    <ul className="space-y-1.5">
                        {studentEngagement.topStudents.slice(0, 3).map(student => (
                            <li key={student.id} className="flex items-center justify-between bg-black/20 p-1.5 rounded">
                                <div className="flex items-center gap-2">
                                    <img src={student.avatarUrl} alt={student.name} className="h-5 w-5 rounded-full" />
                                    <span className="text-[10px] font-medium text-white truncate max-w-[80px]">{student.name.split(' ')[0]}</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#c4b5fd]">{student.xp} XP</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 p-4">
                    <h2 className="text-base font-bold text-white mb-3">🚨 Atenção</h2>
                    <ul className="space-y-1.5">
                        {studentEngagement.atRiskStudents.slice(0, 3).map(student => (
                             <li key={student.id} className="flex items-center justify-between bg-black/20 p-1.5 rounded">
                                <div className="flex items-center gap-2">
                                    <img src={student.avatarUrl} alt={student.name} className="h-5 w-5 rounded-full opacity-60" />
                                    <span className="text-[10px] font-medium text-gray-300 truncate max-w-[80px]">{student.name.split(' ')[0]}</span>
                                </div>
                                <span className="text-[9px] text-red-400">-{student.lastLoginDaysAgo}d</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Management Tables Section */}
         <div>
            <div className="flex justify-between items-center border-b border-white/10 overflow-x-auto no-scrollbar">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {(user.role === 'admin' || user.role === 'instructor') && (
                        <button onClick={() => setActiveTab('myAgenda')} className={`${activeTab === 'myAgenda' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs transition-colors`}>Agenda</button>
                    )}
                    <button onClick={() => setActiveTab('courses')} className={`${activeTab === 'courses' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs transition-colors`}>Cursos</button>
                    <button onClick={() => setActiveTab('blog')} className={`${activeTab === 'blog' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs transition-colors`}>Blog</button>
                    <button onClick={() => setActiveTab('events')} className={`${activeTab === 'events' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs transition-colors`}>Eventos</button>
                    {user.role === 'admin' && (
                    <>
                         <button onClick={() => setActiveTab('moderation')} className={`${activeTab === 'moderation' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs transition-colors`}>Moderação</button>
                        <button onClick={() => setActiveTab('teamMembers')} className={`${activeTab === 'teamMembers' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs transition-colors`}>Equipe</button>
                        <button onClick={() => setActiveTab('students')} className={`${activeTab === 'students' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs transition-colors`}>Alunos</button>
                        <button onClick={() => setActiveTab('tracks')} className={`${activeTab === 'tracks' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs transition-colors`}>Trilhas</button>
                        <button onClick={() => setActiveTab('transparency')} className={`${activeTab === 'transparency' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs transition-colors`}>Transparência</button>
                    </>
                    )}
                </nav>
                <div className="flex items-center gap-2 pl-2">
                    {activeTab === 'teamMembers' && user.role === 'admin' && (
                    <button
                        onClick={() => setIsTeamOrdering(prev => !prev)}
                        className="bg-white/10 text-white font-semibold py-1 px-3 rounded hover:bg-white/20 transition-all duration-300 text-[10px] mb-1"
                    >
                        {isTeamOrdering ? 'Ver Tabela' : 'Ordenar'}
                    </button>
                    )}
                    {showCreateButton && createButton && (
                        <button
                        onClick={createButton.action}
                        className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-1 px-3 rounded hover:opacity-90 transition-all duration-300 text-[10px] mb-1 whitespace-nowrap"
                        >
                        {createButton.text}
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-3">
                {isTeamOrdering && activeTab === 'teamMembers' ? <TeamOrderingPanel 
                    team={team}
                    handleSaveTeamOrder={handleSaveTeamOrder}
                    setIsTeamOrdering={setIsTeamOrdering}
                /> : renderActiveTab()}
            </div>
        </div>

        </div>
    </PageLayout>
    );
}

const StudentDashboard: React.FC = () => {
    const { 
      user, users, courses, articles,
      courseProgress, mentors, 
      projects, events, mentorSessions, showToast
    } = useAppContext();
    const navigate = useNavigate();
    const [showAllCourses, setShowAllCourses] = useState(false);

    if (!user) return null;
    
    const handleCourseNavigation = (course: Course) => {
        if (course.heroContent) {
            navigate(`/course-landing/${course.id}`);
        } else {
            navigate(`/course/${course.id}`);
        }
    };

    const handleStartCourse = (course: Course) => {
        const firstLesson = course.modules?.[0]?.lessons?.[0];
        if (firstLesson) {
            navigate(`/course/${course.id}/lesson/${firstLesson.id}`);
        } else {
            handleCourseNavigation(course);
            if (showToast) {
                showToast('🚀 Começando o curso! A primeira aula será adicionada em breve.');
            }
        }
    };

    const { inProgressCourses, completedCourses } = courseProgress;
    
    const latestInProgress = inProgressCourses.length > 0 ? inProgressCourses[0] : null;
  
    const nextLesson: Lesson | null = useMemo(() => {
      if (!latestInProgress) return null;
      const allLessons = latestInProgress.course.modules.flatMap(m => m.lessons);
      return allLessons.find(l => !user.completedLessonIds.includes(l.id)) || null;
    }, [latestInProgress, user.completedLessonIds]);
  
    const upcomingAppointments = useMemo(() => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
  
      const bookedSessions = mentorSessions
          .filter(s => s.studentId === user.id)
          .map(s => {
              const mentor = mentors.find(m => m.id === s.mentorId);
              const sessionDate = new Date(`${s.date}T${s.time}:00`);
              return {
                  date: sessionDate,
                  title: `Mentoria c/ ${mentor?.name.split(' ')[0] || 'Mentor'}`,
                  type: 'mentoria' as const,
                  data: s
              };
          });
  
      return bookedSessions
          .filter(app => app.date >= now)
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .slice(0, 3);
    }, [user.id, mentorSessions, mentors]);
  
    const feedItems = useMemo(() => {
      const items = [];
      const approvedProjects = projects.filter(p => p.status === 'approved');
      if (approvedProjects.length > 0) {
          const sortedProjects = [...approvedProjects].sort((a, b) => {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);
              const isAValid = !isNaN(dateA.getTime());
              const isBValid = !isNaN(dateB.getTime());
              if (isAValid && isBValid) return dateB.getTime() - dateA.getTime();
              if (!isAValid && isBValid) return -1;
              if (isAValid && !isBValid) return 1;
              return 0;
          });
          const latestProject = sortedProjects[0];
          const author = users.find(u => u.id === latestProject.authorId);
          items.push({
              type: 'project',
              title: `${author?.name.split(' ')[0] || 'Alguém'} postou:`,
              subtitle: latestProject.title,
              icon: '🚀',
              action: () => navigate(`/project/${latestProject.id}`),
          });
      }
  
      const publishedArticles = articles.filter(a => a.status === 'published');
      if (publishedArticles.length > 0) {
          publishedArticles.sort((a, b) => {
              try {
                  const [dayA, monthA, yearA] = a.date.split('/').map(Number);
                  const [dayB, monthB, yearB] = b.date.split('/').map(Number);
                  return new Date(yearB, monthB - 1, dayB).getTime() - new Date(yearA, monthA - 1, dayA).getTime();
              } catch { return 0; }
          });
          const latestArticle = publishedArticles[0];
          if (latestArticle) {
              items.push({
                  type: 'article',
                  title: `Novo no blog:`,
                  subtitle: latestArticle.title,
                  icon: '📝',
                  action: () => navigate(`/article/${latestArticle.id}`),
              });
          }
      }
  
      if (events.length > 0) {
          const monthMap: { [key: string]: number } = { JAN: 0, FEV: 1, MAR: 2, ABR: 3, MAI: 4, JUN: 5, JUL: 6, AGO: 7, SET: 8, OUT: 9, NOV: 10, DEZ: 11 };
          const now = new Date();
          now.setHours(0,0,0,0);
          
          const sortedEvents = [...events].map(event => {
              try {
                  const [monthStr, day] = event.date.split(' ');
                  if (!monthStr || !day) return { event, date: new Date(0) };
                  const eventDate = new Date(now.getFullYear(), monthMap[monthStr.toUpperCase()], Number(day));
                  if (eventDate < now) eventDate.setFullYear(now.getFullYear() + 1);
                  return { event, date: eventDate };
              } catch {
                  return { event, date: new Date(0) };
              }
          }).filter(item => item.date.getTime() !== new Date(0).getTime()).sort((a, b) => a.date.getTime() - b.date.getTime());
  
          if (sortedEvents.length > 0) {
              const nextEvent = sortedEvents[0].event;
              items.push({
                  type: 'event',
                  title: `Evento:`,
                  subtitle: nextEvent.title,
                  icon: '🗓️',
                  action: () => navigate(`/event/${nextEvent.id}`),
              });
          }
      }
      return items.slice(0, 3);
  }, [projects, articles, events, users, navigate]);
  
  
    const startedOrCompletedCourseIds = useMemo(() => {
      const inProgressIds = inProgressCourses.map(item => item.course.id);
      const completedIds = completedCourses.map(course => course.id);
      return new Set([...inProgressIds, ...completedIds]);
    }, [inProgressCourses, completedCourses]);
  
    const notStartedCourses = useMemo(() => 
      courses.filter(course => !startedOrCompletedCourseIds.has(course.id)),
      [courses, startedOrCompletedCourseIds]
    );
    
    const firstCourseToStart = notStartedCourses.length > 0 ? notStartedCourses[0] : null;
    const userLevel = Math.floor((user.xp || 0) / 100) + 1;
    const xpForNextLevel = 100;
    const xpInCurrentLevel = (user.xp || 0) % xpForNextLevel;

    return (
        <PageLayout>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-white">Olá, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#c4b5fd]">{user.name.split(' ')[0]}</span>!</h1>
              <p className="mt-0.5 text-xs text-gray-400">
                Sua jornada continua.
              </p>
            </div>
            
            {latestInProgress && nextLesson ? (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-[#6d28d9]/80 to-[#8a4add]/80 border border-white/10 shadow-2xl shadow-[#8a4add]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Continue de onde parou:</p>
                  <h2 className="text-lg font-bold text-white mt-0.5">{latestInProgress.course.title}</h2>
                  <p className="text-xs text-white/90 mt-0.5 truncate max-w-md">Próxima: {nextLesson.title}</p>
                </div>
                <button 
                  onClick={() => navigate(`/course/${latestInProgress.course.id}/lesson/${nextLesson.id}`)}
                  className="w-full md:w-auto bg-white text-black font-bold py-1.5 px-4 rounded-lg hover:bg-gray-200 transition-colors shadow-lg text-xs"
                >
                  Continuar
                </button>
              </div>
            ) : firstCourseToStart && (
                <div className="mb-6 p-4 rounded-xl bg-[#6d28d9] flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex-grow">
                        <p className="text-[10px] font-semibold text-purple-200 uppercase tracking-wider">Sugestão:</p>
                        <h2 className="text-lg font-bold text-white mt-0.5">{firstCourseToStart.title}</h2>
                    </div>
                    <div className="flex-shrink-0">
                        <button 
                            onClick={() => firstCourseToStart && handleStartCourse(firstCourseToStart)}
                            className="w-full md:w-auto bg-slate-100 text-[#6d28d9] font-bold py-1.5 px-4 rounded-lg hover:bg-white transition-colors shadow-lg text-xs"
                        >
                            Começar
                        </button>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-5">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Cursos em Andamento */}
                    {inProgressCourses.length > 0 && (
                        <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                            <h2 className="text-base font-bold text-white mb-3">Em Andamento</h2>
                            <div className="space-y-3">
                                {inProgressCourses.map(({ course, progress }) => (
                                    <button
                                        key={course.id}
                                        onClick={() => handleCourseNavigation(course)}
                                        className="w-full text-left bg-white/5 p-2 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:bg-white/10 transition-colors"
                                    >
                                        <img src={course.imageUrl} alt={course.title} className="w-full sm:w-20 h-12 object-cover rounded-md flex-shrink-0" />
                                        <div className="flex-grow w-full">
                                            <p className="font-bold text-white text-xs">{course.title}</p>
                                            <ProgressBar progress={progress} className="mt-1.5" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                     {/* Cursos Presenciais */}
                    <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                        <h2 className="text-base font-bold text-white mb-3">Turmas Presenciais</h2>
                         <div className="space-y-3">
                           {courses.filter(c => c.format === 'presencial' || c.format === 'hibrido').slice(0, 2).map(course => (
                               <OnsiteCourseCard key={course.id} course={course} />
                           ))}
                        </div>
                    </div>
                    
                    {/* Cursos Concluídos */}
                    {completedCourses.length > 0 && (
                         <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                             <h2 className="text-base font-bold text-white mb-3">Concluídos</h2>
                             <div className="grid sm:grid-cols-2 gap-3">
                                 {completedCourses.slice(0, showAllCourses ? undefined : 2).map(course => (
                                      <div key={course.id} className="bg-white/5 p-2 rounded-lg text-center group">
                                        <button onClick={() => handleCourseNavigation(course)} className="w-full">
                                            <img src={course.imageUrl} alt={course.title} className="w-full h-16 object-cover rounded-md group-hover:opacity-80 transition-opacity" />
                                            <p className="font-semibold text-white mt-1.5 text-[10px] group-hover:text-[#c4b5fd] transition-colors truncate">{course.title}</p>
                                        </button>
                                        <button onClick={() => navigate(`/course/${course.id}/certificate`)} className="mt-1.5 w-full text-center bg-green-500/10 text-green-300 font-semibold py-1 rounded text-[9px] hover:bg-green-500/20 transition-colors">
                                            Certificado
                                        </button>
                                    </div>
                                 ))}
                             </div>
                             {completedCourses.length > 2 && (
                                <div className="text-center mt-3">
                                    <button onClick={() => setShowAllCourses(!showAllCourses)} className="text-[10px] font-semibold text-[#c4b5fd] hover:text-white">
                                        {showAllCourses ? 'Mostrar menos' : `Mostrar todos (${completedCourses.length})`}
                                    </button>
                                </div>
                             )}
                         </div>
                    )}

                </div>

                {/* Sidebar */}
                <aside className="space-y-5">
                    {/* Perfil */}
                    <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center">
                        <img src={user.avatarUrl} alt={user.name} className="h-16 w-16 rounded-full mx-auto border-2 border-[#8a4add]/50" />
                        <h3 className="mt-2 text-base font-bold text-white">{user.name}</h3>
                        <p className="text-[10px] text-gray-400">Nível {userLevel}</p>
                        <ProgressBar progress={xpInCurrentLevel / xpForNextLevel * 100} className="mt-1.5" />
                        <p className="text-[9px] text-gray-500 mt-1">{xpInCurrentLevel}/{xpForNextLevel} XP para o próximo</p>
                    </div>

                     {/* Feed da Comunidade */}
                    <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                        <h3 className="text-base font-bold text-white mb-3">Comunidade</h3>
                        <div className="space-y-2">
                            {feedItems.map((item, index) => (
                                <button key={index} onClick={item.action} className="w-full text-left bg-white/5 hover:bg-white/10 p-2 rounded-lg flex items-center gap-2 transition-colors">
                                    <span className="text-base">{item.icon}</span>
                                    <div className="min-w-0">
                                        <p className="text-[9px] text-gray-400">{item.title}</p>
                                        <p className="font-semibold text-white text-[10px] truncate">{item.subtitle}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Agenda */}
                    <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                        <h3 className="text-base font-bold text-white mb-3">Minha Agenda</h3>
                        <div className="space-y-2">
                            {upcomingAppointments.length > 0 ? upcomingAppointments.map((app, index) => (
                                 <div key={index} className="bg-white/5 p-2 rounded-lg flex items-center gap-2">
                                    <div className="text-center w-8 flex-shrink-0">
                                        <p className="font-bold text-white text-xs">{app.date.toLocaleDateString('pt-BR', { day: '2-digit' })}</p>
                                        <p className="text-[8px] text-gray-400 uppercase">{app.date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white text-[10px]">{app.title}</p>
                                        <p className="text-[9px] text-gray-400">{app.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                 </div>
                            )) : (
                                 <p className="text-[10px] text-gray-400 text-center py-1">Sem agendamentos.</p>
                            )}
                            <button onClick={() => navigate('/connect')} className="w-full mt-1 text-center bg-white/10 text-white font-semibold py-1 rounded-lg text-[10px] hover:bg-white/20 transition-colors">
                                Ver agenda
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
          </div>
        </PageLayout>
    );
};

const Dashboard: React.FC = () => {
  const { user } = useAppContext();
  if (!user) {
    return <div className="text-center py-20">Por favor, faça login para ver seu painel.</div>;
  }
  return user.role === 'student' ? <StudentDashboard /> : <AdminDashboard />;
};

export default Dashboard;
