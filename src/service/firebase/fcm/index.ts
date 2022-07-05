import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import deliverSecretNotifFCMHandler from './deliverSecretNotif';

export default async function handleFCM(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  if (remoteMessage.data && remoteMessage.data.type) {
    switch (remoteMessage.data.type) {
      case 'deliverSecretNotif':
        deliverSecretNotifFCMHandler(remoteMessage);
        break;
      default:
        break;
    }
  }
}
