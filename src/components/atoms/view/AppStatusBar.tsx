import { Dimensions, StatusBar } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Theme } from 'enevti-app/theme/default';
import { selectStatusBarState } from 'enevti-app/store/slices/ui/global/statusbar';
import lightTheme from 'enevti-app/theme/default';
import darkTheme from 'enevti-app/theme/dark';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export const STATUS_BAR_HEIGHT = () =>
  (getStatusBarHeight() / Dimensions.get('window').height) * 100;

export default function AppStatusBar() {
  const theme = useTheme() as Theme;
  const statusbarState = useSelector(selectStatusBarState);
  const barStyle = React.useMemo(
    () =>
      (statusbarState.tint === 'system' && theme.dark === true) || statusbarState.tint === 'light'
        ? 'light-content'
        : (statusbarState.tint === 'system' && theme.dark === false) ||
          statusbarState.tint === 'dark'
        ? 'dark-content'
        : undefined,
    [statusbarState.tint, theme.dark],
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
    <StatusBar animated translucent={true} barStyle={barStyle} backgroundColor={backgroundColor} />
  );
}
