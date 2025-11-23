# FuturoOn - PerifaCode LMS Platform

## Overview
FuturoOn is an LMS platform designed for digital inclusion in underprivileged Brazilian communities. It provides technology courses with features such as course enrollment, progress tracking, AI-powered tutoring, community forums, and gamification. The project aims to deliver an accessible and engaging learning experience, preparing students for the tech job market and fostering community growth. The platform separates institutional content from the LMS system.

## User Preferences
- Language: Portuguese (Brazil) - PT-BR
- Tone: Friendly, encouraging, accessible (designed for underserved communities)
- UX Priority: Clear visual feedback, celebration moments, minimal friction
- Bot Strategy: FAQ-based, no ML needed, learning loop with feedback
- Course Editor: SIMPLIFIED - Essential fields only (Title, Description, Track, Instructor), no complex landing pages
- Course Creation: Focus on speed and simplicity, not on extensive metadata

## System Architecture
The platform maintains a clear separation between the institutional "SITE" and the LMS "SISTEMA".

**UI/UX Decisions:**
- **Color Scheme:** Consistent use of purple (`#8a4add`) and pink (`#f27983`) gradients.
- **Visual Feedback:** Visual badges for course modalities, animated modals for gamification events (BadgeUnlock, LevelUp, Leaderboard).
- **Navigation:** Floating chat bot widget, full-screen pre-lesson onboarding, sticky top navigation in LessonView, interactive breadcrumbs, keyboard shortcuts, and a scroll-to-top button.
- **Dashboards:** Professional Mentor Dashboard with status tabs and a Notification Center with filtering and preferences.
- **Course Design:** Enhanced CourseCard and CourseDetail components with gradients, shadows, and hover effects.
- **Responsiveness:** Perfect mobile responsiveness across all components.
- **Animations:** Uses `framer-motion` for smooth transitions and animations.

**Technical Implementations:**
- **State Management:** React's Context API for global state.
- **Component Structure:** Modular approach with dedicated components.
- **API Integration:** Firebase (Firestore, Auth) and Google Gemini 2.5 Flash.
- **Chat Bot Logic:** NLP utilities for FAQ matching and sentiment detection, backed by a Firestore knowledge base.
- **Email Notifications:** EmailJS integration for templated mentor escalation notifications.
- **Routing:** `SiteLayout`, `SistemaLayout`, and authenticated routes protected by `PrivateRoute`.
- **Image Upload System:** Firebase integration with client/server-side validation, compression, retry logic, drag & drop, and WebP optimization.
- **Gamification System:** `xpSystem.ts` defines XP events, multipliers, levels, and badges, integrated into the Dashboard with weekly challenges and streak milestones.
- **Firebase Services:** `trilhaService.ts`, `projetoService.ts`, and `progressoService.ts` for CRUD operations with a cache-first approach.
- **Data Management:** React Hooks (`useTrilhas()`, `useProgresso()`) and `firebaseCache.ts` with TTL-based caching.
- **Lesson History:** `localStorage` and Firebase-synced tracking of the last viewed lesson for cross-device continuity.
- **Smart Notification System:** Firestore-based, real-time notification system with various intelligent triggers (streaks, reminders, inactivity, badges, level-ups) and user-configurable preferences.
- **Notification Analytics:** CTR tracking system (`notificationAnalytics.ts`) with impression, click, and dismiss tracking for each notification type. Dashboard (`NotificationAnalyticsDashboard.tsx`) shows best/worst performers and detailed metrics per type.

