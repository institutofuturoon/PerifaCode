// FIX: Add React import to resolve 'Cannot find namespace' error.
import type * as React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  role: 'student' | 'instructor' | 'admin';
  title?: string;
  // FIX: Added isMentor to satisfy type checks in ConnectView.tsx and other components.
  isMentor?: boolean;
  // FIX: Added showOnTeamPage to satisfy type checks in TeamView.tsx.
  showOnTeamPage?: boolean;
  completedLessonIds: string[];
  xp: number;
  achievements: string[];
  streak: number;
  lastCompletionDate: string; // YYYY-MM-DD
  mustChangePassword?: boolean;
  hasCompletedOnboardingTour?: boolean;
  
  // -- Detailed Onboarding Fields --
  profileStatus?: 'incomplete' | 'complete';
  dateOfBirth?: string; // YYYY-MM-DD
  rg?: string;
  cpf?: string;
  civilStatus?: 'Solteiro(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viúvo(a)' | 'Outro';
  hasChildren?: boolean;
  motherName?: string;
  fatherName?: string;
  parentsLiveTogether?: boolean;
  legalGuardianName?: string;
  legalGuardianRelationship?: string;
  guardianEducationLevel?: 'Ensino fundamental incompleto' | 'Ensino fundamental completo' | 'Ensino médio incompleto' | 'Ensino médio completo' | 'Graduação incompleta' | 'Graduação completa' | 'Pós-graduação incompleta' | 'Pós-graduação completa' | 'Outro';
  guardianEducationOther?: string;
  address?: string;
  city?: string;
  neighborhood?: string;
  cep?: string;
  phoneNumber?: string;
  emergencyPhoneNumber?: string;
  gender?: 'Masculino' | 'Feminino' | 'Não-binário' | 'Outro';
  genderOther?: string;
  race?: 'Preto' | 'Pardo' | 'Indígena' | 'Branco' | 'Amarelo';
  indigenousEthnicity?: string;
  hasDisability?: boolean;
  disabilityDescription?: string;
  hasAllergy?: boolean;
  allergyDescription?: string;
  bloodType?: string;
  livesNearProject?: 'Sim' | 'Não' | 'Talvez';
  transportToProject?: 'Andando' | 'Carro' | 'Transporte público' | 'Outro';
  familyIncome?: string; // Faixa de renda, e.g., "Até 1 salário mínimo"
  residentsInHome?: number;
  isBolsaFamiliaBeneficiary?: boolean;
  isOtherSocialProgramBeneficiary?: boolean;
  otherSocialProgramDescription?: string;
  hasInternetAccess?: boolean;
  internetAccessDevice?: ('Celular' | 'Computador' | 'Tablet' | 'Outro')[];
  internetAccessDeviceOther?: string;
  internetConnectionType?: 'Plano pré-pago' | 'Plano pós-pago' | 'Banda larga fixa';
  internetAccessLimit?: 'Limitado' | 'Ilimitado';

  // Campos estratégicos para ONG (alguns já existiam e foram mantidos)
  location?: string; // Ex: "Cidade, Estado" ou "Bairro, Cidade"
  educationLevel?: 'Ensino Fundamental' | 'Ensino Médio Incompleto' | 'Ensino Médio Completo' | 'Ensino Superior Incompleto' | 'Ensino Superior Completo' | 'Outro';
  motivation?: string; // Campo para o aluno descrever seus objetivos
  notes?: { [lessonId: string]: string }; // Notas pessoais por aula
  githubUrl?: string;
  linkedinUrl?: string;
  notificationPreferences?: {
    newCoursesAndClasses: boolean;
    communityEvents: boolean;
    platformUpdates: boolean;
  };
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

export interface CourseBenefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface CurriculumItem {
  title: string;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  track: 'Frontend' | 'Backend' | 'IA' | 'UX/UI' | 'Games' | 'Idiomas' | 'Negócios' | 'Digital';
  imageUrl?: string;
  duration: string;
  skillLevel: 'Iniciante' | 'Intermediário' | 'Avançado';
  instructorId: string;
  modules: Module[];
  tags?: string[];
  lessonsCount?: number;
  category?: string;
  projectTitle?: string;
  projectDescription?: string;
  projectCriteria?: string;

