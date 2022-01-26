import React from 'react';
import { IconButton } from 'react-native-paper';

interface AppIconButtonProps {
  icon: string;
  onPress?: () => void;
}

export default function AppIconButton({ icon, onPress }: AppIconButtonProps) {
  return <IconButton icon={icon} onPress={onPress} />;
}
