import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextHeadingCustomProps {
  children: React.ReactNode;
  size: number;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
}

export default function AppTextHeadingCustom({
  children,
  numberOfLines,
  style,
  readMoreLimit,
  size,
}: AppTextHeadingCustomProps): JSX.Element {
  return (
    <AppTextBase weight={'bold'} size={size} numberOfLines={numberOfLines} readMoreLimit={readMoreLimit} style={style}>
      {children}
    </AppTextBase>
  );
}
