/**
 * Challenge Service - Gerenciar Desafios Semanais
 * Features:
 * - Desafios automáticos por semana
 * - Tracking de progresso
 * - Rewards (2x XP)
 * - Auto-reset segunda-feira
 */

import { db } from '../firebaseConfig';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

interface WeeklyChallenge {
  id: string;
  week: number;
  year: number;
  title: string;
  description: string;
  targetCount: number; // Ex: 3 aulas
  currentCount: number;
  xpReward: number;
  completed: boolean;
  completedDate?: string;
  type: 'lessons' | 'projects' | 'forum' | 'streak';
}

const CHALLENGES_COLLECTION = 'weeklyChallenges';
const USER_CHALLENGES_COLLECTION = 'userChallenges';

function getCurrentWeek() {
  const now = new Date();
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getCurrentYear() {
  return new Date().getFullYear();
}

export const challengeService = {
  /**
   * Obter desafio semanal do usuário
   */
  async getWeeklyChallenge(userId: string): Promise<WeeklyChallenge | null> {
    try {
      const week = getCurrentWeek();
      const year = getCurrentYear();
      const docId = `${userId}_${year}_${week}`;

      const docRef = doc(db, USER_CHALLENGES_COLLECTION, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as WeeklyChallenge;
      }

      // Se não existe, criar novo
      return this.createWeeklyChallenge(userId);
    } catch (error) {
      console.error('❌ Erro ao obter desafio semanal:', error);
      return null;
    }
  },

  /**
   * Criar novo desafio semanal
   */
  async createWeeklyChallenge(userId: string): Promise<WeeklyChallenge> {
    try {
      const week = getCurrentWeek();
      const year = getCurrentYear();
      const docId = `${userId}_${year}_${week}`;

      // Desafios rotacionados por semana
      const challenges: WeeklyChallenge[] = [
        {
          id: `challenge_${week}`,
          week,
          year,
          title: '🎓 Complete 3 Aulas',
          description: 'Termine 3 aulas esta semana para ganhar 2x XP!',
          targetCount: 3,
          currentCount: 0,
          xpReward: 300, // 3 aulas × 50 XP × 2x
          completed: false,
          type: 'lessons',
        },
        {
          id: `challenge_${week}`,
          week,
          year,
          title: '🚀 Envie um Projeto',
          description: 'Envie um projeto para ganhar 300 XP extra!',
          targetCount: 1,
          currentCount: 0,
          xpReward: 300,
          completed: false,
          type: 'projects',
        },
        {
          id: `challenge_${week}`,
          week,
          year,
          title: '💬 Participe do Fórum',
          description: 'Faça 5 posts no fórum e ganhe 150 XP extra!',
          targetCount: 5,
          currentCount: 0,
          xpReward: 150,
          completed: false,
          type: 'forum',
        },
        {
          id: `challenge_${week}`,
          week,
          year,
          title: '🔥 Mantenha seu Streak',
          description: 'Acesse por 7 dias consecutivos e ganhe 200 XP!',
          targetCount: 7,
          currentCount: 0,
          xpReward: 200,
          completed: false,
          type: 'streak',
        },
      ];

      // Selecionar desafio para essa semana (rotacional)
      const challenge = challenges[week % challenges.length];

      await setDoc(doc(db, USER_CHALLENGES_COLLECTION, docId), challenge);

      console.log(`✅ Novo desafio criado para semana ${week}`);
      return challenge;
    } catch (error) {
      console.error('❌ Erro ao criar desafio:', error);
      throw error;
    }
  },

  /**
   * Atualizar progresso do desafio
   */
  async updateChallengeProgress(
    userId: string,
    incrementBy: number = 1
  ): Promise<boolean> {
    try {
      const challenge = await this.getWeeklyChallenge(userId);
      if (!challenge) return false;

      const week = getCurrentWeek();
      const year = getCurrentYear();
      const docId = `${userId}_${year}_${week}`;

      const newCount = challenge.currentCount + incrementBy;
      const isCompleted = newCount >= challenge.targetCount;

      await updateDoc(doc(db, USER_CHALLENGES_COLLECTION, docId), {
        currentCount: newCount,
        completed: isCompleted,
        completedDate: isCompleted ? new Date().toISOString() : undefined,
      });

      console.log(`✅ Progresso atualizado: ${newCount}/${challenge.targetCount}`);
      return isCompleted;
    } catch (error) {
      console.error('❌ Erro ao atualizar progresso:', error);
      return false;
    }
  },

  /**
   * Verificar se desafio foi completado e aplicar reward
   */
  async checkAndRewardChallenge(userId: string): Promise<number> {
    try {
      const challenge = await this.getWeeklyChallenge(userId);
      if (!challenge || challenge.completed) return 0;

      const isCompleted =
        challenge.currentCount >= challenge.targetCount;

      if (isCompleted) {
        console.log(`🎉 Desafio completado! +${challenge.xpReward} XP`);
        return challenge.xpReward;
      }

      return 0;
    } catch (error) {
      console.error('❌ Erro ao verificar desafio:', error);
      return 0;
    }
  },

  /**
   * Obter progresso formatado para UI
   */
  async getChallengeProgress(userId: string): Promise<{
    challenge: WeeklyChallenge | null;
    percentage: number;
    isCompleted: boolean;
  }> {
    try {
      const challenge = await this.getWeeklyChallenge(userId);
      if (!challenge) {
        return {
          challenge: null,
          percentage: 0,
          isCompleted: false,
        };
      }

      const percentage = Math.min(
        100,
        Math.round((challenge.currentCount / challenge.targetCount) * 100)
      );

      return {
        challenge,
        percentage,
        isCompleted: challenge.completed,
      };
    } catch (error) {
      console.error('❌ Erro ao obter progresso:', error);
      return {
        challenge: null,
        percentage: 0,
        isCompleted: false,
      };
    }
  },
};
