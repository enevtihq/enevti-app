import NetInfo from '@react-native-community/netinfo';

export async function isInternetReachable(): Promise<boolean> {
  const status = (await NetInfo.fetch()).isInternetReachable;
  return status ? status : false;
}
