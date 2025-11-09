import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';

interface InscriptionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseName?: string;
}

const InscriptionFormModal: React.FC<InscriptionFormModalProps> = ({ isOpen, onClose, courseName = "Letramento Digital" }) => {
    const { navigate } = useAppContext();
    const [formData, setFormData] = useState({
        nomeCompleto: '', email: '', telefone: '', dataNascimento: '', endereco: '',
        escolaridade: '', trabalhando: '', possuiComputador: '', comoConheceu: '',
        objetivo: '', cursoInteresse: [courseName] as string[], disponibilidade: [] as string[],
        autorizacaoImagem: false, termosPrivacidade: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked, name: checkboxName } = e.target as HTMLInputElement;
            const arrayFields = ['disponibilidade', 'cursoInteresse'];
            if (arrayFields.includes(checkboxName)) {
                setFormData(prev => ({
                    ...prev,
                    [checkboxName]: checked 
                        ? [...(prev[checkboxName as keyof typeof prev] as string[]), value]
                        : (prev[checkboxName as keyof typeof prev] as string[]).filter(item => item !== value)
                }));
            } else {
                setFormData(prev => ({ ...prev, [name]: checked }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log("Form data submitted:", formData);
        // TODO: Enviar dados para o backend da ONG.
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
        setTimeout(() => {
            onClose();
            setIsSubmitted(false);
            // Reset form for next time might be useful
        }, 3000);
    };

    if (!isOpen) return null;

    const inputClasses = "w-full p-3 bg-white/10 rounded-md border border-white/20 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm text-white placeholder:text-gray-400";
    const labelClasses = "block text-sm font-medium text-gray-200 mb-2";
    const radioCheckboxBase = "h-4 w-4 rounded-sm border-gray-400 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add] focus:ring-offset-gray-800";

    const escolaridadeOptions = ['Ensino Fundamental Incompleto', 'Ensino Fundamental Completo', 'Ensino Médio Incompleto', 'Ensino Médio Completo', 'Ensino Superior Incompleto', 'Ensino Superior Completo', 'Pós-Graduação Incompleta', 'Pós-Graduação Completa', 'Outro'];
    const comoConheceuOptions = ['Instagram', 'Facebook', 'LinkedIn', 'Indicação de amigos/familiares', 'Google', 'Outros'];
    const cursoOptions = ['Letramento Digital (Para todas as idades)', 'Letramento Digital (Melhor Idade)', 'Programação em Python', 'Programação C#', 'Desenvolvimento de Games', 'Inglês', 'Empreendedorismo Digital'];
    const disponibilidadeOptions = ['Manhã (09:00 às 12:00)', 'Tarde (13:00 às 17:00)', 'Noite (18:00 às 21:00)', 'Sábados', 'Online (Flexível)'];


    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[#121212] rounded-2xl border border-[#8a4add]/30 w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-[#8a4add]/20 relative" onClick={(e) => e.stopPropagation()}>
                <header className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#121212]/80 backdrop-blur-sm z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Formulário de Inscrição</h2>
                        <p className="text-gray-400">Curso de {courseName}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl">&times;</button>
                </header>
                
                <div className="p-6 md:p-8 flex-grow overflow-y-auto">
                    {isSubmitted ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <svg className="w-20 h-20 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <h3 className="text-3xl font-bold text-white mt-6">Inscrição enviada!</h3>
                            <p className="text-gray-300 mt-2 max-w-md">Obrigado pelo seu interesse! Entraremos em contato em breve para confirmar sua vaga e passar as próximas instruções.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div><label htmlFor="nomeCompleto" className={labelClasses}>Nome Completo *</label><input type="text" name="nomeCompleto" id="nomeCompleto" required className={inputClasses} onChange={handleChange} /></div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div><label htmlFor="email" className={labelClasses}>Email *</label><input type="email" name="email" id="email" required className={inputClasses} onChange={handleChange} /></div>
                                <div><label htmlFor="telefone" className={labelClasses}>Telefone (com DDD) *</label><input type="tel" name="telefone" id="telefone" required className={inputClasses} onChange={handleChange} /></div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div><label htmlFor="dataNascimento" className={labelClasses}>Data de Nascimento *</label><input type="date" name="dataNascimento" id="dataNascimento" required className={inputClasses} onChange={handleChange} style={{ colorScheme: 'dark' }}/></div>
                                <div><label htmlFor="escolaridade" className={labelClasses}>Escolaridade *</label><select name="escolaridade" id="escolaridade" required className={inputClasses} onChange={handleChange}><option value="">Selecione...</option>{escolaridadeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                            </div>
                            <div><label htmlFor="endereco" className={labelClasses}>Endereço Completo (com CEP) *</label><input type="text" name="endereco" id="endereco" required className={inputClasses} onChange={handleChange} /></div>
                            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                                <fieldset><legend className={labelClasses}>Trabalhando atualmente? *</legend><div className="flex gap-4 mt-2"><label className="flex items-center gap-2"><input type="radio" name="trabalhando" value="Sim" required onChange={handleChange} className={radioCheckboxBase}/> Sim</label><label className="flex items-center gap-2"><input type="radio" name="trabalhando" value="Não" required onChange={handleChange} className={radioCheckboxBase}/> Não</label></div></fieldset>
                                <fieldset><legend className={labelClasses}>Possui computador com internet? *</legend><div className="flex gap-4 mt-2"><label className="flex items-center gap-2"><input type="radio" name="possuiComputador" value="Sim" required onChange={handleChange} className={radioCheckboxBase}/> Sim</label><label className="flex items-center gap-2"><input type="radio" name="possuiComputador" value="Não" required onChange={handleChange} className={radioCheckboxBase}/> Não</label></div></fieldset>
                            </div>
                            <div><label htmlFor="comoConheceu" className={labelClasses}>Onde você nos conheceu?</label><select name="comoConheceu" id="comoConheceu" className={inputClasses} onChange={handleChange}><option value="">Selecione...</option>{comoConheceuOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                            <div><label htmlFor="objetivo" className={labelClasses}>Por que você quer fazer parte da FuturoOn? Qual o seu objetivo?</label><textarea name="objetivo" id="objetivo" rows={3} className={inputClasses} onChange={handleChange}></textarea></div>
                            <fieldset><legend className={labelClasses}>Qual curso você tem interesse? *</legend><div className="mt-2 space-y-2">{cursoOptions.map(opt => <label key={opt} className="flex items-center gap-2"><input type="checkbox" name="cursoInteresse" value={opt} checked={formData.cursoInteresse.includes(opt)} onChange={handleChange} className={radioCheckboxBase}/>{opt}</label>)}</div></fieldset>
                            <fieldset><legend className={labelClasses}>Qual a sua disponibilidade? *</legend><div className="grid sm:grid-cols-2 gap-2 mt-2">{disponibilidadeOptions.map(opt => <label key={opt} className="flex items-center gap-2"><input type="checkbox" name="disponibilidade" value={opt} onChange={handleChange} className={radioCheckboxBase}/>{opt}</label>)}</div></fieldset>
                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <label className="flex items-start gap-3 text-sm text-gray-300"><input type="checkbox" name="autorizacaoImagem" required onChange={handleChange} className={`${radioCheckboxBase} mt-1 flex-shrink-0`} /><span>AUTORIZAÇÃO DE USO DE IMAGEM: Autorizo o uso da minha imagem em todo e qualquer material entre fotos, vídeos e documentos, para ser utilizada nas campanhas de marketing e divulgação do Instituto FuturoONG, sejam essas destinadas à divulgação ao público em geral. *</span></label>
                                <label className="flex items-start gap-3 text-sm text-gray-300"><input type="checkbox" name="termosPrivacidade" required onChange={handleChange} className={`${radioCheckboxBase} mt-1 flex-shrink-0`} /><span>Li e concordo com os <button type="button" onClick={() => navigate('privacy')} className="text-[#8a4add] hover:underline">termos de privacidade de dados</button> da plataforma. *</span></label>
                            </div>
                            <div className="pt-4"><button type="submit" disabled={isSubmitting} className="w-full font-bold py-3 px-8 rounded-lg bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait">{isSubmitting ? 'Enviando...' : 'Enviar Inscrição'}</button></div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};


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
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className="aurora-background text-white">
            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-32 md:pt-40 md:pb-40 text-center relative z-10 bg-grid-pattern">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                            Conecte-se ao Mundo Digital,<br />
                            <span className="text-[#c4b5fd]">Sem Medo.</span>
                        </h1>
                        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                            Nosso curso de Letramento Digital foi criado especialmente para a melhor idade. Aprenda a usar o computador, celular e a internet com segurança e confiança, em um ambiente acolhedor e com instrutores pacientes.
                        </p>
                         <div className="mt-10">
                            <button onClick={() => setIsFormOpen(true)} className="inline-block bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30">
                                Quero me inscrever!
                            </button>
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
                           As vagas são limitadas para garantir a qualidade do ensino. Preencha o formulário e garanta seu interesse na próxima turma!
                        </p>
                        <div className="mt-8">
                             <button onClick={() => setIsFormOpen(true)} className="inline-block bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30">
                                Inscreva-se Agora
                            </button>
                        </div>
                    </div>
                </Section>
            </main>
            <InscriptionFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
        </div>
    );
};

export default DigitalLiteracyView;