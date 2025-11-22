# 🚀 PLANO DE CURSO - MODELO ROCKETSEAT

## VISÃO GERAL
```
FuturoOn Learning Platform
├─ Trilhas Progressivas (Iniciante → Avançado)
├─ 30+ Projetos Práticos (Reais)
├─ Gamificação Avançada (XP, Badges, Ranks)
├─ Comunidade Ativa (Fórum, Desafios, Eventos)
└─ Design Moderno (Inspiração Rocketseat/Figma)
```

---

## 📚 ESTRUTURA DE TRILHAS

### TRILHA 1: JavaScript Essencial (Iniciante)
```
Duração: 4 semanas | 12 horas | 50 aulas
Público: 0 conhecimento em programação

├─ Módulo 1: Fundamentos (2h)
│  ├─ O que é JavaScript?
│  ├─ Variáveis e Tipos
│  ├─ Operadores e Lógica
│  └─ [PROJETO 1] Calculadora Simples (30 min)
│
├─ Módulo 2: Controle de Fluxo (2h)
│  ├─ If/Else
│  ├─ Loops (For, While)
│  ├─ Switch/Case
│  └─ [PROJETO 2] Jogo da Adivinhação (45 min)
│
├─ Módulo 3: Funções (2h)
│  ├─ Declarando Funções
│  ├─ Arrow Functions
│  ├─ Callbacks e Closures
│  └─ [PROJETO 3] Função Calculadora Científica (1h)
│
├─ Módulo 4: Objetos e Arrays (2h)
│  ├─ Criando Objetos
│  ├─ Métodos de Array (map, filter, reduce)
│  ├─ Spread Operator
│  └─ [PROJETO 4] Lista de Tarefas (1h)
│
├─ Módulo 5: DOM Manipulation (2h)
│  ├─ Selecionando Elementos
│  ├─ Alterando Conteúdo
│  ├─ Event Listeners
│  └─ [PROJETO 5] Todo App com DOM (1.5h)
│
└─ Módulo 6: Desafio Final (2h)
   ├─ Revisão de Conceitos
   ├─ Desafio: Criar App Completo
   └─ Certificado ao Completar
```

**XP Estimado:** 500 XP | **Badges:** 6 badges (1/módulo) + 1 conclusão

---

### TRILHA 2: React Fundamentos (Intermediário)
```
Duração: 5 semanas | 15 horas | 60 aulas
Pré-requisito: Trilha 1 OU conhecimento JavaScript

├─ Módulo 1: React Basics (3h)
│  ├─ O que é React?
│  ├─ JSX
│  ├─ Componentes Funcionais
│  ├─ Props
│  └─ [PROJETO 6] Card Component Reutilizável (1h)
│
├─ Módulo 2: Estado e Ciclo de Vida (3h)
│  ├─ useState Hook
│  ├─ useEffect Hook
│  ├─ Custom Hooks
│  └─ [PROJETO 7] Contador com Estado (45 min)
│
├─ Módulo 3: Renderização Condicional (2h)
│  ├─ If/Else em JSX
│  ├─ Operador Ternário
│  ├─ && Pattern
│  └─ [PROJETO 8] App com Abas (1h)
│
├─ Módulo 4: Listas e Chaves (2h)
│  ├─ Renderizar Listas
│  ├─ Chaves Únicas
│  ├─ Filtros e Ordenação
│  └─ [PROJETO 9] Blog com Artigos Dinâmicos (1.5h)
│
├─ Módulo 5: Formulários (2h)
│  ├─ Inputs Controlados
│  ├─ Validação
│  ├─ FormSubmit
│  └─ [PROJETO 10] Formulário de Contato (1h)
│
├─ Módulo 6: Performance (2h)
│  ├─ Memoization (useMemo, useCallback)
│  ├─ React.memo
│  ├─ Lazy Loading
│  └─ [PROJETO 11] Otimizar App Anterior (1h)
│
└─ Módulo 7: Desafio Final (1h)
   ├─ Criar Dashboard Completo
   └─ Deploy no Vercel
```

**XP Estimado:** 750 XP | **Badges:** 7 badges + 1 conclusão

---

