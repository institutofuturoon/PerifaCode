import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, writeBatch, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import emailjs from '@emailjs/browser';
import { User, Course, Article, Project, ProjectComment, Partner, Event, MentorSession, CourseProgress, CommunityPost, CommunityReply, Track, FinancialStatement, AnnualReport, Supporter, MarketingPost } from '../types';
import { MOCK_COURSES, MOCK_PROJECTS, ARTICLES, MOCK_COMMUNITY_POSTS, MOCK_EVENTS, MOCK_SUPPORTERS } from '../constants';
import { initializeFAQsIfNeeded } from '../utils/initializeFAQs';

const calculateReadingTime = (content: string): number => {
  if (!content) return 0;
  return Math.ceil(content.trim().split(/\s+/).length / 200);
};

const initializeEmailJS = () => {
  const emailjsPublicKey = (import.meta.env as any).VITE_EMAILJS_PUBLIC_KEY;
  if (emailjsPublicKey) {
    emailjs.init(emailjsPublicKey);
  }
};

interface DataContextType {
  users: User[];
  courses: Course[];
  articles: Article[];
  projects: Project[];
  communityPosts: CommunityPost[];
  partners: Partner[];
  supporters: Supporter[];
  events: Event[];
  mentorSessions: MentorSession[];
  tracks: Track[];
  financialStatements: FinancialStatement[];
  annualReports: AnnualReport[];
  marketingPosts: MarketingPost[];
  courseProgress: CourseProgress;
  instructors: User[];
  mentors: User[];
  loading: boolean;
  handleEnrollUser: (courseId: string, user: User) => Promise<void>;
  completeLesson: (lessonId: string, user: User) => Promise<void>;
  handleSaveNote: (lessonId: string, note: string, user: User) => Promise<void>;
  handleSaveCourse: (courseToSave: Course, showToast: (msg: string) => void) => Promise<void>;
  handleDeleteCourse: (courseId: string, showToast: (msg: string) => void) => Promise<boolean>;
  handleSaveArticle: (articleToSave: Article, showToast: (msg: string) => void) => Promise<void>;
  handleDeleteArticle: (articleId: string, showToast: (msg: string) => void) => Promise<boolean>;
  handleToggleArticleStatus: (articleId: string, showToast: (msg: string) => void) => Promise<void>;
  handleAddArticleClap: (articleId: string) => Promise<void>;
  handleSaveUser: (userToSave: User, user: User | null, showToast: (msg: string) => void, setUser: (u: User | null) => void) => Promise<void>;
  handleUpdateUserProfile: (userToUpdate: User, user: User | null, showToast: (msg: string) => void, setUser: (u: User | null) => void) => Promise<void>;
  handleDeleteUser: (userId: string, showToast: (msg: string) => void) => Promise<void>;
  handleSaveProject: (projectToSave: Project, showToast: (msg: string) => void) => Promise<void>;
  handleApproveProject: (projectId: string, showToast: (msg: string) => void) => Promise<void>;
  handleRejectProject: (projectId: string, showToast: (msg: string) => void) => Promise<void>;
  handleAddClap: (projectId: string) => Promise<void>;
  handleAddComment: (projectId: string, text: string, user: User) => Promise<void>;
  handleSaveEvent: (eventToSave: Event, showToast: (msg: string) => void) => Promise<void>;
  handleDeleteEvent: (eventId: string, showToast: (msg: string) => void) => Promise<void>;
  handleSaveTeamOrder: (orderedTeam: User[], showToast: (msg: string) => void) => Promise<void>;
  handleSaveCommunityPost: (postToSave: CommunityPost, showToast: (msg: string) => void) => Promise<void>;
  handleDeleteCommunityPost: (postId: string, showToast: (msg: string) => void) => Promise<void>;
  handleAddCommunityPostClap: (postId: string) => Promise<void>;
  handleAddCommunityReply: (postId: string, text: string, user: User) => Promise<void>;
  handleAddSessionSlot: (mentorId: string, date: string, time: string, showToast: (msg: string) => void) => Promise<void>;
  handleRemoveSessionSlot: (mentorId: string, date: string, time: string, showToast: (msg: string) => void) => Promise<void>;
  handleBookSession: (sessionId: string, user: User, showToast: (msg: string) => void) => Promise<void>;
  handleCancelSession: (sessionId: string, showToast: (msg: string) => void) => Promise<void>;
  handleCreateTrack: (trackName: string, showToast: (msg: string) => void) => Promise<void>;
  handleUpdateTrack: (trackId: string, oldName: string, newName: string, showToast: (msg: string) => void) => Promise<void>;
  handleDeleteTrack: (trackId: string, showToast: (msg: string) => void) => Promise<void>;
  handleSaveFinancialStatement: (statement: FinancialStatement, showToast: (msg: string) => void) => Promise<void>;
  handleDeleteFinancialStatement: (id: string, showToast: (msg: string) => void) => Promise<void>;
  handleSaveAnnualReport: (report: AnnualReport, showToast: (msg: string) => void) => Promise<void>;
  handleDeleteAnnualReport: (id: string, showToast: (msg: string) => void) => Promise<void>;
  handleSaveMarketingPost: (post: MarketingPost, showToast: (msg: string) => void) => Promise<void>;
  handleDeleteMarketingPost: (postId: string, showToast: (msg: string) => void) => Promise<void>;
  handleCompleteOnboarding: (user: User, setUser: (u: User | null) => void) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  const [loading, setLoading] = useState(true);

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
        dataFromDb = dataFromDb.map((article: any) => ({
          ...article,
          readingTime: calculateReadingTime(article.content || '')
        }));
        const mockArticleIds = new Set(ARTICLES.map(a => a.id));
        const additionalDbArticles = dataFromDb.filter(dbArticle => !mockArticleIds.has((dbArticle as Article).id));
        dataFromDb = [...ARTICLES, ...additionalDbArticles];
      }
      
      if (collectionName === 'projects') {
        const mockProjectIds = new Set(MOCK_PROJECTS.map(c => c.id));
        const additionalDbProjects = dataFromDb.filter(dbProject => !mockProjectIds.has((dbProject as Project).id));
        dataFromDb = [...MOCK_PROJECTS, ...additionalDbProjects];
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

      setData(dataFromDb);
    } catch (error) {
      console.error(`Erro ao buscar coleção: ${collectionName}`, error);
      if (collectionName === 'courses') setData(MOCK_COURSES);
      else if (collectionName === 'articles') setData(ARTICLES.map(article => ({ ...article, readingTime: calculateReadingTime(article.content) })));
      else if (collectionName === 'projects') setData(MOCK_PROJECTS.map(p => ({...p, status: 'approved'})));
      else if (collectionName === 'communityPosts') setData(MOCK_COMMUNITY_POSTS);
      else if (collectionName === 'events') setData(MOCK_EVENTS);
      else if (collectionName === 'supporters') setData(MOCK_SUPPORTERS);
      else setData([]);
    }
  };

  useEffect(() => {
    initializeFAQsIfNeeded().catch(err => console.error('Erro ao inicializar FAQs:', err));
    initializeEmailJS();
  }, []);

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

  const instructors = useMemo(() => users.filter(u => u.role === 'instructor' || u.role === 'admin'), [users]);
  const mentors = useMemo(() => users.filter(u => u.isMentor), [users]);

  const courseProgress: CourseProgress = useMemo(() => {
    const inProgressCourses: { course: Course; progress: number }[] = [];
    const completedCourses: Course[] = [];
    return { inProgressCourses, completedCourses };
  }, []);

  // Handlers (simplified - most will just update state + Firebase)
  const handleEnrollUser = async (courseId: string, user: User) => {
    const enrolledCourseIds = user.enrolledCourseIds || [];
    if (enrolledCourseIds.includes(courseId)) return;
    const updatedEnrolledIds = [...enrolledCourseIds, courseId];
    try {
      await updateDoc(doc(db, 'users', user.id), { enrolledCourseIds: updatedEnrolledIds });
    } catch (error) {
      console.error('Erro ao inscrever:', error);
    }
  };

  const completeLesson = async (lessonId: string, user: User) => {
    if (user.completedLessonIds.includes(lessonId)) return;
    const updatedCompletedIds = [...user.completedLessonIds, lessonId];
    try {
      await updateDoc(doc(db, 'users', user.id), { completedLessonIds: updatedCompletedIds });
    } catch (error) {
      console.error('Erro ao completar aula:', error);
    }
  };

  const handleSaveNote = async (lessonId: string, note: string, user: User) => {
    const updatedNotes = { ...(user.notes || {}), [lessonId]: note };
    try {
      await updateDoc(doc(db, 'users', user.id), { notes: updatedNotes });
    } catch (error) {
      console.error('Erro ao salvar anotação:', error);
    }
  };

  const handleSaveCourse = async (courseToSave: Course, showToast: (msg: string) => void) => {
    const isNew = !courses.some(c => c.id === courseToSave.id);
    setCourses(prev => isNew ? [...prev, courseToSave] : prev.map(c => c.id === courseToSave.id ? courseToSave : c));
    showToast('✅ Curso salvo!');
    try {
      await setDoc(doc(db, 'courses', courseToSave.id), courseToSave);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string, showToast: (msg: string) => void): Promise<boolean> => {
    if (window.confirm('Tem certeza?')) {
      setCourses(prev => prev.filter(c => c.id !== courseId));
      showToast('✅ Excluído!');
      try {
        await deleteDoc(doc(db, 'courses', courseId));
        return true;
      } catch (error) {
        console.error('Erro:', error);
        return false;
      }
    }
    return false;
  };

  const handleSaveArticle = async (articleToSave: Article, showToast: (msg: string) => void) => {
    const isNew = !articles.some(a => a.id === articleToSave.id);
    const articleWithTime = { ...articleToSave, readingTime: calculateReadingTime(articleToSave.content) };
    setArticles(prev => isNew ? [...prev, articleWithTime] : prev.map(a => a.id === articleToSave.id ? articleWithTime : a));
    showToast('✅ Artigo salvo!');
    try {
      await setDoc(doc(db, 'articles', articleToSave.id), articleWithTime);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDeleteArticle = async (articleId: string, showToast: (msg: string) => void): Promise<boolean> => {
    if (window.confirm('Tem certeza?')) {
      setArticles(prev => prev.filter(a => a.id !== articleId));
      showToast('🗑️ Excluído!');
      try {
        await deleteDoc(doc(db, 'articles', articleId));
        return true;
      } catch (error) {
        console.error('Erro:', error);
        return false;
      }
    }
    return false;
  };

  const handleToggleArticleStatus = async (articleId: string, showToast: (msg: string) => void) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    setArticles(prev => prev.map(a => a.id === articleId ? { ...a, status: newStatus } : a));
    try {
      await updateDoc(doc(db, 'articles', articleId), { status: newStatus });
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleAddArticleClap = async (articleId: string) => {
    setArticles(prev => prev.map(a => a.id === articleId ? { ...a, claps: (a.claps || 0) + 1 } : a));
    try {
      const articleRef = doc(db, 'articles', articleId);
      const articleSnap = await getDoc(articleRef);
      if (articleSnap.exists()) {
        const currentClaps = articleSnap.data().claps || 0;
        await updateDoc(articleRef, { claps: currentClaps + 1 });
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleSaveUser = async (userToSave: User, user: User | null, showToast: (msg: string) => void, setUser: (u: User | null) => void) => {
    const isNew = !users.some(u => u.id === userToSave.id);
    setUsers(prev => isNew ? [...prev, userToSave] : prev.map(u => u.id === userToSave.id ? userToSave : u));
    if (user && user.id === userToSave.id) setUser(userToSave);
    showToast('✅ Usuário salvo!');
    try {
      await setDoc(doc(db, 'users', userToSave.id), userToSave);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleUpdateUserProfile = async (userToUpdate: User, user: User | null, showToast: (msg: string) => void, setUser: (u: User | null) => void) => {
    if (user && user.id === userToUpdate.id) setUser(userToUpdate);
    setUsers(prev => prev.map(u => u.id === userToUpdate.id ? userToUpdate : u));
    try {
      await setDoc(doc(db, 'users', userToUpdate.id), userToUpdate);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDeleteUser = async (userId: string, showToast: (msg: string) => void) => {
    if (window.confirm('Desativar usuário?')) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, accountStatus: 'inactive' } : u));
      showToast('🚫 Desativado!');
      try {
        await updateDoc(doc(db, 'users', userId), { accountStatus: 'inactive' });
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const handleSaveProject = async (projectToSave: Project, showToast: (msg: string) => void) => {
    const isNew = !projects.some(p => p.id === projectToSave.id);
    setProjects(prev => isNew ? [...prev, projectToSave] : prev.map(p => p.id === projectToSave.id ? projectToSave : p));
    showToast('✅ Projeto salvo!');
    try {
      await setDoc(doc(db, 'projects', projectToSave.id), projectToSave);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleApproveProject = async (projectId: string, showToast: (msg: string) => void) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'approved' } : p));
    showToast('✅ Aprovado!');
    try {
      await updateDoc(doc(db, 'projects', projectId), { status: 'approved' });
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleRejectProject = async (projectId: string, showToast: (msg: string) => void) => {
    if (window.confirm('Rejeitar projeto?')) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'rejected' } : p));
      showToast('🚫 Rejeitado!');
      try {
        await updateDoc(doc(db, 'projects', projectId), { status: 'rejected' });
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const handleAddClap = async (projectId: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, claps: p.claps + 1 } : p));
    try {
      const projRef = doc(db, 'projects', projectId);
      const projSnap = await getDoc(projRef);
      if (projSnap.exists()) {
        await updateDoc(projRef, { claps: (projSnap.data().claps || 0) + 1 });
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleAddComment = async (projectId: string, text: string, user: User) => {
    const newComment: ProjectComment = {
      id: `c_${Date.now()}`,
      authorId: user.id,
      text,
      createdAt: new Date().toLocaleDateString()
    };
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, comments: [...p.comments, newComment] } : p));
    try {
      const projRef = doc(db, 'projects', projectId);
      const projSnap = await getDoc(projRef);
      if (projSnap.exists()) {
        const comments = projSnap.data().comments || [];
        await updateDoc(projRef, { comments: [...comments, newComment] });
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleSaveEvent = async (eventToSave: Event, showToast: (msg: string) => void) => {
    const isNew = !events.some(e => e.id === eventToSave.id);
    setEvents(prev => isNew ? [...prev, eventToSave] : prev.map(e => e.id === eventToSave.id ? eventToSave : e));
    showToast('✅ Evento salvo!');
    try {
      await setDoc(doc(db, 'events', eventToSave.id), eventToSave);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string, showToast: (msg: string) => void) => {
    if (window.confirm('Excluir evento?')) {
      setEvents(prev => prev.filter(e => e.id !== eventId));
      showToast('🗑️ Excluído!');
      try {
        await deleteDoc(doc(db, 'events', eventId));
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const handleSaveTeamOrder = async (orderedTeam: User[], showToast: (msg: string) => void) => {
    setUsers(prev => {
      const newUsers = [...prev];
      orderedTeam.forEach((member, index) => {
        const userIndex = newUsers.findIndex(u => u.id === member.id);
        if (userIndex > -1) newUsers[userIndex] = { ...newUsers[userIndex], displayOrder: index };
      });
      return newUsers;
    });
    showToast('✅ Ordem atualizada!');
    try {
      const batch = writeBatch(db);
      orderedTeam.forEach((member, index) => {
        batch.update(doc(db, 'users', member.id), { displayOrder: index });
      });
      await batch.commit();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleSaveCommunityPost = async (postToSave: CommunityPost, showToast: (msg: string) => void) => {
    const isNew = !communityPosts.some(p => p.id === postToSave.id);
    setCommunityPosts(prev => isNew ? [postToSave, ...prev] : prev.map(p => p.id === postToSave.id ? postToSave : p));
    showToast('✅ Post salvo!');
    try {
      await setDoc(doc(db, 'communityPosts', postToSave.id), postToSave);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDeleteCommunityPost = async (postId: string, showToast: (msg: string) => void) => {
    if (window.confirm('Excluir post?')) {
      setCommunityPosts(prev => prev.filter(p => p.id !== postId));
      showToast('🗑️ Excluído!');
      try {
        await deleteDoc(doc(db, 'communityPosts', postId));
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const handleAddCommunityPostClap = async (postId: string) => {
    setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, claps: p.claps + 1 } : p));
    try {
      const postRef = doc(db, 'communityPosts', postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        await updateDoc(postRef, { claps: (postSnap.data().claps || 0) + 1 });
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleAddCommunityReply = async (postId: string, text: string, user: User) => {
    const newReply: CommunityReply = {
      id: `r_${Date.now()}`,
      authorId: user.id,
      content: text,
      createdAt: new Date().toISOString()
    };
    setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p));
    try {
      const postRef = doc(db, 'communityPosts', postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const replies = postSnap.data().replies || [];
        await updateDoc(postRef, { replies: [...replies, newReply] });
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleAddSessionSlot = async (mentorId: string, date: string, time: string, showToast: (msg: string) => void) => {
    const newSession: MentorSession = {
      id: `session_${mentorId}_${date}_${time.replace(':', '')}`,
      mentorId,
      date,
      time,
      isBooked: false,
      studentId: null
    };
    setMentorSessions(prev => [...prev, newSession]);
    showToast('✅ Horário disponibilizado!');
    try {
      await setDoc(doc(db, 'mentorSessions', newSession.id), newSession);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleRemoveSessionSlot = async (mentorId: string, date: string, time: string, showToast: (msg: string) => void) => {
    const sessionId = `session_${mentorId}_${date}_${time.replace(':', '')}`;
    setMentorSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast('🗑️ Removido!');
    try {
      await deleteDoc(doc(db, 'mentorSessions', sessionId));
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleBookSession = async (sessionId: string, user: User, showToast: (msg: string) => void) => {
    setMentorSessions(prev => prev.map(s => s.id === sessionId ? { ...s, isBooked: true, studentId: user.id, googleMeetUrl: 'https://meet.google.com/abc' } : s));
    showToast('✅ Agendado!');
    try {
      await updateDoc(doc(db, 'mentorSessions', sessionId), {
        isBooked: true,
        studentId: user.id,
        googleMeetUrl: 'https://meet.google.com/abc'
      });
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleCancelSession = async (sessionId: string, showToast: (msg: string) => void) => {
    setMentorSessions(prev => prev.map(s => s.id === sessionId ? { ...s, isBooked: false, studentId: null, googleMeetUrl: undefined } : s));
    showToast('🗑️ Cancelado!');
    try {
      await updateDoc(doc(db, 'mentorSessions', sessionId), {
        isBooked: false,
        studentId: null,
        googleMeetUrl: null
      });
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleCreateTrack = async (trackName: string, showToast: (msg: string) => void) => {
    const newTrack: Track = { id: `track_${Date.now()}`, name: trackName };
    setTracks(prev => [...prev, newTrack]);
    showToast('✅ Trilha criada!');
    try {
      await setDoc(doc(db, 'tracks', newTrack.id), newTrack);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleUpdateTrack = async (trackId: string, oldName: string, newName: string, showToast: (msg: string) => void) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, name: newName } : t));
    setCourses(prev => prev.map(c => c.track === oldName ? { ...c, track: newName } : c));
    showToast('✅ Atualizado!');
    try {
      await updateDoc(doc(db, 'tracks', trackId), { name: newName });
      const coursesToUpdate = courses.filter(c => c.track === oldName);
      const batch = writeBatch(db);
      coursesToUpdate.forEach(c => {
        batch.update(doc(db, 'courses', c.id), { track: newName });
      });
      if (coursesToUpdate.length > 0) await batch.commit();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDeleteTrack = async (trackId: string, showToast: (msg: string) => void) => {
    if (window.confirm('Excluir trilha?')) {
      setTracks(prev => prev.filter(t => t.id !== trackId));
      showToast('🗑️ Excluído!');
      try {
        await deleteDoc(doc(db, 'tracks', trackId));
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const handleSaveFinancialStatement = async (statement: FinancialStatement, showToast: (msg: string) => void) => {
    const isNew = !financialStatements.some(s => s.id === statement.id);
    setFinancialStatements(prev => isNew ? [statement, ...prev] : prev.map(s => s.id === statement.id ? statement : s));
    showToast('✅ Salvo!');
    try {
      await setDoc(doc(db, 'financialStatements', statement.id), statement);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDeleteFinancialStatement = async (id: string, showToast: (msg: string) => void) => {
    if (window.confirm('Excluir?')) {
      setFinancialStatements(prev => prev.filter(s => s.id !== id));
      showToast('🗑️ Excluído!');
      try {
        await deleteDoc(doc(db, 'financialStatements', id));
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const handleSaveAnnualReport = async (report: AnnualReport, showToast: (msg: string) => void) => {
    const isNew = !annualReports.some(r => r.id === report.id);
    setAnnualReports(prev => isNew ? [report, ...prev] : prev.map(r => r.id === report.id ? report : r));
    showToast('✅ Salvo!');
    try {
      await setDoc(doc(db, 'annualReports', report.id), report);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDeleteAnnualReport = async (id: string, showToast: (msg: string) => void) => {
    if (window.confirm('Excluir?')) {
      setAnnualReports(prev => prev.filter(r => r.id !== id));
      showToast('🗑️ Excluído!');
      try {
        await deleteDoc(doc(db, 'annualReports', id));
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const handleSaveMarketingPost = async (post: MarketingPost, showToast: (msg: string) => void) => {
    const isNew = !marketingPosts.some(p => p.id === post.id);
    setMarketingPosts(prev => isNew ? [post, ...prev] : prev.map(p => p.id === post.id ? post : p));
    showToast('✅ Salvo!');
    try {
      await setDoc(doc(db, 'marketingPosts', post.id), post);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDeleteMarketingPost = async (postId: string, showToast: (msg: string) => void) => {
    if (window.confirm('Excluir?')) {
      setMarketingPosts(prev => prev.filter(p => p.id !== postId));
      showToast('🗑️ Excluído!');
      try {
        await deleteDoc(doc(db, 'marketingPosts', postId));
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const handleCompleteOnboarding = async (user: User, setUser: (u: User | null) => void) => {
    const updatedUser = { ...user, hasCompletedOnboardingTour: true };
    setUser(updatedUser);
    try {
      await updateDoc(doc(db, 'users', user.id), { hasCompletedOnboardingTour: true });
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <DataContext.Provider value={{
      users, courses, articles, projects, communityPosts, partners, supporters, events, mentorSessions, tracks,
      financialStatements, annualReports, marketingPosts, courseProgress, instructors, mentors, loading,
      handleEnrollUser, completeLesson, handleSaveNote, handleSaveCourse, handleDeleteCourse, handleSaveArticle,
      handleDeleteArticle, handleToggleArticleStatus, handleAddArticleClap, handleSaveUser, handleUpdateUserProfile,
      handleDeleteUser, handleSaveProject, handleApproveProject, handleRejectProject, handleAddClap, handleAddComment,
      handleSaveEvent, handleDeleteEvent, handleSaveTeamOrder, handleSaveCommunityPost, handleDeleteCommunityPost,
      handleAddCommunityPostClap, handleAddCommunityReply, handleAddSessionSlot, handleRemoveSessionSlot, handleBookSession,
      handleCancelSession, handleCreateTrack, handleUpdateTrack, handleDeleteTrack, handleSaveFinancialStatement,
      handleDeleteFinancialStatement, handleSaveAnnualReport, handleDeleteAnnualReport, handleSaveMarketingPost,
      handleDeleteMarketingPost, handleCompleteOnboarding
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData deve estar dentro de DataProvider');
  return context;
};
