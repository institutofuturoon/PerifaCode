
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import SEO from '../components/SEO';
import Badge from '../components/Badge';

const Section: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <section className={`py-16 md:py-24 relative ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode, subtitle?: string }> = ({ children, subtitle }) => (
    <div className="text-center mb-16 md:mb-20">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
            {children}
        </h2>
        {subtitle && (
            <p className="mt-6 max-w-3xl mx-auto text-base md:text-lg text-gray-300 leading-relaxed px-4">
                {subtitle}
            </p>
        )}
        <div className="flex items-center justify-center gap-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-[#8a4add]"></div>
            <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-full"></div>
            <div className="w-2 h-2 rounded-full bg-[#f27983]"></div>
        </div>
    </div>
);

const StatCard: React.FC<{ value: string, label: string, color: string, icon?: React.ReactNode }> = ({ value, label, color, icon }) => (
    <div className="group relative bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 text-center hover:border-[#8a4add]/30 hover:bg-white/[0.07] transition-all duration-300">
        {icon && (
            <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#8a4add]/10 flex items-center justify-center text-[#8a4add]">
                    {icon}
                </div>
            </div>
        )}
        <p className={`text-4xl md:text-5xl lg:text-6xl font-black ${color} mb-2`}>{value}</p>
        <p className="text-sm md:text-base text-gray-300 font-medium">{label}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string, name: string, course: string, avatar: string }> = ({ quote, name, course }) => (
    <div className="group relative h-full">
        {/* Glow effect on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
        
        <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/10 h-full flex flex-col hover:border-[#8a4add]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-[#8a4add]/10">
            {/* Quote icon with gradient background */}
            <div className="mb-6 relative">
                <div className="absolute -left-2 -top-2 w-16 h-16 bg-gradient-to-br from-[#8a4add]/20 to-[#f27983]/20 rounded-full blur-xl"></div>
                <svg className="relative w-10 h-10 text-[#8a4add]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
            </div>
            
            {/* Quote text */}
            <p className="text-gray-200 leading-relaxed flex-grow text-sm md:text-base mb-8 italic font-light">
                "{quote}"
            </p>
            
            {/* Author info without photo */}
            <div className="pt-6 border-t border-white/10">
                <p className="font-bold text-white text-base md:text-lg mb-2">{name}</p>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#8a4add]"></div>
                    <p className="text-xs md:text-sm text-[#c4b5fd] font-medium">{course}</p>
                </div>
            </div>
        </div>
    </div>
);

const AnnualReportView: React.FC = () => {
    const navigate = useNavigate();
    const { annualReports } = useAppContext();
    
    // Logic to get the latest report
    const latestReport = useMemo(() => {
        if (annualReports.length === 0) return null;
        return [...annualReports].sort((a, b) => b.year - a.year)[0];
    }, [annualReports]);

    if (!latestReport) {
         return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                 <h1 className="text-3xl font-bold text-white">Relatório Anual</h1>
                 <p className="text-gray-400 mt-4">O relatório deste ano será publicado em breve.</p>
                 <button onClick={() => navigate('/')} className="mt-8 text-[#c4b5fd] hover:underline">Voltar para Home</button>
             </div>
         );
    }

    return (
        <>
            <SEO 
                title={`Relatório Anual ${latestReport.year} | Instituto FuturoOn`}
                description="Veja nosso impacto, conquistas e histórias de transformação através da tecnologia e educação."
            />
            
            {/* Hero Section */}
            <header className="relative py-20 md:py-32 lg:py-40 text-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[400px] bg-[#8a4add]/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Badge text={`Ano ${latestReport.year}`} />
                    
                    <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
                        Relatório Anual<br className="hidden sm:block" />
                        <span className="text-[#c4b5fd]">{latestReport.year}</span>
                    </h1>
                    
                    <p className="mt-6 max-w-3xl mx-auto text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed px-4">
                        Um ano de coragem, comunidade e código. Veja como, juntos, estamos reescrevendo o futuro da tecnologia na periferia.
                    </p>

                    {/* Quick Stats Preview */}
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
                        {latestReport.stats.slice(0, 4).map((stat, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/10">
                                <p className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</p>
                                <p className="text-xs md:text-sm text-gray-400 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Letter from Coordination */}
            <Section className="bg-gradient-to-b from-black/20 to-transparent relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#8a4add]/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f27983]/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="max-w-6xl mx-auto relative z-10">
                    <SectionTitle>
                        Carta da Coordenação
                    </SectionTitle>

                    <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12 items-start">
                        {/* Author Image with enhanced styling */}
                        <div className="flex justify-center md:justify-start">
                            <div className="relative group">
                                {/* Multiple glow layers */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add] to-[#f27983] rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                                <div className="absolute inset-0 bg-[#8a4add]/30 rounded-full blur-xl animate-pulse"></div>
                                
                                {/* Image container */}
                                <div className="relative">
                                    <img 
                                        src={latestReport.coordinationLetter.authorAvatarUrl} 
                                        alt={latestReport.coordinationLetter.authorName} 
                                        className="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-[#8a4add]/50 shadow-2xl group-hover:border-[#8a4add] transition-all duration-300"
                                    />
                                    
                                    {/* Decorative ring */}
                                    <div className="absolute inset-0 rounded-full border-2 border-[#f27983]/30 scale-110"></div>
                                </div>
                                
                                {/* Author info below image */}
                                <div className="mt-6 text-center">
                                    <p className="font-bold text-white text-lg md:text-xl mb-1">{latestReport.coordinationLetter.authorName}</p>
                                    <p className="text-sm md:text-base text-[#c4b5fd] font-medium">{latestReport.coordinationLetter.authorRole}</p>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <div className="w-1 h-1 rounded-full bg-[#8a4add]"></div>
                                        <p className="text-xs text-gray-400">FuturoOn</p>
                                        <div className="w-1 h-1 rounded-full bg-[#8a4add]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Letter Content with enhanced design */}
                        <div className="relative group">
                            {/* Glow effect on hover */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-3xl opacity-0 group-hover:opacity-10 blur transition-all duration-500"></div>
                            
                            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-white/10 group-hover:border-[#8a4add]/30 transition-all duration-300">
                                {/* Quote icon with enhanced styling */}
                                <div className="mb-8 relative">
                                    <div className="absolute -left-2 -top-2 w-20 h-20 bg-gradient-to-br from-[#8a4add]/20 to-[#f27983]/20 rounded-full blur-2xl"></div>
                                    <svg className="relative w-12 h-12 text-[#8a4add]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                </div>
                                
                                {/* Letter text with better typography */}
                                <div className="text-gray-200 leading-relaxed space-y-5 text-base md:text-lg whitespace-pre-wrap font-light">
                                    {latestReport.coordinationLetter.text}
                                </div>
                                
                                {/* Signature line */}
                                <div className="mt-10 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="h-px flex-1 bg-gradient-to-r from-[#8a4add] to-transparent"></div>
                                        <svg className="w-5 h-5 text-[#8a4add]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div className="h-px flex-1 bg-gradient-to-l from-[#f27983] to-transparent"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Impact in Numbers */}
            <Section className="bg-black/20">
                <SectionTitle subtitle="Nossos resultados refletem o poder da nossa comunidade e a dedicação de cada indivíduo envolvido.">
                    Nosso Impacto em Números
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {latestReport.stats.map((stat, i) => (
                        <StatCard 
                            key={i} 
                            value={stat.value} 
                            label={stat.label} 
                            color={stat.color}
                            icon={
                                i === 0 ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> :
                                i === 1 ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> :
                                i === 2 ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> :
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            }
                        />
                    ))}
                </div>
            </Section>

            {/* Testimonials */}
            {latestReport.testimonials.length > 0 && (
                <Section className="bg-gradient-to-b from-transparent via-black/10 to-black/20 relative overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#8a4add]/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f27983]/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <SectionTitle subtitle="Nada fala mais alto do que as vozes da nossa comunidade.">
                            Histórias que Inspiram
                        </SectionTitle>
                        
                        {/* Grid layout - 3 equal columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
                            {latestReport.testimonials.map((t, i) => (
                                <TestimonialCard 
                                    key={i}
                                    quote={t.quote}
                                    name={t.name}
                                    course={t.role}
                                    avatar={t.avatarUrl}
                                />
                            ))}
                        </div>
                    </div>
                </Section>
            )}

            {/* Call to Action */}
            <Section className="bg-gradient-to-b from-black/20 to-transparent">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8a4add]/10 to-[#f27983]/10 rounded-3xl blur-2xl"></div>
                        <div className="relative bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/10">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                                Faça Parte do Próximo Capítulo
                            </h2>
                            <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Sua doação ou parceria nos ajuda a escrever mais histórias de sucesso como estas. Juntos, podemos transformar ainda mais vidas.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button 
                                    onClick={() => navigate('/doar')} 
                                    className="px-8 py-4 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                                >
                                    Fazer uma Doação
                                </button>
                                <button 
                                    onClick={() => navigate('/parcerias')} 
                                    className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                                >
                                    Ser Parceiro
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Additional Info */}
            <Section>
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        <button 
                            onClick={() => navigate('/transparencia')}
                            className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-[#8a4add]/30 hover:bg-white/[0.07] transition-all duration-300 text-center group"
                        >
                            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#8a4add]/10 flex items-center justify-center text-[#8a4add] group-hover:bg-[#8a4add]/20 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-white mb-2">Transparência</h3>
                            <p className="text-sm text-gray-400">Veja todos os nossos relatórios</p>
                        </button>

                        <button 
                            onClick={() => navigate('/demonstrativo-financeiro')}
                            className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-[#f27983]/30 hover:bg-white/[0.07] transition-all duration-300 text-center group"
                        >
                            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#f27983]/10 flex items-center justify-center text-[#f27983] group-hover:bg-[#f27983]/20 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-white mb-2">Prestação de Contas</h3>
                            <p className="text-sm text-gray-400">Detalhamento financeiro</p>
                        </button>

                        <button 
                            onClick={() => navigate('/sobre')}
                            className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-[#c4b5fd]/30 hover:bg-white/[0.07] transition-all duration-300 text-center group"
                        >
                            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#c4b5fd]/10 flex items-center justify-center text-[#c4b5fd] group-hover:bg-[#c4b5fd]/20 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-white mb-2">Quem Somos</h3>
                            <p className="text-sm text-gray-400">Nossa história e missão</p>
                        </button>
                    </div>
                </div>
            </Section>
        </>
    );
};

export default AnnualReportView;
