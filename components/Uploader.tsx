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
        const pathname = `${pathnamePrefix}-${Date.now()}-${file.name}`;
        
        // --- AVISO DE SEGURANÇA ---
        // A chave abaixo NUNCA deve ser exposta no frontend em produção.
        // Esta é uma configuração APENAS PARA TESTES para bypassar a API.
        const BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_uI73bVafvL0LLaMC_v9NEwyi9BSF1pBmOXbFEamnbWvh3Rc';

        const response = await fetch(
            `https://blob.vercel-storage.com/${pathname}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${BLOB_READ_WRITE_TOKEN}`,
                'x-api-version': '8',
                'Content-Type': file.type,
              },
              body: file,
            },
        );

        const newBlob = await response.json();
        if (!response.ok) {
            throw new Error(`Falha no upload: ${newBlob.error?.message || 'Erro desconhecido do servidor'}`);
        }

        onUploadComplete(newBlob.url);
        // O componente pai será responsável por exibir o toast de sucesso.

    } catch (err: any) {
        console.error(`Erro detalhado no upload:`, err);
        showToast(`❌ Erro ao enviar a imagem: ${err.message}`);
    } finally {
        setIsUploading(false);
        if(fileInputRef.current) {
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
