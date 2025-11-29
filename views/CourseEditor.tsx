
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, Module, Lesson } from '../types';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../App';
import RichContentEditor from '../components/RichContentEditor';
import Uploader from '../components/Uploader';
import EditorHeader from '../components/EditorHeader';

// --- Types & Helpers ---

type EditorTab = 'basics' | 'curriculum' | 'marketing' | 'seo' | 'settings';

const stringToSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

const cleanAndParseJSON = (text: string) => {
    try {
        // Find the first occurrence of { and the last occurrence of }
        const startIndex = text.indexOf('{');
        const endIndex = text.lastIndexOf('}');
        
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            const jsonString = text.substring(startIndex, endIndex + 1);
            return JSON.parse(jsonString);
        }
        
        // Fallback: try parsing the whole text (cleaned)
        const jsonString = text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON from AI:", text);
        throw new Error("A IA retornou um formato inválido. Tente novamente.");
    }
};

// --- Sub-Components (Defined Outside) ---

const TabButton: React.FC<{ 
    id: EditorTab; 
    label: string; 
    icon: string; 
    activeTab: EditorTab; 
    onClick: (id: EditorTab) => void 
}> = ({ id, label, icon, activeTab, onClick }) => (
    <button
        type="button"
        onClick={() => onClick(id)}
        className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
            activeTab === id 
            ? 'bg-[#8a4add] text-white shadow-lg shadow-[#8a4add]/20' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
    >
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
    </button>
);

const AiButton: React.FC<{ onClick: () => void; isLoading: boolean; label?: string }> = ({ onClick, isLoading, label = "Gerar com IA" }) => (
    <button 
        type="button" 
        onClick={onClick}
        disabled={isLoading}
        className="flex items-center gap-2 text-xs font-bold bg-[#8a4add]/10 text-[#c4b5fd] px-3 py-1.5 rounded-lg hover:bg-[#8a4add]/20 disabled:opacity-50 transition-all border border-[#8a4add]/20"
    >
        {isLoading ? (
            <><svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Gerando...</>
        ) : (
            <>✨ {label}</>
        )}
    </button>
);

// --- Main Component ---

