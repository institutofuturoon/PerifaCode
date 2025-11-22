# FuturoOn - PerifaCode LMS Platform

## Overview
FuturoOn is an LMS platform designed for digital inclusion in underprivileged Brazilian communities. It provides technology courses with features such as course enrollment, progress tracking, AI-powered tutoring, community forums, and gamification. The project aims to deliver an accessible and engaging learning experience, preparing students for the tech job market and fostering community growth.

## User Preferences
- Language: Portuguese (Brazil) - PT-BR
- Tone: Friendly, encouraging, accessible (designed for underserved communities)
- UX Priority: Clear visual feedback, celebration moments, minimal friction
- Bot Strategy: FAQ-based, no ML needed, learning loop with feedback

## System Architecture
The platform maintains a clear separation between the institutional "SITE" and the LMS "SISTEMA".

**UI/UX Decisions:**
- **Color Scheme:** Consistent use of purple (`#8a4add`) and pink (`#f27983`) gradients.
- **Course Modalities:** Visual badges for Online, Hybrid, and Presential courses.
- **Chat Bot:** Floating widget with stylized interface, real-time message history, feedback, and typing indicator.
- **Pre-Lesson Screen:** Full-screen onboarding with lesson duration, XP, position, module progress, and objectives.
- **Mentor Dashboard:** Professional dashboard with status tabs, real-time escalation lists, priority indicators, category icons, and response time tracking.
- **Notification System:** Real-time notifications via Firestore with bell icon, unread badge, and read/unread distinction.
- **Gamification Visuals:** Animated modals for BadgeUnlockCelebration, LevelUpCelebration (confetti, XP progress), and Leaderboard (medals, user highlight, period filter).
- **Course Design:** Enhanced CourseCard and CourseDetail components with gradients, shadows, hover effects, and improved visual hierarchy.
- **LessonView:** Simplified layout, sticky top navigation with backdrop blur, inline progress bar, and perfect mobile responsiveness.
- **Page Transitions & Animations:** Utilizes `framer-motion` for smooth transitions and animations across CourseCard, CourseDetail, and LessonView.

**Technical Implementations:**
- **State Management:** React's Context API for global state.
- **Component Structure:** Modular approach with `App.tsx` as context provider and dedicated components.
- **API Integration:** Firebase (Firestore, Auth) and Google Gemini 2.5 Flash for AI tutoring.
- **Chat Bot Logic:** NLP utilities (`chatBotUtils.ts`) including Levenshtein distance, keyword extraction, FAQ matching, and sentiment detection, backed by a Firestore knowledge base.
- **Email Notifications:** EmailJS integration for templated notifications, particularly for mentor escalations.
- **Routing:** Clear separation into `SiteLayout`, `SistemaLayout`, and authenticated routes, protected by `PrivateRoute`.
- **Image Upload System:** Robust Firebase integration with client/server-side validation, automatic JPEG compression, retry logic, drag & drop, progress bar, image preview, and metadata storage. Supports multiple versions and WebP optimization.
- **Gamification System:** `xpSystem.ts` defines 18+ XP events, 5 dynamic multipliers, 6 levels, and 12+ automatic badges, integrated into the Dashboard. Includes Weekly Challenges and Streak Milestones with celebratory modals.
- **Firebase Services:** `trilhaService.ts`, `projetoService.ts`, and `progressoService.ts` for CRUD operations with a cache-first approach.
- **React Hooks:** `useTrilhas()` and `useProgresso()` for data management.
- **Cache Utility:** `firebaseCache.ts` with TTL-based caching.
- **Keyboard Shortcuts:** Implemented for navigation (ESC, arrow keys) and lesson completion (Enter).
- **Breadcrumb Navigation:** Interactive breadcrumbs for improved navigation within courses.
- **Automated Modals:** Auto-return logic for completing lessons/courses.
- **Lesson History:** LocalStorage-based tracking of the last viewed lesson.
- **Score System:** Detailed XP calculation and celebratory modals for lesson and course completion.

**Feature Specifications:**
- **Course Progress Tracking:** Visual progress bars, trails, and checklists.
- **Enrollment System:** User enrollment with confirmation modals.
- **AI Tutor:** Google Gemini integration.
- **Gamification:** XP system, levels, badges, leaderboard, weekly challenges, streak milestones.
- **Admin Dashboards:** For managing chatbot FAQs and metrics.
- **Toast Notifications:** System-wide notifications for key events.

## External Dependencies
- **Firebase:** Firestore (database, real-time updates), Authentication.
- **Google Gemini 2.5 Flash:** AI Tutor functionality.
- **EmailJS:** Sending email notifications.
- **React Icons:** Lucide-react for icons.
- **framer-motion:** Animation library.