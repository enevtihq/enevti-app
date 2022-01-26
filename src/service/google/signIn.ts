import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { isInternetReachable, NETWORK_ERROR } from '../../utils/network';
import i18n from '../../translations/i18n';
import { store } from '../../store/state';
import { showSnackbar } from '../../store/slices/ui/global';

const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/drive.appdata'];
const UNKNOWN_ERROR = -1;

const selectGoogleErrorText = async (code: number) => {
  await i18n.loadNamespaces(['google', 'network']);
  return code === NETWORK_ERROR
    ? i18n.t('network:noInternet')
    : code === UNKNOWN_ERROR
    ? i18n.t('google:unknownError')
    : code === statusCodes.SIGN_IN_CANCELLED
    ? i18n.t('google:signInCancelled')
    : code === statusCodes.IN_PROGRESS
    ? i18n.t('google:signInAlreadyInProgress')
    : code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
    ? i18n.t('google:signInUnavailableService')
    : '';
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
    if (
      [
        statusCodes.SIGN_IN_CANCELLED,
        statusCodes.IN_PROGRESS,
        statusCodes.PLAY_SERVICES_NOT_AVAILABLE,
        NETWORK_ERROR,
      ].includes(error.code)
    ) {
      store.dispatch(
        showSnackbar({
          mode: 'error',
          text: await selectGoogleErrorText(error.code),
        }),
      );
    } else {
      store.dispatch(
        showSnackbar({
          mode: 'error',
          text: await selectGoogleErrorText(-2),
        }),
      );
    }
    return UNKNOWN_ERROR;
  }
};

export const getGoogleAccessToken = async () => {
  return (await GoogleSignin.getTokens()).accessToken;
};
