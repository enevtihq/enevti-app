import { handleError } from 'enevti-app/utils/error/handle';
import { Platform } from 'react-native';
import RNCallKeep, { IOptions, CONSTANTS } from 'react-native-callkeep';
import IncomingCall from '@bob.hardcoder/react-native-incoming-call';
import VoipPushNotification from 'react-native-voip-push-notification';
import { StartVideoCallPayloadIOS } from 'enevti-app/types/core/service/call';
import { store } from 'enevti-app/store/state';
import { initAPNToken } from 'enevti-app/store/middleware/thunk/session/apn';
import { AnyAction } from '@reduxjs/toolkit';
import {
  setupIOSVideoCallHandler,
  setupIOSVideoCallHandlerWithAwait,
} from 'enevti-app/service/firebase/fcm/startVideoCall';
import { selectDisplayState } from 'enevti-app/store/slices/ui/screen/display';
import { videoCallSocketBase } from 'enevti-app/utils/network';
import { getMyPublicKey } from 'enevti-app/service/enevti/persona';
import { createSignature } from 'enevti-app/utils/cryptography';
import { EventRegister } from 'react-native-event-listeners';

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
  store.dispatch(initAPNToken({ token }) as unknown as AnyAction);
}

async function onVoipNotificationReceived(notification: StartVideoCallPayloadIOS) {
  displayIncomingCall(notification.uuid, notification.handle, notification.callerName);
  VoipPushNotification.onVoipNotificationCompleted(notification.uuid);

  let callInteracted = false;
  const display = selectDisplayState(store.getState());
  setupIOSVideoCallHandlerWithAwait(notification, display, () => (callInteracted = true));

  const socket = videoCallSocketBase();
  const publicKey = await getMyPublicKey();
  const signature = await createSignature(notification.data.id);
  socket.emit('ringing', { nftId: notification.data.id, callId: notification.uuid, emitter: publicKey, signature });

  const rejectData = notification.data.rejectData;
  const rejectSignature = await createSignature(rejectData);

  if (!callInteracted) {
    RNCallKeep.removeEventListener('answerCall');
    RNCallKeep.removeEventListener('endCall');
    setupIOSVideoCallHandler(socket, notification, publicKey, signature, rejectSignature, display, false);
  } else {
    EventRegister.emit('iosVideoCallReady', { socket, publicKey, signature, rejectSignature });
  }
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
