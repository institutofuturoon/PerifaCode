import React from 'react';
import { useAppContext } from '../App';

const PartnerLogo: React.FC<{ name: string; logoUrl: string }> = ({ name, logoUrl }) => (
    <div className="flex-shrink-0 w-48 flex items-center justify-center p-6 bg-black/20 rounded-lg border border-white/10 group transition-all duration-300 transform hover:bg-white/5 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-105 hover:border-white/20">
        <img 
            src={logoUrl} 
            alt={name} 
            className="h-8 max-w-full object-contain filter grayscale brightness-150 group-hover:filter-none transition-all duration-300"
        />
    </div>
);


const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="text-center">
        <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white mb-4 shadow-lg shadow-purple-500/20">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-2 text-base text-gray-400">{children}</p>
    </div>
);

const PartnershipsView: React.FC = () => {
    const { partners } = useAppContext();

    return (
        <div className="space-y-24 md:space-y-32">
            {/* Hero Section */}
            <section className="pt-20 pb-10 md:pt-32 md:pb-10 aurora-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight">
                        Parcerias que <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Transformam</span>
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
                        Juntamos forças com empresas que acreditam no poder da diversidade e da inclusão para construir o futuro da tecnologia no Brasil.
                    </p>
                </div>
            </section>

            {/* Partner Logos */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Empresas que Acreditam</h2>
                    <p className="max-w-3xl mx-auto text-lg text-gray-400 mb-12">
                        Conheça as organizações que contratam, mentoram e investem nos talentos formados pela FuturoOn.
                    </p>
                </div>
                <div className="relative">
                    <div className="marquee">
                        <div className="marquee-content">
                            {partners.map(partner => (
                                <PartnerLogo key={partner.id} name={partner.name} logoUrl={partner.logoUrl} />
                            ))}
                            {/* Duplicate for seamless loop */}
                            {partners.map(partner => (
                                <PartnerLogo key={`${partner.id}-clone`} name={partner.name} logoUrl={partner.logoUrl} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
            {/* CTA for new partners */}
            <section className="bg-gray-900/30 py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Faça Parte da Mudança</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                        Sua empresa pode ser uma peça-chave na formação da próxima geração de talentos em tecnologia.
                    </p>
                    <div className="mt-12 grid md:grid-cols-3 gap-12">
                        <BenefitCard title="Talentos Diversos" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}>
                            Acesse um pipeline de talentos qualificados, com vivências e perspectivas únicas, prontos para inovar.
                        </BenefitCard>
                        <BenefitCard title="Marca Empregadora" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                            Fortaleça sua marca como uma empresa que investe em diversidade, inclusão e no futuro do país.
                        </BenefitCard>
                         <BenefitCard title="Impacto Social Real" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}>
                            Mude vidas de verdade, apoiando um projeto que gera oportunidades concretas de carreira e transformação social.
                        </BenefitCard>
                    </div>
                     <div className="mt-16">
                        <a 
                            href="mailto:parcerias@futuroon.com"
                            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
                        >
                            Quero ser um parceiro
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PartnershipsView;