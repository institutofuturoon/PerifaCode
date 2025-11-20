
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';

const MetricCard: React.FC<{ label: string; value: string; icon: React.ReactNode; delay: number }> = ({ label, value, icon, delay }) => (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all duration-500 animate-fade-in group" style={{ animationDelay: `${delay}ms` }}>
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#8a4add] to-[#6d28d9] flex items-center justify-center text-white shadow-lg shadow-[#8a4add]/30 mb-4 group-hover:rotate-12 transition-transform">
            {icon}
        </div>
        <p className="text-3xl font-black text-white mb-1">{value}</p>
        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{label}</p>
    </div>
);

const ShareButton: React.FC<{ platform: 'linkedin' | 'twitter' | 'copy'; url: string; text: string }> = ({ platform, url, text }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        if (platform === 'copy') {
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return;
        }

        const links = {
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        };

        window.open(links[platform], '_blank', 'width=600,height=400');
    };

    const icons = {
        linkedin: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
        twitter: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>,
        copy: copied ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
    };

    return (
        <button 
            onClick={handleShare}
            className={`p-3 rounded-lg border transition-all duration-300 flex items-center gap-2 ${copied ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 text-gray-300 hover:text-white'}`}
            title={platform === 'copy' ? 'Copiar Link' : `Compartilhar no ${platform}`}
        >
            {icons[platform]}
            <span className="text-xs font-semibold capitalize hidden md:inline">{platform === 'copy' ? (copied ? 'Copiado!' : 'Copiar Link') : platform}</span>
        </button>
    );
};

