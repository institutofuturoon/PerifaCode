import React, { useMemo } from 'react';
import { Achievement } from '../types';
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
    const { user, users, courses, navigate, navigateToCourse, navigateToCertificate, courseProgress, navigateToInstructorDashboard, openInscriptionModal } = useAppContext();
    
  if (!user) return null; // Should be redirected by router logic, but as a safeguard

  // Render Instructor/Admin Dashboard
  if (user.role === 'instructor' || user.role === 'admin') {
      const { totalStudents, newStudentsLast30d, avgCompletionRate, weeklyEngagement, coursePerformance, studentEngagement } = MOCK_ANALYTICS_DATA_V2;

      return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white">Bem-vindo, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#c4b5fd]">{user.name.split(' ')[0]}</span>!</h1>
          <p className="mt-2 text-lg text-gray-400">
            Acompanhe a saúde da plataforma e o progresso dos seus alunos.
          </p>
        </div>
        
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard title="Total de Alunos" value={totalStudents.toLocaleString('pt-BR')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
            <StatCard title="Novos Alunos (30d)" value={`+${newStudentsLast30d}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>} />
            <StatCard title="Taxa de Conclusão Média" value={`${avgCompletionRate}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard title="Engajamento Semanal" value={`${weeklyEngagement}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
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
      </div>
    );
  }

  // Render Student Dashboard
  const { inProgressCourses, completedCourses } = courseProgress;
  
  const startedOrCompletedCourseIds = useMemo(() => {
    const inProgressIds = inProgressCourses.map(item => item.course.id);
    const completedIds = completedCourses.map(course => course.id);
    return new Set([...inProgressIds, ...completedIds]);
  }, [inProgressCourses, completedCourses]);

  const notStartedCourses = useMemo(() => 
    courses.filter(course => !startedOrCompletedCourseIds.has(course.id)),
    [courses, startedOrCompletedCourseIds]
  );

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
            Acompanhe seu progresso e continue sua jornada.
          </p>
        </div>
        
        {/* Summary Panel */}
        <div className="bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center text-center">
                {/* Level */}
                <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Nível</p>
                    <p className="text-6xl font-black text-[#c4b5fd] mt-1">{userLevel}</p>
                </div>
                
                {/* Streak */}
                <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Dias de Foco</p>
                    <p className="text-6xl font-black text-white flex items-center justify-center gap-2 mt-1">
                        🔥<span>{user.streak}</span>
                    </p>
                </div>
                
                {/* Achievements */}
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

            {/* XP Progress Bar */}
            <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold text-white">Progresso de XP</h3>
                    <p className="text-sm font-semibold text-gray-300">{user.xp} XP Total</p>
                </div>
                <ProgressBar progress={xpInCurrentLevel} />
                <p className="text-xs text-gray-500 text-right mt-1">{xpInCurrentLevel} / {xpForNextLevel} XP para o próximo nível</p>
            </div>
        </div>


        <div className="space-y-12">
            {/* NEW SECTION: EXPLORE COURSES */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Comece uma Nova Jornada</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {notStartedCourses.slice(0, 4).map(course => (
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
                        <button onClick={() => navigate('courses')} className="bg-white/10 text-white font-semibold py-2 px-6 rounded-lg hover:bg-white/20 transition-colors">
                            Ver todos os cursos
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