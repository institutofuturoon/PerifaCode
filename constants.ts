
import { User, Course, Article, Event, Exercise, Achievement, Notification, ForumPost, Project, Partner, MentorSession, AnalyticsData, CommunityPost, Supporter, FinancialStatement, AnnualReport } from './types';

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
  // ... outros artigos ...
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'csharp-backend-essential',
    title: 'C# Backend: Do Zero ao Essencial',
    description: 'Aprenda a criar sistemas robustos com C# e .NET. Do primeiro "Hello World" até APIs conectadas a banco de dados.',
    longDescription: `O mercado de tecnologia está sedento por desenvolvedores Backend que dominem C# e .NET. Este curso foi desenhado para levar você, passo a passo, da lógica de programação básica até a construção de APIs reais.

    Usaremos uma linguagem simples, sem "tiques e taques" desnecessários, focando no que você realmente vai usar no dia a dia das empresas. Vamos construir exemplos baseados na vida real: pizzarias, sistemas bancários e gerenciadores de tarefas.`,
    track: 'Backend',
    imageUrl: 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97663?q=80&w=2070&auto=format&fit=crop',
    duration: '40 horas',
    skillLevel: 'Iniciante',
    instructorId: 'instrutor_marlon',
    category: 'Backend',
    format: 'online',
    enrollmentStatus: 'open',
    heroContent: {
        titleLine1: 'Domine o Backend com',
        titleAccent: 'C# e .NET',
        subtitle: 'Formação Completa',
        description: 'Sua porta de entrada para grandes empresas. Aprenda a linguagem utilizada por bancos, fintechs e multinacionais, com uma didática direto ao ponto.'
    },
    benefitsSection: {
        title: 'Por que C#?',
        subtitle: 'Uma das linguagens mais poderosas do mundo',
        benefits: [
            { title: 'Alta Demanda', description: 'Empresas consolidadas usam C# e pagam ótimos salários.' },
            { title: 'Performance', description: 'O .NET é extremamente rápido e eficiente para web.' },
            { title: 'Versatilidade', description: 'Crie sites, apps mobile, jogos e inteligência artificial.' },
            { title: 'Ferramentas Incríveis', description: 'O Visual Studio é uma das melhores IDEs do mercado.' }
        ]
    },
    curriculumSection: {
        title: 'O que você vai aprender',
        subtitle: 'Do zero ao deploy',
        items: [
            { title: 'Lógica de Programação', description: 'Variáveis, condicionais e loops.' },
            { title: 'Orientação a Objetos', description: 'Classes, métodos e herança.' },
            { title: 'Banco de Dados', description: 'SQL Server e Entity Framework.' },
            { title: 'APIs REST', description: 'Criando serviços web modernos.' }
        ]
    },
    methodologySection: {
        title: 'Como ensinamos',
        subtitle: 'Mão na massa de verdade',
        benefits: [
            { title: 'Projetos Reais', description: 'Nada de exemplos abstratos. Vamos criar sistemas úteis.' },
            { title: 'Diagramas Visuais', description: 'Entenda a arquitetura antes de codar.' },
            { title: 'Mentoria', description: 'Suporte para suas dúvidas no fórum.' }
        ]
    },
    ctaSection: {
        title: 'Comece sua carreira agora',
        description: 'Junte-se à tropa de elite do Backend.'
    },
    modules: [
      {
        id: 'mod_csharp_fundamentos',
        title: 'Módulo 1: Fundamentos da Lógica',
        lessons: [
          {
            id: 'lesson_csharp_hello',
            title: 'Hello World e Variáveis',
            duration: '15 min',
            type: 'text',
            xp: 50,
            objective: 'Entender como o computador guarda informações e escrever seu primeiro código.',
            mainContent: `
## O que é uma Variável?

Imagine que a memória do computador é um grande armário cheio de gavetas. Uma **variável** é uma etiqueta que colocamos em uma dessas gavetas para guardar algo importante.

*   **int (Inteiro):** Gaveta para números inteiros (ex: idade, quantidade).
*   **string (Texto):** Gaveta para palavras e frases (ex: nome, endereço).
*   **bool (Booleano):** Gaveta para Verdadeiro ou Falso (ex: estáChovendo).

[TIP]
C# é uma linguagem "fortemente tipada". Isso significa que você não pode guardar um sapato na gaveta de talheres. Se a variável é \`int\`, ela só aceita números!
[/TIP]

### Exemplo Prático: Cadastro de Aluno

Vamos criar um mini-sistema para guardar os dados de um aluno da FuturoOn.

[CODE lang="csharp"]
// Declarando as variáveis (etiquetando as gavetas)
string nomeDoAluno = "Carlos da Silva";
int idade = 19;
bool matriculaAtiva = true;

// Mostrando na tela
Console.WriteLine("Aluno: " + nomeDoAluno);
Console.WriteLine("Idade: " + idade);
Console.WriteLine("Está ativo? " + matriculaAtiva);
[/CODE]

### Fluxo de Dados

Entenda como a informação flui:

[CODE lang="text"]
[ Código ]  --->  [ Memória RAM ]  --->  [ Tela (Console) ]
   |                    |                        |
   | "Carlos"           | Gaveta 'nome'          | Exibe:
   +------------------> | Guardado: "Carlos" |-->| "Aluno: Carlos"
[/CODE]
            `,
            summary: 'Variáveis são espaços na memória para guardar dados. Em C#, precisamos definir o tipo (texto, número, etc.) antes de usar.',
            exerciseId: 'ex_csharp_vars'
          },
          {
            id: 'lesson_csharp_condicionais',
            title: 'Tomando Decisões (If/Else)',
            duration: '20 min',
            type: 'text',
            xp: 60,
            objective: 'Ensinar o programa a tomar caminhos diferentes baseados em regras.',
            mainContent: `
## O Poder do "SE"

A vida é feita de decisões. "Se chover, levo guarda-chuva. Senão, vou de chinelo". Na programação, usamos o \`if\` (se) e o \`else\` (senão) para isso.

### Exemplo Prático: Sistema de Balada

Imagine que você está criando o sistema de entrada de uma festa. A regra é clara: só entra quem for maior de 18 anos.

[CODE lang="csharp"]
int idadeDoCliente = 17;

if (idadeDoCliente >= 18) 
{
    Console.WriteLine("Pode entrar. Aproveite a festa!");
}
else 
{
    Console.WriteLine("Barrado! Volte quando fizer 18.");
}
[/CODE]

### Diagrama de Fluxo

Veja como o computador "pensa" nesse caso:

[CODE lang="text"]
       [ Início ]
           |
           v
   < É maior de 18? >
   /              \\
SIM               NÃO
 /                  \\
v                    v
[Entra]            [Barrado]
 \\                  /
  \\                /
   v              v
      [ Fim ]
[/CODE]

[ALERT type="warning"]
Cuidado com a indentação (os espaços à esquerda). O código que está "dentro" do \`if\` deve estar um pouco para a direita para ficar organizado!
[/ALERT]
            `,
            summary: 'Use `if` para verificar uma condição verdadeira e `else` para o caso contrário. É a base da inteligência de qualquer software.'
          }
        ]
      },
      {
        id: 'mod_csharp_poo',
        title: 'Módulo 2: Orientação a Objetos (POO)',
        lessons: [
          {
            id: 'lesson_csharp_classes',
            title: 'Classes e Objetos: A Fábrica de Pizzas',
            duration: '25 min',
            type: 'text',
            xp: 100,
            objective: 'Entender a diferença entre Classe (molde) e Objeto (produto real).',
            mainContent: `
## O Molde e o Produto

POO (Programação Orientada a Objetos) é uma forma de organizar o código tentando imitar o mundo real.

*   **Classe:** É o projeto, o molde, a planta. Não existe fisicamente.
*   **Objeto:** É a coisa concreta criada a partir do molde.

### A Analogia da Pizzaria

Imagine que você vai criar um sistema para uma pizzaria.

1.  **Classe Pizza:** É o papel onde está escrito que toda pizza tem *Sabor*, *Tamanho* e *Preço*.
2.  **Objeto Pizza:** É a Pizza de Calabresa quentinha que saiu do forno.

[CODE lang="csharp"]
// O Molde (Classe)
public class Pizza 
{
    public string Sabor;
    public string Tamanho;
    public double Preco;

    public void Assar() 
    {
        Console.WriteLine("A pizza de " + Sabor + " está no forno!");
    }
}

// Usando o Molde (Programa Principal)
public class Program 
{
    public static void Main() 
    {
        // Criando um objeto (Instanciando)
        Pizza pedido1 = new Pizza();
        pedido1.Sabor = "Calabresa";
        pedido1.Tamanho = "Grande";
        pedido1.Preco = 45.00;

        // Usando uma ação do objeto
        pedido1.Assar(); 
    }
}
[/CODE]

### Diagrama UML Simplificado

Em projetos reais, desenhamos as classes assim:

[CODE lang="text"]
+------------------+
|      Pizza       |  <-- Nome da Classe
+------------------+
| + Sabor: text    |  <-- Propriedades (Características)
| + Tamanho: text  |
| + Preco: number  |
+------------------+
| + Assar()        |  <-- Métodos (Ações)
| + Cortar()       |
+------------------+
[/CODE]
            `,
            summary: 'Classe é a definição. Objeto é a instância. Você cria uma classe `Carro` e fabrica vários objetos `fusca`, `ferrari`, `uno`.'
          }
        ]
      },
      {
        id: 'mod_csharp_api',
        title: 'Módulo 3: APIs e Conexões',
        lessons: [
          {
            id: 'lesson_csharp_api_concept',
            title: 'O que é uma API? O Garçom Digital',
            duration: '15 min',
            type: 'text',
            xp: 80,
            objective: 'Compreender como sistemas conversam entre si.',
            mainContent: `
## O Garçom do Restaurante

Imagine que você está em um restaurante.
1.  **Você (Frontend):** Quer comer, mas não pode entrar na cozinha.
2.  **Cozinha (Backend/Banco de Dados):** Tem os ingredientes e prepara o prato.
3.  **Garçom (API):** Leva seu pedido até a cozinha e traz a comida até você.

A **API** (Interface de Programação de Aplicações) é esse mensageiro. Ela permite que o site (ou app) converse com o servidor sem saber como ele funciona por dentro.

### Diagrama de Arquitetura

[CODE lang="text"]
[ Celular do Cliente ]        [ Servidor na Nuvem ]
      (Frontend)                   (Backend)
          |                            |
          |  1. Pedido (Request)       |
          |--------------------------> |
          |      "Quero dados"         |
          |                            |
          |                            | 2. Processa
          |                            | 3. Busca no Banco
          |                            |
          |  4. Resposta (Response)    |
          |<-------------------------- |
          |      "Toma os dados"       |
[/CODE]

No próximo passo, vamos criar esse "Garçom" usando C#!
            `,
            summary: 'API é a ponte que conecta o usuário (frontend) aos dados (backend), garantindo segurança e organização.'
          }
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