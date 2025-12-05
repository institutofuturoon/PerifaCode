import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';

// Função para formatar valor em reais
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

const SupporterDetailView: React.FC = () => {
  const { supporterId } = useParams<{ supporterId: string }>();
  const { supporters } = useAppContext();
  const navigate = useNavigate();

  const supporter = useMemo(() => {
    return supporters.find(s => s.id === supporterId);
  }, [supporters, supporterId]);

  if (!supporter) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white mb-4">Apoiador não encontrado.</h2>
        <button onClick={() => navigate('/apoiadores')} className="text-[#c4b5fd] hover:underline">
          Retornar aos Apoiadores
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white font-sans">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090B]/80 backdrop-blur-md border-b border-white/5 h-16 flex items-center px-6">
        <button
          onClick={() => navigate('/apoiadores')}
          className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <span className="text-lg">←</span> VOLTAR PARA APOIADORES
        </button>
      </nav>

      <div className="pt-32 pb-20 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header com Logo e Nome */}
        <div className="text-center mb-16 relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="relative z-10">
            {supporter.logoUrl && (
              <div className="mb-8 flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-48 h-48 bg-white rounded-3xl p-6 flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                    <img
                      src={supporter.logoUrl}
                      alt={supporter.name}
                      className="w-full h-full object-contain"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 mb-6 backdrop-blur-sm">
              <span className="text-2xl">💜</span>
              <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">
                {supporter.category}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-6 leading-tight">
              {supporter.name}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <span className="text-purple-400">📅</span>
                <span>Apoiador desde {supporter.since}</span>
              </div>
              {supporter.websiteUrl && (
                <a
                  href={supporter.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 hover:border-purple-500/30 hover:text-purple-300 transition-all group"
                >
                  <span className="text-purple-400">🌐</span>
                  <span>Visitar Site</span>
                  <span className="group-hover:translate-x-1 transition-transform">↗</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Mensagem de Agradecimento */}
        <div className="mb-20 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/[0.02] border-2 border-purple-500/40 rounded-3xl p-10 md:p-16 backdrop-blur-sm">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border-2 border-purple-500/30">
                  <span className="text-5xl">🙏</span>
                </div>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-pink-300 mb-8 leading-tight">
              Muito Obrigado!
            </h2>

            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed text-center max-w-4xl mx-auto font-light">
              {supporter.description}
            </p>
          </div>
        </div>

        {/* Registro de Apoios */}
        {supporter.contributions && supporter.contributions.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                <span className="text-xl">📋</span>
                <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">Histórico</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white">
                Apoios Realizados
              </h3>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {supporter.contributions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((contrib, index) => (
                  <div
                    key={contrib.id}
                    className="group relative bg-gradient-to-br from-white/10 to-white/[0.02] border-2 border-white/10 rounded-2xl p-8 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Number badge */}
                    <div className="absolute -left-4 -top-4 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg">
                      {index + 1}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm font-bold rounded-full border border-purple-500/30">
                            {contrib.type}
                          </span>
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <span className="text-purple-400">📅</span>
                            <span>
                              {new Date(contrib.date).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-lg">{contrib.description}</p>
                      </div>
                      {contrib.value && (
                        <div className="flex-shrink-0">
                          <div className="px-6 py-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border-2 border-green-500/30">
                            <div className="text-xs text-green-400 uppercase tracking-wider mb-1">Valor</div>
                            <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                              {formatCurrency(contrib.value)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Total Doado */}
            {supporter.totalDonated > 0 && (
              <div className="mt-10 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
                
                <div className="relative bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-pink-500/20 rounded-3xl border-2 border-purple-500/40 p-10 backdrop-blur-sm">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                        <span className="text-3xl">💰</span>
                        <p className="text-purple-300 text-sm uppercase tracking-wider font-bold">
                          Total Contribuído
                        </p>
                      </div>
                      <p className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 mb-2">
                        {formatCurrency(supporter.totalDonated)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Investimento em transformação social
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-center px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-2xl">🎁</span>
                        </div>
                        <p className="text-3xl font-black text-white mb-1">
                          {supporter.contributions.length}
                        </p>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Apoios</p>
                      </div>
                      
                      <div className="h-16 w-px bg-white/10"></div>
                      
                      <div className="text-center px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-2xl">📅</span>
                        </div>
                        <p className="text-3xl font-black text-white mb-1">
                          {new Date().getFullYear() - parseInt(supporter.since)}+
                        </p>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Anos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA Final */}
        <div className="relative overflow-hidden rounded-3xl">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-500/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10 p-12 md:p-16 bg-gradient-to-br from-white/10 to-white/[0.02] border-2 border-purple-500/30 backdrop-blur-sm">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
                <span className="text-2xl">✨</span>
                <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">Junte-se a Nós</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-6 leading-tight">
                Quer fazer parte dessa história?
              </h3>
              
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Cada apoio, seja grande ou pequeno, faz toda a diferença na vida de jovens que sonham com um futuro melhor através da tecnologia.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/doar')}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
                >
                  <span className="text-xl group-hover:scale-125 transition-transform">💜</span>
                  <span>Apoiar o Instituto FuturoOn</span>
                </button>
                
                <button
                  onClick={() => navigate('/apoiadores')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border-2 border-white/10 text-white font-bold rounded-xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  <span>Ver Todos os Apoiadores</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupporterDetailView;
