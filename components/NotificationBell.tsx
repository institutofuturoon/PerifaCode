import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import {
  listenToUnreadNotifications,
  markAsRead,
  dismissNotification,
  SmartNotification,
} from '../utils/smartNotificationService';

const NotificationBell: React.FC = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Real-time listener para notificações não lidas
  useEffect(() => {
    if (!user?.id) return;

    // Configurar listener real-time
    const unsubscribe = listenToUnreadNotifications(
      user.id,
      (notifs) => {
        setNotifications(notifs);
        setUnreadCount(notifs.length);
      },
      (error) => {
        console.error('Erro no listener de notificações:', error);
      }
    );

    // Cleanup: desinscrever ao desmontar
    return () => unsubscribe();
  }, [user?.id]);

  const handleNotificationClick = async (notif: SmartNotification) => {
    // Marcar como lida
    if (notif.id) {
      await markAsRead(notif.id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    }

    // Navegar se houver link
    if (notif.link) {
      navigate(notif.link);
      setIsOpen(false);
    }
  };

  const handleDismiss = async (notifId: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notifId) return;

    await dismissNotification(notifId);
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-300 hover:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge com contagem */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-12 w-96 max-h-[500px] bg-[#1a1a1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/20 p-4 border-b border-white/10">
                <h3 className="text-white font-bold">Notificações</h3>
                <p className="text-xs text-gray-400 mt-1">{unreadCount} não lidas</p>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[420px]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p className="text-sm">Nenhuma notificação no momento</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onClick={() => handleNotificationClick(notif)}
                        className="p-4 hover:bg-white/5 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="text-2xl flex-shrink-0">{notif.icon}</div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                              {notif.message}
                            </p>
                          </div>

                          {/* Dismiss Button */}
                          <button
                            onClick={(e) => handleDismiss(notif.id, e)}
                            className="flex-shrink-0 p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-white/10 p-3 bg-black/20">
                  <button
                    onClick={() => {
                      navigate('/notifications');
                      setIsOpen(false);
                    }}
                    className="w-full text-xs font-semibold text-[#8a4add] hover:text-[#c4b5fd] transition-colors"
                  >
                    Ver todas as notificações →
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
