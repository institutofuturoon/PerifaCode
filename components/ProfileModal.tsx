import React, { useEffect } from 'react';
import { User } from '../types';

interface ProfileModalProps {
    member: User;
    onClose: () => void;
}

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
                    <img src={member.avatarUrl} alt={member.name} className="h-32 w-32 rounded-full border-4 border-[#18181B] mx-auto mb-4" />
                    
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