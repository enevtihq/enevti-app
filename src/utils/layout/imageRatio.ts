import { Dimensions, PixelRatio, Platform } from 'react-native';

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type DimensionFunction = (dimension: number | string) => number;

const ignoreOnPlatform: string[] = [];

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

export function wp(widthPercent: string | number, insets?: SafeAreaInsets) {
  const screenWidth = Dimensions.get('screen').width;
  const insetsSize = ignoreOnPlatform.includes(Platform.OS) || !insets ? 0 : insets.left + insets.right;
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(((screenWidth - insetsSize) * elemWidth) / 100);
}

export function hp(heightPercent: string | number, insets?: SafeAreaInsets) {
  const screenHeight = Dimensions.get('screen').height;
  const insetsSize = ignoreOnPlatform.includes(Platform.OS) || !insets ? 0 : insets.top + insets.bottom;
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel(((screenHeight - insetsSize) * elemHeight) / 100);
}

export function screenAspectRatio() {
  const win = Dimensions.get('screen');
  return win.width / win.height;
}
