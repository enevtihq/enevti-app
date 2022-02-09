import React from 'react';
import { ViewStyle } from 'react-native';
import { IconButton } from 'react-native-paper';

interface AppIconButtonProps {
  icon: string;
  size?: number;
  onPress?: (e?: any) => void;
  style?: ViewStyle;
}

export default function AppIconButton({
  icon,
  size,
  onPress,
  style,
}: AppIconButtonProps) {
  return <IconButton icon={icon} onPress={onPress} size={size} style={style} />;
}
