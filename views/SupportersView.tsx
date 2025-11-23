
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Partner } from '../types';
import { useAppContext } from '../contexts/AppContextAdapter';

// --- Components for Partners (Companies) ---

const PartnerCard: React.FC<{ partner: Partner; onClick: () => void }> = ({ partner, onClick }) => (
    <div 
        onClick={onClick}
        className="group relative bg-[#121212] border border-white/10 rounded-xl p-6 flex items-center justify-center h-40 cursor-pointer transition-all duration-300 hover:border-[#8a4add]/50 hover:shadow-lg hover:shadow-[#8a4add]/10"
    >
        <img 
            src={partner.logoUrl} 
            alt={partner.name} 
            className="max-w-[80%] max-h-[70%] object-contain opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" 
        />
        <div className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#c4b5fd] font-semibold uppercase tracking-wider">
            Ver Detalhes
        </div>
    </div>
);

const SupportersView: React.FC = () => {
    const navigate = useNavigate();
    const { partners } = useAppContext();

    return (
        <div className="bg-[#09090B] min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 text-center overflow-hidden">
                 <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#8a4add]/10 rounded-full blur-[120px] pointer-events-none"></div>
                 
                 <div className="container mx-auto px-4 relative z-10">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-[#8a4add]/10 border border-[#8a4add]/20 text-[#c4b5fd] text-xs font-bold uppercase tracking-widest mb-6">
                        Rede de Impacto
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 leading-tight">
                        Quem torna o futuro <br/>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">Possível?</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed mb-10">
                        Empresas visionárias que investem na transformação social através da tecnologia. Juntas, estamos construindo pontes para novos talentos.
                    </p>
                 </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-4 pb-24 relative z-10">
                <div className="max-w-6xl mx-auto animate-fade-in">
                    
                    {partners.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {partners.map(p => (
                                <PartnerCard 
                                    key={p.id} 
                                    partner={p} 
                                    onClick={() => navigate(`/supporter/${p.id}`)}
                                />
                            ))}
                            
                            {/* "Your Brand Here" Card */}
                            <a href="mailto:parcerias@institutofuturoon.org" className="bg-[#121212] border border-dashed border-white/20 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-[#8a4add]/50 hover:bg-white/5 transition-all group">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#8a4add]/20 transition-colors">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-[#c4b5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                </div>
                                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">
                                    Sua Marca Aqui
                                </span>
                            </a>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-gray-400">Nenhuma empresa parceira cadastrada no momento.</p>
                        </div>
                    )}

                    <div className="mt-24 text-center bg-gradient-to-b from-transparent to-[#121212] pt-12 pb-8 rounded-3xl border-t border-white/5">
                            <p className="text-xl md:text-2xl font-serif italic text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
                            "Empresas que investem no FuturoOn não estão apenas fazendo doações. Estão contratando o futuro e acelerando a inovação dentro de seus próprios times."
                        </p>
                        <a 
                            href="mailto:parcerias@institutofuturoon.org"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#8a4add] text-white font-bold rounded-lg hover:bg-[#7c3aed] transition-all shadow-lg shadow-[#8a4add]/20 transform hover:scale-105"
                        >
                            Seja um Parceiro Corporativo
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SupportersView;
