import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="bg-white/5 p-6 rounded-lg border border-white/10 flex items-center gap-4">
        <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    </div>
);

const BreakdownBar: React.FC<{ label: string, value: string, percentage: number, color: string }> = ({ label, value, percentage, color }) => (
    <div>
        <div className="flex justify-between mb-1 text-sm">
            <span className="font-semibold text-gray-300">{label}</span>
            <span className="font-bold text-white">{value}</span>
        </div>
        <div className="w-full bg-black/30 rounded-full h-4 border border-white/10">
            <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    </div>
);


const FinancialStatementView: React.FC = () => {
    const navigate = useNavigate();

    const revenueData = [
        { label: 'Parcerias Corporativas', value: 'R$ 25.000', percentage: 50, color: 'bg-sky-500' },
        { label: 'Doações Individuais', value: 'R$ 20.000', percentage: 40, color: 'bg-purple-500' },
        { label: 'Editais e Prêmios', value: 'R$ 5.000', percentage: 10, color: 'bg-pink-500' },
    ];

    const expenseData = [
        { label: 'Infraestrutura e Bolsas', value: 'R$ 25.000', percentage: 51.5, color: 'bg-red-500' },
        { label: 'Recursos Humanos', value: 'R$ 15.000', percentage: 30.9, color: 'bg-orange-500' },
        { label: 'Marketing e Eventos', value: 'R$ 5.000', percentage: 10.3, color: 'bg-yellow-500' },
        { label: 'Custos Administrativos', value: 'R$ 3.500', percentage: 7.2, color: 'bg-gray-500' },
    ];

    return (
        <div className="aurora-background text-white">
            {/* Hero Section */}
            <header className="py-32 md:py-40 text-center relative z-10 bg-grid-pattern">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="font-semibold text-[#c4b5fd] uppercase tracking-widest">Transparência</p>
                    <h1 className="mt-4 text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                        Prestação de Contas 2024
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                        Cada real doado é um tijolo na construção do futuro. Veja em detalhes como sua contribuição se transforma em oportunidade e impacto social.
                    </p>
                </div>
            </header>

            {/* Financial Summary */}
            <Section className="bg-black/20 -mt-16 relative z-20">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <FinancialCard value="R$ 50.000" label="Total de Receitas" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} color="bg-green-500/50" />
                    <FinancialCard value="R$ 48.500" label="Total de Despesas" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>} color="bg-red-500/50" />
                    <FinancialCard value="R$ 1.500" label="Balanço Reinvestido" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>} color="bg-blue-500/50" />
                </div>
            </Section>
            
            {/* Breakdown */}
            <Section>
                <SectionTitle>Detalhamento Financeiro</SectionTitle>
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
                    <div className="bg-white/5 p-8 rounded-lg border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">De onde vieram os recursos?</h3>
                        <div className="space-y-6">
                            {revenueData.map(item => <BreakdownBar key={item.label} {...item} />)}
                        </div>
                    </div>
                     <div className="bg-white/5 p-8 rounded-lg border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">Como investimos na nossa missão?</h3>
                        <div className="space-y-6">
                            {expenseData.map(item => <BreakdownBar key={item.label} {...item} />)}
                        </div>
                    </div>
                </div>
            </Section>

            {/* Documents */}
            <Section className="bg-black/20">
                <SectionTitle subtitle="Acesse nossos documentos oficiais e relatórios detalhados. A confiança é a base de tudo.">
                    Download de Documentos
                </SectionTitle>
                <div className="max-w-2xl mx-auto space-y-4">
                     <a href="#" className="w-full text-left group flex items-center justify-between p-6 bg-white/5 rounded-lg border border-white/10 hover:border-[#8a4add]/50 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <span className="text-[#8a4add]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </span>
                            <span className="text-lg font-semibold text-white">Balanço Financeiro Detalhado 2024 (PDF)</span>
                        </div>
                        <span className="text-gray-400 transform transition-transform group-hover:translate-x-1 group-hover:text-white">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </span>
                    </a>
                     <a href="#" className="w-full text-left group flex items-center justify-between p-6 bg-white/5 rounded-lg border border-white/10 hover:border-[#8a4add]/50 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <span className="text-[#8a4add]">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </span>
                            <span className="text-lg font-semibold text-white">Comprovantes de Despesas (ZIP)</span>
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
        </div>
    );
};

export default FinancialStatementView;