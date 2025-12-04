
import React, { useMemo, useState } from 'react';
import { useAppContext } from '../App';
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


  const article = useMemo(() => {
    console.log('🔍 Procurando artigo:', articleId);
    console.log('📚 Total de artigos:', articles.length);
    console.log('📋 Artigos disponíveis:', articles.map(a => ({ id: a.id, slug: a.slug, title: a.title })));
    
    const found = articles.find(a => a.slug === articleId || a.id === articleId);
    console.log('✅ Artigo encontrado:', found ? found.title : 'Nenhum');
    
    return found;
  }, [articles, articleId]);
  
  const author = useMemo(() => {
    if (!article) return null;
    return users.find(u => u.name === article.author);
  }, [users, article]);


  if (!article) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <span className="text-6xl">📝</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-4">Artigo não encontrado</h1>
          <p className="text-gray-400 mb-8">
            O artigo que você está procurando não existe ou foi removido.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#8a4add]/30 transition-all"
          >
            Voltar para o Blog
          </button>
          {/* Debug info */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg text-left text-xs text-gray-500">
            <p>Debug Info:</p>
            <p>Article ID: {articleId}</p>
            <p>Total Articles: {articles.length}</p>
            <p>Published: {articles.filter(a => a.status === 'published').length}</p>
          </div>
        </div>
      </div>
    );
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
      navigate(`/admin/editor-artigo/${article.id}`);
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
            {/* Category */}
            <span className={`font-semibold ${getCategoryColor(article.category)}`}>{article.category}</span>
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mt-2">{article.title}</h1>
            
            {/* Subtitle */}
            {article.subtitle && (
              <p className="mt-4 text-lg text-gray-300">{article.subtitle}</p>
            )}
            
            {/* Meta Info */}
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
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div>
              {/* Admin Options */}
              {user && (user.role === 'admin' || (user.role === 'instructor' && user.name === article.author)) && (
                <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Opções de Administrador
                    </p>
                    <div className="flex gap-2">
                      <button onClick={handleEditArticle} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors">
                        ✏️ Editar
                      </button>
                      <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-sm transition-colors">
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Article Content */}
              <article className="prose prose-invert prose-lg max-w-none">
                <MarkdownRenderer content={article.content} />
              </article>

              {/* Actions Bar */}
              <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                <button 
                  onClick={() => navigate('/blog')} 
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#8a4add]/40 text-white font-semibold transition-all"
                >
                  <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar para o Blog
                </button>

                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#8a4add]/40 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span className="font-semibold text-white">{shareButtonText}</span>
                </button>
              </div>
            </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-black text-white mb-6">Continue Lendo</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedArticles.map(related => (
                  <ArticleCard 
                    key={related.id} 
                    article={related} 
                    onArticleSelect={(a) => navigate(`/artigo/${a.slug || a.id}`)} 
                    layout="horizontal" 
                  />
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="mt-16">
            <div className="text-center p-8 rounded-xl bg-white/5 border border-white/10">
              <p className="text-gray-400 mb-4">
                Gostou do conteúdo? Explore nossos cursos gratuitos
              </p>
              <button 
                onClick={() => navigate('/cursos')}
                className="px-6 py-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-semibold rounded-lg hover:opacity-90 transition-all"
              >
                Ver Cursos
              </button>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default ArticleView;
