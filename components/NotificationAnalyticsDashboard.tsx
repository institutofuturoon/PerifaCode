/**
 * Notification Analytics Dashboard
 * 
 * Displays CTR metrics by notification type
 * Shows which notification types are most engaging
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  getNotificationCTRMetrics,
  NotificationCTRMetrics,
} from '../utils/notificationAnalytics';

const NotificationAnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<NotificationCTRMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await getNotificationCTRMetrics();
        // Sort by CTR descending
        const sorted = [...data].sort((a, b) => b.ctr - a.ctr);
        setMetrics(sorted);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-[#8a4add] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      streak_milestone: 'Marcos de Streak',
      lesson_reminder: 'Lembretes de Aula',
      inactivity_alert: 'Alertas de Inatividade',
      badge_unlocked: 'Badges Desbloqueadas',
      level_up: 'Subida de Nível',
      course_suggestion: 'Sugestões de Curso',
      course_completed: 'Cursos Concluídos',
      weekly_summary: 'Resumos Semanais',
      friend_activity: 'Atividade de Amigos',
      custom: 'Notificações Custom',
    };
    return labels[type] || type;
  };

  const getEmoji = (type: string): string => {
    const emojis: Record<string, string> = {
      streak_milestone: '🔥',
      lesson_reminder: '📚',
      inactivity_alert: '👋',
      badge_unlocked: '🏆',
      level_up: '⬆️',
      course_suggestion: '📖',
      course_completed: '🎓',
      weekly_summary: '📊',
      friend_activity: '👥',
      custom: '📌',
    };
    return emojis[type] || '📬';
  };

  const getCTRColor = (ctr: number): string => {
    if (ctr >= 50) return 'text-green-400';
    if (ctr >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Header */}
      <div className="sticky top-0 bg-[#09090B]/95 border-b border-white/10 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">📊 Análise de Notificações</h1>
            <p className="text-gray-400 text-sm mt-1">Taxa de clique (CTR) por tipo de notificação</p>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-all"
          >
            ← Voltar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {metrics.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">📊 Nenhum dado disponível ainda</p>
            <p className="text-gray-500 text-sm mt-2">Os dados aparecerão quando usuários interagirem com notificações</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Table */}
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tipo</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Visualizações</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Cliques</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">CTR %</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Descartadas</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Tempo Médio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((metric) => (
                      <motion.tr
                        key={metric.type}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-6 py-4 flex items-center gap-3">
                          <span className="text-2xl">{getEmoji(metric.type)}</span>
                          <span className="font-medium">{getTypeLabel(metric.type)}</span>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-300">{metric.totalImpressions}</td>
                        <td className="px-6 py-4 text-center text-gray-300">{metric.totalClicks}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`font-bold text-lg ${getCTRColor(metric.ctr)}`}>
                            {metric.ctr.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-400">{metric.dismissRate.toFixed(1)}%</td>
                        <td className="px-6 py-4 text-center text-gray-400">
                          {metric.avgTimeToClick > 0 ? `${(metric.avgTimeToClick / 1000).toFixed(1)}s` : '—'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Melhor CTR</div>
                <div className="text-2xl font-bold text-green-400">
                  {metrics.length > 0 ? metrics[0].ctr.toFixed(1) : 0}%
                </div>
                <div className="text-xs text-gray-500 mt-1">{metrics.length > 0 ? getTypeLabel(metrics[0].type) : ''}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Total Visualizado</div>
                <div className="text-2xl font-bold text-[#8a4add]">
                  {metrics.reduce((sum, m) => sum + m.totalImpressions, 0)}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Total Cliques</div>
                <div className="text-2xl font-bold text-[#f27983]">
                  {metrics.reduce((sum, m) => sum + m.totalClicks, 0)}
                </div>
              </div>
            </div>

            {/* Insights */}
            {metrics.length > 0 && (
              <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">💡 Resumo Rápido</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    ✅ <strong>{getTypeLabel(metrics[0].type)}</strong> tem o melhor desempenho ({metrics[0].ctr.toFixed(1)}% CTR)
                  </p>
                  {metrics.length > 1 && (
                    <p>
                      📊 CTR médio: <strong>{(metrics.reduce((sum, m) => sum + m.ctr, 0) / metrics.length).toFixed(1)}%</strong>
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationAnalyticsDashboard;
