import React from 'react';
import { Lesson } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface LessonPreviewProps {
    lesson: Lesson;
    onClose: () => void;
}

const LessonPreview: React.FC<LessonPreviewProps> = ({ lesson, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#121212] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-start sticky top-0 bg-[#121212] z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-[#8a4add]/20 text-[#c4b5fd] text-xs font-bold rounded border border-[#8a4add]/30">
                                PREVIEW
                            </span>
                            <span className="text-xs text-gray-500 font-mono">{lesson.type === 'video' ? '📹 Vídeo' : '📄 Texto'}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
                        <p className="text-sm text-gray-400 mt-1">Duração: {lesson.duration} • {lesson.xp} XP</p>
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

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Video Placeholder */}
                    {lesson.type === 'video' && (
                        <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                            {lesson.videoUrl ? (
                                <iframe 
                                    src={lesson.videoUrl.replace('watch?v=', 'embed/')} 
                                    title={lesson.title}
                                    className="w-full h-full"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p>URL do vídeo não configurada</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Objective */}
                    {lesson.objective && (
                        <div className="bg-white/5 border-l-4 border-[#8a4add] p-6 rounded-r-lg">
                            <h3 className="text-sm font-bold text-[#c4b5fd] uppercase tracking-wider mb-2">Objetivo da Aula</h3>
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                                <MarkdownRenderer content={lesson.objective} />
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    {lesson.mainContent && (
                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
                            <MarkdownRenderer content={lesson.mainContent} />
                        </div>
                    )}

                    {!lesson.mainContent && !lesson.objective && (
                        <div className="text-center py-12 text-gray-500">
                            <p>Nenhum conteúdo adicionado ainda.</p>
                        </div>
                    )}

                    {/* Complementary Material */}
                    {lesson.complementaryMaterial && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3">Material Complementar</h3>
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                                <MarkdownRenderer content={lesson.complementaryMaterial} />
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    {lesson.summary && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3">Resumo</h3>
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                                <MarkdownRenderer content={lesson.summary} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors font-medium"
                    >
                        Fechar Preview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonPreview;