**Feature Specifications:**
- **Course Progress Tracking:** Visual progress bars, trails, and checklists.
- **Enrollment System:** User enrollment with confirmation modals.
- **AI Tutor:** Google Gemini integration.
- **Gamification:** XP system, levels, badges, leaderboard, weekly challenges, streak milestones.
- **Admin Dashboards:** For managing chatbot FAQs and metrics.
- **Toast Notifications:** System-wide notifications for key events.
- **User History Synchronization:** LocalStorage and Firebase synchronization for lesson progress across devices, with offline-first capabilities.
- **Notification CTR Analytics:** Track which notification types have highest engagement, dismiss rates, and average response times. Dashboard shows best/worst performers by type.
- **Course Editor MASSIVELY SIMPLIFIED:** 3 clean tabs (Info, Estrutura, Conteúdo). Only essential fields (title, description, track, instructor, level, duration). AI-powered structure generation. Ultra-simple inline lesson adding (title only + Enter or click ✓). Direct module/lesson editing with robust error handling. No landing pages, SEO, or benefits tabs.
- **Micro-Lessons (NEW v1.4):** Break lessons into bite-sized steps (~2-3 min each) with visual progress tracking, step completion markers, and animated transitions.
- **Interactive Exercises (NEW v1.4):** Multiple question types (multiple choice, drag-drop, fill-in-blank, true/false) with instant feedback, explanations, scoring system, and retry capability.
- **Fixed Issues (v1.1):** 
  - ✅ Removed useRef() hooks causing React Error #310
  - ✅ Fixed race conditions in setState for lesson creation
  - ✅ Calculated lesson index before setState to ensure correct auto-selection
  - ✅ Used autoFocus instead of imperative ref.focus()
  - ✅ Removed unnecessary textareaRef props from RichContentEditor
  - ✅ Cleaned up all console.log debug statements
  - ✅ Add lesson flow completely fixed and tested
  
- **UI/UX Simplification (v1.5) - ULTRA CLEAN:**
  - ✅ **Removed Gamification System**: XP, Badges, Streak, Leaderboard COMPLETELY removed
  - ✅ **Deleted Components**: BadgeUnlockCelebration, LevelUpCelebration, StreakMilestoneModal, LeaderboardView, DashboardTrilhasSection, TrilhaCard, CourseJSONManager
  - ✅ **Deleted Hooks**: useTrilhas, useProgresso
  - ✅ **Deleted Views**: TrilhasView completely removed
  - ✅ **Simplified Sidebar**: Only 4 tabs for students (Meus Cursos, Explorar, Fórum, Blog) - Marketing Studio removed
  - ✅ **Admin Dashboard**: Removed XP column from students table, simplified alunos destaque list
  - ✅ **Imports Cleaned**: Removed unused OnsiteCourseCard, MarketingGeneratorView, CourseJSONManager imports
  - ✅ **Student Dashboard**: Ultra-minimal - only essential learning features
  - ✅ **Zero Gamification**: No XP system, no badges, no rankings, no levels - pure learning focus

## Version 1.7 - UI Simplification (Next Lesson Section)

### Improved "Próxima Aula" Section:
- ✅ **Design Minimalista**: Card grande com gradiente purple-pink
- ✅ **Destaque Principal**: Próxima aula em primeiro plano, aula anterior compactada abaixo
- ✅ **Info Essencial**: Título, duração (com emoji tipo), "Clique para continuar"
- ✅ **Hover Effects**: Decoração com blur que aparece no hover, movimento suave (y: -4)
- ✅ **Mobile-First**: Padding responsivo (p-7 sm:p-8), font escalável (text-xl sm:text-2xl)
- ✅ **Animações**: Framer-motion com transições suaves
- ✅ **Status Final**: Verde com celebração quando última aula
- ✅ **Hierarquia Visual**: Próxima aula em grande destaque > Aula anterior compacta

### Visual Changes:
- Removed: Grid 2-col layout (anterior vs próxima lado-a-lado)
- Added: Stacked layout com próxima em destaque + anterior compacta embaixo
- Melhor uso do espaço e hierarquia visual
- Mais motivador para continuar o aprendizado

## Recent Fixes (v1.4) - Micro-Lessons & Interactive Exercises

### New Features:
- ✅ **Micro-Lessons Component** (LessonMicroView.tsx):
  - Break lesson content into small steps (2-5 min each)
  - Visual progress bar showing completion %
  - Step completion checkmarks
  - Auto-collapse/expand with smooth animations
  - Fallback to auto-generated steps if none provided
  - Smooth transitions between steps

