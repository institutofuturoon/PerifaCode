import React, { useState, useEffect } from 'react';
import { User, Achievement } from '../types';
import ProgressBar from '../components/ProgressBar';
import { MOCK_ACHIEVEMENTS } from '../constants';
import { useAppContext } from '../App';
import { GoogleGenAI } from "@google/genai";

const Dashboard: React.FC = () => {
    const { user, navigate, navigateToCourse, navigateToCertificate, courseProgress } = useAppContext();
    const [quote, setQuote] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const prompt = `Gere uma citação motivacional curta e poderosa (1-2 frases) para um estudante de tecnologia da periferia. O tom deve ser inspirador, direto e usar uma linguagem que conecte com a realidade brasileira, como "correria", "foguete não tem ré", etc. Foque em temas de superação, disciplina e o poder da tecnologia para mudar vidas.`;
                
                const response = await ai.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: prompt,
                });

                setQuote(response.text);
            } catch (error) {
                console.error("Failed to fetch motivational quote:", error);
                setQuote("Acredite no seu corre. Cada linha de código é um passo para transformar sua realidade.");
            }
        };
        fetchQuote();
    }, []);
    
  if (!user) return null; // Should be redirected by router logic, but as a safeguard

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
          <p className="mt-2 text-lg text-gray-400 italic min-h-[28px]">
            {quote ? `"${quote}"` : "Continue sua jornada de onde parou. O futuro te espera!"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-white">Meus Cursos em Andamento</h2>
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

            <h2 className="text-2xl font-bold text-white pt-8">Meus Certificados</h2>
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
                              <p className="text-sm text-gray-400">Concluído</p>
                              <button onClick={() => navigateToCertificate(course)} className="text-sm text-[#c4b5fd] hover:underline">Ver certificado</button>
                          </div>
                      </div>
                  )
              })}
              {completedCourses.length === 0 && (
                <div className="text-center py-6 bg-black/20 rounded-lg border border-white/10 col-span-full">
                  <p className="text-gray-400">Nenhum certificado ainda. Conclua um curso para ganhar o seu!</p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-8">
              <div className="bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start">
                      <div>
                          <h3 className="text-xl font-bold text-white">Meu Progresso</h3>
                          <p className="text-gray-300 mt-1 text-sm">{user.xp} XP</p>
                      </div>
                      <div className="text-center">
                          <p className="text-sm text-gray-400">Nível</p>
                          <p className="text-3xl font-bold text-[#c4b5fd]">{userLevel}</p>
                      </div>
                  </div>
                  <div className="mt-2">
                    <ProgressBar progress={xpInCurrentLevel} />
                    <p className="text-xs text-gray-500 text-right mt-1">{xpInCurrentLevel} / {xpForNextLevel} XP para o próximo nível</p>
                  </div>
                  <h4 className="text-lg font-bold text-white mt-6 mb-3">Minhas Conquistas</h4>
                  <div className="flex flex-wrap gap-4">
                    {userAchievements.map(ach => (
                      <div key={ach.id} className="text-center" title={`${ach.title}: ${ach.description}`}>
                          <span className="text-4xl filter grayscale-0 opacity-100 transition-all duration-300 hover:scale-110">{ach.icon}</span>
                      </div>
                    ))}
                    {MOCK_ACHIEVEMENTS.filter(ach => !user.achievements.includes(ach.id)).slice(0, 5 - userAchievements.length).map(ach => (
                      <div key={ach.id} className="text-center" title={`${ach.title}: ${ach.description}`}>
                          <span className="text-4xl filter grayscale opacity-20">?</span>
                      </div>
                    ))}
                  </div>
              </div>
              
              <div className="bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10 flex items-center gap-4">
                  <span className="text-5xl">🔥</span>
                  <div>
                      <h3 className="text-xl font-bold text-white">{user.streak} dias de Foco!</h3>
                      <p className="text-gray-400 text-sm">Continue assim para não perder sua sequência.</p>
                  </div>
              </div>

              <div className="bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-bold text-white">Comunidade</h3>
                  <p className="text-gray-300 mt-2 text-sm">Conecte-se com outros alunos e mentores. Tire dúvidas, compartilhe projetos e cresça em conjunto.</p>
                  <a href="#" className="mt-4 block w-full text-center bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-2 rounded-lg hover:opacity-90 transition-colors duration-300 shadow-lg shadow-purple-500/20">
                      Acessar Discord
                  </a>
              </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;