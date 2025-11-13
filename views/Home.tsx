import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import SimplifiedTimeline from '../components/SimplifiedTimeline';
import TeamMemberPreviewCard from '../components/TeamMemberPreviewCard';

const AnimatedNumber: React.FC<{ finalStat: string; duration?: number }> = ({ finalStat, duration = 2000 }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  const endValue = parseInt(finalStat.replace(/\D/g, ''), 10);
  const prefix = finalStat.match(/^\D*/)?.[0] || '';
  const suffix = finalStat.match(/\D*$/)?.[0] || '';


  useEffect(() => {
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
        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-center transform transition-transform duration-300 hover:-translate-y-2 h-full flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#6d28d9] to-[#8a4add] text-white mb-6 shadow-lg shadow-[#8a4add]/20">
                {icon}
            </div>
            <p className="text-5xl font-black text-white">
                <AnimatedNumber finalStat={stat} />
            </p>
            <p className="mt-2 text-lg font-semibold text-white uppercase tracking-wider">{title}</p>
            <p className="mt-1 text-sm text-gray-400">{text}</p>
        </div>
    );
};

const PartnerLogo: React.FC<{ name: string; logoUrl: string }> = ({ name, logoUrl }) => (
    <div className="flex-shrink-0 w-48 flex items-center justify-center p-6 bg-black/20 rounded-lg border border-white/10 group transition-all duration-300 transform hover:bg-white/5 hover:shadow-lg hover:shadow-[#8a4add]/10 hover:scale-105 hover:border-white/20">
        <img 
            src={logoUrl} 
            alt={name} 
            className="h-16 max-w-full object-contain transition-all duration-300"
        />
    </div>
);


const Home: React.FC = () => {
  const { partners, team } = useAppContext();
  const navigate = useNavigate();
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (docHeight > 0) {
            const scrolled = (scrollTop / docHeight) * 100;
            setScrollPercentage(scrolled);
        } else {
            setScrollPercentage(0);
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const impactData = [
    { stat: "+300", title: "Jovens Formados", text: "Capacitados em tecnologia e prontos para o mercado", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7" /></svg> },
    { stat: "+50", title: "Turmas Concluídas", text: "Cursos finalizados com sucesso, do online ao presencial", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { stat: "+14", title: "Voluntários Ativos", text: "Profissionais que dedicam tempo e talento para ensinar", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { stat: `+${partners.length}`, title: "Parceiros Estratégicos", text: "Empresas que apoiam e acreditam na nossa missão", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
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
    <div className="aurora-background text-white">
      <div 
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-[#8a4add] to-[#f27983] z-[60] transition-all duration-75 ease-out"
        style={{ width: `${scrollPercentage}%` }}
      />
      <main>
        {/* Hero Section */}
        <section className="py-32 md:py-48 text-center relative z-10 bg-grid-pattern">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
              Seu futuro na tecnologia<br />
              começa <span className="text-[#c4b5fd]">na quebrada.</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
              Acreditamos no seu potencial. Nossa missão é abrir as portas do mercado de tecnologia para talentos da periferia, com educação de ponta, comunidade e oportunidades reais.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30"
              >
                Inscreva-se Grátis
              </button>
              <button
                onClick={() => navigate('/donate')}
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                Faça uma Doação
              </button>
            </div>
          </div>
        </section>
        
        {/* Quem Somos Section */}
        <section className="py-24 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Quem Somos</h2>
                <div className="w-24 h-1 bg-[#8a4add] mx-auto mt-4 mb-6"></div>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  O Instituto FuturoON é um projeto social, no Complexo da Coruja, em São Gonçalo, que leva <strong className="text-[#c4b5fd]">educação e tecnologia</strong> para jovens e adultos da periferia.
                </p>
                <div className="mt-8">
                    <button onClick={() => navigate('/about')} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-300">
                        Conheça nossa história
                    </button>
                </div>
            </div>
        </section>

        {/* Social Impact Section */}
        <section className="py-24 bg-black/20 relative z-10" style={{backgroundImage: 'radial-gradient(circle at center, #8a4add10, transparent 60%)'}}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Nosso Impacto Social em Números</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#a78bfa] mx-auto mt-4 mb-6"></div>
                <p className="max-w-3xl mx-auto text-lg text-gray-300">Não estamos apenas ensinando código. Estamos mudando vidas e reescrevendo o futuro, um jovem de cada vez.</p>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
        <section className="py-24 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Nossa Jornada de Conquistas</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#a78bfa] mx-auto mt-4 mb-6"></div>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">Alguns dos marcos mais importantes da nossa história, que nos trouxeram até aqui.</p>
                </div>
                <SimplifiedTimeline />
                 <div className="text-center mt-12 max-w-sm mx-auto">
                    <button onClick={() => navigate('/about')} className="w-full group flex items-center justify-center p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#8a4add]/50 hover:bg-white/10 transition-all duration-300">
                        <span className="text-md font-semibold text-white">Veja a história completa</span>
                    </button>
                </div>
            </div>
        </section>

        {/* Team Preview Section */}
        <section className="py-24 bg-black/20 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Conheça Nossa Tropa</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#a78bfa] mx-auto mt-4 mb-6"></div>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">Os rostos e corações por trás da nossa missão. Profissionais e voluntários dedicados a transformar vidas.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamPreview.map(member => (
                        <TeamMemberPreviewCard key={member.id} member={member} />
                    ))}
                </div>
                <div className="text-center mt-12 max-w-sm mx-auto">
                     <button onClick={() => navigate('/team')} className="w-full group flex items-center justify-center p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#8a4add]/50 hover:bg-white/10 transition-all duration-300">
                        <span className="text-md font-semibold text-white">Ver equipe completa</span>
                    </button>
                </div>
            </div>
        </section>

        {/* Nossos Parceiros Section */}
        <section className="py-24 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Nossos Parceiros</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#a78bfa] mx-auto mt-4 mb-6"></div>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                        Empresas e organizações que acreditam na nossa missão e investem no futuro da periferia.
                    </p>
                </div>

                <div className="mt-16 relative">
                    <div className="marquee">
                        <div className="marquee-content">
                            {partners.map(partner => (
                                <PartnerLogo key={partner.id} name={partner.name} logoUrl={partner.logoUrl} />
                            ))}
                            {/* Duplicate for seamless loop */}
                            {partners.map(partner => (
                                <PartnerLogo key={`${partner.id}-clone`} name={partner.name} logoUrl={partner.logoUrl} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Transparency Section */}
        <section className="py-24 bg-black/20 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Transparência Total</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#a78bfa] mx-auto mt-4 mb-6"></div>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                        A confiança é construída com clareza. Acompanhe de perto como cada contribuição se transforma em oportunidade.
                    </p>
                </div>

                <div className="mt-12 max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
                    <button onClick={() => navigate('/annual-report')} className="w-full group flex items-center justify-center p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#8a4add]/50 hover:bg-white/10 transition-all duration-300">
                        <span className="text-md font-semibold text-white">Relatório Anual 2024</span>
                    </button>
                    <button onClick={() => navigate('/financial-statement')} className="w-full group flex items-center justify-center p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#8a4add]/50 hover:bg-white/10 transition-all duration-300">
                        <span className="text-md font-semibold text-white">Prestação de Contas</span>
                    </button>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default Home;