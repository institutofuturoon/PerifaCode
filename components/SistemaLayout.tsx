import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AnalyticsTracker from './AnalyticsTracker';
import SistemaSidebar from './SistemaSidebar';

/**
 * SistemaLayout: Layout para o SISTEMA LMS
 * Usado para: Dashboard, Lessons, Admin, Profile, etc.
 * 
 * Características:
 * - Sidebar esquerda (navegação com ícones)
 * - Main content área
 * - Sem Footer (workspace)
 * - Mais compacto e funcional
 * - Responsivo (hamburger menu em mobile)
 * - Protegido (requer login)
 */

const SistemaLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-[#09090B] text-white font-sans">
      <AnalyticsTracker />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <SistemaSidebar 
          open={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />

        <div className="flex-1 flex flex-col lg:ml-0 ml-0">
          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto mt-16 lg:mt-0">
            <Outlet /> {/* Renderiza as páginas do sistema aqui */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SistemaLayout;
