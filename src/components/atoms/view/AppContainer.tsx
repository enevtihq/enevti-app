import { StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../../theme/default';
import { useTheme } from 'react-native-paper/src/core/theming';
import AppStatusBar from './AppStatusBar';

interface AppContainerProps {
  children: React.ReactNode;
}

export default function AppContainer({ children }: AppContainerProps) {
  const theme = useTheme() as Theme;
  const styles = makeStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <AppStatusBar />
      {children}
    </SafeAreaView>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });