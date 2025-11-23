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
- **Dashboard "Meus Cursos" Redesign:** Simplified greeting, "Continue Studying Card," compact "My Courses Grid," and "Discover New Courses" card.
- **"Próxima Aula" Section:** Minimalist design with a large card for the next lesson.
- **Learning Journey Visualization:** Hero section, continue learning, course modules preview, my courses grid, and discovery section.
- **Removed Gamification:** XP system, levels, badges, leaderboard, weekly challenges, and streak milestones have been completely removed.

## External Dependencies
- **Firebase:** Firestore (database, real-time updates), Authentication.
- **Google Gemini 2.5 Flash:** AI Tutor functionality.
- **EmailJS:** Sending email notifications.
- **React Icons:** Lucide-react for icons.
- **framer-motion:** Animation library.
- **localStorage:** Client-side fallback storage for JSON courses.