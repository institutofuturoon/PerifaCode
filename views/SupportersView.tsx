
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Partner } from '../types';
import { useAppContext } from '../App';

const CorporatePartnerCard: React.FC<{ partner: Partner; onClick: () => void }> = ({ partner, onClick }) => (
    <div onClick={onClick} className="relative bg-[#121212] border border-white/10 rounded-2xl h-48 group transition-all duration-500 hover:border-[#8a4add] hover:shadow-[0_0_40px_rgba(138,74,221,0.15)] overflow-hidden flex items-center justify-center cursor-pointer">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#8a4add]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
        
        <div className="relative z-10 p-8 w-full h-full flex items-center justify-center">
            <img 
                src={partner.logoUrl} 
                alt={partner.name} 
                className="max-w-[70%] max-h-[60%] object-contain opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110" 
            />
        </div>
    </div>
);

const BecomePartnerCard: React.FC = () => (
    <a href="mailto:parcerias@institutofuturoon.org" className="relative bg-[#121212] border border-dashed border-white/20 rounded-2xl h-48 group transition-all duration-300 hover:border-[#8a4add]/50 hover:bg-white/5 flex flex-col items-center justify-center cursor-pointer">
        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#8a4add]/20 group-hover:text-[#c4b5fd] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-[#c4b5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </div>
        <span className="text-base font-bold text-gray-300 group-hover:text-white">Sua Marca Aqui</span>
        <span className="text-xs text-gray-500 mt-1">Seja um mantenedor</span>
    </a>
);

const BenefitItem: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#8a4add] to-[#6d28d9] text-white flex items-center justify-center mb-4 shadow-lg shadow-[#8a4add]/20">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
);

const SupportersView: React.FC = () => {
    const navigate = useNavigate();
    const { partners } = useAppContext();

    return (
        <div className="bg-[#09090B] min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 text-center overflow-hidden">
                 <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8a4add]/10 rounded-full blur-[120px] pointer-events-none"></div>
                 
                 <div className="container mx-auto px-4 relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-[#8a4add]/10 border border-[#8a4add]/20 text-[#c4b5fd] text-xs font-bold uppercase tracking-widest mb-6">
                        Rede de Impacto
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 leading-tight">
                        Investindo no Futuro da <br/>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">Tecnologia</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-300">
                        Conheça as empresas que estão liderando a transformação social e abrindo portas para novos talentos da periferia.
                    </p>
                 </div>
            </section>

            {/* Partners Grid */}
            <section className="container mx-auto px-4 pb-20 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {partners.map(p => (
                        <CorporatePartnerCard 
                            key={p.id} 
                            partner={p} 
                            onClick={() => navigate(`/supporter/${p.id}`)}
                        />
                    ))}
                    <BecomePartnerCard />
                </div>
            </section>

            {/* Why Partner Section */}
            <section className="py-24 bg-[#121212] border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-white">Por que apoiar o FuturoOn?</h2>
                        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                            Mais do que responsabilidade social, uma parceria estratégica para o seu negócio.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <BenefitItem 
                            title="Acesso a Talentos" 
                            description="Conecte-se diretamente com desenvolvedores juniores qualificados e ansiosos para crescer na sua empresa."
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        />
                        <BenefitItem 
                            title="Branding de Impacto" 
                            description="Associe sua marca a um projeto de alto impacto social, fortalecendo sua reputação ESG no mercado."
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                        />
                        <BenefitItem 
                            title="Mentoria Corporativa" 
                            description="Engaje seus colaboradores como mentores voluntários, desenvolvendo liderança e soft skills na sua equipe."
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
                        />
                    </div>

                    <div className="mt-16 text-center">
                        <a 
                            href="mailto:parcerias@institutofuturoon.org"
                            className="inline-flex items-center gap-2 bg-white text-black font-bold py-4 px-10 rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            <span>Quero ser um Parceiro</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </a>
                        <p className="mt-4 text-sm text-gray-500">
                            Ou entre em contato pelo WhatsApp: <span className="text-gray-300 font-semibold">(21) 97087-2194</span>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SupportersView;
