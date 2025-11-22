/**
 * Página de Teste - Image Upload
 * Demonstra como usar o componente ImageUpload em diferentes contextos
 */

import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import { useAppContext } from '../App';

const ImageUploadTest: React.FC = () => {
  const { user } = useAppContext();
  const [selectedContext, setSelectedContext] = useState<
    'profile' | 'course' | 'project' | 'community' | 'article'
  >('profile');
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [error, setError] = useState<string>('');

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Faça login para testar upload de imagens</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🖼️ Teste de Upload de Imagens
          </h1>
          <p className="text-gray-600 mt-2">
            Testar a integração com Vercel Blob e Firebase
          </p>
        </div>

        {/* Context Selector */}
        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Contexto do Upload</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {(['profile', 'course', 'project', 'community', 'article'] as const).map(
              (ctx) => (
                <button
                  key={ctx}
                  onClick={() => setSelectedContext(ctx)}
                  className={`
                    p-3 rounded-lg font-medium transition-all
                    ${
                      selectedContext === ctx
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {ctx === 'profile' && '👤'}
                  {ctx === 'course' && '📚'}
                  {ctx === 'project' && '🎯'}
                  {ctx === 'community' && '💬'}
                  {ctx === 'article' && '📝'}
                  <span className="ml-1 hidden md:inline">{ctx}</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Upload Component */}
        <div className="p-6 bg-white rounded-lg border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold mb-4">Upload de Imagem</h2>
          <ImageUpload
            context={selectedContext}
            onUploadComplete={(metadata) => {
              setUploadedImage(metadata);
              setError('');
            }}
            onError={(errorMsg) => {
              setError(errorMsg);
              setUploadedImage(null);
            }}
            showPreview={true}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-8">
            <p className="text-red-800 font-medium">❌ Erro</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Uploaded Image Info */}
        {uploadedImage && (
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <h2 className="text-lg font-semibold text-green-900 mb-4">
              ✅ Upload Realizado com Sucesso!
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-green-700 font-medium">URL Pública:</p>
                <a
                  href={uploadedImage.blobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 break-all text-sm"
                >
                  {uploadedImage.blobUrl}
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-green-700 font-medium">Nome:</p>
                  <p className="text-sm text-green-800">{uploadedImage.originalName}</p>
                </div>

                <div>
                  <p className="text-sm text-green-700 font-medium">Tamanho:</p>
                  <p className="text-sm text-green-800">
                    {(uploadedImage.fileSize / 1024).toFixed(0)} KB
                  </p>
                </div>

                {uploadedImage.dimensions && (
                  <>
                    <div>
                      <p className="text-sm text-green-700 font-medium">Dimensões:</p>
                      <p className="text-sm text-green-800">
                        {uploadedImage.dimensions.width}×{uploadedImage.dimensions.height}px
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-green-700 font-medium">Contexto:</p>
                      <p className="text-sm text-green-800">{uploadedImage.context}</p>
                    </div>
                  </>
                )}

                <div>
                  <p className="text-sm text-green-700 font-medium">Tipo MIME:</p>
                  <p className="text-sm text-green-800">{uploadedImage.mimeType}</p>
                </div>

                <div>
                  <p className="text-sm text-green-700 font-medium">Upload ID:</p>
                  <p className="text-sm text-green-800 font-mono text-xs break-all">
                    {uploadedImage.id}
                  </p>
                </div>
              </div>

              {/* Imagem Preview */}
              {uploadedImage.blobUrl && (
                <div className="mt-4">
                  <p className="text-sm text-green-700 font-medium mb-2">Preview:</p>
                  <div className="relative w-full max-w-sm h-64 rounded-lg overflow-hidden border-2 border-green-300">
                    <img
                      src={uploadedImage.blobUrl}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">ℹ️ Informações</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✅ Tipos permitidos: JPEG, PNG, GIF, WebP</li>
            <li>✅ Tamanho máximo: 4MB</li>
            <li>✅ Imagens são automaticamente otimizadas</li>
            <li>✅ Metadata salva no Firestore</li>
            <li>✅ Retry automático em caso de falha</li>
            <li>✅ Suporte a drag & drop</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadTest;
