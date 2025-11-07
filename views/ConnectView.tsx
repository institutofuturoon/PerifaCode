



import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../App';
// FIX: The type 'TeamMember' does not exist in 'types.ts'. Replaced with 'User'.
import { User } from '../types';

declare global {
  interface Window {
    gapi: any;
  }
}

const ConnectView: React.FC = () => {
    const { user, navigate, events, team, mentors, mentorSessions, handleCreateEvent, handleEditEvent, handleDeleteEvent, handleBookSession, handleCancelSession } = useAppContext();
    const [selectedMentor, setSelectedMentor] = useState<User | null>(null);
    const [isGapiReady, setIsGapiReady] = useState(false);
    const [isMentorSignedIn, setIsMentorSignedIn] = useState(false);
    
    const instructors = useMemo(() => team.filter(t => t.isInstructor), [team]);
    
    useEffect(() => {
        // Simple check for gapi
        if (window.gapi && window.gapi.auth2) {
            setIsGapiReady(true);
            const authInstance = window.gapi.auth2.getAuthInstance();
            if (authInstance) {
                setIsMentorSignedIn(authInstance.isSignedIn.get());
                authInstance.isSignedIn.listen(setIsMentorSignedIn);
            }
        }
    }, [user]);

    const handleAuthClick = () => {
        if (window.gapi) {
            window.gapi.auth2.getAuthInstance().signIn();
        }
    };

    const handleSignoutClick = () => {
        if (window.gapi) {
            window.gapi.auth2.getAuthInstance().signOut();
        }
    };


    const mySessions = useMemo(() => {
        if (!user) return [];
        return mentorSessions
            .filter(s => s.studentId === user.id)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time));
    }, [mentorSessions, user]);

    const groupedMentorSessions = useMemo(() => {
        if (!selectedMentor) return {};
        
        const sessions = mentorSessions.filter(s => s.mentorId === selectedMentor.id);
        
        return sessions.reduce((acc, session) => {
            const date = session.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(session);
            return acc;
        }, {} as Record<string, typeof mentorSessions>);

    }, [mentorSessions, selectedMentor]);

    const next7Days = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return date;
        });
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).replace('.', '');
    };

    return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Mentorias & Eventos</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
            Aprenda com quem está no campo de batalha. Nossos mentores e instrutores são profissionais experientes, prontos para acelerar sua carreira.
          </p>
        </div>
        
        {/* Google Auth for Instructors */}
        {user?.role === 'instructor' && isGapiReady && (
            <div className="mt-12 max-w-2xl mx-auto bg-black/20 p-6 rounded-lg border border-purple-500/20 text-center">
                <h3 className="font-bold text-white">Conecte sua Agenda do Google</h3>
                <p className="text-sm text-gray-400 mt-1">Para habilitar o agendamento automático de mentorias com criação de links do Meet, conecte sua conta.</p>
                {isMentorSignedIn ? (
                    <button onClick={handleSignoutClick} className="mt-4 font-semibold text-sm py-2 px-4 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30">
                        Desconectar Agenda
                    </button>
                ) : (
                     <button onClick={handleAuthClick} className="mt-4 font-semibold text-sm py-2 px-4 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                        Conectar com Google
                    </button>
                )}
            </div>
        )}

        {/* Minhas Mentorias Section */}
        {user && mySessions.length > 0 && (
             <section className="mt-16">
                 <h2 className="text-2xl font-bold text-white mb-6">Minhas Mentorias Agendadas</h2>
                 <div className="bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 p-6 space-y-4">
                     {mySessions.map(session => {
                         const mentor = team.find(i => i.id === session.mentorId);
                         const sessionDate = new Date(`${session.date}T${session.time}`);
                         return (
                            <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/5 p-4 rounded-md gap-4">
                                <div>
                                    <p className="font-bold text-white">Mentoria com {mentor?.name}</p>
                                    <p className="text-sm text-purple-300">{formatDate(sessionDate)} às {session.time}</p>
                                    {session.googleMeetUrl ? (
                                        <a href={session.googleMeetUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-300 hover:text-white hover:underline flex items-center gap-1 mt-1">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                          Acessar sala da chamada
                                        </a>
                                    ) : (
                                        <p className="text-xs text-gray-500 mt-1">Link da sala será gerado em breve.</p>
                                    )}
                                </div>
                                <button 
                                    onClick={() => handleCancelSession(session.id)}
                                    className="flex-shrink-0 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded-full transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                         )
                     })}
                 </div>
             </section>
        )}

        {/* Mentores Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center sm:text-left">Mentorias Individuais</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentors.map(mentor => (
                <div key={mentor.id} className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10 text-center group transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col">
                    <img src={mentor.avatarUrl} alt={mentor.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-purple-500/50 group-hover:border-purple-500 transition-colors duration-300 transform group-hover:scale-105"/>
                    <h3 className="text-xl font-bold text-white">{mentor.name}</h3>
                    <p className="text-purple-400 font-semibold">{mentor.title}</p>
                    <p className="mt-4 text-gray-400 text-sm flex-grow">{mentor.bio}</p>
                    <button 
                        onClick={() => {
                            if (!user) {
                                navigate('login');
                            } else {
                                setSelectedMentor(mentor);
                            }
                        }}
                        className="mt-6 w-full bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
                    >
                        {user ? 'Ver Agenda' : 'Faça login para ver a agenda'}
                    </button>
                </div>
            ))}
          </div>
        </section>
        
        {/* Schedule Section */}
        {selectedMentor && (
            <section className="mt-16 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 p-8">
                 <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-white mb-6">Agenda de {selectedMentor.name}</h2>
                    <button onClick={() => setSelectedMentor(null)} className="text-gray-400 hover:text-white font-bold text-2xl">&times;</button>
                 </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {next7Days.map(day => {
                        const dateKey = day.toISOString().split('T')[0];
                        const daySessions = groupedMentorSessions[dateKey]?.sort((a,b) => a.time.localeCompare(b.time)) || [];
                        return (
                            <div key={dateKey}>
                                <div className="p-2 rounded-t-md bg-white/10 text-center">
                                    <p className="font-bold text-white">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                                    <p className="text-xs text-gray-300">{day.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</p>
                                </div>
                                <div className="p-2 space-y-2 bg-white/5 rounded-b-md">
                                    {daySessions.length > 0 ? daySessions.map(session => {
                                        const isBookedByMe = session.studentId === user?.id;
                                        const isDisabled = (session.isBooked && !isBookedByMe) || !user;

                                        return (
                                            <button 
                                                key={session.id}
                                                onClick={() => isBookedByMe ? handleCancelSession(session.id) : handleBookSession(session.id)}
                                                disabled={isDisabled}
                                                className={`w-full text-xs font-semibold p-2 rounded transition-colors ${
                                                    isBookedByMe 
                                                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                                                        : isDisabled
                                                        ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                                        : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                                                }`}
                                                title={!user ? "Faça login para agendar" : ""}
                                            >
                                                {isBookedByMe ? 'Cancelar' : session.time}
                                            </button>
                                        )
                                    }) : (
                                        <p className="text-xs text-center text-gray-500 p-2">Sem horários</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        )}

        {/* Eventos Section */}
        <section className="mt-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h2 className="text-3xl font-bold text-white text-center sm:text-left">Agenda de Eventos Ao Vivo</h2>
             {(user?.role === 'admin' || user?.role === 'instructor') && (
                <button
                    onClick={handleCreateEvent}
                    className="mt-4 sm:mt-0 w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-5 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/20"
                >
                    Criar Novo Evento
                </button>
             )}
          </div>
          <div className="space-y-6">
            {events.map(event => {
                const host = instructors.find(i => i.id === event.hostId);
                return (
                    <div key={event.id} className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 flex flex-col md:flex-row items-start md:items-center gap-6 transition-colors duration-300 hover:border-purple-500/50">
                        <div className="flex-shrink-0 text-center p-4 rounded-md bg-black/20 w-full md:w-32">
                            <p className="text-5xl font-black text-white leading-none">{event.date.split(' ')[1]}</p>
                            <p className="text-lg text-purple-400 font-bold">{event.date.split(' ')[0]}</p>
                            <p className="text-sm text-gray-400 mt-1">{event.time}</p>
                        </div>
                        <div className="flex-1">
                            <span className="text-xs font-bold uppercase text-purple-300">{event.eventType}</span>
                            <h3 className="text-xl font-bold text-white mt-1">{event.title}</h3>
                            <p className="text-md text-gray-400 font-semibold">com {host?.name || 'FuturoOn'}</p>
                            <p className="mt-2 text-gray-300 text-sm">{event.description}</p>
                        </div>
                        <div className="w-full md:w-auto flex flex-col gap-2 self-center">
                            <button className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:scale-105">
                                Reservar Vaga
                            </button>
                             {(user?.role === 'admin' || user?.id === event.hostId) && (
                                <div className="flex justify-center items-center gap-2 mt-2">
                                    <button onClick={() => handleEditEvent(event)} className="text-xs font-semibold text-gray-300 hover:text-white">Editar</button>
                                    <span className="text-gray-500">|</span>
                                    <button onClick={() => handleDeleteEvent(event.id)} className="text-xs font-semibold text-red-400 hover:text-red-300">Excluir</button>
                                </div>
                             )}
                        </div>
                    </div>
                )
            })}
          </div>
        </section>
      </div>
    </>
  );
};

export default ConnectView;