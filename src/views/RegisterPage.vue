<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/login"></ion-back-button>
        </ion-buttons>
        <ion-title>Cadastro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form @submit.prevent="handleRegister">
        <ion-item>
          <ion-label position="stacked">Nome</ion-label>
          <ion-input v-model="name" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">E-mail</ion-label>
          <ion-input v-model="email" type="email" inputmode="email" autocomplete="email" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Senha</ion-label>
          <ion-input v-model="password" type="password" autocomplete="new-password" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Confirmar senha</ion-label>
          <ion-input v-model="confirmPassword" type="password" autocomplete="new-password" required></ion-input>
        </ion-item>

        <ion-button expand="block" type="submit" class="ion-margin-top">
          Cadastrar
        </ion-button>
      </form>

      <ion-toast
        :is-open="!!errorMessage"
        :message="errorMessage"
        color="danger"
        :duration="2500"
        @didDismiss="errorMessage = ''"
      ></ion-toast>

      <ion-toast
        :is-open="successMessage"
        message="Cadastro realizado! Faça login para continuar."
        color="success"
        :duration="1800"
        @didDismiss="onSuccessDismiss"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast,
} from '@ionic/vue';
import { useAuthStore } from '../stores/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref(false);

const router = useRouter();
const authStore = useAuthStore();

function handleRegister() {
  if (!name.value.trim() || !email.value.trim() || !password.value) {
    errorMessage.value = 'Preencha todos os campos.';
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'As senhas não coincidem.';
    return;
  }

  const result = authStore.register(name.value, email.value, password.value);
  if (result.ok) {
    successMessage.value = true;
  } else {
    errorMessage.value = result.message ?? 'Não foi possível cadastrar.';
  }
}

function onSuccessDismiss() {
  successMessage.value = false;
  router.replace('/login');
}
</script>
