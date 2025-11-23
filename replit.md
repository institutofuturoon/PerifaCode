# FuturoOn - PerifaCode LMS Platform

## Overview
FuturoOn is an LMS platform designed for digital inclusion in underprivileged Brazilian communities. It provides technology courses with features such as course enrollment, progress tracking, AI-powered tutoring, community forums, and an engaging learning experience. The platform aims to prepare students for the tech job market and foster community growth, maintaining a clear separation between institutional content and the LMS system. The platform emphasizes a linear learning path, micro-learning, and visual motivation, with a pure learning focus devoid of traditional gamification elements.

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
- **Visual Feedback:** Visual indicators for achievements.
- **Navigation:** Floating chatbot widget, full-screen pre-lesson onboarding, sticky top navigation, interactive breadcrumbs, keyboard shortcuts.
- **Dashboards:** Professional Mentor Dashboard with status tabs and a Notification Center. Student dashboard is ultra-minimal, focusing on essential learning features.
- **Course Design:** Enhanced CourseCard and CourseDetail components with gradients, shadows, and hover effects.
- **Responsiveness:** Perfect mobile responsiveness across all components.
- **Animations:** Uses `framer-motion` for smooth transitions and animations.
- **Card Design System:** Consistent CourseCard, ModuleCard, LessonCard, and StatCard designs with clear typography and spacing.
- **Typography Hierarchy:** Defined hierarchy for titles, headers, body text, and metadata.

### Technical Implementations
- **State Management:** React's Context API (AuthContext, UIContext, DataContext) for global state.
- **Component Structure:** Modular approach with dedicated components.
- **API Integration:** Firebase (Firestore, Auth) and Google Gemini 2.5 Flash.
- **Chat Bot Logic:** NLP utilities for FAQ matching and sentiment detection, backed by a Firestore knowledge base.
- **Email Notifications:** EmailJS integration for templated mentor escalation notifications.
- **Routing:** `SiteLayout`, `SistemaLayout`, and authenticated routes protected by `PrivateRoute`.
- **Image Upload System:** Firebase integration with client/server-side validation, compression, retry logic, drag & drop, and WebP optimization.
- **Firebase Services:** Dedicated services (`trilhaService.ts`, `projetoService.ts`, `progressoService.ts`) for CRUD operations with a cache-first approach.
- **Data Management:** React Hooks (`useTrilhas()`, `useProgresso()`) and `firebaseCache.ts` with TTL-based caching.
- **Lesson History:** `localStorage` and Firebase-synced tracking of the last viewed lesson for cross-device continuity.
- **Smart Notification System:** Firestore-based, real-time notification system with intelligent triggers and user-configurable preferences.
- **Notification Analytics:** CTR tracking system (`notificationAnalytics.ts`) with impression, click, and dismiss tracking.

### Feature Specifications
- **Course Progress Tracking:** Visual progress bars, trails, and checklists.
- **Enrollment System:** User enrollment with confirmation modals.
- **AI Tutor:** Google Gemini integration.
- **Admin Dashboards:** For managing chatbot FAQs and metrics.
- **Toast Notifications:** System-wide notifications for key events.
- **User History Synchronization:** LocalStorage and Firebase synchronization for lesson progress across devices, with offline-first capabilities.
- **Course Editor:** Simplified with 3 tabs (Info, Estrutura, Conteúdo), essential fields, AI-powered structure generation, and ultra-simple inline lesson adding.
- **Micro-Lessons:** Lessons broken into bite-sized steps (~2-3 min each) with visual progress tracking and interactive exercises.
- **Interactive Exercises:** Multiple question types (multiple choice, drag-drop, fill-in-blank, true/false) with instant feedback, explanations, scoring, and retry capability.
- **Dashboard "Meus Cursos" Redesign:** Simplified greeting, clean "Continue Studying Card," compact "My Courses Grid," and "Discover New Courses" card.
- **"Próxima Aula" Section:** Minimalist design with a large card for the next lesson and a compact previous lesson, essential info, hover effects, and a green celebration for the last lesson.
- **Learning Journey Visualization:** Hero section, continue learning, course modules preview, my courses grid, and discovery section.
- **Removed Gamification:** XP system, levels, badges, leaderboard, weekly challenges, and streak milestones have been completely removed to maintain a pure learning focus.

## Version 3.1 - Dashboard & Cards ULTRA-PREMIUM Refactor (COMPLETED)

### 🎨 Dashboard Enhancement:

**StudentDashboardPanels (386 lines - Premium Design):**
- ✅ **DashboardHeroSection:** Stunning first impression with animations
- ✅ **ContinueLearningSection:** Animated progress, motivational messages, enhanced CTAs
- ✅ **ExploreCoursesSection:** Beautiful search/filter with smooth animations
- ✅ **MyCoursesSection:** Improved grid with staggered animations
- ✅ **EmptyCoursesState:** Premium design with floating animation, stats preview, strong CTAs

