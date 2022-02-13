import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { SafeAreaInsets, wp } from '../../utils/imageRatio';
import { Theme } from '../../theme/default';
import color from 'color';
import NFTRenderer from './AppNFTRenderer';
import AppFeedHeader from './feed/AppFeedHeader';
import AppFeedAction from './feed/AppFeedAction';
import AppFeedFooter from './feed/AppFeedFooter';

export default function AppFeedItem() {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = makeStyle(insets, theme);

  return (
    <View style={styles.card}>
      <AppFeedHeader />
      <NFTRenderer />
      <AppFeedAction />
      <AppFeedFooter />
    </View>
  );
}

const makeStyle = (insets: SafeAreaInsets, theme: Theme) =>
  StyleSheet.create({
    card: {
      margin: wp('5%', insets),
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: color(theme.colors.text).alpha(0.05).rgb().toString(),
    },
  });
