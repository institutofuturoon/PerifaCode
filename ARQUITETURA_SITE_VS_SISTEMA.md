# 🏗️ ARQUITETURA: SITE vs SISTEMA

## 🎯 PROBLEMA ATUAL

Hoje tudo está misturado em `/views` e `/App.tsx`:
```
Home (site)
├─ Blog (site)
├─ Courses (sistema!)
├─ Dashboard (sistema!)
├─ Admin (sistema!)
├─ About (site)
├─ Team (site)
├─ Partnerships (site)
└─ ... tudo junto
```

**Resultado:** Difícil manter, difícil entender, confusão de layouts

---

## ✅ SOLUÇÃO: SEPARAÇÃO CLARA

### **ESTRUTURA PROPOSTA:**

```
src/
├─ site/                      # SITE INSTITUCIONAL
│  ├─ pages/
│  │  ├─ Home.tsx
│  │  ├─ About.tsx
│  │  ├─ Blog.tsx
│  │  ├─ BlogDetail.tsx
│  │  ├─ Team.tsx
│  │  ├─ Partnerships.tsx
│  │  ├─ Supporters.tsx
│  │  ├─ Events.tsx
│  │  ├─ PrivacyPolicy.tsx
│  │  ├─ TermsOfUse.tsx
│  │  ├─ Donate.tsx
│  │  ├─ AnnualReport.tsx
│  │  ├─ FinancialStatement.tsx
│  │  ├─ CoursesCatalog.tsx    (landing, sem login)
│  │  ├─ CourseLanding.tsx
│  │  └─ NotFound.tsx
│  ├─ layout/
│  │  ├─ SiteLayout.tsx        (Header + Footer comuns)
│  │  ├─ SiteHeader.tsx
│  │  └─ SiteFooter.tsx
│  └─ components/
│     ├─ HeroSection.tsx
│     ├─ FeatureCard.tsx
│     ├─ ... (componentes site-específicos)
│
├─ sistema/                    # SISTEMA LMS (APP)
│  ├─ dashboard/
│  │  ├─ Dashboard.tsx
│  │  ├─ StudentDashboard.tsx
│  │  └─ InstructorDashboard.tsx
│  ├─ learning/
│  │  ├─ CourseDetail.tsx
│  │  ├─ LessonView.tsx
│  │  ├─ PreLessonScreen.tsx
│  │  └─ CertificateView.tsx
│  ├─ admin/
│  │  ├─ AdminPanel.tsx
│  │  ├─ CourseEditor.tsx
│  │  ├─ ArticleEditor.tsx
│  │  ├─ UserEditor.tsx
│  │  ├─ ChatBotAdmin.tsx
│  │  └─ TransparencyEditor.tsx
│  ├─ mentor/
│  │  ├─ MentorDashboard.tsx
│  │  └─ SessionManager.tsx
│  ├─ profile/
│  │  ├─ Profile.tsx
│  │  ├─ CompleteProfile.tsx
│  │  ├─ ChangePassword.tsx
│  │  └─ StudentProfile.tsx
│  ├─ community/
│  │  ├─ CommunityView.tsx
│  │  ├─ ForumView.tsx
│  │  ├─ ProjectDetailView.tsx
│  │  └─ ProjectEditor.tsx
│  ├─ auth/
│  │  ├─ Login.tsx
│  │  ├─ Register.tsx
│  │  └─ ConnectView.tsx
│  ├─ layout/
│  │  ├─ SistemaLayout.tsx     (Header + Sidebar)
│  │  ├─ SistemaHeader.tsx
│  │  └─ SistemaSidebar.tsx
│  └─ components/
│     ├─ LessonTabs.tsx
│     ├─ ModuleAccordion.tsx
│     ├─ ProgressBar.tsx
│     └─ ... (componentes sistema-específicos)
│
├─ shared/                     # COMPONENTES COMPARTILHADOS
│  ├─ components/
│  │  ├─ Button.tsx
│  │  ├─ Badge.tsx
│  │  ├─ Card.tsx
│  │  ├─ Modal.tsx
│  │  ├─ Toast.tsx
│  │  ├─ ChatBot.tsx
│  │  ├─ PreLessonScreen.tsx
│  │  └─ MarkdownRenderer.tsx
│  ├─ hooks/
│  │  ├─ useAuth.ts
│  │  ├─ useCourses.ts
│  │  └─ useUser.ts
│  ├─ context/
│  │  └─ AppContext.ts
│  ├─ types/
│  │  └─ types.ts
│  ├─ utils/
│  │  ├─ notificationService.ts
│  │  ├─ chatBotUtils.ts
│  │  └─ helpers.ts
│  └─ constants/
│     └─ constants.ts
│
├─ App.tsx                     (Router principal - NOVO, apenas rotas)
└─ main.tsx
```

