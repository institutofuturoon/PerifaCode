/**
 * Upload Service - Gerenciador de uploads de imagens para Vercel Blob
 * Features:
 * - Integração com Firestore
 * - Validação client-side
 * - Retry logic
 * - Compressão de imagem
 * - Tracking de uploads
 */

import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc, getDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';

interface UploadMetadata {
  id: string;
  userId: string;
  fileName: string;
  originalName: string;
  blobUrl: string;
  fileSize: number;
  mimeType: string;
  dimensions?: { width: number; height: number };
  uploadedAt: string;
  context: string; // 'profile', 'course', 'project', etc
  status: 'pending' | 'completed' | 'failed';
  errorMessage?: string;
}

interface UploadOptions {
  userId: string;
  context: 'profile' | 'course' | 'project' | 'community' | 'article';
  onProgress?: (progress: number) => void;
  maxSize?: number; // em bytes, default 4MB
  quality?: number; // 0-1, para compressão
}

const UPLOADS_COLLECTION = 'uploads';
const DEFAULT_MAX_SIZE = 4 * 1024 * 1024; // 4MB
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

export const uploadService = {
  /**
   * Valida arquivo antes do upload
   */
  validateFile(file: File, maxSize: number = DEFAULT_MAX_SIZE): {
    valid: boolean;
    error?: string;
  } {
    // Verificar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de arquivo não permitido. Aceitos: JPEG, PNG, GIF, WebP',
      };
    }

    // Verificar tamanho
    if (file.size > maxSize) {
      const maxMB = (maxSize / (1024 * 1024)).toFixed(0);
      return {
        valid: false,
        error: `Arquivo muito grande. Máximo: ${maxMB}MB`,
      };
    }

    return { valid: true };
  },

  /**
   * Obtém dimensões da imagem
   */
  async getImageDimensions(
    file: File
  ): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => resolve(null);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  },

  /**
   * Comprime imagem antes do upload
   */
  async compressImage(
    file: File,
    quality: number = 0.8
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context inválido'));
            return;
          }

          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Falha na compressão'));
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  },

  /**
   * Gera token de upload com Vercel Blob
   */
  async generateUploadToken(userId: string): Promise<string> {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blob.generate-client-token',
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar token de upload');
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('❌ Erro ao gerar token:', error);
      throw error;
    }
  },

  /**
   * Faz upload do arquivo para Vercel Blob com retry
   */
  async uploadWithRetry(
    file: File,
    token: string,
    onProgress?: (progress: number) => void,
    retries: number = 0
  ): Promise<{ url: string; size: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simular progresso
      if (onProgress) onProgress(30);

      const response = await fetch('https://blob.vercel-storage.com/upload', {
        method: 'POST',
        headers: { 'authorization': `Bearer ${token}` },
        body: formData,
      });

      if (onProgress) onProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no upload');
      }

      const data = await response.json();
      if (onProgress) onProgress(100);

      return {
        url: data.url,
        size: file.size,
      };
    } catch (error) {
      if (retries < MAX_RETRIES) {
        console.log(`🔄 Retry ${retries + 1}/${MAX_RETRIES}...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return this.uploadWithRetry(file, token, onProgress, retries + 1);
      }

      console.error('❌ Upload falhou após múltiplas tentativas:', error);
      throw error;
    }
  },

  /**
   * Faz upload completo com todas as etapas
   */
  async uploadImage(
    file: File,
    options: UploadOptions
  ): Promise<UploadMetadata> {
    try {
      const { userId, context, onProgress, maxSize, quality } = options;

      // 1. Validação
      const validation = this.validateFile(file, maxSize);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      if (onProgress) onProgress(5);

      // 2. Obter dimensões
      const dimensions = await this.getImageDimensions(file);
      if (onProgress) onProgress(15);

      // 3. Comprimir se necessário
      let fileToUpload = file;
      if (file.type === 'image/jpeg') {
        fileToUpload = new File(
          [await this.compressImage(file, quality || 0.85)],
          file.name,
          { type: 'image/jpeg' }
        );
      }
      if (onProgress) onProgress(25);

      // 4. Gerar token
      const token = await this.generateUploadToken(userId);
      if (onProgress) onProgress(35);

      // 5. Upload para Vercel Blob
      const { url, size } = await this.uploadWithRetry(fileToUpload, token, (progress) => {
        if (onProgress) onProgress(35 + progress * 0.5);
      });

      if (onProgress) onProgress(90);

      // 6. Salvar metadata no Firestore
      const metadata: Omit<UploadMetadata, 'id'> = {
        userId,
        fileName: file.name,
        originalName: file.name,
        blobUrl: url,
        fileSize: size,
        mimeType: file.type,
        dimensions: dimensions || undefined,
        uploadedAt: new Date().toISOString(),
        context,
        status: 'completed',
      };

      const docRef = await addDoc(
        collection(db, UPLOADS_COLLECTION),
        metadata
      );

      if (onProgress) onProgress(100);

      console.log(`✅ Upload concluído: ${file.name}`);

      return {
        id: docRef.id,
        ...metadata,
      };
    } catch (error) {
      console.error('❌ Erro no upload:', error);

      // Salvar erro no Firestore
      const errorMetadata = {
        userId: options.userId,
        fileName: file.name,
        originalName: file.name,
        blobUrl: '',
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        context: options.context,
        status: 'failed' as const,
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
      };

      const docRef = await addDoc(
        collection(db, UPLOADS_COLLECTION),
        errorMetadata
      );

      throw {
        id: docRef.id,
        ...errorMetadata,
        error,
      };
    }
  },

  /**
   * Obtém histórico de uploads do usuário
   */
  async getUserUploads(
    userId: string,
    context?: string
  ): Promise<UploadMetadata[]> {
    try {
      let q;
      if (context) {
        q = query(
          collection(db, UPLOADS_COLLECTION),
          where('userId', '==', userId),
          where('context', '==', context)
        );
      } else {
        q = query(
          collection(db, UPLOADS_COLLECTION),
          where('userId', '==', userId)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as UploadMetadata));
    } catch (error) {
      console.error('❌ Erro ao obter uploads:', error);
      return [];
    }
  },

  /**
   * Deleta upload e arquivo
   */
  async deleteUpload(uploadId: string): Promise<void> {
    try {
      // Obter metadata
      const uploadDoc = await getDoc(doc(db, UPLOADS_COLLECTION, uploadId));
      if (!uploadDoc.exists()) {
        throw new Error('Upload não encontrado');
      }

      const metadata = uploadDoc.data() as UploadMetadata;

      // TODO: Deletar arquivo do Vercel Blob
      // await deleteFromBlob(metadata.blobUrl);

      // Deletar metadata do Firestore
      await deleteDoc(doc(db, UPLOADS_COLLECTION, uploadId));

      console.log(`✅ Upload deletado: ${uploadId}`);
    } catch (error) {
      console.error('❌ Erro ao deletar upload:', error);
      throw error;
    }
  },

  /**
   * Obtém URL pública do arquivo
   */
  getPublicUrl(blobUrl: string): string {
    return blobUrl;
  },
};
