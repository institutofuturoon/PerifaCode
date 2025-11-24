
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, Module, Lesson, CourseBenefit, CurriculumItem } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../App';
import RichContentEditor from '../components/RichContentEditor';
import Uploader from '../components/Uploader';

type SelectedItem = 
  | { type: 'course' }
  | { type: 'module'; moduleIndex: number }
  | { type: 'lesson'; moduleIndex: number; lessonIndex: number };

const stringToSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

const CourseEditor: React.FC = () => {
  const { user, instructors, courses, tracks, handleSaveCourse, showToast } = useAppContext();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // Storage Key for Auto-Save
  const DRAFT_KEY = `draft_course_${courseId || 'new'}`;

  const getNewCourseTemplate = useMemo(() => ({
    id: `course_${Date.now()}`,
    title: '', slug: '', description: '', longDescription: '',
    track: tracks[0]?.name || '', imageUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    duration: '',
    skillLevel: 'Iniciante' as Course['skillLevel'], instructorId: user?.id || '',
    modules: [],
    format: 'online' as Course['format'],
    enrollmentStatus: 'soon' as Course['enrollmentStatus'],
    seo: { metaTitle: '', metaDescription: '', keywords: [] },
    // Initialize landing page sections
    heroContent: { subtitle: '', titleLine1: '', titleAccent: '', description: '' },
    benefitsSection: { title: '', subtitle: '', benefits: [] },
    curriculumSection: { title: '', subtitle: '', items: [] },
    methodologySection: { title: '', subtitle: '', benefits: [] },
    ctaSection: { title: '', description: '' }
  }), [user, tracks]);

  const existingCourse = useMemo(() => {
    if (courseId && courseId !== 'new') {
        return courses.find(c => c.id === courseId);
    }
    return undefined;
  }, [courseId, courses]);
  
  const [course, setCourse] = useState<Course>(existingCourse || getNewCourseTemplate);
  
  // Auto-Save State
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [draftFound, setDraftFound] = useState<Course | null>(null);

  // Initial Load Effect
  useEffect(() => {
    if (existingCourse) {
      setCourse({ ...existingCourse, seo: existingCourse.seo || { metaTitle: '', metaDescription: '', keywords: [] } });
    } else if (courseId === 'new') {
      setCourse(getNewCourseTemplate);
    }
  }, [existingCourse, courseId, getNewCourseTemplate]);

  // Check for existing draft on mount
  useEffect(() => {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
          try {
              const parsedDraft = JSON.parse(savedDraft);
              // Check if draft is different from current loaded data to avoid unnecessary alerts
              if (JSON.stringify(parsedDraft) !== JSON.stringify(course)) {
                  setDraftFound(parsedDraft);
              }
          } catch (e) {
              console.error("Erro ao ler rascunho:", e);
          }
      }
  }, [DRAFT_KEY]); // Run once on key change (mount)

  // Auto-Save Effect (Debounced)
  useEffect(() => {
      const timer = setTimeout(() => {
          // Don't save if it matches the DB version exactly or is empty initially
          if (JSON.stringify(course) !== JSON.stringify(existingCourse || getNewCourseTemplate)) {
              localStorage.setItem(DRAFT_KEY, JSON.stringify(course));
              setLastAutoSave(new Date());
          }
      }, 2000); // Save after 2 seconds of inactivity

      return () => clearTimeout(timer);
  }, [course, DRAFT_KEY, existingCourse, getNewCourseTemplate]);

  const handleRestoreDraft = () => {
      if (draftFound) {
          setCourse(draftFound);
          setDraftFound(null);
          showToast("📂 Rascunho restaurado com sucesso!");
      }
  };

  const handleDiscardDraft = () => {
      localStorage.removeItem(DRAFT_KEY);
      setDraftFound(null);
      showToast("🗑️ Rascunho descartado.");
  };

  
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({ type: 'course' });
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingStructure, setIsGeneratingStructure] = useState(false);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  
  // AI Loading States for Landing Page Sections
  const [isGeneratingHero, setIsGeneratingHero] = useState(false);
  const [isGeneratingBenefits, setIsGeneratingBenefits] = useState(false);
  const [isGeneratingCurriculum, setIsGeneratingCurriculum] = useState(false);
  const [isGeneratingMethodology, setIsGeneratingMethodology] = useState(false);
  const [isGeneratingCta, setIsGeneratingCta] = useState(false);

  // Handlers
  const onCancel = () => navigate('/admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prev => {
        const updates: any = { [name]: value };
        // Auto-generate slug from title if it's a new course or slug is empty
        if (name === 'title' && (!prev.slug || courseId === 'new')) {
            updates.slug = stringToSlug(value);
        }
        return { ...prev, ...updates };
    });
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLInputElement>, moduleIndex: number) => {
    const { name, value } = e.target;
    setCourse(prev => {
        const newModules = [...prev.modules];
        newModules[moduleIndex] = { ...newModules[moduleIndex], [name]: value };
        return { ...prev, modules: newModules };
    });
  };
  
  const handleLessonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, moduleIndex: number, lessonIndex: number) => {
      const { name, value } = e.target;
      setCourse(prev => {
          const newModules = [...prev.modules];
          const newLessons = [...newModules[moduleIndex].lessons];
          newLessons[lessonIndex] = { ...newLessons[lessonIndex], [name]: value };
          newModules[moduleIndex].lessons = newLessons;
          return { ...prev, modules: newModules };
      });
  };
  
  const handleLessonContentChange = (content: string, field: 'objective' | 'mainContent' | 'summary', moduleIndex: number, lessonIndex: number) => {
      setCourse(prev => {
          const newModules = [...prev.modules];
          const newLessons = [...newModules[moduleIndex].lessons];
          newLessons[lessonIndex] = { ...newLessons[lessonIndex], [field]: content };
          newModules[moduleIndex].lessons = newLessons;
          return { ...prev, modules: newModules };
      });
  };

    const handleLandingPageChange = (section: keyof Course, field: string, value: string) => {
        setCourse(prev => ({
            ...prev,
            [section]: {
                // @ts-ignore
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSeoChange = (field: string, value: string) => {
        setCourse(prev => ({
            ...prev,
            seo: {
                ...prev.seo,
                [field]: field === 'keywords' ? value.split(',').map(s => s.trim()) : value
            }
        }));
    };

    const handleBenefitChange = (section: 'benefitsSection' | 'methodologySection', index: number, field: keyof CourseBenefit, value: string) => {
        setCourse(prev => {
            const newSection = { ...prev[section] };
            // @ts-ignore
            newSection.benefits[index][field] = value;
            return { ...prev, [section]: newSection };
        });
    };

    const addBenefit = (section: 'benefitsSection' | 'methodologySection') => {
        setCourse(prev => {
            const newSection = { ...prev[section] };
            // @ts-ignore
            newSection.benefits.push({ title: '', description: '' });
            return { ...prev, [section]: newSection };
        });
    };

    const deleteBenefit = (section: 'benefitsSection' | 'methodologySection', index: number) => {
        setCourse(prev => {
            const newSection = { ...prev[section] };
            // @ts-ignore
            newSection.benefits.splice(index, 1);
            return { ...prev, [section]: newSection };
        });
    };
    
    const handleCurriculumItemChange = (index: number, field: keyof CurriculumItem, value: string) => {
        setCourse(prev => {
            const newSection = { ...prev.curriculumSection };
            // @ts-ignore
            newSection.items[index][field] = value;
            return { ...prev, curriculumSection: newSection };
        });
    };

    const addCurriculumItem = () => {
        setCourse(prev => {
            const newSection = { ...prev.curriculumSection };
            // @ts-ignore
            newSection.items.push({ title: '', description: '' });
            return { ...prev, curriculumSection: newSection };
        });
    };

    const deleteCurriculumItem = (index: number) => {
        setCourse(prev => {
            const newSection = { ...prev.curriculumSection };
            // @ts-ignore
            newSection.items.splice(index, 1);
            return { ...prev, curriculumSection: newSection };
        });
    };

  const addModule = () => {
    const newModule: Module = { id: `mod_${Date.now()}`, title: 'Novo Módulo', lessons: [] };
    setCourse(prev => ({ ...prev, modules: [...prev.modules, newModule] }));
    setSelectedItem({ type: 'module', moduleIndex: course.modules.length });
  };
  
  const deleteModule = (moduleIndex: number) => {
    if (window.confirm("Tem certeza que quer excluir este módulo e todas as suas aulas?")) {
        setCourse(prev => ({ ...prev, modules: prev.modules.filter((_, i) => i !== moduleIndex) }));
        setSelectedItem({ type: 'course' });
    }
  };

  const addLesson = (moduleIndex: number) => {
      const newLesson: Lesson = { id: `les_${Date.now()}`, title: 'Nova Aula', duration: '10 min', type: 'text', xp: 10 };
      setCourse(prev => {
          const newModules = [...prev.modules];
          newModules[moduleIndex].lessons = [...newModules[moduleIndex].lessons, newLesson];
          return { ...prev, modules: newModules };
      });
      setSelectedItem({ type: 'lesson', moduleIndex, lessonIndex: course.modules[moduleIndex].lessons.length });
  };
  
  const deleteLesson = (moduleIndex: number, lessonIndex: number) => {
      setCourse(prev => {
          const newModules = [...prev.modules];
          newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
          return { ...prev, modules: newModules };
      });
      setSelectedItem({ type: 'module', moduleIndex });
  };


  const handleGenerateStructureWithAI = async () => {
      if (!aiTopic.trim()) {
          showToast("Digite um tópico para o curso.");
          return;
      }
      setIsGeneratingStructure(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const prompt = `Você é um designer instrucional sênior. Crie uma estrutura de curso para "${aiTopic}". O público são jovens da periferia iniciando em tecnologia. A estrutura deve ser clara, motivadora e prática. Retorne um objeto JSON com uma chave "modules", que é um array. Cada objeto no array deve ter "title" (string, nome do módulo) e "lessons" (array de objetos, onde cada objeto tem "title" (string, nome da aula), "duration" (string, ex: "15 min") e "xp" (number, entre 10 e 50)).`;

          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          modules: {
                              type: Type.ARRAY,
                              items: {
                                  type: Type.OBJECT,
                                  properties: {
                                      title: { type: Type.STRING },
                                      lessons: {
                                          type: Type.ARRAY,
                                          items: {
                                              type: Type.OBJECT,
                                              properties: {
                                                  title: { type: Type.STRING },
                                                  duration: { type: Type.STRING },
                                                  xp: { type: Type.INTEGER }
                                              },
                                              required: ["title", "duration", "xp"]
                                          }
                                      }
                                  },
                                  required: ["title", "lessons"]
                              }
                          }
                      },
                      required: ["modules"]
                  }
              }
          });

          const result = JSON.parse(response.text);
          const newModules = result.modules.map((mod: any) => ({
              ...mod,
              id: `mod_${Date.now()}_${Math.random()}`,
              lessons: mod.lessons.map((les: any) => ({
                  ...les,
                  id: `les_${Date.now()}_${Math.random()}`,
                  type: 'text'
              }))
          }));

          setCourse(prev => {
              const newTitle = prev.title || aiTopic;
              return {
                  ...prev, 
                  modules: newModules, 
                  title: newTitle,
                  slug: prev.slug || stringToSlug(newTitle)
              }
          });
          showToast("✅ Estrutura do curso gerada!");

      } catch (error) {
          console.error("Erro ao gerar estrutura com IA:", error);
          showToast("❌ Erro ao gerar estrutura. Tente novamente.");
      } finally {
          setIsGeneratingStructure(false);
      }
  };
  
  const handleGenerateSeo = async () => {
      if (!course.title || !course.description) {
          showToast("Preencha o título e a descrição do curso antes de gerar o SEO.");
          return;
      }
      setIsGeneratingSeo(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const courseContext = `Título: ${course.title}\nDescrição: ${course.description}\nEmenta: ${course.modules.map(m => m.title).join(', ')}`;
          const prompt = `Atue como um especialista em SEO. Gere meta title, meta description e keywords otimizadas para a página deste curso da FuturoOn. O público alvo são jovens da periferia buscando carreira em tecnologia.
          
          Conteúdo do Curso:
          ${courseContext}
          
          Retorne apenas o JSON.`;

          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          metaTitle: { type: Type.STRING, description: "Máximo 60 caracteres, atraente" },
                          metaDescription: { type: Type.STRING, description: "Máximo 160 caracteres, persuasivo" },
                          keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["metaTitle", "metaDescription", "keywords"]
                  }
              }
          });

          const result = JSON.parse(response.text);
          setCourse(prev => ({
              ...prev,
              seo: {
                  metaTitle: result.metaTitle,
                  metaDescription: result.metaDescription,
                  keywords: result.keywords
              }
          }));
          showToast("✨ SEO gerado com sucesso!");

      } catch (error) {
          console.error("Erro ao gerar SEO:", error);
          showToast("❌ Erro ao gerar sugestões de SEO.");
      } finally {
          setIsGeneratingSeo(false);
      }
  };

  // --- AI Handlers for Landing Page Sections ---

  const generateSectionCommon = async (prompt: string, schema: any, setLoading: (l: boolean) => void, onSuccess: (result: any) => void) => {
      if (!course.title) {
          showToast("⚠️ Preencha o Título do Curso primeiro para dar contexto à IA.");
          return;
      }
      setLoading(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const fullPrompt = `Curso: "${course.title}".
          Descrição Breve: "${course.description}".
          Público: Jovens da periferia, linguagem acessível e moderna (estilo Rocketseat).
          
          ${prompt}`;

          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: fullPrompt,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: schema
              }
          });
          
          const result = JSON.parse(response.text);
          onSuccess(result);
          showToast("✨ Conteúdo gerado com sucesso!");
      } catch (error) {
          console.error("Erro na geração IA:", error);
          showToast("❌ Erro ao gerar conteúdo.");
      } finally {
          setLoading(false);
      }
  };

  const handleGenerateHeroWithAI = () => {
      const prompt = "Gere o conteúdo para a seção Hero (Topo) da Landing Page. Precisa ser impactante e convidativo.";
      const schema = {
          type: Type.OBJECT,
          properties: {
              subtitle: { type: Type.STRING, description: "Ex: Formação Completa" },
              titleLine1: { type: Type.STRING, description: "Primeira linha do título principal" },
              titleAccent: { type: Type.STRING, description: "Palavras destacadas no título (cor diferente)" },
              description: { type: Type.STRING, description: "Parágrafo curto de venda do curso" }
          },
          required: ["subtitle", "titleLine1", "titleAccent", "description"]
      };
      generateSectionCommon(prompt, schema, setIsGeneratingHero, (res) => {
          setCourse(prev => ({ ...prev, heroContent: res }));
      });
  };

  const handleGenerateBenefitsWithAI = () => {
      const prompt = "Liste 4 benefícios principais de fazer este curso. Foco em carreira e aprendizado prático.";
      const schema = {
          type: Type.OBJECT,
          properties: {
              title: { type: Type.STRING, description: "Título da seção (Ex: Por que aprender isso?)" },
              subtitle: { type: Type.STRING, description: "Subtítulo curto" },
              benefits: {
                  type: Type.ARRAY,
                  items: {
                      type: Type.OBJECT,
                      properties: {
                          title: { type: Type.STRING },
                          description: { type: Type.STRING }
                      },
                      required: ["title", "description"]
                  }
              }
          },
          required: ["title", "subtitle", "benefits"]
      };
      generateSectionCommon(prompt, schema, setIsGeneratingBenefits, (res) => {
          setCourse(prev => ({ ...prev, benefitsSection: res }));
      });
  };

  const handleGenerateCurriculumWithAI = () => {
      const prompt = "Crie um resumo do currículo em 4 pontos principais (tópicos macro).";
      const schema = {
          type: Type.OBJECT,
          properties: {
              title: { type: Type.STRING, description: "Título da seção (Ex: O que você vai aprender)" },
              subtitle: { type: Type.STRING },
              items: {
                  type: Type.ARRAY,
                  items: {
                      type: Type.OBJECT,
                      properties: {
                          title: { type: Type.STRING },
                          description: { type: Type.STRING }
                      },
                      required: ["title", "description"]
                  }
              }
          },
          required: ["title", "subtitle", "items"]
      };
      generateSectionCommon(prompt, schema, setIsGeneratingCurriculum, (res) => {
          setCourse(prev => ({ ...prev, curriculumSection: res }));
      });
  };

  const handleGenerateMethodologyWithAI = () => {
      const prompt = "Descreva a metodologia de ensino (foco em prática, projetos reais, mentoria). Crie 3 pontos.";
      const schema = {
          type: Type.OBJECT,
          properties: {
              title: { type: Type.STRING, description: "Título da seção (Ex: Como ensinamos)" },
              subtitle: { type: Type.STRING },
              benefits: {
                  type: Type.ARRAY,
                  items: {
                      type: Type.OBJECT,
                      properties: {
                          title: { type: Type.STRING },
                          description: { type: Type.STRING }
                      },
                      required: ["title", "description"]
                  }
              }
          },
          required: ["title", "subtitle", "benefits"]
      };
      generateSectionCommon(prompt, schema, setIsGeneratingMethodology, (res) => {
          setCourse(prev => ({ ...prev, methodologySection: res }));
      });
  };

  const handleGenerateCtaWithAI = () => {
      const prompt = "Crie uma chamada para ação (CTA) final forte e motivadora para inscrição.";
      const schema = {
          type: Type.OBJECT,
          properties: {
              title: { type: Type.STRING, description: "Título chamativo (Ex: Comece sua jornada)" },
              description: { type: Type.STRING, description: "Texto de apoio curto" }
          },
          required: ["title", "description"]
      };
      generateSectionCommon(prompt, schema, setIsGeneratingCta, (res) => {
          setCourse(prev => ({ ...prev, ctaSection: res }));
      });
  };


  const handleImageUploadComplete = (url: string) => {
    setCourse(prev => ({...prev, imageUrl: url}));
    showToast('✅ Imagem do curso salva!');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveCourse(course);
    // Clean up draft after successful save
    localStorage.removeItem(DRAFT_KEY);
    navigate('/admin');
  };
  
  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";
  
  const AiButton: React.FC<{ onClick: () => void; isLoading: boolean; label?: string }> = ({ onClick, isLoading, label = "Gerar com IA" }) => (
      <button 
          type="button" 
          onClick={onClick}
          disabled={isLoading}
          className="flex items-center gap-2 text-xs font-bold bg-[#8a4add]/20 text-[#c4b5fd] px-3 py-1.5 rounded-full hover:bg-[#8a4add]/30 disabled:opacity-50 transition-colors ml-auto"
      >
          {isLoading ? (
              <><svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Gerando...</>
          ) : (
              <>✨ {label}</>
          )}
      </button>
  );

  const renderCourseForm = () => (
    <div className="space-y-6">
        <details open className="bg-black/20 p-4 rounded-lg border border-white/10">
            <summary className="font-semibold text-white cursor-pointer">Informações Básicas</summary>
            <div className="mt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label htmlFor="title" className={labelClasses}>Título do Curso</label><input type="text" name="title" id="title" value={course.title} onChange={handleChange} required className={inputClasses} /></div>
                    <div><label htmlFor="slug" className={labelClasses}>Slug (URL Amigável)</label><input type="text" name="slug" id="slug" value={course.slug || ''} onChange={handleChange} placeholder="ex: curso-de-python-avancado" className={inputClasses} /></div>
                </div>
                <div><label htmlFor="description" className={labelClasses}>Descrição Curta (para cards)</label><input type="text" name="description" id="description" value={course.description} onChange={handleChange} required className={inputClasses} /></div>
                <div><label htmlFor="longDescription" className={labelClasses}>Descrição Longa (para página do curso)</label><textarea name="longDescription" id="longDescription" value={course.longDescription} onChange={handleChange} required className={inputClasses} rows={4} /></div>
                <div className="grid grid-cols-2 gap-6">
                    <div><label htmlFor="track" className={labelClasses}>Trilha</label><select name="track" id="track" value={course.track} onChange={handleChange} className={inputClasses}>{tracks.map(track => (<option key={track.id} value={track.name}>{track.name}</option>))}</select></div>
                    <div><label htmlFor="skillLevel" className={labelClasses}>Nível</label><select name="skillLevel" id="skillLevel" value={course.skillLevel} onChange={handleChange} className={inputClasses}><option>Iniciante</option><option>Intermediário</option><option>Avançado</option></select></div>
                    <div><label htmlFor="format" className={labelClasses}>Formato</label><select name="format" id="format" value={course.format} onChange={handleChange} className={inputClasses}><option value="online">Online</option><option value="presencial">Presencial</option><option value="hibrido">Híbrido</option></select></div>
                    <div><label htmlFor="enrollmentStatus" className={labelClasses}>Status da Inscrição</label><select name="enrollmentStatus" id="enrollmentStatus" value={course.enrollmentStatus || 'soon'} onChange={handleChange} className={inputClasses}><option value="soon">Em Breve</option><option value="open">Abertas</option><option value="closed">Fechadas</option></select></div>
                    <div><label htmlFor="duration" className={labelClasses}>Duração</label><input type="text" name="duration" id="duration" value={course.duration} onChange={handleChange} placeholder="Ex: 8 horas" className={inputClasses} /></div>
                    <div><label htmlFor="instructorId" className={labelClasses}>Instrutor</label><select name="instructorId" id="instructorId" value={course.instructorId} onChange={handleChange} className={inputClasses}>{instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></div>
                </div>
                <div className="flex items-end gap-4"><div className="flex-grow"><label htmlFor="imageUrl" className={labelClasses}>URL da Imagem de Capa</label><input type="text" name="imageUrl" id="imageUrl" value={course.imageUrl} onChange={handleChange} className={inputClasses} /></div><Uploader pathnamePrefix={`courses/${course.id}`} onUploadComplete={handleImageUploadComplete}>{(trigger, loading) => <button type="button" onClick={trigger} disabled={loading} className="py-3 px-4 bg-white/10 rounded-md hover:bg-white/20">{loading ? 'Enviando...' : 'Upload'}</button>}</Uploader></div>
            </div>
        </details>
        
        <details className="bg-black/20 p-4 rounded-lg border border-white/10">
            <summary className="font-semibold text-white cursor-pointer flex justify-between items-center">
                <span>SEO & Metadados</span>
                <AiButton onClick={handleGenerateSeo} isLoading={isGeneratingSeo} label="Gerar SEO" />
            </summary>
            <div className="mt-4 space-y-4">
                <div>
                    <label className={labelClasses}>Meta Title (Título na aba do navegador e Google)</label>
                    <input value={course.seo?.metaTitle || ''} onChange={(e) => handleSeoChange('metaTitle', e.target.value)} className={inputClasses} placeholder="Ex: Curso de Python Completo | FuturoOn" maxLength={60} />
                    <p className="text-xs text-gray-500 mt-1 text-right">{course.seo?.metaTitle?.length || 0}/60</p>
                </div>
                <div>
                    <label className={labelClasses}>Meta Description (Resumo nos resultados de busca)</label>
                    <textarea value={course.seo?.metaDescription || ''} onChange={(e) => handleSeoChange('metaDescription', e.target.value)} className={inputClasses} rows={2} placeholder="Ex: Aprenda Python do zero ao avançado com projetos práticos..." maxLength={160}></textarea>
                    <p className="text-xs text-gray-500 mt-1 text-right">{course.seo?.metaDescription?.length || 0}/160</p>
                </div>
                <div>
                    <label className={labelClasses}>Palavras-chave (separadas por vírgula)</label>
                    <input value={course.seo?.keywords?.join(', ') || ''} onChange={(e) => handleSeoChange('keywords', e.target.value)} className={inputClasses} placeholder="python, programação, backend, iniciante" />
                </div>
            </div>
        </details>

        <details className="bg-black/20 p-4 rounded-lg border border-white/10">
            <summary className="font-semibold text-white cursor-pointer flex justify-between items-center">
                <span>Página do Curso: Seção Principal (Hero)</span>
                <AiButton onClick={handleGenerateHeroWithAI} isLoading={isGeneratingHero} />
            </summary>
            <div className="mt-4 space-y-4">
            <div><label className={labelClasses}>Subtítulo</label><input value={course.heroContent?.subtitle || ''} onChange={(e) => handleLandingPageChange('heroContent', 'subtitle', e.target.value)} className={inputClasses} /></div>
            <div><label className={labelClasses}>Linha de Título 1</label><input value={course.heroContent?.titleLine1 || ''} onChange={(e) => handleLandingPageChange('heroContent', 'titleLine1', e.target.value)} className={inputClasses} /></div>
            <div><label className={labelClasses}>Título em Destaque</label><input value={course.heroContent?.titleAccent || ''} onChange={(e) => handleLandingPageChange('heroContent', 'titleAccent', e.target.value)} className={inputClasses} /></div>
            <div><label className={labelClasses}>Descrição</label><textarea value={course.heroContent?.description || ''} onChange={(e) => handleLandingPageChange('heroContent', 'description', e.target.value)} className={inputClasses} rows={3}></textarea></div>
        </div></details>
        
        <details className="bg-black/20 p-4 rounded-lg border border-white/10">
            <summary className="font-semibold text-white cursor-pointer flex justify-between items-center">
                <span>Página do Curso: Seção de Benefícios</span>
                <AiButton onClick={handleGenerateBenefitsWithAI} isLoading={isGeneratingBenefits} />
            </summary>
            <div className="mt-4 space-y-4">
            <div><label className={labelClasses}>Título da Seção</label><input value={course.benefitsSection?.title || ''} onChange={(e) => handleLandingPageChange('benefitsSection', 'title', e.target.value)} className={inputClasses} /></div>
            <div><label className={labelClasses}>Subtítulo da Seção</label><input value={course.benefitsSection?.subtitle || ''} onChange={(e) => handleLandingPageChange('benefitsSection', 'subtitle', e.target.value)} className={inputClasses} /></div>
            <div className="space-y-4 border-t border-white/10 pt-4 mt-4">
                {course.benefitsSection?.benefits.map((benefit, index) => (<div key={index} className="bg-black/30 p-4 rounded-md relative"><h4 className="font-bold mb-2">Benefício {index + 1}</h4>
                    <button type="button" onClick={() => deleteBenefit('benefitsSection', index)} className="absolute top-2 right-2 text-red-400">&times;</button>
                    <div><label className={labelClasses}>Título do Benefício</label><input value={benefit.title} onChange={(e) => handleBenefitChange('benefitsSection', index, 'title', e.target.value)} className={inputClasses} /></div>
                    <div className="mt-2"><label className={labelClasses}>Descrição</label><textarea value={benefit.description} onChange={(e) => handleBenefitChange('benefitsSection', index, 'description', e.target.value)} className={inputClasses} rows={2}></textarea></div>
                </div>))}
                <button type="button" onClick={() => addBenefit('benefitsSection')} className="text-sm font-semibold text-[#c4b5fd] hover:text-white mt-2">+ Adicionar Benefício</button>
            </div>
        </div></details>

        <details className="bg-black/20 p-4 rounded-lg border border-white/10">
            <summary className="font-semibold text-white cursor-pointer flex justify-between items-center">
                <span>Página do Curso: Seção de Currículo</span>
                <AiButton onClick={handleGenerateCurriculumWithAI} isLoading={isGeneratingCurriculum} />
            </summary>
            <div className="mt-4 space-y-4">
            <div><label className={labelClasses}>Título da Seção</label><input value={course.curriculumSection?.title || ''} onChange={(e) => handleLandingPageChange('curriculumSection', 'title', e.target.value)} className={inputClasses} /></div>
            <div><label className={labelClasses}>Subtítulo da Seção</label><input value={course.curriculumSection?.subtitle || ''} onChange={(e) => handleLandingPageChange('curriculumSection', 'subtitle', e.target.value)} className={inputClasses} /></div>
            <div className="space-y-4 border-t border-white/10 pt-4 mt-4">
                {course.curriculumSection?.items.map((item, index) => (<div key={index} className="bg-black/30 p-4 rounded-md relative"><h4 className="font-bold mb-2">Item {index + 1}</h4>
                    <button type="button" onClick={() => deleteCurriculumItem(index)} className="absolute top-2 right-2 text-red-400">&times;</button>
                    <div><label className={labelClasses}>Título do Item</label><input value={item.title} onChange={(e) => handleCurriculumItemChange(index, 'title', e.target.value)} className={inputClasses} /></div>
                    <div className="mt-2"><label className={labelClasses}>Descrição</label><textarea value={item.description} onChange={(e) => handleCurriculumItemChange(index, 'description', e.target.value)} className={inputClasses} rows={2}></textarea></div>
                </div>))}
                <button type="button" onClick={addCurriculumItem} className="text-sm font-semibold text-[#c4b5fd] hover:text-white mt-2">+ Adicionar Item ao Currículo</button>
            </div>
        </div></details>
        
        <details className="bg-black/20 p-4 rounded-lg border border-white/10">
            <summary className="font-semibold text-white cursor-pointer flex justify-between items-center">
                <span>Página do Curso: Seção de Metodologia</span>
                <AiButton onClick={handleGenerateMethodologyWithAI} isLoading={isGeneratingMethodology} />
            </summary>
            <div className="mt-4 space-y-4">
            <div><label className={labelClasses}>Título da Seção</label><input value={course.methodologySection?.title || ''} onChange={(e) => handleLandingPageChange('methodologySection', 'title', e.target.value)} className={inputClasses} /></div>
            <div><label className={labelClasses}>Subtítulo da Seção</label><input value={course.methodologySection?.subtitle || ''} onChange={(e) => handleLandingPageChange('methodologySection', 'subtitle', e.target.value)} className={inputClasses} /></div>
            <div className="space-y-4 border-t border-white/10 pt-4 mt-4">
                {course.methodologySection?.benefits.map((benefit, index) => (<div key={index} className="bg-black/30 p-4 rounded-md relative"><h4 className="font-bold mb-2">Item {index + 1}</h4>
                    <button type="button" onClick={() => deleteBenefit('methodologySection', index)} className="absolute top-2 right-2 text-red-400">&times;</button>
                    <div><label className={labelClasses}>Título do Item</label><input value={benefit.title} onChange={(e) => handleBenefitChange('methodologySection', index, 'title', e.target.value)} className={inputClasses} /></div>
                    <div className="mt-2"><label className={labelClasses}>Descrição</label><textarea value={benefit.description} onChange={(e) => handleBenefitChange('methodologySection', index, 'description', e.target.value)} className={inputClasses} rows={2}></textarea></div>
                </div>))}
                <button type="button" onClick={() => addBenefit('methodologySection')} className="text-sm font-semibold text-[#c4b5fd] hover:text-white mt-2">+ Adicionar Item</button>
            </div>
        </div></details>

        <details className="bg-black/20 p-4 rounded-lg border border-white/10">
            <summary className="font-semibold text-white cursor-pointer flex justify-between items-center">
                <span>Página do Curso: Chamada para Ação (CTA)</span>
                <AiButton onClick={handleGenerateCtaWithAI} isLoading={isGeneratingCta} />
            </summary>
            <div className="mt-4 space-y-4">
            <div><label className={labelClasses}>Título</label><input value={course.ctaSection?.title || ''} onChange={(e) => handleLandingPageChange('ctaSection', 'title', e.target.value)} className={inputClasses} /></div>
            <div><label className={labelClasses}>Descrição</label><textarea value={course.ctaSection?.description || ''} onChange={(e) => handleLandingPageChange('ctaSection', 'description', e.target.value)} className={inputClasses} rows={2}></textarea></div>
        </div></details>

    </div>
  );

  const renderModuleForm = () => {
    if (selectedItem.type !== 'module') return null;
    const module = course.modules[selectedItem.moduleIndex];
    return (
        <div>
            <label htmlFor="title" className={labelClasses}>Título do Módulo</label>
            <input type="text" name="title" id="title" value={module.title} onChange={(e) => handleModuleChange(e, selectedItem.moduleIndex)} className={inputClasses} />
        </div>
    );
  };
  
  const renderLessonForm = () => {
    if (selectedItem.type !== 'lesson') return null;
    const lesson = course.modules[selectedItem.moduleIndex].lessons[selectedItem.lessonIndex];
    return (
        <div className="space-y-6">
            <div><label htmlFor="title" className={labelClasses}>Título da Aula</label><input type="text" name="title" id="title" value={lesson.title} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} /></div>
            <div className="grid grid-cols-3 gap-4">
                <div><label htmlFor="duration" className={labelClasses}>Duração</label><input type="text" name="duration" id="duration" value={lesson.duration} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} /></div>
                <div><label htmlFor="xp" className={labelClasses}>XP</label><input type="number" name="xp" id="xp" value={lesson.xp} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} /></div>
                <div><label htmlFor="type" className={labelClasses}>Tipo</label><select name="type" id="type" value={lesson.type} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses}><option value="text">Texto</option><option value="video">Vídeo</option></select></div>
            </div>
            {lesson.type === 'video' && <div><label htmlFor="videoUrl" className={labelClasses}>URL do Vídeo (YouTube)</label><input type="text" name="videoUrl" id="videoUrl" value={lesson.videoUrl || ''} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} /></div>}
            
            <RichContentEditor label="Objetivo da Aula" value={lesson.objective || ''} onChange={(val) => handleLessonContentChange(val, 'objective', selectedItem.moduleIndex, selectedItem.lessonIndex)} textareaRef={useRef(null)} />
            <RichContentEditor label="Conteúdo Principal" value={lesson.mainContent || ''} onChange={(val) => handleLessonContentChange(val, 'mainContent', selectedItem.moduleIndex, selectedItem.lessonIndex)} textareaRef={useRef(null)} />
            <RichContentEditor label="Resumo" value={lesson.summary || ''} onChange={(val) => handleLessonContentChange(val, 'summary', selectedItem.moduleIndex, selectedItem.lessonIndex)} textareaRef={useRef(null)} />
        </div>
    );
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Draft Alert Banner */}
      {draftFound && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                      <p className="font-bold text-yellow-200">Rascunho não salvo encontrado!</p>
                      <p className="text-sm text-yellow-200/70">
                          Você tem alterações não salvas de uma sessão anterior.
                      </p>
                  </div>
              </div>
              <div className="flex gap-3">
                  <button 
                      onClick={handleDiscardDraft} 
                      className="text-sm font-semibold text-red-400 hover:text-red-300 px-4 py-2 rounded hover:bg-red-500/10 transition-colors"
                  >
                      Descartar
                  </button>
                  <button 
                      onClick={handleRestoreDraft} 
                      className="text-sm font-semibold bg-yellow-500 text-black px-4 py-2 rounded shadow hover:bg-yellow-400 transition-colors"
                  >
                      Restaurar Rascunho
                  </button>
              </div>
          </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-4xl font-black text-white">{courseId === 'new' ? 'Novo Curso' : 'Editor de Curso'}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-400">Crie e organize os módulos e aulas do seu curso.</p>
                    {lastAutoSave && (
                        <span className="text-xs text-gray-500 ml-2 bg-black/30 px-2 py-1 rounded border border-white/5">
                            ☁️ Rascunho salvo às {lastAutoSave.toLocaleTimeString()}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <button type="button" onClick={onCancel} className="flex-1 md:flex-none bg-white/10 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-white/20 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 md:flex-none bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all shadow-lg shadow-[#8a4add]/20">Salvar Curso</button>
            </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Structure */}
            <div className="lg:col-span-1 bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10 space-y-6 lg:sticky top-24">
                <h2 className="text-xl font-bold text-white">Estrutura do Curso</h2>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10"><h3 className="text-md font-semibold text-[#c4b5fd] mb-2">✨ Gerar estrutura com IA</h3><div className="flex gap-2"><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="Ex: React para iniciantes" className={`${inputClasses} flex-grow`} /><button type="button" onClick={handleGenerateStructureWithAI} disabled={isGeneratingStructure} className="py-2 px-3 bg-[#8a4add] rounded-md hover:bg-[#6d28d9] disabled:opacity-50">{isGeneratingStructure ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Gerar'}</button></div></div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {course.modules.map((module, mIndex) => (
                        <div key={module.id} className="bg-white/5 p-3 rounded-lg"><div className="flex justify-between items-center"><h4 className="font-bold text-white truncate flex-1">{mIndex + 1}. {module.title}</h4><div className="flex gap-2"><button type="button" onClick={() => setSelectedItem({ type: 'module', moduleIndex: mIndex })} className="text-xs text-gray-300 hover:text-white">Editar</button><button type="button" onClick={() => deleteModule(mIndex)} className="text-xs text-red-400 hover:text-red-300">Excluir</button></div></div><div className="mt-2 space-y-1 pl-4 border-l-2 border-white/10">{module.lessons.map((lesson, lIndex) => (<div key={lesson.id} className="flex justify-between items-center text-sm group"><span className="text-gray-300 truncate">{lesson.title}</span><div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button type="button" onClick={() => setSelectedItem({ type: 'lesson', moduleIndex: mIndex, lessonIndex: lIndex })} className="text-xs text-gray-300 hover:text-white">Editar</button><button type="button" onClick={() => deleteLesson(mIndex, lIndex)} className="text-xs text-red-400 hover:text-red-300">Excluir</button></div></div>))}{module.lessons.length === 0 && <p className="text-xs text-gray-500 pl-2">Nenhuma aula neste módulo.</p>}<button type="button" onClick={() => addLesson(mIndex)} className="text-xs font-semibold text-[#c4b5fd] hover:text-white mt-2">+ Adicionar Aula</button></div></div>
                    ))}
                </div>
                <button type="button" onClick={addModule} className="w-full bg-white/10 text-white font-semibold py-2 rounded-lg hover:bg-white/20 transition-colors">+ Adicionar Módulo</button>
            </div>

            {/* Right Column: Editor Panel */}
            <div className="lg:col-span-2 bg-black/20 backdrop-blur-xl p-8 rounded-lg border border-white/10">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                    <button type="button" onClick={() => setSelectedItem({ type: 'course' })} className={`font-semibold transition-colors ${selectedItem.type === 'course' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Informações do Curso</button>
                    {selectedItem.type === 'module' && <><span className="text-gray-500">/</span><button className="font-semibold text-white">Módulo {selectedItem.moduleIndex + 1}</button></>}
                    {selectedItem.type === 'lesson' && <><span className="text-gray-500">/</span><button onClick={() => setSelectedItem({ type: 'module', moduleIndex: selectedItem.moduleIndex })} className="font-semibold text-gray-400 hover:text-white">Módulo {selectedItem.moduleIndex + 1}</button><span className="text-gray-500">/</span><button className="font-semibold text-white">Aula {selectedItem.lessonIndex + 1}</button></>}
                </div>
                {selectedItem.type === 'course' && renderCourseForm()}
                {selectedItem.type === 'module' && renderModuleForm()}
                {selectedItem.type === 'lesson' && renderLessonForm()}
            </div>
        </div>
      </form>
    </div>
  );
};

export default CourseEditor;
