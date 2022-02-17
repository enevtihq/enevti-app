import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../../theme/default';
import { SafeAreaInsets, wp } from '../../../utils/imageRatio';
import AppBrandBanner from '../../molecules/AppBrandBanner';

export default function AppHeader({
  style,
  height,
  children,
  title,
  subtitle,
}: any) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, height, insets);

  return (
    <Animated.View style={style}>
      <Appbar.Header style={styles.header}>
        {title ? (
          <Appbar.Content
            title={title}
            subtitle={subtitle}
            titleStyle={styles.title}
            subtitleStyle={styles.subtitle}
          />
        ) : (
          <AppBrandBanner widthPercentage={0.35} style={styles.image} />
        )}
        <View style={styles.divider} />
        {children}
      </Appbar.Header>
    </Animated.View>
  );
}

const makeStyle = (theme: Theme, height: number, insets: SafeAreaInsets) =>
  StyleSheet.create({
    divider: {
      flex: 1,
    },
    header: {
      position: 'absolute',
      backgroundColor: theme.colors.background,
      width: '100%',
      marginTop: insets.top,
      height: height,
    },
    image: {
      marginLeft: 8,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: theme.fonts.medium.fontWeight,
      fontSize: wp('5.2%', insets),
    },
    subtitle: {
      color: theme.colors.placeholder,
      fontFamily: theme.fonts.light.fontFamily,
      fontWeight: theme.fonts.light.fontWeight,
      fontSize: wp('4.0%', insets),
    },
  });
