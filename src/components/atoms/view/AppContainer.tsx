import { StyleSheet, View } from 'react-native';
import React from 'react';
import {
  Edge,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Theme } from '../../../theme/default';
import { useTheme } from 'react-native-paper';
import AppStatusBar from './AppStatusBar';
import Color from 'color';
import { hp } from '../../../utils/imageRatio';
import { HEADER_HEIGHT_PERCENTAGE } from './AppHeader';

interface AppContainerProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  headerHeight?: number;
  darken?: boolean;
  edges?: Edge[];
}

export default function AppContainer({
  children,
  header,
  headerHeight,
  darken = false,
  edges,
}: AppContainerProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => makeStyles(theme, darken),
    [theme, darken],
  );

  return (
    <SafeAreaView style={styles.container} edges={edges}>
      <AppStatusBar />
      {header ? header : null}
      {header ? (
        <View
          style={{
            marginTop: hp(
              headerHeight ? headerHeight : HEADER_HEIGHT_PERCENTAGE,
              insets,
            ),
          }}
        />
      ) : null}
      {children}
    </SafeAreaView>
  );
}

const makeStyles = (theme: Theme, darken: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darken
        ? Color(theme.colors.background)
            .darken(theme.dark ? 0.1 : 0.02)
            .rgb()
            .toString()
        : theme.colors.background,
    },
  });
