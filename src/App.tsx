
import React, { useState, useEffect, createContext, useContext, useMemo, Suspense, lazy } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from './services/firebaseConfig';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, writeBatch, getDoc } from 'firebase/firestore';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { User, Course, Lesson, Article, Project, ProjectComment, AppContextType, Partner, Event, MentorSession, CourseProgress, CommunityPost, CommunityReply, Track, FinancialStatement, AnnualReport, Supporter, MarketingPost, SystemSettings, Notification } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileModal from './components/ProfileModal';
import OnboardingTour from './components/OnboardingTour';
import BottleneckAnalysisModal from './components/BottleneckAnalysisModal';
import InscriptionFormModal from './components/InscriptionFormModal';
import WhatsAppButton from './components/WhatsAppButton';
import ReadingProgressBar from './components/ReadingProgressBar';
import ScrollToTop from './components/ScrollToTop';
import AnalyticsTracker from './components/AnalyticsTracker';

// Lazy load all views for better performance
const Home = lazy(() => import('./views/Home'));
const Dashboard = lazy(() => import('./views/Dashboard'));
const ConnectView = lazy(() => import('./views/ConnectView'));
const Blog = lazy(() => import('./views/Blog'));
const Login = lazy(() => import('./views/Login'));
const Register = lazy(() => import('./views/Register'));
const ForgotPassword = lazy(() => import('./views/ForgotPassword'));
const CompleteProfile = lazy(() => import('./views/CompleteProfile'));
const Profile = lazy(() => import('./views/Profile'));
const CourseDetail = lazy(() => import('./views/CourseDetail'));
const LessonView = lazy(() => import('./views/LessonView'));
const CourseEditor = lazy(() => import('./views/CourseEditor'));
const CertificateView = lazy(() => import('./views/CertificateView'));
const Analytics = lazy(() => import('./views/Analytics'));
const GeminiApiDashboard = lazy(() => import('./views/GeminiApiDashboard'));
const ArticleView = lazy(() => import('./views/ArticleView'));
const ArticleEditor = lazy(() => import('./views/ArticleEditor'));
const StudentEditor = lazy(() => import('./views/StudentEditor'));
const InstructorCourseDashboard = lazy(() => import('./views/InstructorCourseDashboard'));
const CommunityView = lazy(() => import('./views/CommunityView'));
const ForumView = lazy(() => import('./views/ForumView'));
const ProjectDetailView = lazy(() => import('./views/ProjectDetailView'));
const ProjectEditor = lazy(() => import('./views/ProjectEditor'));
const PartnershipsUnifiedView = lazy(() => import('./views/PartnershipsUnifiedView'));
const EventEditor = lazy(() => import('./views/EventEditor'));
const PrivacyPolicyView = lazy(() => import('./views/PrivacyPolicyView'));
const TermsOfUseView = lazy(() => import('./views/TermsOfUseView'));
const TeamView = lazy(() => import('./views/TeamView'));
const TeamMemberEditor = lazy(() => import('./views/TeamMemberEditor'));
const Courses = lazy(() => import('./views/Courses'));
const DonateView = lazy(() => import('./views/DonateView'));
const AboutUsView = lazy(() => import('./views/AboutUsView'));
const AnnualReportView = lazy(() => import('./views/AnnualReportView'));
const FinancialStatementView = lazy(() => import('./views/FinancialStatementView'));
const TransparencyView = lazy(() => import('./views/TransparencyView'));
const EventDetailView = lazy(() => import('./views/EventDetailView'));
const EventsView = lazy(() => import('./views/EventsView'));
const ContactView = lazy(() => import('./views/ContactView'));
const ChangePassword = lazy(() => import('./views/ChangePassword'));
const CourseLandingPage = lazy(() => import('./views/CourseLandingPage'));
const PartnerDetailView = lazy(() => import('./views/PartnerDetailView'));
const StudentUploadTest = lazy(() => import('./views/StudentUploadTest'));
const ForumPostDetailView = lazy(() => import('./views/ForumPostDetailView'));
const ForumPostEditor = lazy(() => import('./views/ForumPostEditor'));
const ApiTest = lazy(() => import('./views/ApiTest'));
const TransparencyEditor = lazy(() => import('./views/TransparencyEditor'));

// Loading component
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen bg-[#09090B]">
        <div className="text-center">
            {/* Opção 1: Spinner com logo animado (atual melhorado) */}
            <div className="relative mb-6">
                {/* Anel externo girando */}
                <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-transparent bg-gradient-to-r from-[#8a4add] via-[#f27983] to-[#8a4add] bg-clip-border" style={{ 
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '4px'
                }}></div>
                
                {/* Logo/ícone central */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        {/* Círculo pulsante */}
                        <div className="w-10 h-10 bg-gradient-to-br from-[#8a4add] to-[#f27983] rounded-full animate-pulse"></div>
                        {/* Brilho */}
                        <div className="absolute inset-0 w-10 h-10 bg-white/20 rounded-full animate-ping"></div>
                    </div>
                </div>
            </div>

            {/* Texto */}
            <p className="text-white font-bold text-2xl mb-2 bg-gradient-to-r from-[#8a4add] to-[#f27983] bg-clip-text text-transparent">
                FuturoOn
            </p>
            <p className="text-gray-400 text-sm animate-pulse">Carregando plataforma...</p>
            
            {/* Barra de progresso animada */}
            <div className="mt-4 w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983] animate-[loading_1.5s_ease-in-out_infinite]"></div>
            </div>
        </div>
    </div>
);


const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

// Helper function to calculate reading time
const calculateReadingTime = (content: string): number => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
};

