import { Course } from '../types';

/**
 * Hybrid storage service: Tries Firebase first, falls back to JSON file
 */

const COURSES_JSON_FILE = 'public/courses.json';

// Load courses from localStorage (for development/fallback)
export const loadCoursesFromLocalStorage = (): Course[] => {
  try {
    const stored = localStorage.getItem('courses');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load courses from localStorage:', error);
    return [];
  }
};

// Save courses to localStorage (for development/fallback)
export const saveCoursesToLocalStorage = (courses: Course[]): void => {
  try {
    localStorage.setItem('courses', JSON.stringify(courses, null, 2));
  } catch (error) {
    console.error('Failed to save courses to localStorage:', error);
  }
};

// Download courses as JSON file
export const downloadCoursesAsJSON = (courses: Course[]): void => {
  try {
    const dataStr = JSON.stringify(courses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `courses_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download courses as JSON:', error);
  }
};

// Upload courses from JSON file
export const uploadCoursesFromJSON = (file: File): Promise<Course[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const courses = JSON.parse(event.target?.result as string);
        if (Array.isArray(courses)) {
          resolve(courses);
        } else {
          reject(new Error('File must contain a JSON array of courses'));
        }
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Get courses from public JSON file (if it exists)
export const fetchCoursesFromJSON = async (): Promise<Course[]> => {
  try {
    const response = await fetch('/courses.json');
    if (!response.ok) {
      console.warn('courses.json not found, using localStorage fallback');
      return loadCoursesFromLocalStorage();
    }
    const courses = await response.json();
    return Array.isArray(courses) ? courses : [];
  } catch (error) {
    console.warn('Failed to fetch courses.json, using localStorage fallback:', error);
    return loadCoursesFromLocalStorage();
  }
};
