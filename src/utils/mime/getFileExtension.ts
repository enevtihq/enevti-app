import i18n from 'enevti-app/translations/i18n';
import { DocumentPickerResponse } from 'react-native-document-picker';
import * as mime from 'react-native-mime-types';

export default function getFileExtension(response: DocumentPickerResponse) {
  if (mime.lookup(response.name)) {
    return getFileExtensionFromPath(response.name);
  } else {
    if (response.type && mime.extension(response.type)) {
      return mime.extension(response.type) as string;
    } else {
      throw Error(i18n.t('error:getExtensionFailed'));
    }
  }
}

export function getFileExtensionFromPath(path: string) {
  return path.split(/[#?]/)[0].split('.').pop()!.trim();
}
