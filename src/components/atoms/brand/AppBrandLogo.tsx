import React from 'react';
import { Image, ImageStyle, StyleProp, View } from 'react-native';
import { resizeImageRatio, resizeImageRatioHeight } from 'enevti-app/utils/imageRatio';

interface AppBrandLogoProps {
  widthPercentage?: number;
  heightPercentage?: number;
  mode?: 'default' | 'glow';
  style?: StyleProp<ImageStyle>;
}

export default function AppBrandLogo({
  widthPercentage,
  heightPercentage,
  mode = 'default',
  style,
}: AppBrandLogoProps): JSX.Element {
  const sizeRatio = widthPercentage
    ? resizeImageRatio(900, 900, widthPercentage)
    : heightPercentage
    ? resizeImageRatioHeight(900, 900, heightPercentage)
    : { width: 900, height: 900 };

  if (mode === 'default') {
    return (
      <Image
        source={require('enevti-app/assets/images/enevti-icon.png')}
        style={[{ width: sizeRatio.width, height: sizeRatio.height }, style]}
      />
    );
  } else if (mode === 'glow') {
    return (
      <Image
        source={require('enevti-app/assets/images/enevti-icon-glow.png')}
        style={[{ width: sizeRatio.width, height: sizeRatio.height }, style]}
      />
    );
  } else {
    return <View />;
  }
}
