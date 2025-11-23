import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../App';
import { getAllNotifications, markAllAsRead, togglePinNotification, deleteNotification, SmartNotification } from '../utils/smartNotificationService';
import NotificationPreferencesComponent from '../components/NotificationPreferences';
import ScrollToTopButton from '../components/ScrollToTopButton';

type FilterType = 'all' | 'unread' | 'pinned';

const NotificationCenter: React.FC = () => {
  const { user, showToast } = useAppContext();
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const loadNotifications = async () => {
      try {
        const allNotifs = await getAllNotifications(user.id, 100);
        setNotifications(allNotifs);
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
        showToast('❌ Erro ao carregar notificações');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user?.id]);

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await markAllAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast('✅ Todas as notificações marcadas como lidas');
    } catch (error) {
      showToast('❌ Erro ao marcar como lidas');
    }
  };

  const handleTogglePin = async (notifId: string | undefined, isPinned: boolean) => {
    if (!notifId) return;
    try {
      await togglePinNotification(notifId, isPinned);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, isPinned: !isPinned } : n))
      );
    } catch (error) {
      showToast('❌ Erro ao fixar notificação');
    }
  };

  const handleDelete = async (notifId: string | undefined) => {
    if (!notifId) return;
    try {
      await deleteNotification(notifId);
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
      showToast('✅ Notificação removida');
    } catch (error) {
      showToast('❌ Erro ao remover notificação');
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'pinned') return n.isPinned;
    return true;
  });

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      streak_milestone: '🔥',
      lesson_reminder: '📚',
      inactivity_alert: '👋',
      badge_unlocked: '🏆',
      level_up: '⬆️',
      course_suggestion: '📖',
      course_completed: '🎓',
      weekly_summary: '📊',
      friend_activity: '👥',
      custom: '💬',
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#09090B] to-black">
      <ScrollToTopButton />

      {/* Header */}
      <div className="bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/20 border-b border-white/10 px-6 py-8 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-white">🔔 Central de Notificações</h1>
              <p className="text-gray-400 text-sm mt-2">
                {filteredNotifications.length} notificação{filteredNotifications.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setShowPreferences(true)}
              className="px-6 py-3 bg-[#8a4add] text-white font-semibold rounded-lg hover:bg-[#7c3aed] transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Preferências
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-6 flex-wrap">
            {(['all', 'unread', 'pinned'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === f
                    ? 'bg-[#8a4add] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {f === 'all' ? 'Todas' : f === 'unread' ? 'Não Lidas' : 'Fixadas'}
              </button>
            ))}
            {filteredNotifications.length > 0 && filter === 'unread' && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 text-xs font-semibold transition-all"
              >
                Marcar tudo como lido
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {showPreferences ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <button
              onClick={() => setShowPreferences(false)}
              className="text-sm text-gray-400 hover:text-white mb-6 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <NotificationPreferencesComponent closeModal={() => setShowPreferences(false)} />
          </motion.div>
        ) : loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-[#8a4add] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando notificações...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
            <p className="text-4xl mb-4">🎉</p>
            <p className="text-gray-400">
              {filter === 'unread'
                ? 'Parabéns! Todas as notificações foram lidas.'
                : filter === 'pinned'
                ? 'Nenhuma notificação fixada.'
                : 'Nenhuma notificação no momento.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif, idx) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 rounded-xl border transition-all group ${
                  notif.isRead
                    ? 'bg-white/[0.02] border-white/10'
                    : 'bg-[#8a4add]/10 border-[#8a4add]/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-3xl flex-shrink-0">{notif.icon || getTypeIcon(notif.type)}</div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`font-bold text-lg ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>
                          {notif.title}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">{notif.message}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                            {notif.type.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          {notif.createdAt && (
                            <span className="text-xs text-gray-600">
                              {new Date(notif.createdAt.toMillis?.() || notif.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleTogglePin(notif.id, notif.isPinned)}
                          className={`p-2 rounded hover:bg-white/10 transition-colors ${
                            notif.isPinned ? 'text-[#8a4add]' : 'text-gray-400'
                          }`}
                          title={notif.isPinned ? 'Desafixar' : 'Fixar'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="p-2 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="Deletar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unread Indicator */}
                  {!notif.isRead && <div className="w-2 h-2 rounded-full bg-[#8a4add] flex-shrink-0 mt-2"></div>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
