import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextHeading2Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
}

export default function AppTextHeading2({
  children,
  numberOfLines,
  style,
  readMoreLimit,
}: AppTextHeading2Props): JSX.Element {
  return (
    <AppTextBase weight={'bold'} size={5.2} numberOfLines={numberOfLines} readMoreLimit={readMoreLimit} style={style}>
      {children}
    </AppTextBase>
  );
}
