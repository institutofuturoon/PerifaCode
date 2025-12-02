import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { useOngData } from '../hooks/useOngData';
import SEO from '../components/SEO';
import Badge from '../components/Badge';

const TransparencyView: React.FC = () => {
    const navigate = useNavigate();
    const { financialStatements, annualReports } = useAppContext();
    const { legal, financial, contact } = useOngData();

    // Get latest reports
    const latestFinancial = financialStatements.length > 0
        ? [...financialStatements].sort((a, b) => b.year - a.year)[0]
        : null;

    const latestReport = annualReports.length > 0
        ? [...annualReports].sort((a, b) => b.year - a.year)[0]
        : null;

    return (
        <>
            <SEO
                title="Portal da Transparência | Instituto FuturoOn"
                description="Acesso completo aos nossos relatórios financeiros, dados legais e prestação de contas. Transparência total é nosso compromisso."
                keywords={['transparência', 'prestação de contas', 'relatório financeiro', 'CNPJ', 'ONG transparente']}
            />

            <div className="min-h-screen bg-[#09090B]">
                {/* Hero */}
                <section className="relative py-24 md:py-40 overflow-hidden text-center">
                    {/* Enhanced background effects */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#8a4add]/10 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#f27983]/5 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <Badge text="Transparência Total" />
                        
                        <h1 className="mt-8 text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-tight">
                            Portal da <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] via-[#c084fc] to-[#f27983] animate-gradient">
                                Transparência
                            </span>
                        </h1>
                        
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed mb-12">
                            Acreditamos que a confiança é construída com clareza. Acompanhe nossos relatórios, dados legais e prestação de contas.
                        </p>

                        {/* Trust indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                            <div className="flex items-center gap-2 text-gray-400">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">Auditado</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">CNPJ Ativo</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">Relatórios Públicos</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cards */}
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

                        {/* Card Financeiro */}
                        <button
                            onClick={() => navigate('/demonstrativo-financeiro')}
                            className="group relative block overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] w-full text-left"
                        >
                            {/* Glow effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                            
                            <div className="relative bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border border-green-500/20 group-hover:border-green-500/40 rounded-3xl p-8 md:p-10 transition-all duration-300">
                                {/* Icon with enhanced styling */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-green-500/30 rounded-2xl blur-xl"></div>
                                        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                                            <svg className="w-8 h-8 md:w-10 md:h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {latestFinancial && (
                                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-bold rounded-full">
                                            {latestFinancial.year}
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                                    Relatório Financeiro
                                </h2>

                                <p className="text-gray-300 mb-8 leading-relaxed">
                                    Veja em detalhes como os recursos são captados e aplicados em nossa missão de transformação social.
                                </p>

                                {latestFinancial ? (
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <p className="text-xs text-gray-500 mb-1">Receita Total</p>
                                            <p className="text-lg md:text-xl font-black text-green-400">{latestFinancial.totalRevenue}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <p className="text-xs text-gray-500 mb-1">Despesas</p>
                                            <p className="text-lg md:text-xl font-black text-red-400">{latestFinancial.totalExpenses}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 mb-6">Em breve</p>
                                )}

                                <div className="flex items-center gap-2 text-green-400 font-bold group-hover:gap-3 transition-all">
                                    <span>Ver relatório completo</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </div>
                        </button>

                        {/* Card Impacto */}
                        <button
                            onClick={() => navigate('/relatorio-anual')}
                            className="group relative block overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] w-full text-left"
                        >
                            {/* Glow effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-3xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
                            
                            <div className="relative bg-gradient-to-br from-[#8a4add]/10 via-[#f27983]/5 to-transparent border border-[#8a4add]/20 group-hover:border-[#8a4add]/40 rounded-3xl p-8 md:p-10 transition-all duration-300">
                                {/* Icon with enhanced styling */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-purple-500/30 rounded-2xl blur-xl"></div>
                                        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                                            <svg className="w-8 h-8 md:w-10 md:h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {latestReport && (
                                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm font-bold rounded-full">
                                            {latestReport.year}
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                                    Relatório de Impacto
                                </h2>

                                <p className="text-gray-300 mb-8 leading-relaxed">
                                    Conheça as histórias de transformação e os números que mudaram vidas através da tecnologia.
                                </p>

                                {latestReport ? (
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        {latestReport.stats.slice(0, 2).map((stat, i) => (
                                            <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                                                <p className="text-lg md:text-xl font-black text-purple-400">{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 mb-6">Em breve</p>
                                )}

                                <div className="flex items-center gap-2 text-purple-400 font-bold group-hover:gap-3 transition-all">
                                    <span>Ver relatório completo</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </div>
                        </button>

                    </div>
                </div>

                {/* Why Transparency */}
                <div className="bg-gradient-to-b from-black/20 via-black/30 to-black/20 py-24 relative overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-[#8a4add]/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f27983]/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                                Por que Transparência?
                            </h2>
                            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                                Acreditamos que a confiança é a base de qualquer transformação social.
                            </p>
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <div className="w-2 h-2 rounded-full bg-[#8a4add]"></div>
                                <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-full"></div>
                                <div className="w-2 h-2 rounded-full bg-[#f27983]"></div>
                            </div>
                        </div>

                        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                            <div className="group relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-500"></div>
                                <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 group-hover:border-blue-500/30 rounded-2xl p-8 text-center transition-all duration-300">
                                    <div className="relative inline-block mb-6">
                                        <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl"></div>
                                        <div className="relative w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-blue-500/30 transition-colors">
                                            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3">Confiança</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        Construímos relações duradouras baseadas em honestidade e clareza.
                                    </p>
                                </div>
                            </div>

                            <div className="group relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-500"></div>
                                <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 group-hover:border-green-500/30 rounded-2xl p-8 text-center transition-all duration-300">
                                    <div className="relative inline-block mb-6">
                                        <div className="absolute inset-0 bg-green-500/30 rounded-2xl blur-xl"></div>
                                        <div className="relative w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-green-500/30 transition-colors">
                                            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3">Responsabilidade</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        Prestamos contas de cada real investido em nossa missão.
                                    </p>
                                </div>
                            </div>

                            <div className="group relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-500"></div>
                                <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 group-hover:border-purple-500/30 rounded-2xl p-8 text-center transition-all duration-300">
                                    <div className="relative inline-block mb-6">
                                        <div className="absolute inset-0 bg-purple-500/30 rounded-2xl blur-xl"></div>
                                        <div className="relative w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-purple-500/30 transition-colors">
                                            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3">Impacto Real</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        Mostramos resultados concretos que transformam vidas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal Information Section */}
                {legal && (
                    <section className="py-24 bg-black/20 relative overflow-hidden">
                        {/* Background decorative elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8a4add]/5 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="container mx-auto px-4 relative z-10">
                            <div className="max-w-4xl mx-auto text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Dados Legais</h2>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                                    Informações oficiais da nossa organização
                                </p>
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <div className="w-2 h-2 rounded-full bg-[#8a4add]"></div>
                                    <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-full"></div>
                                    <div className="w-2 h-2 rounded-full bg-[#f27983]"></div>
                                </div>
                            </div>

                            {/* 3 cards lado a lado */}
                            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 lg:gap-8">
                                {/* Card 1 - Razão Social */}
                                <div className="group relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8a4add] to-[#c084fc] rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-500"></div>
                                    <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 rounded-2xl border border-white/10 group-hover:border-[#8a4add]/30 transition-all duration-300 h-full">
                                        <div className="relative inline-block mb-6">
                                            <div className="absolute inset-0 bg-[#8a4add]/30 rounded-xl blur-xl"></div>
                                            <div className="relative w-14 h-14 bg-[#8a4add]/20 rounded-xl flex items-center justify-center group-hover:bg-[#8a4add]/30 transition-colors">
                                                <svg className="w-7 h-7 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-4">Razão Social</h3>
                                        <p className="text-gray-300 font-mono text-sm leading-relaxed">{legal.legalName}</p>
                                    </div>
                                </div>

                                {/* Card 2 - CNPJ */}
                                <div className="group relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#c084fc] to-[#f27983] rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-500"></div>
                                    <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 rounded-2xl border border-white/10 group-hover:border-[#c084fc]/30 transition-all duration-300 h-full">
                                        <div className="relative inline-block mb-6">
                                            <div className="absolute inset-0 bg-[#c084fc]/30 rounded-xl blur-xl"></div>
                                            <div className="relative w-14 h-14 bg-[#c084fc]/20 rounded-xl flex items-center justify-center group-hover:bg-[#c084fc]/30 transition-colors">
                                                <svg className="w-7 h-7 text-[#c084fc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-4">CNPJ</h3>
                                        <p className="text-gray-300 font-mono text-sm leading-relaxed">{legal.cnpj}</p>
                                    </div>
                                </div>

                                {/* Card 3 - Data de Fundação */}
                                <div className="group relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f27983] to-[#fb923c] rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-500"></div>
                                    <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 rounded-2xl border border-white/10 group-hover:border-[#f27983]/30 transition-all duration-300 h-full">
                                        <div className="relative inline-block mb-6">
                                            <div className="absolute inset-0 bg-[#f27983]/30 rounded-xl blur-xl"></div>
                                            <div className="relative w-14 h-14 bg-[#f27983]/20 rounded-xl flex items-center justify-center group-hover:bg-[#f27983]/30 transition-colors">
                                                <svg className="w-7 h-7 text-[#f27983]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-4">Data de Fundação</h3>
                                        <p className="text-gray-300 font-mono text-sm leading-relaxed">
                                            {new Date(legal.foundationDate).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card de Registro (se existir) - Full width abaixo */}
                            {legal.registration && (
                                <div className="max-w-6xl mx-auto mt-6 lg:mt-8">
                                    <div className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-500"></div>
                                        <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 rounded-2xl border border-white/10 group-hover:border-green-500/30 transition-all duration-300">
                                            <div className="flex items-center gap-6">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-green-500/30 rounded-xl blur-xl"></div>
                                                    <div className="relative w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                                                        <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-black text-white mb-2">Registro</h3>
                                                    <p className="text-gray-300 font-mono text-sm">{legal.registration}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Banking Information Section */}
                {financial && (
                    <section className="py-24 relative overflow-hidden">
                        {/* Background decorative elements */}
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8a4add]/5 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="container mx-auto px-4 relative z-10">
                            <div className="max-w-4xl mx-auto text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Dados Bancários</h2>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                                    Para doações e transferências diretas
                                </p>
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <div className="w-2 h-2 rounded-full bg-[#8a4add]"></div>
                                    <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-full"></div>
                                    <div className="w-2 h-2 rounded-full bg-[#f27983]"></div>
                                </div>
                            </div>

                            <div className="max-w-3xl mx-auto">
                                <div className="group relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-3xl opacity-0 group-hover:opacity-10 blur transition-all duration-500"></div>
                                    
                                    <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 md:p-10 rounded-3xl border border-white/10 group-hover:border-[#8a4add]/30 transition-all duration-300">
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    Banco Destino
                                                </p>
                                                <p className="text-xl md:text-2xl font-black text-white">{financial.bankAccount.bank}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Favorecido
                                                </p>
                                                <p className="text-xl md:text-2xl font-black text-white">{financial.bankAccount.holder}</p>
                                            </div>
                                            
                                            {(financial.bankAccount.branch || financial.bankAccount.account) && (
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {financial.bankAccount.branch && (
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-2">Agência</p>
                                                            <p className="text-lg font-bold text-white font-mono">{financial.bankAccount.branch}</p>
                                                        </div>
                                                    )}
                                                    {financial.bankAccount.account && (
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-2">Conta</p>
                                                            <p className="text-lg font-bold text-white font-mono">{financial.bankAccount.account}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-white/10">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                                                        </svg>
                                                        Chave PIX (CNPJ)
                                                    </p>
                                                    <p className="text-lg md:text-xl font-black text-[#8a4add] font-mono break-all">{financial.bankAccount.pix}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(financial.bankAccount.pix);
                                                        alert('Chave PIX copiada com sucesso!');
                                                    }}
                                                    className="px-6 py-3 bg-[#8a4add]/20 hover:bg-[#8a4add]/30 text-[#8a4add] rounded-xl transition-all duration-300 flex items-center gap-2 font-bold hover:scale-105 transform"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                    Copiar PIX
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Contact Information */}
                {contact && (
                    <section className="py-20 bg-black/20">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto text-center mb-12">
                                <h2 className="text-3xl font-black text-white mb-4">Entre em Contato</h2>
                                <p className="text-gray-300 text-lg">
                                    Dúvidas sobre transparência? Fale conosco
                                </p>
                                <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
                            </div>

                            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#8a4add]/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">E-mail</h3>
                                    </div>
                                    <a href={`mailto:${contact.emails.general}`} className="text-[#8a4add] hover:underline">
                                        {contact.emails.general}
                                    </a>
                                </div>

                                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#8a4add]/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">Telefone</h3>
                                    </div>
                                    <a href={`tel:${contact.phones.main.replace(/\D/g, '')}`} className="text-[#8a4add] hover:underline">
                                        {contact.phones.main}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className="py-20">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-4xl mx-auto">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#8a4add]/10 to-[#f27983]/10 rounded-3xl blur-2xl"></div>
                                <div className="relative bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/10">
                                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                                        Faça Parte Dessa Transformação
                                    </h2>
                                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                                        Sua contribuição é fundamental para continuarmos formando profissionais em tecnologia com total transparência.
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <button
                                            onClick={() => navigate('/doar')}
                                            className="w-full sm:w-auto bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all transform hover:scale-105"
                                        >
                                            Faça uma Doação
                                        </button>
                                        <button
                                            onClick={() => navigate('/parcerias')}
                                            className="w-full sm:w-auto bg-white/10 border border-white/20 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all"
                                        >
                                            Seja um Parceiro
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default TransparencyView;
