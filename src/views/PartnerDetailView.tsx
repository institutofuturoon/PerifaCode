
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';

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

    const partner = useMemo(() => partners.find(p => p.id === partnerId), [partners, partnerId]);

    // Mock gallery data for visuals
    const gallery = [
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
    ];

    if (!partner) {
        return (
            <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-white mb-4">Dados confidencias não encontrados.</h2>
                <button onClick={() => navigate('/apoiadores')} className="text-[#c4b5fd] hover:underline">Retornar à Base</button>
            </div>
        );
    }

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
