import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import deliverSecretNotifFCMHandler from './deliverSecretNotif';
import newRaffledFCMHandler from './newRaffled';
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
      default:
        break;
    }
  }
}
