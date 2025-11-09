import { User, Course, Article, Event, Exercise, Achievement, Notification, ForumPost, Project, Partner, MentorSession } from './types';

const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const MOCK_USERS: User[] = [
  // Alunos
  {
    id: 'u1',
    name: 'Jessica Silva',
    email: 'jessica.silva@email.com',
    avatarUrl: 'https://picsum.photos/seed/jessica/200',
    bio: 'Apaixonada por tecnologia e design, transformando ideias em realidade com código e criatividade. Cria da Zona Leste de SP!',
    role: 'student',
    completedLessonIds: ['html1-m1-l1', 'html1-m1-l2', 'fe2-m1-l1'],
    xp: 35,
    achievements: ['ach_1'],
    streak: 3,
    lastCompletionDate: yesterday,
    dateOfBirth: '2004-08-15',
    location: 'Itaquera, São Paulo',
    phoneNumber: '(11) 98765-4321',
    educationLevel: 'Ensino Médio Completo',
    motivation: 'Quero aprender a programar para criar um aplicativo para o comércio do meu bairro e ajudar minha comunidade a crescer.',
    notes: {
      'html1-m1-l1': 'A tag <head> guarda metadados invisíveis para o usuário. Já a tag <header> é para o cabeçalho visível do site (logo, menu, etc.). Importante não confundir!',
    },
    githubUrl: 'https://github.com/jessicasilva',
    linkedinUrl: 'https://linkedin.com/in/jessicasilva',
  },
   {
    id: 'u2',
    name: 'Carlos Souza',
    email: 'carlos.souza@email.com',
    avatarUrl: 'https://picsum.photos/seed/carlos/200',
    bio: 'Fascinado por backend e pela forma como os dados se movem na internet.',
    role: 'student',
    completedLessonIds: [], xp: 10, achievements: [], streak: 1, lastCompletionDate: '',
    notes: {},
  },
  // Equipe (Instrutores e Admin)
  {
    id: 'inst1',
    name: 'Luiz Guilherme Bandeira',
    email: 'luiz.bandeira@email.com',
    avatarUrl: 'https://media.licdn.com/dms/image/v2/C4E03AQHY285KSVhOIA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1633218149828?e=1764201600&v=beta&t=MB42B1OwsODKmFYAScLHjMLGnSAU1BMjDb0SfE9KaO4',
    bio: 'Cursando pós-graduação em Inteligência Artificial pela UFV. Acredito no poder do código para resolver problemas complexos e construir aplicações escaláveis.',
    role: 'instructor',
    title: 'Desenvolvedor Backend & Entusiasta em IA',
    isMentor: true,
    showOnTeamPage: true,
    googleMeetUrl: 'https://meet.google.com/abc-def-ghi',
    completedLessonIds: [], xp: 1500, achievements: [], streak: 42, lastCompletionDate: yesterday, notes: {},
    githubUrl: 'https://github.com/lguilherme',
    linkedinUrl: 'https://www.linkedin.com/in/luiz-guilherme-bandeira/',
  },
  {
    id: 'inst2',
    name: 'Vitor Santos',
    email: 'vitor.santos@email.com',
    avatarUrl: 'https://media.licdn.com/dms/image/v2/D5603AQHQYTpCPcROvA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1725502652689?e=1764201600&v=beta&t=faPDzVvjRTzGbRvr1FmiZ7Ow_AI6vs4IIXAOXSO1GXs',
    bio: 'Software Developer com expertise em JavaScript, Python e C#. Acredito na construção de soluções inovadoras com código limpo e eficiente.',
    role: 'instructor',
    title: 'Software Developer',
    isMentor: true,
    showOnTeamPage: true,
    googleMeetUrl: 'https://meet.google.com/jkl-mno-pqr',
    completedLessonIds: [], xp: 1800, achievements: [], streak: 50, lastCompletionDate: yesterday, notes: {},
  },
   {
    id: 'inst3',
    name: 'Thaís Santana',
    email: 'thais.santana@email.com',
    avatarUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQERbQ7RnKzlEA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1691721804193?e=1764201600&v=beta&t=c2HPPb24zMUizWLVlXTFDhk3534DX3BLPhTFBBH4Sig',
    bio: 'Coordenadora de Medição de Energia e Empreendedora Social, com expertise em transformar dados de energia em insights valiosos e impacto social.',
    role: 'instructor',
    title: 'Coordenadora de Medição de Energia | Empreendedora Social',
    isMentor: true,
    showOnTeamPage: true,
    googleMeetUrl: 'https://meet.google.com/stu-vwx-yza',
    completedLessonIds: [], xp: 2200, achievements: [], streak: 65, lastCompletionDate: yesterday, notes: {},
  },
  {
    id: 'adm1',
    name: 'Admin FuturoOn',
    email: 'admin@institutofuturoon.org',
    avatarUrl: 'https://picsum.photos/seed/admin/200',
    bio: 'Gerenciando a plataforma e as parcerias para transformar o futuro da tecnologia no Brasil, um talento de cada vez.',
    role: 'admin',
    title: 'Coordenação Geral',
    isMentor: false,
    showOnTeamPage: false,
    completedLessonIds: [], xp: 9999, achievements: [], streak: 100, lastCompletionDate: yesterday, notes: {},
  },
  // Equipe (Voluntários etc.)
   { 
    id: 'vol1', 
    name: 'Luiza Carmelo',
    email: 'luiza.carmelo@futuroon.org',
    role: 'student', // Mantido como student para não ter acesso admin, mas exibido na página de equipe
    avatarUrl: 'https://media.licdn.com/dms/image/v2/C4D03AQED7gUCwnsqZg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1660759911679?e=1764201600&v=beta&t=yzV8V8DNdxxxK0nSPEFAnFKZ4qn5gb-k2LsKceoxC2U',
    title: 'Tradutora Literária e Empresária (Gaia Atlas Carnívoras)',
    bio: 'Tradutora Literária e Empresária (Gaia Atlas Carnívoras)',
    isMentor: false, showOnTeamPage: true,
    linkedinUrl: 'https://www.linkedin.com/in/luizacarmelo/',
    completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '', notes: {}
   },
   {
    id: 'vol2',
    name: 'Yasmin Gomes',
    email: 'yasmin.gomes@futuroon.org',
    role: 'student',
    avatarUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQGRopz9lr93SA/profile-displayphoto-shrink_200_200/B4DZO1QTUmGUAY-/0/1733912770606?e=1764201600&v=beta&t=wBdlAt1zEepT6COLev3dSARpGQsWi2tAp2vkefkSFK8',
    title: 'Administração | Power BI | Social Media',
    bio: 'Administração | Power BI | Atitude Infinita | Social Media do Futuroon | Análise de Dados | HRBP',
    isMentor: false, showOnTeamPage: true,
    linkedinUrl: 'https://www.linkedin.com/in/yasmin-gomes-/',
    completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '', notes: {}
   },
   {
    id: 'vol3',
    name: 'Renata D.S. Rocha',
    email: 'renata.rocha@futuroon.org',
    role: 'student',
    avatarUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQGIVgDAzEjY5Q/profile-displayphoto-shrink_200_200/B4DZc3N.HwGYAc-/0/1748978099190?e=1764201600&v=beta&t=dNzR-a1YoRK7h2HlM3OUGq8uD_zqkG0ruP9S01iudc0',
    title: 'Gerente de Projetos | Tecnóloga Criativa',
    bio: 'Gerente de Projetos | Tecnóloga Criativa',
    isMentor: false, showOnTeamPage: true,
    linkedinUrl: 'https://www.linkedin.com/in/renatadsrocha/',
    completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '', notes: {}
   },
   {
    id: 'vol4',
    name: 'Marcela Canto',
    email: 'marcela.canto@futuroon.org',
    role: 'student',
    avatarUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQHaFcaEr6J-pA/profile-displayphoto-shrink_200_200/B4DZUl29DCHYAc-/0/1740096919362?e=1764201600&v=beta&t=bWUcRTb6FvF9exUHDqom-15OBhSxgPq839TcbOwGDQ8',
    title: 'Cientista Social | Mestranda em Humanidades Digitais',
    bio: 'Cientista Social | Mestranda em Humanidades Digitais na Universidade Federal Rural do Rio de Janeiro | Pesquisadora no Observatório de Educação Digital do Legal Fronts Institute | Educadora popular',
    isMentor: false, showOnTeamPage: true,
    linkedinUrl: 'https://www.linkedin.com/in/marcela-canto/',
    completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '', notes: {}
   },
   {
    id: 'vol5',
    name: 'Gabriela Monerat',
    email: 'gabriela.monerat@futuroon.org',
    role: 'student',
    avatarUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQE-ioQRh-dtPg/profile-displayphoto-shrink_200_200/B4EZTX4HZcHcAg-/0/1738788600725?e=1764201600&v=beta&t=0x795sY4Z2qnWskds5YxDG7d4pdAl9wsSoDwFsVlBKA',
    title: 'Assistente administrativo',
    bio: 'Com experiência em atendimento ao público e processos de vendas, estou em busca de novas experiências no mercado de trabalho, em especial funções nas quais possa desenvolver os aprendizados acadêmicos.',
    isMentor: false, showOnTeamPage: true,
    linkedinUrl: 'https://www.linkedin.com/in/gabriela-monerat-71984634a/',
    completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '', notes: {}
   },
   {
    id: 'marlon1',
    name: 'Marlon Souza',
    email: 'marlon.souza@futuroon.org',
    role: 'admin',
    avatarUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQE6gV_60L_8yw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1687550882103?e=1764201600&v=beta&t=Ue89n6p4Q7b8QZz4Y9eX_W2wF_vC_jYc_Z_qX_y_3s',
    title: 'Coordenador Institucional',
    bio: 'Apaixonado por tecnologia e Impacto social. Acredito que a educação é a principal ferramenta para a transformação social. Minha missão é criar oportunidades para que jovens de periferia possam ser protagonistas de suas próprias histórias.',
    isMentor: false, showOnTeamPage: true,
    linkedinUrl: 'https://www.linkedin.com/in/marlon-souza-a1b2b345/',
    completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '', notes: {}
   },
];


