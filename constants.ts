import { User, Course, Article, Event, Exercise, Achievement, Notification, ForumPost, Project, Partner, MentorSession } from './types';

const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

// FIX: Added mock data for ARTICLES as it was missing.
export const ARTICLES: Article[] = [
    {
    id: 'art1',
    title: '5 Dicas para Conseguir seu Primeiro Emprego como Dev em 2024',
    subtitle: 'Uma jornada de persistência, comunidade e muito código.',
    author: 'Vitor Santos',
    date: '15 de Julho, 2024',
    summary: 'O mercado de tecnologia está aquecido, mas a primeira vaga é sempre um desafio. Veja dicas práticas para se destacar e conquistar seu espaço.',
    imageUrl: 'https://picsum.photos/seed/article1/600/400',
    authorAvatarUrl: 'https://media.licdn.com/dms/image/v2/D5603AQHQYTpCPcROvA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1725502652689?e=1764201600&v=beta&t=faPDzVvjRTzGbRvr1FmiZ7Ow_AI6vs4IIXAOXSO1GXs',
    category: 'Dicas',
    content: `
## O Sonho da Primeira Vaga

Conseguir o primeiro emprego como desenvolvedor pode parecer uma montanha russa. Um dia você está super motivado, no outro, a síndrome do impostor bate forte. Mas acredite: é possível. Com a estratégia certa, o "sim" está mais perto do que você imagina.

### 1. Portfólio é seu RG de Dev

Esqueça o currículo tradicional por um momento. No mundo tech, **seu código fala mais alto**. Tenha um portfólio com 2 ou 3 projetos que você se orgulha. Não precisa ser algo gigante. Um projeto bem feito, com código limpo e um README.md bem escrito, vale mais que dez projetos incompletos.

\`\`\`javascript
// Exemplo de um README bem estruturado
# Meu Projeto Incrível

## Descrição
Um app que resolve o problema X usando as tecnologias Y e Z.

## Como rodar
1. Clone o repositório
2. Instale as dependências com \`npm install\`
3. Rode com \`npm start\`
\`\`\`

### 2. Contribua com a Comunidade

Participe de projetos open source, responda dúvidas em fóruns, vá a meetups (mesmo que online). Se conectar com outras pessoas da área te dá visibilidade e te ensina muito. Muitas vagas são preenchidas por indicação. Quem você conhece pode ser a ponte para sua primeira oportunidade.

### 3. Estude o Básico, mas Estude de Verdade

Frameworks vêm e vão, mas os fundamentos ficam. Entender de verdade **HTML semântico, CSS, lógica de programação e JavaScript** é o que diferencia um bom profissional. Não pule etapas.

### 4. LinkedIn é sua Vitrine Profissional

Mantenha seu LinkedIn atualizado. Conecte-se com recrutadores e desenvolvedores das empresas que você admira. Publique seus projetos, escreva sobre o que você está aprendendo. Mostre que você é apaixonado por tecnologia.

### 5. Não Tenha Medo do "Não"

Você vai receber muitos "nãos". Faz parte do processo. Cada "não" é uma oportunidade de aprender. Peça feedback, entenda onde pode melhorar e continue estudando. A persistência é a chave.

Lembre-se: a jornada é uma maratona, não uma corrida de 100 metros. Continue codando, continue aprendendo e continue conectado. Sua hora vai chegar. Foguete não tem ré! 🚀
    `
  },
  {
    id: 'art2',
    title: 'Backend não é Bicho de 7 Cabeças: Uma Introdução ao Node.js',
    subtitle: 'Entenda como o JavaScript saiu do navegador para dominar os servidores.',
    author: 'Luiz Guilherme Bandeira',
    date: '02 de Julho, 2024',
    summary: 'Sempre quis saber como funciona o "lado do servidor"? Este artigo descomplica o Node.js e mostra por que ele é uma ótima porta de entrada para o mundo do backend.',
    imageUrl: 'https://picsum.photos/seed/article2/600/400',
    authorAvatarUrl: 'https://media.licdn.com/dms/image/v2/C4E03AQHY285KSVhOIA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1633218149828?e=1764201600&v=beta&t=MB42B1OwsODKmFYAScLHjMLGnSAU1BMjDb0SfE9KaO4',
    category: 'Tutoriais',
    content: `
## O que é esse tal de Node.js?

De forma simples: Node.js é um ambiente que permite executar código JavaScript fora de um navegador. Antes dele, JavaScript vivia apenas no "frontend" (o que você vê no site). Com o Node.js, ele passou a poder rodar no "backend" (o servidor, onde a mágica acontece).

### Por que isso é importante?

- **Uma linguagem para tudo:** Se você já sabe JS para o frontend, pode usar a mesma linguagem para o backend. Isso acelera muito o aprendizado.
- **Rápido e eficiente:** O Node.js é ótimo para aplicações que precisam lidar com muitas conexões ao mesmo tempo, como chats, apps de streaming e APIs.

### Seu primeiro servidor

Vamos criar um servidor "Hello World" em menos de 10 linhas de código.

\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Ola, Quebrada! Bem-vindo ao backend!\\n');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Servidor rodando em http://127.0.0.1:3000/');
});
\`\`\`

Rode esse código e acesse o endereço no seu navegador. Parabéns, você criou seu primeiro servidor!

O backend pode parecer complexo, mas com o Node.js, você tem uma porta de entrada poderosa e amigável. É o começo de uma jornada para construir aplicações completas e robustas. Bora codar!
`
  },
];

