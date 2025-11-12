import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onArticleSelect: (article: Article) => void;
}

const getCategoryColor = (category: Article['category']) => {
    switch(category) {
        case 'Tutoriais': return 'text-purple-400';
        case 'Carreira Tech': return 'text-sky-400';
        case 'Histórias': return 'text-amber-400';
        case 'Dicas': return 'text-green-400';
        default: return 'text-gray-400';
    }
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onArticleSelect }) => {
  return (
    <button 
      onClick={() => onArticleSelect(article)}
      className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 group flex flex-col text-left hover:border-[#8a4add]/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#8a4add]/20"
    >
      <div className="overflow-hidden aspect-video">
        <img className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" src={article.imageUrl} alt={article.title} />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${getCategoryColor(article.category)}`}>
          {article.category}
        </p>
        <h3 className="text-xl font-bold text-white group-hover:text-[#c4b5fd] transition-colors line-clamp-2">{article.title}</h3>
        <p className="mt-3 text-sm text-gray-400 flex-grow line-clamp-3">{article.summary}</p>
        
        {article.tags && article.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-700/60 text-gray-300">
                       # {tag}
                    </span>
                ))}
            </div>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-white/10 pt-4 mt-4">
            {article.readingTime && (
                <div className="flex items-center gap-1.5" title={`${article.readingTime} min de leitura`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{article.readingTime} min de leitura</span>
                </div>
            )}
            <div className="flex items-center gap-1.5" title={`${article.claps || 0} aplausos`}>
                <span>👏</span>
                <span>{article.claps || 0}</span>
            </div>
        </div>
        
        <div className="mt-4 flex items-center">
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