import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { isInternetReachable } from 'enevti-app/utils/app/network';
import i18n from 'enevti-app/translations/i18n';
import { ERRORCODE } from 'enevti-app/utils/error/code';

const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/drive.appdata'];

const selectGoogleErrorText = async (code: string) => {
  await i18n.loadNamespaces(['google', 'network']);
  return code === ERRORCODE.NETWORK_ERROR.toString()
    ? i18n.t('network:noInternet')
    : code === ERRORCODE.GOOGLE_SIGNIN_CANCELLED || code === '-1'
    ? i18n.t('google:signInCancelled')
    : code === ERRORCODE.GOOGLE_SIGNIN_INPROGRESS
    ? i18n.t('google:signInAlreadyInProgress')
    : code === ERRORCODE.GOOGLE_SIGNIN_NOTAVAILABLE
    ? i18n.t('google:signInUnavailableService')
    : code === ERRORCODE.GOOGLE_SIGNIN_REQUIRED
    ? i18n.t('google:signInRequired')
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
    if (!(await isScopeSufficient())) {
      await googleSignIn();
    }
    return 0;
  } catch (error: any) {
    const err = Error(await selectGoogleErrorText(error.code.toString())) as any;
    err.name = 'GoogleError';
    err.code = error.code;
    throw err;
  }
};

export const getGoogleAccessToken = async () => {
  const signedIn = await isGoogleSignedIn();
  if (!signedIn) {
    await googleSignIn();
  }
  const apiToken = (await GoogleSignin.getTokens()).accessToken;
  return apiToken;
};

export const isGoogleSignedIn = async () => {
  return await GoogleSignin.isSignedIn();
};

export const googleSignOut = async () => {
  return await GoogleSignin.signOut();
};

export const isScopeSufficient = async () => {
  const googleAccount = await GoogleSignin.getCurrentUser();
  const ret = googleAccount && googleAccount.scopes && GOOGLE_SCOPES.every(v => googleAccount!.scopes!.includes(v));
  return ret;
};
