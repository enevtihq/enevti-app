import i18n, { LanguageDetectorModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './en';
import { getLanguageState, setLanguage } from '../store/slices/userSetting';
import { store } from '../store/state';

const stateStore = store;

export const LANGUAGES = {
  en,
} as const;

const LANG_CODES = Object.keys(LANGUAGES);
const DEFAULT_LANG = 'en';

const LANGUAGE_DETECTOR: LanguageDetectorModule = {
  type: 'languageDetector',
  init: () => {},
  detect: () => {
    const userSettingLanguage = getLanguageState(stateStore.getState());
    if (
      userSettingLanguage === 'system' ||
      !LANG_CODES.includes(userSettingLanguage)
    ) {
      const bestLang = RNLocalize.findBestAvailableLanguage(LANG_CODES);
      return bestLang ? bestLang.languageTag : DEFAULT_LANG;
    }
    return userSettingLanguage;
  },
  cacheUserLanguage: language => {
    stateStore.dispatch(setLanguage(language));
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: LANGUAGES,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
