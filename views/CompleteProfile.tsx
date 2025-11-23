import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContextAdapter';
import { User } from '../types';

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-black/30 rounded-full h-2.5 border border-white/10 my-4">
        <div
            className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
        ></div>
    </div>
);


const Step1: React.FC<{ formData: Partial<User>, handleChange: (e: any) => void, inputClasses: string, labelClasses: string }> = ({ formData, handleChange, inputClasses, labelClasses }) => (
    <div className="space-y-4 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label htmlFor="dateOfBirth" className={labelClasses}>Data de Nascimento*</label><input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} required className={inputClasses} style={{ colorScheme: 'dark' }} /></div>
            <div><label htmlFor="cpf" className={labelClasses}>CPF (somente números)</label><input type="text" pattern="[0-9]*" inputMode="numeric" name="cpf" id="cpf" value={formData.cpf || ''} onChange={handleChange} className={inputClasses} /></div>
        </div>
        <div><label htmlFor="rg" className={labelClasses}>RG (somente números)</label><input type="text" pattern="[0-9]*" inputMode="numeric" name="rg" id="rg" value={formData.rg || ''} onChange={handleChange} className={inputClasses} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="gender" className={labelClasses}>Gênero</label>
                <select name="gender" id="gender" value={formData.gender || ''} onChange={handleChange} className={inputClasses}>
                    <option value="">Selecione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Não-binário">Não-binário</option>
                    <option value="Outro">Outro</option>
                </select>
            </div>
            <div>
                <label htmlFor="race" className={labelClasses}>Raça/Cor</label>
                <select name="race" id="race" value={formData.race || ''} onChange={handleChange} className={inputClasses}>
                    <option value="">Selecione...</option>
                    <option value="Preto">Preto</option>
                    <option value="Pardo">Pardo</option>
                    <option value="Indígena">Indígena</option>
                    <option value="Branco">Branco</option>
                    <option value="Amarelo">Amarelo</option>
                </select>
            </div>
        </div>
    </div>
);

const Step2: React.FC<{ formData: Partial<User>, handleChange: (e: any) => void, handleCepBlur: (e: any) => void, cepLoading: boolean, inputClasses: string, labelClasses: string }> = ({ formData, handleChange, handleCepBlur, cepLoading, inputClasses, labelClasses }) => (
     <div className="space-y-4 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="cep" className={labelClasses}>CEP</label>
                <div className="relative">
                    <input type="text" pattern="[0-9]*" inputMode="numeric" name="cep" id="cep" value={formData.cep || ''} onChange={handleChange} onBlur={handleCepBlur} className={inputClasses} />
                    {cepLoading && (<div className="absolute inset-y-0 right-0 flex items-center pr-3"><svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>)}
                </div>
            </div>
            <div><label htmlFor="city" className={labelClasses}>Cidade*</label><input type="text" name="city" id="city" value={formData.city || ''} onChange={handleChange} required className={inputClasses} /></div>
            <div><label htmlFor="neighborhood" className={labelClasses}>Bairro*</label><input type="text" name="neighborhood" id="neighborhood" value={formData.neighborhood || ''} onChange={handleChange} required className={inputClasses} /></div>
            <div><label htmlFor="address" className={labelClasses}>Endereço (Rua, Nº)</label><input type="text" name="address" id="address" value={formData.address || ''} onChange={handleChange} className={inputClasses} /></div>
            <div className="sm:col-span-2"><label htmlFor="phoneNumber" className={labelClasses}>Seu Celular (WhatsApp)*</label><input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} required className={inputClasses} /></div>
            <div className="sm:col-span-2"><label htmlFor="emergencyPhoneNumber" className={labelClasses}>Telefone para Emergências*</label><input type="tel" name="emergencyPhoneNumber" id="emergencyPhoneNumber" value={formData.emergencyPhoneNumber || ''} onChange={handleChange} required className={inputClasses} /></div>
        </div>
    </div>
);

