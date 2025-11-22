/**
 * TrilhasView - Página Principal de Trilhas
 * Exibe todas as trilhas disponíveis com filtros
 * Integra TrilhaCard, ProjetoCard, LeaderboardView + Firebase
 */

import React, { useState, useMemo } from 'react';
import TrilhaCard from '../components/TrilhaCard';
import ProjetoCard from '../components/ProjetoCard';
import LeaderboardView from '../components/LeaderboardView';
import { useAppContext } from '../App';
import useTrilhas from '../hooks/useTrilhas';
import useProgresso from '../hooks/useProgresso';
import { TRILHA_JS_COMPLETA, PROJETOS_EXEMPLO, BADGES } from '../DADOS_EXEMPLO_ROCKETSEAT';
import { Trilha, Projeto } from '../TIPOS_CURSO_ROCKETSEAT';

interface TrilhasViewProps {
  userXp?: number;
  currentUserId?: string;
  enrolledTrilhaIds?: string[];
  completedProjetosIds?: string[];
}

const TrilhasView: React.FC<TrilhasViewProps> = ({
  userXp = 250,
  currentUserId,
  enrolledTrilhaIds = [],
  completedProjetosIds = [],
}) => {
  const appContext = useAppContext();
  const userId = currentUserId || appContext?.user?.id || 'user_demo';
  
  // Hooks para dados
  const { trilhas: fbTrilhas, projetos: fbProjetos, loading, error } = useTrilhas();
  const { xp, nivel, enrollTrilha } = useProgresso(userId);

  // Estado UI
  const [selectedTab, setSelectedTab] = useState<'trilhas' | 'projetos' | 'leaderboard'>('trilhas');
  const [selectedNivel, setSelectedNivel] = useState<'todos' | 'iniciante' | 'intermediario' | 'avancado'>('todos');
  const [enrollingTrilhaId, setEnrollingTrilhaId] = useState<string | null>(null);

  // Usar dados do Firebase ou fallback para dados de exemplo
  const trilhas = fbTrilhas.length > 0 ? fbTrilhas : [TRILHA_JS_COMPLETA];
  const projetos = fbProjetos.length > 0 ? fbProjetos : PROJETOS_EXEMPLO;
  const userEnrolledIds = appContext?.user?.enrolledCourseIds || enrolledTrilhaIds;
  const userCompletedIds = appContext?.user?.completedLessonIds || completedProjetosIds;
  const userXpValue = appContext?.user?.xp || xp || userXp || 250;

  // Handler para inscrição em trilha
  const handleEnrollTrilha = async (trilhaId: string) => {
    try {
      setEnrollingTrilhaId(trilhaId);
      await enrollTrilha(trilhaId);
      console.log(`✅ Inscrito na trilha ${trilhaId}`);
    } catch (err) {
      console.error('❌ Erro ao inscrever:', err);
    } finally {
      setEnrollingTrilhaId(null);
    }
  };

  // Mock data de usuarios para leaderboard
  const mockLeaderboard = [
    {
      userId: 'user_1',
      posicao: 1,
      nome: 'João Silva',
      avatar: 'https://via.placeholder.com/100',
      xp: 2500,
      nivel: 'Lenda',
      badge: '👑',
    },
    {
      userId: 'user_2',
      posicao: 2,
      nome: 'Maria Santos',
      avatar: 'https://via.placeholder.com/100',
      xp: 2100,
      nivel: 'Especialista',
      badge: '🦁',
    },
    {
      userId: 'user_3',
      posicao: 3,
      nome: 'Pedro Costa',
      avatar: 'https://via.placeholder.com/100',
      xp: 1850,
      nivel: 'Senior',
      badge: '🦅',
    },
    {
      userId: 'user_4',
      posicao: 4,
      nome: 'Ana Oliveira',
      avatar: 'https://via.placeholder.com/100',
      xp: 1650,
      nivel: 'Senior',
      badge: '🦅',
    },
    {
      userId: 'user_5',
      posicao: 5,
      nome: 'Lucas Alves',
      avatar: 'https://via.placeholder.com/100',
      xp: 1480,
      nivel: 'Desenvolvedor',
      badge: '🦆',
    },
    {
      userId: 'user_6',
      posicao: 6,
      nome: 'Você (Teste)',
      avatar: 'https://via.placeholder.com/100',
      xp: userXp,
      nivel: 'Aprendiz',
      badge: '🐣',
    },
  ];

  // Filtrar trilhas por nível
  const trilhasFiltradas = useMemo(() => {
    return trilhas.filter((t) => selectedNivel === 'todos' || t.nivel === selectedNivel);
  }, [trilhas, selectedNivel]);

  // Filtrar projetos por nível
  const projetos = useMemo(() => {
    let filtered = PROJETOS_EXEMPLO;
    if (selectedNivel !== 'todos') {
      filtered = filtered.filter((p) => p.nivel === selectedNivel);
    }
    return filtered;
  }, [selectedNivel]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1a1f35] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500 border-r-2 border-pink-500 mx-auto mb-4" />
          <p className="text-white text-lg">Carregando trilhas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1a1f35] flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-400 text-lg mb-4">⚠️ {error}</p>
          <p className="text-gray-400">Usando dados locais de exemplo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1a1f35] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Aprenda com <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Trilhas</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Sua jornada de aprendizado começa aqui. Escolha uma trilha progressiva e comece a acumular XP!
          </p>

          {/* User Stats */}
          {userId && (
            <div className="mt-8 inline-block bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-lg p-6">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-gray-400 text-sm">Seu XP Atual</p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {userXpValue.toLocaleString()}
                  </p>
                </div>
                <div className="border-l border-white/20 pl-6">
                  <p className="text-gray-400 text-sm">Trilhas Inscritas</p>
                  <p className="text-3xl font-bold text-white">{userEnrolledIds.length}</p>
                </div>
                <div className="border-l border-white/20 pl-6">
                  <p className="text-gray-400 text-sm">Seu Nível</p>
                  <p className="text-2xl font-bold text-white">{nivel}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {['trilhas', 'projetos', 'leaderboard'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`px-6 py-2.5 rounded-lg font-bold transition-all duration-300 ${
                selectedTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-white/10 text-gray-300 hover:bg-white/15 border border-white/20'
              }`}
            >
              {tab === 'trilhas' && '📚 Trilhas'}
              {tab === 'projetos' && '🎯 Projetos'}
              {tab === 'leaderboard' && '🏆 Leaderboard'}
            </button>
          ))}
        </div>

        {/* Nível Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {['todos', 'iniciante', 'intermediario', 'avancado'].map((nivel) => (
            <button
              key={nivel}
              onClick={() => setSelectedNivel(nivel as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedNivel === nivel
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/15 border border-white/20'
              }`}
            >
              {nivel === 'todos' && 'Todos'}
              {nivel === 'iniciante' && '🥚 Iniciante'}
              {nivel === 'intermediario' && '🦆 Intermediário'}
              {nivel === 'avancado' && '🦅 Avançado'}
            </button>
          ))}
        </div>

        {/* Content */}
        {selectedTab === 'trilhas' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Trilhas Disponíveis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trilhasFiltradas.map((trilha) => {
                  const isEnrolled = userEnrolledIds.includes(trilha.id);
                  return (
                    <TrilhaCard
                      key={trilha.id}
                      id={trilha.id}
                      titulo={trilha.titulo}
                      descricao={trilha.descricao}
                      nivel={trilha.nivel}
                      duracao={trilha.duracao}
                      numAulas={trilha.numAulas}
                      numAlunos={trilha.numAlunos}
                      xpTotal={trilha.xpTotal}
                      avaliacao={trilha.avaliacao}
                      imagem={trilha.imagem}
                      isInscrito={isEnrolled}
                      percentualConclusao={isEnrolled ? 35 : 0}
                      onClick={() => {
                        if (!isEnrolled) {
                          handleEnrollTrilha(trilha.id);
                        } else {
                          console.log('Continuar trilha:', trilha.id);
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'projetos' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Projetos Práticos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projetos.map((projeto) => {
                  const isCompleted = userCompletedIds.includes(projeto.id);
                  return (
                    <ProjetoCard
                      key={projeto.id}
                      id={projeto.id}
                      titulo={projeto.titulo}
                      descricao={projeto.descricao}
                      nivel={projeto.nivel}
                      duracao={projeto.duracao}
                      xpReward={projeto.xpReward}
                      skills={projeto.skills}
                      numSubmissoes={projeto.numSubmissoes}
                      isCompleted={isCompleted}
                      onClick={() => console.log('Clicou em projeto', projeto.id)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'leaderboard' && (
          <div className="flex justify-center">
            <LeaderboardView
              users={mockLeaderboard}
              currentUserId={currentUserId}
              period="semana"
              title="🏆 Leaderboard da Semana"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrilhasView;
