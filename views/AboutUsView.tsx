import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../App';

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
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#05aff2] to-[#8a4add] text-white mb-6 shadow-lg shadow-[#8a4add]/20">
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

// Component for Mission/Vision/Values cards
const InfoCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="group relative rounded-2xl bg-white/10 p-px transition-all duration-300 hover:-translate-y-2 hover:bg-gradient-to-br from-[#8a4add] to-[#f27983] shadow-lg hover:shadow-[#8a4add]/20">
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

const AboutUsView: React.FC = () => {
    const { navigate } = useAppContext();

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
                <section className="py-32 md:py-40 text-center relative z-10 bg-grid-pattern">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                            Somos o futuro que<br />
                            <span className="text-[#c4b5fd]">a gente cria.</span>
                        </h1>
                        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                            O Instituto FuturoOn nasceu do sonho de ver mais rostos como os nossos liderando a revolução tecnológica. Somos mais que uma ONG, somos um movimento.
                        </p>
                    </div>
                </section>
                
                {/* Quem Somos & MVV Section */}
                <section className="py-24 bg-black/20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center mb-20">
                            <h2 className="text-4xl font-black tracking-tight text-white">Quem Somos</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4 mb-6"></div>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                O Instituto FuturoON é um projeto social, no Complexo da Coruja, em São Gonçalo, que leva <span className="text-[#f27983] font-semibold">educação e tecnologia</span> para jovens e adultos da periferia.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <InfoCard
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                }
                                title="Nossa Missão"
                                description="Democratizar o acesso à educação de qualidade em tecnologia, capacitando jovens da periferia para que se tornem protagonistas de suas próprias histórias."
                            />
                            <InfoCard
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                }
                                title="Nossa Visão"
                                description="Ser a maior ponte entre talentos da periferia e as melhores oportunidades do mercado tech, transformando a cara da tecnologia no Brasil."
                            />
                            <InfoCard
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                                    </svg>
                                }
                                title="Nossos Valores"
                                description="Comunidade forte, aprendizado prático, inclusão radical e a coragem de sonhar grande. Juntos, somos mais fortes."
                            />
                        </div>
                    </div>
                </section>
                
                {/* Impact Section */}
                <section className="py-24 bg-black/20" style={{backgroundImage: 'radial-gradient(circle at center, #8a4add10, transparent 60%)'}}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Nosso Impacto Social</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4 mb-6"></div>
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

                {/* Team & Donate CTA Section */}
                <section className="py-24">
                   <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="grid md:grid-cols-2 gap-8">
                             <div className="bg-white/5 p-10 rounded-lg border border-white/10 text-center flex flex-col items-center justify-center">
                                <h3 className="text-3xl font-bold text-white">Conheça Nossa Tropa</h3>
                                <p className="mt-2 text-gray-300">Veja quem são os rostos e corações por trás do nosso corre diário.</p>
                                <button onClick={() => navigate('team')} className="mt-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-300">
                                    Ver equipe
                                </button>
                             </div>
                             <div className="bg-white/5 p-10 rounded-lg border border-white/10 text-center flex flex-col items-center justify-center">
                                <h3 className="text-3xl font-bold text-white">Apoie a Causa</h3>
                                <p className="mt-2 text-gray-300">Somos uma ONG e cada centavo é investido na nossa missão. Faça parte dessa transformação.</p>
                                <button onClick={() => navigate('donate')} className="mt-6 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300">
                                    Faça uma doação
                                </button>
                             </div>
                         </div>
                    </div>
                </section>
                
                {/* Transparência Total Section */}
                <section className="py-24 bg-black/20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 10% 20%, #8a4add, transparent 50%)'}}></div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="text-center md:text-left">
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Transparência Total</h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mt-4 mb-6 mx-auto md:mx-0"></div>
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    Acreditamos que a confiança é construída com clareza. Por isso, disponibilizamos publicamente nossos relatórios para que você possa acompanhar de perto como cada contribuição se transforma em oportunidade e impacto social.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <button onClick={() => navigate('annualReport')} className="w-full text-left group flex items-center justify-between p-6 bg-white/5 rounded-lg border border-white/10 hover:border-[#8a4add]/50 hover:bg-white/10 transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[#8a4add]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </span>
                                        <span className="text-lg font-semibold text-white">Relatório Anual 2024</span>
                                    </div>
                                    <span className="text-gray-400 transform transition-transform group-hover:translate-x-1 group-hover:text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </span>
                                </button>
                                <button onClick={() => navigate('financialStatement')} className="w-full text-left group flex items-center justify-between p-6 bg-white/5 rounded-lg border border-white/10 hover:border-[#8a4add]/50 hover:bg-white/10 transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[#8a4add]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </span>
                                        <span className="text-lg font-semibold text-white">Prestação de Contas</span>
                                    </div>
                                    <span className="text-gray-400 transform transition-transform group-hover:translate-x-1 group-hover:text-white">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AboutUsView;