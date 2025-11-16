import { handleUpload, type HandleUploadBody } from '@vercel/blob/server';

export const runtime = 'edge';

export async function POST(request: Request): Promise<Response> {
  // Envolver todo o corpo da função em um bloco try...catch para garantir
  // que qualquer erro, incluindo falhas de parsing do JSON, retorne uma resposta JSON.
  try {
    const body = (await request.json()) as HandleUploadBody;

    // A lógica de verificação para ambiente de desenvolvimento local e
    // o tratamento do upload permanecem os mesmos.
    if (body.type === 'blob.generate-client-token') {
      const host = request.headers.get('host');
      const isLocalDev = host?.includes('localhost') || host?.includes('127.0.0.1');

      if (isLocalDev && !process.env.VERCEL_BLOB_CALLBACK_URL && !process.env.VERCEL_URL) {
        return new Response(
          JSON.stringify({ error: `[ERRO DE AMBIENTE LOCAL] A API está em 'localhost'. Para que os callbacks de upload funcionem, use uma ferramenta como 'ngrok' para criar uma URL pública e defina-a na variável de ambiente 'VERCEL_BLOB_CALLBACK_URL'.` }),
          { status: 500, headers: { 'Content-Type': 'application/json' } },
        );
      }
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, /* clientPayload */) => {
        const userPayload = {
          userId: 'user-123-example', // Simulação: obter o ID do usuário da sessão/token.
        };
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          maximumSizeInBytes: 4 * 1024 * 1024, // 4MB
          cacheControlMaxAge: 31536000,
          tokenPayload: JSON.stringify(userPayload),
          addRandomSuffix: true, // Evita sobrescrita de arquivos com o mesmo nome.
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('✅ Upload do blob concluído. Payload:', tokenPayload);
        try {
          if (tokenPayload) {
            const { userId } = JSON.parse(tokenPayload);
            // Lógica simulada para atualizar o banco de dados:
            console.log(`- Lógica de DB simulada: Associando URL ${blob.url} com o usuário ${userId}`);
          }
        } catch (error) {
          console.error("❌ Erro ao processar o payload do token:", error);
        }
      },
    });

    return new Response(JSON.stringify(jsonResponse), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const unknownError = error;
    console.error('❌ ERRO NA API DE UPLOAD:', unknownError);

    // Bloco de tratamento de erro aprimorado para sempre retornar JSON.
    if (unknownError instanceof Error) {
        const message = unknownError.message;

        if (message.includes('BLOB_READ_WRITE_TOKEN')) {
            return new Response(
                JSON.stringify({ error: "Erro de configuração no servidor: A variável de ambiente BLOB_READ_WRITE_TOKEN está faltando ou é inválida." }),
                { status: 500, headers: { 'Content-Type': 'application/json' } },
            );
        }
        if (message.includes('content type not allowed')) {
            return new Response(
                JSON.stringify({ error: 'Tipo de arquivo não permitido. Apenas imagens são aceitas.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } },
            );
        }
        if (message.includes('size exceeded')) {
            return new Response(
                JSON.stringify({ error: 'Arquivo muito grande. O tamanho máximo permitido é de 4MB.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } },
            );
        }
        // Captura erros de parsing de JSON e outros erros genéricos.
        return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    
    // Fallback para erros que não são instâncias de Error.
    return new Response(
      JSON.stringify({ error: "Ocorreu uma falha desconhecida no servidor de upload." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
