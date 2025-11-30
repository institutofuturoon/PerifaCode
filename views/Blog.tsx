
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { useAppContext } from '../App';
import { Article } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import SEO from '../components/SEO';
import Badge from '../components/Badge';

// Sidebar Widget Melhorado
const SidebarWidget: React.FC<{ title: string, children: React.ReactNode, icon?: string }> = ({ title, children, icon }) => (
    <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/10 to-[#f27983]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        <div className="relative bg-gradient-to-br from-[#18181B] to-[#09090B] backdrop-blur-xl p-6 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
                {icon && <span className="text-xl">{icon}</span>}
                <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            {children}
        </div>
    </div>
);

const AISuggestions: React.FC<{ navigateToArticle: (article: Article) => void }> = ({ navigateToArticle }) => {
    const { articles } = useAppContext();
    const [suggestions, setSuggestions] = useState<{ title: string; reason: string; }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (articles.length === 0) {
                setIsLoading(false);
                return;
            };

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const articlesForPrompt = articles
                    .filter(a => a.status === 'published')
                    .map(a => `- Título: "${a.title}", Categoria: ${a.category}, Resumo: "${a.summary}"`)
                    .join('\n');

                const prompt = `Você é um curador de conteúdo para a FuturoOn. Baseado na lista de artigos abaixo, sugira 3 leituras interessantes para um jovem da periferia iniciando em tecnologia. Para cada sugestão, forneça uma justificativa de uma frase. Retorne APENAS no formato JSON especificado.

Artigos Disponíveis:
${articlesForPrompt}
`;

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    reason: { type: Type.STRING }
                                },
                                required: ["title", "reason"]
                            }
                        }
                    }
                });
                
                const result = JSON.parse(response.text);
                setSuggestions(result);

            } catch (error) {
                console.error("Erro ao buscar sugestões da IA:", error);
                // Fallback suggestions on API error (e.g., rate limiting)
                setSuggestions([
                    {
                        title: 'Cartilha Git: Guia Prático para Iniciantes',
                        reason: 'Comece com o pé direito! Aprenda a ferramenta essencial que todo desenvolvedor usa para controlar versões do código.'
                    },
                    {
                        title: 'Node.js Descomplicado: Seu Guia para o Backend e Futuro Tech!',
                        reason: 'Leve seu JavaScript para o backend e descubra como construir o "cérebro" de aplicações web modernas.'
                    },
                    {
                        title: 'Código C# à Prova de Futuro: Como Construir Software que Dura',
                        reason: 'Aprenda princípios de arquitetura para escrever código limpo, manutenível e preparado para o futuro.'
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [articles]);

    const findArticleByTitle = (title: string) => {
        return articles.find(a => a.title === title);
    }

    if (isLoading) {
        return (
            <div className="space-y-3 animate-pulse">
                <div className="h-10 bg-white/10 rounded-md"></div>
                <div className="h-10 bg-white/10 rounded-md"></div>
                <div className="h-10 bg-white/10 rounded-md"></div>
            </div>
        );
    }
    
    if (suggestions.length === 0) return null;

    return (
        <div className="space-y-3">
            {suggestions.map((s, i) => {
                const article = findArticleByTitle(s.title);
                return article ? (
                    <button key={i} onClick={() => navigateToArticle(article)} className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <p className="font-semibold text-white text-sm">{s.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{s.reason}</p>
                    </button>
                ) : null;
            })}
        </div>
    );
};

interface BlogProps {
    embedded?: boolean;
}

const Blog: React.FC<BlogProps> = ({ embedded = false }) => {
  const { articles, loadData } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
      loadData(['articles', 'users']);
  }, [loadData]);

  const handleArticleSelect = (article: Article) => {
    navigate(`/article/${article.slug || article.id}`);
  };

  const publishedArticles = useMemo(() => 
    articles
      .filter(article => article.status === 'published')
      .sort((a, b) => {
        try {
            const [dayA, monthA, yearA] = a.date.split('/').map(Number);
            const [dayB, monthB, yearB] = b.date.split('/').map(Number);
            return new Date(yearB, monthB - 1, dayB).getTime() - new Date(yearA, monthA - 1, dayA).getTime();
        } catch { return 0; }
      })
  , [articles]);
  
  const categories = useMemo(() => 
    ['Todos', ...Array.from(new Set(publishedArticles.map(a => a.category)))]
  , [publishedArticles]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    publishedArticles.forEach(a => a.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [publishedArticles]);
  
  const popularArticles = useMemo(() => 
      [...publishedArticles].sort((a, b) => (b.claps || 0) - (a.claps || 0)).slice(0, 3)
  , [publishedArticles]);

  const filteredArticles = useMemo(() => {
    return publishedArticles
        .filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(a => activeCategory === 'Todos' || a.category === activeCategory)
        .filter(a => !activeTag || a.tags?.includes(activeTag));
  }, [publishedArticles, searchTerm, activeCategory, activeTag]);

  const { featuredArticle, otherArticles } = useMemo(() => {
    if (filteredArticles.length === 0) {
      return { featuredArticle: null, otherArticles: [] };
    }
    const [first, ...rest] = filteredArticles;
    return { featuredArticle: first, otherArticles: rest };
  }, [filteredArticles]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setActiveTag(null);
  };
  
  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    setActiveCategory('Todos');
  };

  const containerClass = embedded ? 'w-full' : 'container mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-16 relative z-20';

  return (
    <>
        {!embedded && (
            <>
                <SEO 
                    title="Blog & Notícias | Instituto FuturoOn"
                    description="Artigos, tutoriais e histórias de sucesso para inspirar e guiar sua jornada no universo da tecnologia."
                />
                {/* Hero Section - MELHORADO! */}
                <section className="relative py-20 md:py-32 text-center overflow-hidden">
                    {/* Aurora effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#8a4add]/10 rounded-[100%] blur-[120px] -z-10"></div>
                    <div className="absolute inset-0 bg-grid-pattern opacity-30 -z-10"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <Badge text="Blog & Notícias" />
                        
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6 max-w-5xl mx-auto">
                            Nosso <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] via-[#c4b5fd] to-[#f27983]">Blog</span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
                            Artigos, tutoriais e histórias de sucesso para inspirar e guiar sua jornada no universo da tecnologia.
                        </p>
                        
                        {/* Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-8">
                            <div className="text-center">
                                <p className="text-3xl font-black text-white mb-1">{publishedArticles.length}</p>
                                <p className="text-sm text-gray-400">Artigos</p>
                            </div>
                            <div className="w-px h-12 bg-white/10"></div>
                            <div className="text-center">
                                <p className="text-3xl font-black text-white mb-1">{categories.length - 1}</p>
                                <p className="text-sm text-gray-400">Categorias</p>
                            </div>
                            <div className="w-px h-12 bg-white/10"></div>
                            <div className="text-center">
                                <p className="text-3xl font-black text-white mb-1">{allTags.length}</p>
                                <p className="text-sm text-gray-400">Tags</p>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )}

        {/* Main Content & Sidebar */}
        <section className={containerClass}>
            <div className="grid lg:grid-cols-4 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-3">
                   {filteredArticles.length > 0 ? (
                       <div className="space-y-12">
                           {/* Featured Article */}
                           {featuredArticle && (
                               <div>
                                   <div className="flex items-center gap-3 mb-6">
                                       <div className="w-1 h-8 bg-gradient-to-b from-[#8a4add] to-[#f27983] rounded-full"></div>
                                       <h2 className="text-3xl font-black text-white">Em Destaque</h2>
                                       <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
                                   </div>
                                   <ArticleCard 
                                       article={featuredArticle} 
                                       onArticleSelect={handleArticleSelect} 
                                       layout="horizontal" 
                                   />
                               </div>
                           )}

                           {/* Other Articles */}
                           {otherArticles.length > 0 && (
                               <div>
                                   <div className="flex items-center gap-3 mb-6">
                                       <div className="w-1 h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full"></div>
                                       <h2 className="text-3xl font-black text-white">Mais Recentes</h2>
                                       <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
                                   </div>
                                   <div className="grid md:grid-cols-2 gap-8">
                                       {otherArticles.map(article => (
                                           <ArticleCard 
                                               key={article.id} 
                                               article={article} 
                                               onArticleSelect={handleArticleSelect}
                                           />
                                       ))}
                                   </div>
                               </div>
                           )}
                       </div>
                    ) : (
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/10 to-[#f27983]/10 rounded-2xl blur-xl"></div>
                            <div className="relative text-center py-20 bg-gradient-to-br from-[#18181B] to-[#09090B] rounded-2xl border border-white/10">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                                    </svg>
                                </div>
                                <p className="text-gray-300 text-lg font-semibold mb-2">Nenhum artigo encontrado</p>
                                <p className="text-sm text-gray-500 mb-6">Tente ajustar seus filtros ou limpar a busca.</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setActiveCategory('Todos');
                                        setActiveTag(null);
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#8a4add]/30 transition-all duration-300"
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - MELHORADO! */}
                <aside className={`lg:col-span-1 space-y-8 ${!embedded ? 'lg:sticky top-24' : ''} h-fit`}>
                    {/* Search Widget */}
                    <SidebarWidget title="Pesquisar" icon="🔍">
                        <div className="relative">
                            <input 
                                type="search" 
                                placeholder="Buscar por título..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 bg-[#18181B] rounded-xl border border-white/10 focus:border-[#8a4add] focus:outline-none transition-colors text-sm text-white placeholder-gray-500"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </SidebarWidget>

                    {/* AI Suggestions */}
                    <SidebarWidget title="Sugestões da IA" icon="✨">
                        <AISuggestions navigateToArticle={handleArticleSelect} />
                    </SidebarWidget>

                    {/* Popular Articles */}
                    <SidebarWidget title="Mais Populares" icon="🔥">
                        <div className="space-y-3">
                            {popularArticles.map((article, index) => (
                                <button key={article.id} onClick={() => handleArticleSelect(article)} className="w-full text-left group">
                                    <div className="relative flex items-start gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/10 hover:-translate-y-1">
                                        {/* Ranking badge */}
                                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-[#8a4add] to-[#f27983] rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg">
                                            {index + 1}
                                        </div>
                                        <img 
                                            src={article.imageUrl} 
                                            alt={article.title} 
                                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-white line-clamp-2 group-hover:text-[#c4b5fd] transition-colors mb-1">
                                                {article.title}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>{article.date}</span>
                                                {article.claps && article.claps > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            👏 {article.claps}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </SidebarWidget>

                    {/* Categories */}
                    <SidebarWidget title="Categorias" icon="📂">
                        <div className="flex flex-wrap gap-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 border ${
                                    activeCategory === category && !activeTag
                                        ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white border-transparent shadow-lg shadow-[#8a4add]/30 scale-105'
                                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </SidebarWidget>

                    {/* Tags */}
                    {allTags.length > 0 && (
                        <SidebarWidget title="Tags" icon="🏷️">
                            <div className="flex flex-wrap gap-2">
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagClick(tag)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
                                        activeTag === tag
                                            ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white shadow-md shadow-[#8a4add]/20'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                       #{tag}
                                    </button>
                                ))}
                            </div>
                        </SidebarWidget>
                    )}
                </aside>
            </div>
        </section>
    </>
  );
};

export default Blog;
