
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import SimplifiedTimeline from '../components/SimplifiedTimeline';
import TeamMemberPreviewCard from '../components/TeamMemberPreviewCard';

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
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-center transform transition-transform duration-300 hover:-translate-y-1 h-full flex flex-col items-center">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[#6d28d9] to-[#8a4add] text-white mb-3 shadow-lg shadow-[#8a4add]/20">
                {icon}
            </div>
            <p className="text-3xl font-black text-white">
                <AnimatedNumber finalStat={stat} />
            </p>
            <p className="mt-1 text-xs font-semibold text-white uppercase tracking-wider">{title}</p>
            <p className="mt-1 text-[10px] text-gray-400">{text}</p>
        </div>
    );
};

const PartnerLogo: React.FC<{ name: string; logoUrl: string }> = ({ name, logoUrl }) => (
    <div className="flex-shrink-0 w-32 flex items-center justify-center p-3 bg-black/20 rounded-lg border border-white/10 group transition-all duration-300 transform hover:bg-white/5 hover:shadow-lg hover:shadow-[#8a4add]/10 hover:scale-105 hover:border-white/20">
        <img 
            src={logoUrl} 
            alt={name} 
            className="h-8 max-w-full object-contain transition-all duration-300 opacity-70 group-hover:opacity-100"
        />
    </div>
);


const Home: React.FC = () => {
  const { partners, team } = useAppContext();
  const navigate = useNavigate();
  
  const impactData = [
    { stat: "+300", title: "Jovens Formados", text: "Capacitados em tecnologia", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7" /></svg> },
    { stat: "+50", title: "Turmas", text: "Do online ao presencial", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { stat: "+14", title: "Voluntários", text: "Profissionais dedicados", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { stat: `+${partners.length}`, title: "Parceiros", text: "Empresas que apoiam", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 01 1v5m-4 0h4" /></svg> },
  ];
  
  const teamPreview = useMemo(() => {
    const visibleTeam = team.filter(member => member.showOnTeamPage);
    
    // Fisher-Yates (aka Knuth) Shuffle
    const shuffled = [...visibleTeam];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, 4);
  }, [team]);

  return (
    <>
        {/* Hero Section */}
        <section className="py-12 md:py-20 text-center relative z-10 bg-grid-pattern">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
              Seu futuro na tecnologia<br />
              começa <span className="text-[#c4b5fd]">na quebrada.</span>
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-sm md:text-base text-gray-300 leading-relaxed">
              Acreditamos no seu potencial. Nossa missão é abrir as portas do mercado de tecnologia para talentos da periferia.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-2 px-5 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30 text-sm"
              >
                Inscreva-se Grátis
              </button>
              <button
                onClick={() => navigate('/donate')}
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-2 px-5 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm"
              >
                Faça uma Doação
              </button>
            </div>
          </div>
        </section>
        
        {/* Quem Somos Section */}
        <section className="py-10 relative z-10 border-b border-white/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">Quem Somos</h2>
                <div className="w-12 h-1 bg-[#8a4add] mx-auto mt-3 mb-4"></div>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  O Instituto FuturoON é um projeto social, no Complexo da Coruja, em São Gonçalo, que leva <strong className="text-[#c4b5fd]">educação e tecnologia</strong> para jovens e adultos da periferia.
                </p>
                <div className="mt-4">
                    <button onClick={() => navigate('/about')} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-1.5 px-4 rounded-lg hover:bg-white/20 transition-all duration-300 text-xs">
                        Conheça nossa história
                    </button>
                </div>
            </div>
        </section>

        {/* Social Impact Section */}
        <section className="py-10 bg-black/20 relative z-10" style={{backgroundImage: 'radial-gradient(circle at center, #8a4add10, transparent 60%)'}}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">Nosso Impacto</h2>
                <p className="max-w-xl mx-auto text-sm text-gray-300 mt-2">Mudando vidas e reescrevendo o futuro.</p>
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
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

        {/* Simplified Timeline Section */}
        <section className="py-10 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">Nossa Jornada</h2>
                </div>
                <div className="mt-8">
                  <SimplifiedTimeline />
                </div>
            </div>
        </section>

        {/* Team Preview Section */}
        <section className="py-10 bg-black/20 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">Nossa Tropa</h2>
                    <p className="mt-2 text-sm text-gray-300">Os rostos por trás da missão.</p>
                </div>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {teamPreview.map(member => (
                        <TeamMemberPreviewCard key={member.id} member={member} />
                    ))}
                </div>
                 <div className="text-center mt-6">
                     <button onClick={() => navigate('/team')} className="text-xs font-semibold text-[#c4b5fd] hover:text-white">
                        Ver equipe completa &rarr;
                    </button>
                </div>
            </div>
        </section>

        {/* Nossos Parceiros Section */}
        <section className="py-10 relative z-10 border-t border-white/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white">Apoiadores</h2>
                </div>
                <div className="relative opacity-80">
                    <div className="marquee">
                        <div className="marquee-content gap-8">
                            {partners.map(partner => (
                                <PartnerLogo key={partner.id} name={partner.name} logoUrl={partner.logoUrl} />
                            ))}
                            {partners.map(partner => (
                                <PartnerLogo key={`${partner.id}-clone`} name={partner.name} logoUrl={partner.logoUrl} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* CTA Donate Section */}
        <section className="py-12 bg-black/20 relative z-10" style={{backgroundImage: 'radial-gradient(circle at center, #8a4add10, transparent 60%)'}}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                    Apoie essa causa
                </h2>
                <p className="mt-3 max-w-xl mx-auto text-sm text-gray-300 leading-relaxed">
                    Invista no futuro. Ajude a impulsionar a juventude por meio da educação digital.
                </p>
                <div className="mt-6">
                    <button
                        onClick={() => navigate('/donate')}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30 text-sm"
                    >
                        <span>Faça sua doação</span>
                    </button>
                </div>
            </div>
        </section>
    </>
  );
};

export default Home;
