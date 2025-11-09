import React from 'react';
import { useAppContext } from '../App';

// Reusable components for this view
const Section: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <section className={`py-16 md:py-20 ${className}`}>
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
    const { navigate } = useAppContext();

    return (
        <div className="aurora-background text-white">
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
                        <img src="https://media.licdn.com/dms/image/v2/D4D03AQE6gV_60L_8yw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1687550882103?e=1764201600&v=beta&t=Ue89n6p4Q7b8QZz4Y9eX_W2wF_vC_jYc_Z_qX_y_3s" alt="Marlon Souza" className="w-48 h-48 rounded-full object-cover border-4 border-[#8a4add]" />
                    </div>
                </div>
            </Section>

            {/* Impact in Numbers */}
            <Section>
                <SectionTitle subtitle="Nossos resultados refletem o poder da nossa comunidade e a dedicação de cada indivíduo envolvido.">
                    Nosso Impacto em Números
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard value="+100" label="Alunos Formados" color="text-[#c4b5fd]" />
                    <StatCard value="14" label="Voluntários Ativos" color="text-sky-400" />
                    <StatCard value="+2.500" label="Horas de Ensino" color="text-pink-400" />
                    <StatCard value="85%" label="Taxa de Conclusão" color="text-green-400" />
                </div>
            </Section>
            
            {/* Financial Transparency */}
            <Section className="bg-black/20">
                <SectionTitle subtitle="Acreditamos que a confiança se constrói com clareza. Veja como cada contribuição foi investida.">
                    Transparência Financeira
                </SectionTitle>
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    <div className="bg-white/5 p-8 rounded-lg border border-white/10">
                        <h3 className="text-2xl font-bold text-green-400 mb-4">Receitas Totais: R$ 50.000</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li><span className="font-semibold">Doações Individuais:</span> R$ 20.000</li>
                            <li><span className="font-semibold">Parcerias Corporativas:</span> R$ 25.000</li>
                            <li><span className="font-semibold">Editais e Prêmios:</span> R$ 5.000</li>
                        </ul>
                    </div>
                    <div className="bg-white/5 p-8 rounded-lg border border-white/10">
                        <h3 className="text-2xl font-bold text-red-400 mb-4">Despesas Totais: R$ 48.500</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li><span className="font-semibold">Infraestrutura e Bolsas:</span> R$ 25.000</li>
                            <li><span className="font-semibold">Recursos Humanos:</span> R$ 15.000</li>
                            <li><span className="font-semibold">Marketing e Eventos:</span> R$ 5.000</li>
                            <li><span className="font-semibold">Custos Administrativos:</span> R$ 3.500</li>
                        </ul>
                    </div>
                </div>
                 <p className="text-center mt-8 text-gray-400">Todo o superávit é reinvestido diretamente em nossos programas educacionais para o próximo ciclo.</p>
            </Section>
            
            {/* Student Stories */}
            <Section>
                <SectionTitle subtitle="Os números contam uma parte da história. Nossos alunos contam o resto.">
                    Vozes da Quebrada
                </SectionTitle>
                <div className="grid md:grid-cols-2 gap-8">
                    <TestimonialCard
                        quote="A FuturoOn não me deu só um curso, me deu uma direção. Aprendi a programar, consegui meu primeiro estágio e hoje consigo ajudar minha família. Mudou o jogo pra mim."
                        name="Jessica Silva"
                        course="Formada em Frontend"
                        avatar="https://picsum.photos/seed/jessica/200"
                    />
                    <TestimonialCard
                        quote="Eu achava que programação não era pra mim. A comunidade me acolheu, os mentores tiveram paciência e hoje eu tô construindo minhas próprias APIs. Foguete não tem ré!"
                        name="Carlos Souza"
                        course="Aluno de Backend"
                        avatar="https://picsum.photos/seed/carlos/200"
                    />
                </div>
            </Section>
            
             {/* Call to Action */}
            <Section className="bg-black/20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">O Futuro Continua</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
                        Em 2025, queremos dobrar nosso impacto. Com sua ajuda, podemos capacitar ainda mais talentos e transformar mais vidas. Faça parte desta história.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={() => navigate('donate')} className="w-full sm:w-auto bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300">
                            Faça uma Doação
                        </button>
                        <button onClick={() => navigate('partnerships')} className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-300">
                            Seja um Parceiro
                        </button>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default AnnualReportView;
