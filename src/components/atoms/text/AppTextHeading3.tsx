import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextHeading3Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
}

export default function AppTextHeading3({
  children,
  numberOfLines,
  style,
  readMoreLimit,
}: AppTextHeading3Props): JSX.Element {
  return (
    <AppTextBase
      weight={'bold'}
      size={4.0}
      numberOfLines={numberOfLines}
      readMoreLimit={readMoreLimit}
      style={style}>
      {children}
    </AppTextBase>
  );
}
