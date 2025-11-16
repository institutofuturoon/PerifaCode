import React, { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, Module, Lesson } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../App';
import RichContentEditor from '../components/RichContentEditor';

type SelectedItem = 
  | { type: 'course' }
  | { type: 'module'; moduleIndex: number }
  | { type: 'lesson'; moduleIndex: number; lessonIndex: number };

type AiAction = 'create' | 'improve' | 'summarize' | 'create_code';


const CourseEditor: React.FC = () => {
  const { user, instructors, courses, handleSaveCourse, showToast } = useAppContext();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const initialCourse = useMemo(() => {
    if (courseId && courseId !== 'new') {
        return courses.find(c => c.id === courseId);
    }
    return {
        id: `course_${Date.now()}`,
        title: '', description: '', longDescription: '',
        track: 'Frontend' as Course['track'], imageUrl: '', duration: '',
        skillLevel: 'Iniciante' as Course['skillLevel'], instructorId: user?.id || '',
        modules: [], format: 'online' as Course['format']
    };
  }, [courseId, courses, user]);
  
  const [course, setCourse] = useState<Course>(initialCourse || {
    id: `course_${Date.now()}`, title: '', description: '', longDescription: '',
    // FIX: Explicitly cast properties to match the 'Course' type to resolve type error.
    track: 'Frontend' as Course['track'], imageUrl: '', duration: '', skillLevel: 'Iniciante' as Course['skillLevel'],
    instructorId: user?.id || '', modules: [], format: 'online' as Course['format']
  });
  
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({ type: 'course' });
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingStructure, setIsGeneratingStructure] = useState(false);
  const [isAiAssistantLoading, setIsAiAssistantLoading] = useState(false);
  const [aiAction, setAiAction] = useState<AiAction>('create');
  const [aiCommand, setAiCommand] = useState('');
  
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  // Refs for the rich text editors
  const objectiveRef = useRef<HTMLTextAreaElement>(null);
  const mainContentRef = useRef<HTMLTextAreaElement>(null);
  const complementaryMaterialRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  const onCancel = () => navigate('/admin');
  
  if (!initialCourse) {
      return <div className="text-center py-20">Curso não encontrado.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleModuleChange = (moduleIndex: number, field: string, value: string) => {
    const newModules = [...course.modules];
    newModules[moduleIndex] = { ...newModules[moduleIndex], [field]: value };
    setCourse(prev => ({ ...prev, modules: newModules }));
  };

  const handleLessonChange = (moduleIndex: number, lessonIndex: number, field: keyof Lesson, value: string) => {
    const newModules = [...course.modules];
    const newLessons = [...newModules[moduleIndex].lessons];
    newLessons[lessonIndex] = { ...newLessons[lessonIndex], [field]: value };
    newModules[moduleIndex] = { ...newModules[moduleIndex], lessons: newLessons };
    setCourse(prev => ({ ...prev, modules: newModules }));
  };

  const addModule = () => {
    const newModule: Module = {
        id: `${course.id}-m${course.modules.length + 1}`,
        title: `Novo Módulo ${course.modules.length + 1}`,
        lessons: []
    };
    setCourse(prev => ({...prev, modules: [...prev.modules, newModule]}));
  };
  
  const addLesson = (moduleIndex: number) => {
    const newLesson: Lesson = {
        id: `${course.modules[moduleIndex].id}-l${course.modules[moduleIndex].lessons.length + 1}`,
        title: `Nova Aula ${course.modules[moduleIndex].lessons.length + 1}`,
        duration: '15 min',
        type: 'text',
        xp: 10,
    };
    const newModules = [...course.modules];
    newModules[moduleIndex].lessons.push(newLesson);
    setCourse(prev => ({...prev, modules: newModules}));
  };

  const removeModule = (moduleIndex: number) => {
    const newModules = course.modules.filter((_, index) => index !== moduleIndex);
    setCourse(prev => ({...prev, modules: newModules}));
    setSelectedItem({ type: 'course' });
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...course.modules];
    newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter((_, index) => index !== lessonIndex);
    setCourse(prev => ({...prev, modules: newModules}));
    setSelectedItem({ type: 'module', moduleIndex });
  };
  
  const handleImageFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('❌ Por favor, selecione um arquivo de imagem válido.');
        return;
    }
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
        showToast('❌ O arquivo é muito grande. O limite é de 4MB.');
        return;
    }

    setIsUploadingImage(true);
    try {
        const pathname = `course-covers/${course.id}-${Date.now()}-${file.name}`;
        
        // AVISO DE SEGURANÇA: Token exposto no cliente apenas para fins de teste.
        const BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_uI73bVafvL0LLaMC_v9NEwyi9BSF1pBmOXbFEamnbWvh3Rc';

        // FIX: Replaced unsupported `upload` function call with a direct `fetch` to Vercel Blob API.
        const response = await fetch(
            `https://blob.vercel-storage.com/${pathname}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${BLOB_READ_WRITE_TOKEN}`,
                'x-api-version': '8',
                'Content-Type': file.type,
              },
              body: file,
            },
        );

        const newBlob = await response.json();
        if (!response.ok) {
            throw new Error(`Falha no upload: ${newBlob.error?.message || 'Erro desconhecido do servidor'}`);
        }

        setCourse(prev => ({ ...prev, imageUrl: newBlob.url }));
        showToast('✅ Imagem de capa enviada com sucesso!');

    } catch (err: any) {
        console.error('Erro detalhado no upload da imagem:', err);
        showToast(`❌ Erro ao enviar a imagem: ${err.message}`);
    } finally {
        setIsUploadingImage(false);
        if(imageFileInputRef.current) {
            imageFileInputRef.current.value = "";
        }
    }
  };


  const handleGenerateStructure = async () => {
    if (!aiTopic) {
        alert("Descreva o tema do curso para a IA gerar a estrutura.");
        return;
    }
    setIsGeneratingStructure(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Você é um designer instrucional sênior criando um curso para a FuturoOn.
Sua tarefa é criar uma estrutura de curso detalhada sobre o tema: "${aiTopic}".
Divida em módulos e cada módulo em aulas. Os títulos devem ser claros e em português do Brasil.
Retorne APENAS no formato JSON especificado.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            lessons: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: { title: { type: Type.STRING } },
                                    required: ["title"]
                                }
                            }
                        },
                        required: ["title", "lessons"]
                    }
                }
            }
        });

        const generatedStructure = JSON.parse(response.text);
        
        const newModules: Module[] = generatedStructure.map((mod: any, modIndex: number) => {
            const moduleId = `${course.id}-m${modIndex + 1}`;
            return {
                id: moduleId,
                title: mod.title,
                lessons: mod.lessons.map((less: any, lessIndex: number) => ({
                    id: `${moduleId}-l${lessIndex + 1}`,
                    title: less.title,
                    duration: '20 min', type: 'text' as 'text', xp: 10,
                }))
            };
        });

        setCourse(prev => ({ ...prev, modules: newModules, title: prev.title || aiTopic }));

    } catch (error) {
        console.error("Erro ao gerar estrutura com IA:", error);
        alert("Não foi possível gerar a estrutura do curso. Tente novamente.");
    } finally {
        setIsGeneratingStructure(false);
    }
  };

  const handleAiAssistantAction = async () => {
    if (selectedItem.type !== 'lesson') {
      showToast("Selecione uma aula para usar o assistente de IA.");
      return;
    }

    const { moduleIndex, lessonIndex } = selectedItem;
    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    const textarea = mainContentRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const selectedText = textarea.value.substring(selectionStart, selectionEnd);

    if ((aiAction === 'improve' || aiAction === 'summarize') && !selectedText) {
      showToast("Por favor, selecione um trecho do texto para usar esta função.");
      return;
    }
    if ((aiAction === 'create' || aiAction === 'create_code') && !aiCommand) {
      showToast("Por favor, descreva o que você quer criar.");
      return;
    }

    setIsAiAssistantLoading(true);
    
    let prompt = '';
    let insertionMode: 'replace' | 'insert' = 'insert';

    switch (aiAction) {
      case 'create':
        prompt = `Você é um especialista em design instrucional para a FuturoOn. Seu público são jovens da periferia.
        Crie um conteúdo claro e didático sobre o seguinte tópico: "${aiCommand}".
        Use formatação Markdown (títulos com ##, negrito com **, listas) e nossos shortcodes ([TIP], [ALERT type="info"]) para deixar o conteúdo bem estruturado e com ótima legibilidade, como em um blog ou no Notion.
        Retorne APENAS o conteúdo em Markdown.`;
        break;
      case 'create_code':
        prompt = `Crie um exemplo de código sobre "${aiCommand}". Adicione comentários simples explicando as partes importantes.
        Retorne o bloco de código completo dentro de um shortcode [CODE lang="auto"]...[/CODE].
        Se a linguagem for óbvia (ex: "array em javascript"), use a sigla correta (ex: "js"). Senão, use "auto".
        Retorne APENAS o shortcode e seu conteúdo.`;
        break;
      case 'improve':
        prompt = `Você é um editor especialista. Melhore o texto a seguir para que fique mais claro, didático e engajante para um jovem iniciante em tecnologia. Corrija erros e melhore a fluidez.
        Retorne APENAS o texto melhorado, mantendo a formatação Markdown.
        Texto original: "${selectedText}"`;
        insertionMode = 'replace';
        break;
      case 'summarize':
        prompt = `Resuma o texto a seguir em 2 ou 3 frases principais, focando nos conceitos mais importantes para um iniciante.
        Retorne APENAS o resumo.
        Texto original: "${selectedText}"`;
        insertionMode = 'replace';
        break;
    }
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const aiContent = response.text;
      const currentFullText = lesson.mainContent || '';
      
      let newContent = '';
      if (insertionMode === 'insert') {
        newContent = currentFullText.substring(0, selectionStart) + aiContent + currentFullText.substring(selectionEnd);
      } else { // replace
        newContent = currentFullText.substring(0, selectionStart) + aiContent + currentFullText.substring(selectionEnd);
      }
      
      handleLessonChange(moduleIndex, lessonIndex, 'mainContent', newContent);
      setAiCommand('');

    } catch (error) {
      console.error("Erro no Assistente IA:", error);
      showToast("❌ Ocorreu um erro ao usar o assistente. Tente novamente.");
    } finally {
      setIsAiAssistantLoading(false);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveCourse(course);
    navigate('/admin');
  };
  
  const renderEditPanel = () => {
    const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm";
    const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

    if (!user) return null;

    if (selectedItem.type === 'course') {
        return (
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Informações Gerais do Curso</h3>
                <div>
                    <label htmlFor="title" className={labelClasses}>Título do Curso</label>
                    <input id="title" name="title" value={course.title} onChange={handleChange} placeholder="Ex: CSS Moderno: Do Flexbox ao Grid" className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="description" className={labelClasses}>Descrição Curta</label>
                    <textarea id="description" name="description" value={course.description} onChange={handleChange} placeholder="Uma breve descrição que aparecerá nos cards do curso." className={inputClasses} rows={3}/>
                </div>
                <div>
                    <label htmlFor="longDescription" className={labelClasses}>Descrição Longa e Detalhada</label>
                    <textarea id="longDescription" name="longDescription" value={course.longDescription} onChange={handleChange} placeholder="Descreva o curso em detalhes, o que o aluno aprenderá, etc." className={inputClasses} rows={5}/>
                </div>
                
                 <div>
                    <label className={labelClasses}>Imagem de Capa</label>
                    <div className="mt-2 flex items-center gap-6">
                        <div className="relative h-24 w-40 rounded-md bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                            {course.imageUrl ? (
                                <img src={course.imageUrl} alt="Capa do curso" className="h-full w-full object-cover rounded-md" />
                            ) : (
                                <span className="text-xs text-gray-500">Sem imagem</span>
                            )}
                            {isUploadingImage && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-md">
                                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className="flex-grow">
                            <input 
                                type="file" 
                                ref={imageFileInputRef}
                                onChange={handleImageFileSelect}
                                className="hidden" 
                                accept="image/png, image/jpeg, image/gif, image/webp"
                            />
                            <button 
                                type="button" 
                                onClick={() => imageFileInputRef.current?.click()}
                                disabled={isUploadingImage}
                                className="bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors text-sm disabled:opacity-50"
                            >
                                {isUploadingImage ? 'Enviando...' : 'Fazer Upload'}
                            </button>
                            <p className="text-xs text-gray-500 mt-2">ou cole a URL abaixo</p>
                             <input id="imageUrl" name="imageUrl" value={course.imageUrl || ''} onChange={handleChange} placeholder="https://..." className={`${inputClasses} mt-2`} />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="instructorId" className={labelClasses}>Instrutor(a)</label>
                        <select id="instructorId" name="instructorId" value={course.instructorId} onChange={handleChange} className={inputClasses} disabled={user.role === 'instructor'}>
                            {instructors.map(inst => (
                                <option key={inst.id} value={inst.id}>{inst.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="duration" className={labelClasses}>Duração Estimada</label>
                        <input id="duration" name="duration" value={course.duration} onChange={handleChange} placeholder="Ex: 20 horas" className={inputClasses}/>
                    </div>
                    <div>
                        <label htmlFor="track" className={labelClasses}>Trilha</label>
                        <select id="track" name="track" value={course.track} onChange={handleChange} className={inputClasses}>
                            <option>Frontend</option><option>Backend</option><option>IA</option><option>UX/UI</option><option>Games</option><option>Idiomas</option><option>Negócios</option><option>Digital</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="skillLevel" className={labelClasses}>Nível de Dificuldade</label>
                        <select id="skillLevel" name="skillLevel" value={course.skillLevel} onChange={handleChange} className={inputClasses}>
                            <option>Iniciante</option><option>Intermediário</option><option>Avançado</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="format" className={labelClasses}>Formato do Curso</label>
                        <select id="format" name="format" value={course.format} onChange={handleChange} className={inputClasses}>
                            <option value="online">Online</option>
                            <option value="presencial">Presencial</option>
                            <option value="hibrido">Híbrido</option>
                        </select>
                    </div>
                </div>
                 <div className="mt-8 border-t border-white/10 pt-6 space-y-6">
                    <h3 className="text-xl font-bold text-white">Estúdio de Projeto Final</h3>
                    <div>
                        <label htmlFor="projectTitle" className={labelClasses}>Título do Projeto Final</label>
                        <input id="projectTitle" name="projectTitle" value={course.projectTitle || ''} onChange={handleChange} placeholder="Ex: Construindo uma Pokédex com React" className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="projectDescription" className={labelClasses}>Descrição completa do projeto</label>
                        <textarea id="projectDescription" name="projectDescription" value={course.projectDescription || ''} onChange={handleChange} placeholder="Detalhe o que os alunos irão construir, as funcionalidades, etc." className={inputClasses} rows={5}/>
                    </div>
                    <div>
                        <label htmlFor="projectCriteria" className={labelClasses}>Critérios de Avaliação</label>
                        <textarea id="projectCriteria" name="projectCriteria" value={course.projectCriteria || ''} onChange={handleChange} placeholder="Liste os critérios para a conclusão do projeto (um por linha)." className={inputClasses} rows={5}/>
                    </div>
                </div>
            </div>
        );
    }
    if (selectedItem.type === 'module') {
        const module = course.modules[selectedItem.moduleIndex];
        return (
             <div>
                <h3 className="text-xl font-bold text-white">Editando Módulo {selectedItem.moduleIndex + 1}</h3>
                <div className="mt-4">
                    <label htmlFor="moduleTitle" className={labelClasses}>Título do Módulo</label>
                    <input 
                        id="moduleTitle"
                        value={module.title} 
                        onChange={e => handleModuleChange(selectedItem.moduleIndex, 'title', e.target.value)} 
                        placeholder="Ex: Fundamentos do CSS"
                        className={inputClasses}
                    />
                </div>
            </div>
        )
    }
    if (selectedItem.type === 'lesson') {
        const { moduleIndex, lessonIndex } = selectedItem;
        const lesson = course.modules[moduleIndex].lessons[lessonIndex];
        
        const assistantButtonText = {
            create: 'Gerar Conteúdo',
            create_code: 'Gerar Código',
            improve: 'Melhorar Texto',
            summarize: 'Resumir'
        };
        const assistantPlaceholderText = {
            create: 'Ex: O que são arrays em javascript',
            create_code: 'Ex: um loop for em python',
            improve: 'Selecione um texto para melhorar',
            summarize: 'Selecione um texto para resumir'
        };

        return (
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Editando Aula: {lesson.title}</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="lessonTitle" className={labelClasses}>Título da Aula</label>
                        <input id="lessonTitle" value={lesson.title} onChange={e => handleLessonChange(moduleIndex, lessonIndex, 'title', e.target.value)} placeholder="Ex: O que é Flexbox?" className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="lessonDuration" className={labelClasses}>Duração</label>
                        <input id="lessonDuration" value={lesson.duration} onChange={e => handleLessonChange(moduleIndex, lessonIndex, 'duration', e.target.value)} placeholder="Ex: 15 min" className={inputClasses} />
                    </div>
                </div>

                <div className="p-4 bg-black/30 rounded-lg border border-[#8a4add]/20 space-y-3">
                     <label className="block text-sm font-bold text-[#c4b5fd]">✨ Assistente de Conteúdo IA</label>
                     <div className="grid grid-cols-3 gap-2">
                        <select value={aiAction} onChange={e => setAiAction(e.target.value as AiAction)} className={`${inputClasses} col-span-1`}>
                            <option value="create">Criar conteúdo</option>
                            <option value="create_code">Criar código</option>
                            <option value="improve">Melhorar texto</option>
                            <option value="summarize">Resumir</option>
                        </select>
                        <input
                            value={aiCommand}
                            onChange={(e) => setAiCommand(e.target.value)}
                            placeholder={assistantPlaceholderText[aiAction]}
                            className={`${inputClasses} col-span-2`}
                            disabled={aiAction === 'improve' || aiAction === 'summarize'}
                        />
                     </div>
                      <button 
                        type="button" 
                        onClick={handleAiAssistantAction}
                        disabled={isAiAssistantLoading} 
                        className="w-full flex items-center justify-center gap-2 font-semibold text-white py-2 px-4 rounded-lg bg-[#8a4add] hover:bg-[#6d28d9] transition-colors disabled:opacity-50"
                      >
                        {isAiAssistantLoading ? 'Processando...' : assistantButtonText[aiAction]}
                      </button>
                      <p className="text-xs text-gray-500 text-center">A IA irá inserir o conteúdo na posição do cursor ou substituir o texto selecionado.</p>
                </div>

                <RichContentEditor label="Objetivo da Aula" value={lesson.objective || ''} onChange={v => handleLessonChange(moduleIndex, lessonIndex, 'objective', v)} textareaRef={objectiveRef}/>
                
                <RichContentEditor 
                    label="Conteúdo Principal"
                    value={lesson.mainContent || ''} 
                    onChange={v => handleLessonChange(moduleIndex, lessonIndex, 'mainContent', v)} 
                    textareaRef={mainContentRef} 
                />

                <RichContentEditor label="Material Complementar" value={lesson.complementaryMaterial || ''} onChange={v => handleLessonChange(moduleIndex, lessonIndex, 'complementaryMaterial', v)} textareaRef={complementaryMaterialRef}/>
                <RichContentEditor label="Resumo e Próximos Passos" value={lesson.summary || ''} onChange={v => handleLessonChange(moduleIndex, lessonIndex, 'summary', v)} textareaRef={summaryRef}/>
            </div>
        )
    }
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-4xl font-black text-white">{initialCourse.title ? 'Editor de Curso' : 'Criador de Curso'}</h1>
                <p className="text-gray-400 mt-1">Construa experiências de aprendizado incríveis.</p>
            </div>
            <div className="flex gap-4">
                <button type="button" onClick={onCancel} className="bg-white/10 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-white/20 transition-colors">
                    Cancelar
                </button>
                <button type="submit" className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40">
                    Salvar Curso
                </button>
            </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left Panel: Structure */}
          <div className="lg:col-span-1 p-6 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 space-y-4 sticky top-24">
              <h2 className="text-lg font-bold text-white">Estrutura do Curso</h2>
              <div className="p-4 bg-black/30 rounded-lg border-[#8a4add]/20 space-y-2">
                  <label htmlFor="ai-topic" className="block text-sm font-bold text-[#c4b5fd]">
                      ✨ Acelere com IA
                  </label>
                  <input
                      id="ai-topic"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="Ex: Curso de CSS Grid"
                      className="w-full p-2 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm"
                  />
                  <button type="button" onClick={handleGenerateStructure} disabled={!aiTopic || isGeneratingStructure} className="w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-[#8a4add] text-white hover:bg-[#6d28d9] transition-colors disabled:opacity-50">
                      {isGeneratingStructure ? 'Gerando...' : 'Gerar Estrutura'}
                  </button>
              </div>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                <button type="button" onClick={() => setSelectedItem({type: 'course'})} className={`w-full text-left p-2 rounded-md transition-colors text-sm font-semibold ${selectedItem.type === 'course' ? 'bg-[#8a4add]/20 text-white' : 'text-gray-300 hover:bg-white/10'}`}>
                    Informações Gerais
                </button>
                {course.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="bg-white/5 p-2 rounded">
                        <div className="flex justify-between items-center">
                            <button type="button" onClick={() => setSelectedItem({type: 'module', moduleIndex})} className={`flex-grow text-left p-2 rounded-md transition-colors text-sm font-semibold ${selectedItem.type === 'module' && selectedItem.moduleIndex === moduleIndex ? 'bg-[#8a4add]/20 text-white' : 'text-gray-300 hover:bg-white/10'}`}>
                                Módulo {moduleIndex + 1}: {module.title}
                            </button>
                            <button type="button" onClick={() => removeModule(moduleIndex)} className="text-red-400 hover:text-red-300 text-xs px-2">&times;</button>
                        </div>
                        <div className="pl-4 mt-1 space-y-1">
                            {module.lessons.map((lesson, lessonIndex) => (
                               <div key={lesson.id} className="flex justify-between items-center group">
                                <button type="button" onClick={() => setSelectedItem({type: 'lesson', moduleIndex, lessonIndex})} className={`flex-grow text-left p-2 rounded-md transition-colors text-xs ${selectedItem.type === 'lesson' && selectedItem.moduleIndex === moduleIndex && selectedItem.lessonIndex === lessonIndex ? 'bg-[#8a4add]/20 text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                                   {lesson.title}
                                </button>
                                <button type="button" onClick={() => removeLesson(moduleIndex, lessonIndex)} className="text-red-400 hover:text-red-300 text-xs px-2 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                               </div>
                            ))}
                            <button type="button" onClick={() => addLesson(moduleIndex)} className="text-xs font-semibold text-[#c4b5fd] hover:text-white p-2">+ Adicionar Aula</button>
                        </div>
                    </div>
                ))}
                 <button type="button" onClick={addModule} className="w-full text-sm font-semibold py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    + Adicionar Módulo
                </button>
              </div>
          </div>
          
          {/* Right Panel: Editor */}
          <div className="lg:col-span-2 p-8 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10">
              {renderEditPanel()}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseEditor;
