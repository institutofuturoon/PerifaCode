
import React, { useState, useMemo } from 'react';
import { Course } from '../types';
import { MOCK_ANALYTICS_DATA_V2 as MOCK_ANALYTICS_DATA } from '../constants';
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
    const performanceData = MOCK_ANALYTICS_DATA.lessonPerformance[course.id as keyof typeof MOCK_ANALYTICS_DATA.lessonPerformance];
    if (!performanceData) {
        return <div className="text-center text-gray-400">Dados de desempenho para este curso não encontrados.</div>;
    }

    const maxStudents = performanceData[0]?.studentsCompleted || 1;

    return (
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 h-full">
            <h3 className="text-xl font-bold text-white mb-1">Funil de Conclusão de Aulas</h3>
            <p className="text-sm text-gray-400 mb-6 line-clamp-1" title={course.title}>{course.title}</p>
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                {performanceData.map((lesson, index) => {
                    const retentionPercentage = (lesson.studentsCompleted / maxStudents) * 100;
                    const dropOffFromPrevious = index > 0 
                        ? ((performanceData[index-1].studentsCompleted - lesson.studentsCompleted) / performanceData[index-1].studentsCompleted) * 100
                        : 0;

                    return (
                        <div key={lesson.lessonId} className="group">
                             <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                                <span className="truncate w-2/3" title={lesson.title}>{index + 1}. {lesson.title}</span>
                                <span className="font-semibold">{lesson.studentsCompleted.toLocaleString('pt-BR')} alunos</span>
                            </div>
                            <div className="w-full bg-black/30 rounded-full h-5 border border-white/10 relative">
                                <div
                                className="bg-gradient-to-r from-blue-600 to-sky-500 h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${retentionPercentage}%` }}
                                ></div>
                            </div>
                            {index > 0 && (
                                <p className="text-right text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    - {dropOffFromPrevious.toFixed(1)}% de evasão
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const StudentRetentionChart: React.FC<{data: typeof MOCK_ANALYTICS_DATA.studentRetention}> = ({ data }) => {
    const width = 500;
    const height = 250;
    const padding = 20;

    const points = data.dailyData.map((value, index) => {
        const x = (index / (data.dailyData.length - 1)) * (width - 2 * padding) + padding;
        const y = height - ((value / 100) * (height - 2 * padding)) - padding;
        return `${x},${y}`;
    }).join(' ');

    const areaPath = `M${points} L${width - padding},${height - padding} L${padding},${height - padding} Z`;

    const trendColor = data.trend >= 0 ? 'text-green-400' : 'text-red-400';

    return (
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 h-full">
            <h3 className="text-xl font-bold text-white">Retenção de Alunos (Últimos 30 dias)</h3>
            <p className="text-sm text-gray-400 mb-4">Porcentagem de alunos que retornaram à plataforma a cada dia.</p>
            <div className="flex items-baseline gap-6 mb-4">
                <div>
                    <p className="text-sm text-gray-400">Média de Retenção</p>
                    <p className="text-4xl font-bold text-white">{data.average.toFixed(1)}%</p>
                </div>
                <div>
                     <p className="text-sm text-gray-400">Tendência</p>
                    <p className={`text-lg font-semibold ${trendColor}`}>
                        {data.trend >= 0 ? '+' : ''}{data.trend.toFixed(1)}%
                        <span className="text-xs text-gray-500"> vs. 30d anteriores</span>
                    </p>
                </div>
            </div>
            <div className="w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                    <defs>
                        <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#retentionGradient)" />
                    <polyline fill="none" stroke="#60a5fa" strokeWidth="2" points={points} />
                </svg>
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
            const performance = MOCK_ANALYTICS_DATA.coursePerformance.find(p => p.courseId === course.id);
            return {
                ...course,
                enrolled: performance?.enrolled || 0,
                completionRate: performance?.completionRate || 0,
                avgTime: performance?.avgTime || 0,
                satisfaction: performance?.satisfaction || 0,
                dropOffRate: performance?.dropOffRate || 0,
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
        <StatCard title="Total de Alunos" value={MOCK_ANALYTICS_DATA.totalStudents.toLocaleString('pt-BR')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard title="Novos Alunos (30d)" value={`+${MOCK_ANALYTICS_DATA.newStudentsLast30d}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>} />
        <StatCard title="Taxa de Conclusão Média" value={`${MOCK_ANALYTICS_DATA.avgCompletionRate}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Engajamento Semanal" value={`${MOCK_ANALYTICS_DATA.weeklyEngagement}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
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
                <StudentRetentionChart data={MOCK_ANALYTICS_DATA.studentRetention} />
            </div>
            <div className="lg:col-span-1 space-y-8 flex flex-col">
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 flex-1">
                    <h3 className="text-xl font-bold text-white mb-4">🏆 Top Alunos (Mais XP)</h3>
                    <ul className="space-y-3">
                        {MOCK_ANALYTICS_DATA.studentEngagement.topStudents.map(student => (
                            <li key={student.id} className="flex items-center justify-between bg-black/20 p-3 rounded-md">
                                <div className="flex items-center gap-3">
                                    <img src={student.avatarUrl} alt={student.name} className="h-8 w-8 rounded-full" />
                                    <span className="text-sm font-medium text-white">{student.name}</span>
                                </div>
                                <span className="text-sm font-bold text-blue-300">{student.xp.toLocaleString('pt-BR')} XP</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 flex-1">
                    <h3 className="text-xl font-bold text-white mb-4">🚨 Alunos em Risco (Inativos)</h3>
                    <ul className="space-y-3">
                        {MOCK_ANALYTICS_DATA.studentEngagement.atRiskStudents.map(student => (
                            <li key={student.id} className="flex items-center justify-between bg-black/20 p-3 rounded-md">
                                <div className="flex items-center gap-3">
                                    <img src={student.avatarUrl} alt={student.name} className="h-8 w-8 rounded-full opacity-60" />
                                    <span className="text-sm font-medium text-gray-300">{student.name}</span>
                                </div>
                                <span className="text-sm text-red-400">Visto há {student.lastLoginDaysAgo} dias</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Analytics;