  // Fields for dynamic landing pages
  heroContent?: {
    subtitle?: string;
    titleLine1: string;
    titleAccent: string;
    description: string;
  };
  benefitsSection?: {
    title: string;
    subtitle: string;
    benefits: CourseBenefit[];
  };
  curriculumSection?: {
    title: string;
    subtitle: string;
    items: CurriculumItem[];
  };
  methodologySection?: {
    title: string;
    subtitle: string;
    benefits: CourseBenefit[];
  };
  ctaSection?: {
    title: string;
    description: string;
  };
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
  category: 'Tutoriais' | 'Histórias' | 'Dicas' | 'Carreira Tech';
  content: string;
  status: 'published' | 'draft';
  claps?: number;
  readingTime?: number; // Em minutos
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
  registrationUrl?: string;
  location?: string;
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

// FIX: Added specific types for analytics data to avoid 'never' type issues.
export interface CoursePerformanceData {
  courseId: string;
  enrolled: number;
  completionRate: number;
  avgTime: number; 
  satisfaction: number;
  dropOffRate: number;
}

export interface LessonPerformanceData {
  lessonId: string;
  title: string;
  studentsCompleted: number;
}

export interface TopStudentData {
  id: string;
  name: string;
  avatarUrl: string;
  xp: number;
}

export interface AtRiskStudentData {
    id: string;
    name: string;
    avatarUrl: string;
    lastLoginDaysAgo: number;
}

export interface AnalyticsData {
    totalStudents: number;
    newStudentsLast30d: number;
    avgCompletionRate: number;
    weeklyEngagement: number;
    coursePerformance: CoursePerformanceData[];
    lessonPerformance: Record<string, LessonPerformanceData[]>;
    studentRetention: {
        average: number;
        trend: number;
        dailyData: number[];
    };
    studentEngagement: {
        topStudents: TopStudentData[];
        atRiskStudents: AtRiskStudentData[];
    };
}


export type View = 'home' | 'courses' | 'dashboard' | 'connect' | 'blog' | 'login' | 'register' | 'completeProfile' | 'profile' | 'courseDetail' | 'lesson' | 'admin' | 'courseEditor' | 'certificate' | 'analytics' | 'articleDetail' | 'articleEditor' | 'instructorEditor' | 'studentEditor' | 'instructorCourseDashboard' | 'community' | 'projectDetail' | 'projectEditor' | 'partnerships' | 'eventEditor' | 'privacy' | 'terms' | 'team' | 'teamMemberEditor' | 'donate' | 'about' | 'annualReport' | 'financialStatement' | 'eventDetail' | 'uploadTest' | 'changePassword' | 'courseLanding';

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
  currentEvent: Event | null;
  editingCourse: Course | null;
  editingArticle: Article | null;
  editingUser: User | null;
  editingProject: Project | null;
  editingEvent: Event | null;
  courseProgress: CourseProgress;
  monitoringCourse: Course | null;
  isProfileModalOpen: boolean;
  selectedProfile: User | null;
  isBottleneckModalOpen: boolean;
  selectedBottleneck: { lesson: Lesson, students: User[] } | null;
  instructors: User[];
  mentors: User[];
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  // Actions
  navigate: (view: View) => void;
  handleLogout: () => void;
  navigateToCourse: (course: Course) => void;
  navigateToLesson: (course: Course, lesson: Lesson) => void;
  navigateToArticle: (article: Article) => void;
  navigateToEvent: (event: Event) => void;
  navigateToCertificate: (course: Course) => void;
  navigateToInstructorDashboard: (course: Course) => void;
  navigateToProject: (project: Project) => void;
  navigateToProjectEditor: (project?: Project) => void;
  openProfileModal: (member: User) => void;
  closeProfileModal: () => void;
  openBottleneckModal: (lesson: Lesson, students: User[]) => void;
  closeBottleneckModal: () => void;
  completeLesson: (lessonId: string) => void;
  handleCompleteOnboarding: () => Promise<void>;
  handleSaveNote: (lessonId: string, note: string) => void;
  showToast: (message: string) => void;
  
  // Data Management
  handleSaveCourse: (courseToSave: Course) => void;
  handleEditCourse: (course: Course) => void;
  handleCreateCourse: () => void;
  handleSaveArticle: (articleToSave: Article) => void;
  handleEditArticle: (article: Article) => void;
  handleCreateArticle: () => void;
  handleDeleteArticle: (articleId: string) => Promise<boolean>;
  handleToggleArticleStatus: (articleId: string) => Promise<void>;
  handleAddArticleClap: (articleId: string) => Promise<void>;
  handleSaveUser: (userToSave: User) => void;
  handleUpdateUserProfile: (userToUpdate: User) => Promise<void>;
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