// FIX: Added mock data for MOCK_COURSES as it was missing.
export const MOCK_COURSES: Course[] = [
  {
    id: 'fe1',
    title: 'HTML & CSS Essencial',
    description: 'Aprenda a base do desenvolvimento web construindo páginas e layouts do zero.',
    longDescription: 'Neste curso, você vai dominar o HTML5 e o CSS3, as duas linguagens fundamentais para qualquer desenvolvedor web. Aprenda sobre tags semânticas, seletores CSS, Flexbox, Grid e como criar layouts responsivos que funcionam em qualquer dispositivo. Ao final, você construirá seu próprio portfólio online.',
    track: 'Frontend',
    imageUrl: 'https://picsum.photos/seed/htmlcss/600/400',
    duration: '25 horas',
    skillLevel: 'Iniciante',
    instructorId: 'inst2',
    modules: [
      {
        id: 'fe1-m1',
        title: 'Módulo 1: Fundamentos do HTML',
        lessons: [
          { id: 'fe1-m1-l1', title: 'Introdução à Web', duration: '15 min', type: 'text', xp: 5 },
          { id: 'fe1-m1-l2', title: 'Estrutura de uma Página HTML', duration: '20 min', type: 'text', xp: 10, exerciseId: 'ex1' },
          { id: 'fe1-m1-l3', title: 'Tags de Texto e Listas', duration: '25 min', type: 'text', xp: 10 },
        ]
      },
      {
        id: 'fe1-m2',
        title: 'Módulo 2: Estilizando com CSS',
        lessons: [
          { id: 'fe1-m2-l1', title: 'Introdução ao CSS', duration: '20 min', type: 'text', xp: 10 },
          { id: 'fe1-m2-l2', title: 'Seletores e Propriedades', duration: '30 min', type: 'text', xp: 15 },
        ]
      }
    ],
    projectTitle: 'Portfólio Pessoal',
    projectDescription: 'Crie seu próprio site de portfólio do zero para mostrar suas habilidades e projetos.',
    projectCriteria: '- Uso de HTML semântico.\n- Layout responsivo com Flexbox ou Grid.\n- Estilização criativa e consistente.'
  },
  {
    id: 'fe2',
    title: 'JavaScript Moderno (ES6+)',
    description: 'Domine a linguagem que move a web, de variáveis a funções assíncronas.',
    longDescription: 'O JavaScript é essencial para criar páginas interativas. Neste curso, você aprenderá desde a sintaxe básica até recursos avançados do ES6+, como arrow functions, promises e async/await. Vamos construir projetos práticos para solidificar o conhecimento e te preparar para frameworks como React.',
    track: 'Frontend',
    imageUrl: 'https://picsum.photos/seed/javascript/600/400',
    duration: '40 horas',
    skillLevel: 'Iniciante',
    instructorId: 'inst2',
    modules: [
      {
        id: 'fe2-m1',
        title: 'Módulo 1: Lógica e Sintaxe',
        lessons: [
          { id: 'fe2-m1-l1', title: 'Variáveis, Tipos e Operadores', duration: '30 min', type: 'text', xp: 15 },
          { id: 'fe2-m1-l2', title: 'Funções e Escopo', duration: '35 min', type: 'text', xp: 20 },
        ]
      }
    ],
  },
   {
    id: 'be1',
    title: 'Introdução ao Backend com Node.js',
    description: 'Leve seu JavaScript para o servidor e aprenda a construir APIs poderosas.',
    longDescription: 'Descubra o poder do JavaScript no backend com Node.js. Neste curso, você aprenderá os fundamentos, como criar um servidor, gerenciar pacotes com NPM e construir sua primeira API REST para se comunicar com o frontend. É o primeiro passo para se tornar um desenvolvedor Full Stack.',
    track: 'Backend',
    imageUrl: 'https://picsum.photos/seed/nodejs/600/400',
    duration: '30 horas',
    skillLevel: 'Intermediário',
    instructorId: 'inst1',
    modules: [
       {
        id: 'be1-m1',
        title: 'Módulo 1: Fundamentos do Node.js',
        lessons: [
          { id: 'be1-m1-l1', title: 'O que é Node.js?', duration: '20 min', type: 'text', xp: 10 },
          { id: 'be1-m1-l2', title: 'Criando seu primeiro servidor', duration: '25 min', type: 'text', xp: 15 },
        ]
      }
    ],
  }
];

