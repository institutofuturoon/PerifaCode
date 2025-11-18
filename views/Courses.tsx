
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { useAppContext } from '../App';
import { Course } from '../types';
import OnsiteCourseCard from '../components/OnsiteCourseCard';

const FeaturedCourse: React.FC<{ course: Course, onSelect: (course: Course) => void }> = ({ course, onSelect }) => (
    <div 
        className="relative rounded-2xl overflow-hidden p-8 md:p-10 flex items-end min-h-[320px] bg-black/20 border border-white/10"
    >
        <div className="absolute inset-0">
            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/70 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-2xl">
            <span className="font-semibold text-xs text-[#c4b5fd] uppercase tracking-wider">{course.track}</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-1">{course.title}</h2>
            <p className="mt-2 text-base text-gray-300 line-clamp-3">{course.longDescription}</p>
            <button
                onClick={() => onSelect(course)}
                className="mt-4 bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30 text-sm"
            >
                Ver Detalhes do Curso
            </button>
        </div>
    </div>
);

const Courses: React.FC = () => {
  const { courses } = useAppContext();
  const navigate = useNavigate();
  
  const [activeTrack, setActiveTrack] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('Todos');
  const [selectedFormat, setSelectedFormat] = useState<string>('Todos');

  const handleCourseSelect = (course: Course) => {
    if (course.heroContent) {
        navigate(`/course-landing/${course.id}`);
    } else {
        navigate(`/course/${course.id}`);
    }
  };

  const featuredCourse = useMemo(() => courses.find(c => c.heroContent) || courses[0], [courses]);
  const onsiteCourses = useMemo(() => courses.filter(c => c.format === 'presencial' || c.format === 'hibrido'), [courses]);

  const tracks = useMemo(() => ['Todos', ...Array.from(new Set(courses.map(c => c.track)))].sort(), [courses]);
  const levels = useMemo(() => ['Todos', ...Array.from(new Set(courses.map(c => c.skillLevel)))].sort(), [courses]);
  const formats = useMemo(() => ['Todos', ...Array.from(new Set(courses.map(c => c.format)))].sort(), [courses]);
  
  const filteredCourses = useMemo(() => courses.filter(course => 
    (course.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedLevel === 'Todos' || course.skillLevel === selectedLevel) &&
    (selectedFormat === 'Todos' || course.format === selectedFormat) &&
    (activeTrack === 'Todos' || course.track === activeTrack)
  ), [courses, searchTerm, selectedLevel, selectedFormat, activeTrack]);
  

  return (
    <div className="bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                Catálogo de Cursos
                </h1>
                <p className="mt-2 max-w-2xl mx-auto text-base text-gray-300">
                Do online ao presencial, do front-end ao back-end. Aqui você encontra o caminho certo para sua carreira em tecnologia.
                </p>
            </div>

            {featuredCourse && (
                 <section className="mt-8">
                    <FeaturedCourse course={featuredCourse} onSelect={handleCourseSelect} />
                </section>
            )}

             {onsiteCourses.length > 0 && (
                <section className="py-8">
                    <h2 className="text-xl font-bold text-white mb-4">Próximas Turmas Presenciais</h2>
                    <div className="space-y-3">
                        {onsiteCourses.map(course => (
                            <OnsiteCourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </section>
            )}

            <section className="py-8">
                <h2 className="text-xl font-bold text-white mb-4">Todos os Cursos</h2>

                {/* Filter Bar */}
                <div className="bg-black/20 backdrop-blur-sm p-3 rounded-xl border border-white/10 flex flex-col md:flex-row gap-3 items-center mb-6 sticky top-20 z-30">
                    <div className="relative flex-grow w-full md:w-auto">
                        <input
                            type="search"
                            placeholder="Buscar por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-9 bg-white/5 rounded-md border border-white/10 focus:ring-2 focus:ring-[#8a4add] focus:outline-none transition-colors text-sm text-white"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full md:w-auto">
                        <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} className="bg-white/10 text-gray-300 p-2 rounded-md border-white/10 text-xs">
                            {levels.map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                         <select value={selectedFormat} onChange={e => setSelectedFormat(e.target.value)} className="bg-white/10 text-gray-300 p-2 rounded-md border-white/10 text-xs">
                            {formats.map(format => <option key={format} value={format}>{format}</option>)}
                        </select>
                        <select value={activeTrack} onChange={e => setActiveTrack(e.target.value)} className="bg-white/10 text-gray-300 p-2 rounded-md border-white/10 text-xs col-span-2 sm:col-span-1">
                            {tracks.map(track => <option key={track} value={track}>{track}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.map(course => (
                        <CourseCard key={course.id} course={course} onCourseSelect={handleCourseSelect}/>
                    ))}
                </div>
            </section>

            <section className="text-center py-8">
                <h3 className="text-lg font-bold text-white">Não encontrou o que procurava?</h3>
                <p className="text-gray-400 mt-1 text-sm">Sua opinião é importante! Mande sua sugestão de curso para nós.</p>
                <a href="mailto:sugestoes@futuroon.org?subject=Sugestão de Novo Curso" className="mt-3 inline-block text-xs font-semibold text-[#c4b5fd] hover:text-white hover:underline">
                    Sugerir um curso
                </a>
            </section>
        </div>
    </div>
  );
};

export default Courses;
