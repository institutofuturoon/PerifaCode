/**
 * Dados de Exemplo para Sistema de Cursos Rocketseat-style
 * Trilhas, Projetos, Badges, Comunidade
 */

import { Trilha, Modulo, Aula, Projeto, Badge, ChallengesSemanal, Evento } from './TIPOS_CURSO_ROCKETSEAT';

// ============================================
// BADGES
// ============================================

export const BADGES: Badge[] = [
  {
    id: 'badge_first_step',
    titulo: 'Primeiro Passo',
    descricao: 'Completou sua primeira aula',
    emoji: '🎓',
    icone: 'graduation-cap',
    criterio: 'Completar 1 aula',
    raro: false,
    dataLancamento: '2024-01-01',
  },
  {
    id: 'badge_velocista',
    titulo: 'Velocista',
    descricao: 'Completou uma aula em menos de 5 minutos',
    emoji: '⚡',
    icone: 'zap',
    criterio: 'Completar aula em < 5 min',
    raro: true,
    dataLancamento: '2024-01-01',
  },
  {
    id: 'badge_focado',
    titulo: 'Focado',
    descricao: '7 dias de streak em estudo',
    emoji: '🎯',
    icone: 'target',
    criterio: 'Streak de 7 dias',
    raro: false,
    dataLancamento: '2024-01-01',
  },
  {
    id: 'badge_campeao',
    titulo: 'Campeão',
    descricao: '30 dias de streak em estudo',
    emoji: '🏆',
    icone: 'trophy',
    criterio: 'Streak de 30 dias',
    raro: true,
    dataLancamento: '2024-01-01',
  },
  {
    id: 'badge_bom_samaritano',
    titulo: 'Bom Samaritano',
    descricao: 'Respondeu 10 dúvidas no fórum',
    emoji: '💡',
    icone: 'heart',
    criterio: '10 respostas úteis no fórum',
    raro: false,
    dataLancamento: '2024-01-01',
  },
  {
    id: 'badge_inovador',
    titulo: 'Inovador',
    descricao: 'Projeto com funcionalidades extras',
    emoji: '🚀',
    icone: 'rocket',
    criterio: 'Enviar projeto com features extras',
    raro: true,
    dataLancamento: '2024-01-01',
  },
];

// ============================================
// PROJETOS EXEMPLO
// ============================================

export const PROJETOS_EXEMPLO: Projeto[] = [
  {
    id: 'proj_calculadora',
    trilhaId: 'trilha_js_essencial',
    moduloId: 'mod_js_1',
    titulo: 'Calculadora Simples',
    descricao: 'Crie uma calculadora com operações básicas',
    descricaoLonga: `Neste projeto você vai criar sua primeira aplicação JavaScript!
    
    Aprenderás:
    - Variáveis e tipos
    - Operadores matemáticos
    - Manipulação do DOM
    - Event Listeners
    
    Será uma calculadora que faz operações básicas (+ - * /) com interface bonita.`,
    nivel: 'iniciante',
    duracao: 30,
    xpReward: 50,
    skills: ['JavaScript', 'DOM', 'Eventos'],
    figmaLink: 'https://figma.com/file/...',
    repositorioTemplatUrl: 'https://github.com/...',
    starterCode: `
      <div class="calculator">
        <input type="text" id="display" readonly>
        <div class="buttons">
          <!-- adicione os botões aqui -->
        </div>
      </div>
    `,
    solucaoCode: `
      class Calculator {
        constructor() {
          this.display = document.getElementById('display');
          this.setupButtons();
        }
        // implementação completa
      }
    `,
    videoTutorialUrl: 'https://youtube.com/...',
    requisitos: [
      'Display mostra números digitados',
      'Operações básicas funcionam',
      'Botão C limpa o display',
      'Interface responsiva',
    ],
    criteriosAceite: [
      'Todas as operações funcionam corretamente',
      'Código é legível e bem organizado',
      'Botões funcionam no mobile',
      'Sem erros no console',
    ],
    rubrica: {
      funcionamento: 40,
      codigo: 30,
      criatividade: 20,
      documentacao: 10,
    },
    numSubmissoes: 234,
    dataCriacao: '2024-01-01',
    atualizacao: '2024-01-15',
    isActive: true,
  },
  {
    id: 'proj_todo_app',
    trilhaId: 'trilha_js_essencial',
    moduloId: 'mod_js_4',
    titulo: 'Todo App',
    descricao: 'Aplicação completa de tarefas com localStorage',
    descricaoLonga: `Crie uma aplicação profissional de gerenciamento de tarefas!
    
    Características:
    - Adicionar/remover tarefas
    - Marcar como completa
    - Persistência com localStorage
    - Animações suaves
    - Design moderno`,
    nivel: 'iniciante',
    duracao: 60,
    xpReward: 100,
    skills: ['JavaScript', 'DOM', 'localStorage', 'CSS'],
    videoTutorialUrl: 'https://youtube.com/...',
    requisitos: [
      'Adicionar novas tarefas',
      'Marcar como concluída',
      'Deletar tarefas',
      'Dados persistem no navegador',
    ],
    criteriosAceite: [
      'Todas funcionalidades funcionam',
      'Design responsivo',
      'Sem erros',
      'Código bem estruturado',
    ],
    rubrica: {
      funcionamento: 40,
      codigo: 30,
      criatividade: 20,
      documentacao: 10,
    },
    numSubmissoes: 567,
    dataCriacao: '2024-01-05',
    atualizacao: '2024-01-20',
    isActive: true,
  },
];

