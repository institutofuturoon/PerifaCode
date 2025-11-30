
import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../App';
import Uploader from '../components/Uploader';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

const DEFAULT_BANNER_URL = 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color?: string }> = ({ label, value, icon, color = "text-white" }) => (
    <div className="bg-[#18181B] border border-white/5 p-4 rounded-xl flex items-center gap-4 shadow-lg hover:border-[#8a4add]/30 transition-colors">
        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-xl">
            {icon}
        </div>
        <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{label}</p>
            <p className={`text-lg font-black ${color}`}>{value}</p>
        </div>
    </div>
);

type TabType = 'personal' | 'socioeconomic';

const Profile: React.FC = () => {
  const { user, handleLogout, handleUpdateUserProfile, showToast, courses } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [cepLoading, setCepLoading] = useState(false);
  
  const [formData, setFormData] = useState({
      // Dados Pessoais
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      title: user?.role === 'student' ? 'Aluno' : (user?.title || ''),
      linkedinUrl: user?.linkedinUrl || '',
      githubUrl: user?.githubUrl || '',
      
      // Preferências
      notificationPreferences: {
          newCoursesAndClasses: user?.notificationPreferences?.newCoursesAndClasses ?? true,
          communityEvents: user?.notificationPreferences?.communityEvents ?? true,
          platformUpdates: user?.notificationPreferences?.platformUpdates ?? true,
      },

      // Perfil Socioeconômico & Demográfico
      dateOfBirth: user?.dateOfBirth || '',
      cpf: user?.cpf || '',
      rg: user?.rg || '',
      gender: user?.gender || '',
      race: user?.race || '',
      phoneNumber: user?.phoneNumber || '',
      emergencyPhoneNumber: user?.emergencyPhoneNumber || '',
      cep: user?.cep || '',
      address: user?.address || '',
      city: user?.city || '',
      neighborhood: user?.neighborhood || '',
      familyIncome: user?.familyIncome || '',
      residentsInHome: user?.residentsInHome || 0,
      educationLevel: user?.educationLevel || '',
  });

  useEffect(() => {
    if (user) {
        setFormData(prev => ({
            ...prev,
            name: user.name,
            email: user.email,
            bio: user.bio,
            // Lógica de negócio: Se for aluno, força o título 'Aluno'
            title: user.role === 'student' ? 'Aluno' : (user.title || ''),
            linkedinUrl: user.linkedinUrl || '',
            githubUrl: user.githubUrl || '',
            notificationPreferences: {
                newCoursesAndClasses: user.notificationPreferences?.newCoursesAndClasses ?? true,
                communityEvents: user.notificationPreferences?.communityEvents ?? true,
                platformUpdates: user.notificationPreferences?.platformUpdates ?? true,
            },
            dateOfBirth: user.dateOfBirth || '',
            cpf: user.cpf || '',
            rg: user.rg || '',
            gender: user.gender || '',
            race: user.race || '',
            phoneNumber: user.phoneNumber || '',
            emergencyPhoneNumber: user.emergencyPhoneNumber || '',
            cep: user.cep || '',
            address: user.address || '',
            city: user.city || '',
            neighborhood: user.neighborhood || '',
            familyIncome: user.familyIncome || '',
            residentsInHome: user.residentsInHome || 0,
            educationLevel: user.educationLevel || '',
        }));
    }
  }, [user]);
  
  // Prepare user notes data
  const userNotes = useMemo(() => {
      if (!user || !user.notes) return [];
      
      const notesList: { lessonId: string, note: string, lessonTitle: string, courseTitle: string, courseId: string }[] = [];
      
      Object.entries(user.notes).forEach(([lessonId, noteValue]) => {
          const note = noteValue as string;
          if (!note.trim()) return;
          
          let foundLesson = null;
          let foundCourse = null;
          
          for (const course of courses) {
              const lesson = course.modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
              if (lesson) {
                  foundLesson = lesson;
                  foundCourse = course;
                  break;
              }
          }
          
          if (foundLesson && foundCourse) {
              notesList.push({
                  lessonId,
                  note,
                  lessonTitle: foundLesson.title,
                  courseTitle: foundCourse.title,
                  courseId: foundCourse.id
              });
          }
      });
      
      return notesList;
  }, [user, courses]);

  if (!user) return null;

  const handleAvatarUploadComplete = async (url: string) => {
    if (!user) return;
    await handleUpdateUserProfile({ ...user, avatarUrl: url });
    showToast('✅ Foto de perfil atualizada!');
  };

  const handleBannerUploadComplete = async (url: string) => {
    if (!user) return;
    await handleUpdateUserProfile({ ...user, bannerUrl: url });
    showToast('✅ Imagem de fundo atualizada!');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        showToast('CEP não encontrado.');
        setFormData(prev => ({ ...prev, city: '', neighborhood: '', address: '' }));
      } else {
        setFormData(prev => ({ ...prev, city: data.localidade, neighborhood: data.bairro, address: data.logradouro }));
        showToast('Endereço preenchido automaticamente!');
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setCepLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await handleUpdateUserProfile({ ...user, ...formData } as unknown as User);
      showToast('✅ Perfil salvo com sucesso!');
  };

  const inputClasses = "w-full p-3 bg-[#09090B] border border-white/10 rounded-lg focus:ring-1 focus:ring-[#8a4add] focus:outline-none transition-all text-sm text-white placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white/5";
  const labelClasses = "block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide";
  const educationLevels: User['educationLevel'][] = ['Ensino Fundamental', 'Ensino Médio Incompleto', 'Ensino Médio Completo', 'Ensino Superior Incompleto', 'Ensino Superior Completo', 'Outro'];

  return (
    <div className="min-h-screen bg-[#09090B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button 
            onClick={() => navigate('/painel')} 
            className="group flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </div>
            <span className="text-sm font-medium">Voltar ao Dashboard</span>
        </button>

        <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left Column: Identity Card */}
            <div className="lg:col-span-4">
                <div className="bg-[#121212] rounded-2xl border border-white/10 overflow-hidden sticky top-24 shadow-2xl shadow-black/50">
                    {/* Banner Area */}
                    <div className="relative h-32 bg-gray-800 group">
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-80 transition-opacity group-hover:opacity-60"
                            style={{ backgroundImage: `url(${user.bannerUrl || DEFAULT_BANNER_URL})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                        
                        <Uploader pathnamePrefix={`banners/${user.id}`} onUploadComplete={handleBannerUploadComplete}>
                            {(trigger, isUploading) => (
                                <button 
                                    onClick={trigger} 
                                    disabled={isUploading}
                                    className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-white/10"
                                    title="Alterar Capa"
                                >
                                    {isUploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                </button>
                            )}
                        </Uploader>
                    </div>

                    {/* Avatar & Basic Info */}
                    <div className="px-6 pb-6 relative">
                        <div className="relative -mt-16 mb-4 inline-block group">
                            <img 
                                src={user.avatarUrl} 
                                alt={user.name} 
                                className="w-24 h-24 rounded-full border-4 border-[#121212] bg-[#121212] object-cover shadow-xl"
                            />
                            <Uploader pathnamePrefix={user.role === 'student' ? `images/Student/${user.id}` : `avatars/${user.id}`} onUploadComplete={handleAvatarUploadComplete}>
                                {(trigger, isUploading) => (
                                    <button 
                                        onClick={trigger}
                                        disabled={isUploading}
                                        className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-transparent"
                                    >
                                        {isUploading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" /></svg>}
                                    </button>
                                )}
                            </Uploader>
                        </div>

                        <div className="mb-6">
                            <h1 className="text-xl font-bold text-white">{user.name}</h1>
                            <p className="text-sm text-[#c4b5fd]">{user.email}</p>
                            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide font-semibold">{user.role === 'student' ? 'Aluno' : user.role === 'instructor' ? 'Instrutor' : 'Admin'}</p>
                        </div>

                        <p className="text-sm text-gray-300 leading-relaxed mb-6">
                            {user.bio || "Nenhuma bio definida."}
                        </p>

                        <div className="border-t border-white/5 pt-6 mt-6">
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Sair da Conta
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Content & Settings */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="XP Total" value={user.xp.toLocaleString()} icon="⚡" color="text-[#c4b5fd]" />
                    <StatCard label="Aulas Concluídas" value={user.completedLessonIds.length} icon="📚" color="text-green-400" />
                    <StatCard label="Ofensiva" value={`${user.streak} Dias`} icon="🔥" color="text-orange-400" />
                </div>

                {/* Notes Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span>📝</span> Minhas Anotações
                        </h2>
                        <span className="text-xs font-bold text-gray-500 bg-white/5 px-2 py-1 rounded">{userNotes.length} notas</span>
                    </div>
                    
                    {userNotes.length > 0 ? (
                        <div className="grid gap-4">
                            {userNotes.map((noteItem, index) => (
                                <div key={index} className="bg-[#121212] p-5 rounded-xl border border-white/5 hover:border-[#8a4add]/30 transition-all group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-sm font-bold text-white group-hover:text-[#c4b5fd] transition-colors">{noteItem.lessonTitle}</h3>
                                            <p className="text-xs text-gray-500">{noteItem.courseTitle}</p>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/course/${noteItem.courseId}/lesson/${noteItem.lessonId}`)}
                                            className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            Ir para Aula <span>→</span>
                                        </button>
                                    </div>
                                    <div className="bg-[#09090B] p-4 rounded-lg border border-white/5 text-gray-300 text-sm italic font-serif leading-relaxed">
                                        "{noteItem.note}"
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#121212] border border-white/5 border-dashed rounded-xl p-10 text-center">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500 text-2xl">✏️</div>
                            <p className="text-gray-400 text-sm font-medium">Seu caderno está vazio.</p>
                            <p className="text-gray-500 text-xs mt-1">Use a aba "Anotações" durante as aulas para salvar seus insights aqui.</p>
                        </div>
                    )}
                </section>

                {/* Settings Form with Tabs */}
                <section className="bg-[#121212] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="border-b border-white/10">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`px-6 py-4 text-sm font-bold transition-all duration-300 border-b-2 ${
                                    activeTab === 'personal' 
                                    ? 'border-[#8a4add] text-white bg-white/5' 
                                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                Dados Pessoais
                            </button>
                            <button
                                onClick={() => setActiveTab('socioeconomic')}
                                className={`px-6 py-4 text-sm font-bold transition-all duration-300 border-b-2 ${
                                    activeTab === 'socioeconomic' 
                                    ? 'border-[#8a4add] text-white bg-white/5' 
                                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                Perfil Socioeconômico
                            </button>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            
                            {activeTab === 'personal' && (
                                <div className="animate-fade-in space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className={labelClasses}>Nome Completo</label>
                                            <input type="text" name="name" id="name" value={formData.name} onChange={handleFormChange} className={inputClasses} />
                                        </div>
                                        <div>
                                            <label htmlFor="title" className={labelClasses}>Título Profissional {user.role === 'student' ? '(Padrão para Alunos)' : ''}</label>
                                            <input 
                                                type="text" 
                                                name="title" 
                                                id="title" 
                                                value={formData.title} 
                                                onChange={handleFormChange} 
                                                className={`${inputClasses} ${user.role === 'student' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                placeholder="Opcional"
                                                disabled={user.role === 'student'}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="bio" className={labelClasses}>Bio / Sobre Mim</label>
                                        <textarea name="bio" id="bio" rows={3} value={formData.bio} onChange={handleFormChange} className={inputClasses} placeholder="Conte um pouco sobre você..." />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="linkedinUrl" className={labelClasses}>URL do LinkedIn</label>
                                            <input type="url" name="linkedinUrl" id="linkedinUrl" value={formData.linkedinUrl} onChange={handleFormChange} className={inputClasses} placeholder="https://linkedin.com/in/..." />
                                        </div>
                                        <div>
                                            <label htmlFor="githubUrl" className={labelClasses}>URL do GitHub</label>
                                            <input type="url" name="githubUrl" id="githubUrl" value={formData.githubUrl} onChange={handleFormChange} className={inputClasses} placeholder="https://github.com/..." />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/10">
                                        <h3 className="text-sm font-bold text-white mb-4">Preferências de Email</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                                                <input type="checkbox" name="newCoursesAndClasses" checked={formData.notificationPreferences.newCoursesAndClasses} onChange={handleFormChange} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" />
                                                <span className="text-sm text-gray-300">Novas aulas e cursos lançados</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                                                <input type="checkbox" name="communityEvents" checked={formData.notificationPreferences.communityEvents} onChange={handleFormChange} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" />
                                                <span className="text-sm text-gray-300">Eventos e workshops da comunidade</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                                                <input type="checkbox" name="platformUpdates" checked={formData.notificationPreferences.platformUpdates} onChange={handleFormChange} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add]" />
                                                <span className="text-sm text-gray-300">Novidades da plataforma FuturoOn</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'socioeconomic' && (
                                <div className="animate-fade-in space-y-6">
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg mb-4 flex items-start gap-3">
                                        <span className="text-yellow-400 text-lg mt-0.5">🔒</span>
                                        <div>
                                            <p className="text-sm font-bold text-yellow-400 mb-1">Dados Confidenciais</p>
                                            <p className="text-xs text-yellow-200/80 leading-relaxed">
                                                Estas informações são essenciais para a manutenção da ONG e para gerar relatórios de impacto social. 
                                                Seus dados são mantidos em sigilo e utilizados apenas para fins estatísticos.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="dateOfBirth" className={labelClasses}>Data de Nascimento</label>
                                            <input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleFormChange} className={inputClasses} style={{colorScheme: 'dark'}} />
                                        </div>
                                        <div>
                                            <label htmlFor="cpf" className={labelClasses}>CPF (Somente Números)</label>
                                            <input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleFormChange} className={inputClasses} maxLength={11} placeholder="000.000.000-00" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="rg" className={labelClasses}>RG</label>
                                            <input type="text" name="rg" id="rg" value={formData.rg} onChange={handleFormChange} className={inputClasses} />
                                        </div>
                                        <div>
                                            <label htmlFor="educationLevel" className={labelClasses}>Escolaridade</label>
                                            <select name="educationLevel" id="educationLevel" value={formData.educationLevel} onChange={handleFormChange} className={inputClasses}>
                                                <option value="">Selecione...</option>
                                                {educationLevels.map(level => <option key={level} value={level}>{level}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="gender" className={labelClasses}>Gênero</label>
                                            <select name="gender" id="gender" value={formData.gender} onChange={handleFormChange} className={inputClasses}>
                                                <option value="">Selecione...</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Feminino">Feminino</option>
                                                <option value="Não-binário">Não-binário</option>
                                                <option value="Outro">Outro</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="race" className={labelClasses}>Raça/Cor</label>
                                            <select name="race" id="race" value={formData.race} onChange={handleFormChange} className={inputClasses}>
                                                <option value="">Selecione...</option>
                                                <option value="Preto">Preto</option>
                                                <option value="Pardo">Pardo</option>
                                                <option value="Indígena">Indígena</option>
                                                <option value="Branco">Branco</option>
                                                <option value="Amarelo">Amarelo</option>
                                            </select>
                                        </div>
                                    </div>

                                    <hr className="border-white/10 my-6" />
                                    
                                    <h4 className="text-white font-bold text-sm mb-4">Contato e Endereço</h4>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phoneNumber" className={labelClasses}>Celular / WhatsApp</label>
                                            <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} className={inputClasses} />
                                        </div>
                                        <div>
                                            <label htmlFor="emergencyPhoneNumber" className={labelClasses}>Contato de Emergência</label>
                                            <input type="tel" name="emergencyPhoneNumber" id="emergencyPhoneNumber" value={formData.emergencyPhoneNumber} onChange={handleFormChange} className={inputClasses} />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div>
                                            <label htmlFor="cep" className={labelClasses}>CEP</label>
                                            <div className="relative">
                                                <input type="text" name="cep" id="cep" value={formData.cep} onChange={handleFormChange} onBlur={handleCepBlur} className={inputClasses} maxLength={9} placeholder="00000-000" />
                                                {cepLoading && <div className="absolute right-3 top-3"><div className="w-4 h-4 border-2 border-[#8a4add] border-t-transparent rounded-full animate-spin"></div></div>}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="address" className={labelClasses}>Endereço (Rua, Nº)</label>
                                            <input type="text" name="address" id="address" value={formData.address} onChange={handleFormChange} className={inputClasses} />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="city" className={labelClasses}>Cidade</label>
                                            <input type="text" name="city" id="city" value={formData.city} onChange={handleFormChange} className={inputClasses} />
                                        </div>
                                        <div>
                                            <label htmlFor="neighborhood" className={labelClasses}>Bairro</label>
                                            <input type="text" name="neighborhood" id="neighborhood" value={formData.neighborhood} onChange={handleFormChange} className={inputClasses} />
                                        </div>
                                    </div>

                                    <hr className="border-white/10 my-6" />

                                    <h4 className="text-white font-bold text-sm mb-4">Informações do Domicílio</h4>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="familyIncome" className={labelClasses}>Renda Familiar</label>
                                            <select name="familyIncome" id="familyIncome" value={formData.familyIncome} onChange={handleFormChange} className={inputClasses}>
                                                <option value="">Selecione...</option>
                                                <option value="Até 1 salário mínimo">Até 1 salário mínimo</option>
                                                <option value="Entre 1 e 2 salários mínimos">Entre 1 e 2 salários mínimos</option>
                                                <option value="Entre 2 e 4 salários mínimos">Entre 2 e 4 salários mínimos</option>
                                                <option value="Acima de 4 salários mínimos">Acima de 4 salários mínimos</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="residentsInHome" className={labelClasses}>Pessoas na Residência</label>
                                            <input type="number" name="residentsInHome" id="residentsInHome" value={formData.residentsInHome} onChange={handleFormChange} className={inputClasses} min="1" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="flex justify-between items-center pt-6 border-t border-white/10">
                                <button 
                                    type="button" 
                                    onClick={() => navigate('/painel')}
                                    className="text-gray-400 hover:text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                                >
                                    Voltar
                                </button>
                                <button type="submit" className="bg-[#8a4add] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#7c3aed] transition-all shadow-lg shadow-[#8a4add]/20 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
