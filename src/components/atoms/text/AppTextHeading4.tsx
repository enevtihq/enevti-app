import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextHeading4Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
}

export default function AppTextHeading4({
  children,
  numberOfLines,
  style,
  readMoreLimit,
}: AppTextHeading4Props): JSX.Element {
  return (
    <AppTextBase weight={'bold'} size={3.5} numberOfLines={numberOfLines} readMoreLimit={readMoreLimit} style={style}>
      {children}
    </AppTextBase>
  );
}
