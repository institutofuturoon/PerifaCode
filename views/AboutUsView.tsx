
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

// Novo componente baseado no design da imagem (Cards Pretos com Ícones)
const PrincipleCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="group relative flex flex-col items-center text-center h-full p-8 bg-[#121212] rounded-2xl border border-white/10 transition-all duration-300 hover:border-[#8a4add]/30 hover:shadow-2xl hover:shadow-[#8a4add]/10 hover:-translate-y-2">
        <div className="mb-6 p-4 rounded-full bg-white/5 text-white group-hover:text-[#c4b5fd] group-hover:bg-[#8a4add]/10 transition-colors">
            <div className="transform scale-125">
                {icon}
            </div>
        </div>
        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 group-hover:text-[#c4b5fd] transition-colors">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed font-medium">{description}</p>
    </div>
);

const Section: React.FC<{ children: React.ReactNode, className?: string, style?: React.CSSProperties }> = ({ children, className = '', style }) => (
    <section className={`py-16 md:py-24 relative z-10 ${className}`} style={style}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode, subtitle?: string }> = ({ children, subtitle }) => (
    <div className="text-center mb-16">
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
            <section className="py-20 md:py-32 text-center relative z-10 bg-grid-pattern">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="inline-block px-3 py-1.5 rounded-full bg-[#8a4add]/20 text-[#c4b5fd] text-xs font-bold">Institucional</div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight max-w-5xl mx-auto">
                        Somos o futuro que<br />
                        <span className="text-[#c4b5fd]">a gente cria.</span>
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                        O Instituto FuturoOn nasceu de um sonho: transformar a realidade da periferia através da tecnologia, educação e cultura. Somos mais que uma ONG, somos um movimento.
                    </p>
                </div>
            </section>
            
            {/* Nossos Princípios (Baseado na Imagem Enviada) */}
            <Section className="bg-black/20">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-black tracking-tight text-white">Nosso Manifesto</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4 mb-6"></div>
                    <p className="text-gray-300 leading-relaxed text-lg">
                        Não é apenas sobre código. É sobre construir pontes, quebrar barreiras e criar um ecossistema onde todos possam prosperar.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <PrincipleCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                        title="Jovens em Formação"
                        description="Cada participante que entra no FuturoOn está dando o primeiro passo para transformar sua vida por meio da tecnologia."
                    />
                    <PrincipleCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                        title="Histórias Reais"
                        description="Participantes estão criando sites, aplicativos e projetos bem sucedidos, demonstrando o potencial da tecnologia para mudar trajetórias profissionais."
                    />
                    <PrincipleCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>}
                        title="Rede em Crescimento"
                        description="Voluntários e parceiros estão colaborando para criar oportunidades e apoiar os participantes em sua jornada de descoberta tecnológica."
                    />
                    <PrincipleCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>}
                        title="Diversidade como Princípio"
                        description="Nossas turmas refletem a diversidade e riqueza de talentos do Brasil! Acreditamos que a inovação nasce de diferentes perspectivas."
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
