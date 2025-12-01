import React from 'react';

const timelineData = [
    { year: '2021', title: 'Fundação', description: 'Nasce a FuturoOn no Complexo da Coruja, com a missão de conectar a periferia à tecnologia.' },
    { year: '2022', title: 'Primeiras Turmas', description: 'Início das turmas de programação e robótica, transformando sonhos em código.' },
    { year: '2023', title: '1ª Game Jam', description: 'Realização da primeira Game Jam de São Gonçalo, impulsionando o desenvolvimento de jogos.' },
    { year: '2024', title: 'Reconhecimento', description: 'Menção honrosa na Câmara de Niterói e expansão para design, comunicação e empreendedorismo.' },
];

const TimelineCard: React.FC<{ year: string, title: string, description: string }> = ({ year, title, description }) => (
    <div className="relative p-6 bg-white/5 border border-white/10 rounded-lg h-full">
        <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-gradient-to-br from-[#8a4add] to-[#f27983] text-white flex items-center justify-center font-bold text-sm shadow-lg">
            {year.slice(-2)}
        </div>
        <h3 className="font-bold text-white mt-2">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
);

const SimplifiedTimeline: React.FC = () => {
  return (
    <div className="mt-16 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {timelineData.map((item, index) => (
          <TimelineCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default SimplifiedTimeline;
