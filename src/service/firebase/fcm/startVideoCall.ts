import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { getNFTbyId } from 'enevti-app/service/enevti/nft';
import runInBackground from 'enevti-app/utils/background/task/runInBackground';
import { getMyAddress, parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { displayIncomingCall } from 'enevti-app/service/call/device';
import { getAvatarUrl } from 'enevti-app/service/enevti/avatar';
import { makeUrl } from 'enevti-app/utils/constant/URLCreator';
import i18n from 'enevti-app/translations/i18n';
import { StartVideoCallPayload } from 'enevti-app/types/core/service/call';

export default async function startVideoCallFCMHandler(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  await runInBackground(async () => {
    const data = JSON.parse(remoteMessage.data!.payload) as StartVideoCallPayload;
    const nft = await getNFTbyId(data.nftId);
    if (nft.status === 200) {
      const myAddress = await getMyAddress();
      const callerPersona = myAddress === nft.data.owner.address ? nft.data.owner : nft.data.creator;
      const avatarEndpoint = await getAvatarUrl(callerPersona.address);
      const avatarUrl = makeUrl(avatarEndpoint.data);
      displayIncomingCall(
        data.socketId,
        parsePersonaLabel(callerPersona),
        i18n.t('redeem:videoCallIncomingAndroidLabel', { nft: `${nft.data.symbol}#${nft.data.serial}` }),
        avatarUrl,
      );
    }
  });
}
