# FuturoOn - PerifaCode LMS Platform

## Project Overview
FuturoOn é uma plataforma de Learning Management System (LMS) focada em inclusão digital para comunidades carentes no Brasil. A plataforma oferece cursos de tecnologia com recursos avançados incluindo inscrição em cursos, rastreamento de progresso, tutoria com IA, fóruns comunitários, e gamificação.

**Status**: MVP em produção com melhorias de UX em implementação

## Recent Session Summary (Nov 22, 2025)

### Completed - Comprehensive UX Improvements for Course Flow

#### 🎨 Visual Enhancements
- ✅ Badge "Inscrito" nos CartõesEnrollmentConfirmation modals com confirmação visual
- ✅ Barra de progresso visual em cursos (progress bar animada)
- ✅ Trilha de progresso no CourseDetail (caminho visual de modules)
- ✅ Breadcrumb na LessonView mostrando "Aula X de Y"
- ✅ Checklist completa de aulas na sidebar (todas as aulas do curso)
- ✅ Preview da próxima aula com dica de progresso

#### 🎯 Core User Flow Improvements
- ✅ Sistema de inscrição em cursos (handleEnrollUser)
- ✅ Função enrolledCourseIds adicionada ao tipo User
- ✅ Timer de 2 minutos antes de permitir conclusão da aula
- ✅ Modais de celebração:
  - LessonCompleteModal - parabéns ao finalizar aula
  - ModuleMilestoneModal - celebração de módulo completo
  - CourseCompleteModal - conclusão do curso com certificado

#### 🤖 AI Tutor Enhancement
- ✅ Tooltip inicial mostrando dica de descoberta
- ✅ Interface melhorada do chat
- ✅ Integração com Google Gemini para respostas contextualizadas
- ✅ Formatação de markdown nas respostas
- ✅ Indicador de digitação com animação

#### 📊 Technical Implementation
- ✅ Função `handleEnrollUser(courseId)` no App.tsx para persistir inscrições
- ✅ Integração de modais de celebração no fluxo de conclusão
- ✅ Context API updates para gerenciar estado de inscrições
- ✅ LSP validation - sem erros de tipagem

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

## User Preferences
- Language: Portuguese (Brazil) - PT-BR
- Tone: Friendly, encouraging, accessible (designed for underserved communities)
- UX Priority: Clear visual feedback, celebration moments, minimal friction

## Known Limitations & Future Improvements
1. **Gemini API Key**: Requires user to provide VITE_GEMINI_API_KEY
2. **Tooltip Behavior**: May repeat in edge cases (localStorage tracking implemented)
3. **Database Persistence**: Mock data merged with Firestore (consistent load pattern)

## Testing Checklist
- [ ] Enroll in course → verify badge appears
- [ ] Complete lesson (2+ min) → verify modal displays
- [ ] Complete module → verify milestone celebration
- [ ] Complete course → verify certificate modal
- [ ] Open AI Tutor → verify tooltip shows on first visit
- [ ] Use AI Tutor → verify responses display correctly

## Next Phase (Post-MVP)
- Social sharing (LinkedIn integration working)
- Certificate generation with custom images
- Leaderboards & achievements
- Video player improvements
- Real-time mentor sessions booking

---
**Last Updated**: Nov 22, 2025
**Maintained By**: PerifaCode Development Team
