import React from 'react';

interface CourseModalityBadgeProps {
  format: 'online' | 'presencial' | 'hibrido';
  size?: 'sm' | 'md' | 'lg';
}

const CourseModalityBadge: React.FC<CourseModalityBadgeProps> = ({ format, size = 'md' }) => {
  const config = {
    online: {
      icon: '🌐',
      label: '100% Online',
      color: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      description: 'Estude no seu ritmo',
    },
    presencial: {
      icon: '🏢',
      label: 'Presencial',
      color: 'bg-orange-500/20 border-orange-500/30 text-orange-300',
      description: 'Aulas presenciais com apoio online',
    },
    hibrido: {
      icon: '🔄',
      label: 'Híbrido',
      color: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      description: 'Online + encontros presenciais',
    },
  };

  const styles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const badge = config[format];

  return (
    <div className={`flex items-center gap-2 ${styles[size]} rounded-lg border ${badge.color} font-semibold`}>
      <span className={size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'}>
        {badge.icon}
      </span>
      <div>
        <div className="font-bold">{badge.label}</div>
        {size === 'lg' && <div className="text-xs opacity-75">{badge.description}</div>}
      </div>
    </div>
  );
};

export default CourseModalityBadge;
