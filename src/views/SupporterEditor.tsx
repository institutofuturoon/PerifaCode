import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Supporter, SupporterContribution } from '../types';
import EditorHeader from '../components/EditorHeader';

// Função para formatar valor em reais
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

// Componente para editar uma contribuição
const ContributionCard: React.FC<{
  contribution: SupporterContribution;
  onEdit: (updated: SupporterContribution) => void;
  onRemove: () => void;
}> = ({ contribution, onEdit, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(contribution);
  const [valueInput, setValueInput] = useState(contribution.value?.toString() || '');

  const handleSave = () => {
    // Converter valor formatado para número
    let numericValue: number | undefined = undefined;
    if (valueInput) {
      const cleanValue = valueInput
        .replace(/\./g, '') // Remove pontos
        .replace(',', '.'); // Substitui vírgula por ponto
      numericValue = parseFloat(cleanValue);
      
      if (isNaN(numericValue)) {
        alert('Valor inválido. Use formato: 15000 ou 15.000,00');
        return;
      }
    }

    onEdit({ ...editData, value: numericValue });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(contribution);
    setValueInput(contribution.value?.toString() || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-white/5 rounded-lg border-2 border-purple-500/30">
        <div className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Tipo de Apoio</label>
              <input
                value={editData.type}
                onChange={(e) => setEditData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 bg-white/5 rounded border border-white/10 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Valor (R$)</label>
              <input
                type="text"
                value={valueInput}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d.,]/g, '');
                  setValueInput(value);
                }}
                placeholder="Ex: 15.000,00 ou 15000"
                className="w-full p-2 bg-white/5 rounded border border-white/10 text-white text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Aceita: 15000 ou 15.000 ou 15.000,00
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Descrição</label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 bg-white/5 rounded border border-white/10 text-white text-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Data</label>
            <input
              type="date"
              value={editData.date}
              onChange={(e) => setEditData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 bg-white/5 rounded border border-white/10 text-white text-sm"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded transition-colors text-sm"
            >
              ✓ Salvar
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded transition-colors text-sm"
            >
              ✕ Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded">
              {contribution.type}
            </span>
            {contribution.value && (
              <span className="text-green-400 font-bold text-sm">
                {formatCurrency(contribution.value)}
              </span>
            )}
            <span className="text-gray-500 text-xs">
              {new Date(contribution.date).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <p className="text-gray-300 text-sm">{contribution.description}</p>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-blue-400 hover:text-blue-300 transition-colors p-1"
            title="Editar"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 transition-colors p-1"
            title="Remover"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

const SupporterEditor: React.FC = () => {
  const { supporterId } = useParams<{ supporterId: string }>();
  const navigate = useNavigate();
  const { supporters, handleSaveSupporter, user } = useAppContext();

  const initialSupporter = useMemo(() => {
    if (supporterId && supporterId !== 'new') {
      return supporters.find(s => s.id === supporterId);
    }
    return {
      id: `supporter_${Date.now()}`,
      name: '',
      description: '',
      logoUrl: '',
      websiteUrl: '',
      category: 'Doador Individual' as Supporter['category'],
      contributions: [],
      since: new Date().getFullYear().toString(),
      featured: false,
      totalDonated: 0
    };
  }, [supporterId, supporters]);

  const [supporter, setSupporter] = useState<Supporter>(initialSupporter || {
    id: `supporter_${Date.now()}`,
    name: '',
    description: '',
    logoUrl: '',
    websiteUrl: '',
    category: 'Doador Individual' as Supporter['category'],
    contributions: [],
    since: new Date().getFullYear().toString(),
    featured: false,
    totalDonated: 0
  });

  const [newContribution, setNewContribution] = useState({
    type: '',
    description: '',
    value: '',
    date: new Date().toISOString().split('T')[0]
  });

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-20 text-white">Acesso negado.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSupporter(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddContribution = () => {
    if (!newContribution.type || !newContribution.description) {
      alert('Preencha o tipo e descrição do apoio');
      return;
    }

    // Converter valor formatado para número
    let numericValue: number | undefined = undefined;
    if (newContribution.value) {
      // Remove pontos de milhar e substitui vírgula por ponto
      const cleanValue = newContribution.value
        .replace(/\./g, '') // Remove pontos
        .replace(',', '.'); // Substitui vírgula por ponto
      numericValue = parseFloat(cleanValue);
      
      if (isNaN(numericValue)) {
        alert('Valor inválido. Use formato: 15000 ou 15.000,00');
        return;
      }
    }

    const contribution = {
      id: `contrib_${Date.now()}`,
      type: newContribution.type,
      description: newContribution.description,
      value: numericValue,
      date: newContribution.date
    };

    setSupporter(prev => ({
      ...prev,
      contributions: [...prev.contributions, contribution],
      totalDonated: prev.totalDonated + (contribution.value || 0)
    }));

    setNewContribution({
      type: '',
      description: '',
      value: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleRemoveContribution = (contributionId: string) => {
    const contrib = supporter.contributions.find(c => c.id === contributionId);
    setSupporter(prev => ({
      ...prev,
      contributions: prev.contributions.filter(c => c.id !== contributionId),
      totalDonated: prev.totalDonated - (contrib?.value || 0)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveSupporter(supporter);
    navigate('/admin');
  };

  const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="min-h-screen bg-[#09090B]">
      <EditorHeader
        title={supporterId === 'new' ? 'Novo Apoiador' : 'Editar Apoiador'}
        subtitle="Registre e agradeça quem apoia nossa missão"
        onBack={() => navigate('/admin')}
        actions={
          <button type="submit" form="supporter-form" className="bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg">
            Salvar Apoiador
          </button>
        }
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="supporter-form" onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
          
          {/* Informações Básicas */}
          <div className="p-8 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">📋 Informações Básicas</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className={labelClasses}>Nome do Apoiador *</label>
                <input
                  id="name"
                  name="name"
                  value={supporter.name}
                  onChange={handleChange}
                  placeholder="Ex: Batata Crac"
                  required
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="category" className={labelClasses}>Categoria *</label>
                <select
                  id="category"
                  name="category"
                  value={supporter.category}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="Doador Individual">Doador Individual</option>
                  <option value="Empresa">Empresa</option>
                  <option value="Instituição">Instituição</option>
                  <option value="Voluntário">Voluntário</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelClasses}>Mensagem de Agradecimento *</label>
              <textarea
                id="description"
                name="description"
                value={supporter.description}
                onChange={handleChange}
                placeholder="Uma mensagem especial de agradecimento..."
                required
                className={inputClasses}
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="logoUrl" className={labelClasses}>URL do Logo</label>
                <input
                  id="logoUrl"
                  name="logoUrl"
                  value={supporter.logoUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={inputClasses}
                />
                {supporter.logoUrl && (
                  <div className="mt-2 p-2 bg-white rounded-lg inline-block">
                    <img src={supporter.logoUrl} alt="Preview" className="h-12 object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="websiteUrl" className={labelClasses}>Site/Rede Social</label>
                <input
                  id="websiteUrl"
                  name="websiteUrl"
                  value={supporter.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="since" className={labelClasses}>Apoiador desde</label>
                <input
                  id="since"
                  name="since"
                  value={supporter.since}
                  onChange={handleChange}
                  placeholder="2024"
                  className={inputClasses}
                />
              </div>

              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={supporter.featured}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500"
                />
                <label htmlFor="featured" className="text-sm text-gray-300">
                  ⭐ Destacar na página de apoiadores
                </label>
              </div>
            </div>
          </div>

          {/* Registro de Apoios */}
          <div className="p-8 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">🎁 Registro de Apoios</h3>

            {/* Adicionar Novo Apoio */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-purple-300 uppercase">Adicionar Novo Apoio</h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Tipo de Apoio *</label>
                  <input
                    value={newContribution.type}
                    onChange={(e) => setNewContribution(prev => ({ ...prev, type: e.target.value }))}
                    placeholder="Ex: Doação de Alimentos"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2">Valor (R$) - Opcional</label>
                  <input
                    type="text"
                    value={newContribution.value}
                    onChange={(e) => {
                      // Remove tudo exceto números e vírgula/ponto
                      const value = e.target.value.replace(/[^\d.,]/g, '');
                      setNewContribution(prev => ({ ...prev, value }));
                    }}
                    placeholder="Ex: 15.000,00 ou 15000"
                    className={inputClasses}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Aceita: 15000 ou 15.000 ou 15.000,00
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Descrição do Apoio *</label>
                <textarea
                  value={newContribution.description}
                  onChange={(e) => setNewContribution(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ex: Doação de 50 pacotes de biscoitos para os lanches dos alunos durante o mês de dezembro"
                  className={inputClasses}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Data</label>
                  <input
                    type="date"
                    value={newContribution.date}
                    onChange={(e) => setNewContribution(prev => ({ ...prev, date: e.target.value }))}
                    className={inputClasses}
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddContribution}
                    className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    ➕ Adicionar Apoio
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Apoios */}
            {supporter.contributions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-400 uppercase">Apoios Registrados ({supporter.contributions.length})</h4>
                {supporter.contributions.map((contrib) => (
                  <ContributionCard
                    key={contrib.id}
                    contribution={contrib}
                    onEdit={(updated) => {
                      setSupporter(prev => ({
                        ...prev,
                        contributions: prev.contributions.map(c =>
                          c.id === contrib.id ? updated : c
                        ),
                        totalDonated: prev.contributions
                          .map(c => c.id === contrib.id ? updated : c)
                          .reduce((sum, c) => sum + (c.value || 0), 0)
                      }));
                    }}
                    onRemove={() => handleRemoveContribution(contrib.id)}
                  />
                ))}

                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-semibold">Total Doado:</span>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {formatCurrency(supporter.totalDonated)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default SupporterEditor;
