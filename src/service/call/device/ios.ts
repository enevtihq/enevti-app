import { DisplayInitialState } from 'enevti-app/store/slices/ui/screen/display';
import { StartVideoCallPayloadIOS } from 'enevti-app/types/core/service/call';
import AppReadyInstance from 'enevti-app/utils/app/ready';
import { Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import { EventRegister } from 'react-native-event-listeners';
import { Socket } from 'socket.io-client';
import messaging from '@react-native-firebase/messaging';
import sleep from 'enevti-app/utils/dummy/sleep';
import { CALL_AWAIT_TIME } from '.';

type AwaitIOSCallSetupPayload = { socket: Socket; publicKey: string; signature: string };

async function awaitIOSCallSetup(): Promise<AwaitIOSCallSetupPayload> {
  return new Promise(resolve => {
    const unsubscribe = EventRegister.addEventListener('iosVideoCallReady', (payload: AwaitIOSCallSetupPayload) => {
      EventRegister.removeEventListener(unsubscribe.toString());
      resolve(payload);
    });
  });
}

function IOSEndCallHandler(
  socket: Socket,
  callKeepId: string,
  payload: StartVideoCallPayloadIOS,
  publicKey: string,
  signature: string,
) {
  RNCallKeep.endCall(callKeepId);
  socket.emit('rejected', {
    nftId: payload.data.id,
    callId: payload.uuid,
    emitter: publicKey,
    signature,
  });
  socket.disconnect();
  RNCallKeep.removeEventListener('answerCall');
  RNCallKeep.removeEventListener('endCall');
}

function IOSAnswerCallHandler(
  socket: Socket,
  callKeepId: string,
  payload: StartVideoCallPayloadIOS,
  publicKey: string,
  signature: string,
  display: DisplayInitialState,
) {
  socket.emit('accepted', { nftId: payload.data.id, callId: payload.uuid, emitter: publicKey, signature });
  RNCallKeep.removeEventListener('answerCall');
  RNCallKeep.removeEventListener('endCall');
  RNCallKeep.endCall(callKeepId);
  socket.disconnect();
  const params = { nftId: payload.data.id, isAnswering: true, callId: callKeepId };
  messaging()
    .getIsHeadless()
    .then(isHeadless => {
      if (isHeadless) {
        AppReadyInstance.awaitAppReady().then(() => {
          EventRegister.emit('answerVideoCall', params);
        });
      } else {
        if (!display.maximized) {
          RNCallKeep.backToForeground();
        }
        EventRegister.emit('answerVideoCall', params);
      }
    });
}

export async function setupIOSVideoCallHandler(
  socket: Socket,
  payload: StartVideoCallPayloadIOS,
  publicKey: string,
  signature: string,
  display: DisplayInitialState,
) {
  if (Platform.OS === 'ios') {
    RNCallKeep.addEventListener('endCall', ({ callUUID }) => {
      sleep(CALL_AWAIT_TIME).then(() => IOSEndCallHandler(socket, callUUID, payload, publicKey, signature));
    });

    RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
      sleep(CALL_AWAIT_TIME).then(() => IOSAnswerCallHandler(socket, callUUID, payload, publicKey, signature, display));
    });
  }
}

export async function setupIOSVideoCallHandlerWithAwait(
  data: StartVideoCallPayloadIOS,
  display: DisplayInitialState,
  onInteraction: () => void,
) {
  if (Platform.OS === 'ios') {
    RNCallKeep.addEventListener('endCall', ({ callUUID }) => {
      onInteraction();
      awaitIOSCallSetup().then(payload =>
        sleep(CALL_AWAIT_TIME).then(() =>
          IOSEndCallHandler(payload.socket, callUUID, data, payload.publicKey, payload.signature),
        ),
      );
    });

    RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
      onInteraction();
      awaitIOSCallSetup().then(payload =>
        sleep(CALL_AWAIT_TIME).then(() =>
          IOSAnswerCallHandler(payload.socket, callUUID, data, payload.publicKey, payload.signature, display),
        ),
      );
    });
  }
}
