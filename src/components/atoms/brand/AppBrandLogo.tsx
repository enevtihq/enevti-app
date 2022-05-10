import React from 'react';
import { Image, ImageStyle, StyleProp, View } from 'react-native';
import { resizeImageRatio } from 'enevti-app/utils/imageRatio';

interface AppBrandLogoProps {
  widthPercentage: number;
  mode?: 'default' | 'glow';
  style?: StyleProp<ImageStyle>;
}

export default function AppBrandLogo({ widthPercentage, mode = 'default', style }: AppBrandLogoProps): JSX.Element {
  const sizeRatio = resizeImageRatio(900, 900, widthPercentage);

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
