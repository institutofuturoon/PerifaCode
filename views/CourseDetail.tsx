
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lesson, Module, Course } from '../types';
import { useAppContext } from '../App';
import SEO from '../components/SEO';
import Badge from '../components/Badge';

const InfoCard: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="bg-[#1f2328] p-3 rounded-xl border border-gray-700/50 flex items-center gap-3 hover:border-[#8a4add]/30 transition-colors">
        <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-[#8a4add]/20 flex items-center justify-center text-[#c4b5fd]">
            <div className="transform scale-90">{icon}</div>
        </div>
        <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{label}</p>
            <p className="font-bold text-white capitalize text-sm">{value}</p>
        </div>
    </div>
);

const LessonItem: React.FC<{ lesson: Lesson, index: number }> = ({ lesson, index }) => {
    const icons = {
        video: <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        text: <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    };

    return (
        <div className="w-full flex justify-between items-center py-2 px-3 text-left hover:bg-white/5 rounded-md transition-colors">
            <div className="flex items-center gap-3">
                <span className={`text-[#c4b5fd] ${lesson.type === 'video' ? 'opacity-100' : 'opacity-70'}`}>{icons[lesson.type]}</span>
                <span className="font-medium text-gray-300 text-xs group-hover:text-white transition-colors">{`${index + 1}. ${lesson.title}`}</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500">{lesson.duration}</span>
        </div>
    );
};

const ModuleAccordion: React.FC<{ module: Module, index: number }> = ({ module, index }) => {
    const [isOpen, setIsOpen] = useState(index === 0);
    
    return (
        <div className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#8a4add]/20 text-[#c4b5fd] font-bold text-xs flex-shrink-0">{index + 1}</div>
                    <h3 className="font-bold text-sm text-white">{module.title}</h3>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] text-gray-400 bg-black/40 px-2 py-0.5 rounded-full hidden sm:block">{module.lessons.length} aulas</span>
                    <svg className={`h-4 w-4 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            {isOpen && (
                <div className="p-2 space-y-1 border-t border-white/5 animate-fade-in">
                    {module.lessons.map((lesson, lessonIndex) => (
                        <LessonItem 
                            key={lesson.id}
                            lesson={lesson}
                            index={lessonIndex}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const CourseDetail: React.FC = () => {
    const { courses, instructors, openInscriptionModal } = useAppContext();
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const course = useMemo(() => courses.find(c => c.id === courseId), [courses, courseId]);

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-400 text-lg mb-4">Curso não encontrado.</p>
                <button onClick={() => navigate('/courses')} className="text-[#c4b5fd] hover:underline">Voltar para Cursos</button>
            </div>
        );
    }

    const instructor = instructors.find(i => i.id === course.instructorId);
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);

    return (
        <div className="bg-[#09090B] min-h-screen">
             <SEO 
                title={course.title}
                description={course.description}
                image={course.imageUrl}
            />

            {/* Hero Section Padronizada */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
                 {/* Background Elements */}
                <div className="absolute inset-0">
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-20 blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/80 to-[#09090B]/60"></div>
                    <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    {/* Breadcrumb / Back */}
                    <div className="absolute top-0 left-4 sm:left-8">
                        <button onClick={() => navigate('/courses')} className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors bg-black/20 backdrop-blur-md py-2 px-4 rounded-full border border-white/10 hover:border-white/30">
                            <span className="text-lg leading-none">&larr;</span> Voltar
                        </button>
                    </div>

                    <div className="max-w-4xl mx-auto animate-fade-in">
                        <Badge text={course.track} />
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
                            {course.title}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            {course.longDescription}
                        </p>
                        
                        {instructor && (
                            <div className="flex items-center justify-center gap-4 mt-10">
                                <img src={instructor.avatarUrl} alt={instructor.name} className="h-12 w-12 rounded-full border-2 border-[#8a4add]/50 object-cover" />
                                <div className="text-left">
                                    <p className="font-bold text-white text-sm">{instructor.name}</p>
                                    <p className="text-xs text-gray-400">{instructor.title || 'Instrutor Oficial'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-20">
                <div className="grid lg:grid-cols-3 gap-8 items-start -mt-8 md:-mt-12">
                    
                    {/* Left Column: Modules */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#09090B]/50 backdrop-blur-xl rounded-2xl p-1">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <h2 className="text-2xl font-bold text-white">Conteúdo do Curso</h2>
                                <span className="text-xs text-gray-400 font-mono bg-white/5 px-3 py-1 rounded-full">{course.modules.length} Módulos</span>
                            </div>
                            <div className="space-y-3">
                                {course.modules.map((module, index) => (
                                    <ModuleAccordion key={module.id} module={module} index={index} />
                                ))}
                            </div>
                        </div>

                        {course.projectTitle && (
                            <div className="bg-gradient-to-br from-[#121212] to-black p-8 rounded-2xl border border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#8a4add]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#8a4add]/10 transition-colors duration-500"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-[#8a4add] p-2 rounded-lg text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                        </span>
                                        <h2 className="text-xl font-bold text-white">Projeto Final</h2>
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#c4b5fd] mb-2">{course.projectTitle}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-4">{course.projectDescription}</p>
                                    
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Critérios de Avaliação:</h4>
                                        <ul className="grid sm:grid-cols-2 gap-2">
                                            {course.projectCriteria?.split('\n').map((crit, i) => (
                                                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                    <span className="text-[#8a4add] mt-0.5">•</span>
                                                    {crit.replace('- ', '')}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sticky Action Card */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 bg-[#121212]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/5">
                            <div className="mb-6">
                                <div className="flex items-end gap-2 mb-1">
                                    <span className="text-sm text-gray-400">Investimento:</span>
                                    <span className="text-2xl font-bold text-white">Gratuito</span>
                                </div>
                                <p className="text-xs text-gray-500">Acesso vitalício ao conteúdo e comunidade.</p>
                            </div>

                            <button 
                                onClick={() => openInscriptionModal(course)}
                                className="w-full bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-4 px-4 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 text-sm transform hover:scale-105 mb-6"
                            >
                                Inscrever-se Agora
                            </button>
                            
                            <div className="space-y-3">
                                <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Carga Horária" value={course.duration} />
                                <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} label="Nível" value={course.skillLevel} />
                                <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>} label="Certificado" value="Incluso" />
                                <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.392C3.057 15.71 4.245 16 5.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10.392c1.057.514 2.245.804 3.5.804c1.255 0 2.443-.29 3.5-.804V4.804C16.943 4.29 15.755 4 14.5 4z" /></svg>} label="Aulas" value={`${totalLessons}`} />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
