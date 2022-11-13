import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { isInternetReachable } from 'enevti-app/utils/app/network';
import i18n from 'enevti-app/translations/i18n';
import { ERRORCODE } from 'enevti-app/utils/error/code';

const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/drive.appdata'];

const selectGoogleErrorText = async (code: number) => {
  await i18n.loadNamespaces(['google', 'network']);
  return code === ERRORCODE.NETWORK_ERROR
    ? i18n.t('network:noInternet')
    : code === ERRORCODE.GOOGLE_SIGNIN_CANCELLED
    ? i18n.t('google:signInCancelled')
    : code === ERRORCODE.GOOGLE_SIGNIN_INPROGRESS
    ? i18n.t('google:signInAlreadyInProgress')
    : code === ERRORCODE.GOOGLE_SIGNIN_NOTAVAILABLE
    ? i18n.t('google:signInUnavailableService')
    : i18n.t('google:unknownError');
};

export const googleInit = () => {
  GoogleSignin.configure({
    scopes: GOOGLE_SCOPES,
    webClientId: '181526937355-dc3hogvjc61lb2jchffhlstov8pkodd4.apps.googleusercontent.com',
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
    const err = Error(await selectGoogleErrorText(error.code)) as any;
    err.name = 'GoogleError';
    err.code = error.code;
    throw err;
  }
};

export const getGoogleAccessToken = async () => {
  return (await GoogleSignin.getTokens()).accessToken;
};
