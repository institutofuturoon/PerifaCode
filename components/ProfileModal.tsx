import React, { useEffect } from 'react';
import { User } from '../types';

interface ProfileModalProps {
    member: User;
    onClose: () => void;
}

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110">
        {children}
    </a>
);


const ProfileModal: React.FC<ProfileModalProps> = ({ member, onClose }) => {

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-[#121212] rounded-2xl border border-purple-500/30 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-purple-500/20 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl z-10">&times;</button>
                
                <div className="flex-shrink-0 h-48 bg-grid-pattern rounded-t-2xl flex items-end p-8 relative">
                    <img src={member.avatarUrl} alt={member.name} className="h-32 w-32 rounded-full border-4 border-purple-500 absolute -bottom-16" />
                </div>
                
                <div className="p-8 pt-20 flex-grow overflow-y-auto">
                    <h2 className="text-3xl font-bold text-white">{member.name}</h2>
                    <p className="text-md text-purple-400 font-semibold">{member.title}</p>
                    
                    <div className="mt-4 flex items-center gap-4">
                        {member.githubUrl && (
                            <SocialIcon href={member.githubUrl}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                                </svg>
                            </SocialIcon>
                        )}
                        {member.linkedinUrl && (
                             <SocialIcon href={member.linkedinUrl}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </SocialIcon>
                        )}
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-6">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{member.bio}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;