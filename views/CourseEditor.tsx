
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

type EditorTab = 'structure' | 'marketing' | 'settings';

const stringToSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

// Helper to clean AI JSON response
const cleanAndParseJSON = (text: string) => {
    try {
        const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON from AI:", text);
        throw new Error("Falha ao processar resposta da IA.");
    }
};

const CourseHealthIndicator: React.FC<{ course: Course }> = ({ course }) => {
    const [isOpen, setIsOpen] = useState(false);

    const health = useMemo(() => {
        const checks = [
            { label: "Título do Curso", valid: course.title.length > 5 },
            { label: "Descrição Curta", valid: course.description.length > 20 },
            { label: "Imagem de Capa", valid: !!course.imageUrl && !course.imageUrl.includes("unsplash") },
            { label: "Pelo menos 1 Módulo", valid: course.modules.length > 0 },
            { label: "Pelo menos 1 Aula", valid: course.modules.some(m => m.lessons.length > 0) },
            { label: "Landing Page (Marketing)", valid: !!course.heroContent?.titleLine1 },
            { label: "SEO Configurado", valid: !!course.seo?.metaTitle }
        ];
        const completed = checks.filter(c => c.valid).length;
        return { percentage: Math.round((completed / checks.length) * 100), checks };
    }, [course]);

    return (
        <div className="relative">
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-colors group"
            >
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold group-hover:text-gray-300 transition-colors">Progresso</span>
                    <span className={`text-sm font-bold ${health.percentage === 100 ? 'text-green-400' : health.percentage > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {health.percentage}%
                    </span>
                </div>
                <div className="w-8 h-8 relative flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        <path 
                            className={`${health.percentage === 100 ? 'text-green-500' : health.percentage > 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`} 
                            strokeDasharray={`${health.percentage}, 100`} 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                        />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-[#18181B] border border-white/10 rounded-xl shadow-2xl z-50 p-5 animate-fade-in">
                    <h4 className="text-sm font-bold text-white mb-3 flex justify-between items-center">
                        Checklist
                        <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-gray-500 hover:text-white">&times;</button>
                    </h4>
                    <ul className="space-y-3">
                        {health.checks.map((check, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-xs">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${check.valid ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-gray-600 bg-transparent text-gray-600'}`}>
                                    {check.valid ? '✓' : ''}
                                </div>
                                <span className={check.valid ? 'text-gray-400 line-through decoration-gray-600' : 'text-white font-medium'}>{check.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const CourseEditor: React.FC = () => {
  const { user, instructors, courses, tracks, handleSaveCourse, showToast } = useAppContext();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

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
  const [activeTab, setActiveTab] = useState<EditorTab>('structure');
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [draftFound, setDraftFound] = useState<Course | null>(null);

  useEffect(() => {
    if (existingCourse) {
      setCourse({ ...existingCourse, seo: existingCourse.seo || { metaTitle: '', metaDescription: '', keywords: [] } });
    } else if (courseId === 'new') {
      setCourse(getNewCourseTemplate);
    }
  }, [existingCourse, courseId, getNewCourseTemplate]);

  useEffect(() => {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
          try {
              const parsedDraft = JSON.parse(savedDraft);
              if (JSON.stringify(parsedDraft) !== JSON.stringify(course)) {
                  setDraftFound(parsedDraft);
              }
          } catch (e) {
              console.error("Erro ao ler rascunho:", e);
          }
      }
  }, [DRAFT_KEY]); 

  useEffect(() => {
      const timer = setTimeout(() => {
          if (JSON.stringify(course) !== JSON.stringify(existingCourse || getNewCourseTemplate)) {
              localStorage.setItem(DRAFT_KEY, JSON.stringify(course));
              setLastAutoSave(new Date());
          }
      }, 2000);
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
  
  const [isGeneratingHero, setIsGeneratingHero] = useState(false);
  const [isGeneratingBenefits, setIsGeneratingBenefits] = useState(false);
  const [isGeneratingCurriculum, setIsGeneratingCurriculum] = useState(false);
  const [isGeneratingMethodology, setIsGeneratingMethodology] = useState(false);
  const [isGeneratingCta, setIsGeneratingCta] = useState(false);

  const onCancel = () => navigate('/admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prev => {
        const updates: any = { [name]: value };
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

  const moveModule = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === course.modules.length - 1) return;
      
      setCourse(prev => {
          const newModules = [...prev.modules];
          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
          return { ...prev, modules: newModules };
      });
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

  const moveLesson = (moduleIndex: number, lessonIndex: number, direction: 'up' | 'down') => {
      if (direction === 'up' && lessonIndex === 0) return;
      if (direction === 'down' && lessonIndex === course.modules[moduleIndex].lessons.length - 1) return;

      setCourse(prev => {
          const newModules = [...prev.modules];
          const newLessons = [...newModules[moduleIndex].lessons];
          const targetIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
          [newLessons[lessonIndex], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[lessonIndex]];
          newModules[moduleIndex].lessons = newLessons;
          return { ...prev, modules: newModules };
      });
  };


  const handleGenerateStructureWithAI = async () => {
      const topic = aiTopic.trim() || course.title;
      if (!topic) {
          showToast("⚠️ Digite um tópico ou defina um título para o curso.");
          return;
      }
      setIsGeneratingStructure(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const prompt = `Você é um designer instrucional sênior. Crie uma estrutura de curso completa para o tema: "${topic}". 
          O público são jovens da periferia iniciando em tecnologia. A estrutura deve ser prática, motivadora e com linguagem acessível.
          
          Retorne APENAS um objeto JSON seguindo EXATAMENTE este formato:
          {
            "modules": [
                {
                    "title": "Nome do Módulo",
                    "lessons": [
                        { "title": "Nome da Aula", "duration": "15 min", "xp": 20 }
                    ]
                }
            ]
          }`;

          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
          });

          const result = cleanAndParseJSON(response.text);
          
          const newModules = result.modules.map((mod: any) => ({
              ...mod,
              id: `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              lessons: mod.lessons.map((les: any) => ({
                  ...les,
                  id: `les_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  type: 'text'
              }))
          }));

          setCourse(prev => {
              const newTitle = !prev.title ? topic : prev.title;
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
          const prompt = `Atue como um especialista em SEO. Gere meta title, meta description e keywords otimizadas para a página deste curso da FuturoOn.
          
          Conteúdo: ${courseContext}
          
          Retorne apenas o JSON com chaves: metaTitle, metaDescription, keywords (array).`;

          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
          });

          const result = cleanAndParseJSON(response.text);
          
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

  const generateSectionCommon = async (prompt: string, setLoading: (l: boolean) => void, onSuccess: (result: any) => void) => {
      if (!course.title) {
          showToast("⚠️ Preencha o Título do Curso primeiro para dar contexto à IA.");
          return;
      }
      setLoading(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const fullPrompt = `Você é um Copywriter Sênior da FuturoOn.
          Curso: "${course.title}".
          Descrição: "${course.description}".
          Público: Jovens da periferia, linguagem moderna e inspiradora.
          
          ${prompt}
          
          Retorne APENAS o JSON válido.`;

          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: fullPrompt,
          });
          
          const result = cleanAndParseJSON(response.text);
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
      const prompt = `Gere o conteúdo para a seção Hero (Topo).
      Formato JSON: {"subtitle": "...", "titleLine1": "...", "titleAccent": "...", "description": "..."}`;
      generateSectionCommon(prompt, setIsGeneratingHero, (res) => {
          setCourse(prev => ({ ...prev, heroContent: res }));
      });
  };

  const handleGenerateBenefitsWithAI = () => {
      const prompt = `Liste 4 benefícios.
      Formato JSON: {"title": "...", "subtitle": "...", "benefits": [{"title": "...", "description": "..."}]}`;
      generateSectionCommon(prompt, setIsGeneratingBenefits, (res) => {
          setCourse(prev => ({ ...prev, benefitsSection: res }));
      });
  };

  const handleGenerateCurriculumWithAI = () => {
      const prompt = `Crie um resumo do currículo em 4 tópicos macro.
      Formato JSON: {"title": "...", "subtitle": "...", "items": [{"title": "...", "description": "..."}]}`;
      generateSectionCommon(prompt, setIsGeneratingCurriculum, (res) => {
          setCourse(prev => ({ ...prev, curriculumSection: res }));
      });
  };

  const handleGenerateMethodologyWithAI = () => {
      const prompt = `Descreva a metodologia em 3 pontos.
      Formato JSON: {"title": "...", "subtitle": "...", "benefits": [{"title": "...", "description": "..."}]}`;
      generateSectionCommon(prompt, setIsGeneratingMethodology, (res) => {
          setCourse(prev => ({ ...prev, methodologySection: res }));
      });
  };

  const handleGenerateCtaWithAI = () => {
      const prompt = `Crie uma chamada para ação (CTA) final.
      Formato JSON: {"title": "...", "description": "..."}`;
      generateSectionCommon(prompt, setIsGeneratingCta, (res) => {
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
          className="flex items-center gap-2 text-xs font-bold bg-[#8a4add]/20 text-[#c4b5fd] px-3 py-1.5 rounded-full hover:bg-[#8a4add]/30 disabled:opacity-50 transition-all hover:shadow-[0_0_10px_rgba(138,74,221,0.3)] border border-[#8a4add]/30"
      >
          {isLoading ? (
              <><svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Gerando...</>
          ) : (
              <>✨ {label}</>
          )}
      </button>
  );

  const renderSettingsForm = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-black/20 p-6 rounded-lg border border-white/10">
            <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-2">Informações Básicas</h3>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label htmlFor="title" className={labelClasses}>Título do Curso</label><input type="text" name="title" id="title" value={course.title} onChange={handleChange} required className={inputClasses} /></div>
                    <div><label htmlFor="slug" className={labelClasses}>URL Amigável (slug)</label><input type="text" name="slug" id="slug" value={course.slug || ''} onChange={handleChange} placeholder="ex: curso-react-avancado" className={inputClasses} /></div>
                </div>
                <div><label htmlFor="description" className={labelClasses}>Descrição Curta</label><input type="text" name="description" id="description" value={course.description} onChange={handleChange} required className={inputClasses} /></div>
                <div><label htmlFor="longDescription" className={labelClasses}>Descrição Longa</label><textarea name="longDescription" id="longDescription" value={course.longDescription} onChange={handleChange} required className={inputClasses} rows={4} /></div>
                <div className="grid grid-cols-2 gap-6">
                    <div><label htmlFor="track" className={labelClasses}>Trilha</label><select name="track" id="track" value={course.track} onChange={handleChange} className={inputClasses}>{tracks.map(track => (<option key={track.id} value={track.name}>{track.name}</option>))}</select></div>
                    <div><label htmlFor="skillLevel" className={labelClasses}>Nível</label><select name="skillLevel" id="skillLevel" value={course.skillLevel} onChange={handleChange} className={inputClasses}><option>Iniciante</option><option>Intermediário</option><option>Avançado</option></select></div>
                    <div><label htmlFor="format" className={labelClasses}>Formato</label><select name="format" id="format" value={course.format} onChange={handleChange} className={inputClasses}><option value="online">Online</option><option value="presencial">Presencial</option><option value="hibrido">Híbrido</option></select></div>
                    <div><label htmlFor="enrollmentStatus" className={labelClasses}>Inscrições</label><select name="enrollmentStatus" id="enrollmentStatus" value={course.enrollmentStatus || 'soon'} onChange={handleChange} className={inputClasses}><option value="soon">Em Breve</option><option value="open">Abertas</option><option value="closed">Fechadas</option></select></div>
                    <div><label htmlFor="duration" className={labelClasses}>Duração</label><input type="text" name="duration" id="duration" value={course.duration} onChange={handleChange} placeholder="Ex: 8 horas" className={inputClasses} /></div>
                    <div><label htmlFor="instructorId" className={labelClasses}>Instrutor</label><select name="instructorId" id="instructorId" value={course.instructorId} onChange={handleChange} className={inputClasses}>{instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></div>
                </div>
                <div className="flex items-end gap-4"><div className="flex-grow"><label htmlFor="imageUrl" className={labelClasses}>URL da Imagem</label><input type="text" name="imageUrl" id="imageUrl" value={course.imageUrl} onChange={handleChange} className={inputClasses} /></div><Uploader pathnamePrefix={`courses/${course.id}`} onUploadComplete={handleImageUploadComplete}>{(trigger, loading) => <button type="button" onClick={trigger} disabled={loading} className="py-3 px-4 bg-white/10 rounded-md hover:bg-white/20">{loading ? 'Enviando...' : 'Upload'}</button>}</Uploader></div>
            </div>
        </div>
        
        <div className="bg-black/20 p-6 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <h3 className="font-bold text-white">SEO</h3>
                <AiButton onClick={handleGenerateSeo} isLoading={isGeneratingSeo} label="Gerar SEO" />
            </div>
            <div className="space-y-4">
                <div><label className={labelClasses}>Meta Title</label><input value={course.seo?.metaTitle || ''} onChange={(e) => handleSeoChange('metaTitle', e.target.value)} className={inputClasses} maxLength={60} /></div>
                <div><label className={labelClasses}>Meta Description</label><textarea value={course.seo?.metaDescription || ''} onChange={(e) => handleSeoChange('metaDescription', e.target.value)} className={inputClasses} rows={2} maxLength={160}></textarea></div>
                <div><label className={labelClasses}>Palavras-chave</label><input value={course.seo?.keywords?.join(', ') || ''} onChange={(e) => handleSeoChange('keywords', e.target.value)} className={inputClasses} /></div>
            </div>
        </div>
    </div>
  );

  const renderMarketingForm = () => (
      <div className="space-y-6 animate-fade-in">
        <div className="p-4 bg-[#8a4add]/10 border border-[#8a4add]/20 rounded-lg text-sm text-gray-300 flex items-start gap-3">
            <span className="text-lg">🎨</span>
            <div>
                <p className="font-bold text-[#c4b5fd]">Editor de Landing Page</p>
                <p>Use a IA para gerar textos persuasivos para a página de vendas do curso.</p>
            </div>
        </div>

        <div className="bg-black/20 p-6 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-white">Hero</h3><AiButton onClick={handleGenerateHeroWithAI} isLoading={isGeneratingHero} /></div>
            <div className="space-y-4">
                <div><label className={labelClasses}>Subtítulo</label><input value={course.heroContent?.subtitle || ''} onChange={(e) => handleLandingPageChange('heroContent', 'subtitle', e.target.value)} className={inputClasses} /></div>
                <div><label className={labelClasses}>Título Principal</label><input value={course.heroContent?.titleLine1 || ''} onChange={(e) => handleLandingPageChange('heroContent', 'titleLine1', e.target.value)} className={inputClasses} /></div>
                <div><label className={labelClasses}>Título Destaque (Cor)</label><input value={course.heroContent?.titleAccent || ''} onChange={(e) => handleLandingPageChange('heroContent', 'titleAccent', e.target.value)} className={inputClasses} /></div>
                <div><label className={labelClasses}>Descrição</label><textarea value={course.heroContent?.description || ''} onChange={(e) => handleLandingPageChange('heroContent', 'description', e.target.value)} className={inputClasses} rows={3}></textarea></div>
            </div>
        </div>

        <div className="bg-black/20 p-6 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-white">Benefícios</h3><AiButton onClick={handleGenerateBenefitsWithAI} isLoading={isGeneratingBenefits} /></div>
            <div className="space-y-4">
                <div><label className={labelClasses}>Título</label><input value={course.benefitsSection?.title || ''} onChange={(e) => handleLandingPageChange('benefitsSection', 'title', e.target.value)} className={inputClasses} /></div>
                <div><label className={labelClasses}>Subtítulo</label><input value={course.benefitsSection?.subtitle || ''} onChange={(e) => handleLandingPageChange('benefitsSection', 'subtitle', e.target.value)} className={inputClasses} /></div>
                <div className="space-y-4 border-t border-white/10 pt-4 mt-4">
                    {course.benefitsSection?.benefits.map((benefit, index) => (<div key={index} className="bg-black/30 p-4 rounded-md relative"><h4 className="font-bold mb-2 text-sm">Item {index + 1}</h4>
                        <button type="button" onClick={() => deleteBenefit('benefitsSection', index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300">&times;</button>
                        <div><label className={labelClasses}>Título</label><input value={benefit.title} onChange={(e) => handleBenefitChange('benefitsSection', index, 'title', e.target.value)} className={inputClasses} /></div>
                        <div className="mt-2"><label className={labelClasses}>Descrição</label><textarea value={benefit.description} onChange={(e) => handleBenefitChange('benefitsSection', index, 'description', e.target.value)} className={inputClasses} rows={2}></textarea></div>
                    </div>))}
                    <button type="button" onClick={() => addBenefit('benefitsSection')} className="text-sm font-semibold text-[#c4b5fd] hover:text-white mt-2">+ Adicionar</button>
                </div>
            </div>
        </div>

        <div className="bg-black/20 p-6 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-white">Resumo Currículo</h3><AiButton onClick={handleGenerateCurriculumWithAI} isLoading={isGeneratingCurriculum} /></div>
            <div className="space-y-4">
                <div><label className={labelClasses}>Título</label><input value={course.curriculumSection?.title || ''} onChange={(e) => handleLandingPageChange('curriculumSection', 'title', e.target.value)} className={inputClasses} /></div>
                <div><label className={labelClasses}>Subtítulo</label><input value={course.curriculumSection?.subtitle || ''} onChange={(e) => handleLandingPageChange('curriculumSection', 'subtitle', e.target.value)} className={inputClasses} /></div>
                <div className="space-y-4 border-t border-white/10 pt-4 mt-4">
                    {course.curriculumSection?.items.map((item, index) => (<div key={index} className="bg-black/30 p-4 rounded-md relative"><h4 className="font-bold mb-2 text-sm">Tópico {index + 1}</h4>
                        <button type="button" onClick={() => deleteCurriculumItem(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300">&times;</button>
                        <div><label className={labelClasses}>Título</label><input value={item.title} onChange={(e) => handleCurriculumItemChange(index, 'title', e.target.value)} className={inputClasses} /></div>
                        <div className="mt-2"><label className={labelClasses}>Descrição</label><textarea value={item.description} onChange={(e) => handleCurriculumItemChange(index, 'description', e.target.value)} className={inputClasses} rows={2}></textarea></div>
                    </div>))}
                    <button type="button" onClick={addCurriculumItem} className="text-sm font-semibold text-[#c4b5fd] hover:text-white mt-2">+ Adicionar Tópico</button>
                </div>
            </div>
        </div>

        <div className="bg-black/20 p-6 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-white">CTA Final</h3><AiButton onClick={handleGenerateCtaWithAI} isLoading={isGeneratingCta} /></div>
            <div className="space-y-4">
                <div><label className={labelClasses}>Título</label><input value={course.ctaSection?.title || ''} onChange={(e) => handleLandingPageChange('ctaSection', 'title', e.target.value)} className={inputClasses} /></div>
                <div><label className={labelClasses}>Descrição</label><textarea value={course.ctaSection?.description || ''} onChange={(e) => handleLandingPageChange('ctaSection', 'description', e.target.value)} className={inputClasses} rows={2}></textarea></div>
            </div>
        </div>
      </div>
  );

  const renderStructureEditor = () => (
      <div className="grid lg:grid-cols-3 gap-8 items-start animate-fade-in">
            <div className="lg:col-span-1 bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10 space-y-6 lg:sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Currículo</h2>
                    <button type="button" onClick={() => setSelectedItem({ type: 'course' })} className="text-xs text-[#c4b5fd] hover:text-white underline">Editar Info</button>
                </div>
                
                <div className="bg-gradient-to-br from-[#8a4add]/10 to-transparent p-4 rounded-lg border border-[#8a4add]/20">
                    <h3 className="text-md font-bold text-[#c4b5fd] mb-2 flex items-center gap-2">
                        ✨ IA Generator
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">Digite o tema para gerar a estrutura.</p>
                    <div className="flex gap-2">
                        <input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder={course.title || "Ex: React Hooks"} className={`${inputClasses} flex-grow text-xs py-2`} />
                        <button type="button" onClick={handleGenerateStructureWithAI} disabled={isGeneratingStructure} className="py-2 px-3 bg-[#8a4add] rounded-md hover:bg-[#6d28d9] disabled:opacity-50 text-white shadow-lg transition-all">
                            {isGeneratingStructure ? '...' : 'Gerar'}
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {course.modules.map((module, mIndex) => (
                        <div key={module.id} className={`bg-white/5 p-3 rounded-lg border ${selectedItem.type === 'module' && selectedItem.moduleIndex === mIndex ? 'border-[#8a4add]' : 'border-transparent'}`}>
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <h4 
                                        className="font-bold text-white truncate cursor-pointer hover:text-[#c4b5fd] transition-colors flex-1"
                                        onClick={() => setSelectedItem({ type: 'module', moduleIndex: mIndex })}
                                    >
                                        {mIndex + 1}. {module.title || 'Sem Título'}
                                    </h4>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button type="button" onClick={() => deleteModule(mIndex)} className="text-red-400 hover:text-red-300 p-1">🗑️</button>
                                </div>
                            </div>
                            
                            <div className="mt-2 space-y-1 pl-4 border-l-2 border-white/10">
                                {module.lessons.map((lesson, lIndex) => {
                                    const isSelected = selectedItem.type === 'lesson' && selectedItem.moduleIndex === mIndex && selectedItem.lessonIndex === lIndex;
                                    return (
                                    <div 
                                        key={lesson.id} 
                                        className={`flex justify-between items-center text-sm group p-2 rounded-md transition-all ${isSelected ? 'bg-[#8a4add]/20 text-[#c4b5fd]' : 'text-gray-300 hover:bg-white/5'}`}
                                    >
                                        <span 
                                            className="truncate cursor-pointer flex-1"
                                            onClick={() => setSelectedItem({ type: 'lesson', moduleIndex: mIndex, lessonIndex: lIndex })}
                                        >
                                            {lesson.title || 'Nova Aula'}
                                        </span>
                                        <button type="button" onClick={() => deleteLesson(mIndex, lIndex)} className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 p-1">🗑️</button>
                                    </div>
                                )})}
                                <button type="button" onClick={() => addLesson(mIndex)} className="text-xs font-semibold text-[#c4b5fd] hover:text-white mt-2 px-2 py-1 hover:bg-white/5 rounded">
                                    + Aula
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addModule} className="w-full bg-white/10 text-white font-semibold py-2 rounded-lg hover:bg-white/20 transition-colors border border-white/10 border-dashed">+ Novo Módulo</button>
            </div>

            <div className="lg:col-span-2 bg-black/20 backdrop-blur-xl p-8 rounded-lg border border-white/10">
                {selectedItem.type === 'course' && (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-lg font-medium text-white">Selecione um Módulo ou Aula</p>
                        <p className="text-sm">Use o menu à esquerda para editar o conteúdo.</p>
                    </div>
                )}
                
                {selectedItem.type === 'module' && (
                    <div className="space-y-6 animate-fade-in">
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Editar Módulo</h3>
                        <div>
                            <label htmlFor="modTitle" className={labelClasses}>Título do Módulo</label>
                            <input type="text" name="title" id="modTitle" value={course.modules[selectedItem.moduleIndex].title} onChange={(e) => handleModuleChange(e, selectedItem.moduleIndex)} className={inputClasses} autoFocus />
                        </div>
                    </div>
                )}

                {selectedItem.type === 'lesson' && (
                    <div className="space-y-6 animate-fade-in">
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                            Editar Aula: <span className="text-[#c4b5fd]">{course.modules[selectedItem.moduleIndex].lessons[selectedItem.lessonIndex].title}</span>
                        </h3>
                        <div><label htmlFor="lesTitle" className={labelClasses}>Título da Aula</label><input type="text" name="title" id="lesTitle" value={course.modules[selectedItem.moduleIndex].lessons[selectedItem.lessonIndex].title} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} /></div>
                        <div className="grid grid-cols-3 gap-4">
                            <div><label htmlFor="lesDuration" className={labelClasses}>Duração</label><input type="text" name="duration" id="lesDuration" value={course.modules[selectedItem.moduleIndex].lessons[selectedItem.lessonIndex].duration} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} /></div>
                            <div><label htmlFor="lesXp" className={labelClasses}>XP</label><input type="number" name="xp" id="lesXp" value={course.modules[selectedItem.moduleIndex].lessons[selectedItem.lessonIndex].xp} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} /></div>
                            <div><label htmlFor="lesType" className={labelClasses}>Tipo</label><select name="type" id="lesType" value={course.modules[selectedItem.moduleIndex].lessons[selectedItem.lessonIndex].type} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses}><option value="text">Texto</option><option value="video">Vídeo</option></select></div>
                        </div>
                        {course.modules[selectedItem.moduleIndex].lessons[selectedItem.lessonIndex].type === 'video' && 
                            <div><label htmlFor="videoUrl" className={labelClasses}>URL do Vídeo (YouTube)</label><input type="text" name="videoUrl" id="videoUrl" value={course.modules[selectedItem.moduleIndex].lessons[selectedItem.lessonIndex].videoUrl || ''} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} /></div>
                        }
                        
                        <RichContentEditor 
                            label="Objetivo da Aula" 
                            value={course.modules[selectedItem.moduleIndex].lessons[selectedItem.lessonIndex].objective || ''} 
                            onChange={(val) => handleLessonContentChange(val, 'objective', selectedItem.moduleIndex, selectedItem.lessonIndex)} 
                            textareaRef={useRef(null)} 
                            rows={3}
                        />
                        <RichContentEditor 
                            label="Conteúdo Principal (Markdown)" 
                            value={course.modules[selectedItem.moduleIndex].lessons[selectedItem.lessonIndex].mainContent || ''} 
                            onChange={(val) => handleLessonContentChange(val, 'mainContent', selectedItem.moduleIndex, selectedItem.lessonIndex)} 
                            textareaRef={useRef(null)} 
                            rows={15}
                        />
                    </div>
                )}
            </div>
      </div>
  );


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {draftFound && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                      <p className="font-bold text-yellow-200">Rascunho encontrado!</p>
                      <p className="text-sm text-yellow-200/70">Você tem alterações não salvas de uma sessão anterior.</p>
                  </div>
              </div>
              <div className="flex gap-3">
                  <button onClick={handleDiscardDraft} className="text-sm font-semibold text-red-400 hover:text-red-300 px-4 py-2">Descartar</button>
                  <button onClick={handleRestoreDraft} className="text-sm font-semibold bg-yellow-500 text-black px-4 py-2 rounded">Restaurar</button>
              </div>
          </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-4xl font-black text-white">{courseId === 'new' ? 'Novo Curso' : 'Editor de Curso'}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-400">{course.title || 'Sem Título'}</p>
                    {lastAutoSave && <span className="text-xs text-gray-500 ml-2">☁️ Salvo às {lastAutoSave.toLocaleTimeString()}</span>}
                </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto items-center">
                <CourseHealthIndicator course={course} />
                <button type="button" onClick={onCancel} className="bg-white/10 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-white/20 transition-colors">Cancelar</button>
                <button type="submit" className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all shadow-lg shadow-[#8a4add]/20">Salvar Curso</button>
            </div>
        </div>

        <div className="flex gap-1 bg-black/30 p-1 rounded-xl border border-white/10 w-fit mx-auto md:mx-0">
            <button type="button" onClick={() => setActiveTab('structure')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'structure' ? 'bg-[#8a4add] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>📚 Estrutura</button>
            <button type="button" onClick={() => setActiveTab('marketing')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'marketing' ? 'bg-[#8a4add] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>🎨 Página de Vendas</button>
            <button type="button" onClick={() => setActiveTab('settings')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-[#8a4add] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>⚙️ Configurações</button>
        </div>
        
        <div className="min-h-[600px]">
            {activeTab === 'structure' && renderStructureEditor()}
            {activeTab === 'marketing' && renderMarketingForm()}
            {activeTab === 'settings' && renderSettingsForm()}
        </div>
      </form>
    </div>
  );
};

export default CourseEditor;
