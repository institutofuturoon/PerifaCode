import React from 'react';
import ArticleCard from '../components/ArticleCard';
import { useAppContext } from '../App';

const Blog: React.FC = () => {
  const { articles, navigateToArticle } = useAppContext();

  return (
    <div className="aurora-background text-white">
        {/* Hero Section */}
        <header className="py-32 md:py-40 text-center relative z-10 bg-grid-pattern">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                    Nosso <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">Blog</span>
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                    Artigos, tutoriais e histórias de sucesso para inspirar e guiar sua jornada no universo da tecnologia.
                </p>
            </div>
        </header>

        {/* Articles Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map(article => (
                    <ArticleCard key={article.id} article={article} onArticleSelect={navigateToArticle} />
                ))}
            </div>
        </section>
    </div>
  );
};

export default Blog;