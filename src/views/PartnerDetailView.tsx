
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import senacLogo from '../assets/images/parceiros/senac-rj-logo-branco.webp';
import senaiLogo from '../assets/images/parceiros/senai.png';
import inJuniorLogo from '../assets/images/parceiros/in_junior_logo.jpg';
import way2Logo from '../assets/images/parceiros/wai2-logo.webp';
import craqueDoAmanhaLogo from '../assets/images/parceiros/batata-crac-logo.jpg';

// Hostinger logo em base64
const hostingerLogo = "data:image/webp;base64,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";

const StatBox: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
    <div className="bg-[#121214] border border-white/10 p-6 rounded-2xl flex flex-col items-start hover:border-[#8a4add]/40 transition-colors group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-4xl grayscale group-hover:grayscale-0">
            {icon}
        </div>
        <p className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:text-[#c4b5fd] transition-colors">{value}</p>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{label}</p>
    </div>
);

const PartnerDetailView: React.FC = () => {
    const { partnerId } = useParams<{ partnerId: string }>();
    const { partners } = useAppContext();
    const navigate = useNavigate();

    const partner = useMemo(() => {
        const foundPartner = partners.find(p => p.id === partnerId);
        if (!foundPartner) return null;

        // Map to real logo
        let logoUrl = foundPartner.logoUrl;
        if (foundPartner.name === 'SENAC') logoUrl = senacLogo;
        else if (foundPartner.name === 'SENAI') logoUrl = senaiLogo;
        else if (foundPartner.name === 'Hostinger') logoUrl = hostingerLogo;
        else if (foundPartner.name.includes('UFF') || foundPartner.name.includes('IN Junior')) logoUrl = inJuniorLogo;
        else if (foundPartner.name === 'Way2') logoUrl = way2Logo;
        else if (foundPartner.name === 'Craque do Amanhã') logoUrl = craqueDoAmanhaLogo;

        return { ...foundPartner, logoUrl };
    }, [partners, partnerId]);

    // Mock gallery data for visuals
    const gallery = [
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
    ];

    if (!partner) {
        return (
            <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-white mb-4">Parceiro não encontrado.</h2>
                <button onClick={() => navigate('/apoiadores')} className="text-[#c4b5fd] hover:underline">Retornar aos Apoiadores</button>
            </div>
        );
    }

    // Conteúdo especial para Hostinger
    const isHostinger = partner.name === 'Hostinger';

    return (
        <div className="min-h-screen bg-[#09090B] text-white font-sans selection:bg-[#8a4add] selection:text-white">

            {/* Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 bg-[#09090B]/80 backdrop-blur-md border-b border-white/5 h-16 flex items-center px-6">
                <button onClick={() => navigate('/apoiadores')} className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                    <span className="text-lg">←</span> VOLTAR PARA A GALERIA
                </button>
            </nav>

            <div className="pt-32 pb-20 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

                {/* Header / Dossier Title */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16 border-b border-white/10 pb-10">
                    <div className="w-32 h-32 bg-white rounded-2xl p-4 flex items-center justify-center shadow-[0_0_40px_-10px_rgba(138,74,221,0.3)]">
                        <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <span className="px-2 py-1 bg-[#8a4add] text-white text-[10px] font-bold uppercase rounded-md">Parceiro Oficial</span>
                            <span className="text-gray-500 text-xs font-mono">ID: {partner.id.toUpperCase()}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-2">{partner.name}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                            <span>Desde {partner.since || '2023'}</span>
                            <span className="h-1 w-1 rounded-full bg-gray-600"></span>
                            <a href={partner.websiteUrl} target="_blank" rel="noreferrer" className="hover:text-[#c4b5fd] transition-colors">Website Oficial ↗</a>
                        </div>
                    </div>
                </div>

                {/* Seção Especial de Agradecimento - Hostinger */}
                {isHostinger && (
                    <div className="mb-16 relative overflow-hidden">
                        {/* Background effects */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl"></div>
                        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                        
                        <div className="relative z-10 bg-gradient-to-br from-white/5 to-white/[0.02] border-2 border-yellow-500/30 rounded-3xl p-8 md:p-12">
                            {/* Badge de Prêmio */}
                            <div className="flex justify-center mb-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40">
                                    <span className="text-3xl">🏆</span>
                                    <span className="text-sm font-bold text-yellow-300 uppercase tracking-wider">Prêmio Hostinger Start 2025</span>
                                </div>
                            </div>

                            {/* Título de Agradecimento */}
                            <h2 className="text-3xl md:text-5xl font-black text-center text-white mb-6 leading-tight">
                                Obrigado por Acreditar no Nosso Sonho! 💜
                            </h2>

                            {/* Mensagem de Agradecimento */}
                            <div className="max-w-3xl mx-auto space-y-6 text-center">
                                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                                    A <strong className="text-white">Hostinger</strong> não é apenas um parceiro, é um <strong className="text-yellow-400">catalisador de transformação</strong>. Ao nos reconhecer com o <strong className="text-yellow-400">Prêmio Hostinger Start 2025</strong>, vocês validaram nossa missão de impulsionar sonhos de negócio online e transformar vidas através da tecnologia.
                                </p>

                                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-500 rounded-r-2xl p-6 text-left">
                                    <p className="text-white font-semibold italic text-base md:text-lg">
                                        "Este prêmio representa muito mais que um reconhecimento. É a prova de que quando acreditamos no potencial da juventude periférica e oferecemos as ferramentas certas, não há limites para o que podemos alcançar juntos."
                                    </p>
                                    <p className="text-gray-400 text-sm mt-3">— Equipe Instituto FuturoOn</p>
                                </div>

                                <p className="text-base md:text-lg text-gray-300">
                                    Graças ao apoio da Hostinger, conseguimos <strong className="text-white">hospedar nossa plataforma</strong>, <strong className="text-white">capacitar jovens em desenvolvimento web</strong> e <strong className="text-white">criar oportunidades reais</strong> para quem mais precisa.
                                </p>
                            </div>

                            {/* Estatísticas do Impacto Hostinger */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-4xl mx-auto">
                                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-3xl font-black text-yellow-400 mb-1">R$ 16.5k</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Investimento Total</p>
                                </div>
                                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-3xl font-black text-yellow-400 mb-1">100%</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Uptime Garantido</p>
                                </div>
                                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-3xl font-black text-yellow-400 mb-1">50+</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Alunos Beneficiados</p>
                                </div>
                                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-3xl font-black text-yellow-400 mb-1">24/7</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Plataforma Online</p>
                                </div>
                            </div>

                            {/* CTA para o artigo */}
                            <div className="mt-10 text-center">
                                <button
                                    onClick={() => navigate('/artigo/hostinger-start-impulsionando-seu-sonho-de-negocio-online')}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 hover:scale-105"
                                >
                                    <span>Leia a História Completa do Prêmio</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Left Column: Stats & Impact */}
                    <div className="lg:col-span-1 space-y-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="text-[#8a4add]">///</span> Dados de Impacto
                        </h3>

                        <div className="space-y-4">
                            <StatBox label="Investimento Total" value="R$ 150k+" icon="💎" />
                            <StatBox label="Vidas Impactadas" value="300+" icon="🚀" />
                            <StatBox label="Bolsas Concedidas" value="50" icon="🎓" />
                        </div>

                        <div className="bg-gradient-to-b from-white/5 to-transparent p-6 rounded-2xl border border-white/10 mt-8">
                            <h4 className="font-bold text-white mb-2">Certificado de Impacto</h4>
                            <p className="text-xs text-gray-400 mb-4">Reconhecimento oficial do Instituto FuturoOn pela contribuição excepcional.</p>
                            <button className="w-full py-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold rounded-lg transition-all text-sm flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                Download Selo 2024
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Story & Gallery */}
                    <div className="lg:col-span-2 space-y-10">
                        <section>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                                <span className="text-[#8a4add]">///</span> Relatório de Missão
                            </h3>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-xl text-gray-200 leading-relaxed font-light">
                                    "{partner.description}"
                                </p>
                                <div className="mt-8 p-6 bg-[#121214] border-l-4 border-[#8a4add] rounded-r-xl">
                                    <h4 className="text-[#c4b5fd] font-bold text-sm uppercase mb-2">Resultado Chave</h4>
                                    <p className="text-white font-medium italic">
                                        "{partner.impactDescription || 'Parceiro fundamental na estruturação de nossos laboratórios de informática, permitindo que mais de 100 alunos tivessem acesso a computadores de alta performance.'}"
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                                <span className="text-[#8a4add]">///</span> Evidências Visuais
                            </h3>
                            <div className="grid grid-cols-2 gap-4 h-64">
                                <div className="col-span-1 h-full rounded-2xl overflow-hidden relative group">
                                    <img src={gallery[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gallery 1" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                </div>
                                <div className="col-span-1 grid grid-rows-2 gap-4 h-full">
                                    <div className="rounded-2xl overflow-hidden relative group">
                                        <img src={gallery[1]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gallery 2" />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden relative group">
                                        <img src={gallery[2]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gallery 3" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/40 transition-colors">
                                            <span className="text-white font-bold text-sm">+ Ver Galeria</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PartnerDetailView;
