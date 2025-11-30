
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionCard from '../components/ActionCard';
import SEO from '../components/SEO';
import Badge from '../components/Badge';

// Componente de Estatística Animada - MELHORADO!
const AnimatedImpactCard: React.FC<{ 
  value: string; 
  label: string; 
  color: string;
  context: string;
  icon: React.ReactNode;
}> = ({ value, label, color, context, icon }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (isVisible) {
      const target = parseInt(value.replace(/\D/g, ''));
      if (target > 0) {
        const duration = 2000;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
          setCount(prev => {
            if (prev >= target) {
              clearInterval(timer);
              return target;
            }
            return Math.min(prev + increment, target);
          });
        }, 16);
        
        return () => clearInterval(timer);
      }
    }
  }, [isVisible, value]);
  
  const displayValue = value.includes('+') 
    ? `+${Math.round(count)}` 
    : value.includes('%')
    ? `${Math.round(count)}%`
    : Math.round(count).toString();
  
  return (
    <div ref={ref} className="relative group">
      {/* Glow effect mais intenso */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 group-hover:blur-3xl transition-all duration-500`}></div>
      
      <div className="relative bg-gradient-to-br from-[#18181B] to-[#09090B] p-8 rounded-2xl border border-white/10 group-hover:border-white/20 text-center hover:-translate-y-2 transition-all duration-300 h-full">
        {/* Ícone com animação */}
        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
          {icon}
        </div>
        
        {/* Valor grande */}
        <p className={`text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r ${color} mb-3 group-hover:scale-105 transition-transform duration-300`}>
          {displayValue}
        </p>
        
        {/* Label */}
        <p className="text-sm text-white font-bold uppercase tracking-widest mb-2">
          {label}
        </p>
        
        {/* Descrição */}
        <p className="text-xs text-gray-400 leading-relaxed">
          {context}
        </p>
        
        {/* Barra decorativa */}
        <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${color} group-hover:w-full w-0 transition-all duration-1000 ease-out`}></div>
        </div>
      </div>
    </div>
  );
};

// Componente de Depoimento
const TestimonialCard: React.FC<{
  photo: string;
  name: string;
  role: string;
  testimonial: string;
  achievement: string;
  achievementColor: string;
}> = ({ photo, name, role, testimonial, achievement, achievementColor }) => (
  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-8 rounded-2xl border border-white/10 hover:-translate-y-2 hover:border-[#8a4add]/40 transition-all duration-300">
    <div className="flex items-center gap-4 mb-6">
      <div className={`w-16 h-16 rounded-full border-2 ${achievementColor} bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-2xl font-black text-white`}>
        {name.charAt(0)}
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <p className="text-sm text-gray-400">{role}</p>
      </div>
    </div>
    
    <div className="mb-6">
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      <blockquote className="text-gray-300 italic leading-relaxed">
        "{testimonial}"
      </blockquote>
    </div>
    
    <div className={`flex items-center gap-2 text-sm ${achievementColor.replace('border-', 'text-')}`}>
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
      <span className="font-semibold">{achievement}</span>
    </div>
  </div>
);

// Componente de Prêmio
const AwardCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  organization: string;
  year: string;
  colorClass: string;
}> = ({ icon, title, organization, year, colorClass }) => (
  <div className={`bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-2xl border border-white/10 text-center hover:-translate-y-2 hover:border-${colorClass}-500/40 transition-all duration-300 group`}>
    <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-${colorClass}-400/20 to-${colorClass}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400 mb-2">{organization}</p>
    <span className="text-xs text-[#8a4add] font-semibold">{year}</span>
  </div>
);

// Novo componente baseado no design da imagem (Cards Pretos com Ícones)
const PrincipleCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="group relative flex flex-col items-center text-center h-full p-8 bg-[#121212] rounded-2xl border border-white/10 transition-all duration-300 hover:border-[#8a4add]/30 hover:shadow-2xl hover:shadow-[#8a4add]/10 hover:-translate-y-2">
        <div className="mb-6 p-4 rounded-full bg-white/5 text-white group-hover:text-[#c4b5fd] group-hover:bg-[#8a4add]/10 transition-colors">
            <div className="transform scale-125">
                {icon}
            </div>
        </div>
        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 group-hover:text-[#c4b5fd] transition-colors">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed font-medium">{description}</p>
    </div>
);

