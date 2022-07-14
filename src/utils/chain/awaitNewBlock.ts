import i18n from 'enevti-app/translations/i18n';
import { EventRegister } from 'react-native-event-listeners';
import { BLOCK_TIME } from '../constant/identifier';

export default async function awaitNewBlock(): Promise<void> {
  const blockTime = await BLOCK_TIME();
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(i18n.t('error:timeout')), blockTime * 12);
    const unsubscribe = EventRegister.addEventListener('resolveNewBlock', () => {
      EventRegister.removeEventListener(unsubscribe.toString());
      clearTimeout(timeout);
      resolve();
    });
  });
}
