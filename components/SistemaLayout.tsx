import React from 'react';
import { Outlet } from 'react-router-dom';
import AnalyticsTracker from './AnalyticsTracker';

/**
 * SistemaLayout: Layout para o SISTEMA LMS
 * Usado para: Dashboard, Lessons, Admin, Profile, etc.
 * 
 * Características:
 * - Main content área
 * - Sem Footer (workspace)
 * - Mais compacto e funcional
 * - Protegido (requer login)
 * 
 * Nota: Sidebar é gerenciada nas páginas individuais (ex: Dashboard com DashboardSidebar)
 */

const SistemaLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090B] text-white font-sans">
      <AnalyticsTracker />
      
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet /> {/* Renderiza as páginas do sistema aqui */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SistemaLayout;
