import { Dimensions, PixelRatio, Platform } from 'react-native';

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type DimensionFunction = (dimension: number | string) => number;

type DimensionOptions = {
  aspectRatio?: number;
  dim?: 'window' | 'screen';
};

const ignoreOnPlatform: string[] = [];
const DEFAULT_DIM = 'screen';

export function resizeImageRatio(initialWidth: number, initialHeight: number, ratio: number) {
  const win = Dimensions.get('screen');
  const ratioWidth = win.width * ratio;
  const ratioHeight = (initialHeight * ratioWidth) / initialWidth;

  return {
    width: ratioWidth,
    height: ratioHeight,
  };
}

export function resizeImageRatioHeight(initialWidth: number, initialHeight: number, ratio: number) {
  const win = Dimensions.get('screen');
  const ratioHeight = win.height * ratio;
  const ratioWidth = (initialWidth * ratioHeight) / initialHeight;

  return {
    width: ratioWidth,
    height: ratioHeight,
  };
}

export function wp(widthPercent: string | number, insets?: SafeAreaInsets, options?: DimensionOptions) {
  const dim = options && options.dim ? options.dim : DEFAULT_DIM;
  const screenHeight = Dimensions.get(dim).height;
  const screenWidth = options && options.aspectRatio ? screenHeight * options.aspectRatio : Dimensions.get(dim).width;
  const insetsSize = ignoreOnPlatform.includes(Platform.OS) || !insets ? 0 : insets.left + insets.right;
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(((screenWidth - insetsSize) * elemWidth) / 100);
}

export function hp(heightPercent: string | number, insets?: SafeAreaInsets, options?: DimensionOptions) {
  const dim = options && options.dim ? options.dim : DEFAULT_DIM;
  const screenWidth = Dimensions.get(dim).width;
  const screenHeight = options && options.aspectRatio ? screenWidth / options.aspectRatio : Dimensions.get(dim).height;
  const insetsSize = ignoreOnPlatform.includes(Platform.OS) || !insets ? 0 : insets.top + insets.bottom;
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel(((screenHeight - insetsSize) * elemHeight) / 100);
}

export function screenAspectRatio() {
  const win = Dimensions.get('screen');
  return win.width / win.height;
}
