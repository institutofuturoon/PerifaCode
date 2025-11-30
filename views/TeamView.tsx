import React, { useMemo, useState } from 'react';
import { useAppContext } from '../App';
import { User } from '../types';
import SEO from '../components/SEO';
import Badge from '../components/Badge';
import { useTeam as useOngTeam, useStatistics, useOngData } from '../hooks/useOngData';

// Componente de Card de Membro - MELHORADO!
const TeamCard: React.FC<{ member: User; index: number }> = ({ member, index }) => {
    const { openProfileModal } = useAppContext();
    const DEFAULT_BANNER_URL = 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    // Cores alternadas para variedade visual
    const colors = [
        'from-[#8a4add]/20 to-[#f27983]/20',
        'from-[#6d28d9]/20 to-[#8a4add]/20',
        'from-[#f27983]/20 to-[#fbbf24]/20',
        'from-[#10b981]/20 to-[#3b82f6]/20',
    ];
    const colorClass = colors[index % colors.length];

    return (
        <div 
            onClick={() => openProfileModal(member)}
            className="relative group cursor-pointer"
        >
            {/* Aurora effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
            
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#8a4add]/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#8a4add]/20">
                {/* Profile Header */}
                <div className="relative">
                    <div 
                        className="h-32 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${member.bannerUrl || DEFAULT_BANNER_URL})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-32 -translate-y-1/2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add] to-[#f27983] rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <img 
                                className="relative h-24 w-24 rounded-full border-4 border-[#18181B] transition-transform duration-300 group-hover:scale-110" 
                                src={member.avatarUrl} 
                                alt={member.name} 
                            />
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-6 pt-14 text-center">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#c4b5fd] transition-colors duration-300">
                        {member.name}
                    </h3>
                    <p className="text-sm text-[#c4b5fd] truncate mt-1">{member.email}</p>
                    <p className="mt-3 text-sm text-gray-300 line-clamp-2 h-10 leading-relaxed">
                        {member.title}
                    </p>
                    
                    {/* Hover indicator */}
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Ver perfil completo</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente de Estatística da Equipe - MELHORADO!
const TeamStatCard: React.FC<{ 
  icon: React.ReactNode; 
  value: string; 
  label: string;
  color: string;
  description: string;
}> = ({ icon, value, label, color, description }) => (
    <div className="relative group">
        {/* Glow effect mais intenso */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 group-hover:blur-3xl transition-all duration-500`}></div>
        
        <div className="relative bg-gradient-to-br from-[#18181B] to-[#09090B] p-8 rounded-2xl border border-white/10 group-hover:border-white/20 text-center hover:-translate-y-2 transition-all duration-300 h-full">
            {/* Ícone com animação */}
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-${color.split(' ')[0].replace('from-', '')}/50`}>
                {icon}
            </div>
            
            {/* Valor grande */}
            <p className={`text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r ${color} mb-3 group-hover:scale-105 transition-transform duration-300`}>
                {value}
            </p>
            
            {/* Label */}
            <p className="text-sm text-white font-bold uppercase tracking-widest mb-2">
                {label}
            </p>
            
            {/* Descrição */}
            <p className="text-xs text-gray-400 leading-relaxed">
                {description}
            </p>
            
            {/* Barra decorativa */}
            <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${color} group-hover:w-full w-0 transition-all duration-1000 ease-out`}></div>
            </div>
        </div>
    </div>
);

// Componente de Valor da Equipe
const TeamValueCard: React.FC<{ 
  icon: string; 
  title: string; 
  description: string;
}> = ({ icon, title, description }) => (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-8 rounded-2xl border border-white/10 hover:border-[#8a4add]/40 hover:-translate-y-2 transition-all duration-300 group">
        <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#c4b5fd] transition-colors">
            {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
            {description}
        </p>
    </div>
);


const TeamView: React.FC = () => {
    const { team } = useAppContext();
    const { founder, team: ongTeam } = useOngTeam();
    const stats = useStatistics();
    const ongData = useOngData();
    const [filter, setFilter] = useState<'all' | 'core' | 'volunteers'>('all');

    // Combinar dados do Firebase com dados do JSON
    const sortedVisibleTeam = useMemo(() => {
        // Se tiver dados do Firebase, usa eles
        if (team.length > 0) {
            return team
                .filter(member => member.showOnTeamPage)
                .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
        }
        
        // Senão, usa dados do JSON (fundadora + equipe)
        const jsonTeam: User[] = [];
        
        // Adiciona fundadora
        if (founder) {
            jsonTeam.push({
                id: 'founder-001',
                name: founder.name,
                email: founder.email,
                avatarUrl: founder.photo,
                bannerUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
                title: `${founder.role} • ${founder.specialty}`,
                role: 'admin',
                showOnTeamPage: true,
                displayOrder: 0,
                bio: founder.bio,
                linkedin: founder.linkedin,
                completedLessonIds: [],
                xp: 0,
                achievements: [],
                streak: 0,
                lastCompletionDate: null
            } as User);
        }
        
        // Adiciona membros da equipe
        ongTeam.forEach((member, index) => {
            jsonTeam.push({
                id: member.id,
                name: member.name,
                email: 'contato@futuroon.org',
                avatarUrl: member.photo,
                bannerUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
                title: `${member.role} • ${member.specialty}`,
                role: member.area === 'Educação' || member.area === 'Tecnologia' ? 'instructor' : 'admin',
                showOnTeamPage: true,
                displayOrder: index + 1,
                bio: member.bio,
                linkedin: member.linkedin,
                completedLessonIds: [],
                xp: 0,
                achievements: [],
                streak: 0,
                lastCompletionDate: null
            } as User);
        });
        
        return jsonTeam;
    }, [team, founder, ongTeam]);

    // Separar equipe principal e voluntários (baseado em role)
    const coreTeam = sortedVisibleTeam.filter(m => m.role === 'admin' || m.role === 'instructor');
    const volunteers = sortedVisibleTeam.filter(m => m.role === 'student'); // Ajustar conforme necessário
    
    const filteredTeam = filter === 'all' 
        ? sortedVisibleTeam 
        : filter === 'core' 
        ? coreTeam 
        : volunteers;

    return (
        <div className="bg-[#09090B] min-h-screen">
            <SEO 
                title="Nossa Equipe | Instituto FuturoOn"
                description="Conheça os profissionais, mentores e voluntários que fazem o FuturoOn acontecer. Uma equipe dedicada a transformar vidas através da tecnologia."
            />

            {/* Hero Section */}
            <section className="relative py-20 md:py-32 text-center overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#8a4add]/10 rounded-[100%] blur-[120px] -z-10 pointer-events-none"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-30 -z-10"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Badge text="Nossa Tropa" />
                    
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6 max-w-5xl mx-auto">
                        Conheça quem faz a <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] via-[#c4b5fd] to-[#f27983]">FuturoOn</span> acontecer
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Nossa força vem da nossa gente. Profissionais, mentores e voluntários unidos por um propósito: transformar o futuro através da tecnologia.
                    </p>
                </div>
            </section>

            {/* Estatísticas da Equipe - MELHORADO! */}
            <section className="py-20 border-y border-white/5 bg-gradient-to-b from-black/40 via-black/20 to-transparent relative overflow-hidden">
                {/* Background decorativo */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#8a4add]/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#f27983]/10 rounded-full blur-[120px]"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Nossa Força em Números
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Cada número representa histórias, dedicação e vidas transformadas
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        <TeamStatCard
                            icon={
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                                </svg>
                            }
                            value={`${stats.volunteers}+`}
                            label="Voluntários"
                            description="Profissionais dedicados à causa"
                            color="from-[#8a4add] to-[#c4b5fd]"
                        />
                        <TeamStatCard
                            icon={
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                                </svg>
                            }
                            value={`${stats.mentorshipHours.toLocaleString('pt-BR')}`}
                            label="Horas de Mentoria"
                            description="Dedicadas ao desenvolvimento dos alunos"
                            color="from-[#f27983] to-[#fbbf24]"
                        />
                        <TeamStatCard
                            icon={
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                                </svg>
                            }
                            value={`${stats.graduatedStudents}+`}
                            label="Alunos Formados"
                            description="Jovens transformados pela educação"
                            color="from-[#10b981] to-[#3b82f6]"
                        />
                        <TeamStatCard
                            icon={
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                            }
                            value={`${ongData.organization.foundedYear}`}
                            label="Ano de Fundação"
                            description={`${new Date().getFullYear() - ongData.organization.foundedYear} anos transformando vidas`}
                            color="from-[#fbbf24] to-[#f59e0b]"
                        />
                    </div>
                </div>
            </section>

            {/* Valores da Equipe - NOVO! */}
            <section className="py-24 bg-gradient-to-b from-black/20 to-transparent">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-white mb-4">
                            O Que Nos Une
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Mais que colegas de trabalho, somos uma família movida por valores comuns
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {ongData.organization.values.slice(0, 3).map((value, index) => {
                            const icons = ["💜", "🤝", "🚀", "✨", "🎯"];
                            const descriptions = [
                                "Acreditamos que todos merecem oportunidades iguais, independente de origem ou condição social.",
                                "Educação de qualidade é a chave para transformar vidas e comunidades inteiras.",
                                "Democratizamos o acesso à tecnologia para que todos possam participar da transformação digital."
                            ];
                            return (
                                <TeamValueCard
                                    key={index}
                                    icon={icons[index]}
                                    title={value}
                                    description={descriptions[index]}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Filtros - NOVO! */}
            <section className="py-8 bg-black/20 border-y border-white/5 sticky top-0 z-30 backdrop-blur-xl">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                                filter === 'all'
                                    ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white shadow-lg shadow-[#8a4add]/30'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            Todos ({sortedVisibleTeam.length})
                        </button>
                        <button
                            onClick={() => setFilter('core')}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                                filter === 'core'
                                    ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white shadow-lg shadow-[#8a4add]/30'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            Equipe Principal ({coreTeam.length})
                        </button>
                        <button
                            onClick={() => setFilter('volunteers')}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                                filter === 'volunteers'
                                    ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white shadow-lg shadow-[#8a4add]/30'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            Voluntários ({volunteers.length})
                        </button>
                    </div>
                </div>
            </section>

            {/* Grid de Membros - MELHORADO! */}
            <section className="py-24 container mx-auto px-4 sm:px-6 lg:px-8">
                {filteredTeam.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTeam.map((member, index) => (
                            <TeamCard key={member.id} member={member} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-16">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </div>
                        <p className="text-lg">Nenhum membro encontrado nesta categoria.</p>
                    </div>
                )}
            </section>

            {/* CTA para Voluntariado - NOVO! */}
            <section className="py-24 bg-gradient-to-b from-black/20 to-[#1a1033] relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/20 border border-[#8a4add]/30 rounded-full mb-6">
                            <span className="text-sm font-bold text-[#c4b5fd]">Junte-se a Nós</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Quer fazer parte dessa transformação?
                        </h2>
                        
                        <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                            Estamos sempre em busca de profissionais apaixonados por educação e tecnologia. 
                            Seja mentor, voluntário ou colaborador fixo.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a 
                                href={`mailto:${ongData.contact.emails.general}?subject=Quero ser Voluntário`}
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#8a4add]/30 hover:-translate-y-1 transition-all duration-300"
                            >
                                Quero ser Voluntário
                            </a>
                            <a 
                                href="/about"
                                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
                            >
                                Conheça Nossa História
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TeamView;