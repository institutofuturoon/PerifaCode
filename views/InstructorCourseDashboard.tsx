import React, { useMemo, useState } from 'react';
import { useAppContext } from '../App';
import { User, Course, Lesson } from '../types';
import ProgressBar from '../components/ProgressBar';
import { MOCK_ANALYTICS_DATA_V2 } from '../constants';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; }> = ({ icon, title, value }) => (
    <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10 flex items-start gap-4">
        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-[#6d28d9] to-[#8a4add] flex items-center justify-center shadow-lg shadow-[#8a4add]/20">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400 font-semibold">{title}</p>
            <p className="text-3xl font-black text-white">{value}</p>
        </div>
    </div>
);

const StudentRow: React.FC<{ student: User; course: Course }> = ({ student, course }) => {
    const courseLessons = useMemo(() => course.modules.flatMap(m => m.lessons), [course]);
    const courseLessonIds = useMemo(() => courseLessons.map(l => l.id), [courseLessons]);

    const completedInCourseIds = useMemo(() =>
        student.completedLessonIds.filter(id => courseLessonIds.includes(id)),
        [student.completedLessonIds, courseLessonIds]
    );
    
    const progress = useMemo(() =>
        courseLessonIds.length > 0 ? Math.round((completedInCourseIds.length / courseLessonIds.length) * 100) : 0,
        [completedInCourseIds.length, courseLessonIds.length]
    );
    
    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full" src={student.avatarUrl} alt={student.name} />
                    <div className="ml-4">
                        <div className="text-sm font-medium text-white">{student.name}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap w-64">
                <ProgressBar progress={progress} />
            </td>
        </tr>
    );
};

