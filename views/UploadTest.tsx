import React, { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';

const UploadTest: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        setError(null);
        setUploadedUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo primeiro.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadedUrl(null);

    try {
      const pathname = file.name;
      
      const clientTokenResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-client-token',
          payload: { pathname },
        }),
      });

      if (!clientTokenResponse.ok) {
        const errorBody = await clientTokenResponse.json();
        throw new Error(errorBody.error || 'Failed to get upload token');
      }
      
      const clientToken = await clientTokenResponse.text();

      const newBlob = await upload(pathname, file, {
        access: 'public',
        clientToken,
      });

      setUploadedUrl(newBlob.url);
    } catch (err: any) {
      console.error('Erro detalhado no upload:', err);
      const message = err.message || 'Ocorreu um erro desconhecido.';
      setError(`Falha no upload: ${message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10">
        <h1 className="text-3xl font-bold text-white text-center">Página de Teste de Upload</h1>
        <p className="text-center text-gray-400 mt-2">Use esta página para testar o upload de arquivos para o Vercel Blob.</p>

        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">1. Selecione um arquivo de imagem</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8a4add]/20 file:text-[#c4b5fd] hover:file:bg-[#8a4add]/30"
            />
            {file && <p className="text-xs text-gray-500 mt-2">Arquivo selecionado: {file.name}</p>}
          </div>

          <div>
            <button
              onClick={handleUpload}
              disabled={isUploading || !file}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Enviando...
                </>
              ) : (
                '2. Fazer Upload'
              )}
            </button>
          </div>

          <div className="min-h-[150px] bg-black/30 p-4 rounded-md border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-2">3. Resultado</h2>
            {isUploading && <p className="text-sky-300">Carregando, por favor aguarde...</p>}
            {error && <div className="text-red-400 bg-red-500/10 p-3 rounded-md break-words"><p className="font-bold">Erro:</p><p>{error}</p></div>}
            {uploadedUrl && (
              <div className="space-y-4">
                <p className="text-green-400 font-semibold">Upload concluído com sucesso!</p>
                <div>
                  <p className="text-sm text-gray-400">URL da Imagem:</p>
                  <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#c4b5fd] break-all hover:underline">{uploadedUrl}</a>
                </div>
                <img src={uploadedUrl} alt="Preview do Upload" className="mt-4 max-w-full h-auto rounded-md border border-white/20"/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTest;