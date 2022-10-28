import Sound from 'react-native-sound';
import { loadSoundAsync } from '.';

export default class MessageReceivedSound {
  static instance: Sound | undefined;

  static async getInstance() {
    if (MessageReceivedSound.instance === undefined) {
      MessageReceivedSound.instance = await loadSoundAsync('message_received.aac');
      MessageReceivedSound.instance.setNumberOfLoops(-1);
    }

    return MessageReceivedSound.instance;
  }

  static async play(callback?: () => void) {
    const messageReceivedSound = await MessageReceivedSound.getInstance();
    messageReceivedSound.play(callback);
  }

  static async release() {
    const messageReceivedSound = await MessageReceivedSound.getInstance();
    messageReceivedSound.release();
    MessageReceivedSound.instance = undefined;
  }

  static async stop() {
    const messageReceivedSound = await MessageReceivedSound.getInstance();
    messageReceivedSound.stop();
  }
}
