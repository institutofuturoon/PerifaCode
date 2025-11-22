/**
 * ImageUpload Component - Reutilizável para upload de imagens
 * Features:
 * - Drag & drop
 * - Progress bar
 * - Validação client-side
 * - Compressão
 * - Retry automático
 */

import React, { useState, useRef, useCallback } from 'react';
import { uploadService } from '../services/uploadService';
import { useAppContext } from '../App';

interface ImageUploadProps {
  onUploadComplete?: (metadata: any) => void;
  onError?: (error: string) => void;
  context: 'profile' | 'course' | 'project' | 'community' | 'article';
  maxSize?: number;
  className?: string;
  showPreview?: boolean;
  multiple?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  onError,
  context,
  maxSize,
  className = '',
  showPreview = true,
  multiple = false,
}) => {
  const { user, showToast } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  if (!user?.id) {
    return (
      <div className="p-4 text-center text-gray-500">
        Faça login para fazer upload de imagens
      </div>
    );
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    try {
      setIsUploading(true);
      setProgress(0);

      // Gerar preview
      if (showPreview) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }

      // Upload
      const metadata = await uploadService.uploadImage(
        file,
        {
          userId: user.id,
          context,
          maxSize,
          onProgress: (p) => setProgress(Math.round(p)),
        }
      );

      setUploadedFiles([...uploadedFiles, metadata]);
      showToast(`✅ ${file.name} enviado com sucesso!`);
      onUploadComplete?.(metadata);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no upload';
      showToast(`❌ ${errorMessage}`);
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );

    if (files.length === 0) {
      onError?.('Nenhuma imagem detectada');
      return;
    }

    const filesToProcess = multiple ? files : [files[0]];
    for (const file of filesToProcess) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || []);

    if (files.length === 0) return;

    const filesToProcess = multiple ? files : [files[0]];
    for (const file of filesToProcess) {
      await processFile(file);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center
          transition-all cursor-pointer
          ${isDragging
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-center w-full"
          disabled={isUploading}
        >
          <div className="text-4xl mb-2">📸</div>
          <p className="font-medium text-gray-700">
            {isUploading
              ? `Enviando... ${progress}%`
              : 'Arraste aqui ou clique para selecionar'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Máximo: {maxSize ? `${Math.round((maxSize / 1024 / 1024))}MB` : '4MB'}
          </p>
        </button>

        {/* Progress Bar */}
        {isUploading && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Preview */}
      {showPreview && preview && (
        <div className="flex gap-4">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-purple-200">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-sm text-gray-600">Preview da imagem</p>
            <p className="text-xs text-gray-500 mt-1">
              A imagem será otimizada automaticamente
            </p>
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-3">
            ✅ {uploadedFiles.length} arquivo(s) enviado(s)
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-green-700">
                    {(file.fileSize / 1024).toFixed(0)} KB
                    {file.dimensions && ` • ${file.dimensions.width}×${file.dimensions.height}px`}
                  </p>
                </div>
                <a
                  href={file.blobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:text-green-700 underline"
                >
                  Ver
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
