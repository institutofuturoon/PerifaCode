
import React from 'react';
import { Project } from '../types';
import { useAppContext } from '../App';

interface ProjectCardProps {
  project: Project;
  onProjectSelect: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onProjectSelect }) => {
  const { users, openProfileModal } = useAppContext();
  const author = users.find(u => u.id === project.authorId);

  const isPending = project.status === 'pending';
  const isRejected = project.status === 'rejected';

  return (
    <div
      className={`bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border ${isRejected ? 'border-red-500/30' : 'border-white/10'} group flex flex-col text-left hover:border-[#8a4add]/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#8a4add]/20 h-full relative`}
    >
      {/* Status Badges */}
      {isPending && (
        <div className="absolute top-2 left-2 z-20 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded shadow-md">
            ⏳ EM ANÁLISE
        </div>
      )}
       {isRejected && (
        <div className="absolute top-2 left-2 z-20 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">
            🚫 REJEITADO
        </div>
      )}

      <button onClick={() => onProjectSelect(project)} className="block w-full text-left relative" disabled={isPending || isRejected}>
        <div className="overflow-hidden aspect-video">
          <img className={`h-full w-full object-cover transition-transform duration-500 ${isPending || isRejected ? 'grayscale opacity-50' : 'group-hover:scale-105'}`} src={project.imageUrl} alt={project.title} />
        </div>
        {project.lookingForCollab && !isPending && !isRejected && (
            <div className="absolute top-2 right-2 bg-[#8a4add] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md flex items-center gap-1">
                <span>🤝</span> Buscando Time
            </div>
        )}
      </button>
      <div className="p-5 flex flex-col flex-grow">
        <button onClick={() => onProjectSelect(project)} className="block w-full text-left" disabled={isPending || isRejected}>
            <h3 className="text-md font-bold text-white group-hover:text-[#c4b5fd] transition-colors line-clamp-1">{project.title}</h3>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</p>
        </button>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map(tech => (
            <span key={tech} className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#8a4add]/10 text-[#c4b5fd] border border-[#8a4add]/20">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
             <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gray-500/10 text-gray-300 border border-gray-500/20">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                if (author) openProfileModal(author);
              }}
              className="flex items-center gap-2 overflow-hidden rounded-md p-1 -ml-1 hover:bg-white/10 transition-colors"
              title={`Ver perfil de ${author?.name}`}
              disabled={isPending || isRejected}
            >
                <img src={author?.avatarUrl} alt={author?.name} className="h-6 w-6 rounded-full flex-shrink-0 border border-white/10"/>
                <span className="text-gray-300 truncate hover:text-white max-w-[100px]">{author?.name.split(' ')[0]}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-400 flex-shrink-0">
                <span className="text-xs">👏 {project.claps}</span>
                <span className="text-xs">💬 {project.comments.length}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