---

## 🛣️ ROTAS: NOVA ORGANIZAÇÃO

### **SITE (sem login obrigatório, Header + Footer)**

```
/                    → Home (site)
/about               → About (site)
/blog                → Blog (site)
/article/:id         → BlogDetail (site)
/team                → Team (site)
/partnerships        → Partnerships (site)
/supporters          → Supporters (site)
/supporter/:id       → SupplierDetail (site)
/events              → Events (site)
/event/:id           → EventDetail (site)
/donate              → Donate (site)
/privacy             → PrivacyPolicy (site)
/terms               → TermsOfUse (site)
/annual-report       → AnnualReport (site)
/financial-statement → FinancialStatement (site)

/courses             → CoursesCatalog (site - sem login)
/course-landing/:id  → CourseLanding (site - sem login)
```

**Header:**
```
Logo | Home | Cursos | Blog | Parceiros | Sobre | [Login/Profile]
```

**Footer:**
```
Links, copyright, social
```

---

### **SISTEMA (requer login, Header + Sidebar)**

```
/login               → Login (auth)
/register            → Register (auth)
/connect             → ConnectView (auth)
/complete-profile    → CompleteProfile (onboarding)

/dashboard           → Dashboard (aluno/instrutor/admin)
/admin               → AdminPanel
/admin/course-editor             → CourseEditor
/admin/article-editor            → ArticleEditor
/admin/user-editor/:userId       → UserEditor
/admin/chatbot                   → ChatBotAdmin
/admin/transparency-editor/:type → TransparencyEditor

/course/:courseId                → CourseDetail
/course/:courseId/lesson/:id     → LessonView (com PreLessonScreen)
/course/:courseId/certificate    → CertificateView

/profile             → Profile
/change-password     → ChangePassword

/community           → CommunityView
/forum               → ForumView
/community/post/:id  → ForumPostDetail
/community/post/new  → ForumPostEditor

/project/:id         → ProjectDetail
/project/edit/:id    → ProjectEditor

/mentor-dashboard    → MentorDashboard
/analytics           → Analytics
```

**Header:**
```
Logo | Dashboard | Cursos | Comunidade | Mentoria | Notificações 🔔 | Perfil
```

**Sidebar:**
```
Meus Cursos
├─ Andamento
├─ Concluídos
Comunidade
├─ Fórum
├─ Projetos
Admin (se admin)
├─ Cursos
├─ Usuários
├─ ChatBot
Configurações
```

---

## 🎨 LAYOUTS ESPECÍFICOS

### **SiteLayout.tsx** (para SITE)

```typescript
export const SiteLayout: React.FC<{children: ReactNode}> = ({children}) => {
  return (
    <div>
      <SiteHeader />
      <main className="min-h-screen">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
};
```

