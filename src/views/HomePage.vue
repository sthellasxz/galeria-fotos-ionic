<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Minha Galeria</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/about" aria-label="Sobre o app">
            <ion-icon slot="icon-only" :icon="informationCircleOutline"></ion-icon>
          </ion-button>
          <ion-button @click="handleLogout" aria-label="Sair">
            <ion-icon slot="icon-only" :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <p v-if="authStore.currentUser" class="greeting">
        Olá, <strong>{{ authStore.currentUser.name }}</strong>!
      </p>

      <!-- Estado vazio -->
      <div v-if="photoStore.photos.length === 0" class="empty-state">
        <ion-icon :icon="imagesOutline"></ion-icon>
        <p>Nenhuma foto ainda.</p>
        <p class="hint">Toque no botão <strong>+</strong> para tirar uma foto ou escolher da galeria.</p>
      </div>

      <!-- Grid de fotos -->
      <div v-else class="photo-grid">
        <ion-card v-for="photo in photoStore.photos" :key="photo.id" class="photo-card">
          <img :src="photo.webviewPath" alt="Foto da galeria" />
          <div class="photo-actions">
            <ion-button fill="clear" @click="handleShare(photo.webviewPath)" aria-label="Compartilhar foto">
              <ion-icon slot="icon-only" :icon="shareSocialOutline"></ion-icon>
            </ion-button>
            <ion-button fill="clear" color="danger" @click="confirmRemove(photo.id)" aria-label="Remover foto">
              <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
            </ion-button>
          </div>
        </ion-card>
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="openPhotoOptions" aria-label="Adicionar foto">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonCard,
  IonIcon,
  IonFab,
  IonFabButton,
  actionSheetController,
  alertController,
  toastController,
} from '@ionic/vue';
import {
  add,
  cameraOutline,
  imagesOutline,
  informationCircleOutline,
  logOutOutline,
  shareSocialOutline,
  trashOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../stores/auth';
import { usePhotoStore } from '../stores/photos';
import { ensureCameraPermission, pickPhoto, type PhotoOrigin } from '../services/camera';
import { isShareCanceled, sharePhoto } from '../services/share';

const router = useRouter();
const authStore = useAuthStore();
const photoStore = usePhotoStore();

async function showToast(message: string, color = 'primary') {
  const toast = await toastController.create({ message, color, duration: 2000, position: 'bottom' });
  await toast.present();
}

/* ---------- Adicionar foto ---------- */

async function openPhotoOptions() {
  const sheet = await actionSheetController.create({
    header: 'Adicionar foto',
    buttons: [
      { text: 'Câmera', icon: cameraOutline, handler: () => { addPhoto('camera'); } },
      { text: 'Galeria', icon: imagesOutline, handler: () => { addPhoto('photos'); } },
      { text: 'Cancelar', role: 'cancel' },
    ],
  });
  await sheet.present();
}

async function addPhoto(origin: PhotoOrigin) {
  try {
    const allowed = await ensureCameraPermission(origin);
    if (!allowed) {
      const name = origin === 'camera' ? 'câmera' : 'galeria';
      await showToast(`Permissão de ${name} negada. Ative nas configurações do aparelho.`, 'danger');
      return;
    }

    const dataUrl = await pickPhoto(origin);
    if (dataUrl) {
      photoStore.addPhoto(dataUrl);
    }
  } catch {
    await showToast('Não foi possível obter a foto.', 'danger');
  }
}

/* ---------- Compartilhar ---------- */

async function handleShare(dataUrl: string) {
  try {
    await sharePhoto(dataUrl);
  } catch (err: unknown) {
    if (isShareCanceled(err)) return;
    await showToast('Não foi possível compartilhar a foto.', 'danger');
  }
}

/* ---------- Remover ---------- */

async function confirmRemove(id: string) {
  const alert = await alertController.create({
    header: 'Remover foto',
    message: 'Deseja remover esta foto da galeria?',
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      { text: 'Remover', role: 'destructive', handler: () => photoStore.removePhoto(id) },
    ],
  });
  await alert.present();
}

/* ---------- Sair ---------- */

function handleLogout() {
  authStore.logout();
  router.replace('/login');
}
</script>

<style scoped>
.greeting {
  margin: 0 0 12px;
  color: var(--ion-color-medium);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 20vh;
  color: var(--ion-color-medium);
}

.empty-state ion-icon {
  font-size: 72px;
  margin-bottom: 8px;
}

.empty-state .hint {
  font-size: 14px;
  max-width: 260px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  padding-bottom: 80px; /* espaço para o FAB */
}

.photo-card {
  margin: 0;
  display: flex;
  flex-direction: column;
}

.photo-card img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.photo-actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
