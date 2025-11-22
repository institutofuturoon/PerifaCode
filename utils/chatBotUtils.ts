import { FAQ } from '../types';

// Levenshtein distance para similaridade de strings
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

// Calcular similaridade (0-1)
export function stringSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLen = Math.max(str1.length, str2.length);
  return Math.max(0, 1 - distance / maxLen);
}

// Extrair keywords da mensagem
export function extractKeywords(message: string): string[] {
  const stopwords = [
    'o',
    'a',
    'de',
    'e',
    'é',
    'para',
    'como',
    'qual',
    'por',
    'que',
    'um',
    'uma',
    'os',
    'as',
    'em',
    'à',
    'ao',
  ];

  const words = message
    .toLowerCase()
    .replace(/[^a-záéíóúñü0-9\s]/g, '') // Remove pontuação
    .split(/\s+/)
    .filter((word) => !stopwords.includes(word) && word.length > 2);

  return [...new Set(words)]; // Remove duplicatas
}

// Buscar FAQs similares
export function searchSimilarFAQs(keywords: string[], faqs: FAQ[]): FAQ[] {
  const scored = faqs.map((faq) => {
    let matchScore = 0;

    // Contar matches de keywords
    const matchedKeywords = keywords.filter((kw) =>
      faq.keywords.some((faqKw) => stringSimilarity(kw, faqKw) > 0.7)
    ).length;

    matchScore = (matchedKeywords / Math.max(keywords.length, 1)) * 100;

    // Aumentar score se a pergunta do usuário é similar à pergunta FAQ
    const questionSimilarity = keywords.length > 0
      ? keywords.reduce((acc, kw) => acc + stringSimilarity(kw, faq.question), 0) / keywords.length * 20
      : 0;

    return { faq, score: matchScore + questionSimilarity };
  });

  return scored
    .filter((item) => item.score > 30) // Apenas matches > 30%
    .sort((a, b) => b.score - a.score)
    .map((item) => item.faq);
}

// Calcular confiança da resposta
export function calculateConfidence(faq: FAQ | undefined, matchedKeywords: number, totalKeywords: number): number {
  if (!faq) return 0;

  const baseScore = faq.effectiveness || 50;
  const keywordMatchRate = totalKeywords > 0 ? (matchedKeywords / totalKeywords) * 50 : 0;
  const usageBoost = Math.min(faq.usageCount / 50, 20); // Max 20 points

  return Math.min(baseScore * 0.5 + keywordMatchRate + usageBoost, 100);
}

// Formatar resposta do FAQ para o aluno
export function formatFaqResponse(faq: FAQ, alunoDuvida: string): string {
  let response = `🎓 Ótima pergunta!\n\n${faq.answer}`;

  if (faq.videoUrl) {
    response += `\n\n[📺 Ver vídeo explicativo](${faq.videoUrl})`;
  }

  if (faq.linkToMaterial) {
    response += `\n[📄 Material complementar](${faq.linkToMaterial})`;
  }

  response += `\n\nAjudou? [👍 Sim] [👎 Não] [🤔 Parcial]`;

  return response;
}

// Formatar resposta de escalada
export function formatEscalationResponse(): string {
  return `
Hmm, essa é uma pergunta mais específica 🤔

Não tenho uma resposta pronta, mas vou chamar seu mentor para ajudar!

Enquanto isso:
• Tenta pesquisar no YouTube
• Lê o material da aula
• Pergunta no fórum

Seu mentor vai responder em breve! ⏰
  `.trim();
}

// Formatar resposta motivacional
export function formatMotivationalResponse(alunoDuvida: string): string {
  const responses = [
    `Oi! Entendo que pode ser desafiador, mas deixa eu te contar:\n\nVocê JÁ está aqui, tentando! 💪\nEssa é a parte mais importante!\n\nA dificuldade que você sente agora significa que está crescendo. Continue! 🚀`,
    `Acredita em você! 💙\n\nVocê já começou, já fez passos! Cada pequeno progresso conta.\n\nQual parte específica está difícil? Posso ajudar mais! 🤝`,
    `Não desista agora! 🌟\n\nAlunos como você (iniciantes) normalmente levam 4-6 semanas.\nVocê tá no caminho certo!\n\n[Chat com seu mentor] [Próxima aula]`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

// Detectar sentimento da mensagem
export function detectSentiment(message: string): 'positive' | 'negative' | 'neutral' | 'help' {
  const lowerMessage = message.toLowerCase();

  const negativeWords = [
    'difícil',
    'não consigo',
    'muito difícil',
    'impossível',
    'não entendo',
    'perdido',
    'confuso',
    'frustrado',
    'desistir',
  ];

  const positiveWords = ['consegui', 'entendi', 'claro', 'obrigado', 'valeu', 'perfeito', 'maravilha'];

  const helpWords = ['ajuda', 'como fazer', 'qual é', 'qual', 'como', 'erro', 'bug', 'problema'];

  let sentiment: 'positive' | 'negative' | 'neutral' | 'help' = 'neutral';

  if (negativeWords.some((word) => lowerMessage.includes(word))) {
    sentiment = 'negative';
  } else if (positiveWords.some((word) => lowerMessage.includes(word))) {
    sentiment = 'positive';
  } else if (helpWords.some((word) => lowerMessage.includes(word))) {
    sentiment = 'help';
  }

  return sentiment;
}

// Formatar timestamp para display
export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora mesmo';
  if (diffMins < 60) return `${diffMins}m atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;

  return date.toLocaleDateString('pt-BR');
}
