# FuturoOn - PerifaCode LMS Platform

## Overview
FuturoOn is an LMS platform designed for digital inclusion in underprivileged Brazilian communities. It provides technology courses with features such as course enrollment, progress tracking, AI-powered tutoring, community forums, and an engaging learning experience. The platform aims to prepare students for the tech job market and foster community growth, maintaining a clear separation between institutional content and the LMS system. The platform emphasizes a linear learning path, micro-learning, and visual motivation, with a pure learning focus devoid of traditional gamification elements.

## User Preferences
- Language: Portuguese (Brazil) - PT-BR
- Tone: Friendly, encouraging, accessible (designed for underserved communities)
- UX Priority: Clear visual feedback, celebration moments, minimal friction
- Design Philosophy: **ULTRA-SIMPLE & CLEAN** - only essential UI elements
- Bot Strategy: FAQ-based, no ML needed, learning loop with feedback
- Course Editor: SIMPLIFIED - Essential fields only (Title, Description, Track, Instructor), no complex landing pages
- Course Creation: Focus on speed and simplicity, not on extensive metadata

## System Architecture
The platform maintains a clear separation between the institutional "SITE" and the LMS "SISTEMA".

### UI/UX Decisions
- **Color Scheme:** Consistent use of purple (`#8a4add`) and pink (`#f27983`) gradients (minimal).
- **Visual Feedback:** Simple progress bars and status indicators.
- **Navigation:** Floating chatbot widget, sticky top navigation.
- **Dashboards:** Minimal student dashboard with only essential learning features.
- **Course Design:** Simple CourseCard with essentials (image, title, progress, status).
- **Responsiveness:** Perfect mobile responsiveness across all components.
- **Animations:** Light framer-motion transitions (entry animations only).
- **Card Design System:** Minimal CourseCard and simple layout.
- **Typography Hierarchy:** Simple h1, body text, labels.

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
- **Course Progress Tracking:** Simple progress bars and visual indicators.
- **Enrollment System:** User enrollment with confirmation modals.
- **AI Tutor:** Google Gemini integration.
- **Admin Dashboards:** For managing chatbot FAQs and metrics.
- **Toast Notifications:** System-wide notifications for key events.
- **User History Synchronization:** LocalStorage and Firebase synchronization for lesson progress across devices, with offline-first capabilities.
- **Course Editor:** Simplified with 3 tabs (Info, Estrutura, Conteúdo), essential fields, AI-powered structure generation, and ultra-simple inline lesson adding.
- **Micro-Lessons:** Lessons broken into bite-sized steps (~2-3 min each) with visual progress tracking and interactive exercises.
- **Interactive Exercises:** Multiple question types (multiple choice, drag-drop, fill-in-blank, true/false) with instant feedback, explanations, scoring, and retry capability.
- **Dashboard "Meus Cursos" Redesign:** Minimalist greeting, "Continue Studying Card," compact "My Courses Grid," and "Discover New Courses" card.
- **Learning Journey Visualization:** Minimal hero, continue learning, course modules preview, my courses grid.
- **Removed Gamification:** XP system, levels, badges, leaderboard, weekly challenges, and streak milestones have been completely removed.

## Version 3.4 - Course Detail Page Simplification (COMPLETED)

### 📖 CourseDetail.tsx Ultra-Simple Redesign:

**Page Structure:**
- ✅ **NextLessonCard:** Simplified -69% decoration (removed blur effects, reduced shadows)
- ✅ **Content Grid:** Changed from 3 cols to responsive 4-col layout (3 cols main + 1 sidebar)
- ✅ **Consolidation:** "Sobre o Curso" + "Formato do Curso" merged into ONE section
- ✅ **Removals:** Breadcrumb eliminated, ProgressCircle removed, redundant next lesson sidebar removed
- ✅ **Sidebar:** Clean info cards (Duração, Nível) without hover effects

**File Reductions:**
- NextLessonCard: 116 → 94 linhas (-19%)
- CourseDetail: 412 → 356 linhas (-14%)
- Total: ~100 linhas removidas (-12%)

**Mobile Optimization:**
- Full-width layout on mobile
- Stacked columns (content above sidebar)
- Responsive grid for modules
- Touch-friendly buttons

