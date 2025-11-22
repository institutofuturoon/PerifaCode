import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  addDoc,
} from 'firebase/firestore';
import SEO from '../components/SEO';

interface ChatEscalation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  courseId: string;
  lessonId?: string;
  message: string;
  category: 'tecnico' | 'administrativo' | 'motivacional' | 'outro';
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  mentorResponse?: string;
  responseTime?: number; // em minutos
}

const MentorDashboard: React.FC = () => {
  const { user, showToast, courses } = useAppContext();
  const [escalations, setEscalations] = useState<ChatEscalation[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'resolved'>('pending');
  const [selectedEscalation, setSelectedEscalation] = useState<ChatEscalation | null>(null);
  const [mentorResponse, setMentorResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se é mentor
  const isMentor = user?.role === 'instructor' || user?.isMentor;

  // Carregar escalações
  useEffect(() => {
    if (!isMentor) return;

    const q = query(
      collection(db, 'chatMessages'),
      where('sender', '==', 'mentor'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          userId: doc.data().userId,
          userName: doc.data().userName || 'Aluno',
          userAvatar: doc.data().userAvatar,
          courseId: doc.data().courseId,
          lessonId: doc.data().lessonId,
          message: doc.data().message,
          category: doc.data().category || 'outro',
          status: doc.data().status || 'pending',
          priority: doc.data().priority || 'low',
          timestamp: doc.data().timestamp?.toDate(),
          mentorResponse: doc.data().mentorResponse,
          responseTime: doc.data().responseTime,
        }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()) as ChatEscalation[];
      setEscalations(data);
    });

    return () => unsubscribe();
  }, [isMentor]);

  const filteredEscalations = escalations.filter((e) => e.status === activeTab);

  const handleUpdateStatus = async (escalationId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'chatMessages', escalationId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      showToast(`✅ Status atualizado para ${newStatus}`);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      showToast('❌ Erro ao atualizar');
    }
  };

  const handleSendResponse = async () => {
    if (!selectedEscalation || !mentorResponse.trim()) {
      showToast('❌ Digite uma resposta');
      return;
    }

    try {
      setIsLoading(true);

      // Salvar resposta do mentor
      const responseTime = Math.round(
        (new Date().getTime() - selectedEscalation.timestamp.getTime()) / 60000
      );

      await updateDoc(doc(db, 'chatMessages', selectedEscalation.id), {
        mentorResponse: mentorResponse,
        status: 'resolved',
        responseTime,
        updatedAt: serverTimestamp(),
      });

      // Salvar no histórico de conversa
      await addDoc(collection(db, 'chatMessages'), {
        userId: user?.id,
        userName: user?.name,
        userAvatar: user?.avatarUrl,
        courseId: selectedEscalation.courseId,
        lessonId: selectedEscalation.lessonId,
        message: mentorResponse,
        sender: 'mentor',
        timestamp: serverTimestamp(),
        status: 'answered',
        parentEscalationId: selectedEscalation.id,
      });

      showToast('✅ Resposta enviada!');
      setMentorResponse('');
      setSelectedEscalation(null);
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      showToast('❌ Erro ao enviar resposta');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tecnico':
        return '🔧';
      case 'administrativo':
        return '📋';
      case 'motivacional':
        return '💪';
      default:
        return '❓';
    }
  };

  if (!isMentor) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h2>
        <p className="text-gray-400">Apenas mentores podem acessar este dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/50 py-8">
      <SEO
        title="Dashboard do Mentor | FuturoOn"
        description="Gerenciar escalações de chat e responder dúvidas de alunos"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard do Mentor</h1>
          <p className="text-gray-400">Gerenciar escalações e responder dúvidas dos alunos</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          {(['pending', 'in_progress', 'resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === tab
                  ? 'text-purple-400 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'pending' && `⏳ Pendentes (${escalations.filter((e) => e.status === 'pending').length})`}
              {tab === 'in_progress' && `🔄 Em Progresso (${escalations.filter((e) => e.status === 'in_progress').length})`}
              {tab === 'resolved' && `✅ Resolvidas (${escalations.filter((e) => e.status === 'resolved').length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Escalações */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredEscalations.length === 0 ? (
                <div className="bg-white/5 p-8 rounded-xl border border-white/10 text-center">
                  <p className="text-gray-400">
                    {activeTab === 'pending' && 'Nenhuma escalação pendente'}
                    {activeTab === 'in_progress' && 'Nenhuma escalação em progresso'}
                    {activeTab === 'resolved' && 'Nenhuma escalação resolvida'}
                  </p>
                </div>
              ) : (
                filteredEscalations.map((escalation) => (
                  <div
                    key={escalation.id}
                    onClick={() => setSelectedEscalation(escalation)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedEscalation?.id === escalation.id
                        ? 'bg-purple-500/20 border-purple-500'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        {escalation.userAvatar ? (
                          <img
                            src={escalation.userAvatar}
                            alt={escalation.userName}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                            {escalation.userName.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{escalation.userName}</h3>
                          <p className="text-xs text-gray-400">
                            {escalation.timestamp.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className={`text-sm font-semibold ${getPriorityColor(escalation.priority)}`}>
                          {escalation.priority.toUpperCase()}
                        </span>
                        <span className="text-lg">{getCategoryIcon(escalation.category)}</span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{escalation.message}</p>

                    {escalation.mentorResponse && (
                      <div className="bg-green-500/10 p-2 rounded border border-green-500/20 mb-3">
                        <p className="text-xs text-green-400 font-semibold mb-1">💬 Sua resposta:</p>
                        <p className="text-xs text-green-300">{escalation.mentorResponse}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Status: <span className="font-semibold text-purple-400">{escalation.status}</span>
                      </span>
                      {escalation.responseTime && (
                        <span className="text-xs text-gray-400">
                          ⏱️ {escalation.responseTime}min
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Painel de Resposta */}
          {selectedEscalation ? (
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 h-fit sticky top-20">
              <h3 className="text-lg font-bold text-white mb-4">Responder Aluno</h3>

              <div className="space-y-4">
                {/* Info do Aluno */}
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 font-semibold mb-2">DÚVIDA ORIGINAL:</p>
                  <p className="text-sm text-gray-300">{selectedEscalation.message}</p>
                </div>

                {/* Status Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedEscalation.id, 'in_progress')}
                    className="flex-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                  >
                    🔄 Em Progresso
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedEscalation.id, 'pending')}
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition-colors"
                  >
                    ⏳ Pendente
                  </button>
                </div>

                {/* Response Area */}
                <textarea
                  value={mentorResponse}
                  onChange={(e) => setMentorResponse(e.target.value)}
                  placeholder="Digite sua resposta aqui..."
                  className="w-full p-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-500 resize-none focus:border-purple-500 focus:outline-none"
                  rows={6}
                />

                {/* Send Button */}
                <button
                  onClick={handleSendResponse}
                  disabled={isLoading || !mentorResponse.trim()}
                  className="w-full px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:opacity-50 text-white font-semibold transition-colors"
                >
                  {isLoading ? '⏳ Enviando...' : '✅ Enviar Resposta & Resolver'}
                </button>

                {/* Metrics */}
                {selectedEscalation.responseTime && (
                  <div className="text-xs text-gray-400 text-center pt-2 border-t border-white/10">
                    Respondido em {selectedEscalation.responseTime} minutos
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center text-gray-400">
              <p>👈 Selecione uma escalação para responder</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-12">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {escalations.filter((e) => e.status === 'pending').length}
            </div>
            <p className="text-sm text-gray-400">Pendentes</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {escalations.filter((e) => e.status === 'in_progress').length}
            </div>
            <p className="text-sm text-gray-400">Em Progresso</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {escalations.filter((e) => e.status === 'resolved').length}
            </div>
            <p className="text-sm text-gray-400">Resolvidas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
