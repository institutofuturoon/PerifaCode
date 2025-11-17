import { User, Course, Article, Event, Exercise, Achievement, Notification, ForumPost, Project, Partner, MentorSession, AnalyticsData } from './types';

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
    imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    imageUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    id: 'cs1',
    title: 'Lógica de Programação com C#',
    description: 'Aprenda os fundamentos da programação e construa uma base sólida para pensar como um desenvolvedor, usando a linguagem C#.',
    longDescription: 'Este curso é a porta de entrada para o mundo do desenvolvimento de software. Você aprenderá os conceitos essenciais de lógica de programação, como variáveis, condicionais e laços de repetição, aplicando tudo na prática com a linguagem C#, uma das mais requisitadas pelo mercado de trabalho em grandes empresas.',
    track: 'Backend',
    imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '40 horas',
    skillLevel: 'Iniciante',
    instructorId: 'user_marlon_souza',
    format: 'hibrido',
    enrollmentStatus: 'open',
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
    ],
    heroContent: {
        titleLine1: "Do Zero à Lógica,",
        titleAccent: "com C#.",
        description: "Aprenda os fundamentos da programação e construa uma base sólida para pensar como um desenvolvedor, usando a linguagem C#, uma das mais requisitadas pelo mercado."
    },
    benefitsSection: {
        title: "Por que C# é a Linguagem das Grandes Empresas?",
        subtitle: "Robusta, moderna e versátil. Descubra por que o ecossistema .NET é a escolha de gigantes da tecnologia.",
        benefits: [
            { title: "Mercado Corporativo", description: "C# é a linguagem preferida por grandes empresas para construir sistemas críticos, garantindo alta demanda por profissionais." },
            { title: "Além do Backend", description: "Com C#, você pode criar não só APIs, mas também jogos com Unity, aplicativos desktop e soluções em nuvem com Azure." },
            { title: "Performance e Segurança", description: "Construa aplicações rápidas, seguras e escaláveis com uma linguagem de alto desempenho e um framework robusto." },
            { title: "Carreira Sólida", description: "Dominar C# e .NET abre portas para as vagas mais bem pagas e estáveis do mercado de desenvolvimento backend." }
        ]
    },
    curriculumSection: {
        title: "Uma Jornada Completa para Pensar como um Programador",
        subtitle: "Nossa trilha foi desenhada para construir sua base lógica, do primeiro 'Olá, Mundo!' à criação de um programa funcional.",
        items: [
            { title: "O que é Lógica de Programação?", description: "Entenda o conceito de algoritmo e como organizar seu pensamento para resolver problemas." },
            { title: "Fundamentos do C#", description: "Domine variáveis, tipos de dados e operadores para manipular informações no seu código." },
            { title: "Tomando Decisões no Código", description: "Aprenda a usar estruturas condicionais (if/else) para criar programas inteligentes." },
            { title: "Repetindo Tarefas com Laços", description: "Utilize laços de repetição (for/while) para automatizar tarefas e processar dados." },
            { title: "Organizando com Funções e Arrays", description: "Escreva código limpo e reutilizável, e aprenda a trabalhar com coleções de dados." },
            { title: "Projeto Prático Final", description: "Aplique todo o conhecimento construindo uma calculadora de console e um jogo simples." }
        ]
    },
    methodologySection: {
        title: "Nossa Metodologia: Mão na Massa e Foco no Mercado",
        subtitle: "Acreditamos que se aprende a programar, programando. Nossas aulas são práticas, com desafios reais e suporte contínuo.",
        benefits: [
            { title: "Aulas Presenciais e Online", description: "Escolha o formato que funciona para você: a energia da sala de aula ou a flexibilidade do online." },
            { title: "Instrutores do Mercado", description: "Aprenda com quem trabalha na área, trazendo experiências e desafios reais para a aula." },
            { title: "Projetos para Portfólio", description: "Finalize o curso com um projeto prático para mostrar suas habilidades aos recrutadores." },
            { title: "Comunidade e Suporte", description: "Faça parte de uma comunidade ativa no Discord para tirar dúvidas e fazer networking." }
        ]
    },
    ctaSection: {
        title: "Pronto para Construir sua Base como Desenvolvedor?",
        description: "Não espere mais para investir no seu futuro. As vagas são limitadas. Preencha o formulário e garanta seu interesse na próxima turma!"
    }
  },
   {
    id: 'py1',
    title: 'Python para Análise de Dados',
    description: 'Aprenda a linguagem Python do zero e utilize bibliotecas como Pandas e Matplotlib para analisar e visualizar dados.',
    longDescription: 'Python é a principal ferramenta para cientistas e analistas de dados. Neste curso, você sairá do zero, aprenderá a lógica de programação com Python e mergulhará no universo da análise de dados, preparando-se para uma das carreiras mais promissoras da atualidade.',
    track: 'IA',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '50 horas',
    skillLevel: 'Iniciante',
    instructorId: 'user_marlon_souza',
    format: 'hibrido',
    enrollmentStatus: 'soon',
    category: 'IA',
    lessonsCount: 14,
    projectTitle: "Análise de Dados de Vendas de E-commerce",
    projectDescription: "Neste projeto, você receberá um conjunto de dados real (e anônimo) de vendas. Sua missão será limpar, analisar e extrair insights, respondendo a perguntas como: Qual o produto mais vendido? Qual o mês de maior faturamento? E, por fim, criar visualizações de dados para apresentar suas descobertas.",
    projectCriteria: "- Carregar os dados de um arquivo CSV usando Pandas.\n- Limpar dados ausentes e remover duplicatas.\n- Calcular métricas como faturamento total e média de vendas.\n- Usar `groupby` para analisar vendas por categoria.\n- Gerar pelo menos 3 visualizações diferentes com Matplotlib/Seaborn (gráfico de barras, linha e pizza).",
    modules: [
        {
            id: 'py1-m1',
            title: 'Introdução ao Python e Análise de Dados',
            lessons: [
                { id: 'py1-m1-l1', title: 'Por que Python para Dados?', duration: '20 min', type: 'text', xp: 10, objective: "Entender o papel do Python no mundo dos dados e suas vantagens.", mainContent: "Python é como o canivete suíço da programação: fácil de aprender, poderoso e com uma comunidade gigante. Para análise de dados, ele se destaca por bibliotecas incríveis que fazem o trabalho pesado por nós. Empresas como Netflix, Spotify e Instagram usam Python para entender seus usuários. Você está prestes a aprender a mesma ferramenta!" },
                { id: 'py1-m1-l2', title: 'Configurando o Ambiente com Jupyter', duration: '30 min', type: 'text', xp: 15, objective: "Instalar o Anaconda e se familiarizar com o Jupyter Notebook.", mainContent: "O Jupyter Notebook é o nosso laboratório. É um ambiente interativo onde podemos escrever código, ver os resultados e criar visualizações, tudo no mesmo lugar. Vamos instalar o Anaconda, que já vem com Python, Jupyter e todas as ferramentas que precisamos." },
                { id: 'py1-m1-l3', title: 'Olá, Mundo da Análise!', duration: '25 min', type: 'text', xp: 15, objective: "Escrever seu primeiro script para ler um arquivo de dados simples.", mainContent: "Vamos dar nosso primeiro passo prático! Usando a biblioteca Pandas, vamos aprender a ler um arquivo de dados (CSV) e usar o comando `.head()` para espiar as primeiras linhas. É a primeira vez que você fará o computador 'ler' e entender uma planilha!" }
            ]
        },
        {
            id: 'py1-m2',
            title: 'Fundamentos de Python para Dados',
            lessons: [
                { id: 'py1-m2-l1', title: 'Variáveis e Estruturas de Dados', duration: '35 min', type: 'text', xp: 20, objective: "Dominar listas e dicionários para organizar informações.", mainContent: "Para trabalhar com dados, precisamos saber como guardá-los. Vamos focar em duas estruturas essenciais: **Listas**, que são como colunas de uma planilha, e **Dicionários**, que nos permitem guardar dados com rótulos, como as informações de um cliente (nome, idade, cidade)." },
                { id: 'py1-m2-l2', title: 'Estruturas de Controle', duration: '30 min', type: 'text', xp: 20, objective: "Usar `if/else` e `for` para tomar decisões e repetir tarefas.", mainContent: "A análise de dados é sobre fazer perguntas e automatizar tarefas. Com o laço `for`, podemos percorrer milhares de linhas de dados para calcular uma soma. Com `if/else`, podemos criar categorias, como 'cliente novo' ou 'cliente antigo', baseados em uma condição." },
                { id: 'py1-m2-l3', title: 'Funções: Criando Nossas Ferramentas', duration: '30 min', type: 'text', xp: 20, objective: "Aprender a criar funções para reutilizar lógica de análise.", mainContent: "Se você precisa calcular a mesma métrica várias vezes, por que não criar sua própria ferramenta? Funções nos permitem 'empacotar' uma lógica (como calcular a idade média de uma lista de clientes) e reutilizá-la com um simples chamado." }
            ]
        },
        {
            id: 'py1-m3',
            title: 'Manipulação de Dados com Pandas',
            lessons: [
                { id: 'py1-m3-l1', title: 'O Poder dos DataFrames', duration: '35 min', type: 'text', xp: 25, objective: "Entender o que são Series e DataFrames, as estruturas centrais do Pandas.", mainContent: "Pandas é a biblioteca mais importante para análise de dados em Python. Sua principal estrutura é o **DataFrame**, que é basicamente uma tabela ou planilha superpoderosa dentro do nosso código. Vamos aprender a criar e a entender a anatomia de um DataFrame." },
                { id: 'py1-m3-l2', title: 'Seleção e Filtragem de Dados', duration: '40 min', type: 'text', xp: 30, objective: "Aprender a selecionar colunas, linhas e a filtrar dados com base em condições.", mainContent: "Seus dados têm milhares de linhas, mas você só quer ver os clientes do Rio de Janeiro que compraram nos últimos 30 dias. Como fazer isso? Vamos aprender os comandos `loc`, `iloc` e a filtragem booleana para 'fatiar' nossos dados e encontrar exatamente a informação que precisamos." },
                { id: 'py1-m3-l3', title: 'Limpando o Terreno: Tratando Dados Ausentes', duration: '35 min', type: 'text', xp: 25, objective: "Identificar e tratar valores nulos ou dados faltantes.", mainContent: "Dados do mundo real são bagunçados. Muitas vezes, teremos informações faltando. Vamos aprender a usar funções como `.isnull()`, `.dropna()` e `.fillna()` para lidar com esses buracos, garantindo que nossa análise seja precisa e confiável." },
                { id: 'py1-m3-l4', title: 'Agrupando e Agregando Dados', duration: '40 min', type: 'text', xp: 30, objective: "Usar o `groupby` para sumarizar informações por categoria.", mainContent: "O `.groupby()` é uma das ferramentas mais poderosas do Pandas. Quer saber a média de vendas por cidade? Ou o total de produtos vendidos por categoria? Com o `groupby`, podemos agrupar nossos dados e aplicar cálculos (soma, média, contagem) a cada grupo, revelando insights incríveis." }
            ]
        },
        {
            id: 'py1-m4',
            title: 'Contando Histórias com Dados: Visualização',
            lessons: [
                { id: 'py1-m4-l1', title: 'Seus Primeiros Gráficos com Matplotlib', duration: '40 min', type: 'text', xp: 30, objective: "Criar gráficos de barras e de linhas básicos para exibir resultados.", mainContent: "Números são importantes, mas gráficos contam histórias. Matplotlib é a base para a criação de gráficos em Python. Vamos aprender a criar nossas primeiras visualizações, como um gráfico de barras para comparar vendas entre produtos e um gráfico de linhas para ver a evolução do faturamento ao longo do tempo." },
                { id: 'py1-m4-l2', title: 'Deixando Tudo Mais Bonito com Seaborn', duration: '40 min', type: 'text', xp: 30, objective: "Usar a biblioteca Seaborn para criar gráficos estatísticos mais atraentes.", mainContent: "Seaborn é uma biblioteca construída sobre o Matplotlib que nos permite criar gráficos mais complexos e bonitos com menos código. Vamos explorar histogramas para entender a distribuição de idades dos clientes e gráficos de dispersão para ver a relação entre preço e quantidade vendida." },
                { id: 'py1-m4-l3', title: 'Exportando e Apresentando seus Resultados', duration: '25 min', type: 'text', xp: 20, objective: "Salvar seus gráficos e DataFrames para compartilhar suas análises.", mainContent: "Análise feita, é hora de mostrar para o mundo! Vamos aprender a salvar nossos gráficos como imagens (PNG, JPG) e nossos DataFrames tratados como novos arquivos CSV, prontos para serem usados em um relatório ou apresentação." },
                { id: 'py1-m4-l4', title: 'Projeto Final: Análise de E-commerce', duration: '60 min', type: 'text', xp: 60, objective: "Aplicar todo o conhecimento para analisar um conjunto de dados do início ao fim.", mainContent: "Chegou a hora de ser o detetive de dados! Você receberá um conjunto de dados e uma lista de perguntas de negócio. Sua missão é usar todo o poder do Pandas e do Matplotlib/Seaborn para limpar, analisar, visualizar e responder a essas perguntas, contando a história escondida nos dados." }
            ]
        }
    ],
     heroContent: {
        titleLine1: "Decifre o Mundo",
        titleAccent: "com Dados e Python.",
        description: "Aprenda a programar com uma das linguagens mais poderosas do mercado e transforme dados brutos em insights que geram impacto e abrem portas para uma nova carreira em tecnologia."
    },
    benefitsSection: {
      title: "Por que Análise de Dados é a Carreira do Futuro?",
      subtitle: "Em um mundo movido por dados, saber analisá-los e interpretá-los é um superpoder. Descubra por que essa habilidade é tão requisitada.",
      benefits: [
          { title: "Alta Demanda no Mercado", description: "Empresas de todos os setores precisam de profissionais que saibam transformar dados em decisões estratégicas." },
          { title: "Tomada de Decisão Inteligente", description: "Aprenda a basear suas conclusões em fatos e evidências, uma habilidade valiosa em qualquer área." },
          { title: "Versatilidade do Python", description: "Com Python, você não só analisa dados, mas também pode criar automações, desenvolver IAs e construir sistemas web." },
          { title: "Conte Histórias com Dados", description: "Crie visualizações e dashboards impactantes que comunicam suas descobertas de forma clara e convincente." }
      ]
    },
     curriculumSection: {
      title: "Sua Trilha para se Tornar um Analista de Dados",
      subtitle: "Do básico do Python à criação de visualizações complexas, nosso currículo é um passo a passo para o mundo dos dados.",
      items: [
          { title: "Fundamentos do Python", description: "Construa uma base sólida em programação com a sintaxe simples e poderosa do Python." },
          { title: "Manipulação com Pandas", description: "Domine a principal ferramenta para limpar, transformar, filtrar e agrupar dados de forma eficiente." },
          { title: "Análise Exploratória", description: "Aprenda a 'conversar' com os dados, descobrindo padrões, tendências e anomalias." },
          { title: "Visualização de Dados", description: "Use Matplotlib e Seaborn para criar gráficos que contam histórias e revelam insights." },
          { title: "Projeto Prático de Análise", description: "Aplique tudo em um projeto do mundo real, analisando um dataset de e-commerce." }
      ]
    },
    methodologySection: {
        title: "Nossa Metodologia: Mão na Massa e Foco no Mercado",
        subtitle: "Acreditamos que se aprende a programar, programando. Nossas aulas são práticas, com desafios reais e suporte contínuo.",
        benefits: [
            { title: "Aulas Presenciais e Online", description: "Escolha o formato que funciona para você: a energia da sala de aula ou a flexibilidade do online." },
            { title: "Instrutores do Mercado", description: "Aprenda com quem trabalha na área, trazendo experiências e desafios reais para a aula." },
            { title: "Projetos para Portfólio", description: "Finalize o curso com um projeto prático para mostrar suas habilidades aos recrutadores." },
            { title: "Comunidade e Suporte", description: "Faça parte de uma comunidade ativa no Discord para tirar dúvidas e fazer networking." }
        ]
    },
     ctaSection: {
        title: "Pronto para Transformar Dados em Decisões?",
        description: "Não espere mais para investir no seu futuro. As vagas são limitadas. Preencha o formulário e garanta seu interesse na próxima turma!"
    }
  },
  {
    id: 'ed1',
    title: 'Empreendedorismo Digital: Da Ideia ao Negócio',
    description: 'Transforme sua paixão em um negócio digital. Aprenda a validar ideias, criar um MVP, atrair clientes e gerenciar seu projeto.',
    longDescription: 'Este curso é o seu guia prático para tirar uma ideia do papel e transformá-la em um negócio digital de verdade. Você aprenderá desde a mentalidade empreendedora até as ferramentas essenciais para construir sua marca, fazer suas primeiras vendas e gerenciar seu projeto com eficiência.',
    track: 'Negócios',
    imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '30 horas',
    skillLevel: 'Iniciante',
    instructorId: 'user_marlon_souza',
    format: 'hibrido',
    enrollmentStatus: 'open',
    category: 'NEGÓCIOS',
    lessonsCount: 12,
    projectTitle: "Plano de Negócio Digital Simplificado (Pitch Deck)",
    projectDescription: "Como projeto final, você irá criar uma apresentação de 5 slides (um 'pitch deck') resumindo sua ideia de negócio. Você vai definir seu público, sua solução, como irá ganhar dinheiro e quais serão seus próximos passos, consolidando todo o aprendizado do curso.",
    projectCriteria: "- Slide 1: Apresentação da ideia e o problema que ela resolve.\n- Slide 2: Quem é o seu público-alvo.\n- Slide 3: Como seu produto/serviço funciona (o MVP).\n- Slide 4: Como você vai divulgar e vender.\n- Slide 5: Metas para os próximos 3 meses.",
    modules: [
        {
            id: 'ed1-m1',
            title: 'A Mentalidade Empreendedora',
            lessons: [
                { id: 'ed1-m1-l1', title: 'O que é Empreender na Era Digital?', duration: '20 min', type: 'text', xp: 10, objective: "Compreender as oportunidades do empreendedorismo digital e desenvolver uma mentalidade de resolução de problemas.", mainContent: "Empreender não é só sobre ter um CNPJ. É sobre encontrar um problema que você se importa e criar uma solução para ele. No mundo digital, as ferramentas para fazer isso estão na palma da sua mão. Vamos descobrir como transformar sua paixão ou habilidade em um negócio que pode alcançar o mundo todo, direto da sua casa." },
                { id: 'ed1-m1-l2', title: 'Validando sua Ideia de Negócio', duration: '30 min', type: 'text', xp: 15, objective: "Aprender a pesquisar e conversar com potenciais clientes para saber se sua ideia tem futuro.", mainContent: "Uma ideia genial só vale alguma coisa se as pessoas quiserem pagar por ela. Antes de construir qualquer coisa, vamos aprender a 'validar' nossa ideia. Isso significa conversar com o público, fazer pesquisas simples e usar ferramentas gratuitas para descobrir se existe uma demanda real para o que você quer oferecer." },
                { id: 'ed1-m1-l3', title: 'O Poder do MVP: Mínimo Produto Viável', duration: '25 min', type: 'text', xp: 15, objective: "Entender como criar uma versão simples e funcional do seu produto para testar o mercado rapidamente.", mainContent: "Não espere o produto perfeito para começar! O MVP (Mínimo Produto Viável) é a versão mais simples da sua ideia que já resolve o problema do cliente. Pode ser um perfil no Instagram, um grupo no WhatsApp ou uma página de vendas simples. Vamos aprender a lançar rápido para aprender mais rápido ainda." },
            ]
        },
        {
            id: 'ed1-m2',
            title: 'Construindo sua Presença Online',
            lessons: [
                { id: 'ed1-m2-l1', title: 'Sua Marca no Mundo: Nome e Identidade', duration: '30 min', type: 'text', xp: 20, objective: "Aprender a criar um nome e uma identidade visual básica para seu negócio usando ferramentas gratuitas.", mainContent: "Sua marca é a cara do seu negócio. Vamos aprender a escolher um nome que conecte com seu público e a usar ferramentas como o Canva para criar uma logo e uma paleta de cores que transmitam a personalidade do seu projeto. Uma boa identidade visual gera confiança e profissionalismo." },
                { id: 'ed1-m2-l2', title: 'Instagram para Negócios: O Básico que Vende', duration: '35 min', type: 'text', xp: 20, objective: "Configurar um perfil comercial no Instagram e criar os primeiros conteúdos.", mainContent: "O Instagram é uma das maiores vitrines do mundo. Vamos transformar seu perfil pessoal em uma máquina de negócios. Aprenda a escrever uma bio que atrai, a criar posts que engajam e a usar os Stories para se conectar com seus seguidores e futuros clientes." },
                { id: 'ed1-m2-l3', title: 'Introdução ao Tráfego Pago (Anúncios)', duration: '30 min', type: 'text', xp: 20, objective: "Entender o que são anúncios online e como impulsionar uma publicação para alcançar mais pessoas.", mainContent: "Quer chegar em mais gente? O tráfego pago é o caminho. Vamos desmistificar o botão 'Turbinar Publicação' do Instagram. Entenda como definir um público, um orçamento e criar seu primeiro anúncio para que mais pessoas conheçam seu trabalho." },
            ]
        },
        {
            id: 'ed1-m3',
            title: 'Vendas e Relacionamento com o Cliente',
            lessons: [
                { id: 'ed1-m3-l1', title: 'Como Fazer as Primeiras Vendas', duration: '30 min', type: 'text', xp: 25, objective: "Aprender estratégias para conseguir os primeiros clientes sem gastar dinheiro.", mainContent: "As primeiras vendas são as mais difíceis e as mais importantes. Vamos explorar técnicas para vender para sua rede de contatos (amigos, família), em grupos e para os primeiros seguidores, construindo confiança e conseguindo os primeiros depoimentos." },
                { id: 'ed1-m3-l2', title: 'WhatsApp Business: Sua Máquina de Atendimento', duration: '35 min', type: 'text', xp: 25, objective: "Configurar o WhatsApp Business com catálogo de produtos e mensagens automáticas.", mainContent: "O WhatsApp é uma ferramenta poderosa de vendas e atendimento. Vamos aprender a configurar a versão Business, cadastrar seus produtos ou serviços no catálogo e criar mensagens rápidas e de saudação para atender seus clientes de forma profissional e ágil." },
                { id: 'ed1-m3-l3', title: 'Entendendo o Funil de Vendas', duration: '30 min', type: 'text', xp: 25, objective: "Conhecer as etapas da jornada do cliente, desde o primeiro contato até a compra.", mainContent: "Ninguém compra na primeira visita. O funil de vendas é o caminho que um cliente percorre: ele te descobre, se interessa, confia em você e, finalmente, compra. Entender essas etapas (Topo, Meio e Fundo de Funil) vai te ajudar a criar o conteúdo certo para cada momento." },
            ]
        },
        {
            id: 'ed1-m4',
            title: 'Gestão para o Corre Valer a Pena',
            lessons: [
                { id: 'ed1-m4-l1', title: 'Finanças para Iniciantes: Preço, Custo e Lucro', duration: '35 min', type: 'text', xp: 30, objective: "Aprender a calcular o preço do seu produto/serviço e a entender o que é lucro.", mainContent: "Seu corre precisa pagar as contas! Vamos aprender o básico de finanças: como listar seus custos, como colocar um preço justo no seu trabalho e, o mais importante, como saber se você está tendo lucro. Usaremos planilhas simples para organizar tudo." },
                { id: 'ed1-m4-l2', title: 'Ferramentas Digitais para Organizar o Negócio', duration: '30 min', type: 'text', xp: 30, objective: "Conhecer ferramentas gratuitas para organizar tarefas, finanças e ideias.", mainContent: "A organização é a chave para crescer. Vamos conhecer ferramentas gratuitas como Trello (para organizar tarefas), Notion (para organizar ideias) e planilhas do Google (para finanças) que vão te ajudar a não se perder na correria do dia a dia." },
                { id: 'ed1-m4-l3', title: 'Projeto Final: Montando seu Pitch Deck', duration: '45 min', type: 'text', xp: 50, objective: "Aplicar todo o conhecimento para criar uma apresentação simples e clara da sua ideia de negócio.", mainContent: "Hora de juntar tudo que aprendemos! Você vai criar uma apresentação curta e direta (pitch deck) da sua ideia de negócio. Esse será o seu 'cartão de visitas', pronto para ser apresentado para um possível sócio, cliente ou até mesmo para organizar suas próprias ideias." },
            ]
        }
    ],
    heroContent: {
        titleLine1: "Tire sua Ideia do Papel,",
        titleAccent: "Crie seu Corre Digital.",
        description: "Aprenda o passo a passo para transformar sua paixão em um negócio online. Valide sua ideia, construa sua marca, conquiste clientes e comece a empreender na era digital."
    },
    benefitsSection: {
        title: "Por que Empreender no Mundo Digital?",
        subtitle: "A internet abriu portas que antes não existiam. Descubra como você pode criar suas próprias oportunidades.",
        benefits: [
            { title: "Baixo Custo Inicial", description: "Comece seu negócio com as ferramentas que você já tem: seu celular, sua criatividade e a internet." },
            { title: "Alcance Global", description: "Venda seus produtos ou serviços para qualquer pessoa, em qualquer lugar do mundo, direto da sua quebrada." },
            { title: "Flexibilidade e Autonomia", description: "Crie sua própria rotina, trabalhe de onde quiser e seja o dono do seu próprio tempo e futuro." },
            { title: "Monetize sua Paixão", description: "Transforme aquilo que você ama fazer em sua principal fonte de renda e construa uma vida com mais propósito." }
        ]
    },
    curriculumSection: {
        title: "Uma Trilha Completa para Lançar seu Negócio",
        subtitle: "Do zero à primeira venda, nosso currículo é um guia prático para sua jornada empreendedora.",
        items: [
            { title: "Validação da Ideia e MVP", description: "Aprenda a testar sua ideia no mercado antes de gastar tempo e dinheiro com ela." },
            { title: "Marca e Presença Online", description: "Crie uma marca forte e use as redes sociais para construir sua vitrine digital." },
            { title: "Estratégias de Venda", description: "Descubra como atrair e converter seus primeiros clientes usando ferramentas como WhatsApp e Instagram." },
            { title: "Gestão do Negócio", description: "Organize suas finanças e tarefas com ferramentas digitais para garantir que seu corre seja sustentável." }
        ]
    },
    methodologySection: {
        title: "Nossa Metodologia: Mão na Massa e Foco no Mercado",
        subtitle: "Acreditamos que se aprende a empreender, empreendendo. Nossas aulas são práticas, com desafios reais e suporte contínuo.",
        benefits: [
            { title: "Aulas Presenciais e Online", description: "Escolha o formato que funciona para você: a energia da sala de aula ou a flexibilidade do online." },
            { title: "Instrutores do Mercado", description: "Aprenda com quem trabalha na área, trazendo experiências e desafios reais para a aula." },
            { title: "Projetos para Portfólio", description: "Finalize o curso com um projeto prático para mostrar suas habilidades aos recrutadores." },
            { title: "Comunidade e Suporte", description: "Faça parte de uma comunidade ativa no Discord para tirar dúvidas e fazer networking." }
        ]
    },
    ctaSection: {
        title: "Pronto para Ser Dono(a) do seu Futuro?",
        description: "Não espere mais para investir no seu sonho. As vagas são limitadas. Preencha o formulário e garanta seu interesse na próxima turma!"
    }
  },
  {
    id: 'en1',
    title: 'Inglês para Devs: Acelerando sua Carreira Global',
    description: 'Domine o vocabulário técnico, a comunicação em equipes globais e prepare-se para entrevistas em inglês.',
    longDescription: 'Este curso vai além do "the book is on the table". Focado 100% no universo da programação, você aprenderá o inglês que realmente importa para ler documentações, participar de reuniões, entender tutoriais e se destacar em processos seletivos de empresas internacionais.',
    track: 'Idiomas',
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '35 horas',
    skillLevel: 'Iniciante',
    instructorId: 'user_marlon_souza',
    format: 'online',
    enrollmentStatus: 'open',
    category: 'IDIOMAS',
    lessonsCount: 12,
    projectTitle: "Meu Perfil Profissional em Inglês (GitHub & LinkedIn)",
    projectDescription: "Como projeto final, você irá criar e revisar a seção 'About' do seu perfil no LinkedIn e o `README.md` do seu perfil no GitHub, tudo em inglês. Você aplicará o vocabulário técnico e as estruturas aprendidas para se apresentar de forma profissional para o mercado global.",
    projectCriteria: "- Perfil do LinkedIn com a seção 'About' em inglês, descrevendo suas habilidades e objetivos.\n- `README.md` do perfil do GitHub em inglês, com uma breve introdução, lista de tecnologias e projetos.\n- Usar pelo menos 10 termos técnicos aprendidos no curso.\n- Texto claro, conciso e sem erros gramaticais graves.",
    modules: [
      {
        id: 'en1-m1',
        title: 'Foundation for Tech English',
        lessons: [
          { id: 'en1-m1-l1', title: 'Why English is the "Programming Language" of Your Career', duration: '20 min', type: 'text', xp: 10, objective: "Understand the importance of English in the global tech market.", mainContent: "Welcome! In the tech world, English isn't just another language; it's the language. Most programming languages, documentations, and the most relevant tech communities communicate in English. Mastering it is like getting a VIP pass to the global tech scene. Let's start this journey!" },
          { id: 'en1-m1-l2', title: 'Core Vocabulary: Variables, Functions, and Loops', duration: '25 min', type: 'text', xp: 15, objective: "Learn the essential vocabulary for programming concepts.", mainContent: "Let's talk code. We'll cover the fundamental terms you'll use every day: `variable`, `constant`, `function`, `method`, `loop`, `conditional`, `statement`, `bug`, `debug` and more. We will practice pronunciation and usage in context." },
          { id: 'en1-m1-l3', title: 'Pronunciation Hacks: Common Tech Acronyms', duration: '20 min', type: 'text', xp: 15, objective: "Learn to pronounce common acronyms like API, GUI, SQL, etc.", mainContent: "Do you say 'A-P-I' or 'appy'? How about 'sequel' for SQL? We'll demystify the pronunciation of the most common acronyms in tech so you can speak with confidence in any meeting." },
        ]
      },
      {
        id: 'en1-m2',
        title: 'Reading & Understanding',
        lessons: [
          { id: 'en1-m2-l1', title: 'Decoding Stack Overflow: Finding Solutions Faster', duration: '30 min', type: 'text', xp: 20, objective: "Learn strategies to quickly find and understand solutions on Stack Overflow.", mainContent: "Stack Overflow is every developer's best friend. We will learn how to identify the accepted answer, understand code snippets, and spot key phrases like 'deprecated', 'workaround', and 'best practice'." },
          { id: 'en1-m2-l2', title: 'Reading Official Documentations (MDN, React Docs)', duration: '30 min', type: 'text', xp: 20, objective: "Navigate and understand official technical documentation.", mainContent: "Docs are your source of truth. We'll break down the structure of a documentation page, from the API reference to the getting started guide, focusing on how to extract the information you need efficiently." },
          { id: 'en1-m2-l3', title: 'Understanding Error Messages', duration: '25 min', type: 'text', xp: 20, objective: "Learn to read and interpret common error messages.", mainContent: "`Undefined is not a function`... what does that really mean? We'll analyze common error messages to help you debug your code faster and without fear." },
        ]
      },
      {
        id: 'en1-m3',
        title: 'Writing & Communicating',
        lessons: [
          { id: 'en1-m3-l1', title: 'Writing Clear Commit Messages', duration: '25 min', type: 'text', xp: 25, objective: "Learn the convention for writing effective Git commit messages.", mainContent: "A good commit message is a gift to your future self and your team. We'll learn the 'Conventional Commits' standard: `feat: add user login component` or `fix: correct validation on email input`." },
          { id: 'en1-m3-l2', title: 'Asking Good Questions in Forums and Chats', duration: '30 min', type: 'text', xp: 25, objective: "Formulate questions in English to get better and faster help.", mainContent: "How you ask is as important as what you ask. We'll learn how to provide context, describe the problem, show what you've tried, and write a clear, concise question." },
          { id: 'en1-m3-l3', title: 'Describing a Bug: How to Write a Bug Report', duration: '30 min', type: 'text', xp: 25, objective: "Learn to write a clear and effective bug report.", mainContent: "A good bug report helps fix problems faster. We'll learn the key components: title, steps to reproduce, expected behavior, and actual behavior." },
        ]
      },
      {
        id: 'en1-m4',
        title: 'Speaking & Listening',
        lessons: [
          { id: 'en1-m4-l1', title: 'Daily Stand-up Meetings: Reporting Your Progress', duration: '30 min', type: 'text', xp: 30, objective: "Practice phrases for daily agile meetings.", mainContent: "What did you do yesterday? What will you do today? Are there any blockers? We'll practice key phrases to report your progress clearly and concisely in a daily stand-up meeting." },
          { id: 'en1-m4-l2', title: 'Explaining Your Code: A Walkthrough of a Function', duration: '35 min', type: 'text', xp: 35, objective: "Practice explaining a piece of code to a colleague.", mainContent: "Let's practice a code review. You will learn how to say things like: 'This function takes two parameters...', 'First, I validate the input...', 'Then, it returns an object with...'" },
          { id: 'en1-m4-l3', title: 'Job Interview Simulation: "Tell me about a project you\'re proud of."', duration: '45 min', type: 'text', xp: 50, objective: "Prepare for one of the most common questions in a tech job interview.", mainContent: "This is your moment to shine! We will structure an answer using the STAR method (Situation, Task, Action, Result) to talk about your projects in a compelling way." },
        ]
      }
    ],
    heroContent: {
      titleLine1: "Fale a Língua do Código,",
      titleAccent: "Conquiste o Mundo.",
      description: "Domine o inglês técnico essencial para ler documentações, colaborar em equipes globais e acelerar sua carreira como desenvolvedor(a)."
    },
    benefitsSection: {
      title: "Por que Inglês é sua Skill Mais Importante Depois de Programar?",
      subtitle: "O código é universal, e a comunicação também precisa ser. Veja como o inglês abre portas que a programação sozinha não consegue.",
      benefits: [
        { title: "Acesso Ilimitado", description: "Aprenda com as melhores documentações, tutoriais e fóruns do mundo, que estão primariamente em inglês." },
        { title: "Carreira Global", description: "Trabalhe para empresas estrangeiras, mesmo do Brasil, e ganhe em dólar. O inglês é a ponte para essas oportunidades." },
        { title: "Comunidade Open Source", description: "Contribua com projetos open source, interaja com desenvolvedores do mundo todo e construa um nome na comunidade global." },
        { title: "Salários Maiores", description: "Profissionais de tecnologia que dominam o inglês têm, em média, salários significativamente mais altos." }
      ]
    },
    curriculumSection: {
      title: "Do 'Hello World' ao 'Code Review': Uma Jornada Prática",
      subtitle: "Nosso currículo é focado no inglês que você vai usar no dia a dia como dev.",
      items: [
        { title: "Fundamentos do Inglês Técnico", description: "Domine o vocabulário de variáveis, funções, loops e os principais acrônimos da área." },
        { title: "Leitura de Documentações e Fóruns", description: "Aprenda a decifrar Stack Overflow, documentações oficiais e mensagens de erro." },
        { title: "Comunicação Escrita Profissional", description: "Escreva commit messages claras, relate bugs de forma eficiente e participe de discussões técnicas." },
        { title: "Simulação de Reuniões e Entrevistas", description: "Pratique a comunicação oral para daily meetings, code reviews e entrevistas de emprego." }
      ]
    },
    methodologySection: {
      title: "Nossa Metodologia: Foco na Prática e no Contexto Dev",
      subtitle: "Acreditamos que se aprende uma língua, usando-a. Nossas aulas simulam o ambiente de trabalho de um programador.",
      benefits: [
        { title: "Aulas 100% Online", description: "Aprenda de onde estiver, no seu ritmo, com aulas gravadas e encontros ao vivo para praticar." },
        { title: "Instrutores Bilíngues da Área Tech", description: "Aprenda com quem vive o dia a dia do desenvolvimento em equipes globais." },
        { title: "Projetos para Portfólio Global", description: "Finalize o curso com seus perfis profissionais (GitHub/LinkedIn) em inglês, prontos para recrutadores." },
        { title: "Comunidade e Suporte", description: "Faça parte de uma comunidade ativa no Discord para tirar dúvidas e praticar com outros alunos." }
      ]
    },
    ctaSection: {
      title: "Ready to Level Up Your Career?",
      description: "Não deixe a barreira do idioma limitar seu potencial. As vagas são limitadas. Preencha o formulário e garanta seu interesse na próxima turma!"
    }
  },
  {
    id: 'ld1',
    title: 'Letramento Digital: Conecte-se ao Mundo Online',
    description: 'Perca o medo do computador e da internet. Aprenda o essencial para o dia a dia, desde enviar um email até navegar com segurança.',
    longDescription: 'Este curso é para você que quer começar do zero. Vamos te guiar nos primeiros passos no mundo digital, mostrando como usar o computador, a internet e as principais ferramentas para se comunicar, se informar e resolver problemas do cotidiano com mais autonomia e segurança.',
    track: 'Letramento Digital',
    imageUrl: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '20 horas',
    skillLevel: 'Iniciante',
    instructorId: 'user_marlon_souza',
    format: 'presencial',
    enrollmentStatus: 'open',
    category: 'LETRAMENTO DIGITAL',
    lessonsCount: 10,
    modules: [
        { id: 'ld1-m1', title: 'Primeiros Passos com o Computador', lessons: [
            { id: 'ld1-m1-l1', title: 'Conhecendo a Máquina', duration: '30 min', type: 'text', xp: 10, objective: "Identificar as partes principais de um computador e ligá-lo corretamente.", mainContent: "Vamos conhecer nosso novo amigo: o computador! Aprenderemos o que é o monitor (a tela), o teclado, o mouse e a CPU (a 'caixa' principal). Você vai aprender a ligar e desligar o computador com segurança." },
            { id: 'ld1-m1-l2', title: 'O Mouse e o Teclado sem Segredos', duration: '30 min', type: 'text', xp: 10, objective: "Praticar o uso do mouse (clicar, arrastar) e do teclado (digitar, usar teclas especiais).", mainContent: "O mouse e o teclado são suas mãos no mundo digital. Vamos praticar como mover o cursor, clicar com os botões, rolar páginas e digitar textos, incluindo letras maiúsculas e acentos." },
        ]},
        { id: 'ld1-m2', title: 'Navegando na Internet', lessons: [
            { id: 'ld1-m2-l1', title: 'O que é a Internet e o Navegador?', duration: '25 min', type: 'text', xp: 15, objective: "Entender o que é a internet e como usar um navegador (Google Chrome).", mainContent: "A internet é como uma cidade gigante cheia de informações. O navegador é o nosso carro para passear por essa cidade. Vamos aprender a abrir o Google Chrome, digitar um endereço de site e navegar pelas páginas." },
            { id: 'ld1-m2-l2', title: 'Pesquisando no Google com Eficiência', duration: '30 min', type: 'text', xp: 15, objective: "Aprender a fazer pesquisas no Google para encontrar o que você precisa.", mainContent: "O Google pode responder quase tudo! Vamos aprender a fazer as perguntas certas para encontrar receitas, notícias, endereços e muito mais. Descubra como usar palavras-chave para ter resultados melhores." },
            { id: 'ld1-m2-l3', title: 'Segurança Online: Fique Esperto!', duration: '30 min', type: 'text', xp: 20, objective: "Identificar sites seguros e reconhecer perigos como links falsos e senhas fracas.", mainContent: "Assim como na rua, na internet precisamos ter cuidado. Você vai aprender a identificar sites seguros (o cadeado verde!), a criar senhas fortes e a desconfiar de mensagens e links suspeitos para proteger suas informações." },
        ]},
        { id: 'ld1-m3', title: 'Comunicação Digital Essencial', lessons: [
            { id: 'ld1-m3-l1', title: 'Criando seu Primeiro Email', duration: '35 min', type: 'text', xp: 20, objective: "Criar uma conta de email gratuita no Gmail.", mainContent: "O email é sua identidade no mundo digital. Vamos criar, passo a passo, sua primeira conta no Gmail, que servirá para você se comunicar e se cadastrar em outros serviços online." },
            { id: 'ld1-m3-l2', title: 'Enviando e Recebendo Mensagens', duration: '30 min', type: 'text', xp: 15, objective: "Aprender a escrever, enviar, ler e responder emails.", mainContent: "Vamos praticar o básico da comunicação por email. Você vai aprender a escrever uma mensagem, anexar um arquivo (como uma foto ou documento) e responder a emails que receber." },
            { id: 'ld1-m3-l3', title: 'WhatsApp no Computador', duration: '25 min', type: 'text', xp: 15, objective: "Conectar e usar o WhatsApp Web para conversar usando o teclado do computador.", mainContent: "Cansado de digitar no celular? Vamos aprender a usar o WhatsApp no seu computador! É mais rápido para digitar e ótimo para enviar arquivos que estão no PC." },
        ]},
        { id: 'ld1-m4', title: 'Ferramentas para o Dia a Dia', lessons: [
            { id: 'ld1-m4-l1', title: 'Criando Documentos Simples', duration: '30 min', type: 'text', xp: 20, objective: "Usar o Google Docs para escrever e formatar um texto simples, como um currículo.", mainContent: "Precisa escrever um currículo ou uma carta? O Google Docs é uma ferramenta gratuita e online para isso. Vamos aprender a criar um novo documento, digitar, formatar o texto (negrito, tamanho da letra) и salvar." },
            { id: 'ld1-m4-l2', title: 'Design Fácil com Canva', duration: '35 min', type: 'text', xp: 20, objective: "Criar um post simples para redes sociais usando o Canva.", mainContent: "Quer criar um convite de aniversário ou um post bonito para o Instagram? O Canva é a ferramenta perfeita! Vamos explorar modelos prontos e criar uma arte simples e bonita em poucos minutos." },
        ]},
    ],
    heroContent: { titleLine1: "Desvende o Mundo Digital,", titleAccent: "Conquiste sua Autonomia.", description: "Perca o medo da tecnologia. Um curso prático e presencial para você dominar o computador e a internet, abrindo portas para novas oportunidades e facilitando seu dia a dia." },
    benefitsSection: { title: "Por que a Inclusão Digital é Essencial?", subtitle: "Saber usar a tecnologia hoje é tão importante quanto saber ler e escrever. Veja como este curso pode transformar sua vida.", benefits: [
        { title: "Segurança e Confiança", description: "Navegue na internet sem medo, aprendendo a proteger suas informações e a identificar golpes online." },
        { title: "Ferramentas para o Dia a Dia", description: "Use ferramentas digitais para criar um currículo, agendar uma consulta ou até mesmo fazer um post para redes sociais." },
        { title: "Comunicação Ampliada", description: "Conecte-se com o mundo através de email e WhatsApp, facilitando a comunicação com amigos, família e oportunidades." },
        { title: "Acesso a Serviços", description: "Ganhe autonomia para acessar serviços online do governo, bancos e lojas, resolvendo pendências sem sair de casa." },
    ]},
    curriculumSection: { title: "Uma Trilha Completa para sua Autonomia Digital", subtitle: "Do zero à confiança, nosso curso foi desenhado para te guiar passo a passo no universo online.", items: [
        { title: "Primeiros Passos no Computador", description: "Perca o medo do mouse e do teclado e aprenda a interagir com o sistema operacional." },
        { title: "Navegando na Internet com Segurança", description: "Aprenda a usar navegadores, fazer pesquisas no Google e a se proteger de perigos online." },
        { title: "Comunicação Digital Essencial", description: "Crie e gerencie seu email e aprenda a usar o WhatsApp no computador para facilitar sua comunicação." },
        { title: "Ferramentas Práticas", description: "Descubra como criar documentos de texto, apresentações e posts para redes sociais com ferramentas gratuitas." },
    ]},
    methodologySection: { title: "Nossa Metodologia: Paciência e Prática", subtitle: "Acreditamos que todos podem aprender. Nossas aulas são presenciais, com acompanhamento individual e foco em superar suas dificuldades.", benefits: [
        { title: "Aulas 100% Presenciais", description: "Aprenda em um ambiente acolhedor, com computadores disponíveis e instrutores ao seu lado para tirar dúvidas." },
        { title: "Foco no Aluno", description: "Respeitamos o seu ritmo. Nossas aulas são pensadas para quem nunca teve contato com a tecnologia." },
        { title: "Aprendizado na Prática", description: "Cada aula tem uma atividade prática para você aplicar o que aprendeu e ganhar confiança." },
        { title: "Comunidade e Suporte", description: "Faça parte de uma turma onde todos estão aprendendo juntos, trocando experiências e se ajudando." },
    ]},
    ctaSection: { title: "Pronto para se Conectar?", description: "Dê o primeiro passo para sua inclusão digital. As vagas são limitadas. Preencha o formulário e garanta seu interesse na próxima turma!" },
  },
  {
    id: 'ld2',
    title: 'Conectados: Letramento Digital para a Melhor Idade',
    description: 'Aprenda a usar o celular e o computador sem medo, para se conectar com a família, se informar e ter mais autonomia no dia a dia.',
    longDescription: 'Feito com carinho e paciência, este curso é um convite para a melhor idade entrar no mundo digital. Com aulas práticas e um ritmo tranquilo, vamos te ajudar a usar o WhatsApp, fazer videochamadas, navegar na internet com segurança e aproveitar todas as facilidades que a tecnologia oferece.',
    track: 'Letramento Digital',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '18 horas',
    skillLevel: 'Iniciante',
    instructorId: 'user_marlon_souza',
    format: 'presencial',
    enrollmentStatus: 'open',
    category: 'LETRAMENTO DIGITAL',
    lessonsCount: 8,
    modules: [
        { id: 'ld2-m1', title: 'Dominando o Celular', lessons: [
            { id: 'ld2-m1-l1', title: 'Conhecendo seu Smartphone', duration: '45 min', type: 'text', xp: 10, objective: "Entender os botões, a tela de toque e os ícones principais do celular.", mainContent: "Seu celular é uma janela para o mundo! Vamos aprender juntos a ligar, desbloquear a tela, entender o que cada ícone significa e como se conectar à internet (Wi-Fi)." },
            { id: 'ld2-m1-l2', title: 'O Mundo do WhatsApp', duration: '45 min', type: 'text', xp: 15, objective: "Aprender a mandar mensagens de texto, áudio, fotos e participar de grupos.", mainContent: "O WhatsApp é a principal forma de falar com a família hoje em dia. Vamos praticar como enviar uma mensagem, mandar um áudio, compartilhar uma foto da galeria e entrar nos grupos da família." },
        ]},
        { id: 'ld2-m2', title: 'Conectando-se com a Família', lessons: [
            { id: 'ld2-m2-l1', title: 'Videochamadas: Vendo Quem Está Longe', duration: '45 min', type: 'text', xp: 20, objective: "Aprender a fazer e receber chamadas de vídeo pelo WhatsApp.", mainContent: "A saudade apertou? Uma chamada de vídeo resolve! Vamos aprender o passo a passo para ligar por vídeo para seus filhos e netos, e como atender quando eles ligarem para você." },
            { id: 'ld2-m2-l2', title: 'Explorando o Facebook', duration: '45 min', type: 'text', xp: 15, objective: "Aprender a ver fotos da família, curtir e comentar posts.", mainContent: "O Facebook é como um grande álbum de fotos da família e dos amigos. Vamos aprender a navegar, ver as novidades, curtir as publicações e deixar um comentário carinhoso." },
        ]},
        { id: 'ld2-m3', title: 'Navegando com Segurança e Autonomia', lessons: [
            { id: 'ld2-m3-l1', title: 'Pesquisando na Internet com Segurança', duration: '45 min', type: 'text', xp: 20, objective: "Usar o Google para pesquisar assuntos de interesse e identificar notícias falsas.", mainContent: "Quer ver uma receita ou saber sobre um ator antigo? O Google ajuda! Vamos aprender a pesquisar e, o mais importante, a desconfiar de notícias falsas e a buscar informações em fontes seguras." },
            { id: 'ld2-m3-l2', title: 'Cuidado com Golpes!', duration: '45 min', type: 'text', xp: 20, objective: "Reconhecer as principais tentativas de golpe por WhatsApp e email.", mainContent: "Sua segurança é prioridade. Vamos conversar sobre as mensagens de prêmios falsos, links perigosos e pedidos de dinheiro de números desconhecidos. Aprenda a se proteger e a não cair em golpes." },
        ]},
        { id: 'ld2-m4', title: 'Facilitando o Dia a Dia', lessons: [
            { id: 'ld2-m4-l1', title: 'YouTube: Vídeos e Músicas', duration: '40 min', type: 'text', xp: 15, objective: "Aprender a procurar e assistir vídeos, como músicas antigas, novelas e programas.", mainContent: "O YouTube é uma TV infinita! Quer rever uma cena de novela, ouvir uma música da sua época ou aprender a fazer um artesanato? Vamos aprender a pesquisar e assistir vídeos." },
            { id: 'ld2-m4-l2', title: 'Serviços Online: Agendando Consultas', duration: '40 min', type: 'text', xp: 20, objective: "Entender como usar a internet para agendar consultas médicas e outros serviços.", mainContent: "Muitos serviços hoje podem ser resolvidos online. Vamos simular como agendar uma consulta médica ou acessar o portal da prefeitura, mostrando como a tecnologia pode facilitar sua vida." },
        ]},
    ],
    heroContent: { titleLine1: "Conecte-se com quem você ama,", titleAccent: "sem medo da tecnologia.", description: "Um curso presencial, com paciência e carinho, para a melhor idade aprender a usar o celular e o computador, se conectar com a família e ganhar mais autonomia e segurança no mundo digital." },
    benefitsSection: { title: "Por que se Conectar na Melhor Idade?", subtitle: "A tecnologia pode ser uma grande aliada para aproximar pessoas, facilitar tarefas e manter a mente ativa.", benefits: [
        { title: "Fale com a Família", description: "Faça videochamadas, receba fotos dos netos e participe dos grupos da família no WhatsApp, diminuindo a saudade." },
        { title: "Segurança e Autonomia", description: "Aprenda a identificar golpes no celular e a usar a internet com mais confiança para resolver suas coisas." },
        { title: "Acesso a Serviços", description: "Descubra como agendar consultas, ver resultados de exames e acessar serviços públicos sem sair de casa." },
        { title: "Exercite a Mente", description: "Mantenha-se ativo(a) aprendendo coisas novas, assistindo vídeos, lendo notícias e jogando jogos online." },
    ]},
    curriculumSection: { title: "Uma Jornada de Aprendizado Tranquila e Divertida", subtitle: "Nosso curso foi desenhado para ser prático, útil e respeitar o seu tempo de aprendizado.", items: [
        { title: "Dominando seu Celular", description: "Perca o medo da tela de toque e aprenda a usar os aplicativos essenciais, como a agenda e a câmera." },
        { title: "WhatsApp para a Família", description: "Domine o envio de mensagens, áudios, fotos e, claro, as tão esperadas chamadas de vídeo." },
        { title: "Navegando na Internet com Segurança", description: "Aprenda a pesquisar no Google, a identificar notícias falsas e a se proteger de golpes comuns." },
        { title: "Facilitando o Dia a Dia", description: "Descubra como usar aplicativos de transporte, assistir a vídeos no YouTube e acessar serviços online." },
    ]},
    methodologySection: { title: "Nossa Metodologia: Acolhimento e Paciência", subtitle: "Aqui, ninguém fica para trás. Acreditamos que aprender é para todas as idades.", benefits: [
        { title: "Aulas 100% Presenciais", description: "Ambiente tranquilo, com instrutores dedicados a te ajudar individualmente em cada etapa." },
        { title: "Ritmo Adequado", description: "Aulas pensadas para a melhor idade, sem pressa, com muitas pausas e repetições para fixar o conteúdo." },
        { title: "Material Didático Simples", description: "Apostilas com letras grandes e passo a passo visual para você consultar sempre que precisar." },
        { title: "Turmas Reduzidas", description: "Grupos pequenos para garantir que todos recebam a atenção que merecem e possam tirar suas dúvidas." },
    ]},
    ctaSection: { title: "Pronto(a) para se Conectar?", description: "Nunca é tarde para aprender! Dê o primeiro passo para um mundo de novas possibilidades. As vagas são limitadas. Preencha o formulário e garanta seu interesse!" },
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