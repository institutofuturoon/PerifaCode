import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';

// Reusable component for Mission/Vision/Values cards
const InfoCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="group relative rounded-2xl bg-white/10 p-px transition-all duration-300 hover:-translate-y-2 hover:bg-gradient-to-br from-[#6d28d9] to-[#8a4add] shadow-lg hover:shadow-[#8a4add]/20">
        <div className="relative flex h-full flex-col items-center text-center rounded-[15px] bg-[#09090B]/90 p-8 backdrop-blur-sm">
            <div className="mb-6 flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#8a4add] text-white shadow-lg shadow-[#8a4add]/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[#8a4add]/40">
                    {icon}
                </div>
            </div>
            <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#c4b5fd]">{title}</h3>
            <p className="mt-2 flex-grow text-base text-gray-400">{description}</p>
        </div>
    </div>
  );

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
  const { partners } = useAppContext();
  const navigate = useNavigate();
  
  const impactData = [
    { stat: "+100", title: "Alunos Formados", text: "Jovens e adultos capacitados em tecnologia", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7" /></svg> },
    { stat: "+14", title: "Voluntários Ativos", text: "Profissionais dedicados ao ensino", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { stat: "+50", title: "Turmas Concluídas", text: "Cursos finalizados com sucesso", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { stat: "7", title: "Parceiros Estratégicos", text: "Empresas apoiando nossa missão", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
  ];

  return (
    <div className="aurora-background text-white">
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
                onClick={() => navigate('/courses')}
                className="w-full sm:w-auto bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30"
              >
                Comece a estudar agora
              </button>
              <button
                onClick={() => navigate('/connect')}
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                Conheça as mentorias
              </button>
            </div>
          </div>
        </section>

        {/* Quem Somos Section */}
        <section className="py-24 bg-black/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-black tracking-tight text-white mb-2">Quem Somos</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#a78bfa] mx-auto mb-6"></div>
                    <p className="text-gray-300 leading-relaxed text-lg">
                        O Instituto FuturoON é um projeto social, no Complexo da Coruja, em São Gonçalo, que leva <span className="text-[#c4b5fd] font-semibold">educação e tecnologia</span> para jovens e adultos da periferia.
                    </p>
                     <div className="mt-10">
                        <button
                            onClick={() => navigate('/about')}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-300"
                        >
                            Conheça nossa história
                        </button>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Social Impact Section */}
        <section className="py-24 bg-black/20" style={{backgroundImage: 'radial-gradient(circle at center, #8a4add10, transparent 60%)'}}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Nosso Impacto Social</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#a78bfa] mx-auto mt-4 mb-6"></div>
                <p className="max-w-3xl mx-auto text-lg text-gray-300">Não estamos apenas ensinando a programar. Estamos mudando vidas e reescrevendo o futuro.</p>
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

        {/* Nossos Parceiros Section */}
        <section className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Nossos Parceiros</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#a78bfa] mx-auto mt-4 mb-6"></div>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                        Empresas e organizações que acreditam na nossa missão e apoiam o desenvolvimento dos nossos talentos.
                    </p>
                </div>
                <div className="relative mt-16">
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
                <div className="text-center mt-12">
                    <p className="text-gray-400">
                        Quer ser nosso parceiro?{' '}
                        <button onClick={() => navigate('/partnerships')} className="text-[#c4b5fd] font-semibold hover:underline">
                            Entre em contato
                        </button>.
                    </p>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default Home;