import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../App';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { FAQ, ChatMessage as ChatMessageType } from '../types';
import SEO from '../components/SEO';

const ChatBotAdmin: React.FC = () => {
  const { user, courses, showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'metrics' | 'faqbase' | 'conversations'>('metrics');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    keywords: '',
    category: 'tecnico' as const,
    videoUrl: '',
    linkToMaterial: '',
  });
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);

  // Carregar FAQs
  useEffect(() => {
    if (!selectedCourseId) return;
    setIsLoadingFaqs(true);

    const q = query(collection(db, 'faqBase'), where('courseId', '==', selectedCourseId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as FAQ[];
      setFaqs(data.sort((a, b) => b.usageCount - a.usageCount));
      setIsLoadingFaqs(false);
    });

    return () => unsubscribe();
  }, [selectedCourseId]);

  // Carregar mensagens
  useEffect(() => {
    if (!selectedCourseId) return;

    const q = query(
      collection(db, 'chatMessages'),
      where('courseId', '==', selectedCourseId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      })) as ChatMessageType[];
      setMessages(data);
    });

    return () => unsubscribe();
  }, [selectedCourseId]);

  const handleAddFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim() || !selectedCourseId) {
      showToast('❌ Preencha pergunta e resposta');
      return;
    }

    try {
      await addDoc(collection(db, 'faqBase'), {
        courseId: selectedCourseId,
        question: newFaq.question,
        answer: newFaq.answer,
        keywords: newFaq.keywords.split(',').map((k) => k.trim()),
        category: newFaq.category,
        videoUrl: newFaq.videoUrl || null,
        linkToMaterial: newFaq.linkToMaterial || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        effectiveness: 50,
        usageCount: 0,
      });

      setNewFaq({
        question: '',
        answer: '',
        keywords: '',
        category: 'tecnico',
        videoUrl: '',
        linkToMaterial: '',
      });

      showToast('✅ FAQ adicionado!');
    } catch (error) {
      console.error('Erro ao adicionar FAQ:', error);
      showToast('❌ Erro ao adicionar FAQ');
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (!window.confirm('Tem certeza?')) return;

    try {
      await deleteDoc(doc(db, 'faqBase', faqId));
      showToast('🗑️ FAQ deletado');
    } catch (error) {
      console.error('Erro ao deletar FAQ:', error);
      showToast('❌ Erro ao deletar');
    }
  };

  // Métricas
  const metrics = useMemo(() => {
    const resolved = messages.filter((m) => m.sender === 'bot' && m.botResponse?.type === 'faq_match').length;
    const escalated = messages.filter((m) => m.botResponse?.type === 'escalated').length;
    const total = messages.filter((m) => m.sender === 'user').length;

    return {
      total,
      resolved,
      escalated,
      resolvedRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    };
  }, [messages]);

  if (user?.role !== 'admin') {
    return <div className="text-center py-20 text-red-500">Acesso negado</div>;
  }

  const tabClass = (tab: string) =>
    `px-6 py-3 font-semibold text-sm rounded-t-lg border-b-2 transition-colors ${
      activeTab === tab
        ? 'border-[#8a4add] text-white'
        : 'border-transparent text-gray-400 hover:text-white'
    }`;

  return (
    <>
      <SEO title="Chat Bot Admin" description="Gerenciar Chat Bot e FAQs" />

      <div className="min-h-screen bg-[#09090B] text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">🤖 Chat Bot Admin</h1>
          <p className="text-gray-400 mb-8">Gerencie FAQs, métricas e conversas do Bot</p>

          {/* Seleção de curso */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2">Selecione o Curso:</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full md:w-64 p-2 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-[#8a4add] focus:outline-none"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 mb-8">
            <button onClick={() => setActiveTab('metrics')} className={tabClass('metrics')}>
              📊 Métricas
            </button>
            <button onClick={() => setActiveTab('faqbase')} className={tabClass('faqbase')}>
              📚 FAQ Base ({faqs.length})
            </button>
            <button onClick={() => setActiveTab('conversations')} className={tabClass('conversations')}>
              💬 Conversas ({messages.filter((m) => m.sender === 'user').length})
            </button>
          </div>

          {/* MÉTRICAS */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <p className="text-gray-400 text-sm">Mensagens Total</p>
                  <p className="text-3xl font-bold text-white mt-2">{metrics.total}</p>
                </div>
                <div className="bg-green-500/10 p-6 rounded-lg border border-green-500/20">
                  <p className="text-gray-400 text-sm">Resolvidas Auto</p>
                  <p className="text-3xl font-bold text-green-400 mt-2">{metrics.resolved}</p>
                </div>
                <div className="bg-yellow-500/10 p-6 rounded-lg border border-yellow-500/20">
                  <p className="text-gray-400 text-sm">Escaladas</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-2">{metrics.escalated}</p>
                </div>
                <div className="bg-blue-500/10 p-6 rounded-lg border border-blue-500/20">
                  <p className="text-gray-400 text-sm">Taxa Resolução</p>
                  <p className="text-3xl font-bold text-blue-400 mt-2">{metrics.resolvedRate}%</p>
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-lg font-bold mb-4">FAQ Mais Usadas</h3>
                <div className="space-y-2">
                  {faqs
                    .sort((a, b) => b.usageCount - a.usageCount)
                    .slice(0, 5)
                    .map((faq, idx) => (
                      <div key={faq.id} className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-sm">
                          {idx + 1}. {faq.question.substring(0, 50)}...
                        </span>
                        <span className="text-xs bg-[#8a4add]/30 px-3 py-1 rounded">
                          {faq.usageCount}x usada
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* FAQ BASE */}
          {activeTab === 'faqbase' && (
            <div className="space-y-8">
              {/* Adicionar novo FAQ */}
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-lg font-bold mb-4">➕ Adicionar Novo FAQ</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Pergunta (ex: Como fazer exercício X?)"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-[#8a4add] focus:outline-none"
                  />

                  <textarea
                    placeholder="Resposta (suporta markdown)"
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    rows={4}
                    className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-[#8a4add] focus:outline-none"
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Keywords (separadas por vírgula)"
                      value={newFaq.keywords}
                      onChange={(e) => setNewFaq({ ...newFaq, keywords: e.target.value })}
                      className="p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-[#8a4add] focus:outline-none"
                    />

                    <select
                      value={newFaq.category}
                      onChange={(e) =>
                        setNewFaq({
                          ...newFaq,
                          category: e.target.value as 'tecnico' | 'administrativo' | 'motivacional',
                        })
                      }
                      className="p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-[#8a4add] focus:outline-none"
                    >
                      <option value="tecnico">Técnico</option>
                      <option value="administrativo">Administrativo</option>
                      <option value="motivacional">Motivacional</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="url"
                      placeholder="URL do Vídeo (opcional)"
                      value={newFaq.videoUrl}
                      onChange={(e) => setNewFaq({ ...newFaq, videoUrl: e.target.value })}
                      className="p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-[#8a4add] focus:outline-none"
                    />

                    <input
                      type="url"
                      placeholder="Link para Material (opcional)"
                      value={newFaq.linkToMaterial}
                      onChange={(e) => setNewFaq({ ...newFaq, linkToMaterial: e.target.value })}
                      className="p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-[#8a4add] focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleAddFaq}
                    className="w-full bg-[#8a4add] text-white font-semibold py-3 rounded-lg hover:bg-[#6d28d9] transition-colors"
                  >
                    ➕ Adicionar FAQ
                  </button>
                </div>
              </div>

              {/* Lista de FAQs */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold">FAQs Existentes</h3>
                {isLoadingFaqs ? (
                  <p className="text-gray-400">Carregando...</p>
                ) : faqs.length === 0 ? (
                  <p className="text-gray-400">Nenhum FAQ criado ainda</p>
                ) : (
                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <div key={faq.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-white">{faq.question}</h4>
                          <button
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            🗑️
                          </button>
                        </div>

                        <p className="text-sm text-gray-300 mb-3">{faq.answer.substring(0, 100)}...</p>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-[#8a4add]/20 px-2 py-1 rounded text-[#c4b5fd]">
                            📊 {faq.usageCount}x usada
                          </span>
                          <span className="bg-yellow-500/20 px-2 py-1 rounded text-yellow-300">
                            ⭐ {faq.effectiveness}/100
                          </span>
                          <span className="bg-blue-500/20 px-2 py-1 rounded text-blue-300">
                            {faq.category === 'tecnico'
                              ? '🔧 Técnico'
                              : faq.category === 'administrativo'
                                ? '📋 Admin'
                                : '💪 Motivação'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CONVERSAS */}
          {activeTab === 'conversations' && (
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-gray-400">Nenhuma conversa ainda</p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {messages.slice(0, 50).map((msg) => (
                    <div key={msg.id} className="bg-white/5 p-3 rounded-lg border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm">{msg.sender === 'user' ? '👤 Aluno' : '🤖 Bot'}</span>
                        <span className="text-xs text-gray-400">{msg.timestamp.toLocaleString('pt-BR')}</span>
                      </div>

                      <p className="text-sm text-gray-300">{msg.message}</p>

                      {msg.botResponse && (
                        <div className="mt-2 text-xs text-gray-500">
                          <p>
                            Status:{' '}
                            {msg.botResponse.type === 'faq_match'
                              ? '✅ FAQ Match'
                              : msg.botResponse.type === 'escalated'
                                ? '👤 Escalado'
                                : '❓ Incerto'}
                          </p>
                          {msg.botResponse.confidence && (
                            <p>Confiança: {msg.botResponse.confidence}%</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatBotAdmin;
