import { Preferences } from '@capacitor/preferences';

// Chave usada no @capacitor/preferences para guardar a escolha do tema.
const DARK_MODE_KEY = 'darkMode';

/**
 * Aplica (ou remove) a paleta escura do Ionic adicionando a classe
 * `ion-palette-dark` no elemento <html>.
 */
export function applyTheme(isDark: boolean): void {
  document.documentElement.classList.toggle('ion-palette-dark', isDark);
}

/**
 * Lê a preferência salva e aplica o tema.
 * Se o usuário nunca escolheu, segue o tema do sistema.
 */
export async function loadThemePreference(): Promise<boolean> {
  const { value } = await Preferences.get({ key: DARK_MODE_KEY });

  const isDark =
    value !== null
      ? value === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;

  applyTheme(isDark);
  return isDark;
}

/** Aplica o tema escolhido e salva no Preferences. */
export async function saveThemePreference(isDark: boolean): Promise<void> {
  applyTheme(isDark);
  await Preferences.set({ key: DARK_MODE_KEY, value: String(isDark) });
}
