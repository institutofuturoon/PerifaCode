import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../App';
import {
  FiHome,
  FiBook,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiAward,
  FiBarChart2,
  FiUser,
  FiBookOpen,
} from 'react-icons/fi';

interface SistemaSidebarProps {
  open: boolean;
  onToggle: () => void;
}

const SistemaSidebar: React.FC<SistemaSidebarProps> = ({ open, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAppContext();

  const isActive = (path: string) => location.pathname.startsWith(path);

  // Seções de navegação organizadas
  const navSections = [
    {
      label: 'Estudos',
      items: [
        { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
        { icon: FiBook, label: 'Meus Cursos', path: '/my-courses' },
        { icon: FiBookOpen, label: 'Em Progresso', path: '/in-progress' },
        { icon: FiAward, label: 'Certificados', path: '/certificates' },
      ],
    },
    {
      label: 'Comunidade',
      items: [
        { icon: FiUsers, label: 'Comunidade', path: '/community' },
        { icon: FiMessageSquare, label: 'Fórum', path: '/forum' },
      ],
    },
    {
      label: 'Mentoria',
      items: [
        { icon: FiAward, label: 'Meu Mentor', path: '/mentor-dashboard' },
        { icon: FiBarChart2, label: 'Progresso', path: '/analytics' },
      ],
    },
  ];

  // Admin items (mostrar só se usuário for admin)
  const adminItems = user?.role === 'admin' ? [
    {
      label: 'Admin',
      items: [
        { icon: FiSettings, label: 'Dashboard Admin', path: '/admin' },
        { icon: FiBook, label: 'Cursos', path: '/admin/course-editor' },
        { icon: FiUsers, label: 'Usuários', path: '/admin/user-editor' },
        { icon: FiMessageSquare, label: 'Chat Bot', path: '/admin/chatbot' },
      ],
    },
  ] : [];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 hover:bg-[#1a1a1e] rounded-lg transition"
      >
        {open ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay em mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-screen w-64 bg-[#1a1a1e] border-r border-[#2a2a2e]
          transition-transform duration-300 z-30
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col overflow-y-auto
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#2a2a2e] flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#a855f7] to-[#ec4899] rounded-lg flex items-center justify-center">
            <FiBook size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">FuturoOn</h3>
            <p className="text-xs text-gray-400">LMS</p>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 p-4 space-y-8">
          {[...navSections, ...adminItems].map((section, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 px-3">
                {section.label}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg
                          transition-all duration-200
                          ${
                            active
                              ? 'bg-[#8a4add] text-white'
                              : 'text-gray-300 hover:bg-[#2a2a2e] hover:text-white'
                          }
                        `}
                        onClick={() => {
                          // Fechar sidebar em mobile após clicar
                          if (window.innerWidth < 1024) {
                            onToggle();
                          }
                        }}
                      >
                        <Icon size={18} className="flex-shrink-0" />
                        <span className="text-sm">{item.label}</span>
                        {active && (
                          <div className="ml-auto w-1 h-1 bg-white rounded-full" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer - Perfil + Logout */}
        <div className="p-4 border-t border-[#2a2a2e] space-y-3">
          {/* Perfil */}
          <Link
            to="/profile"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              transition-all duration-200
              ${
                isActive('/profile')
                  ? 'bg-[#8a4add] text-white'
                  : 'text-gray-300 hover:bg-[#2a2a2e] hover:text-white'
              }
            `}
            onClick={() => {
              if (window.innerWidth < 1024) {
                onToggle();
              }
            }}
          >
            <FiUser size={18} />
            <span className="text-sm">Meu Perfil</span>
          </Link>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              onToggle();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-gray-300 hover:bg-red-900/20 hover:text-red-400
              transition-all duration-200"
          >
            <FiLogOut size={18} />
            <span className="text-sm">Sair</span>
          </button>

          {/* Info do usuário */}
          {user && (
            <div className="pt-3 border-t border-[#2a2a2e]">
              <p className="text-xs text-gray-400">Conectado como</p>
              <p className="text-sm font-semibold text-white truncate">
                {user.name || user.email}
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SistemaSidebar;