**Visual Improvements:**
- Gradient overlays on images (from-black/70 via-black/20 to-transparent)
- Animated status badges with scale transforms
- Shadow effects on badges (shadow-lg)
- Smooth staggered animations for course grids
- Better typography hierarchy and spacing
- Enhanced mobile responsiveness

### 📊 CourseCard ULTRA-PREMIUM Design (158 lines):

**New Features:**
- Image hover scale to 110% (more dramatic)
- Animated progress bars with motion & shadows
- Status badges with animations (scale + fade in)
- Skill level indicator displayed on cards
- Better color-coded progress (green when 100%, purple→pink in progress)
- Improved footer layout with better spacing
- Smooth motion transitions throughout

**Badge Styling:**
```
ENROLLED: Green-500 → Emerald-600 with green shadow
IN PROGRESS: Purple-8a4add → Pink-f27983 with purple shadow
COMPLETED: Green-500 with glow effect (shadow-green-500/50)
DURATION: Purple background with border on right
```

**Design Details:**
```
CARD STRUCTURE:
├── Image Section
│   ├── Image (110% hover scale, 500ms transition)
│   ├── Gradient overlay (black/70 → transparent)
│   ├── Status Badge (animated entrance)
│   ├── Duration Badge (with icon)
│   └── Progress Bar (h-2.5, animated width)
└── Content Section
    ├── Track Badge (gradient bg from-8a4add/30 to-f27983/20)
    ├── Title (text-sm, line-clamp-2, hover color change)
    ├── Description (text-xs, line-clamp-2)
    ├── Skill Level (display + color)
    └── Footer (progress or explore CTA)
```

### Dashboard Layout Structure (Top to Bottom):
1. Personalized Greeting (text-3xl → 4xl, font-black)
2. Continue Learning (if enrolled) OR Empty State (premium)
3. My Courses Grid (staggered animations)

### Empty State Premium Design:
- Floating animation on 🚀 icon
- Stats grid: "10+ Cursos", "100h+ Aprendizado", "100% Grátis"
- Strong gradient CTA button
- Secondary CTA link
- Encouraging copy

---

## Version 3.0 - Instructional Design Expert Consultation (COMPLETED)

### 🎓 Design Instrucional Consolidado

**Philosophy (Mimo + Rocketseat + Udemy Best Practices):**
- **Linear Learning Path**: Sequential modules & lessons, clear progression
- **Micro-Learning**: ~2-3 min lessons, bite-sized content chunks
- **Visual Motivation**: Progress bars, motivational messages, achievement indicators
- **Learning Journey**: Course structure visible before starting, next action always clear
- **No Gamification**: Pure learning focus (XP, badges, streaks removed)

### Course Structure Blueprint:
```
COURSE HIERARCHY:
├── Course Info (Title, Description, Duration, Skill Level)
├── Module 1: Foundation (e.g., "Conceitos Básicos")
│   ├── Lesson 1.1: Intro (5 min) → Video + Exercise
│   ├── Lesson 1.2: Core Concept (8 min) → Video + Quiz
│   └── Lesson 1.3: Practice (10 min) → Interactive Exercise
├── Module 2: Intermediate (e.g., "Aplicações Práticas")
│   └── ... (3-5 lessons per module)
└── Module 3: Advanced (e.g., "Projetos Reais")
    └── ... (2-4 lessons per module)

LESSON STRUCTURE (Ideal):
- Objective (what student will learn) - 1-2 sentences
- Main Content (video or text) - 2-8 min
- Interactive Exercise (multiple choice, drag-drop, coding challenge)
- Summary (recap key points) - 1 min read
- Complementary Material (extra reading/resources - optional)
```

---

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
- ✅ **Removido ScrollToTopButton** de 4 views (Dashboard, NotificationCenter, CourseDetail, LessonView)
- ✅ **Header Ultra-Clean:** Removido menu dropdown, só clique no avatar → perfil direto
- ✅ **Admin Dashboard:** Consolidado para single "Cursos" tab (mais limpo)
- ✅ **Student Dashboard:** Foco 100% em "Meus Cursos" + Continue Learning
- ✅ **Animações Suaves:** `framer-motion` para transições elegantes

---

## External Dependencies
- **Firebase:** Firestore (database, real-time updates), Authentication.
- **Google Gemini 2.5 Flash:** AI Tutor functionality.
- **EmailJS:** Sending email notifications.
- **React Icons:** Lucide-react for icons.
- **framer-motion:** Animation library.
- **localStorage:** Client-side fallback storage for JSON courses.
