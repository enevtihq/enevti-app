import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import runInBackground from 'enevti-app/utils/background/task/runInBackground';
import { getMyPublicKey, parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { displayIncomingCall } from 'enevti-app/service/call/device';
import { makeUrl } from 'enevti-app/utils/constant/URLCreator';
import i18n from 'enevti-app/translations/i18n';
import { StartVideoCallPayload, StartVideoCallPayloadIOS } from 'enevti-app/types/core/service/call';
import { DeviceEventEmitter, Platform } from 'react-native';
import IncomingCall from '@bob.hardcoder/react-native-incoming-call';
import { videoCallSocketBase } from 'enevti-app/utils/network';
import { EventRegister } from 'react-native-event-listeners';
import { DisplayInitialState, selectDisplayState } from 'enevti-app/store/slices/ui/screen/display';
import { store } from 'enevti-app/store/state';
import { createSignature } from 'enevti-app/utils/cryptography';
import RNCallKeep from 'react-native-callkeep';
import messaging from '@react-native-firebase/messaging';
import AppReadyInstance from 'enevti-app/utils/app/ready';
import { Socket } from 'socket.io-client';

type AwaitIOSCallSetupPayload = { socket: Socket; publicKey: string; signature: string; rejectSignature: string };

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
  rejectSignature: string,
) {
  RNCallKeep.endCall(callKeepId);
  socket.emit('rejected', {
    nftId: payload.data.id,
    callId: payload.uuid,
    emitter: publicKey,
    signature: rejectSignature,
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
  rejectSignature: string,
  display: DisplayInitialState,
  withCall: boolean,
) {
  if (Platform.OS === 'ios') {
    RNCallKeep.addEventListener('endCall', ({ callUUID }) => {
      IOSEndCallHandler(socket, callUUID, payload, publicKey, rejectSignature);
    });

    RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
      IOSAnswerCallHandler(socket, callUUID, payload, publicKey, signature, display);
    });

    if (withCall) {
      displayIncomingCall(
        payload.uuid,
        parsePersonaLabel(payload.data.callerPersona),
        i18n.t('redeem:videoCallIncomingAndroidLabel', { nft: payload.data.serial }),
      );
    }
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
        IOSEndCallHandler(payload.socket, callUUID, data, payload.publicKey, payload.rejectSignature),
      );
    });

    RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
      onInteraction();
      awaitIOSCallSetup().then(payload =>
        IOSAnswerCallHandler(payload.socket, callUUID, data, payload.publicKey, payload.signature, display),
      );
    });
  }
}

function setupAndroidVideoCallHandler(
  socket: Socket,
  payload: StartVideoCallPayload,
  publicKey: string,
  signature: string,
  rejectSignature: string,
  display: DisplayInitialState,
  avatarUrl: string,
) {
  if (Platform.OS === 'android') {
    const endCallSubsribtion = DeviceEventEmitter.addListener('endCall', async () => {
      socket.emit('rejected', {
        nftId: payload.data.id,
        callId: payload.uuid,
        emitter: publicKey,
        signature: rejectSignature,
      });
      socket.disconnect();
      endCallSubsribtion.remove();
      answerCallSubcription.remove();
    });

    const answerCallSubcription = DeviceEventEmitter.addListener('answerCall', answerCallPayload => {
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
    });

    displayIncomingCall(
      payload.uuid,
      parsePersonaLabel(payload.data.callerPersona),
      i18n.t('redeem:videoCallIncomingAndroidLabel', { nft: payload.data.serial }),
      avatarUrl,
    );
  }
}

export default async function startVideoCallFCMHandler(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  await runInBackground(async () => {
    const payload = JSON.parse(remoteMessage.data!.payload) as StartVideoCallPayload;

    const socket = videoCallSocketBase();
    const publicKey = await getMyPublicKey();
    const signature = await createSignature(payload.data.id);
    socket.emit('ringing', { nftId: payload.data.id, callId: payload.uuid, emitter: publicKey, signature });

    const rejectData = payload.data.rejectData;
    const rejectSignature = await createSignature(rejectData);
    const display = selectDisplayState(store.getState());
    const avatarUrl = makeUrl(payload.data.avatarUrl);

    setupAndroidVideoCallHandler(socket, payload, publicKey, signature, rejectSignature, display, avatarUrl);

    const iosPayload = {
      ...payload,
      handle: parsePersonaLabel(payload.data.callerPersona),
      callerName: i18n.t('redeem:videoCallIncomingAndroidLabel', { nft: payload.data.serial }),
    };
    setupIOSVideoCallHandler(socket, iosPayload, publicKey, signature, rejectSignature, display, true);
  });
}
