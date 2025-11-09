import React from 'react';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import ProjectCard from '../components/ProjectCard';
import { useAppContext } from '../App';

const StepCard: React.FC<{ icon: string; title: string; description: string; number: string }> = ({ icon, title, description, number }) => (
    <div className="relative p-8 bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#8a4add]/30 hover:shadow-2xl hover:shadow-[#8a4add]/10">
        <div className="absolute -top-2 -left-2 text-7xl font-black text-white/5 select-none">{number}</div>
        <div className="relative">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="mt-2 text-gray-400">{description}</p>
        </div>
    </div>
);

const TrackCard: React.FC<{ icon: React.ReactNode; title: string; description: string; colorClasses: string; onClick: () => void }> = ({ icon, title, description, colorClasses, onClick }) => (
    <button onClick={onClick} className={`p-8 rounded-lg text-left border transition-all duration-300 group hover:-translate-y-1 ${colorClasses}`}>
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-gray-300">{description}</p>
        <div className="mt-6 font-semibold text-white opacity-80 group-hover:opacity-100 group-hover:underline">
            Explorar trilha <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
        </div>
    </button>
);


const PerifaCodeView: React.FC = () => {
  const { user, courses, projects, navigate, navigateToCourse, navigateToProject, navigateToLesson, courseProgress } = useAppContext();
  
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
  
  const LoggedInHome = () => (
    <section className="pt-20 pb-10 md:pt-32 md:pb-20 aurora-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
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
    </section>
  );

  const LoggedOutHome = () => (
     <section className="pt-20 pb-10 md:pt-32 md:pb-20 aurora-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight">
            Aprenda a programar, <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">transforme seu futuro.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
            Cursos gratuitos de tecnologia, do zero ao mercado de trabalho. Feito pela quebrada, para a quebrada. Junte-se à nossa comunidade e comece a construir sua carreira.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('courses')}
              className="w-full sm:w-auto bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30 hover:shadow-[#8a4add]/50"
            >
              Ver todos os cursos
            </button>
            <button
              onClick={() => navigate('login')}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              Criar conta gratuita
            </button>
          </div>
        </div>
      </section>
  );
  
  const tracks = [
    { title: 'Frontend', icon: '🎨', description: 'Crie interfaces incríveis e interativas para a web.', colorClasses: 'border-blue-500/20 bg-blue-500/10 hover:border-blue-500/50' },
    { title: 'Backend', icon: '⚙️', description: 'Construa a lógica e os sistemas que dão vida às aplicações.', colorClasses: 'border-yellow-500/20 bg-yellow-500/10 hover:border-yellow-500/50' },
    { title: 'IA', icon: '🧠', description: 'Explore o futuro da tecnologia com inteligência artificial.', colorClasses: 'border-pink-500/20 bg-pink-500/10 hover:border-pink-500/50' },
    { title: 'UX/UI', icon: '✨', description: 'Desenhe produtos que os usuários amam e acham fáceis de usar.', colorClasses: 'border-purple-500/20 bg-purple-500/10 hover:border-purple-500/50' },
  ];

  return (
    <div className="space-y-24 md:space-y-32 pb-20">
      {user ? <LoggedInHome /> : <LoggedOutHome />}
      
      {/* Como Funciona */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Nossa Metodologia</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">Um caminho claro para você sair do zero e chegar preparado(a) para o mercado.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
            <StepCard number="01" icon="🎓" title="Aulas e Desafios" description="Aprenda com conteúdo prático e direto ao ponto, aplicando seus conhecimentos em desafios de código."/>
            <StepCard number="02" icon="🚀" title="Projetos Reais" description="Construa projetos para seu portfólio, simulando o dia a dia de um(a) desenvolvedor(a) profissional."/>
            <StepCard number="03" icon="🤝" title="Mentorias e Comunidade" description="Conecte-se com profissionais experientes e outros alunos para acelerar seu desenvolvimento."/>
        </div>
      </section>

      {/* Trilhas de Aprendizado */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Explore Nossas Trilhas</h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">Foque em uma área e desenvolva as habilidades que o mercado procura.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {tracks.map(track => (
                  <TrackCard 
                      key={track.title}
                      title={track.title}
                      icon={track.icon}
                      description={track.description}
                      colorClasses={track.colorClasses}
                      onClick={() => navigate('courses')} // Simplified for now, could be navigate('courses', { filter: track.title })
                  />
              ))}
          </div>
      </section>

      {/* Cursos em Destaque */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Cursos em Destaque</h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">Os cursos mais populares entre nossos alunos para você começar com tudo.</p>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.slice(0, 4).map(course => (
            <CourseCard key={course.id} course={course} onCourseSelect={navigateToCourse} />
          ))}
        </div>
        <div className="mt-12">
            <button onClick={() => navigate('courses')} className="text-[#8a4add] font-semibold hover:text-purple-300 transition-colors group">
                Ver todos os cursos <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
        </div>
      </section>

      {/* Projetos da Comunidade */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
          Da <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">Comunidade</span>
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">Veja o que nossos alunos estão construindo com o que aprenderam na plataforma.</p>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.slice(0, 4).map(project => (
                <ProjectCard key={project.id} project={project} onProjectSelect={navigateToProject} />
            ))}
        </div>
         <div className="mt-12">
            <button onClick={() => navigate('community')} className="text-[#8a4add] font-semibold hover:text-purple-300 transition-colors group">
                Ver todos os projetos <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
        </div>
      </section>

    </div>
  );
};

export default PerifaCodeView;
