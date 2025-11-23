
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContextAdapter';
import ProjectCard from '../components/ProjectCard';
import { Project, User } from '../types';
import SEO from '../components/SEO';

const SidebarWidget: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-black/20 backdrop-blur-xl p-5 rounded-xl border border-white/10 mb-6">
        <h3 className="text-md font-bold text-white mb-3">{title}</h3>
        {children}
    </div>
);

const ContributorRow: React.FC<{ user: User, rank: number }> = ({ user, rank }) => {
    const getRankStyle = (r: number) => {
        switch(r) {
            case 1: return { color: 'text-yellow-400', icon: '👑', border: 'border-yellow-500/50', bg: 'bg-yellow-500/10' };
            case 2: return { color: 'text-gray-300', icon: '🥈', border: 'border-gray-400/50', bg: 'bg-gray-400/10' };
            case 3: return { color: 'text-amber-600', icon: '🥉', border: 'border-amber-600/50', bg: 'bg-amber-600/10' };
            default: return { color: 'text-gray-500', icon: `#${r}`, border: 'border-white/10', bg: 'transparent' };
        }
    };

    const style = getRankStyle(rank);

    return (
        <div className={`flex items-center justify-between py-2 px-2 rounded-lg mb-1 last:mb-0 transition-all hover:bg-white/5 ${rank <= 3 ? style.bg : ''}`}>
            <div className="flex items-center gap-3">
                <span className={`font-black text-base w-5 text-center flex-shrink-0 ${style.color}`}>
                    {style.icon}
                </span>
                <img src={user.avatarUrl} alt={user.name} className={`w-8 h-8 rounded-full object-cover border-2 ${style.border}`} />
                <div>
                    <p className={`text-xs font-bold truncate max-w-[100px] ${rank <= 3 ? 'text-white' : 'text-gray-300'}`}>{user.name}</p>
                    <p className="text-[9px] text-gray-500 uppercase tracking-wide">{user.title || 'Dev'}</p>
                </div>
            </div>
            <div className="text-right">
                 <span className="block text-[10px] font-bold text-[#c4b5fd]">{user.xp} XP</span>
            </div>
        </div>
    );
};

const EmptyState: React.FC<{ onClear: () => void }> = ({ onClear }) => (
    <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10 border-dashed flex flex-col items-center justify-center animate-fade-in col-span-full">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        </div>
        <p className="text-gray-300 text-base font-medium">Nenhum projeto encontrado.</p>
        <p className="text-gray-500 text-xs mt-1 max-w-md">Tente buscar por outra tecnologia ou limpe os filtros para ver tudo.</p>
        <button onClick={onClear} className="mt-4 px-5 py-1.5 bg-[#8a4add]/10 text-[#c4b5fd] border border-[#8a4add]/20 rounded-full hover:bg-[#8a4add]/20 transition-colors font-semibold text-xs">
            Limpar filtros
        </button>
    </div>
);