export const MOCK_ACHIEVEMENTS: Achievement[] = [
    { 
        id: 'ach_1', 
        title: 'Quebra-Gelo', 
        description: 'Concluiu sua primeira aula. O primeiro passo de uma grande jornada!', 
        icon: '🧊',
        condition: (user) => user.completedLessonIds.length >= 1 
    },
    { 
        id: 'ach_2', 
        title: 'Maratonista', 
        description: 'Concluiu 5 aulas. Você está pegando o ritmo!', 
        icon: '🏃‍♀️',
        condition: (user) => user.completedLessonIds.length >= 5
    },
    { 
        id: 'ach_3', 
        title: 'Finalizador', 
        description: 'Concluiu seu primeiro curso. Parabéns pela conquista!', 
        icon: '🏆',
        condition: (user, courses) => {
            return courses.some(course => {
                const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
                if (allLessonIds.length === 0) return false;
                return allLessonIds.every(id => user.completedLessonIds.includes(id));
            });
        }
    },
    { 
        id: 'ach_4', 
        title: 'Sábio Iniciante', 
        description: 'Acumulou 100 XP. O conhecimento é poder!', 
        icon: '🧠',
        condition: (user) => user.xp >= 100
    },
     { 
        id: 'ach_5', 
        title: 'Foguete Não Tem Ré', 
        description: 'Manteve uma sequência de 3 dias de estudos. Disciplina é a chave!', 
        icon: '🚀',
        condition: (user) => user.streak >= 3
    },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', text: 'Sua dúvida na aula de Flexbox foi respondida.', createdAt: 'Há 2 horas', isRead: false },
    { id: 'n2', text: 'Novo evento ao vivo adicionado: Live Coding com Rodrigo Alves.', createdAt: 'Há 1 dia', isRead: false },
    { id: 'n3', text: 'Você ganhou a conquista \'Quebra-Gelo\'!', createdAt: 'Há 3 dias', isRead: true },
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
    {
        id: 'fp1',
        lessonId: 'html1-m1-l1',
        authorId: 'u2',
        authorName: 'Carlos Souza',
        authorAvatarUrl: 'https://picsum.photos/seed/carlos/100',
        text: 'Galera, não entendi muito bem a diferença entre a tag <head> e a <header>. Alguém pode me dar uma luz?',
        createdAt: 'Há 1 hora',
        replies: [
            {
                id: 'r1',
                authorId: 'inst1',
                authorName: 'Luiz Guilherme Bandeira',
                authorAvatarUrl: 'https://media.licdn.com/dms/image/v2/C4E03AQHY285KSVhOIA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1633218149828?e=1764201600&v=beta&t=MB42B1OwsODKmFYAScLHjMLGnSAU1BMjDb0SfE9KaO4',
                text: 'Ótima pergunta, Carlos! A `<head>` é uma parte invisível da página que guarda metadados, como o título da aba. Já o `<header>` é uma tag semântica visível, usada para o cabeçalho do seu site (com logo, menu, etc).',
                createdAt: 'Há 45 minutos'
            }
        ]
    },
    {
        id: 'fp2',
        lessonId: 'html1-m1-l1',
        authorId: 'u3',
        authorName: 'Ana Beatriz',
        authorAvatarUrl: 'https://picsum.photos/seed/anabeatriz/100',
        text: 'Esse `<!DOCTYPE html>` é obrigatório mesmo em todas as páginas? O que acontece se eu esquecer de colocar?',
        createdAt: 'Há 3 horas',
        replies: []
    }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj1',
    authorId: 'u1',
    title: 'Meu Portfólio Pessoal',
    description: 'Este foi o projeto final do curso de HTML e CSS Essencial. Construí meu primeiro portfólio do zero para mostrar minhas habilidades e projetos futuros. Foi um desafio incrível aprender sobre semântica e responsividade!',
    imageUrl: 'https://picsum.photos/seed/portfolio/600/400',
    technologies: ['HTML5', 'CSS3', 'Flexbox'],
    repoUrl: 'https://github.com/jessicasilva/portfolio',
    liveUrl: '#',
    claps: 128,
    comments: [
      { id: 'c1', authorId: 'inst1', text: 'Que orgulho, Jessica! O layout ficou super limpo e profissional. Continue assim!', createdAt: 'Há 2 dias' },
      { id: 'c2', authorId: 'u2', text: 'Ficou muito bom! Me inspirou a começar o meu.', createdAt: 'Há 1 dia' },
    ],
    createdAt: '5 dias atrás',
  },
  {
    id: 'proj2',
    authorId: 'u2',
    title: 'Calculadora com JavaScript',
    description: 'Uma calculadora funcional construída com JavaScript puro para praticar a manipulação do DOM e lógica de programação. O objetivo era criar uma interface interativa e precisa.',
    imageUrl: 'https://picsum.photos/seed/calculator/600/400',
    technologies: ['HTML5', 'CSS3', 'JavaScript (ES6)'],
    repoUrl: '#',
    liveUrl: '#',
    claps: 72,
    comments: [],
    createdAt: '1 semana atrás',
  },
  {
    id: 'proj3',
    authorId: 'u3',
    title: 'Landing Page para Barbearia Local',
    description: 'Projeto freelancer para uma barbearia do meu bairro. O foco foi criar uma página moderna e responsiva para atrair novos clientes e facilitar o agendamento online.',
    imageUrl: 'https://picsum.photos/seed/barbershop/600/400',
    technologies: ['HTML5', 'CSS Grid', 'JavaScript', 'Responsivo'],
    repoUrl: '#',
    liveUrl: '#',
    claps: 245,
    comments: [],
    createdAt: '2 semanas atrás',
  },
];

