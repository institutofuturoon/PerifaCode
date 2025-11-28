import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';

const TransparencyView: React.FC = () => {
    const navigate = useNavigate();
    const { financialStatements, annualReports } = useAppContext();
    
    // Get latest reports
    const latestFinancial = financialStatements.length > 0 
        ? [...financialStatements].sort((a, b) => b.year - a.year)[0] 
        : null;
    
    const latestReport = annualReports.length > 0 
        ? [...annualReports].sort((a, b) => b.year - a.year)[0] 
        : null;

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="pt-32 pb-20 text-center bg-gradient-to-b from-[#8a4add]/10 to-transparent">
                <div className="container mx-auto px-4">
                    <p className="text-[#c4b5fd] font-bold uppercase tracking-wider mb-4">Transparência</p>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                        Portal da Transparência
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Acreditamos que a confiança é construída com clareza. Acompanhe nossos relatórios.
                    </p>
                </div>
            </div>

            {/* Cards */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                    
                    {/* Card Financeiro */}
                    <a 
                        href="/#/financial-statement"
                        className="block bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-8 hover:border-green-500/40 hover:from-green-500/20 transition-all"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Relatório Financeiro</h2>
                                {latestFinancial && (
                                    <p className="text-green-400 font-semibold">Ano {latestFinancial.year}</p>
                                )}
                            </div>
                        </div>
                        
                        <p className="text-gray-300 mb-6">
                            Veja em detalhes como os recursos são captados e aplicados em nossa missão.
                        </p>
                        
                        {latestFinancial ? (
                            <div className="flex gap-6 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Receita</p>
                                    <p className="text-lg font-bold text-green-400">{latestFinancial.totalRevenue}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Despesas</p>
                                    <p className="text-lg font-bold text-red-400">{latestFinancial.totalExpenses}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 mb-4">Em breve</p>
                        )}
                        
                        <div className="flex items-center gap-2 text-green-400 font-semibold">
                            <span>Ver relatório completo</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </a>

                    {/* Card Impacto */}
                    <a 
                        href="/#/annual-report"
                        className="block bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 hover:from-purple-500/20 transition-all"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Relatório de Impacto</h2>
                                {latestReport && (
                                    <p className="text-purple-400 font-semibold">Ano {latestReport.year}</p>
                                )}
                            </div>
                        </div>
                        
                        <p className="text-gray-300 mb-6">
                            Conheça as histórias de transformação e os números que mudaram vidas.
                        </p>
                        
                        {latestReport ? (
                            <div className="flex gap-6 mb-4">
                                {latestReport.stats.slice(0, 2).map((stat, i) => (
                                    <div key={i}>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className="text-lg font-bold text-purple-400">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 mb-4">Em breve</p>
                        )}
                        
                        <div className="flex items-center gap-2 text-purple-400 font-semibold">
                            <span>Ver relatório completo</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </a>
                    
                </div>
            </div>

            {/* Why Transparency */}
            <div className="bg-black/20 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h2 className="text-3xl font-black text-white mb-4">Por que Transparência?</h2>
                        <p className="text-gray-300 text-lg">
                            Acreditamos que a confiança é a base de qualquer transformação social.
                        </p>
                    </div>
                    
                    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Confiança</h3>
                            <p className="text-sm text-gray-400">
                                Construímos relações duradouras baseadas em honestidade.
                            </p>
                        </div>
                        
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Responsabilidade</h3>
                            <p className="text-sm text-gray-400">
                                Prestamos contas de cada real investido.
                            </p>
                        </div>
                        
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Impacto Real</h3>
                            <p className="text-sm text-gray-400">
                                Mostramos resultados concretos que transformam vidas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Faça Parte Dessa Transformação</h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Sua contribuição é fundamental para continuarmos formando profissionais em tecnologia.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                            href="/#/donate"
                            className="w-full sm:w-auto bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all"
                        >
                            Faça uma Doação
                        </a>
                        <a 
                            href="/#/partnerships"
                            className="w-full sm:w-auto bg-white/10 border border-white/20 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all"
                        >
                            Seja um Parceiro
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransparencyView;
