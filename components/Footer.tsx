import React from 'react';
import { View } from '../types';
import { Logo } from '../assets/Logo';

interface FooterProps {
  navigate: (view: View) => void;
}

const FooterLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-base text-gray-400 hover:text-purple-300 transition-colors">
    {children}
  </button>
);

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110">
        {children}
    </a>
);

const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-purple-500/10">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Coluna 1: Logo e Descrição */}
          <div className="space-y-4">
            <Logo className="h-10" />
            <p className="text-gray-400 text-base">Feito na quebrada para o mundo. Capacitando a próxima geração de talentos em tecnologia.</p>
            <div className="flex space-x-6 pt-2">
                <SocialIcon href="https://www.instagram.com/institutofuturoon/">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049 1.064.218 1.791.465 2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427.465C9.795 2.013 10.148 2 12.315 2zm-1.161 1.525a.81.81 0 01-.81.81H9.35a.81.81 0 01-.81-.81V3.48a.81.81 0 01.81-.81h1.004a.81.81 0 01.81.81v.045zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.525a3.61 3.61 0 100 7.22 3.61 3.61 0 000-7.22z" clipRule="evenodd" /></svg>
                </SocialIcon>
                <SocialIcon href="https://www.facebook.com/institutofuturoon">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </SocialIcon>
                <SocialIcon href="https://www.linkedin.com/company/futuroon-tecnologia">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </SocialIcon>
            </div>
          </div>
          
          {/* Coluna 2: Navegação */}
          <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Navegação</h3>
              <ul className="mt-4 space-y-4">
                  <li><FooterLink onClick={() => navigate('courses')}>Cursos</FooterLink></li>
                  <li><FooterLink onClick={() => navigate('connect')}>Mentorias & Eventos</FooterLink></li>
                  <li><FooterLink onClick={() => navigate('team')}>Nossa Equipe</FooterLink></li>
                  <li><FooterLink onClick={() => navigate('blog')}>Blog</FooterLink></li>
              </ul>
          </div>

          {/* Coluna 3: Comunidade */}
          <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Comunidade</h3>
              <ul className="mt-4 space-y-4">
                  <li><FooterLink onClick={() => navigate('community')}>Showcase de Projetos</FooterLink></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-purple-300 transition-colors">Discord</a></li>
                  <li><FooterLink onClick={() => navigate('connect')}>Eventos</FooterLink></li>
              </ul>
          </div>

          {/* Coluna 4: Contato */}
          <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Contato</h3>
              <ul className="mt-4 space-y-4 text-base text-gray-400">
                  <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                          <svg className="h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <span>Rua Silva jardim, 689<br />Neves - São Gonçalo - Rio de Janeiro</span>
                  </li>
                  <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                          <svg className="h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <a href="mailto:futurooon@gmail.com" className="hover:text-purple-300 transition-colors">futurooon@gmail.com</a>
                  </li>
                  <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                          <svg className="h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <span>(21) 97087-2194</span>
                  </li>
              </ul>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="mt-12 border-t border-purple-500/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2025 Instituto FuturoOn. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <FooterLink onClick={() => navigate('privacy')}>Política de Privacidade</FooterLink>
            <FooterLink onClick={() => navigate('terms')}>Termos de Uso</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;