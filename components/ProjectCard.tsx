import React from 'react';
import { Project } from '../types';
import { useAppContext } from '../App';

interface ProjectCardProps {
  project: Project;
  onProjectSelect: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onProjectSelect }) => {
  const { users } = useAppContext();
  const author = users.find(u => u.id === project.authorId);

  return (
    <button
      onClick={() => onProjectSelect(project)}
      className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 group flex flex-col text-left hover:border-[#8a4add]/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#8a4add]/20"
    >
      <div className="overflow-hidden aspect-video">
        <img className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" src={project.imageUrl} alt={project.title} />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-md font-bold text-white group-hover:text-[#c4b5fd] transition-colors line-clamp-1">{project.title}</h3>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map(tech => (
            <span key={tech} className="px-2 py-1 text-xs font-semibold rounded-full bg-[#8a4add]/10 text-[#c4b5fd] border border-[#8a4add]/20">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
             <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-500/10 text-gray-300 border border-gray-500/20">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 overflow-hidden">
                <img src={author?.avatarUrl} alt={author?.name} className="h-6 w-6 rounded-full flex-shrink-0"/>
                <span className="text-gray-300 truncate">{author?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 flex-shrink-0">
                <span>👏</span>
                <span>{project.claps}</span>
            </div>
        </div>
      </div>
    </button>
  );
};

export default ProjectCard;