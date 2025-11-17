import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import ProjectCard from '../components/ProjectCard';
import { Project, CommunityPost } from '../types';
import ForumPostCard from '../components/ForumPostCard';

type ActiveTab = 'projects' | 'forum';

const CommunityView: React.FC = () => {
    const { projects, communityPosts, user } = useAppContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ActiveTab>('projects');
    const [activeFilter, setActiveFilter] = useState<string>('Todos');

    const allProjectTechs = useMemo(() => {
        const techSet = new Set<string>();
        projects.forEach(project => {
            project.technologies.forEach(tech => techSet.add(tech));
        });
        return ['Todos', ...Array.from(techSet).sort()];
    }, [projects]);

    const allForumTags = useMemo(() => {
        const tagSet = new Set<string>();
        communityPosts.forEach(post => {
            post.tags.forEach(tag => tagSet.add(tag));
        });
        return ['Todos', ...Array.from(tagSet).sort()];
    }, [communityPosts]);

    const filteredProjects = useMemo(() => {
        if (activeFilter === 'Todos') {
            return projects;
        }
        return projects.filter(project => project.technologies.includes(activeFilter));
    }, [projects, activeFilter]);

     const filteredPosts = useMemo(() => {
        if (activeFilter === 'Todos') {
            return communityPosts;
        }
        return communityPosts.filter(post => post.tags.includes(activeFilter));
    }, [communityPosts, activeFilter]);
    
    const handleProjectSelect = (project: Project) => {
        navigate(`/project/${project.id}`);
    };

    const handlePostSelect = (post: CommunityPost) => {
        navigate(`/community/post/${post.id}`);
    };
    
    const handleNavigateToProjectEditor = () => {
        navigate('/project/edit');
    };

    const handleNavigateToPostEditor = () => {
        navigate('/community/post/new');
    }

    const filters = activeTab === 'projects' ? allProjectTechs : allForumTags;

    const TabButton: React.FC<{ tab: ActiveTab; label: string }> = ({ tab, label }) => (
        <button
            onClick={() => { setActiveTab(tab); setActiveFilter('Todos'); }}
            className={`px-6 py-3 text-lg font-bold rounded-t-lg transition-colors ${
                activeTab === tab 
                ? 'bg-white/5 text-white border-b-2 border-purple-500' 
                : 'text-gray-400 hover:text-white'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
                <div className="text-center sm:text-left">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#c4b5fd]">Nossa Comunidade</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-gray-300">
                        Exiba seus projetos, tire dúvidas e aprenda com outros devs. Este é o nosso espaço de colaboração.
                    </p>
                </div>
                {user && (
                    <button
                        onClick={activeTab === 'projects' ? handleNavigateToProjectEditor : handleNavigateToPostEditor}
                        className="mt-6 sm:mt-0 w-full sm:w-auto flex-shrink-0 bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#8a4add]/30"
                    >
                        {activeTab === 'projects' ? 'Submeter Projeto' : 'Criar Post'}
                    </button>
                )}
            </div>
            
            <div className="border-b border-white/10 mb-8">
                <TabButton tab="projects" label="Showcase de Projetos" />
                <TabButton tab="forum" label="Fórum de Dúvidas" />
            </div>

            {/* Filters Section */}
            <div className="mb-12 flex justify-center flex-wrap gap-2 sm:gap-3">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${
                        activeFilter === filter
                            ? 'bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white shadow-md shadow-[#8a4add]/20'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {activeTab === 'projects' && (
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
            )}
            
            {activeTab === 'forum' && (
                 <div className="space-y-6 max-w-4xl mx-auto">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                           <ForumPostCard key={post.id} post={post} onPostSelect={handlePostSelect} />
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">Nenhum post encontrado com a tag <span className="font-bold text-white">{activeFilter}</span>.</p>
                             <button onClick={() => setActiveFilter('Todos')} className="mt-4 text-[#c4b5fd] font-semibold hover:underline">
                                Ver todos os posts
                            </button>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default CommunityView;
