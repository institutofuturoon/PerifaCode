
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { useAppContext } from '../App';
import Uploader from '../components/Uploader';
import EditorHeader from '../components/EditorHeader';

const EventEditor: React.FC = () => {
  const { events, handleSaveEvent, instructors, showToast } = useAppContext();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const initialEvent = useMemo(() => {
    if (eventId && eventId !== 'new') {
        return events.find(e => e.id === eventId);
    }
    return {
        id: `event_${Date.now()}`, title: '', date: '', time: '',
        hostId: instructors[0]?.id || '', description: '',
        imageUrl: '', eventType: 'Live' as Event['eventType'],
        registrationUrl: '', location: ''
    };
  }, [eventId, events, instructors]);

  const [event, setEvent] = useState<Event>(initialEvent || {
    id: `event_${Date.now()}`, title: '', date: '', time: '',
    hostId: instructors[0]?.id || '', description: '',
    // FIX: Explicitly cast 'eventType' to match the 'Event' type to resolve type error.
    imageUrl: '', eventType: 'Live' as Event['eventType'],
    registrationUrl: '', location: ''
  });

  if (!initialEvent) {
      return <div className="text-center py-20">Evento não encontrado.</div>;
  }
  
  const onCancel = () => navigate('/admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEvent(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUploadComplete = (url: string) => {
    setEvent(prev => ({...prev, imageUrl: url}));
    showToast('✅ Imagem do evento salva!');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveEvent(event);
    navigate('/admin');
  };

  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="min-h-screen bg-[#09090B]">
      <EditorHeader
        title={initialEvent.title ? 'Editar Evento' : 'Novo Evento'}
        subtitle="Crie ou atualize eventos para a comunidade."
        onBack={onCancel}
        actions={
          <button type="submit" form="event-form" className="bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40">
            Salvar Evento
          </button>
        }
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="event-form" onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">

        <div className="p-8 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 space-y-6">
          <div>
            <label htmlFor="title" className={labelClasses}>Título do Evento</label>
            <input id="title" name="title" value={event.title} onChange={handleChange} required className={inputClasses} placeholder="Ex: Hackathon das Favelas 2024" />
          </div>

          <div>
            <label htmlFor="description" className={labelClasses}>Descrição</label>
            <textarea id="description" name="description" value={event.description} onChange={handleChange} required className={inputClasses} rows={4} placeholder="Descreva o evento, o que será abordado, pré-requisitos, etc." />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className={labelClasses}>Data (Ex: AGO 25)</label>
              <input id="date" name="date" value={event.date} onChange={handleChange} required className={inputClasses} placeholder="AGO 25" />
            </div>
            <div>
              <label htmlFor="time" className={labelClasses}>Horário (Ex: 19:00)</label>
              <input id="time" name="time" value={event.time} onChange={handleChange} required className={inputClasses} placeholder="19:00" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="hostId" className={labelClasses}>Anfitrião</label>
              <select id="hostId" name="hostId" value={event.hostId} onChange={handleChange} required className={inputClasses}>
                <option value="">Selecione um instrutor...</option>
                {instructors.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="eventType" className={labelClasses}>Tipo de Evento</label>
              <select id="eventType" name="eventType" value={event.eventType} onChange={handleChange} required className={inputClasses}>
                <option>Live</option>
                <option>Workshop</option>
                <option>Palestra</option>
              </select>
            </div>
          </div>

          <div>
             <label htmlFor="location" className={labelClasses}>Localização (Opcional)</label>
             <input id="location" name="location" value={event.location || ''} onChange={handleChange} className={inputClasses} placeholder="Ex: Online - Youtube ou Presencial - Sala 3" />
          </div>

          <div>
             <label htmlFor="registrationUrl" className={labelClasses}>Link de Inscrição/Externo (Opcional)</label>
             <input id="registrationUrl" name="registrationUrl" value={event.registrationUrl || ''} onChange={handleChange} className={inputClasses} placeholder="https://forms.gle/..." />
          </div>
          
          <div className="flex items-end gap-4">
            <div className="flex-grow">
                <label htmlFor="imageUrl" className={labelClasses}>URL da Imagem de Capa</label>
                <input id="imageUrl" name="imageUrl" value={event.imageUrl} onChange={handleChange} required className={inputClasses} placeholder="https://..." />
            </div>
            <Uploader pathnamePrefix={`events/${event.id}`} onUploadComplete={handleImageUploadComplete}>
                {(trigger, loading) => (
                    <button type="button" onClick={trigger} disabled={loading} className="py-3 px-4 bg-white/10 rounded-md hover:bg-white/20 transition-colors border border-white/10 h-[46px]">
                        {loading ? 'Enviando...' : 'Upload'}
                    </button>
                )}
            </Uploader>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
};

export default EventEditor;
