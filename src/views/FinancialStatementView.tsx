
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { useOngData } from '../hooks/useOngData';
import { FinancialItem } from '../types';
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
    <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">{children}</h2>
        {subtitle && <p className="mt-4 max-w-3xl mx-auto text-base md:text-lg text-gray-300 leading-relaxed px-4">{subtitle}</p>}
        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-6"></div>
    </div>
);

const FinancialCard: React.FC<{ value: string, label: string, icon: React.ReactNode, color: string }> = ({ value, label, icon, color }) => (
    <div className="group relative bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 hover:border-[#8a4add]/30 hover:bg-white/[0.07] transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className={`flex-shrink-0 h-14 w-14 md:h-16 md:w-16 rounded-xl flex items-center justify-center text-white ${color} group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div className="text-center sm:text-left">
                <p className="text-3xl md:text-4xl font-black text-white mb-1">{value}</p>
                <p className="text-sm md:text-base text-gray-400 font-medium">{label}</p>
            </div>
        </div>
    </div>
);

const DonutChart: React.FC<{ items: FinancialItem[], title: string }> = ({ items, title }) => {
    const colorMap: Record<string, string> = {
        'bg-sky-500': '#05a7f2',
        'bg-green-500': '#10b981',
        'bg-red-500': '#d01717',
        'bg-yellow-500': '#d99204',
        'bg-purple-500': '#8a4add',
        'bg-pink-500': '#f27983',
        'bg-orange-500': '#f28705',
        'bg-gray-500': '#6b7280',
        'bg-info': '#034c8c',
        'bg-brand-cyan': '#05a7f2',
        'bg-brand-gold': '#d99204',
        'bg-brand-orange': '#f28705',
    };

    let currentAngle = 0;
    const gradientParts = items.map(item => {
        const start = currentAngle;
        const end = currentAngle + (item.percentage * 3.6);
        currentAngle = end;
        const hexColor = colorMap[item.color] || '#ccc';
        return `${hexColor} ${start}deg ${end}deg`;
    });
    const gradientString = `conic-gradient(${gradientParts.join(', ')})`;

    return (
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Chart */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                <div 
                    className="w-full h-full rounded-full shadow-2xl"
                    style={{ background: gradientString }}
                ></div>
                <div className="absolute inset-4 md:inset-6 bg-[#09090B] rounded-full flex items-center justify-center border-4 border-white/5">
                    <div className="text-center">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">{title}</p>
                        <p className="text-white font-black text-2xl md:text-3xl">100%</p>
                    </div>
                </div>
            </div>
            
            {/* Legend */}
            <div className="flex-1 w-full">
                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full ${item.color} shadow-lg`}></div>
                                    <span className="text-sm md:text-base text-gray-300 group-hover:text-white transition-colors font-medium">{item.label}</span>
                                </div>
                                <span className="text-base md:text-lg font-bold text-white">{item.percentage}%</span>
                            </div>
                            <div className="flex items-center justify-between pl-7">
                                <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden mr-4">
                                    <div 
                                        className={`h-full ${item.color} transition-all duration-500`}
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs md:text-sm font-mono text-gray-500">{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const FinancialStatementView: React.FC = () => {
    const navigate = useNavigate();
    const { financialStatements } = useAppContext();
    const { organization, legal, contact } = useOngData();
    
    // Logic to get the latest statement
    const latestStatement = useMemo(() => {
        if (financialStatements.length === 0) return null;
        return [...financialStatements].sort((a, b) => b.year - a.year)[0];
    }, [financialStatements]);

    if (!latestStatement) {
         // Fallback or Loading state if no data exists yet
         return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                 <h1 className="text-3xl font-bold text-white">Prestação de Contas</h1>
                 <p className="text-gray-400 mt-4">Os dados financeiros do ano corrente serão publicados em breve.</p>
                 <button onClick={() => navigate('/')} className="mt-8 text-[#c4b5fd] hover:underline">Voltar para Home</button>
             </div>
         );
    }

    return (
        <>
            <SEO 
                title={`Prestação de Contas ${latestStatement.year} | Instituto FuturoOn`}
                description="Transparência total: veja como cada real doado é investido na transformação de vidas através da tecnologia."
            />
            
            {/* Hero Section */}
            <header className="relative py-20 md:py-32 lg:py-40 text-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[400px] bg-[#8a4add]/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Badge text="Transparência Financeira" />
                    
                    <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
                        Prestação de Contas<br className="hidden sm:block" />
                        <span className="text-[#c4b5fd]">{latestStatement.year}</span>
                    </h1>
                    
                    <p className="mt-6 max-w-3xl mx-auto text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed px-4">
                        Cada real doado é um tijolo na construção do futuro. Veja em detalhes como sua contribuição se transforma em oportunidade e impacto social.
                    </p>

                    {/* Trust Indicators */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-4 md:gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-300 font-medium">Auditado</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-300 font-medium">Documentado</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="text-sm text-gray-300 font-medium">100% Transparente</span>
                        </div>
                    </div>

                    {/* Organization Info */}
                    {(organization || legal) && (
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                            {legal?.cnpj && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                    <span>CNPJ: {legal.cnpj}</span>
                                </div>
                            )}
                            {legal?.registration && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>{legal.registration}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Financial Summary */}
            <Section className="bg-gradient-to-b from-black/20 to-transparent">
                <SectionTitle subtitle="Resumo financeiro do ano com total transparência e prestação de contas.">
                    Resumo Financeiro
                </SectionTitle>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    <FinancialCard 
                        value={latestStatement.totalRevenue} 
                        label="Total de Receitas" 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
                        color="bg-green-500/20" 
                    />
                    <FinancialCard 
                        value={latestStatement.totalExpenses} 
                        label="Total de Despesas" 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>} 
                        color="bg-red-500/20" 
                    />
                    <FinancialCard 
                        value={latestStatement.reinvested} 
                        label="Balanço Reinvestido" 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>} 
                        color="bg-[#8a4add]/20" 
                    />
                </div>
            </Section>
            
            {/* Breakdown with Charts */}
            <Section className="bg-black/20">
                <SectionTitle subtitle="Veja de onde vêm nossos recursos e como são aplicados para gerar impacto social.">
                    Detalhamento Financeiro
                </SectionTitle>
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Receitas */}
                    <div className="bg-white/5 p-6 md:p-10 rounded-3xl border border-white/10 hover:border-green-500/30 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-white">Origem dos Recursos</h3>
                        </div>
                        <DonutChart items={latestStatement.revenueBreakdown} title="Receitas" />
                    </div>

                    {/* Despesas */}
                    <div className="bg-white/5 p-6 md:p-10 rounded-3xl border border-white/10 hover:border-red-500/30 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                </svg>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-white">Aplicação dos Recursos</h3>
                        </div>
                        <DonutChart items={latestStatement.expensesBreakdown} title="Despesas" />
                    </div>
                </div>
            </Section>

            {/* Documents */}
            <Section>
                <SectionTitle subtitle="Acesse nossos documentos oficiais e relatórios detalhados. A confiança é a base de tudo.">
                    Documentos Oficiais
                </SectionTitle>
                <div className="max-w-3xl mx-auto">
                    <a 
                        href={latestStatement.documentsUrl || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group block"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative flex flex-col sm:flex-row items-center justify-between p-6 md:p-8 bg-white/5 rounded-2xl border border-white/10 group-hover:border-[#8a4add]/30 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                    <div className="w-14 h-14 rounded-xl bg-[#8a4add]/10 flex items-center justify-center group-hover:bg-[#8a4add]/20 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-lg md:text-xl font-bold text-white mb-1">Balanço Financeiro Completo</p>
                                        <p className="text-sm text-gray-400">Ano {latestStatement.year} • PDF/ZIP</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                                    <span className="text-sm font-medium hidden md:block">Download</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Additional Links */}
                    <div className="mt-8 grid md:grid-cols-3 gap-4">
                        <button 
                            onClick={() => navigate('/transparencia')}
                            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#8a4add]/30 hover:bg-white/[0.07] transition-all duration-300 text-center group"
                        >
                            <svg className="w-8 h-8 mx-auto mb-2 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm font-bold text-white group-hover:text-[#c4b5fd] transition-colors">Todos os Relatórios</p>
                        </button>

                        <button 
                            onClick={() => navigate('/relatorio-anual')}
                            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#f27983]/30 hover:bg-white/[0.07] transition-all duration-300 text-center group"
                        >
                            <svg className="w-8 h-8 mx-auto mb-2 text-[#f27983]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <p className="text-sm font-bold text-white group-hover:text-[#f27983] transition-colors">Relatório Anual</p>
                        </button>

                        <button 
                            onClick={() => navigate('/sobre')}
                            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#c4b5fd]/30 hover:bg-white/[0.07] transition-all duration-300 text-center group"
                        >
                            <svg className="w-8 h-8 mx-auto mb-2 text-[#c4b5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm font-bold text-white group-hover:text-[#c4b5fd] transition-colors">Quem Somos</p>
                        </button>
                    </div>
                </div>
            </Section>

            {/* Contact for Questions */}
            {contact && (
                <Section className="bg-black/20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-black text-white mb-4">
                            Dúvidas sobre a Prestação de Contas?
                        </h2>
                        <p className="text-gray-300 mb-8">
                            Estamos à disposição para esclarecer qualquer questão sobre nossos relatórios financeiros
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a 
                                href={`mailto:${contact.emails.general}`}
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {contact.emails.general}
                            </a>
                            <a 
                                href={`tel:${contact.phones.main.replace(/\D/g, '')}`}
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {contact.phones.main}
                            </a>
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
                                Faça Parte Desta Transformação
                            </h2>
                            <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Sua doação é o combustível que nos permite continuar formando a próxima geração de líderes em tecnologia. Juntos, podemos transformar ainda mais vidas.
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
        </>
    );
};

export default FinancialStatementView;
