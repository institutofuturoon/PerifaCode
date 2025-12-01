import React, { useState } from 'react';
import { useAppContext } from '../App';

interface OnboardingTourProps {
    onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
    const { user } = useAppContext();
    const [step, setStep] = useState(1);

    const steps = [
        {
            title: `Seja bem-vindo(a), ${user?.name.split(' ')[0]}!`,
            description: "Vamos fazer um tour rápido pela plataforma para você conhecer as ferramentas que vão acelerar sua jornada na tecnologia.",
            icon: "👋"
        },
        {
            title: "Seu Painel de Controle",
            description: "Aqui em 'Meu Painel' é onde você acompanha seu progresso, cursos em andamento e certificados. É a sua central de comando!",
            icon: "📊"
        },
        {
            title: "Explore os Cursos",
            description: "Na seção 'Cursos', você encontra todas as trilhas de aprendizado disponíveis. Do frontend ao backend, sua próxima skill está aqui.",
            icon: "📚"
        },
        {
            title: "Mostre seu Corre na Comunidade",
            description: "A 'Comunidade' é o nosso showcase! Publique seus projetos, veja o que a galera está construindo e troque ideias.",
            icon: "🚀"
        },
        {
            title: "Conecte-se com Profissionais",
            description: "Em 'Conectar', você encontra a agenda de eventos ao vivo e pode agendar mentorias com profissionais experientes do mercado. Não perca!",
            icon: "🤝"
        },
        {
            title: "Pronto para Decolar!",
            description: "Agora você já conhece os principais cantos da casa. Explore, estude e lembre-se: foguete não tem ré. Bora pra cima!",
            icon: "🎉"
        }
    ];

    const currentStep = steps[step - 1];
    const totalSteps = steps.length;
    const progress = (step / totalSteps) * 100;

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div 
                className="bg-[#121212] rounded-2xl border border-[#8a4add]/30 w-full max-w-lg flex flex-col shadow-2xl shadow-[#8a4add]/20"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 text-center">
                    <div className="text-6xl mb-4">{currentStep.icon}</div>
                    <h2 className="text-2xl font-bold text-white">{currentStep.title}</h2>
                    <p className="mt-2 text-gray-300">{currentStep.description}</p>
                </div>
                
                <div className="p-6 border-t border-white/10 mt-auto">
                    <div className="w-full bg-black/30 rounded-full h-2 border border-white/10 mb-4">
                        <div
                            className="bg-gradient-to-r from-[#8a4add] to-[#f27983] h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <button type="button" onClick={prevStep} disabled={step === 1}
                            className="bg-white/10 text-white font-semibold py-2 px-6 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Anterior
                        </button>
                        
                        {step < totalSteps ? (
                            <button type="button" onClick={nextStep}
                                className="bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-all">
                                Próximo
                            </button>
                        ) : (
                            <button type="button" onClick={onComplete}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-all">
                                Começar a Explorar!
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingTour;
