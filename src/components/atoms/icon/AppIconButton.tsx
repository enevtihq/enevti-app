import React from 'react';
import { IconButton } from 'react-native-paper';

interface AppIconButtonProps {
  icon: string;
  size?: number;
  onPress?: (e?: any) => void;
}

export default function AppIconButton({
  icon,
  size,
  onPress,
}: AppIconButtonProps) {
  return <IconButton icon={icon} onPress={onPress} size={size} />;
}
