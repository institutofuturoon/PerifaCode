import { handleUpload, type HandleUploadBody } from '@vercel/blob/server';
import { NextResponse } from 'next/server';
import { VERCEL_BLOB_READ_WRITE_TOKEN } from '../../config';

export default async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      // Passando o token do servidor diretamente e usando permissões padrão.
      // Esta é a implementação mais direta e robusta.
      token: VERCEL_BLOB_READ_WRITE_TOKEN,
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Callback executado no servidor após o upload ser concluído com sucesso.
        console.log('Upload do blob concluído', blob, tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    // Captura erros durante a geração do token ou upload.
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // Bad Request
    );
  }
}