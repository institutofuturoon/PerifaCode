import { User, Course, Article, Event, Exercise, Achievement, Notification, ForumPost, Project, Partner, MentorSession, AnalyticsData } from './types';

// Todos os arrays de dados mockados foram esvaziados.
// A aplicação agora dependerá exclusivamente dos dados carregados do Firebase.
export const ARTICLES: Article[] = [];
export const MOCK_COURSES: Course[] = [];
export const MOCK_USERS: User[] = [];
export const MOCK_ACHIEVEMENTS: Achievement[] = [];
export const MOCK_NOTIFICATIONS: Notification[] = [];
export const MOCK_FORUM_POSTS: ForumPost[] = [];
export const MOCK_PROJECTS: Project[] = [];
export const MOCK_PARTNERS: Partner[] = [];
export const MOCK_EVENTS: Event[] = [];
export const MOCK_MENTOR_SESSIONS: MentorSession[] = [];
export const EXERCISES: Exercise[] = [];

// Os dados de analytics foram zerados para refletir um estado inicial limpo,
// prevenindo erros em componentes que dependem desta estrutura.
// FIX: Applied the AnalyticsData type to ensure correct type inference for its properties, especially lessonPerformance.
export const MOCK_ANALYTICS_DATA_V2: AnalyticsData = {
  totalStudents: 0,
  newStudentsLast30d: 0,
  avgCompletionRate: 0,
  weeklyEngagement: 0,
  coursePerformance: [],
  lessonPerformance: {},
  studentRetention: {
    average: 0,
    trend: 0,
    dailyData: [],
  },
  studentEngagement: {
    topStudents: [],
    atRiskStudents: [],
  },
};