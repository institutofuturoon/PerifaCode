
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { User, Event } from '../types';
import PageLayout from '../components/PageLayout';
import BookingModal from '../components/BookingModal';

const MentorCard: React.FC<{ mentor: User, onSchedule: (mentor: User) => void }> = ({ mentor, onSchedule }) => {
    const { user } = useAppContext();
    const navigate = useNavigate();
    
    const handleAction = () => {
        if (user) {
            onSchedule(mentor);
        } else {
            navigate('/entrar');
        }
    };

    return (
        <div className="bg-[#18181B] border border-purple-500/30 rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transform hover:-translate-y-1 group">
            <div className="relative mb-4">
                <img src={mentor.avatarUrl} alt={mentor.name} className="w-28 h-28 rounded-full object-cover" />
                <div className="absolute inset-0 rounded-full ring-4 ring-purple-500 ring-offset-4 ring-offset-[#18181B] opacity-70 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 className="text-xl font-bold text-white">{mentor.name}</h3>
            <p className="text-purple-400 font-semibold text-sm">{mentor.title}</p>
            <p className="mt-3 text-gray-400 text-sm flex-grow">{mentor.bio}</p>
            <button
                onClick={handleAction}
                className="mt-6 w-full bg-gray-700/50 text-gray-300 font-semibold py-3 px-4 rounded-lg hover:bg-[#8a4add] hover:text-white transition-colors"
            >
                {user ? 'Ver agenda disponível' : 'Faça login para ver a agenda'}
            </button>
        </div>
    );
};


const EventCard: React.FC<{ event: Event, host?: User }> = ({ event, host }) => {
    const navigate = useNavigate();
    
    const renderDate = () => {
        if (event.date.toUpperCase().includes('BREVE')) {
            return (
                <p className="text-3xl font-black text-white leading-none tracking-tight">EM BREVE</p>
            );
        }
        const dateParts = event.date.split(' ');
        const mainDate = dateParts.length > 1 ? dateParts[1] : event.date;
        const subDate = dateParts.length > 1 ? dateParts[0] : '';
        return (
            <>
                <p className="text-5xl font-black text-white leading-none">{mainDate}</p>
                <p className="text-lg text-purple-400 font-bold">{subDate}</p>
            </>
        );
    };

    return (
        <div className="bg-[#18181B] border border-gray-800 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 text-center w-24">
                {renderDate()}
                {event.time && <p className="text-sm text-gray-400 mt-1">{event.time}</p>}
            </div>
            <div className="h-full w-px bg-gray-700 hidden sm:block"></div>
            <div className="flex-1 text-center sm:text-left">
                <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                    {event.eventType}
                    {event.location && ` • ${event.location}`}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{event.title}</h3>
                <p className="text-md text-gray-400 font-semibold">com {host?.name || 'FuturoOn'}</p>
                <p className="mt-2 text-gray-300 text-sm hidden md:block">{event.description}</p>
            </div>
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
                 <button 
                    onClick={() => navigate(`/event/${event.id}`)}
                    className="w-full sm:w-auto bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/20 transform hover:scale-105">
                    Ver Detalhes
                </button>
            </div>
        </div>
    )
}

const ConnectView: React.FC = () => {
    const { events, instructors, mentors } = useAppContext();
    const [selectedMentor, setSelectedMentor] = useState<User | null>(null);

    const sortedEvents = useMemo(() => {
        const monthMap: { [key: string]: number } = {
            'JAN': 0, 'FEV': 1, 'MAR': 2, 'ABR': 3, 'MAI': 4, 'JUN': 5,
            'JUL': 6, 'AGO': 7, 'SET': 8, 'OUT': 9, 'NOV': 10, 'DEZ': 11
        };

        // Função auxiliar para converter data string em timestamp para ordenação
        const getEventSortValue = (dateStr: string): number => {
            // Prioridade máxima (valor baixo) para "EM BREVE"
            if (dateStr.toUpperCase().includes('BREVE')) {
                return -1; 
            }

            // Tenta parsear formatos como "AGO 25"
            const parts = dateStr.split(' ');
            if (parts.length >= 2) {
                const monthCode = parts[0].toUpperCase().substring(0, 3);
                const day = parseInt(parts[1]);

                if (monthMap[monthCode] !== undefined && !isNaN(day)) {
                    const now = new Date();
                    let year = now.getFullYear();
                    const eventDate = new Date(year, monthMap[monthCode], day);
                    
                    return eventDate.getTime();
                }
            }

            // Fallback para datas ISO ou datas inválidas (coloca no final)
            const timestamp = new Date(dateStr).getTime();
            return isNaN(timestamp) ? 9999999999999 : timestamp;
        };

        return [...events].sort((a, b) => {
            const valA = getEventSortValue(a.date);
            const valB = getEventSortValue(b.date);
            return valA - valB;
        });
    }, [events]);

    return (
        <PageLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Mentorias & Eventos</h1>
                    <p className="mt-4 text-lg text-gray-400">
                        Aprenda com quem está no campo de batalha. Nossos mentores e instrutores são profissionais experientes, prontos para acelerar sua carreira.
                    </p>
                </div>

                {/* Mentores Section */}
                <section className="mt-16 md:mt-20">
                    <h2 className="text-3xl font-bold text-white mb-8">Mentorias Individuais</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mentors.filter(mentor => mentor.isMentor).map(mentor => (
                            <MentorCard 
                                key={mentor.id} 
                                mentor={mentor} 
                                onSchedule={(m) => setSelectedMentor(m)} 
                            />
                        ))}
                    </div>
                </section>

                {/* Eventos Section */}
                <section className="mt-20 md:mt-24">
                    <h2 className="text-3xl font-bold text-white mb-8">Agenda de Eventos Ao Vivo</h2>
                    <div className="space-y-6">
                        {sortedEvents.map(event => {
                            const host = instructors.find(i => i.id === event.hostId);
                            return <EventCard key={event.id} event={event} host={host} />
                        })}
                    </div>
                </section>

                {/* Modal de Agendamento */}
                {selectedMentor && (
                    <BookingModal 
                        mentor={selectedMentor} 
                        onClose={() => setSelectedMentor(null)} 
                    />
                )}
            </div>
        </PageLayout>
    );
};

export default ConnectView;
