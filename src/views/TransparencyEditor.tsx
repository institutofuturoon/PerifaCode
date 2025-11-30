
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { FinancialStatement, AnnualReport, FinancialItem, Testimonial } from '../types';
import DashboardSidebar from '../components/DashboardSidebar';

// Styles moved outside
const inputClasses = "w-full p-3 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors sm:text-sm text-white";
const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

// --- Financial Helper Component (Defined Outside) ---
const FinancialListEditor: React.FC<{ 
    items: FinancialItem[], 
    onChange: (items: FinancialItem[]) => void, 
    title: string 
}> = ({ items, onChange, title }) => {
    const addItem = () => {
        onChange([...items, { label: '', value: '', percentage: 0, color: 'bg-gray-500' }]);
    };
    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };
    const updateItem = (index: number, field: keyof FinancialItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange(newItems);
    };

    return (
        <div className="bg-white/5 p-4 rounded-lg border border-white/10 mt-4">
            <h4 className="text-white font-bold mb-4">{title}</h4>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <input placeholder="Rótulo (ex: Doações)" value={item.label} onChange={e => updateItem(index, 'label', e.target.value)} className={`${inputClasses} flex-[2]`} />
                        <input placeholder="Valor (ex: R$ 5k)" value={item.value} onChange={e => updateItem(index, 'value', e.target.value)} className={`${inputClasses} flex-[1]`} />
                        <input type="number" placeholder="%" value={item.percentage} onChange={e => updateItem(index, 'percentage', Number(e.target.value))} className={`${inputClasses} w-20`} />
                        <select value={item.color} onChange={e => updateItem(index, 'color', e.target.value)} className={`${inputClasses} w-32`}>
                            <option value="bg-sky-500">Azul</option>
                            <option value="bg-green-500">Verde</option>
                            <option value="bg-red-500">Vermelho</option>
                            <option value="bg-yellow-500">Amarelo</option>
                            <option value="bg-purple-500">Roxo</option>
                            <option value="bg-pink-500">Rosa</option>
                            <option value="bg-orange-500">Laranja</option>
                            <option value="bg-gray-500">Cinza</option>
                        </select>
                        <button type="button" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300 p-2">&times;</button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={addItem} className="mt-2 text-sm text-[#c4b5fd] hover:text-white">+ Adicionar Item</button>
        </div>
    );
};

// --- Report Helper Component (Defined Outside) ---
const TestimonialListEditor: React.FC<{
    testimonials: Testimonial[],
    onChange: (items: Testimonial[]) => void
}> = ({ testimonials, onChange }) => {
     const addItem = () => {
        onChange([...testimonials, { name: '', quote: '', role: 'Aluno(a)', avatarUrl: 'https://placehold.co/100' }]);
    };
    const removeItem = (index: number) => {
        onChange(testimonials.filter((_, i) => i !== index));
    };
    const updateItem = (index: number, field: keyof Testimonial, value: any) => {
        const newItems = [...testimonials];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange(newItems);
    };

    return (
        <div className="bg-white/5 p-4 rounded-lg border border-white/10 mt-4">
            <h4 className="text-white font-bold mb-4">Depoimentos</h4>
            <div className="space-y-4">
                {testimonials.map((t, index) => (
                    <div key={index} className="bg-black/20 p-3 rounded border border-white/10">
                        <div className="flex justify-between mb-2"><span className="text-xs text-gray-400">Depoimento {index + 1}</span> <button type="button" onClick={() => removeItem(index)} className="text-red-400">&times;</button></div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <input placeholder="Nome" value={t.name} onChange={e => updateItem(index, 'name', e.target.value)} className={inputClasses} />
                            <input placeholder="Papel (ex: Aluno de Python)" value={t.role} onChange={e => updateItem(index, 'role', e.target.value)} className={inputClasses} />
                        </div>
                         <textarea placeholder="Citação..." value={t.quote} onChange={e => updateItem(index, 'quote', e.target.value)} className={inputClasses} rows={2} />
                         <div className="mt-2"><label className="text-xs text-gray-400">URL do Avatar</label><input value={t.avatarUrl} onChange={e => updateItem(index, 'avatarUrl', e.target.value)} className={inputClasses} /></div>
                    </div>
                ))}
            </div>
            <button type="button" onClick={addItem} className="mt-2 text-sm text-[#c4b5fd] hover:text-white">+ Adicionar Depoimento</button>
        </div>
    );
}

