
import { User, Course, Article, Event, Exercise, Achievement, Notification, ForumPost, Project, Partner, MentorSession, AnalyticsData, CommunityPost, Supporter, FinancialStatement, AnnualReport } from './types';

export const ARTICLES: Article[] = [];

export const MOCK_COURSES: Course[] = [];

export const MOCK_USERS: User[] = [];
export const MOCK_ACHIEVEMENTS: Achievement[] = [];
export const MOCK_NOTIFICATIONS: Notification[] = [];
export const MOCK_FORUM_POSTS: ForumPost[] = [];
export const MOCK_PROJECTS: Project[] = [];
export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
    {
        id: 'post_1',
        authorId: 'h0VK5SzekwWfHJmkwMXNJJSleIE2',
        title: 'Qual a diferença real entre `let`, `const` e `var` em JavaScript?',
        content: `E aí, galera! Beleza?\n\nTo começando a estudar JavaScript mais a fundo e sempre vejo a galera usando \`let\` e \`const\`, mas nos exemplos mais antigos só tinha \`var\`. Fui pesquisar e entendi que tem a ver com escopo, mas ainda tá meio confuso na minha cabeça.\n\nAlguém consegue me explicar de um jeito simples, tipo "para leigos", qual a diferença prática entre eles e quando eu devo usar cada um? Valeu!`,
        tags: ['javascript', 'iniciante', 'frontend'],
        claps: 42,
        views: 215,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        replies: [
            {
                id: 'reply_1_1',
                authorId: 'O1a7N0I3M6c5p8q2S9u4V1w8Y5Z7',
                content: 'Boa pergunta! A principal diferença é o escopo. `var` tem escopo de função, enquanto `let` e `const` têm escopo de bloco (tudo que está dentro de `{}`). Isso evita muitos bugs!',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 30 mins later
            },
        ],
        type: 'question',
        isSolved: false
    },
    {
        id: 'post_2',
        authorId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
        title: 'Dica de carreira: Como montar um portfólio no GitHub que chama atenção?',
        content: `Fala, pessoal!\n\nEstou terminando o curso de Frontend e quero começar a montar meu portfólio no GitHub pra procurar meu primeiro trampo. Vocês que já tão na área, têm alguma dica do que os recrutadores olham?\n\n- Quantos projetos são bons pra ter?\n- Precisa ter projeto "grande" ou vários pequenos servem?\n- Como organizar o README de cada projeto?\n\nToda ajuda é bem-vinda!`,
        tags: ['carreira', 'github', 'portfolio', 'frontend'],
        claps: 89,
        views: 450,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        replies: [],
        type: 'discussion',
    },
];
export const MOCK_PARTNERS: Partner[] = [
    {
        id: 'partner_1',
        name: 'TechCorp',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png',
        description: 'Líder global em inovação tecnológica, a TechCorp se dedica a organizar a informação do mundo e torná-la mundialmente acessível e útil. Sua missão vai além dos produtos, focando em criar oportunidades através da tecnologia.',
        websiteUrl: 'https://www.google.com',
        impactDescription: 'Financiamento de 50 bolsas integrais para o curso de Python e doação de 30 laptops para alunos sem equipamento.',
        since: '2023'
    },
    {
        id: 'partner_2',
        name: 'InovaSoft',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png',
        description: 'Pioneira em inteligência artificial e computação em nuvem, a InovaSoft tem um compromisso histórico com a educação e o desenvolvimento profissional, buscando resolver problemas complexos da sociedade.',
        websiteUrl: 'https://www.ibm.com',
        impactDescription: 'Programa de mentoria exclusivo onde 15 engenheiros seniores dedicam 2 horas semanais para orientar nossos alunos em projetos reais.',
        since: '2022'
    },
    {
        id: 'partner_3',
        name: 'DevSolutions',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png',
        description: 'A DevSolutions capacita cada pessoa e cada organização no planeta a conquistar mais. Através de suas ferramentas e plataformas, impulsiona a transformação digital em diversos setores.',
        websiteUrl: 'https://www.microsoft.com',
        impactDescription: 'Patrocínio do Hackathon das Favelas 2024 e contratação direta de 5 desenvolvedores júnior formados na FuturoOn.',
        since: '2024'
    },
    {
        id: 'partner_4',
        name: 'CloudSystems',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Amazon_Web_Services_Logo.svg/2560px-Amazon_Web_Services_Logo.svg.png',
        description: 'Fornecendo a infraestrutura que alimenta a internet moderna, a CloudSystems é parceira fundamental para startups e grandes empresas que buscam escalabilidade e inovação.',
        websiteUrl: 'https://aws.amazon.com',
        impactDescription: 'Disponibilização de créditos de nuvem para projetos dos alunos e workshops técnicos mensais sobre arquitetura de sistemas.',
        since: '2023'
    },
];
export const MOCK_EVENTS: Event[] = [
    {
        id: 'evt_hackathon_favelas',
        title: 'Hackathon das Favelas 2024',
        date: 'AGO 15',
        time: '09:00',
        hostId: 'instructor_1',
        description: 'Um final de semana intenso de codificação, criatividade e impacto social. Junte-se a nós para criar soluções tecnológicas para problemas reais das nossas comunidades. 🚀\n\nPré-requisitos: Vontade de aprender e trabalhar em equipe.',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c54be3852f33?q=80&w=1887&auto=format&fit=crop',
        eventType: 'Workshop',
        location: 'Presencial - Complexo da Coruja',
        registrationUrl: 'https://forms.gle/example'
    },
    {
        id: 'evt_live_career',
        title: 'Live: Como conseguir o primeiro emprego em Tech',
        date: 'AGO 20',
        time: '19:00',
        hostId: 'instructor_2',
        description: 'Dicas valiosas sobre currículo, LinkedIn e portfólio com recrutadores de grandes empresas de tecnologia. Não perca a chance de tirar suas dúvidas ao vivo! 💼',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop',
        eventType: 'Live',
        location: 'Online - YouTube'
    },
    {
        id: 'evt_workshop_ia',
        title: 'Masterclass: IA para Devs Iniciantes',
        date: 'SET 05',
        time: '18:30',
        hostId: 'instructor_3',
        description: 'Entenda como ferramentas de Inteligência Artificial como o Gemini podem acelerar seu aprendizado e produtividade na programação. 🤖✨',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop',
        eventType: 'Workshop',
        location: 'Online - Discord'
    }
];
export const MOCK_MENTOR_SESSIONS: MentorSession[] = [];
export const EXERCISES: Exercise[] = [];
export const MOCK_SUPPORTERS: Supporter[] = [
    {
        id: 'sup_1',
        name: 'Roberto Almeida',
        role: 'CTO @ TechCorp',
        tier: 'visionary',
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        message: 'Acredito no potencial transformador da educação. Parabéns pelo trabalho incrível!',
        since: '2023'
    },
    {
        id: 'sup_2',
        name: 'Ana Clara',
        role: 'Engenheira de Software',
        tier: 'visionary',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        message: 'Investir no futuro é investir nas pessoas. Orgulho de fazer parte.',
        since: '2024'
    },
    {
        id: 'sup_3',
        name: 'Carlos Eduardo',
        role: 'Empreendedor',
        tier: 'builder',
        avatarUrl: 'https://randomuser.me/api/portraits/men/85.jpg',
        since: '2023'
    },
    {
        id: 'sup_4',
        name: 'Fernanda Lima',
        role: 'Designer UX',
        tier: 'builder',
        avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
        since: '2024'
    },
    {
        id: 'sup_5',
        name: 'João Silva',
        role: 'Dev Frontend',
        tier: 'builder',
        avatarUrl: 'https://randomuser.me/api/portraits/men/12.jpg',
        since: '2024'
    },
    { id: 'sup_6', name: 'Maria Oliveira', tier: 'ally', since: '2024' },
    { id: 'sup_7', name: 'Pedro Santos', tier: 'ally', since: '2024' },
    { id: 'sup_8', name: 'Lucas Ferreira', tier: 'ally', since: '2024' },
    { id: 'sup_9', name: 'Juliana Costa', tier: 'ally', since: '2024' },
    { id: 'sup_10', name: 'Marcos Vinicius', tier: 'ally', since: '2024' },
    { id: 'sup_11', name: 'Patrícia Souza', tier: 'ally', since: '2024' },
    { id: 'sup_12', name: 'Rafael Lima', tier: 'ally', since: '2024' },
    { id: 'sup_13', name: 'Beatriz Rocha', tier: 'ally', since: '2024' },
];

