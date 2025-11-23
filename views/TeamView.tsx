import React, { useMemo } from 'react';
import { useAppContext } from '../contexts/AppContextAdapter';
import { User } from '../types';

const TeamCard: React.FC<{ member: User }> = ({ member }) => {
    const { openProfileModal } = useAppContext();
    const DEFAULT_BANNER_URL = 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    return (
        <div 
            onClick={() => openProfileModal(member)}
            className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg shadow-[#8a4add]/10 overflow-hidden cursor-pointer group transition-all duration-300 hover:border-[#8a4add]/30 hover:shadow-2xl hover:shadow-[#8a4add]/20 hover:-translate-y-1"
        >
            {/* Profile Header */}
            <div className="relative">
                <div 
                    className="h-32 bg-cover bg-center"
                    style={{ backgroundImage: `url(${member.bannerUrl || DEFAULT_BANNER_URL})` }}
                />
                <div className="absolute left-1/2 -translate-x-1/2 top-32 -translate-y-1/2">
                    <img className="h-24 w-24 rounded-full border-4 border-[#18181B]" src={member.avatarUrl} alt={member.name} />
                </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 pt-14 text-center">
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-sm text-[#c4b5fd] truncate">{member.email}</p>
                <p className="mt-2 text-sm text-gray-300 line-clamp-2 h-10">{member.title}</p>
            </div>
        </div>
    );
}


const TeamView: React.FC = () => {
    const { team } = useAppContext();

    const sortedVisibleTeam = useMemo(() => 
        team
            .filter(member => member.showOnTeamPage)
            .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
    , [team]);


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                    Conheça quem faz a <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">FuturoOn</span> acontecer
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                    Nossa força vem da nossa gente. Profissionais, mentores e voluntários unidos por um propósito: transformar o futuro através da tecnologia.
                </p>
            </div>

            {sortedVisibleTeam.length > 0 ? (
                <section>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedVisibleTeam.map(member => <TeamCard key={member.id} member={member} />)}
                    </div>
                </section>
            ) : (
                <div className="text-center text-gray-400 py-16">
                    <p>Nenhum membro da equipe para exibir no momento.</p>
                </div>
            )}
        </div>
    );
};

export default TeamView;