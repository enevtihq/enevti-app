import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';

interface AppHeaderActionProps {
  icon: string;
  onPress: () => void;
}

export default function AppHeaderAction({ icon, onPress }: AppHeaderActionProps) {
  const theme = useTheme();

  return <Appbar.Action icon={icon} onPress={onPress} color={theme.colors.text} />;
}
