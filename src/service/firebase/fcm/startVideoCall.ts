import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import runInBackground from 'enevti-app/utils/background/task/runInBackground';
import { getMyPublicKey, parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { displayIncomingCall } from 'enevti-app/service/call/device';
import { makeUrl } from 'enevti-app/utils/constant/URLCreator';
import i18n from 'enevti-app/translations/i18n';
import { StartVideoCallPayload } from 'enevti-app/types/core/service/call';
import { Platform } from 'react-native';
import { videoCallSocketBase } from 'enevti-app/utils/network';
import { EventRegister } from 'react-native-event-listeners';
import { selectDisplayState } from 'enevti-app/store/slices/ui/screen/display';
import { store } from 'enevti-app/store/state';
import { createSignature } from 'enevti-app/utils/cryptography';
import RNCallKeep from 'react-native-callkeep';
import { setupIOSVideoCallHandler, setupIOSVideoCallHandlerWithAwait } from 'enevti-app/service/call/device/ios';
import {
  setupAndroidVideoCallHandler,
  setupAndroidVideoCallHandlerWithAwait,
} from 'enevti-app/service/call/device/android';

export default async function startVideoCallFCMHandler(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  await runInBackground(async () => {
    const payload = JSON.parse(remoteMessage.data!.payload) as StartVideoCallPayload;
    const avatarUrl = makeUrl(payload.data.avatarUrl);
    displayIncomingCall(
      payload.uuid,
      parsePersonaLabel(payload.data.callerPersona),
      i18n.t('redeem:videoCallIncomingAndroidLabel', { nft: payload.data.serial }),
      avatarUrl,
    );

    let callInteracted = false;
    const display = selectDisplayState(store.getState());
    const iosPayload = {
      ...payload,
      handle: parsePersonaLabel(payload.data.callerPersona),
      callerName: i18n.t('redeem:videoCallIncomingAndroidLabel', { nft: payload.data.serial }),
    };

    if (Platform.OS === 'ios') {
      setupIOSVideoCallHandlerWithAwait(iosPayload, display, () => (callInteracted = true));
    }

    if (Platform.OS === 'android') {
      setupAndroidVideoCallHandlerWithAwait(payload, display, () => (callInteracted = true));
    }

    const socket = videoCallSocketBase();
    const publicKey = await getMyPublicKey();
    const signatureFormat = payload.data.signatureFormat;
    const signature = await createSignature(signatureFormat);
    socket.on('callRinged', () => {});
    socket.emit('ringing', { nftId: payload.data.id, callId: payload.uuid, emitter: publicKey, signature });

    if (!callInteracted) {
      if (Platform.OS === 'ios') {
        setupIOSVideoCallHandler(socket, iosPayload, publicKey, signature, display);
        RNCallKeep.removeEventListener('answerCall');
        RNCallKeep.removeEventListener('endCall');
      }
      if (Platform.OS === 'android') {
        setupAndroidVideoCallHandler(socket, payload, publicKey, signature, display);
        EventRegister.emit('cancelSetupAndroidVideoCallHandlerWithAwait');
      }
    } else {
      if (Platform.OS === 'ios') {
        EventRegister.emit('iosVideoCallReady', { socket, publicKey, signature });
      }
      if (Platform.OS === 'android') {
        EventRegister.emit('androidVideoCallReady', { socket, publicKey, signature });
      }
    }
  });
}
