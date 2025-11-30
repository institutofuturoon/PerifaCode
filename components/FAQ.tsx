import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
}

const FAQ: React.FC<FAQProps> = ({ items, title = "Perguntas Frequentes", subtitle }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#8a4add]/40"
          >
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-white/5"
            >
              <span className="text-white font-bold text-base pr-4">
                {item.question}
              </span>
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full bg-[#8a4add]/20 flex items-center justify-center transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#8a4add]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-5 pt-2">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
