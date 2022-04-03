import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { resizeImageRatio } from 'enevti-app/utils/imageRatio';

interface AppLightBrandBannerProps {
  widthPercentage: number;
  style?: StyleProp<ImageStyle>;
}

export default function AppLightBrandBanner({
  widthPercentage,
  style,
}: AppLightBrandBannerProps): JSX.Element {
  const sizeRatio = resizeImageRatio(1116, 342, widthPercentage);

  return (
    <Image
      source={require('enevti-app/assets/images/enevti-light-text-logo.png')}
      style={[{ width: sizeRatio.width, height: sizeRatio.height }, style]}
    />
  );
}
