import ImageCropPicker from 'react-native-image-crop-picker';
import { handleError } from '../../utils/error/handle';

export const NFT_RESOLUTION = 500;

export function cleanTMPImage() {
  ImageCropPicker.clean().catch(e => {
    handleError(e);
  });
}
