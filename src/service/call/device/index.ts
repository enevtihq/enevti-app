import { handleError } from 'enevti-app/utils/error/handle';
import { Platform } from 'react-native';
import RNCallKeep, { IOptions, CONSTANTS } from 'react-native-callkeep';
import OverlayPermissionModule from 'rn-android-overlay-permission';
import IncomingCall from '@bob.hardcoder/react-native-incoming-call';

const options: IOptions = {
  android: { alertTitle: '', alertDescription: '', cancelButton: '', okButton: '', additionalPermissions: [] },
  ios: {
    appName: 'Enevti.com',
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
  } catch (err) {
    handleError(err);
  }
}

export function displayIncomingCall(
  callId: string,
  number: string,
  callerName: string,
  avatar?: string,
  timeout: number = 20000,
) {
  if (Platform.OS === 'ios') {
    RNCallKeep.displayIncomingCall(callId, number, callerName, 'email');
  } else if (Platform.OS === 'android') {
    IncomingCall.display(
      callId,
      number,
      avatar ?? 'https://pbs.twimg.com/profile_images/1399393541294415873/83l_AT9i_400x400.jpg',
      callerName,
      timeout,
    );
  }
}
