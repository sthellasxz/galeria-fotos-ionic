import { onMounted, onUnmounted, ref } from 'vue';
import type { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';

/**
 * Acompanha em tempo real se o dispositivo está com ou sem internet.
 */
export function useNetworkStatus() {
  const isOnline = ref(true);
  const connectionType = ref<string>('unknown');

  let listener: PluginListenerHandle | null = null;

  onMounted(async () => {
    const status = await Network.getStatus();
    isOnline.value = status.connected;
    connectionType.value = status.connectionType;

    listener = await Network.addListener('networkStatusChange', (newStatus) => {
      isOnline.value = newStatus.connected;
      connectionType.value = newStatus.connectionType;
    });
  });

  onUnmounted(() => {
    listener?.remove();
  });

  return { isOnline, connectionType };
}
