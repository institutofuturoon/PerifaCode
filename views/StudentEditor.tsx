import React, { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { useAppContext } from '../App';
import { put } from '@vercel/blob';

const DEFAULT_BANNER_URL = 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';


const StudentEditor: React.FC = () => {
  const { users, handleSaveUser, showToast } = useAppContext();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const initialUser = useMemo(() => {
    if (userId && userId !== 'new') {
        return users.find(u => u.id === userId);
    }
    return {
        id: `user_${Date.now()}`, name: '', email: '',
        avatarUrl: `https://picsum.photos/seed/new_user/200`,
        bio: 'Entusiasta de tecnologia pronto para aprender!',
        role: 'student', profileStatus: 'incomplete',
        completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '',
        hasCompletedOnboardingTour: false,
    };
  }, [userId, users]);
  
  const [user, setUser] = useState<User>(initialUser || {
        id: `user_${Date.now()}`, name: '', email: '',
        avatarUrl: `https://picsum.photos/seed/new_user/200`,
        bio: 'Entusiasta de tecnologia pronto para aprender!',
        role: 'student', profileStatus: 'incomplete',
        completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '',
        hasCompletedOnboardingTour: false,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  
  if (!initialUser) {
    return <div className="text-center py-20">Usuário não encontrado.</div>;
  }

  const onCancel = () => navigate('/admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setUser(prev => ({ ...prev, [name]: checked }));
    } else {
        setUser(prev => ({ ...prev, [name]: value }));
    }
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
        const BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_uI73bVafvL0LLaMC_v9NEwyi9BSF1pBmOXbFEamnbWvh3Rc';
        
        const newBlob = await put(`avatars/${user.id}-${Date.now()}-${file.name}`, file, {
          access: 'public',
          token: BLOB_READ_WRITE_TOKEN,
        });

        setUser(prev => ({ ...prev, avatarUrl: newBlob.url }));
        showToast('✅ Foto de perfil pronta para ser salva!');

    } catch (err: any) {
        console.error('Erro ao fazer upload da imagem:', err);
        const message = err.message || 'Ocorreu um erro desconhecido.';
        showToast(`❌ Erro ao enviar a foto: ${message}`);
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
        const BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_uI73bVafvL0LLaMC_v9NEwyi9BSF1pBmOXbFEamnbWvh3Rc';
        
        const newBlob = await put(`banners/${user.id}-${Date.now()}-${file.name}`, file, {
          access: 'public',
          token: BLOB_READ_WRITE_TOKEN,
        });

        setUser(prev => ({ ...prev, bannerUrl: newBlob.url }));
        showToast('✅ Imagem de fundo pronta para ser salva!');

    } catch (err: any) {
        console.error('Erro ao fazer upload do banner:', err);
        const message = err.message || 'Ocorreu um erro desconhecido.';
        showToast(`❌ Erro ao enviar o fundo: ${message}`);
    } finally {
        setIsUploadingBanner(false);
        if(bannerFileInputRef.current) {
            bannerFileInputRef.current.value = "";
        }
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveUser(user);
    navigate('/admin');
  };

  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";
  const checkboxLabelClasses = "font-medium text-white";
  const checkboxDescriptionClasses = "text-gray-400 text-sm";
  const educationLevels: User['educationLevel'][] = ['Ensino Fundamental', 'Ensino Médio Incompleto', 'Ensino Médio Completo', 'Ensino Superior Incompleto', 'Ensino Superior Completo', 'Outro'];
  const isTeamMember = user.role === 'instructor' || user.role === 'admin';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-white">{initialUser.name ? 'Editor de Usuário' : 'Novo Usuário'}</h1>
            <p className="text-gray-400 mt-1">Gerencie os perfis e permissões dos usuários da plataforma.</p>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onCancel} className="bg-white/10 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-white/20 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40">
              Salvar Usuário
            </button>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10 overflow-hidden">
             {/* Profile Header Preview */}
            <div className="relative">
                <div 
                    className="h-40 bg-cover bg-center relative group"
                    style={{ backgroundImage: `url(${user.bannerUrl || DEFAULT_BANNER_URL})` }}
                >
                    {isUploadingBanner ? (
                        <div className="absolute inset-0 rounded-t-2xl bg-black/70 flex items-center justify-center">
                            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        </div>
                    ) : (
                        <button 
                            type="button"
                            onClick={() => bannerFileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            aria-label="Alterar imagem de fundo"
                        >
                             <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
                <div className="absolute left-1/2 -translate-x-1/2 top-40 -translate-y-1/2">
                    <div className="relative group w-24 h-24">
                        <img className="h-24 w-24 rounded-full border-4 border-[#18181B] object-cover" src={user.avatarUrl} alt={user.name} />
                        {isUploading ? (
                            <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center">
                                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                aria-label="Alterar foto de perfil"
                            >
                                <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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

            <div className="p-8 pt-16 space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 text-center">Informações Principais</h3>
                <div>
                    <label htmlFor="name" className={labelClasses}>Nome Completo</label>
                    <input id="name" name="name" value={user.name} onChange={handleChange} required className={inputClasses} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="email" className={labelClasses}>Email</label>
                        <input id="email" name="email" type="email" value={user.email} onChange={handleChange} required className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="title" className={labelClasses}>Título Profissional</label>
                        <input id="title" name="title" value={user.title || ''} onChange={handleChange} placeholder="Ex: Desenvolvedor Frontend" className={inputClasses} />
                    </div>
                </div>
                <div>
                    <label htmlFor="avatarUrl" className={labelClasses}>URL do Avatar (ou faça upload acima)</label>
                    <input id="avatarUrl" name="avatarUrl" value={user.avatarUrl} onChange={handleChange} required className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="bannerUrl" className={labelClasses}>URL da Imagem de Fundo (ou faça upload acima)</label>
                    <input id="bannerUrl" name="bannerUrl" value={user.bannerUrl || ''} onChange={handleChange} placeholder="Cole a URL da imagem de fundo aqui" className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="bio" className={labelClasses}>Bio</label>
                    <textarea id="bio" name="bio" value={user.bio} onChange={handleChange} required className={inputClasses} rows={3} placeholder="Uma breve biografia sobre o(a) usuário(a)."/>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="linkedinUrl" className={labelClasses}>URL do LinkedIn</label>
                        <input id="linkedinUrl" name="linkedinUrl" type="url" value={user.linkedinUrl || ''} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="githubUrl" className={labelClasses}>URL do GitHub</label>
                        <input id="githubUrl" name="githubUrl" type="url" value={user.githubUrl || ''} onChange={handleChange} className={inputClasses} />
                    </div>
                </div>

                {isTeamMember && (
                    <fieldset className="space-y-5 border-t border-white/10 pt-6">
                        <legend className="text-lg font-bold text-white mb-2">Papéis e Visibilidade</legend>
                        <div className="relative flex items-start">
                            <div className="flex h-5 items-center">
                            <input id="isMentor" name="isMentor" type="checkbox" checked={user.isMentor || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" />
                            </div>
                            <div className="ml-3 text-sm">
                            <label htmlFor="isMentor" className={checkboxLabelClasses}>É Mentor(a)</label>
                            <p className={checkboxDescriptionClasses}>Marque se este membro pode oferecer mentorias individuais na plataforma.</p>
                            </div>
                        </div>
                        <div className="relative flex items-start">
                            <div className="flex h-5 items-center">
                            <input id="showOnTeamPage" name="showOnTeamPage" type="checkbox" checked={user.showOnTeamPage || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" />
                            </div>
                            <div className="ml-3 text-sm">
                            <label htmlFor="showOnTeamPage" className={checkboxLabelClasses}>Mostrar na página "Nossa Equipe"</label>
                            <p className={checkboxDescriptionClasses}>Marque se o perfil deste membro deve ser exibido publicamente.</p>
                            </div>
                        </div>
                    </fieldset>
                )}


                <fieldset className="space-y-5 border-t border-white/10 pt-6">
                <legend className="text-lg font-bold text-white mb-2">Segurança</legend>
                <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                    <input id="mustChangePassword" name="mustChangePassword" type="checkbox" checked={user.mustChangePassword || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" />
                    </div>
                    <div className="ml-3 text-sm">
                    <label htmlFor="mustChangePassword" className={checkboxLabelClasses}>Forçar alteração de senha no próximo login</label>
                    <p className={checkboxDescriptionClasses}>O usuário será obrigado a criar uma nova senha ao entrar na plataforma.</p>
                    </div>
                </div>
                </fieldset>

                {!isTeamMember && (
                    <div className="space-y-6 border-t border-white/10 pt-6">
                        <h3 className="text-lg font-bold text-white">Informações Adicionais (ONG)</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="dateOfBirth" className={labelClasses}>Data de Nascimento</label>
                                <input id="dateOfBirth" name="dateOfBirth" type="date" value={user.dateOfBirth || ''} onChange={handleChange} className={inputClasses} />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className={labelClasses}>Telefone</label>
                                <input id="phoneNumber" name="phoneNumber" type="tel" value={user.phoneNumber || ''} onChange={handleChange} placeholder="(11) 9..." className={inputClasses} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="location" className={labelClasses}>Localização (Bairro, Cidade)</label>
                            <input id="location" name="location" value={user.location || ''} onChange={handleChange} placeholder="Ex: Capão Redondo, São Paulo" className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="educationLevel" className={labelClasses}>Nível de Escolaridade</label>
                            <select id="educationLevel" name="educationLevel" value={user.educationLevel || ''} onChange={handleChange} className={inputClasses}>
                                <option value="">Não informado</option>
                                {educationLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="motivation" className={labelClasses}>Motivação e Objetivos</label>
                            <textarea id="motivation" name="motivation" value={user.motivation || ''} onChange={handleChange} className={inputClasses} rows={4} placeholder="Por que você quer aprender a programar? Quais são seus sonhos?"/>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </form>
    </div>
  );
};

export default StudentEditor;