import React, { useEffect, useMemo } from 'react';
import { User, Lesson } from '../types';
import { useAppContext } from '../App';

interface BottleneckAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    lesson: Lesson;
    students: User[];
}

const BottleneckAnalysisModal: React.FC<BottleneckAnalysisModalProps> = ({ isOpen, onClose, lesson, students }) => {
    const { courses } = useAppContext();

    const course = useMemo(() => courses.find(c => c.modules.some(m => m.lessons.some(l => l.id === lesson.id))), [courses, lesson]);
    const courseLessonIds = useMemo(() => course?.modules.flatMap(m => m.lessons.map(l => l.id)) || [], [course]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-[#121212] rounded-2xl border border-[#8a4add]/30 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-[#8a4add]/20 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#121212]/80 backdrop-blur-sm z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Análise de Evasão</h2>
                        <p className="text-gray-400 truncate" title={lesson.title}>Aula: {lesson.title}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl">&times;</button>
                </header>
                
                <div className="p-6 md:p-8 flex-grow overflow-y-auto">
                    {students.length > 0 ? (
                        <ul className="space-y-4">
                            {students.map(student => {
                                const completedInCourseIds = student.completedLessonIds.filter(id => courseLessonIds.includes(id));
                                const progress = courseLessonIds.length > 0 ? Math.round((completedInCourseIds.length / courseLessonIds.length) * 100) : 0;
                                
                                return (
                                    <li key={student.id} className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <img src={student.avatarUrl} alt={student.name} className="h-12 w-12 rounded-full" />
                                            <div>
                                                <p className="font-semibold text-white">{student.name}</p>
                                                <p className="text-sm text-gray-400">{progress}% do curso concluído</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => alert(`Funcionalidade para enviar mensagem para ${student.name} em breve!`)}
                                            className="text-xs font-semibold text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
                                        >
                                            Enviar Mensagem
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="text-center py-10">
                             <p className="text-gray-400">Nenhum aluno encontrado que tenha parado especificamente nesta aula.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BottleneckAnalysisModal;
