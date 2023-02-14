import { DisplayInitialState } from 'enevti-app/store/slices/ui/screen/display';
import { StartVideoCallPayload } from 'enevti-types/service/call';
import { EmitterSubscription, Platform, DeviceEventEmitter } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { Socket } from 'socket.io-client';
import IncomingCall from '@bob.hardcoder/react-native-incoming-call';
import sleep from 'enevti-app/utils/dummy/sleep';
import { CALL_AWAIT_TIME } from '.';

type AwaitAndroidCallSetupPayload = { socket: Socket; publicKey: string; signature: string };

async function awaitAndroidCallSetup(): Promise<AwaitAndroidCallSetupPayload> {
  return new Promise(resolve => {
    const unsubscribe = EventRegister.addEventListener(
      'androidVideoCallReady',
      (payload: AwaitAndroidCallSetupPayload) => {
        EventRegister.removeEventListener(unsubscribe.toString());
        resolve(payload);
      },
    );
  });
}

function AndroidEndCallHandler(
  socket: Socket,
  payload: StartVideoCallPayload,
  publicKey: string,
  signature: string,
  endCallSubsribtion: EmitterSubscription,
  answerCallSubcription: EmitterSubscription,
) {
  socket.emit('rejected', {
    nftId: payload.data.id,
    callId: payload.uuid,
    emitter: publicKey,
    signature,
  });
  socket.disconnect();
  endCallSubsribtion.remove();
  answerCallSubcription.remove();
}

function AndroidAnswerCallHandler(
  socket: Socket,
  payload: StartVideoCallPayload,
  answerCallPayload: any,
  display: DisplayInitialState,
  publicKey: string,
  signature: string,
  endCallSubsribtion: EmitterSubscription,
  answerCallSubcription: EmitterSubscription,
) {
  socket.emit('accepted', { nftId: payload.data.id, callId: payload.uuid, emitter: publicKey, signature });
  endCallSubsribtion.remove();
  answerCallSubcription.remove();
  socket.disconnect();
  const params = { nftId: payload.data.id, isAnswering: true, callId: answerCallPayload.uuid };
  if (answerCallPayload.isHeadless) {
    IncomingCall.openAppFromHeadlessMode(JSON.stringify(params));
  } else {
    if (!display.maximized) {
      IncomingCall.backToForeground();
    }
    EventRegister.emit('answerVideoCall', params);
  }
}

export function setupAndroidVideoCallHandler(
  socket: Socket,
  payload: StartVideoCallPayload,
  publicKey: string,
  signature: string,
  display: DisplayInitialState,
) {
  if (Platform.OS === 'android') {
    const endCallSubsribtion = DeviceEventEmitter.addListener('endCall', () => {
      sleep(CALL_AWAIT_TIME).then(() =>
        AndroidEndCallHandler(socket, payload, publicKey, signature, endCallSubsribtion, answerCallSubcription),
      );
    });

    const answerCallSubcription = DeviceEventEmitter.addListener('answerCall', answerCallPayload => {
      sleep(CALL_AWAIT_TIME).then(() =>
        AndroidAnswerCallHandler(
          socket,
          payload,
          answerCallPayload,
          display,
          publicKey,
          signature,
          endCallSubsribtion,
          answerCallSubcription,
        ),
      );
    });
  }
}

export function setupAndroidVideoCallHandlerWithAwait(
  data: StartVideoCallPayload,
  display: DisplayInitialState,
  onInteraction: () => void,
) {
  if (Platform.OS === 'android') {
    const endCallSubsribtion = DeviceEventEmitter.addListener('endCall', async () => {
      onInteraction();
      awaitAndroidCallSetup().then(payload => {
        sleep(CALL_AWAIT_TIME).then(() => {
          AndroidEndCallHandler(
            payload.socket,
            data,
            payload.publicKey,
            payload.signature,
            endCallSubsribtion,
            answerCallSubcription,
          );
        });
      });
    });

    const answerCallSubcription = DeviceEventEmitter.addListener('answerCall', answerCallPayload => {
      onInteraction();
      awaitAndroidCallSetup().then(payload => {
        sleep(CALL_AWAIT_TIME).then(() => {
          AndroidAnswerCallHandler(
            payload.socket,
            data,
            answerCallPayload,
            display,
            payload.publicKey,
            payload.signature,
            endCallSubsribtion,
            answerCallSubcription,
          );
        });
      });
    });

    const unsubscribe = EventRegister.addEventListener('cancelSetupAndroidVideoCallHandlerWithAwait', () => {
      endCallSubsribtion.remove();
      answerCallSubcription.remove();
      EventRegister.removeEventListener(unsubscribe.toString());
    });
  }
}