export const MOCK_PARTNERS: Partner[] = [
  { id: 'p1', name: 'SENAC', logoUrl: 'https://seeklogo.com/images/S/Senac-logo-C1324B679A-seeklogo.com.png' },
  { id: 'p2', name: 'Seven Boys', logoUrl: 'https://seeklogo.com/images/S/seven-boys-logo-955225E039-seeklogo.com.png' },
  { id: 'p3', name: 'Hostinger', logoUrl: 'https://institutofuturoon.vercel.app/assets/imagens/parceiros/OIP.webp' },
  { id: 'p4', name: 'SENAI', logoUrl: 'https://seeklogo.com/images/S/SENAI-logo-1A3742296E-seeklogo.com.png' },
  { id: 'p5', name: 'FIRJAN', logoUrl: 'https://seeklogo.com/images/F/Firjan-logo-AEFF3521D7-seeklogo.com.png' },
  { id: 'p6', name: 'Alura', logoUrl: 'https://cdn.worldvectorlogo.com/logos/alura-1.svg' },
  { id: 'p7', name: 'Cornerstone', logoUrl: 'https://seeklogo.com/images/C/cornerstone-ondemand-logo-16629683A3-seeklogo.com.png' },
];

export const MOCK_EVENTS: Event[] = [
  { 
    id: 'ev1', 
    title: 'Live Coding: Construindo um App de Finanças com React', 
    date: 'AGO 25', 
    time: '19:00', 
    hostId: 'inst2', 
    description: 'Junte-se a Rodrigo Alves para construir um aplicativo de controle financeiro do zero, com dicas de performance e boas práticas.', 
    imageUrl: 'https://picsum.photos/seed/livecoding/600/400', 
    eventType: 'Live' 
  },
  { 
    id: 'ev2', 
    title: 'Workshop: Design Thinking para Devs', 
    date: 'SET 10', 
    time: '14:00', 
    hostId: 'inst1', 
    description: 'Aprenda com Fernanda Lima como aplicar os princípios do Design Thinking para criar produtos que os usuários realmente amam e precisam.', 
    imageUrl: 'https://picsum.photos/seed/designworkshop/600/400', 
    eventType: 'Workshop' 
  },
];

export const MOCK_MENTOR_SESSIONS: MentorSession[] = [
    { id: 'sess1', mentorId: 'inst1', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '14:00', isBooked: true, studentId: 'u1' },
    { id: 'sess2', mentorId: 'inst1', date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], time: '15:00', isBooked: false, studentId: null },
    { id: 'sess3', mentorId: 'inst2', date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], time: '16:00', isBooked: false, studentId: null },
];


