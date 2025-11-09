import React from 'react';
import { useAppContext } from '../App';

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

const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center transform transition-transform duration-300 hover:-translate-y-2 h-full flex flex-col items-center">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#05aff2] to-[#8a4add] text-white mb-6 shadow-lg shadow-[#8a4add]/20">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-400 flex-grow">{description}</p>
    </div>
);

const CurriculumItem: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <div>
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    </div>
);


const DigitalLiteracyView: React.FC = () => {
    const { navigate } = useAppContext();
    const whatsappLink = "https://api.whatsapp.com/send?phone=5521970672194&text=Ol%C3%A1!%20Gostaria%20de%20me%20inscrever%20no%20curso%20de%20Letramento%20Digital.";

    return (
        <div className="aurora-background text-white">
            <main>
                {/* Hero Section */}
                <section className="py-32 md:py-40 text-center relative z-10 bg-grid-pattern">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                            Conecte-se ao Mundo Digital,<br />
                            <span className="text-[#c4b5fd]">Sem Medo.</span>
                        </h1>
                        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                            Nosso curso de Letramento Digital foi criado especialmente para a melhor idade. Aprenda a usar o computador, celular e a internet com segurança e confiança, em um ambiente acolhedor e com instrutores pacientes.
                        </p>
                         <div className="mt-10">
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30">
                                Quero me inscrever!
                            </a>
                        </div>
                    </div>
                </section>
                
                {/* Benefits Section */}
                <Section className="bg-black/20">
                    <SectionTitle subtitle="Descubra como a tecnologia pode facilitar seu dia a dia e te aproximar de quem você ama.">
                        Uma Nova Janela Para o Seu Mundo
                    </SectionTitle>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <BenefitCard icon="😊" title="Perca o Medo" description="Esqueça a complicação. Nossos instrutores mostram que a tecnologia pode ser sua grande aliada, com muita paciência e didática." />
                        <BenefitCard icon="👨‍👩‍👧‍👦" title="Fale com quem Ama" description="Aprenda a usar o WhatsApp e as redes sociais para fazer chamadas de vídeo e estar sempre perto da família e dos amigos." />
                        <BenefitCard icon="✅" title="Sua Independência" description="Resolva coisas do dia a dia, como marcar consultas ou usar apps de banco e transporte, com total autonomia." />
                        <BenefitCard icon="🛡️" title="Navegue com Segurança" description="Entenda como identificar golpes, criar senhas fortes e proteger suas informações pessoais no mundo online." />
                    </div>
                </Section>
                
                {/* Curriculum Section */}
                <Section>
                     <SectionTitle subtitle="Um passo a passo completo para você dominar as ferramentas digitais mais importantes do dia a dia.">
                        O que você vai aprender na prática
                    </SectionTitle>
                    <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-8">
                            <CurriculumItem title="Usando o Computador e Celular" description="Desde o básico: ligar, usar o mouse, teclado, abrir programas e organizar arquivos e fotos." />
                            <CurriculumItem title="Navegando na Internet" description="Aprenda a pesquisar no Google, acessar sites de notícias, vídeos e muito mais." />
                            <CurriculumItem title="Comunicação por E-mail" description="Crie seu e-mail, envie e receba mensagens, e aprenda a lidar com anexos com segurança." />
                            <CurriculumItem title="Redes Sociais Essenciais" description="Conecte-se com amigos e família através do WhatsApp e Facebook de forma prática." />
                            <CurriculumItem title="Segurança Digital Primeiro" description="Proteja-se de vírus e golpes online. Aprenda a criar senhas seguras e a navegar com tranquilidade." />
                            <CurriculumItem title="Aplicativos Úteis" description="Descubra como usar aplicativos de transporte, banco e outros serviços para facilitar sua rotina." />
                        </div>
                    </div>
                </Section>

                {/* Methodology Section */}
                 <Section className="bg-black/20">
                    <SectionTitle subtitle="Nosso método foi pensado para oferecer um ambiente de aprendizado seguro, confortável e eficaz.">
                        Como Nossas Aulas Funcionam
                    </SectionTitle>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <BenefitCard icon="📍" title="Aulas Presenciais" description="Ambiente tranquilo e preparado para o seu aprendizado em nosso espaço no Complexo da Coruja." />
                        <BenefitCard icon="👩‍🏫" title="Instrutores Pacientes" description="Nossa equipe tem experiência e didática para ensinar no seu ritmo, sem pressa." />
                        <BenefitCard icon="👥" title="Turmas Reduzidas" description="Garantimos atenção individualizada para que nenhuma dúvida fique para trás." />
                        <BenefitCard icon="📖" title="Material de Apoio" description="Apostilas simples e ilustradas para acompanhar as aulas e praticar em casa." />
                    </div>
                </Section>

                {/* Final CTA */}
                <Section>
                    <div className="text-center bg-grid-pattern p-8 md:p-16 rounded-2xl border border-[#8a4add]/20" style={{backgroundImage: 'radial-gradient(circle at center, #8a4add10, transparent 60%)'}}>
                        <h2 className="text-3xl md:text-4xl font-black text-white">Pronto para Começar essa Jornada?</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
                           As vagas são limitadas para garantir a qualidade do ensino. Fale conosco agora mesmo no WhatsApp e garanta a sua!
                        </p>
                        <div className="mt-8">
                             <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30">
                                Falar com a Coordenação
                            </a>
                        </div>
                    </div>
                </Section>

            </main>
        </div>
    );
};

export default DigitalLiteracyView;