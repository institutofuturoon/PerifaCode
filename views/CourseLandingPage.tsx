import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../App';
import { Course, CourseBenefit, CurriculumItem } from '../types';

// Data mapping for course landing pages
const courseContentMap: Record<string, Omit<Course, keyof Omit<Course, 'heroContent' | 'benefitsSection' | 'curriculumSection' | 'methodologySection' | 'ctaSection'>>> = {
    'ld1': { // Letramento Digital
        heroContent: {
            titleLine1: "Conecte-se ao Mundo Digital,",
            titleAccent: "Sem Medo.",
            description: "Nosso curso de Letramento Digital foi criado especialmente para a melhor idade. Aprenda a usar o computador, celular e a internet com segurança e confiança, em um ambiente acolhedor e com instrutores pacientes."
        },
        benefitsSection: {
            title: "Uma Nova Janela Para o Seu Mundo",
            subtitle: "Descubra como a tecnologia pode facilitar seu dia a dia e te aproximar de quem você ama.",
            benefits: [
                { icon: "😊", title: "Perca o Medo", description: "Esqueça a complicação. Nossos instrutores mostram que a tecnologia pode ser sua grande aliada, com muita paciência e didática." },
                { icon: "👨‍👩‍👧‍👦", title: "Fale com quem Ama", description: "Aprenda a usar o WhatsApp e as redes sociais para fazer chamadas de vídeo e estar sempre perto da família e dos amigos." },
                { icon: "✅", title: "Sua Independência", description: "Resolva coisas do dia a dia, como marcar consultas ou usar apps de banco e transporte, com total autonomia." },
                { icon: "🛡️", title: "Navegue com Segurança", description: "Entenda como identificar golpes, criar senhas fortes e proteger suas informações pessoais no mundo online." }
            ]
        },
        curriculumSection: {
            title: "O que você vai aprender na prática",
            subtitle: "Um passo a passo completo para você dominar as ferramentas digitais mais importantes do dia a dia.",
            items: [
                { title: "Usando o Computador e Celular", description: "Desde o básico: ligar, usar o mouse, teclado, abrir programas e organizar arquivos e fotos." },
                { title: "Navegando na Internet", description: "Aprenda a pesquisar no Google, acessar sites de notícias, vídeos e muito mais." },
                { title: "Comunicação por E-mail", description: "Crie seu e-mail, envie e receba mensagens, e aprenda a lidar com anexos com segurança." },
                { title: "Redes Sociais Essenciais", description: "Conecte-se com amigos e família através do WhatsApp e Facebook de forma prática." },
                { title: "Segurança Digital Primeiro", description: "Proteja-se de vírus e golpes online. Aprenda a criar senhas seguras e a navegar com tranquilidade." },
                { title: "Aplicativos Úteis", description: "Descubra como usar aplicativos de transporte, banco e outros serviços para facilitar sua rotina." }
            ]
        },
        methodologySection: {
            title: "Como Nossas Aulas Funcionam",
            subtitle: "Nosso método foi pensado para oferecer um ambiente de aprendizado seguro, confortável e eficaz.",
            benefits: [
                { icon: "📍", title: "Aulas Presenciais", description: "Ambiente tranquilo e preparado para o seu aprendizado em nosso espaço no Complexo da Coruja." },
                { icon: "👩‍🏫", title: "Instrutores Pacientes", description: "Nossa equipe tem experiência e didática para ensinar no seu ritmo, sem pressa." },
                { icon: "👥", title: "Turmas Reduzidas", description: "Garantimos atenção individualizada para que nenhuma dúvida fique para trás." },
                { icon: "📖", title: "Material de Apoio", description: "Apostilas simples e ilustradas para acompanhar as aulas e praticar em casa." }
            ]
        },
        ctaSection: {
            title: "Pronto para Começar essa Jornada?",
            description: "As vagas são limitadas para garantir a qualidade do ensino. Preencha o formulário e garanta seu interesse na próxima turma!"
        }
    },
    'py1': { // Python
        heroContent: {
            titleLine1: "Do Zero ao Código,",
            titleAccent: "com Python.",
            description: "Aprenda a programar com uma das linguagens mais populares do mercado. Desenvolva sua lógica, crie seus primeiros projetos e abra portas para uma nova carreira em tecnologia."
        },
        benefitsSection: {
            title: "Por que Python é a Melhor Porta de Entrada para a Programação?",
            subtitle: "Simples, poderosa e em alta no mercado. Descubra por que Python é a escolha ideal para quem está começando.",
            benefits: [
                { icon: "🎓", title: "Fácil de Aprender", description: "Sintaxe limpa e intuitiva, ideal para quem nunca programou. Você vai escrever seu primeiro 'Olá, Mundo!' em minutos." },
                { icon: "🚀", title: "Porta para o Futuro", description: "Dominar Python abre caminhos para áreas como Inteligência Artificial, Análise de Dados e Desenvolvimento Web." },
                { icon: "💰", title: "Salários Atrativos", description: "Profissionais de Python são muito valorizados, com salários iniciais competitivos que crescem com a sua experiência." },
                { icon: "🌎", title: "Comunidade Gigante", description: "Conte com uma das maiores comunidades de desenvolvedores do mundo para tirar dúvidas e colaborar em projetos." }
            ]
        },
        curriculumSection: {
            title: "Uma Jornada Completa, do Básico ao seu Primeiro Projeto",
            subtitle: "Nossa trilha foi desenhada para te levar do zero absoluto até a construção de um projeto prático e relevante para o seu portfólio.",
            items: [
                { title: "Lógica de Programação Essencial", description: "Construa a base de todo dev: como pensar de forma estruturada para resolver problemas com código." },
                { title: "Fundamentos do Python", description: "Domine variáveis, tipos de dados, operadores e as estruturas que formam a linguagem." },
                { title: "Estruturas de Controle", description: "Aprenda a criar condicionais (if/else) e laços de repetição (for/while) para dar vida aos seus programas." },
                { title: "Funções e Organização", description: "Escreva código limpo e reutilizável, organizando seus projetos de forma profissional." },
                { title: "Estruturas de Dados", description: "Trabalhe com listas, tuplas e dicionários para manipular e organizar informações de forma eficiente." },
                { title: "Projeto Prático Final", description: "Aplique todo o seu conhecimento construindo uma aplicação do mundo real, pronta para o seu portfólio." }
            ]
        },
        methodologySection: {
            title: "Nossa Metodologia: Mão na Massa e Foco no Mercado",
            subtitle: "Acreditamos que se aprende a programar, programando. Nossas aulas são práticas, com desafios reais e suporte contínuo.",
            benefits: [
                { icon: "📍", title: "Aulas Presenciais e Online", description: "Escolha o formato que funciona para você: a energia da sala de aula ou a flexibilidade do online." },
                { icon: "👩‍🏫", title: "Instrutores do Mercado", description: "Aprenda com quem trabalha na área, trazendo experiências e desafios reais para a aula." },
                { icon: "💼", title: "Projetos para Portfólio", description: "Finalize o curso com um projeto prático para mostrar suas habilidades aos recrutadores." },
                { icon: "🤝", title: "Comunidade e Suporte", description: "Faça parte de uma comunidade ativa no Discord para tirar dúvidas e fazer networking." }
            ]
        },
        ctaSection: {
            title: "Sua Carreira em Tech Começa Agora",
            description: "Não espere mais para investir no seu futuro. As vagas são limitadas. Preencha o formulário e garanta seu interesse na próxima turma!"
        }
    },
    'cs1': { // C#
        heroContent: {
            titleLine1: "Do Zero à API Profissional,",
            titleAccent: "com C#.",
            description: "Domine a linguagem da Microsoft e o ecossistema .NET. Crie aplicações robustas, escaláveis e prepare-se para as melhores vagas de backend no mercado."
        },
        benefitsSection: {
            title: "Por que C# e .NET vão impulsionar sua carreira?",
            subtitle: "Entenda por que o ecossistema da Microsoft é uma das escolhas mais seguras e poderosas para uma carreira sólida em desenvolvimento.",
            benefits: [
                { icon: "📈", title: "Alta Demanda", description: "Grandes empresas e startups confiam no .NET para suas aplicações críticas, garantindo um mercado aquecido." },
                { icon: "⚙️", title: "Ecossistema Completo", description: "Do desenvolvimento web e mobile a jogos e IA, o .NET oferece ferramentas para tudo que você precisar." },
                { icon: "⚡", title: "Performance", description: "C# é uma linguagem moderna e performática, ideal para construir sistemas que aguentam o tranco e rodam em alta velocidade." },
                { icon: "💰", title: "Salários Competitivos", description: "Desenvolvedores .NET estão entre os mais bem pagos do mercado, refletindo a alta demanda por essa especialidade." }
            ]
        },
        curriculumSection: {
            title: "Uma Trilha Completa para o Desenvolvimento Backend Profissional",
            subtitle: "Do básico da linguagem à publicação da sua primeira API na nuvem. Um currículo pensado para o mercado.",
            items: [
                { title: "Fundamentos de C# e .NET", description: "Entenda a sintaxe, tipos de dados, e a estrutura do ecossistema .NET." },
                { title: "Orientação a Objetos na Prática", description: "Aprenda os pilares da OOP (Classes, Herança, Polimorfismo) para criar código organizado e robusto." },
                { title: "APIs com ASP.NET Core", description: "Desenvolva APIs RESTful, a base da comunicação web moderna, seguindo as melhores práticas." },
                { title: "Acesso a Dados com Entity Framework", description: "Conecte sua aplicação a bancos de dados de forma profissional e eficiente." },
                { title: "Testes e Boas Práticas", description: "Aprenda a garantir a qualidade do seu código com testes unitários e princípios como SOLID." },
                { title: "Projeto Final: API Completa", description: "Construa e publique uma API completa do mundo real, seu passaporte para entrevistas técnicas." }
            ]
        },
        methodologySection: {
            title: "Nossa Metodologia: Mão na Massa e Foco no Mercado",
            subtitle: "Acreditamos que se aprende a programar, programando. Nossas aulas são práticas, com desafios reais e suporte contínuo.",
            benefits: [
                { icon: "📍", title: "Aulas Presenciais e Online", description: "Escolha o formato que funciona para você: a energia da sala de aula ou a flexibilidade do online." },
                { icon: "👩‍🏫", title: "Instrutores do Mercado", description: "Aprenda com quem trabalha na área, trazendo experiências e desafios reais para a aula." },
                { icon: "💼", title: "Projetos para Portfólio", description: "Finalize o curso com um projeto prático para mostrar suas habilidades aos recrutadores." },
                { icon: "🤝", title: "Comunidade e Suporte", description: "Faça parte de uma comunidade ativa no Discord para tirar dúvidas e fazer networking." }
            ]
        },
        ctaSection: {
            title: "Pronto para Construir Aplicações de Alto Nível?",
            description: "As vagas são limitadas. Garanta seu interesse na próxima turma e dê um passo decisivo na sua carreira backend."
        }
    },
    'gm1': { // Game Dev
        heroContent: {
            titleLine1: "Do Sonho ao Jogo Publicado,",
            titleAccent: "com Unity.",
            description: "Aprenda a criar seus próprios jogos 2D e 3D com a engine mais popular do mercado. Transforme sua paixão em uma carreira de sucesso."
        },
        benefitsSection: {
            title: "Por que Aprender a Desenvolver Games com Unity?",
            subtitle: "Descubra por que a Unity é a ferramenta escolhida por estúdios de todos os tamanhos para criar os jogos mais incríveis do mundo.",
            benefits: [
                { icon: "📈", title: "Mercado em Expansão", description: "A indústria de games é uma das que mais cresce no mundo, com infinitas oportunidades para novos desenvolvedores." },
                { icon: "💻", title: "Uma Engine, Múltiplas Plataformas", description: "Crie seu jogo uma vez e publique para PC, consoles (PlayStation, Xbox, Nintendo) e celulares (Android e iOS)." },
                { icon: "🎨", title: "Criatividade sem Limites", description: "Da arte 2D pixelada aos gráficos 3D realistas, a Unity te dá o poder de criar qualquer tipo de jogo que você imaginar." },
                { icon: "🌍", title: "Carreira Global", description: "Com habilidades em Unity, você pode trabalhar para estúdios em qualquer lugar do mundo, muitas vezes de forma remota." }
            ]
        },
        curriculumSection: {
            title: "Da Ideia ao Jogo Funcional: Sua Jornada de Game Dev",
            subtitle: "Nossa trilha te guia passo a passo, desde a primeira linha de código até a publicação do seu primeiro mini-jogo completo.",
            items: [
                { title: "Introdução à Unity", description: "Navegue pela interface, entenda os conceitos de GameObjects, Components e Cenas." },
                { title: "Programação C# para Jogos", description: "Aprenda a lógica e a sintaxe do C# aplicadas para criar mecânicas e comportamentos nos seus jogos." },
                { title: "Física e Movimentação 2D/3D", description: "Crie personagens que pulam, correm e interagem com o mundo do jogo de forma realista." },
                { title: "Assets, Sprites e Animação", description: "Dê vida aos seus personagens e cenários com sprites, modelos 3D e animações fluidas." },
                { title: "Interface (UI) e Som", description: "Desenvolva menus, placares de pontos (HUDs) e adicione efeitos sonoros e música para uma experiência completa." },
                { title: "Projeto Final: Seu Primeiro Jogo", description: "Aplique todo o conhecimento para criar e customizar um mini-jogo, do início ao fim." }
            ]
        },
        methodologySection: {
            title: "Nossa Metodologia: Mão na Massa e Foco no Mercado",
            subtitle: "Acreditamos que se aprende a programar, programando. Nossas aulas são práticas, com desafios reais e suporte contínuo.",
            benefits: [
                { icon: "📍", title: "Aulas Presenciais e Online", description: "Escolha o formato que funciona para você: a energia da sala de aula ou a flexibilidade do online." },
                { icon: "👩‍🏫", title: "Instrutores Gamers", description: "Aprenda com quem não só trabalha na área, mas é apaixonado por jogos e pela criação de novas experiências." },
                { icon: "🎮", title: "Projetos para Portfólio", description: "Finalize o curso com um jogo jogável para impressionar e mostrar suas habilidades." },
                { icon: "🤝", title: "Comunidade e Suporte", description: "Faça parte de uma comunidade ativa para testar jogos, trocar ideias e formar equipes." }
            ]
        },
        ctaSection: {
            title: "Pronto para Dar 'Play' na Sua Carreira?",
            description: "As vagas são limitadas. Inscreva-se para garantir seu interesse na próxima turma e comece a criar os mundos que você imagina."
        }
    },
    'en1': { // English
        heroContent: {
            titleLine1: "Fale a Língua da Tecnologia,",
            titleAccent: "Inglês para Devs.",
            description: "Destrave seu potencial global. Nosso curso foca no inglês que você realmente vai usar: em documentações, comunidades e entrevistas de emprego no exterior."
        },
        benefitsSection: {
            title: "Por que o Inglês é o 'Framework' Essencial para sua Carreira?",
            subtitle: "O código você já domina. Agora, aprenda o idioma que abre as portas do mundo para sua carreira.",
            benefits: [
                { icon: "📚", title: "Acesse o Conhecimento", description: "A maioria dos tutoriais, documentações e cursos de ponta são lançados primeiro em inglês. Não espere pela tradução." },
                { icon: "💬", title: "Comunidade Global", description: "Participe de discussões no GitHub, Stack Overflow e em comunidades internacionais para resolver problemas e colaborar." },
                { icon: "💼", title: "Vagas no Exterior", description: "As melhores oportunidades e salários muitas vezes estão em empresas internacionais que exigem inglês para o dia a dia." },
                { icon: "🛠️", title: "Entenda as Ferramentas", description: "Domine o vocabulário de frameworks, bibliotecas e IDEs para usar as ferramentas de trabalho com máxima eficiência." }
            ]
        },
        curriculumSection: {
            title: "Do 'Hello World' ao 'Job Interview': Uma Trilha Prática",
            subtitle: "Esqueça o 'The book is on the table'. Aqui, você aprende o inglês que vai usar para codar, colaborar e conquistar sua vaga.",
            items: [
                { title: "Vocabulário Técnico Essencial", description: "Git, APIs, databases, frameworks. Fale a língua que os devs falam no dia a dia." },
                { title: "Leitura de Documentação", description: "Aprenda a ler e interpretar documentações técnicas com confiança para resolver problemas sozinho." },
                { title: "Comunicação Escrita Profissional", description: "Escreva commits, pull requests, e-mails e mensagens no Slack de forma clara e profissional." },
                { title: "Listening para Devs", description: "Entenda palestras, tutoriais em vídeo e reuniões técnicas sem precisar de legendas." },
                { title: "Conversação e Entrevistas", description: "Pratique a fala para se apresentar, descrever seus projetos e responder perguntas em uma entrevista técnica." },
                { title: "Cultura de Trabalho Global", description: "Entenda as nuances da comunicação em equipes multiculturais e trabalhe com pessoas do mundo todo." }
            ]
        },
        methodologySection: {
            title: "Nossa Metodologia: Aulas Ao Vivo e Foco em Tech",
            subtitle: "Nossas aulas são online, ao vivo e em turmas reduzidas, com foco total na conversação e no vocabulário de tecnologia.",
            benefits: [
                { icon: "💻", title: "Aulas Online Ao Vivo", description: "Interaja em tempo real com o professor e colegas, de onde você estiver." },
                { icon: "🗣️", title: "Foco em Conversação", description: "Turmas pequenas para você ter mais tempo de fala e ganhar confiança para se comunicar." },
                { icon: "🚀", title: "Material Focado em Tech", description: "Estude com artigos, vídeos e exercícios do universo da programação e startups." },
                { icon: "🤝", title: "Simulação de Entrevistas", description: "Treine para entrevistas de emprego reais com feedbacks para você se destacar." }
            ]
        },
        ctaSection: {
            title: "Ready to Level Up Your Career?",
            description: "Não deixe a barreira do idioma limitar seu crescimento. As vagas são limitadas. Inscreva-se e abra as portas do mercado global."
        }
    },
    'ed1': { // Empreendedorismo
        heroContent: {
            titleLine1: "Transforme seu Código",
            titleAccent: "em Negócio.",
            description: "Aprenda a criar, validar e lançar seu próprio produto digital. Do MVP à primeira venda, vamos te guiar na jornada de transformar sua paixão por tecnologia em uma startup de sucesso."
        },
        benefitsSection: {
            title: "Por que todo Dev Deveria Aprender a Empreender?",
            subtitle: "Você já sabe construir. Agora, aprenda a criar produtos que as pessoas amam e pagam para usar.",
            benefits: [
                { icon: "👑", title: "Seja seu Próprio Chefe", description: "Ganhe autonomia para trabalhar em seus próprios projetos e criar o futuro que você quer, nos seus termos." },
                { icon: "💸", title: "Crie Novas Fontes de Renda", description: "Transforme suas ideias de apps, SaaS e ferramentas em negócios lucrativos e escaláveis." },
                { icon: "🧠", title: "Pense como Dono", description: "Desenvolva uma mentalidade de negócios que te fará um dev mais valioso, mesmo em um emprego tradicional." },
                { icon: "🎯", title: "Resolva Problemas Reais", description: "Aprenda a identificar problemas reais do mercado e a construir soluções que resolvem dores de verdade." }
            ]
        },
        curriculumSection: {
            title: "Da Ideia à Primeira Venda: Sua Jornada Empreendedora",
            subtitle: "Uma trilha prática que te ensina o caminho das pedras para criar um negócio digital, do zero ao lançamento.",
            items: [
                { title: "Da Ideia ao MVP", description: "Como validar sua ideia, definir seu público-alvo e construir um Produto Mínimo Viável (MVP) de forma rápida." },
                { title: "Modelo de Negócios", description: "Desenhe seu modelo com Canvas, defina sua proposta de valor e estratégias de monetização." },
                { title: "No-Code & Low-Code", description: "Construa e valide ideias sem escrever uma linha de código, usando ferramentas modernas." },
                { title: "Marketing Digital para Devs", description: "Aprenda o básico de SEO, marketing de conteúdo e como usar as redes sociais para atrair seus primeiros usuários." },
                { title: "Vendas e Métricas", description: "Entenda como fazer sua primeira venda, definir preços e acompanhar as métricas que realmente importam (CAC, LTV)." },
                { title: "Pitch e Captação", description: "Aprenda a apresentar sua ideia de forma convincente para clientes, parceiros e potenciais investidores." }
            ]
        },
        methodologySection: {
            title: "Nossa Metodologia: Construa seu Negócio, Não Apenas um Projeto",
            subtitle: "Aulas práticas, estudos de caso e mentoria com quem já está no campo de batalha do empreendedorismo.",
            benefits: [
                { icon: "🚀", title: "Aulas Práticas", description: "Estudos de caso reais e workshops para aplicar os conceitos diretamente no seu projeto." },
                { icon: "💡", title: "Mentoria com Fundadores", description: "Receba feedback de empreendedores que já trilharam o caminho e aprenderam com os erros e acertos." },
                { icon: "🎤", title: "Pitch Day", description: "Apresente seu projeto final para uma banca de mentores e parceiros, simulando um ambiente real." },
                { icon: "🤝", title: "Comunidade Empreendedora", description: "Conecte-se com outros devs que também estão na jornada de criar seus próprios negócios." }
            ]
        },
        ctaSection: {
            title: "Sua Ideia Merece Sair do Papel.",
            description: "As vagas são limitadas. Inscreva-se para garantir seu interesse na próxima turma e comece a construir o futuro, hoje."
        }
    }
};

