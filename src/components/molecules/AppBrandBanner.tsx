import React from 'react';
import { ImageStyle, StyleProp } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppDarkBrandBanner from 'enevti-app/components/atoms/brand/AppDarkBrandBanner';
import AppLightBrandBanner from 'enevti-app/components/atoms/brand/AppLightBrandBanner';

interface AppBrandBannerProps {
  widthPercentage: number;
  style?: StyleProp<ImageStyle>;
}

export default function AppBrandBanner({
  widthPercentage,
  style,
}: AppBrandBannerProps) {
  const theme = useTheme() as Theme;
  return theme.dark ? (
    <AppDarkBrandBanner widthPercentage={widthPercentage} style={style} />
  ) : (
    <AppLightBrandBanner widthPercentage={widthPercentage} style={style} />
  );
}
