import i18n from 'enevti-app/translations/i18n';
import { EventRegister } from 'react-native-event-listeners';

export default async function awaitNewBlock(): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(i18n.t('error:timeout')), 25000);
    const unsubscribe = EventRegister.addEventListener('resolveNewBlock', () => {
      EventRegister.removeEventListener(unsubscribe.toString());
      clearTimeout(timeout);
      resolve();
    });
  });
}
