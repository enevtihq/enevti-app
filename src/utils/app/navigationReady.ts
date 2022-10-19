import { EventRegister } from 'react-native-event-listeners';

export default class NavigationReady {
  static ready: boolean = false;

  static setReady() {
    NavigationReady.ready = true;
    EventRegister.emit('setNavigationIsReady');
  }

  static async awaitNavigationReady() {
    if (NavigationReady.ready === true) {
      return this.ready;
    } else {
      await new Promise(resolve => {
        const interval = setInterval(() => {
          if (NavigationReady.ready === true) {
            EventRegister.emit('setNavigationIsReady');
          }
        }, 250);
        const unsubscribe = EventRegister.addEventListener('setNavigationIsReady', () => {
          EventRegister.removeEventListener(unsubscribe.toString());
          clearInterval(interval);
          resolve(undefined);
        });
      });
      return true;
    }
  }
}
