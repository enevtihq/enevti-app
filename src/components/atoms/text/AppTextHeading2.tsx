import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextHeading2Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
  onPress?: () => void;
}

export default function AppTextHeading2({
  children,
  numberOfLines,
  style,
  readMoreLimit,
  onPress,
}: AppTextHeading2Props): JSX.Element {
  return (
    <AppTextBase
      onPress={onPress}
      weight={'bold'}
      size={5.2}
      numberOfLines={numberOfLines}
      readMoreLimit={readMoreLimit}
      style={style}>
      {children}
    </AppTextBase>
  );
}
