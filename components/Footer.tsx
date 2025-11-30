
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../assets/Logo';
import { useContactInfo, useOngData } from '../hooks/useOngData';

// Links agora são maiores no mobile (text-base) e voltam ao normal no desktop (md:text-sm)
const FooterLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-gray-400 hover:text-white transition-colors duration-200 text-base md:text-sm text-center md:text-left block py-2 md:py-1.5 w-full">
    {children}
  </button>
);

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110">
        {children}
    </a>
);

const ContactInfo: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="flex items-start justify-center md:justify-start gap-3 text-sm py-1.5 w-full">
        <span className="text-[#8a4add] mt-1 flex-shrink-0">{icon}</span>
        <p className="text-gray-400 leading-relaxed text-left">{children}</p>
    </div>
)

// Componente de Lista Estática
// Título maior no mobile
const FooterList: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="flex flex-col items-center md:items-start w-full">
        <h3 className="text-lg md:text-base font-bold text-white mb-4 text-center md:text-left w-full">{title}</h3>
        <ul className="space-y-2 md:space-y-1 flex flex-col items-center md:items-start w-full">
            {children}
        </ul>
    </div>
);

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const contact = useContactInfo();
  const { legal, organization } = useOngData();
  
  return (
    <footer id="landing-pad" className="bg-brand-navy text-white border-t border-white/5 relative z-20">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Coluna 1: Brand - Centralizado no mobile por padrão neste layout */}
          <div className="space-y-6 text-center md:text-left mb-4 md:mb-0 flex flex-col items-center md:items-start">
            <div className="transform scale-100 origin-center md:origin-left">
                <Logo />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              {organization.slogan}
            </p>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
              {organization.mission}
            </p>
            
            {/* Badge OSCIP */}
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
              <svg className="w-4 h-4 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="text-xs text-gray-400 font-medium">{legal.registration}</span>
            </div>

            <div className="flex justify-center md:justify-start space-x-5 pt-2">
                {contact.socialMedia.instagram && (
                  <SocialIcon href={contact.socialMedia.instagram}>
                      <span className="sr-only">Instagram</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </SocialIcon>
                )}
                {contact.socialMedia.linkedin && (
                  <SocialIcon href={contact.socialMedia.linkedin}>
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </SocialIcon>
                )}
            </div>
          </div>
          
          {/* 
             Wrapper para Plataforma e Institucional:
             - No mobile: Grid de 2 colunas
             - No desktop: 'contents' para layout original de 4 colunas
          */}
          <div className="col-span-1 grid grid-cols-2 gap-6 md:contents">
              {/* Coluna 2: Plataforma */}
              <FooterList title="Plataforma">
                  <li><FooterLink onClick={() => navigate('/courses')}>Cursos</FooterLink></li>
                  <li><FooterLink onClick={() => navigate('/community')}>Comunidade</FooterLink></li>
                  <li><FooterLink onClick={() => navigate('/blog')}>Blog</FooterLink></li>
                  <li><FooterLink onClick={() => navigate('/connect')}>Mentorias</FooterLink></li>
              </FooterList>

              {/* Coluna 3: Institucional */}
              <FooterList title="Institucional">
                  <li><FooterLink onClick={() => navigate('/about')}>Sobre Nós</FooterLink></li>
                  <li><FooterLink onClick={() => navigate('/team')}>Equipe</FooterLink></li>
                  <li><FooterLink onClick={() => navigate('/supporters')}>Parceiros</FooterLink></li>
                  <li><FooterLink onClick={() => navigate('/annual-report')}>Transparência</FooterLink></li>
                  <li><FooterLink onClick={() => navigate('/donate')}>Apoie</FooterLink></li>
              </FooterList>
          </div>

          {/* Coluna 4: Contato - Centralizado no mobile */}
          <div className="col-span-1 mt-4 md:mt-0 flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-base font-bold text-white mb-4 w-full">CONTATO</h3>
            <ul className="space-y-3 flex flex-col items-center md:items-start w-full">
                <li className="w-full">
                    <ContactInfo icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>}>
                        {contact.address.street}, {contact.address.number}<br />
                        {contact.address.neighborhood} - {contact.address.city}/{contact.address.state}<br />
                        CEP: {contact.address.zipCode}
                    </ContactInfo>
                </li>
                <li className="w-full">
                    <ContactInfo icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>}>
                        {contact.emails.general}
                    </ContactInfo>
                </li>
                <li className="w-full">
                    <a 
                        href={`https://wa.me/${contact.phones.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start justify-center md:justify-start gap-3 text-sm py-1.5 w-full hover:text-white transition-colors group"
                    >
                        <span className="text-[#25D366] mt-1 flex-shrink-0 group-hover:scale-110 transition-transform">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </span>
                        <p className="text-gray-400 leading-relaxed text-left group-hover:text-white transition-colors">
                            {contact.phones.whatsapp}
                        </p>
                    </a>
                </li>
            </ul>
          </div>
        </div>

        {/* Informações Legais */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Razão Social</h4>
              <p className="text-sm text-gray-400">{legal.legalName}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CNPJ</h4>
              <p className="text-sm text-gray-400">{legal.cnpj}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registro</h4>
              <p className="text-sm text-gray-400">{legal.registration}</p>
            </div>
          </div>
        </div>

        {/* Copyright e Links Legais */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 text-center sm:text-left">
          <div className="space-y-1">
            <p>&copy; {new Date().getFullYear()} {organization.name}. Todos os direitos reservados.</p>
            <p className="text-xs text-gray-600">Fundado em {organization.foundedYear} • {organization.slogan}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors text-xs sm:text-sm">
              Política de Privacidade
            </button>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors text-xs sm:text-sm">
              Termos de Uso
            </button>
            <button onClick={() => navigate('/transparency')} className="hover:text-white transition-colors text-xs sm:text-sm">
              Transparência
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
