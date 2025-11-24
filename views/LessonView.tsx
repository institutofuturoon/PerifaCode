
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ForumPost, ChatMessage, Reply } from '../types';
import { EXERCISES } from '../constants';
import QuizExercise from '../components/QuizExercise';
import CodePlayground from '../components/CodePlayground';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../App';
import MarkdownRenderer from '../components/MarkdownRenderer';


const AITutor: React.FC = () => {
  const { courses } = useAppContext();
  const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
  const currentCourse = useMemo(() => courses.find(c => c.id === courseId), [courses, courseId]);
  const currentLesson = useMemo(() => currentCourse?.modules.flatMap(m => m.lessons).find(l => l.id === lessonId), [currentCourse, lessonId]);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!currentCourse || !currentLesson) return null;

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([
        { role: 'model', text: `Olá! Eu sou seu Tutor IA. Estou aqui para te ajudar com qualquer dúvida sobre a aula "${currentLesson.title}". O que você gostaria de saber?` }
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

O aluno está estudando o curso "${currentCourse.title}".
A aula atual é "${currentLesson.title}".
O objetivo desta aula é: "${currentLesson.objective}".
O conteúdo principal da aula é:
---
${currentLesson.mainContent}
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
    // Basic markdown renderer for tutor response
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/`([^`].*?)`/g, '<code class="bg-[#8a4add]/10 text-[#c4b5fd] px-1 py-0.5 rounded text-sm">$1</code>');
    html = html.replace(/\n/g, '<br />');
    return { __html: html };
  }

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        <button 
          onClick={toggleChat} 
          className="bg-gradient-to-br from-[#6d28d9] to-[#8a4add] rounded-full h-16 w-16 flex items-center justify-center text-white shadow-2xl shadow-[#8a4add]/40 transform hover:scale-110 transition-transform duration-300"
          aria-label="Abrir Tutor IA para tirar dúvidas"
          title="Abrir Tutor IA"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-[90vw] max-w-sm h-[60vh] max-h-[500px] flex flex-col" role="dialog" aria-labelledby="ai-tutor-title">
           <div className="bg-black/50 backdrop-blur-xl border border-[#8a4add]/30 rounded-lg shadow-2xl shadow-[#8a4add]/20 flex flex-col h-full">
                <header className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 id="ai-tutor-title" className="font-bold text-white flex items-center gap-2">
                        <span className="text-[#c4b5fd]" aria-hidden="true">✨</span> Tutor IA
                    </h3>
                    <button onClick={toggleChat} className="text-gray-400 hover:text-white" aria-label="Fechar chat do Tutor IA">&times;</button>
                </header>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto" aria-live="polite">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <img src="https://picsum.photos/seed/aitutor/100" className="h-6 w-6 rounded-full" alt="Avatar do Tutor IA" />}
                            <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-[#8a4add] text-white font-semibold rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                                <p className="text-sm" dangerouslySetInnerHTML={renderMessageContent(msg.text)}></p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2 justify-start">
                             <img src="https://picsum.photos/seed/aitutor/100" className="h-6 w-6 rounded-full" alt="Avatar do Tutor IA" />
                             <div className="max-w-[80%] p-3 rounded-lg bg-gray-800 rounded-bl-none" aria-label="Tutor IA digitando...">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 bg-[#8a4add] rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-[#8a4add] rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-[#8a4add] rounded-full animate-pulse"></span>
                                </div>
                             </div>
                         </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                <footer className="p-4 border-t border-white/10">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Tire sua dúvida..."
                            className="flex-1 p-2 bg-white/10 rounded-md border border-white/20 focus:ring-2 focus:ring-[#8a4add] focus:outline-none text-sm text-white"
                            disabled={isLoading}
                            aria-label="Digite sua dúvida para o Tutor IA"
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="bg-[#8a4add] text-white px-4 rounded-md font-semibold hover:bg-[#6d28d9] disabled:opacity-50 transition-colors">Enviar</button>
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
    `px-4 py-2 font-semibold text-sm rounded-t-lg border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:ring-offset-2 focus:ring-offset-[#09090B] ${
      activeTab === tabName
        ? 'border-[#8a4add] text-white'
        : 'border-transparent text-gray-400 hover:text-white'
    }`;
  return (
    <nav className="flex space-x-4 border-b border-white/10" role="tablist" aria-label="Abas da aula">
      <button 
        role="tab" 
        aria-selected={activeTab === 'content'} 
        onClick={() => setActiveTab('content')} 
        className={tabClasses('content')}
      >
        Conteúdo
      </button>
      <button 
        role="tab" 
        aria-selected={activeTab === 'notes'} 
        onClick={() => setActiveTab('notes')} 
        className={tabClasses('notes')}
      >
        Anotações
      </button>
      <button 
        role="tab" 
        aria-selected={activeTab === 'forum'} 
        onClick={() => setActiveTab('forum')} 
        className={tabClasses('forum')}
      >
        Fórum de Dúvidas
      </button>
      {hasExercise && (
        <button 
            role="tab" 
            aria-selected={activeTab === 'exercise'} 
            onClick={() => setActiveTab('exercise')} 
            className={tabClasses('exercise')}
        >
            Exercício
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
      <div className="space-y-6" role="tabpanel" aria-label="Fórum de Dúvidas">
          <h2 className="text-xl font-bold text-white">Fórum de Dúvidas</h2>
          {user && (
            <form onSubmit={handlePostSubmit} className="flex items-start gap-4">
                <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                    <textarea 
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        rows={3}
                        placeholder="Qual sua dúvida sobre esta aula?"
                        className="w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors text-white"
                        aria-label="Escreva sua dúvida"
                    />
                    <button type="submit" className="mt-2 font-semibold py-2 px-5 rounded-lg bg-[#8a4add] text-white hover:bg-[#6d28d9] transition-colors shadow-lg shadow-[#8a4add]/20">
                        Publicar Dúvida
                    </button>
                </div>
            </form>
          )}
          <div className="space-y-6">
            {posts.map(post => (
                 <div key={post.id} className="bg-white/5 p-4 rounded-lg">
                    <div className="flex items-start gap-4">
                        <img src={post.authorAvatarUrl} alt={post.authorName} className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-white">{post.authorName}</p>
                                <p className="text-xs text-gray-500">{post.createdAt}</p>
                            </div>
                            <p className="mt-2 text-gray-300">{post.text}</p>
                        </div>
                    </div>
                    {/* Replies */}
                     <div className="mt-4 pl-14 space-y-4">
                         {post.replies.map(reply => (
                             <div key={reply.id} className="flex items-start gap-4">
                                <img src={reply.authorAvatarUrl} alt={reply.authorName} className="h-8 w-8 rounded-full" />
                                <div className="flex-1">
                                    <div className="bg-black/20 p-3 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-sm text-white">{reply.authorName}</p>
                                            <p className="text-xs text-gray-500">{reply.createdAt}</p>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-300">{reply.text}</p>
                                    </div>
                                </div>
                            </div>
                         ))}
                         {user && (
                            <form onSubmit={(e) => handleReplySubmit(e, post.id)} className="flex items-center gap-2 pt-2">
                                <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full" />
                                <input
                                    type="text"
                                    value={replyText[post.id] || ''}
                                    onChange={(e) => setReplyText(prev => ({...prev, [post.id]: e.target.value}))}
                                    placeholder="Responder..."
                                    className="flex-1 p-2 bg-white/10 rounded-md border border-white/20 focus:ring-1 focus:ring-[#8a4add] focus:outline-none text-sm text-white"
                                    aria-label={`Responder ao comentário de ${post.authorName}`}
                                />
                                <button type="submit" className="text-xs font-semibold bg-[#8a4add]/50 text-white px-3 py-2 rounded-md hover:bg-[#8a4add]/80">
                                    Enviar
                                </button>
                            </form>
                         )}
                     </div>
                 </div>
            ))}
          </div>
      </div>
  );
};

const LessonView: React.FC = () => {
  const { user, courses, completeLesson, handleSaveNote } = useAppContext();
  const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
  const navigate = useNavigate();

  const currentCourse = useMemo(() => courses.find(c => c.id === courseId), [courses, courseId]);
  const currentLesson = useMemo(() => currentCourse?.modules.flatMap(m => m.lessons).find(l => l.id === lessonId), [currentCourse, lessonId]);

  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'forum' | 'exercise'>('content');
  const [note, setNote] = useState('');
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);

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
  
  const handleBackToCourse = () => {
    if (user) {
        // If logged in, go back to the Student Dashboard, specifically to My Courses tab
        navigate('/dashboard');
    } else {
        navigate('/courses');
    }
  };

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
            <button onClick={handleBackToCourse} className="text-[#c4b5fd] font-semibold hover:text-white transition-colors group flex items-center gap-2 text-sm" aria-label="Voltar">
                <span className="inline-block transform group-hover:-translate-x-1 transition-transform" aria-hidden="true">&larr;</span> 
                {user ? 'Voltar para Meu Painel' : 'Voltar para os cursos'}
            </button>
        </div>

        <div className="max-w-5xl mx-auto">
            <div className="bg-black/20 backdrop-blur-xl p-6 md:p-10 rounded-2xl border border-white/10 mb-8">
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-[#8a4add]/20 text-[#c4b5fd] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {currentCourse.title}
                        </span>
                        <span className="text-gray-500 text-sm">Aula {currentLessonIndex + 1} de {allLessons.length}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white">{currentLesson.title}</h1>
                </header>

                <LessonTabs activeTab={activeTab} setActiveTab={setActiveTab} hasExercise={!!exercise} />
                
                <div className="mt-8 min-h-[300px]">
                    {activeTab === 'content' && (
                        <div className="space-y-8" role="tabpanel" aria-label="Conteúdo da aula">
                            {currentLesson.objective && (
                                <div className="bg-white/5 border-l-4 border-[#8a4add] p-6 rounded-r-lg">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c4b5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Objetivo da Aula
                                    </h2>
                                    <div className="prose prose-invert max-w-none text-gray-300 text-sm">
                                        <MarkdownRenderer content={currentLesson.objective} />
                                    </div>
                                </div>
                            )}
                             <div>
                                <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
                                  <MarkdownRenderer content={currentLesson.mainContent} />
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'notes' && (
                         <div role="tabpanel" aria-label="Minhas anotações">
                            <h2 className="text-xl font-bold text-white mb-4">Minhas Anotações</h2>
                            <textarea
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                onBlur={() => handleSaveNote(currentLesson.id, note)}
                                rows={10}
                                placeholder="Faça suas anotações aqui... Elas são salvas automaticamente."
                                className="w-full p-4 bg-black/30 rounded-xl border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors text-white leading-relaxed"
                                aria-label="Campo de texto para suas anotações pessoais sobre a aula"
                            />
                        </div>
                    )}
                    {activeTab === 'forum' && (
                        <Forum posts={forumPosts.filter(p => p.lessonId === currentLesson.id)} onPost={handlePostToForum} onReply={handleReplyToForum} />
                    )}
                    {activeTab === 'exercise' && exercise && (
                        <div role="tabpanel" aria-label="Exercício Prático">
                            {exercise.type === 'quiz' && (
                                <QuizExercise exercise={exercise} onComplete={handleCompleteLesson} isCompleted={isCompleted}/>
                            )}
                             {exercise.type === 'playground' && (
                                <CodePlayground exercise={exercise} onComplete={handleCompleteLesson} isCompleted={isCompleted}/>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Navigation & Completion */}
            <div className="grid gap-6 mt-8 border-t border-white/10 pt-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Completion Status */}
                    <div className="w-full md:w-auto order-2 md:order-1">
                        {!isCompleted ? (
                            <button 
                                onClick={handleCompleteLesson}
                                className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 group"
                                aria-label="Marcar aula como concluída"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                Marcar como Concluída
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 text-green-400 font-semibold bg-green-500/10 px-6 py-3 rounded-xl border border-green-500/20 justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                Aula Concluída
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex w-full md:w-auto gap-4 order-1 md:order-2">
                        <button 
                            onClick={() => navigateToLesson(prevLesson)} 
                            disabled={!prevLesson}
                            className={`flex-1 md:flex-none group flex items-center gap-3 px-6 py-3 rounded-xl border border-white/10 transition-all w-full md:w-64 ${!prevLesson ? 'opacity-50 cursor-not-allowed bg-white/5' : 'bg-white/5 hover:bg-white/10 hover:border-[#8a4add]/30 cursor-pointer'}`}
                        >
                            <span className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </span>
                            <div className="text-left overflow-hidden">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Anterior</p>
                                <p className="text-sm font-semibold text-white truncate">{prevLesson?.title || 'Início'}</p>
                            </div>
                        </button>

                        <button 
                            onClick={() => {
                                if (nextLesson) {
                                    navigateToLesson(nextLesson);
                                } else {
                                    handleCompleteLesson();
                                    handleBackToCourse();
                                }
                            }} 
                            className="flex-1 md:flex-none group flex items-center justify-between gap-3 px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#8a4add]/30 transition-all w-full md:w-64 cursor-pointer"
                        >
                            <div className="text-right overflow-hidden">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{nextLesson ? 'Próxima' : 'Finalizar'}</p>
                                <p className="text-sm font-semibold text-white truncate group-hover:text-[#c4b5fd] transition-colors">{nextLesson?.title || 'Concluir Curso'}</p>
                            </div>
                            <span className="p-2 rounded-full bg-white/5 group-hover:bg-[#8a4add] group-hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Back to Dashboard Bottom Link */}
                <div className="flex justify-center pt-6 mt-2 border-t border-white/5">
                    <button 
                        onClick={handleBackToCourse}
                        className="text-gray-500 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        Voltar para o Painel
                    </button>
                </div>
            </div>
        </div>
      <AITutor />
    </div>
  );
};

export default LessonView;
