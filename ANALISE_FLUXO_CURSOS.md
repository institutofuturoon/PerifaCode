# Análise do Fluxo de Cursos - FuturoOn

## 📋 Rotas Definidas (App.tsx)

### Rotas Públicas
- `/cursos` - Catálogo público de cursos (Courses.tsx)
- `/curso-info/:courseId` - Landing Page do curso (CourseLandingPage.tsx)

### Rotas Autenticadas (Workspace)
- `/curso/:courseId` - Detalhes do curso (CourseDetail.tsx)
- `/curso/:courseId/aula/:lessonId` - Visualização de aula (LessonView.tsx)
- `/curso/:courseId/certificado` - Certificado (CertificateView.tsx)

### Rotas Administrativas
- `/admin/editor-curso` - Criar novo curso (CourseEditor.tsx)
- `/admin/editor-curso/:courseId` - Editar curso (CourseEditor.tsx)
- `/admin/painel-instrutor/:courseId` - Painel do instrutor (InstructorCourseDashboard.tsx)

---

## 🔄 Fluxo Completo

### 1️⃣ CADASTRO DE CURSO (Admin/Instrutor)

**Ponto de Entrada:**
- Dashboard → Gerenciar Cursos → "Novo Curso"
- Rota: `/admin/editor-curso`

**Componente:** `CourseEditor.tsx`

**Dados Salvos:**
```typescript
Course {
  id: string
  title: string
  slug?: string
  description: string
  longDescription: string
  imageUrl: string
  track: string (trilha)
  skillLevel: 'Iniciante' | 'Intermediário' | 'Avançado'
  format: 'online' | 'presencial' | 'hibrido'
  modules: Module[] {
    id: string
    title: string
    lessons: Lesson[] {
      id: string
      title: string
      type: 'video' | 'text' | 'quiz'
      duration: string
      xp: number
      videoUrl?: string
      mainContent: string (conteúdo da aula)
    }
  }
}
```

**Salvamento:**
- Firestore: `courses/{courseId}` (metadados)
- Firestore: `courses/{courseId}/lessons/{lessonId}` (conteúdo completo das aulas)

---

### 2️⃣ VISUALIZAÇÃO PÚBLICA (Usuário não logado)

**Fluxo:**
```
Home → Cursos (/cursos)
  ↓
Courses.tsx (Catálogo)
  ↓ (clique no curso)
Landing Page (/curso-info/:courseId)
  ↓
CourseLandingPage.tsx
  ↓ (botão "Começar Agora")
Login/Registro
```

**Componentes:**
1. **Courses.tsx** - Lista todos os cursos com filtros
   - Busca por título/tecnologia
   - Filtro por trilha
   - Filtro por nível
   - Filtro por formato
   - Paginação

2. **CourseLandingPage.tsx** - Página de venda/informação
   - Descrição completa
   - Módulos e aulas
   - Instrutor
   - Requisitos
   - CTA para inscrição

---

### 3️⃣ ACESSO AO CURSO (Aluno Logado)

**Fluxo A - Pelo Dashboard:**
```
Login → Dashboard (/painel)
  ↓
Aba "Catálogo" (ExploreCoursesPanel)
  ↓ (clique no curso)
Primeira Aula (/curso/:id/aula/:lessonId)
```

**Fluxo B - Pelo Site:**
```
Cursos (/cursos)
  ↓ (clique no curso)
Landing Page (/curso-info/:id)
  ↓ (botão "Começar Agora" - se logado)
Workspace (/curso/:id)
  ↓
CourseDetail.tsx
  ↓ (clique em aula)
LessonView (/curso/:id/aula/:lessonId)
```

**Fluxo C - Continuação:**
```
Dashboard → "Meus Cursos"
  ↓
Mostra cursos em andamento
  ↓ (clique)
Última aula não concluída
```

---

### 4️⃣ NAVEGAÇÃO ENTRE AULAS

**Componente:** `LessonView.tsx`

**Funcionalidades:**
- Sidebar com lista de módulos e aulas
- Botão "Anterior" / "Próxima"
- Marcar aula como concluída
- Ganhar XP ao completar
- Fazer anotações
- Visualizar conteúdo (vídeo/texto/quiz)

