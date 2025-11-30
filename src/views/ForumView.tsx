
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import ForumPostCard from '../components/ForumPostCard';
import { CommunityPost } from '../types';
import SEO from '../components/SEO';
import Badge from '../components/Badge';

// Sidebar Widget Melhorado
const SidebarWidget: React.FC<{ title: string, children: React.ReactNode, icon?: string }> = ({ title, children, icon }) => (
    <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/10 to-[#f27983]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        <div className="relative bg-gradient-to-br from-[#18181B] to-[#09090B] backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                {icon && <span className="text-lg sm:text-xl">{icon}</span>}
                <h3 className="text-sm sm:text-lg font-bold text-white">{title}</h3>
            </div>
            {children}
        </div>
    </div>
);

// Empty State Melhorado
const EmptyState: React.FC<{ onClear: () => void }> = ({ onClear }) => (
    <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/10 to-[#f27983]/10 rounded-2xl blur-xl"></div>
        <div className="relative text-center py-12 sm:py-20 bg-gradient-to-br from-[#18181B] to-[#09090B] rounded-2xl border border-white/10 flex flex-col items-center justify-center animate-fade-in px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </div>
            <p className="text-gray-300 text-base sm:text-lg font-bold mb-2">Nenhuma discussão encontrada</p>
            <p className="text-gray-500 text-xs sm:text-sm mb-6 max-w-md">Tente buscar por outro termo ou limpe os filtros para ver todas as discussões.</p>
            <button 
                onClick={onClear} 
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#8a4add]/30 transition-all duration-300 text-sm sm:text-base"
            >
                Limpar Filtros
            </button>
        </div>
    </div>
);

interface ForumViewProps {
    embedded?: boolean;
}

const ForumView: React.FC<ForumViewProps> = ({ embedded = false }) => {
    const { communityPosts, user } = useAppContext();
    const navigate = useNavigate();
    const [activeTag, setActiveTag] = useState<string>('Todos');
    const [activeStatus, setActiveStatus] = useState<'all' | 'solved' | 'unsolved' | 'mine'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        communityPosts.forEach(post => {
            post.tags.forEach(tag => tagSet.add(tag));
        });
        return ['Todos', ...Array.from(tagSet).sort()];
    }, [communityPosts]);

    const filteredPosts = useMemo(() => {
        let result = communityPosts;

        // Filter by Tag
        if (activeTag !== 'Todos') {
            result = result.filter(post => post.tags.includes(activeTag));
        }

        // Filter by Status/Type
        if (activeStatus === 'solved') {
            result = result.filter(post => post.isSolved);
        } else if (activeStatus === 'unsolved') {
            result = result.filter(post => post.type === 'question' && !post.isSolved);
        } else if (activeStatus === 'mine') {
            if (user) {
                result = result.filter(post => post.authorId === user.id);
            } else {
                result = [];
            }
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

    }, [communityPosts, activeTag, activeStatus, searchTerm, user]);

    const trendingTags = useMemo(() => {
        const tagCounts: Record<string, number> = {};
        communityPosts.forEach(post => {
            post.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        return Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8) // Top 8 tags
            .map(([tag]) => tag);
    }, [communityPosts]);

    const handlePostSelect = (post: CommunityPost) => {
        navigate(`/community/post/${post.id}`);
    };
    
    const handleNavigateToPostEditor = () => {
        if (user) {
            navigate('/community/post/new');
        } else {
            navigate('/entrar');
        }
    }
    
    const clearFilters = () => {
        setActiveTag('Todos');
        setActiveStatus('all');
        setSearchTerm('');
    }

    const containerClass = embedded ? 'w-full max-w-full' : 'container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-full';
    const wrapperClass = embedded ? 'bg-transparent overflow-hidden' : 'bg-[#09090B] min-h-screen overflow-hidden';

    return (
        <div className={wrapperClass}>
             <SEO 
                title="Fórum de Dúvidas | Instituto FuturoOn"
                description="Espaço para aprender, ensinar e debater tecnologia. Tire suas dúvidas e ajude outros desenvolvedores."
             />
             
             {/* Hero Section - MELHORADO! */}
             {!embedded && (
                 <section className="relative py-12 sm:py-16 md:py-24 text-center overflow-hidden">
                     {/* Aurora effects */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8a4add]/10 rounded-[100%] blur-[120px] -z-10"></div>
                     <div className="absolute inset-0 bg-grid-pattern opacity-30 -z-10"></div>

                     <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                         <Badge text="Comunidade" />
                         
                         <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4 sm:mb-6 max-w-4xl mx-auto">
                             Fórum de <br className="sm:hidden" />
                             <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] via-[#c4b5fd] to-[#f27983]">Dúvidas</span>
                         </h1>
                         
                         <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-10 px-4">
                             Espaço para aprender, ensinar e debater tecnologia. Tire suas dúvidas e ajude outros desenvolvedores.
                         </p>
                         
                         {/* Stats */}
                         <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-8 sm:mb-10">
                             <div className="text-center">
                                 <p className="text-2xl sm:text-3xl font-black text-white mb-1">{communityPosts.length}</p>
                                 <p className="text-xs sm:text-sm text-gray-400">Discussões</p>
                             </div>
                             <div className="w-px h-10 sm:h-12 bg-white/10"></div>
                             <div className="text-center">
                                 <p className="text-2xl sm:text-3xl font-black text-white mb-1">{communityPosts.filter(p => p.isSolved).length}</p>
                                 <p className="text-xs sm:text-sm text-gray-400">Resolvidas</p>
                             </div>
                             <div className="w-px h-10 sm:h-12 bg-white/10"></div>
                             <div className="text-center">
                                 <p className="text-2xl sm:text-3xl font-black text-white mb-1">{allTags.length - 1}</p>
                                 <p className="text-xs sm:text-sm text-gray-400">Tópicos</p>
                             </div>
                         </div>
                         
                         {/* CTA */}
                         <button
                             onClick={handleNavigateToPostEditor}
                             className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#8a4add]/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base mx-auto"
                         >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                             </svg>
                             Nova Discussão
                         </button>
                     </div>
                 </section>
             )}

             <div className={containerClass}>
                <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 max-w-full overflow-hidden">
                    {/* Main Content */}
                    <div className="lg:col-span-3 min-w-0">
                        {/* Controls - MELHORADO! */}
                        <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
                            {/* Search */}
                            <div className="relative w-full">
                                <input 
                                    type="text" 
                                    placeholder="🔍 Pesquisar dúvidas, erros ou tópicos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full p-3 sm:p-4 pl-10 sm:pl-12 rounded-xl border border-white/10 focus:border-[#8a4add] focus:outline-none transition-colors text-white placeholder-gray-500 text-sm sm:text-base ${embedded ? 'bg-white/5' : 'bg-[#18181B]'}`}
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                )}
                            </div>
                            
                            {/* Status Filters */}
                            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                                <div className="w-full sm:w-auto overflow-x-auto">
                                    <div className={`inline-flex rounded-xl p-1.5 border border-white/10 ${embedded ? 'bg-white/5' : 'bg-[#18181B]'} w-full sm:w-auto`}>
                                        <button 
                                            onClick={() => setActiveStatus('all')}
                                            className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 whitespace-nowrap ${activeStatus === 'all' ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white shadow-lg shadow-[#8a4add]/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            Todos
                                        </button>
                                        <button 
                                            onClick={() => setActiveStatus('unsolved')}
                                            className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 whitespace-nowrap ${activeStatus === 'unsolved' ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white shadow-lg shadow-[#8a4add]/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            Em Aberto
                                        </button>
                                        <button 
                                            onClick={() => setActiveStatus('solved')}
                                            className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 whitespace-nowrap ${activeStatus === 'solved' ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white shadow-lg shadow-[#8a4add]/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            Resolvidos
                                        </button>
                                        {user && (
                                            <button 
                                                onClick={() => setActiveStatus('mine')}
                                                className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 whitespace-nowrap ${activeStatus === 'mine' ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white shadow-lg shadow-[#8a4add]/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                            >
                                                Meus
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {embedded && (
                                     <button
                                        onClick={handleNavigateToPostEditor}
                                        className="w-full sm:w-auto bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-2.5 px-5 sm:px-6 rounded-xl hover:shadow-lg hover:shadow-[#8a4add]/30 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Nova Discussão
                                    </button>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="w-full overflow-hidden">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filtrar por Tópico</p>
                                    {activeTag !== 'Todos' && (
                                        <button
                                            onClick={() => setActiveTag('Todos')}
                                            className="text-xs text-[#8a4add] hover:text-[#c4b5fd] transition-colors font-semibold flex-shrink-0"
                                        >
                                            Limpar
                                        </button>
                                    )}
                                </div>
                                <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                    <div className="flex gap-2 min-w-max">
                                        {allTags.slice(0, 10).map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => setActiveTag(tag)}
                                                className={`flex-shrink-0 px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 border ${
                                                activeTag === tag
                                                    ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white border-transparent shadow-lg shadow-[#8a4add]/30'
                                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                                                }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Posts List */}
                        <div className="space-y-2 sm:space-y-3 min-h-[300px]">
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map(post => (
                                   <ForumPostCard key={post.id} post={post} onPostSelect={handlePostSelect} />
                                ))
                            ) : (
                                <EmptyState onClear={clearFilters} />
                            )}
                        </div>
                    </div>

                    {/* Sidebar - MELHORADO! */}
                    <aside className="lg:col-span-1 space-y-4 sm:space-y-6 mt-6 lg:mt-0 min-w-0">
                         <div className={`lg:sticky space-y-4 sm:space-y-6 ${embedded ? 'lg:top-0' : 'lg:top-24'} w-full`}>
                            {/* Trending Tags */}
                            <SidebarWidget title="Tópicos em Alta" icon="🔥">
                                <div className="flex flex-wrap gap-2">
                                    {trendingTags.map(tag => (
                                        <button 
                                            key={tag}
                                            onClick={() => { setActiveTag(tag); }}
                                            className="px-3 py-1.5 text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-gradient-to-r hover:from-[#8a4add]/20 hover:to-[#f27983]/20 hover:border-[#8a4add]/50 hover:text-white transition-all duration-300"
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </SidebarWidget>
                            
                            {/* Stats Widget */}
                            <SidebarWidget title="Estatísticas" icon="📊">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <span className="text-sm text-gray-400">Total de Posts</span>
                                        <span className="text-lg font-black text-[#8a4add]">{communityPosts.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <span className="text-sm text-gray-400">Resolvidos</span>
                                        <span className="text-lg font-black text-[#10b981]">{communityPosts.filter(p => p.isSolved).length}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <span className="text-sm text-gray-400">Em Aberto</span>
                                        <span className="text-lg font-black text-[#f27983]">{communityPosts.filter(p => !p.isSolved && p.type === 'question').length}</span>
                                    </div>
                                </div>
                            </SidebarWidget>
                            
                            {/* Rules Widget */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/20 to-[#f27983]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <div className="relative bg-gradient-to-b from-[#8a4add]/10 to-transparent p-4 sm:p-6 rounded-2xl border border-[#8a4add]/20 text-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#8a4add] to-[#f27983] flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                        📜
                                    </div>
                                    <h3 className="text-white font-bold mb-2 text-sm sm:text-base">Regras da Casa</h3>
                                    <p className="text-xs text-gray-400 mb-3 sm:mb-4">Para manter nossa comunidade saudável:</p>
                                    <ul className="text-left text-xs text-gray-300 space-y-2 mb-4 sm:mb-6">
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#8a4add] mt-0.5">✓</span>
                                            <span>Seja respeitoso e gentil</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#8a4add] mt-0.5">✓</span>
                                            <span>Pesquise antes de perguntar</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#8a4add] mt-0.5">✓</span>
                                            <span>Marque como resolvido se ajudou</span>
                                        </li>
                                    </ul>
                                    <button 
                                        onClick={() => navigate('/termos')} 
                                        className="w-full py-2.5 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#8a4add]/30 transition-all duration-300 text-xs sm:text-sm"
                                    >
                                        Ler Código de Conduta
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

export default ForumView;
