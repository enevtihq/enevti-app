import { EventRegister } from 'react-native-event-listeners';

export default class AppReadyInstance {
  static ready: boolean = false;

  static setReady() {
    AppReadyInstance.ready = true;
    EventRegister.emit('setAppIsReady');
  }

  static async awaitAppReady() {
    if (AppReadyInstance.ready === true) {
      return this.ready;
    } else {
      await new Promise(resolve => {
        const interval = setInterval(() => {
          if (AppReadyInstance.ready === true) {
            EventRegister.emit('setAppIsReady');
          }
        }, 250);
        const unsubscribe = EventRegister.addEventListener('setAppIsReady', () => {
          EventRegister.removeEventListener(unsubscribe.toString());
          clearInterval(interval);
          resolve(undefined);
        });
      });
      return true;
    }
  }
}
