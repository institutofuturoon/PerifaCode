
import React from 'react';
import { CommunityPost } from '../types';
import { useAppContext } from '../contexts/AppContextAdapter';

interface ForumPostCardProps {
    post: CommunityPost;
    onPostSelect: (post: CommunityPost) => void;
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({ post, onPostSelect }) => {
    const { users } = useAppContext();
    const author = users.find(u => u.id === post.authorId);

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " anos atrás";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " meses atrás";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " dias atrás";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " horas atrás";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutos atrás";
        return "agora mesmo";
    };
    
    const isQuestion = post.type === 'question';
    const borderClass = post.isPinned 
        ? 'border-[#8a4add]/50 shadow-[0_0_15px_rgba(138,74,221,0.15)]' 
        : 'border-white/10 hover:border-white/20';
    const bgClass = post.isPinned ? 'bg-gradient-to-br from-white/5 to-[#8a4add]/5' : 'bg-white/5 hover:bg-white/10';
    
    return (
        <button 
            onClick={() => onPostSelect(post)}
            className={`w-full text-left ${bgClass} border ${borderClass} rounded-lg p-6 flex flex-col sm:flex-row gap-6 transition-all relative overflow-hidden`}
        >
            {post.isPinned && (
                <div className="absolute top-0 right-0 bg-[#8a4add] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                    FIXADO
                </div>
            )}

            <div className="flex-shrink-0 flex items-center gap-4 sm:flex-col sm:items-center sm:gap-2 sm:w-24">
                <img src={author?.avatarUrl} alt={author?.name} className="w-12 h-12 rounded-full object-cover" />
                <p className="font-semibold text-sm text-white sm:text-center truncate max-w-[90px]">{author?.name}</p>
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {isQuestion ? (
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${post.isSolved ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                            {post.isSolved ? '✓ Resolvido' : '? Dúvida'}
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            Discussão
                        </span>
                    )}
                    <h3 className="text-xl font-bold text-white line-clamp-1">{post.title}</h3>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs font-semibold rounded-full bg-white/5 text-gray-400 border border-white/10">
                            # {tag}
                        </span>
                    ))}
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5" title="Aplausos">
                        <span>👏</span>
                        <span className="font-semibold">{post.claps}</span>
                    </div>
                     <div className="flex items-center gap-1.5" title="Respostas">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <span className="font-semibold">{post.replies.length}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Visualizações">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        <span className="font-semibold">{post.views}</span>
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 text-sm text-gray-500 self-start sm:self-center mt-4 sm:mt-0">
                {timeAgo(post.createdAt)}
            </div>
        </button>
    );
};

export default ForumPostCard;
