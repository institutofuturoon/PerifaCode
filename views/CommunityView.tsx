import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import ProjectCard from '../components/ProjectCard';
import { Project } from '../types';

const CommunityView: React.FC = () => {
    const { projects, user } = useAppContext();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<string>('Todos');

    const allTechs = useMemo(() => {
        const techSet = new Set<string>();
        projects.forEach(project => {
            project.technologies.forEach(tech => techSet.add(tech));
        });
        return ['Todos', ...Array.from(techSet).sort()];
    }, [projects]);

    const filteredProjects = useMemo(() => {
        if (activeFilter === 'Todos') {
            return projects;
        }
        return projects.filter(project => project.technologies.includes(activeFilter));
    }, [projects, activeFilter]);
    
    const handleProjectSelect = (project: Project) => {
        navigate(`/project/${project.id}`);
    };
    
    const handleNavigateToProjectEditor = () => {
        navigate('/project/edit');
    };


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
                <div className="text-center sm:text-left">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#c4b5fd]">Showcase da Quebrada</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-gray-300">
                        Veja o que a nossa comunidade está construindo. Inspire-se e compartilhe seu corre!
                    </p>
                </div>
                {user && (
                    <button
                        onClick={handleNavigateToProjectEditor}
                        className="mt-6 sm:mt-0 w-full sm:w-auto flex-shrink-0 bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30"
                    >
                        Submeter Projeto
                    </button>
                )}
            </div>

            {/* Filters Section */}
            <div className="mb-12 flex justify-center flex-wrap gap-2 sm:gap-3">
                {allTechs.map(tech => (
                    <button
                        key={tech}
                        onClick={() => setActiveFilter(tech)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${
                        activeFilter === tech
                            ? 'bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white shadow-md shadow-[#8a4add]/20'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                        {tech}
                    </button>
                ))}
            </div>


            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => (
                        <ProjectCard key={project.id} project={project} onProjectSelect={handleProjectSelect} />
                    ))
                ) : (
                    <div className="text-center py-20 col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                        <p className="text-gray-400 text-lg">Nenhum projeto encontrado com a tecnologia <span className="font-bold text-white">{activeFilter}</span>.</p>
                        <button onClick={() => setActiveFilter('Todos')} className="mt-4 text-[#c4b5fd] font-semibold hover:underline">
                            Ver todos os projetos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityView;