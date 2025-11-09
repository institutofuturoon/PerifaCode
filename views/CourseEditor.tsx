import React, { useState, useRef } from 'react';
import { Course, Module, Lesson } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../App';
import RichContentEditor from '../components/RichContentEditor';

interface CourseEditorProps {
  course: Course;
}

type SelectedItem = 
  | { type: 'course' }
  | { type: 'module'; moduleIndex: number }
  | { type: 'lesson'; moduleIndex: number; lessonIndex: number };

const CourseEditor: React.FC<CourseEditorProps> = ({ course: initialCourse }) => {
  const { user, instructors, handleSaveCourse, navigate } = useAppContext();
  const [course, setCourse] = useState<Course>(initialCourse);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({ type: 'course' });
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingStructure, setIsGeneratingStructure] = useState(false);
  const [isSuggestingMaterials, setIsSuggestingMaterials] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  
  const mainContentRef = useRef<HTMLTextAreaElement>(null);
  const complementaryRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const objectiveRef = useRef<HTMLTextAreaElement>(null);

  const onCancel = () => navigate('admin');

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
  
  const handleGenerateContent = async (moduleIndex: number, lessonIndex: number) => {
    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    if (!lesson.title || !lesson.objective) {
        alert("Para gerar conteúdo, a aula precisa ter um título e um objetivo definidos.");
        return;
    }
    setIsGeneratingContent(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Você é um designer instrucional sênior da FuturoOn. Sua missão é criar conteúdo didático e acessível para jovens da periferia que estão aprendendo tecnologia.

TAREFA: Gere o "Conteúdo Principal" para uma aula, usando Markdown para formatação (títulos com ##, negrito com **, listas com -, blocos de código com \`\`\`).

CURSO: ${course.title}
TÍTULO DA AULA: ${lesson.title}
OBJETIVO DA AULA: ${lesson.objective}

Baseado nessas informações, escreva o conteúdo. O tom deve ser encorajador e direto. Retorne APENAS o texto em Markdown.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const generatedText = response.text;
        if (!generatedText) {
          throw new Error("A IA retornou uma resposta vazia.");
        }
        handleLessonChange(moduleIndex, lessonIndex, 'mainContent', generatedText);

    } catch (error) {
        console.error("Erro ao gerar conteúdo com IA:", error);
        alert("Não foi possível gerar o conteúdo. Tente novamente.");
    } finally {
        setIsGeneratingContent(false);
    }
  };

  const handleSuggestMaterials = async (moduleIndex: number, lessonIndex: number) => {
    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    if (!lesson.title || !lesson.mainContent) {
      alert("Para sugerir materiais, a aula precisa ter um título e conteúdo principal.");
      return;
    }
    setIsSuggestingMaterials(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Aja como um curador de conteúdo para a FuturoOn.
Baseado no título da aula "${lesson.title}" e no conteúdo:
---
${lesson.mainContent}
---
Sugira 3 a 5 recursos externos (artigos de blog, vídeos do YouTube, documentação oficial) que sejam relevantes e de alta qualidade para aprofundar o aprendizado.
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
                          url: { type: Type.STRING },
                          type: { type: Type.STRING, enum: ['Artigo', 'Vídeo', 'Documentação'] }
                      },
                      required: ["title", "url", "type"]
                  }
              }
          }
      });

      const suggestions = JSON.parse(response.text);
      const markdownSuggestions = suggestions.map((s: any) => `- **[${s.type}] ${s.title}:** [Acessar aqui](${s.url})`).join('\n');
      const updatedMaterial = lesson.complementaryMaterial ? `${lesson.complementaryMaterial}\n\n${markdownSuggestions}` : markdownSuggestions;
      handleLessonChange(moduleIndex, lessonIndex, 'complementaryMaterial', updatedMaterial);

    } catch (error) {
        console.error("Erro ao sugerir materiais:", error);
        alert("Não foi possível sugerir materiais. Tente novamente.");
    } finally {
        setIsSuggestingMaterials(false);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveCourse(course);
  };
  
  const renderEditPanel = () => {
    const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors sm:text-sm";
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
                        <label htmlFor="imageUrl" className={labelClasses}>URL da Imagem de Capa</label>
                        <input id="imageUrl" name="imageUrl" value={course.imageUrl} onChange={handleChange} placeholder="https://..." className={inputClasses}/>
                    </div>
                    <div>
                        <label htmlFor="duration" className={labelClasses}>Duração Estimada</label>
                        <input id="duration" name="duration" value={course.duration} onChange={handleChange} placeholder="Ex: 20 horas" className={inputClasses}/>
                    </div>
                    <div>
                        <label htmlFor="track" className={labelClasses}>Trilha</label>
                        <select id="track" name="track" value={course.track} onChange={handleChange} className={inputClasses}>
                            <option>Frontend</option><option>Backend</option><option>IA</option><option>UX/UI</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="skillLevel" className={labelClasses}>Nível de Dificuldade</label>
                        <select id="skillLevel" name="skillLevel" value={course.skillLevel} onChange={handleChange} className={inputClasses}>
                            <option>Iniciante</option><option>Intermediário</option><option>Avançado</option>
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
                <RichContentEditor label="Objetivo da Aula" value={lesson.objective || ''} onChange={v => handleLessonChange(moduleIndex, lessonIndex, 'objective', v)} textareaRef={objectiveRef} />
                
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className={labelClasses}>Conteúdo Principal</label>
                        <button 
                            type="button" 
                            onClick={() => handleGenerateContent(moduleIndex, lessonIndex)} 
                            disabled={isGeneratingContent} 
                            className="flex items-center gap-2 font-semibold text-blue-300 hover:text-blue-200 text-sm py-2 px-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                        >
                            {isGeneratingContent ? 'Gerando...' : '✨ Gerar com IA'}
                        </button>
                    </div>
                    <RichContentEditor 
                        value={lesson.mainContent || ''} 
                        onChange={v => handleLessonChange(moduleIndex, lessonIndex, 'mainContent', v)} 
                        textareaRef={mainContentRef} 
                    />
                </div>

                <div>
                  <RichContentEditor label="Material Complementar" value={lesson.complementaryMaterial || ''} onChange={v => handleLessonChange(moduleIndex, lessonIndex, 'complementaryMaterial', v)} textareaRef={complementaryRef} />
                  <div className="flex justify-end mt-2">
                    <button type="button" onClick={() => handleSuggestMaterials(moduleIndex, lessonIndex)} disabled={isSuggestingMaterials} className="flex items-center gap-2 font-semibold text-blue-300 hover:text-blue-200 text-sm py-2 px-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors disabled:opacity-50">
                       {isSuggestingMaterials ? 'Sugerindo...' : '✨ Sugerir com IA'}
                    </button>
                  </div>
                </div>
                <RichContentEditor label="Resumo e Próximos Passos" value={lesson.summary || ''} onChange={v => handleLessonChange(moduleIndex, lessonIndex, 'summary', v)} textareaRef={summaryRef} />
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
                <button type="submit" className="bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                    Salvar Curso
                </button>
            </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left Panel: Structure */}
          <div className="lg:col-span-1 p-6 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 space-y-4 sticky top-24">
              <h2 className="text-lg font-bold text-white">Estrutura do Curso</h2>
              <div className="p-4 bg-black/30 rounded-lg border border-blue-500/20 space-y-2">
                  <label htmlFor="ai-topic" className="block text-sm font-bold text-blue-300">
                      ✨ Acelere com IA
                  </label>
                  <input
                      id="ai-topic"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="Ex: Curso de CSS Grid"
                      className="w-full p-2 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors sm:text-sm"
                  />
                  <button type="button" onClick={handleGenerateStructure} disabled={!aiTopic || isGeneratingStructure} className="w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50">
                      {isGeneratingStructure ? 'Gerando...' : 'Gerar Estrutura'}
                  </button>
              </div>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                <button type="button" onClick={() => setSelectedItem({type: 'course'})} className={`w-full text-left p-2 rounded-md transition-colors text-sm font-semibold ${selectedItem.type === 'course' ? 'bg-blue-500/20 text-white' : 'text-gray-300 hover:bg-white/10'}`}>
                    Informações Gerais
                </button>
                {course.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="bg-white/5 p-2 rounded">
                        <div className="flex justify-between items-center">
                            <button type="button" onClick={() => setSelectedItem({type: 'module', moduleIndex})} className={`flex-grow text-left p-2 rounded-md transition-colors text-sm font-semibold ${selectedItem.type === 'module' && selectedItem.moduleIndex === moduleIndex ? 'bg-blue-500/20 text-white' : 'text-gray-300 hover:bg-white/10'}`}>
                                Módulo {moduleIndex + 1}: {module.title}
                            </button>
                            <button type="button" onClick={() => removeModule(moduleIndex)} className="text-red-400 hover:text-red-300 text-xs px-2">&times;</button>
                        </div>
                        <div className="pl-4 mt-1 space-y-1">
                            {module.lessons.map((lesson, lessonIndex) => (
                               <button key={lesson.id} type="button" onClick={() => setSelectedItem({type: 'lesson', moduleIndex, lessonIndex})} className={`w-full text-left p-2 rounded-md transition-colors text-xs ${selectedItem.type === 'lesson' && selectedItem.moduleIndex === moduleIndex && selectedItem.lessonIndex === lessonIndex ? 'bg-blue-500/20 text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                                   {lesson.title}
                               </button>
                            ))}
                            <button type="button" onClick={() => addLesson(moduleIndex)} className="text-xs font-semibold text-blue-400 hover:text-blue-300 p-2">+ Adicionar Aula</button>
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