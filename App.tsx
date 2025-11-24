
import React, { useState, useCallback, useEffect, createContext, useContext, useMemo } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, writeBatch, getDoc } from 'firebase/firestore';
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { User, View, Course, Lesson, Achievement, Article, Project, ProjectComment, AppContextType, Partner, Event, MentorSession, CourseProgress, CommunityPost, CommunityReply, Track, FinancialStatement, AnnualReport, Supporter, MarketingPost } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import ConnectView from './views/ConnectView';
import Blog from './views/Blog';
import Login from './views/Login';
import Register from './views/Register';
import CompleteProfile from './views/CompleteProfile';
import Profile from './views/Profile';
import CourseDetail from './views/CourseDetail';
import LessonView from './views/LessonView';
import Admin from './views/Admin';
import CourseEditor from './views/CourseEditor';
import CertificateView from './views/CertificateView';
import Analytics from './views/Analytics';
import ArticleView from './views/ArticleView';
import ArticleEditor from './views/ArticleEditor';
import StudentEditor from './views/StudentEditor';
import InstructorCourseDashboard from './views/InstructorCourseDashboard';
import CommunityView from './views/CommunityView';
import ForumView from './views/ForumView';
import ProjectDetailView from './views/ProjectDetailView';
import ProjectEditor from './views/ProjectEditor';
import PartnershipsView from './views/PartnershipsView';
import EventEditor from './views/EventEditor';
import PrivacyPolicyView from './views/PrivacyPolicyView';
import TermsOfUseView from './views/TermsOfUseView';
import TeamView from './views/TeamView';
import TeamMemberEditor from './views/TeamMemberEditor';
import ProfileModal from './components/ProfileModal';
import OnboardingTour from './components/OnboardingTour';
import Courses from './views/Courses';
import DonateView from './views/DonateView';
import AboutUsView from './views/AboutUsView';
import AnnualReportView from './views/AnnualReportView';
import FinancialStatementView from './views/FinancialStatementView';
import EventDetailView from './views/EventDetailView';
import ChangePassword from './views/ChangePassword';
import BottleneckAnalysisModal from './components/BottleneckAnalysisModal';
import CourseLandingPage from './views/CourseLandingPage';
import InscriptionFormModal from './components/InscriptionFormModal';
import SupportersView from './views/SupportersView';
import PartnerDetailView from './views/PartnerDetailView';
import { MOCK_COURSES, MOCK_PROJECTS, ARTICLES, MOCK_COMMUNITY_POSTS, MOCK_EVENTS, MOCK_SUPPORTERS, MOCK_FINANCIAL_STATEMENTS, MOCK_ANNUAL_REPORTS } from './constants';
import ScrollSpaceship from './components/ScrollSpaceship';
import PageLayout from './components/PageLayout';
import StudentUploadTest from './views/StudentUploadTest';
import ForumPostDetailView from './views/ForumPostDetailView';
import ForumPostEditor from './views/ForumPostEditor';
import ApiTest from './views/ApiTest';
import ScrollToTop from './components/ScrollToTop';
import TransparencyEditor from './views/TransparencyEditor';
import AnalyticsTracker from './components/AnalyticsTracker';


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


