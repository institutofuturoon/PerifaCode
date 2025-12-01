import React, { useState } from 'react';

const ApiTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{ status: number; body: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blob.generate-client-token',
          payload: {
            pathname: 'api-health-check.txt',
            callbackUrl: '',
            clientPayload: null,
            multipart: false,
          },
        }),
      });

      const body = await res.json();
      setResponse({ status: res.status, body });

    } catch (err: any) {
      console.error("Erro no teste da API:", err);
      setError(`Falha ao executar a requisição: ${err.message}. Verifique o console do navegador para mais detalhes.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isSuccess = response && response.status >= 200 && response.status < 300;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10">
        <h1 className="text-3xl font-bold text-white text-center">Teste de Conectividade da API</h1>
        <p className="text-center text-gray-400 mt-2">Esta ferramenta envia uma chamada POST para <code className="text-xs bg-black/50 px-1 rounded">/api/upload</code> para verificar se ela está respondendo corretamente.</p>

         <div className="mt-4 p-4 bg-sky-900/30 border border-sky-500/50 rounded-lg text-sm text-sky-300">
            <strong>Como funciona?</strong> Este teste simula a primeira etapa que o cliente de upload faz: pedir um token de acesso ao servidor. Uma resposta bem-sucedida (status 200) indica que a rota está ativa e as chaves de API do Vercel Blob no servidor estão configuradas corretamente.
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleTest}
            disabled={isLoading}
            className="w-full sm:w-auto flex justify-center items-center gap-2 mx-auto bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Testando...
              </>
            ) : (
              'Executar Teste'
            )}
          </button>
        </div>
        
        <div className="mt-8 min-h-[200px] bg-black/30 p-4 rounded-md border border-white/10">
             <h2 className="text-lg font-semibold text-white mb-2">Resultado</h2>
             {!response && !error && !isLoading && (
                 <p className="text-gray-500">Aguardando execução do teste...</p>
             )}
             {isLoading && <p className="text-sky-300">Aguardando resposta do servidor...</p>}
             {error && (
                 <div className="text-red-300 bg-red-900/50 p-4 rounded-lg border border-red-500/50">
                    <p className="font-bold mb-2">❌ Erro na Requisição</p>
                    <p className="text-sm break-words">{error}</p>
                 </div>
             )}
             {response && (
                 <div className={`p-4 rounded-md ${isSuccess ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                     <p className="font-bold mb-2">
                        {isSuccess 
                            ? `✅ Sucesso! A API respondeu com status ${response.status}.`
                            : `❌ Falha! A API respondeu com status ${response.status}.`
                        }
                     </p>
                     <p className="text-sm mb-4">
                        {isSuccess 
                            ? "Isso indica que a rota está ativa e configurada corretamente no servidor." 
                            : "Verifique a resposta abaixo para identificar a causa do erro. Causas comuns são chaves de API inválidas ou ausentes no servidor."
                        }
                     </p>
                     <h3 className="text-sm font-semibold text-white mb-1">Corpo da Resposta (JSON):</h3>
                     <pre className="text-xs whitespace-pre-wrap break-words bg-black/20 p-2 rounded-sm mt-2 font-mono">
                         {JSON.stringify(response.body, null, 2)}
                     </pre>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
