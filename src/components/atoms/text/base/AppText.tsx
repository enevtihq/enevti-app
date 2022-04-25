import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

interface AppTextProps {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
}

export default function AppText({ children, numberOfLines, style }: AppTextProps) {
  return (
    <Text numberOfLines={numberOfLines} ellipsizeMode="tail" style={style}>
      {children}
    </Text>
  );
}
