import { put } from '@vercel/blob';

/**
 * API Route para upload seguro de imagens no Vercel Blob
 * 
 * IMPORTANTE: Este endpoint deve ser usado APENAS no servidor
 * O token BLOB_READ_WRITE_TOKEN nunca deve ser exposto no frontend
 * 
 * Uso:
 * POST /api/upload
 * Body: FormData com campo 'file'
 * Response: { url: string }
 */

export const config = {
    api: {
        bodyParser: false, // Desabilitar parsing padrão para lidar com FormData
    },
};

export default async function handler(req: any, res: any) {
    // Apenas método POST é permitido
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Verificar autenticação (opcional mas recomendado)
        // const session = await getServerSession(req, res, authOptions);
        // if (!session) {
        //   return res.status(401).json({ error: 'Unauthorized' });
        // }

        // Obter token do ambiente (NUNCA do frontend!)
        const token = process.env.BLOB_READ_WRITE_TOKEN;

        if (!token) {
            console.error('❌ BLOB_READ_WRITE_TOKEN not configured in environment');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Parsear o FormData manualmente
        const contentType = req.headers['content-type'] || '';
        const filename = req.headers['x-filename'] || `upload-${Date.now()}`;

        // Validações de segurança
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(contentType)) {
            return res.status(400).json({ error: 'Invalid file type. Only images are allowed.' });
        }

        // Limite de tamanho (4MB)
        const maxSize = 4 * 1024 * 1024; // 4MB
        const contentLength = parseInt(req.headers['content-length'] || '0');
        if (contentLength > maxSize) {
            return res.status(400).json({ error: 'File too large. Maximum size is 4MB.' });
        }

        // Upload para Vercel Blob
        const blob = await put(filename, req, {
            access: 'public',
            token: token,
            contentType: contentType,
        });

        // Retornar URL pública
        return res.status(200).json({
            url: blob.url,
            downloadUrl: blob.downloadUrl,
            pathname: blob.pathname
        });

    } catch (error: any) {
        console.error('❌ Upload error:', error);
        return res.status(500).json({
            error: 'Upload failed',
            message: error.message
        });
    }
}
