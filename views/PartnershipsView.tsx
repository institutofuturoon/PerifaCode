
import React, { useState } from 'react';
import { useAppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Badge from '../components/Badge';

const PartnerLogo: React.FC<{ name: string; logoUrl: string }> = ({ name, logoUrl }) => (
    <div className="flex-shrink-0 w-52 h-32 bg-[#0c0c0e] border border-white/5 rounded-2xl flex items-center justify-center p-8 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer group relative overflow-hidden hover:border-[#8a4add]/30 hover:bg-[#121212] hover:shadow-[0_0_30px_-10px_rgba(138,74,221,0.15)]">
        {/* Subtle Gradient Orb on Hover */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#8a4add]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        <img 
            src={logoUrl} 
            alt={name} 
            className="max-w-full max-h-full object-contain opacity-40 group-hover:opacity-100 transition-all duration-500 relative z-10 transform group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
        />
    </div>
);

const StatItem: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex flex-col items-center justify-center text-center px-6 border-r border-white/10 last:border-0 py-4 md:py-0">
        <div className="text-[#8a4add] mb-2 opacity-80">{icon}</div>
        <p className="text-2xl md:text-3xl font-black text-white mb-1 tracking-tight uppercase">{value}</p>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{label}</p>
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
    const { partners } = useAppContext();
    const navigate = useNavigate();

    // Ensure we have enough logos to make the marquee look good (min 10 items)
    const marqueePartners = partners.length < 5 
        ? [...partners, ...partners, ...partners, ...partners] 
        : [...partners, ...partners];

    return (
        <div className="bg-[#09090B] min-h-screen overflow-hidden">
            <SEO 
                title="Seja um Parceiro | Instituto FuturoOn"
                description="Conecte sua empresa à próxima geração de líderes em tecnologia. Descubra como apoiar a formação de talentos da periferia e impulsionar seu ESG."
                keywords={['parceria corporativa', 'ESG', 'recrutamento tech', 'impacto social', 'investimento social privado', 'diversidade e inclusão', 'responsabilidade social']}
            />
            
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 text-center relative z-10">
                {/* Abstract Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#8a4add]/10 rounded-[100%] blur-[120px] -z-10 pointer-events-none mix-blend-screen"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-30 -z-10"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Badge text="B2B & Impacto Social" />
                    
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6 max-w-5xl mx-auto">
                        Invista em talentos que <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] via-[#c4b5fd] to-[#f27983]">transformam vidas.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
                        Ao apoiar o FuturoOn, sua empresa cumpre metas de diversidade, fortalece sua estratégia ESG e ganha acesso direto a desenvolvedores júnior formados em tecnologias modernas.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                            href="mailto:parcerias@institutofuturoon.org"
                            className="w-full sm:w-auto px-8 py-4 bg-[#8a4add] text-white font-bold rounded-xl hover:bg-[#7c3aed] transition-all transform hover:scale-105 shadow-[0_0_30px_-5px_rgba(138,74,221,0.5)]"
                        >
                            Quero ser Parceiro
                        </a>
                        <button 
                            onClick={() => document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
                        >
                            Ver Modelos de Apoio
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Strip - PILARES (Qualitativo) */}
            <section className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/5">
                        <StatItem 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                            value="Missão" 
                            label="Inclusão Digital" 
                        />
                        <StatItem 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                            value="Método" 
                            label="Ensino Prático" 
                        />
                        <StatItem 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 00-9-9m9 9a9 9 0 009-9" /></svg>}
                            value="Cultura" 
                            label="Diversidade Real" 
                        />
                        <StatItem 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>}
                            value="Impacto" 
                            label="Transformação Social" 
                        />
                    </div>
                </div>
            </section>

            {/* Infinite Marquee Partners */}
            <section className="py-20 overflow-hidden relative bg-black/20 border-b border-white/5">
                <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#09090B] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#09090B] to-transparent z-10 pointer-events-none"></div>
                
                <div className="container mx-auto px-4 mb-12 text-center">
                     <span className="text-[#c4b5fd] font-bold tracking-widest text-xs uppercase mb-3 block">Nossa Rede</span>
                     <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Um ecossistema de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8a4add] to-[#f27983]">inovação social</span>
                     </h3>
                     <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
                        Junte-se às organizações que estão construindo pontes reais entre a periferia e o mercado de tecnologia.
                     </p>
                </div>

                <div className="relative flex overflow-hidden group">
                    <div className="flex animate-infinite-scroll gap-8 pr-8">
                        {marqueePartners.map((p, i) => (
                            <PartnerLogo key={`a-${p.id}-${i}`} name={p.name} logoUrl={p.logoUrl} />
                        ))}
                    </div>
                    <div className="flex animate-infinite-scroll gap-8 pr-8" aria-hidden="true">
                        {marqueePartners.map((p, i) => (
                            <PartnerLogo key={`b-${p.id}-${i}`} name={p.name} logoUrl={p.logoUrl} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Value Proposition Grid */}
            <section className="py-24 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Mais que doação, <br/>um investimento estratégico.</h2>
                    <p className="text-gray-400 text-lg">
                        Alinhe propósito com performance. Veja o ROI de apoiar o Instituto FuturoOn.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <BenefitCard 
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        title="Talentos Qualificados"
                        description="Acesso direto a um pool de desenvolvedores júnior formados com tecnologias modernas (React, Node, Python) e prontos para o mercado."
                    />
                    <BenefitCard 
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        title="Metas de ESG"
                        description="Cumpra suas metas de diversidade e impacto social com métricas claras e relatórios transparentes de transformação de vidas."
                    />
                    <BenefitCard 
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        title="Brand Awareness"
                        description="Posicione sua marca como líder em inovação social. Ganhe visibilidade em nossos eventos, hackathons e canais digitais."
                    />
                </div>
            </section>

            {/* Engagement Models */}
            <section id="models" className="py-24 bg-[#121212] relative border-t border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-grid-pattern opacity-10 pointer-events-none"></div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Escolha como impactar</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Modelos acessíveis para empresas de todos os tamanhos — cada apoio ajuda a transformar vidas.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                        <PlanCard 
                            title="🟣 Apoiador Pontual"
                            description="Ideal para empresas que querem contribuir de forma direta e prática."
                            ctaText="Fazer Doação"
                            ctaLink="/donate"
                            features={[
                                "Doação financeira livre",
                                "Doação de equipamentos ou materiais",
                                "Voluntariado corporativo (mentorias, oficinas)",
                                "Selo digital de reconhecimento como apoiador"
                            ]}
                        />
                        <PlanCard 
                            title="🟪 Mantenedor Educacional"
                            description="Para empresas que desejam acompanhar de perto o impacto gerado."
                            isFeatured={true}
                            ctaText="Tornar-se Mantenedor"
                            ctaLink="mailto:parcerias@institutofuturoon.org?subject=Quero ser Mantenedor"
                            features={[
                                "Apoio contínuo a uma turma ou ciclo formativo",
                                "Logo em destaque no site e materiais institucionais",
                                "Relatório trimestral com histórias e progresso",
                                "Visita ou palestra com nossos educadores e alunos",
                                "Prioridade em ações futuras de conexão com talentos"
                            ]}
                        />
                        <PlanCard 
                            title="🟦 Parceiro de Oportunidades"
                            description="Para empresas que querem se aproximar dos alunos e apoiar sua entrada no mercado."
                            ctaText="Quero apoiar talentos"
                            ctaLink="mailto:parcerias@institutofuturoon.org?subject=Quero Apoiar Talentos"
                            features={[
                                "Participação em eventos e feiras de carreira",
                                "Divulgação de vagas de estágio ou emprego",
                                "Encontros com alunos em formação para troca de experiências",
                                "Reconhecimento como empresa inclusiva"
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* Process Steps Section */}
            <section className="py-24 bg-[#09090B] relative border-t border-white/5">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                         <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Como iniciamos essa jornada</h2>
                         <p className="text-gray-400 max-w-xl mx-auto">
                            Um processo simples, transparente e focado em resultados.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <ProcessStepCard 
                            step="1"
                            title="Contato Inicial"
                            description="Agende uma conversa com nosso time de parcerias. Vamos entender seus objetivos de ESG, marca empregadora e contratação."
                        />
                        <ProcessStepCard 
                            step="2"
                            title="Definição do Modelo"
                            description="Co-criamos o plano ideal para sua empresa, seja apoiando uma turma específica, oferecendo mentorias ou contratando talentos."
                        />
                        <ProcessStepCard 
                            step="3"
                            title="Início do Impacto"
                            description="Sua marca ganha visibilidade, nossos alunos ganham oportunidades e você recebe relatórios periódicos sobre a transformação gerada."
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-black/20 border-y border-white/5">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Dúvidas Frequentes</h2>
                         <p className="text-gray-400">Tudo o que você precisa saber sobre a parceria.</p>
                    </div>
                    <div className="bg-[#121212] rounded-2xl border border-white/10 p-2">
                         <FAQItem 
                            question="Minha empresa pode abater do Imposto de Renda?"
                            answer="Sim! Como OSCIP, o Instituto FuturoOn emite recibos que permitem abatimento fiscal para empresas tributadas pelo Lucro Real, seguindo a legislação vigente de incentivo à cultura e educação."
                         />
                         <FAQItem 
                            question="Podemos doar equipamentos usados?"
                            answer="Com certeza. Notebooks, monitores e periféricos em bom estado são revisados por nossa equipe técnica e entregues aos alunos que não possuem computador em casa para acompanhar as aulas."
                         />
                         <FAQItem 
                            question="Como funciona a contratação dos alunos?"
                            answer="Parceiros 'Parceiro de Oportunidades' e Mantenedores têm acesso exclusivo ao nosso banco de talentos e podem divulgar vagas diretamente. Além disso, realizamos a ponte entre o RH da sua empresa e os alunos mais promissores."
                         />
                         <FAQItem 
                            question="Existe valor mínimo para doação pontual?"
                            answer="Não. Qualquer contribuição é bem-vinda e ajuda a manter nossas operações. Para benefícios de marca e relatórios de impacto, sugerimos os planos de Mantenedor."
                         />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-[#09090B] to-[#1a1033]"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
                        Sua empresa está pronta para <br/> o futuro?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Agende uma conversa com nosso time de parcerias e descubra como podemos construir juntos.
                    </p>
                    <a 
                        href="mailto:parcerias@institutofuturoon.org"
                        className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] text-lg"
                    >
                        Agendar Reunião
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                </div>
            </section>
        </div>
    );
};

export default PartnershipsView;
