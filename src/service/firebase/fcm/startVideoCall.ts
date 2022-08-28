import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { getNFTbyId } from 'enevti-app/service/enevti/nft';
import runInBackground from 'enevti-app/utils/background/task/runInBackground';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { displayIncomingCall } from 'enevti-app/service/call/device';

export default async function startVideoCallFCMHandler(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  await runInBackground(async () => {
    const data = JSON.parse(remoteMessage.data!.payload) as {
      socketId: string;
      nftId: string;
    };
    const nft = await getNFTbyId(data.nftId);
    if (nft.status === 200) {
      displayIncomingCall(
        data.socketId, // TODO: convert to uuid.v4
        parsePersonaLabel(nft.data.owner),
        `Redeem NFT Video Call of ${nft.data.symbol}#${nft.data.serial}`, // TODO: localize
      );
    }
  });
}
