import { Dimensions } from 'react-native';

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
