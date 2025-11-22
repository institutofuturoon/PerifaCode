# Documentação Técnica - FuturoOn (PerifaCode)

## 1. Visão Geral do Projeto
**Nome:** FuturoOn (Plataforma de Educação Tecnológica)
**Objetivo:** Plataforma de ensino (LMS) focada em inclusão digital para comunidades periféricas, oferecendo cursos de tecnologia, blog, comunidade, eventos e ferramentas administrativas.
**Estilo Visual:** Dark Mode moderno, inspirado na Rocketseat/Vercel, com acentos em Roxo (`#8a4add`) e Rosa (`#f27983`).

---

## 2. Stack Tecnológica

### Frontend
*   **React (v18+):** Biblioteca principal de UI.
*   **TypeScript:** Tipagem estática para robustez.
*   **Tailwind CSS:** Estilização utilitária.
*   **React Router DOM (v6):** Roteamento (SPA).
*   **Vite (Implícito):** Build tool recomendada.

### Backend / Serviços (Serverless)
*   **Firebase Authentication:** Gestão de usuários (Login, Registro, Recuperação de senha).
*   **Firebase Firestore:** Banco de dados NoSQL.
*   **Vercel Blob (Simulado):** Armazenamento de imagens (Avatares, Banners).
*   **Google Gemini API (@google/genai):** Inteligência Artificial para geração de conteúdo, tutor virtual e marketing.

---

## 3. Arquitetura e Gerenciamento de Estado

O projeto utiliza **Context API** do React (`AppContext` em `App.tsx`) como única fonte de verdade (Single Source of Truth) para o estado global. Não há Redux ou Zustand.

### Fluxo de Dados
1.  **Inicialização:** O `App.tsx` carrega dados do Firestore (`users`, `courses`, `articles`, etc.) e verifica a autenticação via Firebase.
2.  **Fallback/Mocks:** Se o Firestore falhar ou estiver vazio, o sistema carrega dados fictícios de `constants.ts` para garantir que a UI funcione (modo de demonstração híbrido).
3.  **Contexto:** Dados e funções de manipulação (ex: `handleSaveCourse`, `handleEnroll`) são passados via `AppContext.Provider`.

---

## 4. Estrutura de Arquivos

```text
/
├── index.html          # Ponto de entrada (Tailwind CDN e Fontes)
├── index.tsx           # Montagem do React
├── App.tsx             # Provedor de Contexto, Rotas e Lógica Global
├── firebaseConfig.ts   # Configuração do Firebase
├── types.ts            # Interfaces TypeScript (Modelos de Dados)
├── constants.ts        # Dados Mockados (Fallback)
├── PROJECT_DOCUMENTATION.md # Este arquivo
│
├── assets/             # Imagens estáticas e Logos (SVG components)
│
├── components/         # Componentes Reutilizáveis
│   ├── Header.tsx, Footer.tsx
│   ├── DashboardSidebar.tsx (Navegação logada)
│   ├── CourseCard.tsx, ArticleCard.tsx, ProjectCard.tsx
│   ├── RichContentEditor.tsx (Editor de texto com suporte a Markdown)
│   ├── Uploader.tsx (Componente de upload de imagem)
│   ├── CodePlayground.tsx, QuizExercise.tsx (Ferramentas de aula)
│   ├── SEO.tsx, AnalyticsTracker.tsx
│   └── ... (Modais, Badges, Alerts)
│
└── views/              # Páginas (Telas)
    ├── Home.tsx, AboutUsView.tsx, DonateView.tsx (Institucionais)
    ├── Login.tsx, Register.tsx (Auth)
    ├── Dashboard.tsx (Hub central do usuário/admin)
    ├── Courses.tsx, CourseDetail.tsx, LessonView.tsx (LMS)
    ├── CourseEditor.tsx, ArticleEditor.tsx (CMS Admin)
    ├── MarketingGeneratorView.tsx (Ferramenta de IA)
    ├── CommunityView.tsx, ForumView.tsx (Social)
    └── ... (Outras views específicas)
```

---

## 5. Estrutura do Banco de Dados (Firestore)

O banco de dados é **NoSQL**, orientado a documentos. Abaixo estão as principais coleções, suas estruturas e a lógica de relacionamento.

