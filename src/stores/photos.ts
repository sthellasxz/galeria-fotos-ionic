import { defineStore } from 'pinia';

export interface Photo {
  id: string;
  webviewPath: string;
}

// Vetor em memória: as fotos NÃO são persistidas em localStorage/arquivo/banco de dados.
// Ao recarregar o app, a galeria volta a ficar vazia.
export const usePhotoStore = defineStore('photos', {
  state: () => ({
    photos: [] as Photo[],
  }),
  actions: {
    addPhoto(webviewPath: string) {
      this.photos.unshift({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        webviewPath,
      });
    },
    removePhoto(id: string) {
      this.photos = this.photos.filter((p) => p.id !== id);
    },
  },
});
