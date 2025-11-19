
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SUPPORTERS } from '../constants';
import { Supporter } from '../types';

const VisionaryCard: React.FC<{ supporter: Supporter }> = ({ supporter }) => (
    <div className="relative group p-1 rounded-2xl bg-gradient-to-br from-[#8a4add] via-[#6d28d9] to-[#f27983]">
        <div className="bg-[#09090B] rounded-2xl p-6 h-full flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#8a4add]/20 to-transparent opacity-50"></div>
            <div className="relative z-10">
                <div className="inline-block p-1 rounded-full bg-gradient-to-r from-[#8a4add] to-[#f27983] mb-4 shadow-[0_0_30px_rgba(138,74,221,0.5)]">
                    <img src={supporter.avatarUrl} alt={supporter.name} className="w-24 h-24 rounded-full object-cover border-4 border-[#09090B]" />
                </div>
                <div className="mb-2">
                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fcd34d]/20 text-[#fcd34d] text-[10px] font-bold uppercase tracking-wider border border-[#fcd34d]/30">
                        👑 Visionário
                    </span>
                </div>
                <h3 className="text-xl font-bold text-white">{supporter.name}</h3>
                <p className="text-[#c4b5fd] text-xs font-medium mb-4">{supporter.role}</p>
                <div className="relative">
                    <span className="text-4xl text-white/10 absolute -top-4 -left-2">“</span>
                    <p className="text-gray-300 text-sm italic leading-relaxed relative z-10 px-2">
                        {supporter.message}
                    </p>
                    <span className="text-4xl text-white/10 absolute -bottom-6 -right-2">”</span>
                </div>
                <p className="text-gray-600 text-[10px] mt-6 uppercase tracking-widest">Apoiador desde {supporter.since}</p>
            </div>
        </div>
    </div>
);

const BuilderCard: React.FC<{ supporter: Supporter }> = ({ supporter }) => (
    <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#8a4add]/50 rounded-xl p-4 flex items-center gap-4 transition-all duration-300 group">
        <img src={supporter.avatarUrl} alt={supporter.name} className="w-12 h-12 rounded-full object-cover border border-white/20 group-hover:scale-110 transition-transform" />
        <div>
            <h4 className="font-bold text-white text-sm">{supporter.name}</h4>
            <p className="text-gray-400 text-xs">{supporter.role}</p>
        </div>
        <div className="ml-auto">
             <span className="text-gray-600 text-[10px] font-mono">{supporter.since}</span>
        </div>
    </div>
);

const AllyBadge: React.FC<{ supporter: Supporter }> = ({ supporter }) => (
    <div className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-full px-3 py-1.5 transition-colors cursor-default">
        <div className="w-2 h-2 rounded-full bg-[#8a4add]"></div>
        <span className="text-gray-300 text-xs font-medium">{supporter.name}</span>
    </div>
);


const SupportersView: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSupporters = useMemo(() => {
        if (!searchTerm) return MOCK_SUPPORTERS;
        return MOCK_SUPPORTERS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    const visionaries = filteredSupporters.filter(s => s.tier === 'visionary');
    const builders = filteredSupporters.filter(s => s.tier === 'builder');
    const allies = filteredSupporters.filter(s => s.tier === 'ally');

    return (
        <div className="bg-[#09090B] min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 text-center overflow-hidden">
                 <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8a4add]/10 rounded-full blur-[120px] pointer-events-none"></div>
                 
                 <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
                        Mural dos <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">Visionários</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-10">
                        Esta página é dedicada àqueles que não apenas acreditam no futuro, mas ajudam a construí-lo. Obrigado por transformar vidas através da tecnologia.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto relative">
                        <input 
                            type="text" 
                            placeholder="Buscar por nome..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-3 pl-12 pr-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8a4add] transition-all"
                        />
                        <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                 </div>
            </section>

            <div className="container mx-auto px-4 pb-24 space-y-20">
                
                {/* Visionaries Tier */}
                {visionaries.length > 0 && (
                    <section className="animate-fade-in">
                        <div className="flex items-center justify-center gap-4 mb-10">
                            <div className="h-px bg-gradient-to-r from-transparent to-white/20 w-24"></div>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <span className="text-2xl">👑</span> Visionários
                            </h2>
                            <div className="h-px bg-gradient-to-l from-transparent to-white/20 w-24"></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {visionaries.map(s => <VisionaryCard key={s.id} supporter={s} />)}
                        </div>
                    </section>
                )}

                {/* Builders Tier */}
                {builders.length > 0 && (
                    <section className="animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-300 uppercase tracking-widest text-center mb-8 flex items-center justify-center gap-2">
                            <span>🧱</span> Construtores
                        </h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                            {builders.map(s => <BuilderCard key={s.id} supporter={s} />)}
                        </div>
                    </section>
                )}

                {/* Allies Tier */}
                {allies.length > 0 && (
                    <section className="animate-fade-in max-w-5xl mx-auto text-center">
                        <h2 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-8 flex items-center justify-center gap-2">
                            <span>🤝</span> Aliados
                        </h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            {allies.map(s => <AllyBadge key={s.id} supporter={s} />)}
                        </div>
                    </section>
                )}
                
                {filteredSupporters.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Nenhum apoiador encontrado com esse nome.</p>
                    </div>
                )}

                {/* CTA */}
                <section className="mt-20 bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/20 rounded-2xl p-12 text-center border border-white/10 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-4">Seu nome também pode estar aqui</h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Junte-se à nossa comunidade de apoiadores e ajude a levar educação tecnológica para quem mais precisa. Todo apoio conta.
                        </p>
                        <button 
                            onClick={() => navigate('/donate')}
                            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            Quero Apoiar
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default SupportersView;
