/**
 * Hook customizado para gerenciar Progresso do Usuário
 * XP, badges, streak, level
 */

import { useState, useCallback } from 'react';
import progressoService from '../services/progressoService';

interface UseProgressoReturn {
  xp: number;
  nivel: string;
  streak: number;
  badges: string[];
  addXP: (amount: number, source: string) => Promise<void>;
  completeLesson: (lessonId: string, trilhaId: string, xpGanho: number) => Promise<void>;
  completeProject: (projetoId: string, xpGanho?: number) => Promise<void>;
  enrollTrilha: (trilhaId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useProgresso = (userId: string): UseProgressoReturn => {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addXP = useCallback(
    async (amount: number, source: string) => {
      try {
        setLoading(true);
        await progressoService.addXP(userId, amount, source);
        setXp((prev) => prev + amount);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao adicionar XP';
        setError(message);
        console.error('❌ Erro:', err);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const completeLesson = useCallback(
    async (lessonId: string, trilhaId: string, xpGanho: number) => {
      try {
        setLoading(true);
        await progressoService.completeLesson(userId, lessonId, trilhaId, xpGanho);
        setXp((prev) => prev + xpGanho);
        const newStreak = await progressoService.updateStreak(userId);
        setStreak(newStreak);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao completar aula';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const completeProject = useCallback(
    async (projetoId: string, xpGanho: number = 100) => {
      try {
        setLoading(true);
        await progressoService.completeProject(userId, projetoId, xpGanho);
        setXp((prev) => prev + xpGanho);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao completar projeto';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const enrollTrilha = useCallback(
    async (trilhaId: string) => {
      try {
        setLoading(true);
        await progressoService.enrollTrilha(userId, trilhaId);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao se inscrever';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const nivel = progressoService.getNivelByXP(xp);

  return {
    xp,
    nivel,
    streak,
    badges,
    addXP,
    completeLesson,
    completeProject,
    enrollTrilha,
    loading,
    error,
  };
};

export default useProgresso;
