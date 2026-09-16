import { ref } from 'vue';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

export interface UserLocation {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
}

/**
 * Obtém a localização atual do usuário (latitude, longitude e altitude),
 * pedindo a permissão de localização quando necessário.
 */
export function useLocation() {
  const location = ref<UserLocation | null>(null);
  const loading = ref(false);
  const errorMessage = ref('');

  async function ensurePermission(): Promise<boolean> {
    // No navegador a permissão é pedida automaticamente pelo próprio browser.
    if (!Capacitor.isNativePlatform()) return true;

    let status = await Geolocation.checkPermissions();
    if (status.location !== 'granted') {
      status = await Geolocation.requestPermissions({ permissions: ['location'] });
    }
    return status.location === 'granted';
  }

  async function updateLocation(): Promise<void> {
    loading.value = true;
    errorMessage.value = '';

    try {
      const allowed = await ensurePermission();
      if (!allowed) {
        errorMessage.value = 'Permissão de localização negada.';
        return;
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });

      location.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy,
      };
    } catch {
      errorMessage.value = 'Não foi possível obter a localização. Verifique se o GPS está ativado.';
    } finally {
      loading.value = false;
    }
  }

  return { location, loading, errorMessage, updateLocation };
}
