import React, { useState, useMemo } from 'react';
import { Course, User } from '../types';

interface UnlockLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: User;
    courses: Course[];
    onUnlock: (studentId: string, lessonId: string) => void;
    onLock: (studentId: string, lessonId: string) => void;
}

const UnlockLessonModal: React.FC<UnlockLessonModalProps> = ({
    isOpen,
    onClose,
    student,
    courses,
    onUnlock,
    onLock
}) => {
    const [selectedCourse, setSelectedCourse] = useState<string>('');

    // Get all lessons from selected course
    const allLessons = useMemo(() => {
        if (!selectedCourse) return [];
        const course = courses.find(c => c.id === selectedCourse);
        if (!course) return [];
        return course.modules.flatMap(m => 
            m.lessons.map(l => ({
                ...l,
                moduleName: m.title
            }))
        );
    }, [selectedCourse, courses]);

    const unlockedLessonIds = student.unlockedLessonIds || [];

    const handleToggle = (lessonId: string) => {
        if (unlockedLessonIds.includes(lessonId)) {
            onLock(student.id, lessonId);
        } else {
            onUnlock(student.id, lessonId);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#121212] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                Gerenciar Acesso às Aulas
                            </h2>
                            <p className="text-sm text-gray-400">
                                Aluno: <span className="text-white font-medium">{student.name}</span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Course Selector */}
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">
                            Selecione o Curso
                        </label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full p-3 bg-black/30 rounded-lg border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none text-white"
                        >
                            <option value="">-- Escolha um curso --</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Lessons List */}
                    {selectedCourse && allLessons.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-bold text-gray-400">
                                    Aulas do Curso
                                </label>
                                <span className="text-xs text-gray-500">
                                    {unlockedLessonIds.filter(id => allLessons.some(l => l.id === id)).length} desbloqueadas
                                </span>
                            </div>
                            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                                {allLessons.map((lesson, index) => {
                                    const isUnlocked = unlockedLessonIds.includes(lesson.id);
                                    const isCompleted = student.completedLessonIds.includes(lesson.id);
                                    const hasPrerequisites = lesson.prerequisites && lesson.prerequisites.length > 0;

                                    return (
                                        <div
                                            key={lesson.id}
                                            className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs text-gray-500 font-mono">
                                                            {index + 1}.
                                                        </span>
                                                        <h4 className="text-sm font-medium text-white">
                                                            {lesson.title}
                                                        </h4>
                                                        {isCompleted && (
                                                            <span className="text-green-400 text-xs">✓</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        Módulo: {lesson.moduleName}
                                                    </p>
                                                    {hasPrerequisites && (
                                                        <p className="text-xs text-yellow-600/80 mt-1">
                                                            ⚠️ Tem {lesson.prerequisites!.length} pré-requisito(s)
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleToggle(lesson.id)}
                                                    disabled={isCompleted}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                                        isCompleted
                                                            ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                                            : isUnlocked
                                                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                                                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
                                                    }`}
                                                    title={isCompleted ? 'Aula já completada' : undefined}
                                                >
                                                    {isCompleted ? 'Completada' : isUnlocked ? '🔓 Bloquear' : '🔒 Desbloquear'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {selectedCourse && allLessons.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Este curso não possui aulas cadastradas.
                        </div>
                    )}

                    {!selectedCourse && (
                        <div className="text-center py-12 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <p>Selecione um curso para gerenciar o acesso às aulas</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors font-medium"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnlockLessonModal;
