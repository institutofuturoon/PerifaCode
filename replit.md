# FuturoOn - PerifaCode LMS Platform

## Project Overview
FuturoOn é uma plataforma de Learning Management System (LMS) focada em inclusão digital para comunidades carentes no Brasil. A plataforma oferece cursos de tecnologia com recursos avançados incluindo inscrição em cursos, rastreamento de progresso, tutoria com IA, fóruns comunitários, e gamificação.

**Status**: MVP em produção com melhorias de UX em implementação

## Recent Session Summary (Nov 22, 2025 - Final Update)

### Completed - Course Modality System (Online/Hybrid/Presencial) 🎓

#### 3 Types of Courses Fully Supported:

**ONLINE (100% Plataforma)**
- ✅ AI Tutor crucial (24/7 disponível)
- ✅ Community forum importante
- ✅ Flexible schedule (estude quando quiser)
- ✅ Digital certificate
- ✅ Pre-requisites support
- Visual: 🌐 Badge com informações claras

**HÍBRIDO (Plataforma + Presencial)**
- ✅ Proporção online/presencial configurável (ex: 60/40)
- ✅ Sync schedule (aulas síncronas com horários)
- ✅ Presencial dates (encontros definidos)
- ✅ Local facilitator support
- ✅ Zoom integration ready
- ✅ Hybrid certificate
- Visual: 🔄 Badge com progress bar

**PRESENCIAL (Plataforma como Apoio)**
- ✅ Short-form videos (não lições completas)
- ✅ Downloadable resources
- ✅ Sync lives (aulas ao vivo)
- ✅ Physical location tracking
- ✅ Lower community weight
- ✅ Presential certificate
- Visual: 🏢 Badge com local

#### Implementation Complete
- ✅ CourseModality interface with all 3 types
- ✅ CourseModalityBadge component (reusable)
- ✅ CourseDetail integration with modality display
- ✅ Visual indicators for each format
- ✅ Admin-ready data structure
- ✅ Zero-cost (no external APIs)

## Recent Session Summary (Nov 22, 2025 - Chat Bot)

### Completed - Chat Bot Zero-Cost Implementation 🤖

#### Chat Widget Features
- ✅ Componente flutuante ChatBot.tsx integrado em LessonView
- ✅ Interface estilizada com gradient (roxo/magenta)
- ✅ Histórico de mensagens em tempo real (Firestore)
- ✅ Sistema de feedback (👍 Ajudou / 👎 Não ajudou)
- ✅ Indicador de digitação com animação
- ✅ Responsivo e acessível

#### Chat Bot Admin Dashboard
- ✅ Views: Métricas | FAQ Base | Conversas
- ✅ Adicionar/editar/deletar FAQs com palavras-chave
- ✅ Dashboard de métricas em tempo real:
  - Total de mensagens processadas
  - Taxa de resolução automática
  - Escaladas para mentor
  - FAQs mais usadas (ranking)
- ✅ Rota protegida: /admin/chatbot (admin only)

#### Backend Infrastructure
- ✅ Cloud Function template (processChatMessage.ts)
- ✅ Estrutura Firestore: chatMessages, faqBase, chatFeedback, botMetrics
- ✅ NLP utilities (chatBotUtils.ts):
  - Levenshtein distance para similaridade
  - Keyword extraction
  - FAQ matching com scoring
  - Sentiment detection
- ✅ Auto-initialization de FAQs (8 examples de exemplo)

#### FAQ Base de Conhecimento
- ✅ 8 FAQs de exemplo em 3 categorias:
  - **Técnico** (Python, JavaScript debugging, comparações)
  - **Administrativo** (prazos, modalidades)
  - **Motivacional** (encorajamento, autoconfiança)
- ✅ Keywords, links de vídeos e materiais
- ✅ Effectiveness scoring e usage tracking

#### Tipos TypeScript Adicionados
- ✅ FAQ interface (courseId, keywords, effectiveness, usageCount)
- ✅ ChatMessage com botResponse metadata
- ✅ ChatFeedback para avaliar qualidade
- ✅ BotMetrics para analytics

#### Integração Completa
- ✅ Inicialização automática de FAQs no App.tsx
- ✅ ChatBot renderizado em todas as aulas
- ✅ Admin dashboard acessível via /admin/chatbot
- ✅ Zero-cost: apenas Firestore (free tier)

#### Previous Completions (Nov 22 Earlier)
- ✅ Badge "Inscrito" nos CartõesEnrollmentConfirmation modals
- ✅ Barra de progresso visual em cursos
- ✅ Trilha de progresso no CourseDetail
- ✅ Breadcrumb na LessonView
- ✅ Checklist completa de aulas na sidebar
- ✅ Sistema de inscrição em cursos (handleEnrollUser)
- ✅ Modais de celebração (LessonComplete, ModuleMilestone, CourseComplete)
- ✅ AI Tutor com Google Gemini
- ✅ Indicador de digitação com animação