### TRILHA 3: Full Stack (Avançado)
```
Duração: 8 semanas | 24 horas | 80+ aulas
Pré-requisito: Trilha 2

├─ Backend (Node.js + Express)
│  ├─ Express Basics
│  ├─ Rotas e Controllers
│  ├─ Middleware
│  └─ [PROJETO 12] API REST (2h)
│
├─ Banco de Dados
│  ├─ Firestore/MongoDB
│  ├─ Queries
│  ├─ Transactions
│  └─ [PROJETO 13] Integrar DB (2h)
│
├─ Autenticação
│  ├─ JWT
│  ├─ OAuth
│  ├─ Refresh Tokens
│  └─ [PROJETO 14] Auth Sistema Completo (2h)
│
├─ Deploy
│  ├─ Vercel/Netlify
│  ├─ Firebase Deploy
│  ├─ CI/CD
│  └─ [PROJETO 15] Deploy App Completo (2h)
│
└─ Projeto Capstone
   ├─ SaaS Simplificado
   ├─ Com auth, DB, API, Frontend
   └─ Deploy em produção
```

**XP Estimado:** 1500 XP | **Badges:** 8 badges + conclusão

---

## 🎯 PROJETOS PRÁTICOS (30+)

### Estrutura Padrão de Projeto
```typescript
interface Project {
  id: string;
  title: string;           // "Todo App"
  description: string;     // Descrição detalhada
  trilha: string;         // "javascript-essencial"
  modulo: number;         // 4
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  duracao: number;        // em minutos (60)
  xpReward: number;       // 100 XP
  skills: string[];       // ["DOM", "Arrays", "Events"]
  
  // Estrutura do Projeto
  figmaLink: string;      // Design no Figma
  starterCode: string;    // Código inicial
  solucao: string;        // Solução completa
  videoTutorial: string;  // Link YouTube
  
  // Avaliação
  requisitos: string[];   // Funcionalidades obrigatórias
  rubrica: {              // Critérios de nota
    funcionamento: 30;
    codigo: 30;
    criatividade: 20;
    documentacao: 20;
  };
  
  // Comunidade
  forumTopicId: string;   // Discussão no fórum
  submissions: number;    // Quantos enviaram
}
```

### Exemplos de Projetos

#### 🔥 PROJETOS INICIANTE
```
1. Calculadora Simples
   - Operações básicas (+, -, *, /)
   - Visor dinâmico
   - XP: 50

2. Jogo da Adivinhação
   - Aleatoriedade
   - Loops
   - Dicas
   - XP: 75

3. App de Tarefas (To-Do)
   - CRUD local
   - DOM manipulation
   - localStorage
   - XP: 100

4. Conversor de Moedas
   - Fetch API (real)
   - Formulários
   - Formatação
   - XP: 100

5. Quiz Interativo
   - Perguntas dinâmicas
   - Pontuação
   - Timer
   - XP: 125
```

#### 💎 PROJETOS INTERMEDIÁRIO
```
6. Clone de Spotify
   - React State
   - Componentes reutilizáveis
   - Dark mode
   - XP: 200

7. Dashboard de Criptomoedas
   - API real (CoinGecko)
   - Gráficos (Chart.js)
   - Favoritos
   - XP: 250

8. Blog Pessoal
   - CRUD posts
   - Comments
   - Categories
   - XP: 300

9. E-commerce Simples
   - Catálogo
   - Carrinho
   - Checkout
   - XP: 350

10. SaaS Note-Taking
    - Notas em tempo real
    - Tags e busca
    - Compartilhamento
    - XP: 400
```

#### 🚀 PROJETOS AVANÇADO
```
11. Plataforma de Cursos (Como FuturoOn!)
    - Auth completa
    - Progresso rastreado
    - Sistema de XP
    - XP: 500

12. Chat em Tempo Real
    - WebSockets
    - Autenticação
    - Mensagens persistidas
    - XP: 600

13. API REST Completa
    - Node.js + Express
    - DB com Firestore
    - JWT Auth
    - XP: 700

14. GitHub Clone
    - Repos, branches
    - Commits simulados
    - Collab
    - XP: 1000

15. Sistema de Marketplace
    - Múltiplos usuários
    - Pagamentos (Stripe)
    - Reviews
    - XP: 1500
```

---

## 🎮 GAMIFICAÇÃO AVANÇADA

### Sistema de XP
```typescript
interface XPSystem {
  // Ações que ganham XP
  completarAula: 10,              // Por aula
  completarProjeto: 100,          // Por projeto
  fazerDesafio: 50,               // Desafios semanais
  ajudarNoForum: 25,              // Responder dúvidas
  streaming: 5,                   // 5 min = 5 XP
  fazerComentarioUtil: 10,        // No fórum/código
  participarEvento: 100,          // Eventos ao vivo
  
  // Bônus
  streak: {                        // Dias consecutivos
    3_dias: '+ 10 XP',
    7_dias: '+ 25 XP',
    30_dias: '+ 100 XP'
  },
  primeiraVez: 50,               // Primeira aula
  velocidade: '+ XP',            // Completar antes do prazo
}
```

