<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Sobre</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="version-block">
        <ion-icon :icon="imagesOutline" class="brand-icon"></ion-icon>
        <h2>Galeria de Fotos</h2>
        <ion-badge color="medium">Versão {{ appVersion }}</ion-badge>
      </div>

      <ion-list>
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
                existem apenas em memória, durante a execução do app, e não são salvas em
                localStorage, arquivos ou qualquer banco de dados. O acesso à câmera e à galeria
                de fotos do dispositivo é solicitado apenas quando você toca no botão de adicionar
                foto, e as imagens não saem do dispositivo do usuário.
              </p>
            </ion-label>
          </ion-item>
        </ion-item-group>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonIcon,
  IonBadge,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonItem,
  IonLabel,
} from '@ionic/vue';
import { imagesOutline } from 'ionicons/icons';
import packageJson from '../../package.json';

const appVersion = packageJson.version;
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
</style>
