import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { useAppContext } from '../App';
import Uploader from '../components/Uploader';

const DEFAULT_BANNER_URL = 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const StudentEditor: React.FC = () => {
  const { users, handleSaveUser, showToast } = useAppContext();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // 1. Determina os dados iniciais do usuário com base no parâmetro da URL.
  const initialUser = useMemo(() => {
    if (userId && userId !== 'new') {
      return users.find(u => u.id === userId && u.role === 'student');
    }
    // Estrutura padrão para um novo aluno
    return {
      id: `user_${Date.now()}`,
      name: '',
      email: '',
      avatarUrl: `https://picsum.photos/seed/new_student_${Date.now()}/200`,
      bio: 'Entusiasta de tecnologia pronto para aprender!',
      role: 'student' as const,
      profileStatus: 'incomplete' as const,
      completedLessonIds: [],
      xp: 0,
      achievements: [],
      streak: 0,
      lastCompletionDate: '',
      hasCompletedOnboardingTour: false,
    };
  }, [userId, users]);

  // 2. Estado para os dados do formulário, inicializado com os dados do usuário.
  const [formData, setFormData] = useState<Partial<User> | undefined>(initialUser);
  
  // Efeito para atualizar os dados do formulário se o initialUser mudar (ex: navegando entre editores)
  useEffect(() => {
    setFormData(initialUser);
  }, [initialUser]);


  if (!formData) {
    return <div className="text-center py-20">Usuário não encontrado.</div>;
  }

  // 3. Handlers para as ações do formulário.
  const onCancel = () => navigate('/admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleAvatarUploadComplete = (url: string) => {
    setFormData(prev => ({ ...prev, avatarUrl: url }));
    showToast('✅ Foto de perfil pronta para ser salva!');
  };

  const handleBannerUploadComplete = (url: string) => {
    setFormData(prev => ({ ...prev, bannerUrl: url }));
    showToast('✅ Imagem de fundo pronta para ser salva!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    // Garante que todos os campos necessários para um User estejam presentes antes de salvar
    const userToSave: User = {
        ...(initialUser as User),
        ...formData,
    } as User;
    handleSaveUser(userToSave);
    navigate('/admin');
  };

  // 4. Estilos reutilizáveis para inputs e labels.
  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 placeholder-gray-500 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";
  const educationLevels: User['educationLevel'][] = ['Ensino Fundamental', 'Ensino Médio Incompleto', 'Ensino Médio Completo', 'Ensino Superior Incompleto', 'Ensino Superior Completo', 'Outro'];
  const checkboxLabelClasses = "font-medium text-white";
  const checkboxDescriptionClasses = "text-gray-400 text-sm";


  // 5. Estrutura JSX para o componente.
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-white">{initialUser?.name ? 'Editor de Aluno' : 'Novo Aluno'}</h1>
            <p className="text-gray-400 mt-1">Gerencie as informações dos alunos da plataforma.</p>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onCancel} className="bg-white/10 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-white/20 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40">
              Salvar Aluno
            </button>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10 overflow-hidden">
            {/* Seção de Preview do Cabeçalho do Perfil */}
            <div className="relative">
                <div 
                    className="h-40 bg-cover bg-center relative group"
                    style={{ backgroundImage: `url(${formData.bannerUrl || DEFAULT_BANNER_URL})` }}
                >
                    <Uploader
                      pathnamePrefix={`banners/${formData.id}`}
                      onUploadComplete={handleBannerUploadComplete}
                    >
                      {(triggerUpload, isUploading) => (
                        <button type="button" onClick={triggerUpload} disabled={isUploading} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Alterar imagem de fundo">
                            {isUploading ? <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        </button>
                      )}
                    </Uploader>
                </div>
                
                <div className="absolute left-1/2 -translate-x-1/2 top-40 -translate-y-1/2">
                    <div className="relative group w-24 h-24">
                        <img className="h-24 w-24 rounded-full border-4 border-[#18181B] object-cover" src={formData.avatarUrl} alt={formData.name} />
                        <Uploader pathnamePrefix={`images/Student/${formData.id}`} onUploadComplete={handleAvatarUploadComplete}>
                          {(triggerUpload, isUploading) => (
                            <button type="button" onClick={triggerUpload} disabled={isUploading} className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Alterar foto de perfil">
                                {isUploading ? <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            </button>
                          )}
                        </Uploader>
                    </div>
                </div>
            </div>

            <div className="p-8 pt-16 space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 text-center">Informações Pessoais</h3>
                <div><label htmlFor="name" className={labelClasses}>Nome Completo</label><input id="name" name="name" value={formData.name || ''} onChange={handleChange} required className={inputClasses} /></div>
                <div><label htmlFor="email" className={labelClasses}>Email</label><input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required className={inputClasses} /></div>
                <div><label htmlFor="avatarUrl" className={labelClasses}>URL do Avatar</label><input id="avatarUrl" name="avatarUrl" key={formData.avatarUrl} value={formData.avatarUrl || ''} onChange={handleChange} required className={inputClasses} /></div>
                <div><label htmlFor="bio" className={labelClasses}>Bio</label><textarea id="bio" name="bio" value={formData.bio || ''} onChange={handleChange} required className={inputClasses} rows={3} /></div>
                
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 text-center pt-4">Informações Adicionais (ONG)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div><label htmlFor="dateOfBirth" className={labelClasses}>Data de Nascimento</label><input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth || ''} onChange={handleChange} className={inputClasses} style={{colorScheme: 'dark'}} /></div>
                    <div><label htmlFor="phoneNumber" className={labelClasses}>Telefone</label><input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber || ''} onChange={handleChange} placeholder="(21) 9..." className={inputClasses} /></div>
                </div>
                <div><label htmlFor="location" className={labelClasses}>Localização (Bairro, Cidade)</label><input id="location" name="location" value={formData.location || ''} onChange={handleChange} placeholder="Ex: Neves, São Gonçalo" className={inputClasses} /></div>
                <div><label htmlFor="educationLevel" className={labelClasses}>Nível de Escolaridade</label><select id="educationLevel" name="educationLevel" value={formData.educationLevel || ''} onChange={handleChange} className={inputClasses}><option value="">Não informado</option>{educationLevels.map(level => (<option key={level} value={level}>{level}</option>))}</select></div>
                <div><label htmlFor="motivation" className={labelClasses}>Motivação e Objetivos</label><textarea id="motivation" name="motivation" value={formData.motivation || ''} onChange={handleChange} className={inputClasses} rows={4} placeholder="Por que você quer aprender a programar?" /></div>

                <fieldset className="space-y-4 border-t border-white/10 pt-6">
                    <legend className="text-lg font-bold text-white mb-2 text-center">Segurança</legend>
                    <div className="relative flex items-start"><div className="flex h-5 items-center"><input id="mustChangePassword" name="mustChangePassword" type="checkbox" checked={formData.mustChangePassword || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" /></div><div className="ml-3 text-sm"><label htmlFor="mustChangePassword" className={checkboxLabelClasses}>Forçar alteração de senha no próximo login</label><p className={checkboxDescriptionClasses}>O usuário será obrigado a criar uma nova senha ao entrar.</p></div></div>
                </fieldset>
            </div>
        </div>
      </form>
    </div>
  );
};

export default StudentEditor;
