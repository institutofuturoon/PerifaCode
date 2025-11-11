import React, { useState, useMemo } from 'react';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import { useAppContext } from '../App';
import OnsiteCourseCard from '../components/OnsiteCourseCard';

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

type Track = 'Todos' | 'Frontend' | 'Backend' | 'IA' | 'UX/UI' | 'Games' | 'Idiomas' | 'Negócios' | 'Digital';

const PerifaCodeView: React.FC = () => {
  const { user, navigate, courses, navigateToCourse, navigateToLesson, courseProgress } = useAppContext();
  const [activeTrack, setActiveTrack] = useState<Track>('Todos');

  const onlineCourses = useMemo(() => courses.filter(c => c.format === 'online'), [courses]);
  const onsiteCourses = useMemo(() => courses.filter(c => c.format === 'presencial' || c.format === 'hibrido'), [courses]);

  const tracks = useMemo(() => {
    const allTracks = onlineCourses.map(c => c.track);
    const uniqueTracks = ['Todos', ...Array.from(new Set(allTracks))];
    const sortedTracks = uniqueTracks.slice(1).sort();
    return ['Todos', ...sortedTracks] as Track[];
  }, [onlineCourses]);
  
  const filteredOnlineCourses = useMemo(() => activeTrack === 'Todos'
    ? onlineCourses
    : onlineCourses.filter(course => course.track === activeTrack), [onlineCourses, activeTrack]);
  
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
              onClick={() => document.getElementById('online-courses')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30 hover:shadow-[#8a4add]/50"
            >
              Ver Cursos
            </button>
             <button
              onClick={() => navigate('register')}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              Cadastre-se Grátis
            </button>
          </div>
        </div>
      </header>
  );

  return (
    <div className="aurora-background">
      {user ? <LoggedInHome /> : <LoggedOutHome />}
      
       <main>
            {/* Cursos Presenciais */}
            <Section className="bg-black/20">
                <SectionTitle 
                    subtitle="Participe das nossas turmas presenciais no Complexo da Coruja (São Gonçalo/RJ). Uma experiência de aprendizado coletiva e transformadora. Vagas limitadas!">
                    Turmas Presenciais Abertas
                </SectionTitle>
                <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {onsiteCourses.length > 0 ? (
                      onsiteCourses.map(course => (
                        <OnsiteCourseCard key={course.id} course={course} />
                      ))
                    ) : (
                      <div className="md:col-span-2 text-center py-10 bg-white/5 rounded-lg border border-dashed border-white/10">
                        <p className="text-gray-400">Nenhuma turma presencial com inscrições abertas no momento.</p>
                        <p className="text-gray-500 text-sm mt-1">Fique de olho em nossas redes sociais para novidades!</p>
                      </div>
                    )}
                </div>
            </Section>
            
            {/* Cursos Online em Destaque Section */}
            <Section id="online-courses">
                <SectionTitle subtitle="Aprenda no seu ritmo, de onde estiver. Explore nosso catálogo de cursos online e comece a estudar agora mesmo.">
                    Catálogo de Cursos Online
                </SectionTitle>

                <div className="mt-12 mb-12 flex justify-center flex-wrap gap-2 sm:gap-4">
                    {tracks.map(track => (
                    <button
                        key={track}
                        onClick={() => setActiveTrack(track)}
                        className={`px-5 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${
                        activeTrack === track
                            ? 'bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white shadow-lg shadow-[#8a4add]/30'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-transparent'
                        }`}
                    >
                        {track}
                    </button>
                    ))}
                </div>

                <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredOnlineCourses.map(course => (
                        <CourseCard key={course.id} course={course} onCourseSelect={navigateToCourse} />
                    ))}
                </div>
            </Section>
       </main>

    </div>
  );
};

export default PerifaCodeView;