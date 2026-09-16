import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export type PhotoOrigin = 'camera' | 'photos';

/**
 * Verifica e, se necessário, solicita a permissão de Câmera ou de Galeria
 * (fotos/mídia). Retorna `true` se o acesso foi concedido.
 */
export async function ensureCameraPermission(origin: PhotoOrigin): Promise<boolean> {
  // No navegador não existe permissão nativa: o próprio browser pergunta.
  if (!Capacitor.isNativePlatform()) return true;

  const current = await Camera.checkPermissions();
  if (current[origin] === 'granted' || current[origin] === 'limited') return true;

  const result = await Camera.requestPermissions({ permissions: [origin] });
  return result[origin] === 'granted' || result[origin] === 'limited';
}

/**
 * Abre a câmera ou a galeria e devolve a foto como data URL (base64).
 * Retorna `null` se o usuário cancelar.
 */
export async function pickPhoto(origin: PhotoOrigin): Promise<string | null> {
  try {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: origin === 'camera' ? CameraSource.Camera : CameraSource.Photos,
      quality: 90,
      width: 1080,
    });
    return photo.dataUrl ?? null;
  } catch (err: unknown) {
    const message = String(err instanceof Error ? err.message : err).toLowerCase();
    if (message.includes('cancel')) return null;
    throw err;
  }
}
