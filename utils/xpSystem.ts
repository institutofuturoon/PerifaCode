/**
 * XP System - Lógica Completa de Gamificação
 * Eventos, multiplicadores, badges automáticas, níveis
 */

import { Badge } from '../TIPOS_CURSO_ROCKETSEAT';
import progressoService from '../services/progressoService';

// ============================================
// CONSTANTES DE XP
// ============================================

export const XP_EVENTS = {
  // Aulas
  LESSON_COMPLETED: 50,
  LESSON_QUIZ_PASSED: 30,
  LESSON_VIDEO_WATCHED: 20,
  LESSON_NOTES_TAKEN: 10,

  // Projetos
  PROJECT_SUBMITTED: 100,
  PROJECT_APPROVED: 150,
  PROJECT_CODE_REVIEWED: 25,

  // Comunidade
  FORUM_POST_CREATED: 15,
  FORUM_ANSWER_ACCEPTED: 50,
  COMMENT_HELPFUL: 10,
  CHALLENGE_COMPLETED: 200,

  // Engagement
  DAILY_LOGIN: 5,
  DAILY_STREAK_BONUS: 25, // Por cada dia de streak acima de 1
  WEEK_ACTIVE: 100, // Completa 5+ aulas em uma semana
  MENTOR_SESSION: 75,

  // Especiais
  FIRST_COURSE_COMPLETED: 300,
  REFERRAL_SIGNUP: 50,
  REFERRAL_CONVERSION: 150,
} as const;

export const MULTIPLIERS = {
  CHALLENGE_MODE: 1.5, // Modo desafio (tempo limitado)
  STREAK_BONUS: (streak: number) => 1 + (streak * 0.1), // +10% por dia de streak
  GROUP_BONUS: 1.2, // Aprender em grupo
  MENTOR_BONUS: 1.3, // Com ajuda de mentor
  SPEED_BONUS: (minutesUsed: number, minutesEstimated: number) => {
    const ratio = minutesUsed / minutesEstimated;
    if (ratio < 0.5) return 1.5; // 50% mais rápido
    if (ratio < 0.75) return 1.25; // 25-50% mais rápido
    return 1.0; // Normal
  },
} as const;

// ============================================
// NÍVEIS E REQUISITOS
// ============================================

export const LEVELS = [
  { id: 'ovo', emoji: '🥚', nome: 'Ovo', minXP: 0, maxXP: 500, cor: '#999999' },
  { id: 'filhote', emoji: '🐣', nome: 'Filhote', minXP: 500, maxXP: 1500, cor: '#10B981' },
  { id: 'desenvolvedor', emoji: '🦆', nome: 'Desenvolvedor', minXP: 1500, maxXP: 3500, cor: '#3B82F6' },
  { id: 'senior', emoji: '🦅', nome: 'Senior', minXP: 3500, maxXP: 7000, cor: '#8B5CF6' },
  { id: 'especialista', emoji: '🦁', nome: 'Especialista', minXP: 7000, maxXP: 15000, cor: '#F59E0B' },
  { id: 'lenda', emoji: '👑', nome: 'Lenda', minXP: 15000, maxXP: Infinity, cor: '#EC4899' },
] as const;

// ============================================
// BADGES AUTOMÁTICAS
// ============================================

export const AUTO_BADGES = {
  // Progressão
  FIRST_LESSON: {
    id: 'first_lesson',
    titulo: 'Primeiro Passo',
    descricao: 'Completar a primeira aula',
    ícone: '👣',
  },
  LEVEL_UP: {
    id: 'level_up',
    titulo: 'Ascensão',
    descricao: 'Subir de nível',
    ícone: '⬆️',
  },
  COURSE_COMPLETED: {
    id: 'course_completed',
    titulo: 'Conquistador',
    descricao: 'Completar um curso inteiro',
    ícone: '🏆',
  },

  // Streak
  WEEK_STREAK: {
    id: 'week_streak',
    titulo: 'Consistência',
    descricao: '7 dias de streak',
    ícone: '🔥',
  },
  MONTH_STREAK: {
    id: 'month_streak',
    titulo: 'Campeão',
    descricao: '30 dias de streak',
    ícone: '⭐',
  },

  // Engagement
  HELPER: {
    id: 'helper',
    titulo: 'Ajudante',
    descricao: 'Ajudar 5 pessoas no fórum',
    ícone: '🤝',
  },
  SOCIALITE: {
    id: 'socialite',
    titulo: 'Socializador',
    descricao: '10 posts no fórum',
    ícone: '💬',
  },

  // Projetos
  CODE_MASTER: {
    id: 'code_master',
    titulo: 'Mestre do Código',
    descricao: '5 projetos aprovados',
    ícone: '💻',
  },
  SPEEDRUNNER: {
    id: 'speedrunner',
    titulo: 'Speedrunner',
    descricao: 'Completar projeto 50% mais rápido',
    ícone: '⚡',
  },

  // XP
  XP_MILESTONE_1000: {
    id: 'xp_1000',
    titulo: '1K XP',
    descricao: 'Ganhar 1.000 XP',
    ícone: '📈',
  },
  XP_MILESTONE_5000: {
    id: 'xp_5000',
    titulo: '5K XP',
    descricao: 'Ganhar 5.000 XP',
    ícone: '📊',
  },
} as const;