const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
        const collRef = collection(db, collectionName);
        const snapshot = await getDocs(collRef);
        let dataFromDb = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        
        if (collectionName === 'courses') {
            const mockCourseIds = new Set(MOCK_COURSES.map(c => c.id));
            const additionalDbCourses = dataFromDb.filter(dbCourse => !mockCourseIds.has((dbCourse as Course).id));
            dataFromDb = [...MOCK_COURSES, ...additionalDbCourses];
        }
        
        if (collectionName === 'articles') {
            dataFromDb = dataFromDb.map(article => ({
                ...article,
                readingTime: calculateReadingTime(article.content)
            }));
            const mockArticleIds = new Set(ARTICLES.map(a => a.id));
            const additionalDbArticles = dataFromDb.filter(dbArticle => !mockArticleIds.has((dbArticle as Article).id));
            dataFromDb = [...ARTICLES, ...additionalDbArticles];
        }
        
        if (collectionName === 'projects') {
            const mockProjectIds = new Set(MOCK_PROJECTS.map(c => c.id));
            const additionalDbProjects = dataFromDb.filter(dbProject => !mockProjectIds.has((dbProject as Project).id));
            dataFromDb = [...MOCK_PROJECTS, ...additionalDbProjects];
            
            // Ensure existing mocks have status
            dataFromDb = dataFromDb.map(p => ({...p, status: (p as Project).status || 'approved'}));
        }

        if (collectionName === 'communityPosts') {
            const mockPostIds = new Set(MOCK_COMMUNITY_POSTS.map(p => p.id));
            const additionalDbPosts = dataFromDb.filter(dbPost => !mockPostIds.has((dbPost as CommunityPost).id));
            dataFromDb = [...MOCK_COMMUNITY_POSTS, ...additionalDbPosts];
        }

        if (collectionName === 'events') {
             const mockEventIds = new Set(MOCK_EVENTS.map(e => e.id));
             const additionalDbEvents = dataFromDb.filter(dbEvent => !mockEventIds.has((dbEvent as Event).id));
             dataFromDb = [...MOCK_EVENTS, ...additionalDbEvents];
        }
        
        if (collectionName === 'supporters') {
             const mockIds = new Set(MOCK_SUPPORTERS.map(s => s.id));
             const additional = dataFromDb.filter(dbItem => !mockIds.has((dbItem as Supporter).id));
             dataFromDb = [...MOCK_SUPPORTERS, ...additional];
        }
        
        if (collectionName === 'financialStatements') {
             const mockIds = new Set(MOCK_FINANCIAL_STATEMENTS.map(s => s.id));
             const additional = dataFromDb.filter(dbItem => !mockIds.has((dbItem as FinancialStatement).id));
             dataFromDb = [...MOCK_FINANCIAL_STATEMENTS, ...additional];
        }

        if (collectionName === 'annualReports') {
             const mockIds = new Set(MOCK_ANNUAL_REPORTS.map(s => s.id));
             const additional = dataFromDb.filter(dbItem => !mockIds.has((dbItem as AnnualReport).id));
             dataFromDb = [...MOCK_ANNUAL_REPORTS, ...additional];
        }

        setData(dataFromDb);
      } catch (error) {
        console.error(`Erro ao buscar a coleção '${collectionName}':`, error);
        // Allow fetching empty collections for new features without fallback mocks
        if (collectionName !== 'marketingPosts') {
           showToast(`❌ Erro ao carregar ${collectionName}.`);
        }

        if (collectionName === 'courses') {
            setData(MOCK_COURSES);
        } else if (collectionName === 'articles') {
            setData(ARTICLES.map(article => ({ ...article, readingTime: calculateReadingTime(article.content) })));
        } else if (collectionName === 'projects') {
            setData(MOCK_PROJECTS.map(p => ({...p, status: 'approved'})));
        } else if (collectionName === 'communityPosts') {
            setData(MOCK_COMMUNITY_POSTS);
        } else if (collectionName === 'events') {
            setData(MOCK_EVENTS);
        } else if (collectionName === 'supporters') {
            setData(MOCK_SUPPORTERS);
        } else if (collectionName === 'financialStatements') {
            setData(MOCK_FINANCIAL_STATEMENTS);
        } else if (collectionName === 'annualReports') {
            setData(MOCK_ANNUAL_REPORTS);
        }
        else {
            setData([]);
        }
      }
    };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
          fetchAndPopulateCollection('users', setUsers),
          fetchAndPopulateCollection('courses', setCourses),
          fetchAndPopulateCollection('articles', setArticles),
          fetchAndPopulateCollection('projects', setProjects),
          fetchAndPopulateCollection('communityPosts', setCommunityPosts),
          fetchAndPopulateCollection('partners', setPartners),
          fetchAndPopulateCollection('supporters', setSupporters),
          fetchAndPopulateCollection('events', setEvents),
          fetchAndPopulateCollection('mentorSessions', setMentorSessions),
          fetchAndPopulateCollection('tracks', setTracks),
          fetchAndPopulateCollection('financialStatements', setFinancialStatements),
          fetchAndPopulateCollection('annualReports', setAnnualReports),
          fetchAndPopulateCollection('marketingPosts', setMarketingPosts)
      ]);
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
            console.warn("Documento do usuário não encontrado. Tentando novamente em 1.5s para lidar com possível race condition de registro...");
            await new Promise(resolve => setTimeout(resolve, 1500));
            userDoc = await getDoc(userDocRef);
        }

        if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            if (userData.accountStatus === 'inactive') {
                console.warn(`Tentativa de login do usuário desativado: ${userData.id}. Desconectando.`);
                await signOut(auth);
                setUser(null);
            } else {
                setUser(userData);
            }
        } else {
            console.warn("Documento do usuário não existe no Firestore. Criando perfil de fallback para garantir o fluxo de onboarding e corrigir inconsistência.");
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
                console.log("Perfil de fallback criado com sucesso no Firestore.");
            } catch (error) {
                console.error("Falha crítica ao criar documento de fallback no Firestore:", error);
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
  
    const handleSaveCourse = async (courseToSave: Course) => {
        const isNew = !courses.some(c => c.id === courseToSave.id);
        setCourses(prev => isNew ? [...prev, courseToSave] : prev.map(c => c.id === courseToSave.id ? courseToSave : c));
        showToast("✅ Curso salvo com sucesso!");

        try {
            await setDoc(doc(db, "courses", courseToSave.id), courseToSave);
        } catch (error) {
            console.error("Erro ao salvar curso:", error);
        }
    };

    const handleDeleteCourse = async (courseId: string): Promise<boolean> => {
      if(window.confirm("Tem certeza que deseja excluir este curso? Esta ação é irreversível e excluirá todos os módulos e aulas associados.")) {
        try {
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
        if(window.confirm("Tem certeza que deseja excluir este artigo?")) {
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
        } catch(error) {
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
        } catch(error) {
            console.error("Erro ao atualizar perfil:", error);
            showToast("❌ Erro ao atualizar perfil no banco de dados.");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if(window.confirm("Tem certeza que deseja desativar este usuário?")) {
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
    
    const handleSaveProject = async (projectToSave: Project) => {
         const isNew = !projects.some(p => p.id === projectToSave.id);
         setProjects(prev => isNew ? [...prev, projectToSave] : prev.map(p => p.id === projectToSave.id ? projectToSave : p));
         showToast("✅ Projeto salvo!");
         try {
             await setDoc(doc(db, "projects", projectToSave.id), projectToSave);
         } catch(error) {
              console.error("Erro ao salvar projeto:", error);
         }
    };

    const handleApproveProject = async (projectId: string) => {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'approved' } : p));
        showToast("✅ Projeto aprovado!");
        try {
            await updateDoc(doc(db, "projects", projectId), { status: 'approved' });
        } catch(error) {
            console.error("Erro ao aprovar projeto:", error);
        }
    };

    const handleRejectProject = async (projectId: string) => {
        if(window.confirm("Tem certeza que deseja rejeitar este projeto?")) {
             setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'rejected' } : p));
             showToast("🚫 Projeto rejeitado.");
             try {
                 await updateDoc(doc(db, "projects", projectId), { status: 'rejected' });
             } catch(error) {
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
            if(projSnap.exists()) {
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
         } catch(error) {
              console.error("Erro ao salvar evento:", error);
         }
    };
    
    const handleDeleteEvent = async (eventId: string) => {
        if(window.confirm("Excluir este evento?")) {
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
         if(window.confirm("Excluir este post?")) {
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
            if(postSnap.exists()) {
                const replies = postSnap.data().replies || [];
                await updateDoc(postRef, { replies: [...replies, newReply] });
            }
        } catch (error) {
            console.error("Erro ao adicionar resposta:", error);
        }
    };
    
    const handleAddSessionSlot = async (mentorId: string, date: string, time: string) => {
        const newSession: MentorSession = {
            id: `session_${mentorId}_${date}_${time.replace(':','')}`,
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
         const sessionId = `session_${mentorId}_${date}_${time.replace(':','')}`;
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
        if(window.confirm("Excluir esta trilha?")) {
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
        if(window.confirm("Tem certeza que deseja excluir este relatório financeiro?")) {
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
         if(window.confirm("Tem certeza que deseja excluir este relatório anual?")) {
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
        if(window.confirm("Tem certeza que deseja excluir este post?")) {
            setMarketingPosts(prev => prev.filter(p => p.id !== postId));
            showToast("🗑️ Post excluído.");
            try {
                await deleteDoc(doc(db, "marketingPosts", postId));
            } catch (error) {
                console.error("Erro ao excluir post de marketing:", error);
            }
        }
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
    user, users, courses, articles, team: users.filter(u => u.showOnTeamPage), projects, communityPosts, partners, supporters, events, mentorSessions, tracks, financialStatements, annualReports, marketingPosts, toast,
    courseProgress, isProfileModalOpen, selectedProfile, isBottleneckModalOpen, selectedBottleneck, isInscriptionModalOpen, selectedCourseForInscription,
    instructors, mentors, loading, setUser,
    handleLogout, openProfileModal, closeProfileModal, openBottleneckModal, closeBottleneckModal, openInscriptionModal, closeInscriptionModal,
    completeLesson, handleCompleteOnboarding, handleSaveNote, showToast,
    handleSaveCourse, handleDeleteCourse, handleSaveArticle, handleDeleteArticle, handleToggleArticleStatus, handleAddArticleClap,
    handleSaveUser, handleUpdateUserProfile, handleDeleteUser, handleSaveProject, handleApproveProject, handleRejectProject, handleAddClap, handleAddComment,
    handleSaveEvent, handleDeleteEvent, handleSaveTeamOrder, handleSaveCommunityPost, handleDeleteCommunityPost, handleAddCommunityPostClap, handleAddCommunityReply,
    handleAddSessionSlot, handleRemoveSessionSlot, handleBookSession, handleCancelSession, handleCreateTrack, handleUpdateTrack, handleDeleteTrack,
    handleSaveFinancialStatement, handleDeleteFinancialStatement, handleSaveAnnualReport, handleDeleteAnnualReport,
    handleSaveMarketingPost, handleDeleteMarketingPost
  }), [
    user, users, courses, articles, projects, communityPosts, partners, supporters, events, mentorSessions, tracks, financialStatements, annualReports, marketingPosts, toast,
    courseProgress, isProfileModalOpen, selectedProfile, isBottleneckModalOpen, selectedBottleneck, isInscriptionModalOpen, selectedCourseForInscription,
    instructors, mentors, loading
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

    // --- Route Guards ---
    useEffect(() => {
        if (user) {
            // Force password change if flag is set, but only if not already there
            if (user.mustChangePassword && location.pathname !== '/change-password') {
                showToast("⚠️ Você precisa alterar sua senha temporária.");
                navigate('/change-password', { replace: true });
                return;
            }

            // Force profile completion if status is incomplete, but only if not already there or changing password
            if (!user.mustChangePassword && user.profileStatus === 'incomplete' && location.pathname !== '/complete-profile') {
                showToast("📝 Complete seu perfil para continuar.");
                navigate('/complete-profile', { replace: true });
                return;
            }
        }
    }, [user, location.pathname, navigate, showToast]);
    
    // Updated logic: Consider lessons, certificates, dashboard, admin, profile and change password as "Workspace" routes
    // This effectively hides the global Institutional Header/Footer on these pages.
    const isWorkspaceRoute = 
        location.pathname.startsWith('/dashboard') || 
        location.pathname.startsWith('/admin') || 
        location.pathname.includes('/lesson/') || 
        location.pathname.includes('/certificate') ||
        location.pathname.includes('/profile') ||
        location.pathname.includes('/change-password');
    
    return (
        <div className="flex flex-col min-h-screen bg-[#09090B] text-white font-sans selection:bg-[#8a4add] selection:text-white overflow-x-hidden">
            <ScrollToTop />
            {!isWorkspaceRoute && <Header />}
            {/* Componente de Tracking do Google Analytics */}
            <AnalyticsTracker />
            <main className="flex-grow relative">
                {!isWorkspaceRoute && <ScrollSpaceship />}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/courses" element={<Courses />} />
                    {/* Support both ID and Slug in routes */}
                    <Route path="/course/:courseId" element={<CourseDetail />} />
                    <Route path="/course-landing/:courseId" element={<CourseLandingPage />} />
                    <Route path="/course/:courseId/lesson/:lessonId" element={<LessonView />} />
                    <Route path="/course/:courseId/certificate" element={<CertificateView />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/connect" element={<ConnectView />} />
                    <Route path="/blog" element={<Blog />} />
                    {/* Support both ID and Slug in article routes */}
                    <Route path="/article/:articleId" element={<ArticleView />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/complete-profile" element={<CompleteProfile />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/course-editor" element={<CourseEditor />} />
                    <Route path="/admin/course-editor/:courseId" element={<CourseEditor />} />
                    <Route path="/admin/article-editor" element={<ArticleEditor />} />
                    <Route path="/admin/article-editor/:articleId" element={<ArticleEditor />} />
                    <Route path="/admin/user-editor/new" element={<StudentEditor />} />
                    <Route path="/admin/user-editor/:userId" element={<StudentEditor />} />
                    <Route path="/admin/teammember-editor/new" element={<TeamMemberEditor />} />
                    <Route path="/admin/teammember-editor/:userId" element={<TeamMemberEditor />} />
                    <Route path="/admin/instructor-dashboard/:courseId" element={<InstructorCourseDashboard />} />
                    <Route path="/admin/transparency-editor" element={<TransparencyEditor />} />
                    <Route path="/admin/transparency-editor/:type/:id" element={<TransparencyEditor />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/community" element={<CommunityView />} />
                    <Route path="/forum" element={<ForumView />} />
                    <Route path="/project/:projectId" element={<ProjectDetailView />} />
                    <Route path="/project/edit" element={<ProjectEditor />} />
                    <Route path="/project/edit/:projectId" element={<ProjectEditor />} />
                    <Route path="/community/post/new" element={<ForumPostEditor />} />
                    <Route path="/community/post/:postId" element={<ForumPostDetailView />} />
                    <Route path="/partnerships" element={<PartnershipsView />} />
                    <Route path="/supporters" element={<SupportersView />} />
                    <Route path="/supporter/:partnerId" element={<PartnerDetailView />} />
                    <Route path="/event/new" element={<EventEditor />} />
                    <Route path="/event/edit/:eventId" element={<EventEditor />} />
                    <Route path="/event/:eventId" element={<EventDetailView />} />
                    <Route path="/privacy" element={<PrivacyPolicyView />} />
                    <Route path="/terms" element={<TermsOfUseView />} />
                    <Route path="/team" element={<TeamView />} />
                    <Route path="/donate" element={<DonateView />} />
                    <Route path="/about" element={<AboutUsView />} />
                    <Route path="/annual-report" element={<AnnualReportView />} />
                    <Route path="/financial-statement" element={<FinancialStatementView />} />
                    <Route path="/upload-test" element={<StudentUploadTest />} />
                    <Route path="/api-test" element={<ApiTest />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
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
