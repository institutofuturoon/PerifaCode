/**
 * Hook customizado para gerenciar Trilhas
 * Integra Firebase + estado local + cache
 */

import { useState, useEffect, useCallback } from 'react';
import { Trilha, Projeto } from '../TIPOS_CURSO_ROCKETSEAT';
import trilhaService from '../services/trilhaService';
import projetoService from '../services/projetoService';

interface UseTrilhasReturn {
  trilhas: Trilha[];
  projetos: Projeto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTrilhas = (): UseTrilhasReturn => {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar trilhas e projetos em paralelo
      const [trilhasData, projetosData] = await Promise.all([
        trilhaService.fetchTrilhas(),
        projetoService.fetchProjetos(),
      ]);

      setTrilhas(trilhasData);
      setProjetos(projetosData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      console.error('❌ Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    trilhas,
    projetos,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useTrilhas;
