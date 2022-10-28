import Sound from 'react-native-sound';
import { loadSoundAsync } from '.';

export default class CallingSound {
  static instance: Sound | undefined;

  static async getInstance() {
    if (CallingSound.instance === undefined) {
      CallingSound.instance = await loadSoundAsync('calling.aac');
      CallingSound.instance.setNumberOfLoops(-1);
    }

    return CallingSound.instance;
  }

  static async play(callback?: () => void) {
    const callingSound = await CallingSound.getInstance();
    callingSound.play(callback);
  }

  static async release() {
    const callingSound = await CallingSound.getInstance();
    callingSound.release();
    CallingSound.instance = undefined;
  }

  static async stop() {
    const callingSound = await CallingSound.getInstance();
    callingSound.stop();
  }
}
