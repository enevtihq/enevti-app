import { StyleProp, Image, ImageStyle } from 'react-native';
import React from 'react';
import { COIN_NAME } from 'enevti-app/components/atoms/brand/AppBrandConstant';

interface AppCurrencyIconProps {
  currency: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export default function AppCurrencyIcon({
  currency,
  style,
  size = 30,
}: AppCurrencyIconProps) {
  let source: any;
  switch (currency) {
    case COIN_NAME:
      source = require('enevti-app/assets/images/enevti-icon-glow.png');
      break;
    default:
      break;
  }
  return (
    <Image source={source} style={[{ width: size, height: size }, style]} />
  );
}
