/**
 * Dashboard - Seção de Trilhas
 * Mostra trilhas inscritas e disponíveis
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Check } from 'lucide-react';
import { Trilha, Projeto } from '../TIPOS_CURSO_ROCKETSEAT';
import TrilhaCard from './TrilhaCard';

interface DashboardTrilhasSectionProps {
  userTrilhas: Trilha[];
  userProjetos: Projeto[];
  enrolledTrilhaIds: string[];
  onEnroll?: (trilhaId: string) => Promise<void>;
}

const DashboardTrilhasSection: React.FC<DashboardTrilhasSectionProps> = ({
  userTrilhas,
  userProjetos,
  enrolledTrilhaIds,
  onEnroll,
}) => {
  const navigate = useNavigate();
  const [selectedTrilha, setSelectedTrilha] = useState<Trilha | null>(null);
  const [loading, setLoading] = useState(false);

  // Filtrar trilhas inscritas
  const inscritasTrilhas = userTrilhas.filter(t => enrolledTrilhaIds.includes(t.id));
  const disponiveisTrilhas = userTrilhas.filter(t => !enrolledTrilhaIds.includes(t.id));

  const handleEnrollTrilha = async (trilhaId: string) => {
    try {
      setLoading(true);
      if (onEnroll) {
        await onEnroll(trilhaId);
        // Atualizar UI
      }
    } catch (err) {
      console.error('❌ Erro ao inscrever:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* === TRILHAS INSCRITAS === */}
      {inscritasTrilhas.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Minhas Trilhas ({inscritasTrilhas.length})
            </h3>
            <button
              onClick={() => navigate('/sistema/trilhas')}
              className="text-xs px-3 py-1 bg-purple-600/50 hover:bg-purple-600 text-white rounded-full transition-colors"
            >
              Ver Todas →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inscritasTrilhas.slice(0, 3).map(trilha => (
              <TrilhaCard
                key={trilha.id}
                {...trilha}
                isInscrito={true}
                percentualConclusao={Math.floor(Math.random() * 100)} // TODO: Carregar do DB
                onClick={() => navigate(`/sistema/trilhas`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* === TRILHAS DISPONÍVEIS === */}
      {disponiveisTrilhas.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-gray-400" />
            Explorar Mais Trilhas ({disponiveisTrilhas.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disponiveisTrilhas.slice(0, 3).map(trilha => (
              <TrilhaCard
                key={trilha.id}
                {...trilha}
                isInscrito={false}
                percentualConclusao={0}
                onClick={() => handleEnrollTrilha(trilha.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* === PRÓXIMOS DESAFIOS === */}
      {userProjetos.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">🎯 Próximos Projetos</h3>
          
          <div className="space-y-2">
            {userProjetos.slice(0, 3).map(projeto => (
              <div
                key={projeto.id}
                className="flex items-center justify-between p-3 bg-black/30 border border-white/5 rounded-lg hover:border-white/10 transition-all cursor-pointer"
                onClick={() => navigate('/sistema/trilhas')}
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{projeto.titulo}</p>
                  <p className="text-xs text-gray-400">{projeto.duracao} min</p>
                </div>
                <span className="text-lg">→</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === EMPTY STATE === */}
      {inscritasTrilhas.length === 0 && (
        <div className="text-center py-12 bg-white/5 border border-dashed border-white/20 rounded-lg">
          <Lock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Nenhuma trilha inscrita</h3>
          <p className="text-sm text-gray-500 mb-4">Escolha uma trilha para começar sua jornada de aprendizado!</p>
          <button
            onClick={() => navigate('/sistema/trilhas')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Explorar Trilhas →
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardTrilhasSection;
