import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/drive.appdata'];

export const googleInit = () => {
  GoogleSignin.configure({
    scopes: GOOGLE_SCOPES,
    webClientId:
      '181526937355-dc3hogvjc61lb2jchffhlstov8pkodd4.apps.googleusercontent.com',
    offlineAccess: true,
  });
};

export const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();
    if (Platform.OS === 'ios') {
      await GoogleSignin.addScopes({
        scopes: GOOGLE_SCOPES,
      });
    }
    return 0;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return statusCodes.SIGN_IN_CANCELLED as number;
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return statusCodes.IN_PROGRESS as number;
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return statusCodes.PLAY_SERVICES_NOT_AVAILABLE as number;
    } else {
      return -1;
    }
  }
};

export const getGoogleAccessToken = async () => {
  return (await GoogleSignin.getTokens()).accessToken;
};
