import { Course } from '../types';

/**
 * Export course to JSON file
 */
export const exportCourseToJSON = (course: Course) => {
    const dataStr = JSON.stringify(course, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${course.slug || course.id}_export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Import course from JSON file
 */
export const importCourseFromJSON = (file: File): Promise<Course> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const course = JSON.parse(content) as Course;
                
                // Validate basic structure
                if (!course.title || !course.modules) {
                    throw new Error('Arquivo JSON inválido: estrutura de curso incompleta');
                }
                
                // Generate new IDs to avoid conflicts
                const newCourse: Course = {
                    ...course,
                    id: `course_${Date.now()}`,
                    slug: course.slug ? `${course.slug}-imported` : undefined,
                    modules: course.modules.map((module, mIndex) => ({
                        ...module,
                        id: `mod_${Date.now()}_${mIndex}`,
                        lessons: module.lessons.map((lesson, lIndex) => ({
                            ...lesson,
                            id: `les_${Date.now()}_${mIndex}_${lIndex}`
                        }))
                    }))
                };
                
                resolve(newCourse);
            } catch (error) {
                reject(new Error(`Erro ao importar curso: ${error instanceof Error ? error.message : 'Formato inválido'}`));
            }
        };
        
        reader.onerror = () => {
            reject(new Error('Erro ao ler arquivo'));
        };
        
        reader.readAsText(file);
    });
};

/**
 * Duplicate course with new IDs
 */
export const duplicateCourse = (course: Course): Course => {
    const timestamp = Date.now();
    return {
        ...course,
        id: `course_${timestamp}`,
        title: `${course.title} (Cópia)`,
        slug: course.slug ? `${course.slug}-copy-${timestamp}` : undefined,
        modules: course.modules.map((module, mIndex) => ({
            ...module,
            id: `mod_${timestamp}_${mIndex}`,
            lessons: module.lessons.map((lesson, lIndex) => ({
                ...lesson,
                id: `les_${timestamp}_${mIndex}_${lIndex}`
            }))
        }))
    };
};

/**
 * Duplicate module with new IDs
 */
export const duplicateModule = (module: any): any => {
    const timestamp = Date.now();
    return {
        ...module,
        id: `mod_${timestamp}`,
        title: `${module.title} (Cópia)`,
        lessons: module.lessons.map((lesson: any, lIndex: number) => ({
            ...lesson,
            id: `les_${timestamp}_${lIndex}`
        }))
    };
};

/**
 * Duplicate lesson with new ID
 */
export const duplicateLesson = (lesson: any): any => {
    return {
        ...lesson,
        id: `les_${Date.now()}`,
        title: `${lesson.title} (Cópia)`
    };
};

/**
 * Validate course structure
 */
export const validateCourse = (course: Course): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!course.title || course.title.trim() === '') {
        errors.push('Título do curso é obrigatório');
    }
    
    if (!course.description || course.description.trim() === '') {
        errors.push('Descrição do curso é obrigatória');
    }
    
    if (!course.track || course.track.trim() === '') {
        errors.push('Trilha do curso é obrigatória');
    }
    
    if (!course.duration || course.duration.trim() === '') {
        errors.push('Duração do curso é obrigatória');
    }
    
    if (!course.instructorId || course.instructorId.trim() === '') {
        errors.push('Instrutor do curso é obrigatório');
    }
    
    if (!course.modules || course.modules.length === 0) {
        errors.push('Curso deve ter pelo menos um módulo');
    } else {
        course.modules.forEach((module, mIndex) => {
            if (!module.title || module.title.trim() === '') {
                errors.push(`Módulo ${mIndex + 1}: Título é obrigatório`);
            }
            
            if (!module.lessons || module.lessons.length === 0) {
                errors.push(`Módulo ${mIndex + 1}: Deve ter pelo menos uma aula`);
            } else {
                module.lessons.forEach((lesson, lIndex) => {
                    if (!lesson.title || lesson.title.trim() === '') {
                        errors.push(`Módulo ${mIndex + 1}, Aula ${lIndex + 1}: Título é obrigatório`);
                    }
                    if (!lesson.duration || lesson.duration.trim() === '') {
                        errors.push(`Módulo ${mIndex + 1}, Aula ${lIndex + 1}: Duração é obrigatória`);
                    }
                });
            }
        });
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
};
