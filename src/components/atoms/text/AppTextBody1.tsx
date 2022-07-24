import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextBody1Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
  onPress?: () => void;
}

export default function AppTextBody1({
  children,
  numberOfLines,
  style,
  readMoreLimit,
  onPress,
}: AppTextBody1Props): JSX.Element {
  return (
    <AppTextBase
      onPress={onPress}
      weight={'normal'}
      size={5.8}
      numberOfLines={numberOfLines}
      readMoreLimit={readMoreLimit}
      style={style}>
      {children}
    </AppTextBase>
  );
}
