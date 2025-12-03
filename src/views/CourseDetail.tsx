
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lesson, Module, Course, User } from '../types';
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

const LessonItem: React.FC<{ lesson: Lesson, index: number, courseId: string }> = ({ lesson, index, courseId }) => {
    const navigate = useNavigate();
    const icons = {
        video: <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        text: <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    };

    return (
        <button 
            onClick={() => navigate(`/curso/${courseId}/aula/${lesson.id}`)}
            className="w-full flex justify-between items-center py-3 px-4 text-left hover:bg-white/10 rounded-lg transition-colors group border border-transparent hover:border-white/5"
        >
            <div className="flex items-center gap-3">
                <span className={`text-[#c4b5fd] ${lesson.type === 'video' ? 'opacity-100' : 'opacity-70'}`}>{icons[lesson.type]}</span>
                <span className="font-medium text-gray-300 text-sm group-hover:text-white transition-colors">{`${index + 1}. ${lesson.title}`}</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500">{lesson.duration}</span>
        </button>
    );
};

const ModuleAccordion: React.FC<{ module: Module, index: number, courseId: string }> = ({ module, index, courseId }) => {
    const [isOpen, setIsOpen] = useState(index === 0);

    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#121212] transition-all duration-300 hover:border-white/20">
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
                        <LessonItem key={lesson.id} lesson={lesson} index={i} courseId={courseId} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const ClassmateRow: React.FC<{ student: User }> = ({ student }) => (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
        <img src={student.avatarUrl} alt={student.name} className="w-8 h-8 rounded-full border border-white/10" />
        <div>
            <p className="text-xs font-bold text-white">{student.name}</p>
            <p className="text-[10px] text-gray-500">Aluno Interessado</p>
        </div>
    </div>
)

const CourseDetail: React.FC = () => {
    const { courses, openInscriptionModal, user, instructors, users, showToast } = useAppContext();
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const course = useMemo(() => courses.find(c => c.slug === courseId || c.id === courseId), [courses, courseId]);
    const instructor = useMemo(() => instructors.find(i => i.id === course?.instructorId), [instructors, course]);

    // Mock logic for "Interested Students" - In a real app, this would filter by a specific field
    const interestedStudents = useMemo(() => users.filter(u => u.role === 'student').slice(0, 6), [users]);

    if (!course) {
        return <div className="text-center py-20">Curso não encontrado.</div>;
    }

    const isOnlineAndOpen = course.format === 'online' && course.enrollmentStatus === 'open';
    const isPresentialOrWaitlist = !isOnlineAndOpen;

    const handleEnroll = () => {
        if (user && isOnlineAndOpen) {
            const firstLesson = course.modules?.[0]?.lessons?.[0];
            if (firstLesson) {
                navigate(`/curso/${course.id}/aula/${firstLesson.id}`);
            } else {
                showToast("⚠️ Este curso ainda não tem aulas cadastradas.");
            }
        } else {
            openInscriptionModal(course);
        }
    };

    return (
        <div className="bg-[#09090B] min-h-screen">
            <SEO 
                title={`${course.title} | Workspace`}
                description={`Área do aluno para o curso ${course.title}.`}
            />
            
            {/* Workspace Header */}
            <div className="bg-[#121212] border-b border-white/10 pt-8 pb-8 px-4 md:px-8">
                <div className="container mx-auto max-w-6xl">
                    <button onClick={() => navigate('/painel')} className="text-sm text-gray-500 hover:text-white mb-6 flex items-center gap-2 transition-colors">
                        <span>&larr;</span> Voltar ao Painel
                    </button>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${isOnlineAndOpen ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                    {isOnlineAndOpen ? 'Em Andamento' : (course.format === 'presencial' ? 'Turma Presencial' : 'Lista de Espera')}
                                </span>
                                <span className="text-xs text-gray-500 font-mono">v1.0</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{course.title}</h1>
                            <p className="text-gray-400 text-sm max-w-2xl">{course.description}</p>
                        </div>
                        
                        {isOnlineAndOpen && (
                            <button 
                                onClick={handleEnroll}
                                className="bg-[#8a4add] hover:bg-[#7c3aed] text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-[#8a4add]/20 transition-all flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                Continuar Aula
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Left Content Column */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Scenario 1: Online Course Content */}
                        {isOnlineAndOpen ? (
                            <div className="animate-fade-in">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-white">Conteúdo do Curso</h3>
                                    <span className="text-xs text-gray-500">{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} aulas</span>
                                </div>
                                <div className="space-y-3">
                                    {course.modules.map((module, i) => (
                                        <ModuleAccordion key={module.id} module={module} index={i} courseId={course.id} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Scenario 2: Waiting List / Class Hub */
                            <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 text-center animate-fade-in">
                                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                    ⏳
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Aguardando Início da Turma</h3>
                                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                    Este é um curso {course.format}. O conteúdo será liberado ou ministrado presencialmente conforme o cronograma da turma. Fique atento ao seu email!
                                </p>
                                <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-left max-w-md mx-auto">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-3">Status da sua inscrição</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-white font-medium">Pré-inscrição Recebida</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Nossa equipe entrará em contato em breve para confirmar sua vaga.</p>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Sidebar Column */}
                    <div className="space-y-6">
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10 sticky top-24">
                            <div className="space-y-4 mb-6">
                                <InfoCard icon="⏱️" label="Duração" value={course.duration} />
                                <InfoCard icon="📊" label="Nível" value={course.skillLevel} />
                                <InfoCard icon="📍" label="Formato" value={course.format} />
                            </div>
                            
                            {instructor && (
                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-3">Instrutor</p>
                                    <div className="flex items-center gap-3">
                                        <img src={instructor.avatarUrl} alt={instructor.name} className="w-10 h-10 rounded-full border border-white/20" />
                                        <div>
                                            <p className="text-sm font-bold text-white">{instructor.name}</p>
                                            <p className="text-xs text-gray-400">{instructor.title || 'Professor'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* List of Interested Students (Community Feeling) */}
                            {isPresentialOrWaitlist && (
                                <div className="pt-6 mt-6 border-t border-white/10">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-3">Quem vai estudar com você</p>
                                    <div className="space-y-2">
                                        {interestedStudents.map(s => <ClassmateRow key={s.id} student={s} />)}
                                    </div>
                                    <p className="text-center text-[10px] text-gray-600 mt-3">+ outros {Math.floor(Math.random() * 20) + 5} alunos interessados</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
