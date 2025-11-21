
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../App';
import Uploader from '../components/Uploader';
import { MarketingPost } from '../types';

// --- Preview Components ---

const InstagramPreview: React.FC<{ content: Partial<MarketingPost>, loadingImage: boolean }> = ({ content, loadingImage }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200 max-w-[350px] mx-auto text-black">
        <div className="p-3 flex items-center gap-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8a4add] to-[#f27983] p-[2px]">
                <div className="w-full h-full bg-white rounded-full p-[2px]">
                    <img src="https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/varied/futuroon-logo.svg" className="w-full h-full object-contain rounded-full bg-black" alt="" />
                </div>
            </div>
            <div>
                <p className="text-xs font-bold">institutofuturoon</p>
                <p className="text-[10px] text-gray-500">São Gonçalo, RJ</p>
            </div>
            <div className="ml-auto text-gray-400 text-xs">...</div>
        </div>
        
        <div className="aspect-square bg-gray-100 flex items-center justify-center relative group overflow-hidden">
            {content.uploadedImage ? (
                 <img src={content.uploadedImage} alt="Uploaded Ref" className="w-full h-full object-cover" />
            ) : loadingImage ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-[#8a4add] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-500 font-medium">Gerando arte com IA...</span>
                </div>
            ) : content.imageBase64 ? (
                <img src={`data:image/jpeg;base64,${content.imageBase64}`} alt="Generated" className="w-full h-full object-cover" />
            ) : (
                <div className="p-6 text-center">
                    <p className="text-xs text-gray-500 font-medium italic">💡 Ideia Visual: {content.imagePrompt}</p>
                </div>
            )}
        </div>

        <div className="p-3">
            <div className="flex gap-4 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </div>
            <p className="text-sm font-bold mb-1">845 curtidas</p>
            <p className="text-sm">
                <span className="font-bold mr-1">institutofuturoon</span>
                {content.caption}
            </p>
            <p className="text-[#8a4add] text-xs mt-1 font-medium">
                {content.hashtags?.join(' ')}
            </p>
        </div>
    </div>
);

const LinkedInPreview: React.FC<{ content: Partial<MarketingPost>, loadingImage: boolean }> = ({ content, loadingImage }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-300 max-w-[450px] mx-auto text-black font-sans">
        <div className="p-4 flex gap-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded bg-black">
                 <img src="https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/varied/futuroon-logo.svg" className="w-full h-full object-contain p-1" alt="" />
            </div>
            <div>
                <p className="text-sm font-bold leading-tight">Instituto FuturoOn</p>
                <p className="text-xs text-gray-500">3.452 seguidores</p>
                <p className="text-xs text-gray-500">1 h • 🌐</p>
            </div>
        </div>
        <div className="px-4 py-2">
            <p className="text-sm whitespace-pre-wrap text-gray-800">{content.caption}</p>
            <p className="text-[#8a4add] text-sm mt-2 font-bold">{content.hashtags?.join(' ')}</p>
        </div>
        <div className="w-full bg-gray-100 aspect-[1.91/1] flex items-center justify-center overflow-hidden relative">
             {content.uploadedImage ? (
                 <img src={content.uploadedImage} alt="Uploaded Ref" className="w-full h-full object-cover" />
            ) : loadingImage ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : content.imageBase64 ? (
                <img src={`data:image/jpeg;base64,${content.imageBase64}`} alt="Generated" className="w-full h-full object-cover" />
            ) : (
                <div className="p-6 text-center">
                    <p className="text-xs text-gray-500 font-medium italic">Visual: {content.imagePrompt}</p>
                </div>
            )}
        </div>
        <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-t border-gray-200">
            <span className="text-xs text-gray-500">👍 42 • 2 comentários</span>
        </div>
        <div className="px-2 py-2 flex justify-around border-t border-gray-200">
            <div className="flex flex-col items-center gap-1 cursor-pointer"><span className="text-gray-500 text-lg">👍</span><span className="text-xs text-gray-500 font-semibold">Gostei</span></div>
            <div className="flex flex-col items-center gap-1 cursor-pointer"><span className="text-gray-500 text-lg">💬</span><span className="text-xs text-gray-500 font-semibold">Comentar</span></div>
            <div className="flex flex-col items-center gap-1 cursor-pointer"><span className="text-gray-500 text-lg">🔁</span><span className="text-xs text-gray-500 font-semibold">Compartilhar</span></div>
            <div className="flex flex-col items-center gap-1 cursor-pointer"><span className="text-gray-500 text-lg">✈️</span><span className="text-xs text-gray-500 font-semibold">Enviar</span></div>
        </div>
    </div>
);

