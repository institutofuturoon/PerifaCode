
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Achievement, Course, Lesson, MentorSession, User, Track, FinancialStatement, AnnualReport, Project, SystemSettings } from '../types';
import ProgressBar from '../components/ProgressBar';
import { useAppContext } from '../App';
import CourseCard from '../components/CourseCard';
import DashboardSidebar from '../components/DashboardSidebar';
import ForumView from './ForumView';
import MarketingGeneratorView from './MarketingGeneratorView';
import Blog from './Blog';
import LoadingState from '../components/LoadingState';
import UnlockLessonModal from '../components/UnlockLessonModal';
import { collection, getDocs, writeBatch, doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

// --- Helper Components (Defined Outside) ---

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color?: string; trend?: string; trendUp?: boolean }> = ({ title, value, icon, color = "text-white", trend, trendUp }) => (
  <div className="bg-[#121212] p-5 rounded-2xl border border-white/10 hover:border-primary/30 transition-all group relative overflow-hidden">
    <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">{icon}</div>
    </div>
    <div className="relative z-10">
        <p className={`text-3xl font-black ${color}`}>{value}</p>
        {trend && (
            <p className={`text-xs font-bold mt-1 flex items-center gap-1 ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                {trendUp ? '↑' : '↓'} {trend} <span className="text-gray-600 font-normal">vs. mês anterior</span>
            </p>
        )}
    </div>
    {/* Decorative bg blob */}
    <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-5 pointer-events-none ${color.replace('text-', 'bg-')}`}></div>
  </div>
);

const TableHeader: React.FC<{ cols: string[] }> = ({ cols }) => (
    <thead className="bg-white/5 text-xs uppercase font-medium text-gray-400">
        <tr>
            {cols.map((col, i) => (
                <th key={i} className="px-6 py-3 text-left tracking-wider font-semibold border-b border-white/5">{col}</th>
            ))}
        </tr>
    </thead>
);

const DashboardHeader: React.FC<{ user: User | null, toggleSidebar: () => void, title: string }> = ({ user, toggleSidebar, title }) => {
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { handleLogout } = useAppContext();

    if (!user) return null;

    return (
        <header className="h-16 bg-background/95 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="hidden sm:inline">FuturoOn Workspace</span>
                    <span className="hidden sm:inline">/</span>
                    <span className="text-white font-medium">{title}</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Gamification Badges (Visible on Desktop) */}
                <div className="hidden md:flex items-center gap-3 mr-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold" title="Ofensiva">
                        <span>🔥</span> {user.streak}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold" title="XP Total">
                        <span>⚡</span> {user.xp}
                    </div>
                </div>

                <div className="relative">
                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 hover:bg-white/5 py-1.5 px-2 rounded-full transition-colors">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-white">{user.name}</p>
                            <p className="text-[10px] text-gray-500 capitalize">{user.role === 'student' ? 'Aluno' : user.role === 'instructor' ? 'Instrutor' : 'Admin'}</p>
                        </div>
                        <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full border border-white/10" />
                    </button>
                    
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#18181B] border border-white/10 rounded-lg shadow-xl py-1 z-50">
                            <button onClick={() => navigate('/perfil')} className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors">Meu Perfil</button>
                            <button onClick={() => navigate('/')} className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors">Voltar ao Site</button>
                            <div className="border-t border-white/10 my-1"></div>
                            <button onClick={() => { handleLogout(); navigate('/'); }} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors">Sair</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

// --- System Settings Components ---

const COLOR_PRESETS: Record<string, SystemSettings> = {
    'Original': { siteName: 'FuturoOn', primaryColor: '#8a4add', secondaryColor: '#f27983', backgroundColor: '#09090B', surfaceColor: '#121212', gradientStart: '#8a4add', gradientEnd: '#f27983', borderRadius: '1rem' },
    'Ocean': { siteName: 'Ocean', primaryColor: '#0ea5e9', secondaryColor: '#3b82f6', backgroundColor: '#020617', surfaceColor: '#0f172a', gradientStart: '#38bdf8', gradientEnd: '#3b82f6', borderRadius: '0.75rem' },
    'Forest': { siteName: 'Forest', primaryColor: '#22c55e', secondaryColor: '#84cc16', backgroundColor: '#022c22', surfaceColor: '#064e3b', gradientStart: '#4ade80', gradientEnd: '#bef264', borderRadius: '0.5rem' },
    'Dracula': { siteName: 'Dracula', primaryColor: '#bd93f9', secondaryColor: '#ff79c6', backgroundColor: '#282a36', surfaceColor: '#44475a', gradientStart: '#ff79c6', gradientEnd: '#bd93f9', borderRadius: '0.25rem' },
    'Sunset': { siteName: 'Sunset', primaryColor: '#f97316', secondaryColor: '#f43f5e', backgroundColor: '#2a0a0a', surfaceColor: '#450a0a', gradientStart: '#fbbf24', gradientEnd: '#f43f5e', borderRadius: '1.5rem' },
};

// IMPORTANT: Defined OUTSIDE SystemSettingsPanel to prevent re-rendering/flickering
const ThemePreview: React.FC<{ settings: SystemSettings }> = ({ settings }) => {
    return (
        <div className="border border-white/10 overflow-hidden flex flex-col h-72 shadow-2xl transition-all duration-300 ease-in-out" style={{ backgroundColor: settings.backgroundColor, borderRadius: settings.borderRadius }}>
            {/* Mock Header */}
            <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between shrink-0 transition-colors duration-300" style={{ backgroundColor: settings.surfaceColor }}>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
                <div className="h-2 w-20 rounded-full bg-white/10"></div>
            </div>
            <div className="flex flex-1 overflow-hidden">
                {/* Mock Sidebar */}
                <div className="w-16 border-r border-white/5 hidden sm:flex flex-col items-center py-4 gap-3 transition-colors duration-300" style={{ backgroundColor: settings.backgroundColor }}>
                    <div className="w-8 h-8 rounded-lg mb-2 transition-colors duration-300" style={{ backgroundColor: settings.primaryColor, opacity: 0.2, borderRadius: `calc(${settings.borderRadius} * 0.5)` }}></div>
                    <div className="w-8 h-8 rounded-lg bg-white/5" style={{ borderRadius: `calc(${settings.borderRadius} * 0.5)` }}></div>
                    <div className="w-8 h-8 rounded-lg bg-white/5" style={{ borderRadius: `calc(${settings.borderRadius} * 0.5)` }}></div>
                </div>
                {/* Mock Content */}
                <div className="flex-1 p-4 gap-4 flex flex-col overflow-hidden">
                    <div className="h-32 p-4 flex flex-col justify-center items-start gap-2 relative overflow-hidden shadow-sm transition-all duration-300" style={{ backgroundColor: settings.surfaceColor, borderRadius: settings.borderRadius }}>
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-10 pointer-events-none transition-colors duration-300" style={{ backgroundColor: settings.primaryColor }}></div>
                        
                        {/* Text Gradient Preview */}
                        <h3 className="text-xl font-bold transition-colors duration-300 bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${settings.gradientStart}, ${settings.gradientEnd})` }}>
                            Texto em Degradê
                        </h3>
                        
                        <div className="h-3 w-1/2 rounded-full bg-white/10"></div>
                        <button className="px-4 py-1.5 text-[10px] font-bold text-white mt-2 shadow-lg transition-all duration-300" style={{ backgroundColor: settings.primaryColor, borderRadius: `calc(${settings.borderRadius} * 0.5)` }}>
                            Botão Primário
                        </button>
                    </div>
                    <div className="flex gap-3 flex-1">
                        <div className="flex-1 bg-white/5 border border-white/5 relative overflow-hidden" style={{ borderRadius: settings.borderRadius }}>
                            <div className="absolute top-0 left-0 h-1 w-full transition-colors duration-300" style={{ backgroundColor: settings.secondaryColor }}></div>
                        </div>
                        <div className="flex-1 bg-white/5 border border-white/5" style={{ borderRadius: settings.borderRadius }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SystemSettingsPanel: React.FC = () => {
    const { showToast, settings, updateSettings } = useAppContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'branding' | 'backup' | 'features'>('branding');
    
    // Backup States
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusLog, setStatusLog] = useState<string>('');
    const [restorePreview, setRestorePreview] = useState<Record<string, number> | null>(null);
    const [importedData, setImportedData] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const availableCollections = [
        { id: 'users', label: 'Usuários & Alunos' },
        { id: 'courses', label: 'Cursos & Aulas' },
        { id: 'articles', label: 'Blog & Artigos' },
        { id: 'projects', label: 'Projetos da Comunidade' },
        { id: 'communityPosts', label: 'Fórum' },
        { id: 'events', label: 'Eventos' },
        { id: 'mentorSessions', label: 'Agendamentos' },
        { id: 'partners', label: 'Parceiros' },
        { id: 'marketingPosts', label: 'Marketing' },
        { id: 'financialStatements', label: 'Relatórios Financeiros' },
        { id: 'annualReports', label: 'Relatórios de Impacto' }
    ];

    const [selectedCollections, setSelectedCollections] = useState<string[]>(availableCollections.map(c => c.id));

    const toggleCollection = (id: string) => {
        setSelectedCollections(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const applyPreset = (name: string) => {
        const preset = COLOR_PRESETS[name];
        if (preset) {
            updateSettings(preset);
            showToast(`Tema ${name} aplicado com sucesso!`);
        }
    };

    const ColorInput: React.FC<{ label: string, value: string, onChange: (v: string) => void, description?: string }> = ({ label, value, onChange, description }) => (
        <div className="group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
            <div className="flex items-center gap-3 bg-[#18181b] p-2 rounded-lg border border-white/10 focus-within:border-[var(--color-primary)] transition-colors">
                <div className="relative w-10 h-10 rounded-md overflow-hidden shadow-inner border border-white/10 flex-shrink-0" style={{backgroundColor: value}}>
                    <input 
                        type="color" 
                        value={value} 
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0 opacity-0"
                    />
                </div>
                <div className="flex-1">
                    <input 
                        type="text" 
                        value={value} 
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-transparent text-sm text-white font-mono focus:outline-none uppercase"
                        placeholder="#000000"
                        maxLength={7}
                    />
                </div>
            </div>
            {description && <p className="text-[10px] text-gray-500 mt-1">{description}</p>}
        </div>
    );

    // --- Backup Functions ---
    const handleBackup = async () => {
        if (selectedCollections.length === 0) {
            showToast("⚠️ Selecione pelo menos uma coleção.");
            return;
        }

        setIsBackingUp(true);
        setProgress(0);
        setStatusLog("Iniciando backup...");
        
        try {
            const backupData: any = {};
            const total = selectedCollections.length;
            
            for (let i = 0; i < total; i++) {
                const colName = selectedCollections[i];
                setStatusLog(`Lendo coleção: ${colName}...`);
                
                const snapshot = await getDocs(collection(db, colName));
                backupData[colName] = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

                // Special handling for Courses sub-collections (lessons)
                if (colName === 'courses') {
                    for (let j = 0; j < backupData['courses'].length; j++) {
                        const course = backupData['courses'][j];
                        const lessonsSnapshot = await getDocs(collection(db, 'courses', course.id, 'lessons'));
                        if (!lessonsSnapshot.empty) {
                            course._sub_lessons = lessonsSnapshot.docs.map(l => ({ ...l.data(), id: l.id }));
                        }
                    }
                }

                setProgress(Math.round(((i + 1) / total) * 100));
            }

            setStatusLog("Gerando arquivo JSON...");
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `futuroon-backup-${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setStatusLog("✅ Backup concluído com sucesso!");
            showToast("✅ Backup gerado com sucesso!");
        } catch (error) {
            console.error("Backup error:", error);
            setStatusLog("❌ Erro durante o backup.");
            showToast("❌ Erro ao gerar backup.");
        } finally {
            setTimeout(() => {
                setIsBackingUp(false);
                setProgress(0);
            }, 2000);
        }
    };

    const handleFileAnalysis = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            if (e.target?.result) {
                try {
                    const json = JSON.parse(e.target.result as string);
                    setImportedData(json);
                    
                    // Analyze content
                    const preview: Record<string, number> = {};
                    Object.keys(json).forEach(key => {
                        if (Array.isArray(json[key])) {
                            preview[key] = json[key].length;
                        }
                    });
                    setRestorePreview(preview);
                    setStatusLog("Arquivo analisado. Pronto para restaurar.");
                } catch (error) {
                    console.error("Restore parse error:", error);
                    showToast("❌ Arquivo inválido (não é JSON).");
                    setImportedData(null);
                    setRestorePreview(null);
                }
            }
        };
        reader.readAsText(file);
        event.target.value = ''; 
    };

    const executeRestore = async () => {
        if (!importedData) return;
        
        if (!window.confirm("⚠️ ATENÇÃO: Isso irá sobrescrever os dados existentes. Recomenda-se fazer um backup antes. Continuar?")) {
            return;
        }

        setIsRestoring(true);
        setProgress(0);
        setStatusLog("Iniciando restauração em lote...");

        try {
            const collections = Object.keys(importedData);
            const totalSteps = collections.reduce((acc, key) => acc + importedData[key].length, 0);
            let processed = 0;

            // Batch Processing Logic
            let batch = writeBatch(db);
            let batchCount = 0;
            const BATCH_LIMIT = 450; // Safe limit below 500

            const commitBatch = async () => {
                await batch.commit();
                batch = writeBatch(db);
                batchCount = 0;
            };

            for (const colName of collections) {
                const items = importedData[colName];
                setStatusLog(`Restaurando ${colName}...`);

                if (Array.isArray(items)) {
                    for (const item of items) {
                        const { id, _sub_lessons, ...docData } = item;
                        if (!id) continue;

                        // Add to batch
                        const docRef = doc(db, colName, id);
                        batch.set(docRef, docData);
                        batchCount++;

                        // Restore sub-lessons if course
                        if (colName === 'courses' && _sub_lessons && Array.isArray(_sub_lessons)) {
                            for (const lesson of _sub_lessons) {
                                const { id: lId, ...lData } = lesson;
                                const lessonRef = doc(db, 'courses', id, 'lessons', lId);
                                batch.set(lessonRef, lData);
                                batchCount++;
                                
                                if (batchCount >= BATCH_LIMIT) await commitBatch();
                            }
                        }

                        if (batchCount >= BATCH_LIMIT) await commitBatch();

                        processed++;
                        setProgress(Math.min(99, Math.round((processed / totalSteps) * 100)));
                    }
                }
            }

            // Final commit for remaining items
            if (batchCount > 0) await commitBatch();

            setProgress(100);
            setStatusLog("✅ Restauração concluída! Recarregando...");
            showToast(`✅ Restauração finalizada!`);
            setTimeout(() => window.location.reload(), 2000);

        } catch (error) {
            console.error("Restore db error:", error);
            setStatusLog("❌ Falha crítica ao escrever no banco.");
            showToast("❌ Erro durante a restauração.");
        } finally {
            setIsRestoring(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Configurações do Sistema</h2>
                    <p className="text-gray-400 mt-1">Personalize a aparência e gerencie os dados da plataforma.</p>
                </div>
                
                {/* Tabs */}
                <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                    <button 
                        onClick={() => setActiveTab('branding')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'branding' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Identidade Visual
                    </button>
                    <button 
                        onClick={() => setActiveTab('features')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'features' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Recursos
                    </button>
                    <button 
                        onClick={() => setActiveTab('backup')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'backup' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Backup & Dados
                    </button>
                </div>
            </div>

            {activeTab === 'branding' && (
                <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
                    
                    {/* Left Column: Controls */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Presets */}
                        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Temas Pré-definidos</h3>
                            <div className="flex flex-wrap gap-3">
                                {Object.keys(COLOR_PRESETS).map(key => (
                                    <button 
                                        key={key}
                                        onClick={() => applyPreset(key)}
                                        className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2"
                                    >
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_PRESETS[key].primaryColor }}></span>
                                        {key}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Advanced Color Controls */}
                        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center text-xl border border-[var(--color-primary)]/20">🎨</div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Cores Personalizadas</h3>
                                    <p className="text-xs text-gray-400">Defina a paleta hexadecimal e degradês.</p>
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <ColorInput 
                                    label="Cor Primária" 
                                    value={settings.primaryColor} 
                                    onChange={(v) => updateSettings({ primaryColor: v })}
                                    description="Botões, destaques e links."
                                />
                                <ColorInput 
                                    label="Cor Secundária" 
                                    value={settings.secondaryColor} 
                                    onChange={(v) => updateSettings({ secondaryColor: v })}
                                    description="Gradientes e detalhes secundários."
                                />
                                <ColorInput 
                                    label="Fundo (Background)" 
                                    value={settings.backgroundColor} 
                                    onChange={(v) => updateSettings({ backgroundColor: v })}
                                    description="Cor de fundo principal da página."
                                />
                                <ColorInput 
                                    label="Superfície (Cards)" 
                                    value={settings.surfaceColor} 
                                    onChange={(v) => updateSettings({ surfaceColor: v })}
                                    description="Fundo de cartões, painéis e modais."
                                />
                                <ColorInput 
                                    label="Início do Degradê (Texto)" 
                                    value={settings.gradientStart} 
                                    onChange={(v) => updateSettings({ gradientStart: v })}
                                    description="Usado em títulos e elementos especiais."
                                />
                                <ColorInput 
                                    label="Fim do Degradê (Texto)" 
                                    value={settings.gradientEnd} 
                                    onChange={(v) => updateSettings({ gradientEnd: v })}
                                    description="Combina com o início para criar brilho."
                                />
                            </div>
                        </div>

                        {/* Shape & Info */}
                        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Aparência e Informações</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome do Site</label>
                                    <input 
                                        type="text" 
                                        value={settings.siteName}
                                        onChange={(e) => updateSettings({ siteName: e.target.value })}
                                        className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none text-white text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Arredondamento (Radius)</label>
                                    <select 
                                        value={settings.borderRadius}
                                        onChange={(e) => updateSettings({ borderRadius: e.target.value })}
                                        className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none text-white text-sm"
                                    >
                                        <option value="0px">Quadrado (0px)</option>
                                        <option value="0.25rem">Pequeno (4px)</option>
                                        <option value="0.5rem">Médio (8px)</option>
                                        <option value="1rem">Grande (16px)</option>
                                        <option value="1.5rem">Redondo (24px)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Live Preview */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Live Preview</h3>
                                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold">Ao Vivo</span>
                            </div>
                            {/* Use ThemePreview outside to prevent full re-renders */}
                            <ThemePreview settings={settings} />
                            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-300/80 leading-relaxed">
                                <p><strong>Dica:</strong> As alterações são salvas automaticamente no navegador para você testar. Para persistir no banco de dados, seria necessário uma integração de backend.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'features' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center text-xl border border-brand-gold/20">
                                ⚙️
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Recursos da Plataforma</h3>
                                <p className="text-sm text-gray-400">Habilite ou desabilite funcionalidades</p>
                            </div>
                        </div>

                        {/* Marketing Studio Toggle */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center border border-brand-orange/20">
                                        <span className="text-2xl">📱</span>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-white">Marketing Studio</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Ferramenta de geração de conteúdo com IA para redes sociais
                                        </p>
                                        {!settings.marketingStudioEnabled && (
                                            <p className="text-xs text-warning mt-1">
                                                ⚠️ Desabilitado - Usuários não terão acesso
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        updateSettings({ 
                                            marketingStudioEnabled: !settings.marketingStudioEnabled 
                                        });
                                        showToast(
                                            settings.marketingStudioEnabled 
                                                ? '❌ Marketing Studio desabilitado' 
                                                : '✅ Marketing Studio habilitado'
                                        );
                                    }}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                                        settings.marketingStudioEnabled 
                                            ? 'bg-success' 
                                            : 'bg-gray-600'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                            settings.marketingStudioEnabled 
                                                ? 'translate-x-7' 
                                                : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Info sobre API Gemini */}
                            {settings.marketingStudioEnabled && (
                                <div className="bg-info/5 border border-info/20 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-info text-lg">ℹ️</span>
                                        <div className="text-xs text-gray-300">
                                            <p className="font-semibold text-white mb-1">Sobre o Marketing Studio:</p>
                                            <ul className="space-y-1 text-gray-400">
                                                <li>• Usa a API do Google Gemini (plano gratuito)</li>
                                                <li>• Rate limiting automático implementado</li>
                                                <li>• Monitore o uso no <button onClick={() => navigate('/gemini-api-dashboard')} className="text-info hover:underline">Dashboard da API</button></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Futuras funcionalidades */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 opacity-50">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-xl">
                                🚀
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Recursos Futuros</h3>
                                <p className="text-sm text-gray-400">Em desenvolvimento</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <span className="text-sm text-gray-400">Notificações Push</span>
                                <span className="text-xs text-gray-500">Em breve</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <span className="text-sm text-gray-400">Gamificação Avançada</span>
                                <span className="text-xs text-gray-500">Em breve</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'backup' && (
                <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
                    {/* BACKUP SECTION */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-2xl border border-blue-500/20">💾</div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Exportar Dados (Backup)</h3>
                                <p className="text-xs text-gray-400">Selecione as coleções para salvar em JSON.</p>
                            </div>
                        </div>

                        <div className="flex-1 mb-6">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Coleções Disponíveis</label>
                            <div className="grid grid-cols-2 gap-2">
                                {availableCollections.map(col => (
                                    <label key={col.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${selectedCollections.includes(col.id) ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-transparent hover:border-white/10'}`}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedCollections.includes(col.id)} 
                                            onChange={() => toggleCollection(col.id)}
                                            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                        />
                                        <span className={`text-sm ${selectedCollections.includes(col.id) ? 'text-white font-medium' : 'text-gray-400'}`}>{col.label}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button onClick={() => setSelectedCollections(availableCollections.map(c => c.id))} className="text-xs text-blue-400 hover:underline">Marcar Todos</button>
                                <span className="text-gray-600 text-xs">|</span>
                                <button onClick={() => setSelectedCollections([])} className="text-xs text-gray-400 hover:text-white hover:underline">Desmarcar Todos</button>
                            </div>
                        </div>

                        {isBackingUp && (
                            <div className="mb-4 bg-black/30 p-3 rounded-lg border border-white/5">
                                <div className="flex justify-between text-xs text-gray-300 mb-1">
                                    <span>Progresso</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                                    <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{width: `${progress}%`}}></div>
                                </div>
                                <p className="text-[10px] text-gray-500 font-mono">{statusLog}</p>
                            </div>
                        )}

                        <button 
                            onClick={handleBackup}
                            disabled={isBackingUp || selectedCollections.length === 0}
                            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                        >
                            {isBackingUp ? 'Processando...' : 'Baixar Backup Selecionado'}
                        </button>
                    </div>

                    {/* RESTORE SECTION */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-2xl border border-red-500/20">♻️</div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Importar Dados (Restore)</h3>
                                <p className="text-xs text-gray-400">Recupere dados de um arquivo JSON.</p>
                            </div>
                        </div>

                        <div className="flex-1 mb-6">
                            {!restorePreview ? (
                                <div className="h-full border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-white/[0.02]">
                                    <p className="text-sm text-gray-400 mb-4">Selecione um arquivo .json válido para iniciar a análise.</p>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileAnalysis} 
                                        accept=".json" 
                                        className="hidden" 
                                    />
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-semibold transition-colors"
                                    >
                                        Selecionar Arquivo
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10 h-full flex flex-col">
                                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                                        <h4 className="text-sm font-bold text-white">Pré-visualização do Arquivo</h4>
                                        <button onClick={() => { setRestorePreview(null); setImportedData(null); setStatusLog(''); }} className="text-xs text-red-400 hover:underline">Cancelar</button>
                                    </div>
                                    <div className="space-y-2 overflow-y-auto custom-scrollbar max-h-48">
                                        {Object.entries(restorePreview).map(([key, count]) => (
                                            <div key={key} className="flex justify-between text-sm bg-black/20 p-2 rounded">
                                                <span className="text-gray-400 capitalize">{key}</span>
                                                <span className="text-white font-mono font-bold">{count} itens</span>
                                            </div>
                                        ))}
                                    </div>
                                    {isRestoring && (
                                        <div className="mt-4">
                                            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                                                <div className="bg-red-500 h-1.5 rounded-full transition-all duration-300" style={{width: `${progress}%`}}></div>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-mono">{statusLog}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={executeRestore}
                            disabled={!restorePreview || isRestoring}
                            className={`w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${!restorePreview ? 'bg-gray-700 text-gray-400' : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20'}`}
                        >
                            {isRestoring ? 'Restaurando...' : 'Confirmar Importação'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const EventsPanel: React.FC = () => {
    const { events, handleDeleteEvent, instructors, showToast } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'Live' | 'Workshop' | 'Palestra'>('all');

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                event.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || event.eventType === filterType;
            return matchesSearch && matchesType;
        });
    }, [events, searchTerm, filterType]);

    const getEventTypeColor = (type: Event['eventType']) => {
        switch (type) {
            case 'Live': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'Workshop': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Palestra': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            const [month, day] = dateStr.split(' ');
            return `${day}/${month}`;
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Gerenciar Eventos</h2>
                    <p className="text-sm text-gray-400 mt-1">Lives, workshops e palestras da comunidade</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/editor-evento/new')}
                    className="bg-gradient-to-r from-[#8a4add] to-[#f27983] hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#8a4add]/20"
                >
                    <span>+</span> Criar Evento
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <input 
                        type="search" 
                        placeholder="Buscar eventos..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#8a4add] focus:outline-none text-sm text-white transition-colors"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>

                {/* Type Filter */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                            filterType === 'all' ? 'bg-[#8a4add] text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilterType('Live')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                            filterType === 'Live' ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                    >
                        Lives
                    </button>
                    <button
                        onClick={() => setFilterType('Workshop')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                            filterType === 'Workshop' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                    >
                        Workshops
                    </button>
                    <button
                        onClick={() => setFilterType('Palestra')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                            filterType === 'Palestra' ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                    >
                        Palestras
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Total</p>
                    <p className="text-2xl font-bold text-white">{events.length}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-xs text-red-400 uppercase tracking-wider font-bold mb-1">Lives</p>
                    <p className="text-2xl font-bold text-red-400">{events.filter(e => e.eventType === 'Live').length}</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-xs text-blue-400 uppercase tracking-wider font-bold mb-1">Workshops</p>
                    <p className="text-2xl font-bold text-blue-400">{events.filter(e => e.eventType === 'Workshop').length}</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                    <p className="text-xs text-purple-400 uppercase tracking-wider font-bold mb-1">Palestras</p>
                    <p className="text-2xl font-bold text-purple-400">{events.filter(e => e.eventType === 'Palestra').length}</p>
                </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400 mb-4">Nenhum evento encontrado</p>
                    <button 
                        onClick={() => navigate('/admin/editor-evento/new')}
                        className="bg-[#8a4add] text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#7c3aed] transition-colors"
                    >
                        Criar Primeiro Evento
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(event => {
                        const host = instructors.find(i => i.id === event.hostId);
                        
                        return (
                            <div key={event.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all group">
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={event.imageUrl} 
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getEventTypeColor(event.eventType)}`}>
                                            {event.eventType}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg">
                                        <p className="text-xs font-bold text-white">{formatDate(event.date)}</p>
                                        <p className="text-xs text-gray-400">{event.time}</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{event.title}</h3>
                                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{event.description}</p>

                                    {/* Host */}
                                    {host && (
                                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                                            <img src={host.avatarUrl} alt={host.name} className="w-8 h-8 rounded-full border border-white/20" />
                                            <div>
                                                <p className="text-xs font-bold text-white">{host.name}</p>
                                                <p className="text-xs text-gray-500">{host.title || 'Instrutor'}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/editor-evento/${event.id}`)}
                                            className="flex-1 bg-[#8a4add]/20 text-[#c4b5fd] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#8a4add]/30 transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Excluir evento "${event.title}"?`)) {
                                                    handleDeleteEvent(event.id);
                                                }
                                            }}
                                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/30 transition-colors"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const TransparencyPanel: React.FC = () => {
    const { financialStatements, annualReports, handleDeleteFinancialStatement, handleDeleteAnnualReport, showToast } = useAppContext();
    const navigate = useNavigate();

    // Stats
    const totalFinancial = financialStatements.length;
    const totalImpact = annualReports.length;
    const latestYear = Math.max(
        ...financialStatements.map(f => f.year),
        ...annualReports.map(r => r.year),
        new Date().getFullYear()
    );

    const handleDelete = (type: 'financial' | 'report', id: string, year: number) => {
        if (!window.confirm(`Deseja realmente excluir o relatório de ${year}?`)) return;
        
        if (type === 'financial') {
            handleDeleteFinancialStatement(id);
        } else {
            handleDeleteAnnualReport(id);
        }
        showToast(`✅ Relatório de ${year} excluído com sucesso`);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header com Stats */}
            <div className="bg-gradient-to-r from-[#121212] to-[#1a1a1d] rounded-2xl border border-white/10 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-[#8a4add]/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c4b5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Portal da Transparência</h2>
                                <p className="text-sm text-gray-400">Gerencie relatórios públicos da organização</p>
                            </div>
                        </div>
                        
                        {/* Mini Stats */}
                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                                <span className="text-2xl">💰</span>
                                <div>
                                    <p className="text-xs text-gray-400">Relatórios Financeiros</p>
                                    <p className="text-lg font-bold text-white">{totalFinancial}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                                <span className="text-2xl">📊</span>
                                <div>
                                    <p className="text-xs text-gray-400">Relatórios de Impacto</p>
                                    <p className="text-lg font-bold text-white">{totalImpact}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                                <span className="text-2xl">📅</span>
                                <div>
                                    <p className="text-xs text-gray-400">Último Ano</p>
                                    <p className="text-lg font-bold text-white">{latestYear}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/admin/editor-transparencia')}
                        className="bg-gradient-to-r from-[#8a4add] to-[#f27983] hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#8a4add]/20 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Novo Relatório
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => navigate('/transparencia')}
                    className="block bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-blue-500/30 rounded-xl p-4 transition-all group text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Visualizar Portal</p>
                            <p className="text-xs text-gray-500">Ver como público</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/admin/editor-transparencia/financial/new')}
                    className="block bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-green-500/30 rounded-xl p-4 transition-all group text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Novo Financeiro</p>
                            <p className="text-xs text-gray-500">Criar relatório</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/admin/editor-transparencia/report/new')}
                    className="block bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-purple-500/30 rounded-xl p-4 transition-all group text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Novo Impacto</p>
                            <p className="text-xs text-gray-500">Criar relatório</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Relatórios */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Financial Statements */}
                <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-b border-white/10 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <span className="text-xl">💰</span>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">Relatórios Financeiros</h3>
                                <p className="text-xs text-gray-400">{totalFinancial} relatório(s) publicado(s)</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {financialStatements.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-500 mb-4">Nenhum relatório financeiro cadastrado</p>
                                <button
                                    onClick={() => navigate('/admin/transparency-editor/financial/new')}
                                    className="text-xs text-[#c4b5fd] hover:text-white font-semibold"
                                >
                                    + Criar primeiro relatório
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {financialStatements.sort((a,b) => b.year - a.year).map(fs => (
                                    <div key={fs.id} className="group bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-green-500/30 rounded-lg p-4 transition-all">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg font-black text-white">{fs.year}</span>
                                                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-semibold">Financeiro</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div>
                                                        <p className="text-gray-500">Receita</p>
                                                        <p className="text-green-400 font-bold">{fs.totalRevenue}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Despesas</p>
                                                        <p className="text-red-400 font-bold">{fs.totalExpenses}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button 
                                                    onClick={() => navigate(`/admin/editor-transparencia/financial/${fs.id}`)}
                                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete('financial', fs.id, fs.year)}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Excluir"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Annual Reports */}
                <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#8a4add]/10 to-[#f27983]/5 border-b border-white/10 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <span className="text-xl">📊</span>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">Relatórios de Impacto</h3>
                                <p className="text-xs text-gray-400">{totalImpact} relatório(s) publicado(s)</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {annualReports.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-500 mb-4">Nenhum relatório de impacto cadastrado</p>
                                <button
                                    onClick={() => navigate('/admin/editor-transparencia/report/new')}
                                    className="text-xs text-[#c4b5fd] hover:text-white font-semibold"
                                >
                                    + Criar primeiro relatório
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {annualReports.sort((a,b) => b.year - a.year).map(ar => (
                                    <div key={ar.id} className="group bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-purple-500/30 rounded-lg p-4 transition-all">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg font-black text-white">{ar.year}</span>
                                                    <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-semibold">Impacto</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        <span className="text-gray-400">{ar.coordinationLetter.authorName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                        </svg>
                                                        <span className="text-gray-400">{ar.testimonials.length} depoimento(s)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button 
                                                    onClick={() => navigate(`/admin/editor-transparencia/report/${ar.id}`)}
                                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete('report', ar.id, ar.year)}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Excluir"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeamManagementPanel: React.FC = () => {
    const { users, handleSaveTeamOrder, handleSaveUser, handleDeleteUser, handlePermanentDeleteUser, showToast, user } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const toggleMentorStatus = async (member: User) => {
        const updatedMember = { ...member, isMentor: !member.isMentor };
        await handleSaveUser(updatedMember);
        showToast(updatedMember.isMentor ? '✅ Mentor habilitado!' : '🚫 Mentor desabilitado!');
    };

    // Filter team members (admin/instructor)
    const teamMembers = useMemo(() => 
        users.filter(u => u.role === 'admin' || u.role === 'instructor')
             .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
    , [users]);

    const filteredTeam = useMemo(() => teamMembers.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [teamMembers, searchTerm]);

    const moveMember = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === teamMembers.length - 1) return;
        
        const newOrder = [...teamMembers];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        // Swap
        [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
        
        handleSaveTeamOrder(newOrder);
    };

    // Estatísticas
    const stats = useMemo(() => {
        const active = teamMembers.filter(m => m.accountStatus === 'active').length;
        const inactive = teamMembers.filter(m => m.accountStatus === 'inactive').length;
        const mentors = teamMembers.filter(m => m.isMentor && m.accountStatus === 'active').length;
        const admins = teamMembers.filter(m => m.role === 'admin').length;
        const instructors = teamMembers.filter(m => m.role === 'instructor').length;
        const showOnTeam = teamMembers.filter(m => m.showOnTeamPage).length;
        
        return { active, inactive, mentors, admins, instructors, showOnTeam };
    }, [teamMembers]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Equipe & Voluntários</h2>
                    <p className="text-sm text-gray-400 mt-1">Gerencie membros, mentores e visibilidade da equipe</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/editor-equipe/novo')}
                    className="bg-gradient-to-r from-[#8a4add] to-[#f27983] hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#8a4add]/20"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Novo Membro
                </button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-white">{teamMembers.length}</p>
                    <p className="text-xs text-gray-400 mt-1">Total</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-4 hover:border-green-500/30 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-green-400">{stats.active}</p>
                    <p className="text-xs text-gray-400 mt-1">Ativos</p>
                </div>

                <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-4 hover:border-red-500/30 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-red-400">{stats.inactive}</p>
                    <p className="text-xs text-gray-400 mt-1">Inativos</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-purple-400">{stats.admins}</p>
                    <p className="text-xs text-gray-400 mt-1">Admins</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-blue-400">{stats.instructors}</p>
                    <p className="text-xs text-gray-400 mt-1">Instrutores</p>
                </div>

                <div className="bg-gradient-to-br from-[#8a4add]/10 to-[#f27983]/10 border border-[#8a4add]/20 rounded-xl p-4 hover:border-[#8a4add]/30 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#8a4add]/20 flex items-center justify-center">
                            <span className="text-sm">💡</span>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-[#c4b5fd]">{stats.mentors}</p>
                    <p className="text-xs text-gray-400 mt-1">Mentores</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <input 
                    type="search" 
                    placeholder="Buscar membro por nome ou email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:outline-none text-sm text-white transition-colors"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                        <p className="text-sm text-blue-300 font-semibold mb-1">Dicas de Gestão</p>
                        <ul className="text-xs text-blue-200/80 space-y-1">
                            <li>• Use as setas para ordenar como os membros aparecem na página "Equipe"</li>
                            <li>• Clique em "Editar" para alterar informações, mentor e visibilidade</li>
                            <li>• "Desativar" remove acesso temporariamente (reversível)</li>
                            <li>• "Deletar" remove permanentemente (irreversível)</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <TableHeader cols={['Ordem', 'Membro', 'Cargo/Função', 'Ações']} />
                        <tbody className="divide-y divide-white/5">
                            {filteredTeam.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-gray-500 text-sm">Nenhum membro encontrado.</td></tr>
                            ) : (
                                filteredTeam.map((member, index) => (
                                    <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <button onClick={() => moveMember(index, 'up')} className={`text-gray-500 hover:text-white text-xs ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}`} disabled={index === 0}>▲</button>
                                                <button onClick={() => moveMember(index, 'down')} className={`text-gray-500 hover:text-white text-xs ${index === filteredTeam.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`} disabled={index === filteredTeam.length - 1}>▼</button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img src={member.avatarUrl} className="h-10 w-10 rounded-full border-2 border-white/10 object-cover" alt={member.name} />
                                                    {member.accountStatus === 'active' && (
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#09090B]"></div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-sm font-semibold text-white truncate">{member.name}</div>
                                                    <div className="text-xs text-gray-500 truncate">{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 inline-flex w-fit text-[10px] font-bold uppercase tracking-wider rounded-lg ${member.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                                                        {member.role === 'admin' ? '👑 Admin' : '📚 Instrutor'}
                                                    </span>
                                                    {member.accountStatus === 'inactive' && (
                                                        <span className="px-2 py-1 text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg">
                                                            🚫 Inativo
                                                        </span>
                                                    )}
                                                    {member.isMentor && (
                                                        <span className="px-2 py-1 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg">
                                                            💡 Mentor
                                                        </span>
                                                    )}
                                                    {member.showOnTeamPage && (
                                                        <span className="px-2 py-1 text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg">
                                                            👁️ Visível
                                                        </span>
                                                    )}
                                                </div>
                                                {member.title && (
                                                    <span className="text-xs text-gray-400 font-medium">{member.title}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                <button 
                                                    onClick={() => navigate(`/admin/editor-equipe/${member.id}`)} 
                                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                                >
                                                    Editar
                                                </button>
                                                {user?.role === 'admin' && (
                                                    <>
                                                        {(member.accountStatus === 'active' || !member.accountStatus) && (
                                                            <button 
                                                                onClick={() => handleDeleteUser(member.id)} 
                                                                className="text-orange-500 hover:text-orange-400 transition-colors"
                                                                title="Desativar membro (reversível)"
                                                            >
                                                                Desativar
                                                            </button>
                                                        )}
                                                        {member.accountStatus === 'inactive' && (
                                                            <button 
                                                                onClick={() => handlePermanentDeleteUser(member.id, member.name)} 
                                                                className="text-red-600 hover:text-red-500 transition-colors font-bold"
                                                                title="⚠️ DELETAR PERMANENTEMENTE (irreversível)"
                                                            >
                                                                🗑️ Deletar
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const VolunteersPanel: React.FC = () => {
    const { users, handleSaveUser, showToast } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar todos os usuários que podem ser mentores (instrutores e admins)
    const potentialMentors = useMemo(() => 
        users.filter(u => (u.role === 'admin' || u.role === 'instructor') && u.accountStatus === 'active')
             .sort((a, b) => {
                 // Mentores ativos primeiro
                 if (a.isMentor && !b.isMentor) return -1;
                 if (!a.isMentor && b.isMentor) return 1;
                 return a.name.localeCompare(b.name);
             })
    , [users]);

    const filteredMentors = useMemo(() => potentialMentors.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.title?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [potentialMentors, searchTerm]);

    const activeMentors = filteredMentors.filter(u => u.isMentor);
    const inactiveMentors = filteredMentors.filter(u => !u.isMentor);

    const toggleMentorStatus = async (member: User) => {
        const updatedMember = { ...member, isMentor: !member.isMentor };
        await handleSaveUser(updatedMember);
        showToast(updatedMember.isMentor ? '✅ Voluntário habilitado como mentor!' : '🚫 Voluntário desabilitado como mentor!');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Gestão de Voluntários & Mentores</h2>
                    <p className="text-xs text-gray-400 mt-1">
                        {activeMentors.length} mentores ativos • {inactiveMentors.length} inativos • {potentialMentors.length} total
                    </p>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm text-blue-300 font-semibold mb-1">Sobre Mentores Voluntários</p>
                        <p className="text-xs text-blue-200/80">
                            Mentores habilitados aparecem na página de Eventos e podem receber agendamentos de mentorias 1:1 dos alunos.
                            Use o toggle para habilitar/desabilitar rapidamente.
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <input 
                    type="search" 
                    placeholder="Buscar por nome, email ou cargo..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:outline-none text-sm text-white transition-colors"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            {/* Mentores Ativos */}
            {activeMentors.length > 0 && (
                <div className="bg-white/[0.02] rounded-xl border border-green-500/20 overflow-hidden">
                    <div className="bg-green-500/10 px-6 py-3 border-b border-green-500/20">
                        <h3 className="text-sm font-bold text-green-400">✅ Mentores Ativos ({activeMentors.length})</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <TableHeader cols={['Mentor', 'Cargo', 'Contato', 'Status', 'Ações']} />
                            <tbody className="divide-y divide-white/5">
                                {activeMentors.map((mentor) => (
                                    <tr key={mentor.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img src={mentor.avatarUrl} className="h-10 w-10 rounded-full border-2 border-green-500/30 object-cover" alt={mentor.name} />
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#09090B]"></div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">{mentor.name}</div>
                                                    <div className="text-xs text-gray-500">{mentor.role === 'admin' ? 'Admin' : 'Instrutor'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-300">{mentor.title || 'Não informado'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-400">{mentor.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleMentorStatus(mentor)}
                                                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:ring-offset-2 focus:ring-offset-[#09090B] bg-[#8a4add]"
                                                title="Desabilitar como mentor"
                                            >
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                                            <button onClick={() => navigate(`/admin/editor-equipe/${mentor.id}`)} className="text-blue-400 hover:text-blue-300 transition-colors">Editar Perfil</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Mentores Inativos */}
            {inactiveMentors.length > 0 && (
                <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
                    <div className="bg-white/5 px-6 py-3 border-b border-white/5">
                        <h3 className="text-sm font-bold text-gray-400">⏸️ Mentores Inativos ({inactiveMentors.length})</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <TableHeader cols={['Membro', 'Cargo', 'Contato', 'Status', 'Ações']} />
                            <tbody className="divide-y divide-white/5">
                                {inactiveMentors.map((member) => (
                                    <tr key={member.id} className="hover:bg-white/5 transition-colors group opacity-60">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img src={member.avatarUrl} className="h-10 w-10 rounded-full border border-white/10 object-cover" alt={member.name} />
                                                <div>
                                                    <div className="text-sm font-medium text-white">{member.name}</div>
                                                    <div className="text-xs text-gray-500">{member.role === 'admin' ? 'Admin' : 'Instrutor'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-400">{member.title || 'Não informado'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-500">{member.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleMentorStatus(member)}
                                                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:ring-offset-2 focus:ring-offset-[#09090B] bg-gray-600"
                                                title="Habilitar como mentor"
                                            >
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                                            <button onClick={() => navigate(`/admin/editor-equipe/${member.id}`)} className="text-blue-400 hover:text-blue-300 transition-colors">Editar Perfil</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {filteredMentors.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <p>Nenhum membro encontrado.</p>
                </div>
            )}
        </div>
    );
};

const BlogManagementPanel: React.FC = () => {
    const { articles, handleDeleteArticle, handleToggleArticleStatus } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredArticles = useMemo(() => articles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category.toLowerCase().includes(searchTerm.toLowerCase())
    ), [articles, searchTerm]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Gerenciar Blog</h2>
                    <p className="text-xs text-gray-400 mt-1">Total: {articles.length} artigos</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/editor-artigo/new')}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
                >
                    <span>+</span> Novo Artigo
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <input 
                    type="search" 
                    placeholder="Buscar artigo por título, autor ou categoria..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:outline-none text-sm text-white transition-colors"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            {/* Table */}
            <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <TableHeader cols={['Título', 'Autor', 'Categoria', 'Status', 'Ações']} />
                        <tbody className="divide-y divide-white/5">
                            {filteredArticles.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-500 text-sm">Nenhum artigo encontrado.</td></tr>
                            ) : (
                                filteredArticles.map((article) => (
                                    <tr key={article.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={article.imageUrl} className="h-10 w-16 object-cover rounded border border-white/10" alt={article.title} />
                                                <div className="max-w-xs">
                                                    <div className="text-sm font-medium text-white line-clamp-1">{article.title}</div>
                                                    <div className="text-xs text-gray-500">{article.date}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <img src={article.authorAvatarUrl} alt={article.author} className="w-5 h-5 rounded-full"/>
                                                {article.author}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-[10px] font-semibold rounded bg-white/5 text-gray-300 border border-white/10">
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 inline-flex text-[10px] font-bold uppercase tracking-wider rounded border ${article.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                                {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                                            <button 
                                                onClick={() => handleToggleArticleStatus(article.id)} 
                                                className={`${article.status === 'published' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'} transition-colors`}
                                                title={article.status === 'published' ? 'Mover para Rascunho' : 'Publicar'}
                                            >
                                                {article.status === 'published' ? 'Despublicar' : 'Publicar'}
                                            </button>
                                            <button onClick={() => navigate(`/admin/editor-artigo/${article.id}`)} className="text-blue-400 hover:text-blue-300 transition-colors">Editar</button>
                                            <button onClick={() => handleDeleteArticle(article.id)} className="text-red-500 hover:text-red-400 transition-colors">Excluir</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ModerationPanel: React.FC = () => {
    const { projects, handleApproveProject, handleRejectProject, users } = useAppContext();
    
    const pendingProjects = useMemo(() => projects.filter(p => p.status === 'pending'), [projects]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-xl font-bold text-white">Moderação de Conteúdo</h2>
                <p className="text-xs text-gray-400 mt-1">Projetos aguardando aprovação para o showcase da comunidade.</p>
            </div>

            <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <TableHeader cols={['Projeto', 'Aluno', 'Data', 'Ações']} />
                        <tbody className="divide-y divide-white/5">
                            {pendingProjects.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-gray-500 text-sm">Nenhum projeto pendente.</td></tr>
                            ) : (
                                pendingProjects.map((project) => {
                                    const author = users.find(u => u.id === project.authorId);
                                    return (
                                        <tr key={project.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={project.imageUrl} className="h-10 w-16 object-cover rounded border border-white/10" alt={project.title} />
                                                    <div className="max-w-xs">
                                                        <div className="text-sm font-medium text-white line-clamp-1">{project.title}</div>
                                                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-xs text-[#c4b5fd] hover:underline">Ver Projeto</a>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <img src={author?.avatarUrl} alt={author?.name} className="w-5 h-5 rounded-full"/>
                                                    {author?.name || 'Desconhecido'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {project.createdAt}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                                                <button 
                                                    onClick={() => handleApproveProject(project.id)} 
                                                    className="text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-3 py-1 rounded border border-green-500/20"
                                                >
                                                    Aprovar
                                                </button>
                                                <button 
                                                    onClick={() => handleRejectProject(project.id)} 
                                                    className="text-red-500 hover:text-red-400 transition-colors bg-red-500/10 px-3 py-1 rounded border border-red-500/20"
                                                >
                                                    Rejeitar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SupportersPanel: React.FC = () => {
    const { supporters, handleDeleteSupporter } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSupporters = useMemo(() => {
        return supporters.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [supporters, searchTerm]);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Empresa': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Instituição': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Voluntário': return 'bg-green-500/10 text-green-400 border-green-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Gerenciar Apoiadores</h2>
                    <p className="text-sm text-gray-400 mt-1">Registre e agradeça quem apoia nossa missão</p>
                </div>
                <button
                    onClick={() => navigate('/admin/editor-apoiador/new')}
                    className="bg-gradient-to-r from-[#8a4add] to-[#f27983] hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#8a4add]/20"
                >
                    <span>+</span> Novo Apoiador
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <input
                    type="search"
                    placeholder="Buscar apoiadores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#8a4add] focus:outline-none text-sm text-white transition-colors"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Total</p>
                    <p className="text-2xl font-bold text-white">{supporters.length}</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-xs text-blue-400 uppercase tracking-wider font-bold mb-1">Empresas</p>
                    <p className="text-2xl font-bold text-blue-400">{supporters.filter(s => s.category === 'Empresa').length}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <p className="text-xs text-green-400 uppercase tracking-wider font-bold mb-1">Voluntários</p>
                    <p className="text-2xl font-bold text-green-400">{supporters.filter(s => s.category === 'Voluntário').length}</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                    <p className="text-xs text-purple-400 uppercase tracking-wider font-bold mb-1">Total Doado</p>
                    <p className="text-2xl font-bold text-purple-400">
                        R$ {supporters.reduce((sum, s) => sum + (s.totalDonated || 0), 0).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <TableHeader cols={['Apoiador', 'Categoria', 'Apoios', 'Total Doado', 'Ações']} />
                        <tbody className="divide-y divide-white/5">
                            {filteredSupporters.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-500 text-sm">Nenhum apoiador encontrado.</td></tr>
                            ) : (
                                filteredSupporters.map((supporter) => (
                                    <tr key={supporter.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {supporter.logoUrl && (
                                                    <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center">
                                                        <img src={supporter.logoUrl} alt={supporter.name} className="max-w-full max-h-full object-contain" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-white">{supporter.name}</div>
                                                    <div className="text-xs text-gray-500">Desde {supporter.since}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getCategoryColor(supporter.category)}`}>
                                                {supporter.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {supporter.contributions?.length || 0} apoios
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-400">
                                            R$ {(supporter.totalDonated || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                                            <button
                                                onClick={() => navigate(`/apoio/${supporter.id}`)}
                                                className="text-purple-400 hover:text-purple-300 transition-colors"
                                                title="Ver página de agradecimento"
                                            >
                                                Ver Página
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/editor-apoiador/${supporter.id}`)}
                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSupporter(supporter.id)}
                                                className="text-red-500 hover:text-red-400 transition-colors"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StudentsPanel: React.FC = () => {
    const { users, handleDeleteUser, handlePermanentDeleteUser, user, courses, handleUnlockLesson, handleLockLesson } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [unlockModalOpen, setUnlockModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

    const students = useMemo(() => users.filter(u => u.role === 'student'), [users]);
    
    const filteredStudents = useMemo(() => students.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [students, searchTerm]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Base de Alunos</h2>
                    <p className="text-xs text-gray-400 mt-1">Total: {students.length} alunos cadastrados</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/editor-usuario/novo')}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
                >
                    <span>+</span> Matricular Aluno
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <input 
                    type="search" 
                    placeholder="Buscar aluno por nome ou email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary focus:outline-none text-sm text-white transition-colors"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            {/* Unlock Modal */}
            {selectedStudent && (
                <UnlockLessonModal
                    isOpen={unlockModalOpen}
                    onClose={() => {
                        setUnlockModalOpen(false);
                        setSelectedStudent(null);
                    }}
                    student={selectedStudent}
                    courses={courses}
                    onUnlock={handleUnlockLesson}
                    onLock={handleLockLesson}
                />
            )}

            {/* Table */}
            <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <TableHeader cols={['Aluno', 'Email', 'Status', 'XP', 'Ações']} />
                        <tbody className="divide-y divide-white/5">
                            {filteredStudents.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-500 text-sm">Nenhum aluno encontrado.</td></tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img src={student.avatarUrl} className="h-8 w-8 rounded-full border border-white/10" alt={student.name} />
                                                <div className="text-sm font-medium text-white">{student.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{student.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 inline-flex text-[10px] font-bold uppercase tracking-wider rounded border ${student.accountStatus === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                {student.accountStatus === 'active' ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-bold">{student.xp.toLocaleString('pt-BR')} XP</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => navigate(`/admin/editor-usuario/${student.id}`)} className="text-blue-400 hover:text-blue-300 transition-colors">Editar</button>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setUnlockModalOpen(true);
                                                    }} 
                                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                                    title="Gerenciar acesso às aulas"
                                                >
                                                    🔓 Acesso
                                                </button>
                                                {user?.role === 'admin' && (
                                                    <>
                                                        {(student.accountStatus === 'active' || !student.accountStatus) && (
                                                            <button 
                                                                onClick={() => handleDeleteUser(student.id)} 
                                                                className="text-orange-500 hover:text-orange-400 transition-colors"
                                                                title="Desativar aluno (reversível)"
                                                            >
                                                                Desativar
                                                            </button>
                                                        )}
                                                        {student.accountStatus === 'inactive' && (
                                                            <button 
                                                                onClick={() => handlePermanentDeleteUser(student.id, student.name)} 
                                                                className="text-red-600 hover:text-red-500 transition-colors font-bold"
                                                                title="⚠️ DELETAR PERMANENTEMENTE (irreversível)"
                                                            >
                                                                🗑️ Deletar
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ExploreCoursesPanel: React.FC = () => {
    const { courses, user, showToast } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTrack, setActiveTrack] = useState('Todos');
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTrack]);

    const tracks = useMemo(() => ['Todos', ...Array.from(new Set(courses.map(c => c.track)))].sort(), [courses]);

    const filteredCourses = useMemo(() => courses.filter(course => 
        (course.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (activeTrack === 'Todos' || course.track === activeTrack)
    ), [courses, searchTerm, activeTrack]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    const currentCourses = filteredCourses.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll suave para o topo da lista
        document.getElementById('workspace-catalog')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCourseClick = (course: Course) => {
        const firstLesson = course.modules?.[0]?.lessons?.[0];
        if (firstLesson) {
            navigate(`/curso/${course.id}/aula/${firstLesson.id}`);
        } else {
            showToast("⚠️ Este curso ainda não tem aulas disponíveis.");
        }
    };

    const getCourseProgress = (course: Course) => {
        if (!user) return { progress: 0, isEnrolled: false };
        const courseLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
        if (courseLessonIds.length === 0) return { progress: 0, isEnrolled: false };
        const completedInCourse = user.completedLessonIds.filter(id => courseLessonIds.includes(id));
        const isEnrolled = completedInCourse.length > 0; 
        const progress = Math.round((completedInCourse.length / courseLessonIds.length) * 100);
        return { progress, isEnrolled };
    };

    return (
        <div className="space-y-6" id="workspace-catalog">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="relative w-full md:flex-1">
                    <input 
                        type="search" 
                        placeholder="Buscar curso..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:ring-1 focus:ring-[#8a4add] focus:outline-none text-sm text-white"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                
                <div className="w-full md:w-auto relative">
                    <select 
                        value={activeTrack}
                        onChange={(e) => setActiveTrack(e.target.value)}
                        className="w-full md:w-48 appearance-none bg-black/30 text-gray-300 py-2 pl-4 pr-10 rounded-lg border border-white/10 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors focus:outline-none focus:border-primary focus:text-white"
                    >
                        {tracks.map(track => (
                            <option key={track} value={track}>{track === 'Todos' ? 'Trilha: Todas' : track}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Header info */}
            <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-bold text-white">Catálogo de Cursos</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {filteredCourses.length} resultados
                </p>
            </div>

            {courses.length === 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <LoadingState key={i} type="skeleton" />
                    ))}
                </div>
            ) : currentCourses.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-400 font-semibold mb-2">Nenhum curso encontrado</p>
                    <p className="text-gray-600 text-sm">Tente ajustar os filtros de busca</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentCourses.map(course => {
                        const { progress, isEnrolled } = getCourseProgress(course);
                        return (
                            <CourseCard 
                                key={course.id} 
                                course={course} 
                                onCourseSelect={handleCourseClick}
                                progress={progress}
                                isEnrolled={isEnrolled}
                            />
                        );
                    })}
                </div>
            )}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10 pb-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        &larr;
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1;
                        // Logic to show limited pages (simplified for dashboard)
                        if (totalPages > 7 && (page < currentPage - 1 || page > currentPage + 1) && page !== 1 && page !== totalPages) {
                            if (page === currentPage - 2 || page === currentPage + 2) return <span key={page} className="text-gray-600">...</span>;
                            return null;
                        }

                        return (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all border ${
                                    currentPage === page 
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        &rarr;
                    </button>
                </div>
            )}

            {filteredCourses.length === 0 && <div className="text-center py-20 text-gray-500">Nenhum curso encontrado.</div>}
        </div>
    );
};

const MyAgendaPanel: React.FC<{ user: User }> = ({ user }) => {
    const { mentorSessions, users, handleAddSessionSlot, handleRemoveSessionSlot } = useAppContext();
    
    const timeSlots = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
    const next7Days = useMemo(() => Array.from({ length: 7 }).map((_, i) => { const date = new Date(); date.setDate(date.getDate() + i); return date; }), []);
    const sessionsByDateTime = useMemo(() => { const map = new Map<string, MentorSession>(); mentorSessions.filter(s => s.mentorId === user.id).forEach(s => { map.set(`${s.date}-${s.time}`, s); }); return map; }, [mentorSessions, user.id]);

    return (
        <div className="bg-white/[0.02] rounded-xl border border-white/5 p-6">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Gerenciar Disponibilidade</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {next7Days.map(day => {
                    const dateKey = day.toISOString().split('T')[0];
                    return (
                        <div key={dateKey} className="bg-black/20 rounded-lg border border-white/5 overflow-hidden">
                            <div className="p-2 bg-white/5 text-center border-b border-white/5">
                                <p className="font-bold text-white text-xs">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                                <p className="text-[10px] text-gray-500">{day.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</p>
                            </div>
                            <div className="p-2 space-y-1.5">
                                {timeSlots.map(time => {
                                    const session = sessionsByDateTime.get(`${dateKey}-${time}`);
                                    const student = session?.studentId ? users.find(u => u.id === session.studentId) : null;
                                    if (session?.isBooked && student) {
                                        return (<div key={time} className="w-full text-[10px] p-1 rounded bg-red-500/10 text-red-400 text-center border border-red-500/20"><p className="font-bold">Ocupado</p><p className="truncate opacity-70">{student.name.split(' ')[0]}</p></div>);
                                    }
                                    if (session && !session.isBooked) {
                                        return (<button key={time} onClick={() => handleRemoveSessionSlot(user.id, dateKey, time)} className="w-full text-[10px] font-semibold p-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors">Livre</button>);
                                    }
                                    return (<button key={time} onClick={() => handleAddSessionSlot(user.id, dateKey, time)} className="w-full text-[10px] font-medium p-1 rounded bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300 transition-colors">{time}</button>);
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const TracksManagementPanel: React.FC = () => {
    const { tracks, courses, handleCreateTrack, handleUpdateTrack, handleDeleteTrack, showToast } = useAppContext();
    const [newTrackName, setNewTrackName] = useState('');
    const [editingTrack, setEditingTrack] = useState<Track | null>(null);
    const [editingName, setEditingName] = useState('');

    const handleCreate = () => {
        if (!newTrackName.trim()) {
            showToast("❌ O nome da trilha não pode ser vazio.");
            return;
        }
        handleCreateTrack(newTrackName.trim());
        setNewTrackName('');
    };
    
    const startEditing = (track: Track) => { setEditingTrack(track); setEditingName(track.name); };
    const cancelEditing = () => { setEditingTrack(null); setEditingName(''); };
    const handleUpdate = () => {
        if (!editingTrack || !editingName.trim()) return;
        if (editingTrack.name !== editingName.trim()) handleUpdateTrack(editingTrack.id, editingTrack.name, editingName.trim());
        cancelEditing();
    };

    return (
        <div className="bg-white/[0.02] rounded-xl border border-white/5 p-6">
             <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Gestão de Trilhas</h3>
             <div className="flex gap-3 mb-8">
                <input type="text" value={newTrackName} onChange={(e) => setNewTrackName(e.target.value)} placeholder="Nome da nova trilha..." className="flex-grow p-2.5 bg-black/20 rounded-md border border-white/10 focus:ring-1 focus:ring-primary focus:outline-none text-sm text-white" />
                <button onClick={handleCreate} className="font-semibold py-2 px-6 rounded-md bg-primary text-white hover:bg-primary/90 text-sm">Adicionar</button>
            </div>
             <div className="grid gap-3">
                {tracks.map(track => (
                    <div key={track.id} className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors">
                        {editingTrack?.id === track.id ? (
                            <div className="flex gap-2 w-full mr-4">
                                <input type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)} className="flex-grow p-1.5 bg-black/30 rounded border border-primary focus:outline-none text-sm text-white" autoFocus />
                            </div>
                        ) : (
                            <div>
                                <p className="font-medium text-white text-sm">{track.name}</p>
                                <p className="text-sm text-gray-500">{courses.filter(c => c.track === track.name).length} cursos</p>
                            </div>
                        )}
                        <div className="flex gap-3 items-center">
                            {editingTrack?.id === track.id ? (
                                <><button onClick={handleUpdate} className="text-xs text-green-400 hover:text-green-300 font-medium">Salvar</button><button onClick={cancelEditing} className="text-xs text-gray-400 hover:text-gray-300">Cancelar</button></>
                            ) : (
                                <><button onClick={() => startEditing(track)} className="text-xs text-gray-400 hover:text-white">Editar</button><button onClick={() => handleDeleteTrack(track.id)} className="text-xs text-red-400 hover:text-red-300">Excluir</button></>
                            )}
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};

// --- Student Overview Component (NEW) ---
const StudentOverview: React.FC<{ user: User }> = ({ user }) => {
    const { courses, courseProgress, events, mentorSessions, showToast, users } = useAppContext();
    const navigate = useNavigate();

    // 1. Get Current Course (Last active or most progress)
    const currentActive = useMemo(() => {
        if (courseProgress.inProgressCourses.length === 0) return null;
        return courseProgress.inProgressCourses.sort((a, b) => b.progress - a.progress)[0];
    }, [courseProgress]);

    // 2. Get Next Upcoming Mentorship
    const nextMentorship = useMemo(() => {
        const mySessions = mentorSessions.filter(s => s.studentId === user.id && s.isBooked);
        // Filter for future sessions
        const now = new Date();
        const futureSessions = mySessions.filter(s => new Date(`${s.date}T${s.time}`) > now);
        // Sort by date
        return futureSessions.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())[0];
    }, [mentorSessions, user.id]);

    // 3. Get Next Upcoming Event
    const nextEvent = useMemo(() => {
        return events.find(e => !e.date.includes('2023')) || events[0];
    }, [events]);

    // Determine what to show in the "Agenda" card
    const agendaItem = useMemo(() => {
        if (nextMentorship) {
            const mentor = users.find(u => u.id === nextMentorship.mentorId);
            return {
                type: 'mentorship',
                title: `Mentoria com ${mentor?.name || 'Mentor'}`,
                date: nextMentorship.date,
                time: nextMentorship.time,
                description: 'Prepare suas dúvidas e boa aula!',
                image: mentor?.avatarUrl || '',
                link: nextMentorship.googleMeetUrl,
                isMentorship: true
            };
        } else if (nextEvent) {
            return {
                type: 'event',
                title: nextEvent.title,
                date: nextEvent.date,
                time: nextEvent.time,
                description: nextEvent.description,
                image: nextEvent.imageUrl,
                link: `/event/${nextEvent.id}`,
                isMentorship: false
            };
        }
        return null;
    }, [nextMentorship, nextEvent, users]);

    const handleContinue = () => {
        if (currentActive) {
            // Find first incomplete lesson
            const course = currentActive.course;
            const allLessons = course.modules.flatMap(m => m.lessons);
            const firstUnfinished = allLessons.find(l => !user.completedLessonIds.includes(l.id));
            
            if (firstUnfinished) {
                navigate(`/curso/${course.id}/aula/${firstUnfinished.id}`);
            } else {
                // Course finished? Go to detail
                navigate(`/curso/${course.id}`);
            }
        } else {
            // No active course, go to catalog
            navigate('/cursos'); // Or explore tab
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            
            {/* 1. Hero / Continue Learning */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-r from-[#121212] to-[#1a1a1d] rounded-2xl border border-white/10 p-8 relative overflow-hidden shadow-2xl">
                    {/* Abstract Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/5">
                                {currentActive ? 'Em Andamento' : 'Comece Agora'}
                            </span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                            {currentActive ? currentActive.course.title : 'Sua jornada começa aqui'}
                        </h2>
                        <p className="text-gray-400 mb-8 text-sm md:text-base max-w-lg">
                            {currentActive 
                                ? `Você completou ${currentActive.progress}% deste curso. Continue de onde parou para manter o ritmo!` 
                                : 'Escolha uma trilha e dê o primeiro passo para transformar seu futuro.'}
                        </p>

                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleContinue}
                                className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:scale-105 flex items-center gap-2"
                            >
                                {currentActive ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                        Continuar Aula
                                    </>
                                ) : (
                                    <>Explorar Cursos</>
                                )}
                            </button>
                            {currentActive && (
                                <div className="flex-1 max-w-[200px]">
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>Progresso</span>
                                        <span className="text-white font-bold">{currentActive.progress}%</span>
                                    </div>
                                    <div className="w-full bg-black/40 rounded-full h-2 border border-white/5">
                                        <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500" style={{width: `${currentActive.progress}%`}}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Next Event / Agenda */}
                <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">
                            {agendaItem?.isMentorship ? 'Próxima Mentoria' : 'Próximo Evento'}
                        </h3>
                        <button onClick={() => navigate('/conectar')} className="text-xs text-[#c4b5fd] hover:text-white font-semibold">Ver Agenda</button>
                    </div>
                    
                    {agendaItem ? (
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="aspect-video rounded-lg overflow-hidden relative mb-4 group cursor-pointer" onClick={() => agendaItem.link && !agendaItem.isMentorship ? navigate(agendaItem.link) : null}>
                                <img src={agendaItem.image || 'https://via.placeholder.com/300x150'} alt={agendaItem.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white border border-white/10">
                                    {agendaItem.date} • {agendaItem.time}
                                </div>
                            </div>
                            <h4 className="text-white font-bold text-sm line-clamp-1 mb-1">{agendaItem.title}</h4>
                            <p className="text-gray-500 text-xs mb-4 line-clamp-2">{agendaItem.description}</p>
                            
                            {agendaItem.isMentorship ? (
                                <a 
                                    href={agendaItem.link || '#'} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-colors text-center block"
                                >
                                    Acessar Sala (Meet)
                                </a>
                            ) : (
                                <button onClick={() => navigate(agendaItem.link!)} className="w-full py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-bold transition-colors">
                                    Ver Detalhes
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-center text-gray-500 text-xs">
                            Nenhum compromisso agendado.
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Nível" value="Iniciado" icon="🌱" color="text-green-400" />
                <StatCard title="XP Total" value={user.xp} icon="⚡" color="text-yellow-400" />
                <StatCard title="Ofensiva" value={`${user.streak} dias`} icon="🔥" color="text-orange-500" />
                <StatCard title="Concluídos" value={courseProgress.completedCourses.length} icon="🏆" color="text-[#c4b5fd]" />
            </div>

            {/* 4. Quick Access Grid */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Acesso Rápido</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => navigate('/comunidade')} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all text-left group">
                        <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">💬</span>
                        <span className="text-sm font-bold text-white block">Comunidade</span>
                        <span className="text-xs text-gray-500">Tire dúvidas no fórum</span>
                    </button>
                    <button onClick={() => showToast("Certificados disponíveis na página do curso!")} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all text-left group">
                        <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📜</span>
                        <span className="text-sm font-bold text-white block">Certificados</span>
                        <span className="text-xs text-gray-500">Suas conquistas</span>
                    </button>
                    <button onClick={() => navigate('/perfil')} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all text-left group">
                        <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">👤</span>
                        <span className="text-sm font-bold text-white block">Meu Perfil</span>
                        <span className="text-xs text-gray-500">Editar dados</span>
                    </button>
                    <button onClick={() => navigate('/conectar')} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all text-left group">
                        <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🤝</span>
                        <span className="text-sm font-bold text-white block">Mentorias</span>
                        <span className="text-xs text-gray-500">Fale com experts</span>
                    </button>
                </div>
            </div>

        </div>
    );
};

// --- Teacher Overview Component (NEW) ---
const TeacherOverview: React.FC<{ user: User }> = ({ user }) => {
    const { courses, mentorSessions, communityPosts, users } = useAppContext();
    const navigate = useNavigate(); // Correctly using hook

    // Pagination State for Courses Card
    const [coursesPage, setCoursesPage] = useState(1);
    const COURSES_PER_PAGE = 4;

    const myCourses = useMemo(() => courses.filter(c => c.instructorId === user.id), [courses, user.id]);
    const mySessions = useMemo(() => mentorSessions.filter(s => s.mentorId === user.id && !s.isBooked), [mentorSessions, user.id]); 
    const bookedSessions = useMemo(() => mentorSessions.filter(s => s.mentorId === user.id && s.isBooked), [mentorSessions, user.id]);
    
    // Pagination Logic
    const totalPages = Math.ceil(myCourses.length / COURSES_PER_PAGE);
    const displayedCourses = myCourses.slice(
        (coursesPage - 1) * COURSES_PER_PAGE, 
        coursesPage * COURSES_PER_PAGE
    );

    // Calc stats
    const totalStudents = useMemo(() => {
        return 120; // Mock value for UI demo
    }, []);

    const pendingQuestions = useMemo(() => {
        return communityPosts.filter(p => p.type === 'question' && !p.isSolved).slice(0, 3);
    }, [communityPosts]);

    // Calculate at-risk students (inactive for more than 10 days)
    const atRiskStudents = useMemo(() => {
        const now = new Date();
        const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
        
        return users
            .filter(u => u.role === 'student')
            .filter(u => {
                if (!u.lastLogin) return false;
                const lastLoginDate = new Date(u.lastLogin);
                return lastLoginDate < tenDaysAgo;
            })
            .map(u => {
                const lastLoginDate = new Date(u.lastLogin);
                const daysAgo = Math.floor((now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));
                return {
                    ...u,
                    lastLoginDaysAgo: daysAgo
                };
            })
            .sort((a, b) => b.lastLoginDaysAgo - a.lastLoginDaysAgo)
            .slice(0, 4);
    }, [users]);

    return (
        <div className="space-y-8 animate-fade-in">
            
            {/* 1. Hero: Next Appointment */}
            <div className="bg-gradient-to-r from-[#121212] to-[#1a1a1d] rounded-2xl border border-white/10 p-8 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-2">Olá, Professor {user.name.split(' ')[0]}!</h2>
                        <p className="text-gray-400">Próximo compromisso na agenda:</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 w-full md:w-auto">
                        <div className="bg-primary p-3 rounded-lg text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-xs text-[#c4b5fd] font-bold uppercase">Mentoria Individual</p>
                            <p className="text-white font-bold">Hoje, 15:00</p>
                            <p className="text-xs text-gray-400">com João Silva</p>
                        </div>
                        <button className="ml-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors">
                            Entrar na Sala
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Meus Alunos" value={totalStudents} icon="👨‍🎓" color="text-white" />
                <StatCard title="Pendências" value="5" icon="📝" color="text-yellow-400" />
                <StatCard title="Dúvidas" value={pendingQuestions.length} icon="💬" color="text-orange-400" />
                <StatCard title="Nota Média" value="4.8" icon="⭐" color="text-[#c4b5fd]" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* 3. Centro de Atenção (Left - 2 cols) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* At Risk Students */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="bg-red-500/10 text-red-400 p-1 rounded">🚨</span> Alunos em Risco
                            </h3>
                            {atRiskStudents.length > 0 && (
                                <button onClick={() => navigate('/students')} className="text-xs text-[#c4b5fd] hover:underline">Ver todos</button>
                            )}
                        </div>
                        {atRiskStudents.length > 0 ? (
                            <div className="space-y-3">
                                {atRiskStudents.map(student => (
                                    <div key={student.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <img src={student.avatarUrl} className="h-10 w-10 rounded-full border border-white/10" alt={student.name} />
                                            <div>
                                                <p className="text-sm font-bold text-white">{student.name}</p>
                                                <p className="text-xs text-red-400">Ausente há {student.lastLoginDaysAgo} dias</p>
                                            </div>
                                        </div>
                                        <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors">
                                            Contatar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-3xl">🎉</span>
                                </div>
                                <p className="text-sm font-medium text-white">Nenhum aluno em risco!</p>
                                <p className="text-xs text-gray-500 mt-1">Todos os seus alunos estão ativos e engajados.</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Forum Questions */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-orange-500/10 text-orange-400 p-1 rounded">💬</span> Dúvidas Recentes
                        </h3>
                        {pendingQuestions.length > 0 ? (
                            <div className="space-y-3">
                                {pendingQuestions.map(post => (
                                    <div key={post.id} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 transition-colors cursor-pointer" onClick={() => navigate(`/community/post/${post.id}`)}>
                                        <p className="text-sm font-medium text-white line-clamp-1">{post.title}</p>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{post.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">Nenhuma dúvida pendente. Bom trabalho!</p>
                        )}
                    </div>

                </div>

                {/* 4. Sidebar (Right - 1 col) */}
                <div className="space-y-6">
                    
                    {/* My Courses Shortcuts (WITH PAGINATION) */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Meus Cursos</h3>
                            {myCourses.length > 0 && (
                                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                                    {myCourses.length} ativos
                                </span>
                            )}
                        </div>
                        
                        <div className="space-y-3 flex-grow">
                            {displayedCourses.length > 0 ? displayedCourses.map(course => (
                                <div 
                                    key={course.id} 
                                    className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-xl p-3 transition-all duration-300 cursor-pointer flex gap-4 items-center"
                                    onClick={() => navigate(`/admin/painel-instrutor/${course.id}`)}
                                >
                                    {/* Thumbnail */}
                                    <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 relative">
                                        <img src={course.imageUrl} className="w-full h-full object-cover" alt={course.title} />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-bold text-xs truncate pr-2 group-hover:text-[#c4b5fd] transition-colors">{course.title}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                                {course.modules.length} Módulos
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                {/* Mock student count per course */}
                                                {Math.floor(Math.random() * 50) + 10} Alunos
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-gray-500 group-hover:text-white transition-colors">›</span>
                                </div>
                            )) : (
                                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                                    <p className="text-sm text-gray-500">Você não tem cursos atribuídos.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                <button 
                                    onClick={() => setCoursesPage(p => Math.max(1, p - 1))}
                                    disabled={coursesPage === 1}
                                    className="text-xs font-bold text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    ← Anterior
                                </button>
                                <span className="text-[10px] text-gray-500 font-mono">
                                    {coursesPage} / {totalPages}
                                </span>
                                <button 
                                    onClick={() => setCoursesPage(p => Math.min(totalPages, p + 1))}
                                    disabled={coursesPage === totalPages}
                                    className="text-xs font-bold text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    Próximo →
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Ações Rápidas</h3>
                        <div className="space-y-2">
                            <button onClick={() => navigate('/myAgenda')} className="w-full text-left p-2 text-sm text-white hover:bg-white/5 rounded transition-colors flex items-center gap-2">
                                📅 Gerenciar Agenda
                            </button>
                            <button onClick={() => navigate('/admin/editor-curso')} className="w-full text-left p-2 text-sm text-white hover:bg-white/5 rounded transition-colors flex items-center gap-2">
                                ➕ Criar Novo Conteúdo
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}


// --- Main Dashboard Component ---

const Dashboard: React.FC = () => {
    const { 
        user, users, courses, articles, team, events,
        handleDeleteArticle, handleToggleArticleStatus,
        handleDeleteUser, handleDeleteCourse, handleDeleteEvent,
        handleSaveCourse, loadData
    } = useAppContext();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Handler para navegação especial (páginas externas ao dashboard)
    const handleTabChange = (tab: string) => {
        if (tab === 'gemini-api') {
            navigate('/gemini-api-dashboard');
        } else {
            setActiveTab(tab);
        }
    };

    // --- CRITICAL: Load all resources needed for the Dashboard on mount ---
    useEffect(() => {
        if (user) {
            loadData([
                'users', 'courses', 'articles', 'projects', 'communityPosts', 
                'events', 'mentorSessions', 'tracks', 'marketingPosts',
                'partners', 'supporters', 'financialStatements', 'annualReports'
            ]);
        }
    }, [user, loadData]);

    // Update active tab if user changes (e.g. login/logout)
    useEffect(() => {
        if (user) {
            setActiveTab(prev => prev === 'overview' ? 'overview' : prev);
        }
    }, [user]);

    // -- SAFE HOOKS EXECUTION (No early returns here) --

    // Filter data strictly using safe logic (handle null user)
    const coursesForUser = useMemo(() => {
        if (!user) return [];
        return user.role === 'admin' ? courses : courses.filter(c => c.instructorId === user.id);
    }, [user, courses]);

    const articlesForUser = useMemo(() => {
        if (!user) return [];
        return user.role === 'admin' ? articles : articles.filter(a => a.author === user.name);
    }, [user, articles]);

    // Tab Titles Map
    const tabTitles: Record<string, string> = {
        overview: 'Visão Geral',
        myAgenda: 'Minha Agenda',
        myCourses: 'Meus Cursos',
        explore: 'Catálogo de Cursos',
        courses: 'Gestão de Cursos',
        tracks: 'Trilhas de Aprendizado',
        blog: 'Gerenciar Blog',
        'blog-feed': 'Notícias e Artigos',
        events: 'Eventos',
        moderation: 'Moderação',
        students: 'Base de Alunos',
        teamMembers: 'Equipe & Voluntários',
        transparency: 'Transparência',
        supporters: 'Apoiadores',
        forum: 'Fórum de Dúvidas',
        marketing: 'Marketing Studio',
        'system-settings': 'Configurações do Sistema'
    };

    // Handlers
    const handleCreateCourse = () => navigate('/admin/editor-curso');
    const handleEditCourse = (id: string) => navigate(`/admin/editor-curso/${id}`);
    
    const handleDuplicateCourse = (originalCourse: Course) => {
        if (!window.confirm(`Deseja criar uma cópia de "${originalCourse.title}"?`)) return;

        const timestamp = Date.now();
        
        const newModules = originalCourse.modules.map(m => ({
            ...m,
            id: `mod_${timestamp}_${Math.random().toString(36).substr(2, 5)}`,
            lessons: m.lessons.map(l => ({
                ...l,
                id: `les_${timestamp}_${Math.random().toString(36).substr(2, 5)}`
            }))
        }));

        const newCourse: Course = {
            ...originalCourse,
            id: `course_${timestamp}`,
            title: `${originalCourse.title} (Cópia)`,
            slug: `${originalCourse.slug || originalCourse.id}-copy-${timestamp}`,
            modules: newModules,
            enrollmentStatus: 'closed', // Start as closed/draft
            seo: {
                ...originalCourse.seo,
                metaTitle: `${originalCourse.seo?.metaTitle || originalCourse.title} (Cópia)`
            }
        };

        handleSaveCourse(newCourse);
    };

    const renderAdminOverview = () => {
        // --- CALCULATE HEALTH METRICS ---
        const totalStudents = users.filter(u => u.role === 'student').length;
        
        // New Students (Simulated logic since 'createdAt' is not always available in this mock)
        const newStudents = Math.round(totalStudents * 0.15); 

        // Completion Rate
        let totalLessonsPossible = 0;
        let totalLessonsCompleted = 0;
        users.filter(u => u.role === 'student').forEach(s => {
            totalLessonsCompleted += s.completedLessonIds.length;
        });
        totalLessonsPossible = Math.max(1, totalStudents * 10); 
        const completionRate = Math.min(100, Math.round((totalLessonsCompleted / totalLessonsPossible) * 100));

        // Retention
        const retentionRate = 72;

        // Dynamic Health Score Calculation
        const growthScore = Math.min(100, (newStudents / totalStudents) * 500); 
        const healthScore = Math.round((completionRate * 0.4) + (retentionRate * 0.4) + (growthScore * 0.2));

        // Calculate at-risk students (inactive for more than 10 days)
        const now = new Date();
        const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
        
        const atRiskStudents = users
            .filter(u => u.role === 'student')
            .filter(u => {
                if (!u.lastLogin) return false;
                const lastLoginDate = new Date(u.lastLogin);
                return lastLoginDate < tenDaysAgo;
            })
            .map(u => {
                const lastLoginDate = new Date(u.lastLogin);
                const daysAgo = Math.floor((now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));
                return {
                    ...u,
                    lastLoginDaysAgo: daysAgo
                };
            })
            .sort((a, b) => b.lastLoginDaysAgo - a.lastLoginDaysAgo);

        return (
            <div className="space-y-8 animate-fade-in">
                {/* Health Score Banner */}
                <div className="bg-gradient-to-r from-[#121212] to-[#1a1a1d] rounded-2xl border border-white/10 p-8 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${healthScore > 70 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                                    {healthScore > 70 ? 'Sistema Saudável' : 'Atenção Requerida'}
                                </span>
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2">Saúde da Plataforma</h2>
                            <p className="text-gray-400 max-w-lg">
                                Monitoramento em tempo real de engajamento e atividade. O índice combina conclusão, retenção e crescimento.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 font-bold uppercase">Atividade (MAU)</p>
                                <p className="text-2xl font-black text-white">{retentionRate > 50 ? 'High' : 'Med'}</p>
                            </div>
                            <div className="h-12 w-px bg-white/10"></div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 font-bold uppercase">Health Score</p>
                                <p className={`text-4xl font-black ${healthScore > 80 ? 'text-green-400' : healthScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {healthScore}<span className="text-lg text-gray-600">/100</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total de Alunos" 
                        value={totalStudents.toLocaleString('pt-BR')} 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} 
                        trend="12%" 
                        trendUp={true}
                        color="text-white"
                    />
                    <StatCard 
                        title="Novos (30d)" 
                        value={`+${newStudents}`} 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>} 
                        trend="5%"
                        trendUp={true}
                        color="text-white"
                    />
                    <StatCard 
                        title="Taxa de Conclusão" 
                        value={`${completionRate}%`} 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
                        color="text-blue-400"
                    />
                    <StatCard 
                        title="Retenção" 
                        value={`${retentionRate}%`} 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} 
                        trend="2%"
                        trendUp={false}
                        color="text-yellow-400"
                    />
                </div>

                {/* Gemini API Status Card */}
                <div className="mt-6 bg-info/5 border border-info/20 rounded-xl p-6 hover:border-info/40 transition-all">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">🤖</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white mb-1">API Gemini - Plano Gratuito</h3>
                                <p className="text-sm text-gray-400 mb-3">
                                    Monitore o uso da API do Google Gemini para evitar interrupções
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Texto (hoje)</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-brand-cyan" style={{width: '23%'}}></div>
                                            </div>
                                            <span className="text-xs font-bold text-white">342/1.500</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Imagem (hoje)</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-warning" style={{width: '96%'}}></div>
                                            </div>
                                            <span className="text-xs font-bold text-warning">48/50</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    ⚠️ Quota de imagens próxima do limite • Reset em 6h
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/gemini-api-dashboard')}
                            className="ml-4 bg-info hover:bg-info/90 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm whitespace-nowrap"
                        >
                            Ver Detalhes →
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* System Status & Recent Activity */}
                    <div className="lg:col-span-2 bg-[#121212] border border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Status do Sistema</h3>
                            <button onClick={() => navigate('/analytics')} className="text-xs text-[#c4b5fd] hover:text-white font-bold uppercase">Relatório Completo</button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-white/5 p-3 rounded-lg text-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-2 shadow-[0_0_10px_#22c55e]"></div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Banco de Dados</p>
                                <p className="text-sm text-white font-bold">Online</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg text-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-2 shadow-[0_0_10px_#22c55e]"></div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Storage (Blob)</p>
                                <p className="text-sm text-white font-bold">Online</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg text-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-2 shadow-[0_0_10px_#22c55e]"></div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Autenticação</p>
                                <p className="text-sm text-white font-bold">Online</p>
                            </div>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-4 border-b border-white/5 pb-2">Atividade Recente</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">🎓</div>
                                <div>
                                    <p className="text-sm font-bold text-white">Novas Matrículas</p>
                                    <p className="text-xs text-gray-400">3 novos alunos iniciaram o curso de Front-end.</p>
                                </div>
                                <span className="ml-auto text-xs text-gray-500">2h atrás</span>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">💬</div>
                                <div>
                                    <p className="text-sm font-bold text-white">Interação no Fórum</p>
                                    <p className="text-xs text-gray-400">5 novas dúvidas respondidas por instrutores.</p>
                                </div>
                                <span className="ml-auto text-xs text-gray-500">5h atrás</span>
                            </div>
                        </div>
                    </div>

                    {/* At Risk Students Mini-Widget */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">⚠️ Atenção (Evasão)</h3>
                        <p className="text-xs text-gray-400 mb-4">Alunos sem acesso há mais de 10 dias.</p>
                        {atRiskStudents.length > 0 ? (
                            <ul className="space-y-3">
                                {atRiskStudents.slice(0, 3).map(student => (
                                    <li key={student.id} className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors" onClick={() => navigate(`/admin/editor-usuario/${student.id}`)}>
                                        <img src={student.avatarUrl} alt={student.name} className="h-8 w-8 rounded-full opacity-60 group-hover:opacity-100 transition-opacity border border-white/10" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate group-hover:text-[#c4b5fd] transition-colors">{student.name}</p>
                                            <p className="text-xs text-red-400">{student.lastLoginDaysAgo} dias off</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl">🎉</span>
                                </div>
                                <p className="text-sm text-gray-400">Nenhum aluno em risco!</p>
                                <p className="text-xs text-gray-600 mt-1">Todos os alunos estão ativos.</p>
                            </div>
                        )}
                        <button onClick={() => navigate('/analytics')} className="w-full mt-6 py-2 text-xs font-bold text-center text-gray-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            {atRiskStudents.length > 0 ? 'Ver Lista Completa' : 'Ver Análises'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const renderCoursesManagement = () => {
        // Estatísticas de cursos (calculadas diretamente, sem useMemo para evitar violação das regras de Hooks)
        const totalLessons = coursesForUser.reduce((acc, c) => acc + c.modules.reduce((sum, m) => sum + m.lessons.length, 0), 0);
        const totalModules = coursesForUser.reduce((acc, c) => acc + c.modules.length, 0);
        const byTrack = coursesForUser.reduce((acc, c) => {
            acc[c.track] = (acc[c.track] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const courseStats = { totalLessons, totalModules, byTrack };

        return (
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Gerenciar Cursos</h2>
                        <p className="text-sm text-gray-400 mt-1">Crie, edite e organize seus cursos</p>
                    </div>
                    <button 
                        onClick={handleCreateCourse} 
                        className="bg-gradient-to-r from-[#8a4add] to-[#f27983] hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#8a4add]/20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Novo Curso
                    </button>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-2xl font-black text-white">{coursesForUser.length}</p>
                        <p className="text-xs text-gray-400 mt-1">Cursos</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-2xl font-black text-purple-400">{courseStats.totalModules}</p>
                        <p className="text-xs text-gray-400 mt-1">Módulos</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-4 hover:border-green-500/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-2xl font-black text-green-400">{courseStats.totalLessons}</p>
                        <p className="text-xs text-gray-400 mt-1">Aulas</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#8a4add]/10 to-[#f27983]/10 border border-[#8a4add]/20 rounded-xl p-4 hover:border-[#8a4add]/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#8a4add]/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#c4b5fd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-2xl font-black text-[#c4b5fd]">{Object.keys(byTrack).length}</p>
                        <p className="text-xs text-gray-400 mt-1">Trilhas</p>
                    </div>
                </div>
            
                <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <TableHeader cols={['Curso', 'Trilha', 'Nível', 'Conteúdo', 'Ações']} />
                        <tbody className="divide-y divide-white/5">
                            {coursesForUser.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-12 text-gray-500">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold mb-1">Nenhum curso cadastrado</p>
                                            <p className="text-xs text-gray-600">Clique em "Novo Curso" para começar</p>
                                        </div>
                                    </div>
                                </td></tr>
                            ) : (
                                coursesForUser.map((course) => {
                                    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                                    const totalModules = course.modules.length;
                                    
                                    return (
                                        <tr key={course.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 border-2 border-white/10 group-hover:border-[#8a4add]/30 transition-colors">
                                                            <img src={course.imageUrl} className="w-full h-full object-cover" alt={course.title} />
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-semibold text-white truncate max-w-[250px] group-hover:text-[#c4b5fd] transition-colors">
                                                            {course.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            ID: {course.id.substring(0, 8)}...
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-lg bg-[#8a4add]/20 text-[#c4b5fd] border border-[#8a4add]/30">
                                                    {course.track}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                                                    course.skillLevel === 'Iniciante' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                                    course.skillLevel === 'Intermediário' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                                    'bg-red-500/20 text-red-300 border border-red-500/30'
                                                }`}>
                                                    {course.skillLevel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                        <span className="font-semibold">{totalModules}</span>
                                                    </div>
                                                    <span className="text-gray-600">•</span>
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="font-semibold">{totalLessons}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => navigate(`/admin/painel-instrutor/${course.id}`)} 
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" 
                                                        title="Painel da Turma"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDuplicateCourse(course)} 
                                                        className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-all" 
                                                        title="Duplicar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEditCourse(course.id)} 
                                                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all" 
                                                        title="Editar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteCourse(course.id)} 
                                                        className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" 
                                                        title="Excluir"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        );
    };

    const renderStudentCourses = () => {
        if (!user) return null;
        const myCourseIds = user.completedLessonIds; 
        const myCourses = courses.filter(c => c.modules.some(m => m.lessons.some(l => l.id && myCourseIds.includes(l.id)))) || [];
        
        return (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Meus Cursos em Andamento</h2>
                {myCourses.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 border-dashed">
                        <p className="text-gray-400 mb-4">Você ainda não iniciou nenhum curso.</p>
                        <button onClick={() => setActiveTab('explore')} className="text-[#c4b5fd] hover:underline font-bold">Explorar Catálogo</button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myCourses.map(course => (
                            <CourseCard key={course.id} course={course} onCourseSelect={(c) => navigate(`/curso/${c.id}/aula/${c.modules[0].lessons[0].id}`)} progress={35} isEnrolled={true} />
                        ))}
                    </div>
                )}
            </div>
        );
    };
    
    // --- FINAL GUARD CLAUSE ---
    // Only return null here, AFTER all hooks have run.
    if (!user) return null;

    // --- FINAL GUARD CLAUSE ---
    // Only return null here, AFTER all hooks have run.
    if (!user) return null;

    const renderOverview = () => {
        if (user.role === 'student') return <StudentOverview user={user} />;
        if (user.role === 'instructor') return <TeacherOverview user={user} />;
        return renderAdminOverview();
    };

    return (
        <div className="min-h-screen bg-[#09090B] flex">
            <DashboardSidebar 
                activeTab={activeTab} 
                onTabChange={handleTabChange} 
                userRole={user.role} 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />

            <div className="flex-1 flex flex-col min-w-0 md:pl-64 transition-all duration-300">
                <DashboardHeader user={user} toggleSidebar={() => setIsSidebarOpen(true)} title={tabTitles[activeTab]} />
                
                <main className="flex-1 p-6 overflow-y-auto custom-scrollbar relative">
                    <div className="max-w-7xl mx-auto relative z-10">
                        {/* CONDITIONAL OVERVIEW */}
                        {activeTab === 'overview' && renderOverview()}
                        
                        {activeTab === 'courses' && renderCoursesManagement()}
                        {activeTab === 'myCourses' && renderStudentCourses()}
                        {activeTab === 'explore' && <ExploreCoursesPanel />}
                        {activeTab === 'forum' && <ForumView embedded />}
                        {activeTab === 'marketing' && <MarketingGeneratorView />}
                        {activeTab === 'blog' && <BlogManagementPanel />}
                        {activeTab === 'blog-feed' && <Blog embedded />}
                        {activeTab === 'myAgenda' && <MyAgendaPanel user={user} />}
                        {activeTab === 'tracks' && <TracksManagementPanel />}
                        {activeTab === 'students' && <StudentsPanel />}
                        {activeTab === 'teamMembers' && <TeamManagementPanel />}
                        {activeTab === 'moderation' && <ModerationPanel />}
                        {activeTab === 'transparency' && <TransparencyPanel />}
                        {activeTab === 'supporters' && <SupportersPanel />}
                        {activeTab === 'system-settings' && <SystemSettingsPanel />}
                        {activeTab === 'events' && <EventsPanel />}
                        
                        {/* Fallback for other tabs */}
                        {!['overview', 'courses', 'myCourses', 'explore', 'forum', 'marketing', 'blog', 'blog-feed', 'myAgenda', 'tracks', 'students', 'teamMembers', 'moderation', 'transparency', 'supporters', 'system-settings', 'events'].includes(activeTab) && (
                            <div className="text-center py-20 text-gray-500">Funcionalidade em desenvolvimento: {tabTitles[activeTab]}</div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
