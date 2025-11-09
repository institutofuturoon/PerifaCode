import React from 'react';
import { useAppContext } from '../App';

const ImpactCard: React.FC<{ amount: string, description: string }> = ({ amount, description }) => (
    <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center transform transition-transform hover:-translate-y-1">
        <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">R$ {amount}</p>
        <p className="mt-2 text-gray-300">{description}</p>
    </div>
);

const DonateView: React.FC = () => {
    const { navigate } = useAppContext();
    const pixKey = "50.880.593/0001-14"; // CNPJ

    const copyToClipboard = () => {
        navigator.clipboard.writeText(pixKey);
        alert('Chave PIX copiada para a área de transferência!');
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <header className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                    Faça parte da <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">Revolução</span>
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                    Sua doação impulsiona o futuro de jovens da periferia, oferecendo educação gratuita e de qualidade em tecnologia. Juntos, transformamos potencial em profissão.
                </p>
            </header>

            <section className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white text-center mb-8">💛 Cada contribuição abre caminho para o futuro:</h2>
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <ImpactCard amount="50" description="Garante o lanche de um aluno durante uma semana de aulas intensivas — essencial para manter a energia e o foco nos estudos." />
                    <ImpactCard amount="180" description="Cobre o transporte de um aluno durante todo o curso, permitindo que ele vá e volte das aulas duas vezes por semana com segurança e regularidade." />
                    <ImpactCard amount="300" description="Mantém a conexão de uma família com a educação, custeando a internet necessária para que o aluno acompanhe as aulas remotas e continue aprendendo de casa." />
                </div>

                <div className="bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10">
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div>
                            <h3 className="text-3xl font-bold text-white">Doe via PIX</h3>
                            <p className="mt-2 text-gray-400">A forma mais rápida e direta de apoiar nossa causa. Use o QR Code ou a chave abaixo.</p>
                            
                            <div className="mt-6 bg-white/10 p-4 rounded-lg">
                                <p className="text-sm text-gray-300">Chave PIX (CNPJ)</p>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="font-mono text-lg text-white break-all">{pixKey}</p>
                                    <button onClick={copyToClipboard} title="Copiar chave" className="ml-4 p-2 rounded-md hover:bg-white/20 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-12">
                                <h4 className="text-2xl font-bold text-white">Outras formas de doar</h4>
                                <p className="text-sm text-gray-400 mt-2">Para transferências bancárias (TED/DOC), você pode usar a chave PIX (CNPJ) em seu banco de preferência.</p>
                                 <div className="text-sm text-gray-300 mt-4 space-y-1 bg-white/10 p-4 rounded-lg">
                                    <p><strong>Banco Destino:</strong> 237 - Bradesco S.A.</p>
                                    <p><strong>Favorecido:</strong> INSTITUTO FUTURO ON</p>
                                    <p><strong>Chave PIX (CNPJ):</strong> {pixKey}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                             <div className="relative w-full max-w-[250px] aspect-square">
                                <img 
                                    src="https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/qrcode.jpg"
                                    alt="QR Code PIX para doação" 
                                    className="rounded-lg border-4 border-white w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <p className="mt-8 text-center text-sm text-yellow-400 font-semibold">
                        Atenção: Verifique com cuidado todos os dados bancários antes de confirmar o DOC/TED.
                    </p>
                </div>

                <div className="mt-12 text-center text-sm text-gray-500 space-y-1">
                    <p>
                        O Instituto FuturoOn é uma organização sem fins lucrativos e garantimos que 100% de sua doação seja investida diretamente em nossa missão de transformar vidas através da tecnologia.
                    </p>
                    <p>
                        Para mais informações ou em caso de dúvidas, entre em contato: <a href="mailto:doacoes@institutofuturoon.org" className="text-[#8a4add] hover:underline">doacoes@institutofuturoon.org</a>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default DonateView;