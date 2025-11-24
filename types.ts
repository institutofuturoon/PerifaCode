
// FIX: Add React import to resolve 'Cannot find namespace' error.
import type * as React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bannerUrl?: string;
  bio: string;
  role: 'student' | 'instructor' | 'admin';
  title?: string;
  // FIX: Added isMentor to satisfy type checks in ConnectView.tsx and other components.
  isMentor?: boolean;
  // FIX: Added showOnTeamPage to satisfy type checks in TeamView.tsx.
  showOnTeamPage?: boolean;
  displayOrder?: number;
  completedLessonIds: string[];
  xp: number;
  achievements: string[];
  streak: number;
  lastCompletionDate: string; // YYYY-MM-DD
  mustChangePassword?: boolean;
  hasCompletedOnboardingTour?: boolean;
  accountStatus?: 'active' | 'inactive';
  
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

export interface Supporter {
    id: string;
    name: string;
    role?: string; // Ex: "Engenheiro de Software", "Empresário"
    tier: 'visionary' | 'builder' | 'ally';
    avatarUrl?: string;
    message?: string; // Mensagem curta de apoio
    since: string; // Ano de início do apoio
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
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export interface CurriculumItem {
  title: string;
  description: string;
}

export interface Track {
  id: string;
  name: string;
}

export interface SeoConfig {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface Course {
  id: string;
  slug?: string; // URL amigável
  title: string;
  description: string;
  longDescription: string;
  track: string;
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
  format: 'online' | 'presencial' | 'hibrido';
  lessonRelease?: 'sequencial' | 'manual';
  enrollmentStatus?: 'open' | 'closed' | 'soon';
  
  // SEO Configuration
  seo?: SeoConfig;

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
  slug?: string; // URL amigável
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
  tags?: string[];
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

export interface CommunityReply {
  id: string;
  authorId: string;
  content: string;
  createdAt: string; // ISO String
}

export interface CommunityPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  claps: number;
  views: number;
  createdAt: string; // ISO String
  replies: CommunityReply[];
  
  // New Engagement Fields
  type: 'question' | 'discussion'; // Define visual treatment
  isSolved?: boolean; // For questions
  isPinned?: boolean; // For admin announcements
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
  // New fields for moderation
  status: 'approved' | 'pending' | 'rejected';
  
  // New Collaboration Field
  lookingForCollab?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  description?: string;
  websiteUrl?: string;
  impactDescription?: string;
  since?: string;
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

// --- Transparency System Types ---

export interface FinancialItem {
  label: string;
  value: string;
  percentage: number;
  color: string; // e.g., 'bg-sky-500'
}

export interface FinancialStatement {
  id: string;
  year: number;
  totalRevenue: string;
  totalExpenses: string;
  reinvested: string;
  revenueBreakdown: FinancialItem[];
  expensesBreakdown: FinancialItem[];
  documentsUrl?: string; // URL to download ZIP/PDF
}

export interface ReportStat {
  value: string;
  label: string;
  color: string; // e.g., 'text-sky-400'
}

export interface Testimonial {
  name: string;
  quote: string;
  role: string;
  avatarUrl: string;
}

export interface AnnualReport {
  id: string;
  year: number;
  stats: ReportStat[];
  coordinationLetter: {
    text: string;
    authorName: string;
    authorRole: string;
    authorAvatarUrl: string;
  };
  testimonials: Testimonial[];
}

// --- Marketing Studio Types ---
export interface MarketingPost {
    id: string;
    platform: string;
    caption: string;
    imagePrompt: string;
    hashtags: string[];
    imageBase64?: string | null;
    uploadedImage?: string | null;
    createdAt: string; // ISO String
    status: 'draft' | 'published';
    authorId: string;
}


export type View = 'home' | 'courses' | 'dashboard' | 'connect' | 'blog' | 'login' | 'register' | 'completeProfile' | 'profile' | 'courseDetail' | 'lesson' | 'admin' | 'courseEditor' | 'certificate' | 'analytics' | 'articleDetail' | 'articleEditor' | 'instructorEditor' | 'studentEditor' | 'instructorCourseDashboard' | 'community' | 'projectDetail' | 'projectEditor' | 'partnerships' | 'eventEditor' | 'privacy' | 'terms' | 'team' | 'teamMemberEditor' | 'donate' | 'about' | 'annualReport' | 'financialStatement' | 'eventDetail' | 'changePassword' | 'courseLanding' | 'transparencyEditor' | 'supporters' | 'partnerDetail';

export interface CourseProgress {
  inProgressCourses: { course: Course; progress: number }[];
  completedCourses: Course[];
}

export interface AppContextType {
  // State
  user: User | null;
  users: User[];
  courses: Course[];
  articles: Article[];
  team: User[];
  projects: Project[];
  communityPosts: CommunityPost[];
  partners: Partner[];
  supporters: Supporter[];
  events: Event[];
  mentorSessions: MentorSession[];
  tracks: Track[];
  financialStatements: FinancialStatement[];
  annualReports: AnnualReport[];
  marketingPosts: MarketingPost[]; // Novo
  toast: string | null;
  courseProgress: CourseProgress;
  isProfileModalOpen: boolean;
  selectedProfile: User | null;
  isBottleneckModalOpen: boolean;
  selectedBottleneck: { lesson: Lesson, students: User[] } | null;
  isInscriptionModalOpen: boolean;
  selectedCourseForInscription: Course | null;
  instructors: User[];
  mentors: User[];
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  // Actions
  handleLogout: () => void;
  openProfileModal: (member: User) => void;
  closeProfileModal: () => void;
  openBottleneckModal: (lesson: Lesson, students: User[]) => void;
  closeBottleneckModal: () => void;
  openInscriptionModal: (course: Course) => void;
  closeInscriptionModal: () => void;
  completeLesson: (lessonId: string) => void;
  handleCompleteOnboarding: () => Promise<void>;
  handleSaveNote: (lessonId: string, note: string) => void;
  showToast: (message: string) => void;
  
