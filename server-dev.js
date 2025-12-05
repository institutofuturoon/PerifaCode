/**
 * Servidor de desenvolvimento local para API do Vercel Blob
 * Execute: node server-dev.js
 * 
 * Este servidor simula a API do Vercel em localhost
 */

import express from 'express';
import cors from 'cors';
import { put } from '@vercel/blob';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Server running' });
});

// Upload endpoint - simplificado para desenvolvimento
app.post('/api/upload', express.raw({ type: '*/*', limit: '10mb' }), async (req, res) => {
  try {
    // Verificar token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({
        error: 'BLOB_READ_WRITE_TOKEN não configurado no .env.local'
      });
    }

    // Obter informações do arquivo
    const contentType = req.headers['content-type'] || 'application/octet-stream';
    const filename = req.headers['x-filename'] || `upload-${Date.now()}`;

    console.log('📤 Upload iniciado:', filename);
    console.log('   Tipo:', contentType);
    console.log('   Tamanho:', req.body.length, 'bytes');

    // Validações
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({
        error: 'Tipo de arquivo não permitido. Apenas imagens são aceitas.'
      });
    }

    if (req.body.length > 5 * 1024 * 1024) {
      return res.status(400).json({
        error: 'Arquivo muito grande. Máximo 5MB.'
      });
    }

    // Upload para Vercel Blob
    const blob = await put(filename, req.body, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: contentType,
    });

    console.log('✅ Upload completo:', blob.url);

    return res.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname
    });

  } catch (error) {
    console.error('❌ Erro no upload:', error);
    
    return res.status(500).json({
      error: 'Upload failed',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Servidor de desenvolvimento iniciado!');
  console.log(`📍 Rodando em: http://localhost:${PORT}`);
  console.log(`📤 API Upload: http://localhost:${PORT}/api/upload`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('⚠️  Certifique-se de que BLOB_READ_WRITE_TOKEN está no .env.local');
  console.log('');
});