// ============================================
// SISTEMA DE XP
// ============================================

export class XPSystem {
  /**
   * Calcula XP final com multiplicadores
   */
  static calculateFinalXP(
    baseXP: number,
    multipliers: number[] = []
  ): number {
    const totalMultiplier = multipliers.reduce((a, b) => a * b, 1);
    return Math.floor(baseXP * totalMultiplier);
  }

  /**
   * Processa evento XP e aplica lógica de gamificação
   */
  static async processXPEvent(
    userId: string,
    eventType: keyof typeof XP_EVENTS,
    context?: {
      streak?: number;
      minutesUsed?: number;
      minutesEstimated?: number;
      isChallenge?: boolean;
      groupSize?: number;
    }
  ): Promise<number> {
    const baseXP = XP_EVENTS[eventType];
    const multipliers: number[] = [];

    // Aplicar multiplicadores baseado no contexto
    if (context?.isChallenge) {
      multipliers.push(MULTIPLIERS.CHALLENGE_MODE);
    }

    if (context?.streak && context.streak > 1) {
      multipliers.push(MULTIPLIERS.STREAK_BONUS(context.streak));
    }

    if (context?.minutesUsed && context?.minutesEstimated) {
      multipliers.push(MULTIPLIERS.SPEED_BONUS(context.minutesUsed, context.minutesEstimated));
    }

    if (context?.groupSize && context.groupSize > 1) {
      multipliers.push(MULTIPLIERS.GROUP_BONUS);
    }

    const finalXP = this.calculateFinalXP(baseXP, multipliers);

    // Adicionar XP ao usuário
    await progressoService.addXP(userId, finalXP, eventType);

    return finalXP;
  }

  /**
   * Obtém informações de nível baseado em XP
   */
  static getLevelInfo(xp: number) {
    const level = LEVELS.find(l => xp >= l.minXP && xp <= l.maxXP) || LEVELS[LEVELS.length - 1];
    const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];

    const xpInLevel = xp - level.minXP;
    const xpNeededForLevel = level.maxXP - level.minXP;
    const progress = Math.min((xpInLevel / xpNeededForLevel) * 100, 100);

    return {
      current: level,
      next: nextLevel,
      xpInLevel,
      xpNeededForLevel,
      progressPercent: progress,
      xpToNextLevel: nextLevel ? nextLevel.minXP - xp : 0,
    };
  }

  /**
   * Verifica badges automáticas após XP
   */
  static async checkAndAwardAutoBadges(userId: string, userXP: number, context?: any) {
    const badgesAwarded: string[] = [];

    // XP Milestones
    if (userXP >= 1000 && !context?.badges?.includes('xp_1000')) {
      const badge = {
        id: 'xp_1000',
        titulo: '1K XP',
        descricao: 'Ganhar 1.000 XP',
        emoji: '📈',
      } as any;
      await progressoService.addBadge(userId, badge);
      badgesAwarded.push('xp_1000');
    }

    if (userXP >= 5000 && !context?.badges?.includes('xp_5000')) {
      const badge = {
        id: 'xp_5000',
        titulo: '5K XP',
        descricao: 'Ganhar 5.000 XP',
        emoji: '📊',
      } as any;
      await progressoService.addBadge(userId, badge);
      badgesAwarded.push('xp_5000');
    }

    // Streak badges
    if (context?.streak === 7) {
      const badge = {
        id: 'week_streak',
        titulo: 'Consistência',
        descricao: '7 dias de streak',
        emoji: '🔥',
      } as any;
      await progressoService.addBadge(userId, badge);
      badgesAwarded.push('week_streak');
    }

    if (context?.streak === 30) {
      const badge = {
        id: 'month_streak',
        titulo: 'Campeão',
        descricao: '30 dias de streak',
        emoji: '⭐',
      } as any;
      await progressoService.addBadge(userId, badge);
      badgesAwarded.push('month_streak');
    }

    return badgesAwarded;
  }

  /**
   * Registra múltiplos eventos (batch)
   */
  static async processBatchEvents(
    userId: string,
    events: Array<{ type: keyof typeof XP_EVENTS; context?: any }>
  ): Promise<number> {
    let totalXP = 0;

    for (const event of events) {
      const xp = await this.processXPEvent(userId, event.type, event.context);
      totalXP += xp;
    }

    return totalXP;
  }

  /**
   * Formata XP para exibição
   */
  static formatXP(xp: number): string {
    if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
    if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
    return xp.toString();
  }

  /**
   * Calcula tempo estimado para próximo nível
   */
  static estimateTimeToNextLevel(
    currentXP: number,
    dailyXPAverage: number = 150 // Média conservadora
  ): number {
    const levelInfo = this.getLevelInfo(currentXP);
    const xpNeeded = levelInfo.xpToNextLevel;
    const daysNeeded = Math.ceil(xpNeeded / dailyXPAverage);
    return daysNeeded;
  }
}

export default XPSystem;
