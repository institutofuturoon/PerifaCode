import React, { useState } from 'react';
import { useAppContext } from '../App';
import { User } from '../types';

const EventDetailView: React.FC = () => {
  const { currentEvent, navigate, users } = useAppContext();
  const [copyButtonText, setCopyButtonText] = useState('Compartilhar');

  if (!currentEvent) {
    return <div className="text-center py-20">Evento não encontrado.</div>;
  }
  const event = currentEvent;
  const host = users.find(u => u.id === event.hostId);
  const mediator = users.find(u => u.id === 'vol1'); // Luiza Carmelo

  const handleShare = async () => {
    if (!currentEvent) return;

    const shareUrl = `${window.location.origin}${window.location.pathname}?event=${currentEvent.id}`;
    const shareText = `🚀 Participe do evento "${currentEvent.title}" da FuturoOn! Saiba mais e inscreva-se.`;
    const shareTitle = `Evento FuturoOn: ${currentEvent.title}`;
    
    // Web Share API (for mobile/supported browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback for desktop: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        setCopyButtonText('Copiado!');
        setTimeout(() => setCopyButtonText('Compartilhar'), 2000);
      } catch (err) {
        console.error('Falha ao copiar link:', err);
        alert('Não foi possível copiar o link. Tente manualmente.');
      }
    }
  };

  return (
    <div>
      <section className="relative py-12 md:py-20 bg-black/20">
        <div className="absolute inset-0">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-semibold text-[#c4b5fd] uppercase tracking-wider">{event.eventType} {event.location && `• ${event.location}`}</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-2">{event.title}</h1>
            <div className="flex items-center justify-center gap-3 mt-6">
              {host && (
                <>
                    <img src={host.avatarUrl} alt={host.name} className="h-12 w-12 rounded-full border-2 border-[#8a4add]/50" />
                    <div>
                        <p className="font-semibold text-white">{host.name}</p>
                        <p className="text-sm text-gray-400">{host.title}</p>
                    </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">
        <div className="max-w-3xl mx-auto bg-[#121212] p-8 sm:p-12 rounded-lg border border-white/10 shadow-2xl">
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
            <p className="text-lg">{event.description}</p>
            
            {event.id === 'ev4' && mediator && ( // Custom content for the Python event
              <div className="mt-8 space-y-6">
                <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="font-bold text-white">Palestrante</h3>
                    <p>{host?.name} <span className="text-gray-400 text-sm">({host?.title})</span></p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="font-bold text-white">Mediadora</h3>
                    <p>{mediator.name} <span className="text-gray-400 text-sm">({mediator.title})</span></p>
                </div>
                <div className="p-4 bg-yellow-500/10 rounded-lg text-yellow-300">
                    <p><span className="font-bold">🎁 Daremos brindes!</span> (*Apenas para participantes presenciais)</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <a 
                href={event.registrationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-grow text-center bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/20 transform hover:scale-105"
            >
                Inscrever-se
            </a>
             <button
                onClick={handleShare}
                className="w-full sm:w-auto text-center bg-white/10 border border-white/20 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                {copyButtonText}
            </button>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <button onClick={() => navigate('connect')} className="text-[#c4b5fd] font-semibold hover:text-white transition-colors group">
              <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para Eventos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailView;