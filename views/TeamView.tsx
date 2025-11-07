import React, { useMemo } from 'react';
import { useAppContext } from '../App';
import { User } from '../types';

const TeamCard: React.FC<{ member: User }> = ({ member }) => {
    const { openProfileModal } = useAppContext();

    return (
        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10 text-center group transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col">
            <img src={member.avatarUrl} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-purple-500/50 group-hover:border-purple-500 transition-colors duration-300 transform group-hover:scale-105"/>
            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <p className="text-purple-400 font-semibold">{member.title}</p>
            <p className="mt-4 text-gray-400 text-sm flex-grow line-clamp-3">{member.bio}</p>
            <button 
                onClick={() => openProfileModal(member)}
                className="mt-6 w-full bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
            >
                Ver Bio
            </button>
        </div>
    );
}

const TeamView: React.FC = () => {
    const { team } = useAppContext();

    const visibleTeamMembers = useMemo(() => 
        team.filter(member => member.showOnTeamPage)
    , [team]);


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                    Conheça quem faz a <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">FuturoOn</span> acontecer
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                    Nossa força vem da nossa gente. Profissionais, mentores e voluntários unidos por um propósito: transformar o futuro através da tecnologia.
                </p>
            </div>

            <section>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleTeamMembers.map(member => (
                        <TeamCard key={member.id} member={member} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default TeamView;