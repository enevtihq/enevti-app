import { StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../../theme/default';
import { useTheme } from 'react-native-paper/src/core/theming';
import AppStatusBar from './AppStatusBar';
import color from 'color';

interface AppContainerProps {
  children: React.ReactNode;
  darken?: boolean;
}

export default function AppContainer({
  children,
  darken = false,
}: AppContainerProps) {
  const theme = useTheme() as Theme;
  const styles = makeStyles(theme, darken);

  return (
    <SafeAreaView style={styles.container}>
      <AppStatusBar />
      {children}
    </SafeAreaView>
  );
}

const makeStyles = (theme: Theme, darken: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darken
        ? color(theme.colors.background)
            .darken(theme.dark ? 0.1 : 0.02)
            .rgb()
            .toString()
        : theme.colors.background,
    },
  });