export const MOCK_USERS: User[] = [
  // Alunos
  {
    id: 'u1',
    name: 'Jessica Silva',
    email: 'jessica.silva@email.com',
    avatarUrl: 'https://picsum.photos/seed/jessica/200',
    bio: 'Apaixonada por tecnologia e design, transformando ideias em realidade com código e criatividade. Cria da Zona Leste de SP!',
    role: 'student',
    completedLessonIds: ['fe1-m1-l1', 'fe1-m1-l2', 'fe2-m1-l1'],
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
      'fe1-m1-l1': 'A tag <head> guarda metadados invisíveis para o usuário. Já a tag <header> é para o cabeçalho visível do site (logo, menu, etc.). Importante não confundir!',
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
        lessonId: 'fe1-m1-l1',
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
        lessonId: 'fe1-m1-l1',
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
  { id: 'p1', name: 'SENAC', logoUrl: 'https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/parceiros/Senac_logo-e1703861599736.png' },
  { id: 'p2', name: 'Seven Boys', logoUrl: 'https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/parceiros/baixados.webp' },
  { id: 'p3', name: 'Hostinger', logoUrl: 'https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/parceiros/R-e1697294338555.jpeg' },
  { id: 'p4', name: 'Guara Crac', logoUrl: 'https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/parceiros/guara-crac-logo-png_seeklogo-399586.png' },
  { id: 'p5', name: 'FIRJAN', logoUrl: 'https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/parceiros/firjan-e1703861945784.png' },
  { id: 'p6', name: 'Alura', logoUrl: 'https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/parceiros/alura-e1703862743636.png' },
  { id: 'p7', name: 'Cornerstone', logoUrl: 'https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/parceiros/cursedstone-e1703861926809.png' },
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
      // FIX: Added missing 'incorrect' property to satisfy the type definition.
      incorrect: 'Quase lá! Lembre-se que as tags de título vão de <h1> (a mais importante) até <h6>.'
    },
  },
];

