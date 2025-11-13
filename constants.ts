import { User, Course, Article, Event, Exercise, Achievement, Notification, ForumPost, Project, Partner, MentorSession, AnalyticsData } from './types';

// Todos os arrays de dados mockados foram esvaziados.
// A aplicação agora dependerá exclusivamente dos dados carregados do Firebase.
export const ARTICLES: Article[] = [];
export const MOCK_COURSES: Course[] = [
  {
    id: 'cs1',
    title: 'Lógica de Programação com C#',
    description: 'Aprenda os fundamentos da programação e construa uma base sólida para pensar como um desenvolvedor, usando a linguagem C#.',
    longDescription: 'Este curso é a porta de entrada para o mundo do desenvolvimento de software. Você aprenderá os conceitos essenciais de lógica de programação, como variáveis, condicionais e laços de repetição, aplicando tudo na prática com a linguagem C#, uma das mais requisitadas pelo mercado de trabalho em grandes empresas.',
    track: 'Backend',
    imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '40 horas',
    skillLevel: 'Iniciante',
    instructorId: 'user_marlon_souza',
    format: 'hibrido',
    category: 'BACKEND',
    tags: ["c#", ".net", "backend", "iniciante"],
    lessonsCount: 12,
    projectTitle: "Calculadora de Console e Jogo Simples",
    projectDescription: "Como projeto final, você irá aplicar os conceitos aprendidos para criar duas aplicações de console: uma calculadora com as 4 operações básicas e um pequeno jogo de adivinhação, demonstrando seu domínio sobre a lógica de programação.",
    projectCriteria: "- Calculadora deve funcionar corretamente para soma, subtração, multiplicação e divisão.\n- Jogo de adivinhação deve gerar um número aleatório e dar dicas ao usuário (maior/menor).\n- Código deve ser bem organizado em funções.",
    modules: [
        {
            id: 'cs1-m1',
            title: 'Introdução à Programação e C#',
            lessons: [
                { id: 'cs1-m1-l1', title: 'O que é Lógica de Programação?', duration: '20 min', type: 'text', xp: 10, 
                  objective: "Entender o conceito de algoritmo e como o computador 'pensa'.", 
                  mainContent: `Lógica de programação é a forma como organizamos nossos pensamentos para resolver um problema, passo a passo, de uma maneira que o computador entenda. É a base de tudo na carreira de um desenvolvedor.

## O que é um Algoritmo?

Pense em uma receita de bolo: isso é um algoritmo! É uma sequência finita de passos claros e precisos que, quando executados, resolvem um problema ou realizam uma tarefa.

[ALERT type="info"]
**Exemplo de Algoritmo:** Trocar uma lâmpada queimada.
1.  Pegar uma escada.
2.  Posicionar a escada embaixo da lâmpada.
3.  Pegar uma lâmpada nova.
4.  Subir na escada.
5.  Girar a lâmpada queimada para a esquerda até soltar.
6.  Girar a lâmpada nova para a direita até apertar.
7.  Descer da escada.
[/ALERT]

No nosso contexto, vamos aprender a criar essas 'receitas' para o computador, usando uma linguagem que ele compreende.

[TIP]
Tente descrever como um algoritmo os passos que você faz para escovar os dentes ou fazer um café. Praticar essa forma de pensar ajuda muito a desenvolver a lógica!
[/TIP]
` 
                },
                { id: 'cs1-m1-l2', title: 'Conhecendo o C# e o Ambiente .NET', duration: '25 min', type: 'text', xp: 15, objective: "Instalar as ferramentas necessárias (VS Code, .NET SDK) e entender o que é o C#.", mainContent: "C# (lê-se 'C sharp') é uma linguagem de programação criada pela Microsoft. Ela é usada para criar aplicativos para web, desktop, jogos e muito mais. O .NET é a plataforma que nos permite rodar nossos códigos C#. Vamos configurar nosso ambiente de desenvolvimento para começar a programar!" },
                { id: 'cs1-m1-l3', title: 'Seu Primeiro Programa: Olá, Mundo!', duration: '20 min', type: 'text', xp: 15, objective: "Escrever e executar o primeiro código em C#, o famoso 'Hello, World!'.", mainContent: "Todo programador começa por aqui! Vamos abrir o Visual Studio Code, criar nosso primeiro arquivo de código e escrever as linhas necessárias para que o programa exiba a mensagem 'Olá, Mundo!' no terminal. Este é um passo gigante na sua jornada!" },
            ]
        },
        {
            id: 'cs1-m2',
            title: 'Variáveis e Operadores',
            lessons: [
                { id: 'cs1-m2-l1', title: 'Guardando Informações: Variáveis e Tipos de Dados', duration: '30 min', type: 'text', xp: 20, objective: "Aprender a declarar variáveis e entender os tipos de dados básicos (int, string, bool).", mainContent: "Variáveis são como caixinhas onde guardamos informações no nosso programa. Cada caixinha tem um nome e um tipo de conteúdo. Vamos aprender sobre os tipos principais: `int` para números inteiros, `string` para textos, `double` para números com vírgula e `bool` para verdadeiro ou falso." },
                { id: 'cs1-m2-l2', title: 'Entrada e Saída de Dados', duration: '25 min', type: 'text', xp: 20, objective: "Aprender a receber dados do usuário e a exibir informações no console.", mainContent: "Um programa interativo é muito mais legal! Vamos aprender a usar `Console.ReadLine()` para ler o que o usuário digita e `Console.WriteLine()` para mostrar mensagens, resultados e perguntas na tela." },
                { id: 'cs1-m2-l3', title: 'Operadores Matemáticos e Lógicos', duration: '30 min', type: 'text', xp: 20, objective: "Utilizar operadores para realizar cálculos (+, -, *, /) e comparações (==, !=, >, <).", mainContent: "A programação é cheia de matemática e lógica! Vamos ver como usar operadores para somar, subtrair, multiplicar e dividir. Além disso, aprenderemos a comparar valores para saber se algo é igual, diferente, maior ou menor que outra coisa. Isso é a base para tomar decisões no código." },
            ]
        },
        {
            id: 'cs1-m3',
            title: 'Tomando Decisões e Repetindo Tarefas',
            lessons: [
                { id: 'cs1-m3-l1', title: 'Estruturas Condicionais: if/else', duration: '35 min', type: 'text', xp: 25, objective: "Aprender a criar blocos de código que só executam se uma condição for verdadeira.", mainContent: "E se...? A vida é cheia de decisões, e nossos programas também. Com o `if` (se) e o `else` (senão), podemos fazer o computador executar um código diferente dependendo de uma condição. Por exemplo: SE a nota for maior que 7, exiba 'Aprovado!', SENÃO, exiba 'Reprovado'." },
                { id: 'cs1-m3-l2', title: 'Laços de Repetição: for', duration: '35 min', type: 'text', xp: 25, objective: "Utilizar o `for` para repetir uma tarefa um número específico de vezes.", mainContent: "Imagine ter que escrever 'Olá' 100 vezes. Cansativo, né? Com o laço `for`, podemos dizer ao computador para repetir uma ação um número exato de vezes. É perfeito para percorrer listas de itens ou executar uma tarefa repetitiva." },
                { id: 'cs1-m3-l3', title: 'Laços de Repetição: while', duration: '35 min', type: 'text', xp: 25, objective: "Utilizar o `while` para repetir uma tarefa enquanto uma condição for verdadeira.", mainContent: "O laço `while` (enquanto) é como um `for`, mas ele repete uma ação ENQUANTO uma condição for verdadeira. É ideal para situações onde não sabemos exatamente quantas vezes precisamos repetir, como em um menu de opções onde o programa continua rodando até o usuário escolher 'Sair'." },
            ]
        },
        {
            id: 'cs1-m4',
            title: 'Organizando o Código e Projeto Final',
            lessons: [
                { id: 'cs1-m4-l1', title: 'Arrays: Guardando Vários Itens', duration: '30 min', type: 'text', xp: 30, objective: "Aprender a usar arrays para armazenar coleções de dados do mesmo tipo.", mainContent: "E se quisermos guardar a nota de 30 alunos? Criar 30 variáveis seria inviável. Com arrays (vetores), podemos criar uma única 'caixa grande' que guarda várias 'caixinhas' dentro dela. Vamos aprender a criar e acessar itens em um array." },
                { id: 'cs1-m4-l2', title: 'Funções: Organizando e Reutilizando Código', duration: '40 min', type: 'text', xp: 35, objective: "Criar funções para organizar o código em blocos lógicos e reutilizáveis.", mainContent: "Conforme nossos programas crescem, eles ficam bagunçados. Funções nos permitem agrupar um pedaço de código que faz uma tarefa específica (como somar dois números) e dar um nome a ele. Assim, podemos 'chamar' essa função sempre que precisarmos, sem repetir o código." },
                { id: 'cs1-m4-l3', title: 'Projeto Final: Construindo as Aplicações', duration: '60 min', type: 'text', xp: 60, objective: "Aplicar todo o conhecimento para construir uma calculadora e um jogo de adivinhação.", mainContent: "Hora de juntar tudo! Neste desafio, você vai usar variáveis, `if/else`, laços e funções para construir dois programas do zero. Será o seu primeiro grande projeto, provando que você dominou os fundamentos da lógica de programação com C#." },
            ]
        }
    ]
  }
];
export const MOCK_USERS: User[] = [];
export const MOCK_ACHIEVEMENTS: Achievement[] = [];
export const MOCK_NOTIFICATIONS: Notification[] = [];
export const MOCK_FORUM_POSTS: ForumPost[] = [];
export const MOCK_PROJECTS: Project[] = [];
export const MOCK_PARTNERS: Partner[] = [];
export const MOCK_EVENTS: Event[] = [];
export const MOCK_MENTOR_SESSIONS: MentorSession[] = [];
export const EXERCISES: Exercise[] = [];

// Os dados de analytics foram zerados para refletir um estado inicial limpo,
// prevenindo erros em componentes que dependem desta estrutura.
// FIX: Applied the AnalyticsData type to ensure correct type inference for its properties, especially lessonPerformance.
export const MOCK_ANALYTICS_DATA_V2: AnalyticsData = {
  totalStudents: 0,
  newStudentsLast30d: 0,
  avgCompletionRate: 0,
  weeklyEngagement: 0,
  coursePerformance: [],
  lessonPerformance: {},
  studentRetention: {
    average: 0,
    trend: 0,
    dailyData: [],
  },
  studentEngagement: {
    topStudents: [],
    atRiskStudents: [],
  },
};