## Architecture & Key Decisions

### State Management
- **Pattern**: Context API (não Redux/Zustand)
- **Location**: App.tsx com AppContext
- **Key States**: 
  - `user.enrolledCourseIds[]` - cursos inscritos
  - `user.completedLessonIds[]` - aulas completadas
  - `user.xp` - pontos de experiência

### Component Structure
```
App.tsx (Context Provider)
├── LessonView.tsx (Main learning interface)
│   ├── AITutor (FloatingChat)
│   ├── LessonTabs (content/notes/forum/exercise)
│   └── Modals (completion celebrations)
├── CourseDetail.tsx (Course overview)
│   └── ModuleAccordion + LessonItem list
└── CourseCard.tsx (Grid cards with progress)
```

### API Integration
- **Backend**: Firebase (Firestore + Auth)
- **AI**: Google Gemini 2.5 Flash
- **Deployment Ready**: Static assets + serverless functions

## Implementation Details

### Files Created/Modified
```
Components:
├─ components/ChatBot.tsx (NEW) - Floating chat widget
├─ views/ChatBotAdmin.tsx (NEW) - Admin dashboard
├─ utils/chatBotUtils.ts (NEW) - NLP utilities
├─ utils/initializeFAQs.ts (NEW) - FAQ initialization

Cloud Functions:
├─ functions/processChatMessage.ts (NEW) - Message processing template

Updated Files:
├─ types.ts - Added FAQ, ChatMessage, ChatFeedback, BotMetrics
├─ App.tsx - Integrated ChatBotAdmin route + FAQ initialization
├─ views/LessonView.tsx - Added ChatBot component
├─ views/Admin.tsx - (may add link to chatbot admin)
```

### Firestore Collections Structure
```
faqBase/
├─ id: string
├─ courseId: string
├─ category: 'tecnico' | 'administrativo' | 'motivacional'
├─ keywords: string[]
├─ question: string
├─ answer: string (markdown)
├─ videoUrl?: string
├─ linkToMaterial?: string
├─ effectiveness: number (0-100)
├─ usageCount: number
├─ createdAt: timestamp
└─ updatedAt: timestamp

chatMessages/
├─ id: string
├─ userId: string
├─ courseId: string
├─ lessonId?: string
├─ message: string
├─ sender: 'user' | 'bot' | 'mentor'
├─ timestamp: timestamp
├─ status: 'pending' | 'answered'
└─ botResponse?: { type, faqId, confidence, mentorId }

chatFeedback/
├─ id: string
├─ messageId: string
├─ userId: string
├─ rating: 1-5
├─ comment?: string
└─ timestamp: timestamp
```

## User Preferences
- Language: Portuguese (Brazil) - PT-BR
- Tone: Friendly, encouraging, accessible (designed for underserved communities)
- UX Priority: Clear visual feedback, celebration moments, minimal friction
- Bot Strategy: FAQ-based, no ML needed, learning loop with feedback

## Known Limitations & Future Improvements
1. **Cloud Functions**: Template provided, needs Firebase CLI deployment for production
2. **Gemini API Key**: Still needed for AI Tutor (separate from Chat Bot)
3. **Chat Bot Learning**: Currently loads FAQs static, will improve with feedback loop
4. **NLP**: Keyword-matching based, can upgrade to Hugging Face models later

## Testing Checklist - Chat Bot
- [ ] Navigate to /course/{id}/lesson/{id}
- [ ] Click 💬 button (bottom right)
- [ ] Test: "Qual é a diferença entre == e is?"
- [ ] Bot should respond with FAQ match + feedback buttons
- [ ] Click "👍 Ajudou" and verify feedback is recorded
- [ ] Visit /admin/chatbot to see:
  - [ ] Métricas updated (1 resolved)
  - [ ] FAQ showing in "FAQs existentes"
  - [ ] Conversa logged
- [ ] Add new FAQ via admin panel
- [ ] Test escalation (ask something not in FAQ)

## Next Phase (Post-MVP)
1. **Cloud Function Deployment**: Deploy processChatMessage to Firebase
2. **Mentor Escalation**: Wire up mentor notifications
3. **Advanced NLP**: Integrate Hugging Face for semantic similarity
4. **Multi-channel**: WhatsApp, Telegram, Email
5. **Analytics**: Bot performance dashboard for mentors
6. **Gamification**: Badges for answering FAQs correctly
7. **Certificate Generation**: PDF certs with custom design
8. **Leaderboards & Achievements**: Ranking system

---
**Last Updated**: Nov 22, 2025 (Chat Bot Implementation Complete)
**Maintained By**: PerifaCode Development Team
