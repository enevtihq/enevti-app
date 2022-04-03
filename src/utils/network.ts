import NetInfo from '@react-native-community/netinfo';
import i18n from 'enevti-app/translations/i18n';
import { ERRORCODE } from './error/code';

export async function isInternetReachable(): Promise<boolean> {
  await i18n.loadNamespaces('network');
  const status = (await NetInfo.fetch()).isInternetReachable;
  if (!status) {
    throw {
      name: 'NetworkError',
      code: ERRORCODE.NETWORK_ERROR,
      message: i18n.t('network:noInternet'),
    };
  }
  return status ? status : false;
}
