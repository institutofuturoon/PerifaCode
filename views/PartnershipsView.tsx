
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const PartnerLogo: React.FC<{ name: string; logoUrl: string }> = ({ name, logoUrl }) => (
    <div className="flex-shrink-0 w-[180px] h-[80px] bg-white/5 border border-white/5 rounded-xl flex items-center justify-center p-4 grayscale hover:grayscale-0 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer group">
        <img 
            src={logoUrl} 
            alt={name} 
            className="max-w-full max-h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-500"
        />
    </div>
);

const StatItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="text-center px-6 border-r border-white/10 last:border-0">
        <p className="text-3xl md:text-4xl font-black text-white mb-1">{value}</p>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">{label}</p>
    </div>
);

const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-[#121212] p-8 rounded-3xl border border-white/10 hover:border-[#8a4add]/50 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8a4add]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
        <div className="w-14 h-14 bg-gradient-to-br from-[#18181b] to-[#09090b] border border-white/10 rounded-2xl flex items-center justify-center text-2xl mb-6 text-[#c4b5fd] shadow-lg group-hover:text-white group-hover:border-[#8a4add]/50 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 relative z-10">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed relative z-10">{description}</p>
    </div>
);

const PlanCard: React.FC<{ 
    title: string; 
    price?: string; 
    features: string[]; 
    isFeatured?: boolean; 
    ctaText: string; 
    ctaLink: string; 
}> = ({ title, price, features, isFeatured, ctaText, ctaLink }) => (
    <div className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 h-full ${isFeatured ? 'bg-white/5 border-[#8a4add] shadow-[0_0_40px_-10px_rgba(138,74,221,0.3)] transform md:-translate-y-4 z-10' : 'bg-[#121212] border-white/10 hover:border-white/20'}`}>
        {isFeatured && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
                Recomendado
            </div>
        )}
        
        <div className="mb-8 text-center">
            <h3 className={`text-xl font-bold mb-2 ${isFeatured ? 'text-white' : 'text-gray-300'}`}>{title}</h3>
            {price && <p className="text-sm text-gray-500">{price}</p>}
        </div>

        <ul className="space-y-4 mb-8 flex-grow">
            {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                    <div className={`mt-0.5 p-0.5 rounded-full ${isFeatured ? 'bg-[#8a4add] text-white' : 'bg-gray-800 text-gray-400'}`}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {feature}
                </li>
            ))}
        </ul>

        <a 
            href={ctaLink}
            className={`w-full py-4 rounded-xl text-sm font-bold text-center transition-all duration-300 ${isFeatured ? 'bg-white text-black hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
            {ctaText}
        </a>
    </div>
);

const PartnershipsView: React.FC = () => {
    const { partners } = useAppContext();
    const navigate = useNavigate();

    // Ensure we have enough logos to make the marquee look good
    const marqueePartners = [...partners, ...partners, ...partners].slice(0, 12);

    return (
        <div className="bg-[#09090B] min-h-screen overflow-hidden">
            <SEO 
                title="Seja um Parceiro | Instituto FuturoOn"
                description="Conecte sua empresa à próxima geração de líderes em tecnologia. Descubra como apoiar a formação de talentos da periferia e impulsionar seu ESG."
                keywords={['parceria corporativa', 'ESG', 'recrutamento tech', 'impacto social', 'investimento social privado', 'diversidade e inclusão', 'responsabilidade social']}
            />
            
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
                {/* Abstract Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#8a4add]/20 rounded-[100%] blur-[120px] -z-10 pointer-events-none mix-blend-screen"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-30 -z-10"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8a4add]/10 border border-[#8a4add]/20 mb-8 animate-fade-in backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8a4add] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8a4add]"></span>
                        </span>
                        <span className="text-xs font-bold text-[#c4b5fd] uppercase tracking-wide">B2B & Impacto Social</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6 max-w-5xl mx-auto">
                        Conecte sua marca à próxima geração de <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] via-[#c4b5fd] to-[#f27983]">Líderes em Tecnologia.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
                        Transforme sua estratégia de ESG e Talent Acquisition apoiando a formação de desenvolvedores de alta performance vindos da periferia.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                            href="mailto:parcerias@institutofuturoon.org"
                            className="w-full sm:w-auto px-8 py-4 bg-[#8a4add] text-white font-bold rounded-xl hover:bg-[#7c3aed] transition-all transform hover:scale-105 shadow-[0_0_30px_-5px_rgba(138,74,221,0.5)]"
                        >
                            Quero ser Parceiro
                        </a>
                        <button 
                            onClick={() => document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
                        >
                            Ver Modelos de Apoio
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Strip */}
            <section className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <StatItem value="+300" label="Talentos Formados" />
                        <StatItem value="92%" label="Empregabilidade" />
                        <StatItem value="+50" label="Empresas Parceiras" />
                        <StatItem value="100%" label="Diversidade" />
                    </div>
                </div>
            </section>

            {/* Infinite Marquee Partners */}
            <section className="py-12 overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#09090B] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#09090B] to-transparent z-10 pointer-events-none"></div>
                
                <div className="container mx-auto px-4 mb-8 text-center">
                     <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Empresas que confiam no nosso trabalho</p>
                </div>

                <div className="marquee">
                    <div className="marquee-content gap-8 py-4">
                        {marqueePartners.map((p, i) => (
                            <PartnerLogo key={`${p.id}-${i}`} name={p.name} logoUrl={p.logoUrl} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Value Proposition Grid */}
            <section className="py-24 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Mais que doação, <br/>um investimento estratégico.</h2>
                    <p className="text-gray-400 text-lg">
                        Alinhe propósito com performance. Veja o ROI de apoiar o Instituto FuturoOn.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <BenefitCard 
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        title="Talentos Qualificados"
                        description="Acesso direto a um pool de desenvolvedores júnior formados com tecnologias modernas (React, Node, Python) e prontos para o mercado."
                    />
                    <BenefitCard 
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        title="Metas de ESG"
                        description="Cumpra suas metas de diversidade e impacto social com métricas claras e relatórios transparentes de transformação de vidas."
                    />
                    <BenefitCard 
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        title="Brand Awareness"
                        description="Posicione sua marca como líder em inovação social. Ganhe visibilidade em nossos eventos, hackathons e canais digitais."
                    />
                </div>
            </section>

            {/* Engagement Models */}
            <section id="models" className="py-24 bg-[#121212] relative border-t border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-grid-pattern opacity-10 pointer-events-none"></div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Escolha como impactar</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Modelos flexíveis para empresas de todos os tamanhos.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                        <PlanCard 
                            title="Apoiador Pontual"
                            ctaText="Fazer Doação"
                            ctaLink="/donate"
                            features={[
                                "Doação financeira livre",
                                "Doação de equipamentos",
                                "Voluntariado corporativo",
                                "Selo de Apoiador Digital"
                            ]}
                        />
                        <PlanCard 
                            title="Mantenedor Educacional"
                            isFeatured={true}
                            ctaText="Tornar-se Mantenedor"
                            ctaLink="mailto:parcerias@institutofuturoon.org?subject=Quero ser Mantenedor"
                            features={[
                                "Adoção de Turma (Naming Rights)",
                                "Logo em destaque no site e camisetas",
                                "Relatório de Impacto Trimestral",
                                "Palestra exclusiva na sua empresa",
                                "Acesso prioritário a contratações"
                            ]}
                        />
                        <PlanCard 
                            title="Hiring Partner"
                            ctaText="Contratar Talentos"
                            ctaLink="mailto:parcerias@institutofuturoon.org?subject=Quero Contratar Talentos"
                            features={[
                                "Acesso ao banco de talentos",
                                "Job Board exclusivo",
                                "Participação em Feiras de Carreira",
                                "Workshops técnicos com alunos",
                                "Isenção de taxas de placement"
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-[#09090B] to-[#1a1033]"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
                        Sua empresa está pronta para <br/> o futuro?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Agende uma conversa com nosso time de parcerias e descubra como podemos construir juntos.
                    </p>
                    <a 
                        href="mailto:parcerias@institutofuturoon.org"
                        className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] text-lg"
                    >
                        Agendar Reunião
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                </div>
            </section>
        </div>
    );
};

export default PartnershipsView;
