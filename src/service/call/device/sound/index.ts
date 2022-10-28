import Sound from 'react-native-sound';
import CallAnswerSound from './callAnswerSound';
import CallBusySound from './callBusySound';
import CallEndSound from './callEndSound';
import CallingSound from './callingSound';
import MessageReceivedSound from './messageReceivedSound';
import MessageSentSound from './messageSentSound';

export function loadSoundAsync(path: string) {
  return new Promise<Sound>((resolve, reject) => {
    const ret = new Sound(path, Sound.MAIN_BUNDLE, (error: any) => {
      if (error) {
        reject();
      }
      resolve(ret);
    });
  });
}

Sound.setCategory('MultiRoute', true);
Sound.setMode('VideoChat');

export async function initCallSound() {
  try {
    await CallAnswerSound.getInstance();
    await CallBusySound.getInstance();
    await CallEndSound.getInstance();
    await CallingSound.getInstance();
    await MessageReceivedSound.getInstance();
    await MessageSentSound.getInstance();
    return true;
  } catch {
    return false;
  }
}

export async function cleanCallSound() {
  await CallAnswerSound.release();
  await CallBusySound.release();
  await CallEndSound.release();
  await CallingSound.release();
  await MessageReceivedSound.release();
  await MessageSentSound.release();
}

export function playCallAnswerSound(callback?: () => void) {
  CallAnswerSound.play(callback);
}

export function stopCallAnswerSound() {
  CallAnswerSound.stop();
}

export function playCallEndSound(callback?: () => void) {
  CallEndSound.play(callback);
}

export function stopCallEndSound() {
  CallEndSound.stop();
}

export function playCallingSound(callback?: () => void) {
  CallingSound.play(callback);
}

export function stopCallingSound() {
  CallingSound.stop();
}

export function playCallBusySound(callback?: () => void) {
  CallBusySound.play(callback);
}

export function stopCallBusySound() {
  CallBusySound.stop();
}

export function playMessageReceivedSound(callback?: () => void) {
  MessageReceivedSound.play(callback);
}

export function stopMessageReceivedSound() {
  MessageReceivedSound.stop();
}

export function playMessageSentSound(callback?: () => void) {
  MessageSentSound.play(callback);
}

export function stopMessageSentSound() {
  MessageSentSound.stop();
}
