import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onArticleSelect: (article: Article) => void;
  layout?: 'vertical' | 'horizontal';
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

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onArticleSelect, layout = 'vertical' }) => {

    if (layout === 'horizontal') {
        return (
            <button 
              onClick={() => onArticleSelect(article)}
              className="bg-[#1f2328] rounded-lg overflow-hidden border border-gray-700/80 group flex flex-col md:flex-row text-left hover:border-[#8a4add]/50 transition-all duration-300 w-full"
            >
              <div className="w-full md:w-2/5 flex-shrink-0 overflow-hidden aspect-video md:aspect-auto">
                <img className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" src={article.imageUrl} alt={article.title} />
              </div>
              <div className="p-6 flex flex-col flex-grow justify-center">
                <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${getCategoryColor(article.category)}`}>
                  {article.category}
                </p>
                <h3 className="text-xl font-bold text-white group-hover:text-[#c4b5fd] transition-colors line-clamp-3 flex-grow">{article.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-400 mt-4">
                    <img className="h-8 w-8 rounded-full" src={article.authorAvatarUrl} alt={article.author} />
                    <div>
                        <p className="font-semibold text-white text-sm">{article.author}</p>
                        <p className="text-gray-500 text-xs">{article.date}</p>
                    </div>
                </div>
              </div>
            </button>
        );
    }
    
  return (
    <button 
      onClick={() => onArticleSelect(article)}
      className="bg-[#1f2328] rounded-lg overflow-hidden border border-gray-700/80 group flex flex-col text-left hover:border-[#8a4add]/50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-[#8a4add]/10 h-full"
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
        
        <div className="mt-auto pt-4 border-t border-white/10 flex items-center">
          <div className="flex-shrink-0">
            <img className="h-8 w-8 rounded-full" src={article.authorAvatarUrl} alt={article.author} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{article.author}</p>
            <p className="text-xs text-gray-500">{article.date}</p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ArticleCard;