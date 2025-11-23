import React, { useRef } from 'react';
import { Course } from '../types';
import { useAppContext } from '../App';

const CourseJSONManager: React.FC = () => {
  const { courses, showToast } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadCoursesAsJSON = () => {
    try {
      const dataStr = JSON.stringify(courses, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cursos_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`✅ ${courses.length} cursos baixados!`);
    } catch (error) {
      console.error('Erro ao baixar JSON:', error);
      showToast('❌ Erro ao baixar');
    }
  };

  const getLocalCoursesFromStorage = (): Course[] => {
    try {
      const stored = localStorage.getItem('courses');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  };

  const handleUploadJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (Array.isArray(data)) {
        localStorage.setItem('courses', JSON.stringify(data));
        showToast(`✅ ${data.length} cursos carregados do JSON!`);
      } else {
        showToast('❌ Arquivo deve conter um array de cursos');
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      showToast('❌ Erro ao fazer upload do arquivo');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadLocalStorageJSON = () => {
    try {
      const localCourses = getLocalCoursesFromStorage();
      const dataStr = JSON.stringify(localCourses, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cursos_locais_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`✅ ${localCourses.length} cursos locais baixados!`);
    } catch (error) {
      console.error('Erro ao baixar localStorage:', error);
      showToast('❌ Erro ao baixar');
    }
  };

  const localCourses = getLocalCoursesFromStorage();
  const fallbackTimestamp = localStorage.getItem('courses_fallback_timestamp');

  return (
    <div className="bg-white/5 border border-white/20 rounded-lg p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="text-yellow-400 text-xl">⚙️</div>
        <div>
          <h3 className="text-white font-semibold mb-2">Backup & Recuperação de Cursos (JSON)</h3>
          <p className="text-xs text-gray-400 mb-4">
            Faça backup dos seus cursos em JSON ou restaure a partir de um arquivo anteriormente salvo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Download Firebase Courses */}
        <button
          onClick={downloadCoursesAsJSON}
          className="flex items-center justify-between p-3 bg-[#8a4add]/10 border border-[#8a4add]/30 rounded hover:bg-[#8a4add]/20 transition-colors"
        >
          <span className="text-sm font-medium text-[#c4b5fd]">📥 Baixar Cursos Firebase</span>
          <span className="text-xs bg-[#8a4add]/30 px-2 py-1 rounded text-[#c4b5fd]">{courses.length}</span>
        </button>

        {/* Upload JSON */}
        <label className="flex items-center justify-between p-3 bg-[#f27983]/10 border border-[#f27983]/30 rounded hover:bg-[#f27983]/20 transition-colors cursor-pointer">
          <span className="text-sm font-medium text-[#fca5b0]">📤 Carregar de JSON</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleUploadJSON}
            className="hidden"
          />
        </label>
      </div>

      {/* Local Storage Fallback Info */}
      {localCourses.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-3 space-y-2">
          <p className="text-xs text-yellow-200 font-semibold">💾 Cursos Salvos Localmente (Modo Offline)</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-yellow-100">
              {localCourses.length} curso{localCourses.length !== 1 ? 's' : ''}
              {fallbackTimestamp && ` • ${new Date(fallbackTimestamp).toLocaleString('pt-BR')}`}
            </span>
            <button
              onClick={downloadLocalStorageJSON}
              className="text-xs px-2 py-1 bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-200 rounded transition-colors"
            >
              Baixar
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 border-t border-white/10 pt-3">
        ℹ️ Quando o Firebase não estiver disponível, os cursos são salvos automaticamente localmente e você pode restaurá-los aqui.
      </p>
    </div>
  );
};

export default CourseJSONManager;