const Step3: React.FC<{ formData: Partial<User>, handleChange: (e: any) => void, inputClasses: string, labelClasses: string }> = ({ formData, handleChange, inputClasses, labelClasses }) => {
    const educationLevels: User['educationLevel'][] = ['Ensino Fundamental', 'Ensino Médio Incompleto', 'Ensino Médio Completo', 'Ensino Superior Incompleto', 'Ensino Superior Completo', 'Outro'];
    
    return (
        <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="familyIncome" className={labelClasses}>Renda Familiar Mensal</label>
                    <select name="familyIncome" id="familyIncome" value={formData.familyIncome || ''} onChange={handleChange} className={inputClasses}>
                        <option value="">Selecione...</option>
                        <option value="Até 1 salário mínimo">Até 1 salário mínimo</option>
                        <option value="Entre 1 e 2 salários mínimos">Entre 1 e 2 salários mínimos</option>
                        <option value="Entre 2 e 4 salários mínimos">Entre 2 e 4 salários mínimos</option>
                        <option value="Acima de 4 salários mínimos">Acima de 4 salários mínimos</option>
                    </select>
                </div>
                <div><label htmlFor="residentsInHome" className={labelClasses}>Pessoas na residência*</label><input type="number" name="residentsInHome" id="residentsInHome" value={formData.residentsInHome || ''} onChange={handleChange} required className={inputClasses} /></div>
            </div>
            <div>
                <label htmlFor="educationLevel" className={labelClasses}>Nível de Escolaridade</label>
                <select id="educationLevel" name="educationLevel" value={formData.educationLevel || ''} onChange={handleChange} className={inputClasses}>
                    <option value="">Não informado</option>
                    {educationLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="motivation" className={labelClasses}>Qual seu maior objetivo ao aprender tecnologia?</label>
                <textarea name="motivation" id="motivation" rows={4} className={inputClasses} onChange={handleChange} value={formData.motivation || ''} placeholder="Ex: Conseguir meu primeiro emprego, criar um app para minha comunidade, mudar de carreira..."></textarea>
            </div>
        </div>
    );
};


const CompleteProfile: React.FC = () => {
  const { user, handleUpdateUserProfile, showToast } = useAppContext();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<User>>({ ...user });
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  if (!user) return null;

  const stepsConfig = [
    { title: "Identificação" },
    { title: "Contato e Endereço" },
    { title: "Contexto e Objetivos" },
  ];
  const totalSteps = stepsConfig.length;
  const progress = (step / totalSteps) * 100;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Simplified handler
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        showToast('CEP não encontrado.');
        setFormData(prev => ({ ...prev, city: '', neighborhood: '', address: '' }));
      } else {
        setFormData(prev => ({ ...prev, city: data.localidade, neighborhood: data.bairro, address: data.logouro }));
        showToast('Endereço preenchido!');
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      showToast('Erro ao buscar o CEP. Tente novamente.');
    } finally {
      setCepLoading(false);
    }
  };


  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const finalData = { ...user, ...formData, profileStatus: 'complete' as const };
    await handleUpdateUserProfile(finalData);
    showToast('✅ Perfil completo! Bem-vindo(a) à FuturoOn.');
    setLoading(false);
    // The App component will handle navigation away from this view
  };

  const renderStepContent = () => {
    const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 placeholder-gray-500 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm";
    const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

    switch(step) {
        case 1: return <Step1 formData={formData} handleChange={handleChange} inputClasses={inputClasses} labelClasses={labelClasses} />;
        case 2: return <Step2 formData={formData} handleChange={handleChange} handleCepBlur={handleCepBlur} cepLoading={cepLoading} inputClasses={inputClasses} labelClasses={labelClasses} />;
        case 3: return <Step3 formData={formData} handleChange={handleChange} inputClasses={inputClasses} labelClasses={labelClasses} />;
        default: return null;
    }
  }


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8 aurora-background">
      <div className="w-full max-w-2xl space-y-8 bg-black/20 backdrop-blur-xl p-6 sm:p-10 rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Quase lá! Vamos completar seu perfil.</h2>
          <p className="mt-2 text-sm text-gray-400">
            Esses dados são confidenciais e nos ajudam a criar oportunidades reais para nossos alunos.
          </p>
        </div>
        
        <div>
            <ProgressBar progress={progress} />
            <div className="flex justify-between text-xs text-gray-400 font-semibold">
                <span>Passo {step} de {totalSteps}</span>
                <span>{stepsConfig[step - 1].title}</span>
            </div>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="min-h-[360px] sm:min-h-[300px]">
                {renderStepContent()}
            </div>
            
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
                <button type="button" onClick={prevStep} disabled={step === 1}
                  className="bg-white/10 text-white font-semibold py-2 px-6 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Voltar
                </button>
                {step < totalSteps ? (
                  <button type="button" onClick={nextStep}
                    className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-all">
                    Avançar
                  </button>
                ) : (
                  <button type="submit" disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-wait">
                    {loading ? 'Finalizando...' : 'Finalizar Cadastro'}
                  </button>
                )}
            </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
