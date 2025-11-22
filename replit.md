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
- **Course Modalities:** Supports Online, Hybrid, and Presential courses with distinct visual badges.
- **Chat Bot:** Features a floating widget with a stylized interface, real-time message history, feedback system, and typing indicator.
- **Pre-Lesson Screen:** A full-screen onboarding component displays lesson duration, XP, position, module progress, and objectives.
- **Mentor Dashboard:** Professional dashboard with status tabs (Pending, In Progress, Resolved), real-time escalation lists, priority indicators, category icons, and response time tracking.
- **Notification System:** Real-time notifications via Firestore with a bell icon, unread badge counter, and visual distinction between read/unread messages.
- **Theming:** Utilizes a gradient (purple/magenta) for specific UI elements.
- **Gamification Visuals:** Features like BadgeUnlockCelebration modal (yellow/amber gradient, badge emoji spin animation), LevelUpCelebration modal (animated with confetti, new level emoji/name, XP progress bar), and Leaderboard (medals, user highlight, period filter).
- **Course Design:** Enhanced CourseDetail with gradients, shadows, hover effects, and improved visual hierarchy.

**Technical Implementations:**
- **State Management:** Uses React's Context API for global state management.
- **Component Structure:** Modular approach with `App.tsx` as context provider, and dedicated components for `LessonView.tsx`, `CourseDetail.tsx`, and `CourseCard.tsx`.
- **API Integration:** Leverages Firebase (Firestore for database, Auth for authentication) and Google Gemini 2.5 Flash for AI tutoring.
- **Chat Bot Logic:** Implemented with NLP utilities (`chatBotUtils.ts`) including Levenshtein distance, keyword extraction, FAQ matching, and sentiment detection, using a Firestore-based knowledge base.
- **Email Notifications:** Integrates EmailJS for sending templated email notifications, especially for mentor escalations.
- **Routing:** Clear separation of routes into `SiteLayout` (institutional pages), `SistemaLayout` (LMS features), and authentication routes, protected by `PrivateRoute`.
- **Image Upload System:** Robust system with Firebase integration, client/server-side validation, automatic JPEG compression, retry logic, drag & drop, progress bar, image preview, and metadata storage in Firestore. Supports multiple versions (thumbnail/small/medium) and WebP optimization.
- **Gamification System:** `xpSystem.ts` defines 18+ XP events, 5 dynamic multipliers, 6 levels, and 12+ automatic badges. Integrated into the Dashboard with visual displays for XP, Level, Streak, Badges, and progress bars.
- **Firebase Services:** `trilhaService.ts`, `projetoService.ts`, and `progressoService.ts` for CRUD operations with a cache-first approach.
- **React Hooks:** `useTrilhas()` for loading tracks/projects and `useProgresso()` for managing user XP/level/streak/badges.
- **Cache Utility:** `firebaseCache.ts` with TTL-based caching to reduce database reads.

**Feature Specifications:**
- **Course Progress Tracking:** Visual progress bars, progress trails, and a checklist of completed lessons.
- **Enrollment System:** User enrollment with confirmation modals.
- **AI Tutor:** Integration with Google Gemini for AI-powered tutoring.
- **Gamification:** Celebration modals for lesson/module/course completion, XP system, levels, badges, and a leaderboard.
- **Admin Dashboards:** `/admin/chatbot` for managing FAQs, bot metrics, and conversations.
- **Image Upload:** Comprehensive image upload functionality.
- **Toast Notifications:** System-wide toast notifications for events like XP gains and badge unlocks.

## External Dependencies
- **Firebase:** Firestore (database, real-time updates), Authentication.
- **Google Gemini 2.5 Flash:** For AI Tutor functionality.
- **EmailJS:** For sending email notifications (`@emailjs/browser`).
- **React Icons:** Lucide-react for modern icons.