import type { LocalStorageService } from '../core/storage/LocalStorageService';
import { themeModes, type ThemeMode } from './ThemeMode';

const themeStorageKey = 'symbly.themeMode';

export class ThemeController extends EventTarget {
  private mode: ThemeMode = 'system';
  private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor(private readonly storage: LocalStorageService) {
    super();
    const storedMode = this.storage.get(themeStorageKey);
    if (storedMode && this.isThemeMode(storedMode)) {
      this.mode = storedMode;
    }

    this.mediaQuery.addEventListener('change', () => this.applyTheme());
    this.applyTheme();
  }

  getMode(): ThemeMode {
    return this.mode;
  }

  setMode(mode: ThemeMode): void {
    this.mode = mode;
    this.storage.set(themeStorageKey, mode);
    this.applyTheme();
    this.dispatchEvent(new CustomEvent<ThemeMode>('theme-mode-change', { detail: mode }));
  }

  private applyTheme(): void {
    const resolvedTheme = this.mode === 'system'
      ? (this.mediaQuery.matches ? 'dark' : 'light')
      : this.mode;

    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.themeMode = this.mode;
    document.documentElement.style.colorScheme = resolvedTheme;
  }

  private isThemeMode(value: string): value is ThemeMode {
    return themeModes.includes(value as ThemeMode);
  }
}
