import React, { useState } from 'react';
import { useAppContext } from '../App';

const ProjectDetailView: React.FC = () => {
    const { currentProject, users, user, navigate, handleAddClap, handleAddComment } = useAppContext();
    const [commentText, setCommentText] = useState('');

    if (!currentProject) {
        return <div className="text-center py-20">Projeto não encontrado.</div>;
    }
    const project = currentProject;
    const author = users.find(u => u.id === project.authorId);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        handleAddComment(project.id, commentText);
        setCommentText('');
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-8">
                <button onClick={() => navigate('community')} className="text-purple-400 font-semibold hover:text-purple-300 transition-colors group">
                    <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para a comunidade
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-auto rounded-lg shadow-2xl shadow-purple-900/40 mb-8" />
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
                                        className="w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors"
                                    />
                                    <button type="submit" className="mt-2 font-semibold py-2 px-5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20">
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
                                    <span key={tech} className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                        {tech}
                                    </span>
                                ))}
                             </div>
                        </div>

                        <div>
                            <button onClick={() => handleAddClap(project.id)} className="w-full text-center p-4 border-2 border-purple-400 text-purple-300 rounded-lg font-bold text-lg hover:bg-purple-400 hover:text-black transition-colors duration-300 flex items-center justify-center gap-2">
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
