import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { getNFTbyId } from 'enevti-app/service/enevti/nft';
import runInBackground from 'enevti-app/utils/background/task/runInBackground';
import { getMyAddress, getMyPublicKey, parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { displayIncomingCall } from 'enevti-app/service/call/device';
import { getAvatarUrl } from 'enevti-app/service/enevti/avatar';
import { makeUrl } from 'enevti-app/utils/constant/URLCreator';
import i18n from 'enevti-app/translations/i18n';
import { StartVideoCallPayload } from 'enevti-app/types/core/service/call';
import { DeviceEventEmitter } from 'react-native';
import IncomingCall from '@bob.hardcoder/react-native-incoming-call';
import { videoCallSocketBase } from 'enevti-app/utils/network';
import { EventRegister } from 'react-native-event-listeners';
import { selectDisplayState } from 'enevti-app/store/slices/ui/screen/display';
import { store } from 'enevti-app/store/state';

export default async function startVideoCallFCMHandler(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  await runInBackground(async () => {
    const socket = videoCallSocketBase();
    const publicKey = await getMyPublicKey();
    const display = selectDisplayState(store.getState());
    const data = JSON.parse(remoteMessage.data!.payload) as StartVideoCallPayload;
    const nft = await getNFTbyId(data.nftId);
    if (nft.status === 200) {
      socket.emit('ringing', { callId: data.socketId, emitter: publicKey });
      const myAddress = await getMyAddress();
      const callerPersona = myAddress === nft.data.owner.address ? nft.data.creator : nft.data.owner;
      const avatarEndpoint = await getAvatarUrl(callerPersona.address);
      const avatarUrl = makeUrl(avatarEndpoint.data);

      displayIncomingCall(
        data.socketId,
        parsePersonaLabel(callerPersona),
        i18n.t('redeem:videoCallIncomingAndroidLabel', { nft: `${nft.data.symbol}#${nft.data.serial}` }),
        avatarUrl,
      );

      const endCallSubsribtion = DeviceEventEmitter.addListener('endCall', () => {
        socket.disconnect();
        endCallSubsribtion.remove();
        answerCallSubcription.remove();
      });

      const answerCallSubcription = DeviceEventEmitter.addListener('answerCall', payload => {
        socket.emit('accepted', { callId: data.socketId, emitter: publicKey });
        endCallSubsribtion.remove();
        answerCallSubcription.remove();
        socket.disconnect();
        const params = { nftId: nft.data.id, isAnswering: true, callId: payload.uuid };
        if (payload.isHeadless) {
          IncomingCall.openAppFromHeadlessMode(JSON.stringify(params));
        } else {
          if (!display.maximized) {
            IncomingCall.backToForeground();
          }
          EventRegister.emit('answerCall', params);
        }
      });
    }
  });
}
