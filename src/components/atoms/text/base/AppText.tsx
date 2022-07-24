import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

interface AppTextProps {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
}

export default function AppText({ children, numberOfLines, style, onPress }: AppTextProps) {
  return (
    <Text numberOfLines={numberOfLines} ellipsizeMode="tail" style={style} onPress={onPress}>
      {children}
    </Text>
  );
}
