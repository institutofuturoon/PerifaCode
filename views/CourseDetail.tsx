
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
        <div className="w-full flex justify-between items-center py-2 px-3 text-left hover:bg-white/5 rounded-md transition-colors group">
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
        <div className="border border-white/10 rounded-lg overflow-hidden bg-[#121212] transition-all duration-300 hover:border-white/20">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left bg-white/5 hover:bg-white/10 transition-colors"
            >
                <span className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="text-[#8a4add]">Módulo {index + 1}:</span> {module.title}
                </span>
                <span className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-2 space-y-1">
                    {module.lessons.map((lesson, i) => (
                        <LessonItem key={lesson.id} lesson={lesson} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const CourseDetail: React.FC = () => {
    const { courses, openInscriptionModal, user, instructors, showToast } = useAppContext();
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const course = useMemo(() => courses.find(c => c.id === courseId), [courses, courseId]);
    const instructor = useMemo(() => instructors.find(i => i.id === course?.instructorId), [instructors, course]);

    if (!course) {
        return <div className="text-center py-20">Curso não encontrado.</div>;
    }

    const handleEnroll = () => {
        if (user) {
            const firstLesson = course.modules?.[0]?.lessons?.[0];
            if (firstLesson) {
                // Simular inscrição se necessário (adicionar ID do curso aos cursos do usuário no backend)
                // Por enquanto, apenas redireciona, assumindo "auto-matrícula" ao clicar.
                showToast(`🚀 Você está acessando ${course.title}! Bons estudos.`);
                navigate(`/course/${course.id}/lesson/${firstLesson.id}`);
            } else {
                showToast("⚠️ Este curso ainda não tem aulas cadastradas.");
            }
        } else {
            // Se não logado, abre o modal de "interesse" que levará ao registro
            openInscriptionModal(course);
        }
    };

    const getStatusBadge = () => {
        switch(course.enrollmentStatus) {
            case 'open': return <Badge text="Matrículas Abertas" variant="success" />;
            case 'closed': return <Badge text="Turma Lotada" variant="danger" />;
            case 'soon': return <Badge text="Em Breve" variant="warning" />;
            default: return <Badge text="Curso Online" variant="default" />;
        }
    };

    return (
        <div className="bg-[#09090B] min-h-screen">
            <SEO 
                title={`${course.title} | Curso FuturoOn`}
                description={course.description}
                image={course.imageUrl}
            />
            
            {/* Hero */}
            <div className="relative py-20 md:py-24 bg-black/20 overflow-hidden">
                <div className="absolute inset-0">
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-20 blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/80 to-transparent"></div>
                </div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-end">
                        <div className="flex-1">
                            {getStatusBadge()}
                            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{course.title}</h1>
                            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl">{course.description}</p>
                            
                            <div className="flex items-center gap-4 mt-6">
                                <img src={instructor?.avatarUrl || 'https://ui73bvafvl0llamc.public.blob.vercel-storage.com/avatars/default-avatar.png'} alt={instructor?.name} className="w-10 h-10 rounded-full border border-white/20" />
                                <div>
                                    <p className="text-sm font-bold text-white">{instructor?.name || 'Equipe FuturoOn'}</p>
                                    <p className="text-xs text-gray-400">{instructor?.title || 'Instrutor'}</p>
                                </div>
                            </div>

                            {/* CTA for Mobile - Improves conversion */}
                            <div className="mt-8 md:hidden">
                                 <button 
                                    onClick={handleEnroll}
                                    className={`w-full font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all shadow-lg ${user ? 'bg-green-600 text-white shadow-green-500/20' : 'bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white shadow-[#8a4add]/20'}`}
                                >
                                    {user ? 'Acessar Conteúdo' : 'Inscrever-se Grátis'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4">Sobre o Curso</h3>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{course.longDescription}</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Conteúdo do Curso</h3>
                            <div className="space-y-3">
                                {course.modules.map((module, i) => (
                                    <ModuleAccordion key={module.id} module={module} index={i} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10 sticky top-24">
                            <div className="space-y-4 mb-6">
                                <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Duração" value={course.duration} />
                                <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} label="Nível" value={course.skillLevel} />
                                <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Formato" value={course.format} />
                            </div>
                            
                            <button 
                                onClick={handleEnroll}
                                className={`w-full font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all shadow-lg hidden md:block ${user ? 'bg-green-600 text-white shadow-green-500/20' : 'bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white shadow-[#8a4add]/20'}`}
                            >
                                {user ? 'Acessar Conteúdo' : 'Inscrever-se Grátis'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
