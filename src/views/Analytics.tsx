
import React, { useState, useMemo } from 'react';
import { Course } from '../types';
import { useAppContext } from '../App';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

const LessonFunnelChart: React.FC<{ course: Course }> = ({ course }) => {
    return (
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 h-full">
            <h3 className="text-xl font-bold text-white mb-1">Funil de Conclusão de Aulas</h3>
            <p className="text-sm text-gray-400 mb-6 line-clamp-1" title={course.title}>{course.title}</p>
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-gray-400 mb-2">📊 Analytics em desenvolvimento</p>
                    <p className="text-sm text-gray-500">Em breve: funil de conclusão por aula</p>
                </div>
            </div>
        </div>
    );
};

const StudentRetentionChart: React.FC = () => {
    return (
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 h-full">
            <h3 className="text-xl font-bold text-white">Retenção de Alunos (Últimos 30 dias)</h3>
            <p className="text-sm text-gray-400 mb-4">Porcentagem de alunos que retornaram à plataforma a cada dia.</p>
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-gray-400 mb-2">📈 Analytics em desenvolvimento</p>
                    <p className="text-sm text-gray-500">Em breve: gráfico de retenção em tempo real</p>
                </div>
            </div>
        </div>
    );
}


type SortKey = 'title' | 'enrolled' | 'completionRate' | 'avgTime' | 'satisfaction' | 'dropOffRate';
type SortDirection = 'ascending' | 'descending';

const Analytics: React.FC = () => {
    const { courses } = useAppContext();
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'enrolled', direction: 'descending' });
    const [selectedCourseForFunnel, setSelectedCourseForFunnel] = useState<Course | null>(courses[0] || null);

    const courseData = useMemo(() => {
        return courses.map(course => {
            // Real analytics will be calculated from actual user data
            return {
                ...course,
                enrolled: 0,
                completionRate: 0,
                avgTime: 0,
                satisfaction: 0,
                dropOffRate: 0,
            };
        });
    }, [courses]);
    
    const sortedCourses = useMemo(() => {
        let sortableItems = [...courseData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [courseData, sortConfig]);

    const requestSort = (key: SortKey) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: SortKey) => {
        if (!sortConfig || sortConfig.key !== key) return '↕';
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
    };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white">Painel de Analytics</h1>
        <p className="mt-2 text-lg text-gray-400">Insights para otimizar o aprendizado e crescimento da plataforma.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total de Alunos" value="--" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard title="Novos Alunos (30d)" value="--" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>} />
        <StatCard title="Taxa de Conclusão Média" value="--" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Engajamento Semanal" value="--" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
      </div>

       <div className="grid lg:grid-cols-5 gap-8 mb-12">
        <div className="lg:col-span-3">
             <h2 className="text-2xl font-bold text-white mb-6">Desempenho dos Cursos</h2>
            <div className="bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                    <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        <button onClick={() => requestSort('title')} className="flex items-center gap-2">Curso <span className="text-gray-500">{getSortIndicator('title')}</span></button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        <button onClick={() => requestSort('enrolled')} className="flex items-center gap-2">Alunos <span className="text-gray-500">{getSortIndicator('enrolled')}</span></button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        <button onClick={() => requestSort('completionRate')} className="flex items-center gap-2">Conclusão <span className="text-gray-500">{getSortIndicator('completionRate')}</span></button>
                    </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        <button onClick={() => requestSort('satisfaction')} className="flex items-center gap-2">Avaliação <span className="text-gray-500">{getSortIndicator('satisfaction')}</span></button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        <button onClick={() => requestSort('dropOffRate')} className="flex items-center gap-2">Evasão <span className="text-gray-500">{getSortIndicator('dropOffRate')}</span></button>
                    </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {sortedCourses.map((course) => (
                    <tr key={course.id} onClick={() => setSelectedCourseForFunnel(course)} className="hover:bg-blue-500/10 transition-colors cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-white">{course.title}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.enrolled.toLocaleString('pt-BR')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.completionRate}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.satisfaction.toFixed(1)} ⭐</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">{course.dropOffRate}%</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
        <div className="lg:col-span-2">
            {selectedCourseForFunnel ? (
                <LessonFunnelChart course={selectedCourseForFunnel} />
            ) : (
                <div className="bg-white/5 h-full flex items-center justify-center rounded-lg border border-white/10"><p className="text-gray-400">Selecione um curso para ver o funil</p></div>
            )}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Insights dos Alunos</h2>
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <StudentRetentionChart />
            </div>
            <div className="lg:col-span-1 space-y-8 flex flex-col">
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 flex-1">
                    <h3 className="text-xl font-bold text-white mb-4">🏆 Top Alunos (Mais XP)</h3>
                    <div className="flex items-center justify-center h-32">
                        <p className="text-sm text-gray-500">Ranking em desenvolvimento</p>
                    </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 flex-1">
                    <h3 className="text-xl font-bold text-white mb-4">🚨 Alunos em Risco (Inativos)</h3>
                    <div className="flex items-center justify-center h-32">
                        <p className="text-sm text-gray-500">Detecção de risco em desenvolvimento</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
