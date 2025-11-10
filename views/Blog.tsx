import React, { useMemo, useState } from 'react';
import ArticleCard from '../components/ArticleCard';
import { useAppContext } from '../App';
import { Article } from '../types';

const FeaturedArticleCard: React.FC<{ article: Article, onArticleSelect: (article: Article) => void }> = ({ article, onArticleSelect }) => (
    <div 
        className="group relative col-span-1 md:col-span-2 lg:col-span-2 rounded-lg overflow-hidden cursor-pointer h-full min-h-[380px] flex items-end p-8"
        onClick={() => onArticleSelect(article)}
    >
        <div className="absolute inset-0">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        </div>
        <div className="relative z-10">
            <span className="text-sm font-bold uppercase tracking-wider text-purple-400">{article.category}</span>
            <h2 className="text-3xl font-black text-white mt-2 transition-colors group-hover:text-purple-300">{article.title}</h2>
            <p className="mt-2 text-gray-300 max-w-2xl line-clamp-2">{article.summary}</p>
        </div>
    </div>
);


const Blog: React.FC = () => {
  const { articles, navigateToArticle } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const publishedArticles = useMemo(() => 
    articles
      .filter(article => article.status === 'published')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  , [articles]);
  
  const featuredArticle = publishedArticles[0];
  const otherArticles = publishedArticles.slice(1);
  
  const categories = useMemo(() => 
    ['Todos', ...Array.from(new Set(articles.map(a => a.category)))]
  , [articles]);
  
  const filteredArticles = useMemo(() => {
    return (activeCategory === 'Todos' ? otherArticles : otherArticles.filter(a => a.category === activeCategory))
        .filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [otherArticles, activeCategory, searchTerm]);


  return (
    <div className="aurora-background text-white">
        {/* Hero Section */}
        <header className="py-20 md:py-24 text-center relative z-10 bg-grid-pattern">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                    Nosso <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#c4b5fd]">Blog</span>
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                    Artigos, tutoriais e histórias de sucesso para inspirar e guiar sua jornada no universo da tecnologia.
                </p>
            </div>
        </header>

        {/* Filters and Search */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-12">
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full md:w-auto">
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
                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map(category => (
                         <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${
                            activeCategory === category
                                ? 'bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white shadow-lg shadow-[#8a4add]/30'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </section>

        {/* Articles Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredArticle && (
                    <FeaturedArticleCard article={featuredArticle} onArticleSelect={navigateToArticle} />
                )}
                {filteredArticles.map(article => (
                    <ArticleCard key={article.id} article={article} onArticleSelect={navigateToArticle} />
                ))}
            </div>
        </section>
    </div>
  );
};

export default Blog;