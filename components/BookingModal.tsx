
import React, { useMemo } from 'react';
import { User, MentorSession } from '../types';
import { useAppContext } from '../App';

interface BookingModalProps {
    mentor: User;
    onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ mentor, onClose }) => {
    const { mentorSessions, handleBookSession } = useAppContext();

    // Filtra sessões deste mentor que não estão agendadas
    const availableSessions = useMemo(() => {
        return mentorSessions
            .filter(s => s.mentorId === mentor.id && !s.isBooked)
            .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    }, [mentorSessions, mentor.id]);

    const handleBook = (sessionId: string) => {
        handleBookSession(sessionId);
        onClose();
    };

    // Agrupar por dia para melhor visualização
    const groupedSessions = useMemo(() => {
        const groups: Record<string, MentorSession[]> = {};
        availableSessions.forEach(session => {
            if (!groups[session.date]) groups[session.date] = [];
            groups[session.date].push(session);
        });
        return groups;
    }, [availableSessions]);

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-[#121212] rounded-2xl border border-[#8a4add]/30 w-full max-w-lg flex flex-col shadow-2xl shadow-[#8a4add]/20 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-[#18181B]">
                    <img src={mentor.avatarUrl} alt={mentor.name} className="w-16 h-16 rounded-full border-2 border-[#8a4add]" />
                    <div>
                        <h3 className="text-xl font-bold text-white">Agendar Mentoria</h3>
                        <p className="text-sm text-gray-400">com {mentor.name}</p>
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {Object.keys(groupedSessions).length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-3">📅</div>
                            <p className="text-gray-400">Nenhum horário disponível no momento.</p>
                            <p className="text-xs text-gray-600 mt-1">Tente novamente mais tarde.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(groupedSessions).map(([date, sessions]) => {
                                const dateObj = new Date(date + 'T00:00:00'); // Force local time parsing logic roughly
                                const dayName = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
                                const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });

                                return (
                                    <div key={date}>
                                        <h4 className="text-[#c4b5fd] font-bold text-sm mb-3 capitalize border-b border-white/5 pb-1">
                                            {dayName}, {formattedDate}
                                        </h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(sessions as MentorSession[]).map(session => (
                                                <button
                                                    key={session.id}
                                                    onClick={() => handleBook(session.id)}
                                                    className="py-2 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-[#8a4add] hover:text-white hover:border-[#8a4add] transition-all text-sm font-mono font-semibold text-gray-300"
                                                >
                                                    {session.time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-[#18181B] border-t border-white/10 text-center">
                    <p className="text-xs text-gray-500">
                        Ao agendar, um link do Google Meet será gerado automaticamente no seu painel.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
