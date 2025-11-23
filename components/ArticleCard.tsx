import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onArticleSelect: (article: Article) => void;
  layout?: 'vertical' | 'horizontal';
}

const getCategoryColor = (category: Article['category']) => {
  switch(category) {
    case 'Tutoriais': return 'text-purple-400 bg-purple-500/20';
    case 'Carreira Tech': return 'text-sky-400 bg-sky-500/20';
    case 'Histórias': return 'text-amber-400 bg-amber-500/20';
    case 'Dicas': return 'text-green-400 bg-green-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onArticleSelect, layout = 'vertical' }) => {
  if (layout === 'horizontal') {
    return (
      <button 
        onClick={() => onArticleSelect(article)}
        className="group bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/6 rounded-xl overflow-hidden border border-white/10 hover:border-[#8a4add]/50 flex flex-col md:flex-row text-left transition-all duration-300 w-full"
      >
        <div className="w-full md:w-2/5 flex-shrink-0 overflow-hidden aspect-video md:aspect-auto">
          <img 
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
            src={article.imageUrl} 
            alt={article.title} 
          />
        </div>
        <div className="p-5 flex flex-col flex-grow justify-between">
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${getCategoryColor(article.category)}`}>
              {article.category}
            </p>
            <h3 className="text-base font-bold text-white group-hover:text-[#c4b5fd] transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-gray-400 mt-2 line-clamp-2">{article.summary}</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mt-3 pt-3 border-t border-white/10">
            <img className="h-7 w-7 rounded-full" src={article.authorAvatarUrl} alt={article.author} />
            <div>
              <p className="font-medium text-white text-xs">{article.author}</p>
              <p className="text-gray-500 text-xs">{article.date} {article.readingTime && `• ${article.readingTime} min`}</p>
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button 
      onClick={() => onArticleSelect(article)}
      className="group bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/6 rounded-xl overflow-hidden border border-white/10 hover:border-[#8a4add]/50 flex flex-col text-left transition-all duration-300 h-full"
    >
      <div className="overflow-hidden aspect-video">
        <img 
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
          src={article.imageUrl} 
          alt={article.title} 
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className={`text-xs font-bold uppercase tracking-wider mb-2 px-2 py-1 rounded-lg w-fit ${getCategoryColor(article.category)}`}>
          {article.category}
        </p>
        <h3 className="text-sm font-bold text-white group-hover:text-[#c4b5fd] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="mt-2 text-xs text-gray-400 flex-grow line-clamp-2">
          {article.summary}
        </p>

        <div className="mt-auto pt-3 border-t border-white/10 flex items-center gap-2">
          <img 
            className="h-6 w-6 rounded-full border border-white/10" 
            src={article.authorAvatarUrl} 
            alt={article.author} 
          />
          <div className="flex-1">
            <p className="text-xs font-medium text-white">{article.author}</p>
            <p className="text-xs text-gray-500">{article.date} {article.readingTime && `• ${article.readingTime} min`}</p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ArticleCard;
