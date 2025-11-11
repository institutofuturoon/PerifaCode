import React, { useState, useMemo } from 'react';
import { useAppContext } from '../App';
import { User, MentorSession } from '../types';

const Admin: React.FC = () => {
  const { 
    user, users, courses, articles, team, mentorSessions,
    handleEditCourse, handleCreateCourse,
    handleEditArticle, handleCreateArticle, handleDeleteArticle, handleToggleArticleStatus,
    handleCreateUser, handleEditUser, handleDeleteUser,
    navigateToInstructorDashboard,
    handleAddSessionSlot, handleRemoveSessionSlot,
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState(user?.role === 'instructor' ? 'myAgenda' : 'courses');

  if (!user) return null;

  const coursesForUser = user.role === 'admin' ? courses : courses.filter(c => c.instructorId === user.id);
  const articlesForUser = user.role === 'admin' ? articles : articles.filter(a => a.author === user.name);
  const students = users.filter(u => u.role === 'student' && u.accountStatus !== 'inactive');

  const CoursesTable = () => (
    <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 overflow-hidden">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Título do Curso
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Trilha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Módulos
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Aulas
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {coursesForUser.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  {user.role === 'instructor' ? 'Você ainda não criou nenhum curso.' : 'Nenhum curso cadastrado.'}
                </td>
              </tr>
            ) : (
              coursesForUser.map((course) => (
                <tr key={course.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{course.title}</div>
                    <div className="text-xs text-gray-400">{course.skillLevel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.track === 'Frontend' ? 'bg-[#8a4add]/20 text-[#c4b5fd]' : 'bg-green-500/20 text-green-300'}`}>
                      {course.track}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.modules.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {course.modules.reduce((acc, module) => acc + module.lessons.length, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button onClick={() => navigateToInstructorDashboard(course)} className="text-green-400 hover:text-green-300">
                      Ver Progresso
                    </button>
                    <button onClick={() => handleEditCourse(course)} className="text-[#c4b5fd] hover:text-white">
                      Editar
                    </button>
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Título do Artigo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Autor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Categoria
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {articlesForUser.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    Nenhum artigo publicado.
                  </td>
                </tr>
            ) : (
              articlesForUser.map((article) => (
                <tr key={article.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{article.title}</div>
                    <div className="text-xs text-gray-400">{article.subtitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{article.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#8a4add]/20 text-[#c4b5fd]">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.status === 'published' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
                      {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{article.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button onClick={() => handleToggleArticleStatus(article.id)} className={article.status === 'published' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}>
                        {article.status === 'published' ? 'Desativar' : 'Publicar'}
                    </button>
                    <button onClick={() => handleEditArticle(article)} className="text-[#c4b5fd] hover:text-white">
                      Editar
                    </button>
                    <button onClick={() => handleDeleteArticle(article.id)} className="text-red-400 hover:text-red-300">
                      Excluir
                    </button>
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
                            <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={member.avatarUrl} alt={member.name} />
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-white">{member.name}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{member.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">{member.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{member.isMentor ? '✅' : '❌'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button onClick={() => handleEditUser(member)} className="text-[#c4b5fd] hover:text-white">Editar</button>
                      {user?.id !== member.id && (
                        <button onClick={() => handleDeleteUser(member.id)} className="text-red-400 hover:text-red-300">Desativar</button>
                      )}
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Nome
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Email
              </th>
               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                XP
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    Nenhum aluno cadastrado.
                  </td>
                </tr>
            ) : (
                students.map((student) => (
                <tr key={student.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={student.avatarUrl} alt={student.name} />
                        </div>
                        <div className="ml-4">
                        <div className="text-sm font-medium text-white">{student.name}</div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{student.email}</div>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.xp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button onClick={() => handleEditUser(student)} className="text-[#c4b5fd] hover:text-white">
                          Editar
                      </button>
                      {user?.id !== student.id && (
                        <button onClick={() => handleDeleteUser(student.id)} className="text-red-400 hover:text-red-300">
                            Desativar
                        </button>
                      )}
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
    const next7Days = useMemo(() => Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date;
    }), []);

    const sessionsByDateTime = useMemo(() => {
        const map = new Map<string, MentorSession>();
        mentorSessions.filter(s => s.mentorId === user.id).forEach(s => {
            map.set(`${s.date}-${s.time}`, s);
        });
        return map;
    }, [mentorSessions, user.id]);

    return (
        <div className="bg-black/20 backdrop-blur-xl rounded-b-lg border border-t-0 border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Gerenciar meus horários de mentoria</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {next7Days.map(day => {
                    const dateKey = day.toISOString().split('T')[0];
                    return (
                        <div key={dateKey}>
                            <div className="p-2 rounded-t-md bg-white/10 text-center">
                                <p className="font-bold text-white">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                                <p className="text-xs text-gray-300">{day.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</p>
                            </div>
                            <div className="p-2 space-y-2 bg-white/5 rounded-b-md">
                                {timeSlots.map(time => {
                                    const session = sessionsByDateTime.get(`${dateKey}-${time}`);
                                    const student = session?.studentId ? users.find(u => u.id === session.studentId) : null;

                                    if (session?.isBooked && student) {
                                        return (
                                            <div key={time} className="w-full text-xs p-2 rounded bg-red-500/20 text-red-300 text-center">
                                                <p className="font-bold">Agendado</p>
                                                <p>{student.name.split(' ')[0]}</p>
                                                {session.googleMeetUrl && 
                                                    <a href={session.googleMeetUrl} target="_blank" rel="noopener noreferrer" className="text-[#c4b5fd] hover:underline text-[10px]">Link da Sala</a>
                                                }
                                            </div>
                                        );
                                    }

                                    if (session && !session.isBooked) {
                                        return (
                                            <button key={time} onClick={() => handleRemoveSessionSlot(user.id, dateKey, time)} className="w-full text-xs font-semibold p-2 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors">
                                                Disponível<br/><span className="font-normal text-gray-400">Bloquear?</span>
                                            </button>
                                        );
                                    }

                                    return (
                                        <button key={time} onClick={() => handleAddSessionSlot(user.id, dateKey, time)} className="w-full text-xs font-semibold p-2 rounded bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 transition-colors">
                                            {time}<br/><span className="font-normal text-gray-500">Disponibilizar</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
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
  const showCreateButton = user.role === 'admin' || (user.role === 'instructor' && (activeTab === 'courses' || activeTab === 'blog'));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-white">
            {user.role === 'admin' ? 'Painel de Admin' : 'Painel do Instrutor'}
          </h1>
          <p className="mt-2 text-lg text-gray-400">Gerencie o conteúdo e os usuários da plataforma.</p>
        </div>
        {showCreateButton && createButton && (
            <button
            onClick={createButton.action}
            className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40"
            >
            {createButton.text}
            </button>
        )}
      </div>

      <div>
        <div className="border-b border-white/10">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {(user.role === 'admin' || user.role === 'instructor') && (
                 <button
                  onClick={() => setActiveTab('myAgenda')}
                  className={`${
                    activeTab === 'myAgenda'
                      ? 'border-[#8a4add] text-[#8a4add]'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                  Minha Agenda
                </button>
            )}
            <button
              onClick={() => setActiveTab('courses')}
              className={`${
                activeTab === 'courses'
                  ? 'border-[#8a4add] text-[#8a4add]'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Cursos
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`${
                activeTab === 'blog'
                  ? 'border-[#8a4add] text-[#8a4add]'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Blog
            </button>
            {user.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('teamMembers')}
                  className={`${
                    activeTab === 'teamMembers'
                      ? 'border-[#8a4add] text-[#8a4add]'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                  Equipe
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`${
                    activeTab === 'students'
                      ? 'border-[#8a4add] text-[#8a4add]'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                  Alunos
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="mt-4">
            {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default Admin;