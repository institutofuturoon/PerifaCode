import React from 'react';
import { Course, Lesson } from '../types';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import { useAppContext } from '../App';

const FeatureCard: React.FC<{ icon: React.ReactElement, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-purple-500/20 relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300">
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 text-white mb-4 shadow-lg shadow-purple-500/20">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="mt-2 text-base text-gray-400">{children}</p>
        </div>
    </div>
);

const Home: React.FC = () => {
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
  
  const LoggedInHome = () => (
    <section className="pt-20 pb-10 md:pt-32 md:pb-20 aurora-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight">
          Bem-vindo de volta, <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{user?.name.split(' ')[0]}!</span>
        </h1>
        {inProgressData ? (
          <div className="mt-10 max-w-2xl mx-auto bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white">Continue de onde parou</h2>
            <p className="mt-2 text-gray-300">{inProgressData.course.title}</p>
            <ProgressBar progress={inProgressData.progress} className="my-4"/>
            <button
              onClick={handleContinueLearning}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
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
            Seu futuro na tecnologia <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">começa na quebrada.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
            Acreditamos no seu potencial. Nossa missão é abrir as portas do mercado de tecnologia para talentos da periferia, com educação de ponta, comunidade e oportunidades reais.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('courses')}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              Comece a estudar agora
            </button>
            <button
              onClick={() => navigate('connect')}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              Ver eventos e mentorias
            </button>
          </div>
        </div>
      </section>
  );

  return (
    <div className="space-y-24 md:space-y-32">
      {/* Hero Section */}
      {user ? <LoggedInHome /> : <LoggedOutHome />}

      {/* Missão, Visão, Valores Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard title="Nossa Missão" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}>
                Democratizar o acesso à educação de qualidade em tecnologia, capacitando jovens da periferia para que se tornem protagonistas de suas próprias histórias.
            </FeatureCard>
            <FeatureCard title="Nossa Visão" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}>
                Ser a maior ponte entre talentos da periferia e as melhores oportunidades do mercado tech, transformando a cara da tecnologia no Brasil.
            </FeatureCard>
            <FeatureCard title="Nossos Valores" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}>
                Comunidade forte, aprendizado prático, inclusão radical e a coragem de sonhar grande. Juntos, somos mais fortes.
            </FeatureCard>
        </div>
      </section>

      {/* Impacto Social Section */}
      <section className="bg-gray-900/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Nosso Impacto Social</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">Não estamos apenas ensinando a programar. Estamos mudando vidas e reescrevendo o futuro.</p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg">
                    <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">5.000+</span>
                    <p className="mt-2 text-lg font-semibold text-white">Alunos e alunas impactados</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg">
                    <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">70%</span>
                    <p className="mt-2 text-lg font-semibold text-white">De empregabilidade em até 6 meses</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg">
                    <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">100+</span>
                    <p className="mt-2 text-lg font-semibold text-white">Empresas parceiras contratando</p>
                </div>
            </div>
        </div>
      </section>

      {/* Cursos em Destaque */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center pb-20">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Inicie sua Jornada</h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">Escolha uma trilha de aprendizado e dê o primeiro passo para transformar sua carreira.</p>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.slice(0, 4).map(course => (
            <CourseCard key={course.id} course={course} onCourseSelect={navigateToCourse} />
          ))}
        </div>
        <div className="mt-12">
            <button onClick={() => navigate('courses')} className="text-purple-400 font-semibold hover:text-purple-300 transition-colors group">
                Ver todos os cursos <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
        </div>
      </section>
    </div>
  );
};

export default Home;