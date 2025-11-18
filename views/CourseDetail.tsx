
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lesson, Module, Course } from '../types';
import { useAppContext } from '../App';

const InfoCard: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="bg-[#1f2328] p-3 rounded-lg border border-gray-700/80 flex items-center gap-3">
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#8a4add] flex items-center justify-center">
            <div className="transform scale-75 text-white">{icon}</div>
        </div>
        <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="font-bold text-white capitalize text-sm">{value}</p>
        </div>
    </div>
);

const LessonItem: React.FC<{ lesson: Lesson, index: number }> = ({ lesson, index }) => {
    const icons = {
        video: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        text: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    };

    return (
        <div className="w-full flex justify-between items-center py-2 px-4 text-left">
            <div className="flex items-center gap-3">
                <span className="text-[#c4b5fd]">{icons[lesson.type]}</span>
                <span className="font-medium text-gray-200 text-sm">{`${index + 1}. ${lesson.title}`}</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-400">{lesson.duration}</span>
        </div>
    );
};

const ModuleAccordion: React.FC<{ module: Module, index: number }> = ({ module, index }) => {
    const [isOpen, setIsOpen] = useState(index === 0);
    
    return (
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all duration-300">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 text-left hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8a4add]/20 text-[#c4b5fd] font-bold text-xs flex-shrink-0">{index + 1}</div>
                    <h3 className="font-bold text-base text-white">{module.title}</h3>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] text-gray-400 hidden sm:block">{module.lessons.length} aulas</span>
                    <svg className={`h-4 w-4 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            {isOpen && (
                <div className="px-3 pb-2 divide-y divide-white/10 animate-fade-in">
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
        return <div className="text-center py-20">Curso não encontrado.</div>;
    }

    const instructor = instructors.find(i => i.id === course.instructorId);
    
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);

    return (
        <div className="bg-transparent">
            {/* Main Content Area */}
            <section className="relative pt-16 md:pt-24 pb-16">
                 {/* Background Image */}
                <div className="absolute inset-0">
                    <img src={course.imageUrl} alt={course.title} className="w-full h-1/2 object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/50 via-[#09090B] to-[#09090B]"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-6">
                        <button onClick={() => navigate('/courses')} className="text-[#c4b5fd] font-semibold hover:text-white transition-colors group text-xs flex items-center gap-1">
                            <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar
                        </button>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        
                        {/* Left Column: Course Info + Modules */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Course Header Info */}
                            <div>
                                <span className="font-semibold text-xs text-[#c4b5fd]">{course.track}</span>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-1">{course.title}</h1>
                                <p className="mt-3 text-base text-gray-300">{course.longDescription}</p>
                                
                                {instructor && (
                                    <div className="flex items-center gap-3 mt-5">
                                        <img src={instructor.avatarUrl} alt={instructor.name} className="h-10 w-10 rounded-full border-2 border-[#8a4add]/50" />
                                        <div>
                                            <p className="font-semibold text-white text-sm">{instructor.name}</p>
                                            <p className="text-xs text-gray-400">{instructor.title || 'Instrutor'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Modules and Project */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white">Conteúdo</h2>
                                <div className="space-y-3">
                                    {course.modules.map((module, index) => (
                                        <ModuleAccordion key={module.id} module={module} index={index} />
                                    ))}
                                </div>

                                {course.projectTitle && (
                                    <div className="mt-8 bg-black/20 p-6 rounded-lg border border-white/10">
                                        <h2 className="text-xl font-bold text-white">Projeto Final</h2>
                                        <h3 className="text-lg font-semibold text-[#c4b5fd] mt-1">{course.projectTitle}</h3>
                                        <p className="mt-2 text-sm text-gray-300">{course.projectDescription}</p>
                                        <h4 className="font-bold text-white mt-3 mb-1 text-sm">Critérios:</h4>
                                        <ul className="list-disc list-inside text-gray-300 space-y-0.5 text-sm">
                                            {course.projectCriteria?.split('\n').map((crit, i) => <li key={i}>{crit.replace('- ', '')}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Sticky Action Card */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-20 bg-[#121212] p-5 rounded-2xl border border-white/10 space-y-5">
                                <button 
                                    onClick={() => openInscriptionModal(course)}
                                    className="w-full bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-2.5 px-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 text-sm"
                                >
                                    Inscrever-se
                                </button>
                                
                                <div className="space-y-3">
                                   <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Duração" value={course.duration} />
                                   <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" /></svg>} label="Nível" value={course.skillLevel} />
                                   <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>} label="Formato" value={course.format} />
                                   <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.392C3.057 15.71 4.245 16 5.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10.392c1.057.514 2.245.804 3.5.804c1.255 0 2.443-.29 3.5-.804V4.804C16.943 4.29 15.755 4 14.5 4z" /></svg>} label="Aulas" value={`${totalLessons}`} />
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