### Níveis e Ranks
```
🥚 Iniciante           (0-500 XP)
🐣 Aprendiz           (500-1.500 XP)
🦆 Desenvolvedor      (1.500-3.500 XP)
🦅 Senior             (3.500-7.000 XP)
🦁 Especialista       (7.000-15.000 XP)
👑 Legend             (15.000+ XP)
```

### Badges (Achievements)
```
BADGE                           | CRITÉRIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 Primeiro Passo              | Completar 1ª aula
⚡ Velocista                   | Completar aula em < 5 min
🎯 Focado                      | 7 dias de streak
🏆 Campeão                     | 30 dias de streak
🔥 Produtivo                   | 5 projetos em 1 mês
💡 Bom Samaritano             | 10 respostas no fórum
📚 Bookworm                    | Ler 20 artigos
🚀 Inovador                    | Projeto com feature extra
👥 Mentor                      | Ajudar 5+ pessoas
⭐ Destaque da Semana          | Escolhido mod (1 projeto)
```

### Leaderboard
```
┌─────────────────────────────────────────┐
│ 🏆 TOP 10 DESTA SEMANA                │
├─────────────────────────────────────────┤
│ 1. João Silva        (1.250 XP) 👑     │
│ 2. Maria Santos      (1.100 XP) 👑     │
│ 3. Pedro Costa       (950 XP)  🦅     │
│ 4. Ana Oliveira      (850 XP)  🦅     │
│ 5. Lucas Alves       (780 XP)  🦅     │
│ 6. Carla Souza       (650 XP)  🦁     │
│ 7. Rafael Silva      (600 XP)  🦁     │
│ 8. Beatriz Lima      (550 XP)  🦁     │
│ 9. Felipe Costa      (500 XP)  🦆     │
│ 10. Marina Oliveira  (450 XP)  🦆     │
└─────────────────────────────────────────┘

// Outras views
├─ Leaderboard Geral (all-time)
├─ Leaderboard por Trilha
├─ Leaderboard Mensal
└─ Meu Rank (onde eu fico no ranking)
```

---

## 👥 COMUNIDADE

### Fórum (Categorias)
```
📌 CATEGORIAS
├─ 🆘 Dúvidas Técnicas
│  ├─ Perguntas de módulos específicos
│  ├─ Bugs em projetos
│  └─ Dificuldades (tags: js, react, etc)
│
├─ 💬 Discussões Gerais
│  ├─ Carreira na tech
│  ├─ Dicas de estudo
│  └─ Oportunidades de trabalho
│
├─ 💼 Projetos e Portfólio
│  ├─ Showcase de trabalhos
│  ├─ Feedback de código
│  └─ Parcerias
│
├─ 📰 Notícias e Atualizações
│  ├─ Novos cursos
│  ├─ Mudanças na plataforma
│  └─ Eventos
│
└─ 🎉 Conquistas
   ├─ "Completei Trilha X!"
   ├─ "Consegui meu 1º job!"
   └─ Comemorações gerais
```

### Sistema de Reputação
```
Ação                      | Reputação | XP Extra
────────────────────────────────────────────────
Resposta útil (upvote)    | +5        | +5
Melhor resposta           | +25       | +25
Pergunta útil             | +10       | +10
Bom comportamento (sem ban)| +1/dia   | 0
```

### Desafios Semanais
```
DESAFIO                    | DURAÇÃO | PRÊMIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Crie um API em 2h"       | 1 semana | 100 XP + Badge
"Refatore seu código"     | 1 semana | 75 XP
"Ensine alguém"           | 2 semanas| 50 XP + Reputação
"Leia um artigo/semana"   | Diário   | 5 XP
```

### Eventos
```
📅 EVENTOS PLANEJADOS

1. Live Coding Sessions
   - Toda quinta 20h
   - Instrutor explica projeto
   - Q&A ao vivo
   - 50 XP participação

2. Desafio do Mês
   - Tema novo todo mês
   - 4 semanas para enviar
   - Votação comunidade
   - Prêmios (XP, Badge)

3. Office Hours
   - Mentores disponíveis
   - Segunda-feira 19h
   - Pode levar dúvidas
   - 25 XP por 30 min

4. Hackathon Trimestral
   - 48 horas intensas
   - Equipes de 3-5 pessoas
   - Prêmios reais
   - 500 XP + Visibilidade
```

