
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { useAppContext } from '../App';
import EditorHeader from '../components/EditorHeader';

const ProjectEditor: React.FC = () => {
    const { projects, user, handleSaveProject } = useAppContext();
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    const initialProject = useMemo(() => {
        if (projectId) {
            return projects.find(p => p.id === projectId);
        }
        return {
            id: `proj_${Date.now()}`,
            authorId: user?.id || '',
            title: '', description: '', imageUrl: '',
            technologies: [], repoUrl: '', liveUrl: '',
            claps: 0, comments: [], createdAt: new Date().toLocaleDateString('pt-BR'),
            status: 'pending' as Project['status'],
            lookingForCollab: false
        };
    }, [projectId, projects, user]);
    
    const [project, setProject] = useState<Project>(initialProject || {
        id: `proj_${Date.now()}`, authorId: user?.id || '', title: '',
        description: '', imageUrl: '', technologies: [], repoUrl: '',
        liveUrl: '', claps: 0, comments: [], createdAt: new Date().toLocaleDateString('pt-BR'),
        status: 'pending',
        lookingForCollab: false
    });

    if (!initialProject && projectId) {
        return <div className="text-center py-20">Projeto não encontrado.</div>;
    }

    const onCancel = () => navigate('/community');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (name === 'technologies') {
            setProject(prev => ({ ...prev, technologies: value.split(',').map(t => t.trim()) }));
        } else if (type === 'checkbox') {
             // @ts-ignore
             setProject(prev => ({ ...prev, [name]: e.target.checked }));
        } else {
            setProject(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSaveProject(project);
        navigate('/community');
    };

    const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm text-white";
    const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

    return (
        <div className="min-h-screen bg-[#09090B]">
            <EditorHeader
                title={initialProject?.title ? 'Editar Projeto' : 'Submeter Projeto'}
                subtitle="Mostre à comunidade o que você construiu!"
                onBack={onCancel}
                actions={
                    <button type="submit" form="project-form" className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40">
                        Salvar Projeto
                    </button>
                }
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form id="project-form" onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">

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
                    
                    <div className="pt-4 border-t border-white/10">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="lookingForCollab" 
                                checked={project.lookingForCollab || false} 
                                onChange={handleChange} 
                                className="h-5 w-5 rounded border-gray-300 bg-white/5 text-[#8a4add] focus:ring-[#8a4add]"
                            />
                            <div>
                                <span className="font-medium text-white block">Estou buscando time/colaboradores</span>
                                <span className="text-xs text-gray-400 block">Se marcado, um selo "Buscando Time" aparecerá no card do projeto.</span>
                            </div>
                        </label>
                    </div>
                </div>
            </form>
            </div>
        </div>
    );
};

export default ProjectEditor;
