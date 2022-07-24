import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextBody5Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
  onPress?: () => void;
}

export default function AppTextBody5({
  children,
  numberOfLines,
  style,
  readMoreLimit,
  onPress,
}: AppTextBody5Props): JSX.Element {
  return (
    <AppTextBase
      onPress={onPress}
      weight={'normal'}
      size={2.2}
      numberOfLines={numberOfLines}
      readMoreLimit={readMoreLimit}
      style={style}>
      {children}
    </AppTextBase>
  );
}
