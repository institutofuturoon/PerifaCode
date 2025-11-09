import React from 'react';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import { useAppContext } from '../App';

// -- Novos Componentes de Layout --

// FIX: The `Section` component's props were updated to accept standard HTML attributes like `id`.
const Section: React.FC<React.ComponentProps<'section'>> = ({ children, className = '', ...rest }) => (
    <section {...rest} className={`py-16 md:py-20 ${className}`}>
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


const FormatCard: React.FC<{ icon: string; title: string; description: string; benefits: string[]; ctaText: string; ctaAction: () => void; ctaClassName: string; }> = ({ icon, title, description, benefits, ctaText, ctaAction, ctaClassName }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col h-full transition-all duration-300 hover:border-[#8a4add]/30 hover:shadow-2xl hover:shadow-[#8a4add]/10">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-gray-400">{description}</p>
        <ul className="mt-6 space-y-3 text-gray-300 flex-grow">
            {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    <span>{benefit}</span>
                </li>
            ))}
        </ul>
        <button onClick={ctaAction} className={`mt-8 w-full font-bold py-3 px-8 rounded-lg transition-all duration-300 ${ctaClassName}`}>
            {ctaText}
        </button>
    </div>
);

const PresentialCourseInfoCard: React.FC<{ title: string; description: string; topics: string[]; status: string }> = ({ title, description, topics, status }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col h-full transition-all duration-300 hover:border-[#8a4add]/30 hover:shadow-2xl hover:shadow-[#8a4add]/10 transform hover:-translate-y-2">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-gray-400 flex-grow">{description}</p>
        <div className="mt-6 border-t border-white/10 pt-6">
            <p className="text-sm font-semibold text-gray-300 mb-3">Principais tópicos:</p>
            <ul className="space-y-2">
                {topics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-400 text-sm">
                        <svg className="h-5 w-5 text-[#8a4add] flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        <span>{topic}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div className="mt-8 text-center">
            <span className="inline-block px-4 py-2 font-semibold rounded-full bg-[#8a4add]/10 text-[#c4b5fd] border border-[#8a4add]/20">{status}</span>
        </div>
    </div>
);

const PerifaCodeView: React.FC = () => {
  const { user, courses, navigate, navigateToCourse, navigateToLesson, courseProgress } = useAppContext();
  
  const inProgressData = courseProgress.inProgressCourses[0] || null;

  const handleContinueLearning = () => {
    if (inProgressData && user) {
        const allLessons = inProgressData.course.modules.flatMap(m => m.lessons);
        const firstUncompletedLesson = allLessons.find(l => !user.completedLessonIds.includes(l.id));
        if (firstUncompletedLesson) {
            navigateToLesson(inProgressData.course, firstUncompletedLesson);
        } else {
            navigateToCourse(inProgressData.course);
        }
    }
  }

  const presencialCourses = [
    {
        title: "Auxiliar Administrativo",
        description: "Desenvolva habilidades essenciais para atuar na área administrativa, com foco em rotinas de escritório, atendimento e organização.",
        topics: ["Comunicação Empresarial", "Rotinas de Escritório", "Pacote Office Básico", "Atendimento ao Cliente"],
        status: "Turmas em Breve"
    },
    {
        title: "Hardware de Computadores",
        description: "Aprenda a montar, desmontar e fazer a manutenção de computadores. Entenda cada componente e resolva problemas comuns de hardware.",
        topics: ["Componentes do PC", "Montagem e Desmontagem", "Diagnóstico de Defeitos", "Instalação de Sistemas"],
        status: "Inscrições Abertas"
    },
    {
        title: "Informática Básica",
        description: "Domine o uso do computador do zero. Ideal para quem busca inclusão digital e quer aprender a usar a internet e programas essenciais.",
        topics: ["Sistema Operacional Windows", "Navegação na Internet", "Criação de E-mail", "Editor de Textos e Planilhas"],
        status: "Turmas em Breve"
    },
    {
        title: "Reforço Escolar",
        description: "Apoio pedagógico para crianças e adolescentes, com foco nas principais matérias e desenvolvimento do raciocínio lógico.",
        topics: ["Matemática", "Português", "Técnicas de Estudo", "Raciocínio Lógico"],
        status: "Inscrições Abertas"
    }
  ];
  
  const LoggedInHome = () => (
    <header className="py-20 md:py-32 text-center relative z-10 bg-grid-pattern">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight">
          Bem-vindo de volta, <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">{user?.name.split(' ')[0]}!</span>
        </h1>
        {inProgressData ? (
          <div className="mt-10 max-w-2xl mx-auto bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white">Continue de onde parou</h2>
            <p className="mt-2 text-gray-300">{inProgressData.course.title}</p>
            <ProgressBar progress={inProgressData.progress} className="my-4"/>
            <button
              onClick={handleContinueLearning}
              className="w-full sm:w-auto bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30"
            >
              Continuar aula
            </button>
          </div>
        ) : (
           <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
            Sua jornada para se tornar um dev de sucesso continua. Escolha um curso e comece a aprender!
          </p>
        )}
      </div>
    </header>
  );

  const LoggedOutHome = () => (
     <header className="py-20 md:py-32 text-center relative z-10 bg-grid-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight">
            Cursos Online e Presenciais <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">de Tecnologia.</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
            Capacitação gratuita, com a flexibilidade do online e a força da vivência presencial. Feito pela quebrada, para a quebrada.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('login')}
              className="w-full sm:w-auto bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30 hover:shadow-[#8a4add]/50"
            >
              Comece a aprender
            </button>
          </div>
        </div>
      </header>
  );

  return (
    <div className="aurora-background">
      {user ? <LoggedInHome /> : <LoggedOutHome />}
      
       <main>
            {/* Dois Formatos Section */}
            <Section className="bg-black/20">
                <SectionTitle 
                    subtitle="Sua jornada na tecnologia, do jeito que funciona pra você. Escolha entre a flexibilidade do online e a força da vivência presencial.">
                    Dois Formatos, Um Objetivo
                </SectionTitle>
                <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <FormatCard 
                        icon="🌐"
                        title="Cursos Online"
                        description="Aprenda no seu tempo, de qualquer lugar, com acesso a uma comunidade vibrante e mentores dedicados."
                        benefits={[
                            'Flexibilidade total de horários',
                            'Acesso ao conteúdo de onde estiver',
                            'Comunidade e suporte online 24/7'
                        ]}
                        ctaText="Explorar Cursos Online"
                        ctaAction={() => navigate('courses')}
                        ctaClassName="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                    />
                    <FormatCard 
                        icon="🤝"
                        title="Cursos Presenciais"
                        description="Vivencie o aprendizado em um ambiente colaborativo, com networking direto e projetos em equipe."
                        benefits={[
                            'Aulas práticas em nosso espaço',
                            'Networking direto com colegas e instrutores',
                            'Experiência de trabalho em equipe'
                        ]}
                        ctaText="Ver Turmas Presenciais"
                        ctaAction={() => document.getElementById('presencial')?.scrollIntoView({ behavior: 'smooth' })}
                        ctaClassName="bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white hover:opacity-90 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30"
                    />
                </div>
            </Section>

            {/* Cursos Presenciais Section */}
            <Section id="presencial">
                <SectionTitle subtitle="Aulas práticas em nosso espaço no Complexo da Coruja, em São Gonçalo. Uma experiência de aprendizado colaborativa e com networking direto.">
                Cursos Presenciais em Destaque
                </SectionTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {presencialCourses.map(course => (
                        <PresentialCourseInfoCard key={course.title} {...course} />
                    ))}
                </div>
            </Section>
            
            {/* Cursos Online em Destaque Section */}
            <Section className="bg-black/20">
                <SectionTitle subtitle="Aprenda no seu tempo, de qualquer lugar, com acesso a uma comunidade vibrante e mentores dedicados.">
                Cursos Online em Destaque
                </SectionTitle>
                <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {courses.slice(0, 4).map(course => (
                    <CourseCard key={course.id} course={course} onCourseSelect={navigateToCourse} />
                ))}
                </div>
                <div className="mt-12 text-center">
                    <button onClick={() => navigate('courses')} className="text-[#c4b5fd] font-semibold hover:underline group">
                        Ver todos os cursos online <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </button>
                </div>
            </Section>
       </main>

    </div>
  );
};

export default PerifaCodeView;