import React from 'react';
import { NativeSyntheticEvent, StyleProp, Text, TextLayoutEventData, TextStyle } from 'react-native';

interface AppTextProps {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
  onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void;
  selectable?: boolean;
}

export default function AppText({ children, selectable, numberOfLines, style, onPress, onTextLayout }: AppTextProps) {
  return (
    <Text
      onTextLayout={onTextLayout}
      selectable={selectable}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={style}
      onPress={onPress}>
      {children}
    </Text>
  );
}
