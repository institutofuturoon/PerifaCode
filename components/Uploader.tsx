
import React, { useState, useRef } from 'react';
import { useAppContext } from '../App';

interface UploaderProps {
  pathnamePrefix: string;
  onUploadComplete: (url: string) => void;
  children: (triggerUpload: () => void, isUploading: boolean) => React.ReactNode;
}

const Uploader: React.FC<UploaderProps> = ({ pathnamePrefix, onUploadComplete, children }) => {
  const { showToast } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    try {
      // ✅ SEGURO: Chamar API do servidor ao invés de fazer upload direto
      // O token BLOB_READ_WRITE_TOKEN fica protegido no servidor
      const filename = `${pathnamePrefix}-${Date.now()}-${file.name}`;

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
          'X-Filename': filename,
        },
        body: file,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Falha no upload');
      }

      const data = await response.json();
      onUploadComplete(data.url);
      showToast('✅ Imagem enviada com sucesso!');

    } catch (err: any) {
      console.error(`Erro detalhado no upload:`, err);
      showToast(`❌ Erro ao enviar a imagem: ${err.message}`);
    } finally {
      setIsUploading(false);
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
      {children(triggerUpload, isUploading)}
    </>
  );
};

export default Uploader;
