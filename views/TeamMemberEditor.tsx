import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { useAppContext } from '../App';
import Uploader from '../components/Uploader';
import EditorHeader from '../components/EditorHeader';

const DEFAULT_BANNER_URL = 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const TeamMemberEditor: React.FC = () => {
  const { users, handleSaveUser, showToast } = useAppContext();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const initialMember = useMemo(() => {
    if (userId && userId !== 'new') {
        return users.find(u => u.id === userId);
    }
    return {
        id: `user_${Date.now()}`,
        name: '', email: '', avatarUrl: `https://picsum.photos/seed/new_user/200`,
        bio: '', role: 'instructor' as User['role'], title: '',
        completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '',
        isMentor: false, showOnTeamPage: true
    };
  }, [userId, users]);

  const [member, setMember] = useState<User>(initialMember || {
    id: `user_${Date.now()}`,
    name: '', email: '', avatarUrl: `https://picsum.photos/seed/new_user/200`,
    // FIX: Explicitly cast 'role' to match the 'User' type to resolve type error.
    bio: '', role: 'instructor' as User['role'], title: '',
    completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '',
    isMentor: false, showOnTeamPage: true
  });
  
  if (!initialMember) {
    return <div className="text-center py-20">Membro da equipe não encontrado.</div>;
  }

  const onCancel = () => navigate('/admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setMember(prev => ({ ...prev, [name]: checked }));
    } else {
        setMember(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleAvatarUploadComplete = (url: string) => {
    setMember(prev => ({...prev, avatarUrl: url}));
    showToast('✅ Foto de perfil pronta para ser salva!');
  };

  const handleBannerUploadComplete = (url: string) => {
    setMember(prev => ({...prev, bannerUrl: url}));
    showToast('✅ Imagem de fundo pronta para ser salva!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveUser(member);
    navigate('/admin');
  };

  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";
  const checkboxLabelClasses = "font-medium text-white";
  const checkboxDescriptionClasses = "text-gray-400 text-sm";

  return (
    <div className="min-h-screen bg-[#09090B]">
      <EditorHeader
        title={initialMember.name ? 'Editar Membro da Equipe' : 'Novo Membro da Equipe'}
        subtitle="Gerencie os perfis e permissões dos membros da equipe."
        onBack={onCancel}
        actions={
          <button type="submit" form="team-member-form" className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40">
            Salvar Membro
          </button>
        }
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="team-member-form" onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">

        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10 overflow-hidden">
             <div className="relative">
                <div 
                    className="h-40 bg-cover bg-center relative group"
                    style={{ backgroundImage: `url(${member.bannerUrl || DEFAULT_BANNER_URL})` }}
                >
                  <Uploader
                    pathnamePrefix={`banners/${member.id}`}
                    onUploadComplete={handleBannerUploadComplete}
                  >
                    {(triggerUpload, isUploading) => (
                        <button 
                            type="button"
                            onClick={triggerUpload}
                            disabled={isUploading}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            aria-label="Alterar imagem de fundo"
                        >
                            {isUploading ? (
                              <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                             <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            )}
                        </button>
                    )}
                  </Uploader>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-40 -translate-y-1/2">
                    <div className="relative group w-24 h-24">
                        <img key={member.avatarUrl} className="h-24 w-24 rounded-full border-4 border-[#18181B] object-cover" src={member.avatarUrl} alt={member.name} />
                        <Uploader
                          pathnamePrefix={`avatars/${member.id}`}
                          onUploadComplete={handleAvatarUploadComplete}
                        >
                          {(triggerUpload, isUploading) => (
                            <button
                                type="button"
                                onClick={triggerUpload}
                                disabled={isUploading}
                                className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                aria-label="Alterar foto de perfil"
                            >
                                {isUploading ? (
                                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                )}
                            </button>
                          )}
                        </Uploader>
                    </div>
                </div>
            </div>
            <div className="p-8 pt-16 space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 text-center">Informações Principais</h3>
                <div>
                    <label htmlFor="name" className={labelClasses}>Nome Completo</label>
                    <input id="name" name="name" value={member.name} onChange={handleChange} required className={inputClasses} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="email" className={labelClasses}>Email</label>
                        <input id="email" name="email" type="email" value={member.email} onChange={handleChange} required className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="title" className={labelClasses}>Título Profissional</label>
                        <input id="title" name="title" value={member.title || ''} onChange={handleChange} placeholder="Ex: Desenvolvedor Frontend" className={inputClasses} />
                    </div>
                </div>
                <div>
                    <label htmlFor="avatarUrl" className={labelClasses}>URL do Avatar (ou faça upload acima)</label>
                    <input id="avatarUrl" name="avatarUrl" key={member.avatarUrl} value={member.avatarUrl} onChange={handleChange} required className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="bio" className={labelClasses}>Bio</label>
                    <textarea id="bio" name="bio" value={member.bio} onChange={handleChange} required className={inputClasses} rows={3} placeholder="Uma breve biografia sobre o(a) membro(a) da equipe."/>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="linkedinUrl" className={labelClasses}>URL do LinkedIn</label>
                        <input id="linkedinUrl" name="linkedinUrl" type="url" value={member.linkedinUrl || ''} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="githubUrl" className={labelClasses}>URL do GitHub</label>
                        <input id="githubUrl" name="githubUrl" type="url" value={member.githubUrl || ''} onChange={handleChange} className={inputClasses} />
                    </div>
                </div>

                <fieldset className="space-y-5 border-t border-white/10 pt-6">
                    <legend className="text-lg font-bold text-white mb-2">Papéis e Visibilidade</legend>
                    <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                        <input id="isMentor" name="isMentor" type="checkbox" checked={member.isMentor || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" />
                        </div>
                        <div className="ml-3 text-sm">
                        <label htmlFor="isMentor" className={checkboxLabelClasses}>É Mentor(a)</label>
                        <p className={checkboxDescriptionClasses}>Marque se este membro pode oferecer mentorias individuais na plataforma.</p>
                        </div>
                    </div>
                    <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                        <input id="showOnTeamPage" name="showOnTeamPage" type="checkbox" checked={member.showOnTeamPage || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" />
                        </div>
                        <div className="ml-3 text-sm">
                        <label htmlFor="showOnTeamPage" className={checkboxLabelClasses}>Mostrar na página "Nossa Equipe"</label>
                        <p className={checkboxDescriptionClasses}>Marque se o perfil deste membro deve ser exibido publicamente.</p>
                        </div>
                    </div>
                </fieldset>
                
                <fieldset className="space-y-5 border-t border-white/10 pt-6">
                <legend className="text-lg font-bold text-white mb-2">Segurança</legend>
                <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                    <input id="mustChangePassword" name="mustChangePassword" type="checkbox" checked={member.mustChangePassword || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" />
                    </div>
                    <div className="ml-3 text-sm">
                    <label htmlFor="mustChangePassword" className={checkboxLabelClasses}>Forçar alteração de senha no próximo login</label>
                    <p className={checkboxDescriptionClasses}>O usuário será obrigado a criar uma nova senha ao entrar na plataforma.</p>
                    </div>
                </div>
                </fieldset>
            </div>
        </div>
      </form>
      </div>
    </div>
  );
};

export default TeamMemberEditor;