import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Edge, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from 'enevti-app/theme/default';
import { useTheme } from 'react-native-paper';
import AppStatusBar from './AppStatusBar';
import Color from 'color';
import { hp } from 'enevti-app/utils/imageRatio';
import { HEADER_HEIGHT_PERCENTAGE } from './AppHeader';
import { BackgroundColorContext, EdgeContext } from 'enevti-app/context';

interface AppContainerProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  headerOffset?: number;
  darken?: boolean;
  edges?: Edge[];
}

export default function AppContainer({
  children,
  header,
  headerOffset,
  darken = false,
  edges,
}: AppContainerProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const backgroundColor = darken
    ? Color(theme.colors.background)
        .darken(theme.dark ? 0.1 : 0.02)
        .rgb()
        .toString()
    : theme.colors.background;
  const styles = React.useMemo(() => makeStyles(theme, backgroundColor), [theme, backgroundColor]);

  return (
    <EdgeContext.Provider value={edges}>
      <BackgroundColorContext.Provider value={backgroundColor}>
        <SafeAreaView style={styles.container} edges={edges}>
          <AppStatusBar />
          {header ? header : null}
          {header ? (
            <View
              style={{
                marginTop:
                  typeof headerOffset === 'number'
                    ? headerOffset
                    : hp(HEADER_HEIGHT_PERCENTAGE, insets) + insets.top,
              }}
            />
          ) : null}
          {children}
        </SafeAreaView>
      </BackgroundColorContext.Provider>
    </EdgeContext.Provider>
  );
}

const makeStyles = (theme: Theme, backgroundColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
  });
