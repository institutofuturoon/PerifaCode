

import React, { useState } from 'react';
import { Lesson, Module } from '../types';
import ProgressBar from '../components/ProgressBar';
import { useAppContext } from '../App';

const InfoCard: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 flex items-center gap-4">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="font-bold text-white">{value}</p>
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
    
    const iconColor = isLocked ? 'text-gray-500' : isCompleted ? 'text-green-500' : 'text-purple-400';

    return (
        <button 
            onClick={onLessonClick} 
            disabled={isLocked}
            className={`w-full flex justify-between items-center py-3 px-4 rounded-md transition-colors text-left group ${isLocked ? 'cursor-not-allowed opacity-50' : 'hover:bg-white/5'}`}
            title={isLocked ? 'Conclua a aula anterior para desbloquear' : lesson.title}
        >
            <div className="flex items-center gap-3">
                <span className={iconColor}>{getIcon()}</span>
                <span className={`transition-colors ${!isLocked ? 'group-hover:text-white' : ''} ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-300'}`}>{`${index + 1}. ${lesson.title}`}</span>
            </div>
            <span className="text-xs text-gray-500">{lesson.duration}</span>
        </button>
    );
};

const ModuleAccordion: React.FC<{ module: Module, index: number }> = ({ module, index }) => {
    const { user, currentCourse, navigateToLesson } = useAppContext();
    const [isOpen, setIsOpen] = useState(index === 0);
    
    if (!currentCourse) return null;

    const allCourseLessons = currentCourse.modules.flatMap(m => m.lessons);

    return (
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-5 text-left font-bold text-white hover:bg-white/10 transition-colors">
                <span>{`Módulo ${index + 1}: ${module.title}`}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-white/10">
                    <div className="divide-y divide-white/5">
                        {module.lessons.map((lesson, i) => {
                            const overallLessonIndex = allCourseLessons.findIndex(l => l.id === lesson.id);
                            const isCompleted = user?.completedLessonIds.includes(lesson.id) || false;
                            
                            let isLocked = true;
                            if (!user) {
                                isLocked = overallLessonIndex > 0;
                            } else {
                                if (overallLessonIndex === 0) {
                                    isLocked = false;
                                } else {
                                    const prevLesson = allCourseLessons[overallLessonIndex - 1];
                                    isLocked = !user.completedLessonIds.includes(prevLesson.id);
                                }
                            }

                           return <LessonItem key={i} lesson={lesson} index={i} onLessonClick={() => navigateToLesson(currentCourse, lesson)} isCompleted={isCompleted} isLocked={isLocked}/>
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

const CourseDetail: React.FC = () => {
  const { user, navigate, navigateToLesson, instructors, currentCourse } = useAppContext();
  
  if (!currentCourse) {
    // Or a loading state/redirect
    return <div className="text-center py-20">Curso não encontrado.</div>;
  }
  const course = currentCourse;

  const instructor = instructors.find(i => i.id === course.instructorId);

  const allLessons = course.modules.flatMap(m => m.lessons);
  const totalLessons = allLessons.length;
  const completedLessons = user ? allLessons.filter(l => user.completedLessonIds.includes(l.id)) : [];
  const progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
  
  const firstUncompletedLesson = allLessons.find(l => !user?.completedLessonIds.includes(l.id));
  const startLesson = firstUncompletedLesson || allLessons[0];
  
  const handleStart = () => {
    if (startLesson && progress < 100) {
      navigateToLesson(course, startLesson);
    } else if (!user) {
      navigate('login');
    }
  }

  const getButtonState = () => {
    if (!user) return { text: "Faça login para iniciar", disabled: false, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg> };
    if (progress === 100) return { text: "Curso Concluído!", disabled: true, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44-1.22l4.286 5.88a1 1 0 01-1.43 1.43L13 6.414l-2.439 3.34a1 1 0 01-1.43-1.43L12.5 5.176l-2.44-3.339a1 1 0 111.43-1.43L13 4.586l2.707-3.707a1 1 0 011.43 1.43z" clipRule="evenodd" /></svg> };
    if (progress > 0) return { text: "Continuar de Onde Parou", disabled: false, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>};
    return { text: "Iniciar Jornada", disabled: false, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg> };
  };

  const buttonState = getButtonState();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
            <button onClick={() => navigate('courses')} className="text-purple-400 font-semibold hover:text-purple-300 transition-colors group">
                <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para cursos
            </button>
        </div>

        <header className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <span className="font-semibold text-purple-400">{course.track.toUpperCase()}</span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-2">{course.title}</h1>
                <p className="mt-4 text-lg text-gray-300">{course.longDescription}</p>
                <button 
                  onClick={handleStart} 
                  disabled={buttonState.disabled}
                  className="mt-8 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none"
                >
                    {buttonState.text}
                    {buttonState.icon}
                </button>
            </div>
            <div className="hidden lg:block">
                <img src={course.imageUrl} alt={course.title} className="rounded-lg shadow-2xl shadow-purple-900/40 w-full h-auto object-cover"/>
            </div>
        </header>

        <section className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.25278C12 6.25278 6.73223 3 3 3C3 3 3 13.3333 12 21C21 13.3333 21 3 21 3C17.2678 3 12 6.25278 12 6.25278Z" /></svg>} label="Nível" value={course.skillLevel} />
            <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Duração Estimada" value={course.duration} />
            <InfoCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} label="Instrutor(a)" value={instructor?.name || 'Não encontrado'} />
        </section>

        <main className="mt-16 grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
                { user && <ProgressBar progress={progress} className="mb-8" /> }
                <h2 className="text-3xl font-bold text-white mb-6">Conteúdo do Curso</h2>
                <div className="space-y-4">
                    {course.modules.map((module, index) => (
                       <ModuleAccordion key={index} module={module} index={index} />
                    ))}
                </div>
            </div>
            <aside>
                {instructor && (
                    <div className="sticky top-24 bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
                        <h3 className="text-xl font-bold text-white">Seu Mentor</h3>
                        <div className="flex items-center gap-4 mt-4">
                            <img src={instructor.avatarUrl} alt={instructor.name} className="h-16 w-16 rounded-full"/>
                            <div>
                                <p className="font-bold text-white">{instructor.name}</p>
                                <p className="text-sm text-purple-400">{instructor.title}</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-400">
                            Aprenda com quem tem experiência de mercado e está pronto para te guiar nessa jornada.
                        </p>
                    </div>
                )}
            </aside>
        </main>
    </div>
  );
};

export default CourseDetail;