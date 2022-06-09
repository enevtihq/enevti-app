import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { resizeImageRatio, resizeImageRatioHeight } from 'enevti-app/utils/imageRatio';

interface AppLightBrandBannerProps {
  widthPercentage?: number;
  heightPercentage?: number;
  style?: StyleProp<ImageStyle>;
}

export default function AppLightBrandBanner({
  widthPercentage,
  heightPercentage,
  style,
}: AppLightBrandBannerProps): JSX.Element {
  const sizeRatio = widthPercentage
    ? resizeImageRatio(1116, 342, widthPercentage)
    : heightPercentage
    ? resizeImageRatioHeight(1116, 342, heightPercentage)
    : { width: 1116, height: 342 };

  return (
    <Image
      source={require('enevti-app/assets/images/enevti-light-text-logo.png')}
      style={[{ width: sizeRatio.width, height: sizeRatio.height }, style]}
    />
  );
}
