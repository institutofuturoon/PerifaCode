import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../App';
import { db } from '../firebaseConfig';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { ChatMessage as ChatMessageType } from '../types';
import { createMentorNotification } from '../utils/notificationService';

const ChatBot: React.FC = () => {
  const { user, showToast } = useAppContext();
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Carregar histórico de mensagens
  useEffect(() => {
    if (!user || !courseId) return;

    const q = query(
      collection(db, 'chatMessages'),
      where('courseId', '==', courseId),
      where('userId', 'in', [user.id, 'bot']),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as ChatMessageType[];
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user, courseId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !courseId) return;

    setIsLoading(true);

    try {
      // Adicionar mensagem do aluno
      await addDoc(collection(db, 'chatMessages'), {
        userId: user.id,
        courseId,
        lessonId,
        message: input,
        sender: 'user',
        timestamp: serverTimestamp(),
        status: 'pending',
      });

      setInput('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      showToast('❌ Erro ao enviar mensagem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId: string, rating: number) => {
    try {
      // Registrar feedback
      await addDoc(collection(db, 'chatFeedback'), {
        messageId,
        userId: user?.id,
        rating,
        timestamp: serverTimestamp(),
      });

      // Atualizar FAQ effectiveness se for FAQ match
      const message = messages.find(m => m.id === messageId);
      if (message?.botResponse?.faqId) {
        const faqRef = doc(db, 'faqBase', message.botResponse.faqId);
        await updateDoc(faqRef, {
          effectiveness: rating > 3 ? 10 : -5,
        });
      }

      showToast('👍 Obrigado pelo feedback!');
    } catch (error) {
      console.error('Erro ao registrar feedback:', error);
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-[#6d28d9] to-[#8a4add] rounded-full flex items-center justify-center text-2xl shadow-2xl shadow-[#8a4add]/40 hover:scale-110 transition-transform"
        aria-label="Abrir Chat com Bot"
        title="Dúvidas? Fale com o Bot!"
      >
        💬
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-32 right-6 z-50 w-96 max-h-[500px] bg-black/95 backdrop-blur-xl border border-[#8a4add]/30 rounded-xl flex flex-col shadow-2xl shadow-[#8a4add]/20 overflow-hidden">
          {/* Header */}
          <header className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-[#8a4add]/20 to-transparent">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-bold text-white text-sm">Tutor IA</h3>
                <p className="text-xs text-gray-400">Sempre aqui pra ajudar</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors text-xl"
              aria-label="Fechar chat"
            >
              ✕
            </button>
          </header>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                <p className="mb-2">👋 Olá! Sou seu Tutor IA</p>
                <p>Faça sua dúvida sobre a aula!</p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-[#8a4add] text-white rounded-br-none'
                      : 'bg-gray-800 text-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>

                  {/* Feedback buttons */}
                  {msg.sender === 'bot' && msg.botResponse?.type === 'faq_match' && (
                    <div className="mt-2 flex gap-2 text-xs">
                      <button
                        onClick={() => handleFeedback(msg.id, 5)}
                        className="px-2 py-1 bg-green-600/70 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        👍 Ajudou
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id, 1)}
                        className="px-2 py-1 bg-red-600/70 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        👎 Não
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 p-3 rounded-lg rounded-bl-none flex gap-1">
                  <span className="w-2 h-2 bg-[#8a4add] rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-[#8a4add] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-[#8a4add] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex gap-2 bg-black/50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escreva sua dúvida..."
              className="flex-1 p-2 bg-white/10 rounded-md border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8a4add] placeholder-gray-400"
              disabled={isLoading}
              aria-label="Escreva sua dúvida para o Tutor IA"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 bg-[#8a4add] text-white rounded-md font-semibold hover:bg-[#6d28d9] disabled:opacity-50 transition-colors text-sm"
              aria-label="Enviar mensagem"
            >
              {isLoading ? '...' : '📤'}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
