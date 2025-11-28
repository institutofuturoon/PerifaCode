import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import Alert from '../components/Alert';

interface ApiQuota {
  model: string;
  requestsPerMinute: number;
  requestsPerDay: number;
  currentMinuteUsage: number;
  currentDayUsage: number;
  lastReset: string;
}

const GeminiApiDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [quotas, setQuotas] = useState<ApiQuota[]>([
    {
      model: 'gemini-2.5-flash',
      requestsPerMinute: 15,
      requestsPerDay: 1500,
      currentMinuteUsage: 0,
      currentDayUsage: 0,
      lastReset: new Date().toISOString(),
    },
    {
      model: 'gemini-2.5-flash-image',
      requestsPerMinute: 2,
      requestsPerDay: 50,
      currentMinuteUsage: 0,
      currentDayUsage: 0,
      lastReset: new Date().toISOString(),
    },
  ]);

  // Simular dados (em produção, buscar de uma API real)
  useEffect(() => {
    // TODO: Implementar busca real de dados da API
    const mockData: ApiQuota[] = [
      {
        model: 'gemini-2.5-flash',
        requestsPerMinute: 15,
        requestsPerDay: 1500,
        currentMinuteUsage: 8,
        currentDayUsage: 342,
        lastReset: new Date().toISOString(),
      },
      {
        model: 'gemini-2.5-flash-image',
        requestsPerMinute: 2,
        requestsPerDay: 50,
        currentMinuteUsage: 0,
        currentDayUsage: 48,
        lastReset: new Date().toISOString(),
      },
    ];
    setQuotas(mockData);
  }, []);

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.round((current / limit) * 100);
  };

  const getStatusVariant = (percentage: number): 'success' | 'warning' | 'error' => {
    if (percentage < 70) return 'success';
    if (percentage < 90) return 'warning';
    return 'error';
  };

  const getStatusColor = (percentage: number) => {
    if (percentage < 70) return 'bg-success';
    if (percentage < 90) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-brand-navy/30 border-b border-white/5 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/admin')}
            className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm font-semibold transition-colors hover:gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar ao Admin
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Dashboard <span className="text-brand-gold">Gemini API</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Monitore o uso e limites da API do Google Gemini
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Alert de Informação */}
        <Alert type="info">
          <strong>Plano Gratuito:</strong> A API do Google Gemini tem limites no plano gratuito.
          Monitore o uso para evitar interrupções no serviço.
        </Alert>

        {/* Cards de Quota por Modelo */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {quotas.map((quota) => {
            const dayPercentage = getUsagePercentage(quota.currentDayUsage, quota.requestsPerDay);
            const minutePercentage = getUsagePercentage(quota.currentMinuteUsage, quota.requestsPerMinute);
            const isImageModel = quota.model.includes('image');

            return (
              <div
                key={quota.model}
                className="bg-[#121212] rounded-xl border border-white/10 p-6 hover:border-info/30 transition-all"
              >
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{quota.model}</h3>
                    <p className="text-sm text-gray-400">
                      {isImageModel ? 'Geração de Imagens' : 'Geração de Texto'}
                    </p>
                  </div>
                  <StatusBadge variant={getStatusVariant(dayPercentage)}>
                    {dayPercentage}% usado
                  </StatusBadge>
                </div>

                {/* Uso Diário */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-300">Uso Diário</span>
                    <span className="text-sm text-gray-400">
                      {quota.currentDayUsage} / {quota.requestsPerDay}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStatusColor(dayPercentage)} transition-all duration-500`}
                      style={{ width: `${dayPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Reseta em: {new Date(quota.lastReset).toLocaleTimeString('pt-BR')}
                  </p>
                </div>

                {/* Uso por Minuto */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-300">Uso por Minuto</span>
                    <span className="text-sm text-gray-400">
                      {quota.currentMinuteUsage} / {quota.requestsPerMinute}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStatusColor(minutePercentage)} transition-all duration-500`}
                      style={{ width: `${minutePercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Requisições Restantes</p>
                    <p className="text-lg font-bold text-white">
                      {quota.requestsPerDay - quota.currentDayUsage}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Taxa de Uso</p>
                    <p className="text-lg font-bold text-white">{dayPercentage}%</p>
                  </div>
                </div>

                {/* Alerta se próximo do limite */}
                {dayPercentage >= 90 && (
                  <div className="mt-4 bg-error/10 border border-error/20 rounded-lg p-3 flex items-start gap-2">
                    <span className="text-error text-sm">⚠️</span>
                    <p className="text-xs text-error">
                      <strong>Atenção:</strong> Você está próximo do limite diário. Considere
                      aguardar o reset ou fazer upgrade do plano.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Informações Adicionais */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {/* Card de Limites */}
          <div className="bg-info/5 border border-info/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-info/20 flex items-center justify-center">
                <span className="text-info text-xl">📊</span>
              </div>
              <h3 className="text-lg font-bold text-white">Limites do Plano</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-info">•</span>
                <span>Texto: 15 req/min, 1.500 req/dia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-info">•</span>
                <span>Imagem: 2 req/min, 50 req/dia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-info">•</span>
                <span>Reset: Diariamente à meia-noite PST</span>
              </li>
            </ul>
          </div>

          {/* Card de Ações */}
          <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center">
                <span className="text-brand-orange text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-bold text-white">Ações Rápidas</h3>
            </div>
            <div className="space-y-2">
              <a
                href="https://ai.google.dev/gemini-api/docs/rate-limits"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-brand-orange hover:text-brand-orange/80 transition-colors"
              >
                → Ver Documentação
              </a>
              <a
                href="https://ai.dev/usage?tab=rate-limit"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-brand-orange hover:text-brand-orange/80 transition-colors"
              >
                → Monitorar Uso Real
              </a>
              <a
                href="https://console.cloud.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-brand-orange hover:text-brand-orange/80 transition-colors"
              >
                → Fazer Upgrade
              </a>
            </div>
          </div>

          {/* Card de Dicas */}
          <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
                <span className="text-brand-gold text-xl">💡</span>
              </div>
              <h3 className="text-lg font-bold text-white">Dicas</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-brand-gold">•</span>
                <span>Use cache para respostas repetidas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-gold">•</span>
                <span>Implemente rate limiting no frontend</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-gold">•</span>
                <span>Monitore uso em tempo real</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Histórico Simulado */}
        <div className="mt-8 bg-[#121212] rounded-xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Histórico de Uso (Últimas 24h)</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {Array.from({ length: 24 }).map((_, i) => {
              const height = Math.random() * 100;
              const isHigh = height > 70;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full ${
                      isHigh ? 'bg-error' : height > 40 ? 'bg-warning' : 'bg-success'
                    } rounded-t transition-all hover:opacity-80`}
                    style={{ height: `${height}%` }}
                    title={`${i}h: ${Math.round(height)}%`}
                  ></div>
                  {i % 4 === 0 && (
                    <span className="text-[10px] text-gray-500">{i}h</span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            * Dados simulados para demonstração
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeminiApiDashboard;
