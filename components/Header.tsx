import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View } from '../types';
import { Logo } from '../assets/Logo';
import { MOCK_NOTIFICATIONS } from '../constants';
import { useAppContext } from '../App';

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-gray-300 hover:text-purple-300 transition-colors duration-300 text-sm font-medium">
    {children}
  </button>
);

const MobileDropdown: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
            >
                <span>{title}</span>
                <svg className={`h-5 w-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            {isOpen && (
                <div className="pt-1 pb-2 pl-6 space-y-1">
                    {children}
                </div>
            )}
        </div>
    );
};


const Header: React.FC = () => {
  const { user, navigate } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const hasUnread = useMemo(() => notifications.some(n => !n.isRead), [notifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    setIsNotificationsOpen(prev => !prev);
    // If opening the panel and there are unread notifications
    if (!isNotificationsOpen && hasUnread) {
        // Mark as read after a short delay for animation purposes
        setTimeout(() => {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }, 1500);
    }
  };

  return (
    <header className="bg-[#0A0A0A]/60 backdrop-blur-lg sticky top-0 z-50 border-b border-purple-500/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => navigate('home')} className="flex-shrink-0">
              <Logo className="h-8 w-auto" />
            </button>
            <nav className="hidden md:flex md:ml-10 md:space-x-8 items-center">
              <NavLink onClick={() => navigate('courses')}>Cursos</NavLink>
              <button onClick={() => navigate('community')} className="bg-white/10 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-white/20 transition-all duration-300">
                Comunidade ✨
              </button>
              <NavLink onClick={() => navigate('connect')}>Mentorias & Eventos</NavLink>
              <NavLink onClick={() => navigate('team')}>Nossa Equipe</NavLink>
              <NavLink onClick={() => navigate('blog')}>Blog</NavLink>
            </nav>
          </div>
          <div className="hidden md:block">
            {user ? (
              <div className="ml-4 flex items-center md:ml-6">
                {(user.role === 'admin' || user.role === 'instructor') && (
                  <button onClick={() => navigate('admin')} className="bg-white/10 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white/20 transition-all duration-300 mr-2">
                    {user.role === 'admin' ? 'Admin' : 'Painel do Instrutor'}
                  </button>
                )}

                {user.role === 'admin' && (
                    <button onClick={() => navigate('analytics')} className="bg-white/10 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white/20 transition-all duration-300 mr-4">
                      Analytics
                    </button>
                )}

                <div className="relative" ref={notificationsRef}>
                    <button onClick={toggleNotifications} className="relative p-2 rounded-full text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        {hasUnread && <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-pink-500 ring-2 ring-[#0A0A0A]"></span>}
                    </button>
                    {isNotificationsOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-[#121212] border border-white/10 ring-1 ring-black ring-opacity-5">
                            <div className="p-2">
                                <div className="flex justify-between items-center px-2 py-1">
                                    <p className="font-bold text-white">Notificações</p>
                                </div>
                                <div className="mt-2 max-h-96 overflow-y-auto">
                                {notifications.map(notif => (
                                    <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5">
                                        <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 transition-all duration-500 ${!notif.isRead ? 'bg-pink-500' : ''}`}></div>
                                        <div>
                                          <p className="text-sm text-gray-200">{notif.text}</p>
                                          <p className="text-xs text-gray-500">{notif.createdAt}</p>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={() => navigate('dashboard')} className="ml-4 bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
                  Meu Painel
                </button>
                <button onClick={() => navigate('profile')} className="ml-4 rounded-full transition-transform duration-300 hover:scale-110">
                  <img className="h-9 w-9 rounded-full border-2 border-purple-500/50" src={user.avatarUrl} alt={user.name} />
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <button onClick={() => navigate('login')} className="text-white font-medium px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors">
                  Entrar
                </button>
                <button onClick={() => navigate('login')} className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
                  Criar conta
                </button>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <span className="sr-only">Abrir menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A]/90 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a onClick={() => { navigate('courses'); setIsMenuOpen(false); }} className="cursor-pointer block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50">Cursos</a>
            <a onClick={() => { navigate('community'); setIsMenuOpen(false); }} className="cursor-pointer block px-3 py-2 rounded-md text-base font-medium text-white bg-white/10">Comunidade ✨</a>
            <a onClick={() => { navigate('connect'); setIsMenuOpen(false); }} className="cursor-pointer block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50">Mentorias & Eventos</a>
            <a onClick={() => { navigate('team'); setIsMenuOpen(false); }} className="cursor-pointer block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50">Nossa Equipe</a>
            <a onClick={() => { navigate('blog'); setIsMenuOpen(false); }} className="cursor-pointer block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50">Blog</a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700/50">
            {user ? (
               <div className="px-5 flex flex-col items-start space-y-3">
                 {(user.role === 'admin' || user.role === 'instructor') && (
                   <button onClick={() => {navigate('admin'); setIsMenuOpen(false)}} className="w-full text-left bg-white/10 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white/20 transition-colors">
                     {user.role === 'admin' ? 'Admin' : 'Painel do Instrutor'}
                   </button>
                 )}
                 {user.role === 'admin' && (
                    <button onClick={() => {navigate('analytics'); setIsMenuOpen(false)}} className="w-full text-left bg-white/10 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white/20 transition-colors">
                      Analytics
                    </button>
                 )}
                 <button onClick={() => {navigate('dashboard'); setIsMenuOpen(false)}} className="w-full text-left bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
                  Meu Painel
                </button>
                <button onClick={() => {navigate('profile'); setIsMenuOpen(false)}} className="w-full text-left text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                  Meu Perfil
                </button>
              </div>
            ) : (
              <div className="px-5 flex flex-col space-y-3">
                <button onClick={() => {navigate('login'); setIsMenuOpen(false)}} className="w-full text-left text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                  Entrar
                </button>
                <button onClick={() => {navigate('login'); setIsMenuOpen(false)}} className="w-full text-left bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
                  Criar conta
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;