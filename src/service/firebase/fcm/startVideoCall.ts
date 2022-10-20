import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import runInBackground from 'enevti-app/utils/background/task/runInBackground';
import { getMyPublicKey, parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { displayIncomingCall } from 'enevti-app/service/call/device';
import { makeUrl } from 'enevti-app/utils/constant/URLCreator';
import i18n from 'enevti-app/translations/i18n';
import { StartVideoCallPayload } from 'enevti-app/types/core/service/call';
import { DeviceEventEmitter, Platform } from 'react-native';
import IncomingCall from '@bob.hardcoder/react-native-incoming-call';
import { videoCallSocketBase } from 'enevti-app/utils/network';
import { EventRegister } from 'react-native-event-listeners';
import { selectDisplayState } from 'enevti-app/store/slices/ui/screen/display';
import { store } from 'enevti-app/store/state';
import { createSignature } from 'enevti-app/utils/cryptography';
import RNCallKeep from 'react-native-callkeep';
import messaging from '@react-native-firebase/messaging';
import AppReadyInstance from 'enevti-app/utils/app/ready';

export default async function startVideoCallFCMHandler(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  await runInBackground(async () => {
    const socket = videoCallSocketBase();
    const publicKey = await getMyPublicKey();
    const display = selectDisplayState(store.getState());
    const data = JSON.parse(remoteMessage.data!.payload) as StartVideoCallPayload;
    const signature = await createSignature(data.payload.id);
    const rejectData = data.payload.rejectData;
    const rejectSignature = await createSignature(rejectData);

    socket.emit('ringing', { nftId: data.payload.id, callId: data.uuid, emitter: publicKey, signature });
    const avatarUrl = makeUrl(data.payload.avatarUrl);

    displayIncomingCall(
      data.uuid,
      parsePersonaLabel(data.payload.callerPersona),
      i18n.t('redeem:videoCallIncomingAndroidLabel', { nft: data.payload.serial }),
      avatarUrl,
    );

    if (Platform.OS === 'android') {
      const endCallSubsribtion = DeviceEventEmitter.addListener('endCall', async () => {
        socket.emit('rejected', {
          nftId: data.payload.id,
          callId: data.uuid,
          emitter: publicKey,
          signature: rejectSignature,
        });
        socket.disconnect();
        endCallSubsribtion.remove();
        answerCallSubcription.remove();
      });

      const answerCallSubcription = DeviceEventEmitter.addListener('answerCall', payload => {
        socket.emit('accepted', { nftId: data.payload.id, callId: data.uuid, emitter: publicKey, signature });
        endCallSubsribtion.remove();
        answerCallSubcription.remove();
        socket.disconnect();
        const params = { nftId: data.payload.id, isAnswering: true, callId: payload.uuid };
        if (payload.isHeadless) {
          IncomingCall.openAppFromHeadlessMode(JSON.stringify(params));
        } else {
          if (!display.maximized) {
            IncomingCall.backToForeground();
          }
          EventRegister.emit('answerVideoCall', params);
        }
      });
    }

    if (Platform.OS === 'ios') {
      RNCallKeep.addEventListener('endCall', ({ callUUID }) => {
        RNCallKeep.endCall(callUUID);
        socket.emit('rejected', {
          nftId: data.payload.id,
          callId: data.uuid,
          emitter: publicKey,
          signature: rejectSignature,
        });
        socket.disconnect();
        RNCallKeep.removeEventListener('answerCall');
        RNCallKeep.removeEventListener('endCall');
      });

      RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
        socket.emit('accepted', { nftId: data.payload.id, callId: data.uuid, emitter: publicKey, signature });
        RNCallKeep.removeEventListener('answerCall');
        RNCallKeep.removeEventListener('endCall');
        RNCallKeep.endCall(callUUID);
        socket.disconnect();
        const params = { nftId: data.payload.id, isAnswering: true, callId: callUUID };
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
      });
    }
  });
}
