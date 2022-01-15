import darkTheme from './darkTheme';
import defaultTheme from './defaultTheme';

export function getTheme(mode: string) {
  return mode === 'dark' ? darkTheme : defaultTheme;
}
