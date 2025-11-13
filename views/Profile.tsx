import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../App';
import { upload } from '@vercel/blob/client';

const DEFAULT_BANNER_URL = 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';


const Profile: React.FC = () => {
  const { user, handleLogout, handleUpdateUserProfile, showToast } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      notificationPreferences: {
          newCoursesAndClasses: user?.notificationPreferences?.newCoursesAndClasses ?? true,
          communityEvents: user?.notificationPreferences?.communityEvents ?? true,
          platformUpdates: user?.notificationPreferences?.platformUpdates ?? true,
      }
  });

  useEffect(() => {
    if (user) {
        setFormData({
            name: user.name,
            email: user.email,
            bio: user.bio,
            notificationPreferences: {
                newCoursesAndClasses: user.notificationPreferences?.newCoursesAndClasses ?? true,
                communityEvents: user.notificationPreferences?.communityEvents ?? true,
                platformUpdates: user.notificationPreferences?.platformUpdates ?? true,
            }
        });
    }
  }, [user]);
  
  if (!user) return null;

  const handleAvatarClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('❌ Por favor, selecione um arquivo de imagem válido.');
        return;
    }
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
        showToast('❌ O arquivo é muito grande. O limite é de 4MB.');
        return;
    }

    setIsUploading(true);
    try {
        const pathname = `avatars/${user.id}-${file.name}`;

        const clientTokenResponse = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'generate-client-token',
                payload: { pathname },
            }),
        });

        if (!clientTokenResponse.ok) {
            const errorBody = await clientTokenResponse.json();
            throw new Error(errorBody.error || 'Failed to get upload token');
        }

        const clientToken = await clientTokenResponse.text();

        const newBlob = await upload(pathname, file, {
            access: 'public',
            clientToken,
        });

        await handleUpdateUserProfile({ ...user, avatarUrl: newBlob.url });
        showToast('✅ Foto de perfil atualizada!');

    } catch (err: any) {
        console.error('Erro ao fazer upload da imagem:', err);
        const message = err.message || 'Ocorreu um erro desconhecido.';
        showToast(`❌ Erro ao atualizar a foto: ${message}`);
    } finally {
        setIsUploading(false);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  };
  
  const handleBannerFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('❌ Por favor, selecione um arquivo de imagem válido.');
        return;
    }
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
        showToast('❌ O arquivo é muito grande. O limite é de 4MB.');
        return;
    }

    setIsUploadingBanner(true);
    try {
        const pathname = `banners/${user.id}-${file.name}`;
        
        const clientTokenResponse = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'generate-client-token',
                payload: { pathname },
            }),
        });

        if (!clientTokenResponse.ok) {
            const errorBody = await clientTokenResponse.json();
            throw new Error(errorBody.error || 'Failed to get upload token');
        }

        const clientToken = await clientTokenResponse.text();

        const newBlob = await upload(pathname, file, {
            access: 'public',
            clientToken,
        });

        await handleUpdateUserProfile({ ...user, bannerUrl: newBlob.url });
        showToast('✅ Imagem de fundo atualizada!');

    } catch (err: any) {
        console.error('Erro ao fazer upload do banner:', err);
        const message = err.message || 'Ocorreu um erro desconhecido.';
        showToast(`❌ Erro ao atualizar o fundo: ${message}`);
    } finally {
        setIsUploadingBanner(false);
        if(bannerFileInputRef.current) {
            bannerFileInputRef.current.value = "";
        }
    }
  };


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const isNotificationPref = ['newCoursesAndClasses', 'communityEvents', 'platformUpdates'].includes(name);

      if (type === 'checkbox' && isNotificationPref) {
          const { checked } = e.target as HTMLInputElement;
          setFormData(prev => ({
              ...prev,
              notificationPreferences: {
                  ...prev.notificationPreferences,
                  [name]: checked
              }
          }));
      } else {
          setFormData(prev => ({ ...prev, [name]: value }));
      }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await handleUpdateUserProfile({ ...user, ...formData });
      showToast('✅ Perfil salvo com sucesso!');
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10 overflow-hidden">
        
        {/* Profile Header */}
        <div className="relative">
            <div 
                className="h-48 bg-cover bg-center relative group"
                style={{ backgroundImage: `url(${user.bannerUrl || DEFAULT_BANNER_URL})` }}
            >
                {isUploadingBanner ? (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                    <button 
                        type="button"
                        onClick={() => bannerFileInputRef.current?.click()}
                        className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-opacity opacity-0 group-hover:opacity-100"
                        aria-label="Alterar imagem de fundo"
                    >
                         <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                )}
            </div>
             <input
                type="file"
                ref={bannerFileInputRef}
                onChange={handleBannerFileSelect}
                className="hidden"
                accept="image/png, image/jpeg, image/gif, image/webp"
            />
             <div className="absolute left-1/2 -translate-x-1/2 top-48 -translate-y-1/2">
                <div className="relative group">
                    <img className="h-32 w-32 rounded-full border-4 border-[#18181B]" src={user.avatarUrl} alt={user.name} />
                    {isUploading ? (
                        <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center">
                            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                        <button
                            onClick={handleAvatarClick}
                            className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            aria-label="Alterar foto de perfil"
                        >
                            <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/png, image/jpeg, image/gif, image/webp"
            />
        </div>

        {/* Profile Content */}
        <div className="p-8 pt-20 text-center">
             <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-md text-[#c4b5fd]">{user.email}</p>
            <p className="mt-2 text-gray-300">{user.title || user.bio}</p>
        </div>
        
        <form onSubmit={handleFormSubmit} className="p-8 text-left">
            <div className="border-t border-white/10 pt-8">
                <h2 className="text-xl font-bold text-white mb-4">Configurações da Conta</h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleFormChange} className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleFormChange} className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all" />
                    </div>
                     <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">Sua Bio</label>
                        <textarea rows={3} name="bio" id="bio" value={formData.bio} onChange={handleFormChange} className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all" />
                    </div>
                </div>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
                <h2 className="text-xl font-bold text-white mb-4">Preferências de Notificação por Email</h2>
                <fieldset className="space-y-4">
                    <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                            <input id="newCoursesAndClasses" name="newCoursesAndClasses" type="checkbox" checked={formData.notificationPreferences.newCoursesAndClasses} onChange={handleFormChange} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="newCoursesAndClasses" className="font-medium text-white">Novas aulas e cursos</label>
                            <p className="text-gray-400">Receba alertas quando novos conteúdos de aprendizado forem lançados.</p>
                        </div>
                    </div>
                    <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                            <input id="communityEvents" name="communityEvents" type="checkbox" checked={formData.notificationPreferences.communityEvents} onChange={handleFormChange} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="communityEvents" className="font-medium text-white">Eventos e workshops da comunidade</label>
                            <p className="text-gray-400">Não perca nenhuma live, mentoria ou evento de networking.</p>
                        </div>
                    </div>
                    <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                            <input id="platformUpdates" name="platformUpdates" type="checkbox" checked={formData.notificationPreferences.platformUpdates} onChange={handleFormChange} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="platformUpdates" className="font-medium text-white">Atualizações importantes da plataforma</label>
                            <p className="text-gray-400">Fique por dentro de novas funcionalidades e anúncios institucionais.</p>
                        </div>
                    </div>
                </fieldset>
            </div>

            <div className="flex justify-end mt-8">
                 <button type="submit" className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40">
                    Salvar Alterações
                </button>
            </div>
        </form>

        <div className="mt-10 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-8">
            <div>
                 <h3 className="text-lg font-bold text-red-400">Desconectar Conta</h3>
                 <p className="text-sm text-gray-400 max-w-md">Ao sair, você precisará inserir suas credenciais novamente para acessar seu painel.</p>
            </div>
            <button
                onClick={handleLogout}
                className="w-full sm:w-auto flex-shrink-0 bg-red-500/10 text-red-400 font-semibold py-2 px-6 rounded-lg border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
                Sair
            </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;