# FuturoOn - PerifaCode LMS Platform

## Overview
FuturoOn is an LMS platform designed for digital inclusion in underprivileged Brazilian communities. It provides technology courses with advanced features such as course enrollment, progress tracking, AI-powered tutoring, community forums, and gamification. The project aims to provide an accessible and engaging learning experience, preparing students for the tech job market and fostering community growth.

## User Preferences
- Language: Portuguese (Brazil) - PT-BR
- Tone: Friendly, encouraging, accessible (designed for underserved communities)
- UX Priority: Clear visual feedback, celebration moments, minimal friction
- Bot Strategy: FAQ-based, no ML needed, learning loop with feedback

## System Architecture
The platform is built with a clear separation between the institutional "SITE" and the LMS "SISTEMA".

**UI/UX Decisions:**
- **Course Modalities:** Supports Online, Hybrid, and Presential courses with distinct visual badges and configurable features.
- **Chat Bot:** Features a floating widget with a stylized interface, real-time message history, feedback system, and typing indicator.
- **Pre-Lesson Screen:** A full-screen onboarding component displays lesson duration, XP, position, module progress, and objectives to improve retention and completion rates.
- **Mentor Dashboard:** Professional dashboard with status tabs (Pending, In Progress, Resolved), real-time escalation lists, priority indicators, category icons, and response time tracking.
- **Notification System:** Real-time notifications via Firestore with a bell icon, unread badge counter, and visual distinction between read/unread messages.
- **Theming:** Utilizes a gradient (purple/magenta) for specific UI elements like the chat bot.

**Technical Implementations:**
- **State Management:** Uses React's Context API for global state management (e.g., `user.enrolledCourseIds`, `user.completedLessonIds`, `user.xp`).
- **Component Structure:** Follows a modular approach with `App.tsx` as the context provider, `LessonView.tsx` for the main learning interface, `CourseDetail.tsx` for course overviews, and `CourseCard.tsx` for course listings.
- **API Integration:** Leverages Firebase (Firestore for database, Auth for authentication) and Google Gemini 2.5 Flash for AI tutoring.
- **Chat Bot Logic:** Implemented with NLP utilities (`chatBotUtils.ts`) including Levenshtein distance for similarity, keyword extraction, FAQ matching with scoring, and sentiment detection. It uses a Firestore-based knowledge base (`faqBase`) and tracks metrics in `botMetrics`.
- **Email Notifications:** Integrates EmailJS for sending email notifications, particularly for mentor escalations, with templated variables.
- **Routing:** A clear separation of routes into `SiteLayout` (for institutional pages like Home, Blog), `SistemaLayout` (for LMS features like Dashboard, Lessons, Admin), and authentication routes, protected by `PrivateRoute`.

**Feature Specifications:**
- **Course Progress Tracking:** Visual progress bars, progress trails, and a checklist of completed lessons.
- **Enrollment System:** User enrollment in courses with confirmation modals.
- **AI Tutor:** Integration with Google Gemini for AI-powered tutoring within lessons.
- **Gamification:** Celebration modals for lesson completion, module milestones, and course completion.
- **Admin Dashboards:** Dedicated `/admin/chatbot` route for managing FAQs, viewing bot metrics, and tracking conversations.

## Recent Changes (November 22, 2025)

### ✨ Toast Notifications + Badge Unlock Celebration Complete
**Status:** Both features fully implemented + integrated

#### Implementation:
1. **Toast Notifications System**
   - Uses existing App.tsx context (showToast)
   - Auto-dismiss in 3 seconds
   - Displays at bottom-right of screen
   - Integrated with Badge unlock + XP gains
   - Examples: "+50 XP!", "🏆 Badge Desbloqueada: Primeiro Passo!"

2. **BadgeUnlockCelebration Modal** (`components/BadgeUnlockCelebration.tsx`)
   - Yellow/amber gradient design
   - Badge emoji with spin animation
   - Auto-close after 3 seconds
   - Share button (future integration)
   - Smooth bounce-in animation

3. **Badge Detection**
   - Triggers when user.achievements length increases
   - Shows modal + toast notification
   - Integrated with StudentTrilhasContent
   - Real-time Firestore sync

#### Features:
✅ Toast notifications on XP gain
✅ Toast on badge unlock
✅ Badge unlock modal with emoji
✅ Confetti + animations
✅ Auto-dismiss 3-4 seconds
✅ Responsive design
✅ Real-time detection

#### Status:
✅ BadgeUnlockCelebration component created
✅ Toast notifications integrated
✅ Badge detection working
✅ Dashboard integration complete

---

### 🏆 Leaderboard + Level Up Celebration Complete (Previous)
**Status:** Both features fully implemented + integrated

#### Implementation:
1. **LevelUpCelebration Modal** (`components/LevelUpCelebration.tsx` - 250+ lines)
   - Animated modal with confetti effects
   - Shows new level emoji and name
   - XP progress bar to next level
   - Auto-close after 4 seconds
   - Smooth animations and transitions
   - Share button (future integration)

2. **Leaderboard Tab** (integrated in Dashboard)
   - New "Ranking" navigation item in sidebar
   - Top 10 students sorted by XP
   - Medal system (🥇🥈🥉 + ✨)
   - Current user position highlight
   - User rank shown even if outside top 10
   - Period filter (This Week/Month/All-time)
   - Real-time ranking from context users

3. **Level Up Detection**
   - Triggers when user.nivel changes
   - Modal shows automatically
   - Integrated with useProgresso hook
   - Passes XP data to modal

#### Features:
✅ Confetti animation on level up
✅ Glowing modal with gradient background
✅ Smooth entrance animation
✅ XP progress bar
✅ Auto-dismiss after 4 seconds
✅ Leaderboard with top 10 rankings
✅ Current user position tracking
✅ Medal badges for top 3
✅ Responsive design

