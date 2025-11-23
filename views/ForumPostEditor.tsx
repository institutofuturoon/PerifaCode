
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CommunityPost } from '../types';
import { useAppContext } from '../contexts/AppContextAdapter';
import RichContentEditor from '../components/RichContentEditor';

const ForumPostEditor: React.FC = () => {
    const { communityPosts, user, handleSaveCommunityPost } = useAppContext();
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const contentRef = useRef<HTMLTextAreaElement>(null);

    // Protect Route
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const initialPost = useMemo(() => {
        if (postId && postId !== 'new') {
            return communityPosts.find(p => p.id === postId);
        }
        return {
            id: `post_${Date.now()}`,
            authorId: user?.id || '',
            title: '',
            content: '',
            tags: [],
            claps: 0,
            views: 0,
            createdAt: new Date().toISOString(),
            replies: [],
            type: 'discussion' as 'discussion' | 'question',
            isSolved: false
        };
    }, [postId, communityPosts, user]);
    
    const [post, setPost] = useState<CommunityPost>(initialPost || {
        id: `post_${Date.now()}`, authorId: user?.id || '', title: '',
        content: '', tags: [], claps: 0, views: 0, 
        createdAt: new Date().toISOString(), replies: [],
        type: 'discussion', isSolved: false
    });

    if (!user) return null; // Early return while useEffect redirects

    if (!initialPost || (postId !== 'new' && post.authorId !== user?.id && user?.role !== 'admin')) {
        return <div className="text-center py-20">Você não tem permissão para editar este post.</div>;
    }

    const onCancel = () => navigate('/forum');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPost(prev => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);
        setPost(prev => ({ ...prev, tags }));
    };

    const handleContentChange = (value: string) => {
        setPost(prev => ({ ...prev, content: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSaveCommunityPost(post);
        navigate('/forum');
    };

    const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm text-white";
    const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-black text-white">{postId === 'new' ? 'Criar Novo Post' : 'Editar Post'}</h1>
                        <p className="text-gray-400 mt-1">Compartilhe sua dúvida ou conhecimento com a comunidade.</p>
                    </div>
                    <div className="flex gap-4">
                        <button type="button" onClick={onCancel} className="bg-white/10 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-white/20 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40">
                            {postId === 'new' ? 'Publicar' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>

                <div className="p-8 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 space-y-6">
                     <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="title" className={labelClasses}>Título</label>
                            <input id="title" name="title" value={post.title} onChange={handleChange} placeholder="Ex: Como centralizar uma div?" required className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="type" className={labelClasses}>Tipo de Post</label>
                            <select id="type" name="type" value={post.type || 'discussion'} onChange={handleChange} className={inputClasses}>
                                <option value="discussion">Discussão</option>
                                <option value="question">Dúvida</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="tags" className={labelClasses}>Tags</label>
                        <input id="tags" name="tags" value={post.tags.join(', ')} onChange={handleTagsChange} placeholder="css, javascript, carreira" className={inputClasses} />
                        <p className="text-xs text-gray-500 mt-1">Separe as tags por vírgula.</p>
                    </div>
                    <div>
                         <label className={labelClasses}>Conteúdo</label>
                        <RichContentEditor
                            value={post.content}
                            onChange={handleContentChange}
                            textareaRef={contentRef}
                            rows={15}
                            placeholder="Descreva sua dúvida ou compartilhe sua ideia aqui..."
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ForumPostEditor;
