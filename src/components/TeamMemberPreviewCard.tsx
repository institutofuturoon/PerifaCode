import React from 'react';
import { User } from '../types';
import { useAppContext } from '../App';

interface TeamMemberPreviewCardProps {
    member: User;
}

const TeamMemberPreviewCard: React.FC<TeamMemberPreviewCardProps> = ({ member }) => {
    const { openProfileModal } = useAppContext();

    return (
        <div 
            onClick={() => openProfileModal(member)}
            className="text-center group cursor-pointer"
        >
            <div className="relative inline-block">
                <img 
                    src={member.avatarUrl} 
                    alt={member.name} 
                    className="w-32 h-32 rounded-full object-cover mx-auto transition-all duration-300 transform group-hover:scale-105" 
                />
                <div className="absolute inset-0 rounded-full ring-4 ring-offset-4 ring-offset-[#09090B] ring-[#8a4add]/0 group-hover:ring-[#8a4add]/80 transition-all duration-300"></div>
            </div>
            <h3 className="mt-4 font-bold text-lg text-white group-hover:text-[#c4b5fd] transition-colors">{member.name}</h3>
            <p className="text-sm text-gray-400">{member.title}</p>
        </div>
    );
}

export default TeamMemberPreviewCard;
