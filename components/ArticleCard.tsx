import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onArticleSelect: (article: Article) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onArticleSelect }) => {
  return (
    <button 
      onClick={() => onArticleSelect(article)}
      className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 group flex flex-col text-left hover:border-[#8a4add]/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#8a4add]/20"
    >
      <div className="overflow-hidden">
        <img className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-500" src={article.imageUrl} alt={article.title} />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white group-hover:text-[#c4b5fd] transition-colors">{article.title}</h3>
        <p className="mt-3 text-sm text-gray-400 flex-grow">{article.summary}</p>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={article.authorAvatarUrl} alt={article.author} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{article.author}</p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time dateTime={article.date}>{article.date}</time>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ArticleCard;