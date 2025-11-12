import React, { useMemo, useState, useRef } from 'react';
import { Achievement, Lesson, MentorSession, User } from '../types';
import ProgressBar from '../components/ProgressBar';
import { MOCK_ACHIEVEMENTS, MOCK_ANALYTICS_DATA_V2 } from '../constants';
import { useAppContext } from '../App';
import CourseCard from '../components/CourseCard';
import OnsiteCourseCard from '../components/OnsiteCourseCard';

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


const Dashboard: React.FC = () => {
    const { 
      user, users, courses, articles, team, mentorSessions,
      navigate, navigateToCourse, navigateToCertificate, courseProgress, 
      navigateToInstructorDashboard, openInscriptionModal, mentors, 
      navigateToLesson, projects, events, navigateToProject, 
      navigateToArticle, navigateToEvent,
      handleEditCourse, handleCreateCourse,
      handleEditArticle, handleCreateArticle, handleDeleteArticle, handleToggleArticleStatus,
      handleCreateUser, handleEditUser, handleDeleteUser, handleSaveTeamOrder,
      handleAddSessionSlot, handleRemoveSessionSlot,
    } = useAppContext();
    const [showAllCourses, setShowAllCourses] = useState(false);
    const [activeTab, setActiveTab] = useState(user?.role === 'instructor' ? 'myAgenda' : 'courses');
    
  if (!user) return null; // Should be redirected by router logic, but as a safeguard

  // Render Instructor/Admin Dashboard
  if (user.role === 'instructor' || user.role === 'admin') {
      const { totalStudents, newStudentsLast30d, avgCompletionRate, weeklyEngagement, coursePerformance, studentEngagement } = MOCK_ANALYTICS_DATA_V2;
      const [isTeamOrdering, setIsTeamOrdering] = useState(false);

      // --- Copied from Admin.tsx ---
      const coursesForUser = user.role === 'admin' ? courses : courses.filter(c => c.instructorId === user.id);
      const articlesForUser = user.role === 'admin' ? articles : articles.filter(a => a.author === user.name);
      const students = users.filter(u => u.role === 'student' && u.accountStatus !== 'inactive');

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
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.track === 'Frontend' ? 'bg-[#8a4add]/20 text-[#c4b5fd]' : 'bg-green-500/20 text-green-300'}`}>{course.track}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.modules.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.modules.reduce((acc, module) => acc + module.lessons.length, 0)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                        <button onClick={() => navigateToInstructorDashboard(course)} className="text-green-400 hover:text-green-300">Ver Progresso</button>
                        <button onClick={() => handleEditCourse(course)} className="text-[#c4b5fd] hover:text-white">Editar</button>
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
                        <button onClick={() => handleEditArticle(article)} className="text-[#c4b5fd] hover:text-white">Editar</button>
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
                        <button onClick={() => handleEditUser(member)} className="text-[#c4b5fd] hover:text-white">Editar</button>
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
                      <button onClick={() => handleEditUser(student)} className="text-[#c4b5fd] hover:text-white">Editar</button>
                      {user?.id !== student.id && (<button onClick={() => handleDeleteUser(student.id)} className="text-red-400 hover:text-red-300">Desativar</button>)}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
  );

  const MyAgendaPanel = () => {
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

      const TeamOrderingPanel = () => {
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

      const renderActiveTab = () => {
        switch (activeTab) {
            case 'courses': return <CoursesTable />;
            case 'blog': return <BlogTable />;
            case 'teamMembers': return <TeamMembersTable />;
            case 'students': return <StudentsTable />;
            case 'myAgenda': return <MyAgendaPanel />;
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
      const showCreateButton = (user.role === 'admin' || (user.role === 'instructor' && (activeTab === 'courses' || activeTab === 'blog'))) && !isTeamOrdering;
      // --- End of Copied from Admin.tsx ---

      return (
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
            <StatCard title="Total de Alunos" value={totalStudents.toLocaleString('pt-BR')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
            <StatCard title="Novos Alunos (30d)" value={`+${newStudentsLast30d}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>} />
            <StatCard title="Taxa de Conclusão Média" value={`${avgCompletionRate}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard title="Engajamento Semanal" value={`${weeklyEngagement}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
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
                                    <button onClick={() => navigateToInstructorDashboard(course)} className="text-xs font-semibold text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
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
                {isTeamOrdering && activeTab === 'teamMembers' ? <TeamOrderingPanel /> : renderActiveTab()}
            </div>
        </div>

      </div>
    );
  }

  // Render Student Dashboard
  const { inProgressCourses, completedCourses } = courseProgress;
  
  const latestInProgress = inProgressCourses.length > 0 ? inProgressCourses[0] : null;

  const nextLesson: Lesson | null = useMemo(() => {
    if (!latestInProgress || !user) return null;
    const allLessons = latestInProgress.course.modules.flatMap(m => m.lessons);
    return allLessons.find(l => !user.completedLessonIds.includes(l.id)) || null;
  }, [latestInProgress, user]);

  const upcomingAppointments = useMemo(() => {
    if (!user) return [];
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
  }, [user, mentorSessions, mentors]);

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
            action: () => navigateToProject(latestProject),
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
                action: () => navigateToArticle(latestArticle),
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
                action: () => navigateToEvent(nextEvent),
            });
        }
    }
    
    return items.slice(0, 3);
}, [projects, articles, events, users, navigateToProject, navigateToArticle, navigateToEvent]);


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
    <div className="bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white">Bem-vindo de volta, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#c4b5fd]">{user.name.split(' ')[0]}</span>!</h1>
          <p className="mt-2 text-lg text-gray-400">
            Sua jornada de aprendizado continua. Vamos pra cima!
          </p>
        </div>
        
        {latestInProgress && nextLesson ? (
          <div className="mb-12 p-8 rounded-2xl border border-[#8a4add]/30 bg-gradient-to-br from-[#8a4add]/10 via-[#09090B]/50 to-[#09090B]/50 flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-[#8a4add]/10">
            <img src={latestInProgress.course.imageUrl} alt={latestInProgress.course.title} className="w-full md:w-64 h-40 object-cover rounded-lg"/>
            <div className="flex-1 w-full">
              <p className="text-sm font-semibold text-gray-400">Continue de onde parou</p>
              <h2 className="text-2xl font-bold text-white mt-1">{latestInProgress.course.title}</h2>
              <p className="text-md text-[#c4b5fd] mt-2">Próxima aula: {nextLesson.title}</p>
              <ProgressBar progress={latestInProgress.progress} className="my-4"/>
            </div>
            <button
              onClick={() => navigateToLesson(latestInProgress.course, nextLesson!)}
              className="w-full md:w-auto flex-shrink-0 bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30"
            >
              Continuar Aula
            </button>
          </div>
        ) : firstCourseToStart && (
           <div className="mb-12 p-8 rounded-2xl border border-[#8a4add]/30 bg-gradient-to-br from-[#8a4add]/10 via-[#09090B]/50 to-[#09090B]/50 flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-[#8a4add]/10">
            <img src={firstCourseToStart.imageUrl} alt={firstCourseToStart.title} className="w-full md:w-64 h-40 object-cover rounded-lg"/>
            <div className="flex-1 w-full text-center md:text-left">
                <p className="text-sm font-semibold text-gray-400">Sua jornada começa aqui</p>
                <h2 className="text-2xl font-bold text-white mt-1">Comece sua primeira trilha de aprendizado</h2>
                <p className="text-md text-[#c4b5fd] mt-2">Nossa sugestão para você: {firstCourseToStart.title}</p>
            </div>
            <button
              onClick={() => navigateToCourse(firstCourseToStart)}
              className="w-full md:w-auto flex-shrink-0 bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30"
            >
              Começar a Aprender
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center text-center">
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Nível</p>
                        <p className="text-6xl font-black text-[#c4b5fd] mt-1">{userLevel}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Dias de Foco</p>
                        <p className="text-6xl font-black text-white flex items-center justify-center gap-2 mt-1">
                            🔥<span>{user.streak}</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Conquistas</p>
                        <div className="flex flex-wrap gap-4 justify-center min-h-[48px] items-center">
                            {userAchievements.length > 0 ? (
                                userAchievements.map(ach => (
                                    <div key={ach.id} className="group relative" title={`${ach.title}: ${ach.description}`}>
                                        <span className="text-4xl cursor-pointer transition-transform transform hover:scale-110">{ach.icon}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Nenhuma ainda.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-white/10 pt-6">
                    <h3 className="text-lg font-bold text-white mb-1">Progresso de XP</h3>
                    <ProgressBar progress={xpInCurrentLevel} />
                    <p className="text-xs text-gray-500 text-right mt-1">{xpInCurrentLevel} / {xpForNextLevel} XP para o próximo nível</p>
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c4b5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Minha Agenda
                    </h2>
                    <div className="space-y-4">
                    {upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map((app, index) => (
                        <div key={index} className="bg-white/5 p-3 rounded-lg flex items-center gap-4">
                            <div className="flex-shrink-0 text-center w-14 bg-black/20 p-2 rounded-md">
                            <p className="text-xs font-bold text-gray-400">{app.date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}</p>
                            <p className="text-xl font-black text-white">{app.date.getDate()}</p>
                            </div>
                            <div>
                            <p className="font-semibold text-white text-sm">{app.title}</p>
                            <p className="text-xs text-gray-400">{app.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • Mentoria</p>
                            </div>
                        </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                        <p className="text-gray-400">Nenhum compromisso agendado.</p>
                        <button onClick={() => navigate('connect')} className="mt-2 text-sm text-[#c4b5fd] font-semibold">Agendar mentoria</button>
                        </div>
                    )}
                    </div>
                </div>

                <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c4b5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h2m0 0h2" /></svg>
                        Acontece na Quebrada
                    </h2>
                    <div className="space-y-4">
                        {feedItems.length > 0 ? (
                            feedItems.map((item, index) => (
                                <button key={index} onClick={item.action} className="w-full text-left bg-white/5 p-3 rounded-lg flex items-start gap-4 hover:bg-white/10 transition-colors">
                                    <div className="flex-shrink-0 text-center w-10 h-10 bg-black/20 flex items-center justify-center rounded-md text-xl">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white text-sm">{item.title}</p>
                                        <p className="text-xs text-gray-400 line-clamp-1">{item.subtitle}</p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400">Nenhuma novidade no momento.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-12">
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Comece uma Nova Jornada</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500">
                    {(showAllCourses ? notStartedCourses : notStartedCourses.slice(0, 4)).map(course => (
                        <CourseCard key={course.id} course={course} onCourseSelect={navigateToCourse} />
                    ))}
                </div>
                {notStartedCourses.length === 0 && (
                    <div className="text-center py-10 bg-black/20 rounded-lg border border-white/10">
                        <p className="text-gray-400">Parabéns! Você já interagiu com todos os nossos cursos.</p>
                        <p className="text-gray-500 text-sm mt-1">Fique de olho para novos lançamentos!</p>
                    </div>
                )}
                {notStartedCourses.length > 4 && (
                    <div className="text-center mt-8">
                        <button onClick={() => setShowAllCourses(prev => !prev)} className="bg-white/10 text-white font-semibold py-2 px-6 rounded-lg hover:bg-white/20 transition-colors">
                            {showAllCourses ? 'Mostrar menos' : 'Ver todos os cursos'}
                        </button>
                    </div>
                )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Meus Cursos em Andamento</h2>
              <div className="space-y-6">
                {inProgressCourses.map(({ course, progress }) => {
                  if (!course) return null;
                  return (
                    <button 
                      key={course.id} 
                      onClick={() => navigateToCourse(course)}
                      className="w-full bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10 flex flex-col sm:flex-row items-center gap-6 hover:border-[#8a4add]/50 hover:shadow-lg transition-all duration-300 text-left"
                    >
                      <img src={course.imageUrl} alt={course.title} className="w-full sm:w-40 h-auto rounded-md object-cover"/>
                      <div className="flex-1 w-full">
                        <h3 className="font-bold text-lg text-white">{course.title}</h3>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{course.description}</p>
                        <ProgressBar progress={progress} className="mt-4"/>
                      </div>
                    </button>
                  );
                })}
                {inProgressCourses.length === 0 && (
                  <div className="text-center py-10 bg-black/20 rounded-lg border border-white/10">
                    <p className="text-gray-400">Você ainda não iniciou nenhum curso.</p>
                    <button onClick={() => navigate('courses')} className="mt-4 text-[#c4b5fd] font-semibold">Explorar cursos</button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Meus Certificados</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {completedCourses.map(course => {
                    if(!course) return null;
                    return (
                        <div key={course.id} className="bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10 flex items-center gap-4 hover:border-[#8a4add]/50 hover:shadow-lg transition-all duration-300">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-[#6d28d9] to-[#8a4add] flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{course.title}</h4>
                                <button onClick={() => navigateToCertificate(course)} className="text-sm text-[#c4b5fd] hover:underline">Ver certificado</button>
                            </div>
                        </div>
                    )
                })}
                {completedCourses.length === 0 && (
                  <div className="text-center py-10 bg-black/20 rounded-lg border border-white/10 col-span-full">
                    <p className="text-gray-400">Nenhum certificado ainda. Conclua um curso para ganhar o seu!</p>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;