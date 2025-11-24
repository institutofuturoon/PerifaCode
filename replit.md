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

---

## Version 3.7 - Button Improvements & Enhanced UX (COMPLETED)

### 🎨 Botões Redesenhados:

**1. Dashboard - Continue Learning:**
- ✅ Botão com ícone de seta (→)
- ✅ Animations: whileHover (scale 1.02), whileTap (scale 0.98)
- ✅ Shadow hover: hover:shadow-lg shadow-[#8a4add]/40
- ✅ Font: bold, centered content
- ✅ Responsive: full-width mobile

**2. Pre-Lesson Screen:**
- ✅ "Voltar": bg-gray-700/50 com border, hover effects
- ✅ "Iniciar Aula": Gradient + play icon + animations
- ✅ Ambos com scale animations (1.02/0.98)
- ✅ Shadow effects em hover
- ✅ Gap de ícone + texto

**3. Course Detail (Mobile + Desktop):**
- ✅ Desktop header: Botão compacto "Continuar" com ChevronRight
- ✅ Mobile hero: Full-width py-4 px-6, ícone play
- ✅ Contextos: "Começar Agora" / "Continuar Aprendendo" / "Revisar Curso"
- ✅ Dinamicamente atualizado com progresso

**4. Next Lesson Card:**
- ✅ Botão grande: py-4 px-6
- ✅ Ícone Play aumentado (size-18)
- ✅ Shadow animations: shadow-lg shadow-[#8a4add]/30 → hover shadow-[#8a4add]/40
- ✅ Scale animations suaves

**5. Design System de Botões:**
```
• Primário (CTA): gradient from-[#8a4add] to-[#f27983]
• Secundário: bg-gray-700/50 com border
• Ícones: play, arrow, chevron
• Animations: scale 1.02 hover / 0.98 tap
• Shadows: shadow-lg shadow-[#8a4add]/30-50
• Padding: py-3-4 px-4-6, rounded-lg
• Font: font-bold, text-white, gap-2 com ícone
```

**Components Updated:**
- `StudentDashboardPanels.tsx`: Botão "Continuar Aula" com arrow icon
- `PreLessonScreen.tsx`: Pair de botões "Voltar" + "Iniciar Aula"
- `CourseDetail.tsx`: Header e mobile CTA buttons
- `NextLessonCard.tsx`: Card background Rocketseat + big button

---

## Version 3.6 - Complete System Rocketseat Audit & Optimization (COMPLETED)

### 🎯 Sistema Auditado e Otimizado:

**1. Dashboard do Aluno (StudentDashboard):**
- ✅ ContinueLearningSection: Cards limpos, progress bar animada
- ✅ ExploreCoursesSection: Filtros em drawer mobile, grid responsivo (1→4 cols)
- ✅ MyCoursesSection: Cards simplificados, minimalista
- ✅ Sem elementos redundantes, foco no conteúdo

**2. Cards de Curso (CourseCard):**
- ✅ Imagem, título, tecnologias (primeiras 3), nível, duração
- ✅ Progress bar animada (se inscrito)
- ✅ Status badges clean (Inscrito/Abertas/Fechadas)
- ✅ Botão único de ação
- ✅ Responsivo mobile-first

**3. Página de Aulas (LessonView + PreLessonScreen):**
- ✅ Header simples: Home + Progress + Lesson#
- ✅ PreLessonScreen: Objetivo + 2 cards (Duração, Pontos)
- ✅ Sem breadcrumb redundante
- ✅ Centered content, max-w-4xl
- ✅ Rocketseat design: bordas clean, espaçamento generoso

**4. Exercícios Interativos (InteractiveExercise):**
- ✅ Completion screen: Background clean (#1a1a2e), border gray-700/50
- ✅ Removido gradient excessivo
- ✅ Tipografia simples, sem emojis pesados
- ✅ Icons apenas (CheckCircle2, Lightbulb)
- ✅ Feedback visual claro: % grande, mensagem simples

**5. Exploração de Cursos (Courses.tsx):**
- ✅ Busca full-width
- ✅ Filtros sticky, responsivos
- ✅ Grid: 1 col mobile → 4 cols XL
- ✅ Sem scroll horizontal
- ✅ Results counter

**6. Design System Rocketseat:**
- ✅ Cards: border gray-700/50, bg-[#1a1a2e], rounded-lg
- ✅ Tipografia: clara e hierarquizada
- ✅ Espaçamento: py-3 to py-6, px-4 to px-8
- ✅ Animações: motion.div com delays suaves
- ✅ Sem gradients complexos
- ✅ Cores estratégicas: #8a4add (purple) + #f27983 (pink)

**7. Mobile Responsividade:**
- ✅ Layout empilhado (mobile)
- ✅ Botões grandes e acessíveis
- ✅ Sem horizontal scroll
- ✅ Hamburger menu sidebar
- ✅ Filtros em drawer (mobile), visível (desktop)

---

## Version 3.5 - Lesson Player Rocketseat Design (COMPLETED)

### 🎨 PreLessonScreen & LessonView Redesign:

**PreLessonScreen Ultra-Clean Refactor:**
- Removed unnecessary decorations and complex gradients
- Simplified to: Title + Objective + 2 Info Cards (Duration, XP) + 2 CTA Buttons
- Centered layout with max-width constraint (max-w-xl)
- Rocketseat-inspired borders (gray-700/50)

**LessonView Header Cleanup:**
- Removed module timeline and breadcrumb
- Simplified to: Back Button + Progress Bar + Lesson Number
- Sticky header with clean borders
- Mobile-optimized navigation

**Total Optimizations:**
- Lines removed: ~159 (-22%)
- Full functionality preserved
- Dramatic clarity improvement

---
