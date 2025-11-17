import React, { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, Module, Lesson } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { useAppContext } from '../App';
import RichContentEditor from '../components/RichContentEditor';

type SelectedItem = 
  | { type: 'course' }
  | { type: 'module'; moduleIndex: number }
  | { type: 'lesson'; moduleIndex: number; lessonIndex: number };

type AiAction = 'create' | 'improve' | 'summarize' | 'create_code';


const CourseEditor: React.FC = () => {
  const { user, instructors, courses, handleSaveCourse, showToast } = useAppContext();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const initialCourse = useMemo(() => {
    if (courseId && courseId !== 'new') {
        return courses.find(c => c.id === courseId);
    }
    return {
        id: `course_${Date.now()}`,
        title: '', description: '', longDescription: '',
        track: 'Frontend' as Course['track'], imageUrl: '', duration: '',
        skillLevel: 'Iniciante' as Course['skillLevel'], instructorId: user?.id || '',
        modules: [], format: 'online' as Course['format']
    };
  }, [courseId, courses, user]);
  
  const [course, setCourse] = useState<Course>(initialCourse || {
    id: `course_${Date.now()}`, title: '', description: '', longDescription: '',
    // FIX: Explicitly cast properties to match the 'Course' type to resolve type error.
    track: 'Frontend' as Course['track'], imageUrl: '', duration: '', skillLevel: 'Iniciante' as Course['skillLevel'],
    instructorId: user?.id || '', modules: [], format: 'online' as Course['format']
  });
  
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({ type: 'course' });
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingStructure, setIsGeneratingStructure] = useState(false);
  const [isAiAssistantLoading, setIsAiAssistantLoading] = useState(false);
  const [aiAction, setAiAction] = useState<AiAction>('create');
  const [aiCommand, setAiCommand] = useState('');
  
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  // Refs for the rich text editors
  const objectiveRef = useRef<HTMLTextAreaElement>(null);
  const mainContentRef = useRef<HTMLTextAreaElement>(null);
  const complementaryMaterialRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  const onCancel = () => navigate('/admin');
  
  if (!initialCourse) {
      return <div className="text-center py-20">Curso não encontrado.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveCourse(course);
    navigate('/admin');
  };

  // NOTE: The original file content was truncated. A placeholder UI is rendered.
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl">Course Editor</h1>
      <p>Placeholder for course editor UI.</p>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
};

// FIX: Add default export to resolve import error in App.tsx.
export default CourseEditor;
