import React, { useState } from 'react';
import { User } from '../types';
import { useAppContext } from '../App';

interface UserEditorProps {
  student: User; // Prop name is kept for compatibility with App.tsx router
}

const StudentEditor: React.FC<UserEditorProps> = ({ student: initialUser }) => {
  const { handleSaveUser, navigate } = useAppContext();
  const [user, setUser] = useState<User>(initialUser);

  const onCancel = () => navigate('admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setUser(prev => ({ ...prev, [name]: checked }));
    } else {
        setUser(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveUser(user);
  };

  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";
  const checkboxLabelClasses = "font-medium text-white";
  const checkboxDescriptionClasses = "text-gray-400 text-sm";
  const educationLevels: User['educationLevel'][] = ['Ensino Fundamental', 'Ensino Médio Incompleto', 'Ensino Médio Completo', 'Ensino Superior Incompleto', 'Ensino Superior Completo', 'Outro'];

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

        <div className="p-8 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Informações Principais</h3>
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
                <label htmlFor="avatarUrl" className={labelClasses}>URL do Avatar</label>
                <input id="avatarUrl" name="avatarUrl" value={user.avatarUrl} onChange={handleChange} required className={inputClasses} />
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
        </div>
      </form>
    </div>
  );
};

export default StudentEditor;