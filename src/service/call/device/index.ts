import { handleError } from 'enevti-app/utils/error/handle';
import { Platform } from 'react-native';
import RNCallKeep, { IOptions, CONSTANTS } from 'react-native-callkeep';
import OverlayPermissionModule from 'rn-android-overlay-permission';
import IncomingCall from '@bob.hardcoder/react-native-incoming-call';
import VoipPushNotification from 'react-native-voip-push-notification';
import { StartVideoCallPayloadIOS } from 'enevti-app/types/core/service/call';

const ENEVTI_LOGO_URL = 'https://pbs.twimg.com/profile_images/1399393541294415873/83l_AT9i_400x400.jpg';

const options: IOptions = {
  android: { alertTitle: '', alertDescription: '', cancelButton: '', okButton: '', additionalPermissions: [] },
  ios: {
    appName: 'Enevti.com',
    includesCallsInRecents: false,
  },
};

export const DEVICE_CALL_CONSTANT = CONSTANTS;

export async function setupCall() {
  try {
    if (Platform.OS === 'ios') {
      RNCallKeep.setup(options);
    } else if (Platform.OS === 'android') {
      OverlayPermissionModule.isRequestOverlayPermissionGranted((status: any) => {
        if (status) {
          // TODO: improve user experience to request overlay permission & autostart permission
          OverlayPermissionModule.requestOverlayPermission();
        }
      });
    }
    RNCallKeep.addEventListener('didChangeAudioRoute', () => {});
  } catch (err) {
    handleError(err);
  }
}

export function displayIncomingCall(
  callId: string,
  number: string,
  callerName: string,
  avatar?: string,
  timeout: number = 60000,
) {
  if (Platform.OS === 'ios') {
    RNCallKeep.displayIncomingCall(callId, number, callerName, 'generic', true);
  } else if (Platform.OS === 'android') {
    IncomingCall.display(callId, number, avatar ?? ENEVTI_LOGO_URL, callerName, timeout);
  }
}

async function onVoipTokenRegistered(token: string) {
  // TODO: implement
  console.log(token);
}

async function onVoipNotificationReceived(notification: StartVideoCallPayloadIOS) {
  // TODO: implement
  displayIncomingCall(notification.uuid, 'aldhosutra@gmail.com', 'Test');
  VoipPushNotification.onVoipNotificationCompleted(notification.uuid);
}

export function setupVoipNotificationHandler() {
  if (Platform.OS === 'ios') {
    VoipPushNotification.addEventListener('register', (token: string) => {
      onVoipTokenRegistered(token);
    });

    VoipPushNotification.addEventListener('notification', (notification: StartVideoCallPayloadIOS) => {
      onVoipNotificationReceived(notification);
    });

    VoipPushNotification.addEventListener('didLoadWithEvents', _events => {
      if (!_events || !Array.isArray(_events) || _events.length < 1) {
        return;
      }
      for (let voipPushEvent of _events) {
        let { name, data } = voipPushEvent;
        if (name === 'RNVoipPushRemoteNotificationsRegisteredEvent') {
          onVoipTokenRegistered(data);
        } else if (name === 'RNVoipPushRemoteNotificationReceivedEvent') {
          onVoipNotificationReceived(data);
        }
      }
    });

    VoipPushNotification.registerVoipToken();
  }
}

export function cleanVoipNotificationHandler() {
  VoipPushNotification.removeEventListener('didLoadWithEvents');
  VoipPushNotification.removeEventListener('register');
  VoipPushNotification.removeEventListener('notification');
}
