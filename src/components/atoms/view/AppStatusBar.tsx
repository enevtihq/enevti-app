import { StatusBar } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Theme } from '../../../theme/default';
import { selectStatusBarState } from '../../../store/slices/ui/global/statusbar';
import lightTheme from '../../../theme/default';
import darkTheme from '../../../theme/dark';

export default function AppStatusBar() {
  const theme = useTheme() as Theme;
  const statusbarState = useSelector(selectStatusBarState);
  const barStyle = React.useMemo(
    () =>
      (statusbarState.background === 'system' && theme.dark === true) ||
      statusbarState.background === 'dark' ||
      statusbarState.background === 'transparent'
        ? 'light-content'
        : (statusbarState.background === 'system' && theme.dark === false) ||
          statusbarState.background === 'light'
        ? 'dark-content'
        : undefined,
    [statusbarState.background, theme.dark],
  );
  const backgroundColor = React.useMemo(
    () =>
      statusbarState.background === 'system'
        ? theme.colors.background
        : statusbarState.background === 'dark'
        ? darkTheme.colors.background
        : statusbarState.background === 'light'
        ? lightTheme.colors.background
        : statusbarState.background === 'transparent'
        ? 'transparent'
        : undefined,
    [statusbarState.background, theme.colors.background],
  );

  return (
    <StatusBar
      animated
      translucent={true}
      barStyle={barStyle}
      backgroundColor={backgroundColor}
    />
  );
}
