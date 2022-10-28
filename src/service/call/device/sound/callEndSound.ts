import Sound from 'react-native-sound';
import { loadSoundAsync } from '.';

export default class CallEndSound {
  static instance: Sound | undefined;

  static async getInstance() {
    if (CallEndSound.instance === undefined) {
      CallEndSound.instance = await loadSoundAsync('call_end.aac');
    }

    return CallEndSound.instance;
  }

  static async play(callback?: () => void) {
    const callEndSound = await CallEndSound.getInstance();
    callEndSound.play(callback);
  }

  static async release() {
    const callEndSound = await CallEndSound.getInstance();
    callEndSound.release();
    CallEndSound.instance = undefined;
  }

  static async stop() {
    const callEndSound = await CallEndSound.getInstance();
    callEndSound.stop();
  }
}
