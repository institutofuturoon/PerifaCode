/**
 * Tipos TypeScript para Sistema de Cursos Rocketseat-style
 * Estrutura de Trilhas, Projetos, Gamificação e Comunidade
 */

// ============================================
// TRILHAS E MÓDULOS
// ============================================

export interface Trilha {
  id: string;
  titulo: string;
  descricao: string;
  descricaoLonga: string;
  imagem: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  duracao: number; // em horas
  numAulas: number;
  modulos: Modulo[];
  xpTotal: number;
  badges: Badge[];
  instrutor: {
    id: string;
    nome: string;
    avatar: string;
    bio: string;
  };
  avaliacao: number; // 0-5 stars
  numAlunos: number;
  prerequisito?: string; // trilhaId
  isActive: boolean;
  dataInicio: string;
  dataCriacao: string;
}

export interface Modulo {
  id: string;
  trilhaId: string;
  numero: number;
  titulo: string;
  descricao: string;
  duracao: number; // em horas
  aulas: Aula[];
  projetoFinal: Projeto;
  badge: Badge;
  ordemModulos?: number;
}

export interface Aula {
  id: string;
  moduloId: string;
  numero: number;
  titulo: string;
  descricao: string;
  conteudo: string; // HTML ou Markdown
  duracao: number; // em minutos
  xp: number;
  videoUrl?: string;
  codigoInicial?: string;
  codigoFinal?: string;
  resumo?: string;
  recursos?: Recurso[];
  quiz?: Quiz;
}

export interface Recurso {
  id: string;
  titulo: string;
  url: string;
  tipo: 'artigo' | 'documentacao' | 'github' | 'video';
  descricao?: string;
}

export interface Quiz {
  id: string;
  questoes: Questao[];
  tempoLimite?: number; // em minutos
  notaMinima: number; // % para passar
}

export interface Questao {
  id: string;
  texto: string;
  tipo: 'multipla' | 'verdadeiro-falso' | 'codigo';
  opcoes?: OpCao[];
  resposta: string;
  explicacao: string;
  dificuldade: 'facil' | 'media' | 'dificil';
}

export interface OpCao {
  id: string;
  texto: string;
  correta: boolean;
}

// ============================================
// PROJETOS
// ============================================

export interface Projeto {
  id: string;
  trilhaId: string;
  moduloId: string;
  titulo: string;
  descricao: string;
  descricaoLonga: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  duracao: number; // em minutos
  xpReward: number;
  skills: string[]; // ["React", "JavaScript", "DOM"]
  
  // Links e recursos
  figmaLink?: string;
  repositorioTemplatUrl?: string;
  starterCode: string;
  solucaoCode: string;
  videoTutorialUrl?: string;
  videoSolucaoUrl?: string;
  
  // Requisitos
  requisitos: string[];
  criteriosAceite: string[];
  
  // Rubrica de avaliação
  rubrica: {
    funcionamento: number; // peso em %
    codigo: number;
    criatividade: number;
    documentacao: number;
    performance?: number;
  };
  
  // Comunidade
  forumTopicId?: string;
  exemplosSubmissoes: string[]; // URLs para exemplos aprovados
  numSubmissoes: number;
  
  // Metadata
  dataCriacao: string;
  atualizacao: string;
  isActive: boolean;
}

export interface ProjectSubmission {
  id: string;
  projetoId: string;
  usuarioId: string;
  linkRepositorio: string;
  linkDemo: string;
  descricao: string;
  screenshots: string[];
  status: 'enviado' | 'revisando' | 'aprovado' | 'rejeitado';
  feedback?: string;
  nota?: number;
  dataSubmissao: string;
  dataAvaliacao?: string;
  avaliadoPor?: string;
}

// ============================================
// GAMIFICAÇÃO
// ============================================

export interface Badge {
  id: string;
  titulo: string;
  descricao: string;
  emoji: string;
  icone: string;
  criterio: string;
  raro: boolean;
  dataLancamento: string;
  requisitoXp?: number;
  requisitoAcoes?: Record<string, number>;
}

export interface UserGamification {
  userId: string;
  xpTotal: number;
  nivel: 'ovo' | 'filhote' | 'desenvolvedor' | 'senior' | 'especialista' | 'lenda';
  badges: Badge[];
  leaderboardRank: number;
  leaderboardRankTrilha: Record<string, number>;
  streak: number;
  ultimoAcessoDia: string;
  ultimoXpGanhoDia: number;
}

