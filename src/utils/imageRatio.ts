import { Dimensions, PixelRatio, Platform } from 'react-native';

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type DimensionFunction = (dimension: number | string) => number;

const ignoreOnPlatform: string[] = ['android'];
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

export function resizeImageRatio(
  initialWidth: number,
  initialHeight: number,
  ratio: number,
) {
  const win = Dimensions.get('window');
  const ratioWidth = win.width * ratio;
  const ratioHeight = (initialHeight * ratioWidth) / initialWidth;

  return {
    width: ratioWidth,
    height: ratioHeight,
  };
}

export function wp(widthPercent: string | number, insets: SafeAreaInsets) {
  const insetsSize = ignoreOnPlatform.includes(Platform.OS)
    ? 0
    : insets.left + insets.right;
  const elemWidth =
    typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(
    ((screenWidth - insetsSize) * elemWidth) / 100,
  );
}

export function hp(heightPercent: string | number, insets: SafeAreaInsets) {
  const insetsSize = ignoreOnPlatform.includes(Platform.OS)
    ? 0
    : insets.top + insets.bottom;
  const elemHeight =
    typeof heightPercent === 'number'
      ? heightPercent
      : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel(
    ((screenHeight - insetsSize) * elemHeight) / 100,
  );
}
