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
    html = html.replace(/```(css|javascript|js|python|html|bash)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
        const language = lang || 'plaintext';
        const escapedCode = code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<div class="bg-black/50 rounded-lg my-6"><div class="bg-gray-800 text-xs text-gray-400 px-4 py-2 rounded-t-lg"><span>${language}</span></div><pre class="p-4 overflow-x-auto whitespace-pre-wrap font-mono text-sm"><code>${escapedCode}</code></pre></div>`;
    });
    // Inline code
    html = html.replace(/`([^`].*?)`/g, '<code class="bg-blue-500/10 text-blue-300 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    // Lists
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>');
    
    // Paragraphs
    html = html.split('\n\n').map(p => {
        if(p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<div')) return p;
        return p ? `<p>${p.replace(/\n/g, '<br/>')}</p>` : '';
    }).join('');

    return { __html: html };
  };

  return (
    <div>
      <section className="relative py-12 md:py-20 bg-black/20">
        <div className="absolute inset-0">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-semibold text-blue-400">{article.category}</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-2">{article.title}</h1>
            <p className="mt-4 text-lg text-gray-300">{article.subtitle}</p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <img src={article.authorAvatarUrl} alt={article.author} className="h-12 w-12 rounded-full border-2 border-blue-500/50" />
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
          <div
            className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={renderContent(article.content)}
          >
          </div>
          <div className="mt-12 border-t border-white/10 pt-8">
            <button onClick={() => navigate('blog')} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors group">
              <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para o blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// FIX: Added default export to resolve import error in App.tsx. Also completed the truncated file content.
export default ArticleView;