// ============================================
// TRILHAS EXEMPLO
// ============================================

export const TRILHAS_EXEMPLO: Trilha[] = [
  {
    id: 'trilha_js_essencial',
    titulo: 'JavaScript Essencial',
    descricao: 'Aprenda programação do ZERO com JavaScript',
    descricaoLonga: `Trilha completa de JavaScript para iniciantes absolutos!
    
    Você aprenderá desde conceitos básicos até manipulação do DOM.
    Inclui 6 projetos práticos do mundo real.
    
    Ao final você estará pronto para aprender React ou Vue.`,
    imagem: 'https://via.placeholder.com/300x200',
    nivel: 'iniciante',
    duracao: 12,
    numAulas: 50,
    modulos: [],
    xpTotal: 500,
    badges: [BADGES[0], BADGES[1], BADGES[2]],
    instrutor: {
      id: 'inst_joao',
      nome: 'João Silva',
      avatar: 'https://via.placeholder.com/100',
      bio: 'Dev Full Stack com 10 anos de experiência',
    },
    avaliacao: 4.9,
    numAlunos: 5234,
    isActive: true,
    dataCriacao: '2024-01-01',
    dataInicio: '2024-01-15',
  },
  {
    id: 'trilha_react_fundamentos',
    titulo: 'React Fundamentos',
    descricao: 'Domine a biblioteca React do ZERO',
    descricaoLonga: `Trilha intermediária de React.
    
    Pré-requisito: JavaScript Essencial
    
    Aprenda React components, hooks, state management.
    7 projetos progressivos.`,
    imagem: 'https://via.placeholder.com/300x200',
    nivel: 'intermediario',
    duracao: 15,
    numAulas: 60,
    modulos: [],
    xpTotal: 750,
    badges: [BADGES[2], BADGES[3], BADGES[4]],
    instrutor: {
      id: 'inst_maria',
      nome: 'Maria Santos',
      avatar: 'https://via.placeholder.com/100',
      bio: 'React Expert, palestrante em conferências',
    },
    avaliacao: 4.8,
    numAlunos: 2341,
    prerequisito: 'trilha_js_essencial',
    isActive: true,
    dataCriacao: '2024-02-01',
    dataInicio: '2024-02-15',
  },
];

// ============================================
// DESAFIOS SEMANAIS
// ============================================

export const DESAFIOS_SEMANAIS: ChallengesSemanal[] = [
  {
    id: 'challenge_week1',
    titulo: 'Crie um API em 2 horas',
    descricao: 'Desafio: Construir uma API REST funcional em Node.js',
    descricaoLonga: `Você tem 2 horas para criar um API REST completo!

    Requisitos:
    - Endpoints GET, POST, DELETE
    - Dados persistem (Firestore ou JSON)
    - Validação básica
    - Documentação no README
    
    Ganhe 100 XP + Badge Inovador!`,
    dificuldade: 'medio',
    xpReward: 100,
    badgeReward: BADGES[5],
    dataInicio: '2024-12-16',
    dataFim: '2024-12-23',
    participantes: 45,
    submissoes: [],
    regras: [
      'Máximo 2 horas de desenvolvimento',
      'Código deve estar no GitHub',
      'API deve estar funcionando',
      'Documentação no README obrigatória',
    ],
  },
  {
    id: 'challenge_week2',
    titulo: 'Refatore seu código',
    descricao: 'Melhore a qualidade de algum projeto anterior',
    descricaoLonga: `Escolha um de seus projetos antigos e refatore!

    Focos:
    - Melhorar legibilidade
    - Aplicar padrões de design
    - Otimizar performance
    - Adicionar testes
    
    Ganhe 75 XP + visibilidade!`,
    dificuldade: 'facil',
    xpReward: 75,
    dataInicio: '2024-12-23',
    dataFim: '2024-12-30',
    participantes: 28,
    submissoes: [],
    regras: [
      'Refatore código próprio',
      'Antes/depois no GitHub',
      'Explique mudanças no PR',
    ],
  },
];

