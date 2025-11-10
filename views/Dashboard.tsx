import React from 'react';
import { Achievement } from '../types';
import ProgressBar from '../components/ProgressBar';
import { MOCK_ACHIEVEMENTS } from '../constants';
import { useAppContext } from '../App';

const Dashboard: React.FC = () => {
    const { user, navigate, navigateToCourse, navigateToCertificate, courseProgress } = useAppContext();
    
  if (!user) return null; // Should be redirected by router logic, but as a safeguard

  // Render Instructor/Admin Dashboard
  if (user.role === 'instructor' || user.role === 'admin') {
      return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white">Bem-vindo, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#c4b5fd]">{user.name.split(' ')[0]}</span>!</h1>
          <p className="mt-2 text-lg text-gray-400">
            Gerencie seus cursos e interaja com a comunidade a partir do seu painel.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center transition-all duration-300 hover:border-[#8a4add]/50 hover:shadow-lg hover:shadow-[#8a4add]/10 transform hover:-translate-y-1">
                 <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#6d28d9] to-[#8a4add] text-white mb-6 shadow-lg shadow-[#8a4add]/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Painel de Controle</h2>
                <p className="text-gray-400 mt-2 flex-grow">Acesse a área de gerenciamento para criar/editar cursos, ver o progresso dos alunos e administrar a plataforma.</p>
                <button 
                    onClick={() => navigate('admin')}
                    className="mt-6 bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300"
                >
                    Acessar Painel
                </button>
            </div>
             <div className="bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center transition-all duration-300 hover:border-[#8a4add]/50 hover:shadow-lg hover:shadow-[#8a4add]/10 transform hover:-translate-y-1">
                 <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#6d28d9] to-[#8a4add] text-white mb-6 shadow-lg shadow-[#8a4add]/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Comunidade</h2>
                <p className="text-gray-400 mt-2 flex-grow">Interaja com os alunos, veja os projetos mais recentes e participe das discussões para fortalecer a comunidade.</p>
                <button 
                    onClick={() => navigate('community')}
                    className="mt-6 bg-white/10 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/20 transition-colors"
                >
                    Ver Comunidade
                </button>
            </div>
        </div>

      </div>
    );
  }

  // Render Student Dashboard
  const { inProgressCourses, completedCourses } = courseProgress;
  
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
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
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