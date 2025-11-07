import React, { useState, useEffect, useMemo } from 'react';
import { PlaygroundExerciseData } from '../types';

interface CodePlaygroundProps {
  exercise: PlaygroundExerciseData;
  onComplete: () => void;
  isCompleted: boolean;
}

type CodeType = 'html' | 'css' | 'js';

const CodePlayground: React.FC<CodePlaygroundProps> = ({ exercise, onComplete, isCompleted }) => {
  const [codes, setCodes] = useState({
    html: exercise.startingCode?.html || '',
    css: exercise.startingCode?.css || '',
    js: exercise.startingCode?.js || '',
  });
  const [activeTab, setActiveTab] = useState<CodeType>('html');

  const [iframeSrc, setIframeSrc] = useState('');

  // Debounced update for iframe
  useEffect(() => {
    const handler = setTimeout(() => {
        const newSrc = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <style>${codes.css}</style>
            </head>
            <body>
                ${codes.html}
                <script>${codes.js}</script>
            </body>
            </html>
        `;
        setIframeSrc(newSrc);
    }, 300); // 300ms debounce

    return () => {
        clearTimeout(handler);
    };
  }, [codes]);


  const handleCodeChange = (value: string) => {
    setCodes(prev => ({...prev, [activeTab]: value}));
  }

  const renderPrompt = (text: string) => {
    text = text.replace(/`([^`].*?)`/g, '<code class="bg-purple-500/10 text-purple-300 px-1 py-0.5 rounded text-sm">$1</code>');
    return { __html: text.replace(/\n/g, '<br />') };
  };

  const TabButton: React.FC<{type: CodeType}> = ({type}) => {
    const isActive = activeTab === type;
    return (
        <button
            onClick={() => setActiveTab(type)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${
                isActive ? 'bg-[#0f0f0f] text-white border-b-2 border-purple-400' : 'bg-transparent text-gray-400 hover:bg-white/10'
            }`}
        >
            {type.toUpperCase()}
        </button>
    )
  }

  return (
    <div className="bg-black/20 p-8 rounded-lg border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">✨ Desafio Prático!</h2>
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Instructions and Editor */}
            <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Sua Missão:</h3>
                <div
                    className="prose prose-invert prose-sm text-gray-300 mb-6"
                    dangerouslySetInnerHTML={renderPrompt(exercise.prompt)}
                />
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Editor de Código:</h3>
                <div className="flex-grow flex flex-col bg-[#0f0f0f] border border-white/20 rounded-md overflow-hidden">
                    <div className="bg-black/30 px-2 pt-2 flex items-end gap-1">
                        <TabButton type="html" />
                        <TabButton type="css" />
                        <TabButton type="js" />
                    </div>
                    <textarea
                        value={codes[activeTab]}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        className="w-full h-full flex-grow bg-transparent p-4 font-mono text-sm text-gray-200 focus:outline-none resize-none"
                        spellCheck="false"
                    />
                </div>
            </div>

            {/* Preview */}
            <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Preview Ao Vivo:</h3>
                <iframe
                    srcDoc={iframeSrc}
                    title="Live Preview"
                    sandbox="allow-scripts"
                    className="w-full flex-grow bg-white rounded-md border border-white/20"
                />
            </div>
        </div>
        
        <div className="mt-8 border-t border-white/10 pt-6">
            {isCompleted ? (
                <div className="p-4 rounded-lg text-sm bg-green-500/10 text-green-300 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Parabéns, você concluiu esta atividade!
                </div>
            ) : (
                <button
                onClick={onComplete}
                className="font-semibold py-2 px-6 rounded-lg transition-all duration-300 bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/20"
                >
                Marcar como Concluída
                </button>
            )}
        </div>
    </div>
  );
};

export default CodePlayground;