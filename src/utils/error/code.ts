import { statusCodes } from '@react-native-google-signin/google-signin';

export const ERRORCODE = {
  GOOGLE_SIGNIN_CANCELLED: statusCodes.SIGN_IN_CANCELLED,
  GOOGLE_SIGNIN_INPROGRESS: statusCodes.IN_PROGRESS,
  GOOGLE_SIGNIN_NOTAVAILABLE: statusCodes.PLAY_SERVICES_NOT_AVAILABLE,
  NETWORK_ERROR: -2,
  WRONG_LOCALKEY: 1000,
  UNKNOWN: -3,
};