const TwitterPreview: React.FC<{ content: Partial<MarketingPost>, loadingImage: boolean }> = ({ content, loadingImage }) => (
    <div className="bg-black rounded-xl overflow-hidden shadow-xl border border-gray-800 max-w-[450px] mx-auto text-white font-sans">
        <div className="p-4 flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0 overflow-hidden">
                 <img src="https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/varied/futuroon-logo.svg" className="w-full h-full object-contain p-1" alt="" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[15px]">FuturoOn</span>
                    <span className="text-gray-500 text-[15px]">@futuroon_org · 23m</span>
                </div>
                <p className="text-[15px] leading-normal whitespace-pre-wrap mb-3">{content.caption} {content.hashtags?.slice(0,2).join(' ')}</p>
                
                {/* Twitter Image Card */}
                <div className="rounded-2xl border border-gray-800 overflow-hidden aspect-[16/9] bg-gray-900 flex items-center justify-center relative">
                     {content.uploadedImage ? (
                         <img src={content.uploadedImage} alt="Uploaded Ref" className="w-full h-full object-cover" />
                    ) : loadingImage ? (
                        <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : content.imageBase64 ? (
                        <img src={`data:image/jpeg;base64,${content.imageBase64}`} alt="Generated" className="w-full h-full object-cover" />
                    ) : (
                        <p className="text-xs text-gray-500 p-4 text-center italic">{content.imagePrompt}</p>
                    )}
                </div>

                <div className="flex justify-between mt-3 text-gray-500 text-sm max-w-xs">
                    <span className="flex items-center gap-1 hover:text-blue-400 transition-colors cursor-pointer">💬 2</span>
                    <span className="flex items-center gap-1 hover:text-green-400 transition-colors cursor-pointer">⚡ 5</span>
                    <span className="flex items-center gap-1 hover:text-pink-400 transition-colors cursor-pointer">❤️ 12</span>
                    <span className="flex items-center gap-1 hover:text-blue-400 transition-colors cursor-pointer">📊 1.2k</span>
                </div>
            </div>
        </div>
    </div>
);


// --- Main View ---

const MarketingGeneratorView: React.FC = () => {
    const { showToast, handleSaveMarketingPost, marketingPosts, user, handleDeleteMarketingPost } = useAppContext();
    
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('Instagram');
    const [tone, setTone] = useState('Inspirador');
    const [length, setLength] = useState('Médio');
    const [visualStyle, setVisualStyle] = useState('Fotorealista');
    const [targetAudience, setTargetAudience] = useState('Jovens da Periferia');
    const [useSearch, setUseSearch] = useState(false);
    const [useBranding, setUseBranding] = useState(true);
    const [includeCta, setIncludeCta] = useState(true); // Novo estado para CTA
    
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [externalImageUrl, setExternalImageUrl] = useState(''); 
    
    const [loadingText, setLoadingText] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    
    const [generatedContent, setGeneratedContent] = useState<Partial<MarketingPost> | null>(null);

    // Determine active image source
    const activeImageUrl = uploadedImageUrl || (externalImageUrl.trim() !== '' ? externalImageUrl.trim() : null);

    const handleLoadExample = () => {
        setTopic('Divulgação do novo curso de Fullstack');
        setPlatform('Instagram');
        setTone('Inspirador');
        setGeneratedContent({
            platform: 'Instagram',
            caption: "🚀 O futuro começa com uma linha de código! \n\nEstamos com matrículas abertas para a nova turma de Desenvolvimento Web Fullstack. 🖥️\n\nNa FuturoOn, você não apenas aprende tecnologia, você abre portas para um novo mundo de oportunidades. Junte-se a mais de 300 jovens que já transformaram suas vidas através da educação.\n\n💡 O curso é 100% gratuito e presencial. \n\n👇 Inscreva-se no link da bio e venha fazer parte da nossa tropa!\n\n#FuturoOn #Tech #Programação #Oportunidade #Dev",
            imagePrompt: "Diverse group of young students celebrating with laptops in a modern classroom, futuristic lighting, purple and pink neon accents, high quality",
            hashtags: ["#FuturoOn", "#Tech", "#Coding"],
            createdAt: new Date().toISOString(),
            uploadedImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
        });
        showToast("✨ Exemplo carregado!");
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim() && !activeImageUrl) {
            showToast("Por favor, descreva o tópico ou forneça uma imagem.");
            return;
        }

        setLoadingText(true);
        setGeneratedContent(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let lengthInstruction = "";
            if (length === 'Curto') lengthInstruction = "Seja extremamente conciso. Limite o texto a no máximo 2 frases impactantes.";
            if (length === 'Médio') lengthInstruction = "Escreva uma legenda padrão de redes sociais, cerca de 3 a 4 frases bem construídas.";
            if (length === 'Longo') lengthInstruction = "Escreva um texto detalhado e envolvente, utilizando parágrafos e storytelling para aprofundar o tema.";

            let promptText = `Você é um Social Media Manager especialista em ONGs.
            Crie um post para o ${platform} da ONG 'FuturoOn'.
            
            Público: ${targetAudience}
            Tom: ${tone}
            Comprimento do Texto: ${lengthInstruction}
            
            Regras para ${platform}:
            ${platform === 'Twitter' ? '- Máximo 280 caracteres no total. Direto ao ponto.' : '- Legenda envolvente com emojis moderados.'}
            ${platform === 'LinkedIn' ? '- Tom mais profissional, mas humano. Foco em impacto e dados.' : ''}
            `;

            if (includeCta) {
                promptText += "\nREQUISITO OBRIGATÓRIO: Finalize o texto com uma Chamada para Ação (CTA) forte e clara, convidando o usuário a interagir, se inscrever ou apoiar.";
            }
            
            promptText += `\nRetorne APENAS JSON com este formato:
            {
                "caption": "Texto do post",
                "imagePrompt": "Descrição VISUAL detalhada para gerar uma imagem (se nenhuma for fornecida).",
                "hashtags": ["tag1", "tag2"]
            }`;

            let contents: any[] = [];
            let tools = [];

            // 1. Handle Image Input (Multimodal) - Upload OR External URL
            if (activeImageUrl) {
                try {
                    promptText = `Analise esta imagem e escreva um post de marketing sobre ela.
                    Contexto Adicional: ${topic}
                    ` + promptText;
                    
                    // Fetch blob data (works for both local blob urls from upload or external public urls)
                    const imageResp = await fetch(activeImageUrl);
                    if (!imageResp.ok) throw new Error("Falha ao carregar imagem");
                    
                    const blob = await imageResp.blob();
                    const reader = new FileReader();
                    
                    const base64Promise = new Promise<string>((resolve) => {
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(blob);
                    });
                    
                    const base64Data = await base64Promise;
                    const base64String = base64Data.split(',')[1]; // Remove header

                    contents = [
                        {
                            inlineData: {
                                mimeType: blob.type,
                                data: base64String
                            }
                        },
                        { text: promptText }
                    ];
                } catch (err) {
                    console.error("Erro ao processar imagem:", err);
                    showToast("❌ Erro ao acessar a imagem (pode ser restrição de privacidade/CORS). Tente fazer upload do arquivo.");
                    setLoadingText(false);
                    return;
                }
            } else {
                // Text only input
                contents = [{ text: `Contexto do Post: "${topic}"\n` + promptText }];
            }

            // 2. Handle Search Grounding
            if (useSearch && !activeImageUrl) { 
                tools.push({ googleSearch: {} });
                contents[0].text += "\n\nUse o Google Search para encontrar tendências ou informações atuais relevantes sobre o tema e incorpore no post.";
            }

            // @ts-ignore 
            const requestConfig: any = {
                model: "gemini-2.5-flash",
                contents: contents.length > 1 ? { parts: contents } : contents[0].text,
                config: {
                    ...(useSearch ? {} : { responseMimeType: "application/json" }),
                    tools: tools.length > 0 ? tools : undefined
                }
            };

            const response = await ai.models.generateContent(requestConfig);
            
            let textResult;
            let groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            
            if (useSearch) {
                const text = response.text;
                const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    textResult = JSON.parse(jsonMatch[1] || jsonMatch[0]);
                } else {
                    textResult = {
                        caption: text.substring(0, 300),
                        imagePrompt: "A digital illustration representing technology education",
                        hashtags: ["#FuturoOn"]
                    }
                }
            } else {
                textResult = JSON.parse(response.text);
            }
            
            
            const newPost: Partial<MarketingPost> = {
                platform,
                caption: textResult.caption,
                imagePrompt: textResult.imagePrompt,
                hashtags: textResult.hashtags || [],
                uploadedImage: activeImageUrl, // Will be null if not set
                createdAt: new Date().toISOString(),
            };

            setGeneratedContent(newPost);
            setLoadingText(false);
            
            // 3. Generate Image (Only if user didn't provide one)
            if (!activeImageUrl) {
                setLoadingImage(true);
                try {
                    // Mapeamento de estilos para o prompt em inglês
                    const styleMap: Record<string, string> = {
                        'Fotorealista': 'High quality professional photography, realistic lighting, depth of field',
                        'Ilustração 3D': '3D render, blender style, soft lighting, cute 3d characters, vibrant',
                        'Minimalista (Flat)': 'Minimalist flat vector art, clean lines, simple composition, solid colors, corporate memphis style',
                        'Geométrico/Abstrato': 'Abstract geometric shapes, modern graphic design, clean, tech-oriented, patterns'
                    };

                    let stylePrompt = styleMap[visualStyle] || styleMap['Fotorealista'];
                    let finalImagePrompt = textResult.imagePrompt;
                    
                    // Instructions for Branding
                    if (useBranding) {
                        finalImagePrompt += `. BRANDING COLORS: Use strict color palette: Primary Purple (#8a4add), Secondary Pink (#f27983) and Dark Backgrounds (#09090B).`;
                    } else {
                        finalImagePrompt += ". Vibrant colors, diverse, hopeful atmosphere.";
                    }

                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash-image',
                        contents: {
                            parts: [{ text: `${stylePrompt}. ${finalImagePrompt}. High resolution.` }]
                        },
                        config: {
                            imageConfig: {
                                aspectRatio: "1:1"
                            }
                        }
                    });

                    let base64Image = null;
                    if (response.candidates && response.candidates[0].content.parts) {
                        for (const part of response.candidates[0].content.parts) {
                            if (part.inlineData) {
                                base64Image = part.inlineData.data;
                                break;
                            }
                        }
                    }
                    
                    if (!base64Image) throw new Error("A IA não retornou uma imagem válida.");

                    const finalPost = { ...newPost, imageBase64: base64Image };
                    setGeneratedContent(finalPost);
                    showToast("✨ Post completo gerado com sucesso!");

                } catch (imgError) {
                    console.error("Erro ao gerar imagem:", imgError);
                    showToast("⚠️ Texto gerado, mas houve erro na imagem.");
                } finally {
                    setLoadingImage(false);
                }
            } else {
                showToast("✨ Post gerado com base na sua imagem!");
            }

        } catch (error) {
            console.error("Erro ao gerar conteúdo:", error);
            showToast("❌ Erro ao gerar. Verifique a imagem ou tópico.");
            setLoadingText(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast("Copiado para a área de transferência!");
    };

    const downloadImage = async () => {
        if (!generatedContent) return;
        
        try {
            let href = '';
            if (generatedContent.imageBase64) {
                href = `data:image/jpeg;base64,${generatedContent.imageBase64}`;
            } else if (generatedContent.uploadedImage) {
                // Fetch to get blob to force download instead of open in new tab
                const response = await fetch(generatedContent.uploadedImage);
                const blob = await response.blob();
                href = URL.createObjectURL(blob);
            }

            if (href) {
                const link = document.createElement('a');
                link.href = href;
                link.download = `futuroon-post-${Date.now()}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                if (generatedContent.uploadedImage) URL.revokeObjectURL(href);
                showToast("⬇️ Imagem baixada!");
            }
        } catch (e) {
            console.error(e);
            showToast("❌ Erro ao baixar imagem. Tente clicar com botão direito e 'Salvar Como'.");
        }
    };

    const downloadCaption = () => {
        if (!generatedContent?.caption) return;
        const element = document.createElement("a");
        const file = new Blob([generatedContent.caption], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `legenda-${Date.now()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        showToast("⬇️ Texto baixado!");
    };

    const savePost = async (status: 'draft' | 'published') => {
        if (!generatedContent || !user) return;
        
        const postToSave: MarketingPost = {
            id: generatedContent.id || `post_${Date.now()}`,
            platform: generatedContent.platform || platform,
            caption: generatedContent.caption || '',
            imagePrompt: generatedContent.imagePrompt || '',
            hashtags: generatedContent.hashtags || [],
            imageBase64: generatedContent.imageBase64 ?? null,
            uploadedImage: generatedContent.uploadedImage ?? null,
            createdAt: generatedContent.createdAt || new Date().toISOString(),
            status,
            authorId: user.id
        };

        await handleSaveMarketingPost(postToSave);
    };

    const handlePublish = async () => {
        if (window.confirm("Deseja marcar este post como PUBLICADO? Ele será salvo em seu histórico com status 'Publicado'.")) {
            await savePost('published');
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white">Marketing Studio <span className="text-[#8a4add] text-xl">AI</span></h1>
                <p className="text-gray-400 mt-1">Crie posts completos baseados em ideias, pesquisas ou imagens reais.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Configuration (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="bg-white/10 p-1 rounded-md">⚙️</span> Criar Novo Post
                            </h2>
                            <button 
                                type="button" 
                                onClick={handleLoadExample}
                                className="text-xs font-semibold text-[#c4b5fd] hover:text-white border border-[#8a4add]/30 hover:bg-[#8a4add]/20 px-3 py-1.5 rounded-lg transition-all"
                            >
                                👁️ Ver Exemplo
                            </button>
                        </div>
                        
                        <form onSubmit={handleGenerate} className="space-y-5">
                            
                            {/* Upload Section & URL Input */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Imagem de Base (Opcional)</label>
                                <div className="space-y-3">
                                    <Uploader pathnamePrefix="marketing-refs" onUploadComplete={(url) => {
                                        setUploadedImageUrl(url);
                                        setExternalImageUrl(''); // Clear text input if upload is used
                                    }}>
                                        {(trigger, isUploading) => (
                                            <div 
                                                onClick={trigger}
                                                className={`border-2 border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:bg-white/5 transition-colors ${uploadedImageUrl ? 'border-[#8a4add]' : ''}`}
                                            >
                                                {isUploading ? (
                                                    <p className="text-xs text-gray-400">Enviando...</p>
                                                ) : uploadedImageUrl ? (
                                                    <div className="relative">
                                                        <img src={uploadedImageUrl} className="h-20 w-full object-cover rounded-lg" alt="Ref" />
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setUploadedImageUrl(null); }}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        <p className="text-xs text-gray-400">Clique para enviar arquivo</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Uploader>
                                    
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            value={externalImageUrl}
                                            onChange={(e) => {
                                                setExternalImageUrl(e.target.value);
                                                if(e.target.value) setUploadedImageUrl(null); // Clear upload if text is typed
                                            }}
                                            placeholder="Ou cole a URL de uma imagem da internet..."
                                            className="w-full p-3 bg-white/5 rounded-xl border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors text-white placeholder-gray-600 text-xs"
                                        />
                                        {externalImageUrl && (
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                <img src={externalImageUrl} className="w-6 h-6 rounded object-cover border border-white/20" onError={(e) => (e.currentTarget.style.display = 'none')} alt=""/>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sobre o que é o post?</label>
                                <textarea 
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    rows={3}
                                    placeholder={activeImageUrl ? "Descreva o contexto da imagem (ex: Alunos na formatura...)" : "Ex: Dicas de carreira para devs júnior..."}
                                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors text-white placeholder-gray-600 text-sm"
                                />
                            </div>

                            <div className="space-y-3 bg-black/30 p-3 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        id="useSearch" 
                                        checked={useSearch} 
                                        onChange={(e) => setUseSearch(e.target.checked)}
                                        disabled={!!activeImageUrl} 
                                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]"
                                    />
                                    <label htmlFor="useSearch" className={`text-xs ${!!activeImageUrl ? 'text-gray-600' : 'text-gray-300'}`}>
                                        Pesquisar na Web (Desativado com imagem)
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        id="useBranding" 
                                        checked={useBranding} 
                                        onChange={(e) => setUseBranding(e.target.checked)}
                                        disabled={!!activeImageUrl} 
                                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]"
                                    />
                                    <label htmlFor="useBranding" className={`text-xs ${!!activeImageUrl ? 'text-gray-600' : 'text-[#c4b5fd] font-semibold'}`}>
                                        🎨 Aplicar Cores da Marca
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        id="includeCta" 
                                        checked={includeCta} 
                                        onChange={(e) => setIncludeCta(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]"
                                    />
                                    <label htmlFor="includeCta" className="text-xs text-white font-semibold">
                                        📢 Incluir CTA (Chamada para Ação)
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rede Social</label>
                                    <select 
                                        value={platform} 
                                        onChange={(e) => setPlatform(e.target.value)}
                                        className="w-full p-2.5 bg-white/5 rounded-lg border border-white/10 focus:ring-2 focus:ring-[#8a4add] text-white text-sm"
                                    >
                                        <option>Instagram</option>
                                        <option>LinkedIn</option>
                                        <option>Twitter</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Estilo Visual</label>
                                    <select 
                                        value={visualStyle} 
                                        onChange={(e) => setVisualStyle(e.target.value)}
                                        className="w-full p-2.5 bg-white/5 rounded-lg border border-white/10 focus:ring-2 focus:ring-[#8a4add] text-white text-sm"
                                        disabled={!!activeImageUrl}
                                    >
                                        <option>Fotorealista</option>
                                        <option>Ilustração 3D</option>
                                        <option>Minimalista (Flat)</option>
                                        <option>Geométrico/Abstrato</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tom de Voz</label>
                                    <select 
                                        value={tone} 
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full p-2.5 bg-white/5 rounded-lg border border-white/10 focus:ring-2 focus:ring-[#8a4add] text-white text-sm"
                                    >
                                        <option>Inspirador</option>
                                        <option>Urgente</option>
                                        <option>Educativo</option>
                                        <option>Descontraído</option>
                                        <option>Corporativo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tamanho do Texto</label>
                                    <select 
                                        value={length} 
                                        onChange={(e) => setLength(e.target.value)}
                                        className="w-full p-2.5 bg-white/5 rounded-lg border border-white/10 focus:ring-2 focus:ring-[#8a4add] text-white text-sm"
                                    >
                                        <option>Curto</option>
                                        <option>Médio</option>
                                        <option>Longo</option>
                                    </select>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loadingText || loadingImage}
                                className="w-full bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#8a4add]/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                            >
                                {loadingText ? (
                                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Analisando...</>
                                ) : loadingImage ? (
                                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Criando Visual...</>
                                ) : (
                                    <>✨ Gerar Conteúdo</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Saved Posts Sidebar */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 hidden lg:block">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Posts Salvos</h3>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {marketingPosts.length === 0 ? (
                                <p className="text-gray-600 text-xs text-center py-4">Seus posts salvos aparecerão aqui.</p>
                            ) : (
                                marketingPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(item => (
                                    <div key={item.id} className="group relative w-full">
                                        <button 
                                            onClick={() => setGeneratedContent(item)}
                                            className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex gap-3 items-center border border-transparent hover:border-white/10"
                                        >
                                            {item.uploadedImage ? (
                                                <img src={item.uploadedImage} className="w-8 h-8 rounded object-cover bg-gray-800 flex-shrink-0" alt="Ref" />
                                            ) : item.imageBase64 ? (
                                                <img src={`data:image/jpeg;base64,${item.imageBase64}`} className="w-8 h-8 rounded object-cover bg-gray-800 flex-shrink-0" alt="" />
                                            ) : (
                                                <div className="w-8 h-8 rounded bg-gray-800 flex-shrink-0 flex items-center justify-center text-[10px]">TxT</div>
                                            )}
                                            <div className="overflow-hidden flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs text-white font-medium truncate group-hover:text-[#c4b5fd]">{item.caption}</p>
                                                    {item.status === 'published' && <span className="text-[8px] bg-green-500/20 text-green-400 px-1 rounded">PUB</span>}
                                                </div>
                                                <p className="text-[10px] text-gray-500">{item.platform} • {new Date(item.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteMarketingPost(item.id); }}
                                            className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-[#121212] rounded-md"
                                            title="Excluir"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Preview Area (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-12 relative min-h-[600px] flex flex-col items-center justify-center bg-grid-pattern">
                        {!generatedContent && !loadingText ? (
                            <div className="text-center text-gray-600 opacity-60">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
                                </div>
                                <p>O preview do seu post aparecerá aqui.</p>
                            </div>
                        ) : (
                            <div className="w-full max-w-xl animate-fade-in">
                                <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                                    <span className="bg-[#8a4add] text-white text-xs font-bold px-3 py-1 rounded-full">Preview: {platform}</span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={downloadCaption}
                                            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            Baixar Texto
                                        </button>
                                        <button 
                                            onClick={() => generatedContent?.caption && copyToClipboard(generatedContent.caption)}
                                            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                            Copiar Texto
                                        </button>
                                        <button 
                                            onClick={downloadImage}
                                            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            Baixar Imagem
                                        </button>
                                    </div>
                                </div>

                                {/* Dynamic Preview Switching */}
                                {(platform === 'Instagram' || platform === 'WhatsApp (Lista de Transmissão)') && generatedContent && (
                                    <InstagramPreview content={generatedContent} loadingImage={loadingImage} />
                                )}
                                {platform === 'LinkedIn' && generatedContent && (
                                    <LinkedInPreview content={generatedContent} loadingImage={loadingImage} />
                                )}
                                {platform === 'Twitter' && generatedContent && (
                                    <TwitterPreview content={generatedContent} loadingImage={loadingImage} />
                                )}
                                
                                {/* Action Buttons */}
                                {generatedContent && !loadingImage && (
                                    <div className="mt-8 flex justify-center gap-4">
                                        <button 
                                            onClick={() => savePost('draft')}
                                            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                                            Salvar Rascunho
                                        </button>
                                        <button 
                                            onClick={handlePublish}
                                            className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg shadow-green-500/20"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            Publicar Agora
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketingGeneratorView;