const TransparencyEditor: React.FC = () => {
    const { type, id } = useParams<{ type: string, id: string }>();
    const { financialStatements, annualReports, handleSaveFinancialStatement, handleSaveAnnualReport, user, showToast } = useAppContext();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Determine edit mode and object type
    const isFinancial = type === 'financial';
    const isReport = type === 'report';
    const isNew = !id;

    // --- Initial States ---
    const initialFinancial: FinancialStatement = {
        id: `fin_${Date.now()}`,
        year: new Date().getFullYear(),
        totalRevenue: 'R$ 0,00',
        totalExpenses: 'R$ 0,00',
        reinvested: 'R$ 0,00',
        revenueBreakdown: [],
        expensesBreakdown: [],
        documentsUrl: ''
    };

    const initialReport: AnnualReport = {
        id: `rep_${Date.now()}`,
        year: new Date().getFullYear(),
        stats: [
            { label: 'Jovens Impactados', value: '+100', color: 'text-sky-400' },
            { label: 'Taxa de Retenção', value: '95%', color: 'text-green-400' },
            { label: 'Horas de Conteúdo', value: '+1k', color: 'text-pink-400' },
            { label: 'Parcerias', value: '5', color: 'text-amber-400' }
        ],
        coordinationLetter: {
            text: '',
            authorName: user?.name || '',
            authorRole: 'Coordenação',
            authorAvatarUrl: user?.avatarUrl || ''
        },
        testimonials: [],
    };

    // --- State Management ---
    const [financialData, setFinancialData] = useState<FinancialStatement>(initialFinancial);
    const [reportData, setReportData] = useState<AnnualReport>(initialReport);
    
    // Load existing data
    useEffect(() => {
        if (!isNew && id) {
            if (isFinancial) {
                const found = financialStatements.find(f => f.id === id);
                if (found) setFinancialData(found);
            } else if (isReport) {
                const found = annualReports.find(r => r.id === id);
                if (found) setReportData(found);
            }
        }
    }, [id, isNew, isFinancial, isReport, financialStatements, annualReports]);

    // --- Selection (Tabs) logic if creating new ---
    const [selectedType, setSelectedType] = useState<'financial' | 'report'>((type as 'financial' | 'report') || 'financial');
    
    // If editing, force the type
    useEffect(() => {
        if (!isNew && type) setSelectedType(type as 'financial' | 'report');
    }, [type, isNew]);


    // --- Handlers ---

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validação
        if (selectedType === 'financial') {
            if (!financialData.year || financialData.year < 2000) {
                alert('⚠️ Por favor, informe um ano válido.');
                return;
            }
            if (!financialData.totalRevenue || !financialData.totalExpenses) {
                alert('⚠️ Por favor, preencha receita e despesa total.');
                return;
            }
            handleSaveFinancialStatement(financialData);
            alert('✅ Relatório financeiro salvo com sucesso!');
        } else {
            if (!reportData.year || reportData.year < 2000) {
                alert('⚠️ Por favor, informe um ano válido.');
                return;
            }
            if (!reportData.coordinationLetter.text || reportData.coordinationLetter.text.length < 50) {
                alert('⚠️ A carta da coordenação deve ter pelo menos 50 caracteres.');
                return;
            }
            handleSaveAnnualReport(reportData);
            alert('✅ Relatório de impacto salvo com sucesso!');
        }
        
        navigate('/admin');
    };

    const pageTitle = isNew 
        ? 'Novo Relatório de Transparência'
        : `Editar Relatório ${isFinancial ? 'Financeiro' : 'de Impacto'} ${isFinancial ? financialData.year : reportData.year}`;

    return (
        <div className="min-h-screen bg-[#09090B] flex">
            {/* Sidebar */}
            <DashboardSidebar 
                activeTab="transparency"
                onTabChange={(tab) => {
                    if (tab === 'transparency') {
                        navigate('/painel');
                    } else {
                        navigate('/painel');
                    }
                }}
                userRole={user?.role || 'student'}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 md:pl-64">
                {/* Header */}
                <header className="h-16 bg-background/95 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="md:hidden text-gray-400 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" x2="21" y1="6" y2="6"/>
                                <line x1="3" x2="21" y1="12" y2="12"/>
                                <line x1="3" x2="21" y1="18" y2="18"/>
                            </svg>
                        </button>
                        <button 
                            onClick={() => navigate('/painel')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                        >
                            <svg 
                                className="h-5 w-5 group-hover:-translate-x-1 transition-transform" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm font-medium hidden sm:inline">Voltar</span>
                        </button>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="hidden sm:inline">Portal da Transparência</span>
                            <span className="hidden sm:inline">/</span>
                            <span className="text-white font-medium">{pageTitle}</span>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        form="transparency-form"
                        className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] hover:opacity-90 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 text-sm"
                    >
                        Salvar
                    </button>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <form id="transparency-form" onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
                            {/* Header Info */}
                            <div className="bg-gradient-to-r from-[#121212] to-[#1a1a1d] rounded-xl border border-white/10 p-6">
                                <h2 className="text-2xl font-black text-white mb-2">
                                    {isNew ? 'Criar Novo Relatório' : 'Editar Relatório'}
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    Gerencie os relatórios exibidos publicamente no Portal da Transparência.
                                </p>
                            </div>

                {/* Type Switcher (Only if creating new) */}
                {isNew && (
                    <div className="flex gap-4 border-b border-white/10 pb-4">
                        <button type="button" onClick={() => setSelectedType('financial')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${selectedType === 'financial' ? 'bg-[#8a4add] text-white' : 'bg-white/5 text-gray-400'}`}>Relatório Financeiro</button>
                        <button type="button" onClick={() => setSelectedType('report')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${selectedType === 'report' ? 'bg-[#8a4add] text-white' : 'bg-white/5 text-gray-400'}`}>Relatório Anual (Impacto)</button>
                    </div>
                )}

                {/* FINANCIAL EDITOR */}
                {selectedType === 'financial' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4">Resumo Financeiro</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div><label className={labelClasses}>Ano de Referência</label><input type="number" value={financialData.year} onChange={e => setFinancialData({...financialData, year: parseInt(e.target.value)})} className={inputClasses} /></div>
                                <div><label className={labelClasses}>Link Documentos (PDF/ZIP)</label><input value={financialData.documentsUrl || ''} onChange={e => setFinancialData({...financialData, documentsUrl: e.target.value})} className={inputClasses} placeholder="https://..." /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div><label className={labelClasses}>Receita Total</label><input value={financialData.totalRevenue} onChange={e => setFinancialData({...financialData, totalRevenue: e.target.value})} className={inputClasses} /></div>
                                <div><label className={labelClasses}>Despesa Total</label><input value={financialData.totalExpenses} onChange={e => setFinancialData({...financialData, totalExpenses: e.target.value})} className={inputClasses} /></div>
                                <div><label className={labelClasses}>Reinvestido</label><input value={financialData.reinvested} onChange={e => setFinancialData({...financialData, reinvested: e.target.value})} className={inputClasses} /></div>
                            </div>
                        </div>

                        <FinancialListEditor 
                            title="Detalhamento das Receitas" 
                            items={financialData.revenueBreakdown} 
                            onChange={items => setFinancialData({...financialData, revenueBreakdown: items})} 
                        />
                        
                        <FinancialListEditor 
                            title="Detalhamento das Despesas" 
                            items={financialData.expensesBreakdown} 
                            onChange={items => setFinancialData({...financialData, expensesBreakdown: items})} 
                        />
                    </div>
                )}

                {/* ANNUAL REPORT EDITOR */}
                {selectedType === 'report' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4">Dados Gerais</h3>
                            <div className="mb-4 w-32"><label className={labelClasses}>Ano</label><input type="number" value={reportData.year} onChange={e => setReportData({...reportData, year: parseInt(e.target.value)})} className={inputClasses} /></div>
                            
                            <h4 className="text-white font-bold mb-2 mt-6">Carta da Coordenação</h4>
                            <div className="grid grid-cols-3 gap-4 mb-2">
                                <div className="col-span-1"><input placeholder="Nome do Autor" value={reportData.coordinationLetter.authorName} onChange={e => setReportData({...reportData, coordinationLetter: {...reportData.coordinationLetter, authorName: e.target.value}})} className={inputClasses} /></div>
                                <div className="col-span-1"><input placeholder="Cargo" value={reportData.coordinationLetter.authorRole} onChange={e => setReportData({...reportData, coordinationLetter: {...reportData.coordinationLetter, authorRole: e.target.value}})} className={inputClasses} /></div>
                                <div className="col-span-1"><input placeholder="URL Foto" value={reportData.coordinationLetter.authorAvatarUrl} onChange={e => setReportData({...reportData, coordinationLetter: {...reportData.coordinationLetter, authorAvatarUrl: e.target.value}})} className={inputClasses} /></div>
                            </div>
                            <textarea 
                                rows={6} 
                                placeholder="Escreva a carta aqui..." 
                                value={reportData.coordinationLetter.text} 
                                onChange={e => setReportData({...reportData, coordinationLetter: {...reportData.coordinationLetter, text: e.target.value}})} 
                                className={inputClasses} 
                            />
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h4 className="text-white font-bold mb-4">Estatísticas de Impacto (4 Cards)</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {reportData.stats.map((stat, i) => (
                                    <div key={i} className="bg-black/20 p-2 rounded border border-white/10">
                                        <label className="text-xs text-gray-400 block">Card {i+1}</label>
                                        <input placeholder="Valor (ex: +300)" value={stat.value} onChange={e => {
                                            const newStats = [...reportData.stats];
                                            newStats[i] = { ...newStats[i], value: e.target.value };
                                            setReportData({ ...reportData, stats: newStats });
                                        }} className={`${inputClasses} mb-1`} />
                                        <input placeholder="Rótulo (ex: Alunos)" value={stat.label} onChange={e => {
                                            const newStats = [...reportData.stats];
                                            newStats[i] = { ...newStats[i], label: e.target.value };
                                            setReportData({ ...reportData, stats: newStats });
                                        }} className={inputClasses} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <TestimonialListEditor 
                            testimonials={reportData.testimonials} 
                            onChange={items => setReportData({...reportData, testimonials: items})} 
                        />
                    </div>
                )}

                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TransparencyEditor;
