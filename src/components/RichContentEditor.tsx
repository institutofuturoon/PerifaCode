import React, { useEffect } from 'react';

interface RichContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  label?: string;
  rows?: number;
  placeholder?: string;
}

const RichContentEditor: React.FC<RichContentEditorProps> = ({ value, onChange, textareaRef, label, rows = 8, placeholder = '' }) => {
  
  // Auto-resize textarea to fit content, preventing unnecessary scrolling.
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto'; // Reset height to recalculate scrollHeight
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to content height
    }
  }, [value, textareaRef]);

  const insertText = (syntax: { start: string, end?: string, placeholder: string }) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Store window scroll position and selection to prevent page jump
    const scrollY = window.scrollY;
    const { selectionStart, selectionEnd, value: textareaValue } = textarea;
    
    const selectedText = textareaValue.substring(selectionStart, selectionEnd);
    const textToInsert = selectedText || syntax.placeholder;
    
    const newText = 
        textareaValue.substring(0, selectionStart) +
        syntax.start +
        textToInsert +
        (syntax.end || '') +
        textareaValue.substring(selectionEnd);
    
    onChange(newText);

    // After state update, restore focus, selection, and scroll position
    setTimeout(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            const newCursorPos = selectionStart + syntax.start.length;
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos + textToInsert.length);
            // Restore the window scroll position to prevent the page from jumping
            window.scrollTo(0, scrollY);
        }
    }, 0);
  };

  const toolbarActions = [
    { label: 'Título 2', icon: 'H2', action: () => insertText({ start: '\n## ', end: '', placeholder: 'Título 2' }) },
    { label: 'Título 3', icon: 'H3', action: () => insertText({ start: '\n### ', end: '', placeholder: 'Título 3' }) },
    { label: 'Bold', icon: 'B', action: () => insertText({ start: '**', end: '**', placeholder: 'texto' }) },
    { label: 'Italic', icon: 'I', action: () => insertText({ start: '_', end: '_', placeholder: 'texto' }) },
    { label: 'Lista', icon: '•', action: () => insertText({ start: '\n- ', end: '', placeholder: 'Item' }) },
    { label: 'Citação', icon: '“', action: () => insertText({ start: '\n> ', end: '', placeholder: 'Citação' }) },
    { label: 'Link', icon: '🔗', action: () => insertText({ start: '[', end: '](url)', placeholder: 'texto do link' }) },
    { label: 'Code', icon: '`', action: () => insertText({ start: '`', end: '`', placeholder: 'código' }) },
    { label: 'Code Block', icon: '{}', action: () => insertText({ start: '\n[CODE lang="auto"]\n', end: '\n[/CODE]', placeholder: 'código' }) },
    { label: 'Alert', icon: '⚠️', action: () => insertText({ start: '\n[ALERT type="info"]\n', end: '\n[/ALERT]', placeholder: 'Mensagem de alerta.' }) },
    { label: 'Tip', icon: '💡', action: () => insertText({ start: '\n[TIP]\n', end: '\n[/TIP]', placeholder: 'Dica útil.' }) },
  ];

  return (
    <div>
        {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
        <div className="bg-white/5 border border-white/10 rounded-md">
            <div className="sticky top-16 z-20 flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-[#121212]">
                {toolbarActions.map(action => (
                    <button key={action.label} type="button" onClick={action.action} title={action.label} className="h-8 w-8 rounded text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center font-mono text-lg font-bold">
                        {action.icon}
                    </button>
                ))}
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                placeholder={placeholder}
                className="appearance-none block w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none sm:text-sm transition-all font-mono resize-none overflow-y-hidden"
                spellCheck="false"
            />
        </div>
    </div>
  );
};

export default RichContentEditor;
