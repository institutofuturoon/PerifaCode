import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AnalyticsTracker from './AnalyticsTracker';

/**
 * SistemaLayout: Layout para o SISTEMA LMS
 * Usado para: Dashboard, Lessons, Admin, Profile, etc.
 * 
 * Características:
 * - Header com notificações, perfil
 * - Sidebar esquerda (navegação)
 * - Main content área
 * - Sem Footer (workspace)
 * - Mais compacto e funcional
 * - Protegido (requer login)
 */

const SistemaLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-[#09090B] text-white font-sans">
      <AnalyticsTracker />
      
      <div className="flex flex-1">
        {/* Sidebar - será implementada depois */}
        {/* <SistemaSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} /> */}

        <div className="flex-1 flex flex-col">
          {/* Header - será implementada depois */}
          {/* <SistemaHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} /> */}

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet /> {/* Renderiza as páginas do sistema aqui */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SistemaLayout;
