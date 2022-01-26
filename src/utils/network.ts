import NetInfo from '@react-native-community/netinfo';
import i18n from '../translations/i18n';

export const NETWORK_ERROR = -2;

export async function isInternetReachable(): Promise<boolean> {
  await i18n.loadNamespaces('network');
  const status = (await NetInfo.fetch()).isInternetReachable;
  if (!status) {
    throw {
      name: 'NetworkError',
      code: NETWORK_ERROR,
      message: i18n.t('network:noInternet'),
    };
  }
  return status ? status : false;
}
