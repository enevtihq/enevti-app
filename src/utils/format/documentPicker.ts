import { DocumentPickerResponse } from 'react-native-document-picker';
import { ImageOrVideo } from 'react-native-image-crop-picker';

export function ImageOrVideoToDocument(imageOrView: ImageOrVideo): DocumentPickerResponse {
  return {
    fileCopyUri: null,
    name: imageOrView.path.substring(imageOrView.path.lastIndexOf('/') + 1),
    size: imageOrView.size,
    type: imageOrView.mime,
    uri: imageOrView.path,
  };
}
