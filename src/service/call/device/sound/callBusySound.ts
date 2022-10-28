import Sound from 'react-native-sound';
import { loadSoundAsync } from '.';

export default class CallBusySound {
  static instance: Sound | undefined;

  static async getInstance() {
    if (CallBusySound.instance === undefined) {
      CallBusySound.instance = await loadSoundAsync('call_busy.aac');
      CallBusySound.instance.setNumberOfLoops(-1);
    }

    return CallBusySound.instance;
  }

  static async play(callback?: () => void) {
    const callBusySound = await CallBusySound.getInstance();
    callBusySound.play(callback);
  }

  static async release() {
    const callBusySound = await CallBusySound.getInstance();
    callBusySound.release();
    CallBusySound.instance = undefined;
  }

  static async stop() {
    const callBusySound = await CallBusySound.getInstance();
    callBusySound.stop();
  }
}
