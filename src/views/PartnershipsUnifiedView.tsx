import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Badge from '../components/Badge';
import FAQ from '../components/FAQ';
import { useOngData } from '../hooks/useOngData';

// Componente de Card de Parceiro
const PartnerCard: React.FC<{
    name: string;
    description: string;
    sector: string;
    logo: string;
    size: 'large' | 'medium' | 'small';
    onClick?: () => void;
}> = ({ name, description, sector, logo, size, onClick }) => {
    const sizeClasses = {
        large: 'md:col-span-2 p-8',
        medium: 'p-6',
        small: 'p-4'
    };

    const logoSizes = {
        large: 'h-16 w-auto',
        medium: 'h-12 w-auto',
        small: 'h-8 w-auto'
    };

    return (
        <div
            onClick={onClick}
            className={`group relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 hover:border-[#8a4add]/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#8a4add]/20 ${sizeClasses[size]} ${onClick ? 'cursor-pointer' : ''}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/0 to-[#8a4add]/0 group-hover:from-[#8a4add]/5 group-hover:to-transparent rounded-2xl transition-all duration-300"></div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="bg-white p-3 rounded-xl shadow-lg">
                        <img src={logo} alt={name} className={`${logoSizes[size]} object-contain`} />
                    </div>
                    {size === 'large' && (
                        <span className="px-3 py-1 rounded-full bg-[#8a4add]/20 text-[#c4b5fd] text-xs font-bold uppercase tracking-wider border border-[#8a4add]/30">
                            Destaque
                        </span>
                    )}
                </div>

                <h3 className={`font-black text-white mb-2 group-hover:text-[#c4b5fd] transition-colors ${size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-lg' : 'text-base'}`}>
                    {name}
                </h3>

                {size !== 'small' && (
                    <>
                        <span className="inline-block px-2 py-1 rounded-full bg-white/5 text-gray-400 text-xs mb-3">
                            {sector}
                        </span>
                        <p className={`text-gray-400 leading-relaxed ${size === 'large' ? 'text-sm' : 'text-xs'} ${size === 'medium' ? 'line-clamp-2' : 'line-clamp-3'}`}>
                            {description}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

// Componente de Estatística
const StatCard: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 hover:border-[#8a4add]/30 transition-all duration-300 hover:-translate-y-1">
        <div className="text-[#8a4add] mb-3 opacity-80">{icon}</div>
        <p className="text-3xl md:text-4xl font-black text-white mb-1">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
    </div>
);

// Componente de Benefício
const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-[#121212] p-6 md:p-8 rounded-2xl border border-white/10 hover:border-[#8a4add]/50 transition-all duration-300 hover:-translate-y-2 group">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#8a4add]/20 to-[#8a4add]/5 rounded-2xl flex items-center justify-center text-2xl mb-4 md:mb-6 text-[#c4b5fd] group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 group-hover:text-[#c4b5fd] transition-colors">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
);

// Componente de Plano de Parceria
const PlanCard: React.FC<{
    title: string;
    description: string;
    features: string[];
    isFeatured?: boolean;
    ctaText: string;
    ctaAction: () => void;
}> = ({ title, description, features, isFeatured, ctaText, ctaAction }) => (
    <div className={`relative flex flex-col p-6 md:p-8 rounded-3xl border transition-all duration-300 h-full ${isFeatured ? 'bg-white/5 border-[#8a4add] shadow-[0_0_40px_-10px_rgba(138,74,221,0.3)] md:scale-105 z-10' : 'bg-[#121212] border-white/10 hover:border-white/20'}`}>
        {isFeatured && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white text-xs font-bold uppercase tracking-widest py-2 px-4 rounded-full shadow-lg">
                Mais Popular
            </div>
        )}

        <div className="mb-6 text-center border-b border-white/5 pb-6">
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>

        <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8 flex-grow">
            {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                    <div className={`mt-0.5 p-0.5 rounded-full flex-shrink-0 ${isFeatured ? 'bg-[#8a4add] text-white' : 'bg-gray-800 text-gray-400'}`}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="leading-tight">{feature}</span>
                </li>
            ))}
        </ul>

        <button
            onClick={ctaAction}
            className={`w-full py-3 md:py-4 rounded-xl text-sm font-bold text-center transition-all duration-300 ${isFeatured ? 'bg-white text-black hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
            {ctaText}
        </button>
    </div>
);

// Componente de Depoimento
const TestimonialCard: React.FC<{
    name: string;
    role: string;
    company: string;
    text: string;
    photo: string;
}> = ({ name, role, company, text, photo }) => (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-6 md:p-8 hover:border-[#8a4add]/30 transition-all duration-300">
        <div className="flex items-center gap-4 mb-6">
            <img src={photo} alt={name} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-[#8a4add]/30" />
            <div>
                <p className="font-bold text-white text-sm md:text-base">{name}</p>
                <p className="text-xs md:text-sm text-gray-400">{role}, {company}</p>
            </div>
        </div>
        <p className="text-gray-300 text-sm md:text-base leading-relaxed italic">"{text}"</p>
    </div>
);

// Componente Principal
const PartnershipsUnifiedView: React.FC = () => {
    const navigate = useNavigate();
    const { partners, statistics, contact, testimonials, faq } = useOngData();

    // Filtrar parceiros ativos
    const activePartners = partners?.filter(p => p.status === 'ativo') || [];

    // Dividir parceiros por tamanho para layout responsivo
    const featuredPartners = activePartners.slice(0, 2);
    const mediumPartners = activePartners.slice(2, 8);
    const smallPartners = activePartners.slice(8);

    // Depoimentos de parceiros
    const partnerTestimonials = testimonials?.partners || [];

    return (
        <>
            <SEO
                title="Parcerias & Apoiadores | Instituto FuturoOn"
                description="Conheça nossos parceiros e descubra como sua empresa pode transformar vidas através da tecnologia. Modelos de parceria flexíveis e impacto real."
                keywords={['parceria corporativa', 'ESG', 'apoiadores', 'patrocinadores', 'impacto social', 'diversidade', 'inclusão digital']}
            />

            <div className="bg-[#09090B] min-h-screen">
                {/* Hero Section */}
                <section className="relative py-16 md:py-32 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#8a4add]/10 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <Badge text="Parcerias & Apoiadores" />

                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-4 md:mb-6 max-w-5xl mx-auto">
                            Juntos, transformamos<br className="hidden sm:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">vidas através da tech</span>
                        </h1>

                        <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 md:mb-10 px-4">
                            Conheça as organizações que acreditam no potencial da periferia e descubra como sua empresa pode fazer parte dessa transformação.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                            <a
                                href={`mailto:${contact?.emails?.partnerships || contact?.emails?.general}?subject=Quero ser Parceiro`}
                                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:opacity-90 transition-all transform hover:scale-105 text-sm md:text-base"
                            >
                                Quero ser Parceiro
                            </a>
                            <button
                                onClick={() => document.getElementById('partners')?.scrollIntoView({ behavior: 'smooth' })}
                                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-sm md:text-base"
                            >
                                Ver Nossos Parceiros
                            </button>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                {statistics && (
                    <section className="py-12 md:py-16 bg-black/20 border-y border-white/5">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
                                <StatCard
                                    icon={<svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                    value={`${statistics.peopleImpacted}+`}
                                    label="Vidas Impactadas"
                                />
                                <StatCard
                                    icon={<svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                    value={`${statistics.employmentRate}%`}
                                    label="Empregabilidade"
                                />
                                <StatCard
                                    icon={<svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                                    value={`${statistics.activePartners}+`}
                                    label="Parceiros Ativos"
                                />
                                <StatCard
                                    icon={<svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                    value={`${statistics.mentorshipHours}+`}
                                    label="Horas de Mentoria"
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Nossos Parceiros Section */}
                <section id="partners" className="py-16 md:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                                Nossos Parceiros
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                                Organizações que acreditam no poder transformador da educação tecnológica
                            </p>
                            <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-6"></div>
                        </div>

                        {/* Featured Partners (Large Cards) */}
                        {featuredPartners.length > 0 && (
                            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8 max-w-6xl mx-auto">
                                {featuredPartners.map(partner => (
                                    <PartnerCard
                                        key={partner.id}
                                        name={partner.name}
                                        description={partner.description}
                                        sector={partner.sector}
                                        logo={partner.logo}
                                        size="large"
                                        onClick={() => navigate(`/apoiador/${partner.id}`)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Medium Partners */}
                        {mediumPartners.length > 0 && (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 max-w-6xl mx-auto">
                                {mediumPartners.map(partner => (
                                    <PartnerCard
                                        key={partner.id}
                                        name={partner.name}
                                        description={partner.description}
                                        sector={partner.sector}
                                        logo={partner.logo}
                                        size="medium"
                                        onClick={() => navigate(`/apoiador/${partner.id}`)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Small Partners (Logo Grid) */}
                        {smallPartners.length > 0 && (
                            <div className="max-w-6xl mx-auto">
                                <p className="text-center text-gray-500 text-xs md:text-sm uppercase tracking-widest mb-6 md:mb-8 font-bold">
                                    Rede de Apoio & Colaboradores
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {smallPartners.map(partner => (
                                        <PartnerCard
                                            key={partner.id}
                                            name={partner.name}
                                            description={partner.description}
                                            sector={partner.sector}
                                            logo={partner.logo}
                                            size="small"
                                            onClick={() => navigate(`/apoiador/${partner.id}`)}
                                        />
                                    ))}

                                    {/* "Seja Parceiro" Card */}
                                    <a
                                        href={`mailto:${contact?.emails?.partnerships || contact?.emails?.general}`}
                                        className="group border border-dashed border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-white/5 hover:border-[#8a4add]/50 transition-all"
                                    >
                                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#c4b5fd] group-hover:bg-[#8a4add]/20 mb-2 transition-colors text-lg md:text-xl">
                                            +
                                        </div>
                                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase text-center">Sua Marca</p>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Por que Parceria? Section */}
                <section className="py-16 md:py-24 bg-black/20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                                Por que Parceria?
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                                Benefícios reais para sua empresa e impacto social mensurável
                            </p>
                            <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-6"></div>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                            <BenefitCard
                                icon={<svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                title="Acesso a Talentos"
                                description="Banco exclusivo de profissionais qualificados em tecnologia, prontos para o mercado de trabalho."
                            />
                            <BenefitCard
                                icon={<svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                                title="Fortalecimento ESG"
                                description="Impacto social real e mensurável que fortalece os pilares de responsabilidade social da sua empresa."
                            />
                            <BenefitCard
                                icon={<svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                title="Diversidade Real"
                                description="Contribua para um mercado de tecnologia mais diverso e inclusivo, com talentos da periferia."
                            />
                            <BenefitCard
                                icon={<svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                title="Transparência Total"
                                description="Prestação de contas detalhada e recibos de todas as doações para sua segurança e compliance."
                            />
                            <BenefitCard
                                icon={<svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>}
                                title="Visibilidade de Marca"
                                description="Exposição em nossos canais, eventos e materiais de comunicação para milhares de pessoas."
                            />
                            <BenefitCard
                                icon={<svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                                title="Relatórios de Impacto"
                                description="Acompanhamento detalhado e transparente do impacto gerado pela sua parceria."
                            />
                        </div>
                    </div>
                </section>

                {/* Modelos de Parceria Section */}
                <section id="models" className="py-16 md:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                                Modelos de Parceria
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                                Escolha o modelo que melhor se encaixa com os objetivos da sua empresa
                            </p>
                            <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-6"></div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                            <PlanCard
                                title="Parceria Financeira"
                                description="Apoio financeiro direto para manutenção e expansão dos programas"
                                features={[
                                    "Doação mensal ou anual",
                                    "Logo em materiais de comunicação",
                                    "Relatórios trimestrais de impacto",
                                    "Certificado de parceria",
                                    "Recibos para comprovação ESG"
                                ]}
                                ctaText="Quero Apoiar"
                                ctaAction={() => window.location.href = `mailto:${contact?.emails?.partnerships || contact?.emails?.general}?subject=Parceria Financeira`}
                            />

                            <PlanCard
                                title="Parceria Estratégica"
                                description="Colaboração profunda com acesso a talentos e co-criação de conteúdo"
                                features={[
                                    "Tudo da Parceria Financeira",
                                    "Acesso antecipado aos talentos",
                                    "Voluntariado Corporativo (Mentorias)",
                                    "Co-criação de Hackathons/Desafios",
                                    "Palestras de Impacto na sua empresa",
                                    "Employer Branding em nossos eventos"
                                ]}
                                isFeatured={true}
                                ctaText="Quero Ser Estratégico"
                                ctaAction={() => window.location.href = `mailto:${contact?.emails?.partnerships || contact?.emails?.general}?subject=Parceria Estratégica`}
                            />

                            <PlanCard
                                title="Parceria de Produto"
                                description="Doação de equipamentos, softwares ou serviços essenciais"
                                features={[
                                    "Doação de notebooks e equipamentos",
                                    "Licenças de software",
                                    "Serviços de cloud/hospedagem",
                                    "Ferramentas de desenvolvimento",
                                    "Logo em materiais de comunicação",
                                    "Certificado de parceria"
                                ]}
                                ctaText="Quero Doar Produtos"
                                ctaAction={() => window.location.href = `mailto:${contact?.emails?.partnerships || contact?.emails?.general}?subject=Parceria de Produto`}
                            />
                        </div>

                        <div className="mt-12 md:mt-16 text-center">
                            <p className="text-gray-400 mb-6 text-sm md:text-base">
                                Não se encaixa em nenhum modelo? Vamos conversar e criar algo personalizado!
                            </p>
                            <a
                                href={`mailto:${contact?.emails?.partnerships || contact?.emails?.general}?subject=Parceria Personalizada`}
                                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white font-semibold text-sm md:text-base"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Conversar sobre Parceria Personalizada
                            </a>
                        </div>
                    </div>
                </section>

                {/* Depoimentos Section */}
                {partnerTestimonials.length > 0 && (
                    <section className="py-16 md:py-24 bg-black/20">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12 md:mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                                    O que Dizem Nossos Parceiros
                                </h2>
                                <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                                    Histórias reais de empresas que transformam vidas conosco
                                </p>
                                <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-6"></div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
                                {partnerTestimonials.map((testimonial, idx) => (
                                    <TestimonialCard
                                        key={idx}
                                        name={testimonial.name}
                                        role={testimonial.role}
                                        company={testimonial.company}
                                        text={testimonial.text}
                                        photo={testimonial.photo}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* FAQ Section */}
                {faq && faq.length > 0 && (
                    <section className="py-16 md:py-24">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <FAQ
                                items={faq.filter(item => item.category === 'parcerias')}
                                title="Perguntas Frequentes"
                                subtitle="Tire suas dúvidas sobre como se tornar um parceiro"
                            />
                        </div>
                    </section>
                )}

                {/* CTA Final */}
                <section className="py-16 md:py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8a4add]/10 to-transparent pointer-events-none"></div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="max-w-4xl mx-auto">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#8a4add]/10 to-[#f27983]/10 rounded-3xl blur-2xl"></div>
                                <div className="relative bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/10 text-center">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 md:mb-6">
                                        Pronto para Transformar Vidas?
                                    </h2>
                                    <p className="text-base md:text-lg text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                                        Junte-se a nós nessa missão de democratizar o acesso à tecnologia e criar oportunidades reais para jovens da periferia.
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <a
                                            href={`mailto:${contact?.emails?.partnerships || contact?.emails?.general}?subject=Quero ser Parceiro do FuturoOn`}
                                            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:opacity-90 transition-all transform hover:scale-105 text-sm md:text-base"
                                        >
                                            Torne-se um Parceiro
                                        </a>
                                        <button
                                            onClick={() => navigate('/doar')}
                                            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm md:text-base"
                                        >
                                            Fazer Doação Pontual
                                        </button>
                                    </div>

                                    {/* Contact Info */}
                                    {contact && (
                                        <div className="mt-8 md:mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 text-sm text-gray-400">
                                            <a href={`mailto:${contact.emails.partnerships || contact.emails.general}`} className="flex items-center gap-2 hover:text-white transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {contact.emails.partnerships || contact.emails.general}
                                            </a>
                                            <span className="hidden sm:block text-white/20">•</span>
                                            <a href={`tel:${contact.phones.main.replace(/\D/g, '')}`} className="flex items-center gap-2 hover:text-white transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                {contact.phones.main}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default PartnershipsUnifiedView;
