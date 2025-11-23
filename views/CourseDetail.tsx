
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ChevronRight } from 'lucide-react';
import { Lesson, Module, Course } from '../types';
import { useAppContext } from '../contexts/AppContextAdapter';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import ProgressCircle from '../components/ProgressCircle';
import NextLessonCard from '../components/NextLessonCard';

const InfoCard: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="group bg-gradient-to-br from-white/8 to-white/5 p-5 rounded-xl border border-white/10 hover:border-[#8a4add]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#8a4add]/25 hover:bg-white/10">
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-[#8a4add]/40 to-[#f27983]/30 flex items-center justify-center text-[#c4b5fd] group-hover:scale-110 transition-transform">
                <div className="transform scale-100">{icon}</div>
            </div>
            <div className="flex-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{label}</p>
                <p className="font-bold text-white capitalize text-lg mt-1">{value}</p>
            </div>
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
        <div className="border border-white/10 rounded-xl overflow-hidden bg-gradient-to-br from-white/8 to-white/5 transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-white/5">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left bg-white/5 hover:bg-white/10 transition-colors group"
            >
                <span className="font-bold text-white text-sm flex items-center gap-3">
                    <span className="bg-gradient-to-r from-[#8a4add] to-[#f27983] px-2 py-1 rounded-lg text-xs text-white">M{index + 1}</span>
                    <span className="group-hover:text-[#c4b5fd] transition-colors">{module.title}</span>
                </span>
                <span className={`text-gray-400 group-hover:text-[#c4b5fd] transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-3 space-y-1 bg-white/3 border-t border-white/10">
                    {module.lessons.map((lesson, i) => (
                        <LessonItem key={lesson.id} lesson={lesson} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const CourseDetail: React.FC = () => {
    const { courses, openInscriptionModal, user, instructors, showToast, handleEnrollUser } = useAppContext();
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const course = useMemo(() => courses.find(c => c.id === courseId), [courses, courseId]);
    const instructor = useMemo(() => instructors.find(i => i.id === course?.instructorId), [instructors, course]);

    const allLessons = useMemo(() => course?.modules.flatMap(m => m.lessons) || [], [course]);
    const completedLessons = useMemo(() => 
        user?.completedLessonIds.filter(id => allLessons.some(l => l.id === id)) || [], 
        [user, allLessons]
    );
    const progress = allLessons.length > 0 ? Math.round((completedLessons.length / allLessons.length) * 100) : 0;
    const isEnrolled = user?.enrolledCourseIds?.includes(course.id) || completedLessons.length > 0;

    const nextLesson = useMemo(() => {
        if (allLessons.length === 0) return null;
        if (!isEnrolled) return allLessons[0];
        const incompleteLesson = allLessons.find(l => !completedLessons.includes(l.id));
        return incompleteLesson || allLessons[allLessons.length - 1];
    }, [isEnrolled, allLessons, completedLessons]);

    if (!course) {
        return <div className="text-center py-20">Curso não encontrado.</div>;
    }

    const handleEnroll = async () => {
        if (user) {
            if (!isEnrolled) {
                await handleEnrollUser(course.id);
            }
            const firstLesson = course.modules?.[0]?.lessons?.[0];
            if (firstLesson) {
                showToast(`🚀 Você está acessando ${course.title}! Bons estudos.`);
                navigate(`/course/${course.id}/lesson/${firstLesson.id}`);
            } else {
                showToast("⚠️ Este curso ainda não tem aulas cadastradas.");
            }
        } else {
            openInscriptionModal(course);
        }
    };

    const handleContinue = () => {
        if (nextLesson) {
            navigate(`/course/${course.id}/lesson/${nextLesson.id}`);
        }
    };

    const getStatusBadge = () => {
        if (isEnrolled && user) {
            return <div className="inline-block px-3 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400">{progress}% Concluído</div>;
        }
        const statuses: Record<string, string> = {
            'open': 'Matrículas Abertas',
            'closed': 'Turma Lotada',
            'soon': 'Em Breve'
        };
        return <div className="inline-block px-3 py-1 rounded text-xs font-bold bg-[#8a4add]/20 text-[#c4b5fd]">{statuses[course.enrollmentStatus] || 'Curso Online'}</div>;
    };

    return (
        <motion.div 
            className="bg-[#09090B] min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <SEO 
                title={`${course.title} | Curso FuturoOn`}
                description={course.description}
                image={course.imageUrl}
            />
            
            {/* HEADER DE NAVEGAÇÃO - STICKY */}
            <div className="sticky top-0 z-40 bg-[#09090B]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                    {/* BOTÃO VOLTAR */}
                    <motion.button
                        onClick={() => navigate('/dashboard')}
                        whileHover={{ x: -4 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                    >
                        <Home size={18} />
                        <span className="text-sm font-semibold hidden sm:inline">Painel</span>
                    </motion.button>

                    {/* TÍTULO DO CURSO */}
                    <div className="flex-1 mx-4">
                        <h2 className="text-lg font-bold text-white truncate text-center hidden md:block">
                            {course.title}
                        </h2>
                    </div>

                    {/* PROGRESSO + BOTÃO */}
                    <div className="flex items-center gap-3">
                        {isEnrolled && user && (
                            <div className="flex items-center gap-2">
                                <div className="hidden sm:flex items-center gap-1">
                                    <span className="text-xs font-semibold text-gray-300">{progress}%</span>
                                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983]"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* CTA BOTÃO */}
                        {user && isEnrolled && (
                            <motion.button
                                onClick={handleContinue}
                                whileHover={{ scale: 1.05 }}
                                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white text-xs font-bold hover:shadow-lg hover:shadow-[#8a4add]/40 transition-all"
                            >
                                <span>Continuar</span>
                                <ChevronRight size={16} />
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Hero */}
            <div className="relative py-16 md:py-28 bg-gradient-to-b from-black/40 to-black/20 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0">
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-15 blur-lg scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/70 to-transparent"></div>
                </div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-end">
                        <div className="flex-1">
                            <div className="mb-6">{getStatusBadge()}</div>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">{course.title}</h1>
                            <p className="text-gray-300 text-base md:text-xl leading-relaxed max-w-3xl">{course.description}</p>
                            
                            <div className="flex items-center gap-4 mt-6">
                                <img src={instructor?.avatarUrl || 'https://ui73bvafvl0llamc.public.blob.vercel-storage.com/avatars/default-avatar.png'} alt={instructor?.name} className="w-10 h-10 rounded-full border border-white/20" />
                                <div>
                                    <p className="text-sm font-bold text-white">{instructor?.name || 'Equipe FuturoOn'}</p>
                                    <p className="text-xs text-gray-400">{instructor?.title || 'Instrutor'}</p>
                                </div>
                            </div>

                            {/* CTA for Mobile - Improves conversion */}
                            <div className="mt-8 md:hidden">
                                 {user && isEnrolled ? (
                                    <button 
                                        onClick={handleContinue}
                                        className="w-full font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all shadow-lg bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white shadow-[#8a4add]/30"
                                    >
                                        {progress === 100 ? 'Revisar Curso' : progress === 0 ? 'Começar Agora' : 'Continuar de onde parei'}
                                    </button>
                                 ) : (
                                    <button 
                                        onClick={handleEnroll}
                                        className="w-full font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all shadow-lg bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white shadow-[#8a4add]/20"
                                    >
                                        {user ? 'Começar Agora' : 'Inscrever-se Grátis'}
                                    </button>
                                 )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* 🎯 NEXT LESSON CARD - DESTAQUE NO TOPO */}
                {isEnrolled && user && nextLesson && (() => {
                    const nextModule = course.modules.find(m => 
                        m.lessons.some(l => l.id === nextLesson.id)
                    );
                    return nextModule ? (
                        <NextLessonCard
                            lesson={nextLesson}
                            module={nextModule}
                            progress={progress}
                            completedCount={completedLessons.length}
                            totalLessons={allLessons.length}
                            onContinue={handleContinue}
                        />
                    ) : null;
                })()}

                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        {/* SOBRE + FORMATO CONSOLIDADOS */}
                        <div className="rounded-xl bg-gradient-to-br from-white/8 to-white/5 p-6 md:p-8 border border-white/10">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Sobre o Curso</h3>
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">{course.longDescription || course.description}</p>
                            
                            <div className="space-y-3 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#c4b5fd]">📌</span>
                                    <span><strong>Formato:</strong> {course.format === 'online' ? '🌐 Online' : course.format === 'hibrido' ? '🔄 Híbrido' : '📍 Presencial'}</span>
                                </div>
                                {course.format === 'online' && (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span>✅</span>
                                            <span>Estude 100% online, no seu ritmo</span>
                                        </div>
                                        {course.modality?.online?.aiTutorEnabled && (
                                            <div className="flex items-center gap-2">
                                                <span>🤖</span>
                                                <span>Tutor IA disponível 24/7</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Conteúdo do Curso */}
                        <div className="rounded-xl bg-gradient-to-br from-white/8 to-white/5 p-6 md:p-8 border border-white/10">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Conteúdo do Curso</h3>
                            <div className="space-y-3">
                                {course.modules.map((module, i) => (
                                    <ModuleAccordion key={module.id} module={module} index={i} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="rounded-xl bg-gradient-to-br from-white/8 to-white/5 p-6 border border-white/10 sticky top-24 space-y-4">
                            {isEnrolled && user && (
                                <>
                                    {/* Progress simples */}
                                    <div>
                                        <p className="text-xs text-gray-400 font-semibold mb-2">Seu Progresso</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983]"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-white whitespace-nowrap">{progress}%</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Info Cards simples */}
                            <div className="space-y-2">
                                <div className="text-xs text-gray-400 font-semibold">⏱️ Duração</div>
                                <div className="text-sm font-semibold text-white">{course.duration}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-xs text-gray-400 font-semibold">📊 Nível</div>
                                <div className="text-sm font-semibold text-white capitalize">{course.skillLevel}</div>
                            </div>
                            
                            {user && isEnrolled ? (
                                <button 
                                    onClick={handleContinue}
                                    className="w-full mt-4 font-bold py-3 px-6 rounded-lg bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white text-sm hover:opacity-90 transition-opacity hidden md:block"
                                >
                                    {progress === 100 ? 'Revisar' : 'Continuar'}
                                </button>
                            ) : (
                                <button 
                                    onClick={handleEnroll}
                                    className="w-full mt-4 font-bold py-3 px-6 rounded-lg bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white text-sm hover:opacity-90 transition-opacity hidden md:block"
                                >
                                    {user ? 'Começar Agora' : 'Inscrever-se Grátis'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 🎯 RESOURCE 4: SCROLL-TO-TOP BUTTON */}
        </motion.div>
    );
};

export default CourseDetail;
