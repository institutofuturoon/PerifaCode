import React, { useState } from 'react';
// FIX: The 'TeamMember' type does not exist in 'types.ts'. Replaced with 'User'.
import { User } from '../types';
import { useAppContext } from '../App';

interface TeamMemberEditorProps {
  member: User;
}

const TeamMemberEditor: React.FC<TeamMemberEditorProps> = ({ member: initialMember }) => {
  // FIX: The function 'handleSaveTeamMember' does not exist in the context. Replaced with 'handleSaveUser'.
  const { handleSaveUser, navigate } = useAppContext();
  const [member, setMember] = useState<User>(initialMember);

  const onCancel = () => navigate('admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors sm:text-sm text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";
  const checkboxLabelClasses = "font-medium text-white";
  const checkboxDescriptionClasses = "text-gray-400 text-sm";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-white">{initialMember.name ? 'Editar Membro da Equipe' : 'Novo Membro da Equipe'}</h1>
            <p className="text-gray-400 mt-1">Gerencie os perfis e permissões da equipe.</p>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onCancel} className="bg-white/10 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-white/20 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
              Salvar
            </button>
          </div>
        </div>

        <div className="p-8 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 space-y-6">
            <div>
                <label htmlFor="name" className={labelClasses}>Nome Completo</label>
                <input id="name" name="name" value={member.name} onChange={handleChange} required className={inputClasses} />
            </div>
            <div>
                <label htmlFor="title" className={labelClasses}>Título Profissional</label>
                <input id="title" name="title" value={member.title || ''} onChange={handleChange} placeholder="Ex: Desenvolvedor Frontend" required className={inputClasses} />
            </div>
            <div>
                <label htmlFor="avatarUrl" className={labelClasses}>URL do Avatar</label>
                <input id="avatarUrl" name="avatarUrl" value={member.avatarUrl} onChange={handleChange} required className={inputClasses} />
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
            <div>
                <label htmlFor="bio" className={labelClasses}>Bio</label>
                <textarea id="bio" name="bio" value={member.bio} onChange={handleChange} required className={inputClasses} rows={4} placeholder="Uma breve biografia sobre o membro da equipe."/>
            </div>

            <fieldset className="space-y-5 border-t border-white/10 pt-6">
              <legend className="text-base font-medium text-white mb-2">Permissões e Visibilidade</legend>
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input id="isInstructor" name="isInstructor" type="checkbox" checked={member.role === 'instructor'} onChange={(e) => setMember(prev => ({...prev, role: e.target.checked ? 'instructor' : 'student'}))} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-purple-600 focus:ring-purple-500" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isInstructor" className={checkboxLabelClasses}>É Instrutor?</label>
                  <p className={checkboxDescriptionClasses}>Poderá criar e gerenciar cursos e responder dúvidas de alunos.</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input id="isMentor" name="isMentor" type="checkbox" checked={member.isMentor} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-purple-600 focus:ring-purple-500" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isMentor" className={checkboxLabelClasses}>É Mentor?</label>
                  <p className={checkboxDescriptionClasses}>Aparecerá na página de mentorias para agendamentos.</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input id="showOnTeamPage" name="showOnTeamPage" type="checkbox" checked={member.showOnTeamPage} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-purple-600 focus:ring-purple-500" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="showOnTeamPage" className={checkboxLabelClasses}>Mostrar na página 'Nossa Equipe'?</label>
                  <p className={checkboxDescriptionClasses}>Exibirá o perfil publicamente na página da equipe.</p>
                </div>
              </div>
            </fieldset>

        </div>
      </form>
    </div>
  );
};

export default TeamMemberEditor;