import React, { useState, useEffect } from 'react';

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (docHeight > 0) {
            const scrolled = (scrollTop / docHeight) * 100;
            setScrollPercentage(scrolled);
        } else {
            setScrollPercentage(0);
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="aurora-background text-white">
      <div 
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-[#8a4add] to-[#f27983] z-[60] transition-all duration-75 ease-out"
        style={{ width: `${scrollPercentage}%` }}
      />
      {children}
    </div>
  );
};

export default PageLayout;
