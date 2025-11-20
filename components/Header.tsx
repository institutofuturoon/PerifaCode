
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { View, Notification } from '../types';
import { Logo } from '../assets/Logo';
import { useAppContext } from '../App';

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-gray-300 hover:text-white transition-colors duration-300 text-[11px] font-medium uppercase tracking-wide">
    {children}
  </button>
);

const Header: React.FC = () => {
  const { user, users, setUser, handleLogout } = useAppContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const hasUnread = useMemo(() => notifications.some(n => !n.isRead), [notifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    setIsNotificationsOpen(prev => !prev);
    if (!isNotificationsOpen && hasUnread) {
        setTimeout(() => {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }, 1500);
    }
  };

  const handleMobileNav = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  }
  
  const handleUserSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    if (userId === 'logout') {
        setUser(null);
        navigate('/login');
    } else {
        const selectedUser = users.find(u => u.id === userId);
        if (selectedUser) {
            setUser(selectedUser);
            navigate('/dashboard');
        }
    }
};

  return (
    <header className="bg-[#09090B]/90 backdrop-blur-md sticky top-0 z-50 border-b border-white/5 h-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <button onClick={() => navigate('/')} className="flex-shrink-0 transform scale-75 origin-left">
              <Logo />
            </button>
            <nav className="hidden md:flex md:ml-6 md:space-x-5 items-center">
              <NavLink onClick={() => navigate('/courses')}>Cursos</NavLink>
              <NavLink onClick={() => navigate('/community')}>Projetos</NavLink>
              <NavLink onClick={() => navigate('/connect')}>Mentorias & Eventos</NavLink>
              <NavLink onClick={() => navigate('/about')}>Sobre Nós</NavLink>
              <NavLink onClick={() => navigate('/blog')}>Blog</NavLink>
              {user && <NavLink onClick={() => navigate('/dashboard')}>Painel</NavLink>}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
             <div className="flex items-center gap-2 border-r border-white/10 pr-3 mr-1">
                <label htmlFor="user-switcher" className="text-[9px] text-yellow-400 font-mono">TEST:</label>
                <select
                    id="user-switcher"
                    value={user?.id || 'logout'}
                    onChange={handleUserSwitch}
                    className="bg-transparent text-white text-[10px] border-none focus:ring-0 p-0.5 rounded"
                    style={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }}
                >
                    <option value="logout" style={{ backgroundColor: '#1a202c' }}>Log Out</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id} style={{ backgroundColor: '#1a202c' }}>
                            {u.name} ({u.role})
                        </option>
                    ))}
                </select>
            </div>
             <button onClick={() => navigate('/donate')} className="border border-[#8a4add]/50 text-[#c4b5fd] px-2.5 py-0.5 rounded text-[10px] font-medium hover:bg-[#8a4add]/20 hover:text-white transition-all duration-300">
                Doar
            </button>
            {user ? (
              <>
                {/* Notifications */}
                <div ref={notificationsRef} className="relative">
                  <button onClick={toggleNotifications} className="relative text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    {hasUnread && <span className="absolute top-1 right-1 block h-1.5 w-1.5 rounded-full bg-[#8a4add] ring-1 ring-black"></span>}
                  </button>
                  {isNotificationsOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-[#1a202c] ring-1 ring-white/10 text-xs">
                      <div className="p-2 border-b border-white/10"><h3 className="font-semibold text-white text-[10px]">Notificações</h3></div>
                      <div className="py-1 max-h-56 overflow-y-auto">
                        {notifications.length === 0 ? <p className="px-3 py-2 text-[10px] text-gray-400">Nenhuma notificação.</p> : notifications.map(n => (
                          <a key={n.id} href="#" className="block px-3 py-2 text-gray-300 hover:bg-white/5">
                            <p className={!n.isRead ? 'font-bold' : ''}>{n.text}</p>
                            <p className="text-[9px] text-gray-500 mt-0.5">{n.createdAt}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Profile Dropdown */}
                <div ref={profileMenuRef} className="relative">
                  <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex text-sm rounded-full focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-black focus:ring-[#8a4add]">
                    <img className="h-6 w-6 rounded-full object-cover" src={user.avatarUrl} alt={user.name} />
                  </button>
                  {isProfileMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg py-1 bg-[#1a202c] ring-1 ring-white/10 text-xs">
                      <button onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }} className="block w-full text-left px-3 py-1.5 text-gray-300 hover:bg-white/5">Meu Perfil</button>
                      {(user.role === 'admin' || user.role === 'instructor') && <button onClick={() => { navigate('/admin'); setIsProfileMenuOpen(false); }} className="block w-full text-left px-3 py-1.5 text-gray-300 hover:bg-white/5">Painel Admin</button>}
                      <button onClick={() => { handleLogoutClick(); setIsProfileMenuOpen(false); }} className="block w-full text-left px-3 py-1.5 text-red-400 hover:bg-white/5">Sair</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white font-medium text-[11px] px-2 py-1 transition-colors">
                    Entrar
                </button>
                <button onClick={() => navigate('/register')} className="bg-[#8a4add] text-white font-semibold py-1 px-2.5 rounded text-[10px] hover:bg-[#7c3aed] transition-all">
                    Cadastre-se
                </button>
              </div>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none">
              <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-white/10 absolute w-full z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && <button onClick={() => handleMobileNav('/dashboard')} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 w-full text-left">Meu Painel</button>}
            <button onClick={() => handleMobileNav('/courses')} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 w-full text-left">Cursos</button>
            <button onClick={() => handleMobileNav('/community')} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 w-full text-left">Projetos</button>
            <button onClick={() => handleMobileNav('/connect')} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 w-full text-left">Mentorias & Eventos</button>
             <button onClick={() => handleMobileNav('/about')} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 w-full text-left">Sobre Nós</button>
            {!user ? (
                <div className="border-t border-white/10 pt-4 mt-4 flex items-center justify-center gap-2">
                    <button onClick={() => handleMobileNav('/login')} className="flex-1 border border-[#8a4add]/80 bg-transparent text-gray-300 hover:bg-[#8a4add]/20 font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-xs">
                        Entrar
                    </button>
                    <button onClick={() => handleMobileNav('/register')} className="flex-1 border border-[#8a4add] bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-300 text-xs">
                        Cadastre-se
                    </button>
                </div>
            ) : (
                <div className="border-t border-white/10 pt-4 mt-4">
                     <button onClick={() => { handleLogoutClick(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-white/10">
                         Sair
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
