import { useState, useCallback, useRef } from 'react';

interface RateLimitConfig {
  maxRequests: number;      // Máximo de requisições
  windowMs: number;         // Janela de tempo em ms
  blockDurationMs?: number; // Tempo de bloqueio após limite
}

interface RateLimitState {
  canMakeRequest: boolean;
  remainingRequests: number;
  resetTime: number | null;
  isBlocked: boolean;
}

/**
 * Hook para implementar rate limiting no frontend
 * 
 * @param config - Configuração do rate limit
 * @returns Estado e função para verificar se pode fazer requisição
 * 
 * @example
 * const { canMakeRequest, checkRateLimit, remainingRequests } = useRateLimit({
 *   maxRequests: 15,
 *   windowMs: 60000, // 1 minuto
 * });
 * 
 * if (checkRateLimit()) {
 *   await makeApiCall();
 * }
 */
export const useRateLimit = (config: RateLimitConfig) => {
  const { maxRequests, windowMs, blockDurationMs = 60000 } = config;
  
  const requestTimestamps = useRef<number[]>([]);
  const blockUntil = useRef<number | null>(null);
  
  const [state, setState] = useState<RateLimitState>({
    canMakeRequest: true,
    remainingRequests: maxRequests,
    resetTime: null,
    isBlocked: false,
  });

  /**
   * Limpa requisições antigas fora da janela de tempo
   */
  const cleanOldRequests = useCallback(() => {
    const now = Date.now();
    requestTimestamps.current = requestTimestamps.current.filter(
      timestamp => now - timestamp < windowMs
    );
  }, [windowMs]);

  /**
   * Verifica se está bloqueado
   */
  const checkIfBlocked = useCallback(() => {
    if (blockUntil.current && Date.now() < blockUntil.current) {
      return true;
    }
    if (blockUntil.current && Date.now() >= blockUntil.current) {
      blockUntil.current = null;
      requestTimestamps.current = [];
    }
    return false;
  }, []);

  /**
   * Verifica se pode fazer uma requisição e registra se sim
   */
  const checkRateLimit = useCallback((): boolean => {
    cleanOldRequests();
    
    // Verifica se está bloqueado
    if (checkIfBlocked()) {
      setState({
        canMakeRequest: false,
        remainingRequests: 0,
        resetTime: blockUntil.current,
        isBlocked: true,
      });
      return false;
    }

    const now = Date.now();
    const requestCount = requestTimestamps.current.length;

    // Se atingiu o limite
    if (requestCount >= maxRequests) {
      const oldestRequest = requestTimestamps.current[0];
      const resetTime = oldestRequest + windowMs;
      
      // Bloqueia por um período
      blockUntil.current = now + blockDurationMs;
      
      setState({
        canMakeRequest: false,
        remainingRequests: 0,
        resetTime: blockUntil.current,
        isBlocked: true,
      });
      
      return false;
    }

    // Registra a requisição
    requestTimestamps.current.push(now);
    
    const remaining = maxRequests - requestTimestamps.current.length;
    const oldestRequest = requestTimestamps.current[0];
    
    setState({
      canMakeRequest: remaining > 0,
      remainingRequests: remaining,
      resetTime: oldestRequest ? oldestRequest + windowMs : null,
      isBlocked: false,
    });

    return true;
  }, [maxRequests, windowMs, blockDurationMs, cleanOldRequests, checkIfBlocked]);

  /**
   * Reseta o rate limit manualmente
   */
  const reset = useCallback(() => {
    requestTimestamps.current = [];
    blockUntil.current = null;
    setState({
      canMakeRequest: true,
      remainingRequests: maxRequests,
      resetTime: null,
      isBlocked: false,
    });
  }, [maxRequests]);

  /**
   * Retorna tempo restante até reset (em segundos)
   */
  const getTimeUntilReset = useCallback((): number => {
    if (!state.resetTime) return 0;
    const remaining = Math.max(0, state.resetTime - Date.now());
    return Math.ceil(remaining / 1000);
  }, [state.resetTime]);

  return {
    ...state,
    checkRateLimit,
    reset,
    getTimeUntilReset,
  };
};

/**
 * Hook específico para API do Gemini (Texto)
 */
export const useGeminiTextRateLimit = () => {
  return useRateLimit({
    maxRequests: 15,
    windowMs: 60000, // 1 minuto
    blockDurationMs: 60000, // Bloqueia por 1 minuto
  });
};

/**
 * Hook específico para API do Gemini (Imagem)
 */
export const useGeminiImageRateLimit = () => {
  return useRateLimit({
    maxRequests: 2,
    windowMs: 60000, // 1 minuto
    blockDurationMs: 300000, // Bloqueia por 5 minutos
  });
};
