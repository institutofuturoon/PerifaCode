
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContextAdapter';
import SEO from '../components/SEO';

const ProjectDetailView: React.FC = () => {
    const { projects, users, user, handleAddClap, handleAddComment } = useAppContext();
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [commentText, setCommentText] = useState('');

    const project = useMemo(() => projects.find(p => p.id === projectId), [projects, projectId]);

    if (!project) {
        return <div className="text-center py-20">Projeto não encontrado.</div>;
    }
    
    const author = users.find(u => u.id === project.authorId);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        handleAddComment(project.id, commentText);
        setCommentText('');
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <SEO 
                title={`${project.title} | Projeto de ${author?.name || 'Aluno FuturoOn'}`}
                description={project.description.slice(0, 160)}
                image={project.imageUrl}
                keywords={[...project.technologies, 'portfolio', 'desenvolvimento web', 'projeto prático']}
            />
            <div className="mb-8">
                <button onClick={() => navigate('/community')} className="text-[#c4b5fd] font-semibold hover:text-white transition-colors group">
                    <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para a comunidade
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-auto rounded-lg shadow-2xl shadow-[#8a4add]/20 mb-8" />
                    <h1 className="text-4xl font-black text-white">{project.title}</h1>
                    <p className="mt-4 text-lg text-gray-300">{project.description}</p>
                    
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Comentários</h2>
                        {user && (
                             <form onSubmit={handleCommentSubmit} className="flex items-start gap-4 mb-8">
                                <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                                <div className="flex-1">
                                    <textarea 
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        rows={2}
                                        placeholder="Deixe um comentário construtivo..."
                                        className="w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors"
                                    />
                                    <button type="submit" className="mt-2 font-semibold py-2 px-5 rounded-lg bg-[#8a4add] text-white hover:bg-[#6d28d9] transition-colors shadow-lg shadow-[#8a4add]/20">
                                        Comentar
                                    </button>
                                </div>
                            </form>
                        )}
                        <div className="space-y-6">
                            {project.comments.map(comment => {
                                const commentAuthor = users.find(u => u.id === comment.authorId);
                                return (
                                <div key={comment.id} className="flex items-start gap-4">
                                    <img src={commentAuthor?.avatarUrl} alt={commentAuthor?.name} className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 bg-white/5 p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-white">{commentAuthor?.name}</p>
                                        </div>
                                        <p className="mt-2 text-gray-300">{comment.text}</p>
                                    </div>
                                </div>
                                )
                            })}
                            {project.comments.length === 0 && (
                                <p className="text-gray-500">Seja o primeiro a comentar!</p>
                            )}
                        </div>
                    </div>
                </div>

                <aside>
                    <div className="sticky top-24 bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10 space-y-6">
                        <div>
                            <p className="text-sm text-gray-400">Criado por</p>
                            <div className="flex items-center gap-3 mt-2">
                                <img src={author?.avatarUrl} alt={author?.name} className="h-10 w-10 rounded-full" />
                                <div>
                                    <p className="font-bold text-white">{author?.name}</p>
                                    <p className="text-xs text-gray-400">{project.createdAt}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                             <p className="text-sm text-gray-400 mb-2">Tecnologias</p>
                             <div className="flex flex-wrap gap-2">
                                {project.technologies.map(tech => (
                                    <span key={tech} className="px-3 py-1 text-xs font-semibold rounded-full bg-[#8a4add]/10 text-[#c4b5fd] border border-[#8a4add]/20">
                                        {tech}
                                    </span>
                                ))}
                             </div>
                        </div>

                        <div>
                            <button onClick={() => handleAddClap(project.id)} className="w-full text-center p-4 border-2 border-[#8a4add] text-[#c4b5fd] rounded-lg font-bold text-lg hover:bg-[#8a4add] hover:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                                <span>👏</span> Aplaudir ({project.claps})
                            </button>
                        </div>
                        
                        <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                             <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
                                Ver Código (GitHub)
                             </a>
                             <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
                                Ver Projeto no Ar
                             </a>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ProjectDetailView;
