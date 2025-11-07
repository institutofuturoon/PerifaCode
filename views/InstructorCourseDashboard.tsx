import React, { useMemo } from 'react';
import { useAppContext } from '../App';
import { User, Course, Lesson } from '../types';
import ProgressBar from '../components/ProgressBar';

interface StudentRowProps {
    student: User;
    course: Course;
}

const StudentRow: React.FC<StudentRowProps> = ({ student, course }) => {
    const courseLessons = useMemo(() => course.modules.flatMap(m => m.lessons), [course]);
    const courseLessonIds = useMemo(() => courseLessons.map(l => l.id), [courseLessons]);

    const completedInCourseIds = useMemo(() =>
        student.completedLessonIds.filter(id => courseLessonIds.includes(id)),
        [student.completedLessonIds, courseLessonIds]
    );
    
    const progress = useMemo(() =>
        courseLessonIds.length > 0 ? Math.round((completedInCourseIds.length / courseLessonIds.length) * 100) : 0,
        [completedInCourseIds, courseLessonIds.length]
    );

    const xpInCourse = useMemo(() =>
        courseLessons
            .filter(l => completedInCourseIds.includes(l.id))
            .reduce((sum, l) => sum + (l.xp || 0), 0),
        [courseLessons, completedInCourseIds]
    );
    
    // Find the last completed lesson in the context of the course's structure
    const lastCompletedLesson = useMemo(() => {
        let lastLesson: Lesson | null = null;
        for (const lesson of courseLessons) {
            if (completedInCourseIds.includes(lesson.id)) {
                lastLesson = lesson;
            }
        }
        return lastLesson;
    }, [courseLessons, completedInCourseIds]);

    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={student.avatarUrl} alt={student.name} />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-white">{student.name}</div>
                        <div className="text-xs text-gray-400">{student.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <ProgressBar progress={progress} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {xpInCourse} XP
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {lastCompletedLesson ? lastCompletedLesson.title : 'Nenhuma'}
            </td>
        </tr>
    );
};

const InstructorCourseDashboard: React.FC = () => {
    const { monitoringCourse, users, navigate } = useAppContext();

    if (!monitoringCourse) {
        return <div className="text-center py-20">Selecione um curso para ver o progresso dos alunos.</div>;
    }

    const courseLessonIds = useMemo(() =>
        monitoringCourse.modules.flatMap(m => m.lessons.map(l => l.id)),
        [monitoringCourse]
    );

    const enrolledStudents = useMemo(() =>
        users.filter(user =>
            user.role === 'student' &&
            user.completedLessonIds.some(id => courseLessonIds.includes(id))
        ), [users, courseLessonIds]
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-8">
                <button onClick={() => navigate('admin')} className="text-purple-400 font-semibold hover:text-purple-300 transition-colors group">
                    <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para o painel
                </button>
            </div>

            <div className="mb-8">
                <h1 className="text-4xl font-black text-white">{monitoringCourse.title}</h1>
                <p className="mt-2 text-lg text-gray-400">Acompanhamento de Alunos</p>
            </div>

            <div className="bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Aluno
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Progresso
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                XP no Curso
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Última Aula Concluída
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {enrolledStudents.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-400">
                                    Nenhum aluno iniciou este curso ainda.
                                </td>
                            </tr>
                        ) : (
                            enrolledStudents.map((student) => (
                                <StudentRow key={student.id} student={student} course={monitoringCourse} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InstructorCourseDashboard;
