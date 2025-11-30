
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import ProjectCard from '../components/ProjectCard';
import { Project, User } from '../types';
import SEO from '../components/SEO';
import Badge from '../components/Badge';

// Sidebar Widget Melhorado
const SidebarWidget: React.FC<{ title: string, children: React.ReactNode, icon?: string }> = ({ title, children, icon }) => (
    <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/10 to-[#f27983]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        <div className="relative bg-gradient-to-br from-[#18181B] to-[#09090B] backdrop-blur-xl p-6 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
                {icon && <span className="text-2xl">{icon}</span>}
                <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            {children}
        </div>
    </div>
);

// Componente de Contribuidor Melhorado
const ContributorRow: React.FC<{ user: User, rank: number }> = ({ user, rank }) => {
    const getRankStyle = (r: number) => {
        switch(r) {
            case 1: return { 
                color: 'text-yellow-400', 
                icon: '👑', 
                border: 'border-yellow-500/50', 
                bg: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10',
                glow: 'shadow-yellow-500/20'
            };
            case 2: return { 
                color: 'text-gray-300', 
                icon: '🥈', 
                border: 'border-gray-400/50', 
                bg: 'bg-gradient-to-r from-gray-400/20 to-gray-500/10',
                glow: 'shadow-gray-400/20'
            };
            case 3: return { 
                color: 'text-amber-600', 
                icon: '🥉', 
                border: 'border-amber-600/50', 
                bg: 'bg-gradient-to-r from-amber-600/20 to-orange-500/10',
                glow: 'shadow-amber-600/20'
            };
            default: return { 
                color: 'text-gray-500', 
                icon: `#${r}`, 
                border: 'border-white/10', 
                bg: 'transparent',
                glow: ''
            };
        }
    };

    const style = getRankStyle(rank);

    return (
        <div className={`relative group flex items-center justify-between py-3 px-3 rounded-xl mb-2 last:mb-0 transition-all hover:-translate-y-1 hover:shadow-lg ${style.glow} ${rank <= 3 ? style.bg : 'hover:bg-white/5'} border border-white/5 hover:border-white/10`}>
            {/* Glow effect para top 3 */}
            {rank <= 3 && (
                <div className="absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                     style={{ background: rank === 1 ? 'rgba(234, 179, 8, 0.1)' : rank === 2 ? 'rgba(156, 163, 175, 0.1)' : 'rgba(217, 119, 6, 0.1)' }}>
                </div>
            )}
            
            <div className="flex items-center gap-3 relative z-10">
                <span className={`font-black text-lg w-6 text-center flex-shrink-0 ${style.color} group-hover:scale-110 transition-transform`}>
                    {style.icon}
                </span>
                <div className="relative">
                    <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className={`w-10 h-10 rounded-full object-cover border-2 ${style.border} group-hover:scale-110 transition-transform`} 
                    />
                    {rank <= 3 && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#8a4add] to-[#f27983] rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                        </div>
                    )}
                </div>
                <div>
                    <p className={`text-sm font-bold truncate max-w-[120px] ${rank <= 3 ? 'text-white' : 'text-gray-300'} group-hover:text-white transition-colors`}>
                        {user.name}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                        {user.title || 'Dev'}
                    </p>
                </div>
            </div>
            <div className="text-right relative z-10">
                <span className="block text-xs font-black text-[#c4b5fd] group-hover:text-[#8a4add] transition-colors">
                    {user.xp} XP
                </span>
                <span className="block text-[9px] text-gray-500">
                    pontos
                </span>
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
        navigate('/projeto/edit');
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
            
            {/* Hero Section - MELHORADO! */}
            <section className="relative py-20 md:py-32 text-center overflow-hidden">
                {/* Aurora effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#8a4add]/10 rounded-[100%] blur-[120px] -z-10"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-30 -z-10"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Badge text="Portfólio da Comunidade" />
                    
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6 max-w-5xl mx-auto">
                        Vitrine de <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] via-[#c4b5fd] to-[#f27983]">Talentos</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
                        Explore o que os alunos da FuturoOn estão construindo. Projetos reais, código aberto e inovação vinda da periferia.
                    </p>
                    
                    {/* Stats */}
                    <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
                        <div className="text-center">
                            <p className="text-3xl font-black text-white mb-1">{filteredProjects.length}</p>
                            <p className="text-sm text-gray-400">Projetos</p>
                        </div>
                        <div className="w-px h-12 bg-white/10"></div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-white mb-1">{allProjectTechs.length - 1}</p>
                            <p className="text-sm text-gray-400">Tecnologias</p>
                        </div>
                        <div className="w-px h-12 bg-white/10"></div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-white mb-1">{users.length}</p>
                            <p className="text-sm text-gray-400">Desenvolvedores</p>
                        </div>
                    </div>
                    
                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {user ? (
                            <button
                                onClick={handleNavigateToProjectEditor}
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#8a4add]/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Submeter Projeto
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/entrar')}
                                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#8a4add]/30 hover:-translate-y-1 transition-all duration-300"
                                >
                                    Entrar para Participar
                                </button>
                                <button
                                    onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
                                >
                                    Explorar Projetos
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid lg:grid-cols-4 gap-8 relative">
                    {/* Main Content Column */}
                    <div className="lg:col-span-3">
                        {/* Filter Bar - MELHORADO! */}
                        <div id="projects" className="sticky top-16 z-30 bg-[#09090B]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 shadow-lg">
                            <div className="flex flex-col gap-4">
                                {/* Search */}
                                <div className="relative w-full">
                                    <input 
                                        type="text" 
                                        placeholder="🔍 Buscar projetos por nome ou descrição..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full p-4 pl-12 bg-[#18181B] rounded-xl border border-white/10 focus:border-[#8a4add] focus:outline-none transition-colors text-sm text-white placeholder-gray-500"
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                
                                {/* Tech Filters */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Filtrar por Tecnologia
                                        </p>
                                        {activeFilter !== 'Todos' && (
                                            <button
                                                onClick={() => setActiveFilter('Todos')}
                                                className="text-xs text-[#8a4add] hover:text-[#c4b5fd] transition-colors font-semibold"
                                            >
                                                Limpar filtro
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                        {allProjectTechs.map(tech => (
                                            <button
                                                key={tech}
                                                onClick={() => setActiveFilter(tech)}
                                                className={`flex-shrink-0 px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 border ${
                                                activeFilter === tech
                                                    ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white border-transparent shadow-lg shadow-[#8a4add]/30 scale-105'
                                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                                                }`}
                                            >
                                                {tech}
                                            </button>
                                        ))}
                                    </div>
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

                    {/* Sidebar Column - MELHORADO! */}
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            {/* Top Contribuidores */}
                            <SidebarWidget title="Top Contribuidores" icon="🏆">
                                <div className="flex flex-col">
                                    {topContributors.length > 0 ? (
                                        topContributors.map((contributor, index) => (
                                            <ContributorRow key={contributor.id} user={contributor} rank={index + 1} />
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 text-sm">
                                            <p>Nenhum contribuidor ainda.</p>
                                            <p className="text-xs mt-1">Seja o primeiro!</p>
                                        </div>
                                    )}
                                </div>
                            </SidebarWidget>

                            {/* Card de Colaboração */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/20 to-[#f27983]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <div className="relative p-6 bg-gradient-to-br from-[#18181b] to-[#09090b] rounded-2xl border border-white/10 group-hover:border-[#8a4add]/40 text-center overflow-hidden transition-all duration-300">
                                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#8a4add] to-[#f27983] flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                            🤝
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">Colabore</h3>
                                        <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                                            Projetos marcados com o selo "Time" estão buscando devs como você. É a chance perfeita para ganhar XP real.
                                        </p>
                                        <button 
                                            onClick={() => { /* Implement filter for collab later */ }}
                                            className="w-full py-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#8a4add]/30 transition-all duration-300 text-sm"
                                        >
                                            Filtrar "Buscando Time"
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Card de Estatísticas */}
                            <SidebarWidget title="Estatísticas" icon="📊">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <span className="text-sm text-gray-400">Total de Projetos</span>
                                        <span className="text-lg font-black text-[#8a4add]">{projects.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <span className="text-sm text-gray-400">Tecnologias</span>
                                        <span className="text-lg font-black text-[#f27983]">{allProjectTechs.length - 1}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <span className="text-sm text-gray-400">Desenvolvedores</span>
                                        <span className="text-lg font-black text-[#c4b5fd]">{users.length}</span>
                                    </div>
                                </div>
                            </SidebarWidget>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CommunityView;
