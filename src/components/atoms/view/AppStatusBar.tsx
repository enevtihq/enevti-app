import { StatusBar } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { Theme } from '../../../theme/default';

export default function AppStatusBar() {
  const theme = useTheme() as Theme;

  return (
    <StatusBar
      animated
      barStyle={theme.dark === true ? 'light-content' : 'dark-content'}
      backgroundColor={theme.colors.background}
    />
  );
}
