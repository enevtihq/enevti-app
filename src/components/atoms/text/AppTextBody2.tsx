import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextBody2Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
}

export default function AppTextBody2({
  children,
  numberOfLines,
  style,
  readMoreLimit,
}: AppTextBody2Props): JSX.Element {
  return (
    <AppTextBase
      weight={'normal'}
      size={5.2}
      numberOfLines={numberOfLines}
      readMoreLimit={readMoreLimit}
      style={style}>
      {children}
    </AppTextBase>
  );
}
