import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';

interface KeyboardHint {
  key: string;
  action: string;
  description: string;
}

const KEYBOARD_HINTS: KeyboardHint[] = [
  { key: 'ESC', action: 'Voltar ao Dashboard', description: 'Sai da aula e volta ao painel de cursos' },
  { key: '←', action: 'Aula Anterior', description: 'Navega para a aula anterior do curso' },
  { key: '→', action: 'Próxima Aula', description: 'Navega para a próxima aula' },
  { key: 'Enter', action: 'Completar Aula', description: 'Marca a aula como concluída' },
  { key: '?', action: 'Mostrar Atalhos', description: 'Abre este menu novamente' },
];

const KeyboardHintsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Abrir modal ao pressionar ?
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  return (
    <>
      {/* BUTTON HINT */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-400 transition-colors cursor-help"
        whileHover={{ scale: 1.05 }}
        title="Pressione ? para ver atalhos"
      >
        <HelpCircle size={14} />
        <span>Pressione <kbd className="bg-white/10 px-2 py-1 rounded">?</kbd> para atalhos</span>
      </motion.button>

      {/* MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <HelpCircle size={24} className="text-[#f27983]" />
                  Atalhos de Teclado
                </h2>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ rotate: 90 }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </motion.button>
              </div>

              {/* HINTS */}
              <div className="space-y-4 mb-6">
                {KEYBOARD_HINTS.map((hint, idx) => (
                  <motion.div
                    key={hint.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-4"
                  >
                    <kbd className="flex-shrink-0 bg-gradient-to-br from-[#8a4add] to-[#f27983] text-white px-3 py-2 rounded-lg font-bold text-sm min-w-fit">
                      {hint.key}
                    </kbd>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">{hint.action}</p>
                      <p className="text-xs text-gray-400 mt-1">{hint.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* FOOTER */}
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white rounded-lg font-semibold transition-all"
              >
                Entendi! (ESC para fechar)
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardHintsModal;
