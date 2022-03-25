import ImageCropPicker from 'react-native-image-crop-picker';
import { handleError } from '../../utils/error/handle';
import { sleep } from './dummy';

export const NFT_RESOLUTION = 500;

export function cleanTMPImage() {
  ImageCropPicker.clean().catch(e => {
    handleError(e);
  });
}

export async function isNameAvailable(name: string): Promise<boolean> {
  await sleep(1000);
  console.log(name);
  return true;
}

export async function isSymbolAvailable(name: string): Promise<boolean> {
  await sleep(1000);
  console.log(name);
  return true;
}
