
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Course, CourseBenefit, Module } from '../types';
import SEO from '../components/SEO';

// --- Helper Components ---

// FIX: Added style prop to allow inline styles.
const Section: React.FC<{ children: React.ReactNode, className?: string, style?: React.CSSProperties }> = ({ children, className = '', style }) => (
    <section className={`py-16 md:py-24 relative z-10 ${className}`} style={style}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode, subtitle?: string }> = ({ children, subtitle }) => (
    <div className="text-center mb-16 max-w-3xl mx-auto">
        {subtitle && <p className="font-semibold text-sm text-[#c4b5fd] uppercase tracking-wider">{subtitle}</p>}
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-2">{children}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-6"></div>
    </div>
);

const BenefitCard: React.FC<CourseBenefit & { icon: React.ReactNode }> = ({ icon, title, description }) => (
    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 text-left h-full flex flex-col">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-[#8a4add] to-[#c4b5fd] text-white mb-6 shadow-lg shadow-[#8a4add]/20">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-400 flex-grow">{description}</p>
    </div>
);

const CurriculumItemCard: React.FC<{ title: string, description: string, index: number }> = ({ title, description, index }) => (
    <div className="flex items-start gap-4 p-6 bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-colors">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#8a4add]/20 text-[#c4b5fd] font-bold text-lg flex items-center justify-center mt-1">
            {index + 1}
        </div>
        <div>
            <h4 className="font-bold text-white text-lg">{title}</h4>
            <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
    </div>
);


