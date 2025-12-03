
import React, { useState, useRef } from 'react';
import { useAppContext } from '../App';

interface UploaderProps {
  pathnamePrefix: string;
  onUploadComplete: (url: string) => void;
  children: (triggerUpload: () => void, isUploading: boolean, uploadProgress: number) => React.ReactNode;
}

const Uploader: React.FC<UploaderProps> = ({ pathnamePrefix, onUploadComplete, children }) => {
  const { showToast } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const triggerUpload = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações no frontend
    if (!file.type.startsWith('image/')) {
      showToast('❌ Por favor, selecione um arquivo de imagem válido.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
      showToast('❌ O arquivo é muito grande. O limite é de 4MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simular progresso de upload para melhor UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // SOLUÇÃO TEMPORÁRIA: Converter para Data URL (base64)
      // Para produção, configure um backend/API para upload seguro
      const reader = new FileReader();
      
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          clearInterval(progressInterval);
          setUploadProgress(100);
          resolve(reader.result as string);
        };
        reader.onerror = (error) => {
          clearInterval(progressInterval);
          reject(error);
        };
        reader.readAsDataURL(file);
      });

      // Pequeno delay para mostrar 100%
      await new Promise(resolve => setTimeout(resolve, 300));

      // Retornar a Data URL como se fosse uma URL de upload
      onUploadComplete(dataUrl);
      showToast('✅ Imagem carregada com sucesso!');

    } catch (err: any) {
      console.error(`Erro detalhado no upload:`, err);
      showToast(`❌ Erro ao carregar a imagem: ${err.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/png, image/jpeg, image/gif, image/webp"
        disabled={isUploading}
      />
      {children(triggerUpload, isUploading, uploadProgress)}
    </>
  );
};

export default Uploader;
