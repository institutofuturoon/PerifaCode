import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { User } from '../types';
import SEO from '../components/SEO';
import Badge from '../components/Badge';
import BookingModal from '../components/BookingModal';

// Componente de Card de Evento
const EventCard: React.FC<{
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'workshop' | 'mentoria' | 'hackathon' | 'palestra';
  spots?: number;
  image?: string;
  isUpcoming?: boolean;
}> = ({ title, date, time, location, description, category, spots, image, isUpcoming = true }) => {
  const categoryColors = {
    workshop: 'from-[#8a4add] to-[#c4b5fd]',
    mentoria: 'from-[#f27983] to-[#fbbf24]',
    hackathon: 'from-[#10b981] to-[#3b82f6]',
    palestra: 'from-[#fbbf24] to-[#f59e0b]',
  };

  const categoryLabels = {
    workshop: '🛠️ Workshop',
    mentoria: '💡 Mentoria',
    hackathon: '🏆 Hackathon',
    palestra: '🎤 Palestra',
  };

  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[category]}/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
      
      <div className="relative bg-gradient-to-br from-[#18181B] to-[#09090B] rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 hover:-translate-y-2 transition-all duration-300">
        {/* Imagem */}
        {image ? (
          <div className="h-48 bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: `url(${image})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>
        ) : (
          <div className={`h-48 bg-gradient-to-br ${categoryColors[category]} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center text-6xl">
              {category === 'workshop' && '🛠️'}
              {category === 'mentoria' && '💡'}
              {category === 'hackathon' && '🏆'}
              {category === 'palestra' && '🎤'}
            </div>
          </div>
        )}

        {/* Badge de categoria */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${categoryColors[category]} text-white shadow-lg`}>
            {categoryLabels[category]}
          </span>
        </div>

        {/* Badge de vagas */}
        {isUpcoming && spots && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-sm text-white border border-white/20">
              {spots} vagas
            </span>
          </div>
        )}

        {/* Conteúdo */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#c4b5fd] transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <svg className="w-4 h-4 text-[#8a4add]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>{date} às {time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <svg className="w-4 h-4 text-[#8a4add]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>{location}</span>
            </div>
          </div>

          {/* CTA */}
          {isUpcoming && (
            <button className="w-full py-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#8a4add]/30 transition-all duration-300">
              Inscrever-se
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente de Benefício de Mentoria
const MentorshipBenefitCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-8 rounded-2xl border border-white/10 hover:border-[#8a4add]/40 hover:-translate-y-2 transition-all duration-300 group">
    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#8a4add] to-[#f27983] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 text-center group-hover:text-[#c4b5fd] transition-colors">
      {title}
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed text-center">
      {description}
    </p>
  </div>
);

// Componente de Card de Mentor - NOVO!
const MentorCard: React.FC<{ 
  mentor: User; 
  onSchedule: (mentor: User) => void;
}> = ({ mentor, onSchedule }) => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  
  const handleAction = () => {
    if (user) {
      onSchedule(mentor);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="relative group">
      {/* Aurora effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8a4add]/20 to-[#f27983]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      <div className="relative bg-gradient-to-br from-[#18181B] to-[#09090B] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-[#8a4add]/40 hover:-translate-y-2 h-full">
        {/* Avatar com anel animado */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8a4add] to-[#f27983] blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <img 
              src={mentor.avatarUrl} 
              alt={mentor.name} 
              className="w-32 h-32 rounded-full object-cover border-4 border-[#18181B] group-hover:scale-105 transition-transform duration-300"
            />
            {/* Badge de disponibilidade */}
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-[#18181B] animate-pulse"></div>
          </div>
        </div>
        
        {/* Info */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#c4b5fd] transition-colors">
          {mentor.name}
        </h3>
        <p className="text-[#c4b5fd] font-semibold text-sm mb-4">
          {mentor.title}
        </p>
        
        {/* Bio */}
        <p className="text-gray-400 text-sm leading-relaxed flex-grow mb-6 line-clamp-3">
          {mentor.bio || 'Mentor experiente pronto para ajudar você a crescer na carreira tech.'}
        </p>
        
        {/* CTA */}
        <button
          onClick={handleAction}
          className="w-full bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-6 rounded-xl hover:shadow-2xl hover:shadow-[#8a4add]/30 transition-all duration-300 group-hover:scale-105"
        >
          {user ? '📅 Agendar Mentoria' : '🔐 Login para Agendar'}
        </button>
      </div>
    </div>
  );
};

const EventsView: React.FC = () => {
  const navigate = useNavigate();
  const { instructors, mentors, user } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'workshop' | 'mentoria' | 'hackathon' | 'palestra'>('all');
  const [selectedMentor, setSelectedMentor] = useState<User | null>(null);
  
  // Combinar instrutores e mentores
  const allMentors = [...instructors, ...mentors];

  // Eventos de exemplo
  const upcomingEvents = [
    {
      title: 'Workshop: Introdução ao React',
      date: '15 Dez 2024',
      time: '14:00',
      location: 'Online via Zoom',
      description: 'Aprenda os fundamentos do React com projetos práticos. Ideal para iniciantes que querem entrar no mundo do desenvolvimento front-end.',
      category: 'workshop' as const,
      spots: 25,
    },
    {
      title: 'Mentoria: Carreira em Tech',
      date: '18 Dez 2024',
      time: '19:00',
      location: 'Presencial - Sede FuturoOn',
      description: 'Sessão de mentoria com profissionais experientes sobre como construir uma carreira sólida em tecnologia.',
      category: 'mentoria' as const,
      spots: 15,
    },
    {
      title: 'Hackathon: Soluções Sociais',
      date: '20-22 Dez 2024',
      time: '09:00',
      location: 'Híbrido',
      description: '48 horas de imersão criando soluções tecnológicas para problemas sociais reais. Prêmios para os melhores projetos!',
      category: 'hackathon' as const,
      spots: 50,
    },
    {
      title: 'Palestra: IA e o Futuro do Trabalho',
      date: '28 Dez 2024',
      time: '18:00',
      location: 'Online via YouTube',
      description: 'Discussão sobre como a Inteligência Artificial está transformando o mercado de trabalho e como se preparar.',
      category: 'palestra' as const,
      spots: 100,
    },
  ];

  const filteredEvents = filter === 'all' 
    ? upcomingEvents 
    : upcomingEvents.filter(e => e.category === filter);

  return (
    <div className="bg-[#09090B] min-h-screen">
      <SEO 
        title="Mentorias & Eventos | Instituto FuturoOn"
        description="Participe de workshops, mentorias, hackathons e palestras. Aprenda com profissionais experientes e conecte-se com a comunidade tech."
      />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#8a4add]/10 rounded-[100%] blur-[120px] -z-10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-30 -z-10"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Badge text="Aprenda & Conecte-se" />
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6 max-w-5xl mx-auto">
            Mentorias & <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] via-[#c4b5fd] to-[#f27983]">Eventos</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
            Participe de workshops práticos, mentorias personalizadas, hackathons desafiadores e palestras inspiradoras. 
            Aprenda com quem já está no mercado e acelere sua carreira em tech.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => document.getElementById('mentors')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#8a4add]/30 hover:-translate-y-1 transition-all duration-300"
            >
              🎯 Agendar Mentoria
            </button>
            <button 
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              📅 Ver Eventos
            </button>
          </div>
        </div>
      </section>

      {/* Seção de Mentores - NOVO! */}
      <section id="mentors" className="py-24 bg-black/20 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/20 border border-[#8a4add]/30 rounded-full mb-6">
              <span className="text-sm font-bold text-[#c4b5fd]">Mentorias 1:1</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              Aprenda com Quem Já Está no Mercado
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Agende sessões individuais com nossos mentores e instrutores. Tire dúvidas, receba feedback e acelere sua carreira.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
          </div>
          
          {allMentors.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {allMentors.slice(0, 6).map((mentor) => (
                  <MentorCard 
                    key={mentor.id} 
                    mentor={mentor}
                    onSchedule={setSelectedMentor}
                  />
                ))}
              </div>
              
              {allMentors.length > 6 && (
                <div className="text-center mt-12">
                  <button 
                    onClick={() => navigate('/connect')}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
                  >
                    Ver Todos os Mentores ({allMentors.length})
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400 py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <p className="text-lg">Em breve, novos mentores disponíveis!</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefícios de Mentoria */}
      <section id="mentorship" className="py-24 bg-gradient-to-b from-black/40 via-black/20 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#8a4add]/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#f27983]/10 rounded-full blur-[120px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Por que Participar?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Nossos eventos e mentorias são desenhados para acelerar seu crescimento profissional
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <MentorshipBenefitCard
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              }
              title="Networking Real"
              description="Conecte-se com profissionais da área, outros alunos e empresas parceiras. Construa sua rede de contatos."
            />
            <MentorshipBenefitCard
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              }
              title="Aprendizado Prático"
              description="Workshops hands-on com projetos reais. Aprenda fazendo, não apenas assistindo."
            />
            <MentorshipBenefitCard
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              }
              title="Aceleração de Carreira"
              description="Mentoria personalizada com profissionais experientes. Receba feedback e direcionamento."
            />
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section id="events" className="py-8 bg-black/20 border-y border-white/5 sticky top-0 z-30 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white shadow-lg shadow-[#8a4add]/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              Todos ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setFilter('workshop')}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                filter === 'workshop'
                  ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white shadow-lg shadow-[#8a4add]/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              🛠️ Workshops
            </button>
            <button
              onClick={() => setFilter('mentoria')}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                filter === 'mentoria'
                  ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white shadow-lg shadow-[#8a4add]/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              💡 Mentorias
            </button>
            <button
              onClick={() => setFilter('hackathon')}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                filter === 'hackathon'
                  ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white shadow-lg shadow-[#8a4add]/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              🏆 Hackathons
            </button>
            <button
              onClick={() => setFilter('palestra')}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                filter === 'palestra'
                  ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white shadow-lg shadow-[#8a4add]/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              🎤 Palestras
            </button>
          </div>
        </div>
      </section>

      {/* Grid de Eventos */}
      <section className="py-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Próximos Eventos
          </h2>
          <p className="text-gray-400">
            Inscreva-se agora e garanta sua vaga!
          </p>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <p className="text-lg">Nenhum evento encontrado nesta categoria.</p>
          </div>
        )}
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-b from-black/20 to-[#1a1033] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Não perca nenhum evento!
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Cadastre-se para receber notificações sobre novos workshops, mentorias e eventos exclusivos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="w-full sm:w-96 px-6 py-4 bg-[#18181B] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#8a4add] focus:outline-none"
              />
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#8a4add]/30 hover:-translate-y-1 transition-all duration-300 whitespace-nowrap">
                Quero Receber
              </button>
            </div>
          </div>
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
  );
};

export default EventsView;
