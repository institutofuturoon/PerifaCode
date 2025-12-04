# 📝 Código da Seção Hostinger

## Adicione este código ANTES da linha `<div className="grid lg:grid-cols-3 gap-12">`

```tsx
                {/* Seção Especial de Agradecimento - Hostinger */}
                {isHostinger && (
                    <div className="mb-16 relative overflow-hidden">
                        {/* Background effects */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl"></div>
                        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                        
                        <div className="relative z-10 bg-gradient-to-br from-white/5 to-white/[0.02] border-2 border-yellow-500/30 rounded-3xl p-8 md:p-12">
                            {/* Badge de Prêmio */}
                            <div className="flex justify-center mb-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40">
                                    <span className="text-3xl">🏆</span>
                                    <span className="text-sm font-bold text-yellow-300 uppercase tracking-wider">Prêmio Hostinger Start 2025</span>
                                </div>
                            </div>

                            {/* Título de Agradecimento */}
                            <h2 className="text-3xl md:text-5xl font-black text-center text-white mb-6 leading-tight">
                                Obrigado por Acreditar no Nosso Sonho! 💜
                            </h2>

                            {/* Mensagem de Agradecimento */}
                            <div className="max-w-3xl mx-auto space-y-6 text-center">
                                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                                    A <strong className="text-white">Hostinger</strong> não é apenas um parceiro, é um <strong className="text-yellow-400">catalisador de transformação</strong>. Ao nos reconhecer com o <strong className="text-yellow-400">Prêmio Hostinger Start 2025</strong>, vocês validaram nossa missão de impulsionar sonhos de negócio online e transformar vidas através da tecnologia.
                                </p>

                                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-500 rounded-r-2xl p-6 text-left">
                                    <p className="text-white font-semibold italic text-base md:text-lg">
                                        "Este prêmio representa muito mais que um reconhecimento. É a prova de que quando acreditamos no potencial da juventude periférica e oferecemos as ferramentas certas, não há limites para o que podemos alcançar juntos."
                                    </p>
                                    <p className="text-gray-400 text-sm mt-3">— Equipe Instituto FuturoOn</p>
                                </div>

                                <p className="text-base md:text-lg text-gray-300">
                                    Graças ao apoio da Hostinger, conseguimos <strong className="text-white">hospedar nossa plataforma</strong>, <strong className="text-white">capacitar jovens em desenvolvimento web</strong> e <strong className="text-white">criar oportunidades reais</strong> para quem mais precisa.
                                </p>
                            </div>

                            {/* Estatísticas do Impacto Hostinger */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-4xl mx-auto">
                                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-3xl font-black text-yellow-400 mb-1">R$ 16.5k</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Investimento Total</p>
                                </div>
                                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-3xl font-black text-yellow-400 mb-1">100%</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Uptime Garantido</p>
                                </div>
                                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-3xl font-black text-yellow-400 mb-1">50+</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Alunos Beneficiados</p>
                                </div>
                                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-3xl font-black text-yellow-400 mb-1">24/7</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Plataforma Online</p>
                                </div>
                            </div>

                            {/* CTA para o artigo */}
                            <div className="mt-10 text-center">
                                <button
                                    onClick={() => navigate('/artigo/hostinger-start-impulsionando-seu-sonho-de-negocio-online')}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 hover:scale-105"
                                >
                                    <span>Leia a História Completa do Prêmio</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
```

## 📍 Localização Exata

Procure por esta linha no arquivo `src/views/PartnerDetailView.tsx`:

```tsx
                <div className="grid lg:grid-cols-3 gap-12">
```

E adicione o código acima ANTES dessa linha.

O arquivo deve ficar assim:

```tsx
                </div>

                {/* ADICIONE O CÓDIGO AQUI */}

                <div className="grid lg:grid-cols-3 gap-12">
```

---

**Criado por Kiro AI Assistant**  
**Data:** 04/12/2024
