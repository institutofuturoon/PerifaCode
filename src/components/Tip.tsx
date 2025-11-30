import React from 'react';

interface TipProps {
  children: React.ReactNode;
}

const Tip: React.FC<TipProps> = ({ children }) => {
  return (
    <div className="my-6 bg-gradient-to-tr from-[#8a4add]/10 to-transparent p-6 rounded-lg border border-[#8a4add]/30 flex items-start gap-4">
      <div className="flex-shrink-0 mt-1 h-8 w-8 rounded-full flex items-center justify-center bg-[#8a4add]/20 text-[#c4b5fd]">
        <span className="text-lg">💡</span>
      </div>
      <div className="prose prose-invert max-w-none text-gray-300 text-base leading-relaxed">
        <strong className="text-white">Dica:</strong> {children}
      </div>
    </div>
  );
};

export default Tip;
