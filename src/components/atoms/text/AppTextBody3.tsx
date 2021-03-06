import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextBody3Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
  onPress?: () => void;
}

export default function AppTextBody3({
  children,
  numberOfLines,
  style,
  readMoreLimit,
  onPress,
}: AppTextBody3Props): JSX.Element {
  return (
    <AppTextBase
      onPress={onPress}
      weight={'normal'}
      size={4.0}
      numberOfLines={numberOfLines}
      readMoreLimit={readMoreLimit}
      style={style}>
      {children}
    </AppTextBase>
  );
}
