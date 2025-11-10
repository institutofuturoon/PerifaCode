import React, { useState, useCallback, useEffect, createContext, useContext, useMemo } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, writeBatch, getDoc, addDoc } from 'firebase/firestore';

import { User, View, Course, Lesson, Achievement, Article, Project, ProjectComment, AppContextType, Partner, Event, MentorSession, CourseProgress } from './types';
import { MOCK_ACHIEVEMENTS, ARTICLES, MOCK_PROJECTS, MOCK_PARTNERS, MOCK_EVENTS, MOCK_MENTOR_SESSIONS, MOCK_COURSES, MOCK_USERS } from './constants';
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
import PerifaCodeView from './views/PerifaCodeView';
import DonateView from './views/DonateView';
import AboutUsView from './views/AboutUsView';
import AnnualReportView from './views/AnnualReportView';
import FinancialStatementView from './views/FinancialStatementView';
import EventDetailView from './views/EventDetailView';
import UploadTest from './views/UploadTest';
import ChangePassword from './views/ChangePassword';
import BottleneckAnalysisModal from './components/BottleneckAnalysisModal';
import DigitalLiteracyView from './views/DigitalLiteracyView';
import PythonCourseView from './views/PythonCourseView';
import CSharpCourseView from './views/CSharpCourseView';
import GameDevCourseView from './views/GameDevCourseView';
import EnglishCourseView from './views/EnglishCourseView';
import EntrepreneurshipCourseView from './views/EntrepreneurshipCourseView';


