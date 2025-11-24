
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { useAppContext } from '../App';
import { Article } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import SEO from '../components/SEO';
import Badge from '../components/Badge';

const SidebarWidget: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        {children}
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
  const { articles } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleArticleSelect = (article: Article) => {
    navigate(`/article/${article.id}`);
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
                    title="Blog"
                    description="Artigos, tutoriais e histórias de sucesso para inspirar e guiar sua jornada no universo da tecnologia."
                />
                <header className="py-20 md:py-32 text-center relative z-10 bg-grid-pattern">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <Badge text="Blog & Notícias" />
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                            Nosso <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#c4b5fd]">Blog</span>
                        </h1>
                        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                            Artigos, tutoriais e histórias de sucesso para inspirar e guiar sua jornada no universo da tecnologia.
                        </p>
                    </div>
                </header>
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
                                   <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-[#8a4add] pl-4">Destaque</h2>
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
                                   <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-gray-500 pl-4">Mais Recentes</h2>
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
                        <div className="text-center py-20 bg-black/20 rounded-lg border border-white/10">
                            <p className="text-gray-400 text-lg">Nenhum artigo encontrado.</p>
                            <p className="text-sm text-gray-500 mt-2">Tente ajustar seus filtros ou limpar a busca.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <aside className={`lg:col-span-1 space-y-8 ${!embedded ? 'lg:sticky top-24' : ''} h-fit`}>
                    <SidebarWidget title="Pesquisar">
                        <div className="relative">
                            <input 
                                type="search" 
                                placeholder="Buscar por título..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm"
                            />
                             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        </div>
                    </SidebarWidget>

                     <SidebarWidget title="✨ Sugestões da IA">
                        <AISuggestions navigateToArticle={handleArticleSelect} />
                    </SidebarWidget>

                    <SidebarWidget title="Mais Populares">
                        <div className="space-y-3">
                            {popularArticles.map(article => (
                                <button key={article.id} onClick={() => handleArticleSelect(article)} className="w-full text-left group">
                                    <div className="flex items-start gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                        <img src={article.imageUrl} alt={article.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0"/>
                                        <div>
                                            <p className="font-semibold text-sm text-white line-clamp-2 group-hover:text-[#c4b5fd]">{article.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">{article.date}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </SidebarWidget>

                    <SidebarWidget title="Categorias">
                        <div className="flex flex-wrap gap-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
                                    activeCategory === category && !activeTag
                                        ? 'bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </SidebarWidget>

                     <SidebarWidget title="Navegar por Tags">
                        <div className="flex flex-wrap gap-2">
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagClick(tag)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
                                    activeTag === tag
                                        ? 'bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                                >
                                   # {tag}
                                </button>
                            ))}
                        </div>
                    </SidebarWidget>
                </aside>
            </div>
        </section>
    </>
  );
};

export default Blog;
