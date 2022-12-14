import { EventRegister } from 'react-native-event-listeners';

export default class AppLikeReadyInstance {
  static ready: boolean = true;

  static setReady() {
    AppLikeReadyInstance.ready = true;
    EventRegister.emit('setLikeIsReady');
  }

  static setNotReady() {
    AppLikeReadyInstance.ready = false;
  }

  static async awaitLikeReady() {
    if (AppLikeReadyInstance.ready === true) {
      return this.ready;
    } else {
      await new Promise(resolve => {
        const interval = setInterval(() => {
          if (AppLikeReadyInstance.ready === true) {
            EventRegister.emit('setLikeIsReady');
          }
        }, 250);
        const unsubscribe = EventRegister.addEventListener('setLikeIsReady', () => {
          EventRegister.removeEventListener(unsubscribe.toString());
          clearInterval(interval);
          resolve(undefined);
        });
      });
      return true;
    }
  }
}
