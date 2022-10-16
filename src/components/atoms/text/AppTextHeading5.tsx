import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextHeading5Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
  onPress?: () => void;
  selectable?: boolean;
}

export default function AppTextHeading5({
  children,
  numberOfLines,
  style,
  readMoreLimit,
  onPress,
  selectable,
}: AppTextHeading5Props): JSX.Element {
  return (
    <AppTextBase
      selectable={selectable}
      onPress={onPress}
      weight={'bold'}
      size={2.2}
      numberOfLines={numberOfLines}
      readMoreLimit={readMoreLimit}
      style={style}>
      {children}
    </AppTextBase>
  );
}
