# 📡 Documentação da API - FuturoOn

**Versão:** 1.0  
**Última Atualização:** 03/12/2024  
**Ambiente:** Vercel Edge Runtime + Node.js

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração](#configuração)
3. [Endpoints](#endpoints)
4. [Autenticação](#autenticação)
5. [Códigos de Erro](#códigos-de-erro)
6. [Exemplos de Uso](#exemplos-de-uso)
7. [Segurança](#segurança)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

A API do FuturoOn fornece endpoints para:
- ✅ Upload de imagens (Vercel Blob Storage)
- 🔄 Integração com Firebase (Firestore)
- 📧 Geração de conteúdo (Google Gemini AI)

**Base URL:**
- Produção: `https://seu-dominio.vercel.app/api`
- Desenvolvimento: `http://localhost:5173/api`

---

## ⚙️ Configuração

### Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxx

# Firebase
VITE_FIREBASE_API_KEY=AIzaSyxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxx

# Google Gemini AI
VITE_GEMINI_API_KEY=AIzaSyxxxxxxxxxx

# Callbacks (apenas para desenvolvimento local)
VERCEL_BLOB_CALLBACK_URL=https://seu-ngrok-url.ngrok.io
```

### Como Obter os Tokens

**1. Vercel Blob Token:**
```bash
# No dashboard da Vercel:
# 1. Acesse seu projeto
# 2. Settings → Environment Variables
# 3. Crie BLOB_READ_WRITE_TOKEN
# 4. Copie o valor gerado
```

**2. Firebase:**
```bash
# No Firebase Console:
# 1. Project Settings → General
# 2. Copie as credenciais do Web App
```

**3. Gemini AI:**
```bash
# No Google AI Studio:
# 1. Acesse https://makersuite.google.com/app/apikey
# 2. Crie uma nova API Key
```

---

## 🔌 Endpoints

### 1. Upload de Imagem

**Endpoint:** `POST /api/upload`  
**Runtime:** Edge (Vercel)  
**Descrição:** Faz upload de imagens para o Vercel Blob Storage

#### Request

**Headers:**
```http
Content-Type: application/json
```

**Body:**
```json
{
  "type": "blob.generate-client-token",
  "payload": {
    "pathname": "courses/image-name.jpg"
  }
}
```

#### Response (Sucesso - 200)

```json
{
  "type": "blob.generate-client-token",
  "clientToken": "vercel_blob_client_xxxxxxxxxx"
}
```

#### Response (Erro - 400)

```json
{
  "error": "Tipo de arquivo não permitido. Apenas imagens são aceitas."
}
```

#### Response (Erro - 500)

```json
{
  "error": "Erro de configuração no servidor: A variável de ambiente BLOB_READ_WRITE_TOKEN está faltando ou é inválida."
}
```

#### Restrições

- **Tipos permitidos:** `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- **Tamanho máximo:** 4MB
- **Cache:** 1 ano (31536000 segundos)
- **Sufixo aleatório:** Sim (evita sobrescrita)

---

## 🔐 Autenticação

### Atual (v1.0)

Atualmente, a API **não requer autenticação** para uploads, mas valida:
- Tipo de arquivo
- Tamanho do arquivo
- Origem da requisição (CORS)

### Planejado (v2.0)

```typescript
// Exemplo de autenticação futura
headers: {
  'Authorization': 'Bearer <firebase-id-token>',
  'Content-Type': 'application/json'
}
```

**Como obter o token:**
```typescript
import { auth } from './config';

const user = auth.currentUser;
if (user) {
  const token = await user.getIdToken();
  // Use o token nas requisições
}
```

---

## ❌ Códigos de Erro

| Código | Significado | Solução |
|--------|-------------|---------|
| `400` | Bad Request | Verifique o formato da requisição |
| `401` | Unauthorized | Token de autenticação inválido/ausente |
| `403` | Forbidden | Sem permissão para acessar o recurso |
| `404` | Not Found | Endpoint não existe |
| `405` | Method Not Allowed | Use o método HTTP correto (POST) |
| `413` | Payload Too Large | Arquivo maior que 4MB |
| `415` | Unsupported Media Type | Tipo de arquivo não permitido |
| `500` | Internal Server Error | Erro no servidor (veja logs) |
| `503` | Service Unavailable | Serviço temporariamente indisponível |

### Mensagens de Erro Comuns

**1. Token não configurado:**
```json
{
  "error": "Erro de configuração no servidor: A variável de ambiente BLOB_READ_WRITE_TOKEN está faltando ou é inválida."
}
```
**Solução:** Configure `BLOB_READ_WRITE_TOKEN` no `.env.local`

**2. Tipo de arquivo inválido:**
```json
{
  "error": "Tipo de arquivo não permitido. Apenas imagens são aceitas."
}
```
**Solução:** Use apenas JPEG, PNG, GIF ou WebP

**3. Arquivo muito grande:**
```json
{
  "error": "Arquivo muito grande. O tamanho máximo permitido é de 4MB."
}
```
**Solução:** Comprima a imagem antes do upload

**4. Callback URL ausente (dev local):**
```json
{
  "error": "[ERRO DE AMBIENTE LOCAL] A API está em 'localhost'. Para que os callbacks de upload funcionem, use uma ferramenta como 'ngrok' para criar uma URL pública e defina-a na variável de ambiente 'VERCEL_BLOB_CALLBACK_URL'."
}
```
**Solução:** Use ngrok ou teste em produção

---

## 💻 Exemplos de Uso

### Exemplo 1: Upload Simples (React)

```typescript
import { upload } from '@vercel/blob/client';

async function uploadImage(file: File) {
  try {
    const blob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
    });

    console.log('✅ Upload concluído:', blob.url);
    return blob.url;
  } catch (error) {
    console.error('❌ Erro no upload:', error);
    throw error;
  }
}

// Uso
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const url = await uploadImage(file);
  console.log('URL da imagem:', url);
};
```

### Exemplo 2: Upload com Progresso

```typescript
import { upload } from '@vercel/blob/client';

async function uploadWithProgress(
  file: File,
  onProgress: (progress: number) => void
) {
  try {
    const blob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      },
    });

    return blob.url;
  } catch (error) {
    console.error('❌ Erro no upload:', error);
    throw error;
  }
}

// Uso
const [progress, setProgress] = useState(0);

const handleUpload = async (file: File) => {
  const url = await uploadWithProgress(file, setProgress);
  console.log('Upload completo:', url);
};
```

### Exemplo 3: Upload com Validação

```typescript
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function validateFile(file: File): string | null {
  // Validar tipo
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WebP.';
  }

  // Validar tamanho
  if (file.size > MAX_FILE_SIZE) {
    return 'Arquivo muito grande. Máximo: 4MB.';
  }

  return null; // Válido
}

async function safeUpload(file: File) {
  // Validar antes de enviar
  const error = validateFile(file);
  if (error) {
    throw new Error(error);
  }

  // Fazer upload
  const blob = await upload(file.name, file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
  });

  return blob.url;
}
```

### Exemplo 4: Upload com Retry

```typescript
async function uploadWithRetry(
  file: File,
  maxRetries = 3
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Tentativa ${attempt}/${maxRetries}`);
      
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      console.log('✅ Upload bem-sucedido!');
      return blob.url;
    } catch (error) {
      lastError = error as Error;
      console.error(`❌ Tentativa ${attempt} falhou:`, error);
      
      // Aguardar antes de tentar novamente
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw new Error(`Upload falhou após ${maxRetries} tentativas: ${lastError?.message}`);
}
```

### Exemplo 5: Componente Completo

```typescript
import { useState } from 'react';
import { upload } from '@vercel/blob/client';

export function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError('Arquivo muito grande (máx: 4MB)');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      setImageUrl(blob.url);
      console.log('✅ Upload concluído:', blob.url);
    } catch (err: any) {
      setError(err.message || 'Erro no upload');
      console.error('❌ Erro:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full"
      />

      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{progress}%</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {imageUrl && (
        <div className="space-y-2">
          <img
            src={imageUrl}
            alt="Upload"
            className="max-w-xs rounded shadow"
          />
          <p className="text-sm text-gray-600 break-all">{imageUrl}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🔒 Segurança

### Boas Práticas Implementadas

**1. Token no Servidor**
```typescript
// ✅ CORRETO - Token no servidor
const token = process.env.BLOB_READ_WRITE_TOKEN;

// ❌ ERRADO - Nunca exponha o token no frontend
const token = 'vercel_blob_rw_xxxxxxxxxx';
```

**2. Validação de Tipo de Arquivo**
```typescript
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!allowedTypes.includes(contentType)) {
  return res.status(400).json({ error: 'Invalid file type' });
}
```

**3. Limite de Tamanho**
```typescript
const maxSize = 4 * 1024 * 1024; // 4MB
if (contentLength > maxSize) {
  return res.status(400).json({ error: 'File too large' });
}
```

**4. Sufixo Aleatório**
```typescript
// Evita sobrescrita de arquivos
addRandomSuffix: true
```

### Recomendações Futuras

**1. Rate Limiting**
```typescript
// Limitar uploads por usuário/IP
import rateLimit from 'express-rate-limit';

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 uploads por janela
  message: 'Muitos uploads. Tente novamente mais tarde.'
});
```

**2. Autenticação Obrigatória**
```typescript
// Verificar se o usuário está autenticado
const user = auth.currentUser;
if (!user) {
  throw new Error('Autenticação necessária');
}
```

**3. Sanitização de Nomes**
```typescript
// Remover caracteres perigosos do nome do arquivo
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();
}
```

**4. Scan de Malware**
```typescript
// Integrar com serviço de scan (ex: VirusTotal)
// Antes de aceitar o upload
```

---

## 🔧 Troubleshooting

### Problema 1: Upload Falha em Localhost

**Sintoma:**
```
Error: Callback URL not configured
```

**Causa:** Vercel Blob precisa de uma URL pública para callbacks

**Solução:**
```bash
# 1. Instale ngrok
npm install -g ngrok

# 2. Inicie o ngrok
ngrok http 5173

# 3. Configure a variável
VERCEL_BLOB_CALLBACK_URL=https://seu-id.ngrok.io

# 4. Reinicie o servidor
npm run dev
```

### Problema 2: Token Inválido

**Sintoma:**
```json
{
  "error": "BLOB_READ_WRITE_TOKEN está faltando ou é inválida"
}
```

**Solução:**
1. Verifique se o token está no `.env.local`
2. Reinicie o servidor de desenvolvimento
3. Verifique se o token não expirou
4. Gere um novo token no dashboard da Vercel

### Problema 3: CORS Error

**Sintoma:**
```
Access to fetch at 'https://...' from origin 'http://localhost:5173' has been blocked by CORS
```

**Solução:**
```typescript
// Adicione headers CORS na API
export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ... resto do código
}
```

### Problema 4: Upload Lento

**Sintomas:**
- Upload demora muito
- Timeout errors

**Soluções:**
```typescript
// 1. Comprimir imagem antes do upload
import imageCompression from 'browser-image-compression';

async function compressImage(file: File) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  
  return await imageCompression(file, options);
}

// 2. Usar WebP (menor tamanho)
// 3. Implementar upload em chunks para arquivos grandes
```

### Problema 5: Imagem Não Carrega

**Sintoma:**
```
Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
```

**Causa:** Ad blocker ou extensão bloqueando

**Solução:**
1. Desabilite ad blockers temporariamente
2. Use domínio próprio (não Vercel Blob)
3. Configure Content Security Policy

---

## 📊 Monitoramento

### Logs Importantes

```typescript
// No servidor
console.log('✅ Upload concluído:', blob.url);
console.log('📊 Tamanho:', contentLength, 'bytes');
console.log('🎨 Tipo:', contentType);
console.log('👤 Usuário:', userId);

// No cliente
console.log('📤 Iniciando upload...');
console.log('⏳ Progresso:', progress, '%');
console.log('✅ Sucesso:', url);
console.log('❌ Erro:', error);
```

### Métricas para Acompanhar

- **Taxa de sucesso:** > 95%
- **Tempo médio de upload:** < 5s (para 1MB)
- **Erros 4xx:** < 5%
- **Erros 5xx:** < 1%
- **Tamanho médio de arquivo:** ~500KB

---

## 🚀 Próximas Melhorias

### v2.0 (Planejado)

- [ ] Autenticação obrigatória
- [ ] Rate limiting por usuário
- [ ] Upload de múltiplos arquivos
- [ ] Suporte a vídeos
- [ ] Compressão automática
- [ ] Thumbnails automáticos
- [ ] CDN personalizado
- [ ] Webhooks de upload
- [ ] Analytics de uso

---

## 📚 Referências

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Gemini AI](https://ai.google.dev/)
- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

---

## 📞 Suporte

**Problemas?**
1. Verifique os logs do console
2. Consulte a seção de Troubleshooting
3. Revise as variáveis de ambiente
4. Teste em produção (não apenas local)

**Dúvidas?**
- Abra uma issue no repositório
- Consulte a documentação oficial
- Entre em contato com a equipe

---

**Última atualização:** 03/12/2024  
**Versão da API:** 1.0  
**Status:** ✅ Produção
