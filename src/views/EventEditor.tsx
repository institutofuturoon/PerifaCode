
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { useAppContext } from '../App';
import Uploader from '../components/Uploader';
import EditorHeader from '../components/EditorHeader';
import LoadingState from '../components/LoadingState';

const EventEditor: React.FC = () => {
  const { events, handleSaveEvent, instructors, showToast, user } = useAppContext();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialEvent = useMemo(() => {
    if (eventId && eventId !== 'new') {
        return events.find(e => e.id === eventId);
    }
    return {
        id: `event_${Date.now()}`, 
        title: '', 
        date: '', 
        time: '',
        hostId: user?.id || instructors[0]?.id || '', 
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 
        eventType: 'Live' as Event['eventType'],
        registrationUrl: '', 
        location: ''
    };
  }, [eventId, events, instructors, user]);

  const [event, setEvent] = useState<Event>(initialEvent || {
    id: `event_${Date.now()}`, 
    title: '', 
    date: '', 
    time: '',
    hostId: user?.id || instructors[0]?.id || '', 
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 
    eventType: 'Live' as Event['eventType'],
    registrationUrl: '', 
    location: ''
  });

  useEffect(() => {
    if (initialEvent) {
      setEvent(initialEvent);
    }
  }, [initialEvent]);

  if (!initialEvent && eventId !== 'new') {
      return (
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-xl mb-4">Evento não encontrado</p>
            <button onClick={() => navigate('/admin')} className="text-[#c4b5fd] hover:text-white">
              Voltar ao Admin
            </button>
          </div>
        </div>
      );
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!event.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!event.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!event.date.trim()) newErrors.date = 'Data é obrigatória';
    if (!event.time.trim()) newErrors.time = 'Horário é obrigatório';
    if (!event.hostId) newErrors.hostId = 'Anfitrião é obrigatório';
    if (!event.imageUrl.trim()) newErrors.imageUrl = 'Imagem é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('❌ Preencha todos os campos obrigatórios');
      return;
    }

    setIsSaving(true);
    try {
      await handleSaveEvent(event);
      showToast('✅ Evento salvo com sucesso!');
      navigate('/admin');
    } catch (error) {
      showToast('❌ Erro ao salvar evento');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = () => {
    const duplicated: Event = {
      ...event,
      id: `event_${Date.now()}`,
      title: `${event.title} (Cópia)`,
    };
    setEvent(duplicated);
    showToast('📋 Evento duplicado! Edite e salve.');
  };

  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  const host = instructors.find(i => i.id === event.hostId);

  return (
    <div className="min-h-screen bg-[#09090B]">
      <EditorHeader
        title={eventId === 'new' ? 'Criar Novo Evento' : 'Editar Evento'}
        subtitle={event.title || 'Preencha os detalhes do evento'}
        onBack={onCancel}
        actions={
          <div className="flex gap-3">
            {eventId !== 'new' && (
              <button 
                type="button" 
                onClick={handleDuplicate}
                className="bg-white/10 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-white/20 transition-all border border-white/10"
              >
                📋 Duplicar
              </button>
            )}
            <button 
              type="submit" 
              form="event-form" 
              disabled={isSaving}
              className="bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Salvando...
                </>
              ) : (
                'Salvar Evento'
              )}
            </button>
          </div>
        }
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <form id="event-form" onSubmit={handleSubmit} className="space-y-8">

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <div className="p-6 bg-[#121212] border border-white/10 rounded-xl space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    📝 Informações Básicas
                  </h3>
                  
                  <div>
                    <label htmlFor="title" className={labelClasses}>
                      Título do Evento <span className="text-red-400">*</span>
                    </label>
                    <input 
                      id="title" 
                      name="title" 
                      value={event.title} 
                      onChange={handleChange} 
                      className={`${inputClasses} ${errors.title ? 'border-red-500' : ''}`}
                      placeholder="Ex: Hackathon das Favelas 2024" 
                    />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label htmlFor="description" className={labelClasses}>
                      Descrição <span className="text-red-400">*</span>
                    </label>
                    <textarea 
                      id="description" 
                      name="description" 
                      value={event.description} 
                      onChange={handleChange} 
                      className={`${inputClasses} ${errors.description ? 'border-red-500' : ''}`}
                      rows={5} 
                      placeholder="Descreva o evento, o que será abordado, pré-requisitos, etc." 
                    />
                    {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                    <p className="text-xs text-gray-500 mt-1">{event.description.length} caracteres</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="p-6 bg-[#121212] border border-white/10 rounded-xl space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    📅 Data e Horário
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="date" className={labelClasses}>
                        Data <span className="text-red-400">*</span>
                      </label>
                      <input 
                        id="date" 
                        name="date" 
                        value={event.date} 
                        onChange={handleChange} 
                        className={`${inputClasses} ${errors.date ? 'border-red-500' : ''}`}
                        placeholder="Ex: DEZ 15 ou 15/12/2024" 
                      />
                      {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                    </div>
                    <div>
                      <label htmlFor="time" className={labelClasses}>
                        Horário <span className="text-red-400">*</span>
                      </label>
                      <input 
                        id="time" 
                        name="time" 
                        value={event.time} 
                        onChange={handleChange} 
                        className={`${inputClasses} ${errors.time ? 'border-red-500' : ''}`}
                        placeholder="Ex: 19:00" 
                      />
                      {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className={labelClasses}>
                      Localização
                    </label>
                    <input 
                      id="location" 
                      name="location" 
                      value={event.location || ''} 
                      onChange={handleChange} 
                      className={inputClasses} 
                      placeholder="Ex: Online - Youtube ou Presencial - Sala 3" 
                    />
                  </div>
                </div>

                {/* Host & Type */}
                <div className="p-6 bg-[#121212] border border-white/10 rounded-xl space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    👤 Anfitrião e Tipo
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="hostId" className={labelClasses}>
                        Anfitrião <span className="text-red-400">*</span>
                      </label>
                      <select 
                        id="hostId" 
                        name="hostId" 
                        value={event.hostId} 
                        onChange={handleChange} 
                        className={`${inputClasses} ${errors.hostId ? 'border-red-500' : ''}`}
                      >
                        <option value="">Selecione...</option>
                        {instructors.map(inst => (
                          <option key={inst.id} value={inst.id}>{inst.name}</option>
                        ))}
                      </select>
                      {errors.hostId && <p className="text-red-400 text-xs mt-1">{errors.hostId}</p>}
                    </div>
                    <div>
                      <label htmlFor="eventType" className={labelClasses}>
                        Tipo de Evento <span className="text-red-400">*</span>
                      </label>
                      <select 
                        id="eventType" 
                        name="eventType" 
                        value={event.eventType} 
                        onChange={handleChange} 
                        className={inputClasses}
                      >
                        <option>Live</option>
                        <option>Workshop</option>
                        <option>Palestra</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Image & Registration */}
                <div className="p-6 bg-[#121212] border border-white/10 rounded-xl space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    🖼️ Imagem e Inscrição
                  </h3>
                  
                  <div>
                    <label htmlFor="imageUrl" className={labelClasses}>
                      URL da Imagem de Capa <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-3">
                      <input 
                        id="imageUrl" 
                        name="imageUrl" 
                        value={event.imageUrl} 
                        onChange={handleChange} 
                        className={`${inputClasses} ${errors.imageUrl ? 'border-red-500' : ''} flex-1`}
                        placeholder="https://..." 
                      />
                      <Uploader pathnamePrefix={`events/${event.id}`} onUploadComplete={handleImageUploadComplete}>
                        {(trigger, loading) => (
                          <button 
                            type="button" 
                            onClick={trigger} 
                            disabled={loading} 
                            className="py-3 px-6 bg-white/10 rounded-lg hover:bg-white/20 transition-colors border border-white/10 font-bold text-sm whitespace-nowrap"
                          >
                            {loading ? '...' : '📤 Upload'}
                          </button>
                        )}
                      </Uploader>
                    </div>
                    {errors.imageUrl && <p className="text-red-400 text-xs mt-1">{errors.imageUrl}</p>}
                  </div>

                  <div>
                    <label htmlFor="registrationUrl" className={labelClasses}>
                      Link de Inscrição/Externo
                    </label>
                    <input 
                      id="registrationUrl" 
                      name="registrationUrl" 
                      value={event.registrationUrl || ''} 
                      onChange={handleChange} 
                      className={inputClasses} 
                      placeholder="https://forms.gle/..." 
                    />
                    <p className="text-xs text-gray-500 mt-1">Link para formulário de inscrição ou página externa</p>
                  </div>
                </div>
              </div>

              {/* Preview Column */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="p-6 bg-[#121212] border border-white/10 rounded-xl">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                      👁️ Preview
                    </h3>
                    
                    {/* Event Card Preview */}
                    <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all">
                      <div className="relative h-48 bg-gradient-to-br from-[#8a4add]/20 to-[#f27983]/20">
                        {event.imageUrl && (
                          <img 
                            src={event.imageUrl} 
                            alt={event.title || 'Preview'} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-[#8a4add] text-white text-xs font-bold rounded-full">
                            {event.eventType}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-xs text-[#c4b5fd] mb-2">
                          <span>📅 {event.date || 'Data'}</span>
                          <span>•</span>
                          <span>🕐 {event.time || 'Horário'}</span>
                        </div>
                        <h4 className="text-white font-bold mb-2 line-clamp-2">
                          {event.title || 'Título do Evento'}
                        </h4>
                        <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                          {event.description || 'Descrição do evento...'}
                        </p>
                        {host && (
                          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                            <img 
                              src={host.avatarUrl} 
                              alt={host.name} 
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-xs text-gray-400">{host.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Tips */}
                  <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <h3 className="text-sm font-bold text-blue-400 mb-3">💡 Dicas</h3>
                    <ul className="text-xs text-gray-400 space-y-2">
                      <li>• Use imagens de alta qualidade (min 800x600)</li>
                      <li>• Seja claro e objetivo na descrição</li>
                      <li>• Inclua pré-requisitos se houver</li>
                      <li>• Adicione link de inscrição se necessário</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventEditor;
