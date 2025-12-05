
import React, { useState, useRef } from 'react';
import { useAppContext } from '../App';
// @ts-ignore
import { upload } from '@vercel/blob/client';

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
      // Criar nome único para o arquivo
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${pathnamePrefix}/${timestamp}_${sanitizedName}`;

      // Simular progresso para melhor UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      try {
        // Tentar upload para Vercel Blob
        const blob = await upload(fileName, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });

        clearInterval(progressInterval);
        setUploadProgress(100);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        onUploadComplete(blob.url);
        showToast('✅ Imagem carregada com sucesso!');
        
      } catch (uploadError: any) {
        clearInterval(progressInterval);
        
        // Se falhar, mostrar mensagem amigável
        console.warn('Upload para Vercel Blob falhou, use URLs em desenvolvimento:', uploadError);
        showToast('⚠️ Upload indisponível em desenvolvimento. Cole uma URL de imagem nos campos abaixo.');
        
        // Limpar o input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }

    } catch (err: any) {
      console.error(`Erro detalhado no upload:`, err);
      showToast(`❌ Erro ao processar imagem`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