  // Data Management
  handleSaveCourse: (courseToSave: Course) => void;
  handleDeleteCourse: (courseId: string) => Promise<boolean>;
  handleSaveArticle: (articleToSave: Article) => void;
  handleDeleteArticle: (articleId: string) => Promise<boolean>;
  handleToggleArticleStatus: (articleId: string) => Promise<void>;
  handleAddArticleClap: (articleId: string) => Promise<void>;
  handleSaveUser: (userToSave: User) => void;
  handleUpdateUserProfile: (userToUpdate: User) => Promise<void>;
  handleDeleteUser: (userId: string) => Promise<void>;
  handleSaveProject: (projectToSave: Project) => void;
  handleApproveProject: (projectId: string) => void;
  handleRejectProject: (projectId: string) => void;
  handleAddClap: (projectId: string) => void;
  handleAddComment: (projectId: string, text: string) => void;
  handleSaveEvent: (eventToSave: Event) => void;
  handleDeleteEvent: (eventId: string) => void;
  handleSaveTeamOrder: (orderedTeam: User[]) => Promise<void>;
  handleSaveCommunityPost: (postToSave: CommunityPost) => void;
  handleDeleteCommunityPost: (postId: string) => void;
  handleAddCommunityPostClap: (postId: string) => void;
  handleAddCommunityReply: (postId: string, text: string) => void;
  handleAddSessionSlot: (mentorId: string, date: string, time: string) => void;
  handleRemoveSessionSlot: (mentorId: string, date: string, time: string) => void;
  handleBookSession: (sessionId: string) => void;
  handleCancelSession: (sessionId: string) => void;
  handleCreateTrack: (trackName: string) => Promise<void>;
  handleUpdateTrack: (trackId: string, oldName: string, newName: string) => Promise<void>;
  handleDeleteTrack: (trackId: string) => Promise<void>;
  handleSaveFinancialStatement: (statement: FinancialStatement) => Promise<void>;
  handleDeleteFinancialStatement: (id: string) => Promise<void>;
  handleSaveAnnualReport: (report: AnnualReport) => Promise<void>;
  handleDeleteAnnualReport: (id: string) => Promise<void>;
  
  // Marketing Actions
  handleSaveMarketingPost: (post: MarketingPost) => Promise<void>;
  handleDeleteMarketingPost: (postId: string) => Promise<void>;
}
