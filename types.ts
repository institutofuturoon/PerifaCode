export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  role: 'student' | 'instructor' | 'admin';
  title?: string;
  isMentor?: boolean;
  showOnTeamPage?: boolean;
  googleMeetUrl?: string; // For mentors
  completedLessonIds: string[];
  xp: number;
  achievements: string[];
  streak: number;
  lastCompletionDate: string; // YYYY-MM-DD
  // Campos estratégicos para ONG
  dateOfBirth?: string; // YYYY-MM-DD
  location?: string; // Ex: "Cidade, Estado" ou "Bairro, Cidade"
  phoneNumber?: string;
  educationLevel?: 'Ensino Fundamental' | 'Ensino Médio Incompleto' | 'Ensino Médio Completo' | 'Ensino Superior Incompleto' | 'Ensino Superior Completo' | 'Outro';
  motivation?: string; // Campo para o aluno descrever seus objetivos
  notes?: { [lessonId: string]: string }; // Notas pessoais por aula
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text';
  xp: number;
  videoUrl?: string;
  objective?: string;
  mainContent?: string;
  complementaryMaterial?: string;
  summary?: string;
  exerciseId?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  track: 'Frontend' | 'Backend' | 'IA' | 'UX/UI';
  imageUrl: string;
  duration: string;
  skillLevel: 'Iniciante' | 'Intermediário' | 'Avançado';
  instructorId: string;
  modules: Module[];
  projectTitle?: string;
  projectDescription?: string;
  projectCriteria?: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  summary: string;
  imageUrl: string;
  authorAvatarUrl: string;
  category: 'Tutoriais' | 'Histórias' | 'Dicas';
  content: string;
}


export interface Mentor {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  bio: string;
}

export interface Event {
  id: string;
  title: string;
  date: string; // Ex: "AGO 20"
  time: string; // Ex: "19:00"
  hostId: string; // ID do instrutor
  description: string;
  imageUrl: string;
  eventType: 'Live' | 'Workshop' | 'Palestra';
}

export interface MentorSession {
  id: string;
  mentorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  isBooked: boolean;
  studentId: string | null;
  googleMeetUrl?: string;
}

export type ExerciseType = 'quiz' | 'playground';

export interface ExerciseOption {
  id: string;
  text: string;
}

interface BaseExercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  prompt: string;
  xp: number;
}

export interface QuizExerciseData extends BaseExercise {
  type: 'quiz';
  options: ExerciseOption[];
  correctOptionId: string;
  feedback: {
    correct: string;
    incorrect: string;
  };
}

export interface PlaygroundExerciseData extends BaseExercise {
  type: 'playground';
  startingCode?: {
    html?: string;
    css?: string;
    js?: string;
  };
}

export type Exercise = QuizExerciseData | PlaygroundExerciseData;


export interface Reply {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl: string;
    text: string;
    createdAt: string;
}

export interface ForumPost {
    id: string;
    lessonId: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl: string;
    text: string;
    createdAt: string;
    replies: Reply[];
}

export interface Notification {
    id: string;
    text: string;
    createdAt: string;
    isRead: boolean;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string; // Emoji or SVG string
    condition: (user: User, courses: Course[]) => boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ProjectComment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface Project {
  id: string;
  authorId: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  repoUrl: string;
  liveUrl: string;
  claps: number;
  comments: ProjectComment[];
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
}


export type View = 'home' | 'courses' | 'dashboard' | 'connect' | 'blog' | 'login' | 'profile' | 'courseDetail' | 'lesson' | 'admin' | 'courseEditor' | 'certificate' | 'analytics' | 'articleDetail' | 'articleEditor' | 'instructorEditor' | 'studentEditor' | 'instructorCourseDashboard' | 'community' | 'projectDetail' | 'projectEditor' | 'partnerships' | 'eventEditor' | 'privacy' | 'terms' | 'team' | 'teamMemberEditor' | 'perifacode' | 'donate' | 'about';

export interface CourseProgress {
  inProgressCourses: { course: Course; progress: number }[];
  completedCourses: Course[];
}

export interface AppContextType {
  // State
  view: View;
  user: User | null;
  users: User[];
  courses: Course[];
  articles: Article[];
  team: User[];
  projects: Project[];
  partners: Partner[];
  events: Event[];
  mentorSessions: MentorSession[];
  toast: string | null;
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  currentArticle: Article | null;
  currentProject: Project | null;
  editingCourse: Course | null;
  editingArticle: Article | null;
  editingUser: User | null;
  editingProject: Project | null;
  editingEvent: Event | null;
  courseProgress: CourseProgress;
  monitoringCourse: Course | null;
  isProfileModalOpen: boolean;
  selectedProfile: User | null;
  instructors: User[];
  mentors: User[];
  loading: boolean;

  // Actions
  navigate: (view: View) => void;
  handleLogout: () => void;
  navigateToCourse: (course: Course) => void;
  navigateToLesson: (course: Course, lesson: Lesson) => void;
  navigateToArticle: (article: Article) => void;
  navigateToCertificate: (course: Course) => void;
  navigateToInstructorDashboard: (course: Course) => void;
  navigateToProject: (project: Project) => void;
  navigateToProjectEditor: (project?: Project) => void;
  openProfileModal: (member: User) => void;
  closeProfileModal: () => void;
  completeLesson: (lessonId: string) => void;
  handleSaveNote: (lessonId: string, note: string) => void;
  
  // Data Management
  handleSaveCourse: (courseToSave: Course) => void;
  handleEditCourse: (course: Course) => void;
  handleCreateCourse: () => void;
  handleSaveArticle: (articleToSave: Article) => void;
  handleEditArticle: (article: Article) => void;
  handleCreateArticle: () => void;
  handleDeleteArticle: (articleId: string) => void;
  handleSaveUser: (userToSave: User) => void;
  handleEditUser: (user: User) => void;
  handleCreateUser: (role: 'student' | 'instructor') => void;
  handleDeleteUser: (userId: string) => void;
  handleSaveProject: (projectToSave: Project) => void;
  handleAddClap: (projectId: string) => void;
  handleAddComment: (projectId: string, text: string) => void;
  handleSaveEvent: (eventToSave: Event) => void;
  handleCreateEvent: () => void;
  handleEditEvent: (event: Event) => void;
  handleDeleteEvent: (eventId: string) => void;
  handleAddSessionSlot: (mentorId: string, date: string, time: string) => void;
  handleRemoveSessionSlot: (mentorId: string, date: string, time: string) => void;
  handleBookSession: (sessionId: string) => void;
  handleCancelSession: (sessionId: string) => void;
}