export const EXERCISES: Exercise[] = [
  {
    id: 'ex1',
    lessonId: 'fe1-m1-l2',
    type: 'quiz',
    prompt: 'Qual a tag HTML correta para o maior título de uma página?',
    xp: 10,
    options: [
      { id: 'opt1', text: '<h6>' },
      { id: 'opt2', text: '<heading>' },
      { id: 'opt3', text: '<h1>' },
      { id: 'opt4', text: '<head>' },
    ],
    correctOptionId: 'opt3',
    feedback: {
      correct: 'É isso aí! A tag `<h1>` é usada para o título mais importante da página.',
      incorrect: 'Opa, não é bem essa. Tente lembrar qual tag representa a maior hierarquia de títulos.'
    }
  },
  {
    id: 'ex2',
    lessonId: 'fe1-m2-l1',
    type: 'quiz',
    prompt: 'Qual propriedade CSS é usada para alterar a cor do texto de um elemento?',
    xp: 10,
    options: [
      { id: 'opt1', text: 'font-color' },
      { id: 'opt2', text: 'text-color' },
      { id: 'opt3', text: 'color' },
      { id: 'opt4', text: 'background-color' },
    ],
    correctOptionId: 'opt3',
    feedback: {
      correct: 'Perfeito! A propriedade `color` é a correta para definir a cor do texto.',
      incorrect: 'Quase lá! Essa propriedade altera outra coisa. A que muda a cor do texto é mais simples do que parece.'
    }
  },
  {
    id: 'ex3',
    lessonId: 'fe2-m1-l1',
    type: 'quiz',
    prompt: 'Qual declaração de variável no JavaScript moderno permite reatribuição?',
    xp: 15,
    options: [
      { id: 'opt1', text: 'const' },
      { id: 'opt2', text: 'let' },
      { id: 'opt3', text: 'var' },
      { id: 'opt4', text: 'tanto let quanto var' },
    ],
    correctOptionId: 'opt4',
    feedback: {
      correct: 'Mandou bem! Tanto `let` quanto `var` permitem reatribuição, mas `let` tem escopo de bloco, o que é preferível no JS moderno.',
      incorrect: 'Não exatamente. Pense nas diferenças de escopo e reatribuição entre `const`, `let` e `var`.'
    }
  },
  // NOVOS EXERCÍCIOS PARA O CURSO DE HTML
  {
    id: 'ex-html1-m1-l3',
    lessonId: 'html1-m1-l3',
    type: 'quiz',
    prompt: 'Qual é a estrutura mínima obrigatória para um documento HTML5 válido?',
    xp: 10,
    options: [
        { id: 'opt1', text: '<html>, <head>, <body>' },
        { id: 'opt2', text: '<!DOCTYPE html>, <html>, <head>, <body>' },
        { id: 'opt3', text: '<head>, <body>, <title>' },
        { id: 'opt4', text: '<main>, <header>, <footer>' }
    ],
    correctOptionId: 'opt2',
    feedback: {
        correct: 'Exato! `<!DOCTYPE html>` informa ao navegador a versão do HTML, e `<html>`, `<head>` e `<body>` formam a espinha dorsal do documento.',
        incorrect: 'Quase lá. Lembre-se que precisamos declarar o tipo do documento antes de qualquer outra coisa.'
    }
  },
  {
      id: 'ex-html1-m2-l1',
      lessonId: 'html1-m2-l1',
      type: 'quiz',
      prompt: 'Para criar um parágrafo de texto em HTML, qual tag você utiliza?',
      xp: 10,
      options: [
          { id: 'opt1', text: '<par>' },
          { id: 'opt2', text: '<paragraph>' },
          { id: 'opt3', text: '<p>' },
          { id: 'opt4', text: '<text>' }
      ],
      correctOptionId: 'opt3',
      feedback: {
          correct: 'Corretíssimo! A tag `<p>` é a tag semântica para parágrafos.',
          incorrect: 'Essa não é a tag correta. A tag para parágrafos é bem simples e direta.'
      }
  },
  {
      id: 'ex-html1-m2-l2',
      lessonId: 'html1-m2-l2',
      type: 'quiz',
      prompt: 'Qual a diferença entre as tags <ul> e <ol>?',
      xp: 10,
      options: [
          { id: 'opt1', text: '<ul> é para listas com links, <ol> para listas com texto.' },
          { id: 'opt2', text: '<ul> cria uma lista não ordenada (com marcadores), e <ol> cria uma lista ordenada (com números).' },
          { id: 'opt3', text: '<ul> é uma tag antiga, <ol> é a versão moderna.' },
          { id: 'opt4', text: 'Não há diferença, ambas criam listas.' }
      ],
      correctOptionId: 'opt2',
      feedback: {
          correct: 'Perfeito! "UL" vem de "Unordered List" (lista não ordenada) e "OL" de "Ordered List" (lista ordenada).',
          incorrect: 'Não é bem isso. Pense no que as letras "U" e "O" significam em inglês no contexto de listas.'
      }
  },
  {
      id: 'ex-html1-m2-l3',
      lessonId: 'html1-m2-l3',
      type: 'quiz',
      prompt: 'Qual atributo da tag <a> é usado para definir o endereço de destino do link?',
      xp: 10,
      options: [
          { id: 'opt1', text: 'src' },
          { id: 'opt2', text: 'link' },
          { id: 'opt3', text: 'href' },
          { id: 'opt4', text: 'dest' }
      ],
      correctOptionId: 'opt3',
      feedback: {
          correct: 'Isso mesmo! `href` (Hypertext Reference) é o atributo que aponta para onde o link deve levar o usuário.',
          incorrect: 'Opa, esse atributo é usado em outras tags. Para links, usamos um específico para "referência de hipertexto".'
      }
  },
  {
      id: 'ex-html1-m3-l1',
      lessonId: 'html1-m3-l1',
      type: 'quiz',
      prompt: 'A tag <img> precisa de um atributo obrigatório para funcionar. Qual é ele?',
      xp: 10,
      options: [
          { id: 'opt1', text: 'alt' },
          { id: 'opt2', text: 'href' },
          { id: 'opt3', text: 'title' },
          { id: 'opt4', text: 'src' }
      ],
      correctOptionId: 'opt4',
      feedback: {
          correct: 'Mandou bem! O atributo `src` (source) define o caminho para o arquivo de imagem que será exibido.',
          incorrect: 'Embora os outros sejam importantes, o que define a imagem a ser carregada é o `src` (fonte).'
      }
  },
  {
      id: 'ex-html1-m3-l2',
      lessonId: 'html1-m3-l2',
      type: 'quiz',
      prompt: 'Qual tag semântica é mais apropriada para agrupar o conteúdo principal de uma página?',
      xp: 10,
      options: [
          { id: 'opt1', text: '<div>' },
          { id: 'opt2', text: '<section>' },
          { id: 'opt3', text: '<main>' },
          { id: 'opt4', text: '<article>' }
      ],
      correctOptionId: 'opt3',
      feedback: {
          correct: 'Exato! A tag `<main>` foi criada especificamente para delimitar o conteúdo principal e único da página, ajudando na acessibilidade e SEO.',
          incorrect: 'Embora as outras sejam usadas para estruturar, uma delas tem o papel específico de ser o "conteúdo principal".'
      }
  },
  {
      id: 'ex-html1-m3-l3',
      lessonId: 'html1-m3-l3',
      type: 'quiz',
      prompt: 'Dentro de uma tabela (<table>), qual tag é usada para criar uma linha?',
      xp: 10,
      options: [
          { id: 'opt1', text: '<td> (table data)' },
          { id: 'opt2', text: '<tr> (table row)' },
          { id: 'opt3', text: '<th> (table header)' },
          { id: 'opt4', text: '<line>' }
      ],
      correctOptionId: 'opt2',
      feedback: {
          correct: 'Perfeito! `<tr>` cria a linha, e dentro dela usamos `<td>` ou `<th>` para criar as células.',
          incorrect: 'Lembre-se: a estrutura é tabela > linha > célula. Qual tag representa a linha?'
      }
  },
  {
      id: 'ex-html1-m4-l1',
      lessonId: 'html1-m4-l1',
      type: 'quiz',
      prompt: 'Qual tag é o contêiner principal para todos os elementos de um formulário?',
      xp: 10,
      options: [
          { id: 'opt1', text: '<input>' },
          { id: 'opt2', text: '<form>' },
          { id: 'opt3', text: '<fieldset>' },
          { id: 'opt4', text: '<form-container>' }
      ],
      correctOptionId: 'opt2',
      feedback: {
          correct: 'Correto! A tag `<form>` agrupa todos os campos e botões que serão enviados juntos.',
          incorrect: 'A tag `<input>` é um elemento do formulário, mas qual é a tag que envolve tudo?'
      }
  },
  {
      id: 'ex-html1-m4-l2',
      lessonId: 'html1-m4-l2',
      type: 'quiz',
      prompt: 'Para criar um campo de senha que esconde os caracteres digitados, qual `type` usamos na tag `<input>`?',
      xp: 10,
      options: [
          { id: 'opt1', text: 'type="text"' },
          { id: 'opt2', text: 'type="hidden"' },
          { id: 'opt3', text: 'type="secret"' },
          { id: 'opt4', text: 'type="password"' }
      ],
      correctOptionId: 'opt4',
      feedback: {
          correct: 'É isso aí! `type="password"` oferece a funcionalidade visual de esconder a senha e ajuda os navegadores a gerenciar credenciais com segurança.',
          incorrect: 'Pense em qual palavra em inglês é usada para "senha". O HTML torna isso bem intuitivo.'
      }
  },
  {
      id: 'ex-html-playground-1',
      lessonId: 'html1-m4-l3',
      type: 'playground',
      prompt: 'Seu desafio é criar uma estrutura básica para sua página de portfólio. Use tudo o que aprendeu! Você precisa incluir:\n\n1. Um cabeçalho (`<header>`) com seu nome dentro de um `<h1>`.\n2. Uma seção principal (`<main>`).\n3. Dentro do `<main>`, adicione uma seção (`<section>`) para "Sobre Mim" com um parágrafo (`<p>`) sobre você.\n4. Adicione outra `<section>` para "Projetos" com uma lista não ordenada (`<ul>`) de pelo menos dois projetos.\n5. Um rodapé (`<footer>`) com seu contato ou uma rede social.',
      xp: 50,
      startingCode: {
          html: `<!-- Comece a codificar aqui! -->
    
`,
          css: `/* Estilos básicos para o preview */
body { 
    font-family: sans-serif; 
    background-color: #f4f4f9; 
    color: #333; 
    padding: 20px; 
    line-height: 1.6; 
}
header, footer { 
    background-color: #a855f7; 
    color: white; 
    padding: 1rem; 
    text-align: center; 
    border-radius: 8px; 
    margin-bottom: 1rem; 
}
main { 
    margin: 20px 0; 
}
section { 
    background-color: #fff; 
    padding: 1.5rem; 
    border-radius: 8px; 
    margin-bottom: 1rem; 
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
}
h1 {
    margin: 0;
}
h2 { 
    color: #7c3aed; 
}
ul { 
    padding-left: 20px; 
}
li { 
    margin-bottom: 0.5rem; 
}`,
          js: `console.log("Playground carregado!");
// Você pode adicionar interatividade aqui no futuro!`
      }
  },
  {
    id: 'ex-html-table-quiz-1',
    lessonId: 'html1-m3-l4',
    type: 'quiz',
    prompt: 'Qual tag semântica é usada para agrupar o conteúdo do cabeçalho de uma tabela?',
    xp: 10,
    options: [
        { id: 'opt1', text: '<th>' },
        { id: 'opt2', text: '<thead>' },
        { id: 'opt3', text: '<tr>' },
        { id: 'opt4', text: '<header>' }
    ],
    correctOptionId: 'opt2',
    feedback: {
        correct: 'Isso mesmo! `<thead>` agrupa o conteúdo do cabeçalho (que pode conter `<tr>` e `<th>`), melhorando a semântica e acessibilidade da tabela.',
        incorrect: 'Essa tag faz parte do cabeçalho, mas qual tag agrupa *toda* a seção do cabeçalho?'
    }
  },
  {
    id: 'ex-html-form-quiz-1',
    lessonId: 'html1-m4-l2-extra',
    type: 'quiz',
    prompt: 'Para criar um campo de email que valida o formato do texto inserido, qual `type` você usaria na tag `<input>`?',
    xp: 10,
    options: [
        { id: 'opt1', text: 'type="text"' },
        { id: 'opt2', text: 'type="url"' },
        { id: 'opt3', text: 'type="string"' },
        { id: 'opt4', text: 'type="email"' }
    ],
    correctOptionId: 'opt4',
    feedback: {
        correct: 'Exato! `type="email"` faz com que o navegador verifique se o texto inserido tem um formato de e-mail válido, melhorando a experiência do usuário.',
        incorrect: 'Não é essa a opção. Existe um tipo específico para campos de e-mail que ajuda na validação.'
    }
  },
  {
    id: 'ex-css-responsive-playground-1',
    lessonId: 'fe1-m2-l4',
    type: 'playground',
    prompt: '**Desafio de Responsividade!** Faça o card abaixo mudar de layout em telas menores.\n\n**Requisitos:**\n1. Em telas com **menos de 600px** de largura, o card deve ter `flex-direction: column`.\n2. A imagem deve ocupar 100% da largura do card em telas pequenas.\n3. O texto deve ficar centralizado (`text-align: center`) em telas pequenas.',
    xp: 40,
    startingCode: {
        html: `<div class="card">
  <img src="https://picsum.photos/seed/responsive/200/150" alt="Paisagem aleatória">
  <div class="card-content">
    <h2>Card Responsivo</h2>
    <p>Este card se adapta ao tamanho da tela. Seu desafio é fazer a mágica acontecer com CSS!</p>
  </div>
</div>`,
        css: `body {
  background-color: #1a1a1a;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  font-family: sans-serif;
}

.card {
  display: flex;
  background-color: #2a2a2a;
  border-radius: 12px;
  overflow: hidden;
  max-width: 600px;
  border: 1px solid #444;
  color: #eee;
}

.card img {
  width: 200px;
  object-fit: cover;
}

.card-content {
  padding: 20px;
}

/* --- Seu código aqui! --- */
/* Use uma media query para telas com no máximo 600px de largura */

@media (max-width: 600px) {
  /* Adicione as regras de CSS para telas pequenas aqui */
  .card {
    
  }

  .card img {

  }

  .card-content {

  }
}
`,
        js: ''
    }
  },
   {
    id: 'ex-py-imc',
    lessonId: 'py1-m1-l4',
    type: 'playground',
    prompt: 'Crie um programa que recebe o peso (kg) e a altura (m) de uma pessoa e calcula o Índice de Massa Corporal (IMC).\n\n**Fórmula:** `IMC = peso / (altura * altura)`\n\n1. Peça ao usuário para inserir o peso e a altura.\n2. Lembre-se de converter os inputs para `float`.\n3. Imprima o resultado do IMC com duas casas decimais.',
    xp: 30,
    startingCode: {
        html: ``,
        css: ``,
        js: `// Use Python! This is just a template.
// Em um ambiente Python real, você usaria:
// peso = float(input("Digite seu peso em kg: "))
// altura = float(input("Digite sua altura em metros: "))
// ... seu código aqui ...
// print(f"Seu IMC é: {imc:.2f}")

console.log("Desafio Python: Calculadora de IMC");`
    }
},
{
    id: 'ex-py-guess',
    lessonId: 'py1-m2-l4',
    type: 'playground',
    prompt: 'Faça um jogo de adivinhação! O programa deve:\n\n1. Gerar um número secreto entre 1 e 100.\n2. Pedir para o usuário adivinhar o número.\n3. Se o palpite for maior, diga "Muito alto!". Se for menor, "Muito baixo!".\n4. O jogo continua até o usuário acertar.\n5. Ao acertar, parabenize o usuário e diga quantas tentativas ele levou.',
    xp: 35,
    startingCode: {
        html: ``,
        css: ``,
        js: `// Em um ambiente Python real, você usaria:
// import random
// numero_secreto = random.randint(1, 100)
// ... seu código com loop while aqui ...

console.log("Desafio Python: Jogo de Adivinhação");`
    }
}
];

