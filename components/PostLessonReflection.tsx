import React, { useState } from 'react';

interface PostLessonReflectionProps {
  lessonTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  hasNextLesson: boolean;
  onOpenTutor?: () => void;
}

/**
 * PostLessonReflection: Modal de reflexão após completar aula
 * Solidifica aprendizado e permite ao usuário expressar dúvidas restantes
 * 
 * Fluxo:
 * 1. Usuário completa exercício
 * 2. Modal aparece com perguntas
 * 3. User responde "O que aprendeu?"
 * 4. Se marcou "Tenho dúvidas", Tutor IA abre
 * 5. Depois: Próxima aula ou Revisitar
 */
const PostLessonReflection: React.FC<PostLessonReflectionProps> = ({
  lessonTitle,
  isOpen,
  onClose,
  onContinue,
  hasNextLesson,
  onOpenTutor
}) => {
  const [reflection, setReflection] = useState('');
  const [hasDoubt, setHasDoubt] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Save reflection to user's notes/analytics
    if (reflection.trim()) {
      localStorage.setItem(
        `lesson_reflection_${Date.now()}`,
        reflection
      );
    }

    setSubmitted(true);

    // Se tem dúvida, abre Tutor IA
    if (hasDoubt && onOpenTutor) {
      setTimeout(() => {
        onOpenTutor();
      }, 500);
    }

    // Depois de 2 segundos, fecha modal
    setTimeout(() => {
      setSubmitted(false);
      setReflection('');
      setHasDoubt(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#1a1a1e] border border-[#8a4add]/30 rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Parabéns!
          </h2>
          <p className="text-gray-300 text-sm">
            Você completou <span className="font-semibold text-[#c4b5fd]">"{lessonTitle}"</span>
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Learning Reflection */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-lg">💡</span>
              O que você aprendeu?
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Descreva o principal conceito que você aprendeu nesta aula..."
              rows={4}
              className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none text-white text-sm placeholder-gray-500 resize-none"
            />
          </div>

          {/* Doubt Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="hasDoubt"
              checked={hasDoubt}
              onChange={(e) => setHasDoubt(e.target.checked)}
              className="mt-1 w-4 h-4 cursor-pointer accent-[#8a4add] rounded"
            />
            <label htmlFor="hasDoubt" className="flex-1 cursor-pointer">
              <p className="text-sm font-semibold text-white">
                Tenho dúvidas sobre esta aula
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {hasDoubt ? '✅ Vamos abrir o Tutor IA para você!' : 'O Tutor IA estará disponível para ajudar'}
              </p>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            {hasNextLesson ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-colors"
                >
                  Revisitar
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#8a4add] to-[#6d28d9] hover:opacity-90 text-white text-sm font-semibold transition-opacity"
                >
                  Próxima Aula
                </button>
              </>
            ) : (
              <button
                onClick={handleSubmit}
                className="col-span-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#8a4add] to-[#6d28d9] hover:opacity-90 text-white text-sm font-semibold transition-opacity"
              >
                Finalizar Reflexão
              </button>
            )}
          </div>

          {/* Loading State */}
          {submitted && (
            <div className="text-center pt-4">
              <div className="inline-flex items-center gap-2 text-[#c4b5fd]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#c4b5fd] rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-[#c4b5fd] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-[#c4b5fd] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
                <span className="text-xs font-semibold">Salvando reflexão...</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-gray-500 text-center">
            ✨ Sua reflexão ajuda você a lembrar melhor do que aprendeu
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostLessonReflection;
