import React, { useState } from 'react';
import { useAppContext } from '../App';
import Uploader from '../components/Uploader';

const StudentUploadTest: React.FC = () => {
  const { user, handleUpdateUserProfile, showToast } = useAppContext();
  
  // Local state to track the uploaded URL before saving
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);

  const handleUploadComplete = (url: string) => {
    setNewAvatarUrl(url);
    showToast('✅ Imagem pronta. Clique em "Salvar" para aplicar.');
  };

  const handleSaveChanges = async () => {
    if (!user || !newAvatarUrl) {
      showToast('❌ Nenhum usuário logado ou nenhuma imagem nova para salvar.');
      return;
    }
    await handleUpdateUserProfile({ ...user, avatarUrl: newAvatarUrl });
    setNewAvatarUrl(null); // Clear the temporary state after saving
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-white">Faça login para testar</h1>
        <p className="text-gray-400 mt-2">Você precisa estar logado como um usuário para testar o upload de avatar.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10 space-y-8">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Página de Teste de Upload de Aluno</h1>
          <p className="text-gray-400 mt-2">Simula a funcionalidade de troca de avatar da página de edição de aluno.</p>
        </div>

        {/* User Info Section */}
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Usuário de Teste</h2>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 relative">
                <img 
                    src={newAvatarUrl || user.avatarUrl} 
                    alt={user.name} 
                    className="h-20 w-20 rounded-full object-cover border-2 border-[#8a4add]"
                />
                {newAvatarUrl && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-yellow-400 ring-2 ring-[#18181B]" title="Imagem pendente de salvamento"></span>
                )}
            </div>
            <div>
              <p className="text-lg font-bold text-white">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Uploader Section */}
        <div>
          <Uploader
            pathnamePrefix={`images/Student/${user.id}`}
            onUploadComplete={handleUploadComplete}
          >
            {(triggerUpload, isUploading) => (
              <button
                onClick={triggerUpload}
                disabled={isUploading}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Enviando...' : '1. Fazer Upload de Nova Foto'}
              </button>
            )}
          </Uploader>
           <p className="text-center text-xs text-gray-500 mt-2">Isso utiliza o mesmo componente <code className="bg-black/50 px-1 rounded">&lt;Uploader /&gt;</code> do editor de aluno.</p>
        </div>
        
        {/* Result & Save Section */}
        {newAvatarUrl && (
            <div className="space-y-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg animate-fade-in">
                <h3 className="text-lg font-semibold text-green-300">Preview da Nova Imagem</h3>
                <img src={newAvatarUrl} alt="Preview do Upload" className="max-w-xs h-auto rounded-md border border-white/20 mx-auto"/>
                <div>
                    <p className="text-sm text-gray-400 mb-2">URL gerada:</p>
                    <p className="text-xs text-green-400 break-all bg-black/30 p-2 rounded">{newAvatarUrl}</p>
                </div>
                <button
                    onClick={handleSaveChanges}
                    className="w-full font-bold py-3 px-8 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
                >
                    2. Salvar Alterações
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default StudentUploadTest;
