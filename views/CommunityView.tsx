
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import ProjectCard from '../components/ProjectCard';
import { Project, CommunityPost, User } from '../types';
import ForumPostCard from '../components/ForumPostCard';

type ActiveTab = 'projects' | 'forum';

const SidebarWidget: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
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
        <div className={`flex items-center justify-between py-3 px-3 rounded-lg mb-2 last:mb-0 transition-all hover:bg-white/5 ${rank <= 3 ? style.bg : ''}`}>
            <div className="flex items-center gap-3">
                <span className={`font-black text-lg w-6 text-center flex-shrink-0 ${style.color}`}>
                    {style.icon}
                </span>
                <img src={user.avatarUrl} alt={user.name} className={`w-10 h-10 rounded-full object-cover border-2 ${style.border}`} />
                <div>
                    <p className={`text-sm font-bold truncate max-w-[110px] ${rank <= 3 ? 'text-white' : 'text-gray-300'}`}>{user.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">{user.title || 'Dev'}</p>
                </div>
            </div>
            <div className="text-right">
                 <span className="block text-xs font-bold text-[#c4b5fd]">{user.xp} XP</span>
                 <span className="text-[10px] text-gray-600">Nível {Math.floor(user.xp / 100) + 1}</span>
            </div>
        </div>
    );
};

const EmptyState: React.FC<{ type: 'project' | 'forum', onClear: () => void }> = ({ type, onClear }) => (
    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed flex flex-col items-center justify-center animate-fade-in">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            {type === 'project' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            )}
        </div>
        <p className="text-gray-300 text-lg font-medium">Nenhum resultado encontrado.</p>
        <p className="text-gray-500 text-sm mt-2 max-w-md">Não encontramos nada com os filtros atuais. Tente buscar por outro termo ou limpe os filtros.</p>
        <button onClick={onClear} className="mt-6 px-6 py-2 bg-[#8a4add]/10 text-[#c4b5fd] border border-[#8a4add]/20 rounded-full hover:bg-[#8a4add]/20 transition-colors font-semibold text-sm">
            Limpar filtros
        </button>
    </div>
);

