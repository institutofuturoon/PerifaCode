
import React from 'react';
import { useAppContext } from '../App';

const ArticleView: React.FC = () => {
  const { currentArticle, navigate } = useAppContext();

  if (!currentArticle) {
    return <div className="text-center py-20">Artigo não encontrado.</div>;
  }
  const article = currentArticle;

  const renderContent = (markdown: string) => {
    let html = markdown;
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-white mt-8 mb-4">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-white mt-10 mb-6 border-b border-white/10 pb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-white mt-12 mb-8">$1</h1>');
    // Bold
    html = html.replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>');
    // Code blocks
    html = html.replace(/```(css|javascript|js|python|html)?\n([\s\S]*?)\n```/g, (_match, lang, code) => {
        return `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    });
    // Inline code
    html = html.replace(/`([^`].*?)`/g, '<code>$1</code>');
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:underline">$1</a>');
    // Paragraphs
    html = html.split('\n').filter(p => p.trim() !== '').map(p => `<p class="my-4">${p}</p>`).join('');

    return { __html: html };
  };

  return (
    <div className="aurora-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-8">
                <button onClick={() => navigate('blog')} className="text-purple-400 font-semibold hover:text-purple-300 transition-colors group">
                    <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para o Blog
                </button>
            </div>

            <article className="max-w-4xl mx-auto">
                <header className="text-center">
                    <p className="font-semibold text-purple-400">{article.category.toUpperCase()}</p>
                    <h1 className="mt-2 text-4xl md:text-5xl font-black tracking-tight text-white">{article.title}</h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-400">{article.subtitle}</p>
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <img className="h-12 w-12 rounded-full" src={article.authorAvatarUrl} alt={article.author} />
                        <div>
                            <p className="font-semibold text-white">{article.author}</p>
                            <p className="text-sm text-gray-500">{article.date}</p>
                        </div>
                    </div>
                </header>

                <figure className="my-12">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-auto rounded-lg shadow-2xl shadow-purple-900/40" />
                </figure>

                <div 
                    className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed"
                    dangerouslySetInnerHTML={renderContent(article.content)}
                />
            </article>
        </div>
    </div>
  );
};

export default ArticleView;
