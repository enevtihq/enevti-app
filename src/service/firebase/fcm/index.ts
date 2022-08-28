import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import deliverSecretNotifFCMHandler from './deliverSecretNotif';
import newRaffledFCMHandler from './newRaffled';
import startVideoCallFCMHandler from './startVideoCall';
import wonRaffleFCMHandler from './wonRaffle';

export default async function handleFCM(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  if (remoteMessage.data && remoteMessage.data.type) {
    switch (remoteMessage.data.type) {
      case 'deliverSecretNotif':
        await deliverSecretNotifFCMHandler(remoteMessage);
        break;
      case 'newRaffled':
        await newRaffledFCMHandler(remoteMessage);
        break;
      case 'wonRaffle':
        await wonRaffleFCMHandler(remoteMessage);
        break;
      case 'startVideoCall':
        await startVideoCallFCMHandler(remoteMessage);
        break;
      default:
        break;
    }
  }
}
