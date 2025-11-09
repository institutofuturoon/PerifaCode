import React, { useState } from 'react';
import CourseCard from '../components/CourseCard';
import { useAppContext } from '../App';

type Track = 'Todos' | 'Frontend' | 'Backend' | 'IA' | 'UX/UI';

const Courses: React.FC = () => {
  const { courses, navigateToCourse } = useAppContext();
  const [activeTrack, setActiveTrack] = useState<Track>('Todos');

  const tracks: Track[] = ['Todos', 'Frontend', 'Backend', 'IA', 'UX/UI'];

  const filteredCourses = activeTrack === 'Todos'
    ? courses
    : courses.filter(course => course.track === activeTrack);

  return (
    <div className="bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Trilhas de Aprendizado
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Do front-end ao back-end, da inteligência artificial ao design. Aqui você encontra o caminho certo para sua carreira em tecnologia.
            </p>
        </div>

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} onCourseSelect={navigateToCourse}/>
            ))}
        </div>
        </div>
    </div>
  );
};

export default Courses;