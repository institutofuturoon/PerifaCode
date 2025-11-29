
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import SimplifiedTimeline from '../components/SimplifiedTimeline';
import TeamMemberPreviewCard from '../components/TeamMemberPreviewCard';
import SEO from '../components/SEO';
import { Partner, User } from '../types';
import Badge from '../components/Badge';

const AnimatedNumber: React.FC<{ finalStat: string; duration?: number }> = ({ finalStat, duration = 2000 }) => {
  const [currentValue, setCurrentValue] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);

  const endValue = parseInt(finalStat.replace(/\D/g, ''), 10);
  const prefix = finalStat.match(/^\D*/)?.[0] || '';
  const suffix = finalStat.match(/\D*$/)?.[0] || '';


  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime: number | null = null;
          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const animatedValue = Math.floor(percentage * endValue);
            
            setCurrentValue(animatedValue);

            if (progress < duration) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
        if(ref.current) {
            observer.unobserve(ref.current);
        }
    };
  }, [endValue, duration]);

  return <span ref={ref}>{prefix}{currentValue.toLocaleString('pt-BR')}{suffix}</span>;
};


const ImpactCard: React.FC<{ icon: React.ReactNode, stat: string; title: string; text: string; }> = ({ icon, stat, title, text }) => {
    return (
        <div className="bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-white/10 text-center transform transition-transform duration-300 hover:-translate-y-2 h-full flex flex-col items-center hover:border-[#8a4add]/30 hover:shadow-2xl hover:shadow-[#8a4add]/10">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-[#6d28d9] to-[#8a4add] text-white mb-4 shadow-lg shadow-[#8a4add]/20">
                <div className="transform scale-110">{icon}</div>
            </div>
            <p className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                <AnimatedNumber finalStat={stat} />
            </p>
            <p className="text-sm font-bold text-white uppercase tracking-wider mb-2">{title}</p>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{text}</p>
        </div>
    );
};

const PartnerLogo: React.FC<{ name: string; logoUrl: string }> = ({ name, logoUrl }) => (
    <div className="relative flex-shrink-0 w-40 h-24 md:w-64 md:h-36 flex items-center justify-center p-3 md:p-4 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 group transition-all duration-500 transform hover:scale-110 hover:border-[#8a4add]/40 overflow-hidden">
        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#8a4add]/10 via-transparent to-[#f27983]/10 blur-xl"></div>
        
        {/* Logo - ocupa todo o espaço disponível */}
        <img 
            src={logoUrl} 
            alt={name} 
            className="relative z-10 w-full h-full object-contain transition-all duration-500 opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 filter drop-shadow-lg"
        />
    </div>
);

const PartnerCarousel: React.FC<{ partners: Partner[] }> = ({ partners }) => {
    if (partners.length === 0) return null;

    // Usamos CSS puro para a animação infinita com duplicação do conteúdo
    // As classes animate-infinite-scroll são definidas no index.html / tailwind.config
    return (
        <div 
            className="relative w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]" 
            aria-label="Galeria de Parceiros"
            role="region"
        >
            {/* Lista Original */}
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
                {partners.map((partner) => (
                    <li key={partner.id}>
                       <PartnerLogo name={partner.name} logoUrl={partner.logoUrl} />
                    </li>
                ))}
            </ul>
            {/* Lista Duplicada para Loop Infinito */}
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
                {partners.map((partner) => (
                    <li key={`${partner.id}-duplicate`}>
                       <PartnerLogo name={partner.name} logoUrl={partner.logoUrl} />
                    </li>
                ))}
            </ul>
        </div>
    )
}


const Home: React.FC = () => {
  const { partners, team, loadData } = useAppContext();
  const navigate = useNavigate();
  const [teamPreview, setTeamPreview] = useState<User[]>([]);
  const [hasShuffled, setHasShuffled] = useState(false); // A TRAVA: Garante que só roda 1 vez

  useEffect(() => {
      loadData(['partners', 'users']); // Users needed for team preview
  }, [loadData]);
  
  // Randomize team on mount AND ensure it stops
  useEffect(() => {
    // Se já embaralhou ou não tem dados, PARE.
    if (hasShuffled || team.length === 0) return;

    const visibleTeam = team.filter(member => member.showOnTeamPage);
    
    // Fisher-Yates shuffle para garantir aleatoriedade total
    const shuffled = [...visibleTeam];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Seleciona os 4 primeiros
    setTeamPreview(shuffled.slice(0, 4));
    
    // ATIVA A TRAVA
    setHasShuffled(true);

  }, [team, hasShuffled]); 

  const impactData = [
    { stat: "+300", title: "Jovens Formados", text: "Capacitados em tecnologia", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7" /></svg> },
    { stat: "+50", title: "Turmas", text: "Do online ao presencial", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { stat: "+14", title: "Voluntários", text: "Profissionais dedicados", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { stat: `+${partners.length}`, title: "Parceiros", text: "Empresas que apoiam", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
  ];

  // JSON-LD para Organização (SEO)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "Instituto FuturoOn",
    "url": window.location.origin,
    "logo": "https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/varied/futuroon-logo.svg",
    "foundingDate": "2021",
    "description": "ONG dedicada ao ensino de tecnologia e desenvolvimento profissional para jovens de comunidades periféricas.",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rua Silva Jardim, 689",
        "addressLocality": "São Gonçalo",
        "addressRegion": "RJ",
        "postalCode": "24440-000",
        "addressCountry": "BR"
    },
    "areaServed": {
        "@type": "City",
        "name": "São Gonçalo"
    },
    "sameAs": [
        "https://www.instagram.com/futuro.on/",
        "https://www.linkedin.com/company/instituto-futuroon/"
    ],
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+55-21-97087-2194",
        "contactType": "customer support",
        "email": "futurooon@gmail.com"
    }
  };

  return (
    <>
        <SEO 
            title="FuturoOn | Escola de Tecnologia Gratuita na Periferia" 
            description="ONG em São Gonçalo/RJ oferecendo cursos gratuitos de programação (React, Node.js), design e robótica. Transformando vidas através da inclusão digital."
            keywords={['tecnologia', 'periferia', 'cursos gratuitos', 'programação', 'ong', 'inclusão digital', 'São Gonçalo', 'React', 'Desenvolvimento Web']}
            jsonLd={organizationSchema}
        />
        {/* Hero Section - Ajustado para maior impacto, com responsividade mobile */}
        <section className="py-20 md:py-32 text-center relative z-10 bg-grid-pattern">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Badge text="Matrículas Abertas" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight max-w-5xl mx-auto">
              Seu futuro na tecnologia<br />
              começa <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">na quebrada.</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-base md:text-xl text-gray-300 leading-relaxed px-4 md:px-0">
              Acreditamos no seu potencial. Nossa missão é abrir as portas do mercado de tecnologia para talentos da periferia, com educação de qualidade e gratuita.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_-5px_rgba(138,74,221,0.5)] text-base md:text-lg"
              >
                Inscreva-se Grátis
              </button>
              <button
                onClick={() => navigate('/donate')}
                className="w-full sm:w-auto bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-all duration-300 text-base md:text-lg"
              >
                Faça uma Doação
              </button>
            </div>
          </div>
        </section>
        
        {/* Quem Somos Section - Ajustado Padding */}
        <section className="py-16 md:py-24 relative z-10 border-b border-white/5 bg-black/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Quem Somos</h2>
                <div className="w-20 h-1.5 bg-[#8a4add] mx-auto mt-4 mb-6 rounded-full"></div>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                  O Instituto FuturoON é um projeto social, no Complexo da Coruja, em São Gonçalo, que leva <strong className="text-[#c4b5fd] font-bold">educação e tecnologia</strong> para jovens e adultos da periferia. Não somos apenas uma escola, somos uma comunidade que impulsiona sonhos.
                </p>
                <div>
                    <button onClick={() => navigate('/about')} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-white/20 transition-all duration-300 text-sm uppercase tracking-wide">
                        Conheça nossa história &rarr;
                    </button>
                </div>
            </div>
        </section>

        {/* Social Impact Section - Cards Maiores */}
        <section className="py-16 md:py-24 bg-black/20 relative z-10" style={{backgroundImage: 'radial-gradient(circle at center, #8a4add08, transparent 70%)'}}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">Nosso Impacto</h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-12">Números que representam vidas transformadas e novos futuros escritos.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {impactData.map((item, index) => (
                        <ImpactCard 
                            key={index}
                            icon={item.icon}
                            stat={item.stat}
                            title={item.title}
                            text={item.text}
                        />
                    ))}
                </div>
            </div>
        </section>

        {/* Simplified Timeline Section - Ajustado */}
        <section className="py-16 md:py-24 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Nossa Jornada</h2>
                    <p className="mt-4 text-lg text-gray-400">Passo a passo, construindo um legado.</p>
                </div>
                <div className="mt-6 max-w-6xl mx-auto">
                  <SimplifiedTimeline />
                </div>
            </div>
        </section>

        {/* Team Preview Section - Responsivo: 1 col mobile, 2 col tablet, 4 col desktop */}
        <section className="py-16 md:py-24 bg-black/20 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Nossa Tropa</h2>
                    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">Os mentores, instrutores e voluntários que fazem a mágica acontecer todos os dias.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4 sm:px-0">
                    {teamPreview.length > 0 ? teamPreview.map(member => (
                        <TeamMemberPreviewCard key={member.id} member={member} />
                    )) : (
                        <p className="text-center text-gray-500 col-span-full">Carregando a tropa...</p>
                    )}
                </div>
                 <div className="text-center mt-12">
                     <button onClick={() => navigate('/team')} className="text-sm font-bold text-[#c4b5fd] hover:text-white uppercase tracking-widest border-b border-[#c4b5fd] hover:border-white pb-1 transition-all">
                        Ver equipe completa
                    </button>
                </div>
            </div>
        </section>

        {/* Nossos Parceiros Section - Design Melhorado */}
        <section className="py-20 md:py-32 relative z-10 overflow-hidden">
            {/* Background com gradiente e efeitos */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#8a4add]/5 to-black/20"></div>
            <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(138, 74, 221, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(242, 121, 131, 0.08) 0%, transparent 50%)'
            }}></div>
            
            {/* Linha decorativa superior */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8a4add]/30 to-transparent"></div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header da seção */}
                <div className="text-center mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8a4add]/10 border border-[#8a4add]/20 mb-6">
                        <svg className="w-4 h-4 text-[#8a4add]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-bold text-[#8a4add] uppercase tracking-wider">Nossos Parceiros</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                        Apoiadores
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Empresas e organizações que acreditam no poder da educação e tornam este sonho possível
                    </p>
                </div>
                
                {/* Carrossel de logos */}
                <div className="relative mb-16">
                    <PartnerCarousel partners={partners} />
                </div>

                {/* CTA melhorado */}
                <div className="text-center">
                    <button 
                        onClick={() => navigate('/supporters')} 
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#6d28d9] to-[#8a4add] rounded-full text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:shadow-[#8a4add]/40 hover:scale-105 overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                        <span className="relative">Ver todos os parceiros</span>
                        <svg className="relative w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                    
                    {/* Texto adicional */}
                    <p className="text-sm text-gray-500 mt-6">
                        Quer fazer parte dessa transformação? 
                        <button 
                            onClick={() => navigate('/partnerships')} 
                            className="text-[#8a4add] hover:text-[#c4b5fd] font-semibold ml-2 underline decoration-[#8a4add]/30 hover:decoration-[#8a4add] transition-colors"
                        >
                            Seja um parceiro
                        </button>
                    </p>
                </div>
            </div>
            
            {/* Linha decorativa inferior */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8a4add]/30 to-transparent"></div>
        </section>

        {/* CTA Donate Section - Ajustado Padding Mobile */}
        <section className="py-16 md:py-20 bg-black/20 relative z-10" style={{backgroundImage: 'radial-gradient(circle at center, #8a4add15, transparent 70%)'}}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white mb-6">
                    Apoie essa causa
                </h2>
                <p className="mb-10 max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                    Invista no futuro. Sua contribuição ajuda a impulsionar a juventude por meio da educação digital.
                </p>
                <div>
                    <button
                        onClick={() => navigate('/donate')}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-4 px-10 rounded-2xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(138,74,221,0.6)] text-lg"
                    >
                        <span>Faça sua doação agora</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
                    </button>
                </div>
            </div>
        </section>
    </>
  );
};

export default Home;
