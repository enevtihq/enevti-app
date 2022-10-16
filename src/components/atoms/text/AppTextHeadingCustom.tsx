import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextHeadingCustomProps {
  children: React.ReactNode;
  size: number;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
  onPress?: () => void;
  selectable?: boolean;
}

export default function AppTextHeadingCustom({
  children,
  numberOfLines,
  style,
  readMoreLimit,
  size,
  onPress,
  selectable,
}: AppTextHeadingCustomProps): JSX.Element {
  return (
    <AppTextBase
      selectable={selectable}
      onPress={onPress}
      weight={'bold'}
      size={size}
      numberOfLines={numberOfLines}
      readMoreLimit={readMoreLimit}
      style={style}>
      {children}
    </AppTextBase>
  );
}