const CommunityView: React.FC = () => {
    const { projects, communityPosts, user, users } = useAppContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ActiveTab>('projects');
    const [activeFilter, setActiveFilter] = useState<string>('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    const allProjectTechs = useMemo(() => {
        const techSet = new Set<string>();
        projects.forEach(project => {
            project.technologies.forEach(tech => techSet.add(tech));
        });
        return ['Todos', ...Array.from(techSet).sort()];
    }, [projects]);

    const allForumTags = useMemo(() => {
        const tagSet = new Set<string>();
        communityPosts.forEach(post => {
            post.tags.forEach(tag => tagSet.add(tag));
        });
        return ['Todos', ...Array.from(tagSet).sort()];
    }, [communityPosts]);

    const filteredProjects = useMemo(() => {
        let result = projects;
        
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
    }, [projects, activeFilter, searchTerm]);

    const filteredPosts = useMemo(() => {
        let result = communityPosts;

        // Filter by Tag
        if (activeFilter !== 'Todos') {
            result = result.filter(post => post.tags.includes(activeFilter));
        }

        // Filter by Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(p => 
                p.title.toLowerCase().includes(lowerTerm) || 
                p.content.toLowerCase().includes(lowerTerm)
            );
        }

        // Prioritize pinned posts, then chronological
        return result.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    }, [communityPosts, activeFilter, searchTerm]);
    
    const topContributors = useMemo(() => {
        // Ordena usuários por XP
        return [...users]
            .sort((a, b) => (b.xp || 0) - (a.xp || 0))
            .slice(0, 5);
    }, [users]);

    const trendingTags = useMemo(() => {
        const tagCounts: Record<string, number> = {};
        communityPosts.forEach(post => {
            post.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        return Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8) // Mostra até 8 tags
            .map(([tag]) => tag);
    }, [communityPosts]);

    const handleProjectSelect = (project: Project) => {
        navigate(`/project/${project.id}`);
    };

    const handlePostSelect = (post: CommunityPost) => {
        navigate(`/community/post/${post.id}`);
    };
    
    const handleNavigateToProjectEditor = () => {
        navigate('/project/edit');
    };

    const handleNavigateToPostEditor = () => {
        navigate('/community/post/new');
    }
    
    const clearFilters = () => {
        setActiveFilter('Todos');
        setSearchTerm('');
    }

    const filters = activeTab === 'projects' ? allProjectTechs : allForumTags;

    const TabButton: React.FC<{ tab: ActiveTab; label: string; count?: number }> = ({ tab, label, count }) => (
        <button
            onClick={() => { setActiveTab(tab); clearFilters(); }}
            className={`relative px-6 py-4 text-sm md:text-base font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab 
                ? 'text-white border-b-2 border-[#8a4add] bg-white/5' 
                : 'text-gray-400 hover:text-white hover:bg-white/5 border-b-2 border-transparent'
            }`}
        >
            {label}
            {count !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab ? 'bg-[#8a4add] text-white' : 'bg-white/10 text-gray-500'}`}>
                    {count}
                </span>
            )}
        </button>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
                        Nossa <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">Comunidade</span>
                    </h1>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        O coração da FuturoOn. Colabore, tire dúvidas e mostre para o mundo o que você está construindo.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {user && (
                        <button
                            onClick={activeTab === 'projects' ? handleNavigateToProjectEditor : handleNavigateToPostEditor}
                            className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/30 whitespace-nowrap flex items-center justify-center gap-2 transform hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            {activeTab === 'projects' ? 'Novo Projeto' : 'Nova Discussão'}
                        </button>
                    )}
                </div>
            </div>
            
            <div className="grid lg:grid-cols-4 gap-8 relative">
                {/* Main Content Column */}
                <div className="lg:col-span-3">
                    {/* Tabs & Search Wrapper */}
                    <div className="sticky top-16 z-30 bg-[#09090B]/95 backdrop-blur-xl border-b border-white/10 -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-t-xl mb-8 pt-2">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex w-full sm:w-auto overflow-x-auto no-scrollbar">
                                <TabButton tab="projects" label="Showcase" count={projects.length} />
                                <TabButton tab="forum" label="Fórum" count={communityPosts.length} />
                            </div>
                            <div className="relative w-full sm:w-64 mb-2 sm:mb-0 sm:mr-2">
                                <input 
                                    type="text" 
                                    placeholder={activeTab === 'projects' ? "Buscar projetos..." : "Buscar discussões..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2 pl-9 bg-white/10 rounded-md border border-white/10 focus:ring-1 focus:ring-[#8a4add] focus:outline-none transition-colors text-sm text-white placeholder-gray-500"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section (Horizontal Scroll on Mobile) */}
                    <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 no-scrollbar">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`flex-shrink-0 px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 border ${
                                activeFilter === filter
                                    ? 'bg-[#8a4add] text-white border-[#8a4add] shadow-md shadow-[#8a4add]/20'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="min-h-[400px]">
                        {activeTab === 'projects' && (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map(project => (
                                        <ProjectCard key={project.id} project={project} onProjectSelect={handleProjectSelect} />
                                    ))
                                ) : (
                                    <div className="col-span-full">
                                        <EmptyState type="project" onClear={clearFilters} />
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'forum' && (
                             <div className="space-y-4 animate-fade-in">
                                {filteredPosts.length > 0 ? (
                                    filteredPosts.map(post => (
                                       <ForumPostCard key={post.id} post={post} onPostSelect={handlePostSelect} />
                                    ))
                                ) : (
                                    <EmptyState type="forum" onClear={clearFilters} />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Column */}
                <aside className="lg:col-span-1 space-y-8">
                    <div className="lg:sticky lg:top-24 space-y-8">
                        <SidebarWidget title="🏆 Top Contribuidores">
                            <div className="flex flex-col -mx-2">
                                {topContributors.map((contributor, index) => (
                                    <ContributorRow key={contributor.id} user={contributor} rank={index + 1} />
                                ))}
                            </div>
                        </SidebarWidget>

                        <SidebarWidget title="🔥 Tópicos em Alta">
                            <div className="flex flex-wrap gap-2">
                                {trendingTags.map(tag => (
                                    <button 
                                        key={tag}
                                        onClick={() => { setActiveTab('forum'); setActiveFilter(tag); }}
                                        className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/5 border border-white/10 rounded-md hover:bg-[#8a4add]/20 hover:border-[#8a4add]/50 hover:text-white transition-all duration-300"
                                    >
                                        # {tag}
                                    </button>
                                ))}
                            </div>
                        </SidebarWidget>

                        <div className="p-6 bg-gradient-to-br from-[#18181b] to-[#09090b] rounded-2xl border border-white/10 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#8a4add]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <span className="text-3xl mb-3 block">🤝</span>
                                <h3 className="text-lg font-bold text-white mb-2">Quer colaborar?</h3>
                                <p className="text-sm text-gray-400 mb-4">
                                    Muitos projetos estão buscando parceiros. Procure pelo badge "Buscando Time" no Showcase!
                                </p>
                                <button 
                                    onClick={() => { setActiveTab('projects'); clearFilters(); }}
                                    className="w-full py-2.5 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-sm"
                                >
                                    Explorar Projetos
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CommunityView;
