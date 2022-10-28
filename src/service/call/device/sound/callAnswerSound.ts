import Sound from 'react-native-sound';
import { loadSoundAsync } from '.';

export default class CallAnswerSound {
  static instance: Sound | undefined;

  static async getInstance() {
    if (CallAnswerSound.instance === undefined) {
      CallAnswerSound.instance = await loadSoundAsync('call_answer.aac');
    }

    return CallAnswerSound.instance;
  }

  static async play(callback?: () => void) {
    const callAnswerSound = await CallAnswerSound.getInstance();
    callAnswerSound.play(callback);
  }

  static async release() {
    const callAnswerSound = await CallAnswerSound.getInstance();
    callAnswerSound.release();
    CallAnswerSound.instance = undefined;
  }

  static async stop() {
    const callAnswerSound = await CallAnswerSound.getInstance();
    callAnswerSound.stop();
  }
}
