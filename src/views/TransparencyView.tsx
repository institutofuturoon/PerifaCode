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
                <section className="relative py-20 md:py-32 overflow-hidden text-center">
                    <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#8a4add]/10 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <Badge text="Transparência Total" />
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 leading-tight">
                            Portal da <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">Transparência</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed">
                            Acreditamos que a confiança é construída com clareza. Acompanhe nossos relatórios, dados legais e prestação de contas.
                        </p>
                    </div>
                </section>

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
                            className="block bg-gradient-to-br from-[#8a4add]/10 to-[#f27983]/5 border border-[#8a4add]/20 rounded-2xl p-8 hover:border-[#8a4add]/40 hover:from-[#8a4add]/20 transition-all"
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

                {/* Legal Information Section */}
                {legal && (
                    <section className="py-20 bg-black/20">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto text-center mb-12">
                                <h2 className="text-3xl font-black text-white mb-4">Dados Legais</h2>
                                <p className="text-gray-300 text-lg">
                                    Informações oficiais da nossa organização
                                </p>
                                <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
                            </div>

                            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#8a4add]/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">Razão Social</h3>
                                    </div>
                                    <p className="text-gray-300 font-mono text-sm">{legal.legalName}</p>
                                </div>

                                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#8a4add]/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">CNPJ</h3>
                                    </div>
                                    <p className="text-gray-300 font-mono text-sm">{legal.cnpj}</p>
                                </div>

                                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#8a4add]/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">Data de Fundação</h3>
                                    </div>
                                    <p className="text-gray-300 font-mono text-sm">
                                        {new Date(legal.foundationDate).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>

                                {legal.registration && (
                                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-2xl border border-white/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-[#8a4add]/20 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-white">Registro</h3>
                                        </div>
                                        <p className="text-gray-300 font-mono text-sm">{legal.registration}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Banking Information Section */}
                {financial && (
                    <section className="py-20">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto text-center mb-12">
                                <h2 className="text-3xl font-black text-white mb-4">Dados Bancários</h2>
                                <p className="text-gray-300 text-lg">
                                    Para doações e transferências diretas
                                </p>
                                <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
                            </div>

                            <div className="max-w-3xl mx-auto">
                                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-8 rounded-2xl border border-white/10">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Banco</p>
                                            <p className="text-lg font-bold text-white">{financial.bankAccount.bank}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Titular</p>
                                            <p className="text-lg font-bold text-white">{financial.bankAccount.holder}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Agência</p>
                                            <p className="text-lg font-bold text-white font-mono">{financial.bankAccount.branch}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Conta</p>
                                            <p className="text-lg font-bold text-white font-mono">{financial.bankAccount.account}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">PIX (CNPJ)</p>
                                                <p className="text-lg font-bold text-[#8a4add] font-mono">{financial.bankAccount.pix}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(financial.bankAccount.pix);
                                                    alert('PIX copiado!');
                                                }}
                                                className="px-4 py-2 bg-[#8a4add]/20 hover:bg-[#8a4add]/30 text-[#8a4add] rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                Copiar
                                            </button>
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
