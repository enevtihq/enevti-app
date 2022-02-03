import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../../theme/default';
import { SafeAreaInsets } from '../../../utils/imageRatio';
import AppBrandBanner from '../../molecules/AppBrandBanner';

export default function AppHeader({ style }: any) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

  return (
    <Animated.View style={style}>
      <Appbar.Header style={styles.header}>
        <AppBrandBanner widthPercentage={0.4} style={styles.image} />
        <View style={styles.divider} />
        <Appbar.Action icon="magnify" onPress={() => console.log('anjay')} />
        <Appbar.Action
          icon="dots-vertical"
          onPress={() => console.log('anjay')}
        />
      </Appbar.Header>
    </Animated.View>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    divider: {
      flex: 1,
    },
    header: {
      position: 'absolute',
      backgroundColor: theme.colors.background,
      width: '100%',
      marginTop: insets.top,
      paddingVertical: 36,
      height: 80,
    },
    image: {
      marginLeft: 8,
    },
  });
