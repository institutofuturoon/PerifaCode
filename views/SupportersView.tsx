
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Partner } from '../types';
import { useAppContext } from '../App';
import Badge from '../components/Badge';

// --- Micro Components ---

const VisionaryCard: React.FC<{ partner: Partner; onClick: () => void }> = ({ partner, onClick }) => (
    <div 
        onClick={onClick}
        className="group relative w-full bg-[#121214] border border-white/10 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_-12px_rgba(138,74,221,0.5)]"
    >
        {/* Glowing Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#8a4add]/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#8a4add]/30 transition-colors"></div>

        <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
                <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <img src={partner.logoUrl} alt={partner.name} className="h-12 w-auto object-contain" />
                </div>
                <span className="px-3 py-1 rounded-full border border-[#c4b5fd]/30 text-[#c4b5fd] text-[10px] font-bold uppercase tracking-widest bg-[#8a4add]/10 backdrop-blur-sm">
                    Visionário
                </span>
            </div>
            
            <h3 className="text-3xl font-black text-white mb-4 group-hover:text-[#c4b5fd] transition-colors">
                {partner.name}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-8 flex-grow">
                {partner.description}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Impacto</span>
                    <span className="text-white text-sm font-medium truncate max-w-[200px]">{partner.impactDescription ? partner.impactDescription.slice(0, 30) + '...' : 'Transformando vidas'}</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#8a4add] group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
            </div>
        </div>
    </div>
);

const EcosystemNode: React.FC<{ partner: Partner; onClick: () => void }> = ({ partner, onClick }) => (
    <div 
        onClick={onClick}
        className="group relative bg-black/40 border border-white/5 hover:border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center aspect-square cursor-pointer transition-all duration-300 hover:bg-white/5"
    >
        <img 
            src={partner.logoUrl} 
            alt={partner.name} 
            className="h-12 w-auto object-contain opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 mb-4"
        />
        <p className="text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 absolute bottom-4">
            Ver Perfil
        </p>
    </div>
);

const ManifestoItem: React.FC<{ number: string; title: string; text: string }> = ({ number, title, text }) => (
    <div className="flex gap-6 items-start p-6 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#8a4add] to-transparent opacity-50">{number}</span>
        <div>
            <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
        </div>
    </div>
);

const SupportersView: React.FC = () => {
    const navigate = useNavigate();
    const { partners } = useAppContext();

    // Split partners into tiers for visual hierarchy
    const visionaryPartners = useMemo(() => partners.slice(0, 2), [partners]);
    const builderPartners = useMemo(() => partners.slice(2, 5), [partners]);
    const ecosystemPartners = useMemo(() => partners.slice(5), [partners]);

    return (
        <div className="bg-[#09090B] min-h-screen overflow-x-hidden">
            
            {/* Hero Section - Gamified/Space Theme */}
            <section className="relative pt-32 pb-20 px-4">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2e1065] via-[#09090B] to-[#09090B] pointer-events-none"></div>
                <div className="container mx-auto relative z-10 text-center">
                    <Badge text="Hall of Fame" variant="default" className="mb-8" />
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6">
                        ALIANÇA <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8a4add] via-[#c4b5fd] to-[#f27983]">DO FUTURO</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed">
                        Estas são as organizações que estão abastecendo o foguete. Elas não apenas doam; elas co-criam o futuro da tecnologia na periferia.
                    </p>
                </div>
            </section>

            {/* Tier 1: The Visionaries (Featured Large Cards) */}
            <section className="py-16 px-4 relative z-10">
                <div className="container mx-auto">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#8a4add]/50"></div>
                        <h2 className="text-sm font-bold text-[#c4b5fd] uppercase tracking-[0.2em]">Parceiros Visionários</h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#8a4add]/50"></div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {visionaryPartners.map(p => (
                            <VisionaryCard key={p.id} partner={p} onClick={() => navigate(`/supporter/${p.id}`)} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Manifesto / Why Section - Storytelling */}
            <section className="py-24 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5 pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                Por que eles <br/>
                                <span className="text-[#8a4add]">investem aqui?</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8">
                                Não é caridade. É estratégia. Nossos parceiros entendem que a diversidade é o motor da inovação real.
                            </p>
                            <button 
                                onClick={() => navigate('/partnerships')}
                                className="group flex items-center gap-3 text-white font-bold border-b border-[#8a4add] pb-1 hover:text-[#c4b5fd] transition-colors"
                            >
                                Quero fazer parte dessa rede <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
                            </button>
                        </div>
                        <div className="grid gap-4">
                            <ManifestoItem number="01" title="Talento Bruto" text="Acesso a mentes criativas e resilientes que o mercado tradicional ignora." />
                            <ManifestoItem number="02" title="Impacto Real" text="Resultados tangíveis: empregabilidade, renda e transformação local." />
                            <ManifestoItem number="03" title="Cultura Maker" text="Nossos alunos aprendem fazendo. Eles chegam nas empresas prontos para codar." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Tier 2: The Builders (Mid Cards) */}
            {builderPartners.length > 0 && (
                <section className="py-20 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <h3 className="text-center text-2xl font-bold text-white mb-12">Construtores do Ecossistema</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {builderPartners.map(p => (
                                <div 
                                    key={p.id} 
                                    onClick={() => navigate(`/supporter/${p.id}`)}
                                    className="bg-[#18181b] p-6 rounded-2xl border border-white/5 hover:border-[#8a4add]/30 transition-all cursor-pointer group"
                                >
                                    <img src={p.logoUrl} className="h-8 w-auto mb-6 grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100" alt={p.name} />
                                    <h4 className="text-white font-bold text-lg mb-2">{p.name}</h4>
                                    <p className="text-gray-500 text-xs line-clamp-2">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Tier 3: Ecosystem (Grid of Logos) */}
            <section className="py-20 px-4 bg-[#09090B]">
                <div className="container mx-auto max-w-5xl">
                    <p className="text-center text-gray-500 text-sm uppercase tracking-widest mb-10 font-bold">Rede de Apoio & Colaboradores</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {ecosystemPartners.map(p => (
                            <EcosystemNode key={p.id} partner={p} onClick={() => navigate(`/supporter/${p.id}`)} />
                        ))}
                        {/* "Add Your Logo" Node */}
                        <a 
                            href="mailto:parcerias@institutofuturoon.org"
                            className="group border border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-white/5 hover:border-[#8a4add]/50 transition-all"
                        >
                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#c4b5fd] group-hover:bg-[#8a4add]/20 mb-2 transition-colors">
                                +
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase text-center">Sua Marca</p>
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-32 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#8a4add]/10 to-transparent pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                        Pronto para <br/> o lançamento?
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={() => navigate('/partnerships')}
                            className="px-8 py-4 bg-[#8a4add] text-white font-bold rounded-xl hover:bg-[#7c3aed] transition-all shadow-[0_0_30px_rgba(138,74,221,0.4)] hover:shadow-[0_0_50px_rgba(138,74,221,0.6)] transform hover:-translate-y-1"
                        >
                            Torne-se um Parceiro
                        </button>
                        <button 
                            onClick={() => navigate('/donate')}
                            className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                        >
                            Fazer Doação Pontual
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default SupportersView;
