import { Lesson } from '../types';

export interface LessonTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    template: Omit<Lesson, 'id'>;
}

export const LESSON_TEMPLATES: LessonTemplate[] = [
    {
        id: 'video-lesson',
        name: 'Aula em Vídeo',
        description: 'Aula baseada em vídeo com objetivo e resumo',
        icon: '📹',
        template: {
            title: 'Nova Aula em Vídeo',
            duration: '30 min',
            type: 'video',
            xp: 150,
            videoUrl: '',
            objective: '## Objetivo\n\nAo final desta aula, você será capaz de:\n- Entender o conceito principal\n- Aplicar na prática\n- Resolver problemas relacionados',
            mainContent: '',
            complementaryMaterial: '## Material Complementar\n\n- [Link para documentação](#)\n- [Artigo relacionado](#)\n- [Exercícios práticos](#)',
            summary: '## Resumo\n\nNesta aula você aprendeu:\n1. Conceito principal\n2. Aplicação prática\n3. Melhores práticas'
        }
    },
    {
        id: 'text-lesson',
        name: 'Aula Teórica',
        description: 'Aula baseada em texto com estrutura completa',
        icon: '📄',
        template: {
            title: 'Nova Aula Teórica',
            duration: '20 min',
            type: 'text',
            xp: 100,
            objective: '## Objetivo\n\nNesta aula você vai aprender sobre...',
            mainContent: '# Introdução\n\nConteúdo principal da aula.\n\n## Tópico 1\n\nExplicação detalhada...\n\n## Tópico 2\n\nMais conteúdo...\n\n## Conclusão\n\nResumo dos pontos principais.',
            complementaryMaterial: '## Leituras Recomendadas\n\n- Artigo 1\n- Artigo 2',
            summary: '## Pontos-Chave\n\n- Ponto 1\n- Ponto 2\n- Ponto 3'
        }
    },
    {
        id: 'hands-on',
        name: 'Aula Prática',
        description: 'Aula focada em exercícios e prática',
        icon: '💻',
        template: {
            title: 'Nova Aula Prática',
            duration: '45 min',
            type: 'text',
            xp: 200,
            objective: '## Objetivo\n\nColocar em prática os conceitos aprendidos através de exercícios.',
            mainContent: '# Exercício Prático\n\n## Desafio\n\nDescrição do desafio...\n\n## Passo a Passo\n\n1. Primeiro passo\n2. Segundo passo\n3. Terceiro passo\n\n## Dicas\n\n💡 Dica importante\n\n## Solução\n\n```javascript\n// Código de exemplo\n```',
            complementaryMaterial: '## Recursos Adicionais\n\n- Documentação oficial\n- Exemplos de código\n- Projetos similares',
            summary: '## O que você praticou\n\n- Habilidade 1\n- Habilidade 2\n- Habilidade 3'
        }
    },
    {
        id: 'project',
        name: 'Projeto Guiado',
        description: 'Aula de projeto com instruções detalhadas',
        icon: '🎯',
        template: {
            title: 'Novo Projeto',
            duration: '60 min',
            type: 'text',
            xp: 300,
            objective: '## Objetivo do Projeto\n\nConstruir um projeto completo aplicando os conceitos aprendidos.',
            mainContent: '# Projeto: [Nome do Projeto]\n\n## Descrição\n\nO que vamos construir...\n\n## Requisitos\n\n- Requisito 1\n- Requisito 2\n\n## Etapas de Desenvolvimento\n\n### Etapa 1: Setup\n\nInstruções...\n\n### Etapa 2: Desenvolvimento\n\nInstruções...\n\n### Etapa 3: Finalização\n\nInstruções...\n\n## Resultado Esperado\n\nDescrição do resultado final.',
            complementaryMaterial: '## Recursos do Projeto\n\n- Arquivos iniciais\n- Assets necessários\n- Referências de design',
            summary: '## Conquistas\n\n✅ Projeto completo\n✅ Conceitos aplicados\n✅ Portfolio atualizado'
        }
    },
    {
        id: 'quiz',
        name: 'Aula com Quiz',
        description: 'Aula teórica seguida de quiz de fixação',
        icon: '❓',
        template: {
            title: 'Nova Aula com Quiz',
            duration: '25 min',
            type: 'text',
            xp: 120,
            objective: '## Objetivo\n\nAprender e fixar conceitos através de teoria e prática.',
            mainContent: '# Conteúdo Teórico\n\n## Conceito Principal\n\nExplicação...\n\n## Exemplos\n\nExemplos práticos...\n\n---\n\n## Quiz de Fixação\n\nAo final desta aula, você responderá um quiz para testar seus conhecimentos.',
            complementaryMaterial: '## Material de Apoio\n\n- Resumo em PDF\n- Flashcards\n- Exercícios extras',
            summary: '## Revisão\n\nAntes do quiz, revise:\n- Conceito 1\n- Conceito 2\n- Conceito 3',
            exerciseId: '' // Será preenchido depois
        }
    },
    {
        id: 'introduction',
        name: 'Aula Introdutória',
        description: 'Primeira aula de um módulo ou curso',
        icon: '🚀',
        template: {
            title: 'Introdução ao Módulo',
            duration: '15 min',
            type: 'video',
            xp: 50,
            videoUrl: '',
            objective: '## Bem-vindo!\n\nNesta aula introdutória você vai conhecer:\n- O que vamos aprender\n- Por que é importante\n- Como será a jornada',
            mainContent: '# Bem-vindo ao Módulo!\n\n## O que você vai aprender\n\nVisão geral dos tópicos...\n\n## Pré-requisitos\n\nO que você precisa saber antes...\n\n## Estrutura do Módulo\n\nComo as aulas estão organizadas...',
            complementaryMaterial: '## Prepare-se\n\n- Ferramentas necessárias\n- Configuração do ambiente\n- Recursos úteis',
            summary: '## Próximos Passos\n\nAgora que você conhece o módulo, vamos começar!'
        }
    },
    {
        id: 'recap',
        name: 'Aula de Revisão',
        description: 'Revisão e consolidação de conteúdo',
        icon: '📝',
        template: {
            title: 'Revisão do Módulo',
            duration: '30 min',
            type: 'text',
            xp: 100,
            objective: '## Objetivo da Revisão\n\nConsolidar e revisar todos os conceitos aprendidos no módulo.',
            mainContent: '# Revisão Completa\n\n## Conceitos Principais\n\n### Tópico 1\nResumo...\n\n### Tópico 2\nResumo...\n\n### Tópico 3\nResumo...\n\n## Exercícios de Revisão\n\n1. Exercício 1\n2. Exercício 2\n3. Exercício 3',
            complementaryMaterial: '## Material de Estudo\n\n- Mapa mental do módulo\n- Lista de conceitos-chave\n- Exercícios extras',
            summary: '## Checklist de Aprendizado\n\n- [ ] Conceito 1 dominado\n- [ ] Conceito 2 dominado\n- [ ] Conceito 3 dominado'
        }
    },
    {
        id: 'blank',
        name: 'Aula em Branco',
        description: 'Comece do zero',
        icon: '📋',
        template: {
            title: 'Nova Aula',
            duration: '30 min',
            type: 'text',
            xp: 100,
            mainContent: ''
        }
    }
];

export const getLessonTemplate = (templateId: string): Omit<Lesson, 'id'> | null => {
    const template = LESSON_TEMPLATES.find(t => t.id === templateId);
    return template ? template.template : null;
};
