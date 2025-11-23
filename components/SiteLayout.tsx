import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AnalyticsTracker from './AnalyticsTracker';

const SiteLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090B] text-white font-sans selection:bg-[#8a4add] selection:text-white overflow-x-hidden">
      <Header />
      <AnalyticsTracker />
      
      <main className="flex-grow relative">
        <Outlet /> {/* Renderiza as páginas do site aqui */}
      </main>

      <Footer />
    </div>
  );
};

export default SiteLayout;
