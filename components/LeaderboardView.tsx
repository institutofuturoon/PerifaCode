/**
 * LeaderboardView - Vista de Rankings e Leaderboard
 * Exibe: Top 10 (ou mais), rank atual do usuário, filtros
 * Design Rocketseat com animações
 */

import React, { useState, useMemo } from 'react';
import { Trophy, TrendingUp, Filter, Medal } from 'lucide-react';

interface RankingUser {
  userId: string;
  posicao: number;
  nome: string;
  avatar: string;
  xp: number;
  nivel: string;
  badge?: string;
}

interface LeaderboardViewProps {
  users: RankingUser[];
  currentUserId?: string;
  period?: 'semana' | 'mes' | 'todos';
  onPeriodChange?: (period: 'semana' | 'mes' | 'todos') => void;
  title?: string;
  showCategoryFilter?: boolean;
}

const getMedalColor = (posicao: number) => {
  switch (posicao) {
    case 1:
      return { medal: '🥇', bg: 'from-yellow-400/20 to-amber-600/20', border: 'border-yellow-500/50', glow: 'shadow-yellow-500/50' };
    case 2:
      return { medal: '🥈', bg: 'from-gray-400/20 to-slate-600/20', border: 'border-gray-500/50', glow: 'shadow-gray-500/50' };
    case 3:
      return { medal: '🥉', bg: 'from-orange-400/20 to-amber-600/20', border: 'border-orange-500/50', glow: 'shadow-orange-500/50' };
    default:
      return { medal: '✨', bg: 'from-purple-400/10 to-pink-600/10', border: 'border-white/20', glow: 'shadow-purple-500/30' };
  }
};

const getNivelIcon = (nivel: string) => {
  const niveis: Record<string, string> = {
    ovo: '🥚',
    filhote: '🐣',
    desenvolvedor: '🦆',
    senior: '🦅',
    especialista: '🦁',
    lenda: '👑',
  };
  return niveis[nivel.toLowerCase()] || '⭐';
};

const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  users,
  currentUserId,
  period = 'semana',
  onPeriodChange,
  title = '🏆 Leaderboard',
  showCategoryFilter = false,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'semana' | 'mes' | 'todos'>(period);
  const [selectedCategory, setSelectedCategory] = useState<'geral' | 'trilha' | 'projetos'>('geral');

  const handlePeriodChange = (newPeriod: 'semana' | 'mes' | 'todos') => {
    setSelectedPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  // Encontrar posição do usuário atual
  const currentUserRank = useMemo(
    () => users.find((u) => u.userId === currentUserId),
    [users, currentUserId]
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy size={28} className="text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Period Filter */}
          <div className="flex gap-2 flex-wrap">
            {['semana', 'mes', 'todos'].map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p as 'semana' | 'mes' | 'todos')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                  selectedPeriod === p
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-white/10 text-gray-300 hover:bg-white/15 border border-white/20'
                }`}
              >
                {p === 'semana' ? 'Esta Semana' : p === 'mes' ? 'Este Mês' : 'Todos os Tempos'}
              </button>
            ))}
          </div>

          {/* Category Filter (Optional) */}
          {showCategoryFilter && (
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-bold text-sm hover:bg-white/15 transition-all cursor-pointer"
              >
                <option value="geral">Geral</option>
                <option value="trilha">Por Trilha</option>
                <option value="projetos">Projetos</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Current User Position (If not in top) */}
      {currentUserRank && currentUserRank.posicao > 10 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-purple-400">#{currentUserRank.posicao}</span>
              <div>
                <img
                  src={currentUserRank.avatar}
                  alt={currentUserRank.nome}
                  className="w-12 h-12 rounded-full border 2 border-purple-400"
                />
              </div>
              <div>
                <p className="font-bold text-white">{currentUserRank.nome}</p>
                <p className="text-sm text-gray-300">{getNivelIcon(currentUserRank.nivel)} Você está aqui!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-400">{currentUserRank.xp.toLocaleString()}</p>
              <p className="text-xs text-gray-400">XP</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-3">
        {users.slice(0, 10).map((user, index) => {
          const medalConfig = getMedalColor(user.posicao);
          const isCurrentUser = user.userId === currentUserId;

          return (
            <div
              key={user.userId}
              className={`relative group rounded-lg overflow-hidden transition-all duration-300 ${
                isCurrentUser ? 'scale-105 z-10' : ''
              }`}
            >
              {/* Card Background */}
              <div
                className={`bg-gradient-to-r ${medalConfig.bg} ${medalConfig.border} border p-4 backdrop-blur-sm shadow-lg ${medalConfig.glow} hover:shadow-2xl transition-all duration-300 ${
                  isCurrentUser ? `${medalConfig.glow} shadow-xl` : ''
                }`}
              >
                <div className="relative z-10 flex items-center justify-between">
                  {/* Left: Position + Info */}
                  <div className="flex items-center gap-4 flex-1">
                    {/* Position Medal */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-xl font-bold text-white">
                        <span className="absolute -top-2 -right-2">{medalConfig.medal}</span>
                        #{user.posicao}
                      </div>
                      {isCurrentUser && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-500 border 2 border-white animate-pulse" />
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={user.avatar}
                        alt={user.nome}
                        className={`w-12 h-12 rounded-full border-2 transition-all ${
                          isCurrentUser ? 'border-purple-400 ring-2 ring-purple-500/50' : 'border-white/20'
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-bold text-white truncate ${
                              isCurrentUser ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : ''
                            }`}
                          >
                            {user.nome}
                          </p>
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 text-xs font-bold bg-purple-600/30 border border-purple-500/50 rounded-full text-purple-300 whitespace-nowrap">
                              Você
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{getNivelIcon(user.nivel)} {user.nivel}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: XP */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-400">{user.xp.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">XP</p>
                  </div>
                </div>
              </div>

              {/* Hover Effect - Arrow */}
              {!isCurrentUser && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <TrendingUp size={20} className="text-purple-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      {users.length > 10 && (
        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg text-center">
          <p className="text-sm text-gray-400">
            Vendo{' '}
            <span className="font-bold text-white">10 de {users.length}</span> participantes
            {currentUserRank && currentUserRank.posicao > 10 && (
              <>
                {' • '}
                <span className="text-purple-400 font-bold">Você está em #{currentUserRank.posicao}</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardView;