export const MOCK_ANALYTICS_DATA_V2 = {
  totalStudents: 5231,
  newStudentsLast30d: 142,
  avgCompletionRate: 68,
  weeklyEngagement: 85,
  coursePerformance: [
    { courseId: 'html1', enrolled: 1200, completionRate: 85, avgTime: 14, satisfaction: 4.8, dropOffRate: 5 },
    { courseId: 'fe1', enrolled: 1500, completionRate: 75, avgTime: 22, satisfaction: 4.7, dropOffRate: 10 },
    { courseId: 'fe2', enrolled: 950, completionRate: 60, avgTime: 38, satisfaction: 4.9, dropOffRate: 15 },
    { courseId: 'fe3', enrolled: 450, completionRate: 55, avgTime: 55, satisfaction: 4.9, dropOffRate: 20 },
    { courseId: 'be1', enrolled: 600, completionRate: 65, avgTime: 45, satisfaction: 4.6, dropOffRate: 18 },
    { courseId: 'py1', enrolled: 800, completionRate: 70, avgTime: 48, satisfaction: 4.8, dropOffRate: 12 },
    { courseId: 'ia1', enrolled: 300, completionRate: 50, avgTime: 32, satisfaction: 4.9, dropOffRate: 25 },
    { courseId: 'ux1', enrolled: 750, completionRate: 80, avgTime: 24, satisfaction: 4.7, dropOffRate: 8 },
  ],
  lessonPerformance: {
    html1: [
      { lessonId: 'html1-m1-l1', title: 'O que é HTML...', studentsCompleted: 1190 },
      { lessonId: 'html1-m1-l2', title: 'Configurando seu ambiente', studentsCompleted: 1150 },
      { lessonId: 'html1-m1-l3', title: 'Sua primeira página', studentsCompleted: 1120 },
      { lessonId: 'html1-m2-l1', title: 'Títulos e Parágrafos', studentsCompleted: 1080 },
      { lessonId: 'html1-m2-l2', title: 'Listas', studentsCompleted: 1050 },
      { lessonId: 'html1-m2-l3', title: 'Links e Navegação', studentsCompleted: 1030 },
      { lessonId: 'html1-m3-l1', title: 'Inserindo Imagens', studentsCompleted: 1020 },
      { lessonId: 'html1-m3-l2', title: 'Tags Semânticas', studentsCompleted: 1000 },
    ],
    fe1: [
      { lessonId: 'fe1-m1-l1', title: 'Sintaxe e Seletores', studentsCompleted: 1450 },
      { lessonId: 'fe1-m1-l2', title: 'Cores e Unidades', studentsCompleted: 1400 },
      { lessonId: 'fe1-m2-l1', title: 'Flexbox na prática', studentsCompleted: 1300 },
      { lessonId: 'fe1-m2-l2', title: 'Grid Layout', studentsCompleted: 1250 },
    ]
  },
  studentRetention: {
    average: 72.5,
    trend: 3.1,
    dailyData: [60, 62, 65, 63, 68, 70, 72, 75, 74, 76, 78, 80, 79, 77, 75, 73, 70, 71, 74, 75, 77, 79, 81, 80, 78, 76, 75, 77, 78, 80]
  },
  studentEngagement: {
    topStudents: [
      { id: 'u1', name: 'Jessica Silva', avatarUrl: 'https://picsum.photos/seed/jessica/200', xp: 4850 },
      { id: 'u2', name: 'Carlos Souza', avatarUrl: 'https://picsum.photos/seed/carlos/200', xp: 4500 },
      { id: 'u3', name: 'Ana Beatriz', avatarUrl: 'https://picsum.photos/seed/anabeatriz/100', xp: 4200 },
    ],
    atRiskStudents: [
      { id: 'u4', name: 'Lucas Pereira', avatarUrl: 'https://picsum.photos/seed/lucas/200', lastLoginDaysAgo: 15 },
      { id: 'u5', name: 'Mariana Costa', avatarUrl: 'https://picsum.photos/seed/mariana/200', lastLoginDaysAgo: 21 },
    ]
  }
};