**Navegação:**
```typescript
// Sidebar - clique em aula
navigate(`/curso/${courseId}/aula/${lessonId}`)

// Botão Próxima
navigate(`/curso/${courseId}/aula/${nextLessonId}`)

// Última aula concluída
navigate('/painel') // volta ao dashboard
```

---

### 5️⃣ GESTÃO DE PROGRESSO

**Dados do Usuário:**
```typescript
User {
  completedLessonIds: string[] // IDs das aulas concluídas
  xp: number // XP total acumulado
  notes?: { [lessonId: string]: string } // Anotações por aula
}
```

**Cálculo de Progresso:**
```typescript
const courseLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id))
const completedInCourse = user.completedLessonIds.filter(id => courseLessonIds.includes(id))
const progress = (completedInCourse.length / courseLessonIds.length) * 100
```

---

## ✅ PONTOS FORTES DO FLUXO

1. **Separação Clara:**
   - Site institucional (público)
   - Workspace (autenticado)
   - Admin (gestão)

2. **Múltiplos Pontos de Entrada:**
   - Catálogo público
   - Dashboard do aluno
   - Continuação de cursos

3. **Progressão Gamificada:**
   - XP por aula
   - Progresso visual
   - Certificados

4. **Flexibilidade:**
   - Suporta ID e slug
   - Diferentes tipos de conteúdo
   - Formatos variados (online/presencial)

---

## ⚠️ PONTOS DE ATENÇÃO

### 1. Consistência de Rotas
**Status:** ✅ CORRIGIDO
- Todas as rotas agora usam padrão em português
- `/curso/` ao invés de `/course/`
- `/aula/` ao invés de `/lesson/`

### 2. Landing Page vs Workspace
**Comportamento Atual:**
- Usuário não logado → Landing Page (`/curso-info/:id`)
- Usuário logado → Pode ir direto ao Workspace (`/curso/:id`)

**Sugestão:** Manter assim, mas garantir que:
- Landing page sempre redireciona logados para workspace
- Workspace sempre exige autenticação

### 3. Salvamento de Aulas
**Estrutura Atual:**
- Curso principal: `courses/{courseId}`
- Aulas individuais: `courses/{courseId}/lessons/{lessonId}`

**Vantagem:** Conteúdo pesado (vídeos, textos longos) não sobrecarrega a listagem
**Desvantagem:** Requer carregamento adicional ao abrir aula

---

## 🎯 RECOMENDAÇÕES

### Curto Prazo
1. ✅ Padronizar todas as rotas (FEITO)
2. ✅ Corrigir navegação entre aulas (FEITO)
3. Adicionar loading states nas transições
4. Implementar cache de aulas visitadas

### Médio Prazo
1. Sistema de pré-requisitos entre aulas
2. Bloqueio de aulas futuras até completar anteriores
3. Notificações de novos cursos
4. Sistema de avaliação de cursos

### Longo Prazo
1. Modo offline para aulas
2. Download de materiais complementares
3. Fórum de discussão por aula
4. Live coding integrado

---

## 📊 MÉTRICAS IMPORTANTES

### Para Alunos
- Taxa de conclusão de cursos
- Tempo médio por aula
- XP acumulado
- Streak de dias consecutivos

### Para Instrutores
- Aulas com mais abandono
- Feedback dos alunos
- Taxa de aprovação
- Engajamento por módulo

### Para Admins
- Cursos mais populares
- Taxa de conversão (visitante → aluno)
- Retenção de alunos
- Crescimento de matrículas

---

## 🔧 MANUTENÇÃO

### Ao Adicionar Novo Curso
1. Criar no CourseEditor
2. Adicionar imagem de capa
3. Definir trilha e nível
4. Criar módulos e aulas
5. Testar navegação completa
6. Publicar

### Ao Editar Curso Existente
1. Não alterar IDs de aulas (quebra progresso dos alunos)
2. Adicionar novas aulas no final
3. Atualizar descrições sem medo
4. Testar em ambiente de staging

---

**Última Atualização:** 03/12/2024
**Status:** Fluxo funcional e rotas padronizadas ✅
