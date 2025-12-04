
import React, { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Article } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../App';
import RichContentEditor from '../components/RichContentEditor';
import EditorHeader from '../components/EditorHeader';
import BlogAIStudio from '../components/BlogAIStudio';

const stringToSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

const ArticleEditor: React.FC = () => {
  const { articles, handleSaveArticle, user } = useAppContext();
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();

  const initialArticle = useMemo(() => {
    if (articleId && articleId !== 'new') {
        return articles.find(a => a.id === articleId);
    }
    return {
        id: `article_${Date.now()}`,
        slug: '',
        title: '', subtitle: '', author: user?.name || '',
        date: new Date().toLocaleDateString('pt-BR'),
        summary: '', imageUrl: user?.avatarUrl || '', authorAvatarUrl: user?.avatarUrl || '',
        category: 'Dicas' as Article['category'], content: '', status: 'draft' as Article['status'], tags: []
    };
  }, [articleId, articles, user]);

  const [article, setArticle] = useState<Article>(initialArticle || {
    id: `article_${Date.now()}`, slug: '', title: '', subtitle: '', author: user?.name || '',
    date: new Date().toLocaleDateString('pt-BR'), summary: '', imageUrl: user?.avatarUrl || '',
    // FIX: Explicitly cast properties to match the 'Article' type to resolve type error.
    authorAvatarUrl: user?.avatarUrl || '', category: 'Dicas' as Article['category'], content: '', status: 'draft' as Article['status'], tags: []
  });

  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [showAIStudio, setShowAIStudio] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
  if (!initialArticle) {
      return <div className="text-center py-20">Artigo não encontrado.</div>;
  }

  const onCancel = () => navigate('/admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArticle(prev => {
        const updates: any = { [name]: value };
        // Auto-generate slug
        if (name === 'title' && (!prev.slug || articleId === 'new')) {
            updates.slug = stringToSlug(value);
        }
        return { ...prev, ...updates };
    });
  };
  
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setArticle(prev => ({ ...prev, tags }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveArticle(article);
    navigate('/admin');
  };

  const handleGenerateTitles = async () => {
      if (!article.content?.trim()) {
          alert("Escreva o conteúdo do artigo primeiro para a IA gerar títulos.");
          return;
      }
      setIsGeneratingTitles(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const prompt = `Você é um copywriter especialista para o blog da FuturoOn, focado em jovens da periferia que estão entrando no mercado de tecnologia.
          Baseado no conteúdo do artigo abaixo, gere um título principal e um subtítulo que sejam modernos, chamativos e otimizados para SEO.
          O tom deve ser inspirador e acessível.
          Retorne a resposta como um objeto JSON com as chaves "title" e "subtitle".
          
          Conteúdo do Artigo:
          ---
          ${article.content}
          ---`;

          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        subtitle: { type: Type.STRING }
                    },
                    required: ["title", "subtitle"]
                }
              }
          });

          const result = JSON.parse(response.text);
          setArticle(prev => ({ 
              ...prev, 
              title: result.title, 
              subtitle: result.subtitle,
              slug: prev.slug || stringToSlug(result.title)
          }));

      } catch (error) {
          console.error("Erro ao gerar títulos com IA:", error);
          alert("Não foi possível gerar os títulos. Tente novamente.");
      } finally {
          setIsGeneratingTitles(false);
      }
  };

  // Handler para aplicar conteúdo melhorado do AI Studio
  const handleApplyImprovedContent = (improvedContent: string) => {
    setArticle(prev => ({ ...prev, content: improvedContent }));
  };

  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors sm:text-sm text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  const AiButton: React.FC<{ onClick: () => void; isLoading: boolean; children: React.ReactNode, className?: string }> = ({ onClick, isLoading, children, className }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 font-semibold text-purple-300 hover:text-purple-200 text-xs py-1 px-3 rounded-full bg-purple-500/10 hover:bg-purple-500/20 transition-colors disabled:opacity-50 disabled:cursor-wait ${className}`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Gerando...
        </>
      ) : (
        <>
          ✨ {children}
        </>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#09090B]">
      <EditorHeader
        title={initialArticle.title ? 'Editor de Artigo' : 'Novo Artigo'}
        subtitle="Compartilhe conhecimento e inspire a comunidade."
        onBack={onCancel}
        actions={
          <button type="submit" form="article-form" className="bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40">
            Salvar Artigo
          </button>
        }
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="article-form" onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">

        <div className="p-8 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="title" className={labelClasses}>Título Principal</label>
                        <AiButton onClick={handleGenerateTitles} isLoading={isGeneratingTitles}>Sugerir Títulos</AiButton>
                    </div>
                    <input id="title" name="title" value={article.title} onChange={handleChange} placeholder="Como consegui meu primeiro emprego em tech..." required className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="slug" className={labelClasses}>Slug (URL Amigável)</label>
                    <input id="slug" name="slug" value={article.slug || ''} onChange={handleChange} placeholder="como-consegui-primeiro-emprego" className={inputClasses} />
                </div>
            </div>
            <div>
                <label htmlFor="subtitle" className={labelClasses}>Subtítulo</label>
                <input id="subtitle" name="subtitle" value={article.subtitle} onChange={handleChange} placeholder="Uma jornada de persistência, comunidade e muito código." required className={inputClasses} />
            </div>
            <div>
                <label htmlFor="summary" className={labelClasses}>Resumo (para os cards)</label>
                <textarea id="summary" name="summary" value={article.summary} onChange={handleChange} required className={inputClasses} rows={3} placeholder="Um resumo curto e chamativo que aparecerá na página principal do blog."/>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="author" className={labelClasses}>Autor</label>
                    <input id="author" name="author" value={article.author} onChange={handleChange} required className={inputClasses} />
                </div>
                 <div>
                    <label htmlFor="category" className={labelClasses}>Categoria</label>
                    <select id="category" name="category" value={article.category} onChange={handleChange} className={inputClasses}>
                        <option>Dicas</option>
                        <option>Histórias</option>
                        <option>Tutoriais</option>
                        <option>Carreira Tech</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className={labelClasses}>Data de Publicação</label>
                    <input id="date" name="date" value={article.date} onChange={handleChange} required className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="status" className={labelClasses}>Status</label>
                    <select id="status" name="status" value={article.status || 'draft'} onChange={handleChange} className={inputClasses}>
                        <option value="draft">Rascunho</option>
                        <option value="published">Publicado</option>
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="tags" className={labelClasses}>Tags</label>
                <input id="tags" name="tags" value={article.tags?.join(', ') || ''} onChange={handleTagsChange} placeholder="react, carreira, css, javascript" className={inputClasses} />
                <p className="text-xs text-gray-500 mt-1">Separe as tags por vírgula.</p>
            </div>
             <div>
                <label htmlFor="imageUrl" className={labelClasses}>URL da Imagem de Capa</label>
                <input id="imageUrl" name="imageUrl" value={article.imageUrl} onChange={handleChange} placeholder="https://..." required className={inputClasses}/>
             </div>
             <div>
                <div className="flex justify-between items-center mb-2">
                    <label className={labelClasses}>Conteúdo do Artigo (Markdown)</label>
                    <AiButton onClick={() => setShowAIStudio(true)} isLoading={false}>AI Studio</AiButton>
                </div>
                <RichContentEditor
                    value={article.content}
                    onChange={(value) => setArticle(prev => ({ ...prev, content: value }))}
                    textareaRef={contentRef}
                    rows={20}
                    placeholder="Escreva seu conteúdo aqui. Use a barra de ferramentas ou a sintaxe Markdown para formatar."
                />
                <p className="text-xs text-gray-500 mt-2">Dica: Use a sintaxe Markdown para formatar seu texto, criar listas, blocos de código e muito mais.</p>
             </div>
        </div>
      </form>
      </div>

      {/* AI Studio Modal */}
      {showAIStudio && (
        <BlogAIStudio
          content={article.content}
          onApply={handleApplyImprovedContent}
          onClose={() => setShowAIStudio(false)}
        />
      )}
    </div>
  );
};

export default ArticleEditor;