### 5.1. Coleção `users` (Usuários)
Armazena perfil, progresso e permissões. O ID do documento é o UID do Firebase Auth.
```json
{
  "id": "UID_DO_FIREBASE",
  "name": "Nome do Aluno",
  "email": "aluno@email.com",
  "role": "student" | "instructor" | "admin",
  "xp": 1200, // Gamificação
  "completedLessonIds": ["lesson_id_1", "lesson_id_2"], // Rastreio de progresso
  "profileStatus": "complete", // Controle de Onboarding
  "accountStatus": "active",
  "notificationPreferences": { ... },
  "notes": { "lesson_id_1": "Minha anotação pessoal..." }, // Sub-mapa de anotações
  "avatarUrl": "url_da_imagem",
  "bannerUrl": "url_da_imagem"
}
```

### 5.2. Coleção `courses` (Cursos)
Contém todo o conteúdo educacional.
**Nota Arquitetural:** Módulos e Aulas são armazenados como **arrays aninhados** dentro do documento do curso, e não em subcoleções. Isso reduz leituras no banco para exibir a árvore do curso, ideal para este porte de aplicação (até ~500 aulas por curso).
```json
{
  "id": "course_id",
  "title": "C# Backend",
  "instructorId": "user_id_instrutor", // Relacionamento com users
  "track": "Backend", // Categoria
  "modules": [
    {
      "id": "mod_1",
      "title": "Fundamentos",
      "lessons": [
        {
          "id": "lesson_1",
          "title": "Variáveis",
          "type": "video" | "text",
          "mainContent": "Conteúdo em Markdown...", // Suporta Rich Text
          "videoUrl": "youtube_url",
          "xp": 50
        }
      ]
    }
  ],
  "enrollmentStatus": "open",
  "heroContent": { ... }, // Dados para Landing Page Dinâmica
  "seo": { "metaTitle": "...", "keywords": [...] } // Otimização de busca
}
```

### 5.3. Coleção `projects` (Portfólio)
Projetos submetidos pelos alunos na comunidade.
```json
{
  "id": "project_id",
  "authorId": "user_id", // Relacionamento com users
  "title": "Meu App React",
  "technologies": ["React", "Firebase"],
  "status": "approved" | "pending" | "rejected", // Moderação
  "claps": 15,
  "comments": [ // Array simples para comentários
    { "authorId": "user_id", "text": "Muito bom!", "createdAt": "..." }
  ]
}
```

### 5.4. Coleção `communityPosts` (Fórum)
Dúvidas e discussões gerais.
```json
{
  "id": "post_id",
  "authorId": "user_id",
  "type": "question" | "discussion",
  "title": "Erro no useEffect",
  "content": "Markdown...",
  "tags": ["react", "hooks"],
  "isSolved": false,
  "replies": [
      { "id": "r1", "authorId": "user_id", "content": "Tente isso..." }
  ]
}
```

### 5.5. Outras Coleções
*   **`articles`**: Posts do blog oficial (CMS interno).
*   **`events`**: Agenda de lives e workshops com instrutores.
*   **`partners`**: Empresas parceiras (Logos, descrições) para a página de Apoio.
*   **`marketingPosts`**: Histórico de posts gerados pela IA para redes sociais.
*   **`financialStatements` / `annualReports`**: Dados de transparência da ONG para exibição pública.

---

## 6. Design System e UI Kit

A identidade visual foi construída para ser **"Dark Mode First"**, evocando modernidade, tecnologia e o universo "espacial/futurista".

### Cores Principais
*   **Background:** `#09090B` (Zinco Profundo) - Usado como fundo principal.
*   **Surface/Cards:** `#121212` ou `bg-white/5` (Glassmorphism) - Usado em painéis e cartões.
*   **Primary (Acento):** `#8a4add` (Roxo Vibrante) - Usado em botões primários, links e destaques.
*   **Secondary (Gradiente):** `#f27983` (Rosa Coral) - Usado em gradientes de texto e detalhes de UI.
*   **Text:** `#FFFFFF` (Títulos), `#D1D5DB` (Parágrafos/Body), `#9CA3AF` (Legendas).

### Tipografia
*   **Família:** `Inter` (Google Fonts).
*   **Estilo:** Sans-serif, geométrica, altamente legível em telas.

### Componentes Visuais Chave
1.  **Glassmorphism:** Uso extensivo de `backdrop-blur-xl`, `bg-white/5` e bordas sutis `border-white/10`.
2.  **Gradientes de Texto:** `bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]`.
3.  **Aurora Background:** Efeitos de luz de fundo (blobs) animados usando CSS puro.
4.  **Grid Pattern:** Fundo sutil de grade para dar textura técnica.