---

## 🎨 DESIGN MODERNO (Rocketseat-style)

### Paleta de Cores
```
Primary:    #8B5CF6 (Purple)
Secondary:  #EC4899 (Pink)
Success:    #10B981 (Green)
Warning:    #F59E0B (Amber)
Danger:     #EF4444 (Red)
Dark BG:    #0F172A (Slate-900)
Light BG:   #F8FAFC (Slate-50)
```

### Componentes Chave

#### 1. Card Trilha
```
┌────────────────────────────┐
│ 📚 JavaScript Essencial   │
├────────────────────────────┤
│ ⏱️  4 semanas              │
│ 📊 50 aulas                │
│ 🎯 12 horas de conteúdo   │
│ 👥 5.234 estudantes        │
│                            │
│ ▓▓▓▓░░░░░░░░░░░░░░░░ 25%  │
│ [Continuar Learning] →     │
└────────────────────────────┘
```

#### 2. Card Projeto
```
┌──────────────────────────────────┐
│ 🎯 Todo App                      │
│ Intermediário | 60 min | 100 XP  │
├──────────────────────────────────┤
│ Crie uma aplicação de tarefas   │
│ com React e LocalStorage        │
│                                 │
│ [Requisitos] [Ver Solução] →    │
└──────────────────────────────────┘
```

#### 3. Progress Bar
```
Seu Progresso em JavaScript Essencial

█████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 25%

Aulas: 3/12 | Projetos: 1/6 | XP: 150/500
Próximo: "Módulo 2 - Controle de Fluxo"
```

#### 4. Header do Curso
```
┌─────────────────────────────────────────┐
│ JavaScript Essencial                    │
│ Aprenda programação do ZERO              │
│                                         │
│ ⭐⭐⭐⭐⭐ (4.9) | 5.234 alunos          │
│ Instrutor: João Silva @johnedu          │
│                                         │
│ [Inscrever-se] [Ver Detalhes]          │
└─────────────────────────────────────────┘
```

### Layout Dashboard
```
┌──────────────────────────────────────────────────┐
│ 🎓 Meu Dashboard                                 │
├──────────────────────────────────────────────────┤
│                                                  │
│ 👤 João Silva              📊 1.250 XP (👑 Rank 5)
│ 🔥 7 dias de streak        📚 2 trilhas ativas
│                                                  │
├──────────────────────────────────────────────────┤
│ 📚 CONTINUAR APRENDENDO                         │
│ ┌────────────┬────────────┬────────────┐        │
│ │ React      │ Full Stack │ Intro Py   │        │
│ │ 45% ██░    │ 0% ░░░░░░  │ 78% ███░░  │        │
│ └────────────┴────────────┴────────────┘        │
│                                                  │
│ 🎯 PROJETOS RECENTES                            │
│ ├─ ✅ Todo App (React)                          │
│ ├─ ✅ Blog Pessoal                              │
│ └─ 🔄 Dashboard Criptomoedas (em progresso)    │
│                                                  │
│ 🏆 TOP BADGES                                   │
│ ├─ 🎓 Primeiro Passo                           │
│ ├─ 🔥 Focado (7 dias)                          │
│ └─ 💡 Bom Samaritano                           │
│                                                  │
│ 👥 COMUNIDADE                                   │
│ ├─ 📋 Pergunte algo                             │
│ ├─ 🏆 Ver Leaderboard                          │
│ └─ 🎪 Próximos Eventos                          │
└──────────────────────────────────────────────────┘
```

---

## 🚀 IMPLEMENTAÇÃO NO FUTUROON

### Estrutura de Pastas
```
src/
├─ constants/
│  ├─ trilhas.ts        (Trilhas + módulos)
│  ├─ projetos.ts       (30+ projetos)
│  ├─ badges.ts         (Sistema de badges)
│  └─ gamification.ts   (XP, ranks, etc)
│
├─ components/
│  ├─ TrilhaCard.tsx
│  ├─ ProjetoCard.tsx
│  ├─ ProgressBar.tsx
│  ├─ Leaderboard.tsx
│  ├─ BadgeDisplay.tsx
│  └─ ComunidadeSection.tsx
│
├─ views/
│  ├─ TrilhasView.tsx    (Listagem de trilhas)
│  ├─ TrilhaDetail.tsx   (Detalhes trilha)
│  ├─ ProjetoDetail.tsx  (Projeto + rubrica)
│  ├─ Leaderboard.tsx    (Rankings)
│  ├─ Comunidade.tsx     (Fórum + desafios)
│  └─ MeuProgresso.tsx   (Dashboard)
│
└─ utils/
   ├─ xpCalculator.ts   (Lógica de XP)
   ├─ badgeAwarded.ts   (Quando dar badges)
   └─ gamification.ts   (Toda lógica de gamificação)
```

