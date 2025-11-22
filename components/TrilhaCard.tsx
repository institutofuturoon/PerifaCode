/**
 * TrilhaCard - Card de Trilha de Aprendizado
 * Exibe: Título, descrição, progresso, duração, alunos
 * Inspirado em Rocketseat + design gradiente
 */

import React, { useState } from 'react';
import { ArrowRight, Clock, Users, Zap, Lock } from 'lucide-react';

interface TrilhaCardProps {
  id: string;
  titulo: string;
  descricao: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  duracao: number; // horas
  numAulas: number;
  numAlunos: number;
  percentualConclusao?: number; // 0-100
  xpTotal: number;
  avaliacao: number; // 0-5
  imagem?: string;
  hasPrerequisito?: boolean;
  isInscrito?: boolean;
  onClick?: () => void;
}

const TrilhaCard: React.FC<TrilhaCardProps> = ({
  id,
  titulo,
  descricao,
  nivel,
  duracao,
  numAulas,
  numAlunos,
  percentualConclusao = 0,
  xpTotal,
  avaliacao,
  imagem,
  hasPrerequisito = false,
  isInscrito = false,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const nivelConfig = {
    iniciante: {
      label: '🥚 Iniciante',
      color: 'from-green-400 to-emerald-600',
      badge: 'bg-green-500/10 border-green-500/30 text-green-400',
    },
    intermediario: {
      label: '🦆 Intermediário',
      color: 'from-blue-400 to-cyan-600',
      badge: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    },
    avancado: {
      label: '🦅 Avançado',
      color: 'from-red-400 to-pink-600',
      badge: 'bg-red-500/10 border-red-500/30 text-red-400',
    },
  };

  const config = nivelConfig[nivel];
  const isCompleted = percentualConclusao === 100;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={hasPrerequisito}
      className="relative w-full group text-left transform transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {/* Card Container */}
      <div className="bg-gradient-to-br from-white/8 to-white/5 rounded-xl overflow-hidden border border-white/15 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 h-full">
        
        {/* Header com Imagem e Badge */}
        <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          {imagem ? (
            <img
              src={imagem}
              alt={titulo}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${config.color} opacity-30`} />
          )}

          {/* Overlay com Badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-between p-4">
            {/* Top Badges */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1.5 rounded-full border text-xs font-bold ${config.badge}`}>
                {config.label}
              </span>
              {isCompleted && (
                <span className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold flex items-center gap-1">
                  ✅ Concluído
                </span>
              )}
              {hasPrerequisito && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
                  <Lock size={12} />
                  Desbloqueie
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-bold text-sm">★ {avaliacao.toFixed(1)}</span>
              <span className="text-white/70 text-xs">({numAlunos.toLocaleString()} alunos)</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Título */}
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 line-clamp-2">
              {titulo}
            </h3>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{descricao}</p>
          </div>

          {/* Progresso (Se inscrito) */}
          {isInscrito && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Seu Progresso</span>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {percentualConclusao}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500`}
                  style={{ width: `${percentualConclusao}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {/* Duração */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-purple-400" />
                <span className="text-xs text-gray-500">Duração</span>
              </div>
              <p className="text-sm font-bold text-white">{duracao}h</p>
            </div>

            {/* Aulas */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-pink-500/30 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={14} className="text-pink-400" />
                <span className="text-xs text-gray-500">Aulas</span>
              </div>
              <p className="text-sm font-bold text-white">{numAulas}</p>
            </div>

            {/* XP */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-400 font-bold text-sm">⚡</span>
                <span className="text-xs text-gray-500">XP</span>
              </div>
              <p className="text-sm font-bold text-white">{xpTotal}</p>
            </div>
          </div>

          {/* Button CTA */}
          <button
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 group/btn shadow-lg hover:shadow-purple-500/50"
            disabled={hasPrerequisito}
          >
            <span>{isInscrito ? 'Continuar' : 'Começar Trilha'}</span>
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </button>
  );
};

export default TrilhaCard;
