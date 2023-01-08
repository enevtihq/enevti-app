import React from 'react';
import { NativeSyntheticEvent, StyleProp, TextLayoutEventData, TextStyle } from 'react-native';
import AppTextBase from './base/AppTextBase';

interface AppTextBodyCustomProps {
  children: React.ReactNode;
  size: number;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
  onPress?: () => void;
  onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void;
  selectable?: boolean;
}

export default function AppTextBodyCustom({
  children,
  size,
  numberOfLines,
  style,
  readMoreLimit,
  onPress,
  onTextLayout,
  selectable,
}: AppTextBodyCustomProps): JSX.Element {
  return (
    <AppTextBase
      onTextLayout={onTextLayout}
      selectable={selectable}
      onPress={onPress}
      weight={'normal'}
      size={size}
      numberOfLines={numberOfLines}
      readMoreLimit={readMoreLimit}
      style={style}>
      {children}
    </AppTextBase>
  );
}
