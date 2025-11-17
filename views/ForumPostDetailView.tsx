import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import MarkdownRenderer from '../components/MarkdownRenderer';

const ForumPostDetailView: React.FC = () => {
    const { communityPosts, users, user, handleAddCommunityPostClap, handleAddCommunityReply } = useAppContext();
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const [replyText, setReplyText] = useState('');

    const post = useMemo(() => communityPosts.find(p => p.id === postId), [communityPosts, postId]);

    if (!post) {
        return <div className="text-center py-20">Post não encontrado.</div>;
    }
    
    const author = users.find(u => u.id === post.authorId);

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        handleAddCommunityReply(post.id, replyText);
        setReplyText('');
    };
    
    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-8">
                <button onClick={() => navigate('/community')} className="text-[#c4b5fd] font-semibold hover:text-white transition-colors group">
                    <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para a comunidade
                </button>
            </div>
            
            <div className="max-w-4xl mx-auto">
                {/* Main Post */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-8">
                    <div className="flex items-start gap-4">
                        <img src={author?.avatarUrl} alt={author?.name} className="w-12 h-12 rounded-full" />
                        <div>
                            <h1 className="text-3xl font-bold text-white">{post.title}</h1>
                            <p className="text-sm text-gray-400 mt-1">
                                Postado por <span className="font-semibold text-gray-300">{author?.name}</span> • {timeAgo(post.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-6">
                        <MarkdownRenderer content={post.content} />
                    </div>

                     <div className="mt-8 border-t border-white/10 pt-6 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                           {post.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                    # {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => handleAddCommunityPostClap(post.id)} className="group flex items-center gap-2 font-semibold py-2 px-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                                <span className="text-xl transform transition-transform group-hover:scale-110">👏</span>
                                <span>{post.claps}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Replies */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-white mb-6">{post.replies.length} Respostas</h2>
                    <div className="space-y-6">
                        {post.replies.map(reply => {
                            const replyAuthor = users.find(u => u.id === reply.authorId);
                            return (
                                <div key={reply.id} className="flex items-start gap-4">
                                    <img src={replyAuthor?.avatarUrl} alt={replyAuthor?.name} className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 bg-white/5 p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-white">{replyAuthor?.name}</p>
                                            <p className="text-xs text-gray-500">{timeAgo(reply.createdAt)}</p>
                                        </div>
                                        <div className="mt-2 text-gray-300">
                                            <MarkdownRenderer content={reply.content} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                 {/* Add Reply Form */}
                {user && (
                    <div className="mt-12 pt-8 border-t border-white/10">
                         <h2 className="text-2xl font-bold text-white mb-6">Sua Resposta</h2>
                         <form onSubmit={handleReplySubmit} className="flex items-start gap-4">
                            <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                            <div className="flex-1">
                                <MarkdownRenderer content={replyText} />
                                <textarea 
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    rows={4}
                                    placeholder="Escreva uma resposta construtiva..."
                                    className="w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors"
                                />
                                <button type="submit" className="mt-2 font-semibold py-2 px-5 rounded-lg bg-[#8a4add] text-white hover:bg-[#6d28d9] transition-colors shadow-lg shadow-[#8a4add]/20">
                                    Publicar Resposta
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumPostDetailView;
