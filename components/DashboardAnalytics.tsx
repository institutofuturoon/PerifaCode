import React from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import { LEVELS, XP_EVENTS } from '../utils/xpSystem';

interface DashboardAnalyticsProps {
  user: User;
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
}

const MetricCard: React.FC<{
  icon: string;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
  delay: number;
}> = ({ icon, label, value, subtext, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-gradient-to-br ${color} border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all hover:shadow-xl`}
  >
    <div className="flex items-start justify-between mb-4">
      <span className="text-4xl">{icon}</span>
    </div>
    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{label}</p>
    <p className="text-3xl font-black text-white">{value}</p>
    {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
  </motion.div>
);

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  user,
  totalCoursesEnrolled,
  totalCoursesCompleted,
}) => {
  // Calcular nível atual
  const currentLevel = LEVELS.find(
    (l) => user.xp >= l.minXP && user.xp <= l.maxXP
  ) || LEVELS[LEVELS.length - 1];

  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const xpInCurrentLevel = user.xp - currentLevel.minXP;
  const xpNeededForLevel = currentLevel.maxXP - currentLevel.minXP;
  const levelProgress = Math.min((xpInCurrentLevel / xpNeededForLevel) * 100, 100);
  const xpToNextLevel = nextLevel ? nextLevel.minXP - user.xp : 0;

  // Dados de badges
  const unlockedBadgesCount = user.badges?.length || 0;

  return (
    <div className="space-y-8">
      {/* Header com resumo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/10 border border-white/10 rounded-2xl p-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              Bem-vindo, {user.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              {levelProgress === 100
                ? 'Você completou este nível! Prepare-se para o próximo desafio.'
                : `Faltam ${Math.round(xpToNextLevel)} XP para alcançar ${nextLevel?.emoji} ${nextLevel?.nome}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-black">{currentLevel.emoji}</p>
            <p className="text-sm text-gray-400 mt-1 font-semibold">{currentLevel.nome}</p>
          </div>
        </div>

        {/* Progress bar animada */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-gray-400">Progresso para {nextLevel?.emoji} {nextLevel?.nome}</span>
            <span className="text-xs font-bold text-[#c4b5fd]">{Math.round(levelProgress)}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Grid de métricas principais */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon="⚡"
          label="Total XP"
          value={user.xp.toLocaleString('pt-BR')}
          subtext="Pontos acumulados"
          color="from-[#8a4add]/20 to-[#8a4add]/10"
          delay={0}
        />

        <MetricCard
          icon="🔥"
          label="Streak Atual"
          value={`${user.streak || 0} dias`}
          subtext="Consistência"
          color="from-[#f27983]/20 to-[#f27983]/10"
          delay={0.1}
        />

        <MetricCard
          icon="🏆"
          label="Badges"
          value={unlockedBadgesCount}
          subtext={`${unlockedBadgesCount === 1 ? 'badge desbloqueada' : 'badges desbloqueadas'}`}
          color="from-yellow-500/20 to-yellow-500/10"
          delay={0.2}
        />

        <MetricCard
          icon="📚"
          label="Cursos"
          value={`${totalCoursesCompleted}/${totalCoursesEnrolled}`}
          subtext="Completos/Inscritos"
          color="from-emerald-500/20 to-emerald-500/10"
          delay={0.3}
        />
      </div>

      {/* Stats detalhadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid sm:grid-cols-2 gap-4"
      >
        {/* Aulas Completadas */}
        <div className="bg-gradient-to-br from-white/8 to-white/3 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Aulas Completadas</h3>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-3xl font-black text-[#c4b5fd]">{user.completedLessonIds?.length || 0}</p>
          <p className="text-xs text-gray-500 mt-2">Continue aprendendo!</p>
        </div>

        {/* Level Info */}
        <div className="bg-gradient-to-br from-white/8 to-white/3 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Próximo Nível</h3>
            <span className="text-2xl">{nextLevel?.emoji}</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#f27983]">{nextLevel?.nome}</p>
            <p className="text-xs text-gray-500 mt-2">
              {nextLevel ? `Faltam ${Math.round(xpToNextLevel)} XP` : 'Você é uma lenda! 👑'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Dica motivacional */}
      {user.streak && user.streak > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-r from-[#8a4add]/10 to-[#f27983]/10 border-l-4 border-[#8a4add] rounded-lg p-4"
        >
          <p className="text-sm text-gray-300">
            <span className="font-bold text-[#c4b5fd]">🔥 Parabéns!</span> Você tem um streak de {user.streak} dias! Continue assim para ganhar mais XP e desbloquear badges especiais.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardAnalytics;
