# 📋 PLANO DE MIGRAÇÃO: SITE vs SISTEMA

## 🎯 STATUS ATUAL

✅ Criados:
- `SiteLayout.tsx` (layout para site institucional)
- `SistemaLayout.tsx` (layout para sistema LMS)
- `PrivateRoute.tsx` (proteção de rotas)

---

## 📋 MAPEAMENTO DE ROTAS

### **SITE (SiteLayout)**

```
/ → Home
/courses → CoursesCatalog (sem login)
/course-landing/:courseId → CourseLandingPage
/blog → Blog
/article/:articleId → ArticleView
/team → TeamView
/partnerships → PartnershipsView
/supporters → SupportersView
/supporter/:partnerId → PartnerDetailView
/events → EventsView (se existir)
/event/:eventId → EventDetailView
/donate → DonateView
/privacy → PrivacyPolicyView
/terms → TermsOfUseView
/about → AboutUsView
/annual-report → AnnualReportView
/financial-statement → FinancialStatementView
```

### **SISTEMA (SistemaLayout + PrivateRoute)**

```
/login → Login (sem proteção)
/register → Register (sem proteção)
/connect → ConnectView (sem proteção)
/complete-profile → CompleteProfile

/dashboard → Dashboard
/course/:courseId → CourseDetail
/course/:courseId/lesson/:lessonId → LessonView
/course/:courseId/certificate → CertificateView
/profile → Profile
/change-password → ChangePassword

/admin → Dashboard (admin)
/admin/course-editor → CourseEditor
/admin/course-editor/:courseId → CourseEditor
/admin/article-editor → ArticleEditor
/admin/article-editor/:articleId → ArticleEditor
/admin/user-editor/new → StudentEditor
/admin/user-editor/:userId → StudentEditor
/admin/instructor-dashboard/:courseId → InstructorCourseDashboard
/admin/transparency-editor → TransparencyEditor
/admin/chatbot → ChatBotAdmin

/mentor-dashboard → MentorDashboard
/analytics → Analytics

/community → CommunityView
/forum → ForumView
/community/post/:postId → ForumPostDetailView
/community/post/new → ForumPostEditor

/project/:projectId → ProjectDetailView
/project/edit → ProjectEditor
/project/edit/:projectId → ProjectEditor
```

---

## 🔄 PRÓXIMOS PASSOS PARA IMPLEMENTAÇÃO

### Fase 1: Atualizar App.tsx com novo routing (PRÓXIMO)
```typescript
<Routes>
  {/* SITE */}
  <Route element={<SiteLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/courses" element={<Courses />} />
    {/* ... todas rotas site */}
  </Route>

  {/* AUTH (sem layout) */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* SISTEMA (protegido) */}
  <Route element={<PrivateRoute><SistemaLayout /></PrivateRoute>}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/course/:courseId" element={<CourseDetail />} />
    {/* ... todas rotas sistema */}
  </Route>

  {/* 404 */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### Fase 2: Criar SistemaSidebar
```
- Meus Cursos
- Dashboard
- Admin (se admin)
- Comunidade
- Perfil
- Configurações
```

### Fase 3: Criar SistemaHeader
```
- Logo/Voltar
- Notificações 🔔
- Perfil dropdown
- Busca (opcional)
```

---

## 📁 ESTRUTURA CRIADA

```
src/
├─ site/
│  └─ layout/
│     └─ SiteLayout.tsx ✅
├─ sistema/
│  └─ layout/
│     └─ SistemaLayout.tsx ✅
└─ shared/
   └─ components/
      └─ PrivateRoute.tsx ✅
```

---

## 🚀 IMPACTO

Depois da migração:

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Clareza** | Confuso | 100% claro |
| **Layouts** | Misturados | Separados |
| **Header** | Único | 2 específicos |
| **Footer** | Site + Sistema | Só Site |
| **Manutenção** | Difícil | Fácil |
| **Prototipagem** | Lenta | Rápida |

---

## ✅ CHECKLIST

- [x] SiteLayout criada
- [x] SistemaLayout criada
- [x] PrivateRoute criada
- [ ] App.tsx atualizado (PRÓXIMO)
- [ ] Testar rotas
- [ ] Criar SistemaSidebar
- [ ] Criar SistemaHeader

---

## 💡 BENEFÍCIOSIMEDIATOS

1. **Aluno vê:**
   - Site limpo (sem confusão com dashboard)
   - Sistema funcional (tudo que precisa para estudar)

2. **Admin vê:**
   - Separação clara de responsabilidades
   - Fácil adicionar features

3. **Dev vê:**
   - Código organizado
   - Fácil de manter
   - Pronto para escalar

---

**Status**: ✅ Estrutura criada, pronto para App.tsx
