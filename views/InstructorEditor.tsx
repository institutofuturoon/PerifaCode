

import React, { useState } from 'react';
// FIX: The 'Instructor' type does not exist. The correct type for instructors is 'TeamMember'.
// FIX: The 'TeamMember' type does not exist in 'types.ts'. Replaced with 'User'.
import { User } from '../types';
import { useAppContext } from '../App';

interface InstructorEditorProps {
  // FIX: Changed type from Instructor to TeamMember. Replaced with User.
  instructor: User;
}

const InstructorEditor: React.FC<InstructorEditorProps> = ({ instructor: initialInstructor }) => {
  // FIX: The context provides 'handleSaveUser', not 'handleSaveTeamMember'.
  const { handleSaveUser, navigate } = useAppContext();
  // FIX: Changed type from Instructor to TeamMember. Replaced with User.
  const [instructor, setInstructor] = useState<User>(initialInstructor);

  const onCancel = () => navigate('admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInstructor(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Using the correct function from the context.
    handleSaveUser(instructor);
  };

  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors sm:text-sm text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-white">{initialInstructor.name ? 'Editor de Instrutor' : 'Novo Instrutor'}</h1>
            <p className="text-gray-400 mt-1">Gerencie os perfis dos educadores da plataforma.</p>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onCancel} className="bg-white/10 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-white/20 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
              Salvar Instrutor
            </button>
          </div>
        </div>

        <div className="p-8 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 space-y-6">
            <div>
                <label htmlFor="name" className={labelClasses}>Nome Completo</label>
                <input id="name" name="name" value={instructor.name} onChange={handleChange} required className={inputClasses} />
            </div>
            <div>
                <label htmlFor="title" className={labelClasses}>Título Profissional</label>
                <input id="title" name="title" value={instructor.title} onChange={handleChange} placeholder="Ex: Engenheiro de Software @ Empresa" required className={inputClasses} />
            </div>
            <div>
                <label htmlFor="avatarUrl" className={labelClasses}>URL do Avatar</label>
                <input id="avatarUrl" name="avatarUrl" value={instructor.avatarUrl} onChange={handleChange} required className={inputClasses} />
            </div>
            <div>
                <label htmlFor="bio" className={labelClasses}>Bio</label>
                <textarea id="bio" name="bio" value={instructor.bio} onChange={handleChange} required className={inputClasses} rows={4} placeholder="Uma breve biografia sobre o instrutor, sua experiência e paixões."/>
            </div>
        </div>
      </form>
    </div>
  );
};

export default InstructorEditor;