
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import ForumPostCard from '../components/ForumPostCard';
import { CommunityPost } from '../types';

const SidebarWidget: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-black/20 backdrop-blur-xl p-4 sm:p-5 rounded-xl border border-white/10">
        <h3 className="text-sm sm:text-md font-bold text-white mb-2 sm:mb-3">{title}</h3>
        {children}
    </div>
);

const EmptyState: React.FC<{ onClear: () => void }> = ({ onClear }) => (
    <div className="text-center py-12 sm:py-16 bg-white/5 rounded-xl border border-white/10 border-dashed flex flex-col items-center justify-center animate-fade-in px-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </div>
        <p className="text-gray-300 text-sm sm:text-base font-medium">Nenhuma discussão encontrada.</p>
        <p className="text-gray-500 text-xs mt-1 max-w-md px-4">Tente buscar por outro termo ou limpe os filtros.</p>
        <button onClick={onClear} className="mt-3 sm:mt-4 px-4 sm:px-5 py-1.5 sm:py-2 bg-[#8a4add]/10 text-[#c4b5fd] border border-[#8a4add]/20 rounded-full hover:bg-[#8a4add]/20 transition-colors font-semibold text-xs">
            Limpar filtros
        </button>
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
            navigate('/login');
        }
    }
    
    const clearFilters = () => {
        setActiveTag('Todos');
        setActiveStatus('all');
        setSearchTerm('');
    }

    const containerClass = embedded ? 'w-full' : 'container mx-auto px-4 sm:px-6 lg:px-8 py-10';
    const wrapperClass = embedded ? 'bg-transparent' : 'bg-[#09090B] min-h-screen';

    return (
        <div className={wrapperClass}>
             {/* Header Area - Conditional Rendering */}
             {!embedded && (
                 <div className="bg-black/20 border-b border-white/5 py-6 sm:py-8 md:py-12">
                     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
                             <div className="text-center md:text-left w-full md:w-auto">
                                 <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">Fórum de <span className="text-[#c4b5fd]">Dúvidas</span></h1>
                                 <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Espaço para aprender, ensinar e debater tecnologia.</p>
                             </div>
                             
                            <button
                                onClick={handleNavigateToPostEditor}
                                className="w-full md:w-auto bg-[#8a4add] text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg hover:bg-[#7c3aed] transition-all shadow-lg shadow-[#8a4add]/30 flex items-center justify-center gap-2 transform hover:scale-105 text-sm sm:text-base"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Nova Discussão
                            </button>
                         </div>
                     </div>
                 </div>
             )}

             <div className={containerClass}>
                <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Controls */}
                        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="relative w-full">
                                <input 
                                    type="text" 
                                    placeholder="Pesquisar dúvidas, erros ou tópicos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full p-3 sm:p-4 pl-10 sm:pl-12 rounded-xl border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors text-white placeholder-gray-500 text-sm sm:text-base ${embedded ? 'bg-white/5' : 'bg-[#121212]'}`}
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                                <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
                                    <div className={`flex rounded-lg p-1 border border-white/10 overflow-hidden w-full sm:w-auto ${embedded ? 'bg-white/5' : 'bg-[#121212]'}`}>
                                        <button 
                                            onClick={() => setActiveStatus('all')}
                                            className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${activeStatus === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Todos
                                        </button>
                                        <button 
                                            onClick={() => setActiveStatus('unsolved')}
                                            className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${activeStatus === 'unsolved' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Em Aberto
                                        </button>
                                        <button 
                                            onClick={() => setActiveStatus('solved')}
                                            className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${activeStatus === 'solved' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Resolvidos
                                        </button>
                                        {user && (
                                            <button 
                                                onClick={() => setActiveStatus('mine')}
                                                className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${activeStatus === 'mine' ? 'bg-[#8a4add]/20 text-[#c4b5fd]' : 'text-gray-400 hover:text-white'}`}
                                            >
                                                Meus Posts
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {embedded && (
                                     <button
                                        onClick={handleNavigateToPostEditor}
                                        className="w-full sm:w-auto bg-[#8a4add] text-white font-bold py-2 px-4 sm:px-6 rounded-lg hover:bg-[#7c3aed] transition-all shadow-lg shadow-[#8a4add]/30 flex items-center justify-center gap-2 text-xs whitespace-nowrap"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        Nova Discussão
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 -mx-4 px-4 sm:mx-0 sm:px-0">
                                <div className="flex gap-2 overflow-x-auto pb-2 flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                    {allTags.slice(0, 8).map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setActiveTag(tag)}
                                            className={`flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                                            activeTag === tag
                                                ? 'bg-white/10 text-white border border-white/20'
                                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
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

                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-4 sm:space-y-6">
                         <div className={`lg:sticky space-y-4 sm:space-y-6 ${embedded ? 'lg:top-0' : 'lg:top-24'}`}>
                            <SidebarWidget title="🔥 Tópicos em Alta">
                                <div className="flex flex-wrap gap-2">
                                    {trendingTags.map(tag => (
                                        <button 
                                            key={tag}
                                            onClick={() => { setActiveTag(tag); }}
                                            className="px-2.5 py-1 text-[10px] font-medium text-gray-300 bg-white/5 border border-white/10 rounded-md hover:bg-[#8a4add]/20 hover:border-[#8a4add]/50 hover:text-white transition-all duration-300"
                                        >
                                            # {tag}
                                        </button>
                                    ))}
                                </div>
                            </SidebarWidget>
                            
                            <div className="bg-gradient-to-b from-[#8a4add]/10 to-transparent p-4 sm:p-6 rounded-xl border border-[#8a4add]/20 text-center">
                                <h3 className="text-white font-bold mb-2 text-sm sm:text-base">Regras da Casa</h3>
                                <p className="text-xs text-gray-400 mb-3 sm:mb-4">Para manter nossa comunidade saudável:</p>
                                <ul className="text-left text-xs text-gray-300 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 list-disc list-inside">
                                    <li>Seja respeitoso e gentil.</li>
                                    <li>Pesquise antes de perguntar.</li>
                                    <li>Marque como resolvido se ajudou.</li>
                                </ul>
                                <button onClick={() => navigate('/terms')} className="text-[#c4b5fd] text-xs hover:underline">Ler Código de Conduta</button>
                            </div>
                         </div>
                    </aside>
                </div>
             </div>
        </div>
    );
};

export default ForumView;
