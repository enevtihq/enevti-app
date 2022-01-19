import React from 'react';
import { ImageStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Theme } from '../../theme/default';
import AppDarkBrandBanner from '../atoms/brand/AppDarkBrandBanner';
import AppLightBrandBanner from '../atoms/brand/AppLightBrandBanner';

interface AppBrandBannerProps {
  widthPercentage: number;
  style?: ImageStyle;
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
