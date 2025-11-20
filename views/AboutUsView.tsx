
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActionCard from '../components/ActionCard';
import SEO from '../components/SEO';

const ImpactCard: React.FC<{ value: string, label: string, color: string }> = ({ value, label, color }) => (
    <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center transform transition-transform hover:-translate-y-1">
        <p className={`text-5xl font-black ${color}`}>{value}</p>
        <p className="mt-2 text-gray-300">{label}</p>
    </div>
);


const InfoCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="group relative rounded-2xl bg-white/10 p-px transition-all duration-300 hover:-translate-y-2 hover:bg-gradient-to-br from-[#8a4add] to-[#f27983] shadow-lg hover:shadow-[#8a4add]/20">
        <div className="relative flex h-full flex-col items-center text-center rounded-[15px] bg-[#09090B]/90 p-8 backdrop-blur-sm">
            <div className="mb-6 flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#8a4add] text-white shadow-lg shadow-[#8a4add]/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[#8a4add]/40">
                    {icon}
                </div>
            </div>
            <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#c4b5fd]">{title}</h3>
            <p className="mt-2 flex-grow text-base text-gray-400">{description}</p>
        </div>
    </div>
);

const Section: React.FC<{ children: React.ReactNode, className?: string, style?: React.CSSProperties }> = ({ children, className = '', style }) => (
    <section className={`py-16 md:py-20 relative z-10 ${className}`} style={style}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode, subtitle?: string }> = ({ children, subtitle }) => (
    <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">{children}</h2>
        {subtitle && <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">{subtitle}</p>}
        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
    </div>
);

const TimelineItem: React.FC<{ year: string; title: string; description: string; isLeft: boolean; }> = ({ year, title, description, isLeft }) => (
    <div className={`flex items-center w-full my-6 ${isLeft ? 'justify-start' : 'justify-end'}`}>
        <div className={`w-full md:w-1/2 ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm font-semibold text-[#c4b5fd]">{year}</p>
                <h3 className="mt-1 font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-gray-400">{description}</p>
            </div>
        </div>
    </div>
);

const AboutUsView: React.FC = () => {
    const navigate = useNavigate();

    const timelineData = [
        { year: '2021', title: 'Fundação do FuturoON', description: 'Iniciativa de Thais Santana no Complexo da Coruja, São Gonçalo, com objetivo de conectar a periferia à tecnologia, cultura e cidadania.' },
        { year: '2022', title: 'Primeiras Turmas e Oficinas', description: 'Início das primeiras turmas de programação, robótica e tecnologia para jovens da comunidade, com atuação presencial e online.' },
        { year: '2023', title: 'Expansão e Grandes Eventos', description: 'Certificação de alunos na UFF em parceria com a IN Junior, realização da 1ª Game Jam em São Gonçalo, e expansão da atuação para cultura e e-sports com passeios e visitas.' },
        { year: '2024', title: 'Reconhecimento e Foco no Mercado', description: 'Reconhecimento com menção honrosa na Câmara Municipal de Niterói e lançamento de novas oficinas de design, comunicação digital e empreendedorismo, incluindo mães e jovens.' },
        { year: '2025', title: 'Consolidação e Expansão Nacional', description: 'Consolidação como Instituto de Tecnologia com mais de 300 jovens formados, 50 turmas e expansão da atuação para eventos nacionais, como atividades em Brasília.' },
    ];

    return (
        <>
            <SEO 
                title="Quem Somos" 
                description="Conheça o Instituto FuturoOn: nossa história, missão e como estamos transformando a realidade de jovens da periferia através da tecnologia."
            />
            {/* Hero Section */}
            <section className="py-32 md:py-40 text-center relative z-10 bg-grid-pattern">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                        Somos o futuro que<br />
                        <span className="text-[#c4b5fd]">a gente cria.</span>
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                        O Instituto FuturoOn nasceu de um sonho: transformar a realidade da periferia através da tecnologia, educação e cultura. Somos mais que uma ONG, somos um movimento.
                    </p>
                </div>
            </section>
            
            {/* Quem Somos & MVV Section */}
            <Section className="bg-black/20">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-black tracking-tight text-white">Nossa História</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4 mb-6"></div>
                    <p className="text-gray-300 leading-relaxed text-lg">
                        Fundado por Thais Santana no Complexo da Coruja, em São Gonçalo, o FuturoON é uma organização sem fins lucrativos dedicada à inclusão digital, ao fortalecimento da cidadania e à promoção do potencial dos jovens periféricos.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <InfoCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        title="Nossa Missão"
                        description="Promover acesso à tecnologia e cidadania, oferecendo capacitação em tecnologia, cultura e e-sports, e construindo pontes para o mercado de trabalho."
                    />
                    <InfoCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                        title="Nossos Objetivos"
                        description="Oferecer cursos gratuitos, desenvolver habilidades profissionais e socioemocionais, e promover inclusão e equidade social para impactar nossa comunidade."
                    />
                    <InfoCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>}
                        title="O Que Fazemos"
                        description="Aplicamos metodologias ativas em oficinas de programação, robótica, design e empreendedorismo, com suporte emocional e formação cidadã."
                    />
                </div>
            </Section>
            
            {/* Impact Section */}
            <Section className="bg-black/20" style={{backgroundImage: 'radial-gradient(circle at center, #8a4add10, transparent 60%)'}}>
                <SectionTitle subtitle="Somos vistos como uma 'segunda casa', transformando vidas e criando novas oportunidades.">
                    Nosso Impacto em Números
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                    <ImpactCard value="+300" label="Jovens Formados" color="text-sky-400" />
                    <ImpactCard value="+50" label="Turmas Realizadas" color="text-green-400" />
                    <ImpactCard value="+14" label="Voluntários Ativos" color="text-pink-400" />
                    <ImpactCard value="0" label="Apoio Governamental" color="text-amber-400" />
                </div>
            </Section>

            {/* Timeline Section */}
            <Section>
                <SectionTitle>Nossa Jornada de Conquistas</SectionTitle>
                <div className="relative">
                    {/* Vertical line */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 h-full w-0.5 bg-white/10"></div>
                    {timelineData.map((item, index) => (
                        <div key={index} className="relative">
                            {/* Dot on the timeline */}
                            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center justify-center w-5 h-5 rounded-full bg-[#8a4add] border-2 border-black/50"></div>
                            <TimelineItem {...item} isLeft={index % 2 === 0} />
                        </div>
                    ))}
                </div>
            </Section>

            {/* Transparência Total Section */}
            <Section>
                <SectionTitle subtitle="Acreditamos que a confiança é construída com clareza. Acompanhe de perto como cada contribuição se transforma em oportunidade.">
                    Transparência Total
                </SectionTitle>
                 <div className="max-w-2xl mx-auto space-y-4">
                    <button onClick={() => navigate('/annual-report')} className="w-full text-left group flex items-center justify-between p-6 bg-white/5 rounded-lg border border-white/10 hover:border-[#8a4add]/50 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <span className="text-[#8a4add]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </span>
                            <span className="text-lg font-semibold text-white">Relatório Anual 2024</span>
                        </div>
                        <span className="text-gray-400 transform transition-transform group-hover:translate-x-1 group-hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </span>
                    </button>
                    <button onClick={() => navigate('/financial-statement')} className="w-full text-left group flex items-center justify-between p-6 bg-white/5 rounded-lg border border-white/10 hover:border-[#8a4add]/50 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <span className="text-[#8a4add]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </span>
                            <span className="text-lg font-semibold text-white">Prestação de Contas</span>
                        </div>
                        <span className="text-gray-400 transform transition-transform group-hover:translate-x-1 group-hover:text-white">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </span>
                    </button>
                </div>
            </Section>


            {/* Team & Donate CTA Section */}
            <Section className="bg-black/20">
               <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="grid md:grid-cols-2 gap-8">
                        <ActionCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            title="Conheça Nossa Tropa"
                            description="Veja quem são os rostos e corações por trás do nosso corre diário."
                            buttonText="Ver equipe"
                            buttonOnClick={() => navigate('/team')}
                            buttonVariant="secondary"
                        />
                        <ActionCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>}
                            title="Apoie a Causa"
                            description="Somos uma ONG e cada centavo é investido na nossa missão. Faça parte dessa transformação."
                            buttonText="Faça uma doação"
                            buttonOnClick={() => navigate('/donate')}
                            buttonVariant="primary"
                        />
                     </div>
                </div>
            </Section>
        </>
    );
};

export default AboutUsView;
