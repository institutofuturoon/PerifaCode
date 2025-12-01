
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Badge from '../components/Badge';

const ImpactCard: React.FC<{ 
    amount: string; 
    title: string;
    description: string;
    icon: React.ReactNode;
    isPopular?: boolean;
}> = ({ amount, title, description, icon, isPopular }) => (
    <div className={`relative bg-gradient-to-br from-white/5 to-white/[0.02] p-8 rounded-2xl border transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group ${
        isPopular 
            ? 'border-[#8a4add] shadow-[0_0_40px_-10px_rgba(138,74,221,0.3)]' 
            : 'border-white/10 hover:border-[#8a4add]/40 hover:shadow-[#8a4add]/20'
    }`}>
        {isPopular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg">
                Mais Escolhido
            </div>
        )}
        
        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#8a4add]/10 via-transparent to-[#f27983]/10 blur-xl rounded-2xl"></div>
        
        {/* Icon */}
        <div className="relative z-10 flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8a4add] to-[#f27983] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#8a4add]/30 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
        </div>
        
        {/* Amount */}
        <div className="relative z-10 text-center mb-4">
            <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983] mb-2">
                R$ {amount}
            </p>
            <p className="text-lg font-bold text-white">{title}</p>
        </div>
        
        {/* Description */}
        <p className="relative z-10 text-sm text-gray-400 text-center leading-relaxed mb-6">
            {description}
        </p>
        
        {/* CTA Button */}
        <button 
            onClick={() => {
                // Scroll to PIX section
                document.querySelector('.pix-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`relative z-10 w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                isPopular
                    ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white hover:shadow-lg hover:shadow-[#8a4add]/40'
                    : 'bg-white/10 text-white hover:bg-white/20'
            }`}
        >
            Doar R$ {amount}
        </button>
    </div>
);

const DonateView: React.FC = () => {
    const navigate = useNavigate();
    const pixKey = "51.662.000/0001-98"; // CNPJ

    const copyToClipboard = () => {
        navigator.clipboard.writeText(pixKey);
        alert('Chave PIX copiada para a área de transferência!');
    };

    return (
        <div className="bg-[#09090B] min-h-screen">
            <SEO 
                title="Faça uma Doação | Instituto FuturoOn"
                description="Sua doação transforma vidas. Apoie a educação tecnológica gratuita para jovens da periferia em São Gonçalo. Doe via PIX."
                keywords={['doação', 'ong', 'educação', 'tecnologia', 'filantropia', 'projeto social', 'são gonçalo', 'investimento social']}
            />
            
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 text-center">
                {/* Abstract Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#8a4add]/10 rounded-[100%] blur-[120px] -z-10 pointer-events-none mix-blend-screen"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-30 -z-10"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Badge text="B2B & Impacto Social" />
                    
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6 max-w-5xl mx-auto">
                        Faça parte da <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] via-[#c4b5fd] to-[#f27983]">Revolução</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
                        Sua doação impulsiona o futuro de jovens da periferia, oferecendo educação gratuita e de qualidade em tecnologia. Juntos, transformamos potencial em profissão.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8a4add]/10 border border-[#8a4add]/20 mb-6">
                            <svg className="w-4 h-4 text-[#8a4add]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                            </svg>
                            <span className="text-sm font-bold text-[#8a4add] uppercase tracking-wider">Impacto Real</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Cada Real Transforma Vidas
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Escolha o valor que cabe no seu bolso e veja o impacto concreto que sua doação terá na vida de um jovem
                        </p>
                    </div>

                    {/* Impact Cards */}
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        <ImpactCard 
                            amount="50" 
                            title="Alimentação"
                            description="Garante o lanche de um aluno durante uma semana de aulas intensivas — essencial para manter a energia e o foco nos estudos."
                            icon={
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <ImpactCard 
                            amount="100" 
                            title="Transporte"
                            description="Cobre o transporte de um aluno durante todo o curso, permitindo que ele vá e volte das aulas duas vezes por semana com segurança."
                            icon={
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            }
                            isPopular={true}
                        />
                        <ImpactCard 
                            amount="300" 
                            title="Conectividade"
                            description="Mantém a conexão de uma família com a educação, custeando a internet necessária para que o aluno acompanhe as aulas remotas."
                            icon={
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                                </svg>
                            }
                        />
                    </div>

                    {/* Additional Impact Options */}
                    <div className="bg-gradient-to-br from-[#8a4add]/10 to-[#f27983]/10 border border-[#8a4add]/20 rounded-2xl p-8 mb-16">
                        <h3 className="text-2xl font-bold text-white text-center mb-8">Outros Valores</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 bg-black/20 p-6 rounded-xl border border-white/10">
                                <div className="w-12 h-12 bg-[#8a4add]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-white mb-1">R$ 500</p>
                                    <p className="text-sm text-gray-400">Material didático completo + equipamento básico para 1 aluno</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 bg-black/20 p-6 rounded-xl border border-white/10">
                                <div className="w-12 h-12 bg-[#8a4add]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-white mb-1">R$ 1.000+</p>
                                    <p className="text-sm text-gray-400">Patrocínio de uma turma inteira ou bolsa integral para um aluno</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-sm text-gray-400 mt-6">
                            💡 Qualquer valor é bem-vindo! Você também pode doar o valor que desejar usando o PIX abaixo.
                        </p>
                    </div>

                <div className="pix-section bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10">
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
                </div>
            </section>
        </div>
    );
};

export default DonateView;
