import React, { useState, useRef, useEffect } from 'react';
import { Notification } from '../types';
import { useNavigate } from 'react-router-dom';

interface NotificationCenterProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onDelete: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
    notifications,
    onMarkAsRead,
    onMarkAllAsRead,
    onDelete
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const sortedNotifications = [...notifications].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            onMarkAsRead(notification.id);
        }
        if (notification.actionUrl) {
            navigate(notification.actionUrl);
            setIsOpen(false);
        }
    };

    const getNotificationIcon = (type: Notification['type'], customIcon?: string) => {
        if (customIcon) return customIcon;
        
        switch (type) {
            case 'course': return '📚';
            case 'lesson': return '📖';
            case 'event': return '📅';
            case 'achievement': return '🏆';
            case 'system': return '⚙️';
            default: return '🔔';
        }
    };

    const getNotificationColor = (type: Notification['type']) => {
        switch (type) {
            case 'course': return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
            case 'lesson': return 'from-green-500/20 to-green-600/20 border-green-500/30';
            case 'event': return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
            case 'achievement': return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
            case 'system': return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
            default: return 'from-white/10 to-white/5 border-white/10';
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Agora mesmo';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m atrás`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d atrás`;
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Notificações"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                
                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-[#121212] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <div>
                            <h3 className="text-white font-bold">Notificações</h3>
                            {unreadCount > 0 && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
                                </p>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={onMarkAllAsRead}
                                className="text-xs font-bold text-[#c4b5fd] hover:text-white transition-colors"
                            >
                                Marcar todas como lidas
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                        {sortedNotifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-sm">Nenhuma notificação</p>
                            </div>
                        ) : (
                            sortedNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group relative ${
                                        !notification.isRead ? 'bg-white/[0.02]' : ''
                                    }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    {/* Unread Indicator */}
                                    {!notification.isRead && (
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#8a4add] rounded-full"></div>
                                    )}

                                    <div className="flex gap-3 pl-4">
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${getNotificationColor(notification.type)} border flex items-center justify-center text-xl`}>
                                            {getNotificationIcon(notification.type, notification.icon)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className={`text-sm font-bold ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                                                    {notification.title}
                                                </h4>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(notification.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                                                    title="Excluir notificação"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-[10px] text-gray-600 font-mono">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>
                                                {notification.actionLabel && (
                                                    <span className="text-[10px] font-bold text-[#c4b5fd]">
                                                        {notification.actionLabel} →
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {sortedNotifications.length > 0 && (
                        <div className="p-3 border-t border-white/10 bg-white/5 text-center">
                            <button
                                onClick={() => {
                                    navigate('/painel');
                                    setIsOpen(false);
                                }}
                                className="text-xs font-bold text-gray-400 hover:text-white transition-colors"
                            >
                                Ver todas as notificações
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
