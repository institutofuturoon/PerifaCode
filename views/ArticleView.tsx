
import React, { useMemo, useState } from 'react';
import { useAppContext } from '../contexts/AppContextAdapter';
import { Article } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import ArticleCard from '../components/ArticleCard';
import SEO from '../components/SEO';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">{children}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mt-4"></div>
    </div>
);

const ArticleView: React.FC = () => {
  const { articles, user, users, handleDeleteArticle, handleAddArticleClap, showToast } = useAppContext();
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [isClapping, setIsClapping] = useState(false);
  const [shareButtonText, setShareButtonText] = useState('Compartilhar');


  const article = useMemo(() => articles.find(a => a.id === articleId), [articles, articleId]);
  
  const author = useMemo(() => {
    if (!article) return null;
    return users.find(u => u.name === article.author);
  }, [users, article]);


  if (!article) {
    return <div className="text-center py-20">Artigo não encontrado.</div>;
  }
  
  const relatedArticles = useMemo(() => {
    if (!article) return [];

    const allOtherPublished = articles.filter(a => a.status === 'published' && a.id !== article.id);

    const sortedByDate = [...allOtherPublished].sort((a, b) => {
        try {
            const [dayA, monthA, yearA] = a.date.split('/').map(Number);
            const [dayB, monthB, yearB] = b.date.split('/').map(Number);
            return new Date(yearB, monthB - 1, dayB).getTime() - new Date(yearA, monthA - 1, dayA).getTime();
        } catch { return 0; }
    });

    let related = sortedByDate.filter(a => a.category === article.category);

    if (related.length < 2) {
        const otherCategoryArticles = sortedByDate.filter(a => a.category !== article.category);
        const relatedIds = new Set(related.map(a => a.id));
        for (const otherArticle of otherCategoryArticles) {
            if (related.length >= 2) break;
            if (!relatedIds.has(otherArticle.id)) {
                related.push(otherArticle);
            }
        }
    }

    return related.slice(0, 2);
  }, [articles, article]);

  const handleDelete = async () => {
    const wasDeleted = await handleDeleteArticle(article.id);
    if (wasDeleted) {
      navigate('/blog');
    }
  };

  const handleEditArticle = () => {
      navigate(`/admin/article-editor/${article.id}`);
  };

  const handleClap = () => {
    if (isClapping) return;
    setIsClapping(true);
    handleAddArticleClap(article.id);
    setTimeout(() => setIsClapping(false), 1000); // Prevent spamming
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Confira este artigo incrível da FuturoOn: "${article.title}"`;
    const shareTitle = `Artigo FuturoOn: ${article.title}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      } catch (error) {
        console.log('Web Share API foi fechada ou encontrou um erro:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        showToast('✅ Link copiado para a área de transferência!');
        setShareButtonText('Link Copiado!');
        setTimeout(() => setShareButtonText('Compartilhar'), 2000);
      } catch (err) {
        console.error('Falha ao copiar link:', err);
        showToast('❌ Não foi possível copiar o link.');
      }
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

  return (
    <>
      <SEO 
        title={article.title}
        description={article.summary || article.subtitle}
        image={article.imageUrl}
        keywords={article.tags}
      />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-black/20">
        <div className="absolute inset-0">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className={`font-semibold ${getCategoryColor(article.category)}`}>{article.category}</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mt-2">{article.title}</h1>
            <p className="mt-4 text-lg text-gray-300">{article.subtitle}</p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <img src={article.authorAvatarUrl} alt={article.author} className="h-12 w-12 rounded-full border-2 border-[#8a4add]/50" />
              <div>
                <p className="font-semibold text-white">{article.author}</p>
                <p className="text-sm text-gray-400">
                    {article.date}
                    {article.readingTime && article.readingTime > 0 && ` • ${article.readingTime} min de leitura`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Article Content */}
          <div className="bg-[#121212] p-8 sm:p-16 rounded-lg border border-white/10 shadow-2xl -mt-16 relative z-20">
            {user && (user.role === 'admin' || (user.role === 'instructor' && user.name === article.author)) && (
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/10">
                  <p className="text-sm font-semibold text-yellow-400 flex-grow">Opções de Administrador:</p>
                  <button onClick={handleEditArticle} className="font-semibold py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm">
                    Editar
                  </button>
                  <button onClick={handleDelete} className="font-semibold py-2 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm">
                    Excluir
                  </button>
              </div>
            )}
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
              <MarkdownRenderer content={article.content} />
            </div>
          </div>
          
          {/* Engagement Bar */}
          <div className="mt-8 border-t border-white/10 pt-6 flex items-center justify-between">
            <button onClick={() => navigate('/blog')} className="text-[#c4b5fd] font-semibold hover:text-white transition-colors group">
              <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para o blog
            </button>
            <div className="flex items-center gap-4">
              <button onClick={handleClap} className={`group flex items-center gap-2 font-semibold py-2 px-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors ${isClapping ? 'animate-pulse' : ''}`}>
                  <span className={`text-xl transform transition-transform ${isClapping ? 'scale-125' : 'group-hover:scale-110'}`}>👏</span>
                  <span>{article.claps || 0}</span>
              </button>
               <button onClick={handleShare} className="group flex items-center gap-2 font-semibold py-2 px-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                  <span>{shareButtonText}</span>
              </button>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-16">
              <SectionTitle>Leia a Seguir</SectionTitle>
              <div className="grid md:grid-cols-2 gap-8">
                {relatedArticles.map(related => (
                  <ArticleCard key={related.id} article={related} onArticleSelect={(a) => navigate(`/article/${a.id}`)} layout="horizontal" />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
};

export default ArticleView;