**Características:**
- Header simples (Logo, Menu, Login)
- Footer com links
- ScrollToTop
- ScrollSpaceship (decorativo)
- Sem sidebar
- Dark theme (#09090B)

---

### **SistemaLayout.tsx** (para SISTEMA)

```typescript
export const SistemaLayout: React.FC<{children: ReactNode}> = ({children}) => {
  return (
    <div className="flex">
      <SistemaSidebar />
      <div className="flex-1">
        <SistemaHeader />
        <main className="p-6 bg-[#09090B]">
          {children}
        </main>
      </div>
    </div>
  );
};
```

**Características:**
- Sidebar esquerda (navegação)
- Header com notificações, perfil
- Main content área
- Sem Footer
- Mais compacto

---

## 🗂️ NOVO App.tsx

```typescript
const App = () => {
  return (
    <AppProvider>
      <Routes>
        {/* SITE - com SiteLayout */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/article/:id" element={<BlogDetail />} />
          <Route path="/team" element={<Team />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/courses" element={<CoursesCatalog />} />
          <Route path="/course-landing/:id" element={<CourseLanding />} />
          {/* ... mais rotas site */}
        </Route>

        {/* SISTEMA - com SistemaLayout (protegido) */}
        <Route element={<PrivateRoute><SistemaLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<LessonView />} />
          <Route path="/profile" element={<Profile />} />
          {/* ... mais rotas sistema */}
        </Route>

        {/* AUTH - sem layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppProvider>
  );
};
```

---

## 🔄 STEP-BY-STEP DE MIGRAÇÃO

### **Fase 1: Criar estrutura de diretórios (1h)**
```bash
# Criar diretórios
mkdir -p src/site/pages src/site/layout src/site/components
mkdir -p src/sistema/{dashboard,learning,admin,mentor,profile,community,auth,layout,components}
mkdir -p src/shared/{components,hooks,context,types,utils,constants}

# Mover arquivos (posterga)
```

### **Fase 2: Reorganizar tipos e contextos (30min)**
```
shared/
├─ types/types.ts (todos os tipos)
├─ context/AppContext.ts (contexto único)
└─ constants/constants.ts (constantes)
```

### **Fase 3: Criar layouts específicos (1h)**
```
site/layout/SiteLayout.tsx
site/layout/SiteHeader.tsx
site/layout/SiteFooter.tsx

sistema/layout/SistemaLayout.tsx
sistema/layout/SistemaHeader.tsx
sistema/layout/SistemaSidebar.tsx
```

### **Fase 4: Reorganizar views (2h)**
```
Mover views para:
- site/pages/
- sistema/*/
- shared/components/
```

### **Fase 5: Atualizar App.tsx com novas rotas (1h)**
```
Novo routing system
PrivateRoute wrapper
Layout wrappers
```

---

## ✨ BENEFÍCIOS

| Benefício | Impacto |
|-----------|---------|
| **Clareza** | 100% claro qual é Site vs Sistema |
| **Manutenção** | Fácil modificar uma parte sem quebrar a outra |
| **Escalabilidade** | Pronto para crescer (2 times separados?) |
| **Performance** | Possibilidade de lazy load por seção |
| **Onboarding** | Novo dev entende rápido |

---

## 📋 IMPLEMENTAÇÃO RÁPIDA

### **Opção A: Completo (3-4h)**
Reorganizar tudo agora, com nova estrutura

### **Opção B: Gradual (hoje + próximos dias)**
1. Criar estrutura de diretórios
2. Criar layouts específicos
3. Mover arquivos progressivamente
4. Testar cada mudança

### **Opção C: Híbrida (recomendado)**
1. Criar layouts específicos (SiteLayout + SistemaLayout)
2. Atualizar App.tsx com novo routing
3. Mover arquivos aos poucos (sem rush)

---

## 🎯 RECOMENDAÇÃO

**Comece hoje com Opção C:**
1. Crie `site/layout/SiteLayout.tsx`
2. Crie `sistema/layout/SistemaLayout.tsx`
3. Atualize `App.tsx` com novo routing
4. Depois mova arquivos progressivamente

**Tempo:** 2-3 horas para separação clara
**Resultado:** Site e Sistema 100% desacoplados

---

## 📝 EXEMPLO: Nova Rota Site

### Antes:
```typescript
<Route path="/about" element={<AboutUsView />} />
```

### Depois:
```typescript
<Route element={<SiteLayout />}>
  <Route path="/about" element={<About />} />
</Route>
```

Simples, mas com impacto ENORME na clareza!

---

## 🚀 PRÓXIMOS PASSOS

1. Você quer começar hoje?
2. Qual opção: A, B ou C (recomendada)?
3. Quer que eu implemente os layouts agora?