const PartnerDetailView: React.FC = () => {
    const { partnerId } = useParams<{ partnerId: string }>();
    const { partners } = useAppContext();
    const navigate = useNavigate();

    const partner = useMemo(() => partners.find(p => p.id === partnerId), [partners, partnerId]);
    
    const galleryImages = [
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
    ];

    if (!partner) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-2xl font-bold text-white mb-4">Parceiro não encontrado</h2>
                <button onClick={() => navigate('/supporters')} className="text-[#c4b5fd] hover:underline">Voltar para Apoiadores</button>
            </div>
        );
    }

    const shareText = `Orgulho em ver o impacto da parceria entre ${partner.name} e o Instituto FuturoOn! Transformando a educação tecnológica no Brasil. 🚀 #ImpactoSocial #Educação #Tech`;

    const studentTestimonial = {
        text: `A oportunidade que a ${partner.name} proporcionou mudou minha perspectiva de vida. Hoje me sinto capaz de competir no mercado de igual para igual.`,
        author: "Lucas M.",
        role: "Aluno Formado 2024"
    };

    return (
        <div className="min-h-screen bg-[#09090B] pb-20">
            {/* Hero Section - Thank You Focused */}
            <section className="relative pt-32 pb-16 overflow-hidden text-center">
                 <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#8a4add]/10 rounded-full blur-[120px] pointer-events-none"></div>
                 
                 <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span> Parceria Ativa
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
                        Obrigado, <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">{partner.name}</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                        Vocês não apenas financiaram projetos, vocês <span className="text-white font-bold">acreditaram em pessoas</span>. Esta página é uma homenagem ao impacto que construímos juntos.
                    </p>
                 </div>
            </section>

            {/* Partner Seal / Certificate Section - NEW */}
            <section className="container mx-auto px-4 mb-16 relative z-20">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#18181B] to-[#09090B] border border-[#8a4add]/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl shadow-[#8a4add]/10">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983]"></div>
                     <div className="relative z-10 flex flex-col items-center">
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center p-6 mb-6 border-4 border-[#8a4add] shadow-[0_0_40px_rgba(138,74,221,0.2)]">
                             <img src={partner.logoUrl} alt="Partner Logo" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Selo de Parceiro de Impacto {new Date().getFullYear()}</h2>
                        <p className="text-gray-400 max-w-xl mx-auto mb-8 text-sm leading-relaxed">
                            Em reconhecimento à contribuição fundamental da {partner.name} para a democratização da tecnologia no Brasil e formação de novos talentos.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <button className="flex items-center justify-center gap-2 bg-[#8a4add] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#7c3aed] transition-all shadow-lg shadow-[#8a4add]/20 transform hover:scale-105 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Baixar Selo Oficial
                            </button>
                             <button 
                                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                className="flex items-center justify-center gap-2 bg-white/5 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-all border border-white/10 text-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                Compartilhar Conquista
                            </button>
                        </div>
                     </div>
                </div>
            </section>

            {/* Metrics Grid */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard 
                        value="R$ 150k+" 
                        label="Investimento Direto" 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
                        delay={0}
                    />
                     <MetricCard 
                        value="50+" 
                        label="Bolsas Integrais" 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                        delay={100}
                    />
                    <MetricCard 
                        value="30" 
                        label="Equipamentos Doados" 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        delay={200}
                    />
                    <MetricCard 
                        value="120h" 
                        label="Mentoria Voluntária" 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        delay={300}
                    />
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Letter and Student Voice */}
                    <div className="space-y-8">
                        {/* Thank You Letter */}
                        <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 relative">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="bg-[#8a4add]/20 p-1.5 rounded-md text-[#c4b5fd]">✉️</span> 
                                Carta de Agradecimento
                            </h2>
                            <div className="prose prose-invert text-gray-300 leading-relaxed text-base font-light font-serif italic border-l-2 border-[#8a4add]/30 pl-6">
                                <p>
                                    "Prezados amigos da <strong className="text-white not-italic">{partner.name}</strong>,
                                </p>
                                <p>
                                    É com imensa gratidão que reconhecemos o papel fundamental que vocês desempenham na história do Instituto FuturoOn. Desde {partner.since}, sua parceria não tem sido apenas sobre recursos, mas sobre acreditar em sonhos que, muitas vezes, a sociedade insiste em invisibilizar.
                                </p>
                                <p>
                                    Graças ao apoio de vocês, conseguimos ir além das aulas de código. Entregamos esperança, infraestrutura e, acima de tudo, a certeza de que o lugar de origem não define o ponto de chegada.
                                </p>
                                <p>
                                    Obrigado por construírem essa ponte conosco. O futuro é brilhante, e estamos honrados em caminhá-lo ao seu lado."
                                </p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                                <div>
                                    <p className="font-bold text-white text-sm">Thais Santana</p>
                                    <p className="text-[10px] text-[#c4b5fd] uppercase tracking-wide">Fundadora, Instituto FuturoOn</p>
                                </div>
                            </div>
                        </div>

                        {/* Student Voice */}
                        <div className="bg-gradient-to-r from-[#8a4add]/10 to-transparent rounded-2xl p-8 border border-[#8a4add]/30 relative overflow-hidden">
                            <div className="absolute top-4 left-4 text-6xl text-[#8a4add] opacity-10 font-serif">"</div>
                            <div className="relative z-10">
                                <p className="text-lg md:text-xl font-medium text-gray-200 leading-relaxed font-serif italic text-center mb-6">
                                    "{studentTestimonial.text}"
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold text-sm">
                                        {studentTestimonial.author.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white font-bold text-sm">{studentTestimonial.author}</p>
                                        <p className="text-[#c4b5fd] text-xs">{studentTestimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: About & Gallery */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-[#8a4add]">🏢</span> Sobre a Parceria
                            </h2>
                            <div className="prose prose-invert text-gray-300 leading-relaxed bg-white/5 p-6 rounded-xl border border-white/10">
                                <p>{partner.description}</p>
                                <p className="mt-4 pt-4 border-t border-white/10 italic text-gray-400 text-sm">
                                    <span className="text-[#8a4add] font-bold not-italic block mb-1">Impacto Chave:</span>
                                    "{partner.impactDescription}"
                                </p>
                            </div>
                             <div className="mt-4 flex gap-4">
                                <ShareButton platform="linkedin" url={window.location.href} text={shareText} />
                                <ShareButton platform="copy" url={window.location.href} text={shareText} />
                            </div>
                        </div>

                        {/* Visual Storytelling (Momentos) */}
                        <div className="space-y-4">
                             <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <span className="text-[#8a4add]">📸</span> Momentos Juntos
                            </h2>
                            <div className="grid grid-cols-2 gap-4 auto-rows-[120px]">
                                <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group border border-white/10">
                                    <img src={galleryImages[0]} alt="Evento com parceiro" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                                    <p className="absolute bottom-4 left-4 text-white font-bold text-lg">Hackathon 2024</p>
                                </div>
                                <div className="rounded-2xl overflow-hidden relative group border border-white/10">
                                    <img src={galleryImages[1]} alt="Mentoria" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                <div className="rounded-2xl overflow-hidden relative group border border-white/10">
                                    <img src={galleryImages[2]} alt="Workshop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                            </div>
                             {partner.websiteUrl && (
                                 <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#c4b5fd] text-xs font-semibold hover:text-white transition-colors group mt-2">
                                    Visitar site da {partner.name} <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="mt-20 text-center">
                    <button onClick={() => navigate('/supporters')} className="text-gray-500 hover:text-white text-sm font-semibold transition-colors flex items-center gap-2 mx-auto">
                        <span className="text-lg">&larr;</span> Voltar para lista de apoiadores
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PartnerDetailView;
