import React, { useState } from 'react';
import { User } from '../types';
import { useAppContext } from '../App';

interface TeamMemberEditorProps {
  member: User;
}

const TeamMemberEditor: React.FC<TeamMemberEditorProps> = ({ member: initialMember }) => {
  const { handleSaveUser, navigate } = useAppContext();
  const [member, setMember] = useState<User>(initialMember);

  const onCancel = () => navigate('admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setMember(prev => ({ ...prev, [name]: checked }));
    } else {
        setMember(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveUser(member);
  };

  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";
  const checkboxLabelClasses = "font-medium text-white";
  const checkboxDescriptionClasses = "text-gray-400 text-sm";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-white">{initialMember.name ? 'Editar Membro da Equipe' : 'Novo Membro da Equipe'}</h1>
            <p className="text-gray-400 mt-1">Gerencie os perfis e permissões dos membros da equipe.</p>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onCancel} className="bg-white/10 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-white/20 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40">
              Salvar Membro
            </button>
          </div>
        </div>

        <div className="p-8 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Informações Principais</h3>
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
                <label htmlFor="avatarUrl" className={labelClasses}>URL do Avatar</label>
                <input id="avatarUrl" name="avatarUrl" value={member.avatarUrl} onChange={handleChange} required className={inputClasses} />
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
            
            {/* FIX: Added a new fieldset to manage the isMentor and showOnTeamPage properties. */}
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
      </form>
    </div>
  );
};

export default TeamMemberEditor;