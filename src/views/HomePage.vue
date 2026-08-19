<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Minha Galeria</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/about">
            <ion-icon slot="icon-only" :icon="informationCircleOutline"></ion-icon>
          </ion-button>
          <ion-button @click="handleLogout">
            <ion-icon slot="icon-only" :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="photoStore.photos.length === 0" class="empty-state">
        <ion-icon :icon="imagesOutline"></ion-icon>
        <p>Nenhuma foto ainda.</p>
        <p class="hint">Toque no botão + para tirar uma foto ou escolher da galeria.</p>
      </div>

      <ion-grid v-else>
        <ion-row>
          <ion-col size="6" size-md="4" size-lg="3" v-for="photo in photoStore.photos" :key="photo.id">
            <div class="photo-card">
              <img :src="photo.webviewPath" alt="Foto" />
              <ion-button
                class="remove-btn"
                color="danger"
                shape="round"
                size="small"
                @click="photoStore.removePhoto(photo.id)"
                aria-label="Remover foto"
              >
                <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
              </ion-button>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openPicker">
          <ion-icon :icon="addOutline"></ion-icon>
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
  IonIcon,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  actionSheetController,
} from '@ionic/vue';
import {
  addOutline,
  cameraOutline,
  imagesOutline,
  informationCircleOutline,
  logOutOutline,
  trashOutline,
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useAuthStore } from '../stores/auth';
import { usePhotoStore } from '../stores/photos';

const router = useRouter();
const authStore = useAuthStore();
const photoStore = usePhotoStore();

async function openPicker() {
  const actionSheet = await actionSheetController.create({
    header: 'Adicionar foto',
    buttons: [
      { text: 'Câmera', icon: cameraOutline, handler: () => takePhoto(CameraSource.Camera) },
      { text: 'Galeria', icon: imagesOutline, handler: () => takePhoto(CameraSource.Photos) },
      { text: 'Cancelar', role: 'cancel' },
    ],
  });
  await actionSheet.present();
}

async function takePhoto(source: CameraSource) {
  try {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source,
      quality: 80,
    });
    if (photo.webPath) {
      photoStore.addPhoto(photo.webPath);
    }
  } catch (error) {
    // Usuário cancelou a captura/seleção ou a permissão foi negada.
    console.warn('Captura de foto cancelada ou não autorizada.', error);
  }
}

function handleLogout() {
  authStore.logout();
  router.replace('/login');
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 25vh;
  color: var(--ion-color-medium);
  text-align: center;
}

.empty-state ion-icon {
  font-size: 64px;
  margin-bottom: 12px;
}

.empty-state .hint {
  font-size: 0.9em;
}

.photo-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1 / 1;
}

.photo-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  margin: 0;
  --padding-start: 8px;
  --padding-end: 8px;
}
</style>
