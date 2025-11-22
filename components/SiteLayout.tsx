import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import ScrollSpaceship from './ScrollSpaceship';
import AnalyticsTracker from './AnalyticsTracker';

/**
 * SiteLayout: Layout para o SITE INSTITUCIONAL
 * Usado para: Home, About, Blog, Partnerships, etc.
 * 
 * Características:
 * - Header simples (Logo, Menu, Login)
 * - Footer com links
 * - ScrollToTop (volta ao topo)
 * - ScrollSpaceship (decorativo)
 * - Sem Sidebar
 * - Sem dashboard complexo
 */

const SiteLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090B] text-white font-sans selection:bg-[#8a4add] selection:text-white overflow-x-hidden">
      <ScrollToTop />
      <Header />
      <AnalyticsTracker />
      
      <main className="flex-grow relative">
        <ScrollSpaceship />
        <Outlet /> {/* Renderiza as páginas do site aqui */}
      </main>

      <Footer />
    </div>
  );
};

export default SiteLayout;
