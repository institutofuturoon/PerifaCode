
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../assets/Logo';
import { useAppContext } from '../App';
import NotificationCenter from './NotificationCenter';

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode; active?: boolean }> = ({ onClick, children, active }) => (
  <button
    onClick={onClick}
    className={`text-sm font-semibold transition-all duration-300 relative group ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
  >
    {children}
    {active && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8a4add] to-[#f27983]"></div>}
  </button>
);

const DropdownNavLink: React.FC<{
  label: string;
  active?: boolean;
  children: React.ReactNode;
}> = ({ label, active, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`text-sm font-semibold transition-all duration-300 flex items-center gap-1 relative group ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
      >
        {label}
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {active && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8a4add] to-[#f27983]"></div>}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#09090B]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl py-2 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownItem: React.FC<{ onClick: () => void; children: React.ReactNode; active?: boolean }> = ({ onClick, children, active }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${active ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
  >
    {children}
  </button>
);

const MobileLink: React.FC<{ onClick: () => void; children: React.ReactNode; active?: boolean }> = ({ onClick, children, active }) => (
  <button
    onClick={onClick}
    className={`text-2xl md:text-3xl font-black py-2.5 md:py-3 w-full text-center transition-all duration-300 ${active ? 'text-white' : 'text-gray-500 hover:text-white'}`}
  >
    {children}
  </button>
);

const MobileSubLink: React.FC<{ onClick: () => void; children: React.ReactNode; active?: boolean }> = ({ onClick, children, active }) => (
  <button
    onClick={onClick}
    className={`text-base font-semibold py-2 w-full text-center transition-all duration-300 ${active ? 'text-[#c4b5fd]' : 'text-gray-400 hover:text-white'}`}
  >
    {children}
  </button>
);

const Header: React.FC = () => {
  const { user, notifications, handleMarkNotificationAsRead, handleMarkAllNotificationsAsRead, handleDeleteNotification } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to add background to header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  const handleNav = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (user) {
      handleNav('/painel');
    } else {
      handleNav('/');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled || isMenuOpen ? 'bg-[#09090B]/90 backdrop-blur-md border-white/10 py-3' : 'bg-transparent border-transparent py-5'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button onClick={handleLogoClick} className="flex-shrink-0 z-50 relative">
              <Logo style={{ width: '100px', height: 'auto' }} />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <NavLink onClick={() => handleNav('/')} active={isActive('/')}>Início</NavLink>
              <NavLink onClick={() => handleNav('/cursos')} active={isActive('/cursos')}>Cursos</NavLink>
              <NavLink onClick={() => handleNav('/eventos')} active={isActive('/eventos')}>Eventos</NavLink>
              <NavLink onClick={() => handleNav('/blog')} active={isActive('/blog')}>Blog</NavLink>
              <NavLink onClick={() => handleNav('/parcerias')} active={isActive('/parcerias')}>Parcerias</NavLink>
              <NavLink onClick={() => handleNav('/contato')} active={isActive('/contato')}>Contato</NavLink>

              {/* Dropdown "Sobre" */}
              <DropdownNavLink
                label="Sobre"
                active={isActive('/sobre') || isActive('/equipe') || isActive('/apoiadores') || isActive('/transparencia')}
              >
                <DropdownItem onClick={() => handleNav('/sobre')} active={isActive('/sobre')}>
                  Quem Somos
                </DropdownItem>
                <DropdownItem onClick={() => handleNav('/equipe')} active={isActive('/equipe')}>
                  Equipe
                </DropdownItem>
                <DropdownItem onClick={() => handleNav('/apoiadores')} active={isActive('/apoiadores')}>
                  Apoiadores
                </DropdownItem>
                <DropdownItem onClick={() => handleNav('/transparencia')} active={isActive('/transparencia')}>
                  Transparência
                </DropdownItem>
              </DropdownNavLink>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              <button
                onClick={() => handleNav('/doar')}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative px-4 py-2 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 transition-transform">
                  💛 Doar
                </div>
              </button>

              {user && (
                <NotificationCenter
                  notifications={notifications.filter(n => n.userId === user.id)}
                  onMarkAsRead={handleMarkNotificationAsRead}
                  onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                  onDelete={handleDeleteNotification}
                />
              )}
              {user ? (
                <button
                  onClick={() => navigate('/painel')}
                  className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-white/20 transition-all flex items-center gap-2 border border-white/10"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/entrar')}
                    className="text-gray-300 hover:text-white font-semibold text-sm px-3 transition-colors"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => navigate('/cadastro')}
                    className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-white/20 transition-all border border-white/10"
                  >
                    Cadastrar
                  </button>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden z-50 flex items-center gap-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-300 hover:text-white focus:outline-none transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#09090B]/98 backdrop-blur-md z-40 lg:hidden flex flex-col animate-fade-in pt-20 px-4 sm:px-6 overflow-y-auto">

          {/* Navigation Links */}
          <div className="flex flex-col items-center justify-start flex-grow space-y-3 py-6">
            <MobileLink onClick={() => handleNav('/')} active={isActive('/')}>Início</MobileLink>
            <MobileLink onClick={() => handleNav('/cursos')} active={isActive('/cursos')}>Cursos</MobileLink>
            <MobileLink onClick={() => handleNav('/eventos')} active={isActive('/eventos')}>Eventos</MobileLink>
            <MobileLink onClick={() => handleNav('/blog')} active={isActive('/blog')}>Blog</MobileLink>
            <MobileLink onClick={() => handleNav('/parcerias')} active={isActive('/parcerias')}>Parcerias</MobileLink>
            <MobileLink onClick={() => handleNav('/contato')} active={isActive('/contato')}>Contato</MobileLink>

            {/* Sobre Submenu */}
            <div className="w-full">
              <div className="text-xl font-bold text-gray-500 text-center py-2">Sobre</div>
              <div className="space-y-1">
                <MobileSubLink onClick={() => handleNav('/sobre')} active={isActive('/sobre')}>Quem Somos</MobileSubLink>
                <MobileSubLink onClick={() => handleNav('/equipe')} active={isActive('/equipe')}>Equipe</MobileSubLink>
                <MobileSubLink onClick={() => handleNav('/apoiadores')} active={isActive('/apoiadores')}>Apoiadores</MobileSubLink>
                <MobileSubLink onClick={() => handleNav('/transparencia')} active={isActive('/transparencia')}>Transparência</MobileSubLink>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-auto mb-safe pb-6 space-y-3">
            {user ? (
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border border-white/20" />
                  <div>
                    <p className="text-white font-bold text-sm">Olá, {user.name.split(' ')[0]}</p>
                    <p className="text-gray-400 text-xs">{user.role === 'student' ? 'Aluno' : 'Instrutor'}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNav('/painel')}
                  className="w-full bg-[#8a4add] text-white font-bold py-3 rounded-xl text-center hover:bg-[#7c3aed] transition-colors"
                >
                  Acessar Dashboard
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleNav('/entrar')}
                  className="py-3 rounded-xl border border-white/20 text-white font-bold text-center hover:bg-white/5 transition-colors"
                >
                  Entrar
                </button>
                <button
                  onClick={() => handleNav('/cadastro')}
                  className="py-3 rounded-xl bg-[#8a4add] text-white font-bold text-center hover:bg-[#7c3aed] transition-colors"
                >
                  Cadastrar
                </button>
              </div>
            )}

            <button
              onClick={() => handleNav('/doar')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold text-center flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span>💛</span> Apoiar Agora
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
