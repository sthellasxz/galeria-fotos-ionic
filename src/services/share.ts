import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * Compartilha uma foto (em formato data URL) com outros aplicativos
 * instalados no dispositivo (WhatsApp, Telegram, e-mail etc.).
 *
 * No Android o menu nativo de compartilhamento só aceita arquivos, então a
 * imagem é gravada temporariamente na pasta de CACHE do app apenas para ser
 * enviada. A galeria continua existindo somente em memória.
 */
export async function sharePhoto(dataUrl: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await shareOnDevice(dataUrl);
  } else {
    await shareOnWeb(dataUrl);
  }
}

async function shareOnDevice(dataUrl: string): Promise<void> {
  const base64Data = dataUrl.split(',')[1];
  if (!base64Data) {
    throw new Error('Formato de imagem inválido');
  }

  const { uri } = await Filesystem.writeFile({
    path: `compartilhar-${Date.now()}.jpg`,
    data: base64Data,
    directory: Directory.Cache,
  });

  await Share.share({
    title: 'Foto da minha galeria',
    text: 'Olha essa foto!',
    files: [uri],
    dialogTitle: 'Compartilhar foto com...',
  });
}

async function shareOnWeb(dataUrl: string): Promise<void> {
  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], `foto-${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });

  if (!navigator.canShare || !navigator.canShare({ files: [file] })) {
    throw new Error('Compartilhamento de arquivos não suportado neste navegador');
  }

  await navigator.share({ title: 'Foto da minha galeria', files: [file] });
}

/** Indica se o erro veio do usuário fechando o menu de compartilhamento. */
export function isShareCanceled(err: unknown): boolean {
  const message = String(err instanceof Error ? err.message : err).toLowerCase();
  return message.includes('cancel') || message.includes('abort');
}
