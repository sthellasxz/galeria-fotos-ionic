<template>
  <ion-page>
    <ion-content class="ion-padding" fullscreen>
      <div class="login-wrapper">
        <ion-icon :icon="imagesOutline" class="brand-icon"></ion-icon>
        <h1>Galeria de Fotos</h1>
        <p class="subtitle">Entre com seu e-mail e senha</p>

        <form @submit.prevent="handleLogin">
          <ion-item>
            <ion-label position="stacked">E-mail</ion-label>
            <ion-input v-model="email" type="email" inputmode="email" autocomplete="email" required></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Senha</ion-label>
            <ion-input v-model="password" type="password" autocomplete="current-password" required></ion-input>
          </ion-item>

          <ion-button expand="block" type="submit" class="ion-margin-top">
            Entrar
          </ion-button>
        </form>

        <ion-button expand="block" fill="clear" router-link="/register">
          Não tem conta? Cadastre-se
        </ion-button>

        <ion-button expand="block" fill="clear" router-link="/about">
          Sobre o app
        </ion-button>
      </div>

      <ion-toast
        :is-open="!!errorMessage"
        :message="errorMessage"
        color="danger"
        :duration="2500"
        @didDismiss="errorMessage = ''"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonToast,
} from '@ionic/vue';
import { imagesOutline } from 'ionicons/icons';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const router = useRouter();
const authStore = useAuthStore();

function handleLogin() {
  const result = authStore.login(email.value, password.value);
  if (result.ok) {
    router.replace('/home');
  } else {
    errorMessage.value = result.message ?? 'Não foi possível entrar.';
  }
}
</script>

<style scoped>
.login-wrapper {
  max-width: 420px;
  margin: 0 auto;
  padding-top: 10vh;
  text-align: center;
}

.brand-icon {
  font-size: 64px;
  color: var(--ion-color-primary);
}

.subtitle {
  color: var(--ion-color-medium);
  margin-bottom: 24px;
}

form {
  text-align: left;
}
</style>
