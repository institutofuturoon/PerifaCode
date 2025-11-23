import React from 'react';
import { Project } from '../types';
import { useAppContext } from '../contexts/AppContextAdapter';

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
      className={`group bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/6 rounded-xl overflow-hidden border transition-all duration-300 flex flex-col text-left h-full relative ${
        isRejected 
          ? 'border-red-500/30 opacity-60' 
          : 'border-white/10 hover:border-[#8a4add]/50'
      }`}
    >
      {/* Status Badge */}
      {isPending && (
        <div className="absolute top-3 left-3 z-20 bg-yellow-500/80 text-black text-xs font-bold px-2 py-1 rounded-lg">
          ⏳ Análise
        </div>
      )}
      {isRejected && (
        <div className="absolute top-3 left-3 z-20 bg-red-500/80 text-white text-xs font-bold px-2 py-1 rounded-lg">
          🚫 Rejeitado
        </div>
      )}

      {/* Collab Badge */}
      {project.lookingForCollab && !isPending && !isRejected && (
        <div className="absolute top-3 right-3 bg-[#8a4add]/80 text-white text-xs font-bold px-2 py-1 rounded-lg">
          🤝 Time
        </div>
      )}

      {/* Image */}
      <button 
        onClick={() => onProjectSelect(project)} 
        disabled={isPending || isRejected}
        className="block w-full"
      >
        <div className="overflow-hidden aspect-video">
          <img 
            className={`h-full w-full object-cover transition-transform duration-500 ${
              isPending || isRejected 
                ? 'grayscale opacity-50' 
                : 'group-hover:scale-105'
            }`} 
            src={project.imageUrl} 
            alt={project.title} 
          />
        </div>
      </button>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <button 
          onClick={() => onProjectSelect(project)} 
          disabled={isPending || isRejected}
          className="block w-full text-left"
        >
          <h3 className="text-sm font-bold text-white group-hover:text-[#c4b5fd] transition-colors line-clamp-2">
            {project.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
            {project.description}
          </p>
        </button>

        {/* Tech Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map(tech => (
            <span 
              key={tech} 
              className="px-2 py-1 text-xs font-semibold rounded-lg bg-[#8a4add]/20 text-[#c4b5fd] border border-[#8a4add]/30"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-gray-500/10 text-gray-300">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (author) openProfileModal(author);
            }}
            disabled={isPending || isRejected}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <img 
              src={author?.avatarUrl} 
              alt={author?.name} 
              className="h-5 w-5 rounded-full border border-white/10"
            />
            <span className="font-medium truncate">{author?.name.split(' ')[0]}</span>
          </button>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <span>👏 {project.claps}</span>
            <span>💬 {project.comments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
