import darkTheme from './dark';
import defaultTheme from './default';

export function getTheme(mode: string) {
  return mode === 'dark' ? darkTheme : defaultTheme;
}
