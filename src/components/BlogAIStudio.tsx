import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface BlogAIStudioProps {
  content: string;
  onApply: (improvedContent: string) => void;
  onClose: () => void;
}

const BlogAIStudio: React.FC<BlogAIStudioProps> = ({ content, onApply, onClose }) => {
  // Estados
  const [wordCount, setWordCount] = useState(600);
  const [tone, setTone] = useState<'professional' | 'casual' | 'inspirational' | 'technical'>('inspirational');
  const [template, setTemplate] = useState<'standard' | 'listicle' | 'tutorial' | 'story' | 'guide'>('standard');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState('');
  const [activeTab, setActiveTab] = useState<'config' | 'preview'>('config');

  // Configurações de tom
  const toneDescriptions = {
    professional: {
      label: 'Profissional',
      icon: '💼',
      description: 'Tom formal e corporativo, ideal para artigos técnicos e análises',
      color: 'from-blue-500 to-cyan-500'
    },
    casual: {
      label: 'Casual',
      icon: '😊',
      description: 'Tom descontraído e amigável, perfeito para dicas e tutoriais',
      color: 'from-green-500 to-emerald-500'
    },
    inspirational: {
      label: 'Inspirador',
      icon: '✨',
      description: 'Tom motivador e emocional, ideal para histórias e conquistas',
      color: 'from-[#8a4add] to-[#f27983]'
    },
    technical: {
      label: 'Técnico',
      icon: '🔧',
      description: 'Tom objetivo e didático, perfeito para documentação e guias',
      color: 'from-orange-500 to-red-500'
    }
  };

  // Templates de formatação
  const templateDescriptions = {
    standard: {
      label: 'Padrão',
      icon: '📄',
      description: 'Estrutura clássica com introdução, desenvolvimento e conclusão',
      color: 'from-gray-500 to-gray-600',
      example: 'Intro → Seções → Conclusão'
    },
    listicle: {
      label: 'Lista',
      icon: '📋',
      description: 'Formato de lista numerada (ex: "10 Dicas para...")',
      color: 'from-purple-500 to-pink-500',
      example: '1. Item → 2. Item → 3. Item'
    },
    tutorial: {
      label: 'Tutorial',
      icon: '🎓',
      description: 'Passo a passo detalhado com exemplos práticos',
      color: 'from-blue-500 to-indigo-500',
      example: 'Passo 1 → Passo 2 → Resultado'
    },
    story: {
      label: 'História',
      icon: '📖',
      description: 'Narrativa envolvente com começo, meio e fim',
      color: 'from-orange-500 to-red-500',
      example: 'Contexto → Jornada → Aprendizado'
    },
    guide: {
      label: 'Guia Completo',
      icon: '📚',
      description: 'Documentação extensa com índice e seções detalhadas',
      color: 'from-green-500 to-teal-500',
      example: 'Índice → Capítulos → Recursos'
    }
  };

  // Gerar conteúdo melhorado
  const handleGenerate = async () => {
    if (!content.trim()) {
      alert("Não há conteúdo para ser melhorado.");
      return;
    }

    setIsGenerating(true);
    setActiveTab('preview');


    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const toneInstructions = {
        professional: 'Use um tom profissional, formal e corporativo. Evite gírias e mantenha linguagem técnica quando apropriado.',
        casual: 'Use um tom casual, descontraído e amigável. Pode usar gírias moderadamente e criar conexão próxima com o leitor.',
        inspirational: 'Use um tom inspirador, motivador e emocional. Conte histórias, use metáforas e desperte emoções positivas.',
        technical: 'Use um tom técnico, objetivo e didático. Seja preciso, use terminologia correta e explique conceitos claramente.'
      };

      const templateInstructions = {
        standard: `**ESTRUTURA PADRÃO:**
- Introdução impactante (1-2 parágrafos)
- Desenvolvimento em seções claras (H2 e H3)
- Conclusão com resumo e CTA
- Fluxo natural e progressivo`,

        listicle: `**ESTRUTURA DE LISTA:**
- Título chamativo com número (ex: "7 Dicas para...")
- Introdução breve explicando o tema
- Lista numerada com cada item tendo:
  * Subtítulo descritivo
  * Explicação detalhada (2-3 parágrafos)
  * Exemplo prático quando possível
- Conclusão resumindo os pontos principais`,

        tutorial: `**ESTRUTURA DE TUTORIAL:**
- Introdução: O que será aprendido
- Pré-requisitos (se houver)
- Passos numerados e detalhados:
  * Título claro do passo
  * Explicação do que fazer
  * Código ou exemplo prático
  * Resultado esperado
- Conclusão: Próximos passos e recursos`,

        story: `**ESTRUTURA NARRATIVA:**
- Gancho inicial envolvente
- Contexto: Situação inicial
- Desenvolvimento: Jornada e desafios
- Clímax: Momento decisivo
- Resolução: Resultado e transformação
- Aprendizado: Lições e reflexões
- CTA emocional`,

        guide: `**ESTRUTURA DE GUIA COMPLETO:**
- Índice no início
- Introdução: Visão geral do tema
- Capítulos organizados (H2):
  * Seções detalhadas (H3)
  * Exemplos práticos
  * Dicas e avisos em destaque
  * Recursos adicionais
- Conclusão: Resumo e próximos passos
- FAQ (se aplicável)`
      };

      const prompt = `Você é um especialista em criação de conteúdo para blogs e sites, com foco em escrita envolvente, organização visual e otimização para conversão.

**CONFIGURAÇÕES SOLICITADAS:**
- **Tamanho:** Aproximadamente ${wordCount} palavras
- **Tom de Voz:** ${toneDescriptions[tone].label} - ${toneInstructions[tone]}
- **Formato:** ${templateDescriptions[template].label} - ${templateDescriptions[template].description}
${customPrompt ? `- **Instruções Adicionais:** ${customPrompt}` : ''}

**ESTRUTURA A SEGUIR:**
${templateInstructions[template]}

**SUA TAREFA:**

1. **Montar e melhorar a postagem** em formato Markdown seguindo EXATAMENTE a estrutura do template "${templateDescriptions[template].label}".

2. **Organizar a postagem** como um especialista em montagem de sites e blogs:
   - Títulos e subtítulos hierárquicos (H1, H2, H3) bem distribuídos
   - Parágrafos curtos e escaneáveis (2-3 linhas máximo)
   - Listas numeradas e com marcadores para facilitar leitura
   - Chamadas para ação (CTA) estratégicas
   - Destaques visuais com **negrito** e *itálico* para pontos importantes
   - Inserção de blocos de código ou citações quando pertinente
   - Emojis estratégicos para destacar seções

3. **Melhorar a visualização e conversão:**
   - Criar introduções envolventes que prendam a atenção
   - Concluir com um resumo e convite à interação (comentários, compartilhamento)
   - Usar linguagem clara, persuasiva e adaptada ao público-alvo (jovens da periferia interessados em tecnologia)
   - Incluir palavras-chave relevantes para SEO sem perder naturalidade

4. **Beleza e estética da postagem:**
   - Estrutura harmoniosa e bem espaçada
   - Uso de emojis estratégicos para destacar seções
   - Tom ${toneDescriptions[tone].label.toLowerCase()}
   - Formato ${templateDescriptions[template].label}

⚡ **IMPORTANTE:**
- Retorne APENAS o conteúdo melhorado em Markdown
- NÃO adicione comentários ou explicações sobre as mudanças
- Mantenha a essência e mensagem original
- Adapte o tom para o público da FuturoOn (jovens da periferia em tecnologia)
- Respeite o tamanho aproximado de ${wordCount} palavras
- SIGA RIGOROSAMENTE a estrutura do template "${templateDescriptions[template].label}"

**CONTEÚDO ORIGINAL PARA MELHORAR:**
---
${content}
---`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setPreview(response.text);

    } catch (error) {
      console.error("Erro ao melhorar texto com IA:", error);
      alert("Não foi possível melhorar o texto. Tente novamente.");
      setActiveTab('config');
    } finally {
      setIsGenerating(false);
    }
  };

  // Aplicar mudanças
  const handleApplyChanges = () => {
    if (preview) {
      onApply(preview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-[#18181B] to-[#09090B] rounded-2xl border border-white/10 max-w-6xl w-full shadow-2xl my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                <span className="text-4xl">✨</span>
                AI Studio - Blog
              </h2>
              <p className="text-gray-400">Configure e melhore sua postagem com inteligência artificial</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 px-6 py-4 font-bold transition-all ${
              activeTab === 'config'
                ? 'text-white border-b-2 border-[#8a4add] bg-white/5'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            ⚙️ Configurações
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 px-6 py-4 font-bold transition-all ${
              activeTab === 'preview'
                ? 'text-white border-b-2 border-[#8a4add] bg-white/5'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            👁️ Preview
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          
          {/* Tab: Configurações */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              
              {/* Tamanho do Conteúdo */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  📏 Tamanho do Conteúdo
                </label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="100"
                      max="3000"
                      step="100"
                      value={wordCount}
                      onChange={(e) => setWordCount(Number(e.target.value))}
                      className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#8a4add]"
                    />
                    <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 min-w-[120px] text-center">
                      <span className="text-2xl font-black text-white">{wordCount}</span>
                      <span className="text-xs text-gray-400 block">palavras</span>
                    </div>
                  </div>
                  
                  {/* Presets rápidos */}
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { label: 'Curto', value: 300, icon: '📝' },
                      { label: 'Médio', value: 600, icon: '📄' },
                      { label: 'Padrão', value: 900, icon: '📋' },
                      { label: 'Longo', value: 1200, icon: '📚' },
                      { label: 'Completo', value: 2000, icon: '📖' }
                    ].map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => setWordCount(preset.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          wordCount === preset.value
                            ? 'bg-[#8a4add] text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {preset.icon} {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tom de Voz */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  🎭 Tom de Voz
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.keys(toneDescriptions) as Array<keyof typeof toneDescriptions>).map((key) => {
                    const toneConfig = toneDescriptions[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setTone(key)}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          tone === key
                            ? 'border-[#8a4add] bg-[#8a4add]/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${toneConfig.color} rounded-xl flex items-center justify-center text-2xl`}>
                            {toneConfig.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-white mb-1">
                              {toneConfig.label}
                            </h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                              {toneConfig.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Formato da Postagem */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  📐 Formato da Postagem
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(Object.keys(templateDescriptions) as Array<keyof typeof templateDescriptions>).map((key) => {
                    const templateConfig = templateDescriptions[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setTemplate(key)}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          template === key
                            ? 'border-[#8a4add] bg-[#8a4add]/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${templateConfig.color} rounded-lg flex items-center justify-center text-xl`}>
                              {templateConfig.icon}
                            </div>
                            <h4 className="text-base font-bold text-white">
                              {templateConfig.label}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {templateConfig.description}
                          </p>
                          <div className="mt-1 px-2 py-1 bg-white/5 rounded text-xs text-gray-500 font-mono">
                            {templateConfig.example}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prompt Customizado */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  💬 Instruções Adicionais (Opcional)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ex: Adicione mais exemplos práticos, foque em iniciantes, inclua estatísticas..."
                  className="w-full p-4 bg-white/5 rounded-xl border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors text-white placeholder-gray-500 resize-none"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Dica: Seja específico sobre o que você quer que a IA faça ou evite
                </p>
              </div>

            </div>
          )}

          {/* Tab: Preview */}
          {activeTab === 'preview' && (
            <div>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#8a4add] border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">✨</span>
                    </div>
                  </div>
                  <p className="text-white font-bold text-lg">Gerando conteúdo melhorado...</p>
                  <p className="text-gray-400 text-sm">Isso pode levar alguns segundos</p>
                </div>
              ) : preview ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="prose prose-invert max-w-none">
                    <div 
                      className="text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: preview
                          .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-6 mb-3">$1</h3>')
                          .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2>')
                          .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black text-white mt-10 mb-5">$1</h1>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em class="text-[#c4b5fd]">$1</em>')
                          .replace(/\n\n/g, '</p><p class="mb-4">')
                          .replace(/^- (.*$)/gim, '<li class="ml-4 mb-2">• $1</li>')
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <span className="text-6xl">📝</span>
                  <p className="text-white font-bold text-lg">Nenhum preview ainda</p>
                  <p className="text-gray-400 text-sm">Configure as opções e clique em "Gerar Conteúdo"</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-xl">💡</span>
            <span>Você pode gerar várias vezes até ficar satisfeito</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-all"
            >
              Cancelar
            </button>
            {preview ? (
              <button
                onClick={handleApplyChanges}
                className="px-6 py-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#8a4add]/30 transition-all"
              >
                ✅ Aplicar Mudanças
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#8a4add]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✨ Gerar Conteúdo
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogAIStudio;
