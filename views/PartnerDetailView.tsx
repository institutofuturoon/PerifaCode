
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';

const PartnerDetailView: React.FC = () => {
    const { partnerId } = useParams<{ partnerId: string }>();
    const { partners } = useAppContext();
    const navigate = useNavigate();

    const partner = useMemo(() => partners.find(p => p.id === partnerId), [partners, partnerId]);

    if (!partner) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-2xl font-bold text-white mb-4">Parceiro não encontrado</h2>
                <button onClick={() => navigate('/supporters')} className="text-[#c4b5fd] hover:underline">Voltar para Apoiadores</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090B] pb-20">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-black/20">
                <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#8a4add]/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-[#6d28d9] to-[#8a4add] mb-8 shadow-lg shadow-[#8a4add]/30">
                        <div className="bg-[#121212] rounded-full p-6 w-32 h-32 flex items-center justify-center">
                             <img 
                                src={partner.logoUrl} 
                                alt={partner.name} 
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                        Obrigado, <span className="text-[#c4b5fd]">{partner.name}</span>!
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Parceiro Oficial do Instituto FuturoOn desde <span className="font-bold text-white">{partner.since || '2024'}</span>.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="max-w-4xl mx-auto">
                    {/* Main Content Card */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-[#8a4add]">🏢</span> Sobre a Empresa
                                </h2>
                                <p className="text-gray-300 leading-relaxed">
                                    {partner.description || 'Uma empresa comprometida com a inovação e o desenvolvimento social, apoiando a próxima geração de talentos na tecnologia.'}
                                </p>
                                
                                {partner.websiteUrl && (
                                    <a 
                                        href={partner.websiteUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-[#c4b5fd] font-semibold mt-6 hover:text-white transition-colors group"
                                    >
                                        Visitar site oficial 
                                        <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                                    </a>
                                )}
                            </div>

                            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-green-400">🌱</span> Impacto Gerado
                                </h2>
                                <p className="text-gray-300 text-sm leading-relaxed italic">
                                    "{partner.impactDescription || 'Graças ao apoio contínuo, conseguimos expandir nossas turmas e oferecer infraestrutura de qualidade para nossos alunos.'}"
                                </p>
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Certificado de Parceria</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-sm text-green-400 font-medium">Ativo e Verificado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="mt-12 text-center">
                        <button 
                            onClick={() => navigate('/supporters')}
                            className="text-gray-400 hover:text-white font-semibold transition-colors flex items-center gap-2 mx-auto"
                        >
                            <span className="text-xl">&larr;</span> Voltar para lista de apoiadores
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerDetailView;
