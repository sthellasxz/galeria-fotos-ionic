# Galeria de Fotos — Ionic + Vue

- **Aluno:** Sthella Miers da Silva
- **Curso:** Informática — 3º ano
- **Unidade curricular:** Codificação de Aplicações para Dispositivos Móveis

## Sobre o projeto

Aplicativo mobile híbrido desenvolvido com **Ionic Framework + Vue 3 (Composition API)**
e **Capacitor**, como atividade avaliativa da unidade curricular. O app permite que o
usuário se cadastre, faça login e monte uma galeria de fotos tirando fotos com a câmera
do dispositivo ou selecionando imagens da galeria.

### Funcionalidades

- **Login** (`/login`) — autentica o usuário contra os dados cadastrados.
- **Cadastro** (`/register`) — cria um novo usuário (nome, e-mail e senha).
- **Home** (`/home`, protegida por *route guard* — só acessível após login)
  - Botão flutuante (FAB) no canto inferior direito que abre um *action sheet* para
    escolher entre **Câmera** ou **Galeria**.
  - Grid responsivo com as fotos adicionadas.
  - Cada foto possui um botão para **remover** a imagem da galeria.
- **Sobre** (`/about`) — exibe a versão do app, os Termos de Uso e a Política de
  Privacidade.

### Armazenamento das fotos (importante)

Por exigência do enunciado, as fotos **não são persistidas** em `localStorage`,
arquivos ou qualquer banco de dados. Elas ficam guardadas apenas em um **vetor em
memória** (estado reativo do Pinia, em [`src/stores/photos.ts`](src/stores/photos.ts)).
Isso significa que, ao fechar ou recarregar o app, a galeria (assim como os usuários
cadastrados e a sessão de login) é perdida — esse comportamento é intencional.

### Permissões

O app solicita permissão de **Câmera** e de **acesso a fotos/mídia** do dispositivo
somente quando o usuário toca no botão flutuante e escolhe uma das opções, usando o
plugin `@capacitor/camera`. As permissões nativas do Android estão declaradas em
[`android/app/src/main/AndroidManifest.xml`](android/app/src/main/AndroidManifest.xml).

## Tecnologias

- [Ionic Framework](https://ionicframework.com/) 8 (Vue)
- [Vue 3](https://vuejs.org/) (`<script setup>` / Composition API)
- [Pinia](https://pinia.vuejs.org/) — estado global em memória (auth + fotos)
- [Capacitor](https://capacitorjs.com/) 8 + [`@capacitor/camera`](https://capacitorjs.com/docs/apis/camera)
- TypeScript + Vite

## Estrutura principal

```
src/
├── stores/
│   ├── auth.ts        # usuários e sessão (vetor em memória)
│   └── photos.ts       # fotos da galeria (vetor em memória)
├── views/
│   ├── LoginPage.vue
│   ├── RegisterPage.vue
│   ├── HomePage.vue     # FAB + grid de fotos
│   └── AboutPage.vue    # versão, termos e privacidade
└── router/
    └── index.ts         # rotas + guard de autenticação
```

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+ e npm
- [Ionic CLI](https://ionicframework.com/docs/cli): `npm install -g @ionic/cli`
- Para rodar no Android: [Android Studio](https://developer.android.com/studio) com o
  Android SDK configurado (variável `ANDROID_HOME`) e um emulador ou dispositivo físico

### 1. Instalar as dependências

```bash
npm install
```

### 2. Rodar no navegador (modo web)

```bash
ionic serve
```

O app abre em `http://localhost:8100`. No navegador, o plugin de câmera usa a API
`getUserMedia`/seletor de arquivos do sistema como alternativa à câmera nativa.

> Para testar o fluxo completo, primeiro cadastre um usuário na tela de cadastro e
> depois faça login com o mesmo e-mail/senha.

### 3. Rodar em um dispositivo/emulador Android

```bash
# gera o build web e copia para o projeto nativo
ionic build
npx cap sync android

# abre o projeto no Android Studio
npx cap open android
```

No Android Studio, escolha um emulador ou conecte um dispositivo físico (com Depuração
USB ativada) e clique em **Run**. Na primeira vez que tocar no botão de adicionar foto,
o Android vai pedir a permissão de Câmera e de Fotos/Mídia.

## Licença / Uso

Projeto acadêmico, sem fins comerciais.
