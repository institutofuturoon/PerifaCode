import React, { useState } from 'react';
import Uploader from '../components/Uploader';

const UploadTest: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const [isApiTesting, setIsApiTesting] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);
  const [apiTestSuccess, setApiTestSuccess] = useState<boolean | null>(null);

  const handleUploadComplete = (url: string) => {
    setUploadedUrl(url);
    setError(null); // Clear previous errors on success
  };
  
  const handleApiTest = async () => {
    setIsApiTesting(true);
    setApiTestResult(null);
    setApiTestSuccess(null);
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'blob.generate-client-token',
                payload: {
                    pathname: 'health-check-test.txt',
                    callbackUrl: '',
                    clientPayload: null,
                    multipart: false,
                },
            }),
        });
        
        const responseBody = await response.json();

        const resultText = `Status: ${response.status}\n\nCorpo da Resposta:\n${JSON.stringify(responseBody, null, 2)}`;
        setApiTestResult(resultText);

        if (response.ok) {
            setApiTestSuccess(true);
        } else {
            setApiTestSuccess(false);
        }

    } catch (error: any) {
        console.error("API Test Error:", error);
        setApiTestResult(`Falha na requisição fetch:\n\n${error.toString()}`);
        setApiTestSuccess(false);
    } finally {
        setIsApiTesting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10">
        <h1 className="text-3xl font-bold text-white text-center">Página de Teste de Upload</h1>
        <p className="text-center text-gray-400 mt-2">Use esta página para testar o upload de arquivos e diagnosticar a saúde da API.</p>

        <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg text-sm text-yellow-300">
            <strong>⚠️ MODO DE TESTE ATIVADO:</strong> Esta página agora usa um token de API diretamente no código. Isso é inseguro e serve apenas para depuração local. Não use em produção.
        </div>

        <div className="mt-8 space-y-6">
          <Uploader
            pathnamePrefix="test-uploads"
            onUploadComplete={handleUploadComplete}
          >
            {(triggerUpload, isUploading) => (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">1. Clique para selecionar e enviar</label>
                <button
                  onClick={() => {
                    setUploadedUrl(null);
                    setError(null);
                    triggerUpload();
                  }}
                  disabled={isUploading}
                  className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Enviando...
                    </>
                  ) : (
                    'Selecionar e Fazer Upload (Modo Direto)'
                  )}
                </button>
              </div>
            )}
          </Uploader>

          <div className="min-h-[150px] bg-black/30 p-4 rounded-md border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-2">2. Resultado do Upload</h2>
            {error && (
                <div className="text-red-300 bg-red-900/50 p-4 rounded-lg border border-red-500/50">
                    <p className="font-bold mb-2">Ops! Algo deu errado.</p>
                    <p className="text-sm break-words">{error}</p>
                </div>
            )}
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
            {!error && !uploadedUrl && <p className="text-gray-500 text-sm">O resultado do upload aparecerá aqui.</p>}
          </div>
        </div>

        {/* API Health Check Section */}
        <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
            <h2 className="text-2xl font-bold text-white text-center">Diagnóstico da API (/api/upload)</h2>
            <p className="text-center text-sm text-gray-400">Este teste verifica a rota de backend padrão, que é o método recomendado para produção.</p>
            <button
                onClick={handleApiTest}
                disabled={isApiTesting}
                className="w-full flex justify-center items-center gap-2 bg-white/10 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
            >
                {isApiTesting ? 'Testando...' : 'Testar Conexão com API'}
            </button>
            <div className="min-h-[150px] bg-black/30 p-4 rounded-md border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Resultado do Teste da API</h3>
                {isApiTesting && <p className="text-sky-300">Aguardando resposta do servidor...</p>}
                {apiTestResult && (
                     <div className={`p-4 rounded-md ${apiTestSuccess ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                        <p className="font-bold mb-2">
                            {apiTestSuccess 
                                ? '✅ Sucesso! A API está configurada corretamente e pronta para receber uploads.' 
                                : '❌ Falha na conexão! Verifique a saída abaixo para detalhes.'}
                        </p>
                        <pre className="text-xs whitespace-pre-wrap break-words bg-black/20 p-2 rounded-sm mt-2 font-mono">
                            {apiTestResult}
                        </pre>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default UploadTest;
