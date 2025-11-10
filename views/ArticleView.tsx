import React, { useMemo } from 'react';
import { useAppContext } from '../App';
import ArticleCard from '../components/ArticleCard';
import { Article } from '../types';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const ArticleView: React.FC = () => {
  const { currentArticle, articles, navigate, user, handleEditArticle, handleDeleteArticle, handleAddArticleClap, navigateToArticle } = useAppContext();

  if (!currentArticle) {
    return <div className="text-center py-20">Artigo não encontrado.</div>;
  }
  const article = currentArticle;

  const handleDelete = async () => {
    const wasDeleted = await handleDeleteArticle(article.id);
    if (wasDeleted) {
      navigate('blog');
    }
  };

  const getCategoryColor = (category: Article['category']) => {
    switch(category) {
        case 'Tutoriais': return 'text-purple-400';
        case 'Carreira Tech': return 'text-sky-400';
        case 'Histórias': return 'text-amber-400';
        case 'Dicas': return 'text-green-400';
        default: return 'text-gray-400';
    }
  }
  
  const relatedArticles = articles
    .filter(a => a.status === 'published' && a.category === article.category && a.id !== article.id)
    .slice(0, 3);


  const renderedHtml = useMemo(() => {
    if (!article.content) return { __html: '' };
    
    // Configura o `marked` para usar quebras de linha e GFM (GitHub Flavored Markdown)
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
    
    // Converte Markdown para HTML bruto
    const rawHtml = marked.parse(article.content) as string;
    
    // Sanitiza o HTML para prevenir ataques XSS
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    
    return { __html: sanitizedHtml };
  }, [article.content]);

  return (
    <div>
      <section className="relative py-12 md:py-20 bg-black/20">
        <div className="absolute inset-0">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className={`font-semibold ${getCategoryColor(article.category)}`}>{article.category}</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-2">{article.title}</h1>
            <p className="mt-4 text-lg text-gray-300">{article.subtitle}</p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <img src={article.authorAvatarUrl} alt={article.author} className="h-12 w-12 rounded-full border-2 border-purple-500/50" />
              <div>
                <p className="font-semibold text-white">{article.author}</p>
                <p className="text-sm text-gray-400">{article.date}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">
        <div className="max-w-3xl mx-auto bg-[#121212] p-8 sm:p-12 rounded-lg border border-white/10 shadow-2xl">
          {user && (user.role === 'admin' || (user.role === 'instructor' && user.name === article.author)) && (
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/10">
                <p className="text-sm font-semibold text-yellow-400 flex-grow">Opções de Administrador:</p>
                <button onClick={() => handleEditArticle(article)} className="font-semibold py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm">
                  Editar
                </button>
                <button onClick={handleDelete} className="font-semibold py-2 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm">
                  Excluir
                </button>
            </div>
          )}
          <div
            className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={renderedHtml}
          >
          </div>
          <div className="mt-12 border-t border-white/10 pt-8 flex items-center justify-between">
            <button onClick={() => navigate('blog')} className="text-purple-400 font-semibold hover:text-purple-300 transition-colors group">
              <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para o blog
            </button>
            <button onClick={() => handleAddArticleClap(article.id)} className="group flex items-center gap-2 font-semibold py-2 px-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                <span className="text-xl transform transition-transform group-hover:scale-110">👏</span>
                <span>{article.claps || 0}</span>
            </button>
          </div>
        </div>
        
        {relatedArticles.length > 0 && (
            <div className="max-w-5xl mx-auto mt-20">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Leia a seguir</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {relatedArticles.map(related => (
                        <ArticleCard key={related.id} article={related} onArticleSelect={navigateToArticle} />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ArticleView;