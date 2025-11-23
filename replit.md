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
- **Fixed Issues (v1.1):** 
  - ✅ Removed useRef() hooks causing React Error #310
  - ✅ Fixed race conditions in setState for lesson creation
  - ✅ Calculated lesson index before setState to ensure correct auto-selection
  - ✅ Used autoFocus instead of imperative ref.focus()
  - ✅ Removed unnecessary textareaRef props from RichContentEditor
  - ✅ Cleaned up all console.log debug statements
  - Add lesson flow completely fixed and tested.

## Recent Fixes (v1.3) - Notifications, JSON Fallback & useRef Cleanup

### Critical Fixes:
- ✅ **Removed useRef() hooks in RichContentEditor** - Moved ref to local component scope to prevent "Cannot read properties of undefined (reading 'current')" errors
- ✅ **Firebase Query Index Error** - Simplified notification query from 4 fields to 2 fields (userId + isRead), moved dismissedAt filter to client-side to avoid composite index requirement
- ✅ **Firebase Error Handling with JSON Fallback** - When Firebase fails, courses automatically save to localStorage as JSON
- ✅ **CourseJSONManager Component** - New interface in Admin Dashboard for:
  - 📥 Download all courses as JSON backup
  - 📤 Upload/restore courses from JSON file
  - 💾 View and manage offline-saved courses
- ✅ **Automatic Offline Mode** - When Firebase unavailable, shows yellow notification and saves to localStorage

## How to Test JSON Fallback Feature
1. Go to `/admin` → "Gestão de Cursos"
2. Scroll down to "⚙️ Backup & Recuperação de Cursos (JSON)"
3. **Test Options:**
   - 📥 Download Firebase courses as JSON
   - 📤 Upload previous JSON backup
   - 💾 See courses saved in offline mode (if Firebase failed)
4. When offline, saving shows: "⚠️ Salvando localmente como fallback..." then "✅ Curso salvo localmente (modo offline)"

## External Dependencies
- **Firebase:** Firestore (database, real-time updates), Authentication.
- **Google Gemini 2.5 Flash:** AI Tutor functionality.
- **EmailJS:** Sending email notifications.
- **React Icons:** Lucide-react for icons.
- **framer-motion:** Animation library.
- **localStorage:** Client-side fallback storage for JSON courses (zero-cost)