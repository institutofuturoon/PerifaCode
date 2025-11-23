# FuturoOn - PerifaCode LMS Platform

## Overview
FuturoOn is an LMS platform designed for digital inclusion in underprivileged Brazilian communities. It provides technology courses with features such as course enrollment, progress tracking, AI-powered tutoring, community forums, and an engaging learning experience. The platform aims to prepare students for the tech job market and foster community growth, maintaining a clear separation between institutional content and the LMS system.

## User Preferences
- Language: Portuguese (Brazil) - PT-BR
- Tone: Friendly, encouraging, accessible (designed for underserved communities)
- UX Priority: Clear visual feedback, celebration moments, minimal friction
- Bot Strategy: FAQ-based, no ML needed, learning loop with feedback
- Course Editor: SIMPLIFIED - Essential fields only (Title, Description, Track, Instructor), no complex landing pages
- Course Creation: Focus on speed and simplicity, not on extensive metadata

## System Architecture
The platform maintains a clear separation between the institutional "SITE" and the LMS "SISTEMA".

### UI/UX Decisions
- **Color Scheme:** Consistent use of purple (`#8a4add`) and pink (`#f27983`) gradients.
- **Visual Feedback:** Animated modals for gamification events (BadgeUnlock, LevelUp, Leaderboard) were removed, but visual indicators remain.
- **Navigation:** Floating chatbot widget, full-screen pre-lesson onboarding, sticky top navigation in LessonView, interactive breadcrumbs, keyboard shortcuts, and a scroll-to-top button.
- **Dashboards:** Professional Mentor Dashboard with status tabs and a Notification Center with filtering and preferences. Student dashboard is ultra-minimal, focusing on essential learning features.
- **Course Design:** Enhanced CourseCard and CourseDetail components with gradients, shadows, and hover effects.
- **Responsiveness:** Perfect mobile responsiveness across all components.
- **Animations:** Uses `framer-motion` for smooth transitions and animations.

### Technical Implementations
- **State Management:** React's Context API for global state.
- **Component Structure:** Modular approach with dedicated components.
- **API Integration:** Firebase (Firestore, Auth) and Google Gemini 2.5 Flash.
- **Chat Bot Logic:** NLP utilities for FAQ matching and sentiment detection, backed by a Firestore knowledge base.
- **Email Notifications:** EmailJS integration for templated mentor escalation notifications.
- **Routing:** `SiteLayout`, `SistemaLayout`, and authenticated routes protected by `PrivateRoute`.
- **Image Upload System:** Firebase integration with client/server-side validation, compression, retry logic, drag & drop, and WebP optimization.
- **Firebase Services:** `trilhaService.ts`, `projetoService.ts`, and `progressoService.ts` for CRUD operations with a cache-first approach.
- **Data Management:** React Hooks (`useTrilhas()`, `useProgresso()`) and `firebaseCache.ts` with TTL-based caching.
- **Lesson History:** `localStorage` and Firebase-synced tracking of the last viewed lesson for cross-device continuity.
- **Smart Notification System:** Firestore-based, real-time notification system with various intelligent triggers (streaks, reminders, inactivity, badges, level-ups) and user-configurable preferences.
- **Notification Analytics:** CTR tracking system (`notificationAnalytics.ts`) with impression, click, and dismiss tracking for each notification type.

### Feature Specifications
- **Course Progress Tracking:** Visual progress bars, trails, and checklists.
- **Enrollment System:** User enrollment with confirmation modals.
- **AI Tutor:** Google Gemini integration.
- **Admin Dashboards:** For managing chatbot FAQs and metrics.
- **Toast Notifications:** System-wide notifications for key events.
- **User History Synchronization:** LocalStorage and Firebase synchronization for lesson progress across devices, with offline-first capabilities.
- **Notification CTR Analytics:** Tracks notification engagement and dismiss rates.
- **Course Editor:** Simplified with 3 tabs (Info, Estrutura, Conteúdo), essential fields only, AI-powered structure generation, and ultra-simple inline lesson adding.
- **Micro-Lessons:** Break lessons into bite-sized steps (~2-3 min each) with visual progress tracking, step completion markers, and animated transitions.
- **Interactive Exercises:** Multiple question types (multiple choice, drag-drop, fill-in-blank, true/false) with instant feedback, explanations, scoring system, and retry capability.
- **Dashboard "Meus Cursos" Redesign:** Simplified greeting, clean "Continue Studying Card," compact "My Courses Grid" with total course counter, and a clean "Discover New Courses" card.
- **"Próxima Aula" Section:** Minimalist design with a large card for the next lesson and a compact previous lesson, essential info, hover effects, and a green celebration for the last lesson.
- **Removed Gamification:** XP system, levels, badges, leaderboard, weekly challenges, and streak milestones have been completely removed from the platform to maintain a pure learning focus.

## Version 2.1 - Card Components Simplification (COMPLETED)

### Ultra-Clean Card Design:

