export type ThemeMode = 'dark' | 'light-blue';

export function getInitialTheme(): ThemeMode {
  return 'dark';
}

export function applyTheme(theme: ThemeMode = 'dark'): void {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light-blue');
    } else {
      document.documentElement.classList.add('theme-light-blue');
      document.documentElement.classList.remove('theme-dark');
    }
  }
}
