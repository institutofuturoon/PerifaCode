import { generateClientTokenFromReadWriteToken } from '@vercel/blob/server';
import { NextResponse } from 'next/server';

export default async function POST(request: Request): Promise<NextResponse | Response> {
  // O corpo da requisição do `@vercel/blob/client` contém um campo `action`.
  // Para o upload, a primeira chamada é para a ação `generate-client-token`.
  const body = await request.json();

  if (body.action === 'generate-client-token') {
    const { pathname } = body.payload;
    try {
      // Usamos a função `generateClientTokenFromReadWriteToken` para criar um token de curta duração
      // que o cliente usará para fazer o upload diretamente para o Vercel Blob.
      const clientToken = await generateClientTokenFromReadWriteToken({
        pathname,
        // O token de Leitura/Escrita do Vercel Blob, armazenado de forma segura no servidor.
        token: 'vercel_blob_rw_uI73bVafvL0LLaMC_v9NEwyi9BSF1pBmOXbFEamnbWvh3Rc',
        // Opções de segurança e configuração
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maximumSizeInBytes: 4 * 1024 * 1024, // Limite de 4MB
        addRandomSuffix: false, // Não adicionar sufixo aleatório ao nome do arquivo
        cacheControlMaxAge: 0,  // Não usar cache para o token
      });

      // A biblioteca do cliente espera o token como uma string de texto puro no corpo da resposta.
      return new Response(clientToken, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });

    } catch (error) {
      const message = (error as Error).message;
      console.error('Erro ao gerar o token do cliente:', error);
      return NextResponse.json({ error: `Falha ao gerar o token: ${message}` }, { status: 500 });
    }
  }

  // Se a ação não for 'generate-client-token', é uma ação de upload que o cliente
  // deve lidar diretamente com o URL do blob storage (incluído no clientToken).
  // Portanto, este endpoint não deve ser chamado novamente para o upload do arquivo em si.
  // Retornamos um erro para indicar que este endpoint é apenas para a geração de tokens.
  return NextResponse.json(
    { error: 'Ação inválida. Este endpoint é apenas para a geração de tokens de upload.' },
    { status: 400 },
  );
}
