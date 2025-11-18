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

Foguete não tem ré! Bora codar!`,
    status: 'published',
    claps: 78,
    tags: ['node.js', 'javascript', 'backend', 'iniciante', 'api']
  }
];
export const MOCK_COURSES: Course[] = [
  {
    id: 'course_empreendedorismo_digital',
    title: 'Empreendedorismo Digital: Do Zero ao Lançamento',
    description: 'Transforme sua ideia em um negócio digital de sucesso. Aprenda a validar, construir e lançar seu MVP.',
    longDescription: 'Este curso é um guia prático para tirar sua ideia do papel e transformá-la em um negócio digital. Você aprenderá desde a validação do seu conceito com a metodologia Lean Startup até a construção do seu Produto Mínimo Viável (MVP) e as estratégias para o lançamento no mercado. Ideal para quem sonha em empreender na era digital.',
    track: 'Negócios',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '12 horas',
    skillLevel: 'Iniciante',
    instructorId: 'h0VK5SzekwWfHJmkwMXNJJSleIE2', // Marlon Souza
    format: 'online',
    enrollmentStatus: 'open',
    
    heroContent: {
      subtitle: "CURSO COMPLETO",
      titleLine1: "Tire sua Ideia do Papel e",
      titleAccent: "Lance seu Negócio Digital.",
      description: "Aprenda o passo a passo para validar sua ideia, construir um MVP e conquistar seus primeiros clientes, mesmo com poucos recursos."
    },
    benefitsSection: {
      title: "Por que este curso vai virar o jogo para você?",
      subtitle: "BENEFÍCIOS DO CURSO",
      benefits: [
        { title: "Mentalidade Empreendedora", description: "Aprenda a pensar como um fundador de startup, focado em resolver problemas reais e criar valor." },
        { title: "Validação Rápida", description: "Domine técnicas para testar sua ideia no mercado sem gastar rios de dinheiro, usando o método Lean." },
        { title: "Do MVP ao Lançamento", description: "Construa seu produto mínimo viável (MVP) com ferramentas no-code e aprenda a iterar com feedback real de clientes." },
        { title: "Ferramentas Essenciais", description: "Conheça as ferramentas de marketing, gestão e produto que vão acelerar o crescimento do seu negócio digital." }
      ]
    },
    curriculumSection: {
      title: "O que você vai dominar?",
      subtitle: "NOSSO CURRÍCULO",
      items: [
        { title: "Fundamentos da Startup Enxuta", description: "Do problema à solução validada, entenda o ciclo Construir-Medir-Aprender." },
        { title: "Business Model Canvas na Prática", description: "Mapeie seu modelo de negócio de forma visual e estratégica para encontrar o caminho do lucro." },
        { title: "Construção de MVP com No-Code", description: "Crie protótipos e produtos funcionais sem precisar escrever uma linha de código, ideal para validar ideias." },
        { title: "Estratégias de Go-to-Market", description: "Aprenda como lançar seu produto, atrair os primeiros usuários e gerar as primeiras vendas." },
        { title: "Métricas que Importam", description: "Descubra como medir o sucesso do seu negócio com métricas como CAC, LTV e Churn." }
      ]
    },
    methodologySection: {
      title: "Como você vai aprender?",
      subtitle: "METODOLOGIA FUTUROON",
      benefits: [
        { title: "Aulas Presenciais e Online", description: "Tenha a flexibilidade de aprender no seu ritmo, com encontros que fortalecem o networking e a troca de ideias." },
        { title: "Instrutores do Mercado", description: "Aprenda com quem vive o empreendedorismo na prática e está construindo negócios de sucesso." },
        { title: "Projetos para Portfólio", description: "Termine o curso com seu próprio MVP validado e um pitch deck pronto para apresentar a investidores." },
        { title: "Comunidade e Suporte", description: "Faça parte de uma comunidade de jovens empreendedores, troque ideias e receba feedbacks constantes." }
      ]
    },
    ctaSection: {
      title: "Pronto para construir seu futuro?",
      description: "As inscrições para a próxima turma estão abertas. Garanta sua vaga e comece a jornada para se tornar o fundador do seu próprio negócio."
    },
  
    modules: [
      {
        id: "mod_ed_1",
        title: "Módulo 1: A Mentalidade Empreendedora",
        lessons: [
          { id: "les_ed_1_1", title: "O que é uma Startup e o Mindset do Fundador", duration: "15 min", type: "text", xp: 20 },
          { id: "les_ed_1_2", title: "Identificando Problemas Reais que Valem a Pena Resolver", duration: "20 min", type: "text", xp: 30 },
          { id: "les_ed_1_3", title: "Lean Startup: O Ciclo Construir-Medir-Aprender na Prática", duration: "18 min", type: "text", xp: 25 },
        ]
      },
      {
        id: "mod_ed_2",
        title: "Módulo 2: Validando sua Ideia",
        lessons: [
          { id: "les_ed_2_1", title: "Pesquisa de Mercado e Análise de Concorrência Simplificada", duration: "25 min", type: "text", xp: 35 },
          { id: "les_ed_2_2", title: "Criando sua Proposta Única de Valor (PUV)", duration: "15 min", type: "text", xp: 20 },
          { id: "les_ed_2_3", title: "A Arte da Entrevista com o Cliente: Como Obter Feedbacks Valiosos", duration: "22 min", type: "text", xp: 30 },
        ]
      },
      {
        id: "mod_ed_3",
        title: "Módulo 3: Construindo seu MVP (Produto Mínimo Viável)",
        lessons: [
          { id: "les_ed_3_1", title: "Introdução às Ferramentas No-Code para Criação Rápida", duration: "20 min", type: "text", xp: 30 },
          { id: "les_ed_3_2", title: "Mão na Massa: Prototipando sua Solução com Figma ou similar", duration: "30 min", type: "text", xp: 40 },
          { id: "les_ed_3_3", title: "Lançando seu MVP para um grupo fechado (Beta Testers)", duration: "15 min", type: "text", xp: 20 },
        ]
      },
      {
        id: "mod_ed_4",
        title: "Módulo 4: Estratégias de Lançamento e Crescimento",
        lessons: [
          { id: "les_ed_4_1", title: "Marketing Digital para Startups: Canais Essenciais para Começar", duration: "25 min", type: "text", xp: 35 },
          { id: "les_ed_4_2", title: "Técnicas de Aquisição dos Primeiros 100 Clientes", duration: "20 min", type: "text", xp: 30 },
          { id: "les_ed_4_3", title: "Métricas Essenciais: O que é CAC, LTV e Churn?", duration: "18 min", type: "text", xp: 25 },
        ]
      },
      {
        id: "mod_ed_5",
        title: "Módulo 5: Pitch e Futuro do Negócio",
        lessons: [
          { id: "les_ed_5_1", title: "Estruturando um Pitch Vencedor para Apresentar sua Ideia", duration: "20 min", type: "text", xp: 30 },
          { id: "les_ed_5_2", title: "Próximos Passos: Como buscar investimento e escalar seu negócio", duration: "15 min", type: "text", xp: 20 },
        ]
      }
    ]
  },
  {
    id: 'course_csharp_backend',
    title: 'C# para Backend: Do Zero ao Essencial',
    description: 'Domine C# e .NET para construir APIs e serviços robustos. A porta de entrada para o mundo corporativo de backend.',
    longDescription: 'Este curso é sua jornada completa no desenvolvimento backend com C# e a plataforma .NET. Você vai aprender do zero a lógica de programação com C#, passando por orientação a objetos, até a construção de APIs RESTful profissionais, acesso a bancos de dados com Entity Framework e boas práticas de arquitetura de software. Prepare-se para o mercado de trabalho.',
    track: 'Backend',
    imageUrl: 'https://images.unsplash.com/photo-1592609931095-54a2168ae893?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '40 horas',
    skillLevel: 'Iniciante',
    instructorId: 'h0VK5SzekwWfHJmkwMXNJJSleIE2', // Marlon Souza
    format: 'online',
    enrollmentStatus: 'open',
    
    heroContent: {
      subtitle: "FORMAÇÃO COMPLETA",
      titleLine1: "Construa APIs com C# e",
      titleAccent: "prepare-se para o mercado.",
      description: "Do zero absoluto à sua primeira API RESTful. Aprenda os fundamentos do .NET, Entity Framework e as melhores práticas para se tornar um desenvolvedor backend de destaque."
    },
    benefitsSection: {
      title: "Por que C# e .NET são seu passaporte para o futuro?",
      subtitle: "BENEFÍCIOS DO CURSO",
      benefits: [
        { title: "Mercado Corporativo", description: "Domine uma das stacks mais usadas por grandes empresas e startups, abrindo portas para as melhores vagas." },
        { title: "Além do Backend", description: "Com .NET, você aprende uma plataforma versátil para criar aplicações web, desktop, mobile, jogos e até IA." },
        { title: "Performance e Segurança", description: "Aprenda a construir sistemas rápidos, escaláveis e seguros, seguindo as melhores práticas da indústria." },
        { title: "Carreira Sólida", description: "Construa uma base de conhecimento sólida em uma tecnologia madura e com alta demanda, garantindo seu futuro profissional." }
      ]
    },
    curriculumSection: {
      title: "O que você vai dominar?",
      subtitle: "NOSSO CURRÍCULO",
      items: [
        { title: "Fundamentos do C#", description: "Lógica de programação, tipos, variáveis, laços de repetição e estruturas de decisão." },
        { title: "Orientação a Objetos", description: "Classes, objetos, herança, polimorfismo e encapsulamento na prática." },
        { title: "APIs RESTful com ASP.NET Core", description: "Construa e documente APIs que o mercado usa, com verbos HTTP, status codes e rotas." },
        { title: "Acesso a Dados com Entity Framework", description: "Conecte sua aplicação a um banco de dados, faça consultas e manipule dados de forma profissional." },
        { title: "Arquitetura e Boas Práticas", description: "Aprenda sobre injeção de dependência, SOLID e como organizar seu código para ser manutenível." }
      ]
    },
    methodologySection: {
      title: "Como você vai aprender?",
      subtitle: "METODOLOGIA FUTUROON",
      benefits: [
        { title: "Aulas Presenciais e Online", description: "Tenha a flexibilidade de aprender no seu ritmo, com encontros que fortalecem o networking e a troca de ideias." },
        { title: "Instrutores do Mercado", description: "Aprenda com quem vive o backend no dia a dia e está construindo sistemas de alta performance." },
        { title: "Projetos para Portfólio", description: "Finalize o curso com uma API completa e documentada para apresentar em entrevistas de emprego." },
        { title: "Comunidade e Suporte", description: "Faça parte de uma comunidade de devs, troque ideias, resolva desafios e receba feedbacks constantes." }
      ]
    },
    ctaSection: {
      title: "Pronto para se tornar um dev backend?",
      description: "As inscrições para a próxima turma estão abertas. Dê o primeiro passo para construir uma carreira sólida e com alta demanda no mercado de tecnologia."
    },
  
    modules: [
      {
        id: "mod_csharp_1",
        title: "Módulo 1: Fundamentos do C# e .NET",
        lessons: [
          { id: "les_csharp_1_1", title: "Configurando o Ambiente de Desenvolvimento", duration: "25 min", type: "text", xp: 20 },
          { id: "les_csharp_1_2", title: "Variáveis, Tipos e Operadores", duration: "30 min", type: "text", xp: 30 },
          { id: "les_csharp_1_3", title: "Estruturas de Controle: if/else e switch", duration: "20 min", type: "text", xp: 25 },
          { id: "les_csharp_1_4", title: "Laços de Repetição: for, while, foreach", duration: "22 min", type: "text", xp: 30 },
        ]
      },
      {
        id: "mod_csharp_2",
        title: "Módulo 2: Orientação a Objetos",
        lessons: [
          { id: "les_csharp_2_1", title: "Classes, Objetos e Métodos", duration: "35 min", type: "text", xp: 40 },
          { id: "les_csharp_2_2", title: "Herança e Polimorfismo", duration: "30 min", type: "text", xp: 35 },
          { id: "les_csharp_2_3", title: "Interfaces e Classes Abstratas", duration: "25 min", type: "text", xp: 30 },
        ]
      },
      {
        id: "mod_csharp_3",
        title: "Módulo 3: Construindo APIs com ASP.NET Core",
        lessons: [
          { id: "les_csharp_3_1", title: "Sua primeira API: Criando o projeto", duration: "20 min", type: "text", xp: 30 },
          { id: "les_csharp_3_2", title: "Controllers, Rotas e Verbos HTTP", duration: "40 min", type: "text", xp: 50 },
          { id: "les_csharp_3_3", title: "Recebendo e Validando Dados (DTOs)", duration: "30 min", type: "text", xp: 40 },
        ]
      }
    ]
  },
  {
    id: 'course_letramento_digital',
    title: 'Letramento Digital: Do Básico à Cidadania Online',
    description: 'Perca o medo da tecnologia e ganhe autonomia. Aprenda a usar o computador, a internet e as ferramentas digitais do dia a dia.',
    longDescription: 'Em um mundo cada vez mais conectado, saber usar as ferramentas digitais é essencial. Este curso é para você que quer começar do zero, perdendo o medo do computador e da internet. Vamos te guiar passo a passo para você usar e-mail, redes sociais, fazer pesquisas e se sentir seguro e confiante no mundo online.',
    track: 'Letramento Digital',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '25 horas',
    skillLevel: 'Iniciante',
    instructorId: 'h0VK5SzekwWfHJmkwMXNJJSleIE2',
    format: 'hibrido',
    enrollmentStatus: 'open',
    heroContent: {
      subtitle: "CONQUISTE SUA AUTONOMIA",
      titleLine1: "Desvende o Mundo Digital e",
      titleAccent: "Abra Portas para o Futuro.",
      description: "Do zero absoluto ao uso confiante das ferramentas digitais. Aprenda a usar o computador, navegar na internet, criar documentos e se comunicar online com segurança."
    },
    benefitsSection: {
      title: "Por que o letramento digital é essencial?",
      subtitle: "BENEFÍCIOS DO CURSO",
      benefits: [
        { title: "Independência no Dia a Dia", description: "Aprenda a resolver coisas online, como agendar serviços, fazer compras e usar aplicativos do governo." },
        { title: "Melhores Oportunidades", description: "O conhecimento digital básico é um requisito para a maioria dos empregos e abre portas no mercado de trabalho." },
        { title: "Comunicação e Conexão", description: "Use e-mails e redes sociais para se conectar com amigos, família e oportunidades profissionais." },
        { title: "Segurança e Cidadania", description: "Navegue com mais segurança, proteja seus dados e saiba como identificar golpes e notícias falsas." }
      ]
    },
    curriculumSection: {
      title: "O que você vai dominar?",
      subtitle: "NOSSO CURRÍCULO",
      items: [
        { title: "Perdendo o Medo do Computador", description: "Conheça as partes do computador, como usar o mouse, teclado e organizar seus arquivos em pastas." },
        { title: "Navegando na Internet com Segurança", description: "Como usar o Google, abrir sites, e os cuidados essenciais para não cair em armadilhas." },
        { title: "Comunicação por E-mail", description: "Crie sua conta de e-mail, envie, receba e organize suas mensagens como um profissional." },
        { title: "Ferramentas do Dia a Dia", description: "Aprenda a criar um currículo simples, usar planilhas para organizar suas finanças e fazer apresentações." },
        { title: "Redes Sociais e Cidadania Digital", description: "Use as redes sociais de forma consciente e entenda seu papel e seus direitos no ambiente online." }
      ]
    },
    methodologySection: {
      title: "Como você vai aprender?",
      subtitle: "METODOLOGIA FUTUROON",
      benefits: [
        { title: "Aulas Presenciais e Online", description: "Tenha a flexibilidade de aprender no seu ritmo, com encontros que fortalecem o networking e a troca de ideias." },
        { title: "Instrutores do Mercado", description: "Aprenda com quem vive o empreendedorismo na prática e está construindo negócios de sucesso." },
        { title: "Projetos para Portfólio", description: "Termine o curso com seu próprio MVP validado e um pitch deck pronto para apresentar a investidores." },
        { title: "Comunidade e Suporte", description: "Faça parte de uma comunidade de jovens empreendedores, troque ideias e receba feedbacks constantes." }
      ]
    },
    ctaSection: {
      title: "Pronto para construir seu futuro?",
      description: "As inscrições para a próxima turma estão abertas. Garanta sua vaga e comece a jornada para se tornar o fundador do seu próprio negócio."
    },
    modules: [
      { id: "mod_ld_1", title: "Módulo 1: Conhecendo o Computador", lessons: [
          { id: "les_ld_1_1", title: "Ligando e Desligando com Segurança", duration: "10 min", type: "text", xp: 10 },
          { id: "les_ld_1_2", title: "O Mouse e o Teclado sem segredos", duration: "15 min", type: "text", xp: 15 },
          { id: "les_ld_1_3", title: "Organizando seus Arquivos em Pastas", duration: "20 min", type: "text", xp: 20 },
      ]}
    ]
  },
  {
    id: 'course_ingles_dev',
    title: 'Inglês para Devs: Do "Hello World" à Documentação Técnica',
    description: 'Desbloqueie o universo da programação global. Aprenda o inglês essencial para ler documentações, participar de comunidades e impulsionar sua carreira tech.',
    longDescription: 'Aprender a programar é só uma parte da jornada. O inglês é a chave que abre as portas para as melhores documentações, os fóruns mais importantes e as vagas de emprego em empresas globais. Este curso foca no inglês que você, dev, realmente precisa no dia a dia.',
    track: 'Idiomas',
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e6973bea1c?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '20 horas',
    skillLevel: 'Iniciante',
    instructorId: 'h0VK5SzekwWfHJmkwMXNJJSleIE2',
    format: 'online',
    enrollmentStatus: 'open',
    heroContent: {
      subtitle: "DESTRAVE SEU POTENCIAL",
      titleLine1: "Fale a Língua do Código e",
      titleAccent: "Conquiste o Mundo Tech.",
      description: "Pare de depender de tradutores. Domine o vocabulário técnico para ler documentações, interagir em comunidades globais e acelerar sua carreira de desenvolvedor."
    },
    benefitsSection: {
      title: "Por que o inglês vai mudar seu jogo como dev?",
      subtitle: "BENEFÍCIOS DO CURSO",
      benefits: [
        { title: "Aprenda com a Fonte", description: "Acesse as documentações e tutoriais mais recentes sem esperar por traduções, saindo na frente." },
        { title: "Comunidade Global", description: "Participe de discussões no GitHub, Stack Overflow e outras comunidades, resolvendo problemas e fazendo networking." },
        { title: "Vagas Internacionais", description: "Esteja preparado para oportunidades em empresas gringas que exigem comunicação em inglês." },
        { title: "Código mais Limpo", description: "Escreva variáveis, comentários e commit messages em inglês, o padrão do mercado, e melhore a qualidade do seu código." }
      ]
    },
    curriculumSection: {
      title: "O que você vai dominar?",
      subtitle: "NOSSO CURRÍCULO",
      items: [
        { title: "Vocabulário Técnico Essencial", description: "Variáveis, funções, loops, condicionais. Aprenda os termos que você usa todo dia." },
        { title: "Lendo Documentações", description: "Técnicas de 'skimming' e 'scanning' para encontrar a informação que você precisa rapidamente em documentações oficiais." },
        { title: "Escrevendo como um Dev", description: "Como escrever mensagens de commit claras, abrir 'issues' no GitHub e fazer perguntas eficientes no Stack Overflow." },
        { title: "Comunicação em Times", description: "Simulações de 'daily meetings' e 'code reviews', praticando a fala e o 'listening' em um contexto de trabalho." },
        { title: "Pronúncia Descomplicada", description: "Foco nos sons e termos mais comuns da área de TI para você não travar na hora de falar." }
      ]
    },
    methodologySection: {
        title: "Como você vai aprender?",
        subtitle: "METODOLOGIA FUTUROON",
        benefits: [
          { title: "Aulas Presenciais e Online", description: "Tenha a flexibilidade de aprender no seu ritmo, com encontros que fortalecem o networking e a troca de ideias." },
          { title: "Instrutores do Mercado", description: "Aprenda com quem vive o empreendedorismo na prática e está construindo negócios de sucesso." },
          { title: "Projetos para Portfólio", description: "Termine o curso com seu próprio MVP validado e um pitch deck pronto para apresentar a investidores." },
          { title: "Comunidade e Suporte", description: "Faça parte de uma comunidade de jovens empreendedores, troque ideias e receba feedbacks constantes." }
        ]
    },
    ctaSection: {
        title: "Pronto para construir seu futuro?",
        description: "As inscrições para a próxima turma estão abertas. Garanta sua vaga e comece a jornada para se tornar o fundador do seu próprio negócio."
    },
    modules: [
        { id: "mod_ing_1", title: "Módulo 1: Vocabulário Fundamental", lessons: [
          { id: "les_ing_1_1", title: "Termos Essenciais de Programação", duration: "20 min", type: "text", xp: 20 },
          { id: "les_ing_1_2", title: "Lendo Mensagens de Erro", duration: "15 min", type: "text", xp: 15 },
      ]}
    ]
  },
  {
    id: 'course_gamedev_2d',
    title: 'Desenvolvimento de Games: Crie seu Primeiro Jogo 2D',
    description: 'Entre no mundo da criação de jogos. Aprenda os fundamentos da lógica de games, pixel art e publique seu primeiro projeto.',
    longDescription: 'Sempre sonhou em criar seus próprios jogos? Este curso é o ponto de partida! Você vai aprender os conceitos essenciais do desenvolvimento de games 2D, desde o desenho dos personagens em pixel art até a programação da jogabilidade e interações. Ao final, você terá seu próprio jogo para mostrar para os amigos e adicionar ao portfólio.',
    track: 'Desenvolvimento de Games',
    imageUrl: 'https://images.unsplash.com/photo-1555864448-831bFCb71c18?q=80&w=1976&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '30 horas',
    skillLevel: 'Iniciante',
    instructorId: 'h0VK5SzekwWfHJmkwMXNJJSleIE2',
    format: 'hibrido',
    enrollmentStatus: 'soon',
    heroContent: {
      subtitle: "DO SONHO AO PLAY",
      titleLine1: "Tire sua Ideia da Cabeça e",
      titleAccent: "Crie seu Próprio Jogo 2D.",
      description: "Aprenda os fundamentos da lógica de programação para games, crie personagens em pixel art e desenvolva um jogo completo, do zero até a publicação."
    },
    benefitsSection: {
      title: "Por que criar jogos é uma jornada incrível?",
      subtitle: "BENEFÍCIOS DO CURSO",
      benefits: [
        { title: "Lógica na Prática", description: "Desenvolver jogos é uma das formas mais divertidas e eficazes de aprimorar sua lógica de programação." },
        { title: "Criatividade sem Limites", description: "Dê vida a seus próprios mundos, personagens e histórias, unindo arte e tecnologia." },
        { title: "Portfólio de Impacto", description: "Um jogo publicado é um projeto que se destaca em qualquer portfólio de desenvolvedor." },
        { title: "Base para o Futuro", description: "Os conceitos que você aprender aqui são a base para explorar motores de jogos mais complexos como Unity e Unreal." }
      ]
    },
    curriculumSection: {
      title: "O que você vai dominar?",
      subtitle: "NOSSO CURRÍCULO",
      items: [
        { title: "Introdução ao Game Design", description: "O que faz um jogo ser divertido? Aprenda sobre loops de gameplay, desafios e recompensas." },
        { title: "Pixel Art para Personagens", description: "Crie seus próprios personagens e cenários com a estética clássica dos jogos 2D." },
        { title: "Programando a Jogabilidade", description: "Controle do jogador, movimento, pulos e interações com o cenário usando JavaScript." },
        { title: "Física e Colisão", description: "Entenda como fazer os objetos do seu jogo interagirem, colidirem e reagirem uns aos outros." },
        { title: "Publicando seu Jogo", description: "Prepare seu jogo para ser jogado por qualquer pessoa, em qualquer lugar, através da web." }
      ]
    },
    methodologySection: {
        title: "Como você vai aprender?",
        subtitle: "METODOLOGIA FUTUROON",
        benefits: [
          { title: "Aulas Presenciais e Online", description: "Tenha a flexibilidade de aprender no seu ritmo, com encontros que fortalecem o networking e a troca de ideias." },
          { title: "Instrutores do Mercado", description: "Aprenda com quem vive o empreendedorismo na prática e está construindo negócios de sucesso." },
          { title: "Projetos para Portfólio", description: "Termine o curso com seu próprio MVP validado e um pitch deck pronto para apresentar a investidores." },
          { title: "Comunidade e Suporte", description: "Faça parte de uma comunidade de jovens empreendedores, troque ideias e receba feedbacks constantes." }
        ]
    },
    ctaSection: {
        title: "Pronto para construir seu futuro?",
        description: "As inscrições para a próxima turma estão abertas. Garanta sua vaga e comece a jornada para se tornar o fundador do seu próprio negócio."
    },
    modules: [
        { id: "mod_game_1", title: "Módulo 1: Conceitos de Game Design", lessons: [
            { id: "les_game_1_1", title: "O que faz um Jogo ser Divertido?", duration: "25 min", type: "text", xp: 25 },
        ]}
    ]
  },
  {
    id: 'course_letramento_melhor_idade',
    title: 'Conectando Gerações: Letramento Digital para a Melhor Idade',
    description: 'Descubra o mundo digital com segurança e confiança. Aprenda a usar o celular, redes sociais e a se conectar com a família e amigos.',
    longDescription: 'Nunca é tarde para aprender! Este curso foi pensado com muito carinho para o público da melhor idade que deseja se conectar ao mundo digital. Com aulas presenciais, paciência e um método passo a passo, vamos te ajudar a perder o medo da tecnologia e a usar o celular e o computador para se comunicar com a família, se informar e se divertir.',
    track: 'Letramento Digital',
    imageUrl: 'https://images.unsplash.com/photo-1615995064400-e3c35f6f3b43?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '15 horas',
    skillLevel: 'Iniciante',
    instructorId: 'h0VK5SzekwWfHJmkwMXNJJSleIE2',
    format: 'presencial',
    enrollmentStatus: 'open',
    heroContent: {
      subtitle: "NUNCA É TARDE PARA CONECTAR",
      titleLine1: "Descubra o Mundo Digital",
      titleAccent: "com Segurança e Confiança.",
      description: "Aprenda a usar o celular e o computador no seu ritmo. Faça chamadas de vídeo com a família, veja fotos nas redes sociais e use a internet no dia a dia sem medo."
    },
    benefitsSection: {
      title: "Por que este curso é para você?",
      subtitle: "BENEFÍCIOS DO CURSO",
      benefits: [
        { title: "Mais Perto da Família", description: "Aprenda a fazer chamadas de vídeo, receber fotos e participar dos grupos da família no WhatsApp." },
        { title: "Autonomia no Dia a Dia", description: "Marque consultas, peça um transporte por aplicativo e pesquise informações na internet com independência." },
        { title: "Segurança Online", description: "Entenda como se proteger de golpes e notícias falsas, navegando na internet com mais tranquilidade." },
        { title: "Novos Interesses", description: "Assista a vídeos, ouça músicas, leia notícias e descubra um universo de entretenimento e informação." }
      ]
    },
    curriculumSection: {
      title: "O que você vai aprender?",
      subtitle: "NOSSO CURRÍCULO",
      items: [
        { title: "Perdendo o Medo do Celular", description: "Entendendo os botões, ícones, touchscreen e as configurações básicas do seu smartphone." },
        { title: "WhatsApp para Família", description: "Mande mensagens de texto, áudio, fotos e faça chamadas de vídeo com seus parentes e amigos." },
        { title: "Navegando na Internet", description: "Como usar o Google para pesquisar o que você quiser, de receitas a notícias." },
        { title: "Redes Sociais para Começar", description: "Crie seu perfil no Facebook para ver fotos da família e interagir com amigos." },
        { title: "Segurança em Primeiro Lugar", description: "Como criar senhas seguras, identificar links perigosos e se proteger de golpes comuns." }
      ]
    },
    methodologySection: {
        title: "Como você vai aprender?",
        subtitle: "METODOLOGIA FUTUROON",
        benefits: [
          { title: "Aulas Presenciais e Online", description: "Tenha a flexibilidade de aprender no seu ritmo, com encontros que fortalecem o networking e a troca de ideias." },
          { title: "Instrutores do Mercado", description: "Aprenda com quem vive o empreendedorismo na prática e está construindo negócios de sucesso." },
          { title: "Projetos para Portfólio", description: "Termine o curso com seu próprio MVP validado e um pitch deck pronto para apresentar a investidores." },
          { title: "Comunidade e Suporte", description: "Faça parte de uma comunidade de jovens empreendedores, troque ideias e receba feedbacks constantes." }
        ]
    },
    ctaSection: {
        title: "Pronto para construir seu futuro?",
        description: "As inscrições para a próxima turma estão abertas. Garanta sua vaga e comece a jornada para se tornar o fundador do seu próprio negócio."
    },
    modules: [
        { id: "mod_ldmi_1", title: "Módulo 1: Primeiros Passos", lessons: [
            { id: "les_ldmi_1_1", title: "Conhecendo seu Celular", duration: "30 min", type: "text", xp: 10 },
        ]}
    ]
  },
  {
    id: 'course_python_dados',
    title: 'Python para Análise de Dados: Do Básico à Visualização',
    description: 'Transforme dados brutos em insights poderosos. Aprenda Python, Pandas e Matplotlib para analisar e visualizar informações do mundo real.',
    longDescription: 'Os dados estão em todo lugar, mas como extrair informações valiosas deles? Neste curso, você vai aprender a usar Python, uma das linguagens mais poderosas e versáteis do mercado, para manipular, analisar e visualizar dados. Domine bibliotecas como Pandas e Matplotlib e dê o primeiro passo para uma carreira em Análise ou Ciência de Dados.',
    track: 'IA',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '35 horas',
    skillLevel: 'Iniciante',
    instructorId: 'h0VK5SzekwWfHJmkwMXNJJSleIE2',
    format: 'online',
    enrollmentStatus: 'open',
    heroContent: {
      subtitle: "DADOS CONTAM HISTÓRIAS",
      titleLine1: "Aprenda Python e Transforme",
      titleAccent: "Números em Decisões.",
      description: "Do zero absoluto à sua primeira análise de dados. Domine os fundamentos de Python e bibliotecas como Pandas e Matplotlib para extrair insights e criar visualizações impactantes."
    },
    benefitsSection: {
      title: "Por que análise de dados com Python?",
      subtitle: "BENEFÍCIOS DO CURSO",
      benefits: [
        { title: "Alta Demanda no Mercado", description: "Profissionais que sabem analisar dados são disputados por empresas de todos os setores." },
        { title: "Tomada de Decisão Inteligente", description: "Aprenda a basear suas estratégias e conclusões em dados concretos, não em achismos." },
        { title: "Versatilidade do Python", description: "A mesma linguagem que você aprender para dados serve para web, automação, inteligência artificial e muito mais." },
        { title: "Conte Histórias com Dados", description: "Crie gráficos e visualizações que comunicam suas descobertas de forma clara e convincente." }
      ]
    },
    curriculumSection: {
      title: "O que você vai dominar?",
      subtitle: "NOSSO CURRÍCULO",
      items: [
        { title: "Fundamentos do Python", description: "Lógica, variáveis, listas, dicionários e funções. A base sólida para começar." },
        { title: "Introdução ao Pandas", description: "Manipule planilhas e tabelas de dados de forma eficiente com a biblioteca mais popular para análise de dados." },
        { title: "Limpeza e Tratamento de Dados", description: "Aprenda a lidar com dados faltantes, duplicados e inconsistentes, uma etapa crucial em qualquer projeto." },
        { title: "Análise Exploratória", description: "Calcule estatísticas, agrupe dados e descubra os primeiros padrões e insights." },
        { title: "Visualização com Matplotlib", description: "Crie seus primeiros gráficos de barras, linhas e dispersão para apresentar seus resultados." }
      ]
    },
    methodologySection: {
        title: "Como você vai aprender?",
        subtitle: "METODOLOGIA FUTUROON",
        benefits: [
          { title: "Aulas Presenciais e Online", description: "Tenha a flexibilidade de aprender no seu ritmo, com encontros que fortalecem o networking e a troca de ideias." },
          { title: "Instrutores do Mercado", description: "Aprenda com quem vive o empreendedorismo na prática e está construindo negócios de sucesso." },
          { title: "Projetos para Portfólio", description: "Termine o curso com seu próprio MVP validado e um pitch deck pronto para apresentar a investidores." },
          { title: "Comunidade e Suporte", description: "Faça parte de uma comunidade de jovens empreendedores, troque ideias e receba feedbacks constantes." }
        ]
    },
    ctaSection: {
        title: "Pronto para construir seu futuro?",
        description: "As inscrições para a próxima turma estão abertas. Garanta sua vaga e comece a jornada para se tornar o fundador do seu próprio negócio."
    },
    modules: [
        { id: "mod_py_1", title: "Módulo 1: Python do Zero", lessons: [
            { id: "les_py_1_1", title: "Variáveis e Tipos de Dados", duration: "20 min", type: "text", xp: 20 },
        ]}
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
    },
];
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