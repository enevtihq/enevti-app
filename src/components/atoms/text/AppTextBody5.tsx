import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextBody5Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
}

export default function AppTextBody5({
  children,
  numberOfLines,
  style,
  readMoreLimit,
}: AppTextBody5Props): JSX.Element {
  return (
    <AppTextBase weight={'normal'} size={2.2} numberOfLines={numberOfLines} readMoreLimit={readMoreLimit} style={style}>
      {children}
    </AppTextBase>
  );
}
