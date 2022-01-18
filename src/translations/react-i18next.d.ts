import { LANGUAGES } from './i18n';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: typeof LANGUAGES['en'];
  }
}