---

## 7. Integrações de Inteligência Artificial (Gemini)

O projeto faz uso extensivo da API `google/genai` para empoderar alunos e administradores:

1.  **Tutor IA (`LessonView.tsx`):**
    *   Um chat flutuante dentro da aula.
    *   **Contexto:** O prompt injeta automaticamente o conteúdo da aula atual.
    *   **Função:** Responde dúvidas específicas sobre o material sem alucinar sobre outros tópicos.

2.  **Gerador de Estrutura de Curso (`CourseEditor.tsx`):**
    *   Gera módulos e aulas automaticamente baseado em um tópico (ex: "React Avançado").
    *   Retorna JSON estruturado para preencher o formulário.

3.  **Otimização de SEO (`CourseEditor.tsx`):**
    *   Lê o título e descrição do curso e sugere Meta Title, Description e Keywords otimizadas.

4.  **Marketing Studio (`MarketingGeneratorView.tsx`):**
    *   Gera posts para redes sociais (Instagram, LinkedIn, Twitter).
    *   **Multimodal:** Aceita upload de imagem de referência ou prompt de texto.
    *   Gera imagens via `gemini-2.5-flash-image` se nenhuma for fornecida.

---

## 8. Acessibilidade (WCAG) e Inclusão

Como uma plataforma focada em impacto social, a acessibilidade é prioritária:

1.  **Semântica HTML:** Uso correto de `<header>`, `<main>`, `<nav>`, `<article>`, `<section>`.
2.  **Contraste:** O tema escuro mantém alto contraste entre texto e fundo (verificado nas cores escolhidas).
3.  **Navegação por Teclado:** Modais (`ProfileModal`, `InscriptionFormModal`) capturam o foco e fecham com `Esc`.
4.  **ARIA Labels:** Botões com ícones possuem `aria-label` descritivos (ex: "Fechar menu", "Tutor IA").
5.  **Textos Alternativos:** Todas as imagens de conteúdo possuem atributos `alt`.

---

## 9. Variáveis de Ambiente

Para rodar o projeto em produção ou conectar a serviços reais, as seguintes variáveis são esperadas (embora o projeto atual use configurações hardcoded para demonstração em `firebaseConfig.ts` e `Uploader.tsx`):

```env
# Chaves de API
API_KEY=sua_chave_google_gemini
FIREBASE_API_KEY=sua_chave_firebase
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto_id

# Upload (Vercel Blob)
VERCEL_BLOB_READ_WRITE_TOKEN=sua_chave_blob_rw

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

*Nota: Em ambiente de demonstração atual, as chaves estão integradas no código fonte para facilitar a visualização e testes imediatos sem configuração de ambiente.*

---

## 10. Guia para Expansão (Próximos Passos)

Se você for uma IA ou desenvolvedor assumindo o projeto:

1.  **Backend de Upload:** Substituir a lógica do `Uploader.tsx` e a rota `/api/upload` por um backend seguro que gere tokens temporários (SAS) ou faça upload via presigned URLs, removendo o token de teste do frontend.
2.  **Segurança Firebase:** Configurar `Security Rules` no Firestore para impedir que alunos editem cursos ou que usuários comuns acessem dados administrativos (`role != 'admin'`).
3.  **Pagamentos:** Integrar gateway de pagamento (Stripe/Pagar.me) na view `DonateView.tsx` para processar doações reais (atualmente é apenas informativo/PIX estático).
4.  **Performance:** Implementar paginação ou *infinite scroll* no carregamento de coleções grandes (ex: `communityPosts`) em `App.tsx`. Atualmente, ele carrega tudo na inicialização, o que não escala para milhares de registros.
5.  **PWA:** Adicionar `manifest.json` e Service Workers para permitir instalação como aplicativo mobile.

---

## 11. Como Rodar Localmente

1.  Certifique-se de ter Node.js instalado.
2.  Instale dependências (se houver `package.json`) ou use o ambiente baseado em ESM/CDN conforme configurado no `index.html` (importmap).
3.  Este projeto foi desenhado para rodar diretamente em ambientes como StackBlitz ou Vercel sem build complexo, graças ao uso de módulos ES6 no browser.
4.  Para desenvolvimento local tradicional:
    *   `npm install`
    *   `npm run dev` (Vite)
