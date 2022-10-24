import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import { EventRegister } from 'react-native-event-listeners';
import IncomingCall from '@bob.hardcoder/react-native-incoming-call';

export default async function cancelVideoCallFCMHandler(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  const payload = JSON.parse(remoteMessage.data!.payload) as { uuid: string };
  if (Platform.OS === 'android') {
    IncomingCall.dismiss();
    EventRegister.emit('cancelSetupAndroidVideoCallHandlerWithAwait');
  }
  if (Platform.OS === 'ios') {
    RNCallKeep.endCall(payload.uuid);
    RNCallKeep.removeEventListener('answerCall');
    RNCallKeep.removeEventListener('endCall');
  }
}
