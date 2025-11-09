import React, { useState } from 'react';
import { useAppContext } from '../App';

const EventDetailView: React.FC = () => {
  const { currentEvent, navigate } = useAppContext();
  const [copyButtonText, setCopyButtonText] = useState('Compartilhar');

  if (!currentEvent) {
    // Navigate back or show an error. Let's redirect to the connect page.
    navigate('connect');
    return <div className="text-center py-20">Evento não encontrado. Redirecionando...</div>;
  }

  const event = currentEvent;
  
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?event=${event.id}`;
    const shareText = `🚀 Participe do evento "${event.title}" da FuturoOn! Saiba mais e inscreva-se.`;
    const shareTitle = `Evento FuturoOn: ${event.title}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
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
  
  const formattedLocation = event.location?.replace('Presencial - ', '').toUpperCase() || 'LOCAL A DEFINIR';

  return (
    <div className="bg-[#09090B]">
      {/* Header with Background Image */}
      <section className="relative py-20 md:py-32 bg-black/20">
        <div className="absolute inset-0">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-semibold text-purple-400 uppercase tracking-widest">
              {event.eventType} &bull; {formattedLocation}
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-black text-white">{event.title}</h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
        <div className="max-w-3xl mx-auto bg-[#121212] p-8 sm:p-12 rounded-lg border border-white/10 shadow-2xl">
            <div className="max-w-none text-gray-300 leading-relaxed space-y-6 text-lg">
              {event.description.split('\n\n').map((paragraph, index) => {
                // Final CTA with link
                if (paragraph.startsWith('🔗') && event.registrationUrl) {
                  return (
                    <p key={index}>
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-purple-400 hover:text-purple-300 transition-colors hover:underline"
                      >
                        {paragraph}
                      </a>
                    </p>
                  );
                }

                // Introductory hook
                if (index === 0) {
                  return <p key={index} className="text-xl font-medium text-gray-200">{paragraph}</p>;
                }
                
                // Key info lines with emojis
                if (['🗓️', '⚠️'].some(emoji => paragraph.startsWith(emoji))) {
                     return <p key={index} className="font-semibold text-white">{paragraph}</p>;
                }

                // Default paragraph
                return <p key={index}>{paragraph}</p>;
              })}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 mt-8 border-t border-zinc-700/50">
               {event.registrationUrl && (
                  <a 
                      href={event.registrationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full sm:w-auto flex-grow text-center bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                      Inscrever-se
                  </a>
               )}
              <button 
                  onClick={handleShare} 
                  className="w-full sm:w-auto text-center bg-zinc-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-zinc-600 transition-colors"
              >
                  {copyButtonText}
              </button>
            </div>
            <div className="mt-8 border-t border-white/10 pt-8">
              <button onClick={() => navigate('connect')} className="text-purple-400 font-semibold hover:text-purple-300 transition-colors group">
                <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Voltar para Eventos
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailView;