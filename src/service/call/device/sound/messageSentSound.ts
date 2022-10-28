import Sound from 'react-native-sound';
import { loadSoundAsync } from '.';

export default class MessageSentSound {
  static instance: Sound | undefined;

  static async getInstance() {
    if (MessageSentSound.instance === undefined) {
      MessageSentSound.instance = await loadSoundAsync('message_sent.aac');
      MessageSentSound.instance.setNumberOfLoops(-1);
    }

    return MessageSentSound.instance;
  }

  static async play(callback?: () => void) {
    const messageSentSound = await MessageSentSound.getInstance();
    messageSentSound.play(callback);
  }

  static async release() {
    const messageSentSound = await MessageSentSound.getInstance();
    messageSentSound.release();
    MessageSentSound.instance = undefined;
  }

  static async stop() {
    const messageSentSound = await MessageSentSound.getInstance();
    messageSentSound.stop();
  }
}
