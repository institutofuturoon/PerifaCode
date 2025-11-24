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
- **Navigation:** Floating chatbot widget, sticky top navigation, simplified header.
- **Dashboards:** Minimal student dashboard focusing on learning features.
- **Course Design:** Simple CourseCard with essential information.
- **Responsiveness:** Perfect mobile responsiveness across all components.
- **Animations:** Light framer-motion transitions (entry animations only).
- **Design System:** Rocketseat-inspired with clean borders, hierarchical typography, calculated spacing, and strategic color use.

### Technical Implementations
- **State Management:** React's Context API (AuthContext, UIContext, DataContext) for global state.
- **API Integration:** Firebase (Firestore, Auth) and Google Gemini 2.5 Flash.
- **Chat Bot Logic:** NLP utilities for FAQ matching and sentiment detection, backed by a Firestore knowledge base.
- **Email Notifications:** EmailJS integration for templated mentor escalation notifications.
- **Routing:** `SiteLayout`, `SistemaLayout`, and authenticated routes protected by `PrivateRoute`.
- **Image Upload System:** Firebase integration with client/server-side validation, compression, retry logic, drag & drop, and WebP optimization.
- **Firebase Services:** Dedicated services for CRUD operations with a cache-first approach.
- **Data Management:** React Hooks and `firebaseCache.ts` with TTL-based caching.
- **Lesson History:** `localStorage` and Firebase-synced tracking of the last viewed lesson for cross-device continuity.
- **Smart Notification System:** Firestore-based, real-time notification system with intelligent triggers and user-configurable preferences, including CTR tracking.

### Feature Specifications
- **Course Progress Tracking:** Simple progress bars and visual indicators.
- **Enrollment System:** User enrollment with confirmation modals.
- **AI Tutor:** Google Gemini integration.
- **Admin Dashboards:** For managing chatbot FAQs and metrics.
- **Toast Notifications:** System-wide notifications for key events.
- **User History Synchronization:** LocalStorage and Firebase synchronization for lesson progress across devices, with offline-first capabilities.
- **Course Editor:** Simplified with 3 tabs (Info, Estrutura, Conteúdo), essential fields, AI-powered structure generation, and ultra-simple inline lesson adding.
- **Micro-Lessons:** Lessons broken into bite-sized steps (~2-3 min each) with visual progress tracking and interactive exercises.
- **Interactive Exercises:** Multiple question types with instant feedback, explanations, scoring, and retry capability.
- **Dashboard "Meus Cursos" Redesign:** Minimalist greeting, "Continue Studying Card," compact "My Courses Grid," and "Discover New Courses" card.
- **Learning Journey Visualization:** Minimal hero, continue learning, course modules preview, my courses grid.
- **Instructional Design:** Linear learning path, micro-learning (~2-3 min lessons), visual motivation, and clear learning journey without traditional gamification elements (XP, badges, streaks removed).

## External Dependencies
- **Firebase:** Firestore (database, real-time updates), Authentication.
- **Google Gemini 2.5 Flash:** AI Tutor functionality.
- **EmailJS:** Sending email notifications.
- **React Icons:** Lucide-react for icons.
- **framer-motion:** Animation library (minimal use).
- **localStorage:** Client-side fallback storage for JSON courses.