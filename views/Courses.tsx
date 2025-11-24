
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { useAppContext } from '../App';
import { Course } from '../types';
import OnsiteCourseCard from '../components/OnsiteCourseCard';
import SEO from '../components/SEO';
import Badge from '../components/Badge';

const FeaturedCourse: React.FC<{ course: Course, onSelect: (course: Course) => void }> = ({ course, onSelect }) => (
    <div 
        className="relative rounded-2xl overflow-hidden p-6 md:p-10 flex items-end min-h-[350px] bg-black/20 border border-white/10 group cursor-pointer shadow-2xl shadow-black/50"
        onClick={() => onSelect(course)}
    >
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/60 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-3">
                 <span className="inline-block py-1 px-3 rounded bg-[#8a4add] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#8a4add]/20">
                    Destaque
                </span>
                <span className="font-semibold text-xs text-[#c4b5fd] uppercase tracking-wider bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-white/10">{course.track}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight group-hover:text-[#c4b5fd] transition-colors">{course.title}</h2>
            <p className="text-sm md:text-base text-gray-200 line-clamp-2 mb-8 max-w-2xl leading-relaxed drop-shadow-md">{course.longDescription}</p>
            <button
                className="bg-white text-black font-bold py-3.5 px-8 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm flex items-center gap-2"
            >
                Saiba Mais
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
        </div>
    </div>
);

const Courses: React.FC = () => {
  const { courses, user, showToast } = useAppContext();
  const navigate = useNavigate();
  
  const [activeTrack, setActiveTrack] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('Todos');
  const [selectedFormat, setSelectedFormat] = useState<string>('Todos');
  const [showFilters, setShowFilters] = useState(false);

  const handleCourseSelect = (course: Course) => {
    // FLUXO INSTITUCIONAL: Sempre redireciona para a Landing Page (Página de Venda/Explicação)
    // O aluno só entra no Workspace (Sala de Aula) através da Landing Page.
    navigate(`/course-landing/${course.slug || course.id}`);
  };

  const getCourseProgress = (course: Course) => {
      if (!user) return { progress: 0, isEnrolled: false };
      
      const courseLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
      if (courseLessonIds.length === 0) return { progress: 0, isEnrolled: false };

      const completedInCourse = user.completedLessonIds.filter(id => courseLessonIds.includes(id));
      const isEnrolled = completedInCourse.length > 0 || (user.completedLessonIds && user.completedLessonIds.some(id => courseLessonIds.includes(id)));
      
      const progress = Math.round((completedInCourse.length / courseLessonIds.length) * 100);
      
      return { progress, isEnrolled: isEnrolled || progress > 0 };
  };

  const featuredCourse = useMemo(() => courses.find(c => c.heroContent) || courses[0], [courses]);
  const onsiteCourses = useMemo(() => courses.filter(c => c.format === 'presencial' || c.format === 'hibrido'), [courses]);

  const tracks = useMemo(() => ['Todos', ...Array.from(new Set(courses.map(c => c.track)))].sort(), [courses]);
  const levels = useMemo(() => ['Todos', ...Array.from(new Set(courses.map(c => c.skillLevel)))].sort(), [courses]);
  const formats = useMemo(() => ['Todos', ...Array.from(new Set(courses.map(c => c.format)))].sort(), [courses]);
  
  const filteredCourses = useMemo(() => courses.filter(course => 
    (course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.description.toLowerCase().includes(searchTerm.toLowerCase()) || (course.tags && course.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))) &&
    (selectedLevel === 'Todos' || course.skillLevel === selectedLevel) &&
    (selectedFormat === 'Todos' || course.format === selectedFormat) &&
    (activeTrack === 'Todos' || course.track === activeTrack)
  ), [courses, searchTerm, selectedLevel, selectedFormat, activeTrack]);
  
  const hasActiveFilters = searchTerm !== '' || activeTrack !== 'Todos' || selectedLevel !== 'Todos' || selectedFormat !== 'Todos';

  const clearFilters = () => {
      setSearchTerm('');
      setActiveTrack('Todos');
      setSelectedLevel('Todos');
      setSelectedFormat('Todos');
  };

  const canCreateCourse = user?.role === 'admin' || user?.role === 'instructor';

  return (
    <div className="bg-[#09090B] min-h-screen">
        <SEO 
            title="Cursos Gratuitos de Tecnologia | FuturoOn"
            description="Catálogo completo de cursos gratuitos de programação, design e robótica. Aprenda Python, React, Node.js e mais. Presencial em São Gonçalo ou Online."
            keywords={['cursos de programação', 'curso grátis tecnologia', 'python', 'react', 'são gonçalo', 'robótica', 'educação digital']}
        />
        
        <section className="relative py-20 md:py-32 overflow-hidden text-center">
             <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#8a4add]/10 rounded-full blur-[100px] pointer-events-none"></div>
             
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <Badge text="Catálogo de Cursos" />
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 leading-tight">
                    Explore nosso <br/>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">Catálogo de Cursos</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed">
                    Do básico ao avançado, do online ao presencial. Encontre a trilha certa para acelerar sua carreira na tecnologia.
                </p>
             </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-20">
            
            {canCreateCourse && (
                <div className="flex justify-end mb-8 animate-fade-in">
                    <button 
                        onClick={() => navigate('/admin/course-editor/new')}
                        className="flex items-center gap-2 bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-[#c4b5fd] transition-all shadow-lg transform hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Criar Novo Curso
                    </button>
                </div>
            )}

            {featuredCourse && courses.length > 0 && (
                 <section className="mb-16 animate-fade-in">
                    <FeaturedCourse course={featuredCourse} onSelect={handleCourseSelect} />
                </section>
            )}

             {onsiteCourses.length > 0 && (
                <section className="py-4 mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-green-500/20 text-green-400 p-1.5 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </span>
                        <h2 className="text-xl font-bold text-white">Próximas Turmas Presenciais</h2>
                    </div>
                    <div className="grid gap-4">
                        {onsiteCourses.map(course => (
                            <OnsiteCourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </section>
            )}

            <section id="all-courses" className="scroll-mt-24 relative">
                <div className="sticky top-[72px] z-30 mb-8 transition-all duration-300">
                    <div className="bg-[#09090B]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl ring-1 ring-white/5">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-grow group">
                                <input
                                    type="search"
                                    placeholder="Buscar por título, tecnologia ou assunto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 bg-[#18181B] hover:bg-[#202024] rounded-xl border border-white/5 focus:border-[#8a4add]/50 focus:ring-1 focus:ring-[#8a4add]/50 focus:outline-none transition-all text-sm text-white placeholder-gray-500"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500 group-focus-within:text-[#8a4add] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                            </div>

                            <div className="relative w-48 hidden md:block">
                                <select 
                                    value={activeTrack} 
                                    onChange={e => setActiveTrack(e.target.value)} 
                                    className="w-full appearance-none bg-[#18181B] hover:bg-[#202024] text-gray-300 py-3 pl-4 pr-10 rounded-xl border border-white/5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors focus:outline-none focus:border-[#8a4add] focus:text-white"
                                >
                                    {tracks.map(track => <option key={track} value={track}>{track === 'Todos' ? 'Trilha: Todas' : track}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex-shrink-0 p-3 rounded-xl border transition-all duration-200 ${
                                    showFilters || (selectedLevel !== 'Todos' || selectedFormat !== 'Todos')
                                        ? 'bg-[#8a4add] text-white border-[#8a4add]' 
                                        : 'bg-[#18181B] text-gray-400 border-white/5 hover:bg-[#202024] hover:text-white'
                                }`}
                                title="Filtros avançados"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                            </button>
                        </div>

                        {showFilters && (
                            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 md:flex gap-3 animate-fade-in">
                                <div className="relative w-full md:w-auto flex-1 md:hidden">
                                     <select 
                                        value={activeTrack} 
                                        onChange={e => setActiveTrack(e.target.value)} 
                                        className="w-full appearance-none bg-[#18181B] hover:bg-[#202024] text-gray-300 py-2 pl-4 pr-10 rounded-lg border border-white/5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors focus:outline-none focus:border-[#8a4add] focus:text-white"
                                    >
                                        {tracks.map(track => <option key={track} value={track}>{track === 'Todos' ? 'Trilha: Todas' : track}</option>)}
                                    </select>
                                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>

                                <div className="relative w-full md:w-auto flex-1">
                                    <select 
                                        value={selectedLevel} 
                                        onChange={e => setSelectedLevel(e.target.value)} 
                                        className="w-full appearance-none bg-[#18181B] hover:bg-[#202024] text-gray-300 py-2 pl-4 pr-10 rounded-lg border border-white/5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors focus:outline-none focus:border-[#8a4add] focus:text-white"
                                    >
                                        {levels.map(level => <option key={level} value={level}>{level === 'Todos' ? 'Nível: Todos' : level}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>

                                <div className="relative w-full md:w-auto flex-1">
                                    <select 
                                        value={selectedFormat} 
                                        onChange={e => setSelectedFormat(e.target.value)} 
                                        className="w-full appearance-none bg-[#18181B] hover:bg-[#202024] text-gray-300 py-2 pl-4 pr-10 rounded-lg border border-white/5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors focus:outline-none focus:border-[#8a4add] focus:text-white"
                                    >
                                        {formats.map(format => <option key={format} value={format}>{format === 'Todos' ? 'Formato: Todos' : format}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                                
                                {hasActiveFilters && (
                                    <button 
                                        onClick={clearFilters} 
                                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-2 justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        Limpar
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="text-right px-2 mt-2">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {filteredCourses.length} {filteredCourses.length === 1 ? 'Curso encontrado' : 'Cursos encontrados'}
                        </p>
                    </div>
                </div>

                {filteredCourses.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                        {filteredCourses.map(course => {
                            const { progress, isEnrolled } = getCourseProgress(course);
                            return (
                                <CourseCard 
                                    key={course.id} 
                                    course={course} 
                                    onCourseSelect={handleCourseSelect}
                                    progress={progress}
                                    isEnrolled={isEnrolled}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 border-dashed flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-gray-300 font-medium">Nenhum curso encontrado com os filtros atuais.</p>
                        
                        {canCreateCourse ? (
                            <button 
                                onClick={() => navigate('/admin/course-editor/new')}
                                className="mt-6 px-6 py-2 bg-[#8a4add] text-white rounded-full hover:bg-[#7c3aed] transition-colors font-bold text-sm shadow-lg"
                            >
                                Criar o Primeiro Curso
                            </button>
                        ) : (
                            <button onClick={clearFilters} className="mt-6 px-6 py-2 bg-[#8a4add]/10 text-[#c4b5fd] border border-[#8a4add]/20 rounded-full hover:bg-[#8a4add]/20 transition-colors font-semibold text-sm">
                                Limpar Filtros
                            </button>
                        )}
                    </div>
                )}
            </section>

            <section className="text-center py-12 mt-8 border-t border-white/5">
                <h3 className="text-base font-bold text-white mb-2">Não encontrou o que procura?</h3>
                <p className="text-sm text-gray-400 mb-4">Estamos sempre criando novos conteúdos baseados no que a comunidade precisa.</p>
                <a href="mailto:sugestoes@futuroon.org?subject=Sugestão de Novo Curso" className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-semibold text-[#c4b5fd] hover:text-white hover:bg-white/10 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    Sugerir um novo curso
                </a>
            </section>
        </div>
    </div>
  );
};

export default Courses;
