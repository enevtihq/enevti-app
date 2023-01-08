import React from 'react';
import { NativeSyntheticEvent, StyleProp, TextLayoutEventData, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextBody4Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
  onPress?: () => void;
  onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void;
  selectable?: boolean;
}

export default function AppTextBody4({
  children,
  numberOfLines,
  style,
  readMoreLimit,
  onPress,
  onTextLayout,
  selectable,
}: AppTextBody4Props): JSX.Element {
  return (
    <AppTextBase
      onTextLayout={onTextLayout}
      selectable={selectable}
      onPress={onPress}
      weight={'normal'}
      size={3.5}
      numberOfLines={numberOfLines}
      readMoreLimit={readMoreLimit}
      style={style}>
      {children}
    </AppTextBase>
  );
}