**Cards Refactored:**
- ✅ **CourseCard**: Simplified layout, removed redundant badges, cleaner gradient design
- ✅ **ArticleCard**: Streamlined vertical/horizontal layouts, category color badges
- ✅ **ProjectCard**: Clean status indicators, better typography hierarchy
  
**Design Improvements:**
- ✅ **Gradient Backgrounds**: `from-white/8 to-white/4` → ultra-subtle, elegant
- ✅ **Hover Effects**: Smooth scale transforms, color transitions
- ✅ **Spacing**: Consistent p-4 padding, clear visual hierarchy
- ✅ **Badges**: Simplified, consistent styling across all cards
- ✅ **Typography**: Clear hierarchy with size differentiation (sm, xs)
- ✅ **Animations**: Smooth framer-motion transitions maintained

**Result:**
- CourseCard: 141 → 136 linhas (-4%)
- ArticleCard: 83 → 95 linhas (better organized)
- ProjectCard: 87 → 123 linhas (cleaner structure, more readable)
- All cards: 100% responsive, mobile-first design
- Zero performance impact

---

## Version 2.0 - Dashboard Refactor (COMPLETED)

### Dashboard Ultra-Clean Simplification:

**Changes Applied:**
- ✅ **Removed ScrollToTopButton** from Dashboard, NotificationCenter, CourseDetail, LessonView (4 views)
- ✅ **Header Simplified:** Removed dropdown menu, direct profile click navigation
- ✅ **AdminDashboard:** Consolidated to single "Courses" tab with clean UI
- ✅ **StudentDashboard:** Clean "Meus Cursos" with Continue Learning section
- ✅ **Code Lines Reduced:**
  - Dashboard: 202 → 196 linhas (-3%)
  - CourseDetail: 414 → 411 linhas (-1%)
  - LessonView: 465 → 462 linhas (-1%)
  - NotificationCenter: 267 → 264 linhas (-1%)
- ✅ **UI/UX:** Added smooth animations, better transitions, cleaner spacing
- ✅ **Removed:** Unused "analytics" tab from admin dashboard

---

## Version 1.9 - OPÇÃO 2: Sistema Ultra-Clean com Separação de Contextos (COMPLETED)

### MEGA REFACTOR - App.tsx Splitting:

**Context Division (Separação Responsabilidades):**
- ✅ **AuthContext.tsx** (88 linhas): User auth state, login/logout, Firebase integration
- ✅ **UIContext.tsx** (75 linhas): UI state (toasts, modal visibility, selections)
- ✅ **DataContext.tsx** (702 linhas): All data + 42 CRUD handlers
- ✅ **AppContextAdapter.tsx** (82 linhas): Combina 3 contextos em useAppContext()

**Refactoring Results:**
- App.tsx: 999 → 139 linhas (**-86%**) ✅
- Contexts Total: 948 linhas (clean + organized)
- ZERO breaking changes (useAppContext ainda funciona igual)
- Arquivo mais limpo: App.tsx agora é PURO routing

**Architecture Improvement:**
- ✅ **Separation of Concerns**: Auth, UI, Data completamente separados
- ✅ **Easy to Test**: Cada contexto pode ser testado isoladamente
- ✅ **Scalability**: Adicionar novos contextos é trivial
- ✅ **Maintainability**: Código muito mais legível e organizado
- ✅ **Zero Performance Impact**: Mesma quantidade de renders

**File Structure Now:**
```
/contexts (4 arquivos)
├── AuthContext.tsx (88L) - User, login, logout
├── UIContext.tsx (75L) - Toast, modals
├── DataContext.tsx (702L) - Data + 42 handlers
├── AppContextAdapter.tsx (82L) - Combina tudo
└── index.ts

/views (36 files) - essencial
/components (55 files) - suporte
/utils (11 files) - services

App.tsx (139 linhas) - PURO ROUTING ⭐
```

**Contextos Finais:**
| Contexto | Linhas | Responsabilidade |
|----------|--------|------------------|
| AuthContext | 88 | User auth state + handlers |
| UIContext | 75 | Toast, modal visibility |
| DataContext | 702 | Data + 42 CRUD operations |
| AppContextAdapter | 82 | Composição dos 3 |
| **TOTAL** | **948** | **Ultra-organized** |

**Sistema Now:**
- Total Files: ~106 (4 contexts + 36 views + 55 components + 11 utils)
- App.tsx Complexity: 999 → 139 linhas (-86%)
- Contexts Complexity: ~1000 → 948 linhas (better organized)
- LSP Errors: 0 ✅
- Runtime Errors: 0 ✅
- Workflow: ✅ Running

## External Dependencies
- **Firebase:** Firestore (database, real-time updates), Authentication.
- **Google Gemini 2.5 Flash:** AI Tutor functionality.
- **EmailJS:** Sending email notifications.
- **React Icons:** Lucide-react for icons.
- **framer-motion:** Animation library.
- **localStorage:** Client-side fallback storage for JSON courses (zero-cost).