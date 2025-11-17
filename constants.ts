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
    ]
  },
  {
    id: 'ld1',
    title: 'Letramento Digital para Melhor Idade',
    description: 'Perca o medo da tecnologia! Aprenda a usar o computador, celular e a internet com segurança e confiança.',
    longDescription: 'Este curso presencial foi desenhado para quem quer dar os primeiros passos no mundo digital. Com aulas pacientes e em turmas reduzidas, você aprenderá a se comunicar com a família, usar aplicativos do dia a dia e navegar na internet com segurança.',
    track: 'Digital',
    imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '20 horas',
    skillLevel: 'Iniciante',
    instructorId: 'user_marlon_souza',
    format: 'presencial',
    enrollmentStatus: 'closed',
    category: 'INCLUSÃO',
    modules: [],
    heroContent: {
        titleLine1: "Conecte-se ao Mundo Digital,",
        titleAccent: "Sem Medo.",
        description: "Nosso curso de Letramento Digital foi criado especialmente para a melhor idade. Aprenda a usar o computador, celular e a internet com segurança e confiança, em um ambiente acolhedor e com instrutores pacientes."
    },
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
    modules: [],
     heroContent: {
        titleLine1: "Do Zero ao Código,",
        titleAccent: "com Python.",
        description: "Aprenda a programar com uma das linguagens mais populares do mercado. Desenvolve sua lógica, crie seus primeiros projetos e abra portas para uma nova carreira em tecnologia."
    },
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