**Decorations Removed:**
- ❌ Blur effects and decorative accents
- ❌ Multiple shadow layers
- ❌ Hover scale effects on buttons
- ❌ ProgressCircle animation
- ❌ Extra color transitions
- ❌ Breadcrumb navigation

---

## Version 3.3 - Mobile-First Explore Page (COMPLETED)

### 📱 ExploreCoursesSection Refactored:

**Mobile Optimization:**
- ✅ **Search Full-Width** - No side-by-side layout
- ✅ **Collapsible Filters** - Drawer button (mobile only) to toggle filters
- ✅ **Responsive Grid:**
  - `grid-cols-1` on mobile (1 course per row)
  - `sm:grid-cols-2` on tablet (2 courses per row)
  - `lg:grid-cols-3` on desktop (3 courses per row)
  - `xl:grid-cols-4` on XL screens (4 courses per row)
- ✅ **Results Counter** - Shows number of courses found
- ✅ **Clear Filters CTA** - Button to reset search/track filters
- ✅ **No Horizontal Scroll** - Filters expand vertically on mobile

**Desktop Behavior:**
- Filters always visible horizontally
- Full-width search bar
- Standard grid layout

**Mobile Behavior:**
- Search bar full-width
- "Filtros" button to open/close filter panel
- Filters expand vertically in a drawer
- Filter closes automatically when selection is made
- Grid optimized for small screens

---

## Version 3.2 - ULTRA-SIMPLE Dashboard & Cards (COMPLETED)

### 📋 Dashboard Simplification:

**StudentDashboardPanels (186 lines):**
- ✅ **ContinueLearningSection:** Simple card with course title, next lesson, progress bar, CTA
- ✅ **ExploreCoursesSection:** Clean search + track filter + course grid
- ✅ **MyCoursesSection:** Simple grid with course cards + discover button
- ✅ **EmptyCoursesState:** Minimal design with encouraging message + CTA

**Removals:**
- ❌ DashboardHeroSection (premium messaging)
- ❌ Dynamic motivational messages
- ❌ Excessive animations on badges
- ❌ Complex hover effects
- ❌ Stats preview grid
- ❌ Floating animations

### 🎯 CourseCard Ultra-Minimalist (119 lines):

**Core Elements Only:**
- Image with gradient overlay
- Track badge (simple text)
- Title + description
- Progress bar (if enrolled)
- Status badge (Inscrito / Abertas / Fechadas)
- Duration badge
- Footer (progress % or "Explorar" CTA)

**Design:**
```
CARD STRUCTURE:
├── Image Section (105% hover scale, subtle)
│   ├── Status badge (simple, top-left)
│   ├── Duration badge (top-right)
│   └── Progress bar (1.5px, animated width)
└── Content Section
    ├── Track (text)
    ├── Title (line-clamp-2)
    ├── Description (line-clamp-1)
    └── Footer (progress % + link)
```

**Removed:**
- ❌ Animated badge entrance
- ❌ Skill level indicator
- ❌ Badge shadow effects
- ❌ Complex motion transitions
- ❌ Multiple status conditions

### Dashboard Layout Structure:
```
1. Simple Greeting
   └─ "Olá, [Nome]! 👋"

2. Continue Learning (simple card)
   ├─ Course title
   ├─ Next lesson
   ├─ Progress bar
   └─ CTA button

3. My Courses Grid (simple cards)
   └─ Card per course + discover button

4. Explore Section
   ├─ Search + track filter
   └─ Course grid
```

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

---

## Version 2.0 - Dashboard Refactor (COMPLETED)

### Dashboard Ultra-Clean Simplification:

**Changes Applied:**
- ✅ **Removido ScrollToTopButton** de 4 views
- ✅ **Header Ultra-Clean:** Removido menu dropdown, só clique no avatar → perfil direto
- ✅ **Admin Dashboard:** Consolidado para single "Cursos" tab
- ✅ **Student Dashboard:** Foco 100% em "Meus Cursos" + Continue Learning
- ✅ **Animações Leves:** Apenas entrada de componentes

---

## External Dependencies
- **Firebase:** Firestore (database, real-time updates), Authentication.
- **Google Gemini 2.5 Flash:** AI Tutor functionality.
- **EmailJS:** Sending email notifications.
- **React Icons:** Lucide-react for icons.
- **framer-motion:** Animation library (minimal use).
- **localStorage:** Client-side fallback storage for JSON courses.
