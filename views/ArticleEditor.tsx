import React, { useState, useRef } from 'react';
import { Article } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../App';
import RichContentEditor from '../components/RichContentEditor';

interface ArticleEditorProps {
  article: Article;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ article: initialArticle }) => {
  const { handleSaveArticle, navigate } = useAppContext();
  const [article, setArticle] = useState<Article>(initialArticle);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [isImprovingText, setIsImprovingText] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const onCancel = () => navigate('admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveArticle(article);
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
          setArticle(prev => ({ ...prev, title: result.title, subtitle: result.subtitle }));

      } catch (error) {
          console.error("Erro ao gerar títulos com IA:", error);
          alert("Não foi possível gerar os títulos. Tente novamente.");
      } finally {
          setIsGeneratingTitles(false);
      }
  };

  const handleImproveText = async () => {
      if (!article.content?.trim()) {
          alert("Não há conteúdo para ser melhorado.");
          return;
      }
      setIsImprovingText(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const prompt = `Você é um editor especialista para o blog da FuturoOn. Sua tarefa é revisar o conteúdo do artigo abaixo.
          Corrija erros de ortografia e gramática. Melhore o estilo, a fluidez e a clareza para tornar o texto mais profissional e engajante.
          Mantenha a voz original do autor e o tom inspirador da plataforma. O público são jovens da periferia.
          Retorne APENAS o conteúdo do artigo melhorado, mantendo a formatação Markdown original.

          Conteúdo Original:
          ---
          ${article.content}
          ---`;
          
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });

          setArticle(prev => ({ ...prev, content: response.text }));

      } catch (error) {
          console.error("Erro ao melhorar texto com IA:", error);
          alert("Não foi possível melhorar o texto. Tente novamente.");
      } finally {
          setIsImprovingText(false);
      }
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-white">{initialArticle.title ? 'Editor de Artigo' : 'Novo Artigo'}</h1>
            <p className="text-gray-400 mt-1">Compartilhe conhecimento e inspire a comunidade.</p>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onCancel} className="bg-white/10 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-white/20 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
              Salvar Artigo
            </button>
          </div>
        </div>

        <div className="p-8 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 space-y-6">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="title" className={labelClasses}>Título Principal</label>
                    <AiButton onClick={handleGenerateTitles} isLoading={isGeneratingTitles}>Sugerir Títulos</AiButton>
                </div>
                <input id="title" name="title" value={article.title} onChange={handleChange} placeholder="Como consegui meu primeiro emprego em tech..." required className={inputClasses} />
            </div>
            <div>
                <label htmlFor="subtitle" className={labelClasses}>Subtítulo</label>
                <input id="subtitle" name="subtitle" value={article.subtitle} onChange={handleChange} placeholder="Uma jornada de persistência, comunidade e muito código." required className={inputClasses} />
            </div>
            <div>
                <label htmlFor="summary" className={labelClasses}>Resumo (para os cards)</label>
                <textarea id="summary" name="summary" value={article.summary} onChange={handleChange} required className={inputClasses} rows={3} placeholder="Um resumo curto e chamativo que aparecerá na página principal do blog."/>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="author" className={labelClasses}>Autor</label>
                    <input id="author" name="author" value={article.author} onChange={handleChange} required className={inputClasses} />
                </div>
                 <div>
                    <label htmlFor="category" className={labelClasses}>Categoria</label>
                    <select id="category" name="category" value={article.category} onChange={handleChange} className={inputClasses}>
                        <option>Dicas</option><option>Histórias</option><option>Tutoriais</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className={labelClasses}>Data de Publicação</label>
                    <input id="date" name="date" value={article.date} onChange={handleChange} required className={inputClasses} />
                </div>
            </div>
             <div>
                <label htmlFor="imageUrl" className={labelClasses}>URL da Imagem de Capa</label>
                <input id="imageUrl" name="imageUrl" value={article.imageUrl} onChange={handleChange} placeholder="https://..." required className={inputClasses}/>
             </div>
             <div>
                <div className="flex justify-between items-center mb-2">
                    <label className={labelClasses}>Conteúdo do Artigo (Markdown)</label>
                    <AiButton onClick={handleImproveText} isLoading={isImprovingText}>Melhorar Escrita</AiButton>
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
  );
};

export default ArticleEditor;