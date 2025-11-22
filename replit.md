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

## External Dependencies
- **Firebase:** Firestore (database, real-time updates), Authentication.
- **Google Gemini 2.5 Flash:** For AI Tutor functionality.
- **EmailJS:** For sending email notifications (`@emailjs/browser`).
- **npm packages:** `@emailjs/browser`.