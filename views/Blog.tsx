
import React from 'react';
import ArticleCard from '../components/ArticleCard';
import { useAppContext } from '../App';

const Blog: React.FC = () => {
  const { articles, navigateToArticle } = useAppContext();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Nosso Blog</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
          Artigos, tutoriais e histórias de sucesso para inspirar e guiar sua jornada no universo da tecnologia.
        </p>
      </div>
      <div className="mt-16 grid lg:grid-cols-3 gap-8">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} onArticleSelect={navigateToArticle} />
        ))}
      </div>
    </div>
  );
};

export default Blog;