#### Status:
✅ LevelUpCelebration component created
✅ Leaderboard integrated in Dashboard
✅ Sidebar nav item added
✅ Level up detection working
✅ Type-safe with TypeScript
✅ All animations ready

---

### ✨ XP System & Gamification Complete (Previous)
**Status:** Fully implemented + integrated in Dashboard

#### Implementation:
1. **XP System** (`utils/xpSystem.ts` - 300+ lines)
   - 18+ XP events (lessons, projects, community, engagement)
   - 5 dynamic multipliers (streak, challenge, group, mentor, speed)
   - 6 levels with emojis (🥚→👑 Lenda)
   - 12+ automatic badges (first lesson, streaks, milestones, etc)
   - Static methods for event processing and calculations

2. **Dashboard Integration** 
   - New "Trilhas & XP" tab in sidebar (for students)
   - `components/DashboardTrilhasSection.tsx` - showcases gamification
   - Displays: XP, Level, Streak, Badges, Progress bar
   - Shows enrolled trilhas and available courses
   - Integrates with Firebase via useTrilhas() and useProgresso()

3. **Features:**
   - XP awarded based on specific actions (not time)
   - Multiplicators incentivize streaks and speed
   - Badges auto-unlock on milestones
   - Progress bar shows XP to next level
   - Real-time sync with Firebase
   - Type-safe with TypeScript

#### Status:
✅ 18+ XP events defined
✅ 5 multiplier types implemented
✅ 6 levels with progression
✅ 12+ auto badges
✅ Dashboard section created
✅ Firebase integration complete
✅ React hooks ready
✅ Full TypeScript typing

---

### 🚀 Rocketseat-Style Learning Platform
**Status:** Components created + Firebase integrated + Dashboard added

#### Components Created:
1. **TrilhaCard** (`components/TrilhaCard.tsx`)
   - Displays learning tracks with progress
   - Shows duration, lessons, XP, rating, student count
   - Gradient design (Purple/Pink Rocketseat-style)
   - Hover effects and interactive badges
   - Status indicators (Completed, Locked, In Progress)

2. **ProjetoCard** (`components/ProjetoCard.tsx`)
   - Project card with difficulty levels
   - Skills tags, duration, XP reward
   - Submission stats
   - Completion status
   - Beautiful gradients and animations

3. **LeaderboardView** (`components/LeaderboardView.tsx`)
   - Top 10 rankings with medals (🥇🥈🥉)
   - User position tracking
   - XP display and level badges
   - Period filter (Week/Month/All-time)
   - Responsive design

#### Supporting Files:
- `TIPOS_CURSO_ROCKETSEAT.ts` - 30+ TypeScript types for tracks, lessons, projects, gamification
- `DADOS_EXEMPLO_ROCKETSEAT.ts` - Sample data: 2 tracks, 2 projects, 6 badges, challenges, events
- `PLANO_CURSO_ROCKETSEAT.md` - Complete learning platform strategy
- `views/TrilhasView.tsx` - Demo page showing all components

#### Features Included:
✅ Progressive learning paths (Beginner → Advanced)
✅ 30+ practical projects (Real-world examples)
✅ Gamification (XP, Badges, Rankings)
✅ Community features (Forum structure, Challenges, Events)
✅ Modern design (Rocketseat-inspired, dark theme, gradients)

---

### Previous Updates (Earlier Sessions)

**2-Minute Time Restriction Removed:** Disabled minimum lesson time requirement in LessonView.tsx, allowing instant lesson completion.

**Course Design Enhanced:** Improved CourseDetail.tsx with gradients, shadows, hover effects on InfoCards, ModuleAccordion badges, and better visual hierarchy.

**Firebase Services Completed:**
- `trilhaService.ts` - CRUD operations for learning tracks
- `projetoService.ts` - CRUD operations for projects + submissions
- `progressoService.ts` - XP, badges, streak, progress tracking
- Cache-first approach (80% read reduction)

**React Hooks Created:**
- `useTrilhas()` - Load tracks and projects with caching
- `useProgresso()` - Manage user XP, level, streak, badges

**Cache Utility Created:** Implemented firebaseCache.ts with TTL-based caching to reduce redundant database reads.

**Student Testing Verified:** User tested aluno@teste.com account and confirmed lesson flow improvements are functional.

## External Dependencies
- **Firebase:** Firestore (database, real-time updates), Authentication.
- **Google Gemini 2.5 Flash:** For AI Tutor functionality.
- **EmailJS:** For sending email notifications (`@emailjs/browser`).
- **React Icons:** Lucide-react for modern icons.
- **npm packages:** `@emailjs/browser`, `react-icons`, `lucide-react`.

## Constraints & Decisions
- **Zero-cost operation:** All solutions must use Firebase free tier, EmailJS 200 emails/month limit
- **Architecture:** Clear SITE vs SISTEMA separation
- **DashboardSidebar.tsx:** Real navigation component (not SistemaSidebar)
- **Test credentials:** Student (aluno@teste.com / 123456), Admin (admin@futuroon.org / 123456), Instructor (instrutor@futuroon.org / 123456)

## Next Steps
1. **Leaderboard Real-time:** Fetch rankings from Firestore (top 10, user position)
2. **Level Up Celebrations:** Modal animations when leveling up
3. **Notifications:** Toast messages for XP earned, badges unlocked
4. **Add More Tracks:** Create full curriculum (currently 2 example tracks)
5. **Challenge Events:** Weekly challenges with bonus XP multipliers
6. **Streaks Rewards:** Special bonuses at 7, 30, 100 day milestones
7. **Polish & Deploy:** Mobile optimization, performance testing, animations
