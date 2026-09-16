<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Sobre</ion-title>
      </ion-toolbar>
      <!-- Aviso de sem internet -->
      <ion-toolbar v-if="!isOnline" color="danger" class="offline-bar">
        <ion-title size="small">
          <ion-icon :icon="cloudOfflineOutline"></ion-icon>
          Você está sem conexão com a internet
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="version-block">
        <ion-icon :icon="imagesOutline" class="brand-icon"></ion-icon>
        <h2>Galeria de Fotos</h2>
        <ion-badge color="medium">Versão {{ appVersion }}</ion-badge>
      </div>

      <ion-list>
        <!-- Conexão -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label>Conexão</ion-label>
          </ion-item-divider>
          <ion-item lines="none">
            <ion-icon
              slot="start"
              :icon="isOnline ? wifiOutline : cloudOfflineOutline"
              :color="isOnline ? 'success' : 'danger'"
            ></ion-icon>
            <ion-label>
              <h3>{{ isOnline ? 'Online' : 'Offline' }}</h3>
              <p v-if="isOnline">Tipo de conexão: {{ connectionLabel }}</p>
              <p v-else>O app não tem acesso à internet no momento.</p>
            </ion-label>
          </ion-item>
        </ion-item-group>

        <!-- Localização -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label>Sua localização</ion-label>
          </ion-item-divider>

          <ion-item v-if="loading" lines="none">
            <ion-spinner slot="start" name="crescent"></ion-spinner>
            <ion-label>Obtendo localização...</ion-label>
          </ion-item>

          <ion-item v-else-if="errorMessage" lines="none">
            <ion-icon slot="start" :icon="warningOutline" color="warning"></ion-icon>
            <ion-label class="ion-text-wrap">{{ errorMessage }}</ion-label>
          </ion-item>

          <template v-else-if="location">
            <ion-item>
              <ion-label>Latitude</ion-label>
              <ion-note slot="end">{{ location.latitude.toFixed(6) }}</ion-note>
            </ion-item>
            <ion-item>
              <ion-label>Longitude</ion-label>
              <ion-note slot="end">{{ location.longitude.toFixed(6) }}</ion-note>
            </ion-item>
            <ion-item lines="none">
              <ion-label>Altitude</ion-label>
              <ion-note slot="end">
                {{ location.altitude !== null ? `${location.altitude.toFixed(1)} m` : 'Indisponível' }}
              </ion-note>
            </ion-item>
          </template>

          <ion-button expand="block" fill="outline" class="ion-margin" :disabled="loading" @click="updateLocation">
            <ion-icon slot="start" :icon="locateOutline"></ion-icon>
            Atualizar localização
          </ion-button>
        </ion-item-group>

        <!-- Aparência -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label>Aparência</ion-label>
          </ion-item-divider>
          <ion-item lines="none">
            <ion-icon slot="start" :icon="isDarkMode ? moon : sunnyOutline"></ion-icon>
            <ion-toggle :checked="isDarkMode" @ionChange="onDarkModeChange">Modo escuro</ion-toggle>
          </ion-item>
        </ion-item-group>

        <!-- Termos -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label>Termos de Uso</ion-label>
          </ion-item-divider>
          <ion-item lines="none">
            <ion-label class="ion-text-wrap">
              <p>
                Este aplicativo foi desenvolvido para fins acadêmicos, como atividade da unidade
                curricular de Codificação de Aplicações para Dispositivos Móveis. Ao utilizar o
                app, você concorda que ele é um protótipo de estudo, sem garantias de
                disponibilidade, correção ou adequação para uso em produção. As fotos adicionadas
                ficam armazenadas apenas em memória (em um vetor local da sessão) e são
                descartadas ao fechar ou recarregar o aplicativo.
              </p>
            </ion-label>
          </ion-item>

          <ion-item-divider>
            <ion-label>Política de Privacidade</ion-label>
          </ion-item-divider>
          <ion-item lines="none">
            <ion-label class="ion-text-wrap">
              <p>
                Este aplicativo não coleta, armazena ou compartilha dados pessoais com terceiros.
                As credenciais de cadastro/login e as fotos capturadas ou selecionadas pela galeria
                existem apenas em memória, durante a execução do app. O acesso à câmera e à galeria
                é solicitado apenas quando você toca no botão de adicionar foto, e uma foto só sai
                do dispositivo quando você mesmo escolhe compartilhá-la. A localização é usada
                apenas para ser exibida nesta tela e não é salva nem enviada. A única informação
                salva no aparelho é a sua preferência de tema (claro/escuro).
              </p>
            </ion-label>
          </ion-item>
        </ion-item-group>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonContent,
  IonIcon,
  IonBadge,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonItem,
  IonLabel,
  IonNote,
  IonSpinner,
  IonToggle,
} from '@ionic/vue';
import type { ToggleCustomEvent } from '@ionic/vue';
import {
  cloudOfflineOutline,
  imagesOutline,
  locateOutline,
  moon,
  sunnyOutline,
  warningOutline,
  wifiOutline,
} from 'ionicons/icons';
import packageJson from '../../package.json';
import { useNetworkStatus } from '../composables/useNetworkStatus';
import { useLocation } from '../composables/useLocation';
import { loadThemePreference, saveThemePreference } from '../services/theme';

const appVersion = packageJson.version;

/* ---------- Internet ---------- */
const { isOnline, connectionType } = useNetworkStatus();

const connectionLabel = computed(() => {
  const labels: Record<string, string> = {
    wifi: 'Wi-Fi',
    cellular: 'Dados móveis',
    none: 'Nenhuma',
    unknown: 'Desconhecida',
  };
  return labels[connectionType.value] ?? connectionType.value;
});

/* ---------- Localização ---------- */
const { location, loading, errorMessage, updateLocation } = useLocation();

/* ---------- Tema ---------- */
const isDarkMode = ref(false);

async function onDarkModeChange(event: ToggleCustomEvent) {
  isDarkMode.value = event.detail.checked;
  await saveThemePreference(isDarkMode.value);
}

onMounted(async () => {
  isDarkMode.value = await loadThemePreference();
  updateLocation();
});
</script>

<style scoped>
.version-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 0;
}

.brand-icon {
  font-size: 56px;
  color: var(--ion-color-primary);
  margin-bottom: 8px;
}

.offline-bar ion-title {
  font-size: 14px;
}

.offline-bar ion-icon {
  vertical-align: middle;
  margin-right: 4px;
}
</style>
