import i18n from 'enevti-app/translations/i18n';
import { PermissionsAndroid, Platform } from 'react-native';

export async function checkPermissionStorage() {
  if (Platform.OS === 'android') {
    if (!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE))) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw Error(i18n.t('error:permissionDenied'));
      }
    }
    if (!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE))) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw Error(i18n.t('error:permissionDenied'));
      }
    }
  }
}
