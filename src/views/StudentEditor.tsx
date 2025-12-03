
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { useAppContext } from '../App';
import Uploader from '../components/Uploader';
import EditorHeader from '../components/EditorHeader';
// @ts-ignore
import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

// ✅ SEGURO: Usar variáveis de ambiente ao invés de credenciais hardcoded
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};


const DEFAULT_BANNER_URL = 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const StudentEditor: React.FC = () => {
  const { users, handleSaveUser, showToast } = useAppContext();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const isCreating = userId === 'new';

  // Estado local para senha temporária (apenas na criação)
  const [tempPassword, setTempPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const initialUser = useMemo(() => {
    if (userId && !isCreating) {
      return users.find(u => u.id === userId && u.role === 'student');
    }
    return {
      id: '', // ID será gerado pelo Auth na criação
      name: '',
      email: '',
      avatarUrl: `https://picsum.photos/seed/new_student_${Date.now()}/200`,
      bio: 'Aluno matriculado via painel administrativo.',
      role: 'student' as const,
      profileStatus: 'incomplete' as const, // Força o fluxo de completar perfil
      completedLessonIds: [],
      xp: 0,
      achievements: [],
      streak: 0,
      lastCompletionDate: '',
      hasCompletedOnboardingTour: false,
      mustChangePassword: true, // Força a troca de senha
      accountStatus: 'active' as const,
    };
  }, [userId, users, isCreating]);

  const [formData, setFormData] = useState<Partial<User> | undefined>(initialUser);

  useEffect(() => {
    setFormData(initialUser);
  }, [initialUser]);

  if (!formData) {
    return <div className="text-center py-20">Usuário não encontrado.</div>;
  }

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
    if (!formData) return;
    // Se estamos editando, salvamos direto. Se criando, apenas atualizamos o state local.
    if (!isCreating) {
      const userToSave: User = { ...(initialUser as User), ...formData, avatarUrl: url };
      handleSaveUser(userToSave);
    } else {
      setFormData(prev => ({ ...prev, avatarUrl: url }));
    }
  };

  const handleBannerUploadComplete = (url: string) => {
    if (!formData) return;
    if (!isCreating) {
      const userToSave: User = { ...(initialUser as User), ...formData, bannerUrl: url };
      handleSaveUser(userToSave);
    } else {
      setFormData(prev => ({ ...prev, bannerUrl: url }));
    }
  };

  // Função mágica para criar usuário sem deslogar o admin
  const handleCreateStudentAuth = async () => {
    if (!formData?.email || !tempPassword || !formData.name) {
      showToast("❌ Preencha Nome, Email e Senha Temporária.");
      return;
    }

    setIsProcessing(true);

    // 1. Inicializa um app secundário do Firebase
    const secondaryAppName = "SecondaryApp";
    let secondaryApp = getApps().find((app: any) => app.name === secondaryAppName);
    if (!secondaryApp) {
      secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
    }
    const secondaryAuth = getAuth(secondaryApp);

    try {
      // 2. Cria o usuário na Auth Secundária
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, tempPassword);
      const newUser = userCredential.user;

      // 3. Atualiza o perfil básico no Auth
      await updateProfile(newUser, {
        displayName: formData.name,
        photoURL: formData.avatarUrl
      });

      // 4. Prepara o objeto completo para o Firestore
      const fullUserData: User = {
        ...(formData as User),
        id: newUser.uid, // Usa o UID real do Auth
        profileStatus: 'incomplete',
        mustChangePassword: true,
        role: 'student'
      };

      // 5. Salva no Firestore usando a instância PRINCIPAL do banco (db importado)
      // Não usamos handleSaveUser aqui para garantir a atomicidade e uso do ID correto
      await setDoc(doc(db, "users", newUser.uid), fullUserData);

      // 6. Limpeza
      await signOut(secondaryAuth);
      // Opcional: deleteApp(secondaryApp); // Pode causar erros se chamado muito rápido, signOut é suficiente.

      showToast(`✅ Aluno ${formData.name} cadastrado com sucesso!`);
      navigate('/admin');

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        showToast("❌ Este email já está sendo usado por outro aluno.");
      } else {
        console.error("Erro ao criar aluno:", error);
        showToast(`❌ Erro: ${error.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (isCreating) {
      handleCreateStudentAuth();
    } else {
      const userToSave: User = { ...(initialUser as User), ...formData } as User;
      handleSaveUser(userToSave);
      navigate('/admin');
    }
  };

  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 placeholder-gray-500 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";
  const educationLevels: User['educationLevel'][] = ['Ensino Fundamental', 'Ensino Médio Incompleto', 'Ensino Médio Completo', 'Ensino Superior Incompleto', 'Ensino Superior Completo', 'Outro'];
  const checkboxLabelClasses = "font-medium text-white";
  const checkboxDescriptionClasses = "text-gray-400 text-sm";

  return (
    <div className="min-h-screen bg-[#09090B]">
      <EditorHeader
        title={isCreating ? 'Matricular Novo Aluno' : 'Editar Aluno'}
        subtitle={isCreating
          ? 'Crie a conta de acesso. O aluno deverá trocar a senha no primeiro login.'
          : 'Gerencie os dados cadastrais do aluno.'}
        onBack={onCancel}
        actions={
          <button
            type="submit"
            form="student-form"
            disabled={isProcessing}
            className="bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40 disabled:opacity-50"
          >
            {isProcessing ? 'Processando...' : (isCreating ? 'Criar Conta' : 'Salvar Alterações')}
          </button>
        }
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="student-form" onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">

        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10 overflow-hidden">
          <div className="relative">
            <div
              className="h-40 bg-cover bg-center relative group"
              style={{ backgroundImage: `url(${formData.bannerUrl || DEFAULT_BANNER_URL})` }}
            >
              <Uploader
                pathnamePrefix={`banners/${formData.id || 'temp'}`}
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
                <Uploader pathnamePrefix={`images/Student/${formData.id || 'temp'}`} onUploadComplete={handleAvatarUploadComplete}>
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
            {isCreating && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg mb-6">
                <h3 className="text-yellow-400 font-bold text-sm mb-2">🔐 Credenciais de Acesso</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className={labelClasses}>Email de Login *</label>
                    <input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required className={inputClasses} />
                  </div>
                  <div>
                    <label htmlFor="tempPassword" className={labelClasses}>Senha Temporária *</label>
                    <input id="tempPassword" type="text" value={tempPassword} onChange={(e) => setTempPassword(e.target.value)} required className={inputClasses} placeholder="Mínimo 6 caracteres" />
                  </div>
                </div>
                <p className="text-xs text-yellow-500/80 mt-2">
                  O aluno será obrigado a trocar esta senha e completar o perfil socioeconômico no primeiro acesso.
                </p>
              </div>
            )}

            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 text-center">Dados Pessoais Básicos</h3>
            <div><label htmlFor="name" className={labelClasses}>Nome Completo</label><input id="name" name="name" value={formData.name || ''} onChange={handleChange} required className={inputClasses} /></div>

            {!isCreating && (
              <div><label htmlFor="email" className={labelClasses}>Email</label><input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required className={inputClasses} disabled /></div>
            )}

            <div><label htmlFor="bio" className={labelClasses}>Bio</label><textarea id="bio" name="bio" value={formData.bio || ''} onChange={handleChange} className={inputClasses} rows={3} /></div>

            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 text-center pt-4">Ficha Socioeconômica (ONG)</h3>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-4 text-center">Estes dados são geralmente preenchidos pelo aluno no onboarding, mas você pode editar se necessário.</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div><label htmlFor="dateOfBirth" className={labelClasses}>Data de Nascimento</label><input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth || ''} onChange={handleChange} className={inputClasses} style={{ colorScheme: 'dark' }} /></div>
                <div><label htmlFor="phoneNumber" className={labelClasses}>Telefone</label><input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber || ''} onChange={handleChange} placeholder="(21) 9..." className={inputClasses} /></div>
              </div>
              <div className="mt-4"><label htmlFor="location" className={labelClasses}>Localização (Bairro, Cidade)</label><input id="location" name="location" value={formData.location || ''} onChange={handleChange} placeholder="Ex: Neves, São Gonçalo" className={inputClasses} /></div>
              <div className="mt-4"><label htmlFor="educationLevel" className={labelClasses}>Nível de Escolaridade</label><select id="educationLevel" name="educationLevel" value={formData.educationLevel || ''} onChange={handleChange} className={inputClasses}><option value="">Não informado</option>{educationLevels.map(level => (<option key={level} value={level}>{level}</option>))}</select></div>
            </div>

            {!isCreating && (
              <fieldset className="space-y-4 border-t border-white/10 pt-6">
                <legend className="text-lg font-bold text-white mb-2 text-center">Segurança & Status</legend>
                <div className="relative flex items-start"><div className="flex h-5 items-center"><input id="mustChangePassword" name="mustChangePassword" type="checkbox" checked={formData.mustChangePassword || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" /></div><div className="ml-3 text-sm"><label htmlFor="mustChangePassword" className={checkboxLabelClasses}>Forçar alteração de senha no próximo login</label></div></div>
                <div className="relative flex items-start"><div className="flex h-5 items-center"><input id="accountStatus" name="accountStatus" type="checkbox" checked={formData.accountStatus === 'active'} onChange={(e) => setFormData(prev => ({ ...prev, accountStatus: e.target.checked ? 'active' : 'inactive' }))} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" /></div><div className="ml-3 text-sm"><label htmlFor="accountStatus" className={checkboxLabelClasses}>Conta Ativa</label></div></div>
                <div className="relative flex items-start"><div className="flex h-5 items-center"><input id="isMentor" name="isMentor" type="checkbox" checked={formData.isMentor || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" /></div><div className="ml-3 text-sm"><label htmlFor="isMentor" className={checkboxLabelClasses}>Exibir como Mentor Voluntário na página de Eventos</label><p className="text-xs text-gray-500 mt-1">Marque esta opção para que este usuário apareça como mentor disponível para agendamento</p></div></div>
              </fieldset>
            )}
          </div>
        </div>
      </form>
      </div>
    </div>
  );
};

export default StudentEditor;