export const ARTICLES: Article[] = [
  {
    id: 'article-1',
    title: '5 Dicas de CSS que Vão Elevar o Nível dos Seus Projetos',
    subtitle: 'Pequenos truques que fazem uma grande diferença no visual e na performance das suas interfaces.',
    author: 'Luiz Guilherme Bandeira',
    authorAvatarUrl: 'https://media.licdn.com/dms/image/v2/C4E03AQHY285KSVhOIA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1633218149828?e=1764201600&v=beta&t=MB42B1OwsODKmFYAScLHjMLGnSAU1BMjDb0SfE9KaO4',
    date: '12 de Julho, 2024',
    summary: 'Cansado do mesmo visual de sempre? Descubra como usar seletores avançados, variáveis, e unidades flexíveis para criar designs mais modernos e fáceis de manter.',
    imageUrl: 'https://picsum.photos/seed/cssdicas/600/400',
    category: 'Dicas',
    content: `## Dica 1: Use Variáveis CSS (Custom Properties)

Chega de repetir o mesmo código de cor em 20 lugares diferentes! Com as variáveis CSS, você pode definir um valor uma vez e reutilizá-lo em todo o seu projeto. Isso torna a manutenção e a criação de temas (como o modo escuro) muito mais fáceis.

\`\`\`css
:root {
  --cor-primaria: #7c3aed;
  --cor-texto: #e5e7eb;
  --padding-padrao: 1rem;
}

.meu-botao {
  background-color: var(--cor-primaria);
  color: var(--cor-texto);
  padding: var(--padding-padrao);
}
\`\`\`

## Dica 2: Adote Unidades Relativas (rem, em, %)

Usar pixels (\`px\`) para tudo pode quebrar seu layout em diferentes tamanhos de tela e configurações de acessibilidade. Adote unidades relativas:

-   **rem:** Relativo ao tamanho da fonte do elemento raiz (\`<html>\`). Ótimo para espaçamentos e tamanhos de fonte consistentes.
-   **em:** Relativo ao tamanho da fonte do elemento pai. Útil para componentes que devem escalar juntos.
-   **%:** Relativo ao tamanho do container pai. Perfeito para larguras e alturas fluidas.

## Dica 3: O Poder do \`:is()\` e \`:where()\`

Esses pseudo-seletores modernos ajudam a reduzir a repetição no seu CSS. O \`:is()\` permite agrupar vários seletores em uma única regra, mantendo a especificidade. O \`:where()\` faz o mesmo, mas com especificidade zero, o que o torna ideal para resets e estilos base.

\`\`\`css
/* Antes */
header p,
main p,
footer p {
  color: gray;
}

/* Depois com :is() */
:is(header, main, footer) p {
  color: gray;
}
\`\`\`

## Dica 4: Simplifique Layouts com \`gap\`

A propriedade \`gap\` não é só para Grid Layout! Agora você também pode usá-la com Flexbox. É a maneira mais fácil e limpa de adicionar espaçamento *entre* os itens de um container flex, sem precisar de margens que podem causar problemas de layout.

\`\`\`css
.container-flex {
  display: flex;
  gap: 16px; /* Adiciona 16px de espaço entre cada item filho */
}
\`\`\`

## Dica 5: Explore as Funções \`min()\`, \`max()\` e \`clamp()\`

Essas funções matemáticas do CSS permitem criar layouts verdadeiramente fluidos e responsivos sem a necessidade de múltiplas media queries.

-   \`width: min(90%, 800px);\`: A largura será 90% do container, mas nunca maior que 800px.
-   \`font-size: max(16px, 1.2rem);\`: O tamanho da fonte será o maior valor entre 16px e 1.2rem, útil para acessibilidade.
-   \`width: clamp(300px, 50vw, 800px);\`: O valor ideal é 50% da largura da tela, mas ele não será menor que 300px nem maior que 800px. É o "superpoder" da tipografia e larguras fluidas!

### Conclusão

Incorporar essas dicas no seu dia a dia não apenas tornará seu CSS mais limpo e eficiente, mas também abrirá novas possibilidades para criar designs mais sofisticados e adaptáveis. Experimente e veja a diferença!
`
  },
  {
    id: 'article-2',
    title: 'Da Quebrada para o Mundo: Como a FuturoOn Mudou Minha Vida',
    subtitle: 'Uma história real sobre como a programação pode ser uma ferramenta de transformação social e pessoal.',
    author: 'Jessica Silva',
    authorAvatarUrl: 'https://picsum.photos/seed/jessica/200',
    date: '05 de Julho, 2024',
    summary: 'Eu era da Zona Leste de SP, sem muitas perspectivas. A tecnologia parecia um universo distante. Hoje, sou desenvolvedora em uma grande empresa. Essa é a minha história.',
    imageUrl: 'https://picsum.photos/seed/historia/600/400',
    category: 'Histórias',
    content: 'Meu nome é Jessica, e essa é a minha história...'
  },
  {
    id: 'article-3',
    title: 'Git e GitHub: O Guia Definitivo para Começar a Versionar Seus Projetos',
    subtitle: 'Do `git init` ao `pull request`. Perca o medo da linha de comando e aprenda a colaborar como um dev profissional.',
    author: 'Luiz Guilherme Bandeira',
    authorAvatarUrl: 'https://media.licdn.com/dms/image/v2/C4E03AQHY285KSVhOIA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1633218149828?e=1764201600&v=beta&t=MB42B1OwsODKmFYAScLHjMLGnSAU1BMjDb0SfE9KaO4',
    date: '15 de Janeiro, 2025',
    summary: 'Este guia completo te levará do zero absoluto ao domínio dos comandos essenciais de Git e GitHub. Aprenda a criar repositórios, salvar seu progresso, trabalhar com branches e colaborar em projetos de código aberto.',
    imageUrl: 'https://picsum.photos/seed/git/600/400',
    category: 'Tutoriais',
    content: `## O que é Git e por que você PRECISA aprender?

Se você está começando no mundo do desenvolvimento, já deve ter ouvido falar de **Git** e **GitHub**. Pense no Git como uma "máquina do tempo" para o seu código. Ele permite que você salve "fotos" (chamadas de *commits*) do seu projeto em diferentes momentos. Se algo der errado, você pode simplesmente voltar para uma versão anterior que estava funcionando.

**Git** é o sistema que você instala no seu computador. **GitHub** é uma plataforma online (um site) onde você pode guardar cópias dos seus projetos (repositórios) e, o mais importante, colaborar com outras pessoas.

Este guia vai te ensinar o essencial para você começar a usar essas ferramentas como um profissional.

### Parte 1: Configuração Inicial

Antes de tudo, você precisa ter o Git instalado e configurado.

1.  **Instale o Git:** Acesse [git-scm.com](https://git-scm.com/downloads) e baixe a versão para o seu sistema operacional. A instalação é bem simples, basta seguir o passo a passo.
2.  **Configure seu nome e email:** Abra o terminal (ou Git Bash no Windows) e digite os seguintes comandos, substituindo pelas suas informações. Isso é crucial para que seus commits sejam associados corretamente à sua identidade no GitHub.
\`\`\`bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
\`\`\`

### Parte 2: Comandos Essenciais do Dia a Dia

Estes são os comandos que você usará 99% do tempo.

-   \`git init\`: Inicia um novo repositório Git na sua pasta de projeto. É o primeiro passo de todos.
-   \`git status\`: Mostra o estado atual do seu projeto. Quais arquivos foram modificados, quais são novos, etc. Use este comando *o tempo todo*.
-   \`git add <nome-do-arquivo>\`: Adiciona um arquivo específico à "área de preparação" (*staging area*). Pense nisso como colocar o arquivo em uma caixa para a próxima "foto". Você pode usar \`git add .\` para adicionar todos os arquivos modificados.
-   \`git commit -m "Sua mensagem descritiva"\`: Salva a "foto" (commit) dos arquivos que estão na *staging area*). A mensagem deve ser clara e explicar o que você fez. Ex: "Adiciona header ao site" ou "Corrige bug no login".
-   \`git log\`: Mostra o histórico de todos os commits que você fez.

### Parte 3: Conectando com o GitHub

Agora vamos salvar seu projeto online.

1.  **Crie um repositório no GitHub:** Vá ao site do GitHub, clique em "New" e crie um novo repositório. **Não** marque a opção de inicializar com um README.
2.  **Conecte seu projeto local ao remoto:** O GitHub te dará alguns comandos. Os mais importantes são:
    \`\`\`bash
    # Adiciona o endereço do seu repositório remoto
    git remote add origin https://github.com/seu-usuario/seu-repositorio.git
    
    # Renomeia sua branch principal para "main" (boa prática)
    git branch -M main
    
    # Envia seus commits para o GitHub
    git push -u origin main
    \`\`\`

Depois do primeiro \`push\`, para enviar futuras atualizações, você só precisa usar \`git push\`.

### Conclusão

Isso é o básico para você começar. Git é uma ferramenta poderosa com muitos recursos, mas dominar esses comandos já te coloca em um nível profissional. Agora, pratique! Crie um projeto, faça commits, e suba para o GitHub. Foguete não tem ré!
`
  },
];


