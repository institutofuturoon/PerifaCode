import React from 'react';
import { useNavigate } from 'react-router-dom';

// Reusable components for this view
const Section: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <section className={`py-16 md:py-20 relative z-10 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode, subtitle?: string }> = ({ children, subtitle }) => (
    <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">{children}</h2>
        {subtitle && <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">{subtitle}</p>}
        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
    </div>
);

const StatCard: React.FC<{ value: string, label: string, color: string }> = ({ value, label, color }) => (
    <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center">
        <p className={`text-5xl font-black ${color}`}>{value}</p>
        <p className="mt-2 text-gray-300">{label}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string, name: string, course: string, avatar: string }> = ({ quote, name, course, avatar }) => (
    <div className="bg-white/5 p-8 rounded-lg border border-white/10 h-full flex flex-col">
        <p className="text-gray-300 italic flex-grow">"{quote}"</p>
        <div className="mt-6 flex items-center gap-4">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
            <div>
                <p className="font-bold text-white">{name}</p>
                <p className="text-sm text-[#8a4add]">{course}</p>
            </div>
        </div>
    </div>
);

const AnnualReportView: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Hero Section */}
            <header className="py-32 md:py-40 text-center relative z-10 bg-grid-pattern">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <p className="font-semibold text-[#c4b5fd] uppercase tracking-widest">FuturoOn</p>
                    <h1 className="mt-4 text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                        Relatório Anual 2024
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                        Um ano de coragem, comunidade e código. Veja como, juntos, estamos reescrevendo o futuro da tecnologia na periferia.
                    </p>
                </div>
            </header>

            {/* Letter from Coordination */}
            <Section className="bg-black/20">
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 items-center">
                    <div className="md:col-span-2">
                        <h2 className="text-3xl font-bold text-white mb-4">Carta da Coordenação</h2>
                        <div className="prose prose-invert text-gray-300 leading-relaxed space-y-4">
                            <p>
                                2024 foi um ano que testou nossos limites e reafirmou nosso propósito. Em meio a tantos desafios, a comunidade da FuturoOn provou que talento não tem CEP. Vimos sonhos se transformarem em linhas de código, e linhas de código se transformarem em oportunidades reais.
                            </p>
                            <p>
                                Este relatório é mais do que números; é um mosaico de histórias de superação, colaboração e sucesso. Cada aluno formado, cada voluntário dedicado e cada parceiro que acreditou em nós, foi uma peça fundamental nesta construção. Agradecemos por fazerem parte desta jornada. O futuro é agora, e ele está sendo construído aqui.
                            </p>
                            <p className="font-bold text-white">Marlon Souza</p>
                            <p className="text-sm text-gray-400 -mt-3">Coordenador Institucional, FuturoOn</p>
                        </div>
                    </div>
                     <div className="flex justify-center">
                        <img src="https://ui73bvafvl0llamc.public.blob.vercel-storage.com/avatars/h0VK5SzekwWfHJmkwMXNJJSleIE2-1762893257247-marlos-KMpj2WyEcBYPlaO335BA2RIj63Fx2g.png" alt="Marlon Souza" className="w-48 h-48 rounded-full object-cover border-4 border-[#8a4add]" />
                    </div>
                </div>
            </Section>

            {/* Impact in Numbers */}
            <Section className="bg-black/20">
                <SectionTitle subtitle="Nossos resultados refletem o poder da nossa comunidade e a dedicação de cada indivíduo envolvido.">
                    Nosso Impacto em Números
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard value="+100" label="Jovens e Adultos Impactados" color="text-sky-400" />
                    <StatCard value="95%" label="Taxa de Retenção" color="text-green-400" />
                    <StatCard value="+1.2k" label="Horas de Conteúdo" color="text-pink-400" />
                    <StatCard value="7" label="Parcerias Firmadas" color="text-amber-400" />
                </div>
            </Section>

            {/* Testimonials */}
            <Section className="bg-black/20">
                <SectionTitle subtitle="Nada fala mais alto do que as vozes da nossa comunidade.">
                    Histórias que Inspiram
                </SectionTitle>
                <div className="grid md:grid-cols-2 gap-8">
                    <TestimonialCard 
                        quote="A oportunidade de aprender de graça, e com qualidade coisas que eu teria que pagar muito dinheiro aqui fora. O ambiente amigável, as pessoas, os professores, a troca de informações, todos aprendendo juntos."
                        name="Elias Daniel"
                        course="Aluno Programação"
                        avatar="https://ui73bvafvl0llamc.public.blob.vercel-storage.com/avatars/avatar-elias-daniel-S49E7iPjC2jTqZ6jOZyY9lS8Ld9C3P.jpg"
                    />
                     <TestimonialCard 
                        quote="Com incentivo da minha filha pra entrar no Futuroon, tô conseguindo ter noção de informática. Futuroon me mostrou que nunca é tarde pra aprender!"
                        name="Kelly Maciel"
                        course="Aluna de Letramento Digital"
                        avatar="https://randomuser.me/api/portraits/women/49.jpg"
                    />
                </div>
            </Section>

            {/* Call to Action */}
            <Section className="bg-black/20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">Faça Parte do Próximo Capítulo</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
                       Sua doação ou parceria nos ajuda a escrever mais histórias de sucesso como estas.
                    </p>
                    <div className="mt-8">
                        <button onClick={() => navigate('/donate')} className="bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300">
                            Apoie nossa Missão
                        </button>
                    </div>
                </div>
            </Section>
        </>
    );
};

// FIX: Added default export to resolve import error in App.tsx.
export default AnnualReportView;