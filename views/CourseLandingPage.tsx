
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Course, CourseBenefit, Module, Lesson } from '../types';
import SEO from '../components/SEO';

// --- Helper Components ---

const Section: React.FC<{ children: React.ReactNode, className?: string, style?: React.CSSProperties }> = ({ children, className = '', style }) => (
    <section className={`py-16 md:py-24 relative z-10 ${className}`} style={style}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode, subtitle?: string }> = ({ children, subtitle }) => (
    <div className="text-center mb-16 max-w-3xl mx-auto">
        {subtitle && <p className="font-semibold text-sm text-[#c4b5fd] uppercase tracking-wider mb-2">{subtitle}</p>}
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">{children}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-6 rounded-full"></div>
    </div>
);

const BenefitCard: React.FC<CourseBenefit & { icon: React.ReactNode }> = ({ icon, title, description }) => (
    <div className="bg-[#121214] p-8 rounded-2xl border border-white/5 hover:border-[#8a4add]/30 transition-all duration-300 text-left h-full flex flex-col hover:-translate-y-1 shadow-lg hover:shadow-[#8a4add]/10">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-[#8a4add] to-[#c4b5fd] text-white mb-6 shadow-lg shadow-[#8a4add]/20">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-sm text-gray-400 flex-grow leading-relaxed">{description}</p>
    </div>
);

const CurriculumItemCard: React.FC<{ title: string, description: string, index: number }> = ({ title, description, index }) => (
    <div className="flex items-start gap-4 p-6 bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-colors">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#8a4add]/10 text-[#c4b5fd] font-bold text-lg flex items-center justify-center mt-1 border border-[#8a4add]/20">
            {index + 1}
        </div>
        <div>
            <h4 className="font-bold text-white text-lg">{title}</h4>
            <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
    </div>
);

// Fallback component when Marketing Curriculum is missing but Real Modules exist
const RealModuleList: React.FC<{ modules: Module[] }> = ({ modules }) => (
    <div className="space-y-4 max-w-3xl mx-auto">
        <div className="mb-6 text-center">
            <p className="text-sm text-gray-400 italic">Conteúdo Programático Completo</p>
        </div>
        {modules.map((module, idx) => (
            <div key={module.id} className="border border-white/10 rounded-xl overflow-hidden bg-[#121212] hover:border-[#8a4add]/30 transition-colors">
                <div className="p-4 bg-white/5 flex justify-between items-center border-b border-white/5">
                    <h4 className="font-bold text-white text-sm md:text-base">
                        <span className="text-[#8a4add] mr-2 uppercase text-xs tracking-wider">Módulo {idx + 1}</span> 
                        {module.title}
                    </h4>
                    <span className="text-xs text-gray-500 font-mono bg-black/30 px-2 py-1 rounded">{module.lessons.length} aulas</span>
                </div>
                <div className="p-4 grid gap-2">
                    {module.lessons.map((lesson, lIdx) => (
                        <div key={lesson.id} className="flex items-center gap-3 text-gray-400 text-sm pl-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8a4add]/50"></span>
                            <span>{lesson.title}</span>
                        </div>
                    ))}
                    {module.lessons.length === 0 && <p className="text-xs text-gray-600 italic pl-2">Aulas em breve...</p>}
                </div>
            </div>
        ))}
    </div>
);


// --- Main Component ---
const CourseLandingPage: React.FC = () => {
    const { courses, instructors, openInscriptionModal, openProfileModal, user, showToast } = useAppContext();
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    // Find course by ID or Slug
    const currentCourse = courses.find(c => c.id === courseId || c.slug === courseId);
    
    const instructor = instructors.find(i => i.id === currentCourse?.instructorId);
    
    // Fallbacks for Marketing Content
    const heroContent = currentCourse?.heroContent || {
        subtitle: "Curso Oficial",
        titleLine1: currentCourse?.title || "Curso",
        titleAccent: "",
        description: currentCourse?.description || "Junte-se a nós nesta jornada de aprendizado."
    };

    const benefitsSection = currentCourse?.benefitsSection;
    const curriculumSection = currentCourse?.curriculumSection;
    const methodologySection = currentCourse?.methodologySection;
    const ctaSection = currentCourse?.ctaSection || {
        title: "Comece agora mesmo",
        description: "Não deixe para depois. Sua carreira em tecnologia começa com um clique."
    };

    const hasRealModules = currentCourse?.modules && currentCourse.modules.length > 0;

    // --- Lógica Central do Botão de Ação (CTA) ---
    // Separação clara entre Fluxo Institucional e Fluxo Workspace
    const handleCtaClick = () => {
        if (!currentCourse) return;

        const isOnline = currentCourse.format === 'online' || currentCourse.format === 'hibrido';
        const isOpen = currentCourse.enrollmentStatus === 'open';
        const isPresential = currentCourse.format === 'presencial';
        const isSoon = currentCourse.enrollmentStatus === 'soon' || currentCourse.enrollmentStatus === 'closed';

        // Caso 1: Curso Presencial ou "Em Breve" (Sempre abre formulário de interesse, mesmo logado)
        if (isPresential || isSoon) {
            openInscriptionModal(currentCourse);
            return;
        }

        // Caso 2: Curso Online e Aberto
        if (user) {
             // Validação de Perfil Incompleto (Ficha Socioeconômica)
             if (user.profileStatus === 'incomplete') {
                 showToast("⚠️ Para efetivar sua matrícula, precisamos que complete a Ficha Socioeconômica.");
                 navigate('/complete-profile');
                 return;
             }
             // Se logado e perfil completo -> Entra no Workspace (Sistema de Aulas)
             navigate(`/course/${currentCourse.id}`);
        } else {
            // Se deslogado -> Vai para Login/Registro (fluxo de onboarding)
            navigate('/register');
        }
    }

    const getCtaLabel = () => {
        if (!currentCourse) return "Carregando...";
        if (currentCourse.enrollmentStatus === 'soon') return "Entrar na Lista de Espera 🔔";
        if (currentCourse.enrollmentStatus === 'closed') return "Avise-me quando abrir 🔒";
        
        if (currentCourse.format === 'presencial') {
            return user ? "Inscrever-se na Turma 📝" : "Pré-inscrição Gratuita 📝";
        }
        
        // Online e Aberto
        return user ? "Acessar Sala de Aula 🚀" : "Começar Agora (Grátis) 🔥";
    };

    // Fallback Icons Generator
    const getIconForTitle = (title: string): React.ReactNode => {
        const iconProps = { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5 };
        return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    };

    if (!currentCourse) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#09090B] text-white">
                <h2 className="text-2xl font-bold mb-4">Curso não encontrado 😕</h2>
                <button onClick={() => navigate('/courses')} className="text-[#c4b5fd] hover:underline">Voltar para o catálogo</button>
            </div>
        );
    }

    return (
        <div className="bg-[#09090B] min-h-screen relative overflow-x-hidden">
             <SEO 
                title={currentCourse.seo?.metaTitle || currentCourse.title}
                description={currentCourse.seo?.metaDescription || currentCourse.description}
                keywords={currentCourse.seo?.keywords}
                image={currentCourse.imageUrl}
            />
             
             {/* Fixed Navigation Bar for Context */}
             <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
                <button onClick={() => navigate('/courses')} className="pointer-events-auto text-white/70 hover:text-white font-semibold transition-colors group text-sm flex items-center gap-2 bg-black/20 backdrop-blur-md py-2 px-4 rounded-full border border-white/10 hover:border-white/20">
                    <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span>
                    Voltar
                </button>
                {!user && (
                    <button onClick={() => navigate('/login')} className="pointer-events-auto text-sm font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md py-2 px-6 rounded-full transition-colors border border-white/10">
                        Login
                    </button>
                )}
            </div>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center text-center pt-20 pb-20 overflow-hidden">
                {/* Background Layer */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090B] to-[#09090B] z-10"></div>
                    <img src={currentCourse.imageUrl} alt="" className="w-full h-full object-cover opacity-20 blur-sm scale-105" />
                    <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0"></div>
                </div>

                <div className="container mx-auto px-4 relative z-20 max-w-5xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8a4add]/10 border border-[#8a4add]/20 mb-8 animate-fade-in backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8a4add] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8a4add]"></span>
                        </span>
                        <span className="text-xs font-bold text-[#c4b5fd] uppercase tracking-wide">{heroContent.subtitle || 'Curso Oficial'}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none text-white mb-8 drop-shadow-2xl">
                        {heroContent.titleLine1} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8a4add] via-[#c4b5fd] to-[#f27983]">
                            {heroContent.titleAccent}
                        </span>
                    </h1>
                    
                    <p className="mt-6 text-lg md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
                        {heroContent.description}
                    </p>
                    
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleCtaClick}
                            className={`w-full sm:w-auto font-bold py-4 px-10 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(138,74,221,0.5)] text-lg border border-white/10 ${currentCourse.enrollmentStatus === 'open' && currentCourse.format === 'online' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white'}`}
                        >
                            {getCtaLabel()}
                        </button>
                        {!user && (
                            <p className="text-xs text-gray-500 mt-2 sm:mt-0">100% Gratuito &bull; Vagas Limitadas</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Benefits Section (Only if configured in Marketing Tab) */}
            {benefitsSection && benefitsSection.benefits.length > 0 && (
                 <Section className="bg-[#0c0c0e] border-y border-white/5">
                    <SectionTitle subtitle={benefitsSection.subtitle || "Por que este curso?"}>
                        {benefitsSection.title || "O que você ganha"}
                    </SectionTitle>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefitsSection.benefits.map((benefit, index) => (
                            <BenefitCard key={index} {...benefit} icon={getIconForTitle(benefit.title)} />
                        ))}
                    </div>
                </Section>
            )}

            {/* Curriculum Section - Hybrid (Marketing Summary OR Real Modules) */}
            {(curriculumSection?.items.length || 0) > 0 || hasRealModules ? (
                <Section>
                    <div className="grid lg:grid-cols-5 gap-16">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="sticky top-24">
                                <p className="font-semibold text-sm text-[#c4b5fd] uppercase tracking-wider">
                                    {curriculumSection?.subtitle || "Ementa do Curso"}
                                </p>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-2 mb-6">
                                    {curriculumSection?.title || "O que vamos aprender"}
                                </h2 >
                                <p className="text-gray-400 leading-relaxed mb-8">
                                    Uma jornada estruturada do zero ao avançado. Cada módulo foi desenhado para construir conhecimento sólido e aplicável no mercado de trabalho.
                                </p>
                                {instructor && (
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-4">
                                        <img src={instructor.avatarUrl} alt={instructor.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#8a4add]" />
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Seu Instrutor</p>
                                            <p className="font-bold text-white text-lg">{instructor.name}</p>
                                            <p className="text-xs text-[#c4b5fd]">{instructor.title}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-3 space-y-4">
                            {/* FALLBACK LOGIC: Priority to Marketing Highlights if available, else show real modules */}
                            {(curriculumSection?.items.length || 0) > 0 ? (
                                curriculumSection!.items.map((item, index) => (
                                    <CurriculumItemCard key={index} {...item} index={index} />
                                ))
                            ) : (
                                <RealModuleList modules={currentCourse.modules} />
                            )}
                        </div>
                    </div>
                </Section>
            ) : null}
            
            {/* Methodology Section */}
            {methodologySection && methodologySection.benefits.length > 0 && (
                 <Section className="bg-[#0c0c0e] relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-grid-pattern opacity-5 pointer-events-none"></div>
                    <SectionTitle subtitle={methodologySection.subtitle}>{methodologySection.title}</SectionTitle>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {methodologySection.benefits.map((benefit, index) => (
                            <div key={index} className="text-center p-6">
                                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}
            
            {/* CTA Final */}
            <Section className="text-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1033]/50 pointer-events-none"></div>
                 <div className="relative z-10 max-w-3xl mx-auto">
                     <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
                        {ctaSection.title}
                     </h2>
                     <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                        {ctaSection.description}
                     </p>
                     <button
                        onClick={handleCtaClick}
                        className={`w-full sm:w-auto font-bold py-4 px-12 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-[0_0_50px_-10px_rgba(138,74,221,0.6)] text-lg ${currentCourse.enrollmentStatus === 'open' && currentCourse.format === 'online' ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                    >
                        {getCtaLabel()}
                    </button>
                    <p className="mt-6 text-xs text-gray-500 uppercase tracking-widest font-bold">
                        Junte-se à tropa da FuturoOn
                    </p>
                </div>
            </Section>
        </div>
    );
};

export default CourseLandingPage;
