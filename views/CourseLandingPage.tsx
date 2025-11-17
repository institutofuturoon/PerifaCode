import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Course, CourseBenefit, Module, Lesson } from '../types';

// --- Helper Components ---
const Section: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <section className={`py-16 md:py-20 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode, subtitle?: string }> = ({ children, subtitle }) => (
    <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">{children}</h2>
        {subtitle && <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">{subtitle}</p>}
        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
    </div>
);

const BenefitCard: React.FC<CourseBenefit> = ({ icon, title, description }) => (
    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center transform transition-transform duration-300 hover:-translate-y-2 h-full flex flex-col items-center">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#05aff2] to-[#8a4add] text-white mb-6 shadow-lg shadow-[#8a4add]/20">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-400 flex-grow">{description}</p>
    </div>
);

const ModuleCard: React.FC<{ module: Module, index: number }> = ({ module, index }) => {
    return (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8a4add]/20 text-[#c4b5fd] font-bold text-sm flex-shrink-0">{index + 1}</div>
                <h3 className="font-bold text-lg text-white">{module.title}</h3>
            </div>
            <ul className="space-y-2">
                {module.lessons.map((lesson) => (
                    <li key={lesson.id} className="flex items-start gap-3 text-sm">
                        <svg className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        <span className="text-gray-300">{lesson.title}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};


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
    const content = currentCourse;
    
    if (!content.heroContent) {
        return <div className="text-center py-20">Página de apresentação para este curso em construção.</div>;
    }
    
    const getIconForTitle = (title: string): React.ReactNode => {
        const iconProps = { className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5 };
        switch (title) {
            // C# Course Icons
            case "Mercado Corporativo": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
            case "Além do Backend": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h-2M5 11H3" /></svg>;
            case "Performance e Segurança": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
            case "Carreira Sólida": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
            
            // Shared Methodology Icons
            case "Aulas Presenciais e Online": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
            case "Instrutores do Mercado": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
            case "Projetos para Portfólio": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
            case "Comunidade e Suporte": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
            
            // Digital Literacy Course Icons
            case "Fale com a Família": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.17 48.17 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>;
            case "Autonomia e Praticidade": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>;
            case "Informação e Lazer": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>;
            case "Segurança em Primeiro Lugar": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg>;
            case "Aulas 100% Presenciais": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h4.5V12h-4.5v9z" /></svg>;
            case "Instrutores Pacientes": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;
            case "Turmas Reduzidas": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.512 2.72a3 3 0 01-4.682-2.72 9.094 9.094 0 013.741-.479m7.512 2.72a8.97 8.97 0 01-3.741-.479m3.741.479c-.219.04-.434.062-.65.062a9.105 9.105 0 01-2.092-.372m-3.741-.479A9.094 9.094 0 0112 18.72m0 0c-.219.04-.434.062-.65.062a9.105 9.105 0 00-2.092-.372M3 13.062A9.094 9.094 0 0112 15.062m0 0c2.505 0 4.86-.636 6.942-1.74M3 13.062l-1.923-3.845a4.5 4.5 0 012.44-6.118l.491-.245a4.5 4.5 0 016.118 2.44l1.923 3.845M12 15.062A9.094 9.094 0 0018 13.062m0 0l1.923-3.845a4.5 4.5 0 00-2.44-6.118l-.491-.245a4.5 4.5 0 00-6.118 2.44l-1.923 3.845" /></svg>;
            case "Material de Apoio": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
            
            // English Course Icons
            case "Acesso Ilimitado": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
            case "Carreira Global": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.517M2.25 18L18.75 3.75m0 0A23.953 23.953 0 0012 3c-4.117 0-7.896 1.558-10.824 4.135m18.508 0c.351.467.69.945 1.012 1.441" /></svg>;
            case "Comunidade Open Source": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>;
            case "Salários Maiores": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0l.879-.659M7.5 14.25l-2.489-1.867a1.5 1.5 0 010-2.266l2.489-1.867M16.5 14.25l2.489-1.867a1.5 1.5 0 000-2.266l-2.489-1.867" /></svg>;

            // English Methodology Icons
            case "Aulas 100% Online": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v.007a.007.007 0 01-.007.007h-.007a.007.007 0 01-.007-.007v-.007c0-.004.003-.007.007-.007h.007a.007.007 0 01.007.007zM11.25 17.25v.007a.007.007 0 01-.007.007h-.007a.007.007 0 01-.007-.007v-.007c0-.004.003-.007.007-.007h.007a.007.007 0 01.007.007zM13.5 17.25v.007a.007.007 0 01-.007.007h-.007a.007.007 0 01-.007-.007v-.007c0-.004.003-.007.007-.007h.007a.007.007 0 01.007.007zM15.75 17.25v.007a.007.007 0 01-.007.007h-.007a.007.007 0 01-.007-.007v-.007c0-.004.003-.007.007-.007h.007a.007.007 0 01.007.007zM9 12v.007a.007.007 0 01-.007.007h-.007a.007.007 0 01-.007-.007V12c0-.004.003-.007.007-.007h.007a.007.007 0 01.007.007zM11.25 12v.007a.007.007 0 01-.007.007h-.007a.007.007 0 01-.007-.007V12c0-.004.003-.007.007-.007h.007a.007.007 0 01.007.007zM13.5 12v.007a.007.007 0 01-.007.007h-.007a.007.007 0 01-.007-.007V12c0-.004.003-.007.007-.007h.007a.007.007 0 01.007.007zM15.75 12v.007a.007.007 0 01-.007.007h-.007a.007.007 0 01-.007-.007V12c0-.004.003-.007.007-.007h.007a.007.007 0 01.007.007zM5.25 5.25h13.5m-13.5 0a2.25 2.25 0 012.25-2.25h9a2.25 2.25 0 012.25 2.25m-13.5 0V21a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25V5.25" /></svg>;
            case "Instrutores Bilíngues da Área Tech": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 00.923 1.775 4.5 4.5 0 006.336 0l.002-.002z" /></svg>;
            case "Projetos para Portfólio Global": return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>;


            default: return "💡";
        }
    }

    return (
        <>
            {/* Hero Section */}
            <section className="pt-32 pb-32 md:pt-40 md:pb-40 text-center relative z-10 bg-grid-pattern">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                        {content.heroContent.titleLine1}<br />
                        <span className="text-[#c4b5fd]">{content.heroContent.titleAccent}</span>
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                        {content.heroContent.description}
                    </p>
                     <div className="mt-10">
                        <button onClick={() => openInscriptionModal(currentCourse)} className="inline-block bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30">
                            Quero me inscrever!
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Benefits Section */}
            {content.benefitsSection && (
                <Section className="bg-black/20">
                    <SectionTitle subtitle={content.benefitsSection.subtitle}>
                        {content.benefitsSection.title}
                    </SectionTitle>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {content.benefitsSection.benefits.map((benefit, index) => (
                            <BenefitCard key={index} {...benefit} icon={getIconForTitle(benefit.title)} />
                        ))}
                    </div>
                </Section>
            )}
            
            {/* Curriculum Section */}
            {content.curriculumSection && (
                 <Section>
                    <SectionTitle subtitle={content.curriculumSection.subtitle}>
                        {content.curriculumSection.title}
                    </SectionTitle>
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
                        {currentCourse.modules.map((module, index) => (
                            <ModuleCard key={module.id} module={module} index={index} />
                        ))}
                    </div>
                </Section>
            )}

            {/* Project Section */}
            {currentCourse.projectTitle && (
                <Section className="bg-black/20">
                    <SectionTitle subtitle={currentCourse.projectDescription}>
                        Mão na Massa: Seu Projeto Final
                    </SectionTitle>
                    <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white">{currentCourse.projectTitle}</h3>
                            <h4 className="font-bold text-gray-300 mt-6 mb-2">Critérios de Avaliação:</h4>
                            <ul className="list-disc list-inside text-gray-400 space-y-2">
                                {currentCourse.projectCriteria?.split('\n').map((crit, i) => <li key={i}>{crit.replace('- ', '')}</li>)}
                            </ul>
                        </div>
                        <div className="flex-shrink-0 w-full md:w-1/3 p-8 bg-black/20 rounded-lg border border-dashed border-white/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                             <p className="text-center text-xs text-gray-600 mt-2">Mockup do Projeto</p>
                        </div>
                    </div>
                </Section>
            )}

            {/* Instructor Section */}
            {instructor && (
                 <Section>
                    <SectionTitle>Conheça seu Instrutor</SectionTitle>
                    <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center text-center sm:text-left gap-8">
                        <img src={instructor.avatarUrl} alt={instructor.name} className="h-32 w-32 rounded-full flex-shrink-0" />
                        <div>
                            <h3 className="text-2xl font-bold text-white">{instructor.name}</h3>
                            <p className="text-md font-semibold text-[#c4b5fd]">{instructor.title}</p>
                            <p className="mt-2 text-gray-300">{instructor.bio}</p>
                            <button onClick={() => openProfileModal(instructor)} className="mt-4 text-sm font-semibold text-gray-300 hover:text-white hover:underline">Ver perfil completo</button>
                        </div>
                    </div>
                 </Section>
            )}

            {/* Methodology Section */}
            {content.methodologySection && (
                 <Section className="bg-black/20">
                    <SectionTitle subtitle={content.methodologySection.subtitle}>
                        {content.methodologySection.title}
                    </SectionTitle>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {content.methodologySection.benefits.map((benefit, index) => (
                            <BenefitCard key={index} {...benefit} icon={getIconForTitle(benefit.title)} />
                        ))}
                    </div>
                </Section>
            )}

            {/* Final CTA */}
            {content.ctaSection && (
                <Section>
                    <div className="text-center bg-grid-pattern p-8 md:p-16 rounded-2xl border border-[#8a4add]/20" style={{backgroundImage: 'radial-gradient(circle at center, #8a4add10, transparent 60%)'}}>
                        <h2 className="text-3xl md:text-4xl font-black text-white">{content.ctaSection.title}</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
                           {content.ctaSection.description}
                        </p>
                        <div className="mt-8">
                             <button onClick={() => openInscriptionModal(currentCourse)} className="inline-block bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30">
                                Inscreva-se Agora
                            </button>
                        </div>
                    </div>
                </Section>
            )}

            <Section className="!pt-0 !pb-16">
                <div className="text-center">
                    <button onClick={() => navigate('/courses')} className="text-[#c4b5fd] font-semibold hover:text-white transition-colors group">
                        <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para os cursos
                    </button>
                </div>
            </Section>
        </>
    );
};

export default CourseLandingPage;