// --- Helper Components ---
const Section: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <section className={`py-16 md:py-20 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode, subtitle?: string }> = ({ children, subtitle }) => (
    <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">{children}</h2>
        {subtitle && <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">{subtitle}</p>}
        <div className="w-24 h-1 bg-gradient-to-r from-[#8a4add] to-[#f27983] mx-auto mt-4"></div>
    </div>
);

const BenefitCard: React.FC<CourseBenefit> = ({ icon, title, description }) => (
    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center transform transition-transform duration-300 hover:-translate-y-2 h-full flex flex-col items-center">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#05aff2] to-[#8a4add] text-white mb-6 shadow-lg shadow-[#8a4add]/20">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-400 flex-grow">{description}</p>
    </div>
);

const CurriculumItem: React.FC<CurriculumItem> = ({ title, description }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <div>
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    </div>
);

// --- Main Component ---
const CourseLandingPage: React.FC = () => {
    const { courses, openInscriptionModal } = useAppContext();
    const { courseId } = useParams<{ courseId: string }>();

    const currentCourse = courses.find(c => c.id === courseId);
    
    if (!currentCourse) {
        return <div className="text-center py-20">Curso não encontrado.</div>;
    }
    
    // Retrieve content from the map based on the current course ID
    const content = courseContentMap[currentCourse.id];
    
    if (!content || !content.heroContent) {
        return <div className="text-center py-20">Página para este curso em construção.</div>;
    }

    return (
        <div className="aurora-background text-white">
            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-32 md:pt-40 md:pb-40 text-center relative z-10 bg-grid-pattern">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                            {content.heroContent.titleLine1}<br />
                            <span className="text-[#c4b5fd]">{content.heroContent.titleAccent}</span>
                        </h1>
                        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                            {content.heroContent.description}
                        </p>
                         <div className="mt-10">
                            <button onClick={() => openInscriptionModal(currentCourse)} className="inline-block bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30">
                                Quero me inscrever!
                            </button>
                        </div>
                    </div>
                </section>
                
                {/* Benefits Section */}
                {content.benefitsSection && (
                    <Section className="bg-black/20">
                        <SectionTitle subtitle={content.benefitsSection.subtitle}>
                            {content.benefitsSection.title}
                        </SectionTitle>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {content.benefitsSection.benefits.map((benefit, index) => (
                                <BenefitCard key={index} {...benefit} />
                            ))}
                        </div>
                    </Section>
                )}
                
                {/* Curriculum Section */}
                {content.curriculumSection && (
                    <Section>
                        <SectionTitle subtitle={content.curriculumSection.subtitle}>
                            {content.curriculumSection.title}
                        </SectionTitle>
                        <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
                            <div className="grid md:grid-cols-2 gap-8">
                                {content.curriculumSection.items.map((item, index) => (
                                    <CurriculumItem key={index} {...item} />
                                ))}
                            </div>
                        </div>
                    </Section>
                )}

                {/* Methodology Section */}
                {content.methodologySection && (
                     <Section className="bg-black/20">
                        <SectionTitle subtitle={content.methodologySection.subtitle}>
                            {content.methodologySection.title}
                        </SectionTitle>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {content.methodologySection.benefits.map((benefit, index) => (
                                <BenefitCard key={index} {...benefit} />
                            ))}
                        </div>
                    </Section>
                )}

                {/* Final CTA */}
                {content.ctaSection && (
                    <Section>
                        <div className="text-center bg-grid-pattern p-8 md:p-16 rounded-2xl border border-[#8a4add]/20" style={{backgroundImage: 'radial-gradient(circle at center, #8a4add10, transparent 60%)'}}>
                            <h2 className="text-3xl md:text-4xl font-black text-white">{content.ctaSection.title}</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
                               {content.ctaSection.description}
                            </p>
                            <div className="mt-8">
                                 <button onClick={() => openInscriptionModal(currentCourse)} className="inline-block bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30">
                                    Inscreva-se Agora
                                </button>
                            </div>
                        </div>
                    </Section>
                )}
            </main>
        </div>
    );
};

export default CourseLandingPage;