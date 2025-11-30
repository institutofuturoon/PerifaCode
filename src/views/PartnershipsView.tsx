
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Badge from '../components/Badge';
import { useActivePartners, useStatistics, useContactInfo, useFeaturedTestimonials } from '../hooks/useOngData';

const PartnerCard: React.FC<{ 
    name: string; 
    description: string;
    sector: string;
    logo: string;
}> = ({ name, description, sector, logo }) => (
    <div className="group relative bg-white/5 rounded-2xl border border-white/10 p-8 hover:border-[#8a4add]/30 hover:bg-white/[0.07] transition-all duration-300">
        <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-[#8a4add]/30 transition-all">
                <img src={logo} alt={name} className="w-16 h-16 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#8a4add]/10 text-[#c4b5fd] border border-[#8a4add]/20">
                        {sector}
                    </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
            </div>
        </div>
    </div>
);

const StatCard: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => (
    <div className="flex flex-col items-center justify-center text-center px-6 border-r border-white/10 last:border-0 py-4 md:py-0">
        <div className="text-[#8a4add] mb-2 opacity-80">{icon}</div>
        <p className="text-3xl md:text-4xl font-black text-white mb-1">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
    </div>
);

const TestimonialCard: React.FC<{
  name: string;
  role: string;
  company: string;
  text: string;
  photo: string;
}> = ({ name, role, company, text, photo }) => (
  <div className="bg-white/5 rounded-2xl border border-white/10 p-8 hover:border-[#8a4add]/30 transition-all duration-300">
    <div className="flex items-center gap-4 mb-6">
      <img src={photo} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-[#8a4add]/30" />
      <div>
        <p className="font-bold text-white">{name}</p>
        <p className="text-sm text-gray-400">{role}, {company}</p>
      </div>
    </div>
    <p className="text-gray-300 leading-relaxed italic">"{text}"</p>
  </div>
);

const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-[#121212] p-8 rounded-3xl border border-white/10 hover:border-[#8a4add]/50 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8a4add]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
        <div className="w-14 h-14 bg-gradient-to-br from-[#18181b] to-[#09090b] border border-white/10 rounded-2xl flex items-center justify-center text-2xl mb-6 text-[#c4b5fd] shadow-lg group-hover:text-white group-hover:border-[#8a4add]/50 transition-all group-hover:shadow-[#8a4add]/20">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 relative z-10 group-hover:text-[#c4b5fd] transition-colors">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed relative z-10">{description}</p>
    </div>
);

const PlanCard: React.FC<{ 
    title: string; 
    description?: string;
    price?: string; 
    features: string[]; 
    isFeatured?: boolean; 
    ctaText: string; 
    ctaLink: string; 
    colorClass?: string;
}> = ({ title, description, price, features, isFeatured, ctaText, ctaLink, colorClass = "bg-[#8a4add]" }) => (
    <div className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 h-full ${isFeatured ? 'bg-white/5 border-[#8a4add] shadow-[0_0_40px_-10px_rgba(138,74,221,0.3)] transform md:-translate-y-4 z-10' : 'bg-[#121212] border-white/10 hover:border-white/20 hover:bg-white/[0.02]'}`}>
        {isFeatured && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
                Recomendado
            </div>
        )}
        
        <div className="mb-6 text-center border-b border-white/5 pb-6">
            <h3 className={`text-xl font-bold mb-3 ${isFeatured ? 'text-white' : 'text-gray-300'}`}>{title}</h3>
            {description && <p className="text-xs text-gray-400 italic leading-relaxed px-2">{description}</p>}
            {price && <p className="text-sm text-gray-500 mt-2">{price}</p>}
        </div>

        <ul className="space-y-4 mb-8 flex-grow">
            {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                    <div className={`mt-0.5 p-0.5 rounded-full flex-shrink-0 ${isFeatured ? 'bg-[#8a4add] text-white' : 'bg-gray-800 text-gray-400'}`}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="leading-tight">{feature}</span>
                </li>
            ))}
        </ul>

        <a 
            href={ctaLink}
            className={`w-full py-4 rounded-xl text-sm font-bold text-center transition-all duration-300 shadow-lg ${isFeatured ? 'bg-white text-black hover:bg-gray-200 hover:shadow-white/10' : 'bg-white/10 text-white hover:bg-white/20 hover:shadow-white/5'}`}
        >
            {ctaText}
        </a>
    </div>
);

const ProcessStepCard: React.FC<{ step: string; title: string; description: string }> = ({ step, title, description }) => (
    <div className="bg-[#121212] p-8 rounded-2xl border border-white/10 flex flex-col h-full relative group hover:border-[#8a4add]/30 transition-all duration-300 hover:-translate-y-1">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-[#c4b5fd] mb-6 group-hover:bg-[#8a4add] group-hover:text-white transition-all shadow-lg group-hover:shadow-[#8a4add]/30">
            {step}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
            {description}
        </p>
    </div>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-white/5 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full py-6 flex justify-between items-center text-left hover:bg-white/[0.02] px-4 rounded-lg transition-colors group"
            >
                <span className="text-gray-200 font-semibold text-base group-hover:text-white transition-colors">{question}</span>
                <span className={`text-[#8a4add] text-2xl transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6 px-4' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-400 text-sm leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const PartnershipsView: React.FC = () => {
    const navigate = useNavigate();
    
    // Dados centralizados do JSON
    const partners = useActivePartners();
    const stats = useStatistics();
    const contact = useContactInfo();
    const { partners: testimonials } = useFeaturedTestimonials();

    return (
        <>
            <SEO 
                title="Seja um Parceiro | Instituto FuturoOn"
                description="Conecte sua empresa à próxima geração de líderes em tecnologia. Descubra como apoiar a formação de talentos da periferia e impulsionar seu ESG."
                keywords={['parceria corporativa', 'ESG', 'recrutamento tech', 'impacto social', 'investimento social privado', 'diversidade e inclusão', 'responsabilidade social']}
            />
            
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8a4add]/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Badge text="Parcerias Corporativas" />
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6 max-w-5xl mx-auto">
                        Transforme vidas e <br className="hidden md:block" />
                        <span className="text-[#c4b5fd]">fortaleça seu ESG</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
                        Conecte sua empresa à próxima geração de talentos em tecnologia. Apoie a formação de jovens da periferia e ganhe acesso a profissionais qualificados.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                            href={`mailto:${contact.emails.partnerships}?subject=Quero ser Parceiro`}
                            className="w-full sm:w-auto px-8 py-4 bg-[#8a4add] text-white font-bold rounded-xl hover:bg-[#7c3aed] transition-all transform hover:scale-105"
                        >
                            Quero ser Parceiro
                        </a>
                        <button 
                            onClick={() => document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                        >
                            Ver Modelos de Parceria
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="border-y border-white/5 bg-white/[0.02] py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/5">
                        <StatCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            value={`+${stats.graduatedStudents}`}
                            label="Jovens Formados" 
                        />
                        <StatCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                            value={`+${stats.projectsCompleted}`}
                            label="Turmas Realizadas" 
                        />
                        <StatCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
                            value={`${stats.employmentRate}%`}
                            label="Taxa de Empregabilidade" 
                        />
                        <StatCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                            value={`+${stats.activePartners}`}
                            label="Parceiros Ativos" 
                        />
                    </div>
                </div>
            </section>

            {/* Nossos Parceiros */}
            <section className="py-24 bg-black/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-white mb-4">
                            Quem já está com a gente
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Empresas e instituições que acreditam no poder transformador da educação tecnológica
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {partners.slice(0, 6).map((partner) => (
                            <PartnerCard
                                key={partner.id}
                                name={partner.name}
                                description={partner.description}
                                sector={partner.sector}
                                logo={partner.logo}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Depoimentos de Parceiros */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-white mb-4">
                            O que dizem nossos parceiros
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Histórias reais de empresas que transformaram suas equipes e impactaram vidas
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard
                                key={testimonial.id}
                                name={testimonial.name}
                                role={testimonial.role}
                                company={testimonial.company}
                                text={testimonial.text}
                                photo={testimonial.photo}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefícios */}
            <section className="py-24 bg-black/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-white mb-4">
                            Por que ser parceiro?
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Mais que uma doação, um investimento estratégico em pessoas e propósito
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <BenefitCard 
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            title="Talentos Qualificados"
                            description="Acesso direto a desenvolvedores júnior formados em tecnologias modernas (React, Node, Python) e prontos para o mercado."
                        />
                        <BenefitCard 
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            title="Metas de ESG"
                            description="Cumpra suas metas de diversidade e impacto social com métricas claras e relatórios transparentes."
                        />
                        <BenefitCard 
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                            title="Visibilidade de Marca"
                            description="Posicione sua marca como líder em inovação social. Ganhe destaque em eventos e canais digitais."
                        />
                    </div>
                </div>
            </section>

            {/* Modelos de Parceria */}
            <section id="models" className="py-24 bg-gradient-to-b from-black/20 to-transparent">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-white mb-4">Modelos de Parceria</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Escolha a melhor forma de apoiar e transformar vidas através da tecnologia
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Apoiador Pontual */}
                        <div className="relative bg-white/5 rounded-2xl border border-white/10 p-8 hover:border-[#8a4add]/30 hover:bg-white/[0.07] transition-all duration-300">
                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-xl bg-[#8a4add]/10 flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Apoiador Pontual</h3>
                                <p className="text-sm text-gray-400">Ideal para empresas que querem contribuir de forma direta e prática</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#8a4add] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Doação Financeira</p>
                                        <p className="text-xs text-gray-400">Qualquer valor ajuda a manter nossas operações</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#8a4add] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Doação de Equipamentos</p>
                                        <p className="text-xs text-gray-400">Notebooks, monitores e periféricos</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#8a4add] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Voluntariado Corporativo</p>
                                        <p className="text-xs text-gray-400">Mentorias e oficinas com sua equipe</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#8a4add] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Selo de Reconhecimento</p>
                                        <p className="text-xs text-gray-400">Badge digital de apoiador</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <p className="text-xs text-gray-500 mb-4">Exemplo: Way2 doou 7 computadores</p>
                                <a 
                                    href="/doar"
                                    className="block w-full py-3 text-center bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                                >
                                    Fazer Doação
                                </a>
                            </div>
                        </div>

                        {/* Mantenedor Educacional - FEATURED */}
                        <div className="relative bg-gradient-to-br from-[#8a4add]/10 to-[#f27983]/10 rounded-2xl border-2 border-[#8a4add] p-8 transform md:-translate-y-4 shadow-[0_0_40px_-10px_rgba(138,74,221,0.3)]">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white text-xs font-bold uppercase tracking-wider py-2 px-6 rounded-full">
                                Recomendado
                            </div>

                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-xl bg-[#8a4add]/20 flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c4b5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Mantenedor Educacional</h3>
                                <p className="text-sm text-gray-300">Para empresas que desejam acompanhar de perto o impacto gerado</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#c4b5fd] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Apoio Contínuo a uma Turma</p>
                                        <p className="text-xs text-gray-300">Patrocine um ciclo formativo completo</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#c4b5fd] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Logo em Destaque</p>
                                        <p className="text-xs text-gray-300">Site, materiais e eventos</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#c4b5fd] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Relatório Trimestral</p>
                                        <p className="text-xs text-gray-300">Histórias e métricas de impacto</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#c4b5fd] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Visitas e Palestras</p>
                                        <p className="text-xs text-gray-300">Conexão direta com alunos e educadores</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#c4b5fd] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Prioridade em Contratações</p>
                                        <p className="text-xs text-gray-300">Acesso antecipado ao banco de talentos</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/20">
                                <p className="text-xs text-gray-300 mb-4">Exemplo: Hostinger investiu R$ 15.000</p>
                                <a 
                                    href={`mailto:${contact.emails.partnerships}?subject=Quero ser Mantenedor`}
                                    className="block w-full py-3 text-center bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all"
                                >
                                    Tornar-se Mantenedor
                                </a>
                            </div>
                        </div>

                        {/* Parceiro de Oportunidades */}
                        <div className="relative bg-white/5 rounded-2xl border border-white/10 p-8 hover:border-[#f27983]/30 hover:bg-white/[0.07] transition-all duration-300">
                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-xl bg-[#f27983]/10 flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f27983]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Parceiro de Oportunidades</h3>
                                <p className="text-sm text-gray-400">Para empresas que querem contratar talentos e apoiar carreiras</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#f27983] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Banco de Talentos</p>
                                        <p className="text-xs text-gray-400">Acesso a 300+ jovens formados</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#f27983] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Divulgação de Vagas</p>
                                        <p className="text-xs text-gray-400">Estágios e empregos direto aos alunos</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#f27983] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Eventos de Carreira</p>
                                        <p className="text-xs text-gray-400">Feiras, hackathons e meetups</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#f27983] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Selo de Empresa Inclusiva</p>
                                        <p className="text-xs text-gray-400">Reconhecimento público</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <p className="text-xs text-gray-500 mb-4">85% dos alunos conseguem emprego</p>
                                <a 
                                    href={`mailto:${contact.emails.partnerships}?subject=Quero Contratar Talentos`}
                                    className="block w-full py-3 text-center bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                                >
                                    Quero Contratar
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Informação adicional */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-400 text-sm">
                            💡 Todas as doações podem ser abatidas do Imposto de Renda (empresas no Lucro Real)
                        </p>
                    </div>
                </div>
            </section>

            {/* Como Funciona */}
            <section className="py-24 bg-black/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-white mb-4">Como funciona a parceria</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Um processo simples, transparente e focado em resultados
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <ProcessStepCard 
                            step="1"
                            title="Contato Inicial"
                            description="Agende uma conversa com nosso time. Vamos entender seus objetivos de ESG e contratação."
                        />
                        <ProcessStepCard 
                            step="2"
                            title="Definição do Modelo"
                            description="Co-criamos o plano ideal para sua empresa, seja apoiando turmas ou contratando talentos."
                        />
                        <ProcessStepCard 
                            step="3"
                            title="Início do Impacto"
                            description="Sua marca ganha visibilidade e você recebe relatórios periódicos sobre a transformação gerada."
                        />
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-white mb-4">Dúvidas Frequentes</h2>
                        <p className="text-gray-400">Tudo o que você precisa saber sobre parcerias</p>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-2">
                        <FAQItem 
                            question="Minha empresa pode abater do Imposto de Renda?"
                            answer="Sim! Como OSCIP, emitimos recibos que permitem abatimento fiscal para empresas tributadas pelo Lucro Real."
                        />
                        <FAQItem 
                            question="Podemos doar equipamentos usados?"
                            answer="Com certeza! Notebooks e periféricos em bom estado são revisados e entregues aos alunos que precisam."
                        />
                        <FAQItem 
                            question="Como funciona a contratação dos alunos?"
                            answer="Parceiros têm acesso exclusivo ao nosso banco de talentos e podem divulgar vagas diretamente."
                        />
                        <FAQItem 
                            question="Existe valor mínimo para doação?"
                            answer="Não. Qualquer contribuição é bem-vinda e ajuda a transformar vidas."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 bg-gradient-to-b from-black/20 to-transparent text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Pronto para fazer a diferença?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Agende uma conversa e descubra como sua empresa pode transformar vidas
                    </p>
                    <a 
                        href={`mailto:${contact.emails.partnerships}?subject=Quero ser Parceiro`}
                        className="inline-flex items-center gap-3 px-10 py-5 bg-[#8a4add] text-white font-bold rounded-xl hover:bg-[#7c3aed] transition-all transform hover:scale-105"
                    >
                        Agendar Reunião
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </section>
        </>
    );
};

export default PartnershipsView;