const InstructorCourseDashboard: React.FC = () => {
    const { monitoringCourse, users, navigate, openBottleneckModal, showToast } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const courseAnalytics = useMemo(() => MOCK_ANALYTICS_DATA_V2.coursePerformance.find(p => p.courseId === monitoringCourse?.id), [monitoringCourse]);
    const lessonPerformanceData = useMemo(() => monitoringCourse ? MOCK_ANALYTICS_DATA_V2.lessonPerformance[monitoringCourse.id as keyof typeof MOCK_ANALYTICS_DATA_V2.lessonPerformance] || [] : [], [monitoringCourse]);
    const atRiskStudentsData = useMemo(() => {
        const atRiskIds = MOCK_ANALYTICS_DATA_V2.studentEngagement.atRiskStudents.map(s => s.id);
        return users.filter(u => atRiskIds.includes(u.id)).map(user => {
            const riskInfo = MOCK_ANALYTICS_DATA_V2.studentEngagement.atRiskStudents.find(s => s.id === user.id);
            return { ...user, riskReason: `Inativo há ${riskInfo?.lastLoginDaysAgo} dias` };
        });
    }, [users]);

    const courseLessons = useMemo(() => monitoringCourse?.modules.flatMap(m => m.lessons) || [], [monitoringCourse]);
    const courseLessonIds = useMemo(() => courseLessons.map(l => l.id), [courseLessons]);

    const enrolledStudents = useMemo(() =>
        users.filter(user =>
            user.role === 'student' &&
            (user.completedLessonIds.some(id => courseLessonIds.includes(id)) || courseAnalytics?.enrolled) // Fallback for mock data
        ), [users, courseLessonIds, courseAnalytics]
    );

    const filteredStudents = useMemo(() => enrolledStudents.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [enrolledStudents, searchTerm]);
    
    const bottleneckLessons = useMemo(() => {
        if (lessonPerformanceData.length < 2) return [];

        const dropOffs = [];
        for (let i = 1; i < lessonPerformanceData.length; i++) {
            const prevCompletions = lessonPerformanceData[i - 1].studentsCompleted;
            const currentCompletions = lessonPerformanceData[i].studentsCompleted;
            const lesson = courseLessons.find(l => l.id === lessonPerformanceData[i].lessonId);
            
            if (prevCompletions > 0 && lesson) {
                const dropOffRate = ((prevCompletions - currentCompletions) / prevCompletions) * 100;
                if (dropOffRate > 0) {
                    dropOffs.push({ lesson, dropOffRate });
                }
            }
        }
        return dropOffs.sort((a, b) => b.dropOffRate - a.dropOffRate).slice(0, 3);
    }, [lessonPerformanceData, courseLessons]);

    if (!monitoringCourse) {
        return <div className="text-center py-20">Selecione um curso para ver o progresso dos alunos.</div>;
    }

    const handleAnalyzeClick = (bottleneckLesson: Lesson) => {
        const lessonIndex = courseLessons.findIndex(l => l.id === bottleneckLesson.id);
        if (lessonIndex <= 0) return;

        const prevLessonId = courseLessons[lessonIndex - 1].id;
        
        const droppedStudents = enrolledStudents.filter(student => 
            student.completedLessonIds.includes(prevLessonId) && 
            !student.completedLessonIds.includes(bottleneckLesson.id)
        );
        
        openBottleneckModal(bottleneckLesson, droppedStudents);
    };

    const totalStudents = courseAnalytics?.enrolled || enrolledStudents.length;

    const AnnouncementsPanel = () => {
        const [message, setMessage] = useState('');
        const [announcements, setAnnouncements] = useState([
            { text: "Olá turma! As notas do primeiro desafio já estão disponíveis. Vejam o feedback e parabéns pelo esforço!", date: "2 dias atrás" },
            { text: "Não se esqueçam da nossa live de tira-dúvidas amanhã às 19h. O link será enviado por email.", date: "5 dias atrás" },
        ]);
    
        const handleSendAnnouncement = () => {
            if (!message.trim()) return;
            
            const newAnnouncement = {
                text: message,
                date: "Agora mesmo"
            };
            
            setAnnouncements([newAnnouncement, ...announcements]);
            setMessage('');
            showToast('📢 Anúncio enviado para todos os alunos do curso!');
        };
    
        return (
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-bold text-white mb-4">📣 Canal de Anúncios da Turma</h2>
                <div className="space-y-4">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        placeholder="Escreva seu anúncio aqui... Ex: Pessoal, adicionei um material extra sobre Flexbox na Aula 3!"
                        className="w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors"
                    />
                    <button
                        onClick={handleSendAnnouncement}
                        disabled={!message.trim()}
                        className="font-semibold py-2 px-5 rounded-lg bg-[#8a4add] text-white hover:bg-[#6d28d9] transition-colors shadow-lg shadow-[#8a4add]/20 disabled:opacity-50"
                    >
                        Enviar Anúncio
                    </button>
                </div>
                <div className="mt-6 border-t border-white/10 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Anúncios Anteriores</h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {announcements.length > 0 ? announcements.map((ann, index) => (
                            <div key={index} className="bg-white/5 p-4 rounded-lg">
                                <p className="text-gray-300 text-sm">{ann.text}</p>
                                <p className="text-right text-xs text-gray-500 mt-2">{ann.date}</p>
                            </div>
                        )) : <p className="text-sm text-gray-500">Nenhum anúncio enviado ainda.</p>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-8">
                <button onClick={() => navigate('admin')} className="text-[#c4b5fd] font-semibold hover:text-white transition-colors group">
                    <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para o painel
                </button>
            </div>

            <div className="mb-12">
                <h1 className="text-4xl font-black text-white">{monitoringCourse.title}</h1>
                <p className="mt-2 text-lg text-gray-400">Dashboard de Acompanhamento</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
                <StatCard icon="👥" title="Total de Alunos" value={totalStudents.toString()} />
                <StatCard icon="🏆" title="Taxa de Conclusão Média" value={`${courseAnalytics?.completionRate || 0}%`} />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Aulas com Maior Evasão */}
                    <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Aulas com Maior Taxa de Evasão</h2>
                        <div className="space-y-4">
                            {bottleneckLessons.length > 0 ? bottleneckLessons.map(({ lesson, dropOffRate }) => (
                                <div key={lesson.id} className="bg-red-900/20 p-4 rounded-lg border border-red-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div>
                                        <p className="font-semibold text-white">{lesson.title}</p>
                                        <p className="text-sm text-red-300">{dropOffRate.toFixed(1)}% de evasão em relação à aula anterior</p>
                                    </div>
                                    <button onClick={() => handleAnalyzeClick(lesson)} className="flex-shrink-0 text-xs font-semibold text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
                                        Analisar Alunos
                                    </button>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-400">Nenhum ponto de evasão significativo encontrado.</p>
                            )}
                        </div>
                    </div>
                    
                    <AnnouncementsPanel />

                     {/* Lista de Alunos */}
                    <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-white">Lista de Alunos</h2>
                             <div className="relative mt-4">
                                <input 
                                    type="search" 
                                    placeholder="Buscar aluno por nome..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-3 pl-10 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                            </div>
                        </div>
                        <table className="min-w-full divide-y divide-white/10">
                            <thead className="bg-white/5">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Aluno</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Progresso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {filteredStudents.length === 0 ? (
                                    <tr><td colSpan={2} className="text-center py-10 text-gray-400">Nenhum aluno encontrado.</td></tr>
                                ) : (
                                    filteredStudents.map(student => <StudentRow key={student.id} student={student} course={monitoringCourse} />)
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Alunos que precisam de atenção */}
                <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 lg:sticky lg:top-24 h-fit">
                    <h2 className="text-xl font-bold text-white mb-4">Alunos que Precisam de Atenção</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {atRiskStudentsData.length > 0 ? (
                            atRiskStudentsData.map(student => (
                                <div key={student.id} className="flex items-center justify-between bg-yellow-900/20 p-3 rounded-lg border border-yellow-500/20">
                                    <div className="flex items-center gap-3">
                                        <img src={student.avatarUrl} alt={student.name} className="h-10 w-10 rounded-full" />
                                        <div>
                                            <p className="text-sm font-semibold text-white">{student.name}</p>
                                            <p className="text-xs text-yellow-300">{student.riskReason}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => alert(`Enviar mensagem para ${student.name}`)} className="text-xs font-semibold text-white bg-white/10 px-3 py-1 rounded-full hover:bg-white/20">Avisar</button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-4">Nenhum aluno em risco no momento. Bom trabalho!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorCourseDashboard;