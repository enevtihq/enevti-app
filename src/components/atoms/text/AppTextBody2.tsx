import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextBody2Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
  onPress?: () => void;
}

export default function AppTextBody2({
  children,
  numberOfLines,
  style,
  readMoreLimit,
  onPress,
}: AppTextBody2Props): JSX.Element {
  return (
    <AppTextBase
      onPress={onPress}
      weight={'normal'}
      size={5.2}
      numberOfLines={numberOfLines}
      readMoreLimit={readMoreLimit}
      style={style}>
      {children}
    </AppTextBase>
  );
}
