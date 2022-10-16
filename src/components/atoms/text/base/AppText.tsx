import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

interface AppTextProps {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
  selectable?: boolean;
}

export default function AppText({ children, selectable, numberOfLines, style, onPress }: AppTextProps) {
  return (
    <Text selectable={selectable} numberOfLines={numberOfLines} ellipsizeMode="tail" style={style} onPress={onPress}>
      {children}
    </Text>
  );
}
