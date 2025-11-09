import React, { useState, useCallback, useEffect, createContext, useContext, useMemo } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, setDoc, writeBatch, deleteDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

import { User, View, Course, Lesson, Achievement, Article, Project, ProjectComment, AppContextType, Partner, Event, MentorSession, CourseProgress } from './types';
import { MOCK_ACHIEVEMENTS, ARTICLES, MOCK_PROJECTS, MOCK_PARTNERS, MOCK_EVENTS, MOCK_MENTOR_SESSIONS, MOCK_COURSES, MOCK_USERS } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './views/Home';
import Courses from './views/Courses';
import Dashboard from './views/Dashboard';
import ConnectView from './views/ConnectView';
import Blog from './views/Blog';
import Login from './views/Login';
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
import PerifaCodeView from './views/PerifaCodeView';
import DonateView from './views/DonateView';

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<View>('home');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [monitoringCourse, setMonitoringCourse] = useState<Course | null>(null);
  
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const [mentorSessions, setMentorSessions] = useState<MentorSession[]>(MOCK_MENTOR_SESSIONS);
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map(doc => doc.data() as User);
            setUsers(usersList);

            const coursesCollection = collection(db, 'courses');
            const coursesSnapshot = await getDocs(coursesCollection);
            const coursesList = coursesSnapshot.docs.map(doc => doc.data() as Course);
            setCourses(coursesList);
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
            showToast("Erro ao carregar dados. Usando dados de exemplo.");
            setUsers(MOCK_USERS);
            setCourses(MOCK_COURSES);
        }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let appUser: User;
        if (userSnap.exists()) {
          appUser = userSnap.data() as User;
        } else {
          appUser = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "Novo Aluno",
            email: firebaseUser.email || "",
            avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/200`,
            bio: 'Entusiasta de tecnologia pronto para aprender!',
            role: 'student',
            completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '',
          };
          await setDoc(userRef, appUser);
          setUsers(prev => [...prev, appUser]);
        }
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
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
    setCurrentCourse(course);
    navigate('courseDetail');
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
    if (user && !user.completedLessonIds.includes(lessonId)) {
      const lesson = courses.flatMap(c => c.modules.flatMap(m => m.lessons)).find(l => l.id === lessonId);
      const newXp = (user.xp || 0) + (lesson?.xp || 0);
      const updatedUser = { ...user, completedLessonIds: [...user.completedLessonIds, lessonId], xp: newXp };
      setUser(updatedUser);
      try {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, {
            completedLessonIds: arrayUnion(lessonId),
            xp: newXp
        });
        showToast(`✨ Aula concluída! +${lesson?.xp || 0} XP`);
      } catch (error) {
          console.error("Error updating user progress:", error);
          showToast("Erro ao salvar progresso.");
          setUser(user); // Revert state on error
      }
    }
  };

  const handleSaveNote = async (lessonId: string, note: string) => {
    if (user) {
        const updatedUser = { ...user, notes: { ...(user.notes || {}), [lessonId]: note } };
        setUser(updatedUser);
        try {
            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, {
                notes: updatedUser.notes
            });
            showToast("📝 Anotação salva!");
        } catch (error) {
            console.error("Error saving note:", error);
            showToast("Erro ao salvar anotação.");
            setUser(user); // Revert state on error
        }
    }
  };
  
  // Admin & Data Management Functions
  const handleEditCourse = (course: Course) => { setEditingCourse(course); navigate('courseEditor'); };
  const handleCreateCourse = () => {
    const newCourse: Course = { id: `course_${Date.now()}`, title: '', description: '', longDescription: '', track: 'Frontend', imageUrl: 'https://picsum.photos/seed/newcourse/600/400', duration: '10 horas', skillLevel: 'Iniciante', instructorId: user?.id || '', modules: [] };
    setEditingCourse(newCourse);
    navigate('courseEditor');
  };
  const handleSaveCourse = async (courseToSave: Course) => {
    const isNew = !courses.some(c => c.id === courseToSave.id);
    const originalCourses = courses;
    setCourses(prev => isNew ? [...prev, courseToSave] : prev.map(c => c.id === courseToSave.id ? courseToSave : c));
    try {
        const courseRef = doc(db, "courses", courseToSave.id);
        await setDoc(courseRef, courseToSave, { merge: true });
        navigate('admin');
        showToast("✅ Curso salvo com sucesso!");
    } catch(error) {
        console.error("Error saving course:", error);
        showToast("Erro ao salvar curso.");
        setCourses(originalCourses);
    }
  };

  const handleEditArticle = (article: Article) => { setEditingArticle(article); navigate('articleEditor'); };
  const handleCreateArticle = () => {
    const newArticle: Article = { id: `article_${Date.now()}`, title: '', subtitle: '', author: user?.name || '', date: new Date().toLocaleDateString('pt-BR'), summary: '', imageUrl: 'https://picsum.photos/seed/newarticle/600/400', authorAvatarUrl: user?.avatarUrl || '', category: 'Dicas', content: '' };
    setEditingArticle(newArticle);
    navigate('articleEditor');
  };
  const handleSaveArticle = (articleToSave: Article) => {
    setArticles(prev => prev.map(a => a.id === articleToSave.id ? articleToSave : a).find(a => a.id === articleToSave.id) ? prev.map(a => a.id === articleToSave.id ? articleToSave : a) : [...prev, articleToSave]);
    navigate('admin');
    showToast("✅ Artigo salvo com sucesso!");
  };
  const handleDeleteArticle = (articleId: string) => {
    if(window.confirm("Tem certeza que deseja excluir este artigo?")) {
        setArticles(prev => prev.filter(a => a.id !== articleId));
        showToast("🗑️ Artigo excluído.");
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
    const originalUsers = users;
    setUsers(prev => isNew ? [...prev, userToSave] : prev.map(u => u.id === userToSave.id ? userToSave : u));
    try {
        const userRef = doc(db, "users", userToSave.id);
        await setDoc(userRef, userToSave, { merge: true });
        navigate('admin');
        showToast("✅ Usuário salvo com sucesso!");
    } catch(error) {
        console.error("Error saving user:", error);
        showToast("Erro ao salvar usuário.");
        setUsers(originalUsers);
    }
  };
  const handleDeleteUser = async (userId: string) => {
      if(window.confirm("Tem certeza que deseja excluir este usuário?")) {
          const originalUsers = users;
          setUsers(prev => prev.filter(u => u.id !== userId));
          try {
              const userRef = doc(db, "users", userId);
              await deleteDoc(userRef);
              showToast("🗑️ Usuário excluído.");
          } catch(error) {
              console.error("Error deleting user:", error);
              showToast("Erro ao excluir usuário.");
              setUsers(originalUsers);
          }
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
  const handleSaveProject = (projectToSave: Project) => {
    setProjects(prev => prev.map(p => p.id === projectToSave.id ? projectToSave : p).find(p => p.id === projectToSave.id) ? prev.map(p => p.id === projectToSave.id ? projectToSave : p) : [...prev, projectToSave]);
    navigateToProject(projectToSave);
    showToast("🚀 Projeto salvo com sucesso!");
  };
  const handleAddClap = (projectId: string) => {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, claps: p.claps + 1 } : p));
  };
  const handleAddComment = (projectId: string, text: string) => {
      if (!user) return;
      const newComment: ProjectComment = { id: `comm_${Date.now()}`, authorId: user.id, text, createdAt: 'Agora mesmo' };
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, comments: [...p.comments, newComment] } : p));
  };

  const handleEditEvent = (event: Event) => { setEditingEvent(event); navigate('eventEditor'); };
  const handleCreateEvent = () => {
      const newEvent: Event = { id: `event_${Date.now()}`, title: '', date: '', time: '', hostId: user?.id || '', description: '', imageUrl: 'https://picsum.photos/seed/newevent/600/400', eventType: 'Live' };
      setEditingEvent(newEvent);
      navigate('eventEditor');
  };
  const handleSaveEvent = (eventToSave: Event) => {
      setEvents(prev => prev.map(e => e.id === eventToSave.id ? eventToSave : e).find(e => e.id === eventToSave.id) ? prev.map(e => e.id === eventToSave.id ? eventToSave : e) : [...prev, eventToSave]);
      navigate('connect');
      showToast("🗓️ Evento salvo com sucesso!");
  };
  const handleDeleteEvent = (eventId: string) => {
      if (window.confirm("Tem certeza que deseja excluir este evento?")) {
          setEvents(prev => prev.filter(e => e.id !== eventId));
          showToast("🗑️ Evento excluído.");
      }
  };

  const handleAddSessionSlot = (mentorId: string, date: string, time: string) => {
      const newSession: MentorSession = { id: `sess_${Date.now()}`, mentorId, date, time, isBooked: false, studentId: null };
      setMentorSessions(prev => [...prev, newSession]);
  };
  const handleRemoveSessionSlot = (mentorId: string, date: string, time: string) => {
      setMentorSessions(prev => prev.filter(s => !(s.mentorId === mentorId && s.date === date && s.time === time && !s.isBooked)));
  };
  const handleBookSession = (sessionId: string) => {
      if (!user) { navigate('login'); return; }
      setMentorSessions(prev => prev.map(s => s.id === sessionId ? { ...s, isBooked: true, studentId: user.id } : s));
      showToast("✅ Mentoria agendada!");
  };
  const handleCancelSession = (sessionId: string) => {
      if (window.confirm("Tem certeza que deseja cancelar esta mentoria?")) {
        setMentorSessions(prev => prev.map(s => s.id === sessionId ? { ...s, isBooked: false, studentId: null } : s));
        showToast(" Mentoria cancelada.");
      }
  };

  const openProfileModal = (member: User) => { setSelectedProfile(member); setIsProfileModalOpen(true); };
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const team = useMemo(() => users.filter(u => u.role === 'instructor' || u.role === 'admin' || u.showOnTeamPage), [users]);
  const instructors = useMemo(() => users.filter(u => u.role === 'instructor' || u.role === 'admin'), [users]);
  const mentors = useMemo(() => users.filter(u => u.isMentor), [users]);
  const courseProgress: CourseProgress = useMemo(() => {
    if (!user) return { inProgressCourses: [], completedCourses: [] };

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
    currentCourse, currentLesson, currentArticle, currentProject, editingCourse, editingArticle, editingUser,
    editingProject, editingEvent, courseProgress, monitoringCourse, isProfileModalOpen, selectedProfile,
    instructors, mentors, loading,
    navigate, handleLogout, navigateToCourse, navigateToLesson, navigateToArticle, navigateToCertificate,
    navigateToInstructorDashboard, navigateToProject, navigateToProjectEditor, openProfileModal, closeProfileModal,
    completeLesson, handleSaveNote, handleSaveCourse, handleEditCourse, handleCreateCourse, handleSaveArticle, handleEditArticle,
    handleCreateArticle, handleDeleteArticle, handleSaveUser, handleEditUser, handleCreateUser, handleDeleteUser,
    handleSaveProject, handleAddClap, handleAddComment, handleSaveEvent, handleCreateEvent, handleEditEvent,
    handleDeleteEvent, handleAddSessionSlot, handleRemoveSessionSlot, handleBookSession, handleCancelSession
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const App: React.FC = () => {
    const renderView = () => {
        // This function is defined inside the component to have access to the context values
        // In a real app with a router, this logic would be handled by the router library
        const InnerComponent = () => {
            const { view, currentCourse, currentLesson, currentArticle, currentProject, editingCourse, editingArticle, editingUser, editingProject, editingEvent } = useAppContext();
            
            switch (view) {
                case 'home': return <Home />;
                case 'perifacode': return <PerifaCodeView />;
                case 'courses': return <Courses />;
                case 'dashboard': return <Dashboard />;
                case 'connect': return <ConnectView />;
                case 'blog': return <Blog />;
                case 'login': return <Login />;
                case 'profile': return <Profile />;
                case 'courseDetail': return <CourseDetail />;
                case 'lesson': return <LessonView />;
                case 'admin': return <Admin />;
                case 'courseEditor': return editingCourse ? <CourseEditor course={editingCourse} /> : <Admin />;
                case 'certificate': return <CertificateView />;
                case 'analytics': return <Analytics />;
                case 'articleDetail': return <ArticleView />;
                case 'articleEditor': return editingArticle ? <ArticleEditor article={editingArticle} /> : <Admin />;
                case 'studentEditor': return editingUser ? <StudentEditor student={editingUser} /> : <Admin />;
                case 'teamMemberEditor': return editingUser ? <TeamMemberEditor member={editingUser} /> : <Admin />;
                case 'instructorCourseDashboard': return <InstructorCourseDashboard />;
                case 'community': return <CommunityView />;
                case 'projectDetail': return <ProjectDetailView />;
                case 'projectEditor': return editingProject ? <ProjectEditor project={editingProject} /> : <CommunityView />;
                case 'partnerships': return <PartnershipsView />;
                case 'eventEditor': return editingEvent ? <EventEditor event={editingEvent} /> : <ConnectView />;
                case 'privacy': return <PrivacyPolicyView />;
                case 'terms': return <TermsOfUseView />;
                case 'team': return <TeamView />;
                case 'donate': return <DonateView />;
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

export default App;