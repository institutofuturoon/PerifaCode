/**
 * Notification Analytics Dashboard
 * 
 * Displays CTR metrics by notification type
 * Shows which notification types are most engaging
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getNotificationCTRMetrics,
  getNotificationPerformanceRanking,
  NotificationCTRMetrics,
} from '../utils/notificationAnalytics';

const NotificationAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<NotificationCTRMetrics[]>([]);
  const [ranking, setRanking] = useState<{ best: NotificationCTRMetrics[]; worst: NotificationCTRMetrics[] }>({
    best: [],
    worst: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await getNotificationCTRMetrics();
        const rankingData = await getNotificationPerformanceRanking();
        setMetrics(data);
        setRanking(rankingData);
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      streak_milestone: '🔥 Marcos de Streak',
      lesson_reminder: '📚 Lembretes de Aula',
      inactivity_alert: '👋 Alertas de Inatividade',
      badge_unlocked: '🏆 Badges Desbloqueadas',
      level_up: '⬆️ Subida de Nível',
      course_suggestion: '📖 Sugestões de Curso',
      course_completed: '🎓 Cursos Concluídos',
      weekly_summary: '📊 Resumos Semanais',
      friend_activity: '👥 Atividade de Amigos',
      custom: '📌 Notificações Custom',
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 p-4 md:p-8"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          📊 Análise de Notificações
        </h2>
        <p className="text-gray-600 mt-2">
          Veja qual tipo de notificação tem melhor taxa de clique (CTR)
        </p>
      </div>

      {/* BEST & WORST PERFORMERS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* BEST PERFORMERS */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-lg"
        >
          <h3 className="text-lg font-bold text-green-700 mb-4">✅ Melhor Desempenho</h3>
          <div className="space-y-3">
            {ranking.best.map((metric, idx) => (
              <div key={metric.type} className="flex items-center gap-3 bg-white rounded-lg p-3">
                <span className="text-2xl">{idx + 1}º</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{getTypeLabel(metric.type)}</p>
                  <p className="text-sm text-green-600 font-bold">{metric.ctr}% CTR</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{metric.totalClicks} cliques</p>
                  <p>{metric.totalImpressions} visualizações</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* WORST PERFORMERS */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200 shadow-lg"
        >
          <h3 className="text-lg font-bold text-red-700 mb-4">⚠️ Menor Desempenho</h3>
          <div className="space-y-3">
            {ranking.worst.map((metric, idx) => (
              <div key={metric.type} className="flex items-center gap-3 bg-white rounded-lg p-3">
                <span className="text-2xl">{idx + 1}º</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{getTypeLabel(metric.type)}</p>
                  <p className="text-sm text-red-600 font-bold">{metric.ctr}% CTR</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{metric.totalClicks} cliques</p>
                  <p>{metric.totalImpressions} visualizações</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ALL METRICS TABLE */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
      >
        <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600">
          <h3 className="text-lg font-bold text-white">📈 Detalhado por Tipo</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Visualizações
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Cliques</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">CTR</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Taxa Dispensa
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Tempo Médio
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, idx) => (
                <motion.tr
                  key={metric.type}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * idx }}
                  className="border-b border-gray-100 hover:bg-purple-50 transition"
                >
                  <td className="px-6 py-4 flex items-center gap-3 font-medium text-gray-900">
                    <span className="text-2xl">{getEmoji(metric.type)}</span>
                    {getTypeLabel(metric.type)}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    {metric.totalImpressions}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">{metric.totalClicks}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-bold ${
                        metric.ctr >= 50
                          ? 'bg-green-100 text-green-700'
                          : metric.ctr >= 25
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {metric.ctr}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    {metric.dismissRate}%
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    {metric.avgTimeToClick > 0 ? `${(metric.avgTimeToClick / 1000).toFixed(1)}s` : '—'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {metrics.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            <p>📊 Nenhum dado de análise disponível ainda</p>
            <p className="text-sm mt-2">Os dados aparecerão quando usuários interagirem com notificações</p>
          </div>
        )}
      </motion.div>

      {/* INSIGHTS */}
      {metrics.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-blue-50 rounded-xl border border-blue-200 p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-blue-900 mb-4">💡 Insights</h3>
          <ul className="space-y-2 text-blue-900">
            {ranking.best[0] && (
              <li>
                ✅ <strong>{getTypeLabel(ranking.best[0].type)}</strong> tem o melhor CTR{' '}
                ({ranking.best[0].ctr}%) — considere enviar mais frequentemente
              </li>
            )}
            {ranking.worst[0] && (
              <li>
                ⚠️ <strong>{getTypeLabel(ranking.worst[0].type)}</strong> tem baixo CTR (
                {ranking.worst[0].ctr}%) — considere revisar o conteúdo ou timing
              </li>
            )}
            <li>
              📊 Total de {metrics.reduce((sum, m) => sum + m.totalImpressions, 0)} visualizações e{' '}
              {metrics.reduce((sum, m) => sum + m.totalClicks, 0)} cliques em todas as categorias
            </li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NotificationAnalyticsDashboard;
