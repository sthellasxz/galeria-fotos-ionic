# Galeria de Fotos — Ionic + Vue

- **Aluno:** Sthella Miers da Silva
- **Curso:** Informática — 3º ano
- **Unidade curricular:** Codificação de Aplicações para Dispositivos Móveis

## Sobre o projeto

Aplicativo mobile híbrido desenvolvido com **Ionic Framework + Vue 3 (Composition API)**,
**TypeScript** e **Capacitor**, como atividade avaliativa da unidade curricular. O app permite
que o usuário se cadastre, faça login e monte uma galeria de fotos tirando fotos com a câmera
do dispositivo ou selecionando imagens da galeria. Cada foto pode ser compartilhada com outros
aplicativos (WhatsApp, Telegram, e-mail...). A tela Sobre mostra a localização do usuário,
o status da internet e permite alternar entre tema claro e escuro.

### Funcionalidades

- **Login** (`/login`) — autentica o usuário contra os dados cadastrados.
- **Cadastro** (`/register`) — cria um novo usuário (nome, e-mail e senha).
- **Home** (`/home`) — **acessível apenas após o login** (protegida por *route guard*).
  - Botão flutuante (FAB) que abre um *action sheet* para escolher **Câmera** ou **Galeria**.
  - Antes de abrir a câmera/galeria, o app **verifica e solicita a permissão** correspondente.
  - Grid responsivo com as fotos adicionadas.
  - Cada foto possui um botão para **compartilhar** a imagem em outros aplicativos
    (menu nativo de compartilhamento do Android: WhatsApp, Telegram etc.) e um botão para
    **remover** a foto.
  - Botões no topo para abrir a tela **Sobre** e para **sair** (logout).
- **Sobre** (`/about`)
  - Exibe **latitude, longitude e altitude** do usuário (com botão para atualizar).
  - Botão (*toggle*) para ativar o **modo escuro**, com a escolha **salva no Preferences**
    (`@capacitor/preferences`) e aplicada automaticamente ao abrir o app.
  - Mostra se o app está **sem internet**: aparece uma faixa vermelha
    "Você está sem conexão com a internet" e o status muda em tempo real.
  - Versão do app, Termos de Uso e Política de Privacidade.

### Armazenamento dos dados

- As **fotos**, os **usuários** e a **sessão** ficam apenas em **memória** (estado reativo do
  Pinia, em [`src/stores`](src/stores)). Ao fechar ou recarregar o app, esses dados são perdidos —
  esse comportamento é intencional.
- A **preferência de tema** (claro/escuro) é o único dado salvo no aparelho, usando o
  `@capacitor/preferences`.
- Para compartilhar, o Android exige um arquivo. Por isso a foto escolhida é gravada
  temporariamente na pasta de **cache** do app (`Directory.Cache`) só no momento do
  compartilhamento.

### Permissões

| Permissão | Quando é pedida | Plugin |
|-----------|-----------------|--------|
| Câmera | Ao escolher **Câmera** no botão de adicionar foto | `@capacitor/camera` |
| Fotos/mídia (galeria) | Ao escolher **Galeria** no botão de adicionar foto | `@capacitor/camera` |
| Localização | Ao abrir a tela **Sobre** ou tocar em "Atualizar localização" | `@capacitor/geolocation` |
| Estado da rede | Automática (não exige confirmação) | `@capacitor/network` |

As permissões nativas estão declaradas em
[`android/app/src/main/AndroidManifest.xml`](android/app/src/main/AndroidManifest.xml).
Se o usuário negar uma permissão, o app mostra uma mensagem avisando.

## Tecnologias

- [Ionic Framework](https://ionicframework.com/) 8 (Vue)
- [Vue 3](https://vuejs.org/) (`<script setup>` / Composition API) + TypeScript + Vite
- [Pinia](https://pinia.vuejs.org/) — estado global em memória (auth + fotos)
- [Capacitor](https://capacitorjs.com/) 8 e plugins:
  - [`@capacitor/camera`](https://capacitorjs.com/docs/apis/camera) — câmera e galeria
  - [`@capacitor/share`](https://capacitorjs.com/docs/apis/share) — compartilhar fotos
  - [`@capacitor/filesystem`](https://capacitorjs.com/docs/apis/filesystem) — arquivo temporário para compartilhar
  - [`@capacitor/geolocation`](https://capacitorjs.com/docs/apis/geolocation) — latitude, longitude e altitude
  - [`@capacitor/network`](https://capacitorjs.com/docs/apis/network) — status da internet
  - [`@capacitor/preferences`](https://capacitorjs.com/docs/apis/preferences) — salvar o tema

## Estrutura principal

```
src/
├── composables/
│   ├── useLocation.ts       # permissão + latitude/longitude/altitude
│   └── useNetworkStatus.ts  # online/offline em tempo real
├── services/
│   ├── camera.ts            # permissões e captura de foto (câmera/galeria)
│   ├── share.ts             # compartilhamento de fotos
│   └── theme.ts             # dark mode + Preferences
├── stores/
│   ├── auth.ts              # usuários e sessão (vetor em memória)
│   └── photos.ts            # fotos da galeria (vetor em memória)
├── views/
│   ├── LoginPage.vue
│   ├── RegisterPage.vue
│   ├── HomePage.vue         # FAB + grid de fotos + compartilhar/remover
│   └── AboutPage.vue        # localização, dark mode, internet, termos
└── router/
    └── index.ts             # rotas + guard de autenticação
```

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20+ e npm
- [Ionic CLI](https://ionicframework.com/docs/cli): `npm install -g @ionic/cli`
- Para rodar no Android: [Android Studio](https://developer.android.com/studio) com o
  Android SDK configurado e um emulador ou dispositivo físico

### 1. Clonar e instalar as dependências

```bash
git clone <link-do-repositorio>
cd galeria-fotos-ionic
npm install
```

### 2. Rodar no navegador (modo web)

```bash
ionic serve
```

O app abre em `http://localhost:8100`.

> Para testar o fluxo completo, primeiro cadastre um usuário na tela de cadastro e
> depois faça login com o mesmo e-mail/senha.

No navegador, a câmera usa o seletor de arquivos/webcam, a localização é pedida pelo próprio
browser e o compartilhamento só funciona em navegadores com suporte à Web Share API
(ex.: Chrome no celular). Para testar o "sem internet", use a opção **Offline** do DevTools.

### 3. Rodar no Android Studio (emulador ou celular)

```bash
# gera o build web e copia para o projeto nativo (também registra os plugins novos)
ionic build
npx cap sync android

# abre o projeto no Android Studio
npx cap open android
```

No Android Studio, escolha um emulador ou conecte um dispositivo físico (com Depuração USB
ativada) e clique em **Run ▶**.

Dicas para testar no emulador:

- **Câmera/Galeria:** na primeira vez que tocar no botão **+**, o Android pede a permissão.
- **Compartilhar:** toque no ícone de compartilhar em uma foto — abre o menu nativo com os
  apps instalados.
- **Localização:** abra os *Extended Controls* do emulador (`⋯`) → **Location**, defina um
  ponto e clique em **Set location**; depois toque em "Atualizar localização" na tela Sobre.
  A altitude pode aparecer como "Indisponível" quando o GPS não fornece esse dado.
- **Sem internet:** ative o **modo avião** no emulador e abra a tela Sobre.
- **Dark mode:** ative o *toggle* na tela Sobre, feche e abra o app — o tema continua salvo.

## Licença / Uso

Projeto acadêmico, sem fins comerciais.