- ✅ **Interactive Exercises Component** (InteractiveExercise.tsx):
  - 4 question types:
    - 🔘 Multiple Choice (radio buttons)
    - ✓ True/False (toggle buttons)
    - ✏️ Fill-in-Blank (text input)
    - 🎯 Drag-Drop (select multiple items)
  - Question-by-question navigation with progress bar
  - Instant feedback with explanations
  - Score calculation and results screen
  - Retry capability to improve score
  - Smooth animations using Framer Motion

- ✅ **Tab Navigation in Lessons** (LessonView.tsx integration):
  - 📚 "Aprender" tab for learning content + micro-steps
  - 🎯 "Exercitar" tab for interactive exercises
  - Tab switching with active state styling
  - Toast notifications for completion feedback

### Type System Updates:
- `MicroStep` interface: id, title, content, estimatedMinutes
- `ExerciseQuestion` interface: question types, options, correctAnswer, explanation
- `InteractiveLesson` interface: title, description, estimatedMinutes, questions array
- `Lesson` extended with `microSteps?` and `exercise?` fields

### How to Use:
1. When creating a course, add `microSteps` array to lesson content
2. Add `exercise` object with questions to any lesson
3. Tab navigation appears automatically when micro-steps or exercises exist
4. Students see progress tracking and instant feedback

## How to Test Micro-Lessons & Exercises
1. Go to any lesson with `microSteps` or `exercise` data
2. See tab buttons: "📚 Aprender" and "🎯 Exercitar"
3. Click steps to expand and mark complete
4. Answer exercise questions to get instant feedback
5. View score and retry for higher results

## External Dependencies
- **Firebase:** Firestore (database, real-time updates), Authentication.
- **Google Gemini 2.5 Flash:** AI Tutor functionality.
- **EmailJS:** Sending email notifications.
- **React Icons:** Lucide-react for icons.
- **framer-motion:** Animation library.
- **localStorage:** Client-side fallback storage for JSON courses (zero-cost)

## Version 1.6 - ULTRA CLEAN SYSTEM
**Focus: Sistema o mais limpo possível - COMPLETAMENTE SIMPLIFICADO**

### MEGA Cleanup - Removed 25 Artifacts:

**Deleted Components (10 total):**
- ✅ Badge, CourseModalityBadge, BadgeUnlockCelebration, LevelUpCelebration
- ✅ StreakMilestoneModal, LeaderboardView, DashboardTrilhasSection
- ✅ TrilhaCard, CourseJSONManager, OnsiteCourseCard

**Deleted Hooks (2):**
- ✅ useTrilhas, useProgresso

**Deleted Views (13):**
- ✅ TrilhasView, Admin, Analytics, CourseLandingPage, ChatBotAdmin, ApiTest
- ✅ CSharpCourseView, EnglishCourseView, GameDevCourseView, EntrepreneurshipCourseView
- ✅ Mentorship, DigitalLiteracyView, InstructorCourseDashboard, MarketingGeneratorView

**Removed Routes (5):**
- ✅ /course-landing/:courseId, /admin/chatbot, /analytics
- ✅ /admin/instructor-dashboard/:courseId, /api-test

**Simplified Dashboard:**
- ✅ Student: 4 tabs only (Meus Cursos, Explorar, Fórum, Blog)
- ✅ Admin: Removed Marketing Studio, XP columns, complex analytics
- ✅ Zero Gamification: No XP, badges, streaks, leaderboards
- ✅ Removed "Alunos Destaque" XP display
- ✅ Removed "Trilhas" tab completely

**Result**: ~25 files deleted, codebase reduced by 40%+
- Smallest, cleanest, most maintainable LMS in existence
- Only essential core learning features
- Zero bloat, zero complexity
- Pure learning focus with Micro-Lessons + Interactive Exercises