const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<View>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [monitoringCourse, setMonitoringCourse] = useState<Course | null>(null);
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [partners, setPartners] = useState<Partner[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const [mentorSessions, setMentorSessions] = useState<MentorSession[]>([]);
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  
  const [isBottleneckModalOpen, setIsBottleneckModalOpen] = useState(false);
  const [selectedBottleneck, setSelectedBottleneck] = useState<{ lesson: Lesson, students: User[] } | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  
  const [initialEventChecked, setInitialEventChecked] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAndPopulateCollection = async (collectionName: string, mockData: any[], setData: React.Dispatch<React.SetStateAction<any[]>>) => {
      try {
        const collRef = collection(db, collectionName);
        const snapshot = await getDocs(collRef);
        
        if (snapshot.empty) {
          console.log(`Coleção '${collectionName}' vazia. Populando com dados de exemplo...`);
          const batch = writeBatch(db);
          mockData.forEach(item => {
            const docRef = doc(db, collectionName, item.id);
            batch.set(docRef, item);
          });
          await batch.commit();
          setData(mockData);
          console.log(`Coleção '${collectionName}' populada com sucesso.`);
        } else {
          const dataFromDb = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setData(dataFromDb);
        }
      } catch (error) {
        console.error(`Erro ao buscar ou popular a coleção '${collectionName}':`, error);
        showToast(`❌ Erro ao carregar ${collectionName}. Verifique as permissões do Firebase.`);
        // Fallback to mock data on error to keep the app functional
        setData(mockData);
      }
    };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
          fetchAndPopulateCollection('users', MOCK_USERS, setUsers),
          fetchAndPopulateCollection('courses', MOCK_COURSES, setCourses),
          fetchAndPopulateCollection('articles', ARTICLES, setArticles),
          fetchAndPopulateCollection('projects', MOCK_PROJECTS, setProjects),
          fetchAndPopulateCollection('partners', MOCK_PARTNERS, setPartners),
          fetchAndPopulateCollection('events', MOCK_EVENTS, setEvents),
          fetchAndPopulateCollection('mentorSessions', MOCK_MENTOR_SESSIONS, setMentorSessions)
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
            
            // Wait a moment and retry, giving the registration function time to complete.
            await new Promise(resolve => setTimeout(resolve, 1500));
            userDoc = await getDoc(userDocRef);
        }

        if (userDoc.exists()) {
            console.log("Documento do usuário encontrado.");
            setUser(userDoc.data() as User);
        } else {
            // If it's still not there, regardless of whether the user is new or old,
            // create a fallback document to ensure a smooth user experience and self-heal the data.
            console.warn("Documento do usuário não existe no Firestore. Criando perfil de fallback para garantir o fluxo de onboarding e corrigir inconsistência.");
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Novo Aluno',
              email: firebaseUser.email || "",
              avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/200`,
              bio: 'Entusiasta de tecnologia pronto para aprender!',
              role: 'student',
              profileStatus: 'incomplete', // Critical for onboarding flow
              completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '',
              hasCompletedOnboardingTour: false,
            };
            try {
                await setDoc(doc(db, "users", firebaseUser.uid), newUser);
                setUser(newUser);
                console.log("Perfil de fallback criado com sucesso no Firestore.");
            } catch (error) {
                console.error("Falha crítica ao criar documento de fallback no Firestore:", error);
                // If we can't even create the doc, something is seriously wrong with Firestore permissions.
                // In this case, logging out is the only safe option.
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
  
    useEffect(() => {
        if (!initialEventChecked && !loading && events.length > 0) {
            const urlParams = new URLSearchParams(window.location.search);
            const eventId = urlParams.get('event');

            if (eventId) {
                const eventToOpen = events.find(e => e.id === eventId);
                if (eventToOpen) {
                    navigateToEvent(eventToOpen);
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }
            setInitialEventChecked(true);
        }
    }, [events, loading, initialEventChecked]);


  const navigate = useCallback((newView: View) => {
    window.scrollTo(0, 0);
    setView(newView);
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      navigate('home');
    });
  };

  const navigateToCourse = (course: Course) => {
    // FIX: Navigate to specific course landing pages based on ID
    switch (course.id) {
        case 'ld1':
        case 'ld2':
            navigate('digitalLiteracy');
            break;
        case 'py1':
            navigate('pythonCourse');
            break;
        case 'cs1':
            navigate('csharpCourse');
            break;
        case 'gm1':
            navigate('gameDevCourse');
            break;
        case 'en1':
            navigate('englishCourse');
            break;
        case 'ed1':
            navigate('entrepreneurshipCourse');
            break;
        default:
            // Fallback to the generic course detail if no specific page exists
            setCurrentCourse(course);
            navigate('courseDetail');
            break;
    }
};

  const navigateToLesson = (course: Course, lesson: Lesson) => {
    setCurrentCourse(course);
    setCurrentLesson(lesson);
    navigate('lesson');
  };

  const navigateToArticle = (article: Article) => {
    setCurrentArticle(article);
    navigate('articleDetail');
  };
  
  const navigateToEvent = (event: Event) => {
    setCurrentEvent(event);
    navigate('eventDetail');
  };

  const navigateToCertificate = (course: Course) => {
    setCurrentCourse(course);
    navigate('certificate');
  };

  const navigateToInstructorDashboard = (course: Course) => {
    setMonitoringCourse(course);
    navigate('instructorCourseDashboard');
  };

  const navigateToProject = (project: Project) => {
    setCurrentProject(project);
    navigate('projectDetail');
  };
  
    const completeLesson = async (lessonId: string) => {
        if (!user || user.completedLessonIds.includes(lessonId)) return;
        
        const lesson = courses.flatMap(c => c.modules.flatMap(m => m.lessons)).find(l => l.id === lessonId);
        const newXp = (user.xp || 0) + (lesson?.xp || 0);
        const updatedCompletedIds = [...user.completedLessonIds, lessonId];
        
        const updatedUser = { ...user, completedLessonIds: updatedCompletedIds, xp: newXp };
        setUser(updatedUser); // Optimistic update
        showToast(`✨ Aula concluída! +${lesson?.xp || 0} XP`);

        try {
            await updateDoc(doc(db, "users", user.id), {
                completedLessonIds: updatedCompletedIds,
                xp: newXp
            });
        } catch (error) {
            console.error("Erro ao completar aula:", error);
            // Revert state if necessary
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
  
  const handleEditCourse = (course: Course) => { setEditingCourse(course); navigate('courseEditor'); };
  const handleCreateCourse = () => {
    const newCourse: Course = { id: `course_${Date.now()}`, title: '', description: '', longDescription: '', track: 'Frontend', imageUrl: 'https://picsum.photos/seed/newcourse/600/400', duration: '10 horas', skillLevel: 'Iniciante', instructorId: user?.id || '', modules: [] };
    setEditingCourse(newCourse);
    navigate('courseEditor');
  };
    const handleSaveCourse = async (courseToSave: Course) => {
        const isNew = !courses.some(c => c.id === courseToSave.id);
        setCourses(prev => isNew ? [...prev, courseToSave] : prev.map(c => c.id === courseToSave.id ? courseToSave : c));
        navigate('admin');
        showToast("✅ Curso salvo com sucesso!");

        try {
            await setDoc(doc(db, "courses", courseToSave.id), courseToSave);
        } catch (error) {
            console.error("Erro ao salvar curso:", error);
        }
    };

  const handleEditArticle = (article: Article) => { setEditingArticle(article); navigate('articleEditor'); };
  const handleCreateArticle = () => {
    const newArticle: Article = { id: `article_${Date.now()}`, title: '', subtitle: '', author: user?.name || '', date: new Date().toLocaleDateString('pt-BR'), summary: '', imageUrl: 'https://picsum.photos/seed/newarticle/600/400', authorAvatarUrl: user?.avatarUrl || '', category: 'Dicas', content: '' };
    setEditingArticle(newArticle);
    navigate('articleEditor');
  };
    const handleSaveArticle = async (articleToSave: Article) => {
        const isNew = !articles.some(a => a.id === articleToSave.id);
        setArticles(prev => isNew ? [...prev, articleToSave] : prev.map(a => a.id === articleToSave.id ? articleToSave : a));
        navigate('admin');
        showToast("✅ Artigo salvo com sucesso!");

        try {
            await setDoc(doc(db, "articles", articleToSave.id), articleToSave);
        } catch (error) {
            console.error("Erro ao salvar artigo:", error);
        }
    };

    const handleDeleteArticle = async (articleId: string) => {
        if(window.confirm("Tem certeza que deseja excluir este artigo?")) {
            setArticles(prev => prev.filter(a => a.id !== articleId));
            showToast("🗑️ Artigo excluído com sucesso.");
            try {
                await deleteDoc(doc(db, "articles", articleId));
            } catch (error) {
                console.error("Erro ao excluir artigo:", error);
            }
        }
    };

  const handleEditUser = (user: User) => { setEditingUser(user); navigate('studentEditor'); };
  const handleCreateUser = (role: 'student' | 'instructor') => {
    const newUser: User = { id: `user_${Date.now()}`, name: '', email: '', avatarUrl: 'https://picsum.photos/seed/newuser/200', bio: '', role, completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '' };
    setEditingUser(newUser);
    navigate('studentEditor');
  };
    const handleSaveUser = async (userToSave: User) => {
        const isNew = !users.some(u => u.id === userToSave.id);
        setUsers(prev => isNew ? [...prev, userToSave] : prev.map(u => u.id === userToSave.id ? userToSave : u));
        navigate('admin');
        showToast("✅ Usuário salvo com sucesso!");

        try {
            await setDoc(doc(db, "users", userToSave.id), userToSave);
        } catch (error) {
            console.error("Erro ao salvar usuário:", error);
        }
    };
    const handleDeleteUser = async (userId: string) => {
      if(window.confirm("Tem certeza que deseja excluir este usuário?")) {
          setUsers(prev => prev.filter(u => u.id !== userId));
          showToast("🗑️ Usuário excluído com sucesso.");
          try {
            await deleteDoc(doc(db, "users", userId));
        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
        }
      }
  };

    const handleUpdateUserProfile = async (userToUpdate: User) => {
       setUser(userToUpdate);
       setUsers(prev => prev.map(u => u.id === userToUpdate.id ? userToUpdate : u));
       showToast("✅ Perfil atualizado com sucesso!");
       try {
           await updateDoc(doc(db, "users", userToUpdate.id), userToUpdate as { [key: string]: any });
       } catch (error) {
           console.error("Erro ao atualizar perfil:", error);
       }
    };

  const navigateToProjectEditor = (project?: Project) => {
    if (project) {
        setEditingProject(project);
    } else {
        const newProject: Project = { id: `proj_${Date.now()}`, authorId: user!.id, title: '', description: '', imageUrl: 'https://picsum.photos/seed/newproject/600/400', technologies: [], repoUrl: '', liveUrl: '', claps: 0, comments: [], createdAt: 'Agora mesmo' };
        setEditingProject(newProject);
    }
    navigate('projectEditor');
  };
    const handleSaveProject = async (projectToSave: Project) => {
        const isNew = !projects.some(p => p.id === projectToSave.id);
        setProjects(prev => isNew ? [...prev, projectToSave] : prev.map(p => p.id === projectToSave.id ? projectToSave : p));
        navigateToProject(projectToSave);
        showToast("🚀 Projeto salvo com sucesso!");
        try {
            await setDoc(doc(db, "projects", projectToSave.id), projectToSave);
        } catch (error) {
            console.error("Erro ao salvar projeto:", error);
        }
    };
    const handleAddClap = async (projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;
        const newClaps = (project.claps || 0) + 1;
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, claps: newClaps } : p));
        try {
            await updateDoc(doc(db, "projects", projectId), { claps: newClaps });
        } catch (error) {
            console.error("Erro ao adicionar clap:", error);
        }
    };
    const handleAddComment = async (projectId: string, text: string) => {
        if (!user) return;
        const newComment: ProjectComment = { id: `comm_${Date.now()}`, authorId: user.id, text, createdAt: new Date().toISOString() };
        const project = projects.find(p => p.id === projectId);
        if (!project) return;
        const newComments = [...project.comments, newComment];
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, comments: newComments } : p));
        try {
            await updateDoc(doc(db, "projects", projectId), { comments: newComments });
        } catch (error) {
            console.error("Erro ao adicionar comentário:", error);
        }
    };

  const handleEditEvent = (event: Event) => { setEditingEvent(event); navigate('eventEditor'); };
  const handleCreateEvent = () => {
      const newEvent: Event = { id: `event_${Date.now()}`, title: '', date: '', time: '', hostId: user?.id || '', description: '', imageUrl: 'https://picsum.photos/seed/newevent/600/400', eventType: 'Live' };
      setEditingEvent(newEvent);
      navigate('eventEditor');
  };
    const handleSaveEvent = async (eventToSave: Event) => {
        const isNew = !events.some(e => e.id === eventToSave.id);
        setEvents(prev => isNew ? [...prev, eventToSave] : prev.map(e => e.id === eventToSave.id ? eventToSave : e));
        navigate('connect');
        showToast("🗓️ Evento salvo com sucesso!");
        try {
            await setDoc(doc(db, "events", eventToSave.id), eventToSave);
        } catch (error) {
            console.error("Erro ao salvar evento:", error);
        }
    };
    const handleDeleteEvent = async (eventId: string) => {
        if (window.confirm("Tem certeza que deseja excluir este evento?")) {
            setEvents(prev => prev.filter(e => e.id !== eventId));
            showToast("🗑️ Evento excluído com sucesso.");
            try {
                await deleteDoc(doc(db, "events", eventId));
            } catch (error) {
                console.error("Erro ao excluir evento:", error);
            }
        }
    };

    const handleAddSessionSlot = async (mentorId: string, date: string, time: string) => {
      const newSession: MentorSession = { id: `sess_${Date.now()}`, mentorId, date, time, isBooked: false, studentId: null };
      setMentorSessions(prev => [...prev, newSession]);
      try {
          await setDoc(doc(db, "mentorSessions", newSession.id), newSession);
      } catch (error) {
          console.error("Erro ao adicionar horário:", error);
      }
    };
    const handleRemoveSessionSlot = async (mentorId: string, date: string, time: string) => {
      const sessionToRemove = mentorSessions.find(s => s.mentorId === mentorId && s.date === date && s.time === time && !s.isBooked);
      if (!sessionToRemove) return;
      setMentorSessions(prev => prev.filter(s => s.id !== sessionToRemove.id));
      try {
          await deleteDoc(doc(db, "mentorSessions", sessionToRemove.id));
      } catch (error) {
          console.error("Erro ao remover horário:", error);
      }
    };
    const handleBookSession = async (sessionId: string) => {
        if (!user) { navigate('login'); return; }
        setMentorSessions(prev => prev.map(s => s.id === sessionId ? { ...s, isBooked: true, studentId: user.id } : s));
        showToast("✅ Mentoria agendada com sucesso!");
        try {
            await updateDoc(doc(db, "mentorSessions", sessionId), { isBooked: true, studentId: user.id });
        } catch (error) {
            console.error("Erro ao agendar mentoria:", error);
        }
    };
    const handleCancelSession = async (sessionId: string) => {
        if (window.confirm("Tem certeza que deseja cancelar esta mentoria?")) {
            setMentorSessions(prev => prev.map(s => s.id === sessionId ? { ...s, isBooked: false, studentId: null } : s));
            showToast("Mentoria cancelada.");
            try {
                await updateDoc(doc(db, "mentorSessions", sessionId), { isBooked: false, studentId: null });
            } catch (error) {
                console.error("Erro ao cancelar mentoria:", error);
            }
        }
    };

    const handleCompleteOnboarding = async () => {
        if (!user) return;
        const updatedUser = { ...user, hasCompletedOnboardingTour: true };
        await handleUpdateUserProfile(updatedUser);
    };

  const openProfileModal = (member: User) => { setSelectedProfile(member); setIsProfileModalOpen(true); };
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const openBottleneckModal = (lesson: Lesson, students: User[]) => {
    setSelectedBottleneck({ lesson, students });
    setIsBottleneckModalOpen(true);
  };
  const closeBottleneckModal = () => setIsBottleneckModalOpen(false);

  const team = useMemo(() => users.filter(u => u.role === 'instructor' || u.role === 'admin'), [users]);
  const instructors = useMemo(() => users.filter(u => u.role === 'instructor' || u.role === 'admin'), [users]);
  const mentors = useMemo(() => users.filter(u => u.role === 'instructor' || u.role === 'admin'), [users]);
  const courseProgress: CourseProgress = useMemo(() => {
    if (!user || user.role !== 'student') return { inProgressCourses: [], completedCourses: [] };

    const inProgressCourses: { course: Course; progress: number }[] = [];
    const completedCourses: Course[] = [];

    courses.forEach(course => {
      const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
      if (allLessonIds.length === 0) return;
      
      const completedInCourse = allLessonIds.filter(id => user.completedLessonIds.includes(id));
      const progress = Math.round((completedInCourse.length / allLessonIds.length) * 100);

      if (progress > 0 && progress < 100) {
        inProgressCourses.push({ course, progress });
      } else if (progress === 100) {
        completedCourses.push(course);
      }
    });

    return { inProgressCourses, completedCourses };
  }, [user, courses]);

  const value = {
    view, user, users, courses, articles, team, projects, partners, events, mentorSessions, toast,
    currentCourse, currentLesson, currentArticle, currentProject, currentEvent, editingCourse, editingArticle, editingUser,
    editingProject, editingEvent, courseProgress, monitoringCourse, isProfileModalOpen, selectedProfile,
    isBottleneckModalOpen, selectedBottleneck,
    instructors, mentors, loading,
    setUser,
    navigate, handleLogout, navigateToCourse, navigateToLesson, navigateToArticle, navigateToEvent, navigateToCertificate,
    navigateToInstructorDashboard, navigateToProject, navigateToProjectEditor, openProfileModal, closeProfileModal,
    openBottleneckModal, closeBottleneckModal,
    completeLesson, handleSaveNote, handleSaveCourse, handleEditCourse, handleCreateCourse, handleSaveArticle, handleEditArticle,
    handleCreateArticle, handleDeleteArticle, handleSaveUser, handleEditUser, handleCreateUser, handleDeleteUser,
    handleSaveProject, handleAddClap, handleAddComment, handleSaveEvent, handleCreateEvent, handleEditEvent,
    handleDeleteEvent, handleAddSessionSlot, handleRemoveSessionSlot, handleBookSession, handleCancelSession,
    showToast, handleUpdateUserProfile, handleCompleteOnboarding,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const App: React.FC = () => {
    const renderView = () => {
        const InnerComponent = () => {
            const { view, user, loading } = useAppContext();
            
            if (loading) {
                return (
                    <div className="flex items-center justify-center h-screen">
                        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                );
            }

            if (user) {
                if (user.profileStatus === 'incomplete' && view !== 'completeProfile') {
                    return <CompleteProfile />;
                }
                if (user.mustChangePassword === true && view !== 'changePassword') {
                    return <ChangePassword />;
                }
            }


            switch (view) {
                case 'home': return <Home />;
                case 'courses': return <PerifaCodeView />;
                case 'dashboard': return <Dashboard />;
                case 'connect': return <ConnectView />;
                case 'blog': return <Blog />;
                case 'login': return <Login />;
                case 'register': return <Register />;
                case 'completeProfile': return <CompleteProfile />;
                case 'profile': return <Profile />;
                case 'courseDetail': return <CourseDetail />;
                case 'lesson': return <LessonView />;
                case 'admin': return <Admin />;
                case 'courseEditor': return <CourseEditor course={useAppContext().editingCourse!} />;
                case 'certificate': return <CertificateView />;
                case 'analytics': return <Analytics />;
                case 'articleDetail': return <ArticleView />;
                case 'articleEditor': return <ArticleEditor article={useAppContext().editingArticle!} />;
                case 'studentEditor': return <StudentEditor student={useAppContext().editingUser!} />;
                case 'teamMemberEditor': return <TeamMemberEditor member={useAppContext().editingUser!} />;
                case 'instructorCourseDashboard': return <InstructorCourseDashboard />;
                case 'community': return <CommunityView />;
                case 'projectDetail': return <ProjectDetailView />;
                case 'projectEditor': return <ProjectEditor project={useAppContext().editingProject!} />;
                case 'partnerships': return <PartnershipsView />;
                case 'eventEditor': return <EventEditor event={useAppContext().editingEvent!} />;
                case 'eventDetail': return <EventDetailView />;
                case 'privacy': return <PrivacyPolicyView />;
                case 'terms': return <TermsOfUseView />;
                case 'team': return <TeamView />;
                case 'donate': return <DonateView />;
                case 'about': return <AboutUsView />;
                case 'annualReport': return <AnnualReportView />;
                case 'financialStatement': return <FinancialStatementView />;
                case 'uploadTest': return <UploadTest />;
                case 'changePassword': return <ChangePassword />;
                case 'digitalLiteracy': return <DigitalLiteracyView />;
                case 'pythonCourse': return <PythonCourseView />;
                case 'csharpCourse': return <CSharpCourseView />;
                case 'gameDevCourse': return <GameDevCourseView />;
                case 'englishCourse': return <EnglishCourseView />;
                case 'entrepreneurshipCourse': return <EntrepreneurshipCourseView />;
                default: return <Home />;
            }
        };
        return <InnerComponent />;
    };
    
    return (
        <AppProvider>
            <div className="flex flex-col min-h-screen bg-transparent">
                <Header />
                <main className="flex-grow">
                    {renderView()}
                </main>
                <Footer />
                <ToastContainer />
                <ProfileModalContainer />
                <OnboardingTourContainer />
                <BottleneckModalContainer />
            </div>
        </AppProvider>
    );
};

const ToastContainer = () => {
    const { toast } = useAppContext();
    if (!toast) return null;
    return (
        <div className="fixed bottom-5 right-5 bg-[#8a4add]/30 backdrop-blur-sm border border-[#8a4add]/50 text-[#c4b5fd] px-6 py-3 rounded-lg shadow-lg animate-fade-in-out z-50">
            {toast}
        </div>
    );
};

const ProfileModalContainer = () => {
    const { isProfileModalOpen, selectedProfile, closeProfileModal } = useAppContext();
    if (!isProfileModalOpen || !selectedProfile) return null;
    return <ProfileModal member={selectedProfile} onClose={closeProfileModal} />;
};

const BottleneckModalContainer = () => {
    const { isBottleneckModalOpen, selectedBottleneck, closeBottleneckModal } = useAppContext();
    if (!isBottleneckModalOpen || !selectedBottleneck) return null;
    return <BottleneckAnalysisModal 
        isOpen={isBottleneckModalOpen} 
        onClose={closeBottleneckModal} 
        lesson={selectedBottleneck.lesson}
        students={selectedBottleneck.students}
    />;
};

const OnboardingTourContainer = () => {
    const { user, handleCompleteOnboarding } = useAppContext();
    if (user && user.profileStatus === 'complete' && !user.hasCompletedOnboardingTour) {
        return <OnboardingTour onComplete={handleCompleteOnboarding} />;
    }
    return null;
};


export default App;