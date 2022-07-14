import { EventRegister } from 'react-native-event-listeners';

export default async function awaitNewBlock(): Promise<void> {
  return new Promise(resolve => {
    const unsubscribe = EventRegister.addEventListener('resolveNewBlock', () => {
      EventRegister.removeEventListener(unsubscribe.toString());
      resolve();
    });
  });
}
