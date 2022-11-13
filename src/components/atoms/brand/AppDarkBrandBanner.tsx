import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { resizeImageRatio, resizeImageRatioHeight } from 'enevti-app/utils/layout/imageRatio';

interface AppDarkBrandBannerProps {
  widthPercentage?: number;
  heightPercentage?: number;
  style?: StyleProp<ImageStyle>;
}

export default function AppDarkBrandBanner({
  widthPercentage,
  heightPercentage,
  style,
}: AppDarkBrandBannerProps): JSX.Element {
  const sizeRatio = widthPercentage
    ? resizeImageRatio(1116, 342, widthPercentage)
    : heightPercentage
    ? resizeImageRatioHeight(1116, 342, heightPercentage)
    : { width: 1116, height: 342 };

  return (
    <Image
      source={require('enevti-app/assets/images/enevti-dark-text-logo.png')}
      style={[{ width: sizeRatio.width, height: sizeRatio.height }, style]}
    />
  );
}
