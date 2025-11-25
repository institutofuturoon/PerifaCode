
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ForumPost, ChatMessage, Reply, Course, Lesson } from '../types';
import { EXERCISES } from '../constants';
import QuizExercise from '../components/QuizExercise';
import CodePlayground from '../components/CodePlayground';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../App';
import MarkdownRenderer from '../components/MarkdownRenderer';

// --- Sidebar Component ---
const LessonSidebar: React.FC<{
    course: Course;
    currentLessonId: string;
    completedLessonIds: string[];
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
}> = ({ course, currentLessonId, completedLessonIds, isOpen, setIsOpen }) => {
    const navigate = useNavigate();

    // Calculate progress for the sidebar header
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const courseLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
    const completedCount = completedLessonIds.filter(id => courseLessonIds.includes(id)).length;
    const progress = Math.round((completedCount / totalLessons) * 100);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-80 bg-[#050505] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:relative lg:translate-x-0 lg:flex-shrink-0
            `}>
                {/* Sidebar Header */}
                <div className="p-6 border-b border-white/5 bg-[#050505]">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors mb-2 group">
                                <span className="group-hover:-translate-x-1 transition-transform">←</span> VOLTAR
                            </button>
                            <h2 className="text-white font-bold leading-tight text-lg line-clamp-2">{course.title}</h2>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    {/* Mini Progress Bar */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>Progresso do curso</span>
                        <span className="text-[#c4b5fd]">{progress}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5">
                        <div className="bg-[#8a4add] h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Modules List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
                    {course.modules.map((module, mIndex) => (
                        <div key={module.id} className="mb-6">
                            <div className="px-6 flex items-center gap-3 mb-3">
                                <span className="flex items-center justify-center w-5 h-5 rounded bg-white/5 text-[10px] font-bold text-gray-500 border border-white/5">
                                    {mIndex + 1}
                                </span>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider line-clamp-1">
                                    {module.title}
                                </h3>
                            </div>
                            
                            <div className="space-y-0.5">
                                {module.lessons.map((lesson, lIndex) => {
                                    const isActive = lesson.id === currentLessonId;
                                    const isCompleted = completedLessonIds.includes(lesson.id);
                                    
                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => {
                                                navigate(`/course/${course.id}/lesson/${lesson.id}`);
                                                if (window.innerWidth < 1024) setIsOpen(false);
                                            }}
                                            className={`w-full flex items-start gap-4 py-3 px-6 text-left transition-all duration-200 border-l-2 group relative overflow-hidden ${
                                                isActive 
                                                ? 'bg-gradient-to-r from-[#8a4add]/10 to-transparent border-[#8a4add]' 
                                                : 'border-transparent hover:bg-white/[0.02]'
                                            }`}
                                        >
                                            {/* Status Icon */}
                                            <div className="mt-0.5 flex-shrink-0 z-10">
                                                {isActive ? (
                                                    <div className="w-4 h-4 rounded-full border-2 border-[#c4b5fd] flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#c4b5fd] animate-pulse"></div>
                                                    </div>
                                                ) : isCompleted ? (
                                                    <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                    </div>
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border-2 border-white/10 group-hover:border-white/30 transition-colors"></div>
                                                )}
                                            </div>

                                            <div className="flex-1 z-10">
                                                <p className={`text-sm font-medium leading-snug transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                    {lesson.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-[10px] font-mono text-gray-600 flex items-center gap-1">
                                                        {lesson.type === 'video' ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                        )}
                                                        {lesson.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Sidebar Footer */}
                <div className="p-4 border-t border-white/5 bg-[#050505]">
                    <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6d28d9] to-[#8a4add] flex items-center justify-center text-white font-bold text-xs">
                            FO
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white">Instituto FuturoOn</p>
                            <p className="text-[10px] text-gray-500">Plataforma de Ensino</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

// --- AI Tutor Component ---
const AITutor: React.FC<{ course: Course, lesson: Lesson }> = ({ course, lesson }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([
        { role: 'model', text: `Olá! Eu sou seu Tutor IA. Estou aqui para te ajudar com qualquer dúvida sobre a aula "${lesson.title}". O que você gostaria de saber?` }
      ]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Você é o "Tutor IA" da FuturoOn, uma plataforma de cursos de tecnologia para jovens da periferia. Sua personalidade é amigável, encorajadora e didática, como um parceiro de estudos. Use uma linguagem acessível e evite jargões complexos. Sempre formate suas respostas com quebras de linha para melhor legibilidade e use markdown simples como **negrito** e \`código\`.

O aluno está estudando o curso "${course.title}".
A aula atual é "${lesson.title}".
O objetivo desta aula é: "${lesson.objective || 'Não especificado'}".
O conteúdo principal da aula é:
---
${lesson.mainContent || 'O conteúdo desta aula é prático ou em vídeo.'}
---

Baseado neste contexto, responda à seguinte dúvida do aluno de forma clara e simples:

Aluno: "${userMessage.text}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);

    } catch (error) {
      console.error("AI Tutor error:", error);
      const errorMessage: ChatMessage = { role: 'model', text: 'Desculpe, não consegui processar sua pergunta agora. Tente novamente em alguns instantes.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderMessageContent = (text: string) => {
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/`([^`].*?)`/g, '<code class="bg-[#8a4add]/10 text-[#c4b5fd] px-1 py-0.5 rounded text-sm">$1</code>');
    html = html.replace(/\n/g, '<br />');
    return { __html: html };
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={toggleChat} 
          className="bg-gradient-to-br from-[#6d28d9] to-[#8a4add] rounded-full h-14 w-14 flex items-center justify-center text-white shadow-2xl shadow-[#8a4add]/40 transform hover:scale-110 transition-transform duration-300 border border-white/20"
          aria-label="Abrir Tutor IA para tirar dúvidas"
          title="Abrir Tutor IA"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm h-[50vh] flex flex-col" role="dialog" aria-labelledby="ai-tutor-title">
           <div className="bg-[#121212] border border-[#8a4add]/30 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
                <header className="p-4 border-b border-white/10 flex justify-between items-center bg-[#18181b]">
                    <h3 id="ai-tutor-title" className="font-bold text-white flex items-center gap-2">
                        <span className="text-[#c4b5fd]" aria-hidden="true">✨</span> Tutor IA
                    </h3>
                    <button onClick={toggleChat} className="text-gray-400 hover:text-white" aria-label="Fechar chat do Tutor IA">&times;</button>
                </header>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#09090B]" aria-live="polite">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#6d28d9] to-[#8a4add] flex-shrink-0" />}
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#8a4add] text-white rounded-br-sm' : 'bg-white/10 text-gray-200 rounded-bl-sm'}`}>
                                <p dangerouslySetInnerHTML={renderMessageContent(msg.text)}></p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2 justify-start">
                             <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#6d28d9] to-[#8a4add] flex-shrink-0" />
                             <div className="p-3 rounded-2xl bg-white/10 rounded-bl-sm">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-pulse"></span>
                                </div>
                             </div>
                         </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                <footer className="p-3 bg-[#18181b] border-t border-white/10">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Digite sua dúvida..."
                            className="flex-1 p-2.5 bg-black/30 rounded-xl border border-white/10 focus:ring-1 focus:ring-[#8a4add] focus:outline-none text-sm text-white"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="bg-[#8a4add] text-white p-2.5 rounded-xl hover:bg-[#6d28d9] disabled:opacity-50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                </footer>
           </div>
        </div>
      )}
    </>
  );
};


const LessonTabs: React.FC<{
  activeTab: 'content' | 'notes' | 'forum' | 'exercise';
  setActiveTab: (tab: 'content' | 'notes' | 'forum' | 'exercise') => void;
  hasExercise: boolean;
}> = ({ activeTab, setActiveTab, hasExercise }) => {
  const tabClasses = (tabName: 'content' | 'notes' | 'forum' | 'exercise') =>
    `px-4 py-3 font-semibold text-sm transition-colors border-b-2 outline-none ${
      activeTab === tabName
        ? 'border-[#8a4add] text-[#c4b5fd]'
        : 'border-transparent text-gray-400 hover:text-white hover:border-white/20'
    }`;
  return (
    <nav className="flex space-x-2 border-b border-white/10 overflow-x-auto no-scrollbar" role="tablist" aria-label="Abas da aula">
      <button onClick={() => setActiveTab('content')} className={tabClasses('content')}>
        Conteúdo
      </button>
      <button onClick={() => setActiveTab('notes')} className={tabClasses('notes')}>
        Anotações
      </button>
      <button onClick={() => setActiveTab('forum')} className={tabClasses('forum')}>
        Fórum
      </button>
      {hasExercise && (
        <button onClick={() => setActiveTab('exercise')} className={tabClasses('exercise')}>
            Exercício Prático
        </button>
      )}
    </nav>
  );
};

const Forum: React.FC<{
  posts: ForumPost[];
  onPost: (text: string) => void;
  onReply: (postId: string, text: string) => void;
}> = ({ posts, onPost, onReply }) => {
  const [postText, setPostText] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const { user } = useAppContext();

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;
    onPost(postText);
    setPostText('');
  };
  
  const handleReplySubmit = (e: React.FormEvent, postId: string) => {
      e.preventDefault();
      if (!replyText[postId]?.trim()) return;
      onReply(postId, replyText[postId]);
      setReplyText(prev => ({ ...prev, [postId]: '' }));
  }

  return (
      <div className="space-y-8 py-4" role="tabpanel">
          <div className="bg-[#18181B] p-6 rounded-xl border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4">Fórum da Aula</h2>
            {user ? (
                <form onSubmit={handlePostSubmit} className="flex items-start gap-4">
                    <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full border border-white/10" />
                    <div className="flex-1">
                        <textarea 
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            rows={2}
                            placeholder="Tem alguma dúvida sobre esta aula?"
                            className="w-full p-3 bg-black/30 rounded-lg border border-white/10 focus:ring-1 focus:ring-[#8a4add] focus:outline-none transition-colors text-white text-sm"
                        />
                        <div className="flex justify-end mt-2">
                            <button type="submit" className="font-semibold py-2 px-4 rounded-lg bg-[#8a4add] text-white text-xs hover:bg-[#6d28d9] transition-colors">
                                Publicar Dúvida
                            </button>
                        </div>
                    </div>
                </form>
            ) : <p className="text-sm text-gray-400">Faça login para participar.</p>}
          </div>

          <div className="space-y-6">
            {posts.map(post => (
                 <div key={post.id} className="bg-transparent border-b border-white/5 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                        <img src={post.authorAvatarUrl} alt={post.authorName} className="h-10 w-10 rounded-full border border-white/10" />
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-white text-sm">{post.authorName}</p>
                                <p className="text-xs text-gray-500">{post.createdAt}</p>
                            </div>
                            <p className="mt-2 text-gray-300 text-sm leading-relaxed">{post.text}</p>
                            
                            {/* Replies */}
                            <div className="mt-4 space-y-4 border-l-2 border-white/10 pl-4">
                                {post.replies.map(reply => (
                                    <div key={reply.id} className="flex items-start gap-3">
                                        <img src={reply.authorAvatarUrl} alt={reply.authorName} className="h-6 w-6 rounded-full" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-xs text-white">{reply.authorName}</p>
                                                <span className="text-[10px] text-gray-500">• {reply.createdAt}</span>
                                            </div>
                                            <p className="text-sm text-gray-400 mt-0.5">{reply.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {user && (
                                    <form onSubmit={(e) => handleReplySubmit(e, post.id)} className="flex items-center gap-2 pt-1">
                                        <input
                                            type="text"
                                            value={replyText[post.id] || ''}
                                            onChange={(e) => setReplyText(prev => ({...prev, [post.id]: e.target.value}))}
                                            placeholder="Responder..."
                                            className="flex-1 bg-transparent border-b border-white/20 focus:border-[#8a4add] focus:outline-none text-sm text-white py-1"
                                        />
                                        <button type="submit" className="text-xs font-bold text-[#c4b5fd] hover:text-white">Enviar</button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                 </div>
            ))}
            {posts.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-8">Nenhuma dúvida postada nesta aula ainda.</p>
            )}
          </div>
      </div>
  );
};

const LessonView: React.FC = () => {
  const { user, courses, completeLesson, handleSaveNote, fetchLessonContent } = useAppContext();
  const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
  const navigate = useNavigate();

  const currentCourse = useMemo(() => courses.find(c => c.id === courseId), [courses, courseId]);
  
  // Initially, this might be the "light" version from the course object
  const initialLessonData = useMemo(() => currentCourse?.modules.flatMap(m => m.lessons).find(l => l.id === lessonId), [currentCourse, lessonId]);
  
  // State to hold full lesson content (fetched lazily)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(initialLessonData || null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'forum' | 'exercise'>('content');
  const [note, setNote] = useState('');
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Check screen size on mount
  useEffect(() => {
      if (window.innerWidth < 1024) {
          setIsSidebarOpen(false);
      }
  }, []);

  // --- CRITICAL: Fetch Content on Lesson Change ---
  useEffect(() => {
      const loadContent = async () => {
          if (!courseId || !lessonId) return;
          setIsLoadingContent(true);
          
          const fullLesson = await fetchLessonContent(courseId, lessonId);
          if (fullLesson) {
              setCurrentLesson(fullLesson);
          } else {
              // Fallback to initial if fetch fails (e.g. legacy course structure)
              setCurrentLesson(initialLessonData || null);
          }
          setIsLoadingContent(false);
      };

      loadContent();
  }, [courseId, lessonId, fetchLessonContent, initialLessonData]);


  const exercise = EXERCISES.find(ex => ex.id === currentLesson?.exerciseId);
  const isCompleted = user?.completedLessonIds.includes(currentLesson?.id || '') || false;

  useEffect(() => {
    if (user && currentLesson && user.notes && user.notes[currentLesson.id]) {
      setNote(user.notes[currentLesson.id]);
    } else {
      setNote('');
    }
  }, [user, currentLesson]);

  if (!currentCourse || !currentLesson) {
    return <div className="text-center py-20">Aula não encontrada.</div>;
  }

  const handleCompleteLesson = () => {
    completeLesson(currentLesson.id);
  };

  const handlePostToForum = (text: string) => {
    if (!user) return;
    const newPost: ForumPost = {
      id: `fp-new-${Date.now()}`,
      lessonId: currentLesson.id,
      authorId: user.id,
      authorName: user.name,
      authorAvatarUrl: user.avatarUrl,
      text,
      createdAt: 'Agora mesmo',
      replies: [],
    };
    setForumPosts(prev => [newPost, ...prev]);
  };
  
  const handleReplyToForum = (postId: string, text: string) => {
    if (!user) return;
    const newReply: Reply = {
        id: `r-new-${Date.now()}`,
        authorId: user.id,
        authorName: user.name,
        authorAvatarUrl: user.avatarUrl,
        text,
        createdAt: 'Agora mesmo',
    };
    setForumPosts(prev => prev.map(p => p.id === postId ? {...p, replies: [...p.replies, newReply]} : p));
  };

  const allLessons = currentCourse.modules.flatMap(m => m.lessons);
  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLesson.id);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;
  
  const navigateToLesson = (lesson: {id: string} | null) => {
      if(lesson) {
          navigate(`/course/${currentCourse.id}/lesson/${lesson.id}`);
      }
  }

  return (
    <div className="flex h-screen bg-[#09090B] overflow-hidden">
        {/* Sidebar (Left) - Handles its own responsive logic via props */}
        <LessonSidebar 
            course={currentCourse} 
            currentLessonId={currentLesson.id} 
            completedLessonIds={user?.completedLessonIds || []}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
        />

        {/* Main Content (Right) */}
        <main className="flex-1 flex flex-col h-full relative overflow-hidden">
            {/* Top Bar - Aula Title & Controls */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#09090B]/95 backdrop-blur-sm shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title={isSidebarOpen ? "Fechar Menu" : "Abrir Menu"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    
                    <div className="hidden sm:block">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-0.5 uppercase tracking-wide font-bold">
                            <span>Módulo {currentCourse.modules.findIndex(m => m.lessons.some(l => l.id === currentLesson.id)) + 1}</span>
                        </div>
                        <h1 className="text-sm font-bold text-white truncate max-w-[300px] lg:max-w-md">{currentLesson.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleCompleteLesson}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${isCompleted ? 'bg-green-500/20 text-green-400 cursor-default' : 'bg-[#8a4add] text-white hover:bg-[#7c3aed] shadow-lg shadow-[#8a4add]/20'}`}
                        disabled={isCompleted}
                    >
                        {isCompleted ? (
                            <>✓ Concluída</>
                        ) : (
                            <>Concluir Aula</>
                        )}
                    </button>
                </div>
            </header>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 scroll-smooth bg-[#09090B]">
                <div className="max-w-4xl mx-auto pb-20">
                    
                    <LessonTabs activeTab={activeTab} setActiveTab={setActiveTab} hasExercise={!!exercise} />
                    
                    <div className="mt-8">
                        {activeTab === 'content' && (
                            <div className="animate-fade-in">
                                {isLoadingContent ? (
                                    <div className="flex flex-col space-y-4 animate-pulse">
                                        <div className="h-64 bg-white/5 rounded-xl"></div>
                                        <div className="h-4 bg-white/5 rounded w-3/4"></div>
                                        <div className="h-4 bg-white/5 rounded w-1/2"></div>
                                        <div className="h-4 bg-white/5 rounded w-full"></div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Video Placeholder if type is video */}
                                        {currentLesson.type === 'video' && (
                                            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/10 mb-8 relative group shadow-2xl">
                                                {currentLesson.videoUrl ? (
                                                    <iframe 
                                                        src={currentLesson.videoUrl.replace('watch?v=', 'embed/')} 
                                                        title={currentLesson.title}
                                                        className="w-full h-full"
                                                        allowFullScreen
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 flex-col gap-4 bg-white/[0.02]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        <span>Vídeo não disponível na demo</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {currentLesson.objective && (
                                            <div className="bg-white/5 border-l-4 border-[#8a4add] p-6 rounded-r-lg mb-8">
                                                <h3 className="text-sm font-bold text-[#c4b5fd] uppercase tracking-wider mb-2">Objetivo da Aula</h3>
                                                <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                                                    <MarkdownRenderer content={currentLesson.objective} />
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
                                            <MarkdownRenderer content={currentLesson.mainContent} />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'notes' && (
                             <div className="animate-fade-in h-full">
                                <label className="block text-sm font-bold text-gray-400 mb-4">Suas anotações pessoais</label>
                                <textarea
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    onBlur={() => handleSaveNote(currentLesson.id, note)}
                                    className="w-full h-[60vh] p-6 bg-[#121212] rounded-xl border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors text-white leading-relaxed resize-none"
                                    placeholder="Escreva aqui seus insights... (Salvo automaticamente)"
                                />
                            </div>
                        )}

                        {activeTab === 'forum' && (
                            <div className="animate-fade-in">
                                <Forum posts={forumPosts.filter(p => p.lessonId === currentLesson.id)} onPost={handlePostToForum} onReply={handleReplyToForum} />
                            </div>
                        )}

                        {activeTab === 'exercise' && exercise && (
                            <div className="animate-fade-in">
                                {exercise.type === 'quiz' && (
                                    <QuizExercise exercise={exercise} onComplete={handleCompleteLesson} isCompleted={isCompleted}/>
                                )}
                                 {exercise.type === 'playground' && (
                                    <CodePlayground exercise={exercise} onComplete={handleCompleteLesson} isCompleted={isCompleted}/>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bottom Navigation */}
                    <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
                        <button 
                            onClick={() => navigateToLesson(prevLesson)}
                            disabled={!prevLesson}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl border border-white/10 transition-all ${!prevLesson ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5 hover:border-white/20'}`}
                        >
                            <span className="text-lg">←</span>
                            <div className="text-left hidden sm:block">
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Anterior</p>
                                <p className="text-sm text-white font-medium max-w-[150px] truncate">{prevLesson?.title || 'Início'}</p>
                            </div>
                        </button>

                        <button 
                            onClick={() => {
                                if (nextLesson) navigateToLesson(nextLesson);
                                else { handleCompleteLesson(); navigate('/dashboard'); }
                            }}
                            className="flex items-center gap-3 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 hover:border-[#8a4add]/50 transition-all group"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] text-gray-500 font-bold uppercase">{nextLesson ? 'Próxima' : 'Finalizar'}</p>
                                <p className="text-sm text-white font-medium max-w-[150px] truncate group-hover:text-[#c4b5fd]">{nextLesson?.title || 'Concluir Curso'}</p>
                            </div>
                            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>

        {/* Use the latest lesson state for the tutor context */}
        <AITutor course={currentCourse} lesson={currentLesson} />
    </div>
  );
};

export default LessonView;
