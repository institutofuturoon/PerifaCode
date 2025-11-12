import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../assets/Logo';

const FooterLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-gray-400 hover:text-white transition-colors duration-200">
    {children}
  </button>
);

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110">
        {children}
    </a>
);

const ContactInfo: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="flex items-start gap-3">
        <span className="text-[#8a4add] mt-1">{icon}</span>
        <p className="text-gray-400">{children}</p>
    </div>
)

const Footer: React.FC = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#09090B] text-white border-t border-white/10">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Coluna 1: Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Logo />
            </div>
            <p className="text-gray-400 text-base">
              Feito na quebrada para o mundo. Capacitando a próxima geração de talentos em tecnologia.
            </p>
            <div className="flex space-x-6 pt-2">
                <SocialIcon href="https://www.instagram.com/institutofuturoon/">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm.173 15.122a3.953 3.953 0 110-7.906 3.953 3.953 0 010 7.906zm4.18-8.89a1.096 1.096 0 11-2.191 0 1.096 1.096 0 012.19 0zm-8.832 1.393a5.553 5.553 0 1010.518-2.618 5.553 5.553 0 00-10.518 2.618z" clipRule="evenodd" /></svg>
                </SocialIcon>
                 <SocialIcon href="https://www.linkedin.com/company/instituto-futuroon/">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </SocialIcon>
            </div>
          </div>
          
          {/* Coluna 2: Plataforma */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Plataforma</h3>
            <ul className="mt-4 space-y-3">
              <li><FooterLink onClick={() => navigate('/courses')}>Cursos</FooterLink></li>
              <li><FooterLink onClick={() => navigate('/community')}>Comunidade</FooterLink></li>
              <li><FooterLink onClick={() => navigate('/connect')}>Mentorias & Eventos</FooterLink></li>
              <li><FooterLink onClick={() => navigate('/blog')}>Blog</FooterLink></li>
            </ul>
          </div>

          {/* Coluna 3: Institucional */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Institucional</h3>
            <ul className="mt-4 space-y-3">
              <li><FooterLink onClick={() => navigate('/about')}>Sobre Nós</FooterLink></li>
              <li><FooterLink onClick={() => navigate('/team')}>Nossa Equipe</FooterLink></li>
              <li><FooterLink onClick={() => navigate('/annual-report')}>Transparência</FooterLink></li>
              <li><FooterLink onClick={() => navigate('/donate')}>Faça uma Doação</FooterLink></li>
            </ul>
          </div>

          {/* Coluna 4: Contato */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contato</h3>
            <ul className="mt-4 space-y-3">
                <li><ContactInfo icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>}>Rua Silva Jardim, 689<br />Neves - São Gonçalo - RJ</ContactInfo></li>
                <li><ContactInfo icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>}>futurooon@gmail.com</ContactInfo></li>
                <li><ContactInfo icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.758a10.024 10.024 0 004.486 4.486l.758-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>}> (21) 97087-2194</ContactInfo></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Instituto FuturoOn. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <button onClick={() => navigate('/privacy')} className="hover:text-gray-300 transition-colors">Política de Privacidade</button>
            <button onClick={() => navigate('/terms')} className="hover:text-gray-300 transition-colors">Termos de Uso</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;