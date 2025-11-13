import React, { useState } from 'react';

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copyText, setCopyText] = useState('Copiar');

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopyText('Copiado!');
      setTimeout(() => setCopyText('Copiar'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setCopyText('Erro');
       setTimeout(() => setCopyText('Copiar'), 2000);
    });
  };

  return (
    <div className="relative my-6 group">
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-700/50 text-gray-300 text-xs font-semibold px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copyText}
      </button>
    </div>
  );
};

export default CodeBlock;
