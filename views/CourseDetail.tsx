import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lesson, Module, Course } from '../types';
import ProgressBar from '../components/ProgressBar';
import { useAppContext } from '../App';

const InfoCard: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 flex items-center gap-4">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-[#6d28d9] to-[#8a4add] flex items-center justify-center shadow-lg shadow-[#8a4add]/20">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="font-bold text-white capitalize">{value}</p>
        </div>
    </div>
);

const LessonItem: React.FC<{ lesson: Lesson, index: number, onLessonClick: () => void, isCompleted: boolean, isLocked: boolean }> = ({ lesson, index, onLessonClick, isCompleted, isLocked }) => {
    const icons = {
        video: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        text: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        lock: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    };

    const getIcon = () => {
        if (isLocked) return icons.lock;
        if (isCompleted) return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
        return icons[lesson.type];
    }
    
    const iconColor = isLocked ? 'text-gray-500' : isCompleted ? 'text-green-500' : 'text-[#c4b5fd]';

    return (
        <button 
            onClick={onLessonClick} 
            disabled={isLocked}
            className={`w-full flex justify-between items-center py-4 px-5 rounded-md transition-colors text-left group ${isLocked ? 'cursor-not-allowed' : 'hover:bg-white/10'}`}
            title={isLocked ? 'Conclua a aula anterior para desbloquear' : lesson.title}
        >
            <div className="flex items-center gap-4">
                <span className={iconColor}>{getIcon()}</span>
                <span className={`transition-colors font-medium ${isLocked ? 'text-gray-600' : !isLocked && !isCompleted ? 'group-hover:text-white text-gray-200' : 'text-gray-400'} ${isCompleted ? 'line-through' : ''}`}>{`${index + 1}. ${lesson.title}`}</span>
            </div>
            <span className={`text-xs font-semibold ${isLocked ? 'text-gray-600' : 'text-gray-400'}`}>{lesson.duration}</span>
        </button>
    );
};

