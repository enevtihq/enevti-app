import { StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { ActivityIndicator, useTheme } from 'react-native-paper';

interface AppActivityIndicatorProps {
  animating?: boolean;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

export default function AppActivityIndicator({
  animating,
  style,
  color,
}: AppActivityIndicatorProps) {
  const theme = useTheme();
  const loaderColor = theme.colors.primary;

  return (
    <ActivityIndicator
      animating={animating}
      style={style}
      color={color ? color : loaderColor}
    />
  );
}
