import React, { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Achievement, Course, Lesson, MentorSession, User, Track } from '../types';
import ProgressBar from '../components/ProgressBar';
import { MOCK_ACHIEVEMENTS, MOCK_ANALYTICS_DATA_V2 } from '../constants';
import { useAppContext } from '../App';
import CourseCard from '../components/CourseCard';
import OnsiteCourseCard from '../components/OnsiteCourseCard';
import PageLayout from '../components/PageLayout';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-[#6d28d9] to-[#8a4add] flex items-center justify-center shadow-lg shadow-[#8a4add]/20">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400 font-semibold">{title}</p>
        <p className="text-3xl font-black text-white">{value}</p>
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
      <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Gerenciar meus horários de mentoria</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {next7Days.map(day => {
                  const dateKey = day.toISOString().split('T')[0];
                  return (
                      <div key={dateKey}>
                          <div className="p-2 rounded-t-md bg-white/10 text-center"><p className="font-bold text-white">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</p><p className="text-xs text-gray-300">{day.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</p></div>
                          <div className="p-2 space-y-2 bg-white/5 rounded-b-md">
                              {timeSlots.map(time => {
                                  const session = sessionsByDateTime.get(`${dateKey}-${time}`);
                                  const student = session?.studentId ? users.find(u => u.id === session.studentId) : null;
                                  if (session?.isBooked && student) {
                                      return (<div key={time} className="w-full text-xs p-2 rounded bg-red-500/20 text-red-300 text-center"><p className="font-bold">Agendado</p><p>{student.name.split(' ')[0]}</p>{session.googleMeetUrl && <a href={session.googleMeetUrl} target="_blank" rel="noopener noreferrer" className="text-[#c4b5fd] hover:underline text-[10px]">Link da Sala</a>}</div>);
                                  }
                                  if (session && !session.isBooked) {
                                      return (<button key={time} onClick={() => handleRemoveSessionSlot(user.id, dateKey, time)} className="w-full text-xs font-semibold p-2 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors">Disponível<br/><span className="font-normal text-gray-400">Bloquear?</span></button>);
                                  }
                                  return (<button key={time} onClick={() => handleAddSessionSlot(user.id, dateKey, time)} className="w-full text-xs font-semibold p-2 rounded bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 transition-colors">{time}<br/><span className="font-normal text-gray-500">Disponibilizar</span></button>);
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
      <div className="bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Ordenar Membros da Equipe</h3>
          <p className="text-sm text-gray-400 mb-6">Arraste e solte os cards para reordenar como eles aparecerão na página "Nossa Equipe".</p>
          <div className="space-y-3">
              {orderedMembers.map((member, index) => (
                  <div
                      key={member.id}
                      className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/10 cursor-grab active:cursor-grabbing"
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnter={(e) => handleDragEnter(e, index)}
                      onDragEnd={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                  >
                      <span className="text-gray-500 font-mono text-lg w-6 text-center">{index + 1}</span>
                      <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full object-cover" />
                      <div>
                          <p className="font-semibold text-white">{member.name}</p>
                          <p className="text-xs text-gray-400">{member.title}</p>
                      </div>
                  </div>
              ))}
          </div>
          <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={() => setIsTeamOrdering(false)} className="bg-white/10 text-white font-semibold py-2 px-5 rounded-lg hover:bg-white/20">Cancelar</button>
              <button type="button" onClick={handleSave} className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90">Salvar Ordem</button>
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
        <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 p-6 space-y-6">
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Adicionar Nova Trilha</h3>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newTrackName}
                        onChange={(e) => setNewTrackName(e.target.value)}
                        placeholder="Nome da nova trilha"
                        className="flex-grow p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none"
                    />
                    <button onClick={handleCreate} className="font-semibold py-3 px-6 rounded-lg bg-[#8a4add] text-white hover:bg-[#6d28d9]">
                        Adicionar
                    </button>
                </div>
            </div>

            <div>
                 <h3 className="text-xl font-bold text-white mb-4">Trilhas Existentes</h3>
                 <div className="space-y-3">
                    {tracks.length === 0 ? (
                        <p className="text-gray-400">Nenhuma trilha cadastrada.</p>
                    ) : (
                        tracks.map(track => (
                            <div key={track.id} className="bg-white/5 p-4 rounded-lg flex justify-between items-center">
                                {editingTrack?.id === track.id ? (
                                    <input 
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        className="p-1 bg-white/10 rounded border border-[#8a4add] focus:outline-none"
                                        autoFocus
                                    />
                                ) : (
                                    <div>
                                        <p className="font-semibold text-white">{track.name}</p>
                                        <p className="text-xs text-gray-400">{getCoursesCountInTrack(track.name)} curso(s) nesta trilha</p>
                                    </div>
                                )}
                                <div className="flex gap-4">
                                    {editingTrack?.id === track.id ? (
                                        <>
                                            <button onClick={handleUpdate} className="text-sm text-green-400 hover:text-green-300">Salvar</button>
                                            <button onClick={cancelEditing} className="text-sm text-gray-400 hover:text-gray-300">Cancelar</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => startEditing(track)} className="text-sm text-[#c4b5fd] hover:text-white">Editar</button>
                                            <button onClick={() => handleDeleteTrack(track.id)} className="text-sm text-red-400 hover:text-red-300">Excluir</button>
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

const AdminDashboard: React.FC = () => {
    const { 
      user, users, courses, articles, team, mentorSessions,
      handleSaveCourse, handleDeleteArticle, handleToggleArticleStatus,
      handleSaveUser, handleDeleteUser, handleSaveTeamOrder,
      handleAddSessionSlot, handleRemoveSessionSlot, handleDeleteCourse,
    } = useAppContext();
    const navigate = useNavigate();

    // Hooks specific to Admin Dashboard
    const [activeTab, setActiveTab] = useState(user?.role === 'instructor' ? 'myAgenda' : 'courses');
    const [isTeamOrdering, setIsTeamOrdering] = useState(false);

    if (!user) return null;

    // Data and Memoized values
    const { newStudentsLast30d, avgCompletionRate, coursePerformance, studentEngagement } = MOCK_ANALYTICS_DATA_V2;

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


    const CoursesTable = () => (
      <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 overflow-hidden">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Título do Curso</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Trilha</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Módulos</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Aulas</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {coursesForUser.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">{user.role === 'instructor' ? 'Você ainda não criou nenhum curso.' : 'Nenhum curso cadastrado.'}</td></tr>
              ) : (
                coursesForUser.map((course) => (
                  <tr key={course.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-white">{course.title}</div><div className="text-xs text-gray-400">{course.skillLevel}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#8a4add]/20 text-[#c4b5fd]`}>{course.track}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.modules.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.modules.reduce((acc, module) => acc + module.lessons.length, 0)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button onClick={() => navigate(`/admin/instructor-dashboard/${course.id}`)} className="text-green-400 hover:text-green-300">Ver Progresso</button>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Título do Artigo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Autor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Categoria</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {articlesForUser.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-400">Nenhum artigo publicado.</td></tr>
              ) : (
                articlesForUser.map((article) => (
                  <tr key={article.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-white">{article.title}</div><div className="text-xs text-gray-400">{article.subtitle}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{article.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#8a4add]/20 text-[#c4b5fd]">{article.category}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.status === 'published' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>{article.status === 'published' ? 'Publicado' : 'Rascunho'}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{article.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Título</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Papel</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mentor</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
              {team.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400">Nenhum membro na equipe.</td></tr>
              ) : (
                  team.map((member) => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10"><img className="h-10 w-10 rounded-full" src={member.avatarUrl} alt={member.name} /></div>
                              <div className="ml-4"><div className="text-sm font-medium text-white">{member.name}</div></div>
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{member.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">{member.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{member.isMentor ? '✅' : '❌'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
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

const StudentsTable = () => (
  <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 overflow-hidden">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-white/5">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">XP</th>
            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {students.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">Nenhum aluno cadastrado.</td></tr>
          ) : (
              students.map((student) => (
              <tr key={student.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10"><img className="h-10 w-10 rounded-full" src={student.avatarUrl} alt={student.name} /></div>
                          <div className="ml-4"><div className="text-sm font-medium text-white">{student.name}</div></div>
                      </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-300">{student.email}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.xp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
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

    const renderActiveTab = () => {
      switch (activeTab) {
          case 'courses': return <CoursesTable />;
          case 'blog': return <BlogTable />;
          case 'teamMembers': return <TeamMembersTable />;
          case 'students': return <StudentsTable />;
          case 'tracks': return <TracksManagementPanel />;
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
          case 'courses': return { text: 'Criar Novo Curso', action: handleCreateCourse };
          case 'blog': return { text: 'Criar Novo Post', action: handleCreateArticle };
          case 'teamMembers': return { text: 'Adicionar Membro', action: () => handleCreateUser('instructor') };
          case 'students': return { text: 'Criar Novo Aluno', action: () => handleCreateUser('student') };
          default: return null;
      }
    }
    
    const createButton = getCreateButtonAction();
    const showCreateButton = (user.role === 'admin' || (user.role === 'instructor' && (activeTab === 'courses' || activeTab === 'blog'))) && !isTeamOrdering && activeTab !== 'tracks';

    return (
    <PageLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
            <div>
            <h1 className="text-4xl font-black text-white">Bem-vindo, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#c4b5fd]">{user.name.split(' ')[0]}</span>!</h1>
            <p className="mt-2 text-lg text-gray-400">
                Acompanhe a saúde da plataforma e o progresso dos seus alunos.
            </p>
            </div>
        </div>
        
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard title="Total de Alunos" value={students.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
            <StatCard title="Novos Alunos (30d)" value={`+${newStudentsLast30d}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>} />
            <StatCard title="Taxa de Conclusão Média" value={`${avgCompletionRate}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard title="Posts no Blog" value={articles.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Course Performance */}
            <div className="lg:col-span-2 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Desempenho dos Cursos</h2>
                <div className="space-y-4">
                    {coursePerformance.map(perf => {
                        const course = courses.find(c => c.id === perf.courseId);
                        if (!course) return null;
                        return (
                            <div key={perf.courseId} className="bg-white/5 p-4 rounded-lg">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex-1">
                                        <p className="font-bold text-white">{course.title}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                                            <span>👥 {perf.enrolled} Alunos</span>
                                            <span>🏆 {perf.completionRate}% Conclusão</span>
                                        </div>
                                    </div>
                                    <button onClick={() => navigate(`/admin/instructor-dashboard/${course.id}`)} className="text-xs font-semibold text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
                                        Ver Detalhes
                                    </button>
                                </div>
                                <ProgressBar progress={perf.completionRate} className="mt-3"/>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Student Engagement */}
            <div className="space-y-8">
                <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                    <h2 className="text-xl font-bold text-white mb-4">🏆 Top Alunos (Mais XP)</h2>
                    <ul className="space-y-3">
                        {studentEngagement.topStudents.map(student => (
                            <li key={student.id} className="flex items-center justify-between bg-black/20 p-3 rounded-md">
                                <div className="flex items-center gap-3">
                                    <img src={student.avatarUrl} alt={student.name} className="h-8 w-8 rounded-full" />
                                    <span className="text-sm font-medium text-white">{student.name}</span>
                                </div>
                                <span className="text-sm font-bold text-[#c4b5fd]">{student.xp.toLocaleString('pt-BR')} XP</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                    <h2 className="text-xl font-bold text-white mb-4">🚨 Alunos que Precisam de Atenção</h2>
                    <ul className="space-y-3">
                        {studentEngagement.atRiskStudents.map(student => (
                             <li key={student.id} className="flex items-center justify-between bg-black/20 p-3 rounded-md">
                                <div className="flex items-center gap-3">
                                    <img src={student.avatarUrl} alt={student.name} className="h-8 w-8 rounded-full opacity-60" />
                                    <span className="text-sm font-medium text-gray-300">{student.name}</span>
                                </div>
                                <span className="text-sm text-red-400">Visto há {student.lastLoginDaysAgo} dias</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Management Tables Section */}
         <div>
            <div className="flex justify-between items-center border-b border-white/10">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {(user.role === 'admin' || user.role === 'instructor') && (
                        <button onClick={() => setActiveTab('myAgenda')} className={`${activeTab === 'myAgenda' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>Minha Agenda</button>
                    )}
                    <button onClick={() => setActiveTab('courses')} className={`${activeTab === 'courses' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>Cursos</button>
                    <button onClick={() => setActiveTab('blog')} className={`${activeTab === 'blog' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>Blog</button>
                    {user.role === 'admin' && (
                    <>
                        <button onClick={() => setActiveTab('teamMembers')} className={`${activeTab === 'teamMembers' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>Equipe</button>
                        <button onClick={() => setActiveTab('students')} className={`${activeTab === 'students' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>Alunos</button>
                        <button onClick={() => setActiveTab('tracks')} className={`${activeTab === 'tracks' ? 'border-[#8a4add] text-[#8a4add]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>Trilhas</button>
                    </>
                    )}
                </nav>
                <div className="flex items-center gap-4">
                    {activeTab === 'teamMembers' && user.role === 'admin' && (
                    <button
                        onClick={() => setIsTeamOrdering(prev => !prev)}
                        className="bg-white/10 text-white font-semibold py-2 px-5 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm mb-2"
                    >
                        {isTeamOrdering ? 'Ver Tabela' : 'Ordenar Posições'}
                    </button>
                    )}
                    {showCreateButton && (
                        <button
                        onClick={createButton.action}
                        className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-all duration-300 text-sm mb-2"
                        >
                        {createButton.text}
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-4">
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
            // Fallback for courses with no lessons yet
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
                  title: `Mentoria com ${mentor?.name || 'Mentor'}`,
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
  
      // Latest Project
      if (projects.length > 0) {
          const sortedProjects = [...projects].sort((a, b) => {
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
              title: `${author?.name.split(' ')[0] || 'Alguém'} publicou um projeto:`,
              subtitle: latestProject.title,
              icon: '🚀',
              action: () => navigate(`/project/${latestProject.id}`),
          });
      }
  
      // Latest Article
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
                  title: `Novo artigo no blog:`,
                  subtitle: latestArticle.title,
                  icon: '📝',
                  action: () => navigate(`/article/${latestArticle.id}`),
              });
          }
      }
  
      // Upcoming Event
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
                  title: `Próximo evento ao vivo:`,
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
  
    const userAchievements = MOCK_ACHIEVEMENTS.filter(ach => user.achievements.includes(ach.id));
    const userLevel = Math.floor((user.xp || 0) / 100) + 1;
    const xpForNextLevel = 100;
    const xpInCurrentLevel = (user.xp || 0) % xpForNextLevel;

    return (
        <PageLayout>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-12">
              <h1 className="text-4xl font-black text-white">Bem-vindo de volta, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#c4b5fd]">{user.name.split(' ')[0]}</span>!</h1>
              <p className="mt-2 text-lg text-gray-400">
                Sua jornada de aprendizado continua. Vamos pra cima!
              </p>
            </div>
            
            {latestInProgress && nextLesson ? (
              <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-[#6d28d9]/80 to-[#8a4add]/80 border border-white/10 shadow-2xl shadow-[#8a4add]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold text-white/80">Continue de onde parou:</p>
                  <h2 className="text-2xl font-bold text-white mt-1">{latestInProgress.course.title}</h2>
                  <p className="text-lg text-white/90 mt-1">Próxima aula: {nextLesson.title}</p>
                </div>
                <button 
                  onClick={() => navigate(`/course/${latestInProgress.course.id}/lesson/${nextLesson.id}`)}
                  className="w-full md:w-auto bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors shadow-lg"
                >
                  Continuar Aprendendo
                </button>
              </div>
            ) : firstCourseToStart && (
                <div className="mb-12 p-8 rounded-2xl bg-[#6d28d9] flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-grow">
                        <p className="text-sm font-semibold text-purple-200">Pronto para o próximo desafio?</p>
                        <h2 className="text-3xl font-bold text-white mt-1">{firstCourseToStart.title}</h2>
                        <p className="text-base text-purple-200 mt-2">{firstCourseToStart.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <button 
                            onClick={() => firstCourseToStart && handleStartCourse(firstCourseToStart)}
                            className="w-full md:w-auto bg-slate-100 text-[#6d28d9] font-bold py-3 px-8 rounded-lg hover:bg-white transition-colors shadow-lg"
                        >
                            Começar Agora
                        </button>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Cursos em Andamento */}
                    {inProgressCourses.length > 0 && (
                        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Meus Cursos em Andamento</h2>
                            <div className="space-y-6">
                                {inProgressCourses.map(({ course, progress }) => (
                                    <button
                                        key={course.id}
                                        onClick={() => handleCourseNavigation(course)}
                                        className="w-full text-left bg-white/5 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-white/10 transition-colors"
                                    >
                                        <img src={course.imageUrl} alt={course.title} className="w-full sm:w-32 h-20 object-cover rounded-md flex-shrink-0" />
                                        <div className="flex-grow w-full">
                                            <p className="font-bold text-white">{course.title}</p>
                                            <ProgressBar progress={progress} className="mt-2" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                     {/* Cursos Presenciais */}
                    <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Próximas Turmas Presenciais</h2>
                         <div className="space-y-4">
                           {courses.filter(c => c.format === 'presencial' || c.format === 'hibrido').slice(0, 2).map(course => (
                               <OnsiteCourseCard key={course.id} course={course} />
                           ))}
                        </div>
                    </div>
                    
                    {/* Cursos Concluídos */}
                    {completedCourses.length > 0 && (
                         <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                             <h2 className="text-xl font-bold text-white mb-4">Cursos Concluídos</h2>
                             <div className="grid sm:grid-cols-2 gap-6">
                                 {completedCourses.slice(0, showAllCourses ? undefined : 2).map(course => (
                                      <div key={course.id} className="bg-white/5 p-4 rounded-lg text-center group">
                                        <button onClick={() => handleCourseNavigation(course)} className="w-full">
                                            <img src={course.imageUrl} alt={course.title} className="w-full h-24 object-cover rounded-md group-hover:opacity-80 transition-opacity" />
                                            <p className="font-semibold text-white mt-3 text-sm group-hover:text-[#c4b5fd] transition-colors">{course.title}</p>
                                        </button>
                                        <button onClick={() => navigate(`/course/${course.id}/certificate`)} className="mt-3 w-full text-center bg-green-500/10 text-green-300 font-semibold py-2 rounded-lg text-xs hover:bg-green-500/20 transition-colors">
                                            Ver Certificado
                                        </button>
                                    </div>
                                 ))}
                             </div>
                             {completedCourses.length > 2 && (
                                <div className="text-center mt-6">
                                    <button onClick={() => setShowAllCourses(!showAllCourses)} className="text-sm font-semibold text-[#c4b5fd] hover:text-white">
                                        {showAllCourses ? 'Mostrar menos' : `Mostrar todos (${completedCourses.length})`}
                                    </button>
                                </div>
                             )}
                         </div>
                    )}

                </div>

                {/* Sidebar */}
                <aside className="space-y-8">
                    {/* Perfil */}
                    <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
                        <img src={user.avatarUrl} alt={user.name} className="h-24 w-24 rounded-full mx-auto border-4 border-[#8a4add]/50" />
                        <h3 className="mt-4 text-xl font-bold text-white">{user.name}</h3>
                        <p className="text-sm text-gray-400">Nível {userLevel}</p>
                        <ProgressBar progress={xpInCurrentLevel / xpForNextLevel * 100} className="mt-3" />
                        <p className="text-xs text-gray-400 mt-1">{xpInCurrentLevel}/{xpForNextLevel} XP para o próximo nível</p>
                    </div>

                     {/* Feed da Comunidade */}
                    <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Feed da Comunidade</h3>
                        <div className="space-y-4">
                            {feedItems.map((item, index) => (
                                <button key={index} onClick={item.action} className="w-full text-left bg-white/5 hover:bg-white/10 p-3 rounded-lg flex items-start gap-3 transition-colors">
                                    <span className="text-xl mt-1">{item.icon}</span>
                                    <div>
                                        <p className="text-xs text-gray-400">{item.title}</p>
                                        <p className="font-semibold text-white text-sm line-clamp-2">{item.subtitle}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Agenda */}
                    <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Minha Agenda</h3>
                        <div className="space-y-3">
                            {upcomingAppointments.length > 0 ? upcomingAppointments.map((app, index) => (
                                 <div key={index} className="bg-white/5 p-3 rounded-lg flex items-center gap-3">
                                    <div className="text-center w-12 flex-shrink-0">
                                        <p className="font-bold text-white text-lg">{app.date.toLocaleDateString('pt-BR', { day: '2-digit' })}</p>
                                        <p className="text-xs text-gray-400">{app.date.toLocaleDateString('pt-BR', { month: 'short' })}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white text-sm">{app.title}</p>
                                        <p className="text-xs text-gray-400">{app.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                 </div>
                            )) : (
                                 <p className="text-sm text-gray-400 text-center py-4">Nenhum agendamento próximo.</p>
                            )}
                            <button onClick={() => navigate('/connect')} className="w-full mt-4 text-center bg-white/10 text-white font-semibold py-2 rounded-lg text-sm hover:bg-white/20 transition-colors">
                                Ver mentorias e eventos
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
    // This should ideally not happen due to ProtectedRoute, but as a fallback:
    return <div className="text-center py-20">Por favor, faça login para ver seu painel.</div>;
  }
  return user.role === 'student' ? <StudentDashboard /> : <AdminDashboard />;
};

// FIX: Added a default export to the Dashboard component.
export default Dashboard;