const CommunityView: React.FC = () => {
    const { projects, user, users } = useAppContext();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<string>('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    const allProjectTechs = useMemo(() => {
        const techSet = new Set<string>();
        projects.forEach(project => {
            if (project.status === 'approved') {
                project.technologies.forEach(tech => techSet.add(tech));
            }
        });
        return ['Todos', ...Array.from(techSet).sort()];
    }, [projects]);

    const filteredProjects = useMemo(() => {
        let result = projects;
        
        // Filter by status: Approved OR (Pending/Rejected AND Owner)
        result = result.filter(p => {
            const isApproved = p.status === 'approved';
            const isOwner = user && p.authorId === user.id;
            return isApproved || isOwner;
        });

        // Filter by Tech
        if (activeFilter !== 'Todos') {
            result = result.filter(project => project.technologies.includes(activeFilter));
        }
        
        // Filter by Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(p => 
                p.title.toLowerCase().includes(lowerTerm) || 
                p.description.toLowerCase().includes(lowerTerm)
            );
        }
        
        return result;
    }, [projects, activeFilter, searchTerm, user]);
    
    const topContributors = useMemo(() => {
        // Ordena usuários por XP
        return [...users]
            .sort((a, b) => (b.xp || 0) - (a.xp || 0))
            .slice(0, 5);
    }, [users]);

    const handleProjectSelect = (project: Project) => {
        if (project.status === 'approved' || (user && project.authorId === user.id)) {
             navigate(`/project/${project.id}`);
        }
    };

    const handleNavigateToProjectEditor = () => {
        navigate('/project/edit');
    };
    
    const clearFilters = () => {
        setActiveFilter('Todos');
        setSearchTerm('');
    }

    return (
        <div className="bg-[#09090B] min-h-screen">
            <SEO 
                title="Comunidade e Projetos | FuturoOn"
                description="Vitrine de talentos da periferia. Explore projetos reais desenvolvidos por nossos alunos em React, Node.js, Python e muito mais."
                keywords={['portfólio', 'projetos alunos', 'desenvolvedores júnior', 'vitrine tech', 'comunidade de tecnologia', 'opensource']}
            />
            
            {/* Hero Section for Showcase */}
            <div className="relative bg-black/20 border-b border-white/5 py-16">
                 <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                     <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="max-w-2xl">
                            <span className="text-[#c4b5fd] font-semibold text-sm uppercase tracking-widest mb-2 block">Portfólio da Comunidade</span>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
                                Vitrine de <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">Talentos</span>
                            </h1>
                            <p className="text-lg text-gray-400 leading-relaxed">
                                Explore o que os alunos da FuturoOn estão construindo. Projetos reais, código aberto e inovação vinda da periferia.
                            </p>
                        </div>
                        <div className="w-full md:w-auto">
                            {user ? (
                                <button
                                    onClick={handleNavigateToProjectEditor}
                                    className="w-full md:w-auto bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 transform hover:scale-105"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                    Submeter Projeto
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full md:w-auto bg-white/10 border border-white/20 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/20 transition-all text-sm"
                                >
                                    Entrar para Participar
                                </button>
                            )}
                        </div>
                     </div>
                 </div>
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid lg:grid-cols-4 gap-8 relative">
                    {/* Main Content Column */}
                    <div className="lg:col-span-3">
                        {/* Filter Bar */}
                        <div className="sticky top-16 z-30 bg-[#09090B]/95 backdrop-blur-xl border-b border-white/10 -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-t-xl mb-6 pt-2 pb-4">
                            <div className="flex flex-col gap-4">
                                <div className="relative w-full">
                                    <input 
                                        type="text" 
                                        placeholder="Buscar projetos por nome ou descrição..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full p-3 pl-10 bg-white/5 rounded-xl border border-white/10 focus:ring-1 focus:ring-[#8a4add] focus:outline-none transition-colors text-sm text-white placeholder-gray-500"
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </div>
                                </div>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                    {allProjectTechs.map(tech => (
                                        <button
                                            key={tech}
                                            onClick={() => setActiveFilter(tech)}
                                            className={`flex-shrink-0 px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300 border ${
                                            activeFilter === tech
                                                ? 'bg-[#8a4add] text-white border-[#8a4add] shadow-md shadow-[#8a4add]/20'
                                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            {tech}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Projects Grid */}
                        <div className="min-h-[300px]">
                             <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map(project => (
                                        <ProjectCard key={project.id} project={project} onProjectSelect={handleProjectSelect} />
                                    ))
                                ) : (
                                    <EmptyState onClear={clearFilters} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <SidebarWidget title="🏆 Top Contribuidores">
                                <div className="flex flex-col -mx-2">
                                    {topContributors.map((contributor, index) => (
                                        <ContributorRow key={contributor.id} user={contributor} rank={index + 1} />
                                    ))}
                                </div>
                            </SidebarWidget>

                             <div className="p-6 bg-gradient-to-br from-[#18181b] to-[#09090b] rounded-2xl border border-white/10 text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#8a4add]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <span className="text-3xl mb-3 block">🤝</span>
                                    <h3 className="text-lg font-bold text-white mb-2">Colabore</h3>
                                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                                        Projetos marcados com o selo "Time" estão buscando devs como você. É a chance perfeita para ganhar XP real.
                                    </p>
                                    <button 
                                        onClick={() => { /* Implement filter for collab later */ }}
                                        className="w-full py-2.5 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-xs"
                                    >
                                        Filtrar "Buscando Time"
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CommunityView;