const Section: React.FC<{ children: React.ReactNode, className?: string, style?: React.CSSProperties }> = ({ children, className = '', style }) => (
    <section className={`py-16 md:py-24 relative z-10 ${className}`} style={style}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode, subtitle?: string }> = ({ children, subtitle }) => (
    <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">{children}</h2>
        {subtitle && <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">{subtitle}</p>}
        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
    </div>
);

const TimelineItem: React.FC<{ year: string; title: string; description: string; isLeft: boolean; }> = ({ year, title, description, isLeft }) => (
    <div className={`flex items-center w-full my-8 ${isLeft ? 'justify-start' : 'justify-end'}`}>
        <div className={`w-full md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
            <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/10 to-[#f27983]/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative p-6 bg-[#121212] rounded-xl border border-white/10 hover:border-[#8a4add]/30 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white text-xs font-bold">
                            {year}
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#c4b5fd] transition-colors">{title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    </div>
);

const AboutUsView: React.FC = () => {
    const navigate = useNavigate();

    const timelineData = [
        { year: '2021', title: 'Fundação do FuturoON', description: 'Iniciativa de Thais Santana no Complexo da Coruja, São Gonçalo, com objetivo de conectar a periferia à tecnologia, cultura e cidadania.' },
        { year: '2022', title: 'Primeiras Turmas e Oficinas', description: 'Início das primeiras turmas de programação, robótica e tecnologia para jovens da comunidade, com atuação presencial e online.' },
        { year: '2023', title: 'Expansão e Grandes Eventos', description: 'Certificação de alunos na UFF em parceria com a IN Junior, realização da 1ª Game Jam em São Gonçalo, e expansão da atuação para cultura e e-sports com passeios e visitas.' },
        { year: '2024', title: 'Reconhecimento e Foco no Mercado', description: 'Reconhecimento com menção honrosa na Câmara Municipal de Niterói e lançamento de novas oficinas de design, comunicação digital e empreendedorismo, incluindo mães e jovens.' },
        { year: '2025', title: 'Consolidação e Expansão Nacional', description: 'Consolidação como Instituto de Tecnologia com mais de 300 jovens formados, 50 turmas e expansão da atuação para eventos nacionais, como atividades em Brasília.' },
    ];

    return (
        <>
            <SEO 
                title="Quem Somos" 
                description="Conheça o Instituto FuturoOn: nossa história, missão e como estamos transformando a realidade de jovens da periferia através da tecnologia."
            />
            {/* Hero Section */}
            <section className="py-20 md:py-32 text-center relative z-10 bg-grid-pattern">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Badge text="Institucional" />
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight max-w-5xl mx-auto">
                        Somos o futuro que<br />
                        <span className="text-[#c4b5fd]">a gente cria.</span>
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                        O Instituto FuturoOn nasceu de um sonho: transformar a realidade da periferia através da tecnologia, educação e cultura. Somos mais que uma ONG, somos um movimento.
                    </p>
                </div>
            </section>
            
            {/* Seção da Fundadora - NOVO! */}
            <section className="py-24 bg-black/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* Foto da Fundadora */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/30 to-[#f27983]/30 rounded-2xl blur-3xl group-hover:blur-4xl transition-all duration-500"></div>
                                <div className="relative aspect-square rounded-2xl overflow-hidden border-4 border-white/10 group-hover:border-[#8a4add]/40 transition-all duration-300 bg-gradient-to-br from-[#8a4add]/20 to-[#f27983]/20 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#8a4add] to-[#f27983] flex items-center justify-center">
                                            <span className="text-6xl font-black text-white">T</span>
                                        </div>
                                        <p className="text-gray-400 text-sm">📸 Foto em breve</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* História */}
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/20 border border-[#8a4add]/30 rounded-full">
                                    <span className="text-sm font-bold text-[#c4b5fd]">Fundadora</span>
                                </div>
                                
                                <h2 className="text-4xl font-black text-white">
                                    Thaís Santana
                                </h2>
                                
                                <p className="text-xl text-[#c4b5fd] font-semibold italic">
                                    "Eu sonhei com esse projeto. Literalmente. Acordei com o nome, 
                                    a missão e a certeza de que era isso que eu deveria fazer."
                                </p>
                                
                                <div className="space-y-4 text-gray-300 leading-relaxed">
                                    <p>
                                        Mulher preta e periférica, engenheira elétrica com mais de 13 anos 
                                        de experiência no setor elétrico. Nascida e criada no Complexo da Coruja, 
                                        em São Gonçalo, Thaís sempre teve o sonho de transformar a realidade da sua comunidade.
                                    </p>
                                    <p>
                                        Em 2021, ela literalmente sonhou com o FuturoOn - acordou com o nome do projeto, 
                                        a estrutura e a missão clara. Sem incentivo financeiro público ou privado, 
                                        fundou o instituto com recursos próprios e muita determinação.
                                    </p>
                                    <p>
                                        Hoje, o FuturoOn já realizou mais de 300 formações, organizou dezenas de turmas 
                                        e eventos, e inseriu diversos alunos no mercado de trabalho. O projeto se tornou 
                                        referência em inclusão digital na Baixada Fluminense.
                                    </p>
                                </div>
                                
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <svg className="w-5 h-5 text-[#8a4add]" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                                        </svg>
                                        Engenheira Elétrica
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <svg className="w-5 h-5 text-[#8a4add]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                        </svg>
                                        Complexo da Coruja, São Gonçalo - RJ
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <svg className="w-5 h-5 text-[#8a4add]" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                                        </svg>
                                        13+ anos de experiência
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <Section className="bg-black/20">
                <SectionTitle subtitle="Os pilares que guiam cada decisão, cada projeto e cada vida transformada.">
                    Missão, Visão e Valores
                </SectionTitle>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        <div className="relative p-8 bg-[#121212] rounded-2xl border border-white/10 h-full hover:border-[#8a4add]/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-[#8a4add]/10 flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4">Missão</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Democratizar o acesso à tecnologia e educação de qualidade, transformando jovens da periferia em protagonistas do futuro digital.
                            </p>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#f27983]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        <div className="relative p-8 bg-[#121212] rounded-2xl border border-white/10 h-full hover:border-[#f27983]/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-[#f27983]/10 flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f27983]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4">Visão</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Ser referência nacional em inclusão digital e social, criando um ecossistema onde talento e oportunidade se encontram, independente da origem.
                            </p>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#c4b5fd]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        <div className="relative p-8 bg-[#121212] rounded-2xl border border-white/10 h-full hover:border-[#c4b5fd]/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-[#c4b5fd]/10 flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c4b5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364l7.682 7.682a4.5 4.5 0 006.364 0l7.682-7.682a4.5 4.5 0 000-6.364L19.682 3.5a4.5 4.5 0 00-6.364 0L12 4.818 10.682 3.5a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4">Valores</h3>
                            <ul className="text-gray-300 leading-relaxed space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#c4b5fd] mt-1">•</span>
                                    <span>Inclusão e diversidade</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#c4b5fd] mt-1">•</span>
                                    <span>Transparência total</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#c4b5fd] mt-1">•</span>
                                    <span>Excelência educacional</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#c4b5fd] mt-1">•</span>
                                    <span>Impacto social real</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Nossos Princípios (Baseado na Imagem Enviada) */}
            <Section className="bg-brand-navy/30">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-black tracking-tight text-white">Nosso Manifesto</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4 mb-6"></div>
                    <p className="text-gray-300 leading-relaxed text-lg">
                        Não é apenas sobre código. É sobre construir pontes, quebrar barreiras e criar um ecossistema onde todos possam prosperar.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <PrincipleCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                        title="Jovens em Formação"
                        description="Cada participante que entra no FuturoOn está dando o primeiro passo para transformar sua vida por meio da tecnologia."
                    />
                    <PrincipleCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                        title="Histórias Reais"
                        description="Participantes estão criando sites, aplicativos e projetos bem sucedidos, demonstrando o potencial da tecnologia para mudar trajetórias profissionais."
                    />
                    <PrincipleCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>}
                        title="Rede em Crescimento"
                        description="Voluntários e parceiros estão colaborando para criar oportunidades e apoiar os participantes em sua jornada de descoberta tecnológica."
                    />
                    <PrincipleCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>}
                        title="Diversidade como Princípio"
                        description="Nossas turmas refletem a diversidade e riqueza de talentos do Brasil! Acreditamos que a inovação nasce de diferentes perspectivas."
                    />
                </div>
            </Section>
            
            {/* Impact Section - MELHORADO! */}
            <section className="py-20 border-y border-white/5 bg-gradient-to-b from-black/40 via-black/20 to-transparent relative overflow-hidden">
                {/* Background decorativo */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#8a4add]/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#f27983]/10 rounded-full blur-[120px]"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Nosso Impacto em Números
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Somos vistos como uma 'segunda casa', transformando vidas e criando novas oportunidades
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        <AnimatedImpactCard 
                            value="+300" 
                            label="Jovens Formados" 
                            color="from-sky-400 to-blue-500"
                            context="Cada um com uma história de superação"
                            icon={
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                                </svg>
                            }
                        />
                        <AnimatedImpactCard 
                            value="+50" 
                            label="Turmas Realizadas" 
                            color="from-green-400 to-emerald-500"
                            context="Presenciais e online, sempre com qualidade"
                            icon={
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                                </svg>
                            }
                        />
                        <AnimatedImpactCard 
                            value="+14" 
                            label="Voluntários Ativos" 
                            color="from-pink-400 to-rose-500"
                            context="Profissionais dedicados à causa"
                            icon={
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                                </svg>
                            }
                        />
                        <AnimatedImpactCard 
                            value="0" 
                            label="Apoio Governamental" 
                            color="from-amber-400 to-orange-500"
                            context="100% independente e transparente"
                            icon={
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                            }
                        />
                    </div>
                </div>
            </section>

            {/* Seção Antes vs Depois - NOVO! */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-white mb-4">
                            O Que Mudamos
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            A transformação acontece quando oportunidade encontra determinação
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
                    </div>
                    
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* ANTES */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl blur-xl"></div>
                                <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] p-8 rounded-2xl border border-red-500/20">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-black text-white">Antes</h3>
                                    </div>
                                    
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                            </svg>
                                            <span className="text-gray-300">Jovens sem acesso a cursos de tecnologia</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                            </svg>
                                            <span className="text-gray-300">Desemprego e falta de perspectiva</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                            </svg>
                                            <span className="text-gray-300">Comunidade sem referências em tech</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                            </svg>
                                            <span className="text-gray-300">Talentos desperdiçados por falta de oportunidade</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                            </svg>
                                            <span className="text-gray-300">Ciclo de pobreza sem quebra</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            {/* DEPOIS */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/20 to-[#f27983]/20 rounded-2xl blur-xl"></div>
                                <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] p-8 rounded-2xl border border-[#8a4add]/40">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8a4add] to-[#f27983] flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-black text-white">Depois</h3>
                                    </div>
                                    
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-[#8a4add] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                            </svg>
                                            <span className="text-gray-300"><strong className="text-white">300+ jovens</strong> formados em tecnologia</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-[#8a4add] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                            </svg>
                                            <span className="text-gray-300">Alunos <strong className="text-white">contratados</strong> e trabalhando na área</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-[#8a4add] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                            </svg>
                                            <span className="text-gray-300">Comunidade com <strong className="text-white">novos modelos</strong> de sucesso</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-[#8a4add] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                            </svg>
                                            <span className="text-gray-300">Talentos <strong className="text-white">descobertos e valorizados</strong></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-[#8a4add] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                            </svg>
                                            <span className="text-gray-300">Famílias com <strong className="text-white">renda transformada</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        {/* CTA */}
                        <div className="text-center mt-12">
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/20 border border-[#8a4add]/30 rounded-full">
                                <svg className="w-5 h-5 text-[#8a4add]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                                <span className="text-white font-semibold">
                                    E isso é só o começo. Junte-se a nós!
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Depoimentos de Alunos - NOVO! */}
            <section className="py-24 bg-black/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-white mb-4">
                            Vidas Transformadas
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Conheça quem passou pelo FuturoOn e hoje está construindo seu futuro na tech
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <TestimonialCard
                            photo="/photos/aluno-1.jpg"
                            name="João Silva"
                            role="Dev Jr na Empresa X"
                            testimonial="Eu não sabia nem o que era HTML. Hoje eu desenvolvo sites profissionais e tenho meu primeiro emprego na área. O FuturoOn mudou minha vida!"
                            achievement="Contratado em 3 meses"
                            achievementColor="border-[#8a4add]/40"
                        />
                        <TestimonialCard
                            photo="/photos/aluna-2.jpg"
                            name="Maria Santos"
                            role="Freelancer Full Stack"
                            testimonial="Mãe solo, desempregada. Hoje trabalho de casa, ganho bem e posso cuidar da minha filha. Gratidão eterna ao FuturoOn!"
                            achievement="Renda de R$ 4k/mês"
                            achievementColor="border-[#f27983]/40"
                        />
                        <TestimonialCard
                            photo="/photos/aluno-3.jpg"
                            name="Pedro Costa"
                            role="Estagiário em Startup"
                            testimonial="17 anos, primeiro emprego, trabalhando com o que amo. O FuturoOn me deu a chance que eu nunca tive."
                            achievement="Mais jovem contratado"
                            achievementColor="border-[#c4b5fd]/40"
                        />
                    </div>
                    
                    <div className="text-center mt-12">
                        <button 
                            onClick={() => navigate('/success-stories')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#8a4add]/30 hover:-translate-y-1 transition-all duration-300"
                        >
                            Ver Mais Histórias
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Prêmios e Reconhecimentos - NOVO! */}
            <section className="py-24 bg-gradient-to-b from-black/20 to-transparent">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-white mb-4">
                            Reconhecimento e Conquistas
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Nosso trabalho tem sido reconhecido por instituições e comunidades
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        <AwardCard
                            icon={
                                <svg className="w-10 h-10 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                            }
                            title="Menção Honrosa"
                            organization="Câmara Municipal de Niterói"
                            year="2024"
                            colorClass="yellow"
                        />
                        <AwardCard
                            icon={
                                <svg className="w-10 h-10 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                            }
                            title="Parceria UFF"
                            organization="Certificação de Alunos"
                            year="2023"
                            colorClass="blue"
                        />
                        <AwardCard
                            icon={
                                <svg className="w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                                </svg>
                            }
                            title="1ª Game Jam"
                            organization="São Gonçalo"
                            year="2023"
                            colorClass="purple"
                        />
                        <AwardCard
                            icon={
                                <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                                </svg>
                            }
                            title="Impacto Social"
                            organization="300+ Vidas Transformadas"
                            year="2021-2025"
                            colorClass="green"
                        />
                    </div>
                </div>
            </section>

            {/* Video/Media Section */}
            <Section className="bg-black/20">
                <SectionTitle subtitle="Veja de perto o impacto real do nosso trabalho e as histórias que nos movem todos os dias.">
                    Conheça Nossa História
                </SectionTitle>
                <div className="max-w-4xl mx-auto">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#8a4add]/20 to-[#f27983]/20 border border-white/10 group hover:border-[#8a4add]/30 transition-all duration-300">
                        {/* Placeholder for video - replace with actual video embed */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#8a4add]/20 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </div>
                                <p className="text-gray-300 text-lg font-semibold">Vídeo Institucional</p>
                                <p className="text-gray-400 text-sm">Em breve: nossa história em movimento</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Timeline Section */}
            <Section>
                <SectionTitle>Nossa Jornada de Conquistas</SectionTitle>
                <div className="relative max-w-5xl mx-auto">
                    {/* Vertical line with gradient */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 h-full w-1 bg-gradient-to-b from-[#8a4add] via-[#f27983] to-[#8a4add] opacity-20"></div>
                    {timelineData.map((item, index) => (
                        <div key={index} className="relative">
                            {/* Enhanced dot on the timeline */}
                            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8a4add] to-[#f27983] p-0.5">
                                    <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#8a4add] to-[#f27983]"></div>
                                    </div>
                                </div>
                            </div>
                            <TimelineItem {...item} isLeft={index % 2 === 0} />
                        </div>
                    ))}
                </div>
            </Section>

            {/* Photo Gallery Section */}
            <Section className="bg-brand-navy/30">
                <SectionTitle subtitle="Momentos reais, sorrisos verdadeiros e transformações que acontecem todos os dias.">
                    Nosso Dia a Dia
                </SectionTitle>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div key={item} className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#8a4add]/10 to-[#f27983]/10 border border-white/10 group hover:border-[#8a4add]/30 transition-all duration-300 hover:scale-105">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/30 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-xs text-gray-400 mt-2">Foto {item}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <p className="text-gray-400 text-sm">
                        📸 Galeria em construção - Em breve, fotos reais das nossas atividades e eventos
                    </p>
                </div>
            </Section>

            {/* Transparência Total Section */}
            <Section>
                <SectionTitle subtitle="Acreditamos que a confiança é construída com clareza. Acompanhe de perto como cada contribuição se transforma em oportunidade.">
                    Transparência Total
                </SectionTitle>
                
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* Annual Report Card */}
                    <button 
                        onClick={() => navigate('/annual-report')} 
                        className="w-full text-left group"
                    >
                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10 hover:border-[#8a4add]/40 hover:bg-white/[0.07] transition-all duration-200">
                            <div className="flex items-center gap-5">
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-lg bg-[#8a4add]/10 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                
                                {/* Text */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-0.5">
                                        Relatório Anual 2024
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Conquistas, desafios e impacto do ano
                                    </p>
                                </div>
                            </div>
                            
                            {/* Arrow */}
                            <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                                <span className="hidden md:block text-sm">Ver relatório</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    {/* Financial Statement Card */}
                    <button 
                        onClick={() => navigate('/financial-statement')} 
                        className="w-full text-left group"
                    >
                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10 hover:border-[#f27983]/40 hover:bg-white/[0.07] transition-all duration-200">
                            <div className="flex items-center gap-5">
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-lg bg-[#f27983]/10 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f27983]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                
                                {/* Text */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-0.5">
                                        Prestação de Contas
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Detalhamento financeiro completo e auditado
                                    </p>
                                </div>
                            </div>
                            
                            {/* Arrow */}
                            <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                                <span className="hidden md:block text-sm">Ver prestação</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    {/* Trust badge */}
                    <div className="flex items-center justify-center gap-2 pt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                        <p className="text-xs text-gray-500">
                            Documentos atualizados e verificados
                        </p>
                    </div>
                </div>
            </Section>


            {/* Team & Donate CTA Section */}
            <Section className="bg-brand-navy/30">
               <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="grid md:grid-cols-2 gap-8">
                        <ActionCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            title="Conheça Nossa Tropa"
                            description="Veja quem são os rostos e corações por trás do nosso corre diário."
                            buttonText="Ver equipe"
                            buttonOnClick={() => navigate('/team')}
                            buttonVariant="secondary"
                        />
                        <ActionCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>}
                            title="Apoie a Causa"
                            description="Somos uma ONG e cada centavo é investido na nossa missão. Faça parte dessa transformação."
                            buttonText="Faça uma doação"
                            buttonOnClick={() => navigate('/donate')}
                            buttonVariant="primary"
                        />
                     </div>
                </div>
            </Section>
        </>
    );
};

export default AboutUsView;
