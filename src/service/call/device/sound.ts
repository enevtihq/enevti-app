type RNSound = {
  setNumberOfLoops: (loop: number) => void;
  setVolume: (loop: number) => void;
  setPan: (loop: number) => void;
  setCurrentTime: (loop: number) => void;
  pause: () => void;
  release: () => void;
  play: (cb?: (success: any) => void) => void;
  stop: (cb?: () => void) => void;
  getCurrentTime: (cb: (second: number) => void) => void;
};

const Sound = require('react-native-sound');
Sound.setCategory('Playback');

export let callAnswerSound: RNSound | undefined;
export let callEndSound: RNSound | undefined;
export let callingSound: RNSound | undefined;
export let callBusySound: RNSound | undefined;
export let messageReceivedSound: RNSound | undefined;
export let messageSentSound: RNSound | undefined;

function loadSoundAsync(path: string) {
  return new Promise<RNSound>((resolve, reject) => {
    const ret = new Sound(path, Sound.MAIN_BUNDLE, (error: any) => {
      if (error) {
        reject();
      }
      resolve(ret);
    });
  });
}

export async function initCallSound() {
  try {
    callAnswerSound = await loadSoundAsync('call_answer.aac');
    callBusySound = await loadSoundAsync('call_busy.aac');
    callEndSound = await loadSoundAsync('call_end.aac');
    callingSound = await loadSoundAsync('calling.aac');
    messageReceivedSound = await loadSoundAsync('message_received.aac');
    messageSentSound = await loadSoundAsync('message_sent.aac');

    callBusySound.setNumberOfLoops(-1);
    callingSound.setNumberOfLoops(-1);
    return true;
  } catch {
    return false;
  }
}

export function cleanCallSound() {
  callAnswerSound?.release();
  callBusySound?.release();
  callEndSound?.release();
  callingSound?.release();
  messageReceivedSound?.release();
  messageSentSound?.release();
}

export function playCallAnswerSound(callback?: () => void) {
  callAnswerSound = new Sound('call_answer.aac', Sound.MAIN_BUNDLE, (error: any) => {
    if (!error) {
      callAnswerSound?.play(callback);
    }
  });
}

export function stopCallAnswerSound() {
  callAnswerSound?.stop();
}

export function playCallEndSound(callback?: () => void) {
  callEndSound = new Sound('call_end.aac', Sound.MAIN_BUNDLE, (error: any) => {
    if (!error) {
      callEndSound?.play(callback);
    }
  });
}

export function stopCallEndSound() {
  callEndSound?.stop();
}

export function playCallingSound(callback?: () => void) {
  callingSound = new Sound('calling.aac', Sound.MAIN_BUNDLE, (error: any) => {
    if (!error) {
      callingSound?.setNumberOfLoops(-1);
      callingSound?.play(callback);
    }
  });
}

export function stopCallingSound() {
  callingSound?.stop();
}

export function playCallBusySound(callback?: () => void) {
  callBusySound = new Sound('call_busy.aac', Sound.MAIN_BUNDLE, (error: any) => {
    if (!error) {
      callBusySound?.setNumberOfLoops(-1);
      callBusySound?.play(callback);
    }
  });
}

export function stopCallBusySound() {
  callBusySound?.stop();
}

export function playMessageReceivedSound(callback?: () => void) {
  messageReceivedSound = new Sound('message_received.aac', Sound.MAIN_BUNDLE, (error: any) => {
    if (!error) {
      messageReceivedSound?.play(callback);
    }
  });
}

export function stopMessageReceivedSound() {
  messageReceivedSound?.stop();
}

export function playMessageSentSound(callback?: () => void) {
  messageSentSound = new Sound('message_sent.aac', Sound.MAIN_BUNDLE, (error: any) => {
    if (!error) {
      messageSentSound?.play(callback);
    }
  });
}

export function stopMessageSentSound() {
  messageSentSound?.stop();
}
