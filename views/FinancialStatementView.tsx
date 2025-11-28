
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { FinancialItem } from '../types';

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

const FinancialCard: React.FC<{ value: string, label: string, icon: React.ReactNode, color: string }> = ({ value, label, icon, color }) => (
    <div className="bg-info/5 p-6 rounded-lg border border-info/20 flex items-center gap-4 hover:border-info/40 transition-colors">
        <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-sm text-info">{label}</p>
        </div>
    </div>
);

// --- IMPROVEMENT: Interactive Donut Chart Component ---
const DonutChart: React.FC<{ items: FinancialItem[], title: string }> = ({ items, title }) => {
    // Map tailwind class names to hex codes for the gradient
    const colorMap: Record<string, string> = {
        'bg-sky-500': '#05a7f2',      // Ciano da paleta
        'bg-green-500': '#10b981',    // Verde success
        'bg-red-500': '#d01717',      // Vermelho da paleta
        'bg-yellow-500': '#d99204',   // Dourado da paleta
        'bg-purple-500': '#8a4add',   // Roxo principal
        'bg-pink-500': '#f27983',     // Rosa secundária
        'bg-orange-500': '#f28705',   // Laranja da paleta
        'bg-gray-500': '#6b7280',
        'bg-info': '#034c8c',         // Azul escuro
        'bg-brand-cyan': '#05a7f2',
        'bg-brand-gold': '#d99204',
        'bg-brand-orange': '#f28705',
    };

    // Calculate gradient string
    let currentAngle = 0;
    const gradientParts = items.map(item => {
        const start = currentAngle;
        const end = currentAngle + (item.percentage * 3.6); // 3.6 degrees per 1%
        currentAngle = end;
        const hexColor = colorMap[item.color] || '#ccc';
        return `${hexColor} ${start}deg ${end}deg`;
    });
    const gradientString = `conic-gradient(${gradientParts.join(', ')})`;

    return (
        <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-64 h-64 flex-shrink-0">
                {/* Chart */}
                <div 
                    className="w-full h-full rounded-full"
                    style={{ background: gradientString }}
                ></div>
                {/* Hollow center */}
                <div className="absolute inset-4 bg-[#18181b] rounded-full flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">{title}</p>
                        <p className="text-white font-black text-xl">100%</p>
                    </div>
                </div>
            </div>
            
            {/* Legend */}
            <div className="flex-1 w-full">
                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono text-gray-500">{item.value}</span>
                                <span className="text-sm font-bold text-white">{item.percentage}%</span>
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
            {/* Hero Section */}
            <header className="py-32 md:py-40 text-center relative z-10 bg-grid-pattern">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="font-semibold text-[#c4b5fd] uppercase tracking-widest">Transparência</p>
                    <h1 className="mt-4 text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                        Prestação de Contas {latestStatement.year}
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                        Cada real doado é um tijolo na construção do futuro. Veja em detalhes como sua contribuição se transforma em oportunidade e impacto social.
                    </p>
                </div>
            </header>

            {/* Financial Summary */}
            <Section className="bg-black/20 -mt-16 relative z-20">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <FinancialCard value={latestStatement.totalRevenue} label="Total de Receitas" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} color="bg-green-500/50" />
                    <FinancialCard value={latestStatement.totalExpenses} label="Total de Despesas" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>} color="bg-red-500/50" />
                    <FinancialCard value={latestStatement.reinvested} label="Balanço Reinvestido" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>} color="bg-blue-500/50" />
                </div>
            </Section>
            
            {/* Breakdown with Charts */}
            <Section>
                <SectionTitle>Detalhamento Financeiro</SectionTitle>
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
                    <div className="bg-[#18181b] p-8 rounded-2xl border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-8 text-center lg:text-left">Origem dos Recursos</h3>
                        <DonutChart items={latestStatement.revenueBreakdown} title="Receitas" />
                    </div>
                     <div className="bg-[#18181b] p-8 rounded-2xl border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-8 text-center lg:text-left">Aplicação dos Recursos</h3>
                        <DonutChart items={latestStatement.expensesBreakdown} title="Despesas" />
                    </div>
                </div>
            </Section>

            {/* Documents */}
            <Section className="bg-black/20">
                <SectionTitle subtitle="Acesse nossos documentos oficiais e relatórios detalhados. A confiança é a base de tudo.">
                    Download de Documentos
                </SectionTitle>
                <div className="max-w-2xl mx-auto space-y-4">
                     <a href={latestStatement.documentsUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-full text-left group flex items-center justify-between p-6 bg-white/5 rounded-lg border border-white/10 hover:border-[#8a4add]/50 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <span className="text-[#8a4add]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </span>
                            <span className="text-lg font-semibold text-white">Balanço Financeiro Detalhado {latestStatement.year} (PDF/ZIP)</span>
                        </div>
                        <span className="text-gray-400 transform transition-transform group-hover:translate-x-1 group-hover:text-white">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </span>
                    </a>
                </div>
            </Section>

            {/* Call to Action */}
            <Section className="bg-black/20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">Junte-se a nós</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
                       Sua doação é o combustível que nos permite continuar formando a próxima geração de líderes em tecnologia.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={() => navigate('/donate')} className="w-full sm:w-auto bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300">
                            Faça uma Doação
                        </button>
                        <button onClick={() => navigate('/partnerships')} className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-300">
                            Seja um Parceiro
                        </button>
                    </div>
                </div>
            </Section>
        </>
    );
};

export default FinancialStatementView;
