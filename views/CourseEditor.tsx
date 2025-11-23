
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, Module, Lesson, CourseBenefit, CurriculumItem } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../App';
import RichContentEditor from '../components/RichContentEditor';
import Uploader from '../components/Uploader';
import { motion, AnimatePresence } from 'framer-motion';

type SelectedItem = 
  | { type: 'course' }
  | { type: 'module'; moduleIndex: number }
  | { type: 'lesson'; moduleIndex: number; lessonIndex: number };

type AiAction = 'create' | 'improve' | 'summarize' | 'create_code';
type EditTab = 'basics' | 'landing' | 'modules' | 'seo';

const CourseEditor: React.FC = () => {
  const { user, instructors, courses, tracks, handleSaveCourse, showToast } = useAppContext();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const getNewCourseTemplate = useMemo(() => ({
    id: `course_${Date.now()}`,
    title: '', description: '', longDescription: '',
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
  const [editTab, setEditTab] = useState<EditTab>('basics');
  
  useEffect(() => {
    if (existingCourse) {
      setCourse({ ...existingCourse, seo: existingCourse.seo || { metaTitle: '', metaDescription: '', keywords: [] } });
    } else if (courseId === 'new') {
      setCourse(getNewCourseTemplate);
    }
  }, [existingCourse, courseId, getNewCourseTemplate]);

  const [selectedItem, setSelectedItem] = useState<SelectedItem>({ type: 'course' });
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingStructure, setIsGeneratingStructure] = useState(false);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  
  // Quick Add Lesson - Inline mode
  const [addingLessonToModule, setAddingLessonToModule] = useState<number | null>(null);
  const [quickLessonTitle, setQuickLessonTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Completion progress
  const completionProgress = useMemo(() => {
    let completed = 0;
    let total = 15;
    if (course.title) completed++;
    if (course.description) completed++;
    if (course.longDescription) completed++;
    if (course.track) completed++;
    if (course.skillLevel) completed++;
    if (course.instructorId) completed++;
    if (course.imageUrl) completed++;
    if (course.seo?.metaTitle) completed++;
    if (course.seo?.metaDescription) completed++;
    if (course.modules.length > 0) completed++;
    if (course.modules.some(m => m.lessons.length > 0)) completed++;
    if (course.benefitsSection?.title) completed++;
    if (course.benefitsSection?.benefits.length > 0) completed++;
    if (course.ctaSection?.title) completed++;
    if (course.format) completed++;
    return Math.round((completed / total) * 100);
  }, [course]);

  // Handlers
  const onCancel = () => navigate('/admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
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

  const startAddingLesson = (moduleIndex: number) => {
    setAddingLessonToModule(moduleIndex);
    setQuickLessonTitle('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleAddLessonKeyDown = (e: React.KeyboardEvent, moduleIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmAddLesson(moduleIndex);
    } else if (e.key === 'Escape') {
      setAddingLessonToModule(null);
      setQuickLessonTitle('');
    }
  };

  const confirmAddLesson = (moduleIndex: number) => {
    if (!quickLessonTitle.trim()) {
      showToast("❌ Digite um título para a aula");
      return;
    }

    const newLesson: Lesson = { 
      id: `les_${Date.now()}`, 
      title: quickLessonTitle, 
      duration: '10 min', 
      type: 'text', 
      xp: 10 
    };

    const newLessonIndex = course.modules[moduleIndex].lessons.length;
    
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].lessons = [...newModules[moduleIndex].lessons, newLesson];
      return { ...prev, modules: newModules };
    });

    setAddingLessonToModule(null);
    setQuickLessonTitle('');

    // Auto-select the new lesson for editing
    setTimeout(() => {
      setSelectedItem({ 
        type: 'lesson', 
        moduleIndex: moduleIndex, 
        lessonIndex: newLessonIndex 
      });
    }, 50);
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

          setCourse(prev => ({...prev, modules: newModules, title: prev.title || aiTopic }));
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
          const prompt = `Atua como um especialista em SEO. Gere meta title, meta description e keywords otimizadas para a página deste curso da FuturoOn. O público alvo são jovens da periferia buscando carreira em tecnologia.
          
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

  const handleImageUploadComplete = (url: string) => {
    setCourse(prev => ({...prev, imageUrl: url}));
    showToast('✅ Imagem do curso salva!');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course.title) {
      showToast("❌ Preencha ao menos o título do curso");
      return;
    }
    handleSaveCourse(course);
    navigate('/admin');
  };
  
  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors text-white";
  const labelClasses = "block text-sm font-semibold text-gray-300 mb-2";
  
  // Basic Info Tab
  const renderBasicsTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div><label className={labelClasses}>Título do Curso *</label><input type="text" name="title" value={course.title} onChange={handleChange} required className={inputClasses} placeholder="Ex: Python para Iniciantes" /></div>
      
      <div className="grid grid-cols-2 gap-6">
        <div><label className={labelClasses}>Trilha</label><select name="track" value={course.track} onChange={handleChange} className={inputClasses}>{tracks.map(t => (<option key={t.id} value={t.name}>{t.name}</option>))}</select></div>
        <div><label className={labelClasses}>Nível</label><select name="skillLevel" value={course.skillLevel} onChange={handleChange} className={inputClasses}><option>Iniciante</option><option>Intermediário</option><option>Avançado</option></select></div>
        <div><label className={labelClasses}>Formato</label><select name="format" value={course.format} onChange={handleChange} className={inputClasses}><option value="online">Online</option><option value="presencial">Presencial</option><option value="hibrido">Híbrido</option></select></div>
        <div><label className={labelClasses}>Duração</label><input type="text" name="duration" value={course.duration} onChange={handleChange} placeholder="Ex: 8 horas" className={inputClasses} /></div>
      </div>

      <div><label className={labelClasses}>Descrição Curta (para cards) *</label><input type="text" name="description" value={course.description} onChange={handleChange} required className={inputClasses} placeholder="Descrição concisa do curso" /></div>
      
      <div><label className={labelClasses}>Descrição Longa (página do curso) *</label><textarea name="longDescription" value={course.longDescription} onChange={handleChange} required className={inputClasses} rows={4} placeholder="Descrição detalhada..." /></div>

      <div className="grid grid-cols-2 gap-6">
        <div><label className={labelClasses}>Status de Inscrição</label><select name="enrollmentStatus" value={course.enrollmentStatus || 'soon'} onChange={handleChange} className={inputClasses}><option value="soon">Em Breve</option><option value="open">Abertas</option><option value="closed">Fechadas</option></select></div>
        <div><label className={labelClasses}>Instrutor</label><select name="instructorId" value={course.instructorId} onChange={handleChange} className={inputClasses}>{instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></div>
      </div>

      <div className="flex items-end gap-4">
        <div className="flex-1"><label className={labelClasses}>Capa do Curso</label><input type="text" name="imageUrl" value={course.imageUrl} onChange={handleChange} className={inputClasses} /></div>
        <Uploader pathnamePrefix={`courses/${course.id}`} onUploadComplete={handleImageUploadComplete}>{(trigger, loading) => <button type="button" onClick={trigger} disabled={loading} className="py-3 px-4 bg-[#8a4add]/20 text-[#c4b5fd] hover:bg-[#8a4add]/30 rounded-md transition-colors font-semibold text-sm">{loading ? 'Enviando...' : 'Upload'}</button>}</Uploader>
      </div>
    </motion.div>
  );

  // Landing Page Tab
  const renderLandingTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Hero */}
      <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">🎯 Seção Principal (Hero)</h3>
        <div className="space-y-4">
          <div><label className={labelClasses}>Subtítulo</label><input value={course.heroContent?.subtitle || ''} onChange={(e) => handleLandingPageChange('heroContent', 'subtitle', e.target.value)} className={inputClasses} /></div>
          <div><label className={labelClasses}>Linha de Título</label><input value={course.heroContent?.titleLine1 || ''} onChange={(e) => handleLandingPageChange('heroContent', 'titleLine1', e.target.value)} className={inputClasses} /></div>
          <div><label className={labelClasses}>Destaque do Título</label><input value={course.heroContent?.titleAccent || ''} onChange={(e) => handleLandingPageChange('heroContent', 'titleAccent', e.target.value)} className={inputClasses} /></div>
          <div><label className={labelClasses}>Descrição</label><textarea value={course.heroContent?.description || ''} onChange={(e) => handleLandingPageChange('heroContent', 'description', e.target.value)} className={inputClasses} rows={3} /></div>
        </div>
      </div>

      {/* Benefícios */}
      <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">✨ Benefícios</h3>
        <div className="space-y-4">
          <div><label className={labelClasses}>Título da Seção</label><input value={course.benefitsSection?.title || ''} onChange={(e) => handleLandingPageChange('benefitsSection', 'title', e.target.value)} className={inputClasses} /></div>
          <div><label className={labelClasses}>Subtítulo</label><input value={course.benefitsSection?.subtitle || ''} onChange={(e) => handleLandingPageChange('benefitsSection', 'subtitle', e.target.value)} className={inputClasses} /></div>
          
          <div className="space-y-3 border-t border-white/10 pt-4 mt-4">
            {course.benefitsSection?.benefits.map((benefit, idx) => (
              <div key={idx} className="bg-black/30 p-4 rounded-md relative">
                <button type="button" onClick={() => deleteBenefit('benefitsSection', idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-300">✕</button>
                <input value={benefit.title} onChange={(e) => handleBenefitChange('benefitsSection', idx, 'title', e.target.value)} className={inputClasses} placeholder="Título do benefício" />
                <textarea value={benefit.description} onChange={(e) => handleBenefitChange('benefitsSection', idx, 'description', e.target.value)} className={`${inputClasses} mt-2`} rows={2} placeholder="Descrição" />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addBenefit('benefitsSection')} className="text-sm font-semibold text-[#c4b5fd] hover:text-white">+ Adicionar Benefício</button>
        </div>
      </div>

      {/* Metodologia */}
      <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">🔧 Metodologia</h3>
        <div className="space-y-4">
          <div><label className={labelClasses}>Título da Seção</label><input value={course.methodologySection?.title || ''} onChange={(e) => handleLandingPageChange('methodologySection', 'title', e.target.value)} className={inputClasses} /></div>
          <div><label className={labelClasses}>Subtítulo</label><input value={course.methodologySection?.subtitle || ''} onChange={(e) => handleLandingPageChange('methodologySection', 'subtitle', e.target.value)} className={inputClasses} /></div>
          
          <div className="space-y-3 border-t border-white/10 pt-4 mt-4">
            {course.methodologySection?.benefits.map((item, idx) => (
              <div key={idx} className="bg-black/30 p-4 rounded-md relative">
                <button type="button" onClick={() => deleteBenefit('methodologySection', idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-300">✕</button>
                <input value={item.title} onChange={(e) => handleBenefitChange('methodologySection', idx, 'title', e.target.value)} className={inputClasses} placeholder="Título" />
                <textarea value={item.description} onChange={(e) => handleBenefitChange('methodologySection', idx, 'description', e.target.value)} className={`${inputClasses} mt-2`} rows={2} placeholder="Descrição" />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addBenefit('methodologySection')} className="text-sm font-semibold text-[#c4b5fd] hover:text-white">+ Adicionar Item</button>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">🎁 Chamada para Ação</h3>
        <div className="space-y-4">
          <div><label className={labelClasses}>Título</label><input value={course.ctaSection?.title || ''} onChange={(e) => handleLandingPageChange('ctaSection', 'title', e.target.value)} className={inputClasses} /></div>
          <div><label className={labelClasses}>Descrição</label><textarea value={course.ctaSection?.description || ''} onChange={(e) => handleLandingPageChange('ctaSection', 'description', e.target.value)} className={inputClasses} rows={2} /></div>
        </div>
      </div>
    </motion.div>
  );

  // Modules Tab
  const renderModulesTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-[#8a4add]/10 border border-[#8a4add]/30 rounded-lg p-4">
        <h3 className="font-semibold text-white mb-3">✨ Gerar Estrutura com IA</h3>
        <div className="flex gap-2">
          <input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="Ex: React para iniciantes" className={`${inputClasses} flex-1`} />
          <button type="button" onClick={handleGenerateStructureWithAI} disabled={isGeneratingStructure} className="py-3 px-4 bg-[#8a4add] text-white rounded-md hover:bg-[#7c3aed] disabled:opacity-50 font-semibold transition-colors">
            {isGeneratingStructure ? '⏳' : '✨'} Gerar
          </button>
        </div>
      </div>

      {course.modules.length === 0 ? (
        <div className="text-center py-12 bg-white/[0.02] border border-white/10 rounded-lg">
          <p className="text-gray-400 mb-3">Nenhum módulo criado ainda</p>
          <button type="button" onClick={addModule} className="text-[#c4b5fd] hover:text-white font-semibold">+ Criar Primeiro Módulo</button>
        </div>
      ) : (
        <div className="space-y-4">
          {course.modules.map((module, mIdx) => (
            <motion.div key={module.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg">{mIdx + 1}. {module.title}</h4>
                  <p className="text-gray-400 text-sm mt-1">{module.lessons.length} aulas</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setSelectedItem({ type: 'module', moduleIndex: mIdx })} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-sm font-semibold transition-colors">Editar</button>
                  <button type="button" onClick={() => deleteModule(mIdx)} className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-sm font-semibold transition-colors">Deletar</button>
                </div>
              </div>
              
              <div className="space-y-2 border-t border-white/10 pt-3">
                {module.lessons.map((lesson, lIdx) => (
                  <div key={lesson.id} className="flex items-center justify-between bg-black/30 p-3 rounded text-sm group">
                    <div><span className="text-gray-400">{lesson.title}</span><span className="text-gray-500 ml-2">({lesson.duration})</span></div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setSelectedItem({ type: 'lesson', moduleIndex: mIdx, lessonIndex: lIdx })} className="text-[#c4b5fd] hover:text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">Editar</button>
                      <button type="button" onClick={() => deleteLesson(mIdx, lIdx)} className="text-red-400 hover:text-red-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Deletar</button>
                    </div>
                  </div>
                ))}

                {/* Inline Add Lesson Form */}
                {addingLessonToModule === mIdx ? (
                  <div className="bg-[#8a4add]/10 border border-[#8a4add]/30 p-3 rounded flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={quickLessonTitle}
                      onChange={(e) => setQuickLessonTitle(e.target.value)}
                      onKeyDown={(e) => handleAddLessonKeyDown(e, mIdx)}
                      placeholder="Nome da aula..."
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:ring-2 focus:ring-[#8a4add] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => confirmAddLesson(mIdx)}
                      className="px-3 py-2 bg-[#8a4add] hover:bg-[#7c3aed] text-white rounded text-sm font-semibold transition-colors"
                    >
                      ✓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddingLessonToModule(null);
                        setQuickLessonTitle('');
                      }}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => startAddingLesson(mIdx)} 
                    className="w-full text-center py-2 text-[#c4b5fd] hover:text-white text-sm font-semibold border-t border-white/10 mt-2 transition-colors"
                  >
                    + Adicionar Aula
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      <button type="button" onClick={addModule} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-white transition-colors">+ Adicionar Módulo</button>
    </motion.div>
  );

  // SEO Tab
  const renderSeoTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-end">
        <button type="button" onClick={handleGenerateSeo} disabled={isGeneratingSeo} className="flex items-center gap-2 bg-[#8a4add]/20 text-[#c4b5fd] hover:bg-[#8a4add]/30 px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-50 transition-colors">
          {isGeneratingSeo ? '⏳ Gerando...' : '✨ Gerar com IA'}
        </button>
      </div>

      <div><label className={labelClasses}>Meta Title (60 caracteres máx) *</label><input value={course.seo?.metaTitle || ''} onChange={(e) => handleSeoChange('metaTitle', e.target.value)} className={inputClasses} maxLength={60} /><p className="text-xs text-gray-500 mt-1 text-right">{course.seo?.metaTitle?.length || 0}/60</p></div>

      <div><label className={labelClasses}>Meta Description (160 caracteres máx) *</label><textarea value={course.seo?.metaDescription || ''} onChange={(e) => handleSeoChange('metaDescription', e.target.value)} className={inputClasses} rows={2} maxLength={160} /><p className="text-xs text-gray-500 mt-1 text-right">{course.seo?.metaDescription?.length || 0}/160</p></div>

      <div><label className={labelClasses}>Palavras-chave (separadas por vírgula)</label><input value={course.seo?.keywords?.join(', ') || ''} onChange={(e) => handleSeoChange('keywords', e.target.value)} className={inputClasses} placeholder="python, programação, backend" /></div>
    </motion.div>
  );

  // Module Editor
  const renderModuleEditor = () => {
    if (selectedItem.type !== 'module') return null;
    const module = course.modules[selectedItem.moduleIndex];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div><label className={labelClasses}>Título do Módulo</label><input type="text" name="title" value={module.title} onChange={(e) => handleModuleChange(e, selectedItem.moduleIndex)} className={inputClasses} /></div>
      </motion.div>
    );
  };

  // Lesson Editor
  const renderLessonEditor = () => {
    if (selectedItem.type !== 'lesson') return null;
    const lesson = course.modules[selectedItem.moduleIndex].lessons[selectedItem.lessonIndex];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div><label className={labelClasses}>Título da Aula</label><input type="text" name="title" value={lesson.title} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} /></div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className={labelClasses}>Duração</label><input type="text" name="duration" value={lesson.duration} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} /></div>
          <div><label className={labelClasses}>XP</label><input type="number" name="xp" value={lesson.xp} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} /></div>
          <div><label className={labelClasses}>Tipo</label><select name="type" value={lesson.type} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses}><option value="text">Texto</option><option value="video">Vídeo</option></select></div>
        </div>
        {lesson.type === 'video' && <div><label className={labelClasses}>URL do Vídeo (YouTube)</label><input type="text" name="videoUrl" value={lesson.videoUrl || ''} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} /></div>}
        
        <RichContentEditor label="Objetivo da Aula" value={lesson.objective || ''} onChange={(val) => handleLessonContentChange(val, 'objective', selectedItem.moduleIndex, selectedItem.lessonIndex)} textareaRef={useRef(null)} />
        <RichContentEditor label="Conteúdo Principal" value={lesson.mainContent || ''} onChange={(val) => handleLessonContentChange(val, 'mainContent', selectedItem.moduleIndex, selectedItem.lessonIndex)} textareaRef={useRef(null)} />
        <RichContentEditor label="Resumo" value={lesson.summary || ''} onChange={(val) => handleLessonContentChange(val, 'summary', selectedItem.moduleIndex, selectedItem.lessonIndex)} textareaRef={useRef(null)} />
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Header */}
      <div className="sticky top-0 bg-[#09090B]/95 border-b border-white/10 z-30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black">{courseId === 'new' ? '✨ Novo Curso' : '📝 Editor de Curso'}</h1>
              <p className="text-gray-400 text-sm mt-1">Crie um curso incrível para a comunidade FuturoOn</p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onCancel} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors">Cancelar</button>
              <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white rounded-lg font-semibold hover:opacity-90 transition-all">💾 Salvar</button>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">Progresso de Conclusão</p>
              <p className="text-xs font-semibold text-[#c4b5fd]">{completionProgress}%</p>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983] transition-all duration-300" style={{ width: `${completionProgress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Structure */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4 sticky top-32">
              <h3 className="font-bold text-white mb-4">📚 Estrutura</h3>
              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                <button type="button" onClick={() => setSelectedItem({ type: 'course' })} className={`w-full text-left px-3 py-2 rounded transition-colors ${selectedItem.type === 'course' ? 'bg-[#8a4add]/30 text-white' : 'text-gray-300 hover:bg-white/10'}`}>ℹ️ Informações</button>
                {course.modules.map((mod, idx) => (
                  <div key={mod.id}>
                    <button type="button" onClick={() => setSelectedItem({ type: 'module', moduleIndex: idx })} className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${selectedItem.type === 'module' && selectedItem.moduleIndex === idx ? 'bg-[#8a4add]/30 text-white' : 'text-gray-300 hover:bg-white/10'}`}>📖 {mod.title}</button>
                    <div className="pl-4 space-y-1">
                      {mod.lessons.map((les, lIdx) => (
                        <button key={les.id} type="button" onClick={() => setSelectedItem({ type: 'lesson', moduleIndex: idx, lessonIndex: lIdx })} className={`w-full text-left px-2 py-1 rounded transition-colors text-xs ${selectedItem.type === 'lesson' && selectedItem.moduleIndex === idx && selectedItem.lessonIndex === lIdx ? 'bg-[#f27983]/30 text-white' : 'text-gray-400 hover:text-white'}`}>→ {les.title}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            {selectedItem.type === 'course' ? (
              <>
                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
                  {(['basics', 'landing', 'modules', 'seo'] as const).map((tab) => (
                    <button key={tab} type="button" onClick={() => setEditTab(tab)} className={`px-4 py-2 font-semibold transition-colors ${editTab === tab ? 'text-white border-b-2 border-[#8a4add] -mb-4 pb-4' : 'text-gray-400 hover:text-gray-300'}`}>
                      {tab === 'basics' && '📋 Informações'}
                      {tab === 'landing' && '🎨 Página de Destino'}
                      {tab === 'modules' && '📚 Módulos & Aulas'}
                      {tab === 'seo' && '🔍 SEO'}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="bg-white/[0.02] border border-white/10 rounded-lg p-8">
                  {editTab === 'basics' && renderBasicsTab()}
                  {editTab === 'landing' && renderLandingTab()}
                  {editTab === 'modules' && renderModulesTab()}
                  {editTab === 'seo' && renderSeoTab()}
                </div>
              </>
            ) : (
              <div className="bg-white/[0.02] border border-white/10 rounded-lg p-8">
                {selectedItem.type === 'module' && renderModuleEditor()}
                {selectedItem.type === 'lesson' && renderLessonEditor()}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEditor;
