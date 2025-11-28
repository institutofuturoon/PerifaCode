import React from 'react';
import { Event, User } from '../types';
import StatusBadge from './StatusBadge';

interface EventCardProps {
  event: Event;
  instructor?: User;
  onEventClick?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, instructor, onEventClick }) => {
  // Verificar se o evento é ao vivo (exemplo: eventos de hoje)
  const isLive = false; // TODO: Implementar lógica de verificação de data/hora
  
  const eventTypeColors: Record<string, string> = {
    'Live': 'live',
    'Workshop': 'info',
    'Palestra': 'default',
  };
  
  const badgeVariant = eventTypeColors[event.eventType] || 'default';

  return (
    <div 
      onClick={() => onEventClick?.(event)}
      className="bg-[#121212] rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60"></div>
        
        {/* Badge AO VIVO */}
        {isLive && (
          <div className="absolute top-3 left-3">
            <StatusBadge variant="live" pulse>
              🔴 AO VIVO
            </StatusBadge>
          </div>
        )}
        
        {/* Tipo de Evento */}
        {!isLive && (
          <div className="absolute top-3 left-3">
            <StatusBadge variant={badgeVariant as any}>
              {event.eventType}
            </StatusBadge>
          </div>
        )}
        
        {/* Data */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg text-center border border-white/10">
          <p className="text-xs font-bold text-white uppercase tracking-wider">{event.date}</p>
          <p className="text-[10px] text-gray-400">{event.time}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {event.title}
        </h3>
        
        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
          {event.description}
        </p>

        {/* Instructor */}
        {instructor && (
          <div className="flex items-center gap-3 pt-3 border-t border-white/5">
            <img 
              src={instructor.avatarUrl} 
              alt={instructor.name} 
              className="w-8 h-8 rounded-full border border-white/10"
            />
            <div>
              <p className="text-xs font-semibold text-white">{instructor.name}</p>
              <p className="text-[10px] text-gray-500">{instructor.title || 'Instrutor'}</p>
            </div>
          </div>
        )}

        {/* CTA */}
        {event.registrationUrl && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-4 w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
          >
            {isLive ? 'Assistir Agora' : 'Inscrever-se'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};

export default EventCard;
