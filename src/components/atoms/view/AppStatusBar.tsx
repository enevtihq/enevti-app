import { Dimensions, Platform, StatusBar } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Theme } from 'enevti-app/theme/default';
import { selectStatusBarState } from 'enevti-app/store/slices/ui/global/statusbar';
import lightTheme from 'enevti-app/theme/default';
import darkTheme from 'enevti-app/theme/dark';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export const STATUS_BAR_HEIGHT = () => (getStatusBarHeight() / Dimensions.get('screen').height) * 100;

export default function AppStatusBar() {
  const theme = useTheme() as Theme;
  const statusbarState = useSelector(selectStatusBarState);
  const barStyle = React.useMemo(
    () =>
      (statusbarState.tint === 'system' && theme.dark === true) || statusbarState.tint === 'light'
        ? 'light-content'
        : (statusbarState.tint === 'system' && theme.dark === false) || statusbarState.tint === 'dark'
        ? 'dark-content'
        : undefined,
    [statusbarState.tint, theme.dark],
  );

  const isAndroidLolipopLight = React.useMemo(
    () => Platform.OS === 'android' && Platform.constants.Version < 23 && !theme.dark,
    [theme.dark],
  );
  const themeBackgroundColor = React.useMemo(
    () => (isAndroidLolipopLight ? 'black' : theme.colors.background),
    [isAndroidLolipopLight, theme.colors.background],
  );
  const lightBackgroundColor = React.useMemo(
    () => (isAndroidLolipopLight ? 'black' : lightTheme.colors.background),
    [isAndroidLolipopLight],
  );
  const darkBackgroundColor = React.useMemo(() => darkTheme.colors.background, []);
  const backgroundColor = React.useMemo(
    () =>
      statusbarState.background === 'system'
        ? themeBackgroundColor
        : statusbarState.background === 'dark'
        ? darkBackgroundColor
        : statusbarState.background === 'light'
        ? lightBackgroundColor
        : statusbarState.background === 'transparent'
        ? 'transparent'
        : undefined,
    [darkBackgroundColor, lightBackgroundColor, statusbarState.background, themeBackgroundColor],
  );

  return <StatusBar animated translucent={true} barStyle={barStyle} backgroundColor={backgroundColor} />;
}
