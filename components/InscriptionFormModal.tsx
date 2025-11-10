import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';

interface InscriptionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseName?: string;
}

const InscriptionFormModal: React.FC<InscriptionFormModalProps> = ({ isOpen, onClose, courseName = "Inscrição Geral" }) => {
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
            setIsSubmitted(false); // Reset submission state when opened
            setFormData(prev => ({ ...prev, cursoInteresse: [courseName] })); // Ensure course name is updated
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen, courseName]);

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

export default InscriptionFormModal;