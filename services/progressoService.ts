/**
 * Serviço de Progresso - Firebase Integration
 * Rastreamento de XP, badges, streaks, progresso do usuário
 */

import { db } from '../firebaseConfig';
import { doc, updateDoc, getDoc, increment, arrayUnion } from 'firebase/firestore';
import { UserGamification, ProgressoUsuario, Badge, TrilhaProgress } from '../TIPOS_CURSO_ROCKETSEAT';

const USERS_COLLECTION = 'users';
const PROGRESS_COLLECTION = 'progressoUsuario';

export const progressoService = {
  /**
   * Adiciona XP ao usuário
   */
  async addXP(userId: string, xpAmount: number, source: string): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        xp: increment(xpAmount),
      });

      console.log(`✅ +${xpAmount} XP adicionados (${source})`);
    } catch (error) {
      console.error('❌ Erro ao adicionar XP:', error);
      throw error;
    }
  },

  /**
   * Adiciona badge ao usuário
   */
  async addBadge(userId: string, badge: Badge): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        achievements: arrayUnion(badge.id),
      });

      console.log(`✅ Badge "${badge.titulo}" desbloqueado!`);
    } catch (error) {
      console.error('❌ Erro ao adicionar badge:', error);
      throw error;
    }
  },

  /**
   * Atualiza streak do usuário
   */
  async updateStreak(userId: string): Promise<number> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('Usuário não encontrado');
      }

      const userData = userSnap.data();
      const lastCompletionDate = userData.lastCompletionDate || '';
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      let newStreak = userData.streak || 0;

      // Se última conclusão foi ontem, incrementar streak
      // Se foi hoje, manter streak
      // Se foi antes, resetar para 1
      if (lastCompletionDate === today) {
        // Já completou hoje, não muda
      } else if (
        lastCompletionDate ===
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      ) {
        // Completou ontem, incrementar
        newStreak += 1;
      } else {
        // Quebrou streak
        newStreak = 1;
      }

      await updateDoc(userRef, {
        streak: newStreak,
        lastCompletionDate: today,
      });

      console.log(`✅ Streak atualizado: ${newStreak} dias`);
      return newStreak;
    } catch (error) {
      console.error('❌ Erro ao atualizar streak:', error);
      throw error;
    }
  },

  /**
   * Marca aula como concluída e registra progresso
   */
  async completeLesson(
    userId: string,
    lessonId: string,
    trilhaId: string,
    xpGanho: number
  ): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);

      // Adicionar aula aos completados
      await updateDoc(userRef, {
        completedLessonIds: arrayUnion(lessonId),
      });

      // Adicionar XP
      await this.addXP(userId, xpGanho, `Aula completa (${lessonId})`);

      // Atualizar streak
      await this.updateStreak(userId);

      console.log(`✅ Aula ${lessonId} marcada como concluída`);
    } catch (error) {
      console.error('❌ Erro ao completar aula:', error);
      throw error;
    }
  },

  /**
   * Marca projeto como completo
   */
  async completeProject(
    userId: string,
    projetoId: string,
    xpGanho: number = 100
  ): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);

      await updateDoc(userRef, {
        achievements: arrayUnion(projetoId),
      });

      await this.addXP(userId, xpGanho, `Projeto completo (${projetoId})`);

      console.log(`✅ Projeto ${projetoId} marcado como concluído`);
    } catch (error) {
      console.error('❌ Erro ao completar projeto:', error);
      throw error;
    }
  },

  /**
   * Inscreve usuário em trilha
   */
  async enrollTrilha(userId: string, trilhaId: string): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);

      await updateDoc(userRef, {
        enrolledCourseIds: arrayUnion(trilhaId), // Usando campo existente
      });

      // Criar documento de progresso da trilha
      const progressRef = doc(db, PROGRESS_COLLECTION, `${userId}_${trilhaId}`);
      await updateDoc(progressRef, {
        trilhaId,
        userId,
        percentualConclusao: 0,
        modulosConcluidos: 0,
        totalModulos: 6,
        dataInscricao: new Date().toISOString(),
      }).catch(() => {
        // Se documento não existe, criar novo
        return updateDoc(progressRef, {
          trilhaId,
          userId,
          percentualConclusao: 0,
          modulosConcluidos: 0,
          totalModulos: 6,
          dataInscricao: new Date().toISOString(),
        });
      });

      console.log(`✅ Usuário inscrito na trilha ${trilhaId}`);
    } catch (error) {
      console.error('❌ Erro ao inscrever em trilha:', error);
      throw error;
    }
  },

  /**
   * Busca XP total do usuário
   */
  async getUserXP(userId: string): Promise<number> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data().xp || 0;
      }
      return 0;
    } catch (error) {
      console.error('❌ Erro ao buscar XP do usuário:', error);
      throw error;
    }
  },

  /**
   * Busca badges do usuário
   */
  async getUserBadges(userId: string): Promise<string[]> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data().achievements || [];
      }
      return [];
    } catch (error) {
      console.error('❌ Erro ao buscar badges do usuário:', error);
      throw error;
    }
  },

  /**
   * Busca nível do usuário baseado em XP
   */
  getNivelByXP(xp: number): string {
    if (xp < 500) return 'ovo';
    if (xp < 1500) return 'filhote';
    if (xp < 3500) return 'desenvolvedor';
    if (xp < 7000) return 'senior';
    if (xp < 15000) return 'especialista';
    return 'lenda';
  },

  /**
   * Verifica e aplica rewards de milestone de streak
   */
  async checkStreakMilestone(userId: string, streak: number): Promise<{ isMilestone: boolean; xpReward: number }> {
    try {
      // Milestones: 7, 30, 100 dias
      const milestones = [
        { days: 7, xp: 200 },
        { days: 30, xp: 500 },
        { days: 100, xp: 1000 },
      ];

      for (const milestone of milestones) {
        if (streak === milestone.days) {
          // Adicionar XP do milestone
          await this.addXP(userId, milestone.xp, `Milestone Streak ${streak} dias`);
          
          // Adicionar badge especial
          const badge: Badge = {
            id: `streak_${streak}`,
            titulo: `Streak ${streak} Dias`,
            descricao: `Manteve um streak de ${streak} dias consecutivos`,
            emoji: streak >= 100 ? '👑' : streak >= 30 ? '🏆' : '🥇',
            icone: 'streak',
            criterio: `streak_${streak}`,
            raro: streak >= 30,
            dataLancamento: new Date().toISOString(),
          };
          
          await this.addBadge(userId, badge);
          
          console.log(`🎉 Milestone de streak ${streak} dias desbloqueado! +${milestone.xp} XP`);
          return { isMilestone: true, xpReward: milestone.xp };
        }
      }

      return { isMilestone: false, xpReward: 0 };
    } catch (error) {
      console.error('❌ Erro ao verificar milestone:', error);
      return { isMilestone: false, xpReward: 0 };
    }
  },
};

export default progressoService;
