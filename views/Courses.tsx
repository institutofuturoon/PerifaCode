import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { useAppContext } from '../App';
import { Course } from '../types';

const Courses: React.FC = () => {
  const { courses } = useAppContext();
  const navigate = useNavigate();
  const [activeTrack, setActiveTrack] = useState<string>('Todos');

  const tracks = useMemo(() => {
    const allTracks = courses.map(c => c.track);
    const uniqueTracks = ['Todos', ...Array.from(new Set(allTracks))];
    const sortedTracks = uniqueTracks.slice(1).sort();
    return ['Todos', ...sortedTracks];
  }, [courses]);

  const filteredCourses = useMemo(() => activeTrack === 'Todos'
    ? courses
    : courses.filter(course => course.track === activeTrack), [courses, activeTrack]);

  const handleCourseSelect = (course: Course) => {
    if (course.heroContent) {
        navigate(`/course-landing/${course.id}`);
    } else {
        navigate(`/course/${course.id}`);
    }
  };

  return (
    <div className="bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Catálogo de Cursos
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Do online ao presencial, do front-end ao back-end. Aqui você encontra o caminho certo para sua carreira em tecnologia.
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
            <CourseCard key={course.id} course={course} onCourseSelect={handleCourseSelect}/>
            ))}
        </div>
        </div>
    </div>
  );
};

export default Courses;
