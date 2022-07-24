import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextHeading4Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
  onPress?: () => void;
}

export default function AppTextHeading4({
  children,
  numberOfLines,
  style,
  readMoreLimit,
  onPress,
}: AppTextHeading4Props): JSX.Element {
  return (
    <AppTextBase
      onPress={onPress}
      weight={'bold'}
      size={3.5}
      numberOfLines={numberOfLines}
      readMoreLimit={readMoreLimit}
      style={style}>
      {children}
    </AppTextBase>
  );
}