// Default settings
const DEFAULT_SETTINGS: SystemSettings = {
    siteName: 'FuturoOn',
    primaryColor: '#8a4add',
    secondaryColor: '#f27983',
    marketingStudioEnabled: true, // Marketing Studio habilitado por padrão
    backgroundColor: '#09090B',
    surfaceColor: '#121212',
    gradientStart: '#8a4add', // Default gradient matches primary
    gradientEnd: '#f27983',   // Default gradient matches secondary
    borderRadius: '1rem'      // Default rounded-2xl look
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // System Settings State
    const [settings, setSettingsState] = useState<SystemSettings>(() => {
        const saved = localStorage.getItem('futuro_settings');
        // Merge with default to ensure new fields exist
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    });

    // Apply CSS Variables whenever settings change
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', settings.primaryColor);
        root.style.setProperty('--color-secondary', settings.secondaryColor);
        root.style.setProperty('--color-background', settings.backgroundColor);
        root.style.setProperty('--color-surface', settings.surfaceColor);

        // New variables
        root.style.setProperty('--color-gradient-start', settings.gradientStart);
        root.style.setProperty('--color-gradient-end', settings.gradientEnd);
        root.style.setProperty('--radius-base', settings.borderRadius);

        // Save to localStorage for persistence in this demo
        localStorage.setItem('futuro_settings', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings: Partial<SystemSettings>) => {
        setSettingsState(prev => ({ ...prev, ...newSettings }));
    };

    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [supporters, setSupporters] = useState<Supporter[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [mentorSessions, setMentorSessions] = useState<MentorSession[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [financialStatements, setFinancialStatements] = useState<FinancialStatement[]>([]);
    const [annualReports, setAnnualReports] = useState<AnnualReport[]>([]);
    const [marketingPosts, setMarketingPosts] = useState<MarketingPost[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<User | null>(null);

    const [isBottleneckModalOpen, setIsBottleneckModalOpen] = useState(false);
    const [selectedBottleneck, setSelectedBottleneck] = useState<{ lesson: Lesson, students: User[] } | null>(null);

    const [isInscriptionModalOpen, setIsInscriptionModalOpen] = useState(false);
    const [selectedCourseForInscription, setSelectedCourseForInscription] = useState<Course | null>(null);

    const [toast, setToast] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const fetchAndPopulateCollection = async (collectionName: string, setData: React.Dispatch<React.SetStateAction<any[]>>) => {
        try {
            // Fetch from Firestore
            const collRef = collection(db, collectionName);
            const snapshot = await getDocs(collRef);
            let dataFromDb = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

            // Special processing for specific collections
            if (collectionName === 'articles') {
                // Calculate reading time for articles
                dataFromDb = dataFromDb.map(article => ({
                    ...article,
                    readingTime: calculateReadingTime((article as Article).content || '')
                }));
            }

            if (collectionName === 'projects') {
                // Ensure all projects have a status
                dataFromDb = dataFromDb.map(p => ({ 
                    ...p, 
                    status: (p as Project).status || 'approved' 
                }));
            }

            setData(dataFromDb);
        } catch (error) {
            console.error(`Erro ao buscar a coleção '${collectionName}':`, error);
            // On error, set empty array instead of mock data
            setData([]);
        }
    };


    useEffect(() => {
        // OPTIMIZATION: Load essential data only. 
        // In a real production app, this should be moved to specific views using React Query.
        const fetchData = async () => {
            setLoading(true);

            // Core data needed for public navigation
            const corePromises = [
                fetchAndPopulateCollection('courses', setCourses),
                fetchAndPopulateCollection('articles', setArticles),
                fetchAndPopulateCollection('partners', setPartners),
                fetchAndPopulateCollection('supporters', setSupporters),
                fetchAndPopulateCollection('events', setEvents),
                fetchAndPopulateCollection('annualReports', setAnnualReports) // For transparency footer
            ];

            // Data that could be lazy loaded, but kept here for simplicity in this demo version
            const secondaryPromises = [
                fetchAndPopulateCollection('projects', setProjects),
                fetchAndPopulateCollection('communityPosts', setCommunityPosts),
                fetchAndPopulateCollection('tracks', setTracks),
                fetchAndPopulateCollection('financialStatements', setFinancialStatements),
                fetchAndPopulateCollection('marketingPosts', setMarketingPosts)
            ];

            // Users collection is heavy. Ideally should be fetched only by Admin or on demand.
            // Kept here to maintain existing functionality for Instructor Dashboard
            const heavyPromises = [
                fetchAndPopulateCollection('users', setUsers),
                fetchAndPopulateCollection('mentorSessions', setMentorSessions),
            ];

            await Promise.all([...corePromises, ...secondaryPromises, ...heavyPromises]);
            setLoading(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                let userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    // Retry logic for creation race condition
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    userDoc = await getDoc(userDocRef);
                }

                if (userDoc.exists()) {
                    const userData = userDoc.data() as User;
                    if (userData.accountStatus === 'inactive') {
                        await signOut(auth);
                        setUser(null);
                    } else {
                        setUser(userData);
                    }
                } else {
                    // Create fallback user if document missing
                    const newUser: User = {
                        id: firebaseUser.uid,
                        name: firebaseUser.displayName || 'Novo Aluno',
                        email: firebaseUser.email || "",
                        avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/200`,
                        bio: 'Entusiasta de tecnologia pronto para aprender!',
                        role: 'student',
                        profileStatus: 'incomplete',
                        completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '',
                        hasCompletedOnboardingTour: false,
                        accountStatus: 'active',
                    };
                    try {
                        await setDoc(doc(db, "users", firebaseUser.uid), newUser);
                        setUser(newUser);
                    } catch (error) {
                        console.error("Erro ao criar doc de usuário:", error);
                        await signOut(auth);
                        setUser(null);
                    }
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);


    const handleLogout = () => {
        signOut(auth).then(() => {
            setUser(null);
        });
    };

    const completeLesson = async (lessonId: string) => {
        if (!user || user.completedLessonIds.includes(lessonId)) return;

        const lesson = courses.flatMap(c => c.modules.flatMap(m => m.lessons)).find(l => l.id === lessonId);
        const newXp = (user.xp || 0) + (lesson?.xp || 0);
        const updatedCompletedIds = [...user.completedLessonIds, lessonId];

        const updatedUser = { ...user, completedLessonIds: updatedCompletedIds, xp: newXp };
        setUser(updatedUser);
        showToast(`✨ Aula concluída! +${lesson?.xp || 0} XP`);

        try {
            await updateDoc(doc(db, "users", user.id), {
                completedLessonIds: updatedCompletedIds,
                xp: newXp
            });
        } catch (error) {
            console.error("Erro ao completar aula:", error);
        }
    };

    const handleSaveNote = async (lessonId: string, note: string) => {
        if (!user) return;
        const updatedNotes = { ...(user.notes || {}), [lessonId]: note };
        const updatedUser = { ...user, notes: updatedNotes };
        setUser(updatedUser);
        showToast("📝 Anotação salva!");

        try {
            await updateDoc(doc(db, "users", user.id), { notes: updatedNotes });
        } catch (error) {
            console.error("Erro ao salvar anotação:", error);
        }
    };

    // --- OPTIMIZED SAVE COURSE WITH SUB-COLLECTIONS ---
    const handleSaveCourse = async (courseToSave: Course) => {
        const isNew = !courses.some(c => c.id === courseToSave.id);

        // Update local state immediately (with full content for seamless UX)
        setCourses(prev => isNew ? [...prev, courseToSave] : prev.map(c => c.id === courseToSave.id ? courseToSave : c));
        showToast("✅ Curso salvo com sucesso!");

        try {
            const batch = writeBatch(db);

            // Sanitize the whole course object to remove undefined values which Firestore rejects
            const safeCourse = JSON.parse(JSON.stringify(courseToSave));

            // 1. Prepare the Course Document (stripped of heavy content)
            const courseRef = doc(db, "courses", safeCourse.id);
            const courseDataLight = {
                ...safeCourse,
                modules: safeCourse.modules.map((m: any) => ({
                    ...m,
                    lessons: m.lessons.map((l: any) => ({
                        // Keep metadata, strip content
                        id: l.id,
                        title: l.title,
                        duration: l.duration,
                        type: l.type,
                        xp: l.xp,
                        videoUrl: l.videoUrl || null, // Explicit null for Firestore if needed
                        // mainContent: REMOVED
                    }))
                }))
            };

            batch.set(courseRef, courseDataLight);

            // 2. Save Individual Lessons to Sub-collection
            // Use safeCourse here too to ensure undefined fields are stripped/handled
            safeCourse.modules.forEach((module: any) => {
                module.lessons.forEach((lesson: any) => {
                    const lessonRef = doc(db, "courses", safeCourse.id, "lessons", lesson.id);
                    // No need to re-stringify as safeCourse is already clean, but good for safety if we modified lesson loop variable
                    batch.set(lessonRef, lesson);
                });
            });

            await batch.commit();
            
            // Notify students about new course
            if (isNew && courseToSave.enrollmentStatus === 'open') {
                notifyNewCourse(courseToSave);
            }

        } catch (error) {
            console.error("Erro ao salvar curso e aulas:", error);
            showToast("❌ Erro ao salvar no banco.");
        }
    };

    const handleDeleteCourse = async (courseId: string): Promise<boolean> => {
        if (window.confirm("Tem certeza que deseja excluir este curso?")) {
            try {
                // Note: Deleting a document does not delete sub-collections in Firestore!
                // To do this properly, you'd need a Cloud Function or manual deletion of sub-collections.
                // For this frontend-only implementation, we delete the main doc.
                await deleteDoc(doc(db, "courses", courseId));
                setCourses(prev => prev.filter(c => c.id !== courseId));
                showToast("✅ Curso excluído com sucesso!");
                return true;
            } catch (error) {
                console.error("Erro ao excluir curso:", error);
                showToast("❌ Erro ao excluir curso.");
                return false;
            }
        }
        return false;
    };

    const handleSaveArticle = async (articleToSave: Article) => {
        const isNew = !articles.some(a => a.id === articleToSave.id);
        const articleWithTime = { ...articleToSave, readingTime: calculateReadingTime(articleToSave.content) };

        setArticles(prev => isNew ? [...prev, articleWithTime] : prev.map(a => a.id === articleToSave.id ? articleWithTime : a));
        showToast("✅ Artigo salvo com sucesso!");

        try {
            await setDoc(doc(db, "articles", articleToSave.id), articleWithTime);
        } catch (error) {
            console.error("Erro ao salvar artigo:", error);
        }
    };

    const handleDeleteArticle = async (articleId: string): Promise<boolean> => {
        if (window.confirm("Tem certeza que deseja excluir este artigo?")) {
            try {
                await deleteDoc(doc(db, "articles", articleId));
                setArticles(prev => prev.filter(a => a.id !== articleId));
                showToast("🗑️ Artigo excluído.");
                return true;
            } catch (error) {
                console.error("Erro ao excluir artigo:", error);
                showToast("❌ Erro ao excluir artigo.");
                return false;
            }
        }
        return false;
    };

    const handleToggleArticleStatus = async (articleId: string) => {
        const article = articles.find(a => a.id === articleId);
        if (!article) return;
        const newStatus = article.status === 'published' ? 'draft' : 'published';

        setArticles(prev => prev.map(a => a.id === articleId ? { ...a, status: newStatus } : a));
        showToast(newStatus === 'published' ? "✅ Artigo publicado!" : "📝 Artigo movido para rascunho.");

        try {
            await updateDoc(doc(db, "articles", articleId), { status: newStatus });
        } catch (error) {
            console.error("Erro ao atualizar status do artigo:", error);
        }
    };

    const handleAddArticleClap = async (articleId: string) => {
        setArticles(prev => prev.map(a => a.id === articleId ? { ...a, claps: (a.claps || 0) + 1 } : a));
        try {
            const articleRef = doc(db, "articles", articleId);
            const articleSnap = await getDoc(articleRef);
            if (articleSnap.exists()) {
                const currentClaps = articleSnap.data().claps || 0;
                await updateDoc(articleRef, { claps: currentClaps + 1 });
            }
        } catch (error) {
            console.error("Erro ao adicionar clap:", error);
        }
    };

    const handleSaveUser = async (userToSave: User) => {
        const isNew = !users.some(u => u.id === userToSave.id);
        setUsers(prev => isNew ? [...prev, userToSave] : prev.map(u => u.id === userToSave.id ? userToSave : u));
        if (user && user.id === userToSave.id) {
            setUser(userToSave);
        }
        showToast("✅ Usuário salvo com sucesso!");
        try {
            await setDoc(doc(db, "users", userToSave.id), userToSave);
        } catch (error) {
            console.error("Erro ao salvar usuário:", error);
        }
    };

    const handleUpdateUserProfile = async (userToUpdate: User) => {
        if (user && user.id === userToUpdate.id) {
            setUser(userToUpdate);
        }
        setUsers(prev => prev.map(u => u.id === userToUpdate.id ? userToUpdate : u));

        try {
            await setDoc(doc(db, "users", userToUpdate.id), userToUpdate);
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            showToast("❌ Erro ao atualizar perfil no banco de dados.");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm("Tem certeza que deseja desativar este usuário?")) {
            try {
                await updateDoc(doc(db, "users", userId), { accountStatus: 'inactive' });
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, accountStatus: 'inactive' } : u));
                showToast("🚫 Usuário desativado.");
            } catch (error) {
                console.error("Erro ao desativar usuário:", error);
                showToast("❌ Erro ao desativar usuário.");
            }
        }
    };

    const handlePermanentDeleteUser = async (userId: string, userName: string) => {
        const confirmMessage = `⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL!\n\nVocê está prestes a DELETAR PERMANENTEMENTE:\n• ${userName}\n• Todos os dados serão perdidos\n• Não poderá ser desfeito\n\nDigite "DELETAR" para confirmar:`;
        
        const confirmation = window.prompt(confirmMessage);
        
        if (confirmation !== 'DELETAR') {
            if (confirmation !== null) {
                showToast("❌ Operação cancelada. Digite exatamente 'DELETAR' para confirmar.");
            }
            return;
        }

        try {
            // 1. Deletar do Firestore
            await deleteDoc(doc(db, "users", userId));
            
            // 2. Remover do estado local
            setUsers(prev => prev.filter(u => u.id !== userId));
            
            // Nota: Deletar do Firebase Auth requer Firebase Admin SDK (backend)
            // Por segurança, isso deve ser feito via Cloud Function
            
            showToast("🗑️ Usuário deletado permanentemente do Firestore.");
            showToast("⚠️ Lembre-se de deletar também do Firebase Auth Console.");
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            showToast("❌ Erro ao deletar usuário.");
        }
    };

    const handleUnlockLesson = async (studentId: string, lessonId: string) => {
        try {
            const student = users.find(u => u.id === studentId);
            if (!student) return;

            const unlockedLessonIds = student.unlockedLessonIds || [];
            if (unlockedLessonIds.includes(lessonId)) return; // Já desbloqueada

            const updatedUnlockedIds = [...unlockedLessonIds, lessonId];
            const updatedStudent = { ...student, unlockedLessonIds: updatedUnlockedIds };

            setUsers(prev => prev.map(u => u.id === studentId ? updatedStudent : u));
            if (user && user.id === studentId) {
                setUser(updatedStudent);
            }

            await updateDoc(doc(db, "users", studentId), { unlockedLessonIds: updatedUnlockedIds });
            showToast("🔓 Aula desbloqueada com sucesso!");
        } catch (error) {
            console.error("Erro ao desbloquear aula:", error);
            showToast("❌ Erro ao desbloquear aula.");
        }
    };

    const handleLockLesson = async (studentId: string, lessonId: string) => {
        try {
            const student = users.find(u => u.id === studentId);
            if (!student) return;

            const unlockedLessonIds = student.unlockedLessonIds || [];
            const updatedUnlockedIds = unlockedLessonIds.filter(id => id !== lessonId);
            const updatedStudent = { ...student, unlockedLessonIds: updatedUnlockedIds };

            setUsers(prev => prev.map(u => u.id === studentId ? updatedStudent : u));
            if (user && user.id === studentId) {
                setUser(updatedStudent);
            }

            await updateDoc(doc(db, "users", studentId), { unlockedLessonIds: updatedUnlockedIds });
            showToast("🔒 Aula bloqueada novamente.");
        } catch (error) {
            console.error("Erro ao bloquear aula:", error);
            showToast("❌ Erro ao bloquear aula.");
        }
    };

    const handleSaveProject = async (projectToSave: Project) => {
        const isNew = !projects.some(p => p.id === projectToSave.id);
        setProjects(prev => isNew ? [...prev, projectToSave] : prev.map(p => p.id === projectToSave.id ? projectToSave : p));
        showToast("✅ Projeto salvo!");
        try {
            await setDoc(doc(db, "projects", projectToSave.id), projectToSave);
        } catch (error) {
            console.error("Erro ao salvar projeto:", error);
        }
    };

    const handleApproveProject = async (projectId: string) => {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'approved' } : p));
        showToast("✅ Projeto aprovado!");
        try {
            await updateDoc(doc(db, "projects", projectId), { status: 'approved' });
        } catch (error) {
            console.error("Erro ao aprovar projeto:", error);
        }
    };

    const handleRejectProject = async (projectId: string) => {
        if (window.confirm("Tem certeza que deseja rejeitar este projeto?")) {
            setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'rejected' } : p));
            showToast("🚫 Projeto rejeitado.");
            try {
                await updateDoc(doc(db, "projects", projectId), { status: 'rejected' });
            } catch (error) {
                console.error("Erro ao rejeitar projeto:", error);
            }
        }
    };

    const handleAddClap = async (projectId: string) => {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, claps: p.claps + 1 } : p));
        try {
            const projRef = doc(db, "projects", projectId);
            const projSnap = await getDoc(projRef);
            if (projSnap.exists()) {
                await updateDoc(projRef, { claps: (projSnap.data().claps || 0) + 1 });
            }
        } catch (error) {
            console.error("Erro ao adicionar clap no projeto:", error);
        }
    };

    const handleAddComment = async (projectId: string, text: string) => {
        if (!user) return;
        const newComment: ProjectComment = {
            id: `c_${Date.now()}`,
            authorId: user.id,
            text,
            createdAt: new Date().toLocaleDateString()
        };
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, comments: [...p.comments, newComment] } : p));
        try {
            const projRef = doc(db, "projects", projectId);
            const projSnap = await getDoc(projRef);
            if (projSnap.exists()) {
                const comments = projSnap.data().comments || [];
                await updateDoc(projRef, { comments: [...comments, newComment] });
            }
        } catch (error) {
            console.error("Erro ao adicionar comentário:", error);
        }
    };

    const handleSaveEvent = async (eventToSave: Event) => {
        const isNew = !events.some(e => e.id === eventToSave.id);
        setEvents(prev => isNew ? [...prev, eventToSave] : prev.map(e => e.id === eventToSave.id ? eventToSave : e));
        showToast("✅ Evento salvo!");
        try {
            await setDoc(doc(db, "events", eventToSave.id), eventToSave);
            
            // Notify students about new event
            if (isNew) {
                notifyNewEvent(eventToSave);
            }
        } catch (error) {
            console.error("Erro ao salvar evento:", error);
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (window.confirm("Excluir este evento?")) {
            try {
                await deleteDoc(doc(db, "events", eventId));
                setEvents(prev => prev.filter(e => e.id !== eventId));
                showToast("🗑️ Evento excluído.");
            } catch (error) {
                console.error("Erro ao excluir evento:", error);
            }
        }
    };

    const handleSaveTeamOrder = async (orderedTeam: User[]) => {
        setUsers(prev => {
            const newUsers = [...prev];
            orderedTeam.forEach((member, index) => {
                const userIndex = newUsers.findIndex(u => u.id === member.id);
                if (userIndex > -1) {
                    newUsers[userIndex] = { ...newUsers[userIndex], displayOrder: index };
                }
            });
            return newUsers;
        });

        try {
            const batch = writeBatch(db);
            orderedTeam.forEach((member, index) => {
                const ref = doc(db, "users", member.id);
                batch.update(ref, { displayOrder: index });
            });
            await batch.commit();
            showToast("✅ Ordem da equipe atualizada!");
        } catch (error) {
            console.error("Erro ao salvar ordem da equipe:", error);
            showToast("❌ Erro ao salvar ordem.");
        }
    };

    const handleSaveCommunityPost = async (postToSave: CommunityPost) => {
        const isNew = !communityPosts.some(p => p.id === postToSave.id);
        setCommunityPosts(prev => isNew ? [postToSave, ...prev] : prev.map(p => p.id === postToSave.id ? postToSave : p));
        showToast("✅ Post salvo!");
        try {
            await setDoc(doc(db, "communityPosts", postToSave.id), postToSave);
        } catch (error) {
            console.error("Erro ao salvar post:", error);
        }
    };

    const handleDeleteCommunityPost = async (postId: string) => {
        if (window.confirm("Excluir este post?")) {
            try {
                await deleteDoc(doc(db, "communityPosts", postId));
                setCommunityPosts(prev => prev.filter(p => p.id !== postId));
                showToast("🗑️ Post excluído.");
            } catch (error) {
                console.error("Erro ao excluir post:", error);
            }
        }
    };

    const handleAddCommunityPostClap = async (postId: string) => {
        setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, claps: p.claps + 1 } : p));
        try {
            const postRef = doc(db, "communityPosts", postId);
            const postSnap = await getDoc(postRef);
            if (postSnap.exists()) {
                await updateDoc(postRef, { claps: (postSnap.data().claps || 0) + 1 });
            }
        } catch (error) {
            console.error("Erro ao adicionar clap no post:", error);
        }
    };

    const handleAddCommunityReply = async (postId: string, text: string) => {
        if (!user) return;
        const newReply: CommunityReply = {
            id: `r_${Date.now()}`,
            authorId: user.id,
            content: text,
            createdAt: new Date().toISOString()
        };
        setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p));
        try {
            const postRef = doc(db, "communityPosts", postId);
            const postSnap = await getDoc(postRef);
            if (postSnap.exists()) {
                const replies = postSnap.data().replies || [];
                await updateDoc(postRef, { replies: [...replies, newReply] });
            }
        } catch (error) {
            console.error("Erro ao adicionar resposta:", error);
        }
    };

    const handleAddSessionSlot = async (mentorId: string, date: string, time: string) => {
        const newSession: MentorSession = {
            id: `session_${mentorId}_${date}_${time.replace(':', '')}`,
            mentorId, date, time, isBooked: false, studentId: null
        };
        setMentorSessions(prev => [...prev, newSession]);
        showToast("✅ Horário disponibilizado.");
        try {
            await setDoc(doc(db, "mentorSessions", newSession.id), newSession);
        } catch (error) {
            console.error("Erro ao criar sessão de mentoria:", error);
        }
    };

    const handleRemoveSessionSlot = async (mentorId: string, date: string, time: string) => {
        const sessionId = `session_${mentorId}_${date}_${time.replace(':', '')}`;
        setMentorSessions(prev => prev.filter(s => s.id !== sessionId));
        showToast("🗑️ Horário removido.");
        try {
            await deleteDoc(doc(db, "mentorSessions", sessionId));
        } catch (error) {
            console.error("Erro ao remover sessão:", error);
        }
    };

    const handleBookSession = async (sessionId: string) => {
        if (!user) return;
        setMentorSessions(prev => prev.map(s => s.id === sessionId ? { ...s, isBooked: true, studentId: user.id, googleMeetUrl: 'https://meet.google.com/abc-defg-hij' } : s));
        showToast("✅ Mentoria agendada! Verifique seu painel.");
        try {
            await updateDoc(doc(db, "mentorSessions", sessionId), {
                isBooked: true,
                studentId: user.id,
                googleMeetUrl: 'https://meet.google.com/abc-defg-hij' // Mock meet link
            });
        } catch (error) {
            console.error("Erro ao agendar mentoria:", error);
            showToast("❌ Erro ao agendar. Tente novamente.");
        }
    };

    const handleCancelSession = async (sessionId: string) => {
        setMentorSessions(prev => prev.map(s => s.id === sessionId ? { ...s, isBooked: false, studentId: null, googleMeetUrl: undefined } : s));
        showToast("🗑️ Agendamento cancelado.");
        try {
            await updateDoc(doc(db, "mentorSessions", sessionId), {
                isBooked: false,
                studentId: null,
                googleMeetUrl: null
            });
        } catch (error) {
            console.error("Erro ao cancelar mentoria:", error);
        }
    };

    const handleCreateTrack = async (trackName: string) => {
        const newTrack: Track = { id: `track_${Date.now()}`, name: trackName };
        setTracks(prev => [...prev, newTrack]);
        showToast("✅ Trilha criada!");
        try {
            await setDoc(doc(db, "tracks", newTrack.id), newTrack);
        } catch (error) {
            console.error("Erro ao criar trilha:", error);
        }
    };

    const handleUpdateTrack = async (trackId: string, oldName: string, newName: string) => {
        setTracks(prev => prev.map(t => t.id === trackId ? { ...t, name: newName } : t));
        // Also update courses with this track
        setCourses(prev => prev.map(c => c.track === oldName ? { ...c, track: newName } : c));
        showToast("✅ Trilha atualizada!");

        try {
            await updateDoc(doc(db, "tracks", trackId), { name: newName });

            // Update all courses that have this track
            const coursesToUpdate = courses.filter(c => c.track === oldName);
            const batch = writeBatch(db);
            coursesToUpdate.forEach(c => {
                const ref = doc(db, "courses", c.id);
                batch.update(ref, { track: newName });
            });
            if (coursesToUpdate.length > 0) {
                await batch.commit();
            }
        } catch (error) {
            console.error("Erro ao atualizar trilha:", error);
        }
    };

    const handleDeleteTrack = async (trackId: string) => {
        if (window.confirm("Excluir esta trilha?")) {
            setTracks(prev => prev.filter(t => t.id !== trackId));
            showToast("🗑️ Trilha excluída.");
            try {
                await deleteDoc(doc(db, "tracks", trackId));
            } catch (error) {
                console.error("Erro ao excluir trilha:", error);
            }
        }
    };

    const handleSaveFinancialStatement = async (statement: FinancialStatement) => {
        const isNew = !financialStatements.some(s => s.id === statement.id);
        setFinancialStatements(prev => isNew ? [statement, ...prev] : prev.map(s => s.id === statement.id ? statement : s));
        showToast("✅ Relatório Financeiro salvo!");
        try {
            await setDoc(doc(db, "financialStatements", statement.id), statement);
        } catch (error) {
            console.error("Erro ao salvar relatório financeiro:", error);
            showToast("❌ Erro ao salvar no banco de dados.");
        }
    };

    const handleDeleteFinancialStatement = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este relatório financeiro?")) {
            setFinancialStatements(prev => prev.filter(s => s.id !== id));
            showToast("🗑️ Relatório excluído.");
            try {
                await deleteDoc(doc(db, "financialStatements", id));
            } catch (error) {
                console.error("Erro ao excluir relatório financeiro:", error);
            }
        }
    };

    const handleSaveAnnualReport = async (report: AnnualReport) => {
        const isNew = !annualReports.some(r => r.id === report.id);
        setAnnualReports(prev => isNew ? [report, ...prev] : prev.map(r => r.id === report.id ? report : r));
        showToast("✅ Relatório Anual salvo!");
        try {
            await setDoc(doc(db, "annualReports", report.id), report);
        } catch (error) {
            console.error("Erro ao salvar relatório anual:", error);
            showToast("❌ Erro ao salvar no banco de dados.");
        }
    };

    const handleDeleteAnnualReport = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este relatório anual?")) {
            setAnnualReports(prev => prev.filter(r => r.id !== id));
            showToast("🗑️ Relatório excluído.");
            try {
                await deleteDoc(doc(db, "annualReports", id));
            } catch (error) {
                console.error("Erro ao excluir relatório anual:", error);
            }
        }
    };

    const handleSaveMarketingPost = async (post: MarketingPost) => {
        const isNew = !marketingPosts.some(p => p.id === post.id);
        setMarketingPosts(prev => isNew ? [post, ...prev] : prev.map(p => p.id === post.id ? post : p));

        const message = post.status === 'published' ? "✅ Post publicado com sucesso!" : "💾 Rascunho salvo!";
        showToast(message);

        try {
            await setDoc(doc(db, "marketingPosts", post.id), post);
        } catch (error) {
            console.error("Erro ao salvar post de marketing:", error);
            showToast("❌ Erro ao salvar no banco de dados.");
        }
    };

    const handleDeleteMarketingPost = async (postId: string) => {
        if (window.confirm("Tem certeza que deseja excluir este post?")) {
            setMarketingPosts(prev => prev.filter(p => p.id !== postId));
            showToast("🗑️ Post excluído.");
            try {
                await deleteDoc(doc(db, "marketingPosts", postId));
            } catch (error) {
                console.error("Erro ao excluir post de marketing:", error);
            }
        }
    };

    // --- Notification Management ---
    
    const handleMarkNotificationAsRead = async (notificationId: string) => {
        setNotifications(prev => prev.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
        ));
        
        try {
            await updateDoc(doc(db, "notifications", notificationId), { isRead: true });
        } catch (error) {
            console.error("Erro ao marcar notificação como lida:", error);
        }
    };

    const handleMarkAllNotificationsAsRead = async () => {
        if (!user) return;
        
        const userNotifications = notifications.filter(n => n.userId === user.id && !n.isRead);
        setNotifications(prev => prev.map(n => 
            n.userId === user.id ? { ...n, isRead: true } : n
        ));
        
        try {
            const batch = writeBatch(db);
            userNotifications.forEach(n => {
                batch.update(doc(db, "notifications", n.id), { isRead: true });
            });
            await batch.commit();
            showToast("✅ Todas as notificações marcadas como lidas");
        } catch (error) {
            console.error("Erro ao marcar todas como lidas:", error);
        }
    };

    const handleDeleteNotification = async (notificationId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        try {
            await deleteDoc(doc(db, "notifications", notificationId));
        } catch (error) {
            console.error("Erro ao excluir notificação:", error);
        }
    };

    const handleCreateNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
        const newNotification: Notification = {
            ...notification,
            id: `notif_${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        try {
            await setDoc(doc(db, "notifications", newNotification.id), newNotification);
        } catch (error) {
            console.error("Erro ao criar notificação:", error);
        }
    };

    // Helper: Notify all students about new course
    const notifyNewCourse = async (course: Course) => {
        const students = users.filter(u => u.role === 'student' && u.notificationPreferences?.newCoursesAndClasses !== false);
        
        for (const student of students) {
            await handleCreateNotification({
                userId: student.id,
                type: 'course',
                title: 'Novo Curso Disponível! 🎉',
                message: `O curso "${course.title}" acabou de ser lançado. Confira agora!`,
                actionUrl: `/curso/${course.id}`,
                actionLabel: 'Ver Curso',
                icon: '📚',
                relatedId: course.id,
                isRead: false
            });
        }
    };

    // Helper: Notify students about new lesson in enrolled courses
    const notifyNewLesson = async (courseId: string, lessonTitle: string) => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;
        
        // In a real app, you'd track enrolled students
        const students = users.filter(u => u.role === 'student' && u.notificationPreferences?.newCoursesAndClasses !== false);
        
        for (const student of students) {
            await handleCreateNotification({
                userId: student.id,
                type: 'lesson',
                title: 'Nova Aula Adicionada! 📖',
                message: `Uma nova aula "${lessonTitle}" foi adicionada ao curso "${course.title}".`,
                actionUrl: `/curso/${courseId}`,
                actionLabel: 'Ver Aula',
                icon: '📖',
                relatedId: courseId,
                isRead: false
            });
        }
    };

    // Helper: Notify about new event
    const notifyNewEvent = async (event: Event) => {
        const students = users.filter(u => u.role === 'student' && u.notificationPreferences?.communityEvents !== false);
        
        for (const student of students) {
            await handleCreateNotification({
                userId: student.id,
                type: 'event',
                title: 'Novo Evento! 📅',
                message: `${event.title} - ${event.date} às ${event.time}`,
                actionUrl: `/evento/${event.id}`,
                actionLabel: 'Ver Detalhes',
                icon: '📅',
                relatedId: event.id,
                isRead: false
            });
        }
    };

    // Helper: Notify about achievement
    const notifyAchievement = async (userId: string, achievementTitle: string, achievementDescription: string) => {
        await handleCreateNotification({
            userId,
            type: 'achievement',
            title: `Conquista Desbloqueada! 🏆`,
            message: `Parabéns! Você conquistou: ${achievementTitle}`,
            actionUrl: '/painel',
            actionLabel: 'Ver Conquistas',
            icon: '🏆',
            isRead: false
        });
    };

    const handleCompleteOnboarding = async () => {
        if (user) {
            const updatedUser = { ...user, hasCompletedOnboardingTour: true };
            setUser(updatedUser);
            try {
                await updateDoc(doc(db, "users", user.id), { hasCompletedOnboardingTour: true });
            } catch (error) {
                console.error("Erro ao completar onboarding:", error);
            }
        }
    };

    const loadData = async (resources: string[]) => {
        const promises = resources.map(async (resource) => {
            switch (resource) {
                case 'users': await fetchAndPopulateCollection('users', setUsers); break;
                case 'courses': await fetchAndPopulateCollection('courses', setCourses); break;
                case 'articles': await fetchAndPopulateCollection('articles', setArticles); break;
                case 'projects': await fetchAndPopulateCollection('projects', setProjects); break;
                case 'communityPosts': await fetchAndPopulateCollection('communityPosts', setCommunityPosts); break;
                case 'partners': await fetchAndPopulateCollection('partners', setPartners); break;
                case 'supporters': await fetchAndPopulateCollection('supporters', setSupporters); break;
                case 'events': await fetchAndPopulateCollection('events', setEvents); break;
                case 'mentorSessions': await fetchAndPopulateCollection('mentorSessions', setMentorSessions); break;
                case 'tracks': await fetchAndPopulateCollection('tracks', setTracks); break;
                case 'financialStatements': await fetchAndPopulateCollection('financialStatements', setFinancialStatements); break;
                case 'annualReports': await fetchAndPopulateCollection('annualReports', setAnnualReports); break;
                case 'marketingPosts': await fetchAndPopulateCollection('marketingPosts', setMarketingPosts); break;
            }
        });
        await Promise.all(promises);
    };

    const fetchLessonContent = async (courseId: string, lessonId: string): Promise<Lesson | null> => {
        try {
            const docRef = doc(db, "courses", courseId, "lessons", lessonId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Lesson;
            }

            // Fallback for mock data or if not found in subcollection
            const course = courses.find(c => c.id === courseId);
            if (course) {
                const lesson = course.modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
                if (lesson) return lesson;
            }
            return null;
        } catch (error) {
            console.error("Error fetching lesson content:", error);
            return null;
        }
    };

    // --- Memoized Derived Data ---
    const instructors = useMemo(() => users.filter(u => u.role === 'instructor' || u.role === 'admin'), [users]);
    const mentors = useMemo(() => users.filter(u => u.isMentor), [users]);

    const courseProgress: CourseProgress = useMemo(() => {
        if (!user) return { inProgressCourses: [], completedCourses: [] };

        const inProgressCourses: { course: Course; progress: number }[] = [];
        const completedCourses: Course[] = [];

        courses.forEach(course => {
            const courseLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
            if (courseLessonIds.length === 0) return;

            const completedInCourse = user.completedLessonIds.filter(id => courseLessonIds.includes(id));
            const progress = Math.round((completedInCourse.length / courseLessonIds.length) * 100);

            if (progress === 100) {
                completedCourses.push(course);
            } else if (progress > 0) {
                inProgressCourses.push({ course, progress });
            }
        });

        return { inProgressCourses, completedCourses };
    }, [user, courses]);


    // Handlers for modals
    const openProfileModal = (member: User) => { setSelectedProfile(member); setIsProfileModalOpen(true); };
    const closeProfileModal = () => { setIsProfileModalOpen(false); setSelectedProfile(null); };

    const openBottleneckModal = (lesson: Lesson, students: User[]) => { setSelectedBottleneck({ lesson, students }); setIsBottleneckModalOpen(true); };
    const closeBottleneckModal = () => { setIsBottleneckModalOpen(false); setSelectedBottleneck(null); };

    const openInscriptionModal = (course: Course) => { setSelectedCourseForInscription(course); setIsInscriptionModalOpen(true); };
    const closeInscriptionModal = () => { setIsInscriptionModalOpen(false); setSelectedCourseForInscription(null); };


    const value = useMemo(() => ({
        user, users, courses, articles, team: users.filter(u => u.showOnTeamPage), projects, communityPosts, partners, supporters, events, mentorSessions, tracks, financialStatements, annualReports, marketingPosts, notifications, toast,
        courseProgress, isProfileModalOpen, selectedProfile, isBottleneckModalOpen, selectedBottleneck, isInscriptionModalOpen, selectedCourseForInscription,
        instructors, mentors, loading, setUser,
        settings, updateSettings, // New settings context
        loadData, // Expose lazy loader
        fetchLessonContent, // Expose lesson content fetcher
        handleLogout, openProfileModal, closeProfileModal, openBottleneckModal, closeBottleneckModal, openInscriptionModal, closeInscriptionModal,
        completeLesson, handleCompleteOnboarding, handleSaveNote, showToast,
        handleSaveCourse, handleDeleteCourse, handleSaveArticle, handleDeleteArticle, handleToggleArticleStatus, handleAddArticleClap,
        handleSaveUser, handleUpdateUserProfile, handleDeleteUser, handlePermanentDeleteUser, handleUnlockLesson, handleLockLesson, handleSaveProject, handleApproveProject, handleRejectProject, handleAddClap, handleAddComment,
        handleSaveEvent, handleDeleteEvent, handleSaveTeamOrder, handleSaveCommunityPost, handleDeleteCommunityPost, handleAddCommunityPostClap, handleAddCommunityReply,
        handleAddSessionSlot, handleRemoveSessionSlot, handleBookSession, handleCancelSession, handleCreateTrack, handleUpdateTrack, handleDeleteTrack,
        handleSaveFinancialStatement, handleDeleteFinancialStatement, handleSaveAnnualReport, handleDeleteAnnualReport,
        handleSaveMarketingPost, handleDeleteMarketingPost,
        handleMarkNotificationAsRead, handleMarkAllNotificationsAsRead, handleDeleteNotification, handleCreateNotification
    }), [
        user, users, courses, articles, projects, communityPosts, partners, supporters, events, mentorSessions, tracks, financialStatements, annualReports, marketingPosts, notifications, toast,
        courseProgress, isProfileModalOpen, selectedProfile, isBottleneckModalOpen, selectedBottleneck, isInscriptionModalOpen, selectedCourseForInscription,
        instructors, mentors, loading, loadData, settings // Add settings dependency
    ]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

const AppContent: React.FC = () => {
    const { user, toast, isProfileModalOpen, selectedProfile, isBottleneckModalOpen, selectedBottleneck, isInscriptionModalOpen, selectedCourseForInscription, handleCompleteOnboarding, closeProfileModal, closeBottleneckModal, closeInscriptionModal, showToast } = useAppContext();

    const location = useLocation();
    const navigate = useNavigate();

    // Updated logic: Consider lessons, certificates, dashboard, admin, profile and change password as "Workspace" routes
    // This effectively hides the global Institutional Header/Footer on these pages.
    const isWorkspaceRoute =
        location.pathname.startsWith('/painel') ||
        location.pathname.startsWith('/admin') ||
        location.pathname.includes('/aula/') ||
        location.pathname.includes('/certificado') ||
        location.pathname.includes('/perfil') ||
        location.pathname.includes('/alterar-senha');

    // --- Route Guards ---
    useEffect(() => {
        if (user) {
            // Force password change if flag is set, but only if not already there
            if (user.mustChangePassword && location.pathname !== '/alterar-senha') {
                showToast("⚠️ Você precisa alterar sua senha temporária.");
                navigate('/alterar-senha', { replace: true });
                return;
            }

            // Force profile completion ONLY for STUDENTS attempting to access Workspace routes
            // Instructors and admins skip this step
            // This allows "Window Shopping" in the catalog but protects the educational content.
            if (!user.mustChangePassword && 
                user.role === 'student' && 
                user.profileStatus === 'incomplete' && 
                location.pathname !== '/completar-perfil' && 
                isWorkspaceRoute) {
                showToast("📝 Complete seu perfil para acessar o painel.");
                navigate('/completar-perfil', { replace: true });
                return;
            }
        }
    }, [user, location.pathname, navigate, showToast, isWorkspaceRoute]);

    return (
        <div className="flex flex-col min-h-screen bg-[#09090B] bg-[var(--color-background)] text-white font-sans selection:bg-[#8a4add] selection:text-white overflow-x-hidden">
            <ScrollToTop />
            {!isWorkspaceRoute && <Header />}
            {/* Componente de Tracking do Google Analytics */}
            <AnalyticsTracker />
            <main className="flex-grow relative">
                {/* ScrollSpaceship desativado - jogo de nave removido */}
                {!isWorkspaceRoute && <WhatsAppButton />}
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/cursos" element={<Courses />} />
                        {/* Support both ID and Slug in routes */}
                        <Route path="/curso/:courseId" element={<CourseDetail />} />
                        <Route path="/curso-info/:courseId" element={<CourseLandingPage />} />
                        <Route path="/curso/:courseId/aula/:lessonId" element={<LessonView />} />
                        <Route path="/curso/:courseId/certificado" element={<CertificateView />} />
                        <Route path="/painel" element={<Dashboard />} />
                        <Route path="/conectar" element={<ConnectView />} />
                        <Route path="/blog" element={<Blog />} />
                        {/* Support both ID and Slug in article routes */}
                        <Route path="/artigo/:articleId" element={<ArticleView />} />
                        <Route path="/entrar" element={<Login />} />
                        <Route path="/cadastro" element={<Register />} />
                        <Route path="/esqueci-senha" element={<ForgotPassword />} />
                        <Route path="/completar-perfil" element={<CompleteProfile />} />
                        <Route path="/perfil" element={<Profile />} />
                        <Route path="/alterar-senha" element={<ChangePassword />} />
                        <Route path="/admin" element={<Dashboard />} />
                        <Route path="/admin/editor-curso" element={<CourseEditor />} />
                        <Route path="/admin/editor-curso/:courseId" element={<CourseEditor />} />
                        <Route path="/admin/editor-artigo" element={<ArticleEditor />} />
                        <Route path="/admin/editor-artigo/:articleId" element={<ArticleEditor />} />
                        <Route path="/admin/editor-usuario/novo" element={<StudentEditor />} />
                        <Route path="/admin/editor-usuario/:userId" element={<StudentEditor />} />
                        <Route path="/admin/editor-equipe/novo" element={<TeamMemberEditor />} />
                        <Route path="/admin/editor-equipe/:userId" element={<TeamMemberEditor />} />
                        <Route path="/admin/editor-evento/new" element={<EventEditor />} />
                        <Route path="/admin/editor-evento/:eventId" element={<EventEditor />} />
                        <Route path="/admin/painel-instrutor/:courseId" element={<InstructorCourseDashboard />} />
                        <Route path="/admin/editor-transparencia" element={<TransparencyEditor />} />
                        <Route path="/admin/editor-transparencia/:type/:id" element={<TransparencyEditor />} />
                        <Route path="/analise" element={<Analytics />} />
                        <Route path="/gemini-api-dashboard" element={<GeminiApiDashboard />} />
                        <Route path="/comunidade" element={<CommunityView />} />
                        <Route path="/forum" element={<ForumView />} />
                        <Route path="/projeto/:projectId" element={<ProjectDetailView />} />
                        <Route path="/projeto/editar" element={<ProjectEditor />} />
                        <Route path="/projeto/editar/:projectId" element={<ProjectEditor />} />
                        <Route path="/comunidade/post/novo" element={<ForumPostEditor />} />
                        <Route path="/comunidade/post/:postId" element={<ForumPostDetailView />} />
                        <Route path="/parcerias" element={<PartnershipsUnifiedView />} />
                        <Route path="/apoiadores" element={<PartnershipsUnifiedView />} />
                        <Route path="/apoiador/:partnerId" element={<PartnerDetailView />} />
                        <Route path="/eventos" element={<EventsView />} />
                        <Route path="/evento/novo" element={<EventEditor />} />
                        <Route path="/evento/editar/:eventId" element={<EventEditor />} />
                        <Route path="/evento/:eventId" element={<EventDetailView />} />
                        <Route path="/privacidade" element={<PrivacyPolicyView />} />
                        <Route path="/termos" element={<TermsOfUseView />} />
                        <Route path="/equipe" element={<TeamView />} />
                        <Route path="/doar" element={<DonateView />} />
                        <Route path="/sobre" element={<AboutUsView />} />
                        <Route path="/transparencia" element={<TransparencyView />} />
                        <Route path="/relatorio-anual" element={<AnnualReportView />} />
                        <Route path="/contato" element={<ContactView />} />
                        <Route path="/demonstrativo-financeiro" element={<FinancialStatementView />} />
                        <Route path="/upload-test" element={<StudentUploadTest />} />
                        <Route path="/api-test" element={<ApiTest />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </main>
            {!isWorkspaceRoute && <Footer />}

            {/* Modals */}
            {isProfileModalOpen && selectedProfile && <ProfileModal member={selectedProfile} onClose={closeProfileModal} />}
            {isBottleneckModalOpen && selectedBottleneck && <BottleneckAnalysisModal isOpen={isBottleneckModalOpen} onClose={closeBottleneckModal} lesson={selectedBottleneck.lesson} students={selectedBottleneck.students} />}
            {isInscriptionModalOpen && <InscriptionFormModal isOpen={isInscriptionModalOpen} onClose={closeInscriptionModal} courseName={selectedCourseForInscription?.title} />}

            {/* Onboarding Tour */}
            {user && !user.hasCompletedOnboardingTour && user.profileStatus === 'complete' && (
                <OnboardingTour onComplete={handleCompleteOnboarding} />
            )}

            {toast && (
                <div className="fixed bottom-4 right-4 bg-white text-black px-6 py-3 rounded-lg shadow-2xl z-[100] animate-slide-up flex items-center gap-2 border-l-4 border-[#8a4add]">
                    {toast}
                </div>
            )}
        </div>
    );
}


const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
