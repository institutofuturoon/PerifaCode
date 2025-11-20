
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../assets/Logo';
import { useAppContext } from '../App';

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode; active?: boolean }> = ({ onClick, children, active }) => (
  <button 
    onClick={onClick} 
    className={`text-sm font-medium transition-colors duration-300 ${active ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
  >
    {children}
  </button>
);

const MobileLink: React.FC<{ onClick: () => void; children: React.ReactNode; active?: boolean }> = ({ onClick, children, active }) => (
    <button 
        onClick={onClick} 
        className={`text-3xl font-black py-3 w-full text-center transition-all duration-300 transform hover:scale-105 ${active ? 'text-white' : 'text-gray-500 hover:text-white'}`}
    >
        {children}
    </button>
);

const Header: React.FC = () => {
  const { user } = useAppContext();
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled || isMenuOpen ? 'bg-[#09090B]/90 backdrop-blur-md border-white/10 py-3' : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button onClick={() => handleNav('/')} className="flex-shrink-0 z-50 relative">
              <Logo style={{ width: '100px', height: 'auto' }} />
            </button>

            {/* Desktop Navigation (Institutional Only) */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink onClick={() => handleNav('/')} active={isActive('/')}>Início</NavLink>
              <NavLink onClick={() => handleNav('/courses')} active={isActive('/courses')}>Cursos</NavLink>
              <NavLink onClick={() => handleNav('/blog')} active={isActive('/blog')}>Blog</NavLink>
              <NavLink onClick={() => handleNav('/about')} active={isActive('/about')}>Quem Somos</NavLink>
              <NavLink onClick={() => handleNav('/partnerships')} active={isActive('/partnerships')}>Parcerias</NavLink>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => handleNav('/donate')} 
                className="text-[#c4b5fd] text-xs font-bold uppercase tracking-wider hover:text-white transition-colors mr-2"
              >
                Faça uma Doação
              </button>

              {user ? (
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="bg-white/10 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-white/20 transition-all flex items-center gap-2 border border-white/10"
                >
                   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                   Acessar Sistema
                </button>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white font-medium text-sm px-3 transition-colors">
                    Login
                  </button>
                  <button onClick={() => navigate('/register')} className="bg-[#8a4add] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#7c3aed] transition-all shadow-lg shadow-[#8a4add]/20">
                    Matricule-se
                  </button>
                </>
              )}
            </div>
            
            {/* Mobile Hamburger Button */}
            <div className="md:hidden z-50">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 text-gray-300 hover:text-white focus:outline-none"
                aria-label="Menu"
              >
                 {isMenuOpen ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                 )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#09090B] z-40 md:hidden flex flex-col animate-fade-in pt-24 px-6">
          
          {/* Institutional Links - Centered */}
          <div className="flex flex-col items-center justify-center flex-grow space-y-4">
             <MobileLink onClick={() => handleNav('/')} active={isActive('/')}>Início</MobileLink>
             <MobileLink onClick={() => handleNav('/courses')} active={isActive('/courses')}>Cursos</MobileLink>
             <MobileLink onClick={() => handleNav('/blog')} active={isActive('/blog')}>Blog & Notícias</MobileLink>
             <MobileLink onClick={() => handleNav('/about')} active={isActive('/about')}>Quem Somos</MobileLink>
             <MobileLink onClick={() => handleNav('/partnerships')} active={isActive('/partnerships')}>Para Empresas</MobileLink>
          </div>

          {/* Action Area */}
          <div className="mt-auto mb-8 space-y-4">
             {user ? (
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                     <div className="flex items-center gap-3 mb-4">
                         <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border border-white/20" />
                         <div>
                             <p className="text-white font-bold text-sm">Olá, {user.name.split(' ')[0]}</p>
                             <p className="text-gray-400 text-xs">Logado como {user.role === 'student' ? 'Aluno' : 'Instrutor'}</p>
                         </div>
                     </div>
                     <button 
                        onClick={() => handleNav('/dashboard')}
                        className="w-full bg-[#8a4add] text-white font-bold py-3 rounded-lg text-center"
                     >
                         Acessar Meu Painel
                     </button>
                 </div>
             ) : (
                 <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => handleNav('/login')} className="py-3 rounded-xl border border-white/20 text-white font-bold text-center hover:bg-white/5">
                         Entrar
                     </button>
                     <button onClick={() => handleNav('/register')} className="py-3 rounded-xl bg-[#8a4add] text-white font-bold text-center">
                         Criar Conta
                     </button>
                 </div>
             )}

             <button 
                onClick={() => handleNav('/donate')}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#18181b] to-[#27272a] border border-white/10 text-[#c4b5fd] font-bold text-center flex items-center justify-center gap-2"
             >
                <span>💛</span> Apoie a Causa
             </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
