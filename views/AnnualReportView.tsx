
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';

// Reusable components for this view
const Section: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <section className={`py-16 md:py-20 relative z-10 ${className}`}>
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

const StatCard: React.FC<{ value: string, label: string, color: string }> = ({ value, label, color }) => (
    <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center transform hover:-translate-y-1 transition-transform">
        <p className={`text-5xl font-black ${color}`}>{value}</p>
        <p className="mt-2 text-gray-300">{label}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string, name: string, course: string, avatar: string }> = ({ quote, name, course, avatar }) => (
    <div className="bg-white/5 p-8 rounded-lg border border-white/10 h-full flex flex-col">
        <p className="text-gray-300 italic flex-grow">"{quote}"</p>
        <div className="mt-6 flex items-center gap-4">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
            <div>
                <p className="font-bold text-white">{name}</p>
                <p className="text-sm text-[#8a4add]">{course}</p>
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
            {/* Hero Section */}
            <header className="py-32 md:py-40 text-center relative z-10 bg-grid-pattern">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <p className="font-semibold text-[#c4b5fd] uppercase tracking-widest">FuturoOn</p>
                    <h1 className="mt-4 text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                        Relatório Anual {latestReport.year}
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                        Um ano de coragem, comunidade e código. Veja como, juntos, estamos reescrevendo o futuro da tecnologia na periferia.
                    </p>
                </div>
            </header>

            {/* Letter from Coordination */}
            <Section className="bg-black/20">
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12 items-start">
                    <div className="md:col-span-2">
                        <h2 className="text-3xl font-bold text-white mb-4">Carta da Coordenação</h2>
                        <div className="prose prose-invert text-gray-300 leading-relaxed space-y-4 whitespace-pre-wrap">
                            <p>{latestReport.coordinationLetter.text}</p>
                            <div className="pt-4">
                                <p className="font-bold text-white">{latestReport.coordinationLetter.authorName}</p>
                                <p className="text-sm text-gray-400">{latestReport.coordinationLetter.authorRole}, FuturoOn</p>
                            </div>
                        </div>
                    </div>
                     <div className="flex flex-col items-center gap-8">
                        {/* Author Image */}
                        <div className="text-center">
                            <img src={latestReport.coordinationLetter.authorAvatarUrl} alt={latestReport.coordinationLetter.authorName} className="w-40 h-40 rounded-full object-cover border-4 border-[#8a4add] mx-auto shadow-2xl shadow-[#8a4add]/20" />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Impact in Numbers */}
            <Section className="bg-black/20">
                <SectionTitle subtitle="Nossos resultados refletem o poder da nossa comunidade e a dedicação de cada indivíduo envolvido.">
                    Nosso Impacto em Números
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {latestReport.stats.map((stat, i) => (
                        <StatCard key={i} value={stat.value} label={stat.label} color={stat.color} />
                    ))}
                </div>
            </Section>

            {/* Testimonials */}
            {latestReport.testimonials.length > 0 && (
                <Section className="bg-black/20">
                    <SectionTitle subtitle="Nada fala mais alto do que as vozes da nossa comunidade.">
                        Histórias que Inspiram
                    </SectionTitle>
                    <div className="grid md:grid-cols-2 gap-8">
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
                </Section>
            )}

            {/* Call to Action */}
            <Section className="bg-black/20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">Faça Parte do Próximo Capítulo</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
                       Sua doação ou parceria nos ajuda a escrever mais histórias de sucesso como estas.
                    </p>
                    <div className="mt-8">
                        <button onClick={() => navigate('/donate')} className="bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300">
                            Apoie nossa Missão
                        </button>
                    </div>
                </div>
            </Section>
        </>
    );
};

export default AnnualReportView;
