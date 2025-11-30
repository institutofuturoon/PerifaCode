import React, { useState, useEffect } from 'react';

const ReadingProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollProgress = (scrollTop / scrollHeight) * 100;
      setProgress(scrollProgress);
    };

    // Update on mount
    updateProgress();

    // Update on scroll
    window.addEventListener('scroll', updateProgress);
    
    // Update on resize (content height might change)
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-[#8a4add] via-[#c4b5fd] to-[#f27983] transition-all duration-150 ease-out shadow-lg shadow-[#8a4add]/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgressBar;
