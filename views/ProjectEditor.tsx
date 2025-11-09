import React, { useState } from 'react';
import { Project } from '../types';
import { useAppContext } from '../App';

interface ProjectEditorProps {
    project: Project;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project: initialProject }) => {
    const { handleSaveProject, navigate } = useAppContext();
    const [project, setProject] = useState<Project>(initialProject);

    const onCancel = () => navigate('community');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'technologies') {
            setProject(prev => ({ ...prev, technologies: value.split(',').map(t => t.trim()) }));
        } else {
            setProject(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSaveProject(project);
    };

    const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm text-white";
    const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-black text-white">{initialProject.title ? 'Editar Projeto' : 'Submeter Projeto'}</h1>
                        <p className="text-gray-400 mt-1">Mostre à comunidade o que você construiu!</p>
                    </div>
                    <div className="flex gap-4">
                        <button type="button" onClick={onCancel} className="bg-white/10 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-white/20 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40">
                            Salvar Projeto
                        </button>
                    </div>
                </div>

                <div className="p-8 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 space-y-6">
                    <div>
                        <label htmlFor="title" className={labelClasses}>Título do Projeto</label>
                        <input id="title" name="title" value={project.title} onChange={handleChange} required className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="description" className={labelClasses}>Descrição</label>
                        <textarea id="description" name="description" value={project.description} onChange={handleChange} required className={inputClasses} rows={4} placeholder="Conte sobre seu projeto, os desafios e o que você aprendeu." />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className={labelClasses}>URL da Imagem de Capa</label>
                        <input id="imageUrl" name="imageUrl" value={project.imageUrl} onChange={handleChange} required className={inputClasses} placeholder="https://..." />
                    </div>
                    <div>
                        <label htmlFor="technologies" className={labelClasses}>Tecnologias Utilizadas</label>
                        <input id="technologies" name="technologies" value={project.technologies.join(', ')} onChange={handleChange} required className={inputClasses} placeholder="HTML, CSS, JavaScript, React..." />
                         <p className="text-xs text-gray-500 mt-1">Separe as tecnologias por vírgula.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="repoUrl" className={labelClasses}>Link do Repositório (GitHub)</label>
                            <input id="repoUrl" name="repoUrl" type="url" value={project.repoUrl} onChange={handleChange} required className={inputClasses} placeholder="https://github.com/..." />
                        </div>
                        <div>
                            <label htmlFor="liveUrl" className={labelClasses}>Link do Projeto no Ar</label>
                            <input id="liveUrl" name="liveUrl" type="url" value={project.liveUrl} onChange={handleChange} required className={inputClasses} placeholder="https://seu-projeto.vercel.app" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProjectEditor;