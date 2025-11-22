import React, { useEffect, useState } from 'react';
import { User } from '../types';
import ImageUpload from './ImageUpload';

interface ProfileModalProps {
    member: User;
    onClose: () => void;
    isCurrentUser?: boolean;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ member, onClose, isCurrentUser = false }) => {
    const [avatarUrl, setAvatarUrl] = useState(member.avatarUrl);
    const [showImageUpload, setShowImageUpload] = useState(false);

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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-[#18181B] rounded-2xl border border-[#8a4add]/30 w-full max-w-2xl shadow-2xl shadow-[#8a4add]/20 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl z-10">&times;</button>
                
                <div className="h-32 bg-grid-pattern rounded-t-2xl"></div>

                <div className="px-8 pb-8 -mt-16 text-center">
                    {/* Avatar com opção de upload */}
                    <div className="relative inline-block mb-4">
                        <img
                            src={avatarUrl}
                            alt={member.name}
                            className="h-32 w-32 rounded-full border-4 border-[#18181B] mx-auto"
                        />
                        {isCurrentUser && (
                            <button
                                onClick={() => setShowImageUpload(!showImageUpload)}
                                className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Upload de Avatar */}
                    {showImageUpload && isCurrentUser && (
                        <div className="mb-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                            <ImageUpload
                                context="profile"
                                onUploadComplete={(metadata) => {
                                    setAvatarUrl(metadata.blobUrl);
                                    setShowImageUpload(false);
                                }}
                                showPreview={false}
                            />
                        </div>
                    )}
                    
                    <h2 className="text-2xl font-bold text-white">{member.name}</h2>
                    <p className="text-md text-[#c4b5fd]">{member.title}</p>
                    {member.email && <p className="text-sm text-gray-400 mt-1">{member.email}</p>}

                    <hr className="my-6 border-white/10" />

                    <div className="max-h-80 overflow-y-auto text-left pr-2">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{member.bio}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;