const ModuleSection: React.FC<{ module: Module, index: number, course: Course }> = ({ module, index, course }) => {
    const { user } = useAppContext();
    const navigate = useNavigate();
    
    const allCourseLessons = course.modules.flatMap(m => m.lessons);
    
    const navigateToLesson = (lesson: Lesson) => {
      navigate(`/course/${course.id}/lesson/${lesson.id}`);
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8a4add]/10 text-[#c4b5fd] font-bold text-sm">{index + 1}</div>
                 <h3 className="font-bold text-xl text-white">{module.title}</h3>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg divide-y divide-white/10">
                {module.lessons.map((lesson, lessonIndex) => {
                    const globalLessonIndex = allCourseLessons.findIndex(l => l.id === lesson.id);
                    const isCompleted = user?.completedLessonIds.includes(lesson.id) || false;
                    
                    let isLocked = false;
                    if (user && globalLessonIndex > 0 && course.lessonRelease === 'sequencial') {
                        const prevLesson = allCourseLessons[globalLessonIndex - 1];
                        if (!user.completedLessonIds.includes(prevLesson.id)) {
                            isLocked = true;
                        }
                    }

                    return (
                        <LessonItem 
                            key={lesson.id}
                            lesson={lesson}
                            index={lessonIndex}
                            onLessonClick={() => navigateToLesson(lesson)}
                            isCompleted={isCompleted}
                            isLocked={isLocked}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const CourseDetail: React.FC = () => {
    const { user, courses, instructors, openInscriptionModal } = useAppContext();
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const course = useMemo(() => courses.find(c => c.id === courseId), [courses, courseId]);

    if (!course) {
        return <div className="text-center py-20">Curso não encontrado.</div>;
    }

    const instructor = instructors.find(i => i.id === course.instructorId);
    
    const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
    const completedLessonIds = user?.completedLessonIds.filter(id => allLessonIds.includes(id)) || [];
    const progress = allLessonIds.length > 0 ? Math.round((completedLessonIds.length / allLessonIds.length) * 100) : 0;
    const isCompleted = progress === 100;
    const isOnlineCourse = course.format === 'online';

    const handleStartOrContinue = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        const firstUncompletedLesson = course.modules.flatMap(m => m.lessons).find(l => !completedLessonIds.includes(l.id));
        if (firstUncompletedLesson) {
             navigate(`/course/${course.id}/lesson/${firstUncompletedLesson.id}`);
        } else if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
            navigate(`/course/${course.id}/lesson/${course.modules[0].lessons[0].id}`);
        }
    };

    return (
        <div className="bg-transparent">
            {/* Main Content Area */}
            <section className="relative pt-20 md:pt-32 pb-24">
                 {/* Background Image */}
                <div className="absolute inset-0">
                    <img src={course.imageUrl} alt={course.title} className="w-full h-1/2 object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/50 via-[#09090B] to-[#09090B]"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        
                        {/* Left Column: Course Info + Modules */}
                        <div className="lg:col-span-2 space-y-16">
                            {/* Course Header Info */}
                            <div>
                                <span className="font-semibold text-[#c4b5fd]">{course.track}</span>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-2">{course.title}</h1>
                                <p className="mt-4 text-lg text-gray-300">{course.longDescription}</p>
                                
                                {instructor && (
                                    <div className="flex items-center gap-3 mt-6">
                                        <img src={instructor.avatarUrl} alt={instructor.name} className="h-12 w-12 rounded-full border-2 border-[#8a4add]/50" />
                                        <div>
                                            <p className="font-semibold text-white">{instructor.name}</p>
                                            <p className="text-sm text-gray-400">{instructor.title || 'Instrutor'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Modules and Project */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-white">Conteúdo do Curso</h2>
                                {course.modules.map((module, index) => (
                                    <ModuleSection key={module.id} module={module} index={index} course={course} />
                                ))}

                                {course.projectTitle && (
                                    <div className="mt-12 bg-black/20 p-8 rounded-lg border border-white/10">
                                        <h2 className="text-2xl font-bold text-white">Projeto Final</h2>
                                        <h3 className="text-xl font-semibold text-[#c4b5fd] mt-2">{course.projectTitle}</h3>
                                        <p className="mt-4 text-gray-300">{course.projectDescription}</p>
                                        <h4 className="font-bold text-white mt-4 mb-2">Critérios de Avaliação:</h4>
                                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                                            {course.projectCriteria?.split('\n').map((crit, i) => <li key={i}>{crit.replace('- ', '')}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Sticky Action Card */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24 bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10 space-y-6">
                                {isOnlineCourse ? (
                                    isCompleted ? (
                                        <>
                                            <h3 className="text-xl font-bold text-white">Parabéns!</h3>
                                            <p className="text-gray-300">Você concluiu este curso.</p>
                                            <ProgressBar progress={100} />
                                            <button
                                                onClick={() => navigate(`/course/${course.id}/certificate`)}
                                                className="w-full bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20"
                                            >
                                                Ver Certificado
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {user && progress > 0 && <ProgressBar progress={progress} />}
                                            <button 
                                                onClick={handleStartOrContinue}
                                                className="w-full bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20"
                                            >
                                                {progress > 0 ? 'Continuar Curso' : 'Iniciar Curso'}
                                            </button>
                                        </>
                                    )
                                ) : (
                                    <button 
                                        onClick={() => openInscriptionModal(course)}
                                        className="w-full bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20"
                                    >
                                        Inscrever-se no curso
                                    </button>
                                )}
                                
                                <div className="border-t border-white/10 pt-6 space-y-4">
                                   <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Duração" value={course.duration} />
                                   <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" /></svg>} label="Nível" value={course.skillLevel} />
                                   <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>} label="Formato" value={course.format} />
                                   <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.392C3.057 15.71 4.245 16 5.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10.392c1.057.514 2.245.804 3.5.804c1.255 0 2.443-.29 3.5-.804V4.804C16.943 4.29 15.755 4 14.5 4z" /></svg>} label="Aulas" value={`${allLessonIds.length}`} />
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CourseDetail;
