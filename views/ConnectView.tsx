import React from 'react';
import { useAppContext } from '../App';
import { User } from '../types';

// MOCKED DATA to match the user's screenshot
const MOCKED_MENTORS: User[] = [
    {
        id: 'inst1',
        name: 'Luiz Guilherme Bandeira',
        email: 'luiz.bandeira@email.com',
        // This stylized avatar URL is created to match the screenshot, as the original is a standard photo.
        avatarUrl: 'https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/volunteers/guilherme.png',
        bio: 'Cursando pós-graduação em Inteligência Artificial pela UFV. Acredito no poder do código para resolver problemas complexos e construir aplicações escaláveis.',
        role: 'instructor',
        title: 'Desenvolvedor Backend & Entusiasta em IA',
        isMentor: true,
        completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: ''
    },
    {
        id: 'inst2',
        name: 'Vitor Santos',
        email: 'vitor.santos@email.com',
        avatarUrl: 'https://media.licdn.com/dms/image/v2/D5603AQHQYTpCPcROvA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1725502652689?e=1764201600&v=beta&t=faPDzVvjRTzGbRvr1FmiZ7Ow_AI6vs4IIXAOXSO1GXs',
        bio: 'Software Developer com expertise em JavaScript, Python e C#. Acredito na construção de soluções inovadoras com código limpo e eficiente.',
        role: 'instructor',
        title: 'Software Developer',
        isMentor: true,
        completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: ''
    },
    {
        id: 'inst3',
        name: 'Thaís Santana',
        email: 'thais.santana@email.com',
        avatarUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQERbQ7RnKzlEA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1691721804193?e=1764201600&v=beta&t=c2HPPb24zMUizWLVlXTFDhk3534DX3BLPhTFBBH4Sig',
        bio: 'Coordenadora de Medição de Energia e Empreendedora Social, com expertise em transformar dados de energia em insights valiosos e impacto social.',
        role: 'instructor',
        title: 'Coordenadora de Medição de Energia | Empreendedora Social',
        isMentor: true,
        completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: ''
    }
];


const MentorCard: React.FC<{ mentor: User }> = ({ mentor }) => {
    const { user, navigate } = useAppContext();
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
                onClick={() => user ? alert(`Funcionalidade de agendamento com ${mentor.name} em breve!`) : navigate('login')}
                className="mt-6 w-full bg-gray-700/50 text-gray-300 font-semibold py-3 px-4 rounded-lg hover:bg-gray-600/60 hover:text-white transition-colors"
            >
                {user ? 'Ver agenda' : 'Faça login para ver a agenda'}
            </button>
        </div>
    );
};


const EventCard: React.FC<{ event: any, host?: User }> = ({ event, host }) => {
    return (
        <div className="bg-[#18181B] border border-gray-800 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 text-center w-24">
                <p className="text-5xl font-black text-white leading-none">{event.date.split(' ')[1]}</p>
                <p className="text-lg text-purple-400 font-bold">{event.date.split(' ')[0]}</p>
                <p className="text-sm text-gray-400 mt-1">{event.time}</p>
            </div>
            <div className="h-full w-px bg-gray-700 hidden sm:block"></div>
            <div className="flex-1 text-center sm:text-left">
                <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">{event.eventType}</span>
                <h3 className="text-xl font-bold text-white mt-1">{event.title}</h3>
                <p className="text-md text-gray-400 font-semibold">com {host?.name || 'FuturoOn'}</p>
                <p className="mt-2 text-gray-300 text-sm hidden md:block">{event.description}</p>
            </div>
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
                <button className="w-full sm:w-auto bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/20 transform hover:scale-105">
                    Reservar Vaga
                </button>
            </div>
        </div>
    )
}

const ConnectView: React.FC = () => {
    const { events, instructors } = useAppContext();

    return (
        <div className="bg-[#09090B] min-h-screen">
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
                        {MOCKED_MENTORS.map(mentor => (
                            <MentorCard key={mentor.id} mentor={mentor} />
                        ))}
                    </div>
                </section>

                {/* Eventos Section */}
                <section className="mt-20 md:mt-24">
                    <h2 className="text-3xl font-bold text-white mb-8">Agenda de Eventos Ao Vivo</h2>
                    <div className="space-y-6">
                        {events.map(event => {
                            const host = instructors.find(i => i.id === event.hostId);
                            return <EventCard key={event.id} event={event} host={host} />
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ConnectView;