export const MOCK_ANALYTICS_DATA_V2: AnalyticsData = {
    totalStudents: 452,
    newStudentsLast30d: 38,
    avgCompletionRate: 68,
    weeklyEngagement: 85,
    coursePerformance: [
        { courseId: 'csharp-backend-essential', enrolled: 120, completionRate: 45, avgTime: 42, satisfaction: 4.8, dropOffRate: 15 },
        { courseId: 'frontend-react', enrolled: 180, completionRate: 72, avgTime: 35, satisfaction: 4.9, dropOffRate: 8 },
        { courseId: 'intro-python', enrolled: 95, completionRate: 85, avgTime: 20, satisfaction: 4.7, dropOffRate: 5 }
    ],
    lessonPerformance: {
        'csharp-backend-essential': [
            { lessonId: 'lesson_csharp_hello', title: 'Hello World e Variáveis', studentsCompleted: 115 },
            { lessonId: 'lesson_csharp_condicionais', title: 'Tomando Decisões (If/Else)', studentsCompleted: 98 }, // Queda
            { lessonId: 'lesson_csharp_classes', title: 'Classes e Objetos: A Fábrica de Pizzas', studentsCompleted: 70 }, // Grande Queda (Bottleneck)
            { lessonId: 'lesson_csharp_api_concept', title: 'O que é uma API?', studentsCompleted: 65 },
        ]
    },
    studentRetention: {
        average: 78.5,
        trend: 4.2,
        dailyData: [65, 68, 72, 75, 78, 82, 80, 85, 88, 86, 89, 92, 90, 88, 85, 82, 80, 78, 75, 78, 80, 82, 85, 88, 90, 92, 95, 93, 94, 95]
    },
    studentEngagement: {
        topStudents: [
            { id: 'u1', name: 'Ana Souza', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg', xp: 2450 },
            { id: 'u2', name: 'Carlos Oliveira', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg', xp: 2100 },
            { id: 'u3', name: 'Beatriz Lima', avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg', xp: 1950 },
            { id: 'u4', name: 'João Pedro', avatarUrl: 'https://randomuser.me/api/portraits/men/85.jpg', xp: 1800 },
            { id: 'u5', name: 'Fernanda Costa', avatarUrl: 'https://randomuser.me/api/portraits/women/22.jpg', xp: 1750 }
        ],
        atRiskStudents: [
            { id: 'u6', name: 'Marcos Silva', avatarUrl: 'https://randomuser.me/api/portraits/men/12.jpg', lastLoginDaysAgo: 15 },
            { id: 'u7', name: 'Julia Santos', avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg', lastLoginDaysAgo: 12 },
            { id: 'u8', name: 'Rafael Dias', avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg', lastLoginDaysAgo: 10 }
        ]
    }
};

export const MOCK_FINANCIAL_STATEMENTS: FinancialStatement[] = [
    {
        id: 'fin_2025',
        year: 2025,
        totalRevenue: 'R$ 850.000,00',
        totalExpenses: 'R$ 780.000,00',
        reinvested: 'R$ 70.000,00',
        revenueBreakdown: [
            { label: 'Parcerias Corporativas', value: 'R$ 480k', percentage: 56, color: 'bg-purple-500' },
            { label: 'Doações Individuais', value: 'R$ 200k', percentage: 24, color: 'bg-pink-500' },
            { label: 'Editais e Fomento Público', value: 'R$ 120k', percentage: 14, color: 'bg-sky-500' },
            { label: 'Eventos e Campanhas', value: 'R$ 50k', percentage: 6, color: 'bg-amber-500' }
        ],
        expensesBreakdown: [
            { label: 'Programas Educacionais', value: 'R$ 390k', percentage: 50, color: 'bg-green-500' },
            { label: 'Infraestrutura e Tecnologia', value: 'R$ 195k', percentage: 25, color: 'bg-blue-500' },
            { label: 'Equipe e Recursos Humanos', value: 'R$ 125k', percentage: 16, color: 'bg-purple-500' },
            { label: 'Marketing e Comunicação', value: 'R$ 40k', percentage: 5, color: 'bg-pink-500' },
            { label: 'Administrativo e Jurídico', value: 'R$ 30k', percentage: 4, color: 'bg-gray-500' }
        ],
        documentsUrl: '#'
    },
    {
        id: 'fin_2024',
        year: 2024,
        totalRevenue: 'R$ 620.000,00',
        totalExpenses: 'R$ 570.000,00',
        reinvested: 'R$ 50.000,00',
        revenueBreakdown: [
            { label: 'Parcerias Corporativas', value: 'R$ 340k', percentage: 55, color: 'bg-purple-500' },
            { label: 'Doações Individuais', value: 'R$ 145k', percentage: 23, color: 'bg-pink-500' },
            { label: 'Editais e Fomento', value: 'R$ 105k', percentage: 17, color: 'bg-sky-500' },
            { label: 'Outros', value: 'R$ 30k', percentage: 5, color: 'bg-gray-500' }
        ],
        expensesBreakdown: [
            { label: 'Educação (Salários/Bolsas)', value: 'R$ 280k', percentage: 49, color: 'bg-green-500' },
            { label: 'Infraestrutura e Tecnologia', value: 'R$ 165k', percentage: 29, color: 'bg-blue-500' },
            { label: 'Alimentação e Transporte', value: 'R$ 85k', percentage: 15, color: 'bg-yellow-500' },
            { label: 'Administrativo', value: 'R$ 40k', percentage: 7, color: 'bg-red-500' }
        ],
        documentsUrl: '#'
    },
    {
        id: 'fin_2023',
        year: 2023,
        totalRevenue: 'R$ 450.000,00',
        totalExpenses: 'R$ 410.000,00',
        reinvested: 'R$ 40.000,00',
        revenueBreakdown: [
            { label: 'Parcerias Corporativas', value: 'R$ 250k', percentage: 55, color: 'bg-purple-500' },
            { label: 'Doações Individuais', value: 'R$ 100k', percentage: 22, color: 'bg-pink-500' },
            { label: 'Editais e Fomento', value: 'R$ 80k', percentage: 18, color: 'bg-sky-500' },
            { label: 'Outros', value: 'R$ 20k', percentage: 5, color: 'bg-gray-500' }
        ],
        expensesBreakdown: [
            { label: 'Educação (Salários/Bolsas)', value: 'R$ 200k', percentage: 48, color: 'bg-green-500' },
            { label: 'Infraestrutura e Tecnologia', value: 'R$ 120k', percentage: 29, color: 'bg-blue-500' },
            { label: 'Alimentação e Transporte', value: 'R$ 60k', percentage: 15, color: 'bg-yellow-500' },
            { label: 'Administrativo', value: 'R$ 30k', percentage: 8, color: 'bg-red-500' }
        ],
        documentsUrl: '#'
    }
];

export const MOCK_ANNUAL_REPORTS: AnnualReport[] = [
    {
        id: 'rep_2025',
        year: 2025,
        stats: [
            { label: 'Alunos Atendidos', value: '300+', color: 'text-purple-400' },
            { label: 'Parcerias Ativas', value: '12', color: 'text-cyan-400' },
            { label: 'Anos de Atuação', value: '4', color: 'text-green-400' },
            { label: 'Formações Realizadas', value: '300+', color: 'text-amber-400' }
        ],
        coordinationLetter: {
            text: "2025 marca um capítulo decisivo para o Futuroon. Foi um ano desafiador, principalmente devido à superação necessária para a mudança para nossa nova sede na Rua Silva Jardim, 689 - Neves, um ato de determinação que prova que a periferia pode protagonizar a transformação digital.\n\nNossa credibilidade foi validada por uma grande conquista global: fomos selecionados no edital Hostinger, recebendo R$15.000 em financiamento. Este apoio fortalece nossa missão de capacitar crianças, jovens e mães solo para o futuro do trabalho em tecnologia.\n\nExpandimos nosso impacto com oficinas de programação, criação de jogos, robótica, letramento digital, inglês e empreendedorismo - tudo de forma gratuita. Celebramos as histórias de transformação de mães e jovens que encontraram na tecnologia um novo futuro.\n\nJá são mais de 300 formações realizadas e 4 anos de atuação contínua no Complexo da Coruja. Agradecemos a cada parceiro, doador, voluntário e aluno. Juntos, estamos construindo o futuro, com a certeza de que 2025 será o ano de alargar as estacas.",
            authorName: "Thaís Santana",
            authorRole: "Fundadora e Diretora Executiva",
            authorAvatarUrl: "https://media.licdn.com/dms/image/v2/D4D03AQERbQ7RnKzlEA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1691721804193?e=1766016000&v=beta&t=XjCc9TPv6f5vlG3m80nxefDLn-88HhoiRx1EMYXbUlI"
        },
        testimonials: [
            {
                name: "Kauan Santana",
                quote: "Antes eu só pensava em jogar futebol. Depois do Futuroon, descobri que também posso criar jogos e trabalhar com tecnologia. Já desenvolvemos um jogo de corrida com energia solar que foi premiado!",
                role: "Aluno - Desenvolvedor de Games",
                avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            {
                name: "Gabriel Luíz Oliveira",
                quote: "Eu já tinha vontade de fazer algum curso de informática, mas não sabia que gostava tanto disso. No começo foi difícil, mas depois de ir conhecendo na prática foi ficando fácil. Agora tenho novas metas para o futuro.",
                role: "Aluno - Programação",
                avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg"
            },
            {
                name: "Ana Carolina Cardoso",
                quote: "Foi estranho porque era a primeira vez que vi muita coisa. Agora eu já me adaptei. Eu não sabia mexer em nada, agora tô sabendo pelo menos o básico. O Futuroon virou uma segunda casa pra mim.",
                role: "Aluna - Informática Básica",
                avatarUrl: "https://randomuser.me/api/portraits/women/55.jpg"
            }
        ]
    },
    {
        id: 'rep_2024',
        year: 2024,
        stats: [
            { label: 'Alunos Formados', value: '425', color: 'text-purple-400' },
            { label: 'Taxa de Empregabilidade', value: '80%', color: 'text-green-400' },
            { label: 'Mulheres na Tech', value: '46%', color: 'text-pink-400' },
            { label: 'Projetos Entregues', value: '118', color: 'text-amber-400' }
        ],
        coordinationLetter: {
            text: "2024 foi um ano de crescimento exponencial. Dobramos nossa capacidade de atendimento e mantivemos a qualidade que nos define. Lançamos novos cursos em áreas emergentes como IA e Cloud Computing, sempre com foco na empregabilidade real. Nossa comunidade se fortaleceu, com ex-alunos retornando como mentores voluntários. Esse ciclo virtuoso é a prova de que estamos no caminho certo.",
            authorName: "Thaís Santana",
            authorRole: "Fundadora e Diretora Executiva",
            authorAvatarUrl: "https://randomuser.me/api/portraits/women/68.jpg"
        },
        testimonials: [
            {
                name: "Pedro Henrique",
                quote: "Saí do desemprego para desenvolvedor júnior em 8 meses. O método prático do FuturoOn fez toda diferença. Hoje ajudo minha família e inspiro meus irmãos mais novos.",
                role: "Desenvolvedor Full Stack Jr.",
                avatarUrl: "https://randomuser.me/api/portraits/men/28.jpg"
            },
            {
                name: "Juliana Alves",
                quote: "Nunca imaginei que aos 35 anos eu mudaria de carreira. O FuturoOn me acolheu e me mostrou que nunca é tarde para recomeçar. Hoje trabalho com o que amo.",
                role: "QA Engineer",
                avatarUrl: "https://randomuser.me/api/portraits/women/41.jpg"
            }
        ]
    },
    {
        id: 'rep_2023',
        year: 2023,
        stats: [
            { label: 'Alunos Formados', value: '312', color: 'text-purple-400' },
            { label: 'Taxa de Empregabilidade', value: '78%', color: 'text-green-400' },
            { label: 'Mulheres na Tech', value: '45%', color: 'text-pink-400' },
            { label: 'Projetos Entregues', value: '89', color: 'text-amber-400' }
        ],
        coordinationLetter: {
            text: "2023 foi um ano de consolidação para o Instituto FuturoOn. Expandimos nossa atuação física no Complexo da Coruja e fortalecemos nossa plataforma digital, alcançando jovens que antes não tinham perspectiva de entrar no mercado de tecnologia. Nossa metodologia 'mão na massa' provou ser eficaz, com uma taxa de retenção recorde. Agradeço a cada parceiro, voluntário e aluno que acreditou nesse sonho.",
            authorName: "Thaís Santana",
            authorRole: "Fundadora e Diretora Executiva",
            authorAvatarUrl: "https://randomuser.me/api/portraits/women/68.jpg"
        },
        testimonials: [
            {
                name: "Lucas Mendes",
                quote: "O FuturoOn mudou minha vida. Antes eu trabalhava como entregador, hoje sou Desenvolvedor Júnior em uma grande fintech. A comunidade e o apoio dos mentores fizeram toda a diferença.",
                role: "Ex-aluno, Dev Fullstack",
                avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg"
            },
            {
                name: "Beatriz Costa",
                quote: "Eu achava que programação não era pra mim. Aqui descobri que posso criar qualquer coisa. O ambiente acolhedor me deu confiança para seguir em frente.",
                role: "Aluna de Python",
                avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg"
            }
        ]
    }
];