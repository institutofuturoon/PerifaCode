/**
 * ProjetoCard - Card de Projeto Prático
 * Exibe: Título, skills, duração, XP, dificuldade
 * Design Rocketseat com gradientes
 */

import React, { useState } from 'react';
import { Clock, Award, Code2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ProjetoCardProps {
  id: string;
  titulo: string;
  descricao: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  duracao: number; // minutos
  xpReward: number;
  skills: string[];
  numSubmissoes?: number;
  isCompleted?: boolean;
  onClick?: () => void;
  showStats?: boolean;
}

const ProjetoCard: React.FC<ProjetoCardProps> = ({
  id,
  titulo,
  descricao,
  nivel,
  duracao,
  xpReward,
  skills,
  numSubmissoes = 0,
  isCompleted = false,
  onClick,
  showStats = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const nivelConfig = {
    iniciante: {
      label: 'Iniciante',
      color: 'from-green-500/30 to-emerald-600/30',
      border: 'border-green-500/50',
      badge: 'bg-green-500/20 text-green-400 border-green-500/30',
      icon: '🥚',
    },
    intermediario: {
      label: 'Intermediário',
      color: 'from-blue-500/30 to-cyan-600/30',
      border: 'border-blue-500/50',
      badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      icon: '🦆',
    },
    avancado: {
      label: 'Avançado',
      color: 'from-red-500/30 to-pink-600/30',
      border: 'border-red-500/50',
      badge: 'bg-red-500/20 text-red-400 border-red-500/30',
      icon: '🦅',
    },
  };

  const config = nivelConfig[nivel];
  const minutos = duracao < 60;
  const tempoFormatado = minutos ? `${duracao}min` : `${(duracao / 60).toFixed(1)}h`;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full group text-left transform transition-all duration-300 hover:scale-105"
    >
      {/* Card Container */}
      <div className={`relative bg-gradient-to-br from-white/8 to-white/5 rounded-lg overflow-hidden border border-white/15 shadow-lg hover:shadow-2xl transition-all duration-300 p-5 h-full hover:border-purple-500/50 ${config.border}`}>
        
        {/* Background Gradient Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

        {/* Content - Relative Position */}
        <div className="relative z-10 flex flex-col gap-4 h-full">
          
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Badge Nível */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-3 ${config.badge}`}>
                <span>{config.icon}</span>
                {config.label}
              </div>

              {/* Título */}
              <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 line-clamp-2">
                {titulo}
              </h3>
            </div>

            {/* Completed Badge */}
            {isCompleted && (
              <div className="flex-shrink-0 ml-2">
                <CheckCircle2 size={24} className="text-green-400 drop-shadow-lg" />
              </div>
            )}
          </div>

          {/* Descrição */}
          <p className="text-sm text-gray-400 line-clamp-2 flex-grow">{descricao}</p>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-gray-300 hover:text-white hover:border-purple-500/50 transition-all"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-gray-300 font-bold">
                +{skills.length - 3}
              </span>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {/* Duração */}
            <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-white transition-colors">
              <Clock size={14} className="text-purple-400" />
              <span>{tempoFormatado}</span>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-white transition-colors">
              <Award size={14} className="text-yellow-400" />
              <span className="font-bold">{xpReward} XP</span>
            </div>

            {/* Submissions */}
            {showStats && (
              <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-white transition-colors">
                <Code2 size={14} className="text-pink-400" />
                <span>{numSubmissoes}</span>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            className="w-full mt-auto py-2 px-3 bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all duration-300 group/btn shadow-md hover:shadow-purple-500/40"
          >
            <span>{isCompleted ? 'Ver Solução' : 'Começar Projeto'}</span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </button>
  );
};

export default ProjetoCard;
