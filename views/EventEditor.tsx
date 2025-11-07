
import React, { useState } from 'react';
import { Event } from '../types';
import { useAppContext } from '../App';

interface EventEditorProps {
  event: Event;
}

const EventEditor: React.FC<EventEditorProps> = ({ event: initialEvent }) => {
  const { handleSaveEvent, navigate, instructors } = useAppContext();
  const [event, setEvent] = useState<Event>(initialEvent);

  // FIX: Changed 'events' to 'connect' as 'events' is not a valid view type. The 'connect' view handles events.
  const onCancel = () => navigate('connect');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveEvent(event);
  };

  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors sm:text-sm text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-white">{initialEvent.title ? 'Editar Evento' : 'Novo Evento'}</h1>
            <p className="text-gray-400 mt-1">Crie e gerencie os eventos da comunidade.</p>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onCancel} className="bg-white/10 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-white/20 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
              Salvar Evento
            </button>
          </div>
        </div>

        <div className="p-8 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 space-y-6">
            <div>
                <label htmlFor="title" className={labelClasses}>Título do Evento</label>
                <input id="title" name="title" value={event.title} onChange={handleChange} required className={inputClasses} />
            </div>
            <div>
                <label htmlFor="description" className={labelClasses}>Descrição</label>
                <textarea id="description" name="description" value={event.description} onChange={handleChange} required className={inputClasses} rows={4} placeholder="Descreva o evento, o que será abordado, para quem se destina, etc."/>
            </div>
             <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="hostId" className={labelClasses}>Instrutor/Host</label>
                    <select id="hostId" name="hostId" value={event.hostId} onChange={handleChange} className={inputClasses}>
                        {instructors.map(inst => (
                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="eventType" className={labelClasses}>Tipo de Evento</label>
                    <select id="eventType" name="eventType" value={event.eventType} onChange={handleChange} className={inputClasses}>
                        <option>Live</option>
                        <option>Workshop</option>
                        <option>Palestra</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className={labelClasses}>Data (Ex: AGO 27)</label>
                    <input id="date" name="date" value={event.date} onChange={handleChange} required placeholder="MÊS DIA" className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="time" className={labelClasses}>Horário (Ex: 19:00)</label>
                    <input id="time" name="time" type="time" value={event.time} onChange={handleChange} required className={inputClasses} />
                </div>
            </div>
            <div>
                <label htmlFor="imageUrl" className={labelClasses}>URL da Imagem de Capa</label>
                <input id="imageUrl" name="imageUrl" value={event.imageUrl} onChange={handleChange} placeholder="https://..." required className={inputClasses}/>
             </div>
        </div>
      </form>
    </div>
  );
};

export default EventEditor;
