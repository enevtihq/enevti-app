import { Dimensions, PixelRatio } from 'react-native';

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type DimensionFunction = (dimension: number | string) => number;

type DimensionOptions = {
  maxARVertical?: number;
  maxARHorizontal?: number;
  dim?: 'window' | 'screen';
};

const SCREEN_ASPECT_RATIO = screenAspectRatio();
const DEFAULT_MAX_AR_VERTICAL = 0.5086;
const DEFAULT_MAX_AR_HORIZONTAL = screenAspectRatio();
const DEFAULT_DIM = 'screen';

const clamp = (value: number, lowerBound: number, upperBound: number) => {
  return Math.min(Math.max(lowerBound, value), upperBound);
};

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

export function wp(widthPercent: string | number, options?: DimensionOptions) {
  const dim = options && options.dim ? options.dim : DEFAULT_DIM;
  const maxAr = options && options.maxARHorizontal ? options.maxARHorizontal : DEFAULT_MAX_AR_HORIZONTAL;
  const ar = clamp(SCREEN_ASPECT_RATIO, maxAr, 99);
  const screenHeight = Dimensions.get(dim).height;
  const screenWidth = screenHeight * ar;
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
}

export function hp(heightPercent: string | number, options?: DimensionOptions) {
  const dim = options && options.dim ? options.dim : DEFAULT_DIM;
  const maxAr = options && options.maxARVertical ? options.maxARVertical : DEFAULT_MAX_AR_VERTICAL;
  const ar = clamp(SCREEN_ASPECT_RATIO, maxAr, 99);
  const screenWidth = Dimensions.get(dim).width;
  const screenHeight = screenWidth / ar;
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
}

export function screenAspectRatio() {
  const win = Dimensions.get('screen');
  return win.width / win.height;
}
