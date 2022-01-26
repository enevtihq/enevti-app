import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { isInternetReachable, NETWORK_ERROR } from '../../utils/network';
import i18n from '../../translations/i18n';

const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/drive.appdata'];

const selectGoogleErrorText = async (code: number) => {
  await i18n.loadNamespaces(['google', 'network']);
  return code === NETWORK_ERROR
    ? i18n.t('network:noInternet')
    : code === statusCodes.SIGN_IN_CANCELLED
    ? i18n.t('google:signInCancelled')
    : code === statusCodes.IN_PROGRESS
    ? i18n.t('google:signInAlreadyInProgress')
    : code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
    ? i18n.t('google:signInUnavailableService')
    : i18n.t('google:unknownError');
};

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
    await isInternetReachable();
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();
    if (Platform.OS === 'ios') {
      await GoogleSignin.addScopes({
        scopes: GOOGLE_SCOPES,
      });
    }
    return 0;
  } catch (error: any) {
    throw {
      name: 'GoogleError',
      code: error.code,
      message: await selectGoogleErrorText(error.code),
    };
  }
};

export const getGoogleAccessToken = async () => {
  return (await GoogleSignin.getTokens()).accessToken;
};
