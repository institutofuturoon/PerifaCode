/**
 * Image Optimization Utilities
 * Funções para otimizar, comprimir e redimensionar imagens
 */

/**
 * Redimensiona imagem mantendo aspect ratio
 */
export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calcular novas dimensões mantendo aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível obter contexto do canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Falha ao redimensionar imagem'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Não foi possível carregar a imagem'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Converte imagem para WebP (melhor compressão)
 */
export async function convertToWebP(
  file: File,
  quality: number = 0.85
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
          reject(new Error('Não foi possível obter contexto do canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Falha ao converter para WebP'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Não foi possível carregar a imagem'));
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Calcula tamanho reduzido após compressão
 */
export function estimateCompressedSize(
  originalSize: number,
  quality: number = 0.85
): number {
  // Estimativa: qualidade reduz tamanho proporcionalmente
  const reductionFactor = quality;
  return Math.round(originalSize * reductionFactor);
}

/**
 * Formata tamanho de arquivo em KB/MB/GB
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Gera thumbnail da imagem
 */
export async function generateThumbnail(
  file: File,
  size: number = 200,
  quality: number = 0.8
): Promise<Blob> {
  return resizeImage(file, size, size, quality);
}

/**
 * Valida dimensões mínimas da imagem
 */
export async function validateImageDimensions(
  file: File,
  minWidth: number = 100,
  minHeight: number = 100
): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        resolve(img.width >= minWidth && img.height >= minHeight);
      };

      img.onerror = () => {
        resolve(false);
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Cria versões otimizadas da imagem (múltiplos tamanhos)
 */
export async function createOptimizedVersions(
  file: File,
  sizes: { name: string; width: number; height: number; quality: number }[] = [
    { name: 'thumbnail', width: 200, height: 200, quality: 0.8 },
    { name: 'small', width: 400, height: 400, quality: 0.85 },
    { name: 'medium', width: 800, height: 800, quality: 0.9 },
  ]
): Promise<Record<string, Blob>> {
  const versions: Record<string, Blob> = {};

  for (const size of sizes) {
    try {
      versions[size.name] = await resizeImage(
        file,
        size.width,
        size.height,
        size.quality
      );
    } catch (error) {
      console.error(`Erro ao criar versão ${size.name}:`, error);
    }
  }

  return versions;
}
