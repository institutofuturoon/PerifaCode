





import React, { useState, useCallback, useEffect, createContext, useContext, useMemo } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, setDoc, writeBatch, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

import { User, View, Course, Lesson, Achievement, Article, Project, ProjectComment, AppContextType, Partner, Event, MentorSession } from './types';
import { MOCK_USERS, MOCK_ACHIEVEMENTS, ARTICLES, MOCK_PROJECTS, MOCK_PARTNERS, MOCK_EVENTS, MOCK_MENTOR_SESSIONS, MOCK_COURSES } from './constants';
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
// FIX: Changed import to default after modifying LessonView.tsx export.
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

// 1. Create Context
const AppContext = createContext<AppContextType | null>(null);

// 2. Custom Hook for easy context consumption
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// 3. Create Provider Component
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<View>('home');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Loading state for Firebase auth check

  const [users, setUsers] = useState<User[]>([]);
  // Course States
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [monitoringCourse, setMonitoringCourse] = useState<Course | null>(null);
  // Article States
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  // User/Student/Team States
  const [editingUser, setEditingUser] = useState<User | null>(null);
  // Project States
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  // Partner States
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  // Event States
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  // Mentorship States
  const [mentorSessions, setMentorSessions] = useState<MentorSession[]>(MOCK_MENTOR_SESSIONS);
  // Profile Modal States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  
  // Fetch Courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
        try {
            const coursesCollection = collection(db, "courses");
            const coursesSnapshot = await getDocs(coursesCollection);
            const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Course[];
            
            if (coursesList.length > 0) {
                setCourses(coursesList);
            } else {
                console.warn("Firestore 'courses' collection is empty. Loading mock data as a fallback.");
                setCourses(MOCK_COURSES);
            }
        } catch (error) {
            console.error("Error fetching courses from Firestore:", error);
            setToast("❌ Falha ao carregar cursos. Carregando dados de exemplo.");
            setCourses(MOCK_COURSES);
        }
    };
    fetchCourses();
  }, []);
  
  // Fetch All Users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const usersCollection = collection(db, "users");
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
            
            if (usersList.length > 0) {
                setUsers(usersList);
            } else {
                // If the database is empty, we fall back to mock data without trying to write to the DB.
                // The previous logic caused a permissions error for new/anonymous users
                // because they don't have permission to write the initial data.
                console.warn("Firestore 'users' collection is empty. Loading mock data as a fallback.");
                setUsers(MOCK_USERS);
            }
        } catch (error) {
            // This catch block will now correctly handle read errors.
            console.error("Error fetching users from Firestore:", error);
            setToast("❌ Falha ao carregar usuários. Carregando dados de exemplo.");
            setUsers(MOCK_USERS);
        }
    };
    fetchUsers();
  }, []);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        const preMadeUser = MOCK_USERS.find(u => u.email === firebaseUser.email);
        const preDefinedRole = preMadeUser?.role;

        if (userDocSnap.exists()) {
          let appUser = { id: userDocSnap.id, ...userDocSnap.data() } as User;
          
          if (appUser.role === 'student' && (preDefinedRole === 'admin' || preDefinedRole === 'instructor')) {
              console.log(`Promoting user ${appUser.email} to ${preDefinedRole}.`);
              appUser.role = preDefinedRole;
              await setDoc(userDocRef, { role: preDefinedRole }, { merge: true });
          }
          
          setUser(appUser);
        } else {
          console.warn("User not found in Firestore, creating new profile.");
          let newUser: User;
          if (preMadeUser) {
              newUser = { ...preMadeUser, id: firebaseUser.uid, email: firebaseUser.email! };
          } else {
              newUser = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'Novo Aluno',
                email: firebaseUser.email || '',
                avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/200`,
                bio: 'Bem-vindo(a) à PerifaCode!',
                role: 'student',
                completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '', notes: {},
              };
          }
          await setDoc(userDocRef, newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLogout = useCallback(() => {
    signOut(auth).then(() => {
      setView('home');
    }).catch((error) => {
      console.error("Logout Error:", error);
      setToast("Erro ao tentar sair.");
    });
  }, []);

  const navigate = useCallback((newView: View) => {
    window.scrollTo(0, 0);
    if (newView !== 'lesson') setCurrentLesson(null);
    if (newView !== 'lesson' && newView !== 'courseDetail' && newView !== 'courseEditor' && newView !== 'certificate') setCurrentCourse(null);
    if (newView !== 'courseEditor') setEditingCourse(null);
    if (newView !== 'articleDetail') setCurrentArticle(null);
    if (newView !== 'articleEditor') setEditingArticle(null);
    if (newView !== 'studentEditor') setEditingUser(null);
    if (newView !== 'instructorCourseDashboard') setMonitoringCourse(null);
    if (newView !== 'projectDetail') setCurrentProject(null);
    if (newView !== 'projectEditor') setEditingProject(null);
    if (newView !== 'eventEditor') setEditingEvent(null);
    setView(newView);
  }, []);
  
  // Navigation
  const navigateToCourse = useCallback((course: Course) => {
    window.scrollTo(0, 0);
    setCurrentCourse(course);
    setView('courseDetail');
  }, []);
  
  const navigateToCertificate = useCallback((course: Course) => {
    window.scrollTo(0, 0);
    setCurrentCourse(course);
    setView('certificate');
  }, []);

  const navigateToLesson = useCallback((course: Course, lesson: Lesson) => {
    window.scrollTo(0, 0);
    setCurrentCourse(course);
    setCurrentLesson(lesson);
    setView('lesson');
  }, []);

  const navigateToArticle = useCallback((article: Article) => {
    window.scrollTo(0, 0);
    setCurrentArticle(article);
    setView('articleDetail');
  }, []);

  const navigateToInstructorDashboard = useCallback((course: Course) => {
    window.scrollTo(0, 0);
    setMonitoringCourse(course);
    setView('instructorCourseDashboard');
  }, []);

  const navigateToProject = useCallback((project: Project) => {
    window.scrollTo(0, 0);
    setCurrentProject(project);
    setView('projectDetail');
  }, []);
  
  const navigateToProjectEditor = useCallback((project?: Project) => {
    if (!user) {
      navigate('login');
      return;
    }
    if (project) {
        setEditingProject(project);
    } else {
        const newProjectTemplate: Project = {
            id: `proj-new-${Date.now()}`,
            authorId: user.id,
            title: '',
            description: '',
            imageUrl: 'https://picsum.photos/seed/newproject/600/400',
            technologies: [],
            repoUrl: '',
            liveUrl: '',
            claps: 0,
            comments: [],
            createdAt: new Date().toISOString(),
        };
        setEditingProject(newProjectTemplate);
    }
    setView('projectEditor');
  }, [user, navigate]);

  // Course Management
  const handleEditCourse = useCallback((course: Course) => {
    setEditingCourse(course);
    setView('courseEditor');
  }, []);

  const handleCreateCourse = useCallback(() => {
    if (!user) return;
    const newCourseTemplate: Course = {
      id: `new-${Date.now()}`,
      title: '', description: '', longDescription: '', track: 'Frontend',
      imageUrl: 'https://picsum.photos/seed/newcourse/600/400',
      duration: '', skillLevel: 'Iniciante', instructorId: user.id, modules: []
    };
    setEditingCourse(newCourseTemplate);
    setView('courseEditor');
  }, [user]);

  const handleSaveCourse = useCallback((courseToSave: Course) => {
    setCourses(prev => {
      const exists = prev.some(c => c.id === courseToSave.id);
      return exists ? prev.map(c => c.id === courseToSave.id ? courseToSave : c) : [...prev, courseToSave];
    });
    setToast("✅ Curso salvo com sucesso!");
    navigate('admin');
  }, [navigate]);

  // Article Management
  const handleCreateArticle = useCallback(() => {
    if (!user) return;
    const newArticleTemplate: Article = {
      id: `article-new-${Date.now()}`, title: '', subtitle: '', author: user.name, authorAvatarUrl: user.avatarUrl,
      date: new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }),
      summary: '', imageUrl: 'https://picsum.photos/seed/newarticle/600/400', category: 'Dicas',
      content: 'Comece a escrever seu artigo incrível aqui...',
    };
    setEditingArticle(newArticleTemplate);
    setView('articleEditor');
  }, [user]);

  const handleEditArticle = useCallback((article: Article) => {
    setEditingArticle(article);
    setView('articleEditor');
  }, []);
  
  const handleDeleteArticle = useCallback((articleId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este artigo? Esta ação é irreversível.")) {
        setArticles(prev => prev.filter(a => a.id !== articleId));
        setToast("🗑️ Artigo excluído com sucesso.");
    }
  }, []);

  const handleSaveArticle = useCallback((articleToSave: Article) => {
    setArticles(prev => {
        const exists = prev.some(a => a.id === articleToSave.id);
        return exists ? prev.map(a => a.id === articleToSave.id ? articleToSave : a) : [articleToSave, ...prev];
    });
    setToast("✅ Artigo salvo com sucesso!");
    navigate('admin');
  }, [navigate]);
  
  // User Management (Unified)
  const handleCreateUser = useCallback((role: User['role']) => {
    const newUserTemplate: User = {
      id: `user-new-${Date.now()}`, name: '',
      email: '', avatarUrl: 'https://picsum.photos/seed/newuser/200',
      bio: '', role: role,
      title: role === 'instructor' ? 'Instrutor' : '',
      isMentor: role === 'instructor',
      showOnTeamPage: role === 'instructor',
      completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '', notes: {},
    };
    setEditingUser(newUserTemplate);
    setView('studentEditor'); // Reusing student editor as user editor
  }, []);

  const handleEditUser = useCallback((userToEdit: User) => {
    setEditingUser(userToEdit);
    setView('studentEditor'); // Reusing student editor as user editor
  }, []);

  const handleSaveUser = useCallback(async (userToSave: User) => {
    try {
        setToast("Salvando usuário...");
        const cleanUserData = {
            ...userToSave,
            githubUrl: userToSave.githubUrl || '',
            linkedinUrl: userToSave.linkedinUrl || '',
            googleMeetUrl: userToSave.googleMeetUrl || ''
        };

        const userDocRef = doc(db, 'users', userToSave.id);
        await setDoc(userDocRef, cleanUserData, { merge: true });

        setUsers(prev => {
            const exists = prev.some(u => u.id === userToSave.id);
            return exists ? prev.map(u => u.id === userToSave.id ? userToSave : u) : [...prev, userToSave];
        });
        
        setToast("✅ Usuário salvo com sucesso!");
        navigate('admin');
    } catch (error) {
        console.error("Error saving user:", error);
        setToast("❌ Erro ao salvar usuário.");
    }
  }, [navigate]);

  const handleDeleteUser = useCallback(async (userId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário? Esta ação é irreversível e removerá o usuário do Firestore.")) {
        try {
            await deleteDoc(doc(db, "users", userId));
            setUsers(prev => prev.filter(u => u.id !== userId));
            setToast("🗑️ Usuário excluído com sucesso.");
        } catch(error) {
            console.error("Error deleting user:", error);
            setToast("❌ Erro ao excluir usuário.");
        }
    }
  }, []);

  // Project Management
  const handleSaveProject = useCallback((projectToSave: Project) => {
    setProjects(prev => {
        const exists = prev.some(p => p.id === projectToSave.id);
        const newProjects = exists 
            ? prev.map(p => p.id === projectToSave.id ? projectToSave : p) 
            : [projectToSave, ...prev];
        return newProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
    setToast("🚀 Projeto salvo com sucesso!");
    navigate('community');
  }, [navigate]);

  const handleAddClap = useCallback((projectId: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, claps: p.claps + 1 } : p));
  }, []);

  const handleAddComment = useCallback((projectId: string, commentText: string) => {
    if (!user) return;
    const newComment: ProjectComment = {
        id: `c-new-${Date.now()}`,
        authorId: user.id,
        text: commentText,
        createdAt: new Date().toISOString(),
    };
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, comments: [...p.comments, newComment] } : p));
  }, [user]);

  // Event Management
  const handleCreateEvent = useCallback(() => {
    if (!user) return;
    const newEventTemplate: Event = {
      id: `event-new-${Date.now()}`,
      title: '',
      description: '',
      hostId: user.id,
      date: 'SET 01',
      time: '19:00',
      eventType: 'Live',
      imageUrl: 'https://picsum.photos/seed/newevent/600/400',
    };
    setEditingEvent(newEventTemplate);
    setView('eventEditor');
  }, [user]);

  const handleEditEvent = useCallback((event: Event) => {
    setEditingEvent(event);
    setView('eventEditor');
  }, []);
  
  const handleDeleteEvent = useCallback((eventId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este evento?")) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        setToast("🗑️ Evento excluído com sucesso.");
    }
  }, []);

  const handleSaveEvent = useCallback((eventToSave: Event) => {
    setEvents(prev => {
        const exists = prev.some(e => e.id === eventToSave.id);
        return exists ? prev.map(e => e.id === eventToSave.id ? eventToSave : e) : [eventToSave, ...prev];
    });
    setToast("✅ Evento salvo com sucesso!");
    navigate('connect');
  }, [navigate]);
  
  const team = useMemo(() => users.filter(u => u.showOnTeamPage).sort((a, b) => {
    if ((a.role === 'instructor' || a.role === 'admin') && b.role === 'student') return -1;
    if (a.role === 'student' && (b.role === 'instructor' || b.role === 'admin')) return 1;
    return a.name.localeCompare(b.name);
  }), [users]);
  const instructors = useMemo(() => users.filter(u => u.role === 'instructor'), [users]);
  const mentors = useMemo(() => users.filter(u => u.isMentor), [users]);

  // Mentorship Management
const handleBookSession = useCallback(async (sessionId: string) => {
    if (!user) {
        setToast("Você precisa estar logado para agendar uma mentoria.");
        navigate('login');
        return;
    }
    
    setMentorSessions(prev => 
        prev.map(s => 
            s.id === sessionId 
                ? { ...s, isBooked: true, studentId: user.id } 
                : s
        )
    );
    setToast("✅ Mentoria agendada! Em breve você receberá o link.");

}, [user, navigate]);


const handleCancelSession = useCallback(async (sessionId: string) => {
    if (!user) return;
    
    setMentorSessions(prev => 
        prev.map(s => 
            s.id === sessionId && s.studentId === user.id
                ? { ...s, isBooked: false, studentId: null, googleMeetUrl: undefined } 
                : s
        )
    );
    setToast("Mentoria cancelada.");
}, [user]);

  const handleAddSessionSlot = useCallback((mentorId: string, date: string, time: string) => {
    const sessionExists = mentorSessions.some(s => s.mentorId === mentorId && s.date === date && s.time === time);
    if (sessionExists) return;

    const newSession: MentorSession = {
        id: `sess-${mentorId}-${date}-${time}`,
        mentorId,
        date,
        time,
        isBooked: false,
        studentId: null,
    };
    setMentorSessions(prev => [...prev, newSession].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time)));
    setToast("✅ Horário disponibilizado!");
  }, [mentorSessions]);

  const handleRemoveSessionSlot = useCallback((mentorId: string, date: string, time: string) => {
      setMentorSessions(prev =>
          prev.filter(s => {
              const isMatch = s.mentorId === mentorId && s.date === date && s.time === time;
              if (isMatch && s.isBooked) {
                  setToast("❌ Não é possível bloquear um horário já agendado.");
                  return true; // keep it
              }
              return !isMatch; // remove it
          })
      );
      setToast("Horário bloqueado.");
  }, []);

  // User Progress
  const completeLesson = useCallback((lessonId: string) => {
    setUser(prevUser => {
      if (!prevUser || prevUser.completedLessonIds.includes(lessonId)) return prevUser;
      
      const lesson = courses.flatMap(c => c.modules).flatMap(m => m.lessons).find(l => l.id === lessonId);
      const xpGained = lesson?.xp || 0;
      const newXp = (prevUser.xp || 0) + xpGained;

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      let newStreak = prevUser.streak;

      if (prevUser.lastCompletionDate !== today) {
        newStreak = (prevUser.lastCompletionDate === yesterday) ? newStreak + 1 : 1;
      }

      const updatedUser = {
        ...prevUser, completedLessonIds: [...prevUser.completedLessonIds, lessonId],
        xp: newXp, streak: newStreak, lastCompletionDate: today,
      };

      const newAchievements: string[] = MOCK_ACHIEVEMENTS
        .filter(ach => !updatedUser.achievements.includes(ach.id) && ach.condition(updatedUser, courses))
        .map(ach => ach.id);

      if (newAchievements.length > 0) {
        setToast(`✨ Conquista: ${MOCK_ACHIEVEMENTS.find(a => a.id === newAchievements[0])?.title}`);
        return { ...updatedUser, achievements: [...updatedUser.achievements, ...newAchievements] };
      }
      return updatedUser;
    });
  }, [courses]);
  
  const handleSaveNote = useCallback((lessonId: string, note: string) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const newNotes = { ...(prevUser.notes || {}), [lessonId]: note };
        return { ...prevUser, notes: newNotes };
    });
  }, []);

  const courseProgress = useMemo(() => {
    if (!user) return { inProgressCourses: [], completedCourses: [] };
    
    const inProgress: { course: Course; progress: number }[] = [];
    const completed: Course[] = [];

    courses.forEach(course => {
      const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
      if (allLessonIds.length === 0) return;

      const completedLessonsInCourse = user.completedLessonIds.filter(id => allLessonIds.includes(id));
      const progress = Math.round((completedLessonsInCourse.length / allLessonIds.length) * 100);

      if (progress === 100) {
        completed.push(course);
      } else if (completedLessonsInCourse.length > 0) {
        inProgress.push({ course, progress });
      }
    });
    return { inProgressCourses: inProgress, completedCourses: completed };
  }, [user, courses]);

  const openProfileModal = useCallback((member: User) => {
    setSelectedProfile(member);
    setIsProfileModalOpen(true);
  }, []);

  const closeProfileModal = useCallback(() => {
    setIsProfileModalOpen(false);
    setSelectedProfile(null);
  }, []);


  const value: AppContextType = {
    view, user, users, courses, articles, projects, partners, events, toast, mentorSessions, team,
    instructors, mentors,
    currentCourse, currentLesson, currentArticle, currentProject,
    editingCourse, editingArticle, editingUser, editingProject, editingEvent,
    monitoringCourse,
    isProfileModalOpen, selectedProfile, openProfileModal, closeProfileModal,
    navigate, handleLogout,
    navigateToCourse, navigateToLesson, navigateToArticle, navigateToCertificate, navigateToInstructorDashboard, navigateToProject, navigateToProjectEditor,
    handleSaveCourse, handleEditCourse, handleCreateCourse,
    handleSaveArticle, handleEditArticle, handleCreateArticle, handleDeleteArticle,
    handleSaveUser, handleEditUser, handleCreateUser, handleDeleteUser,
    handleSaveProject, handleAddClap, handleAddComment,
    handleSaveEvent, handleEditEvent, handleCreateEvent, handleDeleteEvent,
    handleBookSession, handleCancelSession, handleAddSessionSlot, handleRemoveSessionSlot,
    completeLesson, setToast,
    courseProgress,
    handleSaveNote,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const AppContent: React.FC = () => {
    const { 
        view, user, currentCourse, currentLesson, currentArticle, currentProject,
        editingCourse, editingArticle, editingUser, editingProject, editingEvent,
        monitoringCourse,
        isProfileModalOpen, selectedProfile, closeProfileModal,
        navigate, setToast, toast, loading
     } = useAppContext();

  useEffect(() => {
    if (user && view === 'login') {
      navigate('dashboard');
    }
  }, [user, view, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-400">Verificando sua sessão...</p>
        </div>
      </div>
    )
  }

  const renderView = () => {
    switch (view) {
      case 'home': return <Home />;
      case 'courses': return <Courses />;
      case 'courseDetail': return currentCourse ? <CourseDetail /> : <Courses />;
      case 'lesson': return currentCourse && currentLesson ? <LessonView /> : <Courses />;
      case 'dashboard': return user ? <Dashboard /> : <Login />;
      case 'connect': return <ConnectView />;
      case 'blog': return <Blog />;
      case 'articleDetail': return currentArticle ? <ArticleView /> : <Blog />;
      case 'login': return <Login />;
      case 'profile': return user ? <Profile /> : <Login />;
      case 'admin': return user?.role === 'admin' || user?.role === 'instructor' ? <Admin /> : <Home />;
      case 'analytics': return user?.role === 'admin' ? <Analytics /> : <Home />;
      case 'courseEditor': return editingCourse && (user?.role === 'admin' || user?.role === 'instructor') ? <CourseEditor course={editingCourse} /> : <Admin />;
      case 'articleEditor': return editingArticle && (user?.role === 'admin' || user?.role === 'instructor') ? <ArticleEditor article={editingArticle} /> : <Admin />;
      case 'studentEditor': return editingUser && user?.role === 'admin' ? <StudentEditor student={editingUser} /> : <Admin />;
      case 'instructorCourseDashboard': return monitoringCourse && (user?.role === 'admin' || user?.role === 'instructor') ? <InstructorCourseDashboard /> : <Admin />;
      case 'certificate': return currentCourse && user ? <CertificateView /> : <Dashboard />;
      case 'community': return <CommunityView />;
      case 'projectDetail': return currentProject ? <ProjectDetailView /> : <CommunityView />;
      case 'projectEditor': return editingProject && user ? <ProjectEditor project={editingProject} /> : <CommunityView />;
      case 'partnerships': return <PartnershipsView />;
      case 'eventEditor': return editingEvent && (user?.role === 'admin' || user?.role === 'instructor') ? <EventEditor event={editingEvent} /> : <Admin />;
      case 'privacy': return <PrivacyPolicyView />;
      case 'terms': return <TermsOfUseView />;
      case 'team': return <TeamView />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col bg-grid-pattern">
      <Header />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer navigate={navigate} />
      {toast && (
        <div className="fixed bottom-5 right-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-2xl shadow-purple-500/30 animate-bounce">
          {toast}
        </div>
      )}
      {isProfileModalOpen && selectedProfile && (
        <ProfileModal member={selectedProfile} onClose={closeProfileModal} />
      )}
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;