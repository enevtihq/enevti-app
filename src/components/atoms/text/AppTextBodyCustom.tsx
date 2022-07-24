import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextBodyCustomProps {
  children: React.ReactNode;
  size: number;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
  onPress?: () => void;
}

export default function AppTextBodyCustom({
  children,
  size,
  numberOfLines,
  style,
  readMoreLimit,
  onPress,
}: AppTextBodyCustomProps): JSX.Element {
  return (
    <AppTextBase
      onPress={onPress}
      weight={'normal'}
      size={size}
      numberOfLines={numberOfLines}
      readMoreLimit={readMoreLimit}
      style={style}>
      {children}
    </AppTextBase>
  );
}
