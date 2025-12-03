import React, { useState } from 'react';
import { LESSON_TEMPLATES, LessonTemplate } from '../data/lessonTemplates';

interface LessonTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (templateId: string) => void;
}

const LessonTemplateModal: React.FC<LessonTemplateModalProps> = ({ isOpen, onClose, onSelect }) => {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSelect = () => {
        if (selectedTemplate) {
            onSelect(selectedTemplate);
            onClose();
            setSelectedTemplate(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#121212] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                Escolha um Template
                            </h2>
                            <p className="text-sm text-gray-400">
                                Comece com uma estrutura pronta ou crie do zero
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
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        {LESSON_TEMPLATES.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => setSelectedTemplate(template.id)}
                                className={`text-left p-5 rounded-xl border-2 transition-all ${
                                    selectedTemplate === template.id
                                        ? 'border-[#8a4add] bg-[#8a4add]/10'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl">{template.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-bold mb-1">{template.name}</h3>
                                        <p className="text-sm text-gray-400">{template.description}</p>
                                        
                                        {/* Template Details */}
                                        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                {template.template.type === 'video' ? '📹' : '📄'}
                                                {template.template.type === 'video' ? 'Vídeo' : 'Texto'}
                                            </span>
                                            <span>•</span>
                                            <span>{template.template.duration}</span>
                                            <span>•</span>
                                            <span>{template.template.xp} XP</span>
                                        </div>
                                    </div>
                                    
                                    {selectedTemplate === template.id && (
                                        <div className="text-[#c4b5fd]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSelect}
                        disabled={!selectedTemplate}
                        className="px-6 py-2 rounded-lg bg-[#8a4add] text-white hover:bg-[#7c3aed] transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Usar Template
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonTemplateModal;
