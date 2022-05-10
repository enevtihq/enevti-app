import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextHeading1Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
}

export default function AppTextHeading1({
  children,
  numberOfLines,
  style,
  readMoreLimit,
}: AppTextHeading1Props): JSX.Element {
  return (
    <AppTextBase weight={'bold'} size={5.8} numberOfLines={numberOfLines} readMoreLimit={readMoreLimit} style={style}>
      {children}
    </AppTextBase>
  );
}