### Tipos TypeScript (tipos.ts)
```typescript
// Trilhas
interface Trilha {
  id: string;
  titulo: string;
  descricao: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  duracao: number; // horas
  aulas: number;
  modulos: Modulo[];
  xpTotal: number;
  badges: Badge[];
  isPrerequisite?: boolean;
  prerequisiteTrilhaId?: string;
}

// Módulos
interface Modulo {
  id: string;
  titulo: string;
  duracao: number;
  aulas: Aula[];
  projetoFinal: Projeto;
  badge: Badge;
}

// Aula
interface Aula {
  id: string;
  titulo: string;
  conteudo: string;
  duracao: number;
  xp: number;
  videoUrl?: string;
  codigoInicial?: string;
}

// Projeto
interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  duracao: number;
  xp: number;
  nivel: string;
  skills: string[];
  figmaLink: string;
  starterCode: string;
  solucao: string;
  requisitos: string[];
  rubrica: Record<string, number>;
}

// Badges
interface Badge {
  id: string;
  titulo: string;
  descricao: string;
  emoji: string;
  criterio: string;
  raro: boolean;
}

// Gamificação
interface UserGamification {
  xp: number;
  nivel: 'iniciante' | 'aprendiz' | 'desenvolvedor' | 'senior' | 'especialista' | 'legend';
  badges: Badge[];
  streak: number;
  leaderboardRank: number;
}
```

---

## 📊 ROADMAP DE IMPLEMENTAÇÃO

### FASE 1: MVP (2 semanas)
```
✅ Estrutura base de Trilhas
✅ 1 trilha completa (JavaScript Essencial)
✅ Sistema básico de XP
✅ 5 projetos exemplo
✅ Badges básicas
```

### FASE 2: Comunidade (3 semanas)
```
✅ Fórum (categorias básicas)
✅ Desafios semanais
✅ Leaderboard
✅ Sistema de reputação
```

### FASE 3: Polonização (2 semanas)
```
✅ Design final Rocketseat-style
✅ Animações e transições
✅ Dashboard aprimorado
✅ Mobile responsivo
```

### FASE 4: 30+ Projetos (4 semanas)
```
✅ Todos os projetos documentados
✅ Vídeos tutoriais
✅ Soluções completas
✅ Rubricas de avaliação
```

---

## 🎯 MÉTRICAS DE SUCESSO

```
KPI                      | META
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Conclusão de Trilha      | 60%+
Engagement Diário        | 40%+
Participação Fórum       | 20% da base
Projetos Enviados        | 30% dos alunos
Tempo no App             | 2h+/semana
Retenção (30 dias)       | 75%+
NPS (Net Promoter Score) | 7+/10
```

---

## 💡 DIFERENCIAIS DO FUTUROON vs Outras Plataformas

```
FEATURE                    | FUTUROON | Rocketseat | Udemy | Coursera
───────────────────────────┼──────────┼────────────┼───────┼─────────
Gratuito                   | ✅      | ❌ (2024)  | Parcial| Parcial
Localizado PT-BR           | ✅      | ✅         | ❌     | ❌
Comunidade Ativa           | ✅      | ✅         | ❌     | Fraco
Gamificação Completa       | ✅      | ✅         | ❌     | ❌
AI Tutor (Gemini)          | ✅      | ❌         | ❌     | ❌
Para Periféria             | ✅      | ❌         | ❌     | ❌
Mentor 1-on-1              | ✅      | Pago       | ❌     | Pago
```

---

## ✨ PRÓXIMOS PASSOS

1. **Validação com comunidade**
   - Pesquisa: qual trilha querem?
   - Feedback: tipo de projeto?

2. **Criar trilha JavaScript Essencial**
   - 6 módulos
   - 5 projetos
   - Conteúdo + vídeos

3. **Implementar gamificação**
   - Sistema XP
   - Badges
   - Leaderboard

4. **Beta com 100 alunos**
   - Feedback
   - Melhorias
   - Ajustes

---

**Resultado:** Plataforma de aprendizado world-class, grátis, em português, para a periferia! 🚀
