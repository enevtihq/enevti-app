import { Dimensions, PixelRatio } from 'react-native';

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

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
  const elemWidth =
    typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(
    ((screenWidth - (insets.left + insets.right)) * elemWidth) / 100,
  );
}

export function hp(heightPercent: string | number, insets: SafeAreaInsets) {
  const elemHeight =
    typeof heightPercent === 'number'
      ? heightPercent
      : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel(
    ((screenHeight - (insets.top + insets.bottom)) * elemHeight) / 100,
  );
}