// ============================================
// EVENTOS
// ============================================

export const EVENTOS: Evento[] = [
  {
    id: 'event_live1',
    titulo: 'Live Coding: Construindo um Blog com React',
    descricao: 'Aprenda a criar um blog profissional em tempo real',
    tipo: 'live_coding',
    instrutor: {
      id: 'inst_maria',
      nome: 'Maria Santos',
      avatar: 'https://via.placeholder.com/100',
    },
    dataInicio: '2024-12-19T20:00:00',
    duracao: 120,
    linkZoom: 'https://zoom.us/...',
    descricaoCompleta: `
      Nesta live vamos criar um blog completo do zero!
      
      Tópicos:
      - Setup inicial do projeto
      - Componentes reutilizáveis
      - Roteamento com React Router
      - Deploy no Vercel
      
      Traga suas dúvidas!
    `,
    inscritos: 234,
    xpReward: 50,
    isAoVivo: true,
  },
  {
    id: 'event_hackathon',
    titulo: 'Hackathon FuturoOn 2024',
    descricao: '48 horas criando o futuro da educação',
    tipo: 'hackathon',
    instrutor: {
      id: 'inst_admin',
      nome: 'Admin',
      avatar: 'https://via.placeholder.com/100',
    },
    dataInicio: '2024-12-20T08:00:00',
    duracao: 2880, // 48 horas
    descricaoCompleta: `
      Hackathon de 48 horas com foco em tecnologia educacional!
      
      Temas:
      1. Gamificação em Educação
      2. AI para Tutoria
      3. Comunidade Estudantil
      
      Prêmios:
      - 1º lugar: R$ 500 + Mentoría 3 meses
      - 2º lugar: R$ 300
      - 3º lugar: R$ 100
      
      + 500 XP para todos os participantes!
    `,
    inscritos: 85,
    maxInscritos: 150,
    xpReward: 500,
    badgeReward: BADGES[3],
    isAoVivo: false,
  },
];

// ============================================
// TRILHAS COMPLETAS (com módulos)
// ============================================

export const TRILHA_JS_COMPLETA: Trilha = {
  id: 'trilha_js_essencial',
  titulo: 'JavaScript Essencial',
  descricao: 'Aprenda programação do ZERO com JavaScript',
  descricaoLonga: 'Trilha completa...',
  imagem: 'https://via.placeholder.com/300x200',
  nivel: 'iniciante',
  duracao: 12,
  numAulas: 50,
  xpTotal: 500,
  badges: [BADGES[0], BADGES[1], BADGES[2]],
  instrutor: {
    id: 'inst_joao',
    nome: 'João Silva',
    avatar: 'https://via.placeholder.com/100',
    bio: 'Dev Full Stack com 10 anos',
  },
  avaliacao: 4.9,
  numAlunos: 5234,
  isActive: true,
  dataCriacao: '2024-01-01',
  dataInicio: '2024-01-15',
  modulos: [
    {
      id: 'mod_js_1',
      trilhaId: 'trilha_js_essencial',
      numero: 1,
      titulo: 'Fundamentos JavaScript',
      descricao: 'Conceitos básicos de programação',
      duracao: 2,
      aulas: [
        {
          id: 'aula_js_1_1',
          moduloId: 'mod_js_1',
          numero: 1,
          titulo: 'O que é JavaScript?',
          descricao: 'Introdução à linguagem',
          conteudo: '<h2>O que é JavaScript?</h2><p>JavaScript é uma linguagem de programação...</p>',
          duracao: 20,
          xp: 10,
          videoUrl: 'https://youtube.com/...',
        },
        {
          id: 'aula_js_1_2',
          moduloId: 'mod_js_1',
          numero: 2,
          titulo: 'Variáveis e Tipos',
          descricao: 'Declarar e usar variáveis',
          conteudo: '<h2>Variáveis</h2><p>Variáveis são containers para armazenar dados...</p>',
          duracao: 25,
          xp: 15,
          videoUrl: 'https://youtube.com/...',
        },
      ],
      projetoFinal: PROJETOS_EXEMPLO[0],
      badge: BADGES[0],
    },
    {
      id: 'mod_js_4',
      trilhaId: 'trilha_js_essencial',
      numero: 4,
      titulo: 'Objetos e Arrays',
      descricao: 'Estruturas de dados importantes',
      duracao: 2,
      aulas: [],
      projetoFinal: PROJETOS_EXEMPLO[1],
      badge: BADGES[1],
    },
  ],
};