// FIX: Added mock data for MOCK_ANALYTICS_DATA_V2 as it was missing.
export const MOCK_ANALYTICS_DATA_V2 = {
  totalStudents: MOCK_USERS.filter(u => u.role === 'student').length,
  newStudentsLast30d: 15,
  avgCompletionRate: 45,
  weeklyEngagement: 75,
  coursePerformance: [
    { courseId: 'fe1', enrolled: 120, completionRate: 65, avgTime: 18, satisfaction: 4.8, dropOffRate: 15 },
    { courseId: 'fe2', enrolled: 85, completionRate: 40, avgTime: 25, satisfaction: 4.6, dropOffRate: 25 },
    { courseId: 'be1', enrolled: 95, completionRate: 55, avgTime: 30, satisfaction: 4.7, dropOffRate: 20 },
  ],
  lessonPerformance: {
    fe1: [
      { lessonId: 'fe1-m1-l1', title: 'Introdução à Web', studentsCompleted: 120 },
      { lessonId: 'fe1-m1-l2', title: 'Estrutura de uma Página HTML', studentsCompleted: 115 },
      { lessonId: 'fe1-m1-l3', title: 'Tags de Texto e Listas', studentsCompleted: 110 },
      { lessonId: 'fe1-m2-l1', title: 'Introdução ao CSS', studentsCompleted: 100 },
      { lessonId: 'fe1-m2-l2', title: 'Seletores e Propriedades', studentsCompleted: 85 },
    ],
    fe2: [
        { lessonId: 'fe2-m1-l1', title: 'Variáveis, Tipos e Operadores', studentsCompleted: 85 },
        { lessonId: 'fe2-m1-l2', title: 'Funções e Escopo', studentsCompleted: 70 },
    ],
    be1: [
        { lessonId: 'be1-m1-l1', title: 'O que é Node.js?', studentsCompleted: 95 },
        { lessonId: 'be1-m1-l2', title: 'Criando seu primeiro servidor', studentsCompleted: 80 },
    ],
  },
  studentRetention: {
    average: 62.5,
    trend: 3.1,
    dailyData: [60, 62, 65, 63, 61, 64, 68, 70, 68, 66, 65, 67, 69, 72, 71, 70, 68, 65, 63, 60, 58, 55, 57, 60, 62, 64, 63, 65, 67, 68],
  },
  studentEngagement: {
    topStudents: [
      { id: 'u1', name: 'Jessica Silva', avatarUrl: 'https://picsum.photos/seed/jessica/200', xp: 1250 },
      { id: 'inst1', name: 'Luiz Guilherme Bandeira', avatarUrl: 'https://media.licdn.com/dms/image/v2/C4E03AQHY285KSVhOIA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1633218149828?e=1764201600&v=beta&t=MB42B1OwsODKmFYAScLHjMLGnSAU1BMjDb0SfE9KaO4', xp: 1500},
      { id: 'inst2', name: 'Vitor Santos', avatarUrl: 'https://media.licdn.com/dms/image/v2/D5603AQHQYTpCPcROvA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1725502652689?e=1764201600&v=beta&t=faPDzVvjRTzGbRvr1FmiZ7Ow_AI6vs4IIXAOXSO1GXs', xp: 1800},
    ],
    atRiskStudents: [
      { id: 'u2', name: 'Carlos Souza', avatarUrl: 'https://picsum.photos/seed/carlos/200', lastLoginDaysAgo: 15 },
      { id: 'vol3', name: 'Renata D.S. Rocha', avatarUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQGIVgDAzEjY5Q/profile-displayphoto-shrink_200_200/B4DZc3N.HwGYAc-/0/1748978099190?e=1764201600&v=beta&t=dNzR-a1YoRK7h2HlM3OUGq8uD_zqkG0ruP9S01iudc0', lastLoginDaysAgo: 22 },
    ],
  },
};