export const MOCK_COURSES: Course[] = [
  {
    id: 'html1',
    title: 'HTML5 e CSS3 Essencial',
    description: 'Construa a base sólida para sua carreira na web. Aprenda a estruturar e estilizar suas primeiras páginas.',
    longDescription: 'Este curso é o ponto de partida para qualquer pessoa que queira entrar no mundo do desenvolvimento web. Você aprenderá os fundamentos do HTML para criar a estrutura e o esqueleto de um site, e usará o CSS para dar vida a ele com cores, fontes e layouts incríveis. Ao final, você construirá seu primeiro portfólio online.',
    track: 'Frontend',
    imageUrl: 'https://picsum.photos/seed/htmlcss/600/400',
    duration: '12 horas',
    skillLevel: 'Iniciante',
    instructorId: 'inst2',
    projectTitle: "Portfólio Pessoal Online",
    projectDescription: "Crie uma página de portfólio de uma única página, totalmente responsiva, para se apresentar profissionalmente. A página deve incluir uma seção sobre você, uma lista de suas habilidades, uma galeria de projetos (pode usar imagens de exemplo) e um formulário de contato.",
    projectCriteria: "- Uso correto de HTML semântico (`<header>`, `<main>`, `<section>`, `<footer>`, etc.).\n- Estilização feita com um arquivo CSS externo.\n- O layout deve ser responsivo e funcionar bem em telas de celular e desktop.\n- O formulário de contato deve conter campos para nome, email e mensagem, e um botão de envio.",
    modules: [
      {
        id: 'html1-m1', title: 'Introdução à Web',
        lessons: [
          { id: 'html1-m1-l1', title: 'O que é HTML, CSS e JS?', duration: '15 min', type: 'text', xp: 10,
            objective: 'Entender o papel fundamental de cada uma das três tecnologias base da web e como elas trabalham juntas.',
            mainContent: 'Bem-vindo(a) à sua jornada no desenvolvimento web! Nesta primeira aula, vamos desmistificar a sopa de letrinhas que forma a base de qualquer site ou aplicação na internet: HTML, CSS e JavaScript.\n\nPense em uma casa:\n- **HTML (HyperText Markup Language):** É a **estrutura**. São as paredes, o teto, as portas e as janelas. O HTML define o conteúdo e sua organização: "isto é um título", "isto é um parágrafo", "aqui vai uma imagem".\n- **CSS (Cascading Style Sheets):** É a **decoração e o design**. É a cor da parede, o tipo do piso, o estilo da janela. O CSS cuida de toda a parte visual: cores, fontes, espaçamentos, layouts e animações.\n- **JavaScript (JS):** É a **funcionalidade e interatividade**. É a campainha que toca, a luz que acende com um interruptor, a porta da garagem que abre sozinha. O JavaScript permite que sua página reaja a ações do usuário, busque dados, valide formulários e muito mais.\n\nJuntas, essas três tecnologias formam a base sólida sobre a qual todo o resto é construído. Dominá-las é o primeiro e mais importante passo para se tornar um(a) desenvolvedor(a) web de sucesso.',
            summary: 'HTML é a estrutura, CSS é o estilo e JavaScript é a interatividade. Eles são os pilares da web.'
          },
          { id: 'html1-m1-l2', title: 'Configurando seu ambiente', duration: '20 min', type: 'text', xp: 10,
            objective: 'Instalar e configurar as ferramentas essenciais para começar a programar: um navegador moderno e o VS Code.',
            mainContent: 'Para começar a construir para a web, você precisa de duas ferramentas principais:\n\n1. **Um Navegador Moderno:**\nProvavelmente você já tem um. Recomendamos o Google Chrome ou o Mozilla Firefox, pois eles possuem ótimas ferramentas de desenvolvimento (que vamos explorar mais tarde).\n\n2. **Um Editor de Código:**\nÉ aqui que você vai escrever seu código. Bloco de Notas não é uma opção! Recomendamos o **Visual Studio Code (VS Code)**. É gratuito, poderoso e usado por milhões de desenvolvedores no mundo todo.\n\n**Passo a passo para instalar o VS Code:**\n- Acesse o site oficial: `https://code.visualstudio.com/`\n- Baixe a versão para o seu sistema operacional (Windows, Mac ou Linux).\n- Siga as instruções de instalação. É bem simples!\n\n**Extensão Recomendada:**\nApós instalar, abra o VS Code, vá na aba de extensões (o ícone de blocos no menu lateral) e procure por "Live Server". Instale-a. Essa extensão mágica cria um servidor local que atualiza seu site no navegador automaticamente toda vez que você salva o arquivo. Isso acelera MUITO o desenvolvimento.',
            summary: 'Instale o VS Code e a extensão Live Server para ter um ambiente de desenvolvimento produtivo.'
          },
          { id: 'html1-m1-l3', title: 'Sua primeira página HTML', duration: '25 min', type: 'text', xp: 15,
            objective: 'Criar e visualizar o primeiro arquivo HTML, entendendo a estrutura básica de um documento.',
            mainContent: 'Vamos botar a mão na massa! Siga os passos:\n\n1. Crie uma nova pasta no seu computador chamada `meu-primeiro-site`.\n2. Abra o VS Code e, no menu, vá em `File > Open Folder...` e selecione a pasta que você criou.\n3. No painel lateral do VS Code, clique com o botão direito e crie um novo arquivo chamado `index.html`.\n4. Cole o código abaixo dentro do seu arquivo `index.html`:\n\n```html\n<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <title>Meu Primeiro Site</title>\n</head>\n<body>\n  <h1>Olá, Mundo!</h1>\n  <p>Este é o começo da minha jornada na programação!</p>\n</body>\n</html>\n```\n\n**Entendendo a Estrutura:**\n- `<!DOCTYPE html>`: Diz ao navegador que este é um documento HTML5.\n- `<html>`: O elemento raiz que envolve todo o conteúdo.\n- `<head>`: Contém informações sobre a página que não são visíveis no conteúdo, como o título da aba (`<title>`).\n- `<body>`: Contém todo o conteúdo visível da sua página: textos, imagens, links, etc.\n- `<h1>`: Uma tag de título de nível 1 (o mais importante).\n- `<p>`: Uma tag de parágrafo.\n\nPara visualizar, clique com o botão direito no arquivo e selecione "Open with Live Server". Seu navegador abrirá e você verá sua primeira página! Parabéns!',
            summary: 'Aprendemos a estrutura básica de um arquivo HTML e criamos nossa primeira página.',
            exerciseId: 'ex-html1-m1-l3'
          }
        ]
      },
      {
        id: 'html1-m2', title: 'Fundamentos do HTML',
        lessons: [
            { id: 'html1-m2-l1', title: 'Títulos e Parágrafos', duration: '15 min', type: 'text', xp: 10, objective: 'Aprender a usar as tags de título (h1 a h6) e parágrafos (p) para estruturar o texto.', exerciseId: 'ex-html1-m2-l1' },
            { id: 'html1-m2-l2', title: 'Listas', duration: '20 min', type: 'text', xp: 10, objective: 'Criar listas ordenadas (<ol>) e não ordenadas (<ul>) para organizar informações.', exerciseId: 'ex-html1-m2-l2' },
            { id: 'html1-m2-l3', title: 'Links e Navegação', duration: '20 min', type: 'text', xp: 10, objective: 'Entender como criar links (<a>) para navegar entre páginas e para sites externos.', exerciseId: 'ex-html1-m2-l3' }
        ]
      },
      {
          id: 'html1-m3', title: 'HTML Semântico e Mídia',
          lessons: [
              { id: 'html1-m3-l1', title: 'Inserindo Imagens', duration: '15 min', type: 'text', xp: 10, objective: 'Aprender a usar a tag <img> com os atributos src e alt.', exerciseId: 'ex-html1-m3-l1' },
              { id: 'html1-m3-l2', title: 'Tags Semânticas', duration: '25 min', type: 'text', xp: 15, objective: 'Entender a importância de tags como <header>, <main>, <section>, <footer> e <nav>.', exerciseId: 'ex-html1-m3-l2' },
              { id: 'html1-m3-l3', title: 'Tabelas para dados', duration: '20 min', type: 'text', xp: 10, objective: 'Criar tabelas com <table>, <tr> e <td>.', exerciseId: 'ex-html1-m3-l3' },
              { id: 'html1-m3-l4', title: 'Cabeçalhos de Tabela', duration: '20 min', type: 'text', xp: 10, objective: 'Diferenciar <thead>, <tbody> e <th>.', exerciseId: 'ex-html-table-quiz-1' }
          ]
      },
      {
          id: 'html1-m4', title: 'Formulários e Projeto Final',
          lessons: [
              { id: 'html1-m4-l1', title: 'Criando seu primeiro formulário', duration: '20 min', type: 'text', xp: 10, objective: 'Introdução à tag <form> e seus principais atributos.', exerciseId: 'ex-html1-m4-l1' },
              { id: 'html1-m4-l2', title: 'Tipos de Input Essenciais', duration: '25 min', type: 'text', xp: 15, objective: 'Explorar inputs como text, email, password, checkbox e radio button.', exerciseId: 'ex-html1-m4-l2' },
              { id: 'html1-m4-l3', title: 'Projeto Final: Seu Portfólio', duration: '1h 30min', type: 'text', xp: 50, objective: 'Aplicar todo o conhecimento adquirido para construir um portfólio pessoal.', exerciseId: 'ex-html-playground-1' }
          ]
      }
    ]
  },
  {
    id: 'fe1',
    title: 'JavaScript: Primeiros Passos',
    description: 'Dê vida às suas páginas! Aprenda a lógica de programação e manipule elementos com JavaScript.',
    longDescription: 'Neste curso, você vai mergulhar na linguagem que torna a web interativa. Vamos cobrir desde os conceitos básicos como variáveis, tipos de dados e condicionais, até a manipulação de elementos HTML (DOM), eventos e funções. É a base essencial para quem quer seguir carreira em frameworks como React, Angular ou Vue.js.',
    track: 'Frontend',
    imageUrl: 'https://picsum.photos/seed/javascript/600/400',
    duration: '20 horas',
    skillLevel: 'Iniciante',
    instructorId: 'inst1',
    modules: [
        { id: 'fe1-m1', title: 'Fundamentos do JS', lessons: [
            { id: 'fe1-m1-l1', title: 'O que é JavaScript?', duration: '15 min', type: 'text', xp: 10, objective: 'Entender o que é o JavaScript e seu papel no desenvolvimento web.' },
            { id: 'fe1-m1-l2', title: 'Variáveis e Tipos de Dados', duration: '25 min', type: 'text', xp: 15, objective: 'Aprender a declarar variáveis com var, let e const e conhecer os tipos primitivos.', exerciseId: 'ex1' }
        ]},
        { id: 'fe1-m2', title: 'Lógica e Estruturas', lessons: [
            { id: 'fe1-m2-l1', title: 'Operadores e Condicionais', duration: '30 min', type: 'text', xp: 15, objective: 'Usar if/else e operadores lógicos para tomar decisões no código.', exerciseId: 'ex2' },
            { id: 'fe1-m2-l2', title: 'Loops: for e while', duration: '25 min', type: 'text', xp: 15, objective: 'Aprender a repetir tarefas com laços de repetição.'}
        ]}
    ]
  },
  {
    id: 'py1',
    title: 'Python para Backend',
    description: 'Crie a lógica por trás das aplicações. Aprenda Python para construir APIs e gerenciar bancos de dados.',
    longDescription: 'Python é uma das linguagens mais populares e versáteis do mundo, especialmente no backend. Neste curso, você aprenderá a sintaxe limpa do Python, estruturas de dados, e como construir uma API RESTful simples usando o framework Flask. É o primeiro passo para se tornar um desenvolvedor backend completo.',
    track: 'Backend',
    imageUrl: 'https://picsum.photos/seed/python/600/400',
    duration: '25 horas',
    skillLevel: 'Iniciante',
    instructorId: 'inst1',
    modules: [
        { id: 'py1-m1', title: 'Introdução ao Python', lessons: [
            { id: 'py1-m1-l1', title: 'Por que Python?', duration: '15 min', type: 'text', xp: 10, objective: 'Conhecer as vantagens do Python e onde ele é usado.' },
            { id: 'py1-m1-l2', title: 'Sintaxe Básica e Variáveis', duration: '25 min', type: 'text', xp: 15, objective: 'Escrever seus primeiros scripts em Python.' },
            { id: 'py1-m1-l4', title: 'Desafio: Calculadora de IMC', duration: '30 min', type: 'text', xp: 30, objective: 'Praticar o uso de inputs e operações matemáticas.', exerciseId: 'ex-py-imc' }
        ]},
        { id: 'py1-m2', title: 'Estruturas de Controle', lessons: [
            { id: 'py1-m2-l1', title: 'Listas e Tuplas', duration: '30 min', type: 'text', xp: 15, objective: 'Aprender a armazenar e manipular coleções de dados.'},
            { id: 'py1-m2-l2', title: 'Dicionários', duration: '25 min', type: 'text', xp: 15, objective: 'Trabalhar com estruturas de chave-valor.' },
            { id: 'py1-m2-l4', title: 'Desafio: Jogo de Adivinhação', duration: '45 min', type: 'text', xp: 35, objective: 'Usar loops e condicionais para criar um jogo interativo.', exerciseId: 'ex-py-guess' }
        ]}
    ]
  },
  {
    id: 'ux1',
    title: 'Fundamentos de UX/UI Design',
    description: 'Aprenda a criar interfaces que os usuários amam. Entenda os princípios de design e usabilidade.',
    longDescription: 'Um bom produto digital não é só sobre código, mas também sobre a experiência do usuário. Neste curso, você será introduzido aos conceitos de User Experience (UX) e User Interface (UI). Aprenderá sobre pesquisa com usuários, personas, fluxos de navegação, prototipagem e os princípios de design visual que tornam uma interface bonita e funcional.',
    track: 'UX/UI',
    imageUrl: 'https://picsum.photos/seed/uxui/600/400',
    duration: '18 horas',
    skillLevel: 'Iniciante',
    instructorId: 'inst3',
    modules: [
        { id: 'ux1-m1', title: 'Introdução ao Design', lessons: [
            { id: 'ux1-m1-l1', title: 'Diferença entre UX e UI', duration: '20 min', type: 'text', xp: 10, objective: 'Entender a distinção e a colaboração entre as duas áreas.' },
            { id: 'ux1-m1-l2', title: 'O Processo de Design Thinking', duration: '30 min', type: 'text', xp: 15, objective: 'Conhecer as etapas de empatia, definição, ideação, prototipação e teste.' }
        ]},
        { id: 'ux1-m2', title: 'Pesquisa e Estratégia', lessons: [
            { id: 'ux1-m2-l1', title: 'Criando Personas', duration: '35 min', type: 'text', xp: 20, objective: 'Aprender a criar representações do seu usuário ideal para guiar o design.'},
        ]}
    ]
  },
];