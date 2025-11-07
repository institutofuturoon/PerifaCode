import React from 'react';
import { useAppContext } from '../App';
import ProjectCard from '../components/ProjectCard';

const CommunityView: React.FC = () => {
    const { projects, navigateToProject, navigateToProjectEditor, user } = useAppContext();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
                <div className="text-center sm:text-left">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Showcase da Quebrada</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-gray-300">
                        Veja o que a nossa comunidade está construindo. Inspire-se e compartilhe seu corre!
                    </p>
                </div>
                {user && (
                    <button
                        onClick={() => navigateToProjectEditor()}
                        className="mt-6 sm:mt-0 w-full sm:w-auto flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
                    >
                        Submeter Projeto
                    </button>
                )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} onProjectSelect={navigateToProject} />
                ))}
            </div>
        </div>
    );
};

export default CommunityView;
