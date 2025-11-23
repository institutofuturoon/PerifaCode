import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, Module, Lesson } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../App';
import RichContentEditor from '../components/RichContentEditor';
import Uploader from '../components/Uploader';
import { motion } from 'framer-motion';

type SelectedItem = 
  | { type: 'course' }
  | { type: 'module'; moduleIndex: number }
  | { type: 'lesson'; moduleIndex: number; lessonIndex: number };

type EditTab = 'basics' | 'structure' | 'content';

const CourseEditor: React.FC = () => {
  const { user, instructors, courses, tracks, handleSaveCourse, showToast } = useAppContext();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const getNewCourseTemplate = useMemo(() => ({
    id: `course_${Date.now()}`,
    title: '',
    description: '',
    longDescription: '',
    track: tracks[0]?.name || '',
    imageUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '',
    skillLevel: 'Iniciante' as Course['skillLevel'],
    instructorId: user?.id || '',
    modules: [],
    format: 'online' as Course['format'],
    enrollmentStatus: 'soon' as Course['enrollmentStatus'],
  }), [user, tracks]);

  const existingCourse = useMemo(() => {
    if (courseId && courseId !== 'new') {
      return courses.find(c => c.id === courseId);
    }
    return undefined;
  }, [courseId, courses]);
  
  const [course, setCourse] = useState<Course>(existingCourse || getNewCourseTemplate);
  const [editTab, setEditTab] = useState<EditTab>('basics');
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({ type: 'course' });
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingStructure, setIsGeneratingStructure] = useState(false);
  const [addingLessonToModule, setAddingLessonToModule] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingCourse) {
      setCourse(existingCourse);
    } else if (courseId === 'new') {
      setCourse(getNewCourseTemplate);
    }
  }, [existingCourse, courseId, getNewCourseTemplate]);

  useEffect(() => {
    if (addingLessonToModule !== null) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [addingLessonToModule]);

  const completionProgress = useMemo(() => {
    let completed = 0;
    if (course.title) completed++;
    if (course.description) completed++;
    if (course.track) completed++;
    if (course.instructorId) completed++;
    if (course.imageUrl) completed++;
    if (course.modules.length > 0) completed++;
    return Math.round((completed / 6) * 100);
  }, [course]);

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
  
  const handleLessonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, moduleIndex: number, lessonIndex: number) => {
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

  const addModule = () => {
    const newModule: Module = { 
      id: `mod_${Date.now()}`, 
      title: 'Novo Módulo', 
      lessons: [] 
    };
    setCourse(prev => ({ ...prev, modules: [...prev.modules, newModule] }));
  };
  
  const deleteModule = (moduleIndex: number) => {
    if (window.confirm("Tem certeza que quer excluir este módulo?")) {
      setCourse(prev => ({ ...prev, modules: prev.modules.filter((_, i) => i !== moduleIndex) }));
      setSelectedItem({ type: 'course' });
    }
  };

  const addLessonToModule = (moduleIndex: number) => {
    // Validação 1: Título não vazio
    if (!lessonTitle.trim()) {
      showToast("❌ Digite um nome para a aula");
      return;
    }

    // Validação 2: Módulo existe
    if (!course.modules[moduleIndex]) {
      showToast("❌ Módulo não encontrado");
      return;
    }

    try {
      const newLesson: Lesson = {
        id: `les_${Date.now()}`,
        title: lessonTitle.trim(),
        duration: '10 min',
        type: 'text',
        xp: 10
      };

      // Calcula o índice da nova aula
      const newLessonIndex = course.modules[moduleIndex].lessons.length;

      // Atualiza course com a nova aula
      setCourse(prev => {
        const newModules = [...prev.modules];
        if (!newModules[moduleIndex]) {
          throw new Error("Módulo inválido");
        }
        newModules[moduleIndex] = {
          ...newModules[moduleIndex],
          lessons: [...newModules[moduleIndex].lessons, newLesson]
        };
        return { ...prev, modules: newModules };
      });

      // Imediatamente seleciona a nova aula
      setSelectedItem({
        type: 'lesson',
        moduleIndex: moduleIndex,
        lessonIndex: newLessonIndex
      });

      // Limpa input
      setAddingLessonToModule(null);
      setLessonTitle('');

      showToast("✅ Aula adicionada!");
    } catch (error) {
      console.error("Erro ao adicionar aula:", error);
      showToast("❌ Erro ao adicionar aula");
    }
  };

  const deleteLesson = (moduleIndex: number, lessonIndex: number) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
      return { ...prev, modules: newModules };
    });
  };

  const handleGenerateStructureWithAI = async () => {
    if (!aiTopic.trim()) {
      showToast("Digite um tópico para o curso.");
      return;
    }
    setIsGeneratingStructure(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Você é um designer instrucional sênior. Crie uma estrutura de curso para "${aiTopic}". O público são jovens da periferia iniciando em tecnologia. Retorne um objeto JSON com "modules" (array onde cada módulo tem "title" e "lessons" array com "title", "duration" e "xp").`;

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
      const newModules: Module[] = result.modules.map((mod: any) => ({
        id: `mod_${Date.now()}_${Math.random()}`,
        title: mod.title,
        lessons: mod.lessons.map((les: any) => ({
          id: `les_${Date.now()}_${Math.random()}`,
          title: les.title,
          duration: les.duration,
          type: 'text' as const,
          xp: les.xp
        }))
      }));

      setCourse(prev => ({ ...prev, modules: newModules }));
      showToast("✅ Estrutura gerada com IA!");
    } catch (error) {
      console.error("Erro ao gerar estrutura:", error);
      showToast("❌ Erro ao gerar. Tente novamente.");
    } finally {
      setIsGeneratingStructure(false);
    }
  };

  const handleImageUploadComplete = (url: string) => {
    setCourse(prev => ({ ...prev, imageUrl: url }));
    showToast('✅ Imagem salva!');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course.title || !course.description) {
      showToast("❌ Preencha título e descrição");
      return;
    }
    handleSaveCourse(course);
    navigate('/admin');
  };
  
  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors text-white";
  const labelClasses = "block text-sm font-semibold text-gray-300 mb-2";
  
  // ABA 1: Informações
  const renderBasicsTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <label className={labelClasses}>📝 Título *</label>
        <input type="text" name="title" value={course.title} onChange={handleChange} className={inputClasses} placeholder="Nome do curso" required />
      </div>
      
      <div>
        <label className={labelClasses}>📄 Descrição Curta *</label>
        <textarea name="description" value={course.description} onChange={handleChange} className={inputClasses} rows={2} placeholder="Breve descrição" required />
      </div>

      <div>
        <label className={labelClasses}>📚 Descrição Longa</label>
        <textarea name="longDescription" value={course.longDescription} onChange={handleChange} className={inputClasses} rows={3} placeholder="Detalhes do curso" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>🎯 Trilha</label>
          <select name="track" value={course.track} onChange={handleChange} className={inputClasses}>
            {tracks.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClasses}>👨‍🏫 Instrutor</label>
          <select name="instructorId" value={course.instructorId} onChange={handleChange} className={inputClasses}>
            {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>📊 Nível</label>
          <select name="skillLevel" value={course.skillLevel} onChange={handleChange} className={inputClasses}>
            <option>Iniciante</option>
            <option>Intermediário</option>
            <option>Avançado</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>⏱️ Duração</label>
          <input type="text" name="duration" value={course.duration} onChange={handleChange} className={inputClasses} placeholder="8 horas" />
        </div>
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className={labelClasses}>🖼️ Imagem</label>
          <input type="text" name="imageUrl" value={course.imageUrl} onChange={handleChange} className={inputClasses} />
        </div>
        <Uploader pathnamePrefix={`courses/${course.id}`} onUploadComplete={handleImageUploadComplete}>
          {(trigger, loading) => (
            <button type="button" onClick={trigger} disabled={loading} className="py-3 px-4 bg-[#8a4add]/20 text-[#c4b5fd] hover:bg-[#8a4add]/30 rounded transition-colors">
              {loading ? '...' : '📤'}
            </button>
          )}
        </Uploader>
      </div>
    </motion.div>
  );

  // ABA 2: Estrutura
  const renderStructureTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-[#8a4add]/10 border border-[#8a4add]/30 rounded-lg p-4">
        <h3 className="font-semibold text-white mb-3">✨ Gerar com IA</h3>
        <div className="flex gap-2">
          <input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} className={`${inputClasses} flex-1`} placeholder="React para iniciantes" />
          <button type="button" onClick={handleGenerateStructureWithAI} disabled={isGeneratingStructure} className="py-3 px-4 bg-[#8a4add] text-white rounded hover:bg-[#7c3aed] disabled:opacity-50 font-semibold whitespace-nowrap">
            {isGeneratingStructure ? '...' : '✨'}
          </button>
        </div>
      </div>

      {course.modules.length === 0 ? (
        <div className="text-center py-12 bg-white/[0.02] border border-white/10 rounded-lg">
          <p className="text-gray-400 mb-3">Sem módulos</p>
          <button type="button" onClick={addModule} className="text-[#c4b5fd] hover:text-white font-semibold">+ Criar Primeiro Módulo</button>
        </div>
      ) : (
        <div className="space-y-4">
          {course.modules.map((module, mIdx) => (
            <div key={module.id} className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-white">{mIdx + 1}. {module.title} ({module.lessons.length})</h4>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setSelectedItem({ type: 'module', moduleIndex: mIdx })} className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded">✏️</button>
                  <button type="button" onClick={() => deleteModule(mIdx)} className="px-3 py-1 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded">🗑️</button>
                </div>
              </div>
              
              <div className="space-y-2 border-t border-white/10 pt-3">
                {module.lessons.map((lesson, lIdx) => (
                  <div key={lesson.id} className="flex items-center justify-between bg-black/30 p-2 rounded text-sm">
                    <span className="text-gray-300">{lesson.title} <span className="text-gray-500">({lesson.duration})</span></span>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => setSelectedItem({ type: 'lesson', moduleIndex: mIdx, lessonIndex: lIdx })} className="text-[#c4b5fd] hover:text-white text-xs">✏️</button>
                      <button type="button" onClick={() => deleteLesson(mIdx, lIdx)} className="text-red-400 hover:text-red-300 text-xs">🗑️</button>
                    </div>
                  </div>
                ))}

                {addingLessonToModule === mIdx ? (
                  <div className="flex gap-2 pt-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addLessonToModule(mIdx);
                        }
                        if (e.key === 'Escape') {
                          setAddingLessonToModule(null);
                          setLessonTitle('');
                        }
                      }}
                      placeholder="Nome da aula"
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:ring-2 focus:ring-[#8a4add] focus:outline-none"
                    />
                    <button type="button" onClick={() => addLessonToModule(mIdx)} className="px-3 py-2 bg-[#8a4add] text-white rounded text-sm font-semibold hover:bg-[#7c3aed]">✓</button>
                    <button type="button" onClick={() => { setAddingLessonToModule(null); setLessonTitle(''); }} className="px-3 py-2 bg-white/10 text-white rounded text-sm hover:bg-white/20">✕</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setAddingLessonToModule(mIdx)} className="w-full py-2 text-[#c4b5fd] hover:text-white text-xs border-t border-white/10 mt-2">+ Aula</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button type="button" onClick={addModule} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-white">+ Módulo</button>
    </motion.div>
  );

  // ABA 3: Conteúdo
  const renderContentTab = () => {
    if (selectedItem.type === 'lesson') {
      const lesson = course.modules[selectedItem.moduleIndex]?.lessons[selectedItem.lessonIndex];
      if (!lesson) return <div className="text-gray-400">Aula não encontrada</div>;

      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="text-sm text-gray-400">📍 {course.modules[selectedItem.moduleIndex].title}</div>

          <div>
            <label className={labelClasses}>Título</label>
            <input type="text" name="title" value={lesson.title} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClasses}>Duração</label>
              <input type="text" name="duration" value={lesson.duration} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>XP</label>
              <input type="number" name="xp" value={lesson.xp} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Tipo</label>
              <select name="type" value={lesson.type} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses}>
                <option value="text">Texto</option>
                <option value="video">Vídeo</option>
              </select>
            </div>
          </div>

          {lesson.type === 'video' && (
            <div>
              <label className={labelClasses}>URL Vídeo</label>
              <input type="text" name="videoUrl" value={lesson.videoUrl || ''} onChange={(e) => handleLessonChange(e, selectedItem.moduleIndex, selectedItem.lessonIndex)} className={inputClasses} />
            </div>
          )}

          <RichContentEditor label="🎯 Objetivo" value={lesson.objective || ''} onChange={(val) => handleLessonContentChange(val, 'objective', selectedItem.moduleIndex, selectedItem.lessonIndex)} textareaRef={useRef(null)} />
          <RichContentEditor label="📖 Conteúdo" value={lesson.mainContent || ''} onChange={(val) => handleLessonContentChange(val, 'mainContent', selectedItem.moduleIndex, selectedItem.lessonIndex)} textareaRef={useRef(null)} />
          <RichContentEditor label="📝 Resumo" value={lesson.summary || ''} onChange={(val) => handleLessonContentChange(val, 'summary', selectedItem.moduleIndex, selectedItem.lessonIndex)} textareaRef={useRef(null)} />
        </motion.div>
      );
    }

    if (selectedItem.type === 'module') {
      const module = course.modules[selectedItem.moduleIndex];
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div>
            <label className={labelClasses}>Título do Módulo</label>
            <input type="text" name="title" value={module.title} onChange={(e) => handleModuleChange(e, selectedItem.moduleIndex)} className={inputClasses} />
          </div>
        </motion.div>
      );
    }

    return <div className="text-center py-12 text-gray-400">Selecione um módulo ou aula</div>;
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Header */}
      <div className="sticky top-0 bg-[#09090B]/95 border-b border-white/10 z-30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-black">✨ {courseId === 'new' ? 'Novo Curso' : 'Editar'}</h1>
            <div className="flex gap-3">
              <button type="button" onClick={onCancel} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold">Cancelar</button>
              <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white rounded-lg font-semibold hover:opacity-90">💾 Salvar</button>
            </div>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983]" style={{ width: `${completionProgress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4 sticky top-32">
              <h3 className="font-bold text-white mb-4">📚</h3>
              <div className="space-y-2 text-sm max-h-96 overflow-y-auto">
                <button type="button" onClick={() => setSelectedItem({ type: 'course' })} className={`w-full text-left px-3 py-2 rounded transition-colors ${selectedItem.type === 'course' ? 'bg-[#8a4add]/30 text-white' : 'text-gray-300 hover:bg-white/10'}`}>ℹ️ Info</button>
                {course.modules.map((mod, idx) => (
                  <div key={mod.id}>
                    <button type="button" onClick={() => setSelectedItem({ type: 'module', moduleIndex: idx })} className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedItem.type === 'module' && selectedItem.moduleIndex === idx ? 'bg-[#8a4add]/30 text-white' : 'text-gray-300 hover:bg-white/10'}`}>
                      📖 {mod.title}
                    </button>
                    <div className="pl-4 space-y-1">
                      {mod.lessons.map((les, lIdx) => (
                        <button key={les.id} type="button" onClick={() => setSelectedItem({ type: 'lesson', moduleIndex: idx, lessonIndex: lIdx })} className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${selectedItem.type === 'lesson' && selectedItem.moduleIndex === idx && selectedItem.lessonIndex === lIdx ? 'bg-[#f27983]/30 text-white' : 'text-gray-400 hover:text-white'}`}>
                          → {les.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedItem.type === 'course' ? (
              <>
                <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
                  {(['basics', 'structure', 'content'] as const).map((tab) => (
                    <button key={tab} type="button" onClick={() => setEditTab(tab)} className={`px-4 py-2 font-semibold text-sm transition-colors ${editTab === tab ? 'text-white border-b-2 border-[#8a4add] -mb-4 pb-4' : 'text-gray-400 hover:text-gray-300'}`}>
                      {tab === 'basics' && '📋 Info'}
                      {tab === 'structure' && '🏗️ Estrutura'}
                      {tab === 'content' && '📖 Conteúdo'}
                    </button>
                  ))}
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-lg p-8">
                  {editTab === 'basics' && renderBasicsTab()}
                  {editTab === 'structure' && renderStructureTab()}
                  {editTab === 'content' && renderContentTab()}
                </div>
              </>
            ) : (
              <div className="bg-white/[0.02] border border-white/10 rounded-lg p-8">
                {renderContentTab()}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEditor;
