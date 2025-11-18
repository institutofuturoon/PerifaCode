
import { User, Course, Article, Event, Exercise, Achievement, Notification, ForumPost, Project, Partner, MentorSession, AnalyticsData, CommunityPost } from './types';

// Todos os arrays de dados mockados foram esvaziados.
// A aplicação agora dependerá exclusivamente dos dados carregados do Firebase.
export const ARTICLES: Article[] = [
  {
    id: 'article_csharp_future_proof',
    title: 'Código C# à Prova de Futuro: Como Construir Software que Dura',
    subtitle: 'Do SOLID ao .NET moderno, aprenda as técnicas essenciais para escrever código C# que não vira legado da noite para o dia.',
    author: 'Marlon Souza',
    date: '28/07/2024',
    summary: 'No mundo da tecnologia, tudo muda rápido. Aprenda a escrever código C# que não só funciona hoje, mas que continua robusto, manutenível e relevante por anos. Descubra os segredos dos princípios SOLID, Design Patterns e das práticas modernas do .NET.',
    imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    authorAvatarUrl: 'https://ui73bvafvl0llamc.public.blob.vercel-storage.com/avatars/h0VK5SzekwWfHJmkwMXNJJSleIE2-1762893257247-marlos-KMpj2WyEcBYPlaO335BA2RIj63Fx2g.png',
    category: 'Carreira Tech',
    content: `No mundo da tecnologia, a única constante é a mudança. Um código que hoje é de ponta, amanhã pode ser considerado legado. Mas e se a gente pudesse escrever software que resiste ao teste do tempo? Isso não é mágica, é engenharia. É sobre construir uma base sólida que permite que seu código cresça e se adapte sem quebrar.

Neste post, vamos mergulhar em práticas e princípios essenciais que todo desenvolvedor C# deveria conhecer para criar software à prova de futuro. Bora lá?

## A Base de Tudo: Os Princípios SOLID

Se você quer construir um prédio que dure, precisa de um alicerce forte. No desenvolvimento de software, esse alicerce é o SOLID. É um conjunto de cinco princípios que nos ajudam a criar código mais limpo, flexível e fácil de manter.

**1. Princípio da Responsabilidade Única (SRP):**
Uma classe deve ter apenas um motivo para mudar. Pense em um canivete suíço: ele faz tudo, mas se uma lâmina quebrar, você pode ter que trocar a ferramenta inteira. Em código, é melhor ter ferramentas específicas: uma classe para se conectar ao banco de dados, outra para validar os dados do usuário, e assim por diante.

[CODE lang="csharp"]
// Ruim: Uma classe que faz tudo
public class UserService
{
    public void RegisterUser(string email, string password)
    {
        // Valida o email
        // Salva o usuário no banco
        // Envia um email de boas-vindas
    }
}

// Bom: Classes com responsabilidades separadas
public class UserValidator { /* ... */ }
public class UserRepository { /* ... */ }
public class EmailService { /* ... */ }
[/CODE]

**2. Princípio Aberto/Fechado (OCP):**
Seu código deve ser "aberto para extensão, mas fechado para modificação". Imagine que você tem uma classe que calcula o desconto para diferentes tipos de clientes. Em vez de modificar essa classe toda vez que um novo tipo de cliente surge (um \`if/else\` gigante), você cria uma estrutura que permite "plugar" novas regras de desconto sem mexer no que já funciona.

**3. Princípio da Substituição de Liskov (LSP):**
Esse nome assusta, mas a ideia é simples: se uma classe \`Pato\` herda de uma classe \`Ave\`, você deve poder usar um \`Pato\` em qualquer lugar que espere uma \`Ave\` sem quebrar o programa. Em outras palavras, as classes filhas devem se comportar como suas classes mães.

**4. Princípio da Segregação de Interfaces (ISP):**
É melhor ter várias interfaces pequenas e específicas do que uma interface grande e genérica. Não force uma classe a implementar métodos que ela não precisa. Se você tem uma interface \`ITrabalhador\` com os métodos \`Trabalhar()\` e \`Comer()\`, uma classe \`Robo\` não deveria ser forçada a implementar \`Comer()\`.

**5. Princípio da Inversão de Dependência (DIP):**
Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações (interfaces). Na prática, isso significa que sua classe de regra de negócio não deve depender diretamente de uma classe concreta que acessa um banco de dados SQL Server. Ela deve depender de uma interface \`IRepositorio\`, e a implementação concreta (SQL Server, Oracle, etc.) é "injetada" nela.

[TIP]
O princípio da Inversão de Dependência é a base para a Injeção de Dependência (DI), que vamos ver a seguir!
[/TIP]

## Desacoplando com Injeção de Dependência (DI)

A Injeção de Dependência é a técnica de "entregar" as dependências de uma classe em vez de deixá-la criá-las. Isso torna seu código muito mais flexível e testável.

[CODE lang="csharp"]
// Sem DI: A classe está "amarrada" ao SqlRepository
public class OrderService 
{
    private readonly SqlRepository _repository;
    public OrderService()
    {
        _repository = new SqlRepository(); // Acoplamento forte!
    }
}

// Com DI: A classe depende de uma abstração (interface)
public class OrderService 
{
    private readonly IOrderRepository _repository;
    public OrderService(IOrderRepository repository) // A dependência é injetada!
    {
        _repository = repository;
    }
}
[/CODE]

[ALERT type="info"]
**Frameworks de DI:** O próprio ASP.NET Core tem um sistema de injeção de dependência fantástico e fácil de usar. Aprender a usá-lo é um passo gigante na sua carreira como dev .NET!
[/ALERT]

## Não Trave a Execução: Programação Assíncrona

A programação assíncrona com \`async\` e \`await\` é crucial para criar aplicações que respondem rápido. Em vez de travar o programa esperando uma consulta ao banco de dados terminar, você libera a thread para fazer outras coisas e "espera" pelo resultado de forma eficiente.

[CODE lang="csharp"]
// Bloqueante (ruim para UI e servidores)
public User GetUser(int id)
{
    // A thread fica parada aqui esperando o banco
    return _context.Users.Find(id);
}

// Assíncrono (bom)
public async Task<User> GetUserAsync(int id)
{
    // A thread é liberada enquanto o banco trabalha
    return await _context.Users.FindAsync(id);
}
[/CODE]

## Construa para Todos: .NET Multiplataforma

Com o .NET (antes chamado de .NET Core), seu código C# não está mais preso ao Windows. Você pode desenvolver e rodar suas aplicações em Linux, macOS e, claro, em contêineres Docker. Escrever código multiplataforma desde o início garante que sua aplicação possa ir para qualquer lugar no futuro.

## A Rede de Segurança: Testes Automatizados

Código sem testes é um código com um futuro incerto. Testes (unitários, de integração) são sua rede de segurança. Eles garantem que, ao adicionar uma nova funcionalidade, você não quebrou algo que já funcionava. Investir em testes hoje economiza dores de cabeça gigantes no futuro.

## Conclusão: Construindo para o Amanhã

Escrever código à prova de futuro não é sobre prever o futuro, mas sim sobre construir software que seja resiliente, adaptável e fácil de entender. Ao aplicar os princípios SOLID, usar Design Patterns, abraçar a injeção de dependência e testar seu código, você não está apenas escrevendo linhas de código, está construindo um legado.

E aí, pronto para começar a construir o futuro?`,
    status: 'published',
    claps: 152,
    tags: ['c#', '.net', 'boas-praticas', 'arquitetura', 'solid']
  },
  {
    id: 'article_git_guide',
    title: 'Cartilha Git: Guia Prático para Iniciantes',
    subtitle: 'Desvende o versionamento de código de forma simples e visual. Comandos essenciais para começar a usar Git e GitHub hoje mesmo.',
    author: 'Marlon Souza',
    date: '02/08/2024',
    summary: 'Pense no Git como uma máquina do tempo para o seu código. Aprenda os comandos essenciais para versionar seus projetos, colaborar com outros devs e construir um portfólio incrível no GitHub.',
    imageUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    authorAvatarUrl: 'https://ui73bvafvl0llamc.public.blob.vercel-storage.com/avatars/h0VK5SzekwWfHJmkwMXNJJSleIE2-1762893257247-marlos-KMpj2WyEcBYPlaO335BA2RIj63Fx2g.png',
    category: 'Tutoriais',
    content: `Se você está começando no mundo da programação, já deve ter ouvido falar de Git e GitHub. Parecem complicados, né? Mas relaxa! A real é que eles são seus melhores amigos na jornada de dev.

Pense no Git como uma máquina do tempo para o seu código. Sabe quando você está trabalhando num projeto, faz uma alteração... e tudo quebra? Com o Git, você pode simplesmente voltar para a versão anterior que estava funcionando. Sem estresse, sem perder horas de trabalho.

Nesta cartilha, vamos desmistificar o Git de uma vez por todas, com uma linguagem que você entende. Bora?

## Git vs. GitHub: Qual a diferença?

Essa é a primeira dúvida de todo mundo. É simples:

*   **Git:** É a ferramenta, o programa que você instala no seu computador. Ele controla as versões do seu código, registrando cada mudança.
*   **GitHub:** É uma plataforma online (um site) onde você pode guardar seus projetos que usam Git. É como uma rede social para desenvolvedores, onde você pode hospedar seu código, colaborar com outras pessoas e criar seu portfólio.

[TIP]
Pense assim: O Git é o motor do carro, e o GitHub é a garagem na nuvem onde você estaciona o carro e pode mostrá-lo para os amigos. Existem outras "garagens" como GitLab e Bitbucket, mas o GitHub é a mais popular.
[/TIP]

## Os 3 Conceitos Essenciais

Para começar, você só precisa entender três ideias principais:

1.  **Repository (ou Repo):** É simplesmente a pasta do seu projeto. O Git cria uma "pasta mágica" oculta chamada \`.git\` dentro dela para rastrear tudo.
2.  **Commit:** É um "ponto de salvamento" ou uma foto do seu código em um determinado momento. Cada commit tem uma mensagem descrevendo o que foi alterado. Ex: "Adiciona botão de login na página inicial".
3.  **Branch:** São "ramificações" ou linhas do tempo paralelas do seu projeto. A principal é chamada de \`main\` (ou \`master\`). Quando você quer criar uma nova funcionalidade sem bagunçar o que já funciona, você cria uma nova branch. Depois de terminar, você "junta" (faz um *merge*) essa branch de volta na \`main\`.

## O Fluxo de Trabalho Básico: Sua Primeira Viagem no Tempo

Vamos para a prática! Esse é o passo a passo que você vai usar 90% do tempo.

**1. Iniciando o Git no seu projeto**
Abra o terminal na pasta do seu projeto e rode:
[CODE lang="bash"]
git init
[/CODE]
Isso cria o repositório e começa a "observar" a pasta.

**2. Verificando o status**
A qualquer momento, você pode perguntar ao Git: "E aí, o que tá rolando?".
[CODE lang="bash"]
git status
[/CODE]
Ele vai te dizer quais arquivos foram modificados, quais são novos, etc.

**3. Adicionando arquivos para o "pacote"**
Antes de salvar (commitar), você precisa dizer ao Git QUAIS arquivos quer salvar. Isso é chamado de "staging".
[CODE lang="bash"]
# Para adicionar um arquivo específico
git add nome_do_arquivo.html

# Para adicionar TODOS os arquivos modificados (use com cuidado!)
git add .
[/CODE]

**4. Salvando o pacote (Commit)**
Agora que os arquivos estão no "pacote", você salva essa versão com uma mensagem clara.
[CODE lang="bash"]
git commit -m "O que eu fiz nesta alteração"
[/CODE]
Exemplo: \`git commit -m "Cria a estrutura inicial do projeto HTML e CSS"\`

[ALERT type="info"]
**Analogia:** Pense que você está se mudando. \`git add\` é colocar as coisas dentro da caixa de papelão. \`git commit\` é fechar a caixa e escrever com um canetão o que tem dentro ("livros da sala", "pratos da cozinha").
[/ALERT]

## Conectando com o GitHub: Mostre seu Corre pro Mundo!

Agora vamos pegar nosso projeto local e colocar online no GitHub.

**1. Crie um novo repositório no site do GitHub.**
Vá no GitHub, clique em "New repository", dê um nome e crie (sem marcar nenhuma caixinha como README por enquanto).

**2. Conecte seu projeto local ao repositório do GitHub.**
O GitHub vai te dar um link. Você vai usar o comando abaixo para "apontar" seu projeto para essa garagem na nuvem.
[CODE lang="bash"]
git remote add origin https://github.com/seu-usuario/seu-repo.git
[/CODE]

**3. Envie suas alterações (Push)**
Finalmente, envie seus commits para o GitHub!
[CODE lang="bash"]
git push -u origin main
[/CODE]
O \`-u origin main\` só é necessário na primeira vez. Depois, você só precisa usar \`git push\`.

## Colaborando e Pegando Atualizações

*   **Clonar um projeto:** Para baixar um projeto que já está no GitHub para a sua máquina:
    [CODE lang="bash"]
    git clone https://github.com/usuario/repo.git
    [/CODE]
*   **Puxar atualizações:** Se alguém alterou o projeto no GitHub, para baixar essas alterações para o seu computador:
    [CODE lang="bash"]
    git pull
    [/CODE]

## Conclusão

É isso! Com esses comandos, você já consegue começar a versionar seus projetos e construir seu portfólio no GitHub. No começo pode parecer estranho, mas quanto mais você usa, mais natural se torna.

A chave é praticar. Crie um projeto, faça pequenas alterações e vá fazendo commits. Logo, o Git vai se tornar uma ferramenta indispensável no seu dia a dia. Foguete não tem ré, mas seu código agora tem! Pra cima!`,
    status: 'published',
    claps: 215,
    tags: ['git', 'github', 'iniciante', 'versionamento', 'carreira']
  },
  {
    id: 'article_nodejs_guide',
    title: 'Node.js Descomplicado: Seu Guia para o Backend e Futuro Tech!',
    subtitle: 'Entenda por que o JavaScript saiu do navegador e virou uma potência no backend. Um guia para iniciantes darem os primeiros passos com Node.js.',
    author: 'Marlon Souza',
    date: '10/08/2024',
    summary: 'Você já mexe com JavaScript no frontend? Imagine usar essa mesma linguagem para construir o "cérebro" das aplicações. Isso é Node.js! Descubra como ele funciona, por que é tão popular e crie seu primeiro servidor em minutos.',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    authorAvatarUrl: 'https://ui73bvafvl0llamc.public.blob.vercel-storage.com/avatars/h0VK5SzekwWfHJmkwMXNJJSleIE2-1762893257247-marlos-KMpj2WyEcBYPlaO335BA2RIj63Fx2g.png',
    category: 'Tutoriais',
    content: `Se você está começando no mundo do desenvolvimento web, provavelmente já ouviu falar de HTML, CSS e JavaScript. Eles são o trio parada dura do **frontend** – a parte que o usuário vê e interage no navegador.

Mas e a mágica que acontece por trás? O login, o salvamento de dados, as regras de negócio... Isso é o **backend**. E se eu te disser que você pode usar o mesmo JavaScript que você já conhece para construir isso?

Bem-vindo ao mundo do Node.js!

## O que é esse tal de Node.js?

De forma simples: **Node.js é um ambiente que permite que o JavaScript rode fora do navegador.**

É isso. Pegaram o motor do JavaScript que roda no Google Chrome (o V8), deram umas turbinadas e fizeram ele rodar direto no seu computador. Isso abriu um universo de possibilidades. Com Node.js, o JavaScript pode:

-   Acessar arquivos do seu computador.
-   Se conectar com bancos de dados.
-   Criar servidores web (APIs).
-   E muito mais!

[TIP]
Pense no JavaScript como um super-herói que antes só podia agir dentro do "prédio" do navegador. O Node.js deu a ele a chave da cidade, e agora ele pode voar por todo o sistema operacional!
[/TIP]

## Por que o Node.js é tão Popular? A Mágica do "Não-Bloqueante"

A grande sacada do Node.js é seu modelo de I/O (Input/Output) **não-bloqueante**. O nome é complicado, mas a ideia é genial.

Imagine um garçom em um restaurante:

*   **Garçom Bloqueante (tradicional):** Ele anota seu pedido, leva para a cozinha, ESPERA o prato ficar pronto, pega o prato e só ENTÃO leva para a sua mesa. Enquanto ele espera, não atende mais ninguém. Ineficiente, né?
*   **Garçom Node.js (Não-Bloqueante):** Ele anota seu pedido, entrega na cozinha e já vai atender outra mesa. Quando a cozinha avisa que seu prato está pronto, ele volta, pega e leva para você. Ele está sempre ocupado e atendendo várias pessoas "ao mesmo tempo".

No código, isso significa que o Node.js é excelente para tarefas que envolvem espera, como uma consulta a um banco de dados ou a leitura de um arquivo. Ele não fica parado esperando; ele inicia a tarefa e parte para a próxima, sendo avisado quando a anterior termina. Isso o torna extremamente rápido e eficiente para construir APIs que precisam lidar com muitas requisições simultâneas.

## Mão na Massa: Seu Primeiro Servidor "Olá, Mundo!"

Bora ver como é simples criar um servidor web com Node.js.

**1. Instale o Node.js:**
Vá no site oficial [nodejs.org](https://nodejs.org/) e baixe a versão LTS (Long Term Support). É só seguir o instalador, sem segredo.

**2. Crie um arquivo:**
Crie uma pasta para o seu projeto e, dentro dela, um arquivo chamado \`servidor.js\`.

**3. Escreva o código:**
Abra o arquivo \`servidor.js\` e cole o código abaixo.

[CODE lang="javascript"]
// 1. Importa o módulo 'http' nativo do Node.js
const http = require('http');

// 2. Define a porta onde nosso servidor vai rodar
const port = 3000;

// 3. Cria o servidor
const server = http.createServer((req, res) => {
  // Configura o cabeçalho da resposta
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  
  // Envia a resposta para o navegador
  res.end('Olá, Quebrada! Meu primeiro servidor com Node.js tá no ar! 🚀');
});

// 4. "Liga" o servidor e o faz escutar na porta definida
server.listen(port, () => {
  console.log(\`🚀 Servidor rodando a todo vapor em http://localhost:\${port}/\`);
});
[/CODE]

**4. Rode o servidor:**
Abra o terminal na pasta do seu projeto e execute o comando:
[CODE lang="bash"]
node servidor.js
[/CODE]
Você verá a mensagem "🚀 Servidor rodando a todo vapor..." no seu terminal.

**5. Teste no navegador:**
Abra seu navegador e acesse [http://localhost:3000](http://localhost:3000). Parabéns! Você acabou de criar e rodar seu primeiro backend com Node.js!

## O Futuro é Tech, e o Backend é a Base

Aprender Node.js não é apenas aprender uma nova ferramenta. É entender como a web funciona por trás das cortinas. É abrir portas para vagas de backend, uma das áreas mais bem pagas e com maior demanda no mercado de tecnologia.

Se você já gosta de JavaScript no frontend, dar o próximo passo para o Node.js é um caminho natural e poderoso para se tornar um desenvolvedor mais completo e preparado para o futuro.

Foguete não tem ré, mas seu código agora tem! Pra cima!`,
    status: 'published',
    claps: 78,
    tags: ['node.js', 'javascript', 'backend', 'iniciante', 'api']
  }
];
export const MOCK_COURSES: Course[] = [];
export const MOCK_USERS: User[] = [];
export const MOCK_ACHIEVEMENTS: Achievement[] = [];
export const MOCK_NOTIFICATIONS: Notification[] = [];
export const MOCK_FORUM_POSTS: ForumPost[] = [];
export const MOCK_PROJECTS: Project[] = [];
export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
    {
      id: 'post_1',
      authorId: 'h0VK5SzekwWfHJmkwMXNJJSleIE2', // Marlon Souza
      title: 'Qual a diferença real entre `let`, `const` e `var` em JavaScript?',
      content: `E aí, galera! Beleza?\n\nTo começando a estudar JavaScript mais a fundo e sempre vejo a galera usando \`let\` e \`const\`, mas nos exemplos mais antigos só tinha \`var\`. Fui pesquisar e entendi que tem a ver com escopo, mas ainda tá meio confuso na minha cabeça.\n\nAlguém consegue me explicar de um jeito simples, tipo "para leigos", qual a diferença prática entre eles e quando eu devo usar cada um? Valeu!`,
      tags: ['javascript', 'iniciante', 'frontend'],
      claps: 42,
      views: 215,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      replies: [
        {
          id: 'reply_1_1',
          authorId: 'O1a7N0I3M6c5p8q2S9u4V1w8Y5Z7', // Outro user
          content: 'Boa pergunta! A principal diferença é o escopo. `var` tem escopo de função, enquanto `let` e `const` têm escopo de bloco (tudo que está dentro de `{}`). Isso evita muitos bugs!',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 30 mins later
        },
      ],
      type: 'question',
      isSolved: false
    },
    {
      id: 'post_2',
      authorId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // Aluno Teste
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
export const MOCK_PARTNERS: Partner[] = [];
export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt_hackathon_favelas',
    title: 'Hackathon das Favelas 2024',
    date: 'AGO 15',
    time: '09:00',
    hostId: 'instructor_1', // Assuming an ID exists or generic
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
