import React from 'react';
import { View } from '../types';
import { Logo } from '../assets/Logo';
import { useAppContext } from '../App';

const FooterLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-base text-gray-400 hover:text-white transition-colors">
    {children}
  </button>
);

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#c4b5fd] transition-all duration-300 transform hover:scale-110">
        {children}
    </a>
);

const Footer: React.FC = () => {
  const { navigate } = useAppContext();
  return (
    <footer className="bg-[#151221] text-white border-t border-white/10 bg-grid-pattern">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Coluna 1: Logo e Descrição */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <Logo />
            <p className="text-gray-400 text-base">
              PerifaCode é a plataforma de educação em tecnologia do Instituto FuturoOn. Feito na quebrada para o mundo.
            </p>
            <div className="flex space-x-6 pt-2">
                <SocialIcon href="https://www.instagram.com/institutofuturoon/">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2c2.4 0 2.7.01 3.8.06 1.1.05 1.8.22 2.4.47.6.25 1.1.58 1.8.98.6.4.9.88 1.3 1.48.4.6.7 1.2.9 1.8.2.7.4 1.3.4 2.4.0 1.1.0 1.4.0 3.8s-.01 2.7-.06 3.8c-.05 1.1-.22 1.8-.47 2.4-.25.6-.58 1.1-.98 1.8-.4.6-.88.9-1.48 1.3-.6.4-1.2.7-1.8.9-.7.2-1.3.4-2.4.4-1.1.0-1.4.0-3.8.0s-2.7-.01-3.8-.06c-1.1-.05-1.8-.22-2.4-.47-.6-.25-1.1-.58-1.8-.98-.6-.4-.9-.88-1.3-1.48-.4-.6-.7-1.2-.9-1.8-.2-.7-.4-1.3-.4-2.4-.0-1.1-.0-1.4-.0-3.8s.01-2.7.06-3.8c.05 1.1.22 1.8.47 2.4.25-.6.58 1.1.98 1.8.4-.6.88-.9 1.48-1.3.6-.4 1.2-.7 1.8-.9.7-.2 1.3-.4 2.4-.4 1.1-.0 1.4-.0 3.8-.0zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm6.4-9.9a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" clipRule="evenodd" /></svg>
                </SocialIcon>
                 <SocialIcon href="https://www.linkedin.com/company/instituto-futuroon/">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </SocialIcon>
            </div>
          </div>
          
          {/* Coluna 2: Plataforma */}
          <div>
            <h3 className="text-sm font-semibold text-[#c4b5fd] tracking-wider uppercase">Plataforma</h3>
            <ul className="mt-4 space-y-4">
              <li><FooterLink onClick={() => navigate('courses')}>Cursos</FooterLink></li>
              <li><FooterLink onClick={() => navigate('community')}>Comunidade</FooterLink></li>
              <li><FooterLink onClick={() => navigate('connect')}>Mentorias</FooterLink></li>
              <li><FooterLink onClick={() => navigate('blog')}>Blog</FooterLink></li>
            </ul>
          </div>

          {/* Coluna 3: Instituto & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-[#c4b5fd] tracking-wider uppercase">Instituto</h3>
            <ul className="mt-4 space-y-4">
              <li><FooterLink onClick={() => navigate('team')}>Nossa Equipe</FooterLink></li>
              <li><FooterLink onClick={() => navigate('partnerships')}>Parcerias</FooterLink></li>
              <li><FooterLink onClick={() => navigate('donate')}>Faça uma Doação</FooterLink></li>
              <li className="pt-2 border-t border-white/10 !mt-6"><FooterLink onClick={() => navigate('privacy')}>Privacidade</FooterLink></li>
              <li><FooterLink onClick={() => navigate('terms')}>Termos de Uso</FooterLink></li>
            </ul>
          </div>

          {/* Coluna 4: Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-[#c4b5fd] tracking-wider uppercase">Fique por Dentro</h3>
            <p className="mt-4 text-base text-gray-400">Receba as últimas novidades, dicas de carreira e eventos diretamente no seu email.</p>
            <form className="mt-4">
                <div className="flex gap-2">
                    <input type="email" placeholder="Seu melhor email" className="w-full px-4 py-2 text-base text-white bg-black/30 border border-white/20 rounded-md focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-all" />
                    <button type="submit" className="flex-shrink-0 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white p-2.5 rounded-md hover:opacity-90 transition-opacity">
                        <span className="sr-only">Inscrever</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </div>
            </form>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="text-base text-gray-500 text-center">&copy; {new Date().getFullYear()} Instituto FuturoOn. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;