// --- Main Component ---
const CourseLandingPage: React.FC = () => {
    const { courses, instructors, openInscriptionModal, openProfileModal } = useAppContext();
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const currentCourse = courses.find(c => c.id === courseId);
    
    if (!currentCourse) {
        return <div className="text-center py-20">Curso não encontrado.</div>;
    }
    
    const instructor = instructors.find(i => i.id === currentCourse.instructorId);
    
    if (!currentCourse.heroContent) {
        // This case should be handled by the router, but as a fallback:
        navigate(`/course/${courseId}`);
        return null; // Return null to prevent rendering anything while navigating
    }
    
    const { heroContent, benefitsSection, curriculumSection, methodologySection, ctaSection } = currentCourse;

    const getIconForTitle = (title: string): React.ReactNode => {
        const iconProps = { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5 };
        const iconMap: { [key: string]: React.ReactNode } = {
            "Mercado Corporativo": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
            "Além do Backend": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 12.75l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.035-.259a3.375 3.375 0 002.456-2.456L18 12.75z" /></svg>,
            "Performance e Segurança": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286z" /></svg>,
            "Carreira Sólida": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 01-8.614 1.44zM2.25 12l8.75-8.75 8.75 8.75M2.25 12l8.75 8.75 8.75-8.75" /></svg>,
            "Aulas Presenciais e Online": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V3.545M12.75 21h-3.375" /></svg>,
            "Instrutores do Mercado": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
            "Projetos para Portfólio": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
            "Comunidade e Suporte": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 12s4.03 8.25 9 8.25z" /></svg>,
            "Baixo Custo Inicial": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.75" /></svg>,
            "Alcance Global": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0112 16.5c-2.998 0-5.74-1.1-7.843-2.918" /></svg>,
            "Flexibilidade e Autonomia": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            "Monetize sua Paixão": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.75" /></svg>,
            "Alta Demanda no Mercado": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 01-8.614 1.44zM2.25 12l8.75-8.75 8.75 8.75M2.25 12l8.75 8.75 8.75-8.75" /></svg>,
            "Tomada de Decisão Inteligente": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
            "Versatilidade do Python": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>,
            "Conte Histórias com Dados": <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V5.25A2.25 2.25 0 0018 3H6A2.25 2.25 0 003.75 5.25v12.75A2.25 2.25 0 006 20.25z" /></svg>,
        };
        return iconMap[title] || iconMap["Mercado Corporativo"]; // Fallback icon
    };

    return (
        <div className="bg-transparent relative">
             <SEO 
                title={currentCourse.seo?.metaTitle || currentCourse.title}
                description={currentCourse.seo?.metaDescription || currentCourse.description}
                keywords={currentCourse.seo?.keywords}
                image={currentCourse.imageUrl}
            />
             <div className="absolute top-8 left-4 sm:left-6 lg:left-8 z-20">
                <button onClick={() => navigate('/courses')} className="text-[#c4b5fd] font-semibold hover:text-white transition-colors group text-sm flex items-center gap-2 bg-black/20 backdrop-blur-sm py-2 px-4 rounded-full border border-white/10 hover:border-white/20">
                    <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span>
                    Voltar para os cursos
                </button>
            </div>

            {/* Hero Section */}
            <Section className="py-32 md:py-48 text-center relative z-10 bg-grid-pattern">
                <div className="max-w-4xl mx-auto">
                    {heroContent.subtitle && <p className="font-semibold text-sm text-[#c4b5fd] uppercase tracking-wider">{heroContent.subtitle}</p>}
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mt-4">
                        {heroContent.titleLine1} <span className="text-[#c4b5fd]">{heroContent.titleAccent}</span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed">
                        {heroContent.description}
                    </p>
                    <div className="mt-10">
                        <button
                            onClick={() => openInscriptionModal(currentCourse)}
                            className="w-full sm:w-auto bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-4 px-10 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30 text-lg"
                        >
                            Garanta seu Interesse na Próxima Turma
                        </button>
                    </div>
                </div>
            </Section>

            {/* Benefits Section */}
            {benefitsSection && (
                 <Section className="bg-black/20">
                    <SectionTitle subtitle={benefitsSection.subtitle}>{benefitsSection.title}</SectionTitle>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefitsSection.benefits.map((benefit, index) => (
                            <BenefitCard key={index} {...benefit} icon={getIconForTitle(benefit.title)} />
                        ))}
                    </div>
                </Section>
            )}

            {/* Curriculum Section */}
            {curriculumSection && (
                <Section>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-4">
                            {curriculumSection.subtitle && <p className="font-semibold text-sm text-[#c4b5fd] uppercase tracking-wider">{curriculumSection.subtitle}</p>}
                             <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">{curriculumSection.title}</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mt-4"></div>
                        </div>
                        <div className="space-y-4">
                            {curriculumSection.items.map((item, index) => (
                                <CurriculumItemCard key={index} {...item} index={index} />
                            ))}
                        </div>
                    </div>
                </Section>
            )}
            
            {/* Methodology Section */}
            {methodologySection && (
                 <Section className="bg-black/20">
                    <SectionTitle subtitle={methodologySection.subtitle}>{methodologySection.title}</SectionTitle>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {methodologySection.benefits.map((benefit, index) => (
                            <BenefitCard key={index} {...benefit} icon={getIconForTitle(benefit.title)} />
                        ))}
                    </div>
                </Section>
            )}
            
            {/* Instructor Section */}
            {instructor && (
                <Section>
                    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 items-center bg-white/5 p-8 rounded-2xl border border-white/10">
                         <div className="flex justify-center">
                            <img src={instructor.avatarUrl} alt={instructor.name} className="w-48 h-48 rounded-full object-cover border-4 border-[#8a4add]" />
                        </div>
                        <div className="md:col-span-2 text-center md:text-left">
                            <h3 className="text-3xl font-bold text-white">Conheça seu Instrutor</h3>
                            <p className="mt-1 text-xl font-semibold text-[#c4b5fd]">{instructor.name}</p>
                            <p className="mt-4 text-gray-300 leading-relaxed">{instructor.bio}</p>
                            <div className="mt-4">
                                <button onClick={() => openProfileModal(instructor)} className="text-sm font-semibold text-white hover:text-[#c4b5fd]">
                                    Ver perfil completo &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                </Section>
            )}
            
            {/* CTA Section */}
            {ctaSection && (
                <Section className="bg-black/20 text-center" style={{backgroundImage: 'radial-gradient(circle at center, #8a4add10, transparent 60%)'}}>
                     <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">{ctaSection.title}</h2>
                     <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">{ctaSection.description}</p>
                     <div className="mt-10">
                        <button
                            onClick={() => openInscriptionModal(currentCourse)}
                            className="w-full sm:w-auto bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-4 px-10 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30 text-lg"
                        >
                            Garanta seu Interesse Agora
                        </button>
                    </div>
                </Section>
            )}

            <Section className="py-12 md:py-16">
                <div className="text-center">
                    <button onClick={() => navigate('/courses')} className="text-[#c4b5fd] font-semibold hover:text-white transition-colors group text-lg flex items-center gap-2 mx-auto">
                        <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span>
                        Voltar para os cursos
                    </button>
                </div>
            </Section>
        </div>
    );
};

export default CourseLandingPage;