export interface XPEvent {
  tipo: 'aula_completa' | 'projeto_enviado' | 'desafio_completo' | 'forum_resposta' | 'evento_ao_vivo' | 'streak_bonus';
  xp: number;
  multiplicador?: number; // para streaks
  dataGanho: string;
}

export interface Ranking {
  userId: string;
  nome: string;
  avatar: string;
  xp: number;
  nivel: string;
  posicao: number;
  badge?: Badge;
}

// ============================================
// COMUNIDADE
// ============================================

export interface ForumTopico {
  id: string;
  titulo: string;
  descricao: string;
  autorId: string;
  autor: {
    id: string;
    nome: string;
    avatar: string;
    nivel: string;
  };
  categoria: 'duvidas' | 'discussoes' | 'projetos' | 'noticias' | 'conquistas';
  tags: string[];
  respostasCount: number;
  viewsCount: number;
  respostasUteis: number;
  status: 'aberto' | 'resolvido' | 'pinado';
  dataCriacao: string;
  ultimaAtualizacao: string;
  respostas?: ForumResposta[];
}

export interface ForumResposta {
  id: string;
  topicoId: string;
  autorId: string;
  autor: {
    id: string;
    nome: string;
    avatar: string;
    reputacao: number;
  };
  conteudo: string;
  upvotes: number;
  downvotes: number;
  isSolucao: boolean;
  dataCriacao: string;
  dataEdicao?: string;
}

export interface ChallengesSemanal {
  id: string;
  titulo: string;
  descricao: string;
  descricaoLonga: string;
  dificuldade: 'facil' | 'media' | 'dificil';
  xpReward: number;
  badgeReward?: Badge;
  dataInicio: string;
  dataFim: string;
  participantes: number;
  submissoes: ChallengeSubmission[];
  regras: string[];
}

export interface ChallengeSubmission {
  id: string;
  desafioId: string;
  usuarioId: string;
  linkRepositorio: string;
  descricao: string;
  dataSubmissao: string;
  votosRecebidos: number;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'live_coding' | 'office_hours' | 'hackathon' | 'meetup' | 'webinar';
  instrutor: {
    id: string;
    nome: string;
    avatar: string;
  };
  dataInicio: string;
  duracao: number; // em minutos
  linkZoom?: string;
  descricaoCompleta?: string;
  inscritos: number;
  maxInscritos?: number;
  xpReward: number;
  badgeReward?: Badge;
  isAoVivo: boolean;
  gravacao?: string;
}

// ============================================
// PROGRESSO DO USUÁRIO
// ============================================

export interface ProgressoUsuario {
  userId: string;
  trilhasInscritas: TrilhaProgress[];
  projetosCompletos: string[];
  aulasConcluidas: string[];
  modulosConcluidos: string[];
  xpGanho: XPEvent[];
  badges: Badge[];
  streak: number;
  ultimoAcessoDia: string;
}

export interface TrilhaProgress {
  trilhaId: string;
  percentualConclusao: number; // 0-100
  modulosConcluidos: number;
  totalModulos: number;
  dataInscricao: string;
  dataExpectativaConclusao: string;
  modulos: ModuloProgress[];
  xpGanho: number;
}

export interface ModuloProgress {
  moduloId: string;
  percentualConclusao: number;
  aulasConcluidas: number;
  totalAulas: number;
  projetoCompleto: boolean;
  dataInicio: string;
  dataConclusao?: string;
}

// ============================================
// ANALYTICS E REPORTING
// ============================================

export interface TrilhaAnalytics {
  trilhaId: string;
  totalInscritos: number;
  percentualConclusao: number;
  tempoMedioConclusao: number; // em dias
  taxaAbandonoModulo: Record<string, number>;
  alunosComMelhorDesempenho: string[];
  alunosComDificuldade: string[];
  aulasMaisAssistidas: string[];
  aulasMenosAssistidas: string[];
}

export interface UserAnalytics {
  userId: string;
  tempoTotalEstudo: number; // em minutos
  frequenciaMedia: number; // vezes por semana
  melhorHorario: string; // "20:00" por exemplo
  taxaConclusao: number; // %
  trilhasEmProgresso: number;
  projetosEnviados: number;
  participacaoForum: number; // respostas
  reputacao: number;
}
