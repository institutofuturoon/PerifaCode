
import React, { useState } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../assets/Logo';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles?: User['role'][];
}

interface NavGroup {
    label: string;
    items: NavItem[];
}

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: User['role'];
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, onTabChange, userRole, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navGroups: NavGroup[] = [
    {
        label: 'Geral',
        items: [
             { 
                id: 'overview', 
                label: 'Visão Geral', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>,
                roles: ['admin', 'instructor', 'student']
            },
            {
                id: 'myAgenda',
                label: 'Minha Agenda',
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>,
                roles: ['instructor', 'admin']
            },
        ]
    },
    {
        label: 'Acadêmico',
        items: [
            {
                id: 'myCourses',
                label: 'Meus Cursos',
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
                roles: ['student']
            },
            { 
                id: 'courses', 
                label: 'Gerenciar Cursos', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
                roles: ['admin', 'instructor']
            },
             { 
                id: 'tracks', 
                label: 'Trilhas', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 13V2l8 4-8 4"/><path d="M20.55 10.23A9 9 0 1 1 8 4.94"/></svg>,
                roles: ['admin']
            },
            { 
                id: 'events', 
                label: 'Eventos', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>,
                roles: ['admin', 'instructor']
            },
             { 
                id: 'students', 
                label: 'Alunos', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                roles: ['admin']
            },
        ]
    },
    {
        label: 'Administrativo',
        items: [
            { 
                id: 'blog', 
                label: 'Blog', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
                roles: ['admin', 'instructor']
            },
            { 
                id: 'moderation', 
                label: 'Moderação', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                roles: ['admin']
            },
             { 
                id: 'teamMembers', 
                label: 'Equipe', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                roles: ['admin']
            },
            { 
                id: 'transparency', 
                label: 'Transparência', 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"/><path d="M12 17v-9"/><path d="M9 13.5l3 3.5 3-3.5"/></svg>,
                roles: ['admin']
            },
        ]
    }
  ];

  // Filter groups and items based on role
  const filteredGroups = navGroups.map(group => ({
    ...group,
    items: group.items.filter(item => !item.roles || item.roles.includes(userRole))
  })).filter(group => group.items.length > 0);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 bottom-0 bg-[#050505] border-r border-white/5 z-50 flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        ${collapsed ? 'w-20' : 'w-64'}
      `}>
        
        {/* Sidebar Header */}
        <div className={`h-16 flex items-center border-b border-white/5 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
             {!collapsed && (
                <div onClick={() => navigate('/')} className="cursor-pointer transform scale-90 origin-left opacity-80 hover:opacity-100 transition-opacity">
                    <Logo className="h-6 w-auto" />
                </div>
             )}
             <button 
                onClick={() => {
                    if(window.innerWidth >= 768) setCollapsed(!collapsed);
                    else onClose();
                }}
                className="text-gray-500 hover:text-white p-1 rounded-md hover:bg-white/5"
             >
                {collapsed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/></svg>
                )}
             </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 space-y-6 custom-scrollbar">
            {filteredGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="px-3">
                    {!collapsed && (
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-3">
                            {group.label}
                        </h4>
                    )}
                    <ul className="space-y-1">
                        {group.items.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => {
                                        onTabChange(item.id);
                                        if (window.innerWidth < 768) onClose();
                                    }}
                                    title={collapsed ? item.label : ''}
                                    className={`w-full flex items-center rounded-md transition-all duration-200 group relative
                                        ${collapsed ? 'justify-center px-2 py-3' : 'px-3 py-2 gap-3'}
                                        ${activeTab === item.id 
                                            ? 'bg-white/5 text-[#c4b5fd] border-l-2 border-[#8a4add] shadow-[inset_4px_0_10px_rgba(138,74,221,0.1)]' 
                                            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border-l-2 border-transparent'
                                        }
                                    `}
                                >
                                    <span className={`transition-colors ${activeTab === item.id ? 'text-[#8a4add]' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                        {item.icon}
                                    </span>
                                    {!collapsed && (
                                        <span className="text-[13px] font-medium">{item.label}</span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5">
             <button onClick={() => navigate('/')} className={`flex items-center gap-3 text-gray-500 hover:text-white w-full px-3 py-2 rounded-md hover:bg-white/5 transition-colors ${collapsed ? 'justify-center' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                {!collapsed && <span className="text-[13px] font-medium">Sair do Painel</span>}
             </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