const CourseEditor: React.FC = () => {
  const { user, instructors, courses, tracks, handleSaveCourse, showToast } = useAppContext();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const DRAFT_KEY = `draft_course_${courseId || 'new'}`;
  const lessonContentRef = useRef<HTMLTextAreaElement>(null); // MOVED TO TOP LEVEL

  // -- Initial State Setup --
  const getNewCourseTemplate = useMemo(() => ({
    id: `course_${Date.now()}`,
    title: '', slug: '', description: '', longDescription: '',
    track: tracks[0]?.name || '', 
    imageUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop', 
    duration: '',
    skillLevel: 'Iniciante' as Course['skillLevel'], 
    instructorId: user?.id || '',
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
  const [activeTab, setActiveTab] = useState<EditorTab>('basics');
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [draftFound, setDraftFound] = useState<Course | null>(null);
  
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{mIndex: number, lIndex: number} | null>(null);
  
  // -- Effects --

  useEffect(() => {
    if (existingCourse) {
      setCourse({ ...existingCourse, seo: existingCourse.seo || { metaTitle: '', metaDescription: '', keywords: [] } });
    } else if (courseId === 'new') {
      setCourse(getNewCourseTemplate);
    }
  }, [existingCourse, courseId, getNewCourseTemplate]);

  // Auto-save Logic
  useEffect(() => {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
          try {
              const parsedDraft = JSON.parse(savedDraft);
              if (JSON.stringify(parsedDraft) !== JSON.stringify(course)) {
                  setDraftFound(parsedDraft);
              }
          } catch (e) { console.error(e); }
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

  // -- Handlers --

  const handleRestoreDraft = () => {
      if (draftFound) {
          setCourse(draftFound);
          setDraftFound(null);
          showToast("📂 Rascunho restaurado!");
      }
  };

  const handleDiscardDraft = () => {
      localStorage.removeItem(DRAFT_KEY);
      setDraftFound(null);
      showToast("🗑️ Rascunho descartado.");
  };

  const onCancel = () => navigate('/admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prev => {
        const updates: any = { [name]: value };
        if (name === 'title' && (!prev.slug || courseId === 'new')) updates.slug = stringToSlug(value);
        return { ...prev, ...updates };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveCourse(course);
    localStorage.removeItem(DRAFT_KEY);
    navigate('/admin');
  };

  // -- Curriculum Handlers --

  const addModule = () => {
    const newModule: Module = { id: `mod_${Date.now()}`, title: 'Novo Módulo', lessons: [] };
    setCourse(prev => ({ ...prev, modules: [...prev.modules, newModule] }));
  };

  const updateModule = (index: number, field: string, value: string) => {
      setCourse(prev => {
          const newModules = [...prev.modules];
          newModules[index] = { ...newModules[index], [field]: value };
          return { ...prev, modules: newModules };
      });
  };

  const deleteModule = (index: number) => {
      if(!window.confirm("Excluir módulo e todas as aulas?")) return;
      setCourse(prev => ({ ...prev, modules: prev.modules.filter((_, i) => i !== index) }));
  };

  const addLesson = (mIndex: number) => {
      const newLesson: Lesson = { id: `les_${Date.now()}`, title: 'Nova Aula', duration: '10 min', type: 'text', xp: 10, mainContent: '' };
      setCourse(prev => {
          const newModules = [...prev.modules];
          newModules[mIndex].lessons = [...newModules[mIndex].lessons, newLesson];
          return { ...prev, modules: newModules };
      });
      setEditingLesson({ mIndex, lIndex: course.modules[mIndex].lessons.length });
  };

  const updateLesson = (mIndex: number, lIndex: number, field: keyof Lesson, value: any) => {
      setCourse(prev => {
          const newModules = [...prev.modules];
          const newLessons = [...newModules[mIndex].lessons];
          newLessons[lIndex] = { ...newLessons[lIndex], [field]: value };
          newModules[mIndex].lessons = newLessons;
          return { ...prev, modules: newModules };
      });
  };

  const deleteLesson = (mIndex: number, lIndex: number) => {
      if(editingLesson?.mIndex === mIndex && editingLesson?.lIndex === lIndex) setEditingLesson(null);
      setCourse(prev => {
          const newModules = [...prev.modules];
          newModules[mIndex].lessons = newModules[mIndex].lessons.filter((_, i) => i !== lIndex);
          return { ...prev, modules: newModules };
      });
  };

  const moveItem = (type: 'module' | 'lesson', mIndex: number, lIndex: number | null, direction: 'up' | 'down') => {
      setCourse(prev => {
          const newModules = [...prev.modules];
          if (type === 'module') {
              if (direction === 'up' && mIndex === 0) return prev;
              if (direction === 'down' && mIndex === newModules.length - 1) return prev;
              const target = direction === 'up' ? mIndex - 1 : mIndex + 1;
              [newModules[mIndex], newModules[target]] = [newModules[target], newModules[mIndex]];
          } else if (lIndex !== null) {
              const lessons = [...newModules[mIndex].lessons];
              if (direction === 'up' && lIndex === 0) return prev;
              if (direction === 'down' && lIndex === lessons.length - 1) return prev;
              const target = direction === 'up' ? lIndex - 1 : lIndex + 1;
              [lessons[lIndex], lessons[target]] = [lessons[target], lessons[lIndex]];
              newModules[mIndex].lessons = lessons;
          }
          return { ...prev, modules: newModules };
      });
  };

  const handleAiGenerate = async (prompt: string, key: string, onSuccess: (data: any) => void) => {
      if (!course.title) { showToast("⚠️ Defina um título para o curso primeiro."); return; }
      setAiLoading(key);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const fullPrompt = `Contexto: Curso "${course.title}". Descrição: "${course.description}". Público: Jovens da periferia. ${prompt}`;
          const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: fullPrompt });
          const result = cleanAndParseJSON(response.text);
          onSuccess(result);
          showToast("✨ Gerado com sucesso!");
      } catch (e) {
          console.error(e);
          showToast("❌ Erro na geração IA.");
      } finally {
          setAiLoading(null);
      }
  };

  const inputClasses = "w-full p-3 bg-[#18181B] rounded-xl border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors text-sm text-white placeholder-gray-600";
  const labelClasses = "block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-[#09090B]">
      <EditorHeader
        title={courseId === 'new' ? 'Criar Novo Curso' : 'Editar Curso'}
        subtitle={
          <>
            {course.title || 'Sem Título'} 
            {lastAutoSave && <span className="opacity-50"> • Salvo às {lastAutoSave.toLocaleTimeString()}</span>}
          </>
        }
        onBack={onCancel}
        actions={
          <button onClick={handleSubmit} className="bg-[#8a4add] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#7c3aed] transition-colors shadow-lg shadow-[#8a4add]/20 text-sm">
            Salvar Curso
          </button>
        }
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {draftFound && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-yellow-200 text-sm">
              <span>⚠️</span> Rascunho não salvo encontrado.
            </div>
            <div className="flex gap-3">
              <button onClick={handleDiscardDraft} className="text-xs font-bold text-red-400 hover:text-red-300">Descartar</button>
              <button onClick={handleRestoreDraft} className="text-xs font-bold bg-yellow-500/20 text-yellow-200 px-3 py-1.5 rounded-lg hover:bg-yellow-500/30">Restaurar</button>
            </div>
          </div>
        )}

      <div className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-3 space-y-2">
              <TabButton id="basics" label="Informações Básicas" icon="📝" activeTab={activeTab} onClick={setActiveTab} />
              <TabButton id="curriculum" label="Currículo & Aulas" icon="📚" activeTab={activeTab} onClick={setActiveTab} />
              <TabButton id="marketing" label="Landing Page" icon="🎨" activeTab={activeTab} onClick={setActiveTab} />
              <TabButton id="seo" label="SEO & Metadados" icon="🔍" activeTab={activeTab} onClick={setActiveTab} />
              <TabButton id="settings" label="Configurações" icon="⚙️" activeTab={activeTab} onClick={setActiveTab} />
          </div>

          <div className="lg:col-span-9">
              {activeTab === 'basics' && (
                  <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 space-y-6 animate-fade-in">
                      <div className="grid md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                              <label className={labelClasses}>Título do Curso</label>
                              <input name="title" value={course.title} onChange={handleChange} className={inputClasses} placeholder="Ex: Desenvolvimento Web Moderno" />
                          </div>
                          <div className="md:col-span-2">
                              <label className={labelClasses}>Descrição Curta</label>
                              <textarea name="description" value={course.description} onChange={handleChange} className={inputClasses} rows={2} placeholder="Uma frase impactante sobre o curso." />
                          </div>
                          <div>
                              <label className={labelClasses}>Slug (URL)</label>
                              <input name="slug" value={course.slug || ''} onChange={handleChange} className={inputClasses} placeholder="auto-gerado" />
                          </div>
                          <div>
                              <label className={labelClasses}>Duração Estimada</label>
                              <input name="duration" value={course.duration} onChange={handleChange} className={inputClasses} placeholder="Ex: 40 horas" />
                          </div>
                          <div>
                              <label className={labelClasses}>Trilha</label>
                              <select name="track" value={course.track} onChange={handleChange} className={inputClasses}>
                                  {tracks.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                              </select>
                          </div>
                          <div>
                              <label className={labelClasses}>Nível</label>
                              <select name="skillLevel" value={course.skillLevel} onChange={handleChange} className={inputClasses}>
                                  <option>Iniciante</option>
                                  <option>Intermediário</option>
                                  <option>Avançado</option>
                              </select>
                          </div>
                          <div className="md:col-span-2">
                              <label className={labelClasses}>Capa do Curso</label>
                              <div className="flex gap-4 items-center">
                                  <div className="flex-1">
                                      <input name="imageUrl" value={course.imageUrl} onChange={handleChange} className={inputClasses} placeholder="https://..." />
                                  </div>
                                  <Uploader pathnamePrefix={`courses/${course.id}`} onUploadComplete={(url) => setCourse(prev => ({...prev, imageUrl: url}))}>
                                      {(trigger, loading) => (
                                          <button type="button" onClick={trigger} disabled={loading} className="h-[46px] px-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 text-sm font-bold text-gray-300">
                                              {loading ? '...' : 'Upload'}
                                          </button>
                                      )}
                                  </Uploader>
                              </div>
                              {course.imageUrl && <img src={course.imageUrl} alt="Preview" className="mt-4 h-40 rounded-xl object-cover border border-white/10" />}
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'curriculum' && (
                  <div className="space-y-6 animate-fade-in">
                      <div className="flex justify-between items-center bg-[#121212] p-4 rounded-xl border border-white/10">
                          <div>
                              <h2 className="text-lg font-bold text-white">Estrutura do Curso</h2>
                              <p className="text-xs text-gray-400">Organize o conteúdo em módulos e aulas.</p>
                          </div>
                          <div className="flex gap-2">
                              <AiButton 
                                  label="Gerar Estrutura" 
                                  isLoading={aiLoading === 'structure'} 
                                  onClick={() => handleAiGenerate(
                                      `Crie uma estrutura de curso JSON (array 'modules' com 'title' e 'lessons' array com 'title', 'duration', 'xp') sobre o tema "${course.title}".`,
                                      'structure',
                                      (res) => setCourse(prev => ({ ...prev, modules: res.modules.map((m: any) => ({...m, id: `mod_${Date.now()}_${Math.random()}`, lessons: m.lessons.map((l:any) => ({...l, id: `l_${Math.random()}`, type:'text'}))})) }))
                                  )} 
                              />
                              <button onClick={addModule} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">+ Módulo</button>
                          </div>
                      </div>

                      {editingLesson && (
                          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                              <div className="bg-[#121212] w-full max-w-4xl h-[90vh] rounded-2xl border border-white/10 flex flex-col shadow-2xl">
                                  <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                      <h3 className="font-bold text-white">Editando: {course.modules[editingLesson.mIndex].lessons[editingLesson.lIndex].title}</h3>
                                      <button onClick={() => setEditingLesson(null)} className="text-gray-400 hover:text-white text-xl">&times;</button>
                                  </div>
                                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                      <div className="grid md:grid-cols-2 gap-4">
                                          <div><label className={labelClasses}>Título da Aula</label><input value={course.modules[editingLesson.mIndex].lessons[editingLesson.lIndex].title} onChange={(e) => updateLesson(editingLesson.mIndex, editingLesson.lIndex, 'title', e.target.value)} className={inputClasses} /></div>
                                          <div><label className={labelClasses}>Duração</label><input value={course.modules[editingLesson.mIndex].lessons[editingLesson.lIndex].duration} onChange={(e) => updateLesson(editingLesson.mIndex, editingLesson.lIndex, 'duration', e.target.value)} className={inputClasses} /></div>
                                          <div><label className={labelClasses}>Tipo</label><select value={course.modules[editingLesson.mIndex].lessons[editingLesson.lIndex].type} onChange={(e) => updateLesson(editingLesson.mIndex, editingLesson.lIndex, 'type', e.target.value)} className={inputClasses}><option value="text">Texto/Artigo</option><option value="video">Vídeo</option></select></div>
                                          <div><label className={labelClasses}>XP</label><input type="number" value={course.modules[editingLesson.mIndex].lessons[editingLesson.lIndex].xp} onChange={(e) => updateLesson(editingLesson.mIndex, editingLesson.lIndex, 'xp', parseInt(e.target.value))} className={inputClasses} /></div>
                                      </div>
                                      {course.modules[editingLesson.mIndex].lessons[editingLesson.lIndex].type === 'video' && (
                                          <div><label className={labelClasses}>URL do Vídeo (Youtube)</label><input value={course.modules[editingLesson.mIndex].lessons[editingLesson.lIndex].videoUrl || ''} onChange={(e) => updateLesson(editingLesson.mIndex, editingLesson.lIndex, 'videoUrl', e.target.value)} className={inputClasses} /></div>
                                      )}
                                      <div className="h-px bg-white/10 my-4"></div>
                                      <RichContentEditor 
                                          label="Conteúdo da Aula (Markdown)"
                                          value={course.modules[editingLesson.mIndex].lessons[editingLesson.lIndex].mainContent || ''}
                                          onChange={(val) => updateLesson(editingLesson.mIndex, editingLesson.lIndex, 'mainContent', val)}
                                          textareaRef={lessonContentRef}
                                          rows={15}
                                      />
                                  </div>
                                  <div className="p-4 border-t border-white/10 flex justify-end">
                                      <button onClick={() => setEditingLesson(null)} className="bg-[#8a4add] text-white px-6 py-2 rounded-lg font-bold">Concluir Edição</button>
                                  </div>
                              </div>
                          </div>
                      )}

                      <div className="space-y-4">
                          {course.modules.map((module, mIndex) => (
                              <div key={module.id} className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden">
                                  <div className="p-4 bg-white/5 flex items-center gap-4">
                                      <div className="flex flex-col gap-1">
                                          <button onClick={() => moveItem('module', mIndex, null, 'up')} className="text-gray-500 hover:text-white text-xs">▲</button>
                                          <button onClick={() => moveItem('module', mIndex, null, 'down')} className="text-gray-500 hover:text-white text-xs">▼</button>
                                      </div>
                                      <div className="flex-1">
                                          <input 
                                              value={module.title} 
                                              onChange={(e) => updateModule(mIndex, 'title', e.target.value)} 
                                              className="bg-transparent text-white font-bold w-full focus:outline-none placeholder-gray-600" 
                                              placeholder="Nome do Módulo" 
                                          />
                                      </div>
                                      <button onClick={() => deleteModule(mIndex)} className="text-red-400 hover:bg-red-500/20 p-2 rounded transition-colors">🗑️</button>
                                  </div>
                                  <div className="p-2 space-y-2 bg-black/20">
                                      {module.lessons.map((lesson, lIndex) => (
                                          <div key={lesson.id} className="flex items-center gap-3 p-3 bg-[#18181b] rounded-lg border border-white/5 group hover:border-white/20 transition-all">
                                              <div className="text-gray-600 font-mono text-xs w-6">{lIndex + 1}</div>
                                              <div className="flex-1">
                                                  <p className="text-sm font-medium text-white">{lesson.title}</p>
                                                  <p className="text-xs text-gray-500">{lesson.type} • {lesson.duration}</p>
                                              </div>
                                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <button onClick={() => moveItem('lesson', mIndex, lIndex, 'up')} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded">▲</button>
                                                  <button onClick={() => moveItem('lesson', mIndex, lIndex, 'down')} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded">▼</button>
                                                  <button onClick={() => setEditingLesson({mIndex, lIndex})} className="px-3 py-1.5 bg-[#8a4add]/20 text-[#c4b5fd] text-xs font-bold rounded hover:bg-[#8a4add]/30">Editar</button>
                                                  <button onClick={() => deleteLesson(mIndex, lIndex)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-white/10 rounded">✕</button>
                                              </div>
                                          </div>
                                      ))}
                                      <button onClick={() => addLesson(mIndex)} className="w-full py-2 text-xs font-bold text-gray-500 hover:text-[#c4b5fd] hover:bg-white/5 rounded-lg transition-colors border border-dashed border-white/10">+ Adicionar Aula</button>
                                  </div>
                              </div>
                          ))}
                          {course.modules.length === 0 && <div className="text-center py-12 text-gray-500">Nenhum módulo criado.</div>}
                      </div>
                  </div>
              )}

              {activeTab === 'marketing' && (
                  <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 space-y-8 animate-fade-in">
                      <div>
                          <div className="flex justify-between items-center mb-4">
                              <h3 className="text-white font-bold text-lg">Hero (Topo)</h3>
                              <AiButton 
                                  isLoading={aiLoading === 'hero'}
                                  onClick={() => handleAiGenerate(`Gere JSON para Hero Section da landing page: {"subtitle": "curto", "titleLine1": "impacto", "titleAccent": "destaque", "description": "2 frases"}.`, 'hero', (res) => setCourse(prev => ({...prev, heroContent: res})))} 
                              />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                              <div><label className={labelClasses}>Subtítulo (Tag)</label><input name="subtitle" value={course.heroContent?.subtitle} onChange={(e) => setCourse(prev => ({...prev, heroContent: {...prev.heroContent!, subtitle: e.target.value}}))} className={inputClasses} /></div>
                              <div><label className={labelClasses}>Título Principal</label><input name="titleLine1" value={course.heroContent?.titleLine1} onChange={(e) => setCourse(prev => ({...prev, heroContent: {...prev.heroContent!, titleLine1: e.target.value}}))} className={inputClasses} /></div>
                              <div><label className={labelClasses}>Título Destaque</label><input name="titleAccent" value={course.heroContent?.titleAccent} onChange={(e) => setCourse(prev => ({...prev, heroContent: {...prev.heroContent!, titleAccent: e.target.value}}))} className={inputClasses} /></div>
                              <div className="md:col-span-2"><label className={labelClasses}>Descrição</label><textarea name="description" value={course.heroContent?.description} onChange={(e) => setCourse(prev => ({...prev, heroContent: {...prev.heroContent!, description: e.target.value}}))} className={inputClasses} rows={3} /></div>
                          </div>
                      </div>
                      
                      <div className="h-px bg-white/10"></div>

                      <div>
                          <div className="flex justify-between items-center mb-4">
                              <h3 className="text-white font-bold text-lg">Benefícios</h3>
                              <AiButton 
                                  isLoading={aiLoading === 'benefits'}
                                  onClick={() => handleAiGenerate(`Gere JSON para seção de benefícios: {"title": "...", "subtitle": "...", "benefits": [{"title": "...", "description": "..."}]}.`, 'benefits', (res) => setCourse(prev => ({...prev, benefitsSection: res})))} 
                              />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                              <input value={course.benefitsSection?.title} onChange={(e) => setCourse(prev => ({...prev, benefitsSection: {...prev.benefitsSection!, title: e.target.value}}))} className={inputClasses} placeholder="Título da Seção" />
                              <input value={course.benefitsSection?.subtitle} onChange={(e) => setCourse(prev => ({...prev, benefitsSection: {...prev.benefitsSection!, subtitle: e.target.value}}))} className={inputClasses} placeholder="Subtítulo" />
                          </div>
                          <div className="mt-4 space-y-3">
                              {course.benefitsSection?.benefits.map((b, i) => (
                                  <div key={i} className="bg-white/5 p-3 rounded-lg flex gap-3">
                                      <span className="text-gray-500 font-mono text-xs">{i+1}</span>
                                      <div className="flex-1 grid gap-2">
                                          <input value={b.title} onChange={(e) => {const newB = [...course.benefitsSection!.benefits]; newB[i].title = e.target.value; setCourse(prev => ({...prev, benefitsSection: {...prev.benefitsSection!, benefits: newB}}))}} className="bg-transparent text-white text-sm font-bold border-b border-white/10 pb-1 focus:outline-none" placeholder="Título do Benefício" />
                                          <input value={b.description} onChange={(e) => {const newB = [...course.benefitsSection!.benefits]; newB[i].description = e.target.value; setCourse(prev => ({...prev, benefitsSection: {...prev.benefitsSection!, benefits: newB}}))}} className="bg-transparent text-gray-400 text-xs focus:outline-none" placeholder="Descrição" />
                                      </div>
                                      <button onClick={() => {const newB = course.benefitsSection!.benefits.filter((_, idx) => idx !== i); setCourse(prev => ({...prev, benefitsSection: {...prev.benefitsSection!, benefits: newB}}))}} className="text-red-400">&times;</button>
                                  </div>
                              ))}
                              <button onClick={() => setCourse(prev => ({...prev, benefitsSection: {...prev.benefitsSection!, benefits: [...prev.benefitsSection!.benefits, {title: '', description: ''}]}}))} className="text-xs text-[#c4b5fd] font-bold">+ Adicionar Benefício</button>
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'seo' && (
                  <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 space-y-6 animate-fade-in">
                      <div className="flex justify-between items-center">
                          <h2 className="text-lg font-bold text-white">Otimização para Motores de Busca</h2>
                          <AiButton 
                              isLoading={aiLoading === 'seo'}
                              label="Gerar SEO Otimizado"
                              onClick={() => handleAiGenerate(`Gere JSON SEO para o curso "${course.title}": {"metaTitle": "max 60 chars", "metaDescription": "max 160 chars", "keywords": ["kw1", "kw2"]}.`, 'seo', (res) => setCourse(prev => ({...prev, seo: res})))} 
                          />
                      </div>
                      <div><label className={labelClasses}>Meta Title</label><input value={course.seo?.metaTitle} onChange={(e) => setCourse(prev => ({...prev, seo: {...prev.seo!, metaTitle: e.target.value}}))} className={inputClasses} maxLength={60} /></div>
                      <div><label className={labelClasses}>Meta Description</label><textarea value={course.seo?.metaDescription} onChange={(e) => setCourse(prev => ({...prev, seo: {...prev.seo!, metaDescription: e.target.value}}))} className={inputClasses} rows={3} maxLength={160} /></div>
                      <div><label className={labelClasses}>Palavras-chave (separadas por vírgula)</label><input value={course.seo?.keywords?.join(', ')} onChange={(e) => setCourse(prev => ({...prev, seo: {...prev.seo!, keywords: e.target.value.split(',').map(k => k.trim())}}))} className={inputClasses} /></div>
                  </div>
              )}

              {activeTab === 'settings' && (
                  <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 space-y-6 animate-fade-in">
                      <h2 className="text-lg font-bold text-white">Configurações de Acesso</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                          <div>
                              <label className={labelClasses}>Status das Inscrições</label>
                              <select name="enrollmentStatus" value={course.enrollmentStatus} onChange={handleChange} className={inputClasses}>
                                  <option value="open">Abertas</option>
                                  <option value="closed">Fechadas</option>
                                  <option value="soon">Em Breve</option>
                              </select>
                          </div>
                          <div>
                              <label className={labelClasses}>Formato</label>
                              <select name="format" value={course.format} onChange={handleChange} className={inputClasses}>
                                  <option value="online">Online</option>
                                  <option value="presencial">Presencial</option>
                                  <option value="hibrido">Híbrido</option>
                              </select>
                          </div>
                          <div className="md:col-span-2">
                              <label className={labelClasses}>Instrutor Responsável</label>
                              <select name="instructorId" value={course.instructorId} onChange={handleChange} className={inputClasses}>
                                  {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                              </select>
                          </div>
                      </div>
                  </div>
              )}

          </div>
      </div>
      </div>
    </div>
  );
};